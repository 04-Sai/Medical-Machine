# Medical Machine Safety & Telemetry Monitor

A modular, real-time IoT control-room dashboard built with React and Vite, designed to monitor critical safety metrics, environmental conditions, and power systems for medical and diagnostic hardware. 

This application connects directly to **ThingSpeak Cloud (Channel 3541216)** to stream live sensor telemetry, automatic trend analysis, and immediate safety alerts.

---

## 🚀 Live Production URL
Access the live production dashboard hosted on GitHub Pages:
[https://04-Sai.github.io/Medical-Machine/](https://04-Sai.github.io/Medical-Machine/)

---

## 📊 Monitored Parameters & Metrics

The dashboard tracks 8 live telemetry fields uploaded by the ESP32 edge hardware:
1. **Temperature (°C)**: Chamber and ambient thermal monitoring (Safety Limit: >35 °C triggers warning).
2. **Humidity (%)**: Relative humidity tracking.
3. **Main AC Voltage (V)**: AC line input monitoring (Overvoltage Limit: >240 V triggers alert).
4. **Battery Voltage (V)**: Backup battery health indicator.
5. **Battery Percentage (%)**: State of charge (Low alert triggered below 20%).
6. **Liquid Level (%)**: Ultrasonic fluid/coolant level estimate.
7. **Relay Status**: Live equipment control state (`1 = ON`, `0 = OFF`).
8. **Machine Tamper**: Security enclosure interlock state (`1 = Tampered`, `1 = Normal`).

---

## 🛠️ Project Architecture & Tech Stack

* **Frontend Framework**: React + Vite (Modular component architecture).
* **Styling**: Tailwind-inspired modern utility classes and custom CSS.
* **Charts & Analytics**: **Chart.js** for real-time multi-axis trend tracking (Environmental trends, Power monitoring, and Battery degradation).
* **Cloud Backend & Data Source**: ThingSpeak REST API (`Channel ID: 3541216`) with automatic 20-second polling.
* **CI/CD & Hosting**: GitHub Pages automated via GitHub Actions workflows.

---

## 📂 Repository Structure

```text
Medical-Machine/
├── .github/
│   └── workflows/
│       └── deploy.yml   # Automated GitHub Pages CI/CD workflow
├── public/              # Static assets and favicons
├── src/
│   ├── components/      # Modular React UI components (Cards, Charts, Status grids)
│   ├── data/            # API polling and data parser services
│   ├── styles/          # Custom CSS theme files
│   ├── App.jsx          # Main React application layout
│   └── main.jsx         # React application entry point
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Locked dependency tree for GitHub Actions runner
└── vite.config.js       # Vite build configuration
