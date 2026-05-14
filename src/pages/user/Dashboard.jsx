import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, MapPin, TrendingUp, ArrowRight, Bell, Sun, Cloud, Wind, Droplets } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { useReports } from '../../hooks/useReports';
import AlertCard from '../../components/alerts/AlertCard';
import Loader from '../../components/common/Loader';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to} className="card p-4 flex flex-col gap-3 hover:shadow-md transition-all group border-none shadow-sm relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 opacity-10 ${color.replace('bg-', 'text-')}`}>
      <Icon className="w-full h-full" />
    </div>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color} shadow-sm`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</p>
    </div>
  </Link>
);

const WeatherWidget = () => (
  <div className="card overflow-hidden bg-gradient-to-br from-blue-600 via-brand-600 to-indigo-700 text-white border-none p-5 flex flex-col justify-between min-h-[160px] relative group shadow-lg shadow-blue-200/50">
    <div className="absolute -top-6 -right-6 opacity-20 group-hover:opacity-30 transition-opacity blur-2xl bg-white w-32 h-32 rounded-full" />
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Live Weather</p>
        </div>
        <h3 className="text-4xl font-black mt-2 tracking-tighter">29°C</h3>
        <p className="text-white/90 text-sm font-medium">Polomolok, SC</p>
      </div>
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 border border-white/30 shadow-inner">
        <Cloud className="h-7 w-7 text-white" />
      </div>
    </div>

    <div className="flex items-center gap-4 mt-8 relative z-10">
      <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
        <Wind className="h-3.5 w-3.5 text-blue-200" />
        <span className="text-[11px] font-bold">12 km/h</span>
      </div>
      <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
        <Droplets className="h-3.5 w-3.5 text-blue-200" />
        <span className="text-[11px] font-bold">74%</span>
      </div>
      <div className="ml-auto text-[9px] font-black uppercase tracking-tighter text-white/60">
        10:30 AM
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { reports, loading: reportsLoading } = useReports(isAdmin ? null : user?.id);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const stats = useMemo(() => ({
    total: alerts.length,
    high: alerts.filter(a => a.severity?.toLowerCase() === 'high').length,
    medium: alerts.filter(a => a.severity?.toLowerCase() === 'medium').length,
    reports: reports.length,
  }), [alerts, reports]);

  const recentAlerts = alerts.slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting()}, {displayName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome to the Polomolok Disaster Alert System. Stay informed, stay safe.
          </p>
          <div className="mt-4 flex gap-2">
            {isAdmin && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
                Admin View
              </span>
            )}
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200">
              Live Updates Active
            </span>
          </div>
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Bell} label="Total Alerts" value={stats.total} color="bg-brand-600" to="/alerts" />
        <StatCard icon={AlertTriangle} label="High" value={stats.high} color="bg-red-500" to="/alerts" />
        <StatCard icon={TrendingUp} label="Medium" value={stats.medium} color="bg-amber-500" to="/alerts" />
        <StatCard icon={FileText} label="Reports" value={stats.reports} color="bg-emerald-500" to="/reports" />
      </div>

      {/* Active high alert banner */}
      {stats.high > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800">
              {stats.high} high-severity alert{stats.high > 1 ? 's' : ''} active
            </p>
            <p className="text-xs text-red-600">Please follow official instructions from local authorities.</p>
          </div>
          <Link to="/alerts" className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1 flex-shrink-0">
            View <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Recent alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Alerts</h2>
          <Link to="/alerts" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {alertsLoading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : recentAlerts.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No alerts at the moment. Stay safe!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} isAdmin={false} />
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/reports" className="card p-5 hover:shadow-md transition-shadow group text-center">
            <FileText className="h-8 w-8 text-brand-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-slate-900">Submit a Report</p>
            <p className="text-xs text-slate-500 mt-1">Report an incident in your area</p>
          </Link>
          <Link to="/alerts" className="card p-5 hover:shadow-md transition-shadow group text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-slate-900">View All Alerts</p>
            <p className="text-xs text-slate-500 mt-1">See active disaster alerts</p>
          </Link>
          <Link to="/evacuation-centers" className="card p-5 hover:shadow-md transition-shadow group text-center">
            <MapPin className="h-8 w-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-slate-900">Evacuation Centers</p>
            <p className="text-xs text-slate-500 mt-1">Find nearest evacuation sites</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
