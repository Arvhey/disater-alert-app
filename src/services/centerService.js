import { supabase } from '../supabase';

export const getCenters = async () => {
  const { data, error } = await supabase
    .from('evacuation_centers')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

export const createCenter = async (center) => {
  const { data, error } = await supabase
    .from('evacuation_centers')
    .insert([center])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCenter = async (id, updates) => {
  const { data, error } = await supabase
    .from('evacuation_centers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteCenter = async (id) => {
  const { error } = await supabase
    .from('evacuation_centers')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
