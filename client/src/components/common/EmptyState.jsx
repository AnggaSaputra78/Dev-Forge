import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'Tidak ada data', 
  description = '' 
}) {
  return (
    <div className="card text-center py-10">
      <Icon className="w-12 h-12 muted mx-auto mb-4" />
      <p className="font-semibold">{title}</p>
      {description && <p className="muted text-smx mt-2">{description}</p>}
    </div>
  );
}
