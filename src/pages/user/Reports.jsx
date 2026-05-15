import { useState } from 'react';
import { FileText, Plus, Search, MapPin, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';
import { createReport, uploadReportImage, deleteReport } from '../../services/reportService';
import ReportCard from '../../components/reports/ReportCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Loader from '../../components/common/Loader';
import { BARANGAYS, REPORT_TYPES } from '../../utils/constants';

const Reports = () => {
  const { user } = useAuth();
  const { reports, loading, refetch } = useReports(user?.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({ type: '', description: '', barangay: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.description || !form.barangay) {
      toast.error('Required fields missing');
      return;
    }
    setSubmitting(true);
    try {
      let image_url = null;
      if (imageFile) image_url = await uploadReportImage(imageFile, user.id);
      await createReport({ ...form, title: form.type, image_url, user_id: user.id, status: 'pending' });
      toast.success('Report submitted');
      setModalOpen(false);
      setForm({ type: '', description: '', barangay: '' });
      setImageFile(null);
      setImagePreview(null);
      refetch();
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = reports.filter(r => r.type?.toLowerCase().includes(search.toLowerCase()) || r.barangay?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-10 relative z-10 max-w-6xl mx-auto px-1 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">My Reports</h1>
          <p className="text-brand-100 text-sm font-medium opacity-60">Track and manage your incident logs.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white font-black text-xs px-8 py-4 rounded-2xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20 active:scale-95 uppercase tracking-widest border border-brand-400/30"
        >
          <Plus className="h-5 w-5" /> NEW REPORT
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-brand-400 transition-colors" />
        <input
          type="text"
          placeholder="Search your reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-14 pl-12 pr-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-sm sm:text-base font-bold text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/10 focus:border-brand-500/50"
        />
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {filtered.map(r => (
            <ReportCard key={r.id} report={r} isAdmin={false} />
          ))}
          {filtered.length === 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl sm:rounded-[40px] p-10 sm:p-20 border border-white/10 text-center shadow-2xl col-span-full">
              <FileText className="h-16 w-16 mx-auto mb-6 text-white/5" />
              <p className="text-white/30 font-black uppercase tracking-tight text-lg">No Reports Logged</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Dispatch Report">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Incident Type</label>
            <select 
              value={form.type} 
              onChange={e => setForm({...form, type: e.target.value})} 
              className="w-full h-12 sm:h-14 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white/10 transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1e293b]">Select classification</option>
              {REPORT_TYPES.map(t => <option key={t} value={t} className="bg-[#1e293b]">{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Sectors / Barangay</label>
            <select 
              value={form.barangay} 
              onChange={e => setForm({...form, barangay: e.target.value})} 
              className="w-full h-12 sm:h-14 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white/10 transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1e293b]">Select deployment zone</option>
              {BARANGAYS.map(b => <option key={b} value={b} className="bg-[#1e293b]">{b}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Situation Report</label>
            <textarea 
              rows={4} 
              placeholder="Describe the current status and immediate needs..."
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white/10 transition-all font-bold resize-none placeholder:text-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Visual Intelligence (Photo)</label>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden h-40 border border-white/10 shadow-2xl">
                <img src={imagePreview} className="w-full h-full object-cover" />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-xl hover:bg-red-500 transition-colors shadow-lg"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-brand-500/50 transition-all group">
                <Upload className="h-8 w-8 text-white/20 group-hover:text-brand-400 transition-colors" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-3 group-hover:text-white transition-colors">Upload Intel Photo</span>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
          <Button onClick={handleSubmit} fullWidth size="lg" loading={submitting}>Transmit Report</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
