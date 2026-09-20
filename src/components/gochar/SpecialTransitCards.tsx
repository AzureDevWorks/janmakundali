import { Card } from '@/components/ui/Card';
import { rashiByName } from '@/lib/astro';
import { cn } from '@/lib/utils';

const WARN = '\u26A0\uFE0F';
const OK = '\u2705';
const DOT = '\u00B7';

/* ------------------------------------------------------------------ *
 * Sade Sati
 * ------------------------------------------------------------------ */
export function SadeSatiCard({ saturn }: { saturn: any }) {
  if (!saturn) return null;
  const active = !!saturn.status;
  const tone = active ? 'red' : 'emerald';

  return (
    <Card
      title="Sade Sati"
      subtitle="Saturn's 7.5-year arc over the Moon"
      right={<StatusBadge active={active} activeLabel="Active" inactiveLabel="Not active" />}
      className={cn(
        active && 'border-red-300 shadow-[0_0_40px_-15px_rgba(239,68,68,0.4)]',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden="true">
          {active ? WARN : OK}
        </span>
        <div className="flex-1">
          {saturn.phaseName && (
            <p className={cn('font-serif text-lg font-bold leading-tight', `text-${tone}-900`)}>
              {saturn.phaseName}
            </p>
          )}
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {saturn.description ?? 'No description.'}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Dhaiya
 * ------------------------------------------------------------------ */
export function DhaiyaCard({ dhaiya }: { dhaiya: any }) {
  if (!dhaiya) return null;
  const active = !!dhaiya.status;
  const tone = active ? 'orange' : 'emerald';

  return (
    <Card
      title="Dhaiya \u00B7 2.5-year Saturn cycle"
      subtitle="Kantaka (4th) or Ashtama (8th) from Moon"
      right={<StatusBadge active={active} activeLabel={dhaiya.type ?? 'Active'} inactiveLabel="Clear" />}
      className={cn(
        active && 'border-orange-300 shadow-[0_0_40px_-15px_rgba(251,146,60,0.4)]',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden="true">
          {active ? WARN : OK}
        </span>
        <div className="flex-1">
          {dhaiya.typeName && (
            <p className={cn('font-serif text-lg font-bold leading-tight', `text-${tone}-900`)}>
              {dhaiya.typeName}
            </p>
          )}
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {dhaiya.description ?? 'No description.'}
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Guru Gochar
 * ------------------------------------------------------------------ */
export function GuruGocharCard({ guru }: { guru: any }) {
  if (!guru) return null;
  const favorable = (guru.status ?? '').toLowerCase().includes('favorable');
  const tone = favorable ? 'emerald' : 'amber';

  return (
    <Card
      title="Guru Gochar"
      subtitle="Jupiter's current blessing"
      right={
        <span className={cn(
          'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset',
          favorable
            ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
            : 'bg-amber-100 text-amber-800 ring-amber-200',
        )}>
          {guru.status ?? '\u2014'}
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Stat label="House from Moon" value={'H' + (guru.houseFromMoon ?? '?')} />
        <Stat
          label="Aspects"
          value={(guru.aspectHousesFromMoon ?? []).map((h: number) => 'H' + h).join(' ') || '\u2014'}
        />
      </div>
      {guru.blessingSummary && (
        <p className={cn('mt-3 text-sm leading-relaxed', `text-${tone}-900`)}>
          {guru.blessingSummary}
        </p>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Rahu-Ketu axis
 * ------------------------------------------------------------------ */
export function RahuKetuCard({ axis }: { axis: any }) {
  if (!axis) return null;

  return (
    <Card title="Rahu \u00B7 Ketu Axis" subtitle="Karmic polarities">
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
            Rahu
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-violet-900">
            H{axis.rahuHouseFromMoon ?? '?'}
          </p>
          <p className="text-[10px] text-violet-700/80">from Moon</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-700">
            Ketu
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-stone-900">
            H{axis.ketuHouseFromMoon ?? '?'}
          </p>
          <p className="text-[10px] text-stone-700/80">from Moon</p>
        </div>
      </div>
      {axis.karmicImpact && (
        <p className="text-sm leading-relaxed text-muted-foreground">{axis.karmicImpact}</p>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Chandrashtama
 * ------------------------------------------------------------------ */
export function ChandrashtamaCard({ chandra }: { chandra: any }) {
  if (!chandra) return null;
  const active = !!chandra.isActive;

  return (
    <Card
      title="Chandrashtama"
      subtitle="Transit Moon in 8th from natal Moon"
      right={<StatusBadge active={active} activeLabel="Active" inactiveLabel="Clear" />}
      className={cn(active && 'border-red-200')}
    >
      <div className="grid grid-cols-3 gap-3 text-xs">
        <Stat label="Natal Moon" value={chandra.birthRashiName} small />
        <Stat label="8th sign" value={chandra.chandrashtamaRashiName} small />
        <Stat label="Current Moon" value={chandra.currentMoonRashiName} small />
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
function StatusBadge({
  active, activeLabel, inactiveLabel,
}: {
  active: boolean; activeLabel: string; inactiveLabel: string;
}) {
  return (
    <span className={cn(
      'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset',
      active
        ? 'bg-red-100 text-red-800 ring-red-200'
        : 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    )}>
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn('mt-0.5 font-bold leading-tight', small ? 'text-sm' : 'text-base')}>
        {value}
      </p>
    </div>
  );
}