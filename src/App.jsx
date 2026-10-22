import { useEffect, useMemo, useState } from 'react';
import { machineInfo, thresholds, initialTelemetry } from './data/dummyData';
import { getStatus, getTime, scenarios, tickTelemetry } from './services/simulationService';
import StatusPill from './components/StatusPill';
import SensorCard from './components/SensorCard';
import LineChart from './components/LineChart';
import SimulationControls from './components/SimulationControls';

const makeHistory = (value, variation, digits = 0) =>
  Array.from({ length: 13 }, (_, i) => ({
    value: Number((value + (Math.random() - 0.5) * variation + (i - 12) * 0.05).toFixed(digits)),
  }));

const initialEvents = [
  { time: getTime(), severity: 'INFO', message: 'System check completed' },
  { time: '08:41:52', severity: 'WARNING', message: 'Temperature increased above warning threshold' },
  { time: '08:39:31', severity: 'INFO', message: 'Rinse liquid level normal' },
  { time: '08:35:04', severity: 'INFO', message: 'Machine enclosure secured' },
];

export default function App() {
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [updated, setUpdated] = useState(getTime());
  const [active, setActive] = useState('normal');
  const [events, setEvents] = useState(initialEvents);
  const [history, setHistory] = useState({
    voltage: makeHistory(230, 5, 1),
    temperature: makeHistory(32, 2, 1),
    humidity: makeHistory(47, 8),
  });

  const status = getStatus(telemetry);
  const shutDown = status === 'CRITICAL';

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((old) => {
        const next = tickTelemetry(old);
        setHistory((h) => ({
          voltage: [...h.voltage.slice(1), { value: next.voltage }],
          temperature: [...h.temperature.slice(1), { value: next.temperature }],
          humidity: [...h.humidity.slice(1), { value: next.humidity }],
        }));
        return next;
      });
      setUpdated(getTime());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  function selectScenario(key) {
    const scenario = scenarios[key];
    if (!scenario) return;
    setActive(key);
    setTelemetry({ ...scenario.data });
    setHistory((h) => ({
      voltage: [...h.voltage.slice(1), { value: scenario.data.voltage }],
      temperature: [...h.temperature.slice(1), { value: scenario.data.temperature }],
      humidity: [...h.humidity.slice(1), { value: scenario.data.humidity }],
    }));
    setUpdated(getTime());
    setEvents((old) => [
      { time: getTime(), severity: scenario.event[0], message: scenario.event[1] },
      ...old,
    ].slice(0, 7));
  }

  const sensorStatus = (kind) => {
    if (!telemetry.online || telemetry.sensorFailure) return 'OFFLINE';
    if (kind === 'voltage') {
      return telemetry.voltage < 210 || telemetry.voltage > 250
        ? 'CRITICAL'
        : telemetry.voltage < 220 || telemetry.voltage > 240
        ? 'WARNING'
        : 'NORMAL';
    }
    if (kind === 'temperature') {
      return telemetry.temperature > 50
        ? 'CRITICAL'
        : telemetry.temperature > 40
        ? 'WARNING'
        : 'NORMAL';
    }
    if (kind === 'humidity') {
      return telemetry.humidity > 80
        ? 'CRITICAL'
        : telemetry.humidity > 70
        ? 'WARNING'
        : 'NORMAL';
    }
    if (kind === 'rinse') {
      return telemetry.rinse < 15
        ? 'CRITICAL'
        : telemetry.rinse < 30
        ? 'WARNING'
        : 'NORMAL';
    }
    if (kind === 'tamper') {
      return telemetry.tamper === 'TAMPERED' ? 'CRITICAL' : 'NORMAL';
    }
    return 'NORMAL';
  };

  const health = useMemo(
    () => [
      ['MCU', telemetry.online ? 'ONLINE' : 'OFFLINE'],
      ['Voltage Sensor', telemetry.sensorFailure ? 'FAULT' : 'NORMAL'],
      ['Temperature Sensor', telemetry.sensorFailure ? 'FAULT' : 'NORMAL'],
      ['Humidity Sensor', 'NORMAL'],
      ['Liquid Sensor', 'NORMAL'],
      ['Tamper Sensor', 'NORMAL'],
      ['Internet', telemetry.online ? 'CONNECTED' : 'DISCONNECTED'],
      ['MQTT / Communication', telemetry.online ? 'CONNECTED' : 'DISCONNECTED'],
    ],
    [telemetry]
  );

  return (
    <main>
      <header>
        <div className="brand">
          <div className="brand-mark">✚</div>
          <div>
            <span className="eyebrow">REAL-TIME SAFETY TELEMETRY</span>
            <h1>
              Medical Diagnostic Machine <em>Safety Monitor</em>
            </h1>
          </div>
        </div>
        <div className="header-meta">
          <div>
            <span>DEVICE ID</span>
            <b>MDX-001</b>
          </div>
          <div>
            <span>MACHINE</span>
            <b>Blood Analyzer</b>
          </div>
          <div>
            <span>LAST UPDATED</span>
            <b>{updated}</b>
          </div>
          <div className="online">
            <i />
            {telemetry.online ? 'ONLINE' : 'OFFLINE'}
          </div>
        </div>
      </header>

      <section className={`system-banner ${status.toLowerCase()}`}>
        <div className="status-orb">
          {status === 'NORMAL' ? '✓' : status === 'WARNING' ? '!' : '×'}
        </div>
        <div>
          <span className="eyebrow">SYSTEM STATUS</span>
          <h2>{status}</h2>
          <p>
            {status === 'NORMAL'
              ? 'All monitored parameters are within safe limits.'
              : status === 'OFFLINE'
              ? 'Telemetry is unavailable. Check device and network connection.'
              : 'Safety condition detected. Review active alerts and machine power state.'}
          </p>
        </div>
        <StatusPill status={status} />
      </section>

      <section className="content-grid">
        <div className="main-column">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LIVE MEASUREMENTS</span>
              <h2>Sensor Monitoring</h2>
            </div>
            <span className="live-text">● LIVE DATA</span>
          </div>

          <div className="sensor-grid">
            <SensorCard
              icon="ϟ"
              label="Voltage"
              value={telemetry.voltage}
              unit=" V"
              status={sensorStatus('voltage')}
              muted={!telemetry.online}
            />
            <SensorCard
              icon="♨"
              label="Temperature"
              value={telemetry.temperature}
              unit=" °C"
              status={sensorStatus('temperature')}
              muted={!telemetry.online}
            />
            <SensorCard
              icon="◒"
              label="Humidity"
              value={telemetry.humidity}
              unit=" %"
              status={sensorStatus('humidity')}
              muted={!telemetry.online}
            />
            <SensorCard
              icon="◔"
              label="Rinse Liquid"
              value={telemetry.rinse}
              unit=" %"
              status={sensorStatus('rinse')}
              muted={!telemetry.online}
            />
            <SensorCard
              icon="◕"
              label="Other Liquid"
              value={telemetry.liquid}
              unit=" %"
              status={!telemetry.online ? 'OFFLINE' : 'NORMAL'}
              muted={!telemetry.online}
            />
            <SensorCard
              icon="⌁"
              label="Tamper Detection"
              value={telemetry.tamper}
              unit=""
              status={sensorStatus('tamper')}
              muted={!telemetry.online}
            />
          </div>

          <div className="section-heading charts-heading">
            <div>
              <span className="eyebrow">TELEMETRY TRENDS</span>
              <h2>Live Sensor Charts</h2>
            </div>
            <span className="chart-range">Last 35 seconds</span>
          </div>

          <div className="charts">
            <LineChart
              title="Voltage History"
              data={history.voltage}
              color="#32b6ff"
              unit=" V"
            />
            <LineChart
              title="Temperature History"
              data={history.temperature}
              color="#ffb749"
              unit=" °C"
            />
            <LineChart
              title="Humidity History"
              data={history.humidity}
              color="#a88cff"
              unit=" %"
            />
          </div>

          <SimulationControls onSelect={selectScenario} active={active} />
        </div>

        <aside>
          <section className={`panel power ${shutDown ? 'shutdown' : ''}`}>
            <span className="eyebrow">MACHINE POWER</span>
            <div className="power-hero">
              <div className="power-icon">⏻</div>
              <div>
                <h2>{shutDown ? 'OFF' : 'ON'}</h2>
                <p>{shutDown ? 'Safety shutdown active' : 'Operating normally'}</p>
              </div>
            </div>
            <div className="power-row">
              <span>Relay</span>
              <StatusPill status={shutDown ? 'OFFLINE' : 'NORMAL'} />
            </div>
            <div className="power-row">
              <span>Emergency Cut-Off</span>
              <b className={shutDown ? 'critical-text' : 'normal-text'}>
                {shutDown ? 'TRIGGERED' : 'ARMED'}
              </b>
            </div>
          </section>

          <section className="panel events">
            <div className="section-title">
              <div>
                <span className="eyebrow">ALARM & EVENT LOG</span>
                <h2>Recent Activity</h2>
              </div>
              <span className="event-count">{events.length} events</span>
            </div>
            {events.map((event, i) => (
              <div className="event" key={`${event.time}-${i}`}>
                <time>{event.time}</time>
                <div>
                  <StatusPill
                    status={event.severity === 'INFO' ? 'NORMAL' : event.severity}
                  />
                  <p>{event.message}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="panel health">
            <span className="eyebrow">SYSTEM INTEGRITY</span>
            <h2>Device Health</h2>
            {health.map(([label, value]) => (
              <div className="health-row" key={label}>
                <span>{label}</span>
                <b
                  className={
                    ['FAULT', 'OFFLINE', 'DISCONNECTED'].includes(value)
                      ? 'critical-text'
                      : 'normal-text'
                  }
                >
                  <i />
                  {value}
                </b>
              </div>
            ))}
          </section>
        </aside>
      </section>

      <section className="bottom-grid">
        <section className="panel threshold">
          <span className="eyebrow">CONFIGURATION</span>
          <h2>Demonstration Thresholds</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Normal</th>
                  <th>Warning</th>
                  <th>Critical</th>
                </tr>
              </thead>
              <tbody>
                {thresholds.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="notice">
            Actual operating limits must be configured according to the diagnostic
            machine manufacturer's specifications and appropriate safety validation.
          </p>
        </section>

        <section className="panel info">
          <span className="eyebrow">ASSET DETAILS</span>
          <h2>Machine Information</h2>
          {machineInfo.map(([label, value]) => (
            <div className="info-row" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </section>
      </section>

      <footer>
        SAFETYKIT <b>v1.0</b> · Demonstration interface · Simulated telemetry stream
      </footer>
    </main>
  );
}
