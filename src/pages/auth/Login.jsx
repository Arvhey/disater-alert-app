import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Bell, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { signIn } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left hero panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Polomolok DACS</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Disaster Alert <br />
            <span className="text-brand-200">&amp; Community</span> <br />
            Reporting
          </h1>
          <p className="text-brand-50 text-xl leading-relaxed max-w-md font-medium opacity-90">
            Real-time emergency monitoring and incident reporting for the Municipality of Polomolok.
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white lg:bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 lg:p-10 lg:rounded-3xl lg:shadow-2xl lg:border lg:border-slate-100 my-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">Polomolok DACS</p>
              <p className="text-xs text-slate-500 font-medium">Disaster Alert System</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
              error={errors.email}
              autoComplete="email"
              className="h-12 text-base"
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`flex h-12 w-full rounded-xl border bg-white pl-12 pr-12 py-2 text-base placeholder:text-slate-400 transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 font-medium mt-1 ml-1">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg" className="h-12 text-base font-bold shadow-lg shadow-brand-100 mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
