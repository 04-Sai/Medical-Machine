export default function LineChart({ title, data = [], color = '#32b6ff', unit = '' }) {
  const values = data.map((x) => x.value);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  const range = max - min || 1;
  const length = values.length;

  const points = values
    .map((v, i) => {
      const x = length > 1 ? (i / (length - 1)) * 100 : 0;
      const y = 84 - ((v - min) / range) * 62;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const currentValue = values.length > 0 ? values[values.length - 1] : '--';

  return (
    <article className="chart-card">
      <div className="chart-title">
        <div>
          <span className="chart-dot" style={{ background: color }} />
          {title}
        </div>
        <strong>
          {currentValue}
          <small>{unit}</small>
        </strong>
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${title} history`}
      >
        <line x1="0" y1="22" x2="100" y2="22" />
        <line x1="0" y1="53" x2="100" y2="53" />
        <line x1="0" y1="84" x2="100" y2="84" />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="chart-times">
        <span>35s ago</span>
        <span>Now</span>
      </div>
    </article>
  );
}
