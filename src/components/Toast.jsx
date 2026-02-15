import { useToastStore } from '../stores/useToastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-emerald-950/90 border-emerald-500/30',
    error: 'bg-red-950/90 border-red-500/30',
    info: 'bg-blue-950/90 border-blue-500/30',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-in flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-xl ${bgColors[toast.type] || bgColors.info}`}
        >
          {icons[toast.type] || icons.info}
          <span className="text-sm text-white">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
