import { scenarios } from '../services/simulationService';

export default function SimulationControls({ onSelect, active }) {
  return (
    <section className="panel simulation">
      <div className="section-title">
        <div>
          <span className="eyebrow">DEMONSTRATION TOOLS</span>
          <h2>Simulation Mode</h2>
        </div>
        <span className="sim-live">● SIMULATION ACTIVE</span>
      </div>
      <p>Inject a realistic scenario to test safety responses and alert handling.</p>
      <div className="sim-buttons">
        {Object.entries(scenarios).map(([key, item]) => (
          <button
            type="button"
            className={active === key ? 'active' : ''}
            key={key}
            onClick={() => onSelect(key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
