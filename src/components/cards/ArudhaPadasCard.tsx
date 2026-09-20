import { Card } from '@/components/ui/Card';
import { rashiByName } from '@/lib/astro';

const ORDER = ['a1_al','a2','a3','a4','a5','a6','a7','a8','a9','a10','a11','a12_ul'];

export function ArudhaPadasCard({ kundli }: { kundli: any }) {
  const padas = kundli?.arudhaPadas;
  if (!padas) return null;

  return (
    <Card title="Arudha Padas" subtitle="Reflected images of bhavas" bodyClass="p-0">
      <ul className="divide-y">
        {ORDER.map((key) => {
          const p = padas[key];
          if (!p) return null;
          const rashi = rashiByName(p.rashiName);
          return (
            <li key={key} className="flex items-center gap-3 px-4 py-2 text-sm">
              <span className="w-10 shrink-0 font-mono text-[10px] font-bold text-amber-800">
                {p.code}
              </span>
              <span className="flex-1 truncate text-xs text-muted-foreground" title={p.name}>
                {p.name.replace(/\(.*?\)\s*-\s*/, '').replace(/\(.*?\)\s*/, '')}
              </span>
              <span className="w-28 text-right text-xs">
                <span className="mr-1">{rashi.symbol}</span>
                <span className="font-medium">{rashi.name}</span>
              </span>
              <span className="w-12 text-right font-mono text-[10px] text-muted-foreground">
                H{p.houseNumber}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}