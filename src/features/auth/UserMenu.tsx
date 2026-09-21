import { useState } from 'react';
import { useAuth } from './useAuth';
import { AuthModal } from './AuthModal';

export function UserMenu() {
  const auth = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!auth.enabled) return null;
  if (auth.loading) return <span className="h-8 w-8 animate-pulse rounded-full bg-amber-100" />;

  if (!auth.user) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50"
        >
          Sign in
        </button>
        <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const email = auth.user.email ?? '';
  const initials = email.split('@')[0].slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[11px] text-muted-foreground sm:inline">{email}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 font-serif text-[10px] font-bold text-white shadow-sm">
        {initials}
      </span>
      <button
        onClick={() => auth.signOut()}
        className="rounded-md border border-amber-300 px-2.5 py-1.5 text-[11px] font-medium text-amber-900 hover:bg-amber-50"
      >
        Sign out
      </button>
    </div>
  );
}