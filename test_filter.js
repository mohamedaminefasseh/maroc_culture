const fs = require('fs');
const dests = JSON.parse(fs.readFileSync('./data/destinations.json'));

const query = 'mar';
const clean = (str) => str.toLowerCase().replace(/marocains?|marocaines?|maroc|moroccans?|morocco/g, '');

const filtered = dests.filter((d) => {
  if (!query) return true;

  if (d.name.toLowerCase().includes(query)) return true;

  const highPriority = clean(`${d.tagline} ${d.regionLabel} ${d.scene} ${d.mapLabel} ${d.badge} ${d.highlights.join(' ')}`);
  if (highPriority.includes(query)) return true;

  if (query.length >= 4) {
    const deepText = clean(`${d.description} ${d.culture || ''} ${d.heritage || ''} ${d.localFood || ''} ${d.craft || ''} ${d.visitTip || ''}`);
    if (deepText.includes(query)) return true;
  }

  return false;
});

console.log(filtered.map(d => d.name));
