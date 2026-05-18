const fs = require('fs');
const dests = JSON.parse(fs.readFileSync('./data/destinations.json'));
const query = 'mar';

dests.forEach(d => {
  const searchPool = `${d.name} ${d.tagline} ${d.scene} ${d.description} ${d.culture || ''} ${d.heritage || ''} ${d.localFood || ''} ${d.craft || ''} ${d.highlights.join(' ')}`
    .toLowerCase()
    .replace(/marocains?|marocaines?|maroc|moroccans?|morocco|marqueurs?|marquez|marchés?/g, '');
  if (searchPool.includes(query) || d.name.toLowerCase().includes(query)) {
    // find index of 'mar'
    const idx = searchPool.indexOf(query);
    console.log(`MATCH: ${d.name} -> "${searchPool.substring(idx - 10, idx + 15)}"`);
  }
});
