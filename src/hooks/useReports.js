import { useState, useEffect, useCallback } from 'react';
import { getReports, getUserReports, subscribeToReports } from '../services/reportService';
import { supabase } from '../supabase';

export const useReports = (userId = null) => {
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

    // REAL-TIME REPORT NOTIFICATION (For Admins)
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        // If we are in Admin mode (no specific userId), show a notification
        if (!userId) {
          toast.info(`📋 New Incident Report: ${payload.new.type} in ${payload.new.barangay}`, {
            position: "bottom-right",
            autoClose: 5000,
          });
        }
        fetchReports();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReports, userId]);

  return { reports, loading, error, refetch: fetchReports };
};
