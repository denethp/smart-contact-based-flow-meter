# 💧 Smart Contact-Based Flow Meter

A smart IoT-enabled water flow meter designed to provide **real-time flow monitoring**, **historical analytics**, and **wireless connectivity** through a modern mobile application. The system offers an affordable and locally manufacturable solution for domestic, agricultural, and industrial water management.

<p align="center">
  <img src="images/final_product.jpg" width="700">
</p>

---

## 📖 Overview

Conventional water flow meters are often limited by poor accuracy, mechanical wear, and the absence of digital monitoring capabilities. This project addresses these limitations by integrating embedded electronics, wireless communication, and a mobile application into a compact smart flow meter.

The system measures water flow using a paddle wheel sensor, processes measurements on an ESP8266 microcontroller, and transmits real-time data to a mobile application via Wi-Fi. Users can monitor flow rate, temperature, total water usage, historical trends, and receive notifications for abnormal flow conditions.

---

## ✨ Features

- 💧 Real-time water flow measurement
- 🌡️ Water temperature monitoring
- 📱 Android & iOS mobile application
- 📊 Historical flow data visualization
- 🔔 Overflow and underflow notifications
- 📡 Wi-Fi connectivity
- 📈 Live dashboard with WebSocket communication
- 📟 OLED display for standalone operation
- 🔋 Rechargeable Li-ion battery powered
- 🧩 Custom PCB and 3D printed enclosure

---

## 🏗️ System Architecture

```text
                Water Flow
                     │
                     ▼
          Paddle Wheel Flow Sensor
                     │
                     ▼
                ESP8266 MCU
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   OLED Display          Wi-Fi Communication
                                │
                           WebSocket Server
                                │
                                ▼
                     React Native Mobile App
```

---

## 📱 Mobile Application

The Neural Nexus mobile application enables users to:

- Monitor live flow rate and temperature
- View total water consumption
- Analyze historical flow data
- Configure flow limits
- Receive abnormal flow alerts
- Manage multiple flow meters
- View device information
- Secure authentication using JWT

### Technologies

- React Native
- Node.js
- SQLite
- WebSockets
- HTTP REST API
- JWT Authentication

---

## 🔧 Hardware

| Component | Purpose |
|-----------|----------|
| ESP8266 | Main microcontroller |
| Paddle Wheel Flow Sensor | Flow rate measurement |
| OLED Display | Local display |
| TLV75733 Voltage Regulator | 3.3V power regulation |
| LiPo Battery (3.7V 1200mAh) | Portable power |
| TP4056 Type-C Charging Module | Battery charging |
| Custom PCB | Electronics integration |
| 3D Printed Enclosure | Mechanical housing |

---

## 💻 Software Stack

| Layer | Technologies |
|--------|--------------|
| Embedded Firmware | Arduino (C++) |
| Mobile App | React Native |
| Backend | Node.js |
| Database | SQLite |
| Communication | WebSockets, HTTP |
| Authentication | JWT |

---

## 📊 Product Highlights

- Accurate flow rate measurement
- Portable battery-powered operation
- Wireless real-time monitoring
- Affordable hardware using locally available components
- Easy installation
- Modular architecture
- Compact enclosure
- Custom PCB design

---

## 📷 Gallery

### Final Product

```
images/final_product.jpg
```

### Mobile Application

```
images/login.png
images/home.png
images/monitor.png
images/analyze.png
images/settings.png
```

### Enclosure

```
images/enclosure.png
```

### PCB

```
images/pcb.png
```

---

## 🚀 Getting Started

### Firmware

```bash
git clone https://github.com/yourusername/smart-flow-meter.git
```

Open the firmware project using the Arduino IDE.

Install the required libraries and upload the firmware to the ESP8266.

---

### Mobile App

```bash
cd mobile
npm install
npm start
```

---

## 📂 Repository Structure

```text
.
├── firmware/
│   ├── src/
│   └── include/
│
├── mobile/
│   ├── src/
│   ├── assets/
│   └── package.json
│
├── hardware/
│   ├── PCB/
│   ├── Schematics/
│   └── Enclosure/
│
├── images/
│
├── docs/
│
└── README.md
```

---

## 🎯 Applications

- Smart Homes
- Agriculture & Irrigation
- Industrial Water Monitoring
- Municipal Water Supply
- Water Conservation Systems

---

## 📈 Future Improvements

- Cloud dashboard
- OTA firmware updates
- Leak detection using AI
- Water consumption prediction
- Multi-device synchronization
- Energy optimization
- MQTT support
- Web dashboard

---

## 👥 Team

**Team Neural Nexus**

| Team Member | Responsibility |
|-------------|----------------|
| Deneth Priyadarshana | Mobile App Development (Android & iOS) |
| Lasan Perera | Circuit Design, Testing & Electronic Optimization |
| Isitha Dinujaya | Enclosure Design & Algorithm Development |
| Dulana Pitiwaduge | PCB Design & Market Analysis |

---

## 🎓 Academic Project

**Course:** EN1190 – Engineering Design Project

**Department:** Electronic & Telecommunication Engineering

**Faculty:** Engineering

**University:** University of Moratuwa

---

## 📄 License

This repository is intended for academic and educational purposes.
