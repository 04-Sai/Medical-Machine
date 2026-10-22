export const machineInfo = [
  ['Machine ID', 'MDX-001'],
  ['Machine Type', 'Blood Diagnostic Analyzer'],
  ['Monitoring Kit', 'SafetyKit v1.0'],
  ['Location', 'Laboratory A'],
  ['Uptime', '12h 34m'],
  ['Firmware', 'v0.1.0'],
];

export const thresholds = [
  ['Voltage', '220–240 V', '210–220 / 240–250 V', '<210 / >250 V'],
  ['Temperature', '<40°C', '40–50°C', '>50°C'],
  ['Humidity', '<70%', '70–80%', '>80%'],
  ['Rinse Level', '>30%', '15–30%', '<15%'],
];

export const initialTelemetry = {
  voltage: 230.4,
  temperature: 32.6,
  humidity: 47,
  rinse: 78,
  liquid: 64,
  tamper: 'SECURE',
  online: true,
  sensorFailure: false,
};
