# SymRella — spécification produit : classification de la fertilité

**Statut :** document de cadrage fonctionnel. Ce document fixe la finalité du produit ; il ne constitue ni une validation de la méthode Sensiplan, ni une validation clinique ou réglementaire.

## 1. Finalité retenue

SymRella doit devenir une application symptothermique qui aide les utilisatrices et les couples à :

1. repérer et comprendre la période fertile afin de favoriser une conception ;
2. identifier, selon les règles d'une méthode symptothermique reconnue, les jours classés fertiles et les jours classés infertiles après confirmation des critères, afin de pouvoir utiliser ces informations dans une démarche d'évitement d'une grossesse.

Le produit ne doit donc pas rester un simple journal d'observations. Il doit interpréter les données selon un référentiel explicite.

## 2. Référentiel méthodologique

- Référentiel de départ retenu pour le projet : **Sensiplan**.
- SymRella ne doit pas inventer une méthode hybride ni modifier les règles Sensiplan pour simplifier l'interface.
- Toute règle algorithmique doit être reliée à une source méthodologique identifiable et à une version précise du référentiel.
- Les règles de début de fertilité, d'évaluation de la glaire, de montée thermique, d'exceptions et de double contrôle doivent être retranscrites fidèlement à partir de documents méthodologiques autorisés et contrôlées par une personne formée à Sensiplan.
- Les quatre catégories actuelles de glaire dans l'interface ne doivent pas être considérées comme une équivalence validée des critères Sensiplan. Les observations brutes doivent être conservées et l'interface doit recueillir les caractéristiques nécessaires à l'évaluation de la méthode.
- En cas d'information insuffisante, contradictoire, perturbée ou hors des situations couvertes par les règles implémentées, le moteur doit renvoyer un état indéterminé et ne jamais conclure à l'infertilité.

## 3. États fonctionnels attendus

Les libellés définitifs et leurs couleurs seront fixés après validation de la matrice de règles. Le moteur devra au minimum distinguer :

- **Fertilité possible / période potentiellement fertile** : les critères d'ouverture de la période fertile sont atteints ou les données ne permettent pas de conclure à une période infertile.
- **Période fertile** : les observations et règles du référentiel indiquent que la période fertile est ouverte.
- **Fin de fertilité en attente** : un ou plusieurs critères de fin sont en cours d'évaluation, mais la double vérification n'est pas achevée.
- **Période post-ovulatoire classée infertile selon la méthode** : uniquement lorsque tous les critères requis par le référentiel sont satisfaits.
- **Indéterminé — observations insuffisantes ou perturbées** : aucune conclusion d'infertilité ne peut être affichée.

Les états internes du moteur doivent être séparés des textes visibles. Les messages destinés à l'utilisatrice doivent expliquer les observations et les critères qui manquent, sans transformer une estimation en certitude biologique.

## 4. Deux parcours d'utilisation

### A. Projet de conception

L'application doit :
- rendre visibles les jours classés fertiles ;
- présenter les observations de glaire et leur évolution ;
- aider à repérer les jours où les signes de fertilité sont les plus favorables, uniquement selon les critères validés du référentiel ;
- permettre de consulter le raisonnement associé au classement.

### B. Évitement d'une grossesse

L'application doit :
- afficher clairement les jours classés fertiles selon la méthode ;
- ne classer une journée comme infertile que lorsque les critères méthodologiques applicables sont entièrement satisfaits ;
- expliquer les jours où les règles recommandent de s'abstenir de rapports avec pénétration ou d'utiliser une méthode barrière, conformément aux supports pédagogiques officiels de la méthode ;
- ne jamais transformer une donnée manquante, une température perturbée ou une observation ambiguë en jour infertile.

Les deux parcours utilisent le même moteur méthodologique. Ils ne doivent pas produire des classifications contradictoires.

## 5. Règles de sécurité du moteur

1. Aucune prédiction calendaire seule ne peut ouvrir une période infertile.
2. Aucune absence de glaire saisie ne peut, à elle seule, confirmer une infertilité.
3. Une température perturbée doit rester visible dans le dossier, mais être traitée selon les règles de la méthode.
4. Les données manquantes ne doivent jamais être interpolées ou inventées.
5. Les situations particulières non couvertes par les règles implémentées doivent conduire à « indéterminé » et à une explication.
6. Chaque résultat doit être traçable : données utilisées, données écartées, règle appliquée, date de décision et version de l'algorithme.
7. Une correction rétroactive d'observation doit recalculer les jours concernés et conserver une explication du changement.
8. Le moteur ne doit pas annoncer une ovulation biologiquement confirmée si le référentiel ne permet qu'une classification symptothermique.

## 6. Travaux requis avant d'activer les classifications

### Lot 1 — Matrice de traçabilité méthodologique
Pour chaque règle, documenter :
- identifiant de règle ;
- formulation exacte du référentiel ;
- source, version, page ou section ;
- données nécessaires ;
- logique de calcul ;
- exceptions ;
- états produits ;
- exemples de cycles de référence ;
- validation par un expert Sensiplan.

### Lot 2 — Audit de l'application existante
Comparer les fonctions et données actuelles de `app.js`, `index.html`, des tests et de `docs/RPS-02.md` à la matrice. Identifier les modifications minimales nécessaires. Ne pas remplacer les fonctionnalités existantes sans nécessité.

### Lot 3 — Moteur et interface
Implémenter séparément :
- collecte et conservation des observations brutes ;
- calcul thermique ;
- évaluation de la glaire ;
- double contrôle ;
- classification quotidienne ;
- explication lisible du résultat.

### Lot 4 — Tests
Créer des tests unitaires déterministes à partir de cas de référence vérifiés par un spécialiste, incluant au minimum :
- données complètes et critères satisfaits ;
- montée thermique non confirmée ;
- exceptions thermiques prévues par le référentiel ;
- pic de glaire provisoire puis nouveau signe de meilleure qualité ;
- données manquantes ;
- températures perturbées ;
- signes contradictoires ;
- cycles longs ou variables ;
- modifications rétroactives des observations ;
- situations particulières pour lesquelles la méthode demande une conduite spécifique ou une abstention d'interprétation.

Les tests automatisés vérifient que le code applique les règles spécifiées ; ils ne prouvent pas à eux seuls l'efficacité contraceptive de la méthode ou du produit.

## 7. Conditions avant communication commerciale

- Ne pas annoncer que SymRella est « validée Sensiplan » sans autorisation et examen formel appropriés.
- Ne pas revendiquer un taux d'efficacité contraceptive sans données et justification adaptées à la revendication et au marché visé.
- Faire examiner séparément les obligations applicables dans chaque marché de commercialisation, en tenant compte des deux finalités : conception et évitement d'une grossesse.
- Conserver une communication claire sur le référentiel utilisé, les limites, les situations nécessitant un accompagnement et la conduite à tenir lorsque l'application ne peut pas classer un jour.

## 8. Décision de périmètre

Cette spécification remplace, pour la définition de la finalité produit, les formulations de RPS-02 qui interdisent à SymRella d'afficher des jours fertiles ou infertiles. Elle ne rend pas automatiquement opérationnelles les règles de calcul : celles-ci restent soumises à la matrice de traçabilité, aux tests et à l'examen méthodologique qualifié.

**Priorité immédiate :** établir la matrice Sensiplan complète avant de modifier le moteur de calcul ou d'afficher des jours infertiles.


## 9. Première matrice de traçabilité — éléments documentés et points à verrouiller

Cette matrice est une **base de travail documentaire**, pas encore une spécification algorithmique exhaustive. Les sources publiques permettent de confirmer plusieurs principes, mais le manuel Sensiplan complet reste la référence nécessaire pour coder toutes les variantes et situations particulières.

| ID | Domaine | Élément documenté | Source publique consultée | Statut pour le développement |
|---|---|---|---|---|
| M-01 | Début de fertilité | Le début de la période potentiellement fertile tient compte du premier signe de glaire/ sensation humide et d'une règle de calcul fondée sur les cycles précédents ; le signe observé le plus précoce prévaut. | IFP Familienhandbuch, section Sensiplan ; étude de conception Sensiplan | Principe confirmé ; formule exacte, nombre de cycles requis et cas de début de cycle à reprendre dans le manuel |
| M-02 | Observation de glaire | Sensiplan distingue notamment les sensations et les caractéristiques observées ; les catégories publiques comprennent d, ø, v, S et S+. | NFP Vlaanderen / Sensiplan Belgique, tableau des abréviations | Confirmé ; l'interface actuelle à quatre niveaux ne suffit pas à reproduire cette grille |
| M-03 | Pic de glaire | Le « Höhepunkt » correspond au dernier jour de la meilleure qualité individuelle ; il est identifié rétrospectivement après le changement de qualité. | Arbeitsgruppe NFP, support d'exercices ; documents de synthèse Sensiplan | Principe confirmé ; règles complètes de validation et de reprise du pic à extraire du manuel |
| M-04 | Fin selon la glaire | La règle post-pic attend trois jours révolus après le jour du pic ; la disponibilité post-ovulatoire commence après l'achèvement de cette règle, sous réserve du double contrôle. | Étude sur les couples subfertiles utilisant Sensiplan ; supports Sensiplan | Principe confirmé ; convention exacte de comptage et heure de libération à vérifier dans le référentiel |
| M-05 | Montée thermique | Règle de base : trois températures hautes consécutives au-dessus des six températures basses précédentes ; la troisième doit atteindre au moins +0,2 °C par rapport à la ligne de référence. | Sensiplan / AG NFP ; synthèse universitaire IFP Familienhandbuch | Principe confirmé ; règles de sélection et d'exclusion des températures à détailler |
| M-06 | Exceptions thermiques | Deux règles d'exception existent ; elles ne doivent pas être combinées. L'une concerne une troisième température qui n'atteint pas +0,2 °C ; l'autre une valeur qui retombe sur ou sous la ligne de référence. | IFP Familienhandbuch ; documents de synthèse de l'évaluation symptothermique | Principe confirmé ; séquences exactes à vérifier sur les exemples officiels avant codage |
| M-07 | Double contrôle | La phase post-ovulatoire infertile ne peut être classée qu'après achèvement des critères de glaire et de température ; le critère qui se termine en dernier gouverne la date de fin. | Étude Sensiplan publiée dans Archives of Gynecology and Obstetrics ; IFP Familienhandbuch | Principe confirmé |
| M-08 | Projet de conception | Les jours de glaire de meilleure qualité sont particulièrement pertinents pour cibler les rapports ; le conseil de conception n'est pas identique à la conduite d'évitement d'une grossesse. | Étude Sensiplan sur les couples subfertiles | À présenter dans un parcours distinct, sans altérer la classification commune |
| M-09 | Perturbations et données manquantes | Les données perturbées, absentes ou ambiguës doivent être traitées selon les règles explicites du manuel ; elles ne doivent pas être converties arbitrairement en données normales. | FAQ Sensiplan ; tableau de cycle Sensiplan | Détail des règles d'exclusion et de reprise à extraire du manuel |
| M-10 | Situations particulières | Post-partum/allaitement, arrêt de contraception hormonale, cycles irréguliers, maladie, médicaments, saignements atypiques et autres situations nécessitent les règles spécifiques du référentiel. | FAQ et supports Sensiplan | Non spécifié pour le moteur tant que les règles détaillées et cas tests ne sont pas documentés |

### Sources publiques de travail

- Sensiplan, FAQ officielle : https://www.sensiplan.de/faqs
- Sensiplan, téléchargements et documents de cycle : https://www.sensiplan.de/downloads
- Sensiplan Belgique, tableau des abréviations de glaire et présentation du manuel : https://sensiplan.be/downloads/
- IFP Familienhandbuch, section « Die symptothermale Methode Sensiplan » : https://www.familienhandbuch.de/eltern-werden/familienplanung/nat.familienplanung.php
- Frank-Herrmann et al., étude sur les taux de conception après formation Sensiplan : https://www.sensiplan.nl/wp-content/uploads/2025/02/Natural-conception-rates-in-subfertile-couples-following-fertility-awareness-training.pdf

### Points bloquants avant programmation

1. Obtenir et consulter le manuel Sensiplan autorisé dans sa version actuelle, ainsi que les tableaux de cycle et exemples d'évaluation.
2. Transcrire sans simplification les règles de début de fertilité, y compris le calcul rétrospectif et ses exceptions.
3. Formaliser les catégories de glaire et la détermination du pic, y compris les changements de meilleure qualité et les observations contradictoires.
4. Formaliser les deux exceptions thermiques et confirmer explicitement leur non-cumul.
5. Documenter les situations spéciales et leurs conséquences sur la classification.
6. Faire relire chaque règle et chaque cycle de test par une personne formée et habilitée à enseigner Sensiplan.

**Décision technique à ce stade :** ne pas coder les règles M-01 à M-10 à partir de résumés tiers. Les sources publiques confirment les grands principes, mais le manuel et les exemples officiels sont requis pour figer les cas limites.


## 10. Vérification complémentaire des documents officiels Sensiplan

La consultation des ressources officielles publiques fait apparaître deux éléments structurants qui doivent être intégrés au projet.

### 10.1. Les règles ne sont qu'un des piliers de Sensiplan

Le document officiel « Guidelines for Sensiplan teachers » présente cinq piliers :
1. les règles de l'AG NFP publiées dans le manuel *Natural and Safe* et son cahier d'exercices ;
2. la formation standardisée des enseignantes et enseignants Sensiplan ;
3. l'accompagnement personnel des femmes et des couples par une personne certifiée, selon la pédagogie et les supports standardisés ;
4. une formation continue obligatoire tous les deux ans ;
5. au moins une consultation annuelle.

Ce document indique que les écarts à ces spécifications ne permettent pas de garantir le niveau de sécurité revendiqué et ne doivent pas être déclarés comme Sensiplan. **Conséquence pour SymRella :** reproduire certaines règles dans un algorithme ne suffit pas, à lui seul, à autoriser une présentation du produit comme application officielle ou certifiée Sensiplan. Toute utilisation du nom, du logo, des supports ou une revendication d'équivalence doit être clarifiée directement avec l'AG NFP / les ayants droit. En attendant, employer une formulation descriptive et prudente, sans laisser entendre une affiliation ou une approbation.

Source officielle : https://www.sensiplan.de/storage/media/documents/433/richtlinien-englisch-ohne-unterschrift.pdf

### 10.2. Ressources officielles actuellement disponibles

La page officielle de téléchargements met à disposition des tableaux de cycle dans plusieurs langues, dont le français, ainsi que des tableaux spécifiques à l'allaitement. Le tableau anglais comporte notamment des champs pour le mode de mesure, la température, les observations de glaire, les perturbations et le calcul de l'ouverture précoce à partir des cycles précédents. Ces documents aident à concevoir les champs de SymRella, mais ne remplacent pas le manuel de règles.

- Page officielle : https://www.sensiplan.de/downloads
- Tableau de cycle anglais : https://www.sensiplan.de/storage/media/documents/22/sensiplan-cyclesheet-englisch.pdf

Le site officiel présente également une application Sensiplan disponible sur App Store et Google Play. Il faudra donc positionner clairement SymRella par rapport à cette application existante : public visé, langues, accessibilité, fonctionnalités complémentaires et éventuelle intégration pédagogique, sans supposer un partenariat.

Source officielle : https://www.sensiplan.de/unser-angebot

### 10.3. Mise à jour des conditions de poursuite

Avant tout affichage de jours infertiles ou toute communication commerciale fondée sur Sensiplan, ajouter les vérifications suivantes :
- clarification écrite des droits d'utilisation du nom « Sensiplan », des marques, des documents et des éventuels éléments pédagogiques ;
- clarification écrite de la possibilité de développer une application indépendante reproduisant les règles, et des conditions d'une éventuelle revendication de conformité ;
- confirmation de la portée des cinq piliers pour un outil logiciel indépendant qui ne remplace pas la formation et l'accompagnement ;
- définition explicite de la formulation publique autorisée pour décrire la méthode implémentée ;
- comparaison fonctionnelle avec l'application Sensiplan officielle, sans copier son interface ni ses contenus protégés.

Ces vérifications ne changent pas l'objectif de SymRella : développer une application symptothermique qui aide à repérer la fertilité pour les projets de conception et d'évitement d'une grossesse. Elles évitent en revanche de confondre « moteur inspiré de règles documentées » et « méthode Sensiplan officiellement reconnue ».


## 11. Écart fonctionnel entre le tableau Sensiplan et l'interface actuelle

La comparaison du tableau de cycle officiel français avec l'interface SymRella actuelle fait ressortir des écarts concrets.

| Donnée figurant dans le tableau Sensiplan | SymRella actuelle | Action nécessaire |
|---|---|---|
| Date et jour du cycle | Date/jour dérivés des observations | Vérifier la gestion du premier jour des règles et des cycles longs |
| Température quotidienne | Oui | Ajouter/valider la voie de mesure, l'heure et la qualité de la mesure dans le modèle |
| Heure de mesure | Pas de champ dédié identifié dans le modèle courant | Ajouter un champ explicite |
| Voie de mesure (orale, vaginale, rectale) | Pas de champ dédié identifié | Ajouter un choix explicite et conserver la voie par observation |
| Perturbations / événements inhabituels | Contexte partiel | Structurer les perturbations et leur lien avec une mesure donnée |
| Sensation liée à la glaire | Catégories globales sec/collante/crémeuse/blanc d'œuf | Séparer sensation et aspect ; ne pas inférer l'un depuis l'autre |
| Aspect de la glaire | Catégories globales uniquement | Ajouter les attributs nécessaires à la grille officielle, après vérification du manuel |
| Col : position, ouverture, consistance | Absent de l'interface actuelle examinée | Ajouter comme signe secondaire facultatif, sans le substituer aux signes principaux |
| Premières températures hautes des cycles précédents | Pas de synthèse dédiée identifiée | Créer un historique intercycles exploitable pour le calcul d'ouverture précoce |
| Premier signe de glaire / sensation non sèche | Données trop agrégées | Conserver le premier changement observé avec date et détail |
| Intention du cycle (conception ou évitement) | Pas de parcours explicite identifié | Ajouter un choix d'objectif ; même moteur de classification, présentation adaptée |
| Interprétation du cycle | Décalage thermique descriptif seulement | À implémenter ultérieurement, après règles sourcées et revue experte |

Source du tableau français : https://sensiplan.be/telechargements/?lang=fr
Source de la page officielle de téléchargements : https://www.sensiplan.de/downloads

### 11.1. Règle d'ouverture précoce : formule de travail à confirmer

Une revue scientifique comparative des méthodes de connaissance de la fertilité décrit pour Sensiplan le début de la phase potentiellement fertile comme le premier des repères suivants :
- le 6e jour du cycle ;
- six jours avant la première montée thermique la plus précoce observée dans les cycles précédents ;
- le jour correspondant à la durée du cycle le plus court parmi les cycles précédents, moins 19 jours ;
- le premier jour où apparaît de la glaire cervicale.

Cette formulation est consignée ici comme **règle de travail issue d'une revue comparative**, et non comme règle prête à coder. La formule doit être comparée mot à mot au manuel officiel, notamment le nombre de cycles antérieurs requis, le traitement des cycles atypiques et la règle de glaire/sensation à appliquer. Source de comparaison : Peragallo Urrutia et al., systematic review, tableau 1 : https://www.sensiplan.nl/wp-content/uploads/2025/02/Effectiveness-of-Fertility-Awareness%E2%80%93Based-Methods-for-Pregnancy-Prevention_A-Systematic-Review.pdf

### 11.2. Signe du col de l'utérus

Le tableau officiel français comprend les observations de position, d'ouverture et de consistance du col. Le site Sensiplan Belgique indique que ce signe peut être utile dans certaines situations, notamment la préménopause ou après une grossesse. Il doit donc être prévu dans le modèle de données comme observation distincte, mais son poids dans les règles de classification ne doit pas être inventé ni ajouté au double contrôle sans référence explicite au manuel.

Source : https://sensiplan.be/telechargements/?lang=fr

### 11.3. Parcours conception et évitement

Le tableau officiel comporte une question sur l'intention de grossesse pour le cycle. SymRella doit donc demander l'objectif de l'utilisateur, tout en conservant une seule classification méthodologique sous-jacente :
- **Conception :** rendre lisibles les observations et la fenêtre de fertilité, sans prétendre prédire avec certitude le jour de l'ovulation.
- **Évitement :** rendre visibles les jours potentiellement fertiles et ne classer la phase post-ovulatoire comme infertile qu'après validation complète des critères et des conditions d'utilisation applicables.
- **Objectif non défini :** permettre la saisie et l'affichage neutre des observations, sans supposer l'intention.

La classification doit être identique quel que soit l'objectif ; seul le conseil d'usage et la présentation peuvent différer.


## 12. Modèle de données cible — spécification consolidée

### 12.1. Principes non négociables

- Conserver les observations brutes telles que saisies ; ne jamais les remplacer par une interprétation calculée.
- Séparer les faits observés, le contexte, les paramètres du référentiel, les résultats du moteur et les explications affichées.
- Une donnée inconnue reste `null` ou absente selon le contrat du champ ; elle ne devient jamais une valeur normale par défaut.
- Une donnée perturbée reste conservée et visible, même si une règle documentée l'exclut d'un calcul.
- Les résultats sont recalculables à partir des observations et de la version des règles ; ne pas enregistrer un statut calculé comme s'il s'agissait d'une observation.
- Toute modification rétroactive d'une observation invalide les résultats dérivés du cycle et des cycles dépendants.
- Le modèle doit fonctionner sans connexion, avec export/import local, et sans compte obligatoire.

### 12.2. Enveloppe de stockage

Conserver provisoirement les clés locales actuelles afin de ne pas casser les installations existantes :
- `symptothermie_current_cycle`
- `symptothermie_history`
- `symptothermie_learning_progress`
- `symptothermie_profile`

Le format cible des données de cycle et de sauvegarde est versionné indépendamment de la version de l'interface :

```json
{
  "schema": "symrella.cycle",
  "schemaVersion": 2,
  "id": "cycle-uuid",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T12:00:00.000Z",
  "startDate": "2026-01-01",
  "endDate": null,
  "goal": "observe",
  "method": {
    "id": "sensiplan",
    "edition": null,
    "rulesetVersion": null,
    "reviewStatus": "not_approved"
  },
  "observations": [],
  "derived": {
    "engineVersion": null,
    "calculatedAt": null,
    "status": "not_evaluated",
    "days": []
  }
}
```

Les valeurs `edition` et `rulesetVersion` restent nulles tant que la version exacte du manuel et la validation des règles ne sont pas établies. Le code ne doit pas sélectionner silencieusement une version.

### 12.3. Observation quotidienne

Une observation est un enregistrement indépendant daté. Plusieurs signes du même jour peuvent être corrigés sans écraser les autres champs.

```json
{
  "id": "observation-uuid",
  "date": "2026-01-06",
  "cycleDay": 6,
  "bleeding": {
    "level": "none",
    "notes": ""
  },
  "temperature": {
    "valueC": 36.45,
    "originalValue": 97.61,
    "originalUnit": "F",
    "measuredAt": "06:35",
    "measurementRoute": "oral",
    "device": null,
    "disturbanceIds": [],
    "quality": "usable",
    "notes": ""
  },
  "cervicalMucus": {
    "sensation": "slippery",
    "appearance": ["clear", "stretchy"],
    "legacyCategory": null,
    "peakQualityCandidate": null,
    "notes": ""
  },
  "cervix": {
    "position": null,
    "opening": null,
    "consistency": null,
    "notes": ""
  },
  "disturbances": [],
  "intercourse": {
    "occurred": null,
    "details": null
  },
  "generalNotes": "",
  "source": "user"
}
```

Contrat des champs :
- `date` : date locale ISO `YYYY-MM-DD`, unique dans un cycle ; pas de conversion UTC pour déterminer le jour du cycle.
- `cycleDay` : valeur dérivée et vérifiable depuis `startDate`, jamais saisie comme vérité indépendante.
- `temperature.valueC` : nombre Celsius normalisé ou null ; conserver aussi valeur et unité originales lorsque disponibles.
- `measuredAt` : heure locale `HH:mm` ou null.
- `measurementRoute` : `oral`, `vaginal`, `rectal`, `other`, `unknown` ; aucun choix implicite.
- `quality` : `usable`, `disturbed`, `unknown`. Le motif de perturbation est porté par `disturbanceIds`.
- `sensation` et `appearance` : deux dimensions séparées. Les valeurs autorisées doivent être établies à partir du manuel et de la grille officielle ; les exemples JSON sont des illustrations de structure, pas une transposition officielle des catégories Sensiplan.
- `legacyCategory` : conserve la valeur historique de l'interface actuelle (`sec`, `collante`, `cremeuse`, `blanc-oeuf`) pour la traçabilité. Elle n'est pas convertie automatiquement en sensation, apparence ou qualité de pic.
- `cervix` : signe distinct et facultatif ; aucune pondération dans le moteur avant confirmation explicite du manuel.
- `intercourse` : champ facultatif et privé ; ne pas rendre sa saisie obligatoire pour calculer la classification.
- `source` : `user`, `import`, `migration` ou `device`, pour distinguer la provenance.

### 12.4. Perturbations structurées

```json
{
  "id": "disturbance-uuid",
  "type": "illness",
  "intensity": "unknown",
  "startTime": null,
  "endTime": null,
  "note": ""
}
```

Le catalogue initial peut prévoir maladie/fièvre, sommeil perturbé, horaire inhabituel, voyage, alcool, médicament et autre. Ce catalogue sert à décrire le contexte ; il ne décide pas à lui seul qu'une température est exclue. L'exclusion ou l'utilisation d'une mesure dépendra uniquement d'une règle source documentée.

### 12.5. Objectif et méthode

`goal` accepte `conception`, `evitement` ou `observe`. Il modifie le parcours, les explications et les informations mises en avant, mais jamais les règles de classification sous-jacentes.

Le bloc `method` doit contenir un identifiant de méthode, une édition/référence exacte et une version immuable du jeu de règles. Aucun cycle ne doit être présenté comme évalué selon Sensiplan tant que la référence exacte n'est pas configurée et que le statut de revue n'est pas approuvé.

### 12.6. Résultat calculé — séparé des observations

```json
{
  "engineVersion": "0.0.0",
  "rulesetId": null,
  "calculatedAt": null,
  "status": "not_evaluated",
  "days": [
    {
      "date": "2026-01-06",
      "classification": "undetermined",
      "reasonCodes": ["RULESET_NOT_APPROVED"],
      "explanationKey": "classification.undetermined"
    }
  ],
  "thermal": {
    "status": "not_evaluated",
    "referenceLineC": null,
    "candidateDates": [],
    "completionDate": null,
    "reasonCodes": []
  },
  "mucus": {
    "status": "not_evaluated",
    "peakDate": null,
    "completionDate": null,
    "reasonCodes": []
  },
  "doubleCheck": {
    "status": "not_evaluated",
    "completionDate": null,
    "reasonCodes": []
  }
}
```

États d'interface prévus : `potentially_fertile`, `fertile`, `end_check_pending`, `postovulatory_infertile`, `undetermined`. Le moteur ne doit émettre `postovulatory_infertile` qu'après validation du double contrôle selon la règle exacte approuvée. Avant cela, le résultat reste non déterminé ou potentiellement fertile selon les règles sourcées. Les libellés visibles seront localisés et accompagnés d'une explication des données/règles ayant conduit au résultat.

### 12.7. Historique intercycles

L'historique doit fournir au moteur les cycles antérieurs complets et vérifiables, pas seulement une durée minimale calculée sans provenance. Les données dérivées utiles (durée, premières températures hautes candidates, premier signe de glaire) peuvent être recalculées à partir des observations. Toute modification d'un cycle antérieur entraîne le recalcul des cycles suivants concernés.

### 12.8. Migration depuis le modèle actuel

Le modèle actuel est un tableau d'entrées quotidiennes avec notamment `date`, `temp`, `mucus`, `notes`, `factors`, `bleeding` et `time`. La migration doit être additive et réversible :
1. Lire les clés actuelles sans les supprimer ni les écraser.
2. Valider l'ensemble des tableaux selon les validateurs actuels.
3. Construire une copie au nouveau format avec un identifiant stable par cycle et par observation.
4. Convertir `temp` en `temperature.valueC` (la valeur actuelle étant déjà normalisée en Celsius dans le stockage) et conserver la valeur source disponible.
5. Déplacer `time` vers `temperature.measuredAt`.
6. Déplacer `factors` vers des objets `disturbances` avec `source: migration`, sans marquer automatiquement la température `disturbed`.
7. Déplacer `mucus` dans `legacyCategory` uniquement. Ne pas fabriquer sensation, apparence ou Peak.
8. Déplacer `bleeding` et `notes` vers les champs correspondants.
9. Les cycles archivés reçoivent `startDate` et `endDate` depuis les valeurs existantes ; les dates de cycle ne sont pas recalculées si elles sont absentes ou ambiguës.
10. Vérifier le nouveau contenu et l'écrire sous une nouvelle clé versionnée, par exemple `symrella_data_v2`.
11. Relire et valider la copie écrite avant d'activer le nouveau modèle.
12. En cas d'erreur, conserver l'ancien stockage actif et afficher une erreur explicite ; aucune suppression automatique.
13. Garder l'ancien format intact pendant au moins une version complète et jusqu'à confirmation que l'export/import et la restauration fonctionnent.
14. Ne jamais attribuer une classification de fertilité rétroactive aux cycles migrés.

### 12.9. Contrat de sauvegarde et d'import

La sauvegarde exportée doit contenir `app`, `schemaVersion`, `exportedAt`, `currentCycle`, `history`, `profile` et `learning`. L'import doit :
- accepter explicitement les versions prises en charge ;
- migrer en mémoire avant toute écriture ;
- valider toutes les entrées, dates, identifiants et tailles ;
- demander confirmation avant remplacement ;
- écrire de manière transactionnelle avec rollback si une écriture échoue ;
- préserver les clés existantes en cas d'échec ;
- signaler les champs historiques conservés sans interprétation.

### 12.10. Matrice minimale de tests du modèle

| Cas | Résultat attendu |
|---|---|
| Ancienne installation avec données valides | Migration sans perte ; anciennes clés conservées |
| Ancienne installation avec données illisibles | Aucune écriture destructive ; message de récupération |
| Entrée avec température absente | Observation conservée ; valeur null |
| Température avec heure absente | Heure null, jamais inventée |
| Température avec perturbation | Mesure conservée ; statut distinct du motif |
| Ancienne catégorie de glaire | Catégorie brute conservée ; aucun mapping automatique |
| Sensation et apparence indépendantes | Les deux valeurs restent distinctes |
| Modification/suppression d'une observation | Résultats dérivés invalidés et recalculables |
| Modification d'un cycle antérieur | Cycles dépendants marqués à recalculer |
| Import version antérieure | Migration contrôlée avant écriture |
| Import invalide ou trop volumineux | Refus sans modifier les données actuelles |
| Export puis import | Aller-retour sans perte des champs connus |
| Données inconnues d'une version future | Refus contrôlé ou conservation opaque documentée, jamais suppression silencieuse |

### 12.11. Découpage d'implémentation et critères d'acceptation

**Lot A — modèle et persistance :** définir les validateurs de schéma, identifiants, lecture/écriture versionnée, migration non destructive et sauvegarde compatible. Accepté lorsque tous les tests de migration et de round-trip passent.

**Lot B — saisie enrichie :** ajouter heure, voie de mesure, sensation, apparence, col et perturbations structurées dans l'interface FR/EN/ES/AR. Les nouveaux champs doivent rester facultatifs quand le référentiel ne les exige pas ; aucune donnée historique n'est écrasée.

**Lot C — moteur méthodologique :** implémenter seulement les règles transcrites depuis le manuel autorisé, chaque règle reliée à une page/exemple et à un test. Les règles M-01 à M-10 restent bloquées jusqu'à revue qualifiée.

**Lot D — restitution :** afficher la classification quotidienne et ses raisons, distinguer les parcours conception/évitement, gérer l'indétermination et les corrections rétroactives. Aucun jour infertile n'est affiché sur la base d'une donnée manquante, d'un calendrier seul ou d'une règle non approuvée.

**État à la date de cette spécification :** ce modèle cible est documenté, mais les lots A à D ne sont pas déclarés implémentés. Le code actuel continue d'utiliser les clés et structures historiques. Aucun test d'application n'est déclaré exécuté dans le cadre de cette mise à jour.
