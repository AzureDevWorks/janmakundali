import { getPanchangamDetails, Observer } from '@prisri/jyotish';

const o = new Observer(35.2271, -80.8431, 0);
const now = new Date();
const p = getPanchangamDetails(now, o);

const fmt = (d) => d ? d.toISOString() + '  (' + d.toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' EDT)' : '--';

console.log('=== NOW ===');
console.log('Server time:', now.toISOString());

console.log('\n=== SUN ===');
console.log('Sunrise:', fmt(p.sunrise));
console.log('Sunset: ', fmt(p.sunset));

console.log('\n=== TITHI (library) ===');
console.log('Index:      ', p.tithi);
console.log('Name:       ', p.tithiName);
console.log('Start time: ', fmt(p.tithiStartTime));
console.log('End time:   ', fmt(p.tithiEndTime));

console.log('\n=== NAKSHATRA (library) ===');
console.log('Index:      ', p.nakshatra);
console.log('Name:       ', p.nakshatraName);
console.log('Pada:       ', p.nakshatraPada);
console.log('Start time: ', fmt(p.nakshatraStartTime));
console.log('End time:   ', fmt(p.nakshatraEndTime));

console.log('\n=== YOGA ===');
console.log('Index:      ', p.yoga);
console.log('Name:       ', p.yogaName);
console.log('End time:   ', fmt(p.yogaEndTime));

console.log('\n=== KARANA ===');
console.log('Name:       ', p.karana);

console.log('\n=== VARA ===');
console.log('Index:      ', p.vara);
console.log('Name:       ', p.varaName);

console.log('\n=== MOON ===');
console.log('Moon Rashi: ', p.moonRashi);
console.log('Moon Nakshatra (mid-day):', p.nakshatraName);

console.log('\n=== VERIFICATION ===');
console.log('Expected: Purva Ashadha ends ~2026-09-21 05:04 UTC (1:04 AM EDT Monday)');
console.log('Library:  ' + p.nakshatraName + ' ends at ' + fmt(p.nakshatraEndTime));
if (p.nakshatraEndTime) {
  const diffMs = p.nakshatraEndTime.getTime() - now.getTime();
  const diffH = (diffMs / 3600000).toFixed(1);
  console.log('Library thinks current nakshatra ends in: ' + diffH + ' hours');
}