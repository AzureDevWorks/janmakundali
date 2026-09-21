import { useState } from 'react';
import { AuthModal } from '@/features/auth/AuthModal';
import { SANSKRIT, OM, DOUBLE_DANDA } from '@/lib/text';

interface Props {
  /** Optional - kept for compatibility, unused now. */
  onContinueAsGuest?: () => void;
}

const FEATURES = [
  {
    icon: '\u2609',
    title: 'Complete Birth Chart',
    desc: 'Lagna, 9 planets, 12 houses, nakshatras, dignities - plus 20 divisional charts from D1 to D60.',
  },
  {
    icon: '\u23F3',
    title: 'Predictive Dashas',
    desc: 'Vimshottari with 3-level cascade, Ashtakavarga, KP system, Chalit, Arudhas, Jaimini karakas.',
  },
  {
    icon: '\uD83D\uDCC5',
    title: 'Daily Panchang',
    desc: 'Tithi, nakshatra, muhurtas, Choghadiya, Rahu Kalam - with GPS-based location detection.',
  },
  {
    icon: '\u2604',
    title: 'Live Transits',
    desc: 'Gochar analysis, Sade Sati, Dhaiya, Vedha detection, and upcoming planetary events.',
  },
];

export function LandingView(_props: Props = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signup');

  const openSignUp = () => {
    setModalMode('signup');
    setModalOpen(true);
  };

  const openSignIn = () => {
    setModalMode('signin');
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-amber-50/40 to-background">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-red-200/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none text-amber-700" aria-hidden="true">
            {OM}
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-amber-900">
            Janma Kundali
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openSignIn}
            className="rounded-md border border-amber-300 bg-white/60 px-4 py-1.5 text-xs font-semibold text-amber-900 backdrop-blur-sm transition-colors hover:bg-white"
          >
            Sign in
          </button>
          <button
            onClick={openSignUp}
            className="rounded-md bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md"
          >
            Sign up
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-12 text-center lg:pt-20">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-300/60 bg-gradient-to-br from-amber-100 via-amber-50 to-white shadow-[0_20px_50px_-20px_rgba(180,83,9,0.4)]">
          <span className="text-5xl leading-none text-amber-700" aria-hidden="true">
            {OM}
          </span>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-700">
          Vedic Astrology
        </p>
        <h1 className="mt-3 font-serif text-5xl font-bold tracking-tight text-amber-950 sm:text-6xl">
          Janma Kundali
        </h1>
        <p className="mt-3 font-serif text-base text-amber-700/80" lang="sa">
          {DOUBLE_DANDA} {SANSKRIT.vaidikaJanmaKundali} {DOUBLE_DANDA}
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Compute your complete Vedic birth chart in your browser - planets, houses,
          divisional charts, Vimshottari dasha, transits, and daily panchang.
          Free forever, no credit card required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={openSignUp}
            className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.5)] transition-all hover:shadow-[0_12px_28px_-6px_rgba(234,88,12,0.6)]"
          >
            Create free account
          </button>
          <button
            onClick={openSignIn}
            className="rounded-lg border border-amber-300 bg-white/70 px-6 py-3 text-sm font-semibold text-amber-900 backdrop-blur-sm transition-colors hover:bg-white"
          >
            Sign in
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Your birth data is stored securely in your own account and can be accessed
          from any device you sign in on.
        </p>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-amber-200/70 bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 text-lg text-amber-700">
                {f.icon}
              </div>
              <p className="mt-3 font-serif text-base font-bold tracking-tight text-amber-950">
                {f.title}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            100% client-side computation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            No paid API keys
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Your data stays with you
          </span>
        </div>
      </main>

      <footer className="relative z-10 border-t border-amber-200/60 bg-white/40 py-6 text-center backdrop-blur-sm">
        <p className="font-serif text-xs italic text-amber-700/80" lang="sa">
          {DOUBLE_DANDA} {SANSKRIT.shreeGaneshaya} {DOUBLE_DANDA}
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Open source under MIT &middot; 2026
        </p>
      </footer>

      <AuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
      />
    </div>
  );
}