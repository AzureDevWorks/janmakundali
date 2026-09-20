import { cn } from '@/lib/utils';
import { NAV_GROUPS } from './navConfig';

interface Props {
  active: string;
  onSelect: (key: string) => void;
}

export function MobileNav({ active, onSelect }: Props) {
  // Flatten all items
  const items = NAV_GROUPS.flatMap((g) => g.items);

  return (
    <nav className="sticky top-[57px] z-20 border-b border-amber-200 bg-card/95 backdrop-blur lg:hidden">
      <div className="overflow-x-auto px-3">
        <ul className="flex gap-1 py-2">
          {items.map((item) => {
            const isActive = item.key === active;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onSelect(item.key)}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100',
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}