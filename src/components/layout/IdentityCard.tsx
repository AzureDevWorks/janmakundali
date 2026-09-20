import { useBirthStore } from '@/features/birth/birthStore';
import { useKundli } from '@/features/kundli/useKundli';
import { rashiByName } from '@/lib/astro';
import { cn } from '@/lib/utils';

export function IdentityCard() {
  const profile = useBirthStore((s) => s.profile);
  const { data: kundli } = useKundli();

  if (!profile) return null;

  const asc = kundli?.ascendant;
  const sun = kundli?.planets?.Sun;
  const moon = kundli?.planets?.Moon;

  const lagnaRashi = asc?.rashiName ? rashiByName(asc.rashiName) : null;
  const sunRashi   = sun?.rashiName ? rashiByName(sun.rashiName) : null;
  const moonRashi  = moon?.rashiName ? rashiByName(moon.rashiName) : null;

  const age = kundli?.birthDetails?.age?.years;
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="border-b border-amber-200 bg-gradient-to-br from-amber-50 via-amber-50/60 to-transparent p-4">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 font-serif text-base font-bold text-white shadow-sm">
          {initials || '\u0950'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-sm font-bold text-amber-950">
            {profile.name}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {profile.birthDate}
            {age != null && (
              <>
                <span className="mx-1 opacity-40">{'\u00B7'}</span>
                {age} yrs
              </>
            )}
          </p>
        </div>
      </div>

      {/* Rashi chips */}
      <div className="mt-3 space-y-1.5">
        {lagnaRashi && (
          <RashiRow
            label="Lagna"
            symbol={lagnaRashi.symbol}
            name={lagnaRashi.name}
            tone="amber"
          />
        )}
        {moonRashi && (
          <RashiRow
            label="Moon"
            symbol={moonRashi.symbol}
            name={moonRashi.name}
            tone="slate"
          />
        )}
        {sunRashi && (
          <RashiRow
            label="Sun"
            symbol={sunRashi.symbol}
            name={sunRashi.name}
            tone="orange"
          />
        )}
      </div>
    </div>
  );
}

function RashiRow({
  label, symbol, name, tone,
}: {
  label: string; symbol: string; name: string;
  tone: 'amber' | 'slate' | 'orange';
}) {
  const toneClass = {
    amber:  'text-amber-900',
    slate:  'text-slate-800',
    orange: 'text-orange-800',
  }[tone];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-10 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-base leading-none">{symbol}</span>
      <span className={cn('truncate font-medium', toneClass)}>{name}</span>
    </div>
  );
}