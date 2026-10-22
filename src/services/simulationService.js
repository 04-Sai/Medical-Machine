import { initialTelemetry } from '../data/dummyData';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const rounded = (value, digits = 0) => Number(value.toFixed(digits));

export const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export function getStatus(data) {
  if (!data.online || data.sensorFailure) return 'OFFLINE';
  const critical =
    data.voltage < 210 ||
    data.voltage > 250 ||
    data.temperature > 50 ||
    data.humidity > 80 ||
    data.rinse < 15 ||
    data.tamper === 'TAMPERED';
  const warning =
    data.voltage < 220 ||
    data.voltage > 240 ||
    data.temperature > 40 ||
    data.humidity > 70 ||
    data.rinse < 30;
  return critical ? 'CRITICAL' : warning ? 'WARNING' : 'NORMAL';
}

export function tickTelemetry(current) {
  if (!current.online || current.sensorFailure || getStatus(current) !== 'NORMAL') {
    return current;
  }
  return {
    ...current,
    voltage: rounded(clamp(current.voltage + (Math.random() - 0.5) * 1.2, 226, 234), 1),
    temperature: rounded(clamp(current.temperature + (Math.random() - 0.5) * 0.5, 30, 35), 1),
    humidity: rounded(clamp(current.humidity + (Math.random() - 0.5) * 2, 43, 52)),
    rinse: rounded(clamp(current.rinse - Math.random() * 0.2, 55, 80)),
    liquid: rounded(clamp(current.liquid - Math.random() * 0.15, 45, 70)),
  };
}

export const scenarios = {
  normal: {
    label: 'Normal operation',
    data: initialTelemetry,
    event: ['INFO', 'Normal operating profile restored'],
  },
  highVoltage: {
    label: 'High voltage',
    data: { ...initialTelemetry, voltage: 258 },
    event: ['CRITICAL', 'Critical over-voltage detected — emergency shutdown triggered'],
  },
  lowVoltage: {
    label: 'Low voltage',
    data: { ...initialTelemetry, voltage: 205 },
    event: ['CRITICAL', 'Critical under-voltage detected — emergency shutdown triggered'],
  },
  overheating: {
    label: 'Overheating',
    data: { ...initialTelemetry, temperature: 53.4 },
    event: ['CRITICAL', 'Machine temperature exceeded critical safety limit'],
  },
  humidity: {
    label: 'High humidity',
    data: { ...initialTelemetry, humidity: 84 },
    event: ['CRITICAL', 'High humidity detected in machine enclosure'],
  },
  rinse: {
    label: 'Low rinse level',
    data: { ...initialTelemetry, rinse: 11 },
    event: ['CRITICAL', 'Rinse liquid level critically low'],
  },
  tamper: {
    label: 'Tampering',
    data: { ...initialTelemetry, tamper: 'TAMPERED' },
    event: ['CRITICAL', 'Enclosure tamper event detected'],
  },
  fault: {
    label: 'Critical fault',
    data: { ...initialTelemetry, voltage: 257, temperature: 54, rinse: 9 },
    event: ['CRITICAL', 'Multiple critical safety faults — shutdown initiated'],
  },
  sensor: {
    label: 'Sensor failure',
    data: { ...initialTelemetry, sensorFailure: true },
    event: ['WARNING', 'Sensor heartbeat lost — inspection required'],
  },
  offline: {
    label: 'Device offline',
    data: { ...initialTelemetry, online: false },
    event: ['CRITICAL', 'Device connectivity lost'],
  },
};
