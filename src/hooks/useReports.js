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
  }, [fetchReports, userId]);

  return { reports, loading, error, refetch: fetchReports };
};
