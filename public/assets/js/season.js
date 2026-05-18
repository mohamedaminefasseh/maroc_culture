(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const $ = (id) => document.getElementById(id);

  if (!slug) {
    $('loadingMsg').style.display = 'none';
    $('errorMsg').style.display = 'block';
    return;
  }

  fetch(`/api/destinations/${slug}`)
    .then((r) => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    })
    .then((d) => {
      $('loadingMsg').style.display = 'none';

      // Back link keeps context
      $('backLink').href = `/#destinations`;

      // Hero
      const img = $('heroImg');
      img.src = d.image;
      img.alt = d.name;
      img.onload = () => {
        $('heroSkeleton').style.display = 'none';
        img.style.display = '';
      };
      $('heroRegion').textContent = d.regionLabel;
      $('heroName').textContent = d.name;
      $('heroPeriod').textContent = '🗓️ ' + d.bestSeason;
      $('heroOverlay').style.display = '';

      const si = d.seasonInfo;
      if (!si) {
        $('errorMsg').textContent = 'Informations saisonnières non disponibles pour cette destination.';
        $('errorMsg').style.display = 'block';
        return;
      }

      // Why section
      $('seasonWhy').textContent = si.why;

      // Season cards
      const stars = (n) => {
        let html = '';
        for (let i = 1; i <= 5; i++) {
          html += `<svg class="star ${i <= n ? 'filled' : 'empty'}" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`;
        }
        return html;
      };

      $('seasonsGrid').innerHTML = si.seasons.map((s) => `
        <div class="season-card">
          <div class="season-card-header">
            <span class="season-emoji">${s.icon}</span>
            <div class="season-name-wrap">
              <div class="season-name">${s.name}</div>
              <div class="season-months">${s.months}</div>
            </div>
          </div>
          <div class="season-rating">${stars(s.rating)}</div>
          <p class="season-desc">${s.desc}</p>
        </div>
      `).join('');

      $('seasonTipText').textContent = si.tip;
      $('seasonContent').style.display = '';

      // Page title
      document.title = `${d.name} — Meilleure saison | Découvrez le Maroc`;
    })
    .catch(() => {
      $('loadingMsg').style.display = 'none';
      $('errorMsg').style.display = 'block';
    });
})();
