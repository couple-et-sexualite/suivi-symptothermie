/* RPS-02 — atelier visuel pédagogique
 * Local-first. No AI. No diagnosis. No fertility/ovulation inference from images.
 * Real corpus records are metadata until validated and mirrored as local assets.
 */
(() => {
  'use strict';

  const init = () => {
  const root = document.getElementById('apprendre');
  if (!root || document.getElementById('rps02-visual-workshop')) return;

  const esc = value => String(value).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));

  const state = {
    step: 1,
    visualChoice: null,
    photoSelected: false,
    progressKey: 'symrella_rps02_visual_progress_v2'
  };

  const card = document.createElement('section');
  card.id = 'rps02-visual-workshop';
  card.className = 'card no-print';
  card.setAttribute('aria-labelledby', 'rps02-title');
  card.innerHTML = `
    <h2 id="rps02-title">🔎 Atelier visuel — « Je ne sais pas ce que je vois »</h2>
    <p>Apprenez à <strong>observer et décrire</strong> progressivement. Les exemples servent à comparer ; ils ne décident pas à votre place.</p>
    <div class="notice">
      <strong>Principe :</strong> sensation et apparence sont observées séparément.
      « Je ne sais pas » est toujours une réponse valide.
    </div>

    <div class="rps02-progress-wrap" aria-live="polite">
      <strong id="rps02-step-label">Étape 1 sur 5</strong>
      <div class="rps02-progress" aria-hidden="true"><span id="rps02-progress-bar"></span></div>
    </div>

    <section class="rps02-panel" data-panel="1">
      <h3>1. Observer d'abord</h3>
      <p>Commencez par votre propre observation, sans chercher un nom ou un code.</p>

      <fieldset>
        <legend>Sensation</legend>
        <div class="rps02-options" data-group="sensation">
          <button type="button" data-value="unknown">Je ne sais pas</button>
          <button type="button" data-value="dry">Sèche</button>
          <button type="button" data-value="smooth">Lisse</button>
          <button type="button" data-value="lubricative">Lubrifiée</button>
          <button type="button" data-value="moist">Humide</button>
          <button type="button" data-value="wet">Mouillée</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Apparence / consistance</legend>
        <div class="rps02-options" data-group="appearance">
          <button type="button" data-value="unknown">Je ne sais pas</button>
          <button type="button" data-value="sticky">Collante</button>
          <button type="button" data-value="creamy">Crémeuse / épaisse</button>
          <button type="button" data-value="watery">Fluide</button>
          <button type="button" data-value="gel">Gélatineuse</button>
          <button type="button" data-value="stretchy">Filante / étirable</button>
          <button type="button" data-value="mixed">Difficile à décrire</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Transparence apparente</legend>
        <div class="rps02-options" data-group="transparency">
          <button type="button" data-value="unknown">Je ne sais pas</button>
          <button type="button" data-value="opaque">Opaque</button>
          <button type="button" data-value="translucent">Translucide</button>
          <button type="button" data-value="transparent">Claire / transparente</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Étirement observé</legend>
        <div class="rps02-options" data-group="stretch">
          <button type="button" data-value="unknown">Je ne sais pas / pas testé</button>
          <button type="button" data-value="none">Ne s'étire pas</button>
          <button type="button" data-value="little">S'étire peu</button>
          <button type="button" data-value="clear">S'étire nettement</button>
          <button type="button" data-value="uncertain">Impossible à déterminer</button>
        </div>
      </fieldset>

      <div class="actions">
        <button class="btn" type="button" data-next="2">Continuer vers la comparaison</button>
      </div>
    </section>

    <section class="rps02-panel" data-panel="2" hidden>
      <h3>2. Comparer sans chercher le « bon nom »</h3>
      <p>Regardez seulement les caractéristiques visuelles. Votre sensation ne peut pas être déduite d'une photo.</p>
      <div class="rps02-compare-grid">
        <button type="button" class="rps02-example" data-example="opaque" aria-pressed="false">
          <span class="rps02-swatch rps02-swatch-opaque" aria-hidden="true"></span>
          <strong>Plutôt opaque</strong>
          <span>Peu ou pas de transparence apparente.</span>
        </button>
        <button type="button" class="rps02-example" data-example="translucent" aria-pressed="false">
          <span class="rps02-swatch rps02-swatch-translucent" aria-hidden="true"></span>
          <strong>Plutôt translucide</strong>
          <span>La lumière semble passer partiellement.</span>
        </button>
        <button type="button" class="rps02-example" data-example="transparent" aria-pressed="false">
          <span class="rps02-swatch rps02-swatch-transparent" aria-hidden="true"></span>
          <strong>Plutôt transparent</strong>
          <span>Aspect clair avec transparence apparente.</span>
        </button>
        <button type="button" class="rps02-example" data-example="stretchy" aria-pressed="false">
          <span class="rps02-swatch rps02-swatch-stretchy" aria-hidden="true"></span>
          <strong>Plutôt étirable</strong>
          <span>Un fil peut sembler se former lorsqu'il est étiré.</span>
        </button>
      </div>
      <button class="btn btn-secondary" type="button" id="rps02-none">Aucune ne correspond</button>
      <div class="actions">
        <button class="btn" type="button" data-next="3">Voir ce que l'exemple permet d'observer</button>
      </div>
    </section>

    <section class="rps02-panel" data-panel="3" hidden>
      <h3>3. Comprendre la comparaison</h3>
      <div id="rps02-feedback" class="notice" role="status" aria-live="polite"></div>
      <p>Une image peut aider à comparer une apparence. Elle ne reproduit pas votre sensation et ne suffit pas à déterminer une phase du cycle, la fertilité, l'ovulation ou une cause médicale.</p>
      <div class="actions">
        <button class="btn" type="button" data-next="4">Continuer</button>
      </div>
    </section>

    <section class="rps02-panel" data-panel="4" hidden>
      <h3>4. Revenir à sa propre observation</h3>
      <p>Maintenant, décrivez ce que vous avez réellement observé. Vous pouvez laisser chaque caractéristique indéterminée.</p>
      <div id="rps02-summary" class="notice"></div>

      <div class="rps02-photo-block">
        <h4>Photo personnelle, facultative</h4>
        <p class="learn-meta">Si vous choisissez une photo, elle reste uniquement dans votre navigateur pendant l'exercice. Elle n'est ni téléversée, ni enregistrée dans le journal, ni analysée automatiquement.</p>
        <label for="rps02-photo">Choisir une photo locale</label>
        <input id="rps02-photo" type="file" accept="image/jpeg,image/png,image/webp">
        <p id="rps02-photo-status" class="learn-meta" role="status" aria-live="polite"></p>
        <img id="rps02-photo-preview" class="rps02-photo-preview" alt="Aperçu local de votre photo" hidden>
      </div>

      <div class="actions">
        <button class="btn" type="button" data-next="5">Enregistrer ma progression</button>
      </div>
    </section>

    <section class="rps02-panel" data-panel="5" hidden>
      <h3>5. Vous progressez par observation</h3>
      <div id="rps02-final" class="notice"></div>
      <p class="learn-meta">L'objectif est de mieux décrire vos propres observations, pas d'obtenir un score médical.</p>
      <button class="btn btn-secondary" type="button" id="rps02-restart">Recommencer</button>
    </section>

    <div class="rps02-corpus">
      <h3>Corpus photographique de référence</h3>
      <p class="learn-meta">Les photographies réelles sont conservées localement comme références ; elles ne deviennent pas des catégories SymRella tant que leur validation pédagogique n'est pas documentée. Les codes de la méthode source restent des métadonnées internes et ne sont pas des catégories SymRella.</p>
      <div id="rps02-corpus-list" class="rps02-corpus-list" aria-live="polite">Chargement du registre…</div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #rps02-visual-workshop .rps02-progress-wrap{margin:16px 0}
    #rps02-visual-workshop .rps02-progress{height:8px;border-radius:99px;background:var(--blue-light);overflow:hidden;margin-top:7px}
    #rps02-visual-workshop .rps02-progress span{display:block;height:100%;width:20%;background:linear-gradient(90deg,var(--blue),var(--pink));transition:width .2s}
    #rps02-visual-workshop fieldset{border:0;padding:0;margin:18px 0}
    #rps02-visual-workshop legend{font-weight:700;margin-bottom:8px}
    #rps02-visual-workshop .rps02-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    #rps02-visual-workshop .rps02-options button,
    #rps02-visual-workshop .rps02-example{font:inherit;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:left;cursor:pointer}
    #rps02-visual-workshop .rps02-options button[aria-pressed="true"],
    #rps02-visual-workshop .rps02-example[aria-pressed="true"]{outline:3px solid var(--blue);outline-offset:1px}
    #rps02-visual-workshop .rps02-compare-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}
    #rps02-visual-workshop .rps02-example{display:flex;flex-direction:column;gap:6px}
    #rps02-visual-workshop .rps02-example span:last-child{font-size:.85rem;color:var(--text-muted)}
    #rps02-visual-workshop .rps02-swatch{height:70px;border-radius:8px;border:1px solid var(--border)}
    #rps02-visual-workshop .rps02-swatch-opaque{background:#eee}
    #rps02-visual-workshop .rps02-swatch-translucent{background:linear-gradient(135deg,#eef8f8,#cfe2e2)}
    #rps02-visual-workshop .rps02-swatch-transparent{background:linear-gradient(135deg,#fff,#d8eef4)}
    #rps02-visual-workshop .rps02-swatch-stretchy{background:linear-gradient(90deg,#f8ffff,#cbe8ee,#fff)}
    #rps02-visual-workshop .rps02-photo-preview{display:block;max-width:100%;max-height:280px;margin-top:10px;border:1px solid var(--border);border-radius:12px;object-fit:contain;background:var(--bg)}
    #rps02-visual-workshop .rps02-corpus{margin-top:22px;padding-top:18px;border-top:1px solid var(--border)}
    #rps02-visual-workshop .rps02-corpus-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    #rps02-visual-workshop .rps02-corpus-item{padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--bg)}
    #rps02-visual-workshop .rps02-corpus-item strong{display:block}
    #rps02-visual-workshop .rps02-corpus-item small{display:block;color:var(--text-muted);margin-top:4px}
    @media(min-width:700px){
      #rps02-visual-workshop .rps02-options{grid-template-columns:repeat(3,minmax(0,1fr))}
      #rps02-visual-workshop .rps02-compare-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      #rps02-visual-workshop .rps02-corpus-list{grid-template-columns:repeat(3,minmax(0,1fr))}
    }
  `;
  document.head.appendChild(style);
  root.insertAdjacentElement('afterend', card);

  const panels = [...card.querySelectorAll('[data-panel]')];
  const stepLabel = card.querySelector('#rps02-step-label');
  const progressBar = card.querySelector('#rps02-progress-bar');
  const labels = ['Votre observation','Comparaison','Explication','Observation personnelle','Progression'];

  const showStep = step => {
    state.step = step;
    panels.forEach(panel => { panel.hidden = Number(panel.dataset.panel) !== step; });
    stepLabel.textContent = `Étape ${step} sur 5 — ${labels[step - 1]}`;
    progressBar.style.width = `${step * 20}%`;
    if (step === 3) updateFeedback();
    if (step === 4) updateSummary();
    if (step === 5) completeProgress();
  };

  const selectOption = button => {
    const group = button.closest('[data-group]');
    group.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed','false'));
    button.setAttribute('aria-pressed','true');
  };

  card.querySelectorAll('.rps02-options button').forEach(button => {
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click', () => selectOption(button));
  });

  const selected = group => card.querySelector(`[data-group="${group}"] button[aria-pressed="true"]`)?.dataset.value || 'unknown';
  const selectedLabel = (group, map) => map[selected(group)] || 'Je ne sais pas';

  const sensationLabels = {
    dry:'sèche', smooth:'lisse', lubricative:'lubrifiée', moist:'humide', wet:'mouillée'
  };
  const appearanceLabels = {
    sticky:'collante', creamy:'crémeuse / épaisse', watery:'fluide',
    gel:'gélatineuse', stretchy:'filante / étirable', mixed:'difficile à décrire'
  };
  const transparencyLabels = {
    opaque:'opaque', translucent:'translucide', transparent:'claire / transparente'
  };
  const stretchLabels = {
    none:'ne s’étire pas', little:'s’étire peu', clear:'s’étire nettement', uncertain:'indéterminé'
  };

  const getSelections = () => ({
    sensation: selectedLabel('sensation', sensationLabels),
    appearance: selectedLabel('appearance', appearanceLabels),
    transparency: selectedLabel('transparency', transparencyLabels),
    stretch: selectedLabel('stretch', stretchLabels)
  });

  const updateFeedback = () => {
    const feedback = card.querySelector('#rps02-feedback');
    const choice = state.visualChoice;
    const messages = {
      opaque:'Tu as choisi un exemple plutôt opaque. Observe surtout la transparence apparente ; ne déduis pas la sensation de cette image.',
      translucent:'Tu as choisi un exemple plutôt translucide. Compare maintenant la quantité de lumière qui semble traverser l’observation.',
      transparent:'Tu as choisi un exemple plutôt transparent. La transparence est une caractéristique visuelle parmi d’autres.',
      stretchy:'Tu as choisi un exemple plutôt étirable. L’étirement visible est une caractéristique d’apparence ; il ne suffit pas à conclure sur l’ovulation ou la fertilité.',
      none:'Aucun exemple ne te paraît suffisamment proche. C’est une réponse valable : il vaut mieux conserver l’incertitude que forcer une catégorie.',
      null:'Tu n’as pas besoin de choisir un exemple. Tu peux comparer à nouveau ou continuer avec « je ne sais pas ».'
    };
    feedback.textContent = messages[choice || 'null'];
  };

  const updateSummary = () => {
    const values = getSelections();
    card.querySelector('#rps02-summary').innerHTML =
      '<strong>Ce que tu as décrit :</strong><ul>' +
      `<li>Sensation : ${esc(values.sensation)}</li>` +
      `<li>Apparence / consistance : ${esc(values.appearance)}</li>` +
      `<li>Transparence : ${esc(values.transparency)}</li>` +
      `<li>Étirement : ${esc(values.stretch)}</li>` +
      '</ul>' +
      '<span class="learn-meta">Ces choix reprennent uniquement ta description. Ils ne produisent pas de conclusion médicale.</span>';
  };

  card.querySelectorAll('[data-next]').forEach(button => {
    button.addEventListener('click', () => showStep(Number(button.dataset.next)));
  });

  card.querySelectorAll('.rps02-example').forEach(button => {
    button.addEventListener('click', () => {
      card.querySelectorAll('.rps02-example').forEach(item => item.setAttribute('aria-pressed','false'));
      button.setAttribute('aria-pressed','true');
      state.visualChoice = button.dataset.example;
    });
  });

  card.querySelector('#rps02-none').addEventListener('click', () => {
    card.querySelectorAll('.rps02-example').forEach(item => item.setAttribute('aria-pressed','false'));
    state.visualChoice = 'none';
  });

  let objectUrl = null;
  const photo = card.querySelector('#rps02-photo');
  const preview = card.querySelector('#rps02-photo-preview');
  const photoStatus = card.querySelector('#rps02-photo-status');
  photo.addEventListener('change', () => {
    const file = photo.files?.[0];
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    preview.hidden = true;
    preview.removeAttribute('src');
    state.photoSelected = false;
    photoStatus.textContent = '';
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 8 * 1024 * 1024) {
      photoStatus.textContent = 'Format non pris en charge ou fichier supérieur à 8 Mo.';
      photo.value = '';
      return;
    }
    objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
    preview.hidden = false;
    state.photoSelected = true;
    photoStatus.textContent = 'Photo affichée localement uniquement. Elle n’est pas téléversée, analysée ni sauvegardée.';
  });

  const completeProgress = () => {
    try { localStorage.setItem(state.progressKey, '1'); } catch (error) { /* local-first best effort */ }
    card.querySelector('#rps02-final').textContent =
      'Exercice terminé. Tu as pratiqué la description, la comparaison et la conservation de l’incertitude. Aucune conclusion de fertilité ou de santé n’a été produite.';
  };

  card.querySelector('#rps02-restart').addEventListener('click', () => {
    state.visualChoice = null;
    state.photoSelected = false;
    card.querySelectorAll('.rps02-options button,.rps02-example').forEach(button => button.setAttribute('aria-pressed','false'));
    photo.value = '';
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    preview.hidden = true;
    preview.removeAttribute('src');
    photoStatus.textContent = '';
    showStep(1);
  });

  const renderCorpus = records => {
    const list = card.querySelector('#rps02-corpus-list');
    if (!Array.isArray(records) || !records.length) {
      list.textContent = 'Aucun enregistrement de corpus disponible.';
      return;
    }
    list.innerHTML = records.map(record => {
      const reference = esc(record.internalId || 'Référence');
      const status = esc(record.pedagogicalStatus || 'non validé');
      return `<article class="rps02-corpus-item">
        <strong>Photo ${reference}</strong>
        <small>Statut pédagogique : ${status}</small>
      </article>`;
    }).join('');
  };

  fetch('./data/rps02-visual-corpus.json', {cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error('corpus'); return response.json(); })
    .then(data => renderCorpus(data.records))
    .catch(() => {
      card.querySelector('#rps02-corpus-list').textContent =
        'Le registre du corpus n’est pas disponible hors connexion. L’atelier reste utilisable sans les photos.';
    });

  window.addEventListener('beforeunload', () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  });

  showStep(1);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
