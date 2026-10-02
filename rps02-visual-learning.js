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
      <div id="rps02-photo-compare" class="rps02-photo-compare" aria-live="polite">
        Chargement des photographies de référence…
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
      <h3>5. Ce que vos réponses peuvent évoquer</h3>
      <div id="rps02-final" class="notice"></div>
      <div id="rps02-interpretation" class="notice" aria-live="polite"></div>
      <p class="learn-meta">Ce repère est pédagogique : il s'appuie sur vos observations déclarées, pas sur la reconnaissance automatique d'une photo. Il ne confirme pas à lui seul une ovulation et ne remplace pas l'interprétation d'une série d'observations du cycle.</p>
      <button class="btn btn-secondary" type="button" id="rps02-restart">Recommencer</button>
    </section>

    <div class="rps02-corpus">
      <h3>Corpus photographique de référence</h3>
      <p class="learn-meta">Les photographies réelles sont conservées localement comme références ; elles ne deviennent pas des catégories SymRella tant que leur validation pédagogique n'est pas documentée. Les codes de la méthode source restent des métadonnées et ne sont pas des catégories SymRella.</p>
      <p class="learn-meta">Crédit des photographies : Justisse College Cervical Mucus Gallery — CC BY-SA 4.0. Source : <a href="https://mucus.justisse.ca/finger-testable-observations" target="_blank" rel="noreferrer">galerie Justisse</a>. Licence : <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="license noreferrer">CC BY-SA 4.0</a>. Les photographies restent soumises à leur licence ; ce crédit ne signifie pas que Justisse soutient SymRella.</p>
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
    #rps02-visual-workshop .rps02-photo-compare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}
    #rps02-visual-workshop .rps02-photo-example{font:inherit;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:8px;text-align:left;cursor:pointer}
    #rps02-visual-workshop .rps02-photo-example[aria-pressed="true"]{outline:3px solid var(--blue);outline-offset:1px}
    #rps02-visual-workshop .rps02-photo-example img{display:block;width:100%;height:150px;object-fit:contain;border-radius:7px;background:var(--bg);border:1px solid var(--border)}
    #rps02-visual-workshop .rps02-photo-example strong{display:block;margin-top:7px}
    #rps02-visual-workshop .rps02-photo-example small{display:block;color:var(--text-muted);margin-top:3px}
    #rps02-visual-workshop .rps02-photo-preview{display:block;max-width:100%;max-height:280px;margin-top:10px;border:1px solid var(--border);border-radius:12px;object-fit:contain;background:var(--bg)}
    #rps02-visual-workshop .rps02-corpus{margin-top:22px;padding-top:18px;border-top:1px solid var(--border)}
    #rps02-visual-workshop .rps02-corpus-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    #rps02-visual-workshop .rps02-corpus-item{padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--bg)}
    #rps02-visual-workshop .rps02-corpus-image{display:block;width:100%;height:150px;object-fit:contain;border-radius:7px;background:var(--bg);border:1px solid var(--border);margin-bottom:8px}
    #rps02-visual-workshop .rps02-corpus-item strong{display:block}
    #rps02-visual-workshop .rps02-corpus-item small{display:block;color:var(--text-muted);margin-top:4px}
    @media(min-width:700px){
      #rps02-visual-workshop .rps02-options{grid-template-columns:repeat(3,minmax(0,1fr))}
      #rps02-visual-workshop .rps02-photo-compare{grid-template-columns:repeat(3,minmax(0,1fr))}
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

  const buildInterpretation = () => {
    const raw = {
      sensation: selected('sensation'),
      appearance: selected('appearance'),
      transparency: selected('transparency'),
      stretch: selected('stretch')
    };

    const unknownCount = Object.values(raw).filter(value =>
      value === 'unknown' || value === 'uncertain'
    ).length;

    if (unknownCount >= 3 || raw.appearance === 'mixed') {
      return {
        title: 'Observation encore difficile à interpréter',
        body: 'Vos réponses ne donnent pas assez de caractéristiques concordantes pour rapprocher cette observation d’un profil précis.',
        detail: 'Ce n’est pas une mauvaise réponse : dans ce cas, l’apprentissage consiste à continuer à observer la sensation et l’apparence séparément.'
      };
    }

    const lubricativeSensation = ['lubricative', 'wet'].includes(raw.sensation);
    const moistSensation = ['moist', 'lubricative', 'wet'].includes(raw.sensation);
    const visuallyFluid = ['watery', 'stretchy'].includes(raw.appearance);
    const clearAppearance = ['transparent', 'translucent'].includes(raw.transparency);
    const clearlyStretchy = raw.stretch === 'clear' || raw.appearance === 'stretchy';

    const fertileLikeSignals = [
      lubricativeSensation,
      visuallyFluid,
      clearAppearance,
      clearlyStretchy
    ].filter(Boolean).length;

    if (fertileLikeSignals >= 3) {
      return {
        title: 'Votre observation ressemble à un mucus de période fertile',
        body: 'Plusieurs caractéristiques que vous avez décrites — sensation humide/lubrifiée, aspect fluide ou filant, transparence et/ou étirement — correspondent à des caractéristiques classiquement associées à la période fertile.',
        detail: 'Ce profil peut apparaître autour de l’ovulation. Mais ces réponses seules ne permettent pas de dire que vous ovulez aujourd’hui ni de fixer le jour de l’ovulation. Pour une interprétation symptothermique, il faut replacer cette observation dans la suite du cycle et la croiser avec les autres signes pertinents.'
      };
    }

    if (
      (moistSensation && visuallyFluid) ||
      (clearAppearance && clearlyStretchy) ||
      (lubricativeSensation && clearAppearance)
    ) {
      return {
        title: 'Votre observation présente des caractéristiques pouvant évoluer vers un profil fertile',
        body: 'Certaines caractéristiques que vous avez décrites sont compatibles avec une évolution du mucus vers une observation plus fertile.',
        detail: 'Cela peut se produire avant ou autour de l’ovulation, mais une observation isolée ne permet pas de déterminer où vous vous trouvez exactement dans le cycle.'
      };
    }

    if (
      ['dry', 'smooth'].includes(raw.sensation) &&
      ['sticky', 'creamy'].includes(raw.appearance) &&
      ['opaque', 'translucent'].includes(raw.transparency) &&
      ['none', 'little', 'unknown', 'uncertain'].includes(raw.stretch)
    ) {
      return {
        title: 'Votre observation ressemble davantage à un profil moins fertile',
        body: 'Les caractéristiques décrites sont plutôt sèches/lisses ou épaisses et peu étirables, sans ensemble marqué de signes fluides, transparents ou nettement étirables.',
        detail: 'Cela ne suffit toutefois pas à déclarer un jour infertile : l’interprétation d’une phase du cycle dépend de la série d’observations et des règles de la méthode.'
      };
    }

    return {
      title: 'Votre observation présente un profil intermédiaire ou variable',
      body: 'Vos réponses montrent certaines caractéristiques, mais pas un ensemble suffisamment concordant pour rapprocher clairement cette observation d’un profil fertile ou moins fertile.',
      detail: 'Continuez à noter séparément la sensation, l’apparence, la transparence et l’étirement. L’évolution de plusieurs jours est plus informative qu’une observation isolée.'
    };
  };

  const updateFeedback = () => {
    const feedback = card.querySelector('#rps02-feedback');
    const choice = state.visualChoice;
    if (!choice) {
      feedback.textContent = 'Tu n’as pas besoin de choisir une photo. Tu peux comparer les exemples ou continuer avec « je ne sais pas ».';
      return;
    }
    feedback.textContent =
      `Tu as sélectionné la photo ${choice}. Observe uniquement ce qui est visible : couleur, texture, transparence, quantité apparente et éventuel étirement. La photo ne permet pas de déduire une sensation, une phase du cycle ou un événement d’ovulation.`;
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

  const selectReferencePhoto = button => {
    card.querySelectorAll('.rps02-photo-example').forEach(item => item.setAttribute('aria-pressed','false'));
    button.setAttribute('aria-pressed','true');
    state.visualChoice = button.dataset.example;
  };

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
    const interpretation = buildInterpretation();
    card.querySelector('#rps02-final').textContent =
      'Exercice terminé. Voici ce que tes réponses évoquent dans une perspective pédagogique :';
    card.querySelector('#rps02-interpretation').innerHTML =
      `<strong>${esc(interpretation.title)}</strong><p>${esc(interpretation.body)}</p><p>${esc(interpretation.detail)}</p>`;
  };

  card.querySelector('#rps02-restart').addEventListener('click', () => {
    state.visualChoice = null;
    state.photoSelected = false;
    card.querySelectorAll('.rps02-options button,.rps02-photo-example').forEach(button => button.setAttribute('aria-pressed','false'));
    photo.value = '';
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    preview.hidden = true;
    preview.removeAttribute('src');
    photoStatus.textContent = '';
    showStep(1);
  });

  const renderCorpus = (records, corpusUrl, assetVersion = '1') => {
    const list = card.querySelector('#rps02-corpus-list');
    const compare = card.querySelector('#rps02-photo-compare');
    if (!Array.isArray(records) || !records.length) {
      list.textContent = 'Aucun enregistrement de corpus disponible.';
      compare.textContent = 'Aucune photographie de référence disponible.';
      return;
    }

    compare.innerHTML = records.map(record => {
      const reference = esc(record.internalId || 'Référence');
      const localAssetName = String(record.localAssetPath || '').split('/').pop();
      const localUrl = new URL(`./data/rps02-blind-assets/${encodeURIComponent(localAssetName)}`, document.baseURI);
      localUrl.searchParams.set('v', String(assetVersion));
      const localImagePath = localUrl.href;
      const sourceImagePath = String(record.assetUrl || '');
      return `<button type="button" class="rps02-photo-example" data-example="${reference}" aria-pressed="false">
        <img src="${esc(localImagePath)}" data-fallback-src="${esc(sourceImagePath)}" alt="Photo de référence ${reference}" loading="eager" decoding="async">
        <strong>Photo ${reference}</strong>
        <small>Décris seulement ce que tu observes.</small>
      </button>`;
    }).join('');

    compare.querySelectorAll('.rps02-photo-example').forEach(button => {
      button.addEventListener('click', () => selectReferencePhoto(button));
      button.querySelector('img').addEventListener('error', event => {
        const image = event.currentTarget;
        const fallback = image.dataset.fallbackSrc;
        if (fallback && image.src !== fallback) {
          image.src = fallback;
          return;
        }
        image.alt = `Photo de référence ${button.dataset.example} indisponible`;
        button.classList.add('rps02-photo-unavailable');
      });
    });

    list.innerHTML = records.map(record => {
      const reference = esc(record.internalId || 'Référence');
      const status = esc(record.pedagogicalStatus || 'non validé');
      const localAssetName = String(record.localAssetPath || '').split('/').pop();
      const localUrl = new URL(`./data/rps02-blind-assets/${encodeURIComponent(localAssetName)}`, document.baseURI);
      localUrl.searchParams.set('v', String(assetVersion));
      const sourceImagePath = String(record.assetUrl || '');
      return `<article class="rps02-corpus-item">
        <img class="rps02-corpus-image" src="${esc(localUrl.href)}" data-fallback-src="${esc(sourceImagePath)}" alt="Photo de référence ${reference}" loading="lazy" decoding="async">
        <strong>Photo ${reference}</strong>
        <small>Statut pédagogique : ${status}</small>
      </article>`;
    }).join('');

    list.querySelectorAll('.rps02-corpus-image').forEach(image => {
      image.addEventListener('error', event => {
        const current = event.currentTarget;
        const fallback = current.dataset.fallbackSrc;
        if (fallback && current.src !== fallback) {
          current.src = fallback;
          return;
        }
        current.alt = 'Photo de référence indisponible';
        current.classList.add('rps02-photo-unavailable');
      });
    });
  };

  const corpusUrl = new URL('./data/rps02-visual-corpus.json', document.baseURI);
  fetch(corpusUrl, {cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error('corpus'); return response.json(); })
    .then(data => renderCorpus(data.records, corpusUrl, data.version || '1'))
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
