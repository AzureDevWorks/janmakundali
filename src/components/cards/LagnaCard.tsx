import { Card } from '@/components/ui/Card';
import { rashiByName, rashiByIndex, fmtDMS } from '@/lib/astro';

export function LagnaCard({ kundli }: { kundli: any }) {
  const asc = kundli?.ascendant;
  if (!asc) return null;
  const rashi = asc.rashiName ? rashiByName(asc.rashiName) : rashiByIndex(asc.rashi);
  return (
    <Card title="Lagna · Ascendant" tone="amber">
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight">{rashi.name}</p>
        <p className="text-sm text-muted-foreground">({rashi.english})</p>
        <span className="ml-auto text-5xl leading-none">{rashi.symbol}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {fmtDMS(asc.degree, asc.minute, asc.second)} · {asc.nakshatra ?? '—'} · pada {asc.pada ?? '—'}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lagna lord</p>
          <p className="font-semibold">{asc.rashiLord ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Nakshatra lord</p>
          <p className="font-semibold">{asc.nakshatraLord ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Element</p>
          <p className="font-semibold">{rashi.element}</p>
        </div>
      </div>
    </Card>
  );
}