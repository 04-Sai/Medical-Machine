export default function StatusPill({ status = 'NORMAL' }) {
  const normalized = (status || 'NORMAL').toLowerCase();
  return (
    <span className={`pill ${normalized}`}>
      <i />
      {status}
    </span>
  );
}
