import { useState } from 'react';
import { FileText, Plus, Upload, X, Search, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';
import { createReport, uploadReportImage, deleteReport } from '../../services/reportService';
import ReportCard from '../../components/reports/ReportCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.type) errs.type = 'Select incident type';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.trim().length < 10) errs.description = 'At least 10 characters';
    if (!form.barangay) errs.barangay = 'Select a barangay';
    return errs;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      let image_url = null;
      if (imageFile) image_url = await uploadReportImage(imageFile, user.id);
      await createReport({ 
        ...form, 
        title: form.type, // Map type to title for database compatibility
        image_url, 
        user_id: user.id, 
        status: 'pending' 
      });
      toast.success('Report submitted successfully!');
      setModalOpen(false);
      setForm({ type: '', description: '', barangay: '' });
      setImageFile(null);
      setImagePreview(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
        toast.success('Report deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete report');
      }
    }
  };

  const filtered = reports.filter(r =>
    r.type?.toLowerCase().includes(search.toLowerCase()) ||
    r.barangay?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-xl shadow-brand-100">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight leading-none">My Reports</h1>
            <p className="text-brand-100 text-xs mt-3 font-medium max-w-[200px] leading-relaxed">
              Help your community by reporting incidents in real-time.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} variant="white" className="w-fit border-none shadow-lg font-black uppercase tracking-widest text-[11px]">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-0 bg-brand-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
        <input
          type="text"
          placeholder="Search your reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-100 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size="large" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No reports yet</p>
          <p className="text-slate-400 text-sm mt-1">Click &quot;New Report&quot; to submit an incident</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <ReportCard 
              key={r.id} 
              report={r} 
              isAdmin={false} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Submit Report Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Incident Report"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Submit Report</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Incident Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${errors.type ? 'border-red-400' : 'border-slate-300'}`}
            >
              <option value="">Select type...</option>
              {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
          </div>

          {/* Barangay */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Barangay</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                name="barangay"
                value={form.barangay}
                onChange={handleChange}
                className={`flex h-10 w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${errors.barangay ? 'border-red-400' : 'border-slate-300'}`}
              >
                <option value="">Select barangay...</option>
                {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {errors.barangay && <p className="text-xs text-red-600">{errors.barangay}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what happened, where exactly, and current situation..."
              className={`flex w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${errors.description ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Photo (optional, max 5MB)</label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-colors">
                <Upload className="h-7 w-7 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">Click to upload photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reports;
