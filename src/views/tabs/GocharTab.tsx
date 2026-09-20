import { useKundli } from '@/features/kundli/useKundli';
import { useGochar } from '@/features/kundli/useGochar';
import { GocharHero } from '@/components/gochar/GocharHero';
import {
  SadeSatiCard, DhaiyaCard, GuruGocharCard,
  RahuKetuCard, ChandrashtamaCard,
} from '@/components/gochar/SpecialTransitCards';
import { LifeAreasGrid } from '@/components/gochar/LifeAreasGrid';
import { PlanetTransitTable } from '@/components/gochar/PlanetTransitTable';
import { GocharAdvice } from '@/components/gochar/GocharAdvice';

export function GocharTab() {
  const { data: kundli } = useKundli();

  const { data: gochar, isLoading, error } = useGochar(kundli);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-8 text-center text-sm text-amber-900">
        Computing live transits...
      </div>
    );
  }
  if (error || !gochar) return null;

  const sp = gochar.specialTransits ?? {};

  return (
    <div className="space-y-6">
      {/* Hero: overall verdict */}
      <GocharHero gochar={gochar} />

      {/* Special transits ? Saturn & Jupiter & Nodes */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold tracking-tight text-amber-950">
          <span className="inline-block h-2 w-2 rotate-45 bg-gradient-to-br from-amber-400 to-orange-600" />
          Special Transits
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <SadeSatiCard saturn={sp.sadeSati} />
          <DhaiyaCard dhaiya={sp.dhaiya} />
          <GuruGocharCard guru={sp.guruGochar} />
          <RahuKetuCard axis={sp.rahuKetuAxis} />
          <div className="md:col-span-2">
            <ChandrashtamaCard chandra={sp.chandrashtama} />
          </div>
        </div>
      </section>

      {/* Life areas */}
      <LifeAreasGrid areas={(gochar.lifeAreas ?? {}) as Record<string, any>} />

      {/* Actionable advice */}
      <GocharAdvice advice={gochar.actionableAdvice ?? []} />

      {/* Transiting planets */}
      <PlanetTransitTable gochar={gochar} />

      {/* Footer note */}
      <p className="text-center text-[10px] text-muted-foreground">
        Transits computed live from current planetary positions. Reference: Janma Rashi ({gochar.natalMoonRashiName}) and Lagna ({gochar.natalLagnaRashiName}).
      </p>
    </div>
  );
}