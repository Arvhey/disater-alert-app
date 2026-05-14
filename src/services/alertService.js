import { supabase } from '../supabase';

export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createAlert = async (alert) => {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateAlert = async (id, updates) => {
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAlert = async (id) => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const subscribeToAlerts = (callback) => {
  const channel = supabase
    .channel('alerts-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, callback)
    .subscribe();
  return channel;
};
