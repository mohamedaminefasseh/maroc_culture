const fs = require('fs');
const dests = JSON.parse(fs.readFileSync('./data/destinations.json'));

const query = 'mar';
const clean = (str) => str.toLowerCase().replace(/marocains?|marocaines?|maroc|moroccans?|morocco/g, '');

dests.forEach(d => {
  const highPriority = clean(`${d.tagline} ${d.regionLabel} ${d.scene} ${d.mapLabel} ${d.badge} ${d.highlights.join(' ')}`);
  if (highPriority.includes(query)) {
    const idx = highPriority.indexOf(query);
    console.log(`MATCH HIGH: ${d.name} -> "${highPriority.substring(Math.max(0, idx - 10), idx + 15)}"`);
  }
});
