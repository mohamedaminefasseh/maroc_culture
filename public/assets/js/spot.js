(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const $ = (id) => document.getElementById(id);

  if (!slug) {
    $('spotLoader').style.display = 'none';
    $('spotError').style.display = 'block';
    return;
  }

  fetch(`/api/destinations/${slug}`)
    .then((r) => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    })
    .then((d) => {
      $('spotLoader').style.display = 'none';

      // Populate content
      $('spotImg').src = d.image;
      $('spotImg').alt = d.badge;
      $('spotCity').textContent = d.name;
      $('spotName').textContent = d.badge;
      $('spotBadge').textContent = 'Meilleur Spot';
      
      $('spotIntro').textContent = d.scene;
      $('spotHeritage').textContent = d.heritage || d.description;
      $('spotCulture').textContent = `${d.culture || ''} ${d.craft || ''}`.trim() || "Découvrez l'âme vibrante de ce lieu à travers son histoire unique.";
      
      $('spotHighlights').innerHTML = d.highlights.map(h => `<span>${h}</span>`).join('');

      $('spotContent').style.display = 'block';
      document.title = `${d.badge} — Meilleur Spot | Découvrez le Maroc`;
    })
    .catch(() => {
      $('spotLoader').style.display = 'none';
      $('spotError').style.display = 'block';
    });
})();
