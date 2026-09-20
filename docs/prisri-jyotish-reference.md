@prisri/jyotish — Complete API Reference
Version: 1.1.7 · License: ISC · Pure TypeScript, browser + Node + React Native.

1. Overview
@prisri/jyotish computes Vedic astrology (Jyotish) and Panchangam data. It uses astronomy-engine for high-precision ephemeris calculations. All computations run client-side, offline. No API key required.

What it provides
Domain	Coverage
Birth chart	Lagna, 9 planets + Uranus/Neptune/Pluto, 12 houses, dignities, retrograde, combust, vargottama
Divisional charts	20 vargas — D1 through D60
Special lagnas	Ghatika, Hora, Bhava, Shree, Indu, Pranapada
Reference charts	Chandra Kundli (Moon as lagna), Surya Kundli (Sun as lagna)
Jaimini	12 Arudha Padas (A1–A12), 7/8 Chara Karakas
Dashas	Vimshottari (3 levels)
Aspects	Graha Drishti — Parashari rules
Ashtakavarga	BAV (7 planets), SAV, house strengths
Bhava Chalit	Sripati + Equal House systems, shift detection
KP system	Placidus cusps, 4-fold lords, significators, ruling planets
Matching	Ashtakoota 36-guna, Mangal Dosha
Panchangam	Tithi, Nakshatra, Yoga, Karana, Vara, sunrise/sunset, Rahu Kalam, Choghadiya, Hora
Transits	Gochar with Vedha, Sade Sati, Dhaiya, Chandrashtama, Tarabalam
Predictions	Career, Wealth, Marriage, Remedies, Lal Kitab
Festivals	Hindu festivals, Ekadashi names
2. Installation & setup
bash
npm install @prisri/jyotish
Basic imports
typescript
import {
  getKundli, Observer,
  getPanchangamDetails,
  getChalitChart, getPlanetChalitInfo,
  getSpecialLagnas,
  getArudhaPadas,
  getGrahaDrishti,
  getAshtakavarga,
  getKpChart, getKpPlanetInfo,
  getGocharAnalysis, getPlanetGochar,
  checkSadeSati, checkDhaiya,
  getCareerPrediction, getWealthPrediction,
  getMarriagePrediction, getRemedies,
  getJaiminiKarakas,
  getComprehensiveReport,
  matchKundli, checkMangalDosha,
} from '@prisri/jyotish';
3. Core function: getKundli()
Signature
typescript
getKundli(
  date: Date,
  observer: Observer,
  config?: KundliConfig
): Kundli
The Observer class
typescript
new Observer(latitude, longitude, elevationMeters)
Example:

typescript
const observer = new Observer(27.70169, 85.3206, 1300); // Kathmandu
The date input
Pass a real Date object. If you have a wall-clock time and IANA timezone, build the Date with an explicit offset:

typescript
// Wall-clock: 1983-03-26 08:45 at +05:30 (Kathmandu)
const birth = new Date('1983-03-26T08:45:00+05:30');
Config options
Option	Type	Default	What it does
ayanamsa	'lahiri' | 'kp' | 'raman'	'lahiri'	Sidereal correction scheme
houseSystem	'whole_sign' | 'sripati' | 'equal_house' | 'placidus'	'whole_sign'	How the 12 bhavas are divided
lang	'en' | 'hi'	'en'	Output language
gender	'male' | 'female' | 'other'	—	Optional, used by some predictions
includeChalit	boolean	false	Attaches kundli.chalit
includeKp	boolean	false	Attaches kundli.kp
includeSpecialLagnas	boolean	false	Attaches kundli.specialLagnas
includeArudhas	boolean	false	Attaches kundli.arudhaPadas
includeReferenceCharts	boolean	false	Attaches kundli.chandraKundli, kundli.suryaKundli
Full example
typescript
const kundli = getKundli(birth, observer, {
  ayanamsa: 'lahiri',
  houseSystem: 'whole_sign',
  includeChalit: true,
  includeKp: true,
  includeSpecialLagnas: true,
  includeArudhas: true,
  includeReferenceCharts: true,
});
Note: getKundli always computes drishti, ashtakavarga, and vargas — those aren't optional.

4. Data structures
4.1 Kundli (root object)
typescript
interface Kundli {
  birthDetails: BirthDetails;
  ascendant: Ascendant;
  planets: Record<string, PlanetaryPosition>;   // keyed by planet name
  houses: Bhava[];                              // 12 entries
  dasha: DashaResult;
  vargas: Record<string, VargaChart>;           // keys: d1, d2, d3, …, d60
  drishti: DrishtiResult;
  ashtakavarga: AshtakavargaResult;
  chalit?: ChalitChart;                         // if includeChalit
  kp?: KpChart;                                 // if includeKp
  specialLagnas?: SpecialLagnasResult;          // if includeSpecialLagnas
  arudhaPadas?: ArudhaPadasResult;              // if includeArudhas
  chandraKundli?: VargaChart;                   // if includeReferenceCharts
  suryaKundli?: VargaChart;                     // if includeReferenceCharts
}
4.2 BirthDetails
typescript
interface BirthDetails {
  date: string;              // "26/3/1983" (day/month/year)
  time: string;              // "8:45:00 am"
  rawDate: Date;             // the original Date object
  lat: number;
  lon: number;
  timezone: number;          // UTC offset in minutes
  gender?: 'male' | 'female' | 'other';
  age: {
    years: number; months: number; days: number;
    hours: number; minutes: number; seconds: number;
    totalMonths: number; totalDays: number;
    totalHours: number; totalMinutes: number; totalSeconds: number;
  };
}
4.3 Ascendant
typescript
interface Ascendant {
  rashi: number;              // 0–11 (Mesha=0 … Meena=11)
  rashiName: string;          // "Taurus" ← ENGLISH name, not Sanskrit
  rashiLord: string;          // "Venus"
  longitude: number;          // 36.77 (sidereal 0–360)
  degree: number;             // 0–30 within rashi
  minute: number;             // 0–59
  second: number;             // 0–59
  nakshatra: string;          // "Krittika"
  nakshatraLord: string;      // "Sun"
  pada: number;               // 1–4
}
4.4 PlanetaryPosition
typescript
interface PlanetaryPosition {
  longitude: number;          // 0–360 sidereal
  rashi: number;              // 0–11
  rashiName: string;          // ENGLISH: "Pisces"
  rashiLord: string;          // "Jupiter"
  nakshatra: string;          // "Uttara Bhadrapada"
  nakshatraLord: string;      // "Saturn"
  pada: number;               // 1–4
  degree: number;             // 0–30
  minute: number;             // 0–59
  second: number;             // 0–59
  isRetrograde: boolean;
  isCombust: boolean;
  isVargottama: boolean;
  speed: number;
  dignity: 'exalted' | 'moolatrikona' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
}
Critical gotchas:

There is NO .house field on planets. To find a planet's house, read kundli.houses[].planets[] — the library places names into houses, not vice versa. Build a reverse map if needed:

typescript
const housesByPlanet = (kundli) => {
  const m = {};
  kundli.houses.forEach(h => h.planets.forEach(p => { m[p] = h.number; }));
  return m;
};
Rashi names are English ("Taurus"), not Sanskrit. Convert with your own alias table if you need "Vrishabha".

Degree / minute / second are three separate numbers. Not one decimal. 12°34'56" = { degree: 12, minute: 34, second: 56 }.

The planets object also contains Uranus, Neptune, Pluto — filter them out if you want classical 9 grahas only.

4.5 Bhava (house)
typescript
interface Bhava {
  number: number;             // 1–12
  rashi: number;              // 0–11 (which sign occupies this house)
  longitude: number;          // sidereal longitude of the house cusp
  startLongitude: number;     // house start
  endLongitude: number;       // house end
  planets: string[];          // names only — ["Mars", "Venus"]
}
planets[] is the authoritative source for who's in what house.

4.6 DashaResult
typescript
interface DashaResult {
  birthNakshatra: string;
  nakshatraPada: number;
  mahadashas: DashaPeriod[];       // 9 entries
  currentMahadasha?: CurrentPeriod;
  currentAntar?: CurrentPeriod;
  currentPratyantar?: CurrentPeriod;
}

interface DashaPeriod {
  planet: string;
  startTime: Date;
  endTime: Date;
  durationYears: number;
  antars?: DashaPeriod[];          // nested (2nd level)
  pratyantars?: DashaPeriod[];     // nested within each antar (3rd level)
}

interface CurrentPeriod {
  planet: string;
  startTime: Date;
  endTime: Date;
  durationYears: number;
  progressPercent: number;
}
Three-level hierarchy:

text
Mahadasha
  └── Antardasha (maha.antars[i])
        └── Pratyantardasha (maha.antars[i].pratyantars[j])
4.7 VargaChart
Uniform shape for all divisional charts.

typescript
interface VargaChart {
  ascendant: {
    rashi: number;
    rashiName: string;        // ENGLISH
  };
  planets: Record<string, {   // minimal — only rashi info
    rashi: number;
    rashiName: string;
  }>;
  houses: Bhava[];            // 12 entries — use this for placements
}
Access pattern:

typescript
kundli.vargas.d1      // Rashi
kundli.vargas.d2      // Hora
kundli.vargas.d3      // Drekkana
kundli.vargas.d4      // Chaturthamsa
kundli.vargas.d5      // Panchamsa
kundli.vargas.d6      // Shashthamsa
kundli.vargas.d7      // Saptamsa
kundli.vargas.d8      // Ashtamsa
kundli.vargas.d9      // Navamsa
kundli.vargas.d10     // Dasamsa
kundli.vargas.d11     // Rudramsa
kundli.vargas.d12     // Dwadasamsa
kundli.vargas.d16     // Shodasamsa
kundli.vargas.d20     // Vimsamsa
kundli.vargas.d24     // Siddhamsa
kundli.vargas.d27     // Bhamsa
kundli.vargas.d30     // Trimsamsa
kundli.vargas.d40     // Khavedamsa
kundli.vargas.d45     // Akshavedamsa
kundli.vargas.d60     // Shashtiamsa
Key insight: varga planet objects carry only { rashi, rashiName }. The full PlanetaryPosition (degree, minute, retrograde, dignity) is only on kundli.planets. To render charts, use varga.houses[].planets[].

4.8 DrishtiResult
typescript
interface DrishtiResult {
  planetAspects: Record<string, {
    planet: string;
    sourceHouse: number;
    sourceRashi: number;
    aspectedHouses: { house: number; type: string }[];
    aspectedPlanets: { planet: string; type: string }[];
  }>;
  houseAspects: Record<number, string[]>;  // house# → [planet names]
  mutualAspects: {
    planet1: string;
    planet2: string;
    planet1AspectOnPlanet2: string;   // e.g. "7th"
    planet2AspectOnPlanet1: string;
  }[];
}
4.9 AshtakavargaResult
typescript
interface AshtakavargaResult {
  bav: Record<string, PlanetBAV>;   // keyed by "Sun", "Moon", …
  sav: {
    totalBindus: number;
    byRashi: number[];              // 12
    byHouse: number[];              // 12
    houseStrengths: {
      house: number;
      rashi: number;
      bindus: number;
      strength: string;             // "Strong" | "Medium" | "Weak"
      category: string;             // "beneficial" | "challenging" | …
    }[];
    strongestHouse: number;
    weakestHouse: number;
    averageBindus: number;
  };
}

interface PlanetBAV {
  planet: string;
  totalBindus: number;
  byRashi: number[];                // 12
  byHouse: number[];                // 12
  contributionsByRef: Record<string, number[]>;  // 8 refs × 12 rashi
}
4.10 ChalitChart (Bhava Chalit)
typescript
interface ChalitChart {
  system: 'sripati' | 'equal_house';
  ascendant: {
    rashi: number;
    rashiName: string;
    longitude: number;
    degree: number;
    minute: number;
    second: number;
  };
  planets: ChalitPlanet[];
  housesCusps: {
    houseNumber: number;
    startLongitude: number;
    endLongitude: number;
    rashi: number;
    rashiName: string;
  }[];
  bhavas: {
    houseNumber: number;
    madhyaLongitude: number;
    madhyaDegree: number;
    madhyaMinute: number;
    madhyaSecond: number;
    startLongitude: number;
    endLongitude: number;
    span: number;
    rashi: number;
    rashiName: string;
    planets: string[];
  }[];
}

interface ChalitPlanet {
  name: string;
  longitude: number;
  degree: number; minute: number; second: number;
  rashi: number;
  rashiName: string;
  rashiHouse?: number;    // house in D1
  house: number;          // house in Chalit
  shifted?: number;       // -1, 0, or +1
  housePosition: number;
  housePositionDegree: number;
  housePositionMinute: number;
  percentage?: number;
  isRetrograde?: boolean;
  isCombust?: boolean;
}
4.11 KpChart
typescript
interface KpChart {
  birthDetails: { date: string; time: string; lat: number; lon: number; timezone: number };
  ayanamsa: number;
  ayanamsaName: string;       // "KP"
  ascendant: KpCusp;
  midheaven: {
    longitude: number; degree: number; minute: number; second: number;
    rashi: number; rashiName: string; rashiLord: string;
    nakshatraName: string; nakshatraLord: string; subLord: string;
  };
  cusps: KpCusp[];            // 12
  planets: Record<string, KpPlanet>;
  houses: any[];
  significators: {
    houses: Record<number, {
      houseNumber: number;
      levelA: string[];
      levelB: string[];
      levelC: string[];
      levelD: string[];
    }>;
    planets: Record<string, {
      planetName: string;
      levelA: number[];
      levelB: number[];
      levelC: number[];
      levelD: number[];
      allHouses: number[];
    }>;
  };
  rulingPlanets: {
    ascendant: { rashiLord: string; nakshatraLord: string; subLord: string };
    moon: { rashiLord: string; nakshatraLord: string; subLord: string };
    dayLord: string;
    rulingPlanetsList: string[];
  };
}

interface KpCusp {
  houseNumber: number;
  longitude: number; degree: number; minute: number; second: number;
  rashi: number; rashiName: string; rashiLord: string;
  nakshatra: number; nakshatraName: string; nakshatraLord: string;
  subLord: string;
  subSubLord: string;
  startLongitude: number; endLongitude: number; span: number;
  planets: string[];
}

interface KpPlanet {
  name: string;
  longitude: number; degree: number; minute: number; second: number;
  rashi: number; rashiName: string; rashiLord: string;
  nakshatra: number; nakshatraName: string; nakshatraLord: string;
  subLord: string;
  subSubLord: string;
  house: number;
  housePosition: number;
  housePositionDegree: number;
  housePositionMinute: number;
  isRetrograde: boolean;
  isCombust: boolean;
  speed: number;
}
4.12 SpecialLagnasResult
typescript
interface SpecialLagnasResult {
  ghatikaLagna:   SpecialLagna;    // Power & authority
  horaLagna:      SpecialLagna;    // Wealth
  bhavaLagna:     SpecialLagna;    // Vitality
  shreeLagna:     SpecialLagna;    // Prosperity
  induLagna: {
    rashi: number;
    rashiName: string;
    totalKalas: number;
    ninthLordFromLagna: string;
    ninthLordFromMoon: string;
    kalasLagnaNinth: number;
    kalasMoonNinth: number;
  };
  pranapadaLagna: SpecialLagna;    // Birth-time rectification
}

interface SpecialLagna {
  longitude: number; rashi: number; rashiName: string;
  degree: number; minute: number; second: number;
  nakshatra: string; nakshatraLord: string; pada: number;
}
4.13 ArudhaPadasResult
typescript
interface ArudhaPadasResult {
  a1_al:  ArudhaPada;   // Arudha Lagna — public persona
  a2:     ArudhaPada;   // Dhana Pada — wealth
  a3:     ArudhaPada;   // Bhratri Pada — siblings
  a4:     ArudhaPada;   // Matri Pada — home
  a5:     ArudhaPada;   // Putra Pada — children
  a6:     ArudhaPada;   // Shatru Pada — enemies
  a7:     ArudhaPada;   // Dara Pada — partnerships
  a8:     ArudhaPada;   // Mrityu Pada — longevity
  a9:     ArudhaPada;   // Bhagya Pada — fortune
  a10:    ArudhaPada;   // Rajya Pada — status
  a11:    ArudhaPada;   // Labha Pada — gains
  a12_ul: ArudhaPada;   // Upapada Lagna — marriage
  all:    ArudhaPada[]; // all 12 in order
}

interface ArudhaPada {
  pada: number;
  code: string;          // "A1", "A7", …
  name: string;          // full descriptive name
  rashi: number;
  rashiName: string;
  houseNumber: number;
  lord: string;
}
5. Auxiliary functions
5.1 Panchangam
typescript
const panchang = getPanchangamDetails(date, observer);
Returns PanchangamDetails:

tithi, paksha, nakshatra, nakshatraPada, yoga, karana, vara

sunrise, sunset (Date)

rahuKalam, abhijitMuhurta, brahmaMuhurta — { start, end }

currentHora — { lord, ... }

Choghadiya, Gowri Panchangam arrays

5.2 Chalit
typescript
const chalit = getChalitChart(kundli, 'sripati');       // or 'equal_house'
const shifted = getPlanetChalitInfo(chalit, 'Moon');
// → { rashiHouse, house, shifted, … }
const text = formatChalitChart(chalit);                 // pretty-print string
5.3 Special lagnas
typescript
const sl = getSpecialLagnas(kundli);
const glChart   = getGhatikaChart(kundli);
const hlChart   = getHoraLagnaChart(kundli);
const induChart = getInduLagnaChart(kundli);
const blChart   = getBhavaLagnaChart(kundli);
Each chart returns the standard VargaChart shape (ascendant + planets + houses).

5.4 Arudha charts
typescript
const padas = getArudhaPadas(kundli);
const alChart = getArudhaLagnaChart(kundli);   // AL as house 1
const ulChart = getUpapadaChart(kundli);        // UL as house 1
5.5 Aspects
typescript
const drishti = getGrahaDrishti(kundli);
See DrishtiResult above.

5.6 Ashtakavarga
typescript
const av = getAshtakavarga(kundli);
5.7 KP
typescript
const kp = getKpChart(date, observer, { ayanamsa: 'kp' });
const venus = getKpPlanetInfo(kp, 'Venus');
// → { nakshatraLord, subLord, subSubLord, house, … }
const text = formatKpChart(kp);
5.8 Gochar (transits)
typescript
const gochar = getGocharAnalysis(kundli, new Date());
// → {
//     overallVerdict, overallFavorablePercentage,
//     planets: Record<string, PlanetGochar>,
//     specialTransits: { sadeSati, guruGochar, … },
//     lifeAreas: { career: { rating, summary }, wealth: …, … }
//   }

const jupTransit = gochar.planets.Jupiter;
// → { rashiName, houseFromMoon, netStatus, hasVedha, prediction }

const saturnTransit = getPlanetGochar('Saturn', kundli);

const sadeSati = checkSadeSati(moonLon, saturnLon);
// → { status, phase: 1|2|3 }

const dhaiya = checkDhaiya(moonLon, saturnLon);
// → { status, type: 'Fourth'|'Eighth' }

const chandra = getChandrashtama(natalRashi, transitRashi);
const tara    = getTarabalam(janmaNak, transitNak);
// → { taraName, isAuspicious, description }

const shoola  = getDishaShoola(varaIndex);
const safe    = isDirectionSafe('North', varaIndex);
5.9 Matching
typescript
const boy  = getKundli(boyDate,  boyObserver);
const girl = getKundli(girlDate, girlObserver);

const match = matchKundli(boy, girl);
// → {
//     totalScore: number,        // 0–36
//     verdict: string,           // "Good Match" | "Average" | "Poor"
//     kootas: { name, score, maxScore, description }[]   // 8 entries
//   }

const dosha = checkMangalDosha(kundli);
// → { hasDosha: boolean, description, severity, cancellations }
5.10 Predictions
typescript
const career  = getCareerPrediction(kundli);
// → { recommendation, tenthLordPlacementResult, amatyakarakaInsight, kpInsight, … }

const wealth  = getWealthPrediction(kundli);
// → { wealthRating, secondLordPlacementResult, eleventhLordPlacementResult,
//     vipreetRajYogas, … }

const marriage = getMarriagePrediction(kundli);
// → { marriageType: { recommendation }, spouseAgeDifference, 
//     seventhLordPlacementResult, darakarakaInsight, … }

const remedies = getRemedies(kundli);

const jaimini  = getJaiminiKarakas(kundli);
// → { atmakaraka: { planet, formattedDegree, … },
//     amatyakaraka: { … },
//     bhratrukaraka: { … },
//     matrukaraka: { … },
//     putrakaraka: { … },
//     gnatikaraka: { … },
//     darakaraka: { … } }

const chalitAnalysis = getChalitAnalysis(kundli);
// → { shiftedPlanets: […] }

const kpAnalysis = getKpAnalysis(kundli);
// → { careerCusp10: { subLord }, marriageCusp7: { subLord }, … }

const lalKitab = getLalKitabAnalysis(kundli);
// → { tevaType, kismatKaGrah, lalKitabRemedies, … }

const report = getComprehensiveReport(kundli);
// → { formattedMarkdown, structured JSON, … }
5.11 Festivals
typescript
const festivals = getFestivals(date);
// → [{ name, description, type, … }]

const ekadashi = getEkadashiName(tithiNum, masaIndex);
6. Common recipes
Get a planet's house number
typescript
function planetHouse(kundli, planetName) {
  const h = kundli.houses.find((h) => h.planets.includes(planetName));
  return h?.number ?? null;
}
Get all planets in a given sign
typescript
function planetsInRashi(kundli, rashiIndex) {
  return Object.entries(kundli.planets)
    .filter(([_, p]) => p.rashi === rashiIndex)
    .map(([name]) => name);
}
Filter to classical 9 grahas
typescript
const CLASSICAL = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const classical = Object.fromEntries(
  Object.entries(kundli.planets).filter(([n]) => CLASSICAL.includes(n))
);
Convert English rashi name to Sanskrit / index
typescript
const ENGLISH_TO_CANONICAL = {
  Aries:'Mesha', Taurus:'Vrishabha', Gemini:'Mithuna', Cancer:'Karka',
  Leo:'Simha', Virgo:'Kanya', Libra:'Tula', Scorpio:'Vrischika',
  Sagittarius:'Dhanus', Capricorn:'Makara', Aquarius:'Kumbha', Pisces:'Meena',
};
const RASHI_ORDER = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya',
  'Tula','Vrischika','Dhanus','Makara','Kumbha','Meena'];

function rashiIndex(englishName) {
  return RASHI_ORDER.indexOf(ENGLISH_TO_CANONICAL[englishName]);
}
Format degree-minute-second
typescript
const fmt = (d, m, s) => `${d ?? 0}° ${String(m ?? 0).padStart(2,'0')}' ${String(s ?? 0).padStart(2,'0')}"`;
// 12° 34' 56"
Build a "name → house" map from houses[]
typescript
const map = {};
kundli.houses.forEach(h => h.planets.forEach(p => { map[p] = h.number; }));
Build a "rashi index → planet names" map for a chart
typescript
function planetsByRashi(chart) {
  const out = {};
  Object.entries(chart.planets).forEach(([name, p]) => {
    const idx = p.rashi;                    // numeric 0-11 — safe to use here
    (out[idx] ??= []).push(name);
  });
  return out;
}
Find current dasha trail
typescript
const maha = kundli.dasha.currentMahadasha;
const antar = kundli.dasha.currentAntar;
const prat = kundli.dasha.currentPratyantar;
console.log(`${maha.planet} / ${antar.planet} / ${prat.planet}`);
7. Gotchas and known behaviors
1. Rashi names are English, not Sanskrit
"Taurus", "Pisces" — always. Convert to Sanskrit with your own alias table.

2. Planets have no house field
Read kundli.houses[].planets[] instead. The library does the placement for you there.

3. Varga planets are minimal
varga.planets.Sun has only { rashi, rashiName }. Full details live on kundli.planets. Use varga.houses[].planets[] for placements.

4. DMS are three separate numbers
Never 12.345 — always { degree: 12, minute: 20, second: 42 }. Format yourself.

5. Outer planets included
kundli.planets contains Uranus, Neptune, Pluto. Filter them out for classical charts.

6. Panchang is a separate call
Not bundled in getKundli. Use getPanchangamDetails(date, observer).

7. Chalit / KP / Special / Arudha are opt-in
Pass includeChalit: true etc. to attach them, or call the standalone getter functions.

8. Placidus throws at polar latitudes
Beyond ±66.5° the Placidus cusps are undefined. houseSystem: 'placidus' will fail. Whole-sign / Sripati / Equal work everywhere.

9. House numbering is 1-indexed in output
house.number is 1..12 (not 0..11). But rashi is 0-indexed.

10. Vimshottari is exactly 3 levels
No deeper tree by default. maha.antars[] and maha.antars[i].pratyantars[].

11. dasha.currentMahadasha.antars is undefined
The current-period objects are stripped-down CurrentPeriod — no nested list. For the full tree, walk dasha.mahadashas[].

12. Date format in birthDetails
"26/3/1983" (day/month/year) and "8:45:00 am" — display strings, not ISO.

8. TypeScript types reference
All exported from @prisri/jyotish:

typescript
import type {
  // Core
  Kundli, KundliConfig, Observer,
  PlanetaryPosition, Bhava, VargaChart,
  // Special
  SpecialLagna, SpecialLagnasResult, InduLagnaInfo,
  // Jaimini
  ArudhaPadaInfo, ArudhaPadasResult,
  // Dasha
  VimshottariDasha,
  // Chalit / KP
  ChalitChart, KpChart, KpCusp, KpPlanet, KpSignificators, KpRulingPlanets,
  // Analysis
  DrishtiResult, PlanetAspect, MutualAspect,
  AshtakavargaResult, PlanetBAV, SAVResult,
  // Panchang
  PanchangamDetails,
  // Matching
  MatchResult, DoshaResult, KootaResult,
  // Transits
  TarabalamInfo, ChandrashtamaInfo, DishaShoola,
  // Predictions
  CareerPrediction, WealthPrediction, MarriagePrediction,
  RemediesPrediction, ComprehensiveReport,
} from '@prisri/jyotish';
9. What's NOT in this library
Feature	Availability
Bhava Chalit as a chart with planets	✅ (via chalit.planets[])
Vimshottari beyond Pratyantar (Sookshma / Prana)	❌
Yogini dasha	❌
Ashtottari dasha	❌
Chara dasha (Jaimini)	❌
Narayan dasha	❌
Western aspects (trines, squares)	❌
Solar return / Varshaphala	❌
Tajika / annual charts	❌
Ashtakavarga with reductions (Trikona/Ekadhipatya)	❌ (raw BAV/SAV only)
Shadbala (6-fold strength)	❌
Bhava Bala	❌
Panchanga-tables for a whole year	❌ (single-day only)
Muhurta scoring	❌
Prashna / horary	❌ (KP cusps only)
For any of those, pair @prisri/jyotish with panchang-ts (which has Varshaphala, Shadbala, Ashtottari, Yogini, Chara, Narayan, Argala, and muhurta) or compute the classical formulas yourself.

10. Version history notes
v1.1.7 — current. Uses astronomy-engine for ephemeris.

v1.0.9 — added Drishti, Ashtakavarga, and full prediction suite (career / wealth / marriage / remedies).

Earlier — core kundli, vargas, dashas, panchang.