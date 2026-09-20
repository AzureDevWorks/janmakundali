# `panchang-ts` — Complete API Reference

Version: **5.1.1** · License: **MIT** · Pure TypeScript, zero runtime dependencies, offline-first. Runs in Node.js ≥ 22, modern browsers, and React Native (Hermes).

---

## 1. Overview

`panchang-ts` computes the Hindu almanac (Panchang) and Vedic astrology (Jyotish) from first principles — its own ephemeris, no native modules, no network, no runtime dependencies. It is deliberately a **primitive library**: it gives you astronomical data and classical chart placements, but it does **not** interpret anything. Interpretation is your application's job.

### What it provides

| Domain | Coverage |
|---|---|
| Pancha Anga | Tithi, Nakshatra, Yoga, Karana, Vara — with intra-day transitions |
| Lunar calendar | Chandra Masa (Purnimanta + Amanta), Adhika (leap) detection, Vikram + Shaka Samvat |
| Solar calendar | Saura Masa, Surya Nakshatra, Sankranti (transit-based) |
| Sun & Moon | Sunrise, sunset, moonrise, moonset (Meeus apparent-upper-limb), Chandra Rashi |
| Auspicious muhurta | Brahma, Abhijit, Vijaya, Godhuli, Nishita, Madhyahna, Pratah/Sayahna Sandhya, Amrit Kala |
| Inauspicious periods | Rahu Kalam, Gulika Kalam, Yamaganda, Dur Muhurta, Varjyam, Ganda Mula, Bhadra Kala, Panchaka |
| Time-slot systems | Choghadiya, Gowri Panchangam, Hora, Do Ghati, Panchaka Rahita |
| Special yogas | Anandadi (28-cycle), Amrit/Sarvartha Siddhi, Ravi/Guru Pushya, Dwi-/Tripushkar, Jwalamukhi, Aadal, Vidaal, Ravi |
| Festivals (80+) | Ekadashi (Smarta/Vaishnava split), Pradosha, Sankranti, classical + regional across 21 states + Nepal |
| Eclipses | Solar/lunar detection, subtype, magnitude, horizon visibility, sutak window |
| Planetary positions | All 9 grahas (sidereal) with rashi, nakshatra, pada, retrograde — mean or true Rahu/Ketu |
| Dashas | Vimshottari (3-level), Ashtottari, Yogini, Chara, Narayan |
| Personal transits | Chandra Balam, Tarabala (9-cycle), Sade Sati |
| Birth chart | Lagna, Bhava under 3 house systems, **D1/D2/D3/D7/D9/D10/D12/D30**, planetary dignity |
| Compatibility & Doshas | Ashtakoot (36-point), Pathu Porutham (Tamil 10-fold), Mangal, Kaal Sarp (12 subtypes), Pitru |
| Strength & Aspects | Drishti, Shadbala (6-fold), Ashtakavarga (Bhinna + Sarva, with reductions), Bhava Bala, Argala |
| Yogas & Karakas | 25 named yogas (with cancellations), 7- and 8-Karaka Jaimini |
| Annual & Sensitive | Varshaphala (Tajik + 27 Sahams), Tithi Pravesha, Arudha padas, Hora/Ghati/Bhava/Sripati lagnas, Upagrahas |
| KP & Prashna | KP sub-lord at any longitude, Placidus-KP cuspal sub-lords, KP significators, Prashna chart |
| Muhurta engine | Configurable scoring + 13 stock occasions (vivah, griha pravesh, namakarana, …) |
| Calendar conversion | Gregorian↔Hindu, Kali Yuga year, Hindu New Year, yearly Ekadashi/Sankranti/festival listings |
| Localization | English + Hindi (Devanagari) |
| Configuration | 5 ayanamsas (Lahiri, Raman, KP, True Chitrapaksha, Thirukanitham), 2 masa systems, 3 house systems |

**Performance:** A full daily panchang computes in ~0.41 ms cold, ~0.17 ms warm. `getInstantPanchang` is ~0.21 ms / ~0.10 ms.

---

## 2. Installation & setup

```bash
npm install panchang-ts
# or: pnpm add panchang-ts / yarn add panchang-ts
```

No runtime dependencies. No configuration files. Import and call.

### Basic imports

```typescript
import {
  // Daily / instant panchang
  getDailyPanchang, getInstantPanchang,

  // Planetary positions
  computePlanetaryPositions, GRAHA_ABBR,

  // Lagna & charts
  computeLagna, computeBhava,
  computeRashiChart, computeNavamsa, computeDivisionalChart,
  computeDignity,

  // Dashas
  computeVimshottariDashaFromBirth, computeVimshottariPratyantar,
  computeAshtottariDasha, computeYoginiDasha,
  computeCharaDasha, computeNarayanDasha,

  // Strength & analysis
  computeAspects, computeShadbala, computeBhavaBala,
  computeAshtakavarga, computeYogas, computeJaiminiKarakas,

  // Matching & doshas
  computeAshtakoot, computePathuPorutham,
  computeMangalDosha, computeMangalCompatibility,
  computeKaalSarp, computePitruDosha,

  // Annual & sensitive
  computeVarshaphala, computeTithiPravesha, computeArudhas,
  computeHoraLagna, computeGhatiLagna, computeBhavaLagna, computeSripatiLagna,
  computeUpagrahas, computeArgala,

  // KP & Prashna
  computeKpSubLord, computeKpCuspalSubLords, computeKpSignificators,
  computePrashnaChart,

  // Errors
  PanchangError,
} from 'panchang-ts';
```

---

## 3. Core function: `getDailyPanchang()`

### Signature

```typescript
getDailyPanchang(
  date: Date,
  location: { latitude: number; longitude: number; elevation?: number },
  options: { timezone: number | string } & PanchangOptions
): DailyPanchangResult | null
```

Returns `null` only at polar latitudes where sunrise cannot be computed. Everywhere else, narrow with `if (!result) return;`.

### The location argument

```typescript
{ latitude: 27.70169, longitude: 85.3206, elevation: 1300 }
```

`elevation` is optional (metres). A half-filled location throws — it does not silently guess.

### The options object

| Option | Type | Default | Effect |
|---|---|---|---|
| `timezone` | `number` (minutes from UTC) or IANA string | **required** | The zone the Hindu day and every `*Local` string is rendered in |
| `ayanamsa` | `'lahiri' \| 'raman' \| 'krishnamurti' \| 'true-chitra' \| 'thirukanitham'` | `'lahiri'` | Sidereal zero-point |
| `language` | `'en' \| 'hi'` | `'en'` | Every user-facing string |
| `masaSystem` | `'purnimanta' \| 'amanta'` | `'purnimanta'` | Which system `calendar.chandramasa.name` resolves to |
| `region` | `FestivalRegion` | `'all'` | Scopes regional festival variants |
| `computeEndTimes` | `boolean` | `true` | Whether `endTime`/`startTime` transitions are solved |
| `sections` | `PanchangSection[]` | `undefined` | Narrow the optional blocks |
| `janmaRashi` | `0..11` (0 = Mesha) | `undefined` | Populates `chandraBalam` |
| `janmaNakshatra` | `0..26` (0 = Ashwini) | `undefined` | Populates `tarabala` |

### Full example

```typescript
const result = getDailyPanchang(
  new Date(2025, 0, 14),                      // January 14, 2025
  { latitude: 23.1765, longitude: 75.7885 },  // Ujjain, India
  { timezone: 330 },                          // IST = UTC+5:30
);

console.log(result.angas.tithis[0].name);          // "Krishna Chaturdashi"
console.log(result.angas.nakshatras[0].name);      // "Mrigashira"
console.log(result.angas.vara.name);               // "Mangalawara"
console.log(result.calendar.chandramasa.name);     // "Magha"
console.log(result.calendar.samvat.vikramSamvat);  // 2081
```

### `getInstantPanchang()` — single-moment snapshot

```typescript
getInstantPanchang(
  instant: Date,
  location: { latitude: number; longitude: number; elevation?: number },
  options?: { ayanamsa?: Ayanamsa; language?: 'en' | 'hi'; sections?: PanchangSection[] }
): InstantPanchangResult | null
```

Uses the same group names for the subset an instant can answer: `sun`, `moon`, `angas`, `calendar`, `inauspicious`. There is no `muhurtas` or `periods` group, because those are properties of a Hindu day. Its results carry no `*Local` fields — that call takes no timezone.

---

## 4. Data structures

### 4.1 `DailyPanchangResult` (root object)

Seven groups plus a handful of top-level fields:

```typescript
interface DailyPanchangResult {
  date: Date;
  location: { latitude: number; longitude: number; elevation?: number };
  timezone: { offsetMinutes: number; zone?: string };
  ayanamsa: number;

  // Seven groups
  sun: SunGroup;
  moon: MoonGroup;
  angas: AngasGroup;
  calendar: CalendarGroup;
  muhurtas: MuhurtasGroup;
  inauspicious: InauspiciousGroup;
  periods: PeriodsGroup;

  // Top-level extras
  specialYogas: SpecialYoga[];
  anandadiYoga: AnandadiYoga;
  festivals: FestivalInfo[];
  eclipse: EclipseInfo | null;
  chandraBalam: ChandraBalam | null;
  tarabala: Tarabala | null;
}
```

### 4.2 `SunGroup`

```typescript
interface SunGroup {
  rise: Date;                 // real instant
  riseLocal: string;          // "2025-01-14T07:09:44.172+05:30"
  set: Date;
  setLocal: string;
  nextRise: Date;
  nextRiseLocal: string;
  dayDurationMinutes: number;
  nightDurationMinutes: number;
  dinamanaMinutes: number;    // alias
  ratrimanaMinutes: number;   // alias
  siderealLongitude: number;  // sidereal Sun longitude at sunrise
  nakshatra: NakshatraIndexInfo;
}
```

### 4.3 `MoonGroup`

```typescript
interface MoonGroup {
  rise: Date | null;          // null when the Moon does not rise that day
  riseLocal: string | null;
  set: Date | null;
  setLocal: string | null;
  siderealLongitude: number;
  rashi: RashiInfo;
}
```

### 4.4 `AngasGroup` — the five limbs

```typescript
interface AngasGroup {
  tithis: DailyTithiInfo[];
  nakshatras: DailyNakshatraInfo[];
  yogas: DailyYogaInfo[];
  karanas: DailyKaranaInfo[];
  vara: VaraInfo;
}

interface DailyTithiInfo extends TithiInfo {
  startTime: Date | null;
  startTimeLocal: string | null;
  endTime: Date | null;
  endTimeLocal: string | null;
  isActiveAtSunrise: boolean;
}

interface TithiInfo {
  index: number;              // 0..29
  name: string;               // "Krishna Chaturdashi"
  paksha: 'Shukla' | 'Krishna';
  number: number;             // 1..15 within paksha
  completionPercentage: number;
}
```

`DailyNakshatraInfo`, `DailyYogaInfo`, `DailyKaranaInfo` follow the same pattern.

### 4.5 `CalendarGroup`

```typescript
interface CalendarGroup {
  masa: SauraMasa;
  chandramasa: ChandraMasa;
  samvat: Samvat;
}

interface ChandraMasa {
  index: number;
  name: string;               // "Magha"
  isAdhika: boolean;
  system: 'purnimanta' | 'amanta';
  amantaIndex: number;
  amantaName: string;
  purnimantaIndex: number;
  purnimantaName: string;
}

interface Samvat {
  vikramSamvat: number;
  shakaSamvat: number;
  vikramSamvatsara: string;
  shakaSamvatsara: string;
}
```

### 4.6 `MuhurtasGroup`

```typescript
interface MuhurtasGroup {
  abhijit: TimePeriod | null;
  brahma: TimePeriod | null;
  vijaya: TimePeriod | null;
  godhuli: TimePeriod | null;
  nishita: TimePeriod | null;
  amritKala: TimePeriod[];     // [] when none
  madhyahna: TimePeriod | null;
  pratahSandhya: TimePeriod | null;
  sayahnaSandhya: TimePeriod | null;
  doGhati: TimePeriod | null;
}

interface TimePeriod {
  start: Date;
  startLocal: string;
  end: Date;
  endLocal: string;
}
```

**Note:** `amritKala` is a `TimePeriod[]` since v5.1 — 0–2 windows per day. The old sunrise-anchored single window was replaced.

### 4.7 `InauspiciousGroup`

```typescript
interface InauspiciousGroup {
  rahuKalam: TimePeriod | null;
  gulikaKalam: TimePeriod | null;
  yamaganda: TimePeriod | null;
  durMuhurta: DurMuhurtaPeriod[];   // 1–2 windows; segment: 'day' | 'night'
  varjyam: TimePeriod[];            // [] when none
  bhadra: BhadraInfo | null;
  gandaMula: GandaMulaInfo | null;
  panchaka: PanchakaInfo | null;
  panchakaInfo: PanchakaInfo | null;
  panchakaRahita: TimePeriod[];
}
```

**Note:** `durMuhurta` is a `DurMuhurtaPeriod[]` since v5.1.1 — the old exactly-two-day-windows tuple was replaced. Tuesday carries a night window.

### 4.8 `PeriodsGroup`

```typescript
interface PeriodsGroup {
  choghadiya: {
    day: ChoghadiyaSlot[];     // 8 slots
    night: ChoghadiyaSlot[];   // 8 slots
  };
  hora: HoraSlot[];
  gowri: {
    day: GowriSlot[];
    night: GowriSlot[];
  };
}

interface ChoghadiyaSlot {
  name: string;                // "Amrit"
  quality: 'auspicious' | 'inauspicious' | 'neutral';
  qualityName: string;
  start: Date;
  end: Date;
  startLocal: string;
  endLocal: string;
}
```

### 4.9 Top-level extras

```typescript
interface SpecialYoga {
  name: string;
  type: string;                // "guru_pushya"
  start: Date;
  end: Date;
}

interface AnandadiYoga {
  index: number;
  name: string;
  quality: 'auspicious' | 'inauspicious' | 'neutral';
}

interface FestivalInfo {
  key: string;                 // "diwali" — stable, language-independent
  name: string;                // localized
  type: string;                // "major" | "regional" | …
  description: string;
  deferralDate?: Date;
}

interface EclipseInfo {
  kind: 'solar' | 'lunar';
  subtype: string;             // 'partial' | 'total' | 'annular' | …
  obscuration: number;         // disc AREA covered, 0..1
  magnitude: number;           // diameter fraction (negative for penumbral lunar)
  sutakStart: Date;
  sutakEnd: Date;
  description: string;
}

interface ChandraBalam {
  house: number;               // from janma rashi (1 = janma rashi itself)
  quality: 'strong' | 'weak';
  name: string;
  englishName: string;
}

interface Tarabala {
  taraIndex: number;           // 0..8
  name: string;
  englishName: string;
  quality: string;
}
```

---

## 5. Planetary positions

### `computePlanetaryPositions()`

```typescript
computePlanetaryPositions(
  date: Date,
  ayanamsa?: Ayanamsa,
  _?: unknown,                 // 3rd arg reserved
  nodeType?: 'mean' | 'true'
): Record<string, GrahaPosition>
```

Returns a record keyed by lowercase planet name: `sun`, `moon`, `mars`, `mercury`, `jupiter`, `venus`, `saturn`, `rahu`, `ketu`.

```typescript
interface GrahaPosition {
  planet: string;              // "Sun"
  siderealLongitude: number;   // 0..360
  rashi: { index: number; name: string };    // name is a STRINGIFIED INDEX
  degreeInRashi: number;       // 0..30
  nakshatra: {
    index: number;             // 0..26
    name: string;              // STRINGIFIED INDEX
    pada: number;              // 1..4
    degreesInNakshatra: number;
    completionPercentage: number;
    endTime: Date | null;
  };
  isRetrograde: boolean;
}
```

### ⚠️ Known bugs in v5.1.1

1. **`rashi.name` is a stringified index** — `"11"` instead of `"Meena"`. Same for `nakshatra.name` (`"25"` instead of `"Uttara Bhadrapada"`). The `index` fields are correct; only the `name` fields are broken.
2. **The 4-argument form crashes** with `TypeError: rashiNameFn is not a function`. The `(date, ayanamsa, undefined, 'true')` call from the README does not work in the published package.

**Workaround:** Use `computeRashiChart(birth, loc)` and `computeNavamsa(birth, loc)` for real rashi/nakshatra names. Use `computePlanetaryPositions` only for nakshatra **indices** and pada.

```typescript
// Safe: real names from computeRashiChart
const d1 = computeRashiChart(birth, loc);
console.log(d1.byPlanet.Jupiter.rashi.name);   // "Vrischika" ✓

// Also safe: nakshatra index from positions
const pos = computePlanetaryPositions(birth, 'lahiri');
const nakIdx = pos.jupiter.nakshatra.index;     // 17 — valid index into your table
```

### `GRAHA_ABBR`

```typescript
const GRAHA_ABBR = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};
```

---

## 6. Lagna and Bhava

```typescript
computeLagna(birth, loc, ayanamsa?, language?): LagnaInfo
computeBhava(birth, loc, { houseSystem: 'whole-sign' | 'equal' | 'placidus-kp' }): BhavaGroup
```

```typescript
interface LagnaInfo {
  siderealLongitude: number;
  rashi: { index: number; name: string };    // real name — "Vrishabha"
  degreeInRashi: number;
  nakshatra: { index: number; name: string };  // real name — "Krittika"
  pada: number;
}

interface BhavaGroup {
  system: string;
  houses: {
    house: number;
    cuspLongitude: number;
    rashi: { index: number; name: string };
    degreeInRashi: number;
  }[];
  ascendantLongitude: number;
  mcLongitude: number;
}
```

Placidus-KP throws `PanchangError('CIRCUMPOLAR')` beyond ±66.5°. Whole-sign and equal work at every latitude.

---

## 7. Birth charts

### `computeRashiChart()` — D1

```typescript
computeRashiChart(birth, loc, { houseSystem?: HouseSystem }): BirthChart
```

### `computeNavamsa()` — D9

```typescript
computeNavamsa(birth, loc): BirthChart
```

### `computeDivisionalChart()` — D2, D3, D7, D10, D12, D30

```typescript
computeDivisionalChart(birth, loc, 'D2' | 'D3' | 'D7' | 'D10' | 'D12' | 'D30'): BirthChart
```

### `BirthChart` shape

```typescript
interface BirthChart {
  divisional: string;          // "D1" | "D9" | …
  lagna: LagnaInfo;
  bhava: BhavaGroup;
  planets: {
    planet: string;
    longitude: number;
    rashi: { index: number; name: string };    // real name — "Meena"
    degreeInRashi: number;
    house: number;             // 1..12
    isRetrograde: boolean;
  }[];
  byPlanet: Record<string, {
    planet: string;
    longitude: number;
    rashi: { index: number; name: string };
    degreeInRashi: number;
    house: number;
    isRetrograde: boolean;
  }>;
}
```

**Critical differences from `computePlanetaryPositions`:**

- `BirthChart` returns **real rashi names** (`"Meena"`, `"Vrischika"`) — no stringified-index bug.
- `BirthChart` includes **`house`** on every planet (1–12).
- **D9/D10/D12/D30 do NOT include `bhava` and `byPlanet`.** Only `lagnaRashi` and `planets`. Derive houses from `lagnaRashi.index`.

```typescript
// D1 — full shape
const d1 = computeRashiChart(birth, loc);
console.log(d1.byPlanet.Jupiter.house);         // 7

// D9 — reduced shape
const d9 = computeNavamsa(birth, loc);
console.log(d9.planets.find(p => p.planet === 'Mars').house);  // 1
console.log(d9.lagnaRashi.name);                                // "Meena"
```

### `computeDignity()`

```typescript
computeDignity(planet: string, rashiIndex: number): Dignity

type Dignity = 'exalted' | 'moolatrikona' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
```

Examples:
```typescript
computeDignity('Mars', 0);   // 'moolatrikona' (Aries)
computeDignity('Mars', 9);   // 'exalted' (Capricorn)
computeDignity('Sun',  6);   // 'debilitated' (Libra)
```

---

## 8. Dashas

### Five systems

| System | Cycle | Result type |
|---|---|---|
| Vimshottari | 120 years, 9 lords, Maha → Antar → Pratyantar | `VimshottariDashaResult` |
| Ashtottari | 108 years, 8 lords (no Ketu) | `VimshottariDashaResult` |
| Yogini | 36 years, 8 yoginis with planet lords | `YoginiDashaResult` |
| Chara (Jaimini) | sign-based, 9-8-7 years per modality | `CharaDashaResult` |
| Narayan (Jaimini) | sign-based, direction by lagna parity | `NarayanDashaResult` |

### `computeVimshottariDashaFromBirth()`

```typescript
computeVimshottariDashaFromBirth(birth: Date, ayanamsa?: Ayanamsa): VimshottariDashaResult
```

Derives the Moon's longitude itself. Use this when you have a birth moment and location.

```typescript
interface VimshottariDashaResult {
  currentMahaDashaLord: string;
  currentIndex: number;
  mahaDashas: {
    lord: string;
    startDate: string;         // ISO string
    endDate: string;
    years: number;
    antarDashas: {
      lord: string;
      startDate: string;
      endDate: string;
    }[];
  }[];
}
```

**Depth:** 2 levels (Maha → Antar). For the 3rd level, call `computeVimshottariPratyantar(antar)`.

```typescript
const vim = computeVimshottariDashaFromBirth(birth, 'lahiri');
const pratyantars = computeVimshottariPratyantar(vim.mahaDashas[0].antarDashas[0]);
// → { lord, startDate, endDate }[]
```

### Other dasha callers

```typescript
computeAshtottariDasha(birth, moonLon): VimshottariDashaResult
computeYoginiDasha(birth, moonLon): YoginiDashaResult
computeCharaDasha(birth, loc): CharaDashaResult
computeNarayanDasha(birth, loc, ayanamsa?): NarayanDashaResult
computeNarayanDasha(birth, loc, ayanamsa?, { duration: 'variable' }): NarayanDashaResult
```

`computeAshtottariDasha` and `computeYoginiDasha` take a **sidereal Moon longitude** — get it from `computePlanetaryPositions(birth, 'lahiri').moon.siderealLongitude`.

### `computeSadeSati()`

```typescript
computeSadeSati(natalMoonRashiIndex: number, date: Date): {
  active: boolean;
  phase: 1 | 2 | 3 | null;
  currentArcStart: Date | null;
  currentArcEnd: Date | null;
  nextArcStart: Date | null;
}
```

### Daily transits

```typescript
computeChandraBalam(janmaRashi, transitRashi): ChandraBalam
computeTarabala(janmaNakshatra, transitNakshatra): Tarabala
```

Chandra Balam counts the transit Moon's house from the janma rashi (1 = janma rashi itself); houses 1, 3, 6, 7, 10, 11 are Shubha. Tarabala is the 9-tara cycle: Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Ati-Mitra.

---

## 9. Strength, yogas & karakas

### Aspects

```typescript
computeAspects(d1, { nodeAspects?: '7th-only' | '5-and-9' }): Record<string, number[]>
```

Returns `{ Sun: [5], Mars: [2, 5, 6], Jupiter: [1, 3, 11], … }` — a map from planet name to the houses it aspects.

### Shadbala

```typescript
computeShadbala(birth, loc): Record<string, ShadbalaComponents>

interface ShadbalaComponents {
  sthana: number;
  dig: number;
  kala: number;
  chesta: number;
  naisargika: number;
  drik: number;
  total: number;
}
```

7 visible grahas. Values are in **Virupas** (60 V = 1 Rupa). Range [0, 420 V].

### Bhava Bala

```typescript
computeBhavaBala(birth, loc): {
  houses: {
    bhavadhipati: number;
    dik: number;
    drik: number;
    sthana: number;
    total: number;
  }[];
}
```

12 houses. Built on top of Shadbala.

### Ashtakavarga

```typescript
computeAshtakavarga(d1): AshtakavargaResult
computeAshtakavarga(d1, { reductions: true }): AshtakavargaResult

interface AshtakavargaResult {
  sarvashtaka: number[];       // 12 cells, each 0..56, total 336
  bhinnashtaka: Record<string, number[]>;   // 7 planets × 12 cells
  reduced?: {
    sarvashtaka: number[];
    bhinnashtaka: Record<string, number[]>;
  };
}
```

Rahu and Ketu are not Ashtakavarga receivers or contributors (classical Parashara scheme). Bhinnashtaka invariants: Sun=47, Moon=49, Mars=39, Mercury=54, Venus=52, Saturn=39.

### Named yogas

```typescript
computeYogas(d1, { types?: string[]; navamsa?: BirthChart }): Yoga[]

interface Yoga {
  name: string;
  type: string;                // 'raja' | 'dhana' | 'lunar' | 'solar' | 'special' | 'cancellation'
  reasons: string[];
  bhanga?: { applies: boolean; reasons: string[] };
}
```

~25 named yogas — Pancha Mahapurusha (Ruchaka/Bhadra/Hamsa/Malavya/Sasha), lunar (Gajakesari, Sunapha, Anapha, Durudhura, Kemadruma), solar (Budha-Aditya, Veshi, Vasi, Ubhayachari), Raja (kendra/trikona-lord, Dharma-Karmadhipati, Vipareeta, Lakshmi), Dhana (2-11, 5-9, Vasumati), Vargottama, Yogakaraka, Neecha Bhanga, Daridra.

### Jaimini karakas

```typescript
computeJaiminiKarakas(d1): Record<string, string>
computeJaiminiKarakas(d1, { variant: '8-jaimini' }): Record<string, string>
```

Returns `{ Atmakaraka: 'Mars', Amatyakaraka: 'Jupiter', … }`. The 7-graha variant omits Rahu; the 8-graha variant adds Rahu and inserts Pitrukaraka.

---

## 10. Matching & doshas

### Ashtakoot

```typescript
computeAshtakoot(
  boy: { rashi: number; nakshatra: number; lagnaRashi?: number; navamsaRashi?: number },
  girl: { rashi: number; nakshatra: number; lagnaRashi?: number; navamsaRashi?: number },
  { ganaCancellation?: boolean }
): {
  totalScore: number;          // 0..36
  koots: { name: string; score: number; maxScore: number; description: string }[];  // 8
  cancellations: string[];
}
```

### Pathu Porutham

```typescript
computePathuPorutham(boyMoon, girlMoon): {
  totalPasses: number;         // 0..10
  recommended: boolean;
  poruthams: { name: string; passes: boolean; description: string }[];
}
```

Three vetoes (Yoni, Rajju, Vedha) flip `recommended` regardless of count.

### Mangal dosha

```typescript
computeMangalDosha(d1): {
  afflicted: boolean;
  severity: 'anshik' | 'purna';
  fromLagna: { afflicted: boolean; house: number };
  fromMoon: { afflicted: boolean; house: number };
  fromVenus: { afflicted: boolean; house: number };
  cancellations: string[];
}

computeMangalCompatibility(boyChart, girlChart): {
  boy: MangalDoshaInfo;
  girl: MangalDoshaInfo;
  afflicted: boolean;
  cancellations: string[];
  description: string;
}
```

Manglik is a **pairwise** verdict — when both partners are Manglik, the two afflictions neutralise each other.

### Kaal Sarp and Pitru dosha

```typescript
computeKaalSarp(d1): {
  afflicted: boolean;
  subtype: string | null;      // 12 subtypes by Rahu's house
  partial: boolean;
  rahuHouse: number;
  ketuHouse: number;
}

computePitruDosha(d1): {
  afflicted: boolean;
  reasons: string[];
}
```

---

## 11. Annual charts & sensitive points

### Varshaphala

```typescript
computeVarshaphala(birth, nthYear, loc): VarshaphalaResult
```

Returns `{ solarReturnInstant, varshaLagna, muntha, yearLord, sahams, isDayBirth, planets, bhava }`. 27 Sahams: Punya, Vidya, Yasas, Mitra, Karma, Vivaha, Putra, Roga, Marana, Rajya, Raja, Bandhu, Dharma, Gnati, Apamrityu, Bhratri, Matri, Pitri, Sama, Bandhana, Karyasiddhi, Vyapara, Sastra, Asha, Labha, Susha, Tapas.

### Tithi Pravesha

```typescript
computeTithiPravesha(birth, nthYear, loc): TithiPraveshaResult
```

Preserves the natal tithi exactly.

### Arudha padas

```typescript
computeArudhas(d1): {
  bhava: number;
  arudhaRashi: number;
  arudhaRashiName: string;
  arudhaLord: string;
}[]
```

12 entries. `[0]` is Arudha Lagna (AL); `[6]` is Darapada (spouse pada).

### Special lagnas

```typescript
computeHoraLagna(birth, loc): LagnaInfo     // 30°/hour
computeGhatiLagna(birth, loc): LagnaInfo    // 75°/hour
computeBhavaLagna(birth, loc): LagnaInfo    // 15°/hour
computeSripatiLagna(birth, loc, ayanamsa?, language?, { includeCusps?: boolean }): LagnaInfo
```

`computeSripatiLagna` with `includeCusps: true` adds a `cusps: number[12]` field — the bhava madhyas. Cusps[0/3/6/9] = ASC/IC/DSC/MC.

### Upagrahas

```typescript
computeUpagrahas(birth, loc): {
  gulika: Upagraha;
  mandi: Upagraha;
  dhuma: Upagraha;
  vyatipata: Upagraha;
  parivesha: Upagraha;
  indrachapa: Upagraha;
  upaketu: Upagraha;
}

interface Upagraha {
  longitude: number;
  rashi: number;
  rashiName: string;
  house: number;
}
```

### Argala

```typescript
computeArgala(d1): ArgalaEntry[]
computeArgala(d1, { includeTrikonargala: true }): ArgalaEntry[]

interface ArgalaEntry {
  bhava: number;
  argala: PlanetPlacement[];
  virodhargala: PlanetPlacement[];
  trikona?: { sources: PlanetPlacement[]; virodhakas: PlanetPlacement[] };
}
```

Planets in 2/4/11 from a bhava form Argala; 3/10/12 form Virodhargala. Each planet hits exactly 6 of 12 bhavas.

---

## 12. KP & Prashna

### KP sub-lord

```typescript
computeKpSubLord(longitude: number): {
  longitude: number;
  rashi: number;
  nakshatra: number;
  signLord: string;
  starLord: string;
  subLord: string;
}
```

243 sub-divisions across the zodiac.

### KP cuspal sub-lords

```typescript
computeKpCuspalSubLords(birth, loc): {
  cusps: {
    longitude: number;
    rashi: number;
    nakshatra: number;
    signLord: string;
    starLord: string;
    subLord: string;
  }[];
}
```

Always Placidus-KP. Throws `PanchangError('CIRCUMPOLAR')` beyond ±66.5°.

### KP significators

```typescript
computeKpSignificators(d1): {
  byPlanet: Record<string, number[]>;   // planet → houses signified
  byHouse: Record<number, string[]>;    // house → planets signifying it
}
```

### Prashna chart

```typescript
computePrashnaChart(questionTime, querentLoc, { houseSystem?: 'placidus-kp' | 'whole-sign' }): BirthChart
```

Same return shape as a natal `BirthChart`.

---

## 13. Error handling

Every code is a member of the exported `PanchangErrorCode` union:

| Code | Thrown when |
|---|---|
| `INVALID_DATE` | The date is not a valid Date |
| `INVALID_LATITUDE` | Latitude outside [-90, 90] |
| `INVALID_LONGITUDE` | Longitude outside [-180, 180] |
| `INVALID_ELEVATION` | Elevation is not a finite number |
| `INVALID_TIMEZONE` | Timezone is neither a finite offset nor a resolvable IANA name |
| `INVALID_AYANAMSA` | Unknown ayanamsa slug |
| `INVALID_INPUT` | An argument outside the cases above (bad index, malformed rule, …) |
| `TIMEZONE_RESOLUTION_FAILED` | An IANA zone was passed but `Intl` could not resolve it (older Hermes) |
| `NO_SUNRISE` | The low-level `getSunrise` found no event (polar day/night) |
| `NO_SUNSET` | The low-level `getSunset` found no event |
| `SEARCH_DIVERGED` | An internal root search failed to converge — please report these |
| `CIRCUMPOLAR` | Placidus-KP houses requested above ±66.5° latitude |

### Polar latitudes

`getDailyPanchang` and `getInstantPanchang` return `null` rather than throwing — the Hindu day is undefined when sunrise cannot be computed. The low-level `getSunrise` / `getSunset` primitives still throw `PanchangError('NO_SUNRISE')` / `('NO_SUNSET')` for direct callers who need the precise reason.

`getMoonrise` / `getMoonset` return `null` (normal for the Moon anywhere on Earth).

```typescript
import { PanchangError } from 'panchang-ts';

try {
  getDailyPanchang(date, location, options);
} catch (e) {
  if (e instanceof PanchangError) {
    console.error(e.code);     // 'INVALID_LATITUDE', 'INVALID_TIMEZONE', …
    console.error(e.message);
  }
}
```

---

## 14. Common recipes

### Get a planet's house number

```typescript
const d1 = computeRashiChart(birth, loc);
const jupiterHouse = d1.byPlanet.Jupiter.house;   // 7
```

### Get all planets in a given sign

```typescript
const planetsInMeena = d1.planets.filter(p => p.rashi.name === 'Meena');
```

### Convert English rashi name to Sanskrit

panchang-ts uses **Sanskrit** names (`"Vrishabha"`), unlike `@prisri/jyotish` which uses English (`"Taurus"`).

```typescript
const ENGLISH_TO_SANSKRIT = {
  Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna', Cancer: 'Karka',
  Leo: 'Simha', Virgo: 'Kanya', Libra: 'Tula', Scorpio: 'Vrischika',
  Sagittarius: 'Dhanus', Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena',
};
```

### Read time components correctly

Every `Date` in a result is a real instant. Read via `getUTC*` methods, not `getHours()`:

```typescript
const sunrise = result.sun.rise;
const h = sunrise.getUTCHours();       // 7
const m = sunrise.getUTCMinutes();     // 4

// Or use the *Local companion
result.sun.riseLocal;                  // "2025-01-14T07:09:44.172+05:30"
result.sun.riseLocal.slice(11, 16);    // "07:09"
```

### Build a `name → house` map from a BirthChart

```typescript
const houseOf = {};
d1.planets.forEach(p => { houseOf[p.planet] = p.house; });
```

### Filter to classical 9 grahas

`computePlanetaryPositions` returns exactly 9 grahas — no Uranus/Neptune/Pluto. No filter needed.

### Resolve the Moon's sidereal longitude for dasha calls

```typescript
const pos = computePlanetaryPositions(birth, 'lahiri');
const moonLon = pos.moon.siderealLongitude;
const ashtottari = computeAshtottariDasha(birth, moonLon);
```

---

## 15. Gotchas and known behaviors

### 1. `computePlanetaryPositions` has two bugs
- `rashi.name` and `nakshatra.name` are stringified indices (`"11"`, `"25"`) — not real names.
- The 4-argument form (true node) crashes with `rashiNameFn is not a function`.

Use `computeRashiChart` / `computeNavamsa` for real names. Use `computePlanetaryPositions` only for nakshatra **indices** and pada.

### 2. D9/D10/D12/D30 omit `bhava` and `byPlanet`
Only `lagnaRashi` and `planets`. Derive houses from `lagnaRashi.index`.

### 3. Vimshottari is 2-level
Maha → Antar. Pratyantar is a separate call: `computeVimshottariPratyantar(antar)`.

### 4. Rashi names are Sanskrit
`"Vrishabha"`, `"Meena"` — unlike `@prisri/jyotish` which uses English.

### 5. `amritKala` and `varjyam` are arrays
`TimePeriod[]` since v5.1. 0–2 windows per day. `[]` means none.

### 6. `durMuhurta` is an array
`DurMuhurtaPeriod[]` since v5.1.1. 1–2 windows. Tuesday carries a night window (`segment: 'night'`).

### 7. Both `dinamanaMinutes` and `dayDurationMinutes` exist
They are aliases. Same for `ratrimanaMinutes` / `nightDurationMinutes`.

### 8. `result.timezone` is an object
`{ offsetMinutes: 330, zone: 'Asia/Kolkata' }`. `zone` is present only when you passed an IANA name.

### 9. Placidus throws at polar latitudes
Beyond ±66.5°, `computeBhava` with `houseSystem: 'placidus-kp'` throws `PanchangError('CIRCUMPOLAR')`.

### 10. `getPanchangamDetails` does not exist
Despite appearing in the README, this function is not exported. The panchang entry points are `getDailyPanchang` and `getInstantPanchang`.

### 11. No `computeGochar`
panchang-ts provides `computeChandraBalam`, `computeTarabala`, and `computeSadeSati` — but no full 9-planet gochar. Build it from `computePlanetaryPositions(new Date(), 'lahiri')` + your natal chart.

### 12. No Varshaphala in the free tier
`computeVarshaphala` exists but requires a valid `nthYear` (1-based solar return). It is not part of the daily result.

### 13. No `getAyanamsa` in the inspected bundle
Despite appearing in the types list, `getAyanamsa` is not exported from the main entry in v5.1.1. Use `computePlanetaryPositions` which takes the ayanamsa string directly.

---

## 16. TypeScript types reference

All exported from `panchang-ts`:

```typescript
import type {
  // Daily / instant
  DailyPanchangResult, InstantPanchangResult,
  PanchangOptions, PanchangSection,
  // Groups
  SunGroup, MoonGroup, AngasGroup, CalendarGroup,
  MuhurtasGroup, InauspiciousGroup, PeriodsGroup,
  // Elements
  TithiInfo, DailyTithiInfo, NakshatraInfo, DailyNakshatraInfo,
  YogaInfo, DailyYogaInfo, KaranaInfo, DailyKaranaInfo, VaraInfo,
  TimePeriod, DurMuhurtaPeriod, BhadraInfo, GandaMulaInfo,
  ChandraMasa, Samvat, SauraMasa,
  ChoghadiyaSlot, HoraSlot, GowriSlot,
  SpecialYoga, AnandadiYoga, FestivalInfo, EclipseInfo,
  ChandraBalam, Tarabala,
  // Astronomy
  GrahaPosition, GrahaName,
  // Charts
  LagnaInfo, BhavaGroup, BirthChart,
  HouseSystem, Ayanamsa, Dignity, DivisionalKey,
  // Dashas
  VimshottariDashaResult, YoginiDashaResult, CharaDashaResult, NarayanDashaResult,
  // Strength
  ShadbalaComponents, AshtakavargaResult, Yoga, Karakas,
  // Doshas
  AshtakootResult, PathuPoruthamResult, MangalDoshaResult,
  KaalSarpResult, PitruDoshaResult,
  // Annual
  VarshaphalaResult, TithiPraveshaResult, ArudhaResult, Upagraha,
  // KP
  KpSubLordInfo, KpCuspalSubLords, KpSignificators,
} from 'panchang-ts';
```

---

## 17. What's NOT in this library

| Feature | Availability |
|---|---|
| Gochar (full 9-planet transits) | ❌ — build from `computePlanetaryPositions` |
| Chandra Balam / Tarabala | ✅ |
| Sade Sati | ✅ |
| Varshaphala | ✅ (but needs nthYear) |
| Shadbala | ✅ |
| Bhava Bala | ✅ |
| Ashtakavarga with reductions | ✅ |
| Argala | ✅ |
| Upagrahas | ✅ |
| Special lagnas (Hora, Ghati, Bhava, Sripati) | ✅ |
| Ashtottari / Yogini / Chara / Narayan dashas | ✅ |
| Vimshottari Pratyantar | ✅ (separate call) |
| Vimshottari Sookshma / Prana | ❌ |
| Muhurta scoring | ✅ |
| KP cuspal sub-lords | ✅ |
| KP significators | ✅ |
| Prashna chart | ✅ |
| Yogas (25 named) | ✅ |
| Jaimini karakas (7 and 8) | ✅ |
| Compatibility (Ashtakoot, Pathu) | ✅ |
| Doshas (Mangal, Kaal Sarp, Pitru) | ✅ |
| Festival table building | ✅ |
| Eclipse table building | ✅ |
| Muhurta table building | ✅ |
| Western aspects | ❌ |
| Panchanga table for a whole year | ✅ (via range helpers) |

---

