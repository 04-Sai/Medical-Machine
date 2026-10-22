# Medical Diagnostic Machine — Safety Monitor Dashboard

A real-time safety telemetry and monitoring web dashboard for medical diagnostic machines (e.g. Blood Analyzers).

## Features
- **Live Sensor Telemetry**: Voltage, temperature, humidity, rinse liquid levels, and enclosure tamper detection.
- **Dynamic Trend Charts**: Live SVG telemetry charts tracking key safety metrics over time.
- **Safety Interlock & Power Relay Status**: Visual indicator for emergency shut-down and relay states.
- **Alarm & Event Log**: Real-time log of security, warning, and informational system events.
- **Interactive Simulation Mode**: Test safety handling with simulated over-voltage, overheating, tampering, sensor failure, and disconnect scenarios.
- **System Integrity & Asset Details**: MCU, sensor health, connectivity status, and parameter thresholds.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

### Installation
```bash
npm install
```

### Running Locally (Development)
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Open your browser and navigate to `http://localhost:4173`.

## Deployment
This project is configured with a GitHub Actions workflow in `.github/workflows/deploy-pages.yml` to automatically build and deploy the dashboard to GitHub Pages whenever changes are pushed to the `main` branch.