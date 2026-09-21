import { useEffect } from 'react';
import { BirthForm } from '@/components/BirthForm';
import { useProfileUIStore } from './profileUI.store';
import { useAuth } from '@/features/auth/useAuth';
import { useBirthStore } from '@/features/birth/birthStore';
import { useSaveProfile, useUpdateProfile, useProfilesQuery } from './useProfiles';
import { storedToBirthProfile } from './profiles.types';

export function ProfileModal() {
  const { modalOpen, editingId, close } = useProfileUIStore();
  const auth = useAuth();
  const setProfile = useBirthStore((s) => s.setProfile);
  const setProfileWithId = useBirthStore((s) => s.setProfileWithId);

  const profilesQuery = useProfilesQuery(auth.user?.id);
  const saveProfileMutation = useSaveProfile();
  const updateProfileMutation = useUpdateProfile();

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen, close]);

  // Lock body scroll while open
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  if (!modalOpen) return null;

  const editing = editingId
    ? profilesQuery.data?.find((p) => p.id === editingId) ?? null
    : null;

  const initial = editing ? storedToBirthProfile(editing) : null;
  const isEdit = !!editing;

  const handleSubmit = async (info: any) => {
    if (isEdit && editingId) {
      // Update existing row
      const updated = await updateProfileMutation.mutateAsync({
        id: editingId,
        profile: info,
      });
      setProfileWithId(updated.id, info);
      close();
      return;
    }

    // Insert new row
    const created = await saveProfileMutation.mutateAsync({
      profile: info,
      relation: 'self',
    });
    setProfileWithId(created.id, info);
    close();
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-md animate-modal-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-2xl animate-modal-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-6 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
                {isEdit ? 'Edit profile' : 'Add new profile'}
              </p>
              <p className="mt-1 font-serif text-lg font-bold tracking-tight text-amber-950">
                {isEdit ? editing!.name : 'Birth details'}
              </p>
            </div>
            <button
              onClick={close}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-amber-50"
              aria-label="Close"
            >
              {'\u2715'}
            </button>
          </header>

          <div className="p-6">
            <BirthForm
              key={editingId ?? 'new'}
              initial={initial}
              onSubmit={handleSubmit}
              submitLabel={isEdit ? 'Save changes' : 'Save profile'}
              cancelLabel="Cancel"
              onCancel={close}
            />
          </div>
        </div>
      </div>
    </div>
  );
}