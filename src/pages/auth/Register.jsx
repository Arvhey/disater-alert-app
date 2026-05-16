import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Bell, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { signUp } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { BARANGAYS } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
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
      navigate('/login');
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

  return (
    <div className="min-h-screen flex w-full font-century-gothic">
      {/* Left hero panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex-col justify-between p-16 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-400/5 blur-[120px]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Polomolok DACS</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Join the <br />
            <span className="text-brand-200">Community</span> <br />
            Response
          </h1>
          <p className="text-brand-50 text-xl leading-relaxed max-w-md font-medium opacity-90">
            Register to receive real-time disaster alerts and help your barangay by reporting incidents.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg inline-block">
            <p className="text-white font-bold mb-1 flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-brand-200" />
              Serving Polomolok
            </p>
            <p className="text-brand-100 font-medium">{BARANGAYS.length} Barangays Covered</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-transparent overflow-y-auto">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/20 shadow-2xl my-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Polomolok DACS</p>
              <p className="text-xs text-brand-200 font-medium opacity-80">Disaster Alert System</p>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create an account</h2>
            <p className="text-brand-100 font-medium opacity-80">Join the safety network today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-brand-50 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                <input
                  name="fullName"
                  type="text"
                  placeholder="Juan dela Cruz"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`flex h-11 w-full rounded-xl border bg-white/5 pl-12 pr-4 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.fullName ? 'border-red-400' : 'border-white/10'}`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-brand-50 ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`flex h-11 w-full rounded-xl border bg-white/5 pl-12 pr-4 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.email ? 'border-red-400' : 'border-white/10'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Barangay */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-brand-50 ml-1">Barangay</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                <select
                  name="barangay"
                  value={form.barangay}
                  onChange={handleChange}
                  className={`flex h-11 w-full rounded-xl border bg-white/5 pl-12 pr-3 py-2 text-sm text-white transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.barangay ? 'border-red-400' : 'border-white/10'}`}
                >
                  <option value="" className="text-slate-900">Select your barangay</option>
                  {BARANGAYS.map(b => <option key={b} value={b} className="text-slate-900">{b}</option>)}
                </select>
              </div>
              {errors.barangay && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.barangay}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-brand-50 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={`flex h-11 w-full rounded-xl border bg-white/5 pl-12 pr-12 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.password ? 'border-red-400' : 'border-white/10'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-brand-50 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`flex h-11 w-full rounded-xl border bg-white/5 pl-12 pr-4 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.confirmPassword ? 'border-red-400' : 'border-white/10'}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg" className="h-12 text-base font-bold bg-brand-600 hover:bg-brand-500 border-none shadow-lg shadow-brand-600/20 mt-4">
              Create Account
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-brand-100 font-medium opacity-80">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
