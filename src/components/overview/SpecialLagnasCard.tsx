import { useState } from 'react';
import { rashiByName, fmtDMS } from '@/lib/astro';
import {
  SPECIAL_LAGNA_META, SPECIAL_LAGNA_SOURCES,
  type SpecialLagnaMeta, type SpecialLagnaSource,
} from '@/lib/specialLagnasSources';
import { SANSKRIT, OM, DOT } from '@/lib/text';
import { cn } from '@/lib/utils';

export function SpecialLagnasCard({ kundli }: { kundli: any }) {
  const sl = kundli?.specialLagnas;
  const [active, setActive] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);

  if (!sl) return null;

  const activeMeta = active
    ? SPECIAL_LAGNA_META.find((m) => m.key === active) ?? null
    : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200 bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
            Special Lagnas
          </span>
          <span className="font-serif text-[11px] text-amber-700/70" lang="sa">
            {SANSKRIT.visheshaLagna}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {SPECIAL_LAGNA_META.length} lagnas
        </span>
      </header>

      <div className="grid grid-cols-2 gap-px bg-amber-100">
        {SPECIAL_LAGNA_META.map((meta) => (
          <LagnaCell
            key={meta.key}
            meta={meta}
            value={sl[meta.key]}
            active={active === meta.key}
            onClick={() => setActive(active === meta.key ? null : meta.key)}
          />
        ))}
      </div>

      {activeMeta && <DetailPanel meta={activeMeta} />}

      <button
        type="button"
        onClick={() => setShowSources((v) => !v)}
        className="flex w-full items-center justify-between gap-2 border-t border-amber-200 bg-amber-50/40 px-5 py-2.5 text-left text-[11px] font-semibold text-amber-900 transition-colors hover:bg-amber-50"
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">{OM}</span>
          Classical references {showSources ? '(hide)' : '(show)'}
        </span>
        <span className="text-[10px] text-amber-700/70">
          {SPECIAL_LAGNA_SOURCES.length} sources
        </span>
      </button>

      {showSources && (
        <ul className="divide-y divide-amber-100 bg-amber-50/20">
          {SPECIAL_LAGNA_SOURCES.map((s) => (
            <SourceRow key={s.abbr} source={s} />
          ))}
        </ul>
      )}

      <p className="border-t border-amber-100 bg-amber-50/40 px-5 py-2.5 text-[10px] italic leading-relaxed text-amber-800/70">
        The six special lagnas supplement the primary Lagna, each governing a
        specific life domain. Tap any lagna for its meaning and source.
      </p>
    </section>
  );
}

function LagnaCell({
  meta, value, active, onClick,
}: {
  meta: SpecialLagnaMeta;
  value: any;
  active: boolean;
  onClick: () => void;
}) {
  if (!value) return null;
  const rashi = rashiByName(value.rashiName ?? '');
  const isIndu = meta.key === 'induLagna';
  const primary = isIndu
    ? (value.totalKalas != null ? value.totalKalas + ' kalas' : '-')
    : fmtDMS(value.degree, value.minute, value.second);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col gap-1 bg-card px-3 py-3 text-left transition-all',
        active ? 'bg-amber-50' : 'hover:bg-amber-50/50',
      )}
    >
      {active && <span className="absolute left-0 top-0 h-full w-0.5 bg-amber-500" />}

      <div className="flex items-center gap-2">
        <span className="text-xl leading-none" aria-hidden="true">{rashi.symbol}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-sm font-bold leading-tight text-amber-950">
              {meta.name}
            </span>
            <span className="font-serif text-[9px] text-amber-700/70" lang="sa">
              {meta.sanskrit}
            </span>
          </div>
          <p className="truncate text-[9px] uppercase tracking-wider text-muted-foreground">
            {meta.tag}
          </p>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-1 pl-7">
        <span className="text-[11px] font-semibold text-amber-900">{rashi.name}</span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {primary}
        </span>
      </div>
    </button>
  );
}

function DetailPanel({ meta }: { meta: SpecialLagnaMeta }) {
  return (
    <div className="border-t border-amber-200 bg-gradient-to-br from-amber-50/70 to-amber-50/30 px-5 py-4">
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-base font-bold text-amber-950">{meta.name}</span>
        <span className="font-serif text-xs text-amber-700/70" lang="sa">{meta.sanskrit}</span>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-inset ring-amber-200">
          {meta.tag}
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-amber-900">{meta.meaning}</p>
      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-[10px] sm:grid-cols-2">
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 font-semibold uppercase tracking-wider text-amber-800">Motion</dt>
          <dd className="text-muted-foreground">{meta.motion}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="shrink-0 font-semibold uppercase tracking-wider text-amber-800">Source</dt>
          <dd className="text-muted-foreground">{meta.citation}</dd>
        </div>
      </dl>
    </div>
  );
}

function SourceRow({ source }: { source: SpecialLagnaSource }) {
  return (
    <li className="px-5 py-3">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-14 shrink-0 items-center justify-center rounded-md border border-amber-300 bg-gradient-to-br from-amber-100 to-amber-50 font-mono text-[10px] font-bold text-amber-900 shadow-sm">
          {source.abbr}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-sm font-bold leading-tight text-amber-950">
            {source.title}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {source.author} {DOT} {source.period}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-amber-800">{source.chapter}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {source.covers}
          </p>
        </div>
      </div>
    </li>
  );
}