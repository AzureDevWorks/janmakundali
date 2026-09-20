import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Badge({ children, className, tone }: { children: ReactNode; className?: string; tone?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset', tone, className)}>
      {children}
    </span>
  );
}