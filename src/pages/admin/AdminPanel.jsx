import React, { useState, useEffect, useRef } from 'react';
import { Bell, FileText, MapPin, Plus, Trash2, Pencil, CheckCircle, XCircle, Map as MapIcon } from 'lucide-react';
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
  const playAlertSound = () => {
    // High-fidelity Classic Long-Wail Police Siren
    const sirenUrl = 'https://assets.mixkit.co/active_storage/sfx/2565/2565-preview.mp3';
    const audio = new Audio(sirenUrl);
    
    audio.loop = true;
    audio.play().catch(err => console.log('Audio playback blocked by browser until interaction', err));
    
    // Stop the siren automatically after 10 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 10000);
  };

  const { alerts, loading: alertsLoading } = useAlerts();
  const { reports, loading: reportsLoading } = useReports(null, (newReport) => {
    playAlertSound();
    toast.info(`NEW TACTICAL REPORT: ${newReport.type} at ${newReport.barangay}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  });
  const [centers, setCenters] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const activeMarkerRef = useRef(null);

  const BARANGAY_COORDS = {
    'Poblacion': [6.2239, 125.0628],
    'Cannery Site': [6.2415, 125.0456],
    'Silway 8': [6.1956, 125.0743],
    'Koronadal Proper': [6.2621, 125.0134],
    'Polo': [6.2023, 125.0345],
    'Magsaysay': [6.2312, 125.0832],
    'Glamang': [6.1834, 125.0934],
    'Landan': [6.2734, 125.1034],
    'Crossing Palkan': [6.2512, 125.0745],
    'Bentung': [6.2112, 125.0234]
  };

  useEffect(() => { loadCenters(); }, []);

  useEffect(() => {
    if (activeTab === 'reports' && mapRef.current && !leafletMap.current && !reportsLoading) {
      if (!window.L) return;
      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      leafletMap.current = window.L.map(mapRef.current).setView([6.2239, 125.0628], 12);
      window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20
      }).addTo(leafletMap.current);
    }
  }, [activeTab, reportsLoading]);

  const locateReport = (report) => {
    if (leafletMap.current && BARANGAY_COORDS[report.barangay]) {
      if (activeMarkerRef.current) {
        activeMarkerRef.current.remove();
      }

      leafletMap.current.setView(BARANGAY_COORDS[report.barangay], 15);

      if (mapRef.current) {
        const scrollContainer = document.querySelector('main');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: mapRef.current.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      }

      const jitterLat = (Math.random() - 0.5) * 0.005;
      const jitterLng = (Math.random() - 0.5) * 0.005;
      const lat = BARANGAY_COORDS[report.barangay][0] + jitterLat;
      const lng = BARANGAY_COORDS[report.barangay][1] + jitterLng;

      const imageHtml = report.image_url ? `<img src="${report.image_url}" class="w-full h-24 object-cover rounded mt-2 mb-2 shadow" />` : '';

      const marker = window.L.marker([lat, lng])
        .addTo(leafletMap.current)
        .bindPopup(`
          <div class="p-1 min-w-[150px] max-w-[200px] w-full">
            <b class="text-xs uppercase text-slate-900 break-words">${report.type || 'Incident'} - ${report.barangay}</b>
            ${imageHtml}
            <div class="text-[10px] text-slate-700 mt-1 italic break-words whitespace-normal overflow-wrap-anywhere">"${report.description}"</div>
          </div>
        `);

      activeMarkerRef.current = marker;

      setTimeout(() => marker.openPopup(), 400); // Wait for map to pan
    } else {
      toast.info(`No precise coordinates for ${report.barangay}.`);
    }
  };
  const loadCenters = async () => { const d = await getCenters(); setCenters(d); };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setForm(item || { title: '', description: '', severity: 'Low', name: '', address: '', barangay: '', capacity: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-0 overflow-x-hidden sm:overflow-visible">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl w-full">
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
            <h2 className="text-xl font-black text-white uppercase tracking-tight px-2">Sector Reports (Tactical Map)</h2>

            {/* Tactical Map Container */}
            <div className="bg-white/5 backdrop-blur-xl overflow-hidden h-[250px] sm:h-[400px] relative border border-white/10 shadow-2xl rounded-3xl w-full max-w-full">
              <div ref={mapRef} className="h-full w-full grayscale-[0.2] contrast-[1.1] brightness-[0.9] z-0" />
            </div>

            {reportsLoading ? <div className="flex justify-center py-12"><Loader /></div> : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map(r => (
                  <div key={r.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:bg-white/10 transition-all duration-300 shadow-2xl">

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-black uppercase tracking-widest border border-brand-500/20 shadow-lg">{r.type || 'Incident'}</span>
                        <p className="text-lg font-bold text-white tracking-tight">{r.barangay}</p>
                      </div>
                      <p className="text-sm text-brand-100/60 font-medium leading-relaxed italic break-words overflow-wrap-anywhere whitespace-normal bg-white/5 p-4 rounded-2xl border border-white/5">"{r.description}"</p>
                    </div>

                    <div className="w-full sm:w-auto sm:self-stretch flex items-center justify-center">
                      <button
                        onClick={() => locateReport(r)}
                        className="w-full sm:w-auto h-full p-4 sm:p-6 text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500 border border-brand-500/30 rounded-2xl transition-all flex sm:flex-col items-center justify-center gap-3 shadow-lg active:scale-95 group/btn"
                      >
                        <MapIcon className="h-5 w-5 sm:h-8 sm:w-8 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-center">Locate<br className="hidden sm:block" />Sector</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'centers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Evacuation Centers</h2>
              <Button
                onClick={() => handleOpenModal()}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                <Plus className="h-5 w-5 mr-2" /> ADD CENTER
              </Button>
            </div>
            {centers.length === 0 ? <div className="flex justify-center py-12 text-white/30 font-bold uppercase tracking-widest">No centers found</div> : (
              <div className="grid grid-cols-1 gap-4">
                {centers.map(c => (
                  <div key={c.id} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-white/10 transition-all duration-300 shadow-2xl">
                    <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white tracking-tight">{c.name}</p>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{c.barangay}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={async () => {
                          try {
                            await deleteCenter(c.id);
                            loadCenters();
                            toast.success('Center deleted successfully');
                          } catch (err) {
                            toast.error('Failed to delete center');
                          }
                        }}
                        className="flex-1 sm:flex-none p-4 sm:p-3 text-white/20 hover:text-red-400 hover:bg-red-500/20 rounded-2xl transition-all border border-white/5 hover:border-red-500/50 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sm:hidden text-[10px] font-black uppercase tracking-widest">Delete Center</span>
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
