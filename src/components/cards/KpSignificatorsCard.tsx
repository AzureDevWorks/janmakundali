import { Card } from '@/components/ui/Card';

export function KpSignificatorsCard({ kundli }: { kundli: any }) {
  const sig = kundli?.kp?.significators;
  if (!sig?.houses) return null;

  const houses = Object.entries(sig.houses).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  return (
    <Card title="KP Significators" subtitle="4-fold level A / B / C / D" bodyClass="p-0">
      <ul className="divide-y">
        {houses.map(([num, data]: [string, any]) => (
          <li key={num} className="flex items-start gap-3 px-4 py-2 text-xs">
            <span className="w-6 shrink-0 pt-0.5 text-center font-mono text-[11px] font-bold text-amber-800">
              H{num}
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <Row letter="A" list={data.levelA ?? []} />
              <Row letter="B" list={data.levelB ?? []} />
              <Row letter="C" list={data.levelC ?? []} />
              <Row letter="D" list={data.levelD ?? []} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Row({ letter, list }: { letter: string; list: string[] }) {
  if (!list || list.length === 0) return null;
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-3 font-mono text-[9px] font-bold text-muted-foreground">{letter}</span>
      <span className="text-foreground">{list.join(', ')}</span>
    </div>
  );
}