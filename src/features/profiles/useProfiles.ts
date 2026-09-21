import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BirthProfile } from '@/features/birth/birthStore';
import { listProfiles, saveProfile, updateProfile, deleteProfile } from './profilesApi';

const KEY = 'profiles';

export function useProfilesQuery(userId: string | null | undefined) {
  return useQuery({
    queryKey: [KEY, userId ?? 'anonymous'],
    queryFn: listProfiles,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ profile, relation }: { profile: BirthProfile; relation?: string }) =>
      saveProfile(profile, relation),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, profile }: { id: string; profile: BirthProfile }) =>
      updateProfile(id, profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}