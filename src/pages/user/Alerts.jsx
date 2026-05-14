import { useState } from 'react';
import { Search, Plus, AlertCircle, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { deleteAlert, createAlert } from '../../services/alertService';
import { toast } from 'react-toastify';
import AlertCard from '../../components/alerts/AlertCard';
import Loader from '../../components/common/Loader';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { SEVERITY_LEVELS } from '../../utils/constants';

const SEVERITY_FILTERS = ['All', 'High', 'Medium', 'Low'];

const Alerts = () => {
  const { isAdmin } = useAuth();
  const { alerts, loading } = useAlerts();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAlert, setNewAlert] = useState({ title: '', description: '', severity: 'Low' });

  const handleDelete = async (id) => {
    if (window.confirm('Delete this alert?')) {
      try {
        await deleteAlert(id);
        toast.success('Alert deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.description) {
      toast.error('Fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await createAlert({ ...newAlert, severity: newAlert.severity.toLowerCase(), category: 'General', barangay: 'All' });
      toast.success('Alert Broadcasted');
      setIsModalOpen(false);
      setNewAlert({ title: '', description: '', severity: 'Low' });
    } catch (err) {
      toast.error('Failed to broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = alerts.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severity === 'All' || a.severity?.toLowerCase() === severity.toLowerCase();
    return matchSearch && matchSeverity;
  });

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Disaster Alerts</h1>
          <p className="text-sm font-medium text-slate-500">
            Real-time emergency updates for the Municipality of Polomolok.
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0284c7] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-sky-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="h-5 w-5" /> BROADCAST ALERT
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search active alerts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-14 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-[#0284c7] outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {SEVERITY_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all shadow-sm ${
              severity === s 
                ? 'bg-[#0f172a] text-white' 
                : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="pt-2 pb-2">
        <p className="text-sm font-medium text-slate-400">
          Showing {filtered.length} of {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Alert List */}
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
          
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center">
              <Bell className="h-10 w-10 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No alerts match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Alert">
        <div className="space-y-4">
          <Input label="Title" value={newAlert.title} onChange={e => setNewAlert({...newAlert, title: e.target.value})} />
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Severity</label>
            <select 
              value={newAlert.severity} 
              onChange={e => setNewAlert({...newAlert, severity: e.target.value})}
              className="w-full h-12 px-4 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white transition-all font-medium"
            >
              {SEVERITY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Message</label>
            <textarea 
              rows={4} 
              value={newAlert.description} 
              onChange={e => setNewAlert({...newAlert, description: e.target.value})}
              className="w-full p-4 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white transition-all font-medium resize-none"
            />
          </div>
          <button 
            onClick={handleCreateAlert} 
            disabled={isSubmitting}
            className="w-full h-12 bg-[#0284c7] text-white font-bold rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-50 mt-4"
          >
            {isSubmitting ? 'Broadcasting...' : 'Broadcast Alert'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Alerts;
