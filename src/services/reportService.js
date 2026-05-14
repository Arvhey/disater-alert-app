import { supabase } from '../supabase';

export const getReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select('*, users(full_name, barangay)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getUserReports = async (userId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createReport = async (report) => {
  const { data, error } = await supabase
    .from('reports')
    .insert(report)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateReportStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteReport = async (id) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const uploadReportImage = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { error } = await supabase.storage
    .from('report-images')
    .upload(filePath, file);
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('report-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const subscribeToReports = (callback) => {
  const channel = supabase
    .channel('reports-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, callback)
    .subscribe();
  return channel;
};
