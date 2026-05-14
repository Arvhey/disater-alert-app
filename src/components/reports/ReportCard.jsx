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
    class: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    class: 'bg-green-100 text-green-700 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    class: 'bg-red-100 text-red-700 border-red-200',
  },
};

const ReportCard = ({ report, isAdmin, onStatusChange, onDelete }) => {
  const typeKey = (report.type || report.title || 'other').toLowerCase();
  const status = statusConfig[report.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const reporterName = report.users?.full_name || 'Anonymous';

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      {report.image_url ? (
        <div className="h-40 overflow-hidden">
          <img
            src={report.image_url}
            alt={`${report.type} report`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-slate-50 border-b border-slate-100">
          <ImageIcon className="h-8 w-8 text-slate-300" />
        </div>
      )}

      <div className="p-4">
        {/* Type + status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeEmoji[typeKey] || '⚠️'}</span>
            <span className="text-sm font-semibold text-slate-900">{report.type || report.title}</span>
          </div>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${status.class}`}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
          {report.description}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{report.barangay}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{formatDate(report.created_at)}</span>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>By: {reporterName}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        {(isAdmin || onDelete) && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {isAdmin && (
              <select
                value={report.status}
                onChange={(e) => onStatusChange(report.id, e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(report.id)}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ${!isAdmin ? 'ml-auto' : ''}`}
                title="Delete report"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
