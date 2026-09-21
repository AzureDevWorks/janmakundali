import { supabase, supabaseEnabled } from '@/lib/supabase';
import type { BirthProfile } from '@/features/birth/birthStore';
import { birthProfileToRow, type StoredProfile } from './profiles.types';

export async function listProfiles(): Promise<StoredProfile[]> {
  if (!supabaseEnabled) return [];
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as StoredProfile[];
}

export async function saveProfile(
  profile: BirthProfile,
  relation?: string,
): Promise<StoredProfile> {
  if (!supabaseEnabled) throw new Error('Supabase not configured.');
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not signed in.');
  const row = {
    ...birthProfileToRow(profile, userData.user.id),
    relation: relation ?? null,
  };
  const { data, error } = await supabase
    .from('profiles')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data as StoredProfile;
}

export async function updateProfile(
  id: string,
  profile: BirthProfile,
): Promise<StoredProfile> {
  if (!supabaseEnabled) throw new Error('Supabase not configured.');
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not signed in.');
  const row = birthProfileToRow(profile, userData.user.id);
  const { data, error } = await supabase
    .from('profiles')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as StoredProfile;
}

export async function deleteProfile(id: string): Promise<void> {
  if (!supabaseEnabled) return;
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}