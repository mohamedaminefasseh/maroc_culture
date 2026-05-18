const fs = require('fs');
const dests = JSON.parse(fs.readFileSync('./data/destinations.json'));

const query = 'mar';
const clean = (str) => str.toLowerCase().replace(/marocains?|marocaines?|maroc|moroccans?|morocco/g, '');

const casa = dests.find(d => d.name === 'Casablanca');
console.log("=== Casablanca highPriority ===");
const high = clean(`${casa.tagline} ${casa.regionLabel} ${casa.scene} ${casa.mapLabel} ${casa.badge} ${casa.highlights.join(' ')}`);
console.log(high);
const idx = high.indexOf(query);
if (idx !== -1) console.log("FOUND at:", high.substring(Math.max(0, idx-10), idx+20));
