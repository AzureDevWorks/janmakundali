import { usePanchangam } from '@/features/kundli/usePanchangam';
import { useBirthStore } from '@/features/birth/birthStore';
import { DOT } from '@/lib/text';
import {
  TITHI_NAMES, NAKSHATRA_NAMES, YOGA_NAMES, VARA_NAMES, VARA_ENGLISH,
} from '@/lib/astro';

function nameOf(v: unknown, table: string[]): string {
  if (v == null) return '\u2014';
  if (typeof v === 'number') return table[v] ?? String(v);
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && 'name' in (v as any)) return String((v as any).name);
  return String(v);
}

export function KeyMarkersGrid({ kundli }: { kundli: any }) {
  const profile = useBirthStore((s) => s.profile);
  const { data: p } = usePanchangam();

  const moon = kundli?.planets?.Moon;

  return (
    <div className="space-y-4">
      {/* Janma Nakshatra */}
      {moon && (
        <Card title="Janma Nakshatra" sanskrit="\u091C\u0928\u094D\u092E \u0928\u0915\u094D\u0937\u0924\u094D\u0930">
          <div className="flex items-baseline gap-2">
            <p className="font-serif text-lg font-bold leading-tight text-amber-950">
              {moon.nakshatra}
            </p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              pada {moon.pada}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            ruled by {moon.nakshatraLord ?? '\u2014'}
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/80">
            The Moon's asterism at birth sets the Vimshottari dasha sequence and anchors
            all transit interpretation.
          </p>
        </Card>
      )}

      {/* Panchang at birth */}
      {p && (
        <Card title="Panchang at Birth" sanskrit="\u092A\u091E\u094D\u091A\u093E\u0919\u094D\u0917">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <Mini label="Tithi" value={nameOf(p.tithi, TITHI_NAMES)} />
            <Mini label="Nakshatra" value={nameOf(p.nakshatra, NAKSHATRA_NAMES)} />
            <Mini label="Yoga" value={nameOf(p.yoga, YOGA_NAMES)} />
            <Mini label="Karana" value={nameOf(p.karana, [])} />
            <Mini
              label="Vara"
              value={
                typeof p.vara === 'number'
                  ? `${VARA_NAMES[p.vara] ?? ''} ${DOT} ${VARA_ENGLISH[p.vara] ?? ''}`
                  : '\u2014'
              }
            />
            <Mini
              label="Paksha"
              value={
                typeof p.paksha === 'string'
                  ? p.paksha
                  : typeof p.tithi === 'number'
                    ? p.tithi < 15 ? 'Shukla' : 'Krishna'
                    : '\u2014'
              }
            />
          </dl>
        </Card>
      )}

      {/* Birth details */}
      {profile && (
        <Card title="Birth Details" sanskrit="">
          <dl className="grid grid-cols-1 gap-y-1.5 text-[11px]">
            <Row k="Born" v={`${profile.birthDate} ${DOT} ${profile.birthTime}`} />
            <Row k="Place" v={profile.place.displayName} />
            <Row
              k="Coordinates"
              v={`${profile.place.latitude.toFixed(4)}, ${profile.place.longitude.toFixed(4)}`}
            />
            <Row
              k="Timezone"
              v={`${profile.place.timezone} (${profile.place.utcOffset})`}
            />
            <Row
              k="Settings"
              v={`${profile.houseSystem.replace('_', ' ')} ${DOT} ${profile.ayanamsa}`}
            />
          </dl>
        </Card>
      )}
    </div>
  );
}

function Card({ title, sanskrit, children }: {
  title: string; sanskrit: string; children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-baseline gap-2 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          {title}
        </p>
        {sanskrit && (
          <span className="font-serif text-[10px] text-amber-700/70" lang="sa">
            {sanskrit}
          </span>
        )}
      </header>
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="truncate font-semibold text-amber-950">{value}</dd>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-[9px] uppercase tracking-wider text-muted-foreground">
        {k}
      </dt>
      <dd className="truncate text-right font-medium text-amber-950">{v}</dd>
    </div>
  );
}