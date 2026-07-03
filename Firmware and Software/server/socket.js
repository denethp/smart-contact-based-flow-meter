// socket.js
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Config from "dotenv";
import {
  getFlowMetersFromUserid,
  getFlowMeterFromProductCode,
  fetchUserid,
  updateLimits,
  getFlowmetersBySameUser,
  db,
  insertFlowData,
} from "./utils/database.js";

Config.config();

export const esp_clients = {};
const mobile_clients = {};
export const fms_users = {};

export const startWebSocketServer = () => {
  const socket_port = 8080;
  const wss = new WebSocketServer({ port: socket_port });

  wss.on("connection", function connection(ws) {
    ws.isAlive = true;

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", function incoming(message) {
      const data = JSON.parse(message.toString());
      if (data.type == "esp_client") {
        if (data.product_code_initial) {
          const fm_data = getFlowMeterFromProductCode.get(
            data.product_code_initial
          );

          if (!fm_data) {
            console.log("PRODUCT CANNOT BE FOUND: ", data.product_code_initial);
            return ws.close();
          }

          ws.product_code = data.product_code_initial;

          esp_clients[data.product_code_initial] = ws;
          updateLimits.run(
            data.upper_limit,
            data.lower_limit,
            data.product_code_initial
          );

          if (fm_data.user_id in mobile_clients) {
            fms_users[data.product_code_initial] =
              mobile_clients[fm_data.user_id];
          } else {
            fms_users[data.product_code_initial] = [];
          }
          const stmt = db.prepare(`
            UPDATE flowmeters
            SET upper_limit = ?, lower_limit = ?, ssid = ?
            WHERE product_code = ?
          `);

          stmt.run(
            data.upper_limit,
            data.lower_limit,
            data.ssid,
            data.product_code_initial
          );
          const rows = getFlowmetersBySameUser.all(ws.product_code);
          const productCodes = rows.map((row) => row.product_code);
          const activeCount = productCodes.filter((code) =>
            esp_clients.hasOwnProperty(code)
          ).length;

          for (const user of fms_users[ws.product_code]) {
            user.send(
              JSON.stringify({
                product_code: ws.product_code,
                active: true,
                active_count: activeCount,
              })
            );
          }
          console.log("ESP Client Connected:", data);
        } else {
          if (!esp_clients[data.product_code]) return;
          console.log(JSON.stringify(data));

          const timestamp = Date.now();
          insertFlowData.run(
            data.product_code,
            data.flowrate,
            data.temperature,
            timestamp,
            data.product_code
          );

          for (const user of fms_users[data.product_code]) {
            user.send(
              JSON.stringify({ ...data, active: true, timestamp: timestamp })
            );
            console.log("sending to mobile", user.user_id);
          }
        }
      } else if (data.type == "mobile_client") {
        if (data.token) {
          let user_data = {};
          try {
            const decodedToken = jwt.verify(
              data.token,
              process.env.JWT_SECRET_CODE
            );
            if (!decodedToken.user_id) return;
            user_data = fetchUserid.get(decodedToken.user_id);
          } catch (err) {
            return console.log(err.message);
          }

          const user_id = user_data.user_id;
          ws.user_id = user_id;

          if (!mobile_clients[user_id]) {
            mobile_clients[user_id] = [];
          }

          console.log("Mobile Client Connected!");
          mobile_clients[user_id].push(ws);

          const flowmeters = getFlowMetersFromUserid.all(user_id);
          for (let i = 0; i < flowmeters.length; i++) {
            if (flowmeters[i].product_code in esp_clients) {
              fms_users[flowmeters[i].product_code].push(ws);
            }
          }
        } else {
        }
      } else {
      }
    });

    ws.on("close", () => {
      if (ws.product_code) {
        delete esp_clients[ws.product_code];

        const rows = getFlowmetersBySameUser.all(ws.product_code);

        const productCodes = rows.map((row) => row.product_code);
        const activeCount = productCodes.filter((code) =>
          esp_clients.hasOwnProperty(code)
        ).length;

        for (const user of fms_users[ws.product_code]) {
          user.send(
            JSON.stringify({
              product_code: ws.product_code,
              active: false,
              active_count: activeCount,
            })
          );
        }

        delete fms_users[ws.product_code];

        console.log("ESP Client Disconnected:", ws.product_code);
      } else if (ws.user_id) {
        mobile_clients[ws.user_id] = mobile_clients[ws.user_id].filter(
          (client) => client !== ws
        );

        if (mobile_clients[ws.user_id].length === 0) {
          delete mobile_clients[ws.user_id];
        }
        for (const key in fms_users) {
          if (fms_users[key].includes(ws)) {
            fms_users[key] = fms_users[key].filter((client) => client !== ws);
          }
        }

        console.log("Mobile Client Disconnected:", ws.user_id);
      }
    });
  });

  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        console.log("Terminating dead client");
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 5000);
};
