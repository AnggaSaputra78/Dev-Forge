export default function LoadingSpinner({ text = 'Memuat...' }) {
  return (
    <div className="py-16 text-center">
      <div className="inline-block w-8 h-8 rounded-lg grid place-items-center text-white mb-4 animate-pulse" style={{ background: '#6875e8' }}>
        ⌘
      </div>
      <p className="muted">{text}</p>
    </div>
  );
}
