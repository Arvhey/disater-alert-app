import { Clock, MapPin, Trash2 } from 'lucide-react';

const AlertCard = ({ alert, isAdmin, onDelete }) => {
  const { id, title, description, severity, barangay, created_at } = alert;

  const severityConfig = {
    high:   { bar: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',   bg: 'bg-red-500/20',   dot: 'bg-red-400',   text: 'text-red-300',   border: 'border-red-500/20' },
    medium: { bar: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]', bg: 'bg-amber-500/20', dot: 'bg-amber-400', text: 'text-amber-300', border: 'border-amber-500/20' },
    low:    { bar: 'bg-brand-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]', bg: 'bg-brand-500/20', dot: 'bg-brand-400', text: 'text-brand-300', border: 'border-brand-500/20' },
  };

  const cfg = severityConfig[severity?.toLowerCase()] || severityConfig.low;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative group hover:bg-white/10 transition-all duration-300">
      <div className={`w-1 sm:w-1.5 h-full absolute left-0 top-0 bottom-0 ${cfg.bar}`}></div>
      <div className="p-5 sm:p-7 sm:pl-9 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10 ${cfg.bg} shadow-lg`}>
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${cfg.dot} shadow-[0_0_10px_rgba(0,0,0,0.4)] animate-pulse`}></div>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-xl font-black text-white mb-1 uppercase tracking-tight leading-tight">{title}</h3>
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 mb-4">
                <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${cfg.text} ${cfg.border} bg-white/5`}>
                  {severity}
                </span>
                <span className="flex items-center gap-1.5 text-[9px] sm:text-xs font-bold text-white/30 uppercase tracking-tighter">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {new Date(created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
                {barangay && (
                  <span className="flex items-center gap-1.5 text-[9px] sm:text-xs font-bold text-brand-400 uppercase tracking-tighter">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {barangay}
                  </span>
                )}
              </div>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => onDelete?.(id)}
              className="p-3 text-white/20 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-500/50"
              title="Delete alert"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 sm:p-6 mt-2 sm:mt-4 group-hover:bg-white/10 transition-colors">
          <p className="text-xs sm:text-base text-brand-50/80 font-medium leading-relaxed italic">"{description}"</p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
