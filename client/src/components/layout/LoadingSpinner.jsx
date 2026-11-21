export default function LoadingSpinner({ text = 'Memuat...' }) {
  return (
    <div className="py-16 text-center">
      <p className="muted">{text}</p>
    </div>
  );
}