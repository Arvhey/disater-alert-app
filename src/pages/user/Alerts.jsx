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
    <div className="max-w-4xl space-y-6 sm:space-y-8 relative z-10 px-1 sm:px-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight uppercase">Disaster Alerts</h1>
          <p className="text-brand-100 text-sm font-medium opacity-60">
            Real-time emergency updates for Polomolok.
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white font-black text-xs px-8 py-4 rounded-2xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20 uppercase tracking-widest active:scale-95 border border-brand-400/30"
          >
            <Plus className="h-5 w-5" /> BROADCAST ALERT
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-brand-400 transition-colors" />
        <input
          type="text"
          placeholder="Search active alerts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-14 sm:h-16 pl-14 pr-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[20px] shadow-2xl text-sm sm:text-base font-bold text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/10 focus:border-brand-500/50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {SEVERITY_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`px-5 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-full transition-all shadow-xl border ${
              severity === s 
                ? 'bg-brand-500 text-white border-brand-400 shadow-brand-500/20' 
                : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="pt-2">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          Found {filtered.length} active broadcast{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Alert List */}
      {loading ? <div className="flex justify-center py-12"><Loader /></div> : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
          
          {filtered.length === 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl sm:rounded-[32px] p-10 sm:p-20 border border-white/10 text-center shadow-2xl">
              <Bell className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 font-black uppercase tracking-tight text-lg">No Results Found</p>
            </div>
          )}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Alert">
        <div className="space-y-5">
          <Input 
            label="Intel Title" 
            placeholder="E.g. Flash Flood Warning"
            value={newAlert.title} 
            onChange={e => setNewAlert({...newAlert, title: e.target.value})} 
          />
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Severity Level</label>
            <select 
              value={newAlert.severity} 
              onChange={e => setNewAlert({...newAlert, severity: e.target.value})}
              className="w-full h-12 sm:h-14 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white/10 transition-all font-bold appearance-none cursor-pointer"
            >
              {SEVERITY_LEVELS.map(l => <option key={l} value={l} className="bg-[#1e293b]">{l}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Detailed Intelligence</label>
            <textarea 
              rows={4} 
              placeholder="Provide specific instructions or observations..."
              value={newAlert.description} 
              onChange={e => setNewAlert({...newAlert, description: e.target.value})}
              className="w-full p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white/10 transition-all font-bold resize-none placeholder:text-white/10"
            />
          </div>
          <button 
            onClick={handleCreateAlert} 
            disabled={isSubmitting}
            className="w-full h-12 sm:h-14 bg-brand-600 text-white font-black uppercase tracking-widest text-xs rounded-xl sm:rounded-2xl hover:bg-brand-500 transition-all disabled:opacity-30 shadow-lg shadow-brand-600/20 border border-brand-400/30 mt-2"
          >
            {isSubmitting ? 'Transmitting...' : 'Broadcast Broadcast'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Alerts;
