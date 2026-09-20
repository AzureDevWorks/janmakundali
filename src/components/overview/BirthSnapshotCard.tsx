import { useBirthStore } from '@/features/birth/birthStore';

export function BirthSnapshotCard() {
  const profile = useBirthStore((s) => s.profile);
  if (!profile) return null;

  const rows: [string, string][] = [
    ['Born',         profile.birthDate + ' \u00B7 ' + profile.birthTime],
    ['Place',        profile.place.displayName],
    ['Coordinates',  profile.place.latitude.toFixed(4) + ', ' + profile.place.longitude.toFixed(4)],
    ['Timezone',     profile.place.timezone + ' (' + profile.place.utcOffset + ')'],
    ['Ayanamsa',     profile.ayanamsa],
    ['House system', profile.houseSystem.replace('_', ' ')],
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-baseline gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
          Birth Details
        </span>
      </header>

      <dl className="divide-y divide-amber-100">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 px-5 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {k}
            </dt>
            <dd className="text-right text-xs font-medium text-amber-950">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}