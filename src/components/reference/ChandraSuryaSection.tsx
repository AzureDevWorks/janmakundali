import { useState } from 'react';
import { useKundli } from '@/features/kundli/useKundli';
import { ReferenceChartPanel } from './ReferenceChartPanel';
import { CHANDRA_META, SURYA_META } from './referenceMeta';
import { cn } from '@/lib/utils';

export function ChandraSuryaSection() {
  const { data: kundli } = useKundli();
  const [style, setStyle] = useState<'north' | 'south'>('south');

  if (!kundli) return null;

  const chandra = kundli.chandraKundli;
  const surya = kundli.suryaKundli;

  if (!chandra && !surya) return null;

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">
            Reference Charts
          </p>
          <h2 className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-amber-950">
              Chandra &amp; Surya Kundli
            </span>
            <span className="font-serif text-sm text-amber-700/70" lang="sa">
              {'\u091A\u0928\u094D\u0926\u094D\u0930 \u0938\u0942\u0930\u094D\u092F \u0915\u0941\u0923\u094D\u0921\u0932\u0940'}
            </span>
          </h2>
          <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
            Classical Vedic astrology reads the Janam Kundli alongside two rotated views:
            the Moon chart (mind) and the Sun chart (soul). Together they reveal how the
            same planetary positions express themselves through different lenses.
          </p>
        </div>

        {/* North / South toggle shared by both charts */}
        <div className="inline-flex overflow-hidden rounded-lg border border-amber-200 bg-background shadow-sm">
          <button
            onClick={() => setStyle('north')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold transition-colors',
              style === 'north' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50',
            )}
          >
            North
          </button>
          <button
            onClick={() => setStyle('south')}
            className={cn(
              'border-l border-amber-200 px-3.5 py-1.5 text-xs font-semibold transition-colors',
              style === 'south' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50',
            )}
          >
            South
          </button>
        </div>
      </div>

      {/* Charts side by side */}
      <div className="grid gap-5 lg:grid-cols-2">
        {chandra && (
          <ReferenceChartPanel meta={CHANDRA_META} chart={chandra} style={style} />
        )}
        {surya && (
          <ReferenceChartPanel meta={SURYA_META} chart={surya} style={style} />
        )}
      </div>

      {/* Info footer */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-white p-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          How to read these charts
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Each chart places the same 9 planets in the same signs — what changes is which
          sign counts as house 1. In the Chandra Kundli, the Moon&rsquo;s sign becomes the first
          house, revealing how planetary energy manifests in your emotional and mental life.
          In the Surya Kundli, the Sun&rsquo;s sign becomes house 1, showing how the same planets
          express through your soul purpose, vitality, and relationship with authority.
        </p>
      </div>
    </section>
  );
}