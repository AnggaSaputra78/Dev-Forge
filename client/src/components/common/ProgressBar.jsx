export default function ProgressBar({ value = 0 }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div className="bar">
      <i style={{ width: `${width}%` }} />
    </div>
  );
}
