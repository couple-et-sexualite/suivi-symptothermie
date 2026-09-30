# RPS-02 — Module pédagogique visuel cervical v0.1

## Statut

SPECIFICATION — prête pour revue méthodologique et implémentation.
Cette spécification ne valide aucune classification clinique nouvelle et n'autorise aucune inférence automatique à partir d'une image.

## 1. Finalité

Le module transforme l'incertitude de l'utilisatrice en apprentissage progressif :

`Je ne sais pas ce que je vois` → `j'observe` → `je compare` → `je comprends` → `j'observe à nouveau` → `je décris moi-même`.

L'objectif pédagogique est l'autonomie descriptive, et non la reconnaissance parfaite d'une photographie.

Une photographie est un exemple pédagogique. Elle ne constitue ni une preuve diagnostique, ni une mesure de fertilité, ni une vérité universelle de classification.

## 2. Principes non négociables

1. La donnée primaire est l'observation de l'utilisatrice.
2. Sensation et apparence restent deux dimensions distinctes.
3. Une image ne peut jamais compléter silencieusement une information absente.
4. Une image ne peut pas, seule, déclencher une interprétation RPS-02 de niveau clinique.
5. Les catégories provenant d'une méthode externe restent attribuées à cette méthode ; elles ne sont pas renommées comme catégories SymRella.
6. Toute image a une provenance, un statut de droits et une traçabilité pédagogique.
7. Toute image utilisateur est privée par défaut.
8. La contribution d'une image est volontaire et séparée du fonctionnement normal de l'application.
9. Toute classification encore non validée reste `pending_expert`, `unknown`, `other` ou `ambiguous`.
10. Le module doit fonctionner sans images réelles ; le corpus peut être ajouté ultérieurement.

## 3. Parcours utilisateur

### P0 — Observation libre

L'utilisatrice renseigne ce qu'elle ressent et voit, sans photo de référence.

Champs :
- sensation : dry, not_dry, moist, slippery, unknown ;
- appearance : none, sticky, creamy, watery, glassy, stretchy, egg_white_like, lumpy, other, unknown ;
- amount : none, small, moderate, large, unknown ;
- context : normal, bleeding, postpartum, breastfeeding, post_hormonal, infection_suspected, medication, other, unknown ;
- confidence : low, medium, high ;
- note libre facultative.

### P1 — « Je ne sais pas ce que je vois »

Le système explique que l'incertitude est normale et demande une description minimale avant d'afficher les exemples.

CTA : « Comparer avec des exemples ».

### P2 — Comparaison

Afficher les 9 photos locales du corpus initial, avec une sélection libre ; le filtrage en 3 ou 4 exemples proches reste une évolution pédagogique possible après validation du corpus.

Pour chaque exemple :
- image ;
- caractéristiques observables ;
- sensation éventuellement associée, explicitement séparée ;
- méthode/source de l'exemple ;
- niveau de certitude pédagogique.

Choix :
- « Cela ressemble davantage à cet exemple »
- « Aucun ne ressemble vraiment »
- « Je ne sais toujours pas »

Ne jamais afficher « bonne réponse » à ce stade.

### P3 — Explication

Après le choix, expliquer :
- quelles caractéristiques sont visibles ;
- quelles caractéristiques ne peuvent pas être déduites d'une photo ;
- pourquoi la sensation compte ;
- ce qui distingue les exemples ;
- pourquoi une variation individuelle est normale ;
- si l'exemple appartient à une méthode externe, le dire explicitement.

### P4 — Nouvelle observation

Proposer :
« Observez encore demain et décrivez d'abord votre propre observation avant de regarder les exemples. »

L'application peut mesurer une progression descriptive, sans transformer cette progression en conclusion de fertilité.

### P5 — Apprentissage

Progression pédagogique :
- Niveau 0 : je ne sais pas décrire ;
- Niveau 1 : j'identifie une ou plusieurs caractéristiques ;
- Niveau 2 : je compare plusieurs caractéristiques ;
- Niveau 3 : je décris mon observation sans aide visuelle.

Le niveau ne doit jamais être présenté comme une mesure médicale.

## 4. Règles de décision du module

### Règle V01 — priorité à l'observation

`userObservation` est conservée intégralement avant toute normalisation.

### Règle V02 — pas d'inférence visuelle silencieuse

Si `appearance = unknown`, une image choisie ne doit pas modifier la valeur enregistrée.

### Règle V03 — pas de fusion sensation/apparence

Une sensation « glissante » ne devient pas automatiquement « filante » ou « blanc d'œuf ».

### Règle V04 — pas d'inférence depuis la quantité

Une quantité importante ne suffit pas à déterminer une qualité.

### Règle V05 — contexte séparé

Saignement, postpartum, allaitement, période post-hormonale, médicament ou suspicion d'infection restent des contextes ; ils ne permettent pas de fabriquer une catégorie de mucus.

### Règle V06 — ambiguïté conservée

Une réponse ambiguë reste ambiguë. Le système ne choisit pas arbitrairement la catégorie la plus proche.

### Règle V07 — méthode externe explicitement attribuée

Si une image ou annotation vient d'une méthode externe, le champ `referenceSystem` est obligatoire.

### Règle V08 — aucune décision clinique par photographie

Le module visuel n'active ni `peakDate`, ni `peakPlusThreeDate`, ni une conclusion de fertilité.

## 5. Modèle de données des images

Chaque image candidate possède un enregistrement de registre distinct du corpus d'observations.

Champs minimum :

- imageId
- assetPath
- thumbnailPath
- sourceName
- sourceUrl
- creator
- license
- licenseUrl
- commercialUse
- modificationAllowed
- attributionRequired
- attributionText
- referenceSystem
- referenceTerminology
- rps02Mapping
- mappedFeatures
- teachingPurpose
- limitations
- qualityStatus
- rightsStatus
- pedagogicalStatus
- expertStatus
- validationVersion
- validator
- validationDate
- notes

Statuts :

`candidate`
→ `rights_verified`
→ `pedagogical_review`
→ `expert_review`
→ `validated`

Sorties possibles à tout moment :
- `rejected`
- `withdrawn`

Aucune image avec `rightsStatus != documented` ne peut être livrée dans le module commercial.

## 6. Provenance et droits

Avant utilisation :
1. identifier l'auteur ou le détenteur ;
2. identifier la licence ou obtenir une autorisation écrite ;
3. vérifier l'autorisation commerciale ;
4. vérifier le droit de modification/cadrage ;
5. enregistrer l'obligation d'attribution ;
6. conserver l'URL et la date de vérification ;
7. conserver la version de la licence si elle est disponible ;
8. ne jamais considérer une image trouvée sur Google, Pinterest, Instagram ou un forum comme libre d'utilisation.

### Source externe à étudier

La Cervical Mucus Gallery de Justisse indique que ses images sont sous CC BY-SA et autorise l'usage commercial sous les conditions de cette licence. Elle précise également que ses images correspondent aux notations de la méthode Justisse et déconseille de les mélanger avec d'autres méthodes.

Conséquence pour SymRella : ces images peuvent être étudiées comme source potentielle, mais une image Justisse ne doit pas être présentée comme une catégorie RPS-02 sans procédure de mapping et validation indépendante.

## 7. Photos fournies par les utilisatrices

### Mode privé par défaut

- photo stockée localement ;
- aucune transmission réseau ;
- aucune utilisation pédagogique ;
- suppression locale possible.

### Mode contribution volontaire

L'utilisatrice doit accepter séparément :
- la transmission de l'image ;
- son examen pédagogique ;
- son éventuelle utilisation pédagogique ;
- éventuellement son utilisation pour la recherche.

Chaque finalité doit pouvoir être refusée séparément.

### Pipeline de contribution

Photo locale
→ consentement
→ transmission volontaire
→ identifiant pseudonyme
→ contrôle qualité
→ retrait des métadonnées inutiles
→ annotation
→ revue
→ validation
→ ajout éventuel au corpus.

Une photo reçue ne devient jamais automatiquement une donnée « gold ».

## 8. Sécurité et confidentialité des images

Le produit actuel étant local-first :
- aucune image ne doit être synchronisée par défaut ;
- aucune image ne doit être ajoutée à `localStorage` si son poids risque de dégrader l'application ;
- utiliser Blob/IndexedDB si une future fonctionnalité locale d'image est réellement nécessaire ;
- ne jamais inscrire les photos dans les logs ;
- ne jamais envoyer une image à une API d'IA sans consentement explicite et fonctionnalité dédiée ;
- toute future synchronisation devra être une évolution d'architecture distincte.

## 9. Annotation pédagogique

Une image validée ne reçoit pas seulement une étiquette.

Elle reçoit des attributs descriptifs indépendants :

- visibleTransparency
- visibleColor
- visibleTexture
- apparentStretch
- apparentAmount
- visibleConsistency
- uncertainty
- contextIfKnown

Puis :
- `referenceSystem`
- `referenceLabel`
- `rps02Mapping`
- `mappingConfidence`
- `reviewer`
- `reviewDate`

Une caractéristique non observable est `unknown`, jamais déduite.

## 10. Séparation des niveaux de vérité

### Niveau A — donnée utilisateur
Ce que la personne a réellement saisi.

### Niveau B — description pédagogique
Ce que l'image permet raisonnablement de montrer.

### Niveau C — correspondance méthodologique
Comment une méthode externe décrit l'exemple.

### Niveau D — référentiel RPS-02
Correspondance validée avec SymRella.

### Niveau E — interprétation clinique
Hors périmètre de ce module tant qu'elle n'est pas explicitement validée.

Cette séparation doit être visible dans le code et dans les données.

## 11. Cas particuliers

Le module doit permettre :
- absence de mucus observable ;
- observations contradictoires ;
- mélange de caractéristiques ;
- saignement ;
- postpartum ;
- allaitement ;
- post-hormonal ;
- médicaments ;
- suspicion d'infection ;
- vocabulaire local ;
- traduction incertaine ;
- observation impossible à photographier correctement.

Dans ces cas, le système explique la limite plutôt que de forcer une catégorie.

## 12. Critères d'acceptation fonctionnels

Le module ne sera considéré comme prêt que si :

- [ ] une utilisatrice peut commencer sans image ;
- [ ] « Je ne sais pas » est toujours disponible ;
- [ ] les données brutes sont conservées ;
- [ ] sensation et apparence ne sont jamais fusionnées automatiquement ;
- [ ] une image ne modifie jamais silencieusement une observation ;
- [ ] les exemples sont filtrés par objectif pédagogique ;
- [ ] la provenance de chaque image est traçable ;
- [ ] les droits commerciaux sont vérifiés avant publication ;
- [ ] une méthode externe est explicitement nommée ;
- [ ] les images non validées sont impossibles à afficher en production ;
- [ ] une photo utilisateur reste locale par défaut ;
- [ ] aucun envoi d'image n'est réalisé sans consentement ;
- [ ] les cas ambigus restent ambigus ;
- [ ] aucune conclusion de fertilité n'est produite par le module visuel ;
- [ ] le parcours permet une nouvelle observation ;
- [ ] le niveau d'apprentissage peut progresser sans produire de score médical.

## 13. Tests à prévoir

### Tests unitaires
- conservation de l'observation brute ;
- absence d'inférence ;
- séparation sensation/apparence ;
- filtrage des images par statut ;
- blocage des droits incomplets ;
- blocage des images non validées ;
- consentement par finalité ;
- gestion des cas ambigus.

### Tests E2E
1. « Je ne sais pas » → comparaison → explication → nouvelle observation.
2. Refus de toutes les photos → le module reste fonctionnel.
3. Photo locale → aucune requête réseau.
4. Contribution sans consentement → blocage.
5. Licence manquante → image non publiée.
6. Image externe d'une méthode A → jamais affichée comme catégorie de méthode B.
7. Observation contradictoire → pas de classification forcée.
8. Contexte particulier → message pédagogique sans diagnostic.
9. Réouverture de l'application → aucune image privée envoyée.
10. Suppression d'une photo locale → suppression effective.

## 14. Corpus initial

Ne pas commencer par 100 ou 500 photographies.

Phase 1 :
- 0 photo réelle dans l'application commerciale ;
- interface fonctionnelle avec exemples abstraits ou illustrations pédagogiques non cliniques ;
- validation du parcours.

Phase 2 :
- petit corpus de référence dont les droits sont documentés ;
- revue pédagogique ;
- revue méthodologique.

Phase 3 :
- corpus utilisateur volontaire ;
- annotation indépendante ;
- validation inter-évaluateurs ;
- décision sur les images réellement utiles.

Phase 4 :
- intégration progressive dans l'application.

## 15. Décision d'architecture

Le module doit être conçu comme un composant indépendant :

`VisualLearningModule`

Entrées :
- observation utilisateur ;
- langue ;
- niveau d'apprentissage ;
- contexte ;
- catalogue d'images validées.

Sorties :
- progression pédagogique ;
- caractéristiques observées par l'utilisatrice ;
- feedback explicatif ;
- nouvelle observation à encourager.

Il ne retourne pas :
- diagnostic ;
- confirmation d'ovulation ;
- décision de fertilité ;
- contraception ;
- date de Peak.

Il peut retourner un **repère pédagogique descriptif** tel que « ressemble à un mucus de période fertile » ou « peut apparaître autour de l'ovulation », à condition de préciser les limites et de ne pas transformer ce repère en décision méthodologique.

## 16. Raison méthodologique

Les recherches montrent qu'il est possible d'enseigner l'observation et la consignation des symptômes cervicaux, mais les méthodes d'observation et leurs nomenclatures diffèrent. Une étude InVivo récente a notamment utilisé une évaluation standardisée du mucus avec plusieurs caractéristiques visuelles et des images macroscopiques/microscopiques ; cela ne constitue pas une validation automatique de l'ontologie RPS-02.

La documentation existante de RPS-02 conserve donc volontairement l'ontologie SymRella comme proposition à valider.

## 17. Gate de validation

Aucune activation commerciale du corpus photographique tant que les quatre portes suivantes ne sont pas franchies :

**G1 — droits**
Toutes les images ont une provenance et des droits documentés.

**G2 — pédagogie**
Le parcours et les explications ont été relus.

**G3 — méthodologie**
Le mapping vers RPS-02 est explicitement validé ou maintenu en `pending_expert`.

**G4 — sécurité**
Le stockage local, le consentement et l'absence d'envoi implicite sont testés.

Une image qui échoue à une porte reste hors production.

## 18. Décision finale v0.1

SymRella ne doit pas chercher à devenir une application qui « reconnaît la glaire sur une photo ».

Elle doit devenir une application qui apprend progressivement à l'utilisatrice à **observer, décrire, comparer et comprendre ses propres observations**, avec des exemples visuels traçables et méthodologiquement séparés.

Cette distinction est une exigence d'architecture, pas seulement une formulation marketing.
