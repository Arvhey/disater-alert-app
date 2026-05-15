import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  TrendingUp,
  Map as MapIcon,
  Navigation,
  X
} from 'lucide-react';

const FullMapModal = ({ isOpen, onClose, typhoonPath, currentPos }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-slate-900 overflow-hidden">
      {/* Absolute Map Container */}
      <div id="full-map-container" className="absolute inset-0 w-full h-full" />
      
      <MapInit 
        containerId="full-map-container"
        center={[6.5, 126.5]} 
        zoom={7} 
        typhoonPath={typhoonPath}
        currentPos={currentPos}
        isFull={true}
      />

      {/* Floating Header Overlay - Optimized for Mobile */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2 sm:gap-4 pointer-events-auto max-w-[70%] sm:max-w-none">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
            <MapIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
          </div>
          <div className="truncate">
            <h2 className="text-white font-black tracking-tight leading-tight uppercase text-[9px] sm:text-xs truncate">GIS Monitoring</h2>
            <p className="text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-0.5 truncate">Sector 7 • Live</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl transition-all border border-white/10 flex items-center justify-center text-white pointer-events-auto"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
      
      {/* Floating Legend - Optimized for Mobile */}
      <div className="absolute bottom-6 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-[1000] sm:w-[90%] sm:max-w-sm">
        <div className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/5">
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/5">
            <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em]">Map Intelligence</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase">Live</span>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"></div>
                <span className="text-[9px] sm:text-[11px] font-bold text-white/80">Active Center</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 sm:w-5 h-0.5 border-t-2 border-dashed border-red-400 opacity-60"></div>
                <span className="text-[9px] sm:text-[11px] font-bold text-white/80">Forecast Path</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0284c7] shadow-[0_0_12px_rgba(2,132,199,0.6)]"></div>
                <span className="text-[9px] sm:text-[11px] font-bold text-white/80">Command Base</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const MapInit = ({ containerId = 'map-container', center, zoom, typhoonPath, currentPos, isFull = false }) => {
  useEffect(() => {
    // Check if L exists (from CDN) and container exists
    if (typeof window.L === 'undefined') return;
    const container = document.getElementById(containerId);
    if (!container) return;

    const L = window.L;
    let map = null;
    let timeouts = [];

    try {
      // Initialize map
      map = L.map(containerId, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control to a safe position
      if (isFull) {
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        timeouts.push(setTimeout(() => map && map.invalidateSize(), 100));
        timeouts.push(setTimeout(() => map && map.invalidateSize(), 500));
      }

      // Add Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add Typhoon Path
      const polyline = L.polyline(typhoonPath, {
        color: '#ef4444',
        weight: 3,
        dashArray: '10, 10',
        opacity: 0.6
      }).addTo(map);

      // Add current position marker
      L.circleMarker(currentPos, {
        radius: 8,
        fillColor: '#ef4444',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Add Polomolok Marker
      L.circleMarker([6.2239, 125.0645], {
        radius: 5,
        fillColor: '#0284c7',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map).bindPopup('Polomolok Operations Center');

      // Zoom to fit path - Disable animation to prevent race conditions during rapid re-renders
      if (polyline.getBounds().isValid()) {
        map.fitBounds(polyline.getBounds(), { padding: [50, 50], animate: false });
      }

    } catch (err) {
      console.warn("Leaflet init error:", err);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      if (map) {
        try {
          map.remove();
          map = null;
        } catch (e) {
          console.warn("Leaflet cleanup error:", e);
        }
      }
    };
  }, [containerId, center, zoom, typhoonPath, currentPos, isFull]);

  return null;
};

const Forecasting = () => {
  const [activeTab, setActiveTab] = useState('typhoon');
  const [realWeather, setRealWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullMap, setShowFullMap] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);

  // Polomolok Coordinates: 6.2239° N, 125.0645° E
  const LAT = 6.2239;
  const LON = 125.0645;

  const typhoonPath = useMemo(() => [
    [5.0, 132.0],
    [5.8, 129.0],
    [6.1, 127.0],
    [6.2239, 125.0645] // Polomolok Landfall
  ], []);

  const currentPos = useMemo(() => [6.3, 125.5], []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        const data = await response.json();
        setRealWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const weatherStats = useMemo(() => {
    if (simulationMode) {
      return { temp: 24, humidity: 95, wind: 145, rainfall: 120, risk: 'Critical' };
    }
    if (!realWeather) return { temp: 29, humidity: 74, wind: 12, rainfall: 0, risk: 'Low' };
    return {
      temp: Math.round(realWeather.current.temperature_2m),
      humidity: realWeather.current.relative_humidity_2m,
      wind: Math.round(realWeather.current.wind_speed_10m),
      rainfall: realWeather.current.precipitation,
      risk: realWeather.current.precipitation > 50 ? 'Critical' : 
            realWeather.current.precipitation > 10 ? 'Elevated' : 'Low'
    };
  }, [realWeather, simulationMode]);

  const typhoonData = useMemo(() => {
    // In a real app, this would fetch from a cyclone API. 
    // For now, we use real wind speed to determine local hazard level.
    const isActive = weatherStats.wind > 60; // Tropical depression threshold
    return {
      name: isActive ? 'Tropical Depression' : 'None Active',
      status: isActive ? 'Monitoring Local Impact' : 'Atmospheric conditions are currently stable',
      windSpeed: `${weatherStats.wind} km/h`,
      gustiness: `${Math.round(weatherStats.wind * 1.2)} km/h`,
      distance: isActive ? 'Active storm detected in vicinity' : 'No active tropical cyclone in PAR',
      path: isActive ? 'Tracking local winds...' : 'N/A',
      etaPolomolok: isActive ? 'Current Impact' : 'N/A',
      riskLevel: weatherStats.wind > 100 ? 'High' : (isActive ? 'Moderate' : 'None')
    };
  }, [weatherStats]);

  const isLandfallThreat = useMemo(() => {
    return weatherStats.wind > 100 || weatherStats.rainfall > 80;
  }, [weatherStats]);

  const floodData = useMemo(() => {
    // Calculate risk based on real rainfall + topographic base
    const currentRain = weatherStats.rainfall;
    
    // Topographic baselines for Polomolok (simulated relative risk levels)
    const areas = [
      { name: 'Barangay Poblacion', base: 0.45, max: 2.0 },
      { name: 'Barangay Cannery Site', base: 0.82, max: 2.5 },
      { name: 'Barangay Lumakil', base: 0.21, max: 1.5 },
      { name: 'Barangay Koronadal Proper', base: 1.15, max: 2.5 },
    ];

    return areas.map(area => {
      const numericLevel = parseFloat((area.base + (currentRain * 0.15)).toFixed(2));
      const percentage = (numericLevel / area.max) * 100;
      
      let levelStatus = 'Normal';
      let riskStatus = 'Low';
      
      if (percentage > 85) { levelStatus = 'Critical'; riskStatus = 'High'; }
      else if (percentage > 50) { levelStatus = 'Elevated'; riskStatus = 'Medium'; }

      return {
        area: area.name,
        risk: riskStatus,
        level: levelStatus,
        currentValue: numericLevel,
        threshold: `${numericLevel}m / ${area.max}m`,
        percent: percentage
      };
    });
  }, [weatherStats]);

  const forecast7Days = useMemo(() => {
    if (!realWeather) return [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return realWeather.daily.time.map((time, i) => {
      const date = new Date(time);
      const code = realWeather.daily.weather_code[i];
      // Basic weather code mapping
      let Icon = Thermometer;
      let status = 'Clear';
      if (code >= 51) { Icon = CloudRain; status = 'Rainy'; }
      else if (code >= 1) { Icon = CloudRain; status = 'Cloudy'; } // Simplified
      
      return {
        day: days[date.getDay()],
        temp: Math.round(realWeather.daily.temperature_2m_max[i]),
        icon: Icon,
        rain: `${realWeather.daily.precipitation_probability_max[i]}%`,
        status: status
      };
    });
  }, [realWeather]);

  if (loading) return <div className="flex h-96 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;

  return (
    <div className="space-y-8 pb-12 pt-4 relative z-10 max-w-7xl mx-auto">
      {/* Critical Evacuation Alert - Only show during landfall threat */}
      {isLandfallThreat && (
        <div className="bg-red-600/20 backdrop-blur-xl rounded-[2.5rem] p-8 text-white shadow-2xl border-2 border-red-500/50 animate-pulse">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-red-500/30 rounded-3xl flex items-center justify-center shrink-0 border border-red-500/50">
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight uppercase">CRITICAL EVACUATION ALERT</h2>
                <p className="text-red-200 font-bold mt-1">Typhoon Amang making landfall. Immediate evacuation required for all low-lying areas.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/evacuation-centers" className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-sm hover:bg-red-400 transition-all shadow-lg shadow-red-500/40 active:scale-95">
                FIND NEAREST CENTER
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${simulationMode ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse shadow-[0_0_10px_currentColor]`} />
            <span className={`text-[10px] font-black ${simulationMode ? 'text-amber-400' : 'text-emerald-400'} uppercase tracking-[0.3em]`}>
              {simulationMode ? 'Simulation Mode Active' : 'Live Operations Active'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Forecasting Hub</h1>
          <p className="text-brand-100/60 font-bold mt-2">Precision GIS Intelligence for Polomolok, SC</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setSimulationMode(!simulationMode)}
            className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-2xl active:scale-95 ${
              simulationMode 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            {simulationMode ? 'Stop Simulation' : 'Run Simulation'}
          </button>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('typhoon')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'typhoon' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/30 hover:text-white'}`}
            >
              Typhoon
            </button>
            <button 
              onClick={() => setActiveTab('flood')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'flood' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/30 hover:text-white'}`}
            >
              Flood Risk
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Detailed View */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'typhoon' ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#0f172a] to-brand-900/20 p-10 text-white relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] -mr-20 -mt-20" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] animate-pulse border border-red-400/50">Active Warning</span>
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Update Refreshed 5m Ago</span>
                  </div>
                  <h2 className="text-5xl font-black mb-3 tracking-tighter uppercase">
                    {typhoonData.name === 'None Active' ? 'No Active Storm' : typhoonData.name}
                  </h2>
                  <p className="text-brand-300 font-bold text-lg mb-10 opacity-80">
                    {typhoonData.name === 'None Active' ? 'Atmospheric conditions remain stable' : `${typhoonData.status} • ${typhoonData.path}`}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                      <Wind className="h-5 w-5 text-brand-400 mb-3" />
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Max Winds</p>
                      <p className="text-xl font-black tracking-tight">{typhoonData.windSpeed}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                      <TrendingUp className="h-5 w-5 text-amber-400 mb-3" />
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Gustiness</p>
                      <p className="text-xl font-black tracking-tight">{typhoonData.gustiness}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                      <Navigation className="h-5 w-5 text-emerald-400 mb-3" />
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Distance</p>
                      <p className="text-xs font-black leading-tight mt-1 truncate">{typhoonData.distance}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                      <AlertTriangle className="h-5 w-5 text-red-400 mb-3" />
                      <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Impact Level</p>
                      <p className="text-xl font-black tracking-tight">{typhoonData.riskLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 border-t border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Geospatial Track</h3>
                  <button 
                    onClick={() => setShowFullMap(true)}
                    className="text-xs font-black text-brand-400 uppercase tracking-widest flex items-center gap-2 hover:text-brand-300 transition-colors"
                  >
                    Launch Full Interface <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {/* Real Interactive Map Section */}
                <div className="aspect-[4/3] sm:aspect-[16/9] bg-slate-900 rounded-[2.5rem] relative overflow-hidden border border-white/10 shadow-2xl group">
                  <div id="map-container" className="w-full h-full z-10 grayscale-[0.2] contrast-[1.1] brightness-[0.8]">
                    {/* The map will be initialized here */}
                  </div>
                  
                  {/* Custom Map Script to handle global Leaflet */}
                  <MapInit 
                    containerId="map-container"
                    center={[6.5, 126.5]} 
                    zoom={8} 
                    typhoonPath={typhoonPath}
                    currentPos={currentPos}
                  />

                  {/* Overlay Info Card */}
                  <div className="absolute bottom-6 left-6 z-[30] pointer-events-none scale-90 sm:scale-100 origin-bottom-left">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-0.5">Core Telemetry</p>
                        <p className="text-xs font-bold text-white">GIS NODE 04 ACTIVE • STABLE</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 z-[30]">
                    <button 
                      onClick={() => setShowFullMap(true)}
                      className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-xl text-[10px] font-black text-white shadow-2xl border border-white/10 hover:bg-white/20 transition-all uppercase tracking-[0.2em]"
                    >
                      Advanced Overlay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-brand-500/20 rounded-[20px] flex items-center justify-center border border-brand-500/20 shadow-lg">
                    <CloudRain className="h-7 w-7 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Hydro-Monitoring</h3>
                    <p className="text-white/40 text-sm font-bold mt-1">Real-time river hydraulics & drainage flow</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {floodData.map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-3xl p-6 border border-white/5 group hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <p className="font-bold text-white tracking-tight">{item.area}</p>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border ${
                          item.risk === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                          item.risk === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {item.risk} Risk
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
                          <span>Current Depth</span>
                          <span className={item.risk === 'High' ? 'text-red-400' : 'text-brand-300'}>{item.level}</span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.2)] ${
                              item.risk === 'High' ? 'bg-red-500' : 
                              item.risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                          <span>Critical Threshold</span>
                          <span className="text-white/40">{item.threshold}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-600/20 backdrop-blur-xl rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-brand-500/20">
                 <div className="bg-brand-500/30 p-5 rounded-3xl border border-brand-400/30 shadow-xl">
                    <Info className="h-8 w-8 text-brand-300" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Active Hydro Protocol</h4>
                    <p className="text-brand-100/60 text-sm leading-relaxed font-medium">Hydraulic sensors are active. Residents near river sectors are advised to maintain 50mm vigilance protocols.</p>
                 </div>
                 <button className="bg-brand-500 text-white px-8 py-4 rounded-2xl font-black text-sm whitespace-nowrap hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/40 active:scale-95">
                    VIEW PROTOCOLS
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Weather Sidebar */}
        <div className="space-y-8">
          {/* Quick Weather Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8">
            <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight">Current Stats</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl group-hover:bg-brand-500/20 transition-colors">
                    <Thermometer className="h-6 w-6 text-brand-400" />
                  </div>
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Temperature</span>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">{weatherStats.temp}°C</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl group-hover:bg-brand-500/20 transition-colors">
                    <Droplets className="h-6 w-6 text-brand-400" />
                  </div>
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Humidity</span>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">{weatherStats.humidity}%</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl group-hover:bg-brand-500/20 transition-colors">
                    <Wind className="h-6 w-6 text-brand-400" />
                  </div>
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest">Wind Velocity</span>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">{weatherStats.wind} km/h</span>
              </div>
            </div>
          </div>

          {/* Advisories */}
          <div className="bg-red-500/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-red-500/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <AlertTriangle className="h-7 w-7 text-red-400" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Intel</h3>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <p className="text-sm font-bold text-white/80 leading-relaxed">
                  Hydro-surge imminent in Sector 7 Highlands. Delta-grade rain detected.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-red-400/50 mt-2 shrink-0" />
                <p className="text-sm font-bold text-white/60 leading-relaxed">
                  Seaboard advisory: Small sea vessels remain docked.
                </p>
              </li>
            </ul>
          </div>

          {/* Emergency Hotline Card */}
          <div className="bg-gradient-to-br from-[#0f172a] to-brand-900/40 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:bg-brand-500/30 transition-all duration-1000" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] mb-3">Priority Ops</p>
              <h3 className="text-4xl font-black mb-8 leading-tight tracking-tighter">IMMEDIATE ASSISTANCE?</h3>
              <a href="tel:911" className="block w-full bg-brand-500 hover:bg-brand-400 text-white text-center py-5 rounded-2xl font-black transition-all shadow-xl shadow-brand-500/20 active:scale-95 border border-brand-400/50">
                CONTACT COMMAND
              </a>
              <p className="text-center text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mt-6">OPS CENTER ACTIVE • 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Map Modal */}
      <FullMapModal 
        isOpen={showFullMap} 
        onClose={() => setShowFullMap(false)}
        typhoonPath={typhoonPath}
        currentPos={currentPos}
      />
    </div>
  );
};

export default Forecasting;
