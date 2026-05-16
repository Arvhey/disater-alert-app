import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Users, Home, Search, Map as MapIcon } from 'lucide-react';
import { supabase } from '../../supabase';
import Loader from '../../components/common/Loader';
import { BARANGAYS } from '../../utils/constants';

const EvacuationCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('All');
  const [activeCenterId, setActiveCenterId] = useState(null);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchCenters();
  }, []);

  // Fix for Leaflet default icon paths in React
  useEffect(() => {
    delete window.L.Icon.Default.prototype._getIconUrl;
    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!loading && mapRef.current && !leafletMap.current) {
      const polomolokCoords = [6.2239, 125.0628];
      
      // LOCKDOWN: Set max bounds so the map can't leave South Cotabato
      const southCotabatoBounds = [
        [5.8, 124.5], // South West
        [6.6, 125.5]  // North East
      ];

      leafletMap.current = window.L.map(mapRef.current, {
        center: polomolokCoords,
        zoom: 14,
        maxBounds: southCotabatoBounds,
        maxBoundsViscosity: 1.0
      });
      
      // Switch to Ultra-Detail Google Roadmap for maximum street name visibility
      window.L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20
      }).addTo(leafletMap.current);

      const resizeObserver = new ResizeObserver(() => {
        if (leafletMap.current) leafletMap.current.invalidateSize();
      });
      resizeObserver.observe(mapRef.current);

      setTimeout(() => {
        leafletMap.current.invalidateSize();
      }, 500);

      return () => resizeObserver.disconnect();
    }

    // Update Markers (Only show the ACTIVE center)
    if (leafletMap.current) {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      if (activeCenterId) {
        const center = centers.find(c => c.id === activeCenterId);
        if (center && center.latitude && center.longitude) {
          const lat = parseFloat(center.latitude);
          const lng = parseFloat(center.longitude);

          const marker = window.L.marker([lat, lng])
            .addTo(leafletMap.current)
            .bindPopup(`
              <div class="p-2 min-w-[150px]">
                <h4 class="font-bold text-slate-900">${center.name}</h4>
                <p class="text-xs text-slate-500 mt-1">${center.address}</p>
                <div class="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-[10px] font-bold text-brand-600 uppercase">Cap: ${center.capacity || 'N/A'}</span>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" class="text-[10px] font-bold text-blue-600 hover:underline">DIRECTIONS</a>
                </div>
              </div>
            `)
            .bindTooltip(center.name, {
              permanent: true,
              direction: 'top',
              className: 'bg-white border-none shadow-md font-bold text-slate-700 rounded px-2 py-1 text-[10px]'
            });
          
          markersRef.current.push(marker);
          marker.openPopup();
        }
      }
    }
  }, [loading, centers, activeCenterId]);

  const centerOnMap = (lat, lng, centerId) => {
    if (leafletMap.current && lat && lng) {
      setActiveCenterId(centerId);
      leafletMap.current.setView([lat, lng], 18);
      
      if (mapRef.current) {
        const scrollContainer = document.querySelector('main');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: mapRef.current.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('evacuation_centers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(search.toLowerCase()) ||
                         center.address?.toLowerCase().includes(search.toLowerCase());
    const matchesBarangay = selectedBarangay === 'All' || center.barangay === selectedBarangay;
    return matchesSearch && matchesBarangay;
  });

  return (
    <div className="space-y-6 sm:space-y-10 relative z-10 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-600/20 to-emerald-900/40 p-6 sm:p-12 text-white border border-emerald-500/20 shadow-2xl backdrop-blur-md">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">Safe Sectors</h1>
          <p className="text-emerald-100/60 text-xs sm:text-base mt-4 font-medium max-w-md leading-relaxed">
            Real-time evacuation intel and logistics for the Municipality of Polomolok.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white/5 backdrop-blur-xl overflow-hidden h-[300px] sm:h-[500px] relative border border-white/10 shadow-2xl rounded-[1.5rem] sm:rounded-[3rem]">
        {loading && (
          <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader />
          </div>
        )}
        <div ref={mapRef} className="h-full w-full grayscale-[0.2] contrast-[1.1] brightness-[0.9]" id="map" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 pointer-events-none transition-colors group-focus-within:text-emerald-400" />
          <input
            type="text"
            placeholder="Search sectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 sm:h-16 pl-14 pr-6 rounded-2xl border border-white/10 bg-white/5 shadow-2xl text-sm sm:text-base font-bold text-white outline-none focus:bg-white/10 focus:border-emerald-500/50 transition-all placeholder:text-white/20"
          />
        </div>
        <select
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
          className="w-full h-14 sm:h-16 px-6 rounded-2xl border border-white/10 bg-[#1e293b] shadow-2xl text-sm sm:text-base font-black text-white outline-none focus:bg-white/10 focus:border-emerald-500/50 transition-all cursor-pointer uppercase tracking-widest"
        >
          <option value="All" className="bg-[#1e293b] text-white">Global Sectors</option>
          {BARANGAYS.map(b => (
            <option key={b} value={b} className="bg-[#1e293b] text-white">{b}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl p-16 sm:p-24 text-center rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl">
          <Home className="h-12 w-12 sm:h-16 sm:w-16 text-white/5 mx-auto mb-6" />
          <p className="text-white/30 font-black uppercase tracking-tight text-lg">No Sectors Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {filteredCenters.map((center) => (
            <div key={center.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl group hover:bg-white/10 transition-all duration-500">
              <div className="p-6 sm:p-9">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                    <Home className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-400" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/5 text-white/40 rounded-full border border-white/10">
                    {center.barangay}
                  </span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-black text-white mb-4 uppercase tracking-tight leading-tight">{center.name}</h3>
                
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-bold text-white/30 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-emerald-500/50 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed truncate sm:whitespace-normal">{center.address || 'No location data.'}</span>
                  </div>
                  {center.capacity && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-white/10 flex-shrink-0" />
                      <span>Capacity: <span className="text-white/60">{center.capacity} PAX</span></span>
                    </div>
                  )}
                  {center.contact_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-white/10 flex-shrink-0" />
                      <span className="text-emerald-400/60 tracking-wider">{center.contact_number}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-lg flex items-center gap-1.5 ${
                    center.status === 'Full' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : center.status === 'Closed'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                    {center.status || 'Active'}
                  </span>
                  {center.latitude && center.longitude && (
                    <button 
                      onClick={() => centerOnMap(center.latitude, center.longitude, center.id)}
                      className="flex items-center gap-2 text-brand-400 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:text-brand-300 transition-colors"
                    >
                      <MapIcon className="h-4 w-4" /> Locate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvacuationCenters;
