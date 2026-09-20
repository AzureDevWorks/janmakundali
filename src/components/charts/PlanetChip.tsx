import { PLANET_ABBR, PLANET_GLYPH, planetColor } from '@/lib/astro';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  retrograde?: boolean;
  compact?: boolean;
  className?: string;
}

/** Small colour-coded chip showing a planet abbreviation. Fits inside chart cells. */
export function PlanetChip({ name, retrograde, compact = true, className }: Props) {
  const color = planetColor(name);
  const abbr = PLANET_ABBR[name] ?? name.slice(0, 2);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded border font-bold leading-none tracking-tight',
        compact ? 'px-1 py-[3px] text-[9px]' : 'px-1.5 py-1 text-xs',
        color.chip,
        className,
      )}
      title={name + (retrograde ? ' (retrograde)' : '')}
    >
      {abbr}
      {retrograde && <span className="text-[0.75em] opacity-80">R</span>}
    </span>
  );
}

/** Chip with glyph + abbreviation — used in the legend. */
export function PlanetChipFull({ name, retrograde, className }: Props) {
  const color = planetColor(name);
  const abbr = PLANET_ABBR[name] ?? name.slice(0, 2);
  const glyph = PLANET_GLYPH[name] ?? '●';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold leading-none',
        color.chip,
        className,
      )}
    >
      <span className="text-base leading-none">{glyph}</span>
      <span className="font-mono font-bold">{abbr}</span>
      <span>{name}</span>
      {retrograde && <span className="text-[10px] opacity-80">R</span>}
    </span>
  );
}