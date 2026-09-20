import { Card } from '@/components/ui/Card';

export function GocharAdvice({ advice }: { advice: string[] }) {
  if (!advice || advice.length === 0) return null;

  return (
    <Card
      title="Actionable Advice"
      subtitle="Based on today's transit configuration"
      tone="amber"
    >
      <ul className="space-y-2">
        {advice.map((item, i) => (
          <li key={i} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/40 p-3">
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-bold text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-amber-950">{item}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}