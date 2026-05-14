import { AlertTriangle, Clock, Trash2, Pencil } from 'lucide-react';
import { getSeverityColor } from '../../utils/severityColor';
import { formatDate } from '../../utils/formatDate';

const severityIcon = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
};

const AlertCard = ({ alert, isAdmin, onEdit, onDelete }) => {
  const severityKey = alert.severity?.toLowerCase();
  const colorClass = getSeverityColor(alert.severity);

  return (
    <div className="card group hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border-none shadow-sm relative overflow-hidden">
      {/* Severity stripe */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          severityKey === 'high'
            ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
            : severityKey === 'medium'
            ? 'bg-amber-400'
            : 'bg-green-500'
        }`}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-inner ${
                severityKey === 'high'
                  ? 'bg-red-50 text-red-600'
                  : severityKey === 'medium'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-green-50 text-green-600'
              }`}
            >
              {severityIcon[severityKey] || '🔵'}
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-black text-slate-900 leading-tight group-hover:text-brand-700 transition-colors">
                {alert.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-2 ${colorClass.replace('bg-', 'text-')}`}
                >
                  {alert.severity}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(alert.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <button
                onClick={() => onEdit(alert)}
                className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors shadow-sm bg-white"
                title="Edit alert"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(alert.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm bg-white"
                title="Delete alert"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="mt-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium italic">
            &ldquo;{alert.description}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
