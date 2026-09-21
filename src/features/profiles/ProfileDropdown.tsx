import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useBirthStore } from '@/features/birth/birthStore';
import { useProfileUIStore } from './profileUI.store';
import { cn } from '@/lib/utils';

export function ProfileDropdown() {
  const auth = useAuth();
  const profile = useBirthStore((s) => s.profile);
  const currentProfileId = useBirthStore((s) => s.currentProfileId);
  const { openCreate, openEdit } = useProfileUIStore();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  if (!auth.user) return null;

  const email = auth.user.email ?? '';
  const initials = email.split('@')[0].slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 py-1 pl-1 pr-3 text-xs font-medium shadow-sm transition-colors hover:bg-white',
          open && 'ring-2 ring-amber-300',
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 font-serif text-[10px] font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate text-amber-950 sm:inline">
          {profile?.name ?? email}
        </span>
        <span className="text-[9px] text-amber-700">{'\u25BE'}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-amber-200 bg-card shadow-2xl animate-modal-panel"
        >
          <div className="border-b border-amber-100 bg-amber-50/40 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-xs font-medium text-amber-950">{email}</p>
          </div>

          <ul className="p-1.5">
            {currentProfileId && (
              <li>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    openEdit(currentProfileId);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium hover:bg-amber-50"
                >
                  <span className="text-base leading-none">{'\u270E'}</span>
                  Edit current profile
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  openCreate();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium hover:bg-amber-50"
              >
                <span className="text-base leading-none">{'\uFF0B'}</span>
                Add new profile
              </button>
            </li>
          </ul>

          <div className="border-t border-amber-100 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => auth.signOut()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-red-700 hover:bg-red-50"
            >
              <span className="text-base leading-none">{'\u21A9'}</span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}