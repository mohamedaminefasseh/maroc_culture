const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/destinations.json', 'utf8'));

const seasonData = {
  marrakech: {
    ideal: "Mars à Mai — Septembre à Novembre",
    why: "Le printemps et l'automne offrent des températures agréables (18–28 °C) idéales pour explorer la médina, les souks et Jemaa el-Fna sans souffrir de la chaleur.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Temps doux et ensoleillé. La végétation des jardins est au maximum. Idéal pour les visites de plein air et les balades dans les ruelles." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 2, desc: "Chaleur extrême, souvent 38–42 °C. À éviter si possible. Privilégiez les sorties tôt le matin ou en soirée uniquement." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Saison idéale. Températures parfaites, ambiance festive et couchers de soleil spectaculaires sur Jemaa el-Fna." },
      { name: "Hiver", months: "Décembre – Février", icon: "❄️", rating: 3, desc: "Doux et agréable en journée (12–18 °C). Les nuits peuvent être fraîches. Moins de touristes, bon rapport qualité-prix." }
    ],
    tip: "Réservez les riads à l'avance en avril-mai et en octobre, qui sont les périodes les plus demandées."
  },
  casablanca: {
    ideal: "Toute l'année",
    why: "Le climat atlantique de Casablanca est l'un des plus stables du Maroc, avec des températures agréables toute l'année grâce à la brise de l'océan.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Températures douces (18–24 °C), ciels bleus, promenades sur la Corniche très agréables. Excellent moment." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 4, desc: "Chaud mais tempéré par l'Atlantique (24–28 °C). Plages animées, ambiance estivale le long de la Corniche." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Agréable, mer encore chaude. Moins de monde qu'en été. Idéal pour découvrir la ville calmement." },
      { name: "Hiver", months: "Décembre – Février", icon: "🌧️", rating: 3, desc: "Légères pluies possibles mais températures douces (12–18 °C). La Mosquée Hassan II est magnifique par temps nuageux." }
    ],
    tip: "La Mosquée Hassan II peut être visitée à l'intérieur uniquement lors des visites guidées. Vérifiez les horaires à l'avance."
  },
  fes: {
    ideal: "Mars à Mai — Septembre à Novembre",
    why: "Les températures modérées du printemps et de l'automne permettent d'explorer la médina dense et les tanneries sans épuisement.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Parfait pour arpenter les ruelles de Fès el-Bali. Les couleurs de la tannerie Chouara sont plus vives avec la lumière printanière." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 2, desc: "Très chaud et humide dans la médina. Les odeurs des tanneries s'intensifient. Non recommandé pour les visites longues." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Meilleure période. Températures idéales, lumière chaude sur les toits de la médina, artisans au travail." },
      { name: "Hiver", months: "Décembre – Février", icon: "❄️", rating: 3, desc: "Frais voire froid avec possibilité de neige en altitude proche. La médina est moins fréquentée, atmosphère authentique garantie." }
    ],
    tip: "Engagez un guide officiel pour la médina de Fès — c'est indispensable pour ne pas se perdre et accéder aux meilleures terrasses des tanneries."
  },
  chefchaouen: {
    ideal: "Avril à Juin",
    why: "Le printemps est la saison reine de Chefchaouen. Les fleurs ornent les ruelles bleues, la lumière est douce et les températures de montagne sont parfaites.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Saison absolument parfaite. Fleurs dans les ruelles, lumière idéale pour la photographie, températures agréables (15–22 °C)." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 4, desc: "Chaud mais supportable grâce à l'altitude du Rif. Nombreux touristes. Les couleurs bleues sont magnifiques sous le soleil." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 4, desc: "Beau temps, moins de monde. Lumière dorée sur les murs bleus. Idéal pour les photos du matin tôt." },
      { name: "Hiver", months: "Décembre – Février", icon: "❄️", rating: 2, desc: "Froid de montagne prononcé, possibilité de neige. Beaucoup de commerces fermés. Ambiance très locale mais austère." }
    ],
    tip: "Visitez les ruelles bleues très tôt le matin (avant 8h) pour avoir les lieux pour vous seul et une lumière photographique parfaite."
  },
  merzouga: {
    ideal: "Octobre à Avril",
    why: "Le désert de l'Erg Chebbi est impraticable en été à cause de la chaleur extrême. L'hiver et le printemps offrent des conditions idéales pour les nuits sous les étoiles.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 4, desc: "Températures agréables (20–30 °C). Les dunes sont dorées, les nuits fraîches idéales pour camper. Quelques vents de sable possibles." },
      { name: "Été", months: "Juin – Août", icon: "🔥", rating: 1, desc: "Température pouvant dépasser 50 °C dans les dunes. Absolument déconseillé. Dangereux pour la santé." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Excellente période. Chaleur réduite, lumière magnifique, ciel dégagé pour observer les étoiles la nuit." },
      { name: "Hiver", months: "Décembre – Février", icon: "❄️", rating: 5, desc: "Meilleure saison. Journées ensoleillées (15–20 °C), nuits froides sous un ciel étoilé exceptionnel. Le contraste chaud-froid est une expérience unique." }
    ],
    tip: "Prévoyez des vêtements chauds même en hiver — les nuits dans le désert peuvent descendre près de 0 °C."
  },
  essaouira: {
    ideal: "Printemps & début été",
    why: "La brise atlantique constante rend Essaouira agréable même en été. C'est l'une des destinations marocaines les plus confortables toute l'année.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Temps doux, mer vivifiante, port animé, médina agréable. La lumière atlantique est magnifique pour les photos du port." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 4, desc: "Vent constant (surnommée « ville des vents »). Idéal pour les amateurs de kitesurf et windsurf. Températures douces (22–26 °C)." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 4, desc: "Mer encore douce, moins de vent, ambiance calme. Bonne période pour les balades le long des remparts." },
      { name: "Hiver", months: "Décembre – Février", icon: "🌧️", rating: 3, desc: "Quelques jours pluvieux, mais souvent ensoleillé. Moins de touristes, ville plus authentique. Fruits de mer excellents." }
    ],
    tip: "Le Festival Gnaoua, l'un des plus grands festivals de musique du Maroc, se tient généralement à Essaouira en juin."
  },
  rabat: {
    ideal: "Toute l'année",
    why: "Rabat bénéficie d'un climat atlantique équilibré. Aucune saison n'est réellement mauvaise pour visiter la capitale.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Idéal. Température douce, jardins fleuris, la Tour Hassan et le Mausolée sont magnifiques sous le soleil printanier." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 4, desc: "Agréable grâce à l'Atlantique (25–28 °C). Quelques jours chauds mais sans excès. Bonne période culturelle." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Très agréable. Moins de monde que l'été, lumière chaude parfaite pour visiter la Kasbah des Oudayas." },
      { name: "Hiver", months: "Décembre – Février", icon: "🌧️", rating: 3, desc: "Pluies modérées, températures douces (10–16 °C). Bonne période hors saison avec des tarifs réduits." }
    ],
    tip: "Combinez Rabat avec Salé (rive opposée du Bouregreg) pour une demi-journée supplémentaire de découverte culturelle."
  },
  tangier: {
    ideal: "Printemps & automne",
    why: "Tanger est agréable toute l'année mais le printemps et l'automne offrent la meilleure combinaison de soleil, températures douces et atmosphère locale.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Doux et ensoleillé (16–22 °C). Les vues sur le détroit de Gibraltar sont dégagées. Idéal pour découvrir la Kasbah et la médina." },
      { name: "Été", months: "Juin – Août", icon: "☀️", rating: 3, desc: "Chaud et très fréquenté, surtout par les Marocains de la diaspora. Trafic dense mais ambiance festive." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Très agréable. Mer encore chaude, lumière magnifique sur la baie, moins de foule." },
      { name: "Hiver", months: "Décembre – Février", icon: "🌧️", rating: 3, desc: "Pluies fréquentes (influence méditerranéenne). Certains jours ensoleillés magnifiques. La ville est très locale en hiver." }
    ],
    tip: "Depuis Tanger, une excursion à Cap Spartel (30 min) pour voir le point de rencontre Atlantique-Méditerranée vaut absolument le détour."
  },
  "ait-ben-haddou": {
    ideal: "Octobre à Avril",
    why: "La région de Ouarzazate et Aït Ben Haddou est très chaude en été. Les mois d'automne à printemps offrent un confort optimal pour explorer le ksar.",
    seasons: [
      { name: "Printemps", months: "Mars – Mai", icon: "🌸", rating: 5, desc: "Lumière dorée idéale sur l'argile rouge du ksar. Températures agréables (18–28 °C). Les palmiers sont verdoyants." },
      { name: "Été", months: "Juin – Août", icon: "🔥", rating: 1, desc: "Chaleur écrasante (40–45 °C). Visite très difficile. Si inévitable, allez-y tôt le matin uniquement." },
      { name: "Automne", months: "Septembre – Novembre", icon: "🍂", rating: 5, desc: "Excellente période. La lumière de l'après-midi sur les murs de terre est spectaculaire. Températures parfaites." },
      { name: "Hiver", months: "Décembre – Février", icon: "❄️", rating: 4, desc: "Journées douces et ensoleillées. Nuits froides. Le ksar désert et silencieux a une atmosphère fascinante." }
    ],
    tip: "La meilleure heure pour photographier le ksar est en fin d'après-midi quand la lumière chaude dore les murs d'argile."
  }
};

data.forEach(d => {
  if (seasonData[d.slug]) {
    d.seasonInfo = seasonData[d.slug];
  }
});

fs.writeFileSync('./data/destinations.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Season data added!');
