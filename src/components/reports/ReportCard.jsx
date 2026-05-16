import { MapPin, Clock, Image as ImageIcon, CheckCircle2, XCircle, Clock3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const typeEmoji = {
  flood: '🌊',
  fire: '🔥',
  earthquake: '🌍',
  landslide: '⛰️',
  other: '⚠️',
};

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock3,
    class: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    class: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
};

const ReportCard = ({ report, isAdmin, onStatusChange, onDelete }) => {
  const typeKey = (report.type || report.title || 'other').toLowerCase();
  const status = statusConfig[report.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const reporterName = report.users?.full_name || 'Anonymous';

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col group hover:bg-white/10 transition-all duration-500">
      {/* Image */}
      {report.image_url ? (
        <div className="h-40 sm:h-52 overflow-hidden relative">
          <img
            src={report.image_url}
            alt={`${report.type} report`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
        </div>
      ) : (
        <div className="h-28 sm:h-36 flex items-center justify-center bg-white/5 border-b border-white/5">
          <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-white/5" />
        </div>
      )}

      <div className="p-5 sm:p-7">
        {/* Type */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-3xl drop-shadow-lg">{typeEmoji[typeKey] || '⚠️'}</span>
            <span className="text-base sm:text-xl font-black text-white uppercase tracking-tight leading-tight">{report.type || report.title}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-2xl p-4 sm:p-5 mb-5 border border-white/5 group-hover:bg-white/10 transition-colors">
          <p className="text-xs sm:text-sm text-brand-50/70 leading-relaxed font-medium line-clamp-2 sm:line-clamp-3 italic">
            "{report.description}"
          </p>
        </div>

        {/* Meta */}
        <div className="space-y-2 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/20">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-400/50" />
            <span className="truncate">{report.barangay}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/10" />
            <span>{formatDate(report.created_at)}</span>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 text-brand-400 mt-2 pt-2 border-t border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              <span className="truncate">{reporterName}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        {(isAdmin || onDelete) && (
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between gap-3">
            {isAdmin && (
              <select
                value={report.status}
                onChange={(e) => onStatusChange(report.id, e.target.value)}
                className="flex-1 h-10 sm:h-12 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-xl px-4 bg-[#1e293b] text-white outline-none focus:ring-2 focus:ring-brand-500/50 transition-all cursor-pointer hover:bg-[#2d3a4f]"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(report.id)}
                className={`p-3 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/20 transition-all border border-transparent hover:border-red-500/50 ${!isAdmin ? 'ml-auto' : ''}`}
                title="Delete report"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
