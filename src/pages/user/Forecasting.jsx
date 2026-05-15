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
    <div className="space-y-8 pb-12 pt-4">
      {/* Critical Evacuation Alert - Only show during landfall threat */}
      {isLandfallThreat && (
        <div className="bg-red-600 rounded-3xl p-6 text-white shadow-xl shadow-red-200 animate-pulse border-4 border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">CRITICAL EVACUATION ALERT</h2>
                <p className="text-red-100 font-bold">Typhoon Amang making landfall in Polomolok area. Immediate evacuation required for all low-lying and landslide-prone areas.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/evacuation-centers" className="px-6 py-3 bg-white text-red-600 rounded-xl font-black text-sm hover:bg-red-50 transition-colors shadow-lg">
                FIND NEAREST CENTER
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${simulationMode ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
            <span className={`text-[10px] font-bold ${simulationMode ? 'text-amber-600' : 'text-emerald-600'} uppercase tracking-widest`}>
              {simulationMode ? 'Simulation Active' : 'Live API Connection Active'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Real-Time Forecast</h1>
          <p className="text-slate-500 font-medium mt-1">Live data from Open-Meteo for Polomolok, SC</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setSimulationMode(!simulationMode)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              simulationMode 
                ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-200' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-[#0284c7] hover:text-[#0284c7]'
            }`}
          >
            {simulationMode ? 'Stop Simulation' : 'Run Simulation'}
          </button>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveTab('typhoon')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'typhoon' ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Typhoon
            </button>
            <button 
              onClick={() => setActiveTab('flood')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'flood' ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200' : 'text-slate-500 hover:bg-slate-50'}`}
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-8 text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Active Warning</span>
                    <span className="text-white/60 text-xs font-bold">Updated 5 mins ago</span>
                  </div>
                  <h2 className="text-4xl font-black mb-2 tracking-tight">
                    {typhoonData.name === 'None Active' ? 'No Active Typhoon' : typhoonData.name}
                  </h2>
                  <p className="text-sky-300 font-bold text-lg mb-8">
                    {typhoonData.name === 'None Active' ? 'Atmospheric conditions are currently stable' : `${typhoonData.status} • ${typhoonData.path}`}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <Wind className="h-5 w-5 text-sky-300 mb-2" />
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Max Winds</p>
                      <p className="text-xl font-bold">{typhoonData.windSpeed}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <TrendingUp className="h-5 w-5 text-amber-300 mb-2" />
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Gustiness</p>
                      <p className="text-xl font-bold">{typhoonData.gustiness}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <Navigation className="h-5 w-5 text-emerald-300 mb-2" />
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Distance</p>
                      <p className="text-xs font-bold leading-tight mt-1">{typhoonData.distance}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <AlertTriangle className="h-5 w-5 text-red-300 mb-2" />
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Local Impact</p>
                      <p className="text-xl font-bold">{typhoonData.riskLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Forecast Track</h3>
                  <button 
                    onClick={() => setShowFullMap(true)}
                    className="text-sm font-bold text-[#0284c7] flex items-center gap-1 hover:underline"
                  >
                    Open Full Map <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {/* Real Interactive Map Section */}
                <div className="aspect-[4/3] sm:aspect-[16/9] bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-200 shadow-inner group">
                  <div id="map-container" className="w-full h-full z-10">
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
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-[30] pointer-events-none scale-75 sm:scale-100 origin-bottom-left">
                    <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Live Telemetry</p>
                        <p className="text-xs font-bold text-white">GIS Core Active • OpenStreetMap</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[30]">
                    <button 
                      onClick={() => setShowFullMap(true)}
                      className="bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black text-slate-800 shadow-lg border border-white/20 hover:bg-white transition-all uppercase tracking-widest"
                    >
                      Switch to Satellite
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <CloudRain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Rainfall & Flood Monitoring</h3>
                    <p className="text-slate-500 text-sm font-medium">Real-time river levels and drainage status</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {floodData.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 group hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <p className="font-bold text-slate-800">{item.area}</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.risk === 'High' ? 'bg-red-100 text-red-700' : 
                          item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.risk} Risk
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>Current Level</span>
                          <span className={item.risk === 'High' ? 'text-red-600' : 'text-slate-600'}>{item.level}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              item.risk === 'High' ? 'bg-red-500' : 
                              item.risk === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>Threshold</span>
                          <span>{item.threshold}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-blue-200">
                 <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                    <Info className="h-8 w-8" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold mb-1">Precautionary Measures</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">Flood warnings are active in low-lying areas. Residents near river banks are advised to prepare for possible evacuation if rainfall exceeds 50mm within 24 hours.</p>
                 </div>
                 <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap hover:bg-blue-50 transition-colors ml-auto">
                    Safety Guidelines
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Weather Sidebar */}
        <div className="space-y-8">
          {/* Quick Weather Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Current Conditions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Thermometer className="h-5 w-5 text-[#0284c7]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Temperature</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{weatherStats.temp}°C</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Droplets className="h-5 w-5 text-[#0284c7]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Humidity</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{weatherStats.humidity}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Wind className="h-5 w-5 text-[#0284c7]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Wind Speed</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{weatherStats.wind} km/h</span>
              </div>
            </div>
          </div>

          {/* Advisories */}
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-900">Local Advisories</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                <p className="text-sm font-semibold text-red-800 leading-relaxed">
                  Heavy rainfall expected in Polomolok Highlands within 6 hours.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                <p className="text-sm font-semibold text-red-800 leading-relaxed">
                  Small sea crafts are advised not to venture out into the eastern seaboard.
                </p>
              </li>
            </ul>
          </div>

          {/* Emergency Hotline Card */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-sky-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] mb-2">Emergency Hotline</p>
              <h3 className="text-3xl font-black mb-6">Need help?</h3>
              <a href="tel:911" className="block w-full bg-[#0284c7] hover:bg-sky-600 text-white text-center py-4 rounded-2xl font-black transition-all shadow-lg shadow-sky-900/20 active:scale-95">
                CALL MDRRMO
              </a>
              <p className="text-center text-white/40 text-[10px] font-bold uppercase tracking-widest mt-4">Available 24/7</p>
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
