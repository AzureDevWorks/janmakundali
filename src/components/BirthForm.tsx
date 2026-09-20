import { useMemo, useState } from 'react';
import { usePlaceSearch } from '@/features/birth/usePlaceSearch';
import { useBirthStore, type Ayanamsa, type HouseSystem } from '@/features/birth/birthStore';
import { utcOffsetFor } from '@/lib/geocoding';

interface Props {
  initial?: ReturnType<typeof useBirthStore.getState>['profile'];
  onDone?: () => void;
}

const inputCls =
  'mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400';

export function BirthForm({ initial, onDone }: Props) {
  const setProfile = useBirthStore((s) => s.setProfile);
  const [name, setName] = useState(initial?.name ?? '');
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? '');
  const [birthTime, setBirthTime] = useState(initial?.birthTime ?? '');
  const [houseSystem, setHouseSystem] = useState<HouseSystem>(initial?.houseSystem ?? 'whole_sign');
  const [ayanamsa, setAyanamsa] = useState<Ayanamsa>(initial?.ayanamsa ?? 'lahiri');
  const [err, setErr] = useState<string | null>(null);

  const place = usePlaceSearch();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const utcOffset = useMemo(() => {
    if (!place.selected || !birthDate || !birthTime) return null;
    return utcOffsetFor(place.selected.timezone, birthDate, birthTime);
  }, [place.selected, birthDate, birthTime]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate || !birthTime || !place.selected) {
      setErr('Please fill all fields and select a birthplace from the suggestions.');
      return;
    }
    if (!utcOffset) { setErr('Could not resolve UTC offset.'); return; }
    setProfile({
      name: name.trim(), birthDate, birthTime,
      place: {
        displayName: place.selected.displayName,
        latitude: place.selected.latitude,
        longitude: place.selected.longitude,
        timezone: place.selected.timezone,
        utcOffset,
      },
      houseSystem, ayanamsa,
    });
    setErr(null);
    onDone?.();
  };

  return (
    <form onSubmit={submit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bikash Moktan" className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Date of Birth</label>
          <input type="date" max={today} value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">Time of Birth</label>
          <input type="time" step={60} value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="relative">
        <label className="text-sm font-medium">Birthplace</label>
        <input type="text" value={place.query} onChange={(e) => place.setQuery(e.target.value)}
          placeholder="Start typing a city, e.g. Kath" className={inputCls} />
        {place.searching && (
          <span className="absolute right-3 top-9 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
        )}
        {place.results.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-lg">
            {place.results.map((r) => (
              <li key={r.placeId}>
                <button type="button" onClick={() => place.pick(r)}
                  className="flex w-full flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-left text-sm hover:bg-amber-50">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {[r.region, r.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {place.selected && (
          <dl className="mt-3 grid gap-1 rounded-lg border bg-muted/40 p-3 text-xs">
            <Row k="Place" v={place.selected.displayName} />
            <Row k="Coordinates" v={`${place.selected.latitude.toFixed(4)}, ${place.selected.longitude.toFixed(4)}`} />
            <Row k="Timezone" v={place.selected.timezone} />
            <Row k="UTC offset" v={utcOffset ?? '— (enter date & time)'} />
          </dl>
        )}
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Calculation settings
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium">House System</label>
            <select value={houseSystem}
              onChange={(e) => setHouseSystem(e.target.value as HouseSystem)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="whole_sign">Whole Sign</option>
              <option value="sripati">Sripati</option>
              <option value="equal_house">Equal House</option>
              <option value="placidus">Placidus (KP)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Ayanamsa</label>
            <select value={ayanamsa}
              onChange={(e) => setAyanamsa(e.target.value as Ayanamsa)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="lahiri">Lahiri</option>
              <option value="kp">KP</option>
              <option value="raman">Raman</option>
            </select>
          </div>
        </div>
      </div>

      {err && <p className="text-sm text-destructive">{err}</p>}

      <div className="flex justify-end">
        <button type="submit"
          className="rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700">
          Compute Kundli
        </button>
      </div>
    </form>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}