import React, { useState } from 'react';
import { Bell, FileText, MapPin, Plus, Trash2, Pencil, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAlerts } from '../../hooks/useAlerts';
import { useReports } from '../../hooks/useReports';
import { createAlert, updateAlert, deleteAlert } from '../../services/alertService';
import { updateReportStatus } from '../../services/reportService';
import { getCenters, createCenter, updateCenter, deleteCenter } from '../../services/centerService';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/common/Loader';
import { SEVERITY_LEVELS, BARANGAYS } from '../../utils/constants';

const AdminPanel = () => {
  const { alerts, loading: alertsLoading } = useAlerts();
  const { reports, loading: reportsLoading } = useReports();
  const [centers, setCenters] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => { loadCenters(); }, []);
  const loadCenters = async () => { const d = await getCenters(); setCenters(d); };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setForm(item || { title: '', description: '', severity: 'Low', name: '', address: '', barangay: '', capacity: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 relative z-10 max-w-7xl mx-auto px-4 sm:px-0">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Admin Command Center</h1>
        <p className="text-brand-100/60 font-bold mt-2">Strategic oversight and system-wide management protocols.</p>
      </div>

      <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl sm:rounded-[2rem] shadow-2xl">
        {['alerts', 'reports', 'centers'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 sm:py-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-xl sm:rounded-[1.5rem] transition-all duration-300 ${activeTab === t ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Broadcasts</h2>
              <Button 
                onClick={() => handleOpenModal()}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 mr-2" /> NEW BROADCAST
              </Button>
            </div>
            {alertsLoading ? <div className="flex justify-center py-12"><Loader /></div> : (
              <div className="grid grid-cols-1 gap-4">
                {alerts.map(a => (
                  <div key={a.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-white/10 transition-all duration-300 shadow-2xl">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-lg">
                        <Bell className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white tracking-tight">{a.title}</p>
                        <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">{a.severity} Priority Ops</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteAlert(a.id)} 
                      className="w-full sm:w-auto p-4 sm:p-3 text-white/20 hover:text-red-400 hover:bg-red-500/20 rounded-2xl transition-all border border-white/5 hover:border-red-500/50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest">Delete Broadcast</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight px-2">Sector Reports</h2>
            {reportsLoading ? <div className="flex justify-center py-12"><Loader /></div> : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map(r => (
                  <div key={r.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:bg-white/10 transition-all duration-300 shadow-2xl">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-white tracking-tight mb-1">{r.barangay}</p>
                      <p className="text-sm text-brand-100/40 font-medium leading-relaxed italic line-clamp-2">"{r.description}"</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => updateReportStatus(r.id, 'verified')} 
                        className="flex-1 sm:flex-none p-4 sm:p-3 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                        title="Verify Report"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span className="sm:hidden text-[10px] font-black uppercase tracking-widest">Verify Ops</span>
                      </button>
                      <button 
                        onClick={() => updateReportStatus(r.id, 'rejected')} 
                        className="flex-1 sm:flex-none p-4 sm:p-3 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
                        title="Reject Report"
                      >
                        <XCircle className="h-5 w-5" />
                        <span className="sm:hidden text-[10px] font-black uppercase tracking-widest">Abort Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
