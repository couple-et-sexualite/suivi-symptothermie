/* RPS-02 — atelier visuel pédagogique
 * Local-first, no network, no AI, no diagnostic or fertility inference.
 * Photos are previewed from the user's device only and are never persisted.
 */
(() => {
  'use strict';
  const root = document.getElementById('apprendre');
  if (!root || document.getElementById('rps02-visual-workshop')) return;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const card = document.createElement('section');
  card.id = 'rps02-visual-workshop';
  card.className = 'card no-print';
  card.setAttribute('aria-labelledby','rps02-title');
  card.innerHTML = `
    <h2 id="rps02-title">🔎 Atelier visuel — « Je ne sais pas ce que je vois »</h2>
    <p>Apprenez progressivement à <strong>décrire</strong> une observation. L'image sert de support pédagogique : elle ne permet pas, à elle seule, de déterminer une phase du cycle, la fertilité ou une cause médicale.</p>
    <div class="notice"><strong>Principe :</strong> observez d'abord, comparez ensuite, puis vérifiez vos propres mots. Une observation peut rester « difficile à caractériser ».</div>

    <div class="rps02-step">
      <h3>1. Votre photo, si vous le souhaitez</h3>
      <p class="learn-meta">Elle reste dans ce navigateur pendant cette activité. Elle n'est pas téléversée, enregistrée dans le journal ni envoyée à SymRella.</p>
      <input id="rps02-photo" type="file" accept="image/jpeg,image/png,image/webp">
      <div id="rps02-photo-status" class="learn-meta" role="status" aria-live="polite"></div>
      <img id="rps02-photo-preview" class="rps02-photo-preview" alt="Aperçu local de votre photo" hidden>
    </div>

    <div class="rps02-step">
      <h3>2. Comparez sans chercher le « bon nom »</h3>
      <p class="learn-meta">Choisissez le repère visuel qui vous paraît le plus proche, ou « aucune ». Ce sont des illustrations abstraites, pas des photographies médicales.</p>
      <div class="rps02-visual-grid" id="rps02-visual-grid"></div>
      <button class="btn btn-secondary" type="button" id="rps02-none">Aucune ne correspond</button>
    </div>

    <div class="rps02-step">
      <h3>3. Décrivez ce que vous ressentez et voyez</h3>
      <div class="rps02-grid">
        <label>Sensation
          <select id="rps02-sensation">
            <option value="unknown">Je ne sais pas</option>
            <option value="dry">Sèche</option>
            <option value="moist">Humide</option>
            <option value="wet">Mouillée</option>
            <option value="slippery">Glissante</option>
          </select>
        </label>
        <label>Aspect / consistance
          <select id="rps02-texture">
            <option value="unknown">Je ne sais pas</option>
            <option value="sticky">Collante</option>
            <option value="creamy">Épaisse / crémeuse</option>
            <option value="watery">Très fluide</option>
            <option value="gel">Gélatineuse</option>
            <option value="mixed">Mélangée / difficile à décrire</option>
          </select>
        </label>
        <label>Transparence apparente
          <select id="rps02-transparency">
            <option value="unknown">Je ne sais pas</option>
            <option value="opaque">Opaque / blanche</option>
            <option value="translucent">Translucide</option>
            <option value="transparent">Claire / transparente</option>
          </select>
        </label>
        <label>Étirement observé
          <select id="rps02-stretch">
            <option value="unknown">Je ne sais pas / pas testé</option>
            <option value="none">Ne s'étire pas</option>
            <option value="little">S'étire peu</option>
            <option value="clear">S'étire nettement</option>
            <option value="uncertain">Impossible à déterminer</option>
          </select>
        </label>
      </div>
      <p class="learn-meta">La sensation est votre propre observation : elle ne peut pas être déduite d'une photo.</p>
    </div>

    <div class="rps02-step">
      <h3>4. Vérifiez votre description</h3>
      <button class="btn" type="button" id="rps02-check">Afficher les caractéristiques retenues</button>
      <div id="rps02-result" class="notice rps02-result" role="status" aria-live="polite" tabindex="-1" hidden></div>
    </div>

    <div class="rps02-step">
      <h3>5. Nouvelle observation</h3>
      <p>Lors de votre prochaine observation, essayez de commencer par la sensation, puis l'aspect, sans chercher immédiatement une catégorie. La progression est enregistrée uniquement comme apprentissage local.</p>
      <button class="btn btn-secondary" type="button" id="rps02-complete">J'ai fait cet exercice</button>
      <span id="rps02-progress" class="learn-meta" role="status" aria-live="polite"></span>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #rps02-visual-workshop{margin-top:18px}
    #rps02-visual-workshop .rps02-step{padding:14px;border:1px solid var(--border);border-radius:12px;margin-top:14px}
    #rps02-visual-workshop .rps02-grid{display:grid;gap:12px}
    #rps02-visual-workshop label{color:var(--text);font-weight:600}
    #rps02-visual-workshop select{margin-top:5px;font-weight:400}
    #rps02-visual-workshop .rps02-visual-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}
    #rps02-visual-workshop .rps02-visual{border:1px solid var(--border);border-radius:10px;padding:10px;background:var(--bg);text-align:left;cursor:pointer;color:var(--text)}
    #rps02-visual-workshop .rps02-visual[aria-pressed="true"]{outline:3px solid var(--blue);outline-offset:1px}
    #rps02-visual-workshop .rps02-swatch{height:72px;border-radius:8px;border:1px solid var(--border);margin-bottom:7px}
    #rps02-visual-workshop .rps02-photo-preview{display:block;max-width:100%;max-height:280px;margin-top:10px;border:1px solid var(--border);border-radius:12px;object-fit:contain;background:var(--bg)}
    #rps02-visual-workshop .rps02-result{margin-top:12px}
    #rps02-visual-workshop .rps02-real-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}
    #rps02-visual-workshop .rps02-real{border:1px solid var(--border);border-radius:10px;padding:8px;background:var(--bg);text-align:left;cursor:pointer;color:var(--text)}
    #rps02-visual-workshop .rps02-real[aria-pressed="true"]{outline:3px solid var(--blue);outline-offset:1px}
    #rps02-visual-workshop .rps02-real img{display:block;width:100%;height:150px;object-fit:contain;background:#f4f4f4;border-radius:8px;margin-bottom:7px}
    #rps02-visual-workshop .rps02-image-fallback{height:150px;display:grid;place-items:center;border-radius:8px;background:var(--bg);margin-bottom:7px;font-size:.85rem;text-align:center}
    @media(min-width:760px){#rps02-visual-workshop .rps02-real-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(min-width:620px){#rps02-visual-workshop .rps02-grid{grid-template-columns:1fr 1fr}}
    @media(min-width:760px){#rps02-visual-workshop .rps02-visual-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);
  root.insertAdjacentElement('afterend', card);

  const examples = [
    ['opaque','Opaque / blanc','Peu ou pas de transparence apparente','linear-gradient(135deg,#f5f5f5,#d9d9d9)'],
    ['translucent','Translucide','La lumière semble passer partiellement','linear-gradient(135deg,#eef8f8,#cfe2e2)'],
    ['transparent','Transparent','Aspect clair avec transparence apparente','linear-gradient(135deg,#fff,#d8eef4)'],
    ['stretchy','Étirable','Un fil peut sembler se former lorsqu’il est étiré','linear-gradient(135deg,#fafdfd,#e5f2f3)']
  ];
  const grid = document.getElementById('rps02-visual-grid');
  examples.forEach(([value,title,desc,bg]) => {
    const button=document.createElement('button');
    button.type='button'; button.className='rps02-visual'; button.dataset.value=value; button.setAttribute('aria-pressed','false');
    const swatch=document.createElement('div'); swatch.className='rps02-swatch';
    const strong=document.createElement('strong'); strong.textContent=title;
    const meta=document.createElement('div'); meta.className='learn-meta'; meta.textContent=desc;
    button.append(swatch,strong,meta);
    button.querySelector('.rps02-swatch').style.background=bg;
    button.addEventListener('click',()=>{grid.querySelectorAll('.rps02-visual').forEach(b=>b.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');});
    grid.appendChild(button);
  });

  const none=document.getElementById('rps02-none');
  const clearVisual=()=>grid.querySelectorAll('.rps02-visual').forEach(b=>b.setAttribute('aria-pressed','false'));
  none.addEventListener('click',clearVisual);

  let objectUrl=null;
  const photoInput=document.getElementById('rps02-photo');
  const preview=document.getElementById('rps02-photo-preview');
  const photoStatus=document.getElementById('rps02-photo-status');
  photoInput.addEventListener('change',()=>{
    const file=photoInput.files&&photoInput.files[0];
    if(objectUrl)URL.revokeObjectURL(objectUrl);
    objectUrl=null; preview.hidden=true; preview.removeAttribute('src'); photoStatus.textContent='';
    if(!file)return;
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>8*1024*1024){
      photoStatus.textContent='Format non pris en charge ou fichier supérieur à 8 Mo.';
      photoInput.value=''; return;
    }
    objectUrl=URL.createObjectURL(file);
    preview.src=objectUrl; preview.hidden=false;
    photoStatus.textContent='Photo affichée localement uniquement. Elle n’est pas analysée ni sauvegardée.';
  });

  const corpusSection=document.createElement('div');
  corpusSection.className='rps02-real-corpus';
  corpusSection.innerHTML='<h4>Exemples photographiques réels — corpus sous licence</h4><p class="learn-meta">Ces photographies proviennent de sources dont les conditions de réutilisation ont été documentées. Elles servent à apprendre à observer ; les notations propres aux méthodes sources ne sont pas des catégories SymRella.</p><div class="rps02-real-grid" id="rps02-real-grid"><p class="learn-meta">Chargement du corpus…</p></div>';
  card.querySelector('.rps02-step:nth-of-type(2)').appendChild(corpusSection);
  const realGrid=corpusSection.querySelector('#rps02-real-grid');
  fetch('./data/rps02-visual-corpus.json',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('corpus');return response.json();}).then(data=>{
    realGrid.innerHTML='';
    data.records.forEach(record=>{
      const button=document.createElement('button');
      button.type='button'; button.className='rps02-real'; button.setAttribute('aria-pressed','false');
      const safeSource=record.sourceName;
      const safeLabel=record.referenceLabel||'Exemple réel';
      const image=document.createElement('img');
      image.loading='lazy';
      image.alt='Exemple photographique réel de sécrétion cervicale';
      image.src=record.assetUrl;
      const title=document.createElement('strong');
      title.textContent='Exemple réel';
      const sourceMeta=document.createElement('span');
      sourceMeta.className='learn-meta';
      sourceMeta.textContent=safeSource+' · '+safeLabel;
      const licenseMeta=document.createElement('span');
      licenseMeta.className='learn-meta';
      licenseMeta.textContent='Licence : '+record.license;
      button.append(image,title,sourceMeta,licenseMeta);
      button.addEventListener('click',()=>{
        realGrid.querySelectorAll('.rps02-real').forEach(b=>b.setAttribute('aria-pressed','false'));
        button.setAttribute('aria-pressed','true');
        clearVisual();
        button.dataset.selectedId=record.imageId;
      });
      button.querySelector('img').addEventListener('error',()=>{button.querySelector('img').replaceWith(Object.assign(document.createElement('div'),{className:'rps02-image-fallback',textContent:'Image indisponible — consulter la source'}));});
      realGrid.appendChild(button);
    });
  }).catch(()=>{realGrid.innerHTML='<p class="learn-meta">Le registre est présent, mais les images externes ne sont pas disponibles dans cet environnement. La source et la licence restent consultables.</p>';});

  const getSelectedVisual=()=>grid.querySelector('.rps02-visual[aria-pressed="true"]')?.dataset.value||realGrid?.querySelector('.rps02-real[aria-pressed="true"]')?.dataset.selectedId||null;
  const labels={sensation:{dry:'sèche',moist:'humide',wet:'mouillée',slippery:'glissante'},texture:{sticky:'collante',creamy:'épaisse / crémeuse',watery:'très fluide',gel:'gélatineuse',mixed:'mélangée / difficile à décrire'},transparency:{opaque:'opaque / blanche',translucent:'translucide',transparent:'claire / transparente'},stretch:{none:'non étirable',little:'peu étirable',clear:'nettement étirable',uncertain:'étirement indéterminé'}};
  const result=document.getElementById('rps02-result');
  document.getElementById('rps02-check').addEventListener('click',()=>{
    const values={sensation:document.getElementById('rps02-sensation').value,texture:document.getElementById('rps02-texture').value,transparency:document.getElementById('rps02-transparency').value,stretch:document.getElementById('rps02-stretch').value};
    const parts=[];
    Object.entries(values).forEach(([key,value])=>{if(value!=='unknown'&&labels[key][value])parts.push(labels[key][value]);});
    const visual=getSelectedVisual();
    const visualText=visual?(String(visual).startsWith('real-')||String(visual).includes('justisse-')||String(visual).includes('wikimedia-')?'une photographie réelle du corpus':({opaque:'repère visuel opaque / blanc',translucent:'repère visuel translucide',transparent:'repère visuel transparent',stretchy:'repère visuel étirable'}[visual]||'un exemple du corpus')):'aucun repère visuel retenu';
    result.replaceChildren();
    const resultTitle=document.createElement('strong'); resultTitle.textContent='Votre description actuelle';
    const resultText=document.createElement('p'); resultText.textContent=parts.length?parts.join(' · '):'Vous n’avez pas encore retenu de caractéristique précise.';
    const visualMeta=document.createElement('p'); visualMeta.className='learn-meta'; visualMeta.textContent='Repère visuel choisi : '+visualText+'.';
    const limitMeta=document.createElement('p'); limitMeta.className='learn-meta'; limitMeta.textContent='Ce résultat reprend uniquement vos choix. Il ne transforme pas ces caractéristiques en diagnostic, fertilité, ovulation ou catégorie méthodologique.';
    result.append(resultTitle,resultText,visualMeta,limitMeta);
    result.hidden=false; result.focus();
  });

  const progressKey='symrella_rps02_visual_progress_v1';
  const progressEl=document.getElementById('rps02-progress');
  const refreshProgress=()=>{let done=false;try{done=localStorage.getItem(progressKey)==='1';}catch(e){} progressEl.textContent=done?'Exercice déjà réalisé sur cet appareil.':'Exercice non encore marqué comme réalisé.';};
  document.getElementById('rps02-complete').addEventListener('click',()=>{try{localStorage.setItem(progressKey,'1');}catch(e){} refreshProgress();});
  refreshProgress();
  window.addEventListener('beforeunload',()=>{if(objectUrl)URL.revokeObjectURL(objectUrl);});
})();