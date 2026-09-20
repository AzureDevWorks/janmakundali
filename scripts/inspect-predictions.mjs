// scripts/inspect-predictions.mjs
//
//   node scripts/inspect-predictions.mjs            → all sections
//   node scripts/inspect-predictions.mjs keys       → compact shape tree
//   node scripts/inspect-predictions.mjs lalkitab
//   node scripts/inspect-predictions.mjs report
//   node scripts/inspect-predictions.mjs career
//   node scripts/inspect-predictions.mjs wealth
//   node scripts/inspect-predictions.mjs marriage
//   node scripts/inspect-predictions.mjs jaimini
//   node scripts/inspect-predictions.mjs chalit
//   node scripts/inspect-predictions.mjs kp
//   node scripts/inspect-predictions.mjs remedies

import {
  getKundli, Observer,
  getCareerPrediction, getWealthPrediction, getMarriagePrediction,
  getRemedies, getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis,
  getJaiminiKarakas, getComprehensiveReport,
} from '@prisri/jyotish';

// Kathmandu 1983-03-26 08:45 (+05:30)
const birth = new Date('1983-03-26T08:45:00+05:30');
const observer = new Observer(27.70169, 85.3206, 1300);
const kundli = getKundli(birth, observer, {
  includeChalit: true, includeKp: true,
  includeSpecialLagnas: true, includeArudhas: true,
  includeReferenceCharts: true,
});

const HR = '='.repeat(72);
const SR = '-'.repeat(72);

const section = (s) => { console.log('\n' + HR); console.log('▶ ' + s); console.log(HR); };

const safe = (label, fn) => {
  try {
    const v = fn();
    section(label);
    try { console.log(JSON.stringify(v, replacer, 2)); }
    catch { console.log(String(v)); }
    return v;
  } catch (e) {
    section(label + '  —  FAILED');
    console.log('Error:', e.message);
    console.log('Stack:', (e.stack ?? '').split('\n').slice(0, 5).join('\n'));
    return null;
  }
};

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

/* ------------------------------------------------------------------ */

const sections = {
  career:   () => safe('getCareerPrediction(kundli)',   () => getCareerPrediction(kundli)),
  wealth:   () => safe('getWealthPrediction(kundli)',   () => getWealthPrediction(kundli)),
  marriage: () => safe('getMarriagePrediction(kundli)', () => getMarriagePrediction(kundli)),
  jaimini:  () => safe('getJaiminiKarakas(kundli)',     () => getJaiminiKarakas(kundli)),
  chalit:   () => safe('getChalitAnalysis(kundli)',     () => getChalitAnalysis(kundli)),
  kp:       () => safe('getKpAnalysis(kundli)',         () => getKpAnalysis(kundli)),
  lalkitab: () => safe('getLalKitabAnalysis(kundli)',   () => getLalKitabAnalysis(kundli)),
  remedies: () => safe('getRemedies(kundli)',           () => getRemedies(kundli)),
  report:   () => {
    const r = safe('getComprehensiveReport(kundli)', () => getComprehensiveReport(kundli));
    if (r) {
      section('report top-level keys');
      console.log(Object.keys(r));
      if (r.formattedMarkdown) {
        section('report.formattedMarkdown — first 3000 chars');
        console.log(String(r.formattedMarkdown).slice(0, 3000));
        section('report.formattedMarkdown — full length');
        console.log(String(r.formattedMarkdown).length, 'characters');
      }
    }
  },
};

function keysMode() {
  section('COMPACT SHAPE — prediction functions');
  const probes = [
    ['getCareerPrediction',   () => getCareerPrediction(kundli)],
    ['getWealthPrediction',   () => getWealthPrediction(kundli)],
    ['getMarriagePrediction', () => getMarriagePrediction(kundli)],
    ['getJaiminiKarakas',     () => getJaiminiKarakas(kundli)],
    ['getChalitAnalysis',     () => getChalitAnalysis(kundli)],
    ['getKpAnalysis',         () => getKpAnalysis(kundli)],
    ['getLalKitabAnalysis',   () => getLalKitabAnalysis(kundli)],
    ['getRemedies',           () => getRemedies(kundli)],
    ['getComprehensiveReport',() => getComprehensiveReport(kundli)],
  ];
  for (const [name, fn] of probes) {
    console.log('\n' + SR);
    console.log('▶ ' + name);
    console.log(SR);
    try { console.log(shape(fn(), 0, 5)); }
    catch (e) { console.log('❌ ' + e.message); }
  }
}

/* ------------------------------------------------------------------ */

const arg = (process.argv[2] ?? 'all').toLowerCase();

console.log('Birth  :', birth.toISOString());
console.log('Observer:', `lat ${observer.latitude}, lon ${observer.longitude}`);

try {
  if (arg === 'keys') {
    keysMode();
  } else if (arg === 'all') {
    sections.career();
    sections.wealth();
    sections.marriage();
    sections.jaimini();
    sections.chalit();
    sections.kp();
    sections.lalkitab();
    sections.remedies();
    sections.report();
  } else if (sections[arg]) {
    sections[arg]();
  } else {
    console.error(`Unknown section "${arg}".`);
    console.error('Sections:', Object.keys(sections).join(', '), '| all | keys');
    process.exit(1);
  }
} catch (e) {
  console.error('\nFATAL:', e);
  process.exit(2);
}

console.log('\nDone.\n');