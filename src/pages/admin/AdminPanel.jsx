import React, { useState } from 'react';
import { 
  Bell, FileText, MapPin, Plus, 
  Trash2, Pencil, CheckCircle, XCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAlerts } from '../../hooks/useAlerts';
import { useReports } from '../../hooks/useReports';
import { createAlert, updateAlert, deleteAlert } from '../../services/alertService';
import { updateReportStatus, deleteReport } from '../../services/reportService';
import { getCenters, createCenter, updateCenter, deleteCenter } from '../../services/centerService';
import { supabase } from '../../supabase';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/common/Loader';
import { SEVERITY_LEVELS, BARANGAYS } from '../../utils/constants';

const BARANGAY_COORDS = {
  'Poblacion': [6.2239, 125.0628],
  'Cannery Site': [6.2417, 125.0833],
  'Koronadal Proper': [6.2167, 125.0500],
  'Magsaysay': [6.2333, 125.0667],
  'Pagalungan': [6.2000, 125.0333],
  'Sulit': [6.2500, 125.1000],
  'Upper Klinan': [6.2667, 125.1167],
  'Bentung': [6.1833, 125.0167],
  'Crossing Palkan': [6.2833, 125.1333],
  'Glamang': [6.1667, 125.0000],
  'Klinan 6': [6.2167, 125.1000],
  'Landan': [6.3000, 125.0500],
  'Lumakil': [6.2000, 125.0833],
  'Maligo': [6.3167, 125.0667],
  'Palkan': [6.2833, 125.1500],
  'Polo': [6.1500, 125.0333],
  'Residue': [6.2333, 125.1000],
  'San Isidro': [6.1333, 125.0500],
  'San Jose': [6.1167, 125.0667],
  'Silway 8': [6.1833, 125.0667],
  'Silway 7': [6.1667, 125.0833]
};

const AdminReportsMap = ({ reports }) => {
  const mapRef = React.useRef(null);
  const leafletMap = React.useRef(null);
  const markersRef = React.useRef([]);

  React.useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = window.L.map(mapRef.current).setView([6.2239, 125.0628], 13);
      window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps'
      }).addTo(leafletMap.current);
    }

    if (leafletMap.current && reports) {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      reports.forEach(report => {
        const coords = report.latitude && report.longitude 
          ? [parseFloat(report.latitude), parseFloat(report.longitude)]
          : BARANGAY_COORDS[report.barangay] || [6.2239, 125.0628];

        const reportType = report.type || report.title;
        const color = reportType === 'Fire' ? '#ef4444' : 
                      reportType === 'Flood' ? '#3b82f6' :
                      reportType === 'Earthquake' ? '#f59e0b' : '#64748b';

        // Custom professional marker with pulse effect
        const customIcon = window.L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background-color: ${color};" class="w-4 h-4 rounded-full border-2 border-white shadow-lg relative">
              <div style="background-color: ${color};" class="absolute inset-0 rounded-full animate-ping opacity-40"></div>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = window.L.marker(coords, { icon: customIcon }).addTo(leafletMap.current)
          .bindPopup(`
            <div class="min-w-[200px] font-sans p-1">
              <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <span class="w-2 h-2 rounded-full" style="background-color: ${color}"></span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${reportType}</span>
              </div>
              <h4 class="font-bold text-slate-900 text-sm mb-1">${report.barangay}</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-3">${report.description}</p>
              ${report.image_url ? `
                <div class="mb-3 rounded-lg overflow-hidden h-24 bg-slate-100">
                  <img src="${report.image_url}" class="w-full h-full object-cover" alt="Incident" />
                </div>
              ` : ''}
              <div class="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                <span class="text-[9px] text-slate-400">${new Date(report.created_at).toLocaleTimeString()}</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-500 uppercase">${report.status}</span>
              </div>
            </div>
          `, {
            maxWidth: 250,
            className: 'professional-popup'
          });
        markersRef.current.push(marker);
      });
    }
  }, [reports]);

  return <div ref={mapRef} className="h-full w-full" />;
};

const AdminPanel = () => {
  const { alerts, loading: alertsLoading } = useAlerts();
  const { reports, loading: reportsLoading } = useReports();
  const [centers, setCenters] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts');
  
  // Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [alertForm, setAlertForm] = useState({ title: '', description: '', severity: 'Low' });

  // Center Modal State
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [centerForm, setCenterForm] = useState({ 
    name: '', 
    address: '', 
    barangay: '', 
    capacity: '', 
    contact_number: '',
    latitude: '',
    longitude: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch centers
  React.useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      const data = await getCenters();
      setCenters(data);
    } catch (error) {
      toast.error('Error loading centers');
    }
  };

  const handleOpenAlertModal = (alert = null) => {
    if (alert) {
      setEditingAlert(alert);
      setAlertForm({ title: alert.title, description: alert.description, severity: alert.severity });
    } else {
      setEditingAlert(null);
      setAlertForm({ title: '', description: '', severity: 'Low' });
    }
    setIsAlertModalOpen(true);
  };

  const handleOpenCenterModal = (center = null) => {
    if (center) {
      setEditingCenter(center);
      setCenterForm({ 
        name: center.name, 
        address: center.address, 
        barangay: center.barangay, 
        capacity: center.capacity, 
        contact_number: center.contact_number,
        latitude: center.latitude || '',
        longitude: center.longitude || ''
      });
    } else {
      setCenterForm({ name: '', address: '', barangay: '', capacity: '', contact_number: '', latitude: '', longitude: '' });
    }
    setIsCenterModalOpen(true);
  };

  const handleSaveCenter = async () => {
    if (!centerForm.name || !centerForm.barangay) {
      toast.error('Please fill in required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingCenter) {
        await updateCenter(editingCenter.id, centerForm);
        toast.success('Center updated');
      } else {
        await createCenter(centerForm);
        toast.success('Center added');
      }
      loadCenters();
      setIsCenterModalOpen(false);
    } catch (error) {
      toast.error('Error saving center');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCenter = async (id) => {
    if (window.confirm('Delete this center?')) {
      try {
        await deleteCenter(id);
        toast.success('Center deleted');
        loadCenters();
      } catch (error) {
        toast.error('Error deleting center');
      }
    }
  };

  const handleSaveAlert = async () => {
    if (!alertForm.title || !alertForm.description) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const alertData = {
        ...alertForm,
        severity: alertForm.severity.toLowerCase(),
        category: 'General', // Default required field
        barangay: 'All'      // Default required field
      };

      if (editingAlert) {
        await updateAlert(editingAlert.id, alertData);
        toast.success('Alert updated successfully');
      } else {
        await createAlert(alertData);
        toast.success('Alert created successfully');
      }
      setIsAlertModalOpen(false);
    } catch (error) {
      toast.error('Error saving alert: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await deleteAlert(id);
        toast.success('Alert deleted');
      } catch (error) {
        toast.error('Error deleting alert');
      }
    }
  };

  const handleUpdateReportStatus = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      toast.success(`Report ${status}`);
    } catch (error) {
      toast.error('Error updating report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl shadow-slate-200">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight leading-none">Admin Panel</h1>
          <p className="text-slate-300 text-xs mt-3 font-medium max-w-[200px] leading-relaxed">
            Authorized access for Polomolok Disaster Management.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar scrollbar-hide">
        {[
          { id: 'alerts', label: 'Alerts', icon: Bell },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'centers', label: 'Centers', icon: MapPin },
          { id: 'hotspots', label: 'Hotspots', icon: MapPin }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 whitespace-nowrap flex-1 ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Active Alerts</h2>
            <Button onClick={() => handleOpenAlertModal()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </div>

          {alertsLoading ? <Loader /> : (
            <div className="grid grid-cols-1 gap-4">
              {alerts.map(alert => (
                <div key={alert.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'High' ? 'bg-red-100 text-red-600' : 
                      alert.severity === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{alert.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{alert.description}</p>
                      <span className={`text-[10px] font-bold uppercase mt-1 inline-block ${
                        alert.severity === 'High' ? 'text-red-600' : 
                        alert.severity === 'Medium' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {alert.severity} Severity
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenAlertModal(alert)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-brand-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-center py-8 text-slate-500">No alerts found.</p>}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Incoming Incident Reports</h2>
          {reportsLoading ? <Loader /> : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map(report => (
                <div key={report.id} className="card p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {report.image_url && (
                      <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={report.image_url} alt="Report" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase">
                          {report.type || report.title}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          report.status === 'verified' ? 'bg-green-100 text-green-700' :
                          report.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900">{report.barangay}</h3>
                      <p className="text-sm text-slate-600">{report.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-slate-400">By: {report.users?.full_name || 'Anonymous'}</p>
                        <div className="flex items-center gap-2">
                          {report.status !== 'verified' && (
                            <button 
                              onClick={() => handleUpdateReportStatus(report.id, 'verified')}
                              className="flex items-center gap-1 text-xs font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded"
                            >
                              <CheckCircle className="h-3 w-3" /> Verify
                            </button>
                          )}
                          {report.status !== 'rejected' && (
                            <button 
                              onClick={() => handleUpdateReportStatus(report.id, 'rejected')}
                              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                            >
                              <XCircle className="h-3 w-3" /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && <p className="text-center py-8 text-slate-500">No reports to review.</p>}
            </div>
          )}
        </div>
      )}

      {activeTab === 'hotspots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Incident Hotspots Map</h2>
            <p className="text-xs text-slate-500 italic">Pins are grouped by Barangay center if GPS is unavailable.</p>
          </div>
          
          <div className="card overflow-hidden h-[500px] border-brand-100 relative">
            <AdminReportsMap reports={reports} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-3 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-slate-700">Fire</span>
            </div>
            <div className="card p-3 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs font-medium text-slate-700">Flood</span>
            </div>
            <div className="card p-3 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs font-medium text-slate-700">Earthquake</span>
            </div>
            <div className="card p-3 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-500"></div>
              <span className="text-xs font-medium text-slate-700">Other</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'centers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Evacuation Centers</h2>
            <Button onClick={() => handleOpenCenterModal()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Center
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {centers.map(center => (
              <div key={center.id} className="card p-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{center.name}</h3>
                    <p className="text-sm text-slate-500">{center.barangay} • Cap: {center.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenCenterModal(center)} className="p-2 text-slate-400 hover:text-brand-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteCenter(center.id)} className="p-2 text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {centers.length === 0 && <p className="text-center py-8 text-slate-500">No centers listed yet.</p>}
          </div>
        </div>
      )}

      {/* Alert Modal (existing) */}
      <Modal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={editingAlert ? 'Edit Alert' : 'Create New Alert'}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsAlertModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAlert} loading={isSubmitting}>Save Alert</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Alert Title" 
            placeholder="e.g. Flash Flood Warning" 
            value={alertForm.title}
            onChange={(e) => setAlertForm({...alertForm, title: e.target.value})}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Severity Level</label>
            <select 
              value={alertForm.severity}
              onChange={(e) => setAlertForm({...alertForm, severity: e.target.value})}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SEVERITY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              rows={4}
              value={alertForm.description}
              onChange={(e) => setAlertForm({...alertForm, description: e.target.value})}
              placeholder="Enter detailed alert description..."
              className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Center Modal */}
      <Modal
        isOpen={isCenterModalOpen}
        onClose={() => setIsCenterModalOpen(false)}
        title={editingCenter ? 'Edit Center' : 'Add New Center'}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsCenterModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCenter} loading={isSubmitting}>Save Center</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Center Name" value={centerForm.name} onChange={e => setCenterForm({...centerForm, name: e.target.value})} />
          <Input label="Address" value={centerForm.address} onChange={e => setCenterForm({...centerForm, address: e.target.value})} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Barangay</label>
            <select 
              value={centerForm.barangay}
              onChange={e => setCenterForm({...centerForm, barangay: e.target.value})}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select Barangay</option>
              {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Capacity" type="number" value={centerForm.capacity} onChange={e => setCenterForm({...centerForm, capacity: e.target.value})} />
            <Input label="Contact" value={centerForm.contact_number} onChange={e => setCenterForm({...centerForm, contact_number: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" placeholder="e.g. 6.2167" value={centerForm.latitude} onChange={e => setCenterForm({...centerForm, latitude: e.target.value})} />
            <Input label="Longitude" placeholder="e.g. 125.0667" value={centerForm.longitude} onChange={e => setCenterForm({...centerForm, longitude: e.target.value})} />
          </div>
          <button 
            type="button"
            onClick={() => setCenterForm({...centerForm, latitude: '6.2239', longitude: '125.0628'})}
            className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider text-left"
          >
            📍 Set to Polomolok Town Center
          </button>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Center Status</label>
            <select 
              value={centerForm.status || 'Open'} 
              onChange={e => setCenterForm({...centerForm, status: e.target.value})}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-500 transition-all outline-none"
            >
              <option value="Open">✅ Open - Space Available</option>
              <option value="Full">⚠️ Full - No Space</option>
              <option value="Closed">❌ Closed - Not Available</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPanel;
