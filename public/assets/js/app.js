const state = {
  destinations: [],
  filtered: [],
  activeFilter: 'all',
  map: null,
  markers: new Map(),
  markerLayer: null,
  baseLayers: null,
  currentBaseLayer: null,
};

const els = {
  grid: document.querySelector('#destinationGrid'),
  storyList: document.querySelector('#storyList'),
  search: document.querySelector('#searchInput'),
  filters: document.querySelector('#filterButtons'),
  stats: document.querySelector('#statsPanel'),
  destinationSelect: document.querySelector('#destinationSelect'),
  form: document.querySelector('#contactForm'),
  formStatus: document.querySelector('#formStatus'),
  resetMap: document.querySelector('#resetMap'),
  worldMap: document.querySelector('#worldMap'),
  backToTop: document.querySelector('#backToTop'),
  header: document.querySelector('#siteHeader'),
  menuToggle: document.querySelector('#menuToggle'),
  nav: document.querySelector('#mainNav'),
  mapPlaces: document.querySelector('#mapPlaces'),
  cultureCityList: document.querySelector('#cultureCityList'),
  googleMapFrame: document.querySelector('#googleMapFrame'),
  googleExternalLink: document.querySelector('#googleExternalLink'),
};

const colorMap = {
  red: '#a6192e',
  blue: '#176b93',
  gold: '#c99a4b',
  cyan: '#2a8aa8',
};

async function fetchDestinations() {
  try {
    const res = await fetch('/api/destinations');
    if (!res.ok) throw new Error('API unavailable');
    state.destinations = await res.json();
  } catch (error) {
    const res = await fetch('/assets/data/destinations.json');
    state.destinations = await res.json();
  }
  state.filtered = [...state.destinations];
  renderAll();
}

function renderAll() {
  updateStats();
  renderDestinationSelect();
  renderCards();
  renderStories();
  renderCultureCities();
  renderMapPlaces();
  initMap();
  observeReveals();
}

function updateStats() {
  if (!els.stats) return;
  const regions = new Set(state.destinations.map((d) => d.region)).size;
  els.stats.innerHTML = `
    <article><strong>${state.destinations.length}</strong><span>Marked places</span></article>
    <article><strong>${regions}</strong><span>Travel styles</span></article>
    <article><strong>Local</strong><span>Generated images</span></article>
  `;
}

function renderDestinationSelect() {
  if (!els.destinationSelect) return;
  els.destinationSelect.innerHTML = state.destinations
    .map((d) => `<option value="${escapeHtml(d.name)}">${escapeHtml(d.name)} — ${escapeHtml(d.mapLabel)}</option>`)
    .join('');
}

function renderCards() {
  if (!els.grid) return;
  if (!state.filtered.length) {
    els.grid.innerHTML = `<p class="empty-state">No destination found. Try another keyword.</p>`;
    return;
  }

  els.grid.innerHTML = state.filtered.map((d) => `
    <article class="destination-card reveal" data-slug="${d.slug}" tabindex="0" aria-label="Open ${escapeHtml(d.name)} on map">
      <div class="card-image">
        <img src="${d.image}" alt="${escapeHtml(d.name)} — ${escapeHtml(d.mapLabel)}" loading="lazy" />
        <span>${escapeHtml(d.badge)}</span>
      </div>
      <div class="card-content">
        <p class="card-region">${escapeHtml(d.regionLabel)}</p>
        <h3>${escapeHtml(d.name)}</h3>
        <p>${escapeHtml(d.tagline)}</p>
        <div class="card-meta">
          <a class="card-season-link" href="/season.html?slug=${d.slug}" title="Voir la meilleure période pour visiter" onclick="event.stopPropagation()">Guide météo</a>
        </div>
        <div class="card-actions">
          <button class="link-btn" data-action="map" data-slug="${d.slug}" type="button">Voir repère</button>
          <button class="link-btn" data-action="google" data-slug="${d.slug}" type="button">Vue Google</button>
          <a class="link-btn" href="#stories">Lire l'histoire</a>
        </div>
      </div>
    </article>
  `).join('');

  els.grid.querySelectorAll('[data-action="map"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      focusDestination(btn.dataset.slug);
    });
  });

  els.grid.querySelectorAll('[data-action="google"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      showGooglePlace(btn.dataset.slug, true);
    });
  });

  els.grid.querySelectorAll('.destination-card').forEach((card) => {
    card.addEventListener('click', () => focusDestination(card.dataset.slug));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') focusDestination(card.dataset.slug);
    });
  });

  observeReveals();
}

function renderMapPlaces() {
  if (!els.mapPlaces) return;
  els.mapPlaces.innerHTML = state.destinations.map((d) => `
    <button class="map-place-chip" data-slug="${d.slug}" type="button">
      <span class="mini-dot ${d.markerColor}"></span>
      <span><strong>${escapeHtml(d.name)}</strong><small>${escapeHtml(d.mapLabel)}</small></span>
    </button>
  `).join('');

  els.mapPlaces.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      focusDestination(btn.dataset.slug);
      showGooglePlace(btn.dataset.slug, false);
    });
  });
}

function renderStories() {
  if (!els.storyList) return;
  els.storyList.innerHTML = state.destinations.map((d) => `
    <article class="story-card reveal" id="story-${d.slug}">
      <div class="story-image"><img src="${d.image}" alt="${escapeHtml(d.name)} landmark image" loading="lazy" /></div>
      <div class="story-content">
        <p class="eyebrow">${escapeHtml(d.regionLabel)}</p>
        <h3>${escapeHtml(d.name)}</h3>
        <p class="scene">${escapeHtml(d.scene)}</p>
        <p>${escapeHtml(d.description)}</p>
        <p><strong>Culture :</strong> ${escapeHtml(d.culture || '')}</p>
        <p><strong>Patrimoine :</strong> ${escapeHtml(d.heritage || '')}</p>
        <p><strong>Gastronomie :</strong> ${escapeHtml(d.localFood || '')}</p>
        <p><strong>Artisanat :</strong> ${escapeHtml(d.craft || '')}</p>
        <div class="story-highlights-block">
          <p class="story-highlights-title">Monuments &amp; Points d'intérêt</p>
          <ul class="highlight-list">${d.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
        </div>
      </div>
    </article>
  `).join('');

  els.storyList.querySelectorAll('[data-action="map"]').forEach((btn) => {
    btn.addEventListener('click', () => focusDestination(btn.dataset.slug));
  });
}

function renderCultureCities() {
  if (!els.cultureCityList) return;
  els.cultureCityList.innerHTML = state.destinations.map((d) => `
    <article class="culture-city-card reveal">
      <img src="${d.image}" alt="${escapeHtml(d.name)} culture" loading="lazy" />
      <div class="culture-city-body">
        <p class="eyebrow">${escapeHtml(d.regionLabel)}</p>
        <h3>${escapeHtml(d.name)}</h3>
        <p class="culture-city-scene">${escapeHtml(d.mapLabel)}</p>
        <p><strong>Culture :</strong> ${escapeHtml(d.culture || '')}</p>
        <p><strong>Gastronomie :</strong> ${escapeHtml(d.localFood || '')}</p>
        <p><strong>Artisanat :</strong> ${escapeHtml(d.craft || '')}</p>
        <p><strong>Conseil :</strong> ${escapeHtml(d.visitTip || '')}</p>
        <button class="link-btn" type="button" data-culture-map="${d.slug}">Sur la carte</button>
      </div>
    </article>
  `).join('');

  els.cultureCityList.querySelectorAll('[data-culture-map]').forEach((btn) => {
    btn.addEventListener('click', () => focusDestination(btn.dataset.cultureMap));
  });
}

function makeIcon(colorName) {
  const color = colorMap[colorName] || colorMap.red;
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-dot ${colorName}" style="background:${color}"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
}

function initMap() {
  const mapEl = document.querySelector('#moroccoMap');
  if (!mapEl) return;

  if (!window.L) {
    mapEl.innerHTML = "<p class=\"empty-state\">Leaflet n'a pas chargé. Vérifiez votre connexion internet, puis actualisez.</p>";
    return;
  }

  if (state.map) {
    refreshMarkers();
    safeMapResize(true);
    return;
  }

  state.map = L.map('moroccoMap', {
    scrollWheelZoom: true,
    zoomControl: false,
    attributionControl: true,
    worldCopyJump: true,
    preferCanvas: true,
  }).setView([31.5, -7.0], 6);

  L.control.zoom({ position: 'bottomright' }).addTo(state.map);

  const googleRoad = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps',
    maxZoom: 20,
  });

  const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps',
    maxZoom: 20,
  });

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  });

  const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  });

  state.baseLayers = { googleRoad, googleSatellite, osm, esri };
  state.currentBaseLayer = googleRoad;
  googleRoad.addTo(state.map);

  googleRoad.on('tileerror', () => {
    if (state.currentBaseLayer === googleRoad) {
      state.map.removeLayer(googleRoad);
      state.currentBaseLayer = osm;
      osm.addTo(state.map);
    }
  });

  osm.on('tileerror', () => {
    if (state.currentBaseLayer === osm) {
      state.map.removeLayer(osm);
      state.currentBaseLayer = esri;
      esri.addTo(state.map);
    }
  });

  state.markerLayer = L.layerGroup().addTo(state.map);
  refreshMarkers();
  fitAllMarkers(false);
  showGoogleMorocco();

  [100, 350, 800, 1500].forEach((delay) => setTimeout(() => safeMapResize(false), delay));
  window.addEventListener('load', () => safeMapResize(false));
  window.addEventListener('resize', () => safeMapResize(false));

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => safeMapResize(false));
    observer.observe(mapEl);
  }
}

function safeMapResize(refit = false) {
  if (!state.map) return;
  state.map.invalidateSize({ animate: false });
  if (refit) fitAllMarkers(false);
}

function refreshMarkers() {
  if (!state.markerLayer) return;
  state.markerLayer.clearLayers();
  state.markers.clear();

  state.destinations.forEach((d) => {
    const marker = L.marker([d.lat, d.lng], { icon: makeIcon(d.markerColor), title: `${d.name} — ${d.mapLabel}` });
    marker.bindPopup(`
      <div class="popup-card">
        <img src="${d.image}" alt="${escapeHtml(d.name)}" />
        <div>
          <h3>${escapeHtml(d.name)}</h3>
          <p><strong>${escapeHtml(d.mapLabel)}</strong><br>${escapeHtml(d.scene)}</p>
          <button class="link-btn popup-google" type="button" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.mapsQuery)}','_blank')">Open in Google Maps</button>
        </div>
      </div>
    `);
    marker.addTo(state.markerLayer);
    state.markers.set(d.slug, marker);
  });

  safeMapResize(false);
}

function fitAllMarkers(animate = true) {
  if (!state.map || !state.markers.size) return;
  const group = L.featureGroup([...state.markers.values()]);
  state.map.fitBounds(group.getBounds().pad(0.25), { maxZoom: 7, animate });
}

function showWorldMap(animate = true) {
  if (!state.map) return;
  state.map.setView([20, 0], 2, { animate });
  showGoogleWorld();
}

function focusDestination(slug) {
  const d = state.destinations.find((item) => item.slug === slug);
  const marker = state.markers.get(slug);
  if (!d || !state.map || !marker) return;

  document.querySelector('#map').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    safeMapResize(false);
    state.map.flyTo([d.lat, d.lng], d.zoom, { duration: 1.2 });
    showGooglePlace(slug, false);
    setTimeout(() => marker.openPopup(), 900);
  }, 420);
}

function showGoogleMorocco() {
  setGoogleMap('Morocco', 5);
}

function showGoogleWorld() {
  setGoogleMap('world map', 2);
}

function showGooglePlace(slug, scroll = false) {
  const d = state.destinations.find((item) => item.slug === slug);
  if (!d) return;
  setGoogleMap(`${d.lat},${d.lng}`, d.zoom || 14, d.mapsQuery);
  if (scroll) document.querySelector('.google-map-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setGoogleMap(query, zoom = 6, externalQuery = query) {
  if (els.googleMapFrame) {
    els.googleMapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
  }
  if (els.googleExternalLink) {
    els.googleExternalLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(externalQuery)}`;
  }
}

function applyFilters() {
  if (!els.search) return;
  const query = els.search.value.trim().toLowerCase();

  state.filtered = state.destinations.filter((d) => {
    const matchesRegion = state.activeFilter === 'all' || d.region === state.activeFilter;
    if (!matchesRegion) return false;
    if (!query) return true;

    // Always match by city name starting with the query
    if (d.name.toLowerCase().startsWith(query)) return true;

    // For longer queries (4+ chars), also search in key fields
    if (query.length >= 4) {
      const searchPool = `${d.tagline} ${d.scene} ${d.mapLabel} ${d.badge} ${d.highlights.join(' ')} ${d.description} ${d.culture || ''} ${d.heritage || ''} ${d.localFood || ''} ${d.craft || ''}`.toLowerCase();
      if (searchPool.includes(query)) return true;
    }

    return false;
  });
  renderCards();
}

if (els.filters) {
  els.filters.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeFilter = btn.dataset.filter;
    applyFilters();
  });
}

if (els.search) els.search.addEventListener('input', applyFilters);
if (els.resetMap) els.resetMap.addEventListener('click', () => fitAllMarkers(true));
if (els.worldMap) els.worldMap.addEventListener('click', () => showWorldMap(true));

if (els.form) {
  els.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(els.form).entries());
    els.formStatus.textContent = 'Envoi en cours...';
    els.formStatus.className = 'form-status';
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible d'envoyer le message");
      els.form.reset();
      els.formStatus.textContent = data.emailSent ? `Demande envoyée à ${data.emailTarget}.` : `${data.message} Voir la config SMTP dans le README.`;
      els.formStatus.classList.add('success');
    } catch (error) {
      els.formStatus.textContent = error.message || 'Serveur indisponible. Démarrez le serveur avec npm start.';
      els.formStatus.classList.add('error');
    }
  });
}

window.addEventListener('scroll', () => {
  if (els.header) els.header.classList.toggle('scrolled', window.scrollY > 30);
  if (els.backToTop) els.backToTop.classList.toggle('visible', window.scrollY > 700);
});
if (els.backToTop) els.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

if (els.menuToggle && els.nav) {
  els.menuToggle.addEventListener('click', () => {
    const open = els.nav.classList.toggle('open');
    els.menuToggle.setAttribute('aria-expanded', String(open));
  });
}
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => els.nav?.classList.remove('open')));

function observeReveals() {
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => observer.observe(el));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

fetchDestinations();
