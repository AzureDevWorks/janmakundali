import { Card } from '@/components/ui/Card';
import { FieldList } from '@/components/predictions/FieldList';
import type { Field } from '@/components/predictions/fieldTypes';
import { useAllPredictions } from '@/features/predictions/useAllPredictions';

/* ------------------------------------------------------------------ *
 * Schemas — declare which fields to render, in what order.
 * ------------------------------------------------------------------ */

function careerSchema(c: any): Field[] {
  if (!c) return [];
  return [
    { kind: 'score', label: 'Job Alignment',      value: c.jobScore ?? 0,      max: 100, tone: 'good' },
    { kind: 'score', label: 'Business Alignment', value: c.businessScore ?? 0, max: 100, tone: 'bad'  },
    { kind: 'badge', label: 'Recommendation',     value: c.recommendation,     tone: 'amber' },
    { kind: 'text',  label: 'Leadership Capacity', value: c.leadershipCapacity },
    { kind: 'bullets', label: 'Recommended Sectors', items: c.suitableFields },
    { kind: 'bullets', label: 'Strategic Advice',    items: c.strategicAdvice },
    { kind: 'bullets', label: 'Dominant Traits',     items: c.dominantTraits },
    { kind: 'paragraph', label: '10th Lord Verdict', value: c.tenthLordPlacementResult },
    { kind: 'paragraph', label: 'Jaimini AmK',       value: c.amatyakarakaInsight },
    { kind: 'paragraph', label: 'KP Insight',        value: c.kpInsight },
    { kind: 'paragraph', label: 'Chalit Insight',    value: c.chalitInsight },
    { kind: 'paragraph', label: 'Lal Kitab',         value: c.lalKitabInsight },
  ];
}

function wealthSchema(w: any): Field[] {
  if (!w) return [];
  const sav = w.savMetrics ?? {};
  return [
    { kind: 'badge', label: 'Wealth Rating', value: w.wealthRating ?? '—', tone: 'amber' },
    { kind: 'score', label: 'Income Potential', value: w.incomePotential ?? 0, max: 100, tone: 'good' },
    { kind: 'badge', label: 'Saving Capacity', value: w.savingCapacity ?? '—', tone: 'green' },
    { kind: 'kv', label: 'Ashtakavarga Flow', pairs: [
      ['Income (H11)',      String(sav.incomeHouse11Bindus ?? '—')],
      ['Expenditure (H12)', String(sav.expenditureHouse12Bindus ?? '—')],
      ['Wealth (H2)',       String(sav.wealthHouse2Bindus ?? '—')],
      ['Surplus Ratio',     sav.surplusRatio != null ? sav.surplusRatio.toFixed(2) : '—'],
    ]},
    { kind: 'bullets', label: 'Dhana Yogas', items:
      (w.dhanaYogas ?? []).map((y: any) => `${y.name} (${y.strength}): ${y.description}`) },
    { kind: 'bullets', label: 'Vipreet Raja Yogas', items: w.vipreetRajYogas ?? [] },
    { kind: 'paragraph', label: '2nd Lord Verdict', value: w.secondLordPlacementResult },
    { kind: 'paragraph', label: '11th Lord Verdict', value: w.eleventhLordPlacementResult },
    { kind: 'bullets', label: 'Best Wealth Sources', items: w.bestWealthSources },
    { kind: 'bullets', label: 'Financial Cautions', items: w.financialCautions },
    { kind: 'paragraph', label: 'Chalit Insight', value: w.chalitInsight },
    { kind: 'paragraph', label: 'KP Insight',     value: w.kpInsight },
    { kind: 'paragraph', label: 'Lal Kitab',      value: w.lalKitabInsight },
  ];
}

function marriageSchema(m: any): Field[] {
  if (!m) return [];
  const mt = m.marriageType ?? {};
  const dk = m.darakarakaInsight;
  return [
    { kind: 'badge', label: 'Marital Harmony', value: m.maritalHarmonyRating ?? '—',
      tone: (m.maritalHarmonyRating ?? '').toLowerCase().includes('caution') ? 'red' : 'green' },
    { kind: 'badge', label: 'Marriage Type', value: mt.recommendation ?? '—', tone: 'amber' },
    { kind: 'score', label: 'Love Score',    value: mt.loveScore ?? 0,     max: 100, tone: 'good' },
    { kind: 'score', label: 'Arranged Score', value: mt.arrangedScore ?? 0, max: 100, tone: 'neutral' },
    { kind: 'text', label: 'Intercaste Likelihood',
      value: `${mt.isIntercasteLikely ? 'Likely' : 'Traditional Community'} (${mt.intercasteProbability ?? 0}%)` },
    { kind: 'text', label: 'Favorable Age Range', value: m.favorableAgeRange },
    { kind: 'text', label: 'Predicted Timing Years', value: (m.predictedTimingYears ?? []).join(', ') },
    { kind: 'text', label: 'Dasha Support', value: m.dashaSupportExplanation },
    { kind: 'bullets', label: 'Marriage Type Indicators', items: mt.keyIndicators },
    { kind: 'kv', label: 'Mangal Dosha', pairs: [
      ['Present',      m.mangalDosha?.hasDosha ? 'Yes' : 'No'],
      ['Cancelled',    m.mangalDosha?.isCancelled ? 'Yes' : 'No'],
      ['Description',  m.mangalDosha?.description ?? '—'],
    ]},
    { kind: 'kv', label: 'Spouse Age Difference', pairs: [
      ['Relative Age',  m.spouseAgeDifference?.relativeAge ?? '—'],
      ['Maturity',      m.spouseAgeDifference?.maturityLevel ?? '—'],
      ['Reason',        m.spouseAgeDifference?.reason ?? '—'],
    ]},
    { kind: 'paragraph', label: 'Partner Nature', value: m.partnerCharacteristics?.nature },
    { kind: 'bullets',  label: 'Partner Traits',  items: m.partnerCharacteristics?.dominantTraits },
    { kind: 'text',     label: 'Partner Background', value: m.partnerCharacteristics?.directionOrBackground },
    { kind: 'paragraph', label: '7th Lord Verdict', value: m.seventhLordPlacementResult },
    { kind: 'paragraph', label: 'Darakaraka Insight', value: dk },
    { kind: 'bullets', label: 'Relationship Advice', items: m.relationshipAdvice },
    { kind: 'paragraph', label: 'Chalit Insight', value: m.chalitInsight },
    { kind: 'paragraph', label: 'KP Insight',     value: m.kpInsight },
    { kind: 'paragraph', label: 'Lal Kitab',      value: m.lalKitabInsight },
  ];
}

function remediesSchema(r: any): Field[] {
  if (!r) return [];
  return [
    { kind: 'bullets', label: 'Weak Houses', items:
      (r.weakHousesIdentified ?? []).map((h: any) =>
        `House ${h.house} (${h.rashi}, ${h.bindus} bindus): ${h.impact}`) },
    ...(r.practicalDoAndDonts ?? []).map((d: any) => ({
      kind: 'dosDonts' as const, label: 'Practical Guidance', dos: d.dos ?? [], donts: d.donts ?? [],
    })),
    { kind: 'mantras', label: 'Recommended Mantras', items: r.mantras ?? [] },
    { kind: 'remedyList', label: 'Detailed Remedies', items: r.remedyList ?? [] },
    { kind: 'lalKitabRemedies', label: 'Lal Kitab Totke', items: r.lalKitabRemedies ?? [] },
    { kind: 'bullets', label: 'Lifestyle Habits', items: r.lifestyleHabits ?? [] },
  ];
}

function jaiminiSchema(j: any): Field[] {
  if (!j) return [];
  const ORDER: [string, string][] = [
    ['atmakaraka',   'Atmakaraka · Soul'],
    ['amatyakaraka', 'Amatyakaraka · Career'],
    ['bhratrikaraka','Bhratrikaraka · Siblings'],
    ['matrikaraka',  'Matrikaraka · Mother'],
    ['putrakaraka',  'Putrakaraka · Children'],
    ['gnatikaraka',  'Gnatikaraka · Obstacles'],
    ['darakaraka',   'Darakaraka · Spouse'],
  ];
  return [
    { kind: 'kv', label: 'Chara Karakas', pairs: ORDER
      .map(([key, label]) => {
        const k = j[key];
        if (!k) return null;
        return [label, `${k.planet} · ${k.formattedDegree} in ${k.rashiName} (H${k.house})`] as [string, string];
      })
      .filter(Boolean) as [string, string][] },
    ...ORDER.map(([key, label]): Field | null => {
      const k = j[key];
      if (!k?.signification) return null;
      return { kind: 'paragraph', label: label + ' · Signification', value: k.signification };
    }).filter(Boolean) as Field[],
  ];
}

function chalitSchema(c: any): Field[] {
  if (!c) return [];
  return [
    { kind: 'bullets', label: 'Shifted Planets', items:
      (c.shiftedPlanets ?? []).map((p: any) =>
        `${p.planet}: D1 H${p.d1House} → Chalit H${p.chalitBhava} (${p.shiftDirection}). ${p.impact}`) },
    { kind: 'bullets', label: 'Key Bhava Insights', items: c.keyBhavaInsights ?? [] },
    { kind: 'kv', label: 'Actual Chalit Occupants', pairs:
      Object.entries(c.actualHouseOccupants ?? {})
        .filter(([_, v]: any) => Array.isArray(v) && v.length > 0)
        .map(([h, v]: [string, any]) => [`House ${h}`, v.join(', ')]) },
  ];
}

function kpSchema(k: any): Field[] {
  if (!k) return [];
  return [
    { kind: 'kv', label: 'Cusp 10 · Career', pairs: [
      ['Sub-Lord',  k.careerCusp10?.subLord ?? '—'],
      ['Star-Lord', k.careerCusp10?.starLord ?? '—'],
    ]},
    { kind: 'paragraph', label: '', value: k.careerCusp10?.significationVerdict },
    { kind: 'kv', label: 'Cusp 7 · Marriage', pairs: [
      ['Sub-Lord',  k.marriageCusp7?.subLord ?? '—'],
      ['Star-Lord', k.marriageCusp7?.starLord ?? '—'],
    ]},
    { kind: 'paragraph', label: '', value: k.marriageCusp7?.marriagePromise },
    { kind: 'paragraph', label: '', value: k.marriageCusp7?.typeIndication },
    { kind: 'kv', label: 'Wealth Cusps (2, 11)', pairs: [
      ['Cusp 2 Sub-Lord',  k.wealthCusps?.cusp2SubLord ?? '—'],
      ['Cusp 11 Sub-Lord', k.wealthCusps?.cusp11SubLord ?? '—'],
    ]},
    { kind: 'paragraph', label: '', value: k.wealthCusps?.financialSignification },
  ];
}

/* ------------------------------------------------------------------ *
 * Cards
 * ------------------------------------------------------------------ */

function PredictionCard({ title, subtitle, fields, className }:
  { title: string; subtitle?: string; fields: Field[]; className?: string }) {
  return (
    <Card title={title} subtitle={subtitle} className={className}>
      <FieldList fields={fields} />
    </Card>
  );
}

export function CareerCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Career"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="Career & Professional Trajectory" subtitle="10th house · D1 + D9 + D10" fields={careerSchema(data?.career)} />;
}

export function WealthCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Wealth"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="Wealth & Financial Fortunes" subtitle="2nd & 11th houses · SAV" fields={wealthSchema(data?.wealth)} />;
}

export function MarriageCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Marriage"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="Marriage & Relationships" subtitle="7th house · DK · KP" fields={marriageSchema(data?.marriage)} />;
}

export function RemediesCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Remedies"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="Vedic & Behavioral Remedies" fields={remediesSchema(data?.remedies)} />;
}

export function JaiminiKarakasCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Jaimini"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="Jaimini Chara Karakas" subtitle="Soul & destiny indicators" fields={jaiminiSchema(data?.jaiminiKarakas)} />;
}

export function ChalitAnalysisCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="Chalit Analysis"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="Bhava Chalit Analysis" subtitle="Planetary shifts" fields={chalitSchema(data?.chalitAnalysis)} />;
}

export function KpAnalysisCard({ kundli }: { kundli: any }) {
  const { data, isLoading } = useAllPredictions(kundli);
  if (isLoading) return <Card title="KP Analysis"><p className="text-sm text-muted-foreground">Computing…</p></Card>;
  return <PredictionCard title="KP Cuspal Analysis" subtitle="Krishnamurti Paddhati" fields={kpSchema(data?.kpAnalysis)} />;
}