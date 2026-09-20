import { Card } from '@/components/ui/Card';
import { FieldList } from '@/components/predictions/FieldList';
import type { Field } from '@/components/predictions/fieldTypes';
import { useAllPredictions } from '@/features/predictions/useAllPredictions';

export function LalKitabCard({ kundli }: { kundli: any }) {
  const { data, isLoading, error } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Lal Kitab"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  if (error || !data?.lalKitabAnalysis) return null;

  const lk = data.lalKitabAnalysis;

  const fields: Field[] = [
    { kind: 'badge', label: 'Teva Classification', value: lk.tevaType ?? '—', tone: 'violet' },
    { kind: 'kv', label: 'Kismat Ka Grah · Planet of Fortune', pairs: [
      ['Planet', lk.kismatKaGrah?.planet ?? '—'],
      ['House',  String(lk.kismatKaGrah?.house ?? '—')],
    ]},
    { kind: 'paragraph', label: '', value: lk.kismatKaGrah?.role },
    { kind: 'kv', label: 'Houses', pairs: [
      ['Sleeping (Soya)',   (lk.sleepingHouses ?? []).join(', ') || '—'],
      ['Awakened (Jaga)',   (lk.awakenedHouses ?? []).join(', ') || '—'],
    ]},
    { kind: 'specialYogas',   label: 'Lal Kitab Yogas', items: lk.specialYogas ?? [] },
    { kind: 'karmicDebts',    label: 'Karmic Debts (Rin)', items: lk.karmicDebts ?? [] },
    { kind: 'lalKitabRemedies', label: 'Actionable Totke', items: lk.lalKitabRemedies ?? [] },
  ];

  return (
    <Card title="Lal Kitab Teva" subtitle="Dharmi / Kismat / Totke">
      <FieldList fields={fields} />
    </Card>
  );
}