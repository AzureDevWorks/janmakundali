import { useAuth } from '@/features/auth/useAuth';
import { ProfileDropdown } from './ProfileDropdown';
import { useProfileUIStore } from './profileUI.store';
import { OM, SANSKRIT, DOUBLE_DANDA } from '@/lib/text';

export function WelcomeScreen() {
  const auth = useAuth();
  const openCreate = useProfileUIStore((s) => s.openCreate);

  const email = auth.user?.email ?? '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-amber-50/40 to-background">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none text-amber-700" aria-hidden="true">
            {OM}
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-amber-900">
            Janma Kundali
          </span>
        </div>
        <ProfileDropdown />
      </header>

      <main className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pt-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-300/60 bg-gradient-to-br from-amber-100 via-amber-50 to-white shadow-[0_20px_50px_-20px_rgba(180,83,9,0.4)]">
          <span className="text-4xl leading-none text-amber-700" aria-hidden="true">
            {OM}
          </span>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-700">
          Welcome
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">
          Let's cast your first chart
        </h1>
        <p className="mt-3 font-serif text-base text-amber-700/80" lang="sa">
          {DOUBLE_DANDA} {SANSKRIT.janmaKundali} {DOUBLE_DANDA}
        </p>

        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          You're signed in as{' '}
          <span className="font-medium text-amber-900">{email}</span>. Add your first
          birth chart to see the complete Vedic analysis - planets, dashas, divisional
          charts, panchang, and predictions.
        </p>

        <button
          onClick={openCreate}
          className="mt-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.5)] transition-all hover:shadow-[0_12px_28px_-6px_rgba(234,88,12,0.6)]"
        >
          Add birth details
        </button>

        <p className="mt-4 text-[11px] text-muted-foreground">
          You can add more profiles later for family and friends.
        </p>
      </main>
    </div>
  );
}