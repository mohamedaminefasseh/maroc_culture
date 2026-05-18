import re

with open('public/assets/js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Could not load destinations data. Please ensure the server is running.': "Impossible de charger les données des destinations. Assurez-vous que le serveur tourne.",
    '<option value="">Select destination...</option>': '<option value="">Sélectionner une destination...</option>',
    'View marker': 'Voir repère',
    'Google view': 'Vue Google',
    'Read story': 'Lire l\'histoire',
    '<strong>Culture:</strong>': '<strong>Culture :</strong>',
    '<strong>Heritage:</strong>': '<strong>Patrimoine :</strong>',
    '<strong>Local food:</strong>': '<strong>Gastronomie :</strong>',
    '<strong>Crafts:</strong>': '<strong>Artisanat :</strong>',
    '<strong>Correct map marker:</strong>': '<strong>Repère exact :</strong>',
    'Show this place on map': 'Afficher sur la carte',
    '<strong>Food:</strong>': '<strong>Gastronomie :</strong>',
    '<strong>Craft:</strong>': '<strong>Artisanat :</strong>',
    '<strong>Visit tip:</strong>': '<strong>Conseil :</strong>',
    '>Show on map</button>': '>Sur la carte</button>',
    'Leaflet did not load. Check your internet connection, then refresh the page.': 'Leaflet n\'a pas chargé. Vérifiez votre connexion internet, puis actualisez.',
    "'Sending...'": "'Envoi en cours...'",
    "'Could not send the message'": "'Impossible d\\'envoyer le message'",
    'Request sent to ${data.emailTarget}.': 'Demande envoyée à ${data.emailTarget}.',
    'See README SMTP setup.': 'Voir la config SMTP dans le README.',
    "'Backend unavailable. Start the server with npm start.'": "'Serveur indisponible. Démarrez le serveur avec npm start.'"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open('public/assets/js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations applied to public/assets/js/app.js")
