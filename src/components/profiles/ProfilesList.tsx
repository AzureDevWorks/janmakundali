import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useProfilesQuery, useDeleteProfile } from '@/features/profiles/useProfiles';
import { useBirthStore } from '@/features/birth/birthStore';
import { storedToBirthProfile } from '@/features/profiles/profiles.types';
import { useProfileUIStore } from '@/features/profiles/profileUI.store';
import { cn } from '@/lib/utils';

export function ProfilesList() {
  const auth = useAuth();
  const query = useProfilesQuery(auth.user?.id);
  const del = useDeleteProfile();
  const current = useBirthStore((s) => s.profile);
  const currentId = useBirthStore((s) => s.currentProfileId);
  const setProfileWithId = useBirthStore((s) => s.setProfileWithId);
  const openCreate = useProfileUIStore((s) => s.openCreate);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (!auth.user) return null;

  if (query.isLoading) {
    return (
      <div className="border-b border-amber-200 px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          My profiles
        </p>
        <p className="mt-1 text-[11px] italic text-muted-foreground/60">Loading...</p>
      </div>
    );
  }

  const profiles = query.data ?? [];

  return (
    <div className="border-b border-amber-200">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          My profiles
        </p>
        <button
          onClick={openCreate}
          className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-100"
          title="Add a new profile"
        >
          {'\uFF0B'} Add
        </button>
      </div>

      {profiles.length === 0 ? (
        <p className="px-3 pb-3 text-[11px] italic text-muted-foreground/60">
          No saved profiles yet.
        </p>
      ) : (
        <ul className="max-h-64 overflow-y-auto px-1 pb-2">
          {profiles.map((p) => {
            const isCurrent = currentId === p.id;
            const isConfirming = confirmId === p.id;
            return (
              <li key={p.id} className="mb-0.5">
                <div
                  className={cn(
                    'group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
                    isCurrent ? 'bg-amber-100/80' : 'hover:bg-amber-50',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setProfileWithId(p.id, storedToBirthProfile(p))}
                    className="flex min-w-0 flex-1 flex-col items-start text-left"
                  >
                    <span
                      className={cn(
                        'truncate text-[11px] font-semibold',
                        isCurrent ? 'text-amber-950' : 'text-foreground',
                      )}
                    >
                      {p.name}
                    </span>
                    <span className="truncate text-[9px] text-muted-foreground">
                      {p.birth_date} {p.place_name}
                    </span>
                  </button>

                  {isConfirming ? (
                    <>
                      <button
                        onClick={() => {
                          del.mutate(p.id);
                          setConfirmId(null);
                        }}
                        className="rounded px-1.5 py-0.5 text-[9px] font-bold text-red-700 hover:bg-red-50"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="rounded px-1.5 py-0.5 text-[9px] text-muted-foreground hover:bg-muted"
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      title="Delete profile"
                    >
                      <span className="text-[11px] text-muted-foreground hover:text-red-600">
                        {'\u2715'}
                      </span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}