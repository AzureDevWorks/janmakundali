import { Card } from '@/components/ui/Card';
import { rashiByName } from '@/lib/astro';

export function ChalitCard({ kundli }: { kundli: any }) {
  const chalit = kundli?.chalit;
  if (!chalit) return null;

  const shifted = (chalit.planets ?? []).filter((p: any) => p.shifted && p.shifted !== 0);

  return (
    <Card title={`Bhava Chalit · ${chalit.system ?? '—'}`}
      subtitle="Planets by cusp-based houses">
      {shifted.length > 0 && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
          <p className="mb-1 font-semibold text-amber-900">Shifted planets (D1 → Chalit)</p>
          <ul className="space-y-0.5">
            {shifted.map((p: any) => (
              <li key={p.name} className="flex items-center justify-between gap-2">
                <span>{p.name}</span>
                <span className="font-mono text-[10px] text-amber-800">
                  H{p.rashiHouse} → H{p.house} {p.shifted > 0 ? '→' : '←'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <table className="w-full text-xs">
        <thead className="border-b text-left text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="py-2">Planet</th>
            <th className="py-2">Rashi</th>
            <th className="py-2 text-right">D1</th>
            <th className="py-2 text-right">Chalit</th>
          </tr>
        </thead>
        <tbody>
          {(chalit.planets ?? []).map((p: any) => {
            const rashi = rashiByName(p.rashiName);
            return (
              <tr key={p.name} className="border-b last:border-0">
                <td className="py-1.5 font-medium">{p.name}</td>
                <td className="py-1.5">
                  <span className="mr-1">{rashi.symbol}</span>
                  {rashi.name}
                </td>
                <td className="py-1.5 text-right font-mono">H{p.rashiHouse ?? '—'}</td>
                <td className="py-1.5 text-right font-mono font-bold">H{p.house ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}