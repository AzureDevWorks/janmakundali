import { useState } from 'react';
import { rashiByName } from '@/lib/astro';
import {
  NAKSHATRA_SOURCES, NAKSHATRA_ROLES,
  type NakshatraSource,
} from '@/lib/nakshatraSources';
import { SANSKRIT, OM, DOT } from '@/lib/text';

export function JanmaNakshatraCard({ kundli }: { kundli: any }) {
  const moon = kundli?.planets?.Moon;
  const [showSources, setShowSources] = useState(false);

  if (!moon) return null;
  const moonRashi = rashiByName(moon.rashiName);

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-100/60 to-transparent px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Janma Nakshatra
          </span>
          <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
            {SANSKRIT.janmaNakshatra}
          </span>
        </div>
      </header>

      <div className="flex items-center gap-4 border-b border-amber-100 px-5 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md">
          <span className="text-2xl leading-none" aria-hidden="true">{moonRashi.symbol}</span>
        </div>
        <div>
          <p className="font-serif text-2xl font-bold leading-tight tracking-tight text-amber-950">
            {moon.nakshatra}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            pada {moon.pada} {DOT} {moon.nakshatraLord} ruled
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-amber-100 border-b border-amber-100">
        <Stat label="Moon Rashi" value={moonRashi.name + ' (' + moonRashi.english + ')'} />
        <Stat label="Rashi lord" value={moonRashi.lord} />
      </dl>

      <div className="border-b border-amber-100 px-5 py-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
          Why this matters
        </p>
        <ul className="space-y-1.5">
          {NAKSHATRA_ROLES.map((r) => (
            <li key={r.title} className="flex items-start gap-2 text-[11px] leading-relaxed">
              <span className="mt-1 inline-block h-1 w-1 shrink-0 rotate-45 bg-amber-500" aria-hidden="true" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-amber-950">{r.title}</span>
                {' - '}
                {r.description}
                <span className="ml-1 text-[9px] italic text-amber-700/70">({r.citation})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setShowSources((v) => !v)}
        className="flex w-full items-center justify-between gap-2 bg-amber-50/40 px-5 py-2.5 text-left text-[11px] font-semibold text-amber-900 transition-colors hover:bg-amber-50"
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">{OM}</span>
          Classical references {showSources ? '(hide)' : '(show)'}
        </span>
        <span className="text-[10px] text-amber-700/70">{NAKSHATRA_SOURCES.length} sources</span>
      </button>

      {showSources && (
        <ul className="divide-y divide-amber-100 bg-amber-50/20">
          {NAKSHATRA_SOURCES.map((s) => <SourceRow key={s.abbr} source={s} />)}
        </ul>
      )}

      <p className="border-t border-amber-100 bg-amber-50/40 px-5 py-2.5 text-[10px] italic leading-relaxed text-amber-800/70">
        The Moon&apos;s asterism at birth is the single most important identifier in
        Vedic astrology after the Lagna.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3">
      <dt className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold leading-tight text-amber-950">{value}</dd>
    </div>
  );
}

function SourceRow({ source }: { source: NakshatraSource }) {
  return (
    <li className="px-5 py-3">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-12 shrink-0 items-center justify-center rounded-md border border-amber-300 bg-gradient-to-br from-amber-100 to-amber-50 font-mono text-[10px] font-bold text-amber-900 shadow-sm">
          {source.abbr}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-sm font-bold leading-tight text-amber-950">{source.title}</p>
          <p className="text-[10px] text-muted-foreground">
            {source.author} {DOT} {source.period}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-amber-800">{source.chapter}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{source.covers}</p>
        </div>
      </div>
    </li>
  );
}