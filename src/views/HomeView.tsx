import { useState } from 'react';
import type { ReactElement } from 'react';
import { useBirthStore } from '@/features/birth/birthStore';
import { useKundli } from '@/features/kundli/useKundli';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { ProfileDropdown } from '@/features/profiles/ProfileDropdown';
import { groupOf, labelOf } from '@/components/layout/navConfig';
import { OM, DOUBLE_DANDA, SANSKRIT } from '@/lib/text';

import { OverviewTab } from './tabs/OverviewTab';
import { ChartsTab } from './tabs/ChartsTab';
import { PlanetsTab } from './tabs/PlanetsTab';
import { DashasTab } from './tabs/DashasTab';
import { GocharTab } from './tabs/GocharTab';
import { PanchangTab } from './tabs/PanchangTab';
import { AshtakavargaTab } from './tabs/AshtakavargaTab';
import { ChalitTab } from './tabs/ChalitTab';
import { KpTab } from './tabs/KpTab';
import { PredictionsTab } from './tabs/PredictionsTab';
import { ReportTab } from './tabs/ReportTab';

type Renderer = (onNavigate: (key: string) => void) => ReactElement;

const RENDERERS: Record<string, Renderer> = {
  overview:     (onNav) => <OverviewTab onNavigate={onNav} />,
  vargas:       () => <ChartsTab />,
  planets:      () => <PlanetsTab />,
  dashas:       () => <DashasTab />,
  gochar:       () => <GocharTab />,
  panchang:     () => <PanchangTab />,
  ashtakavarga: () => <AshtakavargaTab />,
  chalit:       () => <ChalitTab />,
  kp:           () => <KpTab />,
  predictions:  () => <PredictionsTab />,
  report:       () => <ReportTab />,
};

export function HomeView() {
  const profile = useBirthStore((s) => s.profile);
  const { data: kundli, isLoading, error } = useKundli();
  const [active, setActive] = useState<string>('overview');

  if (!profile) return null; // App routes to WelcomeScreen before this

  const activeGroup = groupOf(active);
  const activeLabel = labelOf(active);
  const render = RENDERERS[active];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-amber-200 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-baseline gap-2">
            <span className="inline-flex items-center gap-2">
              <span className="text-xl leading-none text-amber-700" aria-hidden="true">{OM}</span>
              <span className="font-serif text-xl font-bold tracking-tight text-amber-900">
                Janma Kundali
              </span>
            </span>
            <span className="hidden font-serif text-[10px] italic tracking-wider text-amber-700/70 sm:inline">
              {DOUBLE_DANDA} {SANSKRIT.vaidikaJanmaKundali} {DOUBLE_DANDA}
            </span>
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="hidden w-64 shrink-0 border-r border-amber-200 lg:sticky lg:top-[57px] lg:block lg:h-[calc(100vh-57px)]">
          <SidebarNav active={active} onSelect={setActive} />
        </aside>

        <div className="min-w-0 flex-1">
          <MobileNav active={active} onSelect={setActive} />

          <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50/40 to-transparent px-6 py-3">
            <div className="flex items-center gap-2 text-[11px] text-amber-800/70">
              <span className="font-semibold uppercase tracking-wider">
                {activeGroup?.label ?? 'Section'}
              </span>
              <span className="opacity-50">{'>'}</span>
              <span className="font-serif text-sm font-semibold text-amber-950">
                {activeLabel}
              </span>
            </div>
          </div>

          <main className="px-6 py-6">
            {isLoading && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-8 text-center text-sm text-amber-900">
                Computing your kundli...
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                Failed to compute: {(error as Error).message}
              </div>
            )}
            {kundli && render && (
              <div key={active} className="animate-fade-in">
                {render(setActive)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}