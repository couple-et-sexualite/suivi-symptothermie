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
