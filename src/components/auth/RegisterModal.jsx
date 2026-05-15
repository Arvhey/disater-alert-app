import { useState } from 'react';
import { Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { signUp } from '../../services/authService';
import Button from '../ui/Button';
import { BARANGAYS } from '../../utils/constants';

const RegisterModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', barangay: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.barangay) errs.barangay = 'Select your barangay';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName, form.barangay);
      toast.success('Registration successful! You can now sign in.');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style>{`
        .glass-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .glass-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .glass-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .glass-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <h3 className="text-xl font-bold text-white tracking-tight">Create Account</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto max-h-[65vh] glass-scroll">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-brand-200/80 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
              <input
                name="fullName"
                type="text"
                placeholder="Juan dela Cruz"
                value={form.fullName}
                onChange={handleChange}
                className={`flex h-11 w-full rounded-xl border bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.fullName ? 'border-red-400/50' : 'border-white/10'}`}
              />
            </div>
            {errors.fullName && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.fullName}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-brand-200/80 uppercase tracking-wider ml-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`flex h-11 w-full rounded-xl border bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.email ? 'border-red-400/50' : 'border-white/10'}`}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-brand-200/80 uppercase tracking-wider ml-1">Barangay</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
              <select
                name="barangay"
                value={form.barangay}
                onChange={handleChange}
                className={`flex h-11 w-full rounded-xl border bg-white/5 pl-11 pr-3 py-2 text-sm text-white transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.barangay ? 'border-red-400/50' : 'border-white/10'}`}
              >
                <option value="" className="text-slate-900">Select your barangay</option>
                {BARANGAYS.map(b => <option key={b} value={b} className="text-slate-900">{b}</option>)}
              </select>
            </div>
            {errors.barangay && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.barangay}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-brand-200/80 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className={`flex h-11 w-full rounded-xl border bg-white/5 pl-11 pr-11 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.password ? 'border-red-400/50' : 'border-white/10'}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-brand-200/80 uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`flex h-11 w-full rounded-xl border bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.confirmPassword ? 'border-red-400/50' : 'border-white/10'}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg" className="h-11 text-sm font-bold bg-brand-600 hover:bg-brand-500 border-none shadow-lg shadow-brand-600/20 mt-4 rounded-xl">
            Create Account
          </Button>
        </form>
        
        <div className="p-8 pt-0 text-center">
          <p className="text-brand-100/40 font-medium text-[10px] uppercase tracking-widest">
            By joining, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
