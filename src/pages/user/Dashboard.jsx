import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, MapPin, ArrowRight, Bell, CloudRain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { useReports } from '../../hooks/useReports';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { reports, loading: reportsLoading } = useReports(isAdmin ? null : user?.id);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => ({
    total: alerts.length,
    high: alerts.filter(a => a.severity?.toLowerCase() === 'high').length,
    medium: alerts.filter(a => a.severity?.toLowerCase() === 'medium').length,
    reports: reports.length,
  }), [alerts, reports]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  if (alertsLoading || reportsLoading) {
    return <div className="flex justify-center items-center h-64"><Loader /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Section: Banner & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Welcome Banner */}
        <div className="lg:col-span-2 flex flex-col justify-center pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-3">
            Good morning, {displayName} <span className="inline-block hover:animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-slate-500 text-[15px] mb-6">
            Welcome to the Polomolok Disaster Alert System. Stay informed, stay safe.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold shadow-sm">
                Admin View
              </span>
            )}
            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Live Updates Active
            </span>
          </div>
        </div>

        {/* Live Weather Widget */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#0ea5e9] to-[#3b82f6] rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">Live Weather</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div>
                <div className="text-5xl font-bold mb-1 tracking-tight">29°C</div>
                <p className="text-sm font-medium text-white/90 mb-6">Polomolok, SC</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm">
                    🍃 12 km/h
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm">
                    💧 74%
                  </div>
                </div>
                <div className="text-xs font-bold text-white/90">{currentTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <Bell className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#0284c7] flex items-center justify-center mb-4 shadow-md shadow-sky-200">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stats.total}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Alerts</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <AlertTriangle className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mb-4 shadow-md shadow-red-200">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stats.high}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <AlertTriangle className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4 shadow-md shadow-amber-200">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stats.medium}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medium</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <FileText className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-4 shadow-md shadow-emerald-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stats.reports}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-slate-800">Recent Alerts</h2>
          <Link to="/alerts" className="text-[13px] font-bold text-[#0284c7] hover:text-sky-700 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.slice(0, 2).map(alert => (
            <div key={alert.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className={`w-1 h-full absolute left-0 top-0 bottom-0 ${
                alert.severity === 'high' ? 'bg-red-500' : 
                alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
              }`}></div>
              <div className="p-5 pl-6 relative">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'high' ? 'bg-red-100' : 
                    alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1 capitalize">{alert.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                        alert.severity === 'high' ? 'text-red-600 border-red-200' : 
                        alert.severity === 'medium' ? 'text-amber-600 border-amber-200' : 'text-blue-600 border-blue-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(alert.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 ml-12">
                  <p className="text-sm text-slate-600 font-medium italic">"{alert.message}"</p>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center col-span-2">
              <Bell className="h-8 w-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">No active alerts at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-[15px] font-bold text-slate-800">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/reports" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-[#0284c7]" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-1">Submit a Report</h3>
            <p className="text-xs font-medium text-slate-500">Report an incident in your area</p>
          </Link>

          <Link to="/alerts" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-1">View All Alerts</h3>
            <p className="text-xs font-medium text-slate-500">See active disaster alerts</p>
          </Link>

          <Link to="/evacuation-centers" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-1">Evacuation Centers</h3>
            <p className="text-xs font-medium text-slate-500">Find nearest evacuation sites</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 pb-4 border-t border-slate-200 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Bell className="w-4 h-4" />
          <span className="text-xs font-bold">Polomolok Disaster Alert & Community Reporting System</span>
        </div>
        <p className="text-xs font-medium text-slate-400">
          Municipality of Polomolok, South Cotabato © 2026
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
