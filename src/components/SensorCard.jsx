import StatusPill from './StatusPill';

export default function SensorCard({
  icon,
  label,
  value,
  unit = '',
  status = 'NORMAL',
  muted = false,
}) {
  const normalizedStatus = (status || 'NORMAL').toLowerCase();

  return (
    <article className={`sensor-card ${normalizedStatus}`}>
      <div className="sensor-top">
        <span className="sensor-icon">{icon}</span>
        <StatusPill status={status} />
      </div>
      <p>{label}</p>
      <strong className={muted ? 'muted-value' : ''}>
        {value}
        {unit ? <small>{unit}</small> : null}
      </strong>
    </article>
  );
}
