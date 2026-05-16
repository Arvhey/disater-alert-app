import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, MapPin, ArrowRight, Bell, CloudRain, Wind, Droplets } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { useReports } from '../../hooks/useReports';
import { useWeather } from '../../hooks/useWeather';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { reports, loading: reportsLoading } = useReports(isAdmin ? null : user?.id);
  const { weather, loading: weatherLoading, refresh: refreshWeather } = useWeather();

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-4 sm:space-y-10 w-full sm:max-w-7xl sm:mx-auto relative z-10">
      {/* Top Section: Banner & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Welcome Banner */}
        <div className="lg:col-span-2 flex flex-col justify-center pt-2 sm:pt-4 px-1 sm:px-0">
          <h1 className="text-lg sm:text-5xl font-black text-white mb-2 sm:mb-4 tracking-tight leading-tight uppercase">
            {getGreeting()}, <br className="sm:hidden" />{displayName} <span className="inline-block hover:animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-brand-100/60 text-xs sm:text-lg font-bold max-w-xl leading-relaxed">
            MDRRMO Polomolok Intelligence Network active.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-8">
            {isAdmin && (
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-[8px] sm:text-xs font-black border border-amber-500/20 uppercase tracking-widest">
                Admin
              </span>
            )}
            <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-[8px] sm:text-xs font-black border border-brand-500/20 flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-brand-400 animate-pulse"></span>
              Live Intel
            </span>
          </div>
        </div>

        {/* Live Weather Widget */}
        <div className="lg:col-span-1 group">
          <div className="h-full bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-[40px] p-4 sm:p-8 border border-white/10 text-white shadow-2xl relative overflow-hidden transition-all duration-500 hover:bg-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-4 sm:mb-10">
                <button 
                  onClick={(e) => { e.preventDefault(); refreshWeather(); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all active:scale-95 group/scan"
                  title="Force Tactical Scan"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${weatherLoading ? 'bg-amber-400 animate-spin' : 'bg-green-400'} shadow-[0_0_8px_rgba(74,222,128,0.5)]`}></div>
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white/30 group-hover/scan:text-brand-400 transition-colors">Env Scan</span>
                </button>
                <Link to="/forecasting" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-brand-500/20 hover:border-brand-500/50 transition-all">
                  <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" />
                </Link>
              </div>
              
              {weatherLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 sm:h-16 bg-white/10 rounded-2xl w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-7xl font-black mb-1 tracking-tighter">
                    {Math.round(weather?.temperature_2m || 0)}°C
                  </div>
                  <p className="text-[9px] sm:text-sm font-black text-brand-200/40 uppercase tracking-widest mb-6 sm:mb-12">Polomolok SC</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-1 sm:gap-2">
                  <div className="flex items-center gap-1 px-2 sm:px-4 py-1.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">
                    <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-brand-400" />
                    <span>{weather?.wind_speed_10m || 0}k/h</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 sm:px-4 py-1.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">
                    <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span>{weather?.relative_humidity_2m || 0}%</span>
                  </div>
                </div>
                <div className="text-[8px] sm:text-[10px] font-black text-white/10 tracking-widest uppercase">{currentTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-1 sm:px-0">
        {[
          { label: 'Broadcasts', value: stats.total, icon: Bell, color: 'bg-brand-600', shadow: 'shadow-brand-500/20', ic: 'text-white' },
          { label: 'High Alert', value: stats.high, icon: AlertTriangle, color: 'bg-red-500', shadow: 'shadow-red-500/20', ic: 'text-white' },
          { label: 'Med Alert', value: stats.medium, icon: AlertTriangle, color: 'bg-amber-500', shadow: 'shadow-amber-500/20', ic: 'text-white' },
          { label: 'Intel Logs', value: stats.reports, icon: FileText, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20', ic: 'text-white' }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-3.5 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-all duration-300">
            <item.icon className="absolute -right-3 -bottom-3 w-14 sm:w-24 h-14 sm:h-24 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl ${item.color} flex items-center justify-center mb-2.5 sm:mb-6 shadow-lg ${item.shadow}`}>
                <item.icon className={`w-4 h-4 sm:w-7 sm:h-7 ${item.ic}`} />
              </div>
              <div className="text-xl sm:text-4xl font-black text-white mb-0.5 tracking-tighter leading-none">{item.value}</div>
              <div className="text-[7px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3 sm:space-y-6">
        <div className="flex items-center justify-between px-2 sm:px-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 sm:h-5 bg-brand-500 rounded-full" />
            <h2 className="text-[10px] sm:text-xl font-black text-white uppercase tracking-[0.2em]">Active Intel</h2>
          </div>
          <Link to="/alerts" className="text-[8px] sm:text-xs font-black text-brand-400 uppercase tracking-widest hover:text-brand-300 flex items-center gap-1 transition-colors">
            All Data <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
          {alerts.slice(0, 2).map(alert => (
            <div key={alert.id} className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col group hover:bg-white/10 transition-all duration-500">
              <div className="p-4 sm:p-8 relative">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className={`w-9 h-9 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10 shadow-xl ${
                    alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : 
                    alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-brand-500/20 text-brand-400'
                  }`}>
                    <Bell className="w-4 h-4 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <h3 className="text-sm sm:text-xl font-black text-white tracking-tight uppercase truncate leading-tight">{alert.title}</h3>
                      <span className={`self-start sm:self-auto text-[7px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        alert.severity === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/20' : 
                        alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-brand-500/20 text-brand-300 border-brand-500/20'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-black text-white/10 uppercase tracking-widest">
                      {new Date(alert.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl sm:rounded-3xl p-3.5 sm:p-7 mt-3 sm:mt-6">
                  <p className="text-[11px] sm:text-base text-brand-50/70 font-medium leading-relaxed italic line-clamp-2">"{alert.message}"</p>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-20 border border-white/10 text-center col-span-1 md:col-span-2">
              <Bell className="h-10 w-10 sm:h-16 sm:w-16 text-white/10 mx-auto mb-4" />
              <p className="text-sm sm:text-xl text-white/30 font-black uppercase tracking-tight">No Active Intel</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1 h-4 sm:h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-[10px] sm:text-xl font-black text-white uppercase tracking-[0.2em]">Protocols</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8">
          {[
            { to: '/reports', icon: FileText, title: 'Dispatch', desc: 'Field Data', color: 'bg-brand-500/10', ic: 'text-brand-400' },
            { to: '/alerts', icon: AlertTriangle, title: 'Network', desc: 'System Intel', color: 'bg-amber-500/10', ic: 'text-amber-400' },
            { to: '/evacuation-centers', icon: MapPin, title: 'Sectors', desc: 'Safe Zones', color: 'bg-emerald-500/10', ic: 'text-emerald-400' }
          ].map((action, i) => (
            <Link key={i} to={action.to} className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-10 border border-white/10 shadow-2xl hover:bg-white/10 transition-all text-center group border-transparent hover:border-brand-500/30">
              <div className={`w-10 h-10 sm:w-20 sm:h-20 ${action.color} rounded-xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-3 sm:mb-6 group-hover:scale-110 transition-all duration-500 border border-white/10`}>
                <action.icon className={`w-5 h-5 sm:w-10 sm:h-10 ${action.ic}`} />
              </div>
              <h3 className="text-sm sm:text-xl font-black text-white mb-0.5 uppercase tracking-tight leading-tight">{action.title}</h3>
              <p className="text-[7px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 sm:pt-12 pb-4 sm:pb-8 border-t border-white/5 mt-10 sm:mt-16 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-white/10">
          <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Polomolok Intelligence Network</span>
        </div>
        <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/5 text-center">
          System Version 2.4.0 • Ops Ready
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
