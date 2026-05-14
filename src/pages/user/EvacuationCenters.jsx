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
      setActiveCenterId(centerId); // This triggers the marker to appear
      leafletMap.current.setView([lat, lng], 18);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-xl shadow-emerald-100">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight leading-none">Evacuation Centers</h1>
          <p className="text-emerald-100 text-xs mt-3 font-medium max-w-[200px] leading-relaxed">
            Real-time availability and directions to safe zones across Polomolok.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="card overflow-hidden h-[300px] relative border-none shadow-xl shadow-slate-200/50 rounded-[2rem]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader />
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" id="map" />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
          <input
            type="text"
            placeholder="Search centers or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-none bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
          />
        </div>
        <select
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl border-none bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
        >
          <option value="All">All Barangays</option>
          {BARANGAYS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="card p-12 text-center">
          <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No evacuation centers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div key={center.id} className="card group hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Home className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {center.barangay}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{center.name}</h3>
                
                <div className="space-y-3 text-sm text-slate-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{center.address || 'No address provided.'}</span>
                  </div>
                  {center.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>Capacity: {center.capacity} people</span>
                    </div>
                  )}
                  {center.contact_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{center.contact_number}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    center.status === 'Full' 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : center.status === 'Closed'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {center.status === 'Full' ? '⚠️' : center.status === 'Closed' ? '❌' : '✅'}
                    {center.status || 'Open'}
                  </span>
                  {center.latitude && center.longitude && (
                    <button 
                      onClick={() => centerOnMap(center.latitude, center.longitude, center.id)}
                      className="flex items-center gap-1 text-brand-600 text-xs font-bold hover:underline"
                    >
                      <MapIcon className="h-3 w-3" /> Pin on Map
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
