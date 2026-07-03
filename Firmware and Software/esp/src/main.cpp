#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>

const String product_code = "FL0002";
const String ssidStr = "SENSE_FLOW-" + product_code; // Name of the Network created by this flowmeter

const char* ap_ssid = ssidStr.c_str(); 
const char* ap_pass = "12345678"; // Should be unique for the flowmeter. User can see this via the app.

String ssid = "";
String pass = "";

float upper_limit = -1;
float lower_limit = -1;

const char* backend_api = "http://192.168.8.146:3000/data";  
const char* backend = "192.168.8.146";  

Preferences preferences;

WebServer server(80);
WebSocketsClient webSocket;

String htmlForm = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Configure Network</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }

      .container {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 100%;
        max-width: 400px;
      }

      h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
      }

      label {
        display: block;
        margin-bottom: 5px;
        color: #555;
      }

      input[type="text"],
      input[type="password"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
      }

      input[type="submit"] {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 6px;
        width: 100%;
        font-size: 16px;
        cursor: pointer;
      }

      input[type="submit"]:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Configure Network</h2>
      <form action="/submit" method="POST" onsubmit="return validateForm()">
        <label for="ssid">SSID</label>
        <input type="text" name="ssid" id="ssid" />

        <label for="password">Password</label>
        <input type="password" name="password" id="password" />

        <input type="submit" value="Save and Connect" />
      </form>
    </div>

    <script>
      // Validation now only for SSID and Password if needed
      function validateForm() {
        // Example: ensure SSID is not empty
        const ssid = document.getElementById("ssid").value.trim();
        if (ssid.length === 0) {
          alert("SSID cannot be empty.");
          return false;
        }
        // Password can be optional or add validation if needed

        return true;
      }
    </script>
  </body>
</html>
)rawliteral";

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Socket Disconnected");
      break;

    case WStype_CONNECTED: {
      String jsonString =
        "{\"type\":\"esp_client\","
        "\"product_code_initial\":\"" + product_code + "\","
        "\"ssid\":\"" + ssid + "\","
        "\"upper_limit\":" + String(upper_limit, 1) + ","
        "\"lower_limit\":" + String(lower_limit, 1) + "}";

      webSocket.sendTXT(jsonString);
      Serial.println("Sent product_code to server: " + jsonString);
      break;
    }

    case WStype_TEXT: {
      // Make sure payload is null-terminated before parsing
      char json[length + 1];
      memcpy(json, payload, length);
      json[length] = '\0';

      Serial.printf("Received: %s\n", json);

      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, json);
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        break;
      }

      preferences.begin("flowmeter", false);

      bool restart = false; 
      if (doc.containsKey("ssid")) {
        restart = true;
        preferences.putString("ssid", doc["ssid"].as<const char*>());
      }
      if (doc.containsKey("pass")) {
        restart = true;
        preferences.putString("pass", doc["pass"].as<const char*>());
      }
      if (doc.containsKey("upper_limit")) {
        upper_limit = doc["upper_limit"].as<float>();
        preferences.putFloat("upper_limit", doc["upper_limit"].as<float>());
      }
      if (doc.containsKey("lower_limit")) {
        lower_limit = doc["lower_limit"].as<float>();
        preferences.putFloat("lower_limit", doc["lower_limit"].as<float>());
      }
      preferences.end();

      if(restart == true) {
        delay(1000);
        ESP.restart();
      }
      break;
    }
    default:
      break;
  }
}


void setup() {
  Serial.begin(115200);
  preferences.begin("flowmeter", false);

  ssid = preferences.getString("ssid", ""); // Take ssid from flash. Default ""
  pass = preferences.getString("pass", ""); // Take pass from flash. Default ""
  upper_limit = preferences.getFloat("upper_limit", -1); 
  lower_limit = preferences.getFloat("lower_limit", -1); 
  preferences.end();

  Serial.println("Loading from flash...");
  Serial.println(ssid);
  Serial.println(pass);
  Serial.println(upper_limit);
  Serial.println(lower_limit);

  WiFi.mode(WIFI_AP_STA);  
  WiFi.softAP(ap_ssid, ap_pass);
  Serial.println(WiFi.softAPIP());

  if (ssid != "") {
    WiFi.begin(ssid, pass);
    Serial.print("Connecting to Wi-Fi...");
  }

  server.begin();

  // On requesting edit form
  server.on("/", HTTP_GET, []() {
    // Give them the html form
    server.send(200, "text/html", htmlForm);
  });

  // On performing submit
  server.on("/submit", HTTP_POST, []() {

    Serial.println("Saving Credentials");
    Serial.println(server.arg("ssid"));
    Serial.println(server.arg("password"));

    preferences.begin("flowmeter", false);
    preferences.putString("ssid", server.arg("ssid"));
    preferences.putString("pass", server.arg("password"));
    preferences.end();

    server.send(200, "text/html", R"rawliteral(
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Restarting</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .message-box {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        h3 {
          color: #28a745;
          margin-bottom: 10px;
        }

        p {
          color: #555;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="message-box">
        <h3>Credentials Saved</h3>
        <p>The device will restart now...</p>
      </div>
    </body>
    </html>
    )rawliteral");

    delay(1000);
    ESP.restart();  // Reboot with new credentials
  });

  webSocket.begin(backend, 8080, "/");
  webSocket.onEvent(webSocketEvent);
}

static unsigned long lastHeartbeat = 0;
static unsigned long lastWIFIReconnectAttempt = 0;
static unsigned long lastWSReconnectAttempt = 0;
static unsigned long lastSendTime = 0;

void loop() {
  server.handleClient();
  webSocket.loop();

  // Attempt every 10s
  if (WiFi.status() != WL_CONNECTED && millis() - lastWIFIReconnectAttempt > 10000) {
    lastWIFIReconnectAttempt = millis();
    Serial.println("Wi-Fi lost. Attempting to reconnect...");
    Serial.println(ssid);
    Serial.println(pass);
    if (ssid != "") {
      WiFi.begin(ssid, pass);
    }
  }

  if (WiFi.status() == WL_CONNECTED && !webSocket.isConnected() && millis() - lastWSReconnectAttempt > 10000) {
    lastWSReconnectAttempt = millis();
    Serial.println("Lost WebSocket connection with the server. Reconnecting...");
    webSocket.begin(backend, 8080, "/");
  }

  if (WiFi.status() == WL_CONNECTED && webSocket.isConnected() && millis() - lastSendTime > 1000) {
    StaticJsonDocument<200> doc;
    
    doc["product_code"] = product_code;
    doc["type"] = "esp_client";
    doc["flowrate"] = random(100);
    doc["temperature"] = random(100);
    doc["total_volume"] = random(100);
    doc["uptime"] = millis();
    // doc["ideal_flow"] = ((lower_limit == -1 || doc["flowrate"] >= lower_limit) && (upper_limit == -1 || doc["flowrate"] <= upper_limit));

    String jsonString;
    serializeJson(doc, jsonString);
    webSocket.sendTXT(jsonString);

    lastSendTime = millis();
  }
}
