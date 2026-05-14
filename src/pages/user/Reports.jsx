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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Report
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => (
            <ReportCard key={r.id} report={r} isAdmin={false} />
          ))}
          {filtered.length === 0 && (
            <div className="card p-12 text-center text-slate-500 col-span-full">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No reports found</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Report">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Incident Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 border rounded-lg px-3">
              <option value="">Select type</option>
              {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Barangay</label>
            <select value={form.barangay} onChange={e => setForm({...form, barangay: e.target.value})} className="w-full h-10 border rounded-lg px-3">
              <option value="">Select barangay</option>
              {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border rounded-lg resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Photo</label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden h-32">
                <img src={imagePreview} className="w-full h-full object-cover" />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
                <Upload className="h-6 w-6 text-slate-400" />
                <span className="text-xs text-slate-500 mt-2">Upload photo</span>
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
          <Button onClick={handleSubmit} fullWidth loading={submitting}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
