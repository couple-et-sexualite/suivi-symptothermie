# RPS-02-CERVICAL-AI-VALIDATION — Plan expérimental v0.1

## Question
Une photographie combinée à une auto-observation structurée peut-elle aider à caractériser descriptivement une observation cervicale sans produire de conclusion méthodologique ?

## Hypothèses
H1 : certaines caractéristiques visuelles sont prédictibles au-dessus d'un niveau de référence prédéfini.
H2 : l'observation structurée réduit certaines ambiguïtés par rapport à l'image seule.
H3 : le système reconnaît les images insuffisantes et observations mixtes.
H4 : les performances restent acceptables sur participantes et appareils non vus.

Aucune hypothèse sur ovulation, fertilité ou contraception.

## Comparaisons
1. baseline humaine simple ;
2. image seule ;
3. image + observation structurée.

## Unité statistique
La participante est l'unité indépendante principale. Les intervalles de confiance doivent tenir compte des observations répétées par participante.

## Annotation
Au moins deux évaluateurs indépendants. Annotation en aveugle, désaccords mesurés, adjudication séparée, gold set figé.

## Résultats
Pour chaque caractéristique : sensibilité, spécificité, précision, F1, matrice de confusion, calibration et intervalle de confiance. Pour le multi-label : métriques par label et macro/micro lorsque pertinent.

## Incertitude
Analyser séparément les images bonnes, limites, insuffisantes, mixtes et contradictoires.

Un modèle qui force les cas ambigus avec une confiance élevée est un échec de sécurité méthodologique.

## Robustesse
Tester appareils, luminosité, résolution, cadrage, navigateur, langue et nouvelles participantes.

## Fuites
Avant chaque évaluation : hash exact, perceptual hash, regroupement par participante et contrôle des métadonnées.

## Test final
Le test final est verrouillé. Il ne sert ni à choisir l'architecture, ni les seuils, ni les transformations.

Toute modification après ouverture du test impose une nouvelle version.

## Seuils
Les seuils sont fixés avant le test final. Ils ne sont pas optimisés après observation du test.

## Non-déploiement
Bloquer si :
- forte variation inter-participantes ;
- forçage des cas ambigus ;
- calibration insuffisante ;
- fuite de données ;
- faible reproductibilité des annotations ;
- consentements/licences incomplets ;
- sortie interdite par RPS-02.

## Reproductibilité
Conserver datasetVersion, commit, modelVersion, seed, configuration, environnement, participants de chaque split et manifestes hashés.

## Rapport d'erreurs
Analyser faux positifs, faux négatifs, ambiguïtés, images insuffisantes, appareils, lumière et classes. Les erreurs critiques sont examinées individuellement.

## Décision produit
Même avec de bonnes métriques, la fonction reste descriptive. Elle ne débloque pas automatiquement le moteur cervical, Peak/Peak+3, fertile/infertile ou la contraception.

## Gate
DATA_READY -> ANNOTATION_READY -> MODEL_READY -> INTERNAL_VALIDATION -> EXTERNAL_PARTICIPANT_TEST -> ERROR_REVIEW -> METHODOLOGY_REVIEW -> PRODUCT_REVIEW -> RELEASE_AUTHORIZATION.

Toute étape échouée bloque la suivante.
