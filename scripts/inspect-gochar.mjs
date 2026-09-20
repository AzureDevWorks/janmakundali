// scripts/inspect-gochar.mjs
//
//   node scripts/inspect-gochar.mjs               → all sections
//   node scripts/inspect-gochar.mjs keys          → compact shape tree
//   node scripts/inspect-gochar.mjs analysis      → full getGocharAnalysis
//   node scripts/inspect-gochar.mjs planet        → single-planet lookups
//   node scripts/inspect-gochar.mjs sade          → sade sati / dhaiya
//   node scripts/inspect-gochar.mjs chandra       → chandrashtama / tarabalam
//   node scripts/inspect-gochar.mjs disha         → disha shoola

import {
  getKundli, Observer,
  getGocharAnalysis, getPlanetGochar,
  checkSadeSati, checkDhaiya,
  getChandrashtama, getTarabalam,
  getDishaShoola, isDirectionSafe,
} from '@prisri/jyotish';

/* ------------------------------------------------------------------ *
 * Test profile — Bikash Moktan, Kathmandu 1983-03-26 08:45 (+05:30)
 * ------------------------------------------------------------------ */
const birth = new Date('1983-03-26T08:45:00+05:30');
const observer = new Observer(27.70169, 85.3206, 1300);
const kundli = getKundli(birth, observer, {
  includeChalit: true, includeKp: true,
  includeSpecialLagnas: true, includeArudhas: true,
  includeReferenceCharts: true,
});

const now = new Date();

/* ------------------------------------------------------------------ *
 * Output helpers
 * ------------------------------------------------------------------ */
const HR = '='.repeat(72);
const SR = '-'.repeat(72);

const section = (s) => { console.log('\n' + HR); console.log('▶ ' + s); console.log(HR); };

function replacer(k, v) {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'function') return '[Function]';
  if (Array.isArray(v) && v.length > 8 && k !== '') {
    return v.slice(0, 8).concat([`... ${v.length - 8} more`]);
  }
  return v;
}

function shape(value, depth = 0, maxDepth = 5, seen = new WeakSet()) {
  const ind = '  '.repeat(depth);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (value instanceof Date) return 'Date';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[\n${ind}  <${value.length}>\n${ind}  ${shape(value[0], depth + 1, maxDepth, seen)}\n${ind}]`;
  }
  if (typeof value === 'object') {
    if (seen.has(value)) return '<circular>';
    seen.add(value);
    if (depth >= maxDepth) return '{...}';
    const keys = Object.keys(value);
    const lines = keys.map((k) => `${ind}  ${k}: ${shape(value[k], depth + 1, maxDepth, seen)}`);
    return `{\n${lines.join('\n')}\n${ind}}`;
  }
  if (typeof value === 'string') return JSON.stringify(value);
  return typeof value;
}

const safe = (label, fn) => {
  try {
    const v = fn();
    section(label);
    try { console.log(JSON.stringify(v, replacer, 2)); }
    catch { console.log(String(v)); }
    return v;
  } catch (e) {
    section(label + '  —  ❌ FAILED');
    console.log('Error:', e.message);
    console.log('Stack (top 4):', (e.stack ?? '').split('\n').slice(0, 5).join('\n'));
    return null;
  }
};

/* ------------------------------------------------------------------ *
 * Sections
 * ------------------------------------------------------------------ */
const sections = {
  analysis: () => {
    const g = safe('getGocharAnalysis(kundli, now)', () => getGocharAnalysis(kundli, now));
    if (!g) return;

    section('gochar top-level keys');
    console.log(Object.keys(g));

    if (g.planets) {
      section('gochar.planets — keys (which planets are present)');
      console.log(Object.keys(g.planets));

      section('gochar.planets.Sun — full shape');
      console.log(JSON.stringify(g.planets.Sun, replacer, 2));

      section('gochar.planets.Saturn — full shape (the important one)');
      console.log(JSON.stringify(g.planets.Saturn, replacer, 2));
    }

    if (g.specialTransits) {
      section('gochar.specialTransits — keys');
      console.log(Object.keys(g.specialTransits));
    }

    if (g.lifeAreas) {
      section('gochar.lifeAreas — keys');
      console.log(Object.keys(g.lifeAreas));
      section('gochar.lifeAreas.career — full shape');
      console.log(JSON.stringify(g.lifeAreas.career, replacer, 2));
    }
  },

  planet: () => {
    for (const name of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
      safe(`getPlanetGochar('${name}', kundli)`, () => getPlanetGochar(name, kundli));
    }
  },

  sade: () => {
    safe('checkSadeSati(120.5, 330.2)', () => checkSadeSati(120.5, 330.2));
    safe('checkSadeSati(120.5, 121.5)  [Saturn in 1st from Moon]', () => checkSadeSati(120.5, 121.5));
    safe('checkSadeSati(120.5, 150.5)  [Saturn in 2nd from Moon]', () => checkSadeSati(120.5, 150.5));
    safe('checkSadeSati(120.5, 90.5)   [Saturn in 12th from Moon]', () => checkSadeSati(120.5, 90.5));
    safe('checkSadeSati(120.5, 210.5)  [Saturn far]', () => checkSadeSati(120.5, 210.5));

    safe('checkDhaiya(120.5, 210.5)    [8th from Moon]', () => checkDhaiya(120.5, 210.5));
    safe('checkDhaiya(120.5, 30.5)     [4th from Moon]', () => checkDhaiya(120.5, 30.5));
    safe('checkDhaiya(120.5, 100.5)    [neither]', () => checkDhaiya(120.5, 100.5));
  },

  chandra: () => {
    safe('getChandrashtama(0, 7)   [Aries native, Scorpio transit]',
      () => getChandrashtama(0, 7));
    safe('getChandrashtama(0, 8)   [Aries native, Sagittarius transit]',
      () => getChandrashtama(0, 8));
    safe('getChandrashtama(0, 0)   [same rashi]',
      () => getChandrashtama(0, 0));

    safe('getTarabalam(0, 1)       [Ashwini → Bharani]',
      () => getTarabalam(0, 1));
    safe('getTarabalam(0, 9)       [Ashwini → Magha]',
      () => getTarabalam(0, 9));
  },

  disha: () => {
    for (let d = 0; d <= 6; d++) {
      safe(`getDishaShoola(${d})`, () => getDishaShoola(d));
    }
    safe('isDirectionSafe("North", 0)', () => isDirectionSafe('North', 0));
    safe('isDirectionSafe("East", 0)',  () => isDirectionSafe('East', 0));
    safe('isDirectionSafe("West", 3)',  () => isDirectionSafe('West', 3));
  },
};

function keysMode() {
  const g = getGocharAnalysis(kundli, now);

  const probes = [
    ['getGocharAnalysis',       () => g],
    ['gochar.planets.Sun',      () => g?.planets?.Sun],
    ['gochar.planets.Saturn',   () => g?.planets?.Saturn],
    ['gochar.planets.Jupiter',  () => g?.planets?.Jupiter],
    ['gochar.specialTransits',  () => g?.specialTransits],
    ['gochar.lifeAreas',        () => g?.lifeAreas],
    ['gochar.lifeAreas.career', () => g?.lifeAreas?.career],
    ['gochar.lifeAreas.wealth', () => g?.lifeAreas?.wealth],
    ['gochar.lifeAreas.marriage', () => g?.lifeAreas?.marriage],
    ['gochar.lifeAreas.health', () => g?.lifeAreas?.health],
    ['getPlanetGochar Saturn',  () => getPlanetGochar('Saturn', kundli)],
    ['checkSadeSati active',    () => checkSadeSati(120.5, 121.5)],
    ['checkSadeSati inactive',  () => checkSadeSati(120.5, 210.5)],
    ['checkDhaiya 8th',         () => checkDhaiya(120.5, 210.5)],
    ['checkDhaiya 4th',         () => checkDhaiya(120.5, 30.5)],
    ['getChandrashtama',        () => getChandrashtama(0, 7)],
    ['getTarabalam',            () => getTarabalam(0, 1)],
    ['getDishaShoola',          () => getDishaShoola(0)],
  ];

  for (const [label, fn] of probes) {
    console.log('\n' + SR);
    console.log('▶ ' + label);
    console.log(SR);
    try { console.log(shape(fn(), 0, 5)); }
    catch (e) { console.log('❌ ' + e.message); }
  }
}

/* ------------------------------------------------------------------ *
 * Runner
 * ------------------------------------------------------------------ */
const arg = (process.argv[2] ?? 'all').toLowerCase();

console.log('Birth  :', birth.toISOString());
console.log('Observer:', `lat ${observer.latitude}, lon ${observer.longitude}`);
console.log('Now    :', now.toISOString());

try {
  if (arg === 'keys') {
    keysMode();
  } else if (arg === 'all') {
    sections.analysis();
    sections.planet();
    sections.sade();
    sections.chandra();
    sections.disha();
  } else if (sections[arg]) {
    sections[arg]();
  } else {
    console.error(`Unknown section "${arg}".`);
    console.error('Options:', Object.keys(sections).join(', '), '| all | keys');
    process.exit(1);
  }
} catch (e) {
  console.error('\nFATAL:', e);
  process.exit(2);
}

console.log('\nDone.\n');