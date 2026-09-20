import { Card } from '@/components/ui/Card';
import { rashiByIndex } from '@/lib/astro';

export function KpCard({ kundli }: { kundli: any }) {
  const kp = kundli?.kp;
  if (!kp) return null;

  return (
    <Card title="KP · Krishnamurti Paddhati"
      subtitle={`Ayanamsa ${kp.ayanamsaName ?? 'KP'}`}
      bodyClass="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="border-b bg-muted/20 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Cusp</th>
              <th className="px-3 py-2">Rashi</th>
              <th className="px-3 py-2">Sign lord</th>
              <th className="px-3 py-2">Star lord</th>
              <th className="px-3 py-2">Sub</th>
              <th className="px-3 py-2">Sub-sub</th>
            </tr>
          </thead>
          <tbody>
            {(kp.cusps ?? []).map((c: any, i: number) => {
              const rashi = rashiByIndex(c.rashi);
              return (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-1.5 font-mono font-bold text-amber-800">
                    {c.houseNumber ?? i + 1}
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="mr-1">{rashi.symbol}</span>
                    {rashi.name}
                  </td>
                  <td className="px-3 py-1.5">{c.rashiLord ?? '—'}</td>
                  <td className="px-3 py-1.5">{c.nakshatraLord ?? '—'}</td>
                  <td className="px-3 py-1.5 font-semibold">{c.subLord ?? '—'}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{c.subSubLord ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {kp.rulingPlanets?.rulingPlanetsList && (
        <p className="border-t bg-muted/20 px-3 py-2 text-[10px] text-muted-foreground">
          Ruling planets · {kp.rulingPlanets.rulingPlanetsList.join(', ')}
        </p>
      )}
    </Card>
  );
}