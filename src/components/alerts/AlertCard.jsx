import { Clock, MapPin, Trash2 } from 'lucide-react';

const AlertCard = ({ alert, isAdmin, onDelete }) => {
  const { id, title, description, severity, barangay, created_at } = alert;

  const severityConfig = {
    high:   { bar: 'bg-red-500',   bg: 'bg-red-100',   dot: 'bg-red-500',   text: 'text-red-600',   border: 'border-red-200' },
    medium: { bar: 'bg-amber-500', bg: 'bg-amber-100', dot: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
    low:    { bar: 'bg-blue-500',  bg: 'bg-blue-100',  dot: 'bg-blue-500',  text: 'text-blue-600',  border: 'border-blue-200' },
  };

  const cfg = severityConfig[severity?.toLowerCase()] || severityConfig.low;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative group">
      <div className={`w-1 h-full absolute left-0 top-0 bottom-0 ${cfg.bar}`}></div>
      <div className="p-5 pl-6 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
              <div className={`w-3 h-3 rounded-full ${cfg.dot}`}></div>
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-slate-800 mb-1 capitalize">{title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${cfg.text} ${cfg.border}`}>
                  {severity}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {new Date(created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
                {barangay && (
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-400 ml-2">
                    <MapPin className="h-3 w-3" /> {barangay}
                  </span>
                )}
              </div>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => onDelete?.(id)}
              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              title="Delete alert"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="bg-slate-50 rounded-xl p-4 ml-12">
          <p className="text-sm text-slate-600 font-medium italic">"{description}"</p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
