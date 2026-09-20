import { Card } from '@/components/ui/Card';

export function BirthDetailsCard({ kundli }: { kundli: any }) {
  const b = kundli?.birthDetails;
  if (!b) return null;
  const a = b.age ?? {};
  return (
    <Card title="Birth Details">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <Row k="Date" v={b.date ?? '—'} />
        <Row k="Time" v={b.time ?? '—'} />
        <Row k="Latitude" v={typeof b.lat === 'number' ? b.lat.toFixed(4) : '—'} />
        <Row k="Longitude" v={typeof b.lon === 'number' ? b.lon.toFixed(4) : '—'} />
        <Row k="Timezone (min)" v={typeof b.timezone === 'number' ? String(b.timezone) : '—'} />
        {b.gender && <Row k="Gender" v={b.gender} />}
      </dl>
      {a.years != null && (
        <>
          <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">Age</p>
          <p className="text-sm font-semibold">
            {a.years} years, {a.months} months, {a.days} days
          </p>
        </>
      )}
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="font-mono text-[11px]">{v}</dd>
    </div>
  );
}