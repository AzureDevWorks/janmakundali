import { cn } from '@/lib/utils';
import { NAV_GROUPS } from './navConfig';
import { IdentityCard } from './IdentityCard';

interface Props {
  active: string;
  onSelect: (key: string) => void;
  /** When true, sidebar is rendered inside the mobile drawer. */
  onNavigate?: () => void;
}

export function SidebarNav({ active, onSelect, onNavigate }: Props) {
  return (
    <nav className="flex h-full flex-col bg-card">
      {/* Identity at top */}
      <IdentityCard />

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.key} className={cn('px-2', gi > 0 && 'mt-1')}>
            {/* Group header */}
            <div className="flex items-center gap-2 px-2 pb-1 pt-2">
              <span className="text-sm leading-none text-amber-700" aria-hidden="true">
                {group.icon}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                {group.label}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
            </div>

            {/* Items */}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.key === active;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item.key);
                        onNavigate?.();
                      }}
                      className={cn(
                        'group relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                          : 'text-amber-900/80 hover:bg-amber-50 hover:text-amber-950',
                      )}
                      title={item.hint}
                    >
                      <span
                        className={cn(
                          'inline-block h-1.5 w-1.5 shrink-0 rounded-full transition-all',
                          isActive
                            ? 'bg-white'
                            : 'bg-amber-400/60 group-hover:bg-amber-500',
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-amber-200 bg-amber-50/40 px-4 py-3 text-center">
        <p className="font-serif text-[10px] italic tracking-wide text-amber-800">
          {'\u0965 \u0936\u094D\u0930\u0940 \u0917\u0923\u0947\u0936\u093E\u092F \u0928\u092E\u0903 \u0965'}
        </p>
      </div>
    </nav>
  );
}