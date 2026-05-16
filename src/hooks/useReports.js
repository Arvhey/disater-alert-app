import { useState, useEffect, useCallback } from 'react';
import { getReports, getUserReports, subscribeToReports } from '../services/reportService';
import { supabase } from '../supabase';

export const useReports = (userId = null, onNewReport = null) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = userId ? await getUserReports(userId) : await getReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReports();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          // If userId is provided, only add if it belongs to this user
          if (userId && payload.new.user_id !== userId) return;
          
          setReports(prev => [payload.new, ...prev]);
          if (typeof onNewReport === 'function') {
            onNewReport(payload.new);
          }
        } else if (payload.eventType === 'UPDATE') {
          setReports(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
        } else if (payload.eventType === 'DELETE') {
          setReports(prev => prev.filter(r => r.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReports, userId]);

  return { reports, loading, error, refetch: fetchReports };
};
