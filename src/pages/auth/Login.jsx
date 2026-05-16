import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Bell, Eye, EyeOff, User, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { signIn, signUp } from '../../services/authService';
import Button from '../../components/ui/Button';
import { BARANGAYS } from '../../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // State
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ fullName: '', email: '', barangay: '', password: '', confirmPassword: '' });

  // Handlers
  const handleLoginChange = (e) => {
    setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleRegChange = (e) => {
    setRegForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginForm.email) errs.email = 'Email is required';
    if (!loginForm.password) errs.password = 'Password is required';
    return errs;
  };

  const validateReg = () => {
    const errs = {};
    if (!regForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!regForm.email) errs.email = 'Email is required';
    if (!regForm.barangay) errs.barangay = 'Select barangay';
    if (!regForm.password || regForm.password.length < 6) errs.password = 'Min. 6 characters';
    if (regForm.password !== regForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const email = loginForm.email.trim();
      const password = loginForm.password; // Usually passwords shouldn't be trimmed as spaces might be intentional, but email definitely should
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    const errs = validateReg();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signUp(regForm.email, regForm.password, regForm.fullName, regForm.barangay);
      toast.success('Account created! You can now sign in.');
      setIsRegistering(false);
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight animate-in slide-in-from-left duration-700">
            {isRegistering ? (
              <>Join the <br /><span className="text-brand-200">Community</span> <br />Response</>
            ) : (
              <>Disaster Alert <br /><span className="text-brand-200">&amp; Community</span> <br />Reporting</>
            )}
          </h1>
          <p className="text-brand-50 text-xl leading-relaxed max-w-md font-medium opacity-90">
            {isRegistering 
              ? "Register to receive real-time disaster alerts and help your barangay by reporting incidents."
              : "Real-time emergency monitoring and incident reporting for the Municipality of Polomolok."
            }
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { t: 'Real-time Alerts', d: 'Instant updates' },
            { t: 'Report Incidents', d: 'Community voice' },
            { t: 'Evacuation Info', d: 'Stay safe' }
          ].map(item => (
            <div key={item.t} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
              <p className="text-white font-bold text-sm mb-1">{item.t}</p>
              <p className="text-brand-200 text-xs">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-transparent overflow-y-auto">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-3xl p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/20 shadow-2xl my-8 transition-all duration-500">
          
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Polomolok DACS</p>
                <p className="text-xs text-brand-200 font-medium opacity-80">Disaster Alert System</p>
              </div>
            </div>
            {isRegistering && (
              <button 
                onClick={() => { setIsRegistering(false); setErrors({}); }}
                className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {!isRegistering ? (
            /* Login Form */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h2>
                <p className="text-brand-100 font-medium opacity-80">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-brand-50 ml-1">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      className={`flex h-12 w-full rounded-xl border bg-white/5 pl-12 pr-4 py-2 text-base text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.email ? 'border-red-400' : 'border-white/10'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.email}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-brand-50 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200/60 pointer-events-none" />
                    <input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className={`flex h-12 w-full rounded-xl border bg-white/5 pl-12 pr-12 py-2 text-base text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.password ? 'border-red-400' : 'border-white/10'}`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 font-medium mt-1 ml-1">{errors.password}</p>}
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg" className="h-12 text-base font-bold bg-brand-600 hover:bg-brand-500 border-none shadow-lg shadow-brand-600/20 mt-2">
                  Sign In
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t border-white/10 text-center">
                <p className="text-brand-100 font-medium opacity-80">
                  Don&apos;t have an account?{' '}
                  <button 
                    onClick={() => { setIsRegistering(true); setErrors({}); }}
                    className="text-brand-400 hover:text-brand-300 font-bold transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Register Form (Modal-style) */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col -m-6 sm:-m-8 lg:-m-10 relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 mb-4 lg:mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">Create Account</h3>
                <button 
                  onClick={() => { setIsRegistering(false); setErrors({}); }}
                  className="hidden lg:block p-2 -mr-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all focus:outline-none"
                  aria-label="Close Registration"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-8 pb-8">
                <form onSubmit={handleRegSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[10px] font-bold text-brand-200/80 uppercase tracking-wider ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
                        <input
                          name="fullName"
                          type="text"
                          placeholder="Juan dela Cruz"
                          value={regForm.fullName}
                          onChange={handleRegChange}
                          className={`flex h-10 w-full rounded-xl border bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.fullName ? 'border-red-400/50' : 'border-white/10'}`}
                        />
                      </div>
                      {errors.fullName && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.fullName}</p>}
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[10px] font-bold text-brand-200/80 uppercase tracking-wider ml-1">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
                        <input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={regForm.email}
                          onChange={handleRegChange}
                          className={`flex h-10 w-full rounded-xl border bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.email ? 'border-red-400/50' : 'border-white/10'}`}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[10px] font-bold text-brand-200/80 uppercase tracking-wider ml-1">Barangay</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
                        <select
                          name="barangay"
                          value={regForm.barangay}
                          onChange={handleRegChange}
                          className={`flex h-10 w-full rounded-xl border bg-white/5 pl-11 pr-3 py-2 text-sm text-white transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.barangay ? 'border-red-400/50' : 'border-white/10'}`}
                        >
                          <option value="" className="text-slate-900">Select your barangay</option>
                          {BARANGAYS.map(b => <option key={b} value={b} className="text-slate-900">{b}</option>)}
                        </select>
                      </div>
                      {errors.barangay && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1 uppercase tracking-tight">{errors.barangay}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-brand-200/80 uppercase tracking-wider ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
                        <input
                          name="password"
                          type={showPass ? 'text' : 'password'}
                          placeholder="Min. 6 chars"
                          value={regForm.password}
                          onChange={handleRegChange}
                          className={`flex h-10 w-full rounded-xl border bg-white/5 pl-11 pr-11 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.password ? 'border-red-400/50' : 'border-white/10'}`}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-brand-200/80 uppercase tracking-wider ml-1">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-200/40 pointer-events-none" />
                        <input
                          name="confirmPassword"
                          type="password"
                          placeholder="Repeat"
                          value={regForm.confirmPassword}
                          onChange={handleRegChange}
                          className={`flex h-10 w-full rounded-xl border bg-white/5 pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 ${errors.confirmPassword ? 'border-red-400/50' : 'border-white/10'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" fullWidth loading={loading} size="lg" className="h-11 text-sm font-bold bg-brand-600 hover:bg-brand-500 border-none shadow-lg shadow-brand-600/20 mt-2">
                    Create Account
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
