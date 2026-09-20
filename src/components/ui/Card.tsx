import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
  tone?: 'default' | 'amber';
}

export function Card({ title, subtitle, right, children, className, bodyClass, tone = 'default' }: Props) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow',
        tone === 'amber' && 'border-amber-300 shadow-[0_0_40px_-12px_rgba(251,191,36,0.35)]',
        className,
      )}
    >
      {title && (
        <header
          className={cn(
            'relative flex items-center justify-between gap-3 border-b px-4 py-2.5',
            tone === 'amber'
              ? 'border-amber-200 bg-gradient-to-r from-amber-100/80 via-amber-50 to-transparent'
              : 'bg-muted/30',
          )}
        >
          {/* Tiny accent bar */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-0 top-0 h-full w-[3px]',
              tone === 'amber'
                ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-400'
                : 'bg-gradient-to-b from-amber-300 to-amber-500',
            )}
          />
          <div>
            <p
              className={cn(
                'text-[10px] font-semibold uppercase tracking-[0.18em]',
                tone === 'amber' ? 'text-amber-800' : 'text-muted-foreground',
              )}
            >
              {title}
            </p>
            {subtitle && (
              <p className="font-serif text-[11px] italic text-amber-700/80">{subtitle}</p>
            )}
          </div>
          {right}
        </header>
      )}
      <div className={cn('p-4', bodyClass)}>{children}</div>
    </section>
  );
}