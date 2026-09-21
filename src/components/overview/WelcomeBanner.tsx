import { useBirthStore } from '@/features/birth/birthStore';

interface Props {
  kundli: any;
}

export function WelcomeBanner({ kundli }: Props) {
  const profile = useBirthStore((s) => s.profile);
  if (!profile) return null;

  const age = kundli?.birthDetails?.age?.years ?? null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-amber-50/60 to-background px-6 py-5 shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">
            Janma Kundali
          </p>
          <h1 className="mt-1 truncate font-serif text-3xl font-bold tracking-tight text-amber-950 sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {age != null && (
              <>
                <span>{age} years</span>
                <span className="opacity-40">{'\u00B7'}</span>
              </>
            )}
            <span>{profile.birthDate}</span>
            <span className="opacity-40">{'\u00B7'}</span>
            <span>{profile.birthTime}</span>
            <span className="opacity-40">{'\u00B7'}</span>
            <span className="truncate">{profile.place.displayName}</span>
          </p>
        </div>
      </div>
    </section>
  );
}