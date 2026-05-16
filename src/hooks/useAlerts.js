import { useState, useEffect, useCallback } from 'react';
import { getAlerts, subscribeToAlerts } from '../services/alertService';
import { supabase } from '../supabase';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();

    // REAL-TIME NOTIFICATION TRIGGER
    const channel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
        const newAlert = payload.new;
        
        // Show a high-priority toast notification
        const toastType = newAlert.severity.toLowerCase() === 'high' ? 'error' : 'warning';
        toast[toastType](`🚨 EMERGENCY ALERT: ${newAlert.title}`, {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Play sound alert
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(err => console.log('Audio playback blocked'));

        // Update the alerts list
        setAlerts(current => [newAlert, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
};
