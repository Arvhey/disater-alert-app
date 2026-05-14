import { useState } from 'react';
import { AlertTriangle, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { deleteAlert, createAlert } from '../../services/alertService';
import { toast } from 'react-toastify';
import AlertCard from '../../components/alerts/AlertCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { SEVERITY_LEVELS } from '../../utils/constants';

const SEVERITY_FILTERS = ['All', 'High', 'Medium', 'Low'];

const Alerts = () => {
  const { isAdmin } = useAuth();
  const { alerts, loading } = useAlerts();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  
  // New Alert Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAlert, setNewAlert] = useState({ title: '', description: '', severity: 'Low', category: 'General', barangay: 'All' });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await deleteAlert(id);
        toast.success('Alert deleted successfully');
      } catch (err) {
        toast.error('Failed to delete alert');
      }
    }
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.description) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      // Ensure severity is lowercase for database constraints
      const alertData = {
        ...newAlert,
        severity: newAlert.severity.toLowerCase()
      };
      await createAlert(alertData);
      toast.success('Official Alert Broadcasted!');
      setIsModalOpen(false);
      setNewAlert({ title: '', description: '', severity: 'Low', category: 'General', barangay: 'All' });
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = alerts.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severity === 'All' || a.severity?.toLowerCase() === severity.toLowerCase();
    return matchSearch && matchSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl shadow-slate-200">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight leading-none">Disaster Alerts</h1>
          <p className="text-slate-300 text-xs mt-3 font-medium max-w-[200px] leading-relaxed">
            Real-time emergency updates for the Municipality of Polomolok.
          </p>
          {isAdmin && (
            <Button onClick={() => setIsModalOpen(true)} variant="white" className="mt-6 border-none shadow-lg font-black uppercase tracking-widest text-[11px]">
              <Plus className="h-4 w-4 mr-2" />
              Broadcast Alert
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
          <input
            type="text"
            placeholder="Search active alerts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-100 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {SEVERITY_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border border-transparent ${
                severity === s
                  ? s === 'High' ? 'bg-red-500 text-white shadow-md shadow-red-100'
                    : s === 'Medium' ? 'bg-amber-500 text-white shadow-md shadow-amber-100'
                    : s === 'Low' ? 'bg-green-500 text-white shadow-md shadow-green-100'
                    : 'bg-slate-900 text-white shadow-md shadow-slate-200'
                  : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-slate-400 font-medium">
          Showing {filtered.length} of {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size="large" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2">
          <AlertTriangle className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No alerts found</p>
          <p className="text-slate-400 text-sm mt-1">Stay safe and alert!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              isAdmin={isAdmin} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Alert Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Official Alert"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateAlert} loading={isSubmitting}>Broadcast Alert</Button>
          </div>
        }
      >
        <div className="space-y-5">
          <Input 
            label="Alert Title" 
            placeholder="e.g. Extreme Rainfall Warning" 
            value={newAlert.title}
            onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
          />
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Severity Level</label>
            <select 
              value={newAlert.severity}
              onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
            >
              {SEVERITY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Message</label>
            <textarea 
              rows={4}
              value={newAlert.description}
              onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
              placeholder="Provide clear instructions for the community..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Alerts;
