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
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">System management and oversight.</p>
      </div>

      <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
        {['alerts', 'reports', 'centers'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${activeTab === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold">Active Alerts</h2>
              <Button size="sm" onClick={() => handleOpenModal()}>New Alert</Button>
            </div>
            {alertsLoading ? <Loader /> : alerts.map(a => (
              <div key={a.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Bell className="h-5 w-5" /></div>
                  <div><p className="font-bold">{a.title}</p><p className="text-xs text-slate-500 uppercase">{a.severity}</p></div>
                </div>
                <button onClick={() => deleteAlert(a.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="font-bold">Recent Reports</h2>
            {reportsLoading ? <Loader /> : reports.map(r => (
              <div key={r.id} className="card p-4 flex items-center justify-between">
                <div><p className="font-bold">{r.barangay}</p><p className="text-sm text-slate-500">{r.description}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => updateReportStatus(r.id, 'verified')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="h-5 w-5" /></button>
                  <button onClick={() => updateReportStatus(r.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><XCircle className="h-5 w-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
