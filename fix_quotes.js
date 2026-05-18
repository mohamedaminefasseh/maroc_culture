const fs = require('fs');
let code = fs.readFileSync('public/assets/js/app.js', 'utf8');

// Fix Leaflet string
code = code.replace(/mapEl\.innerHTML = '<p class="empty-state">Leaflet.*?<\/p>';/, 'mapEl.innerHTML = "<p class=\\"empty-state\\">Leaflet n\'a pas chargé. Vérifiez votre connexion internet, puis actualisez.</p>";');

// Fix "Lire l'histoire"
code = code.replace(/>Lire l\\'histoire<\/a>/g, ">Lire l'histoire</a>");
code = code.replace(/>Lire l'histoire<\/a>/g, ">Lire l'histoire</a>"); // in case it was not escaped

// Fix "Impossible d'envoyer"
code = code.replace(/'Impossible d\\'envoyer le message'/g, '"Impossible d\'envoyer le message"');
code = code.replace(/'Impossible d'envoyer le message'/g, '"Impossible d\'envoyer le message"');

fs.writeFileSync('public/assets/js/app.js', code, 'utf8');
