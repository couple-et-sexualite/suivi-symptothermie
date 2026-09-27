# RPS-02-CERVICAL-AI-RESEARCH-ROADMAP — v0.2

## Statut
Document de recherche uniquement. L'IA cervicale n'est pas une fonctionnalité de production.

## Phase 0 — spécification
- ontologie descriptive provisoire ;
- schéma de données versionné ;
- protocole de faisabilité ;
- manuel d'annotation ;
- règles d'incertitude ;
- séparation stricte entre observation, annotation et adjudication.

**Gate G0 :** spécification relue et cohérente.

## Phase 1 — faisabilité humaine et photographique
Objectif : déterminer si les propriétés descriptives retenues peuvent être observées de manière suffisamment reproductible.

Pipeline :
`capture → contrôle qualité → observation participante → annotation A + annotation B → désaccord → adjudication → corpus verrouillé`

Mesures :
- taux d'images exploitables ;
- accord inter-évaluateurs par caractéristique ;
- taux d'ambiguïté ;
- taux de désaccord nécessitant adjudication ;
- difficultés de prise de vue ;
- effet appareil/lumière ;
- catégories nécessitant une révision.

**Gate G1 :** ne poursuivre que si les caractéristiques sont suffisamment reproductibles et que le protocole est applicable.

## Phase 2 — corpus de développement
Le corpus doit être constitué avec consentement et droits d'utilisation documentés.

Règles :
- identifiant pseudonyme, sans identité directe dans les données d'annotation ;
- séparation par participante avant tout entraînement ;
- toutes les images et dérivés d'une participante restent dans le même split ;
- aucune image du test verrouillé ne sert au développement ;
- retrait d'une participante répercuté sur tous ses dérivés ;
- provenance, version et statut de chaque image traçables.

Cibles de recherche initiales : 200–300 participantes et 500–1 000 observations photographiques, à ajuster après la phase de faisabilité. Ces chiffres sont des objectifs de planification et non des seuils de validation.

**Gate G2 :** corpus gouverné, suffisamment diversifié et techniquement exploitable.

## Phase 3 — baselines
Comparer sans modifier le test verrouillé :
1. questionnaire/observation structurée seul ;
2. image seule ;
3. image + observation structurée.

Objectif : mesurer la valeur ajoutée réelle de l'image.

Aucun modèle complexe ne doit être retenu simplement parce qu'il obtient un meilleur score sur un jeu non verrouillé.

## Phase 4 — validation interne
Test par participante jamais vue.

Rapporter :
- accord inter-évaluateurs ;
- précision, rappel et F1 lorsque pertinents ;
- matrice de confusion ;
- calibration ;
- taux de refus/« indéterminé » ;
- performances par qualité d'image ;
- performances par appareil ;
- performances par conditions lumineuses ;
- intervalles d'incertitude ;
- analyse qualitative des erreurs.

**Gate G3 :** résultats reproductibles, erreurs comprises et limites documentées.

## Phase 5 — validation externe
Tester de nouvelles participantes, de nouveaux appareils et des conditions réelles différentes.

La validation externe doit être indépendante de l'équipe ayant réglé le modèle.

**Gate G4 :** validation externe documentée et revue méthodologique indépendante.

## Phase 6 — intégration produit
Seulement après satisfaction des gates précédentes et validation indépendante du référentiel cervical.

La première sortie produit autorisée reste descriptive :
- caractéristique visuelle compatible ;
- caractéristique mixte ;
- observation insuffisante ou ambiguë.

La fonction ne doit pas produire automatiquement :
- fertile/infertile ;
- ovulation ;
- Peak/Peak+3 ;
- contraception ;
- « sûr »/« dangereux » ;
- diagnostic d'infection.

## Décision d'architecture
Le premier objectif n'est pas de créer une IA qui « reconnaît la glaire ».

Le premier objectif est de démontrer expérimentalement qu'une assistance visuelle apporte une information descriptive suffisamment fiable à l'auto-observation.

Si la photo seule n'est pas assez fiable, conserver une approche multimodale ou pédagogique. Si l'approche multimodale n'est pas suffisamment reproductible, ne pas déployer la fonction.

## Décisions STOP
Arrêter la piste IA si :
- les annotateurs ne peuvent pas appliquer l'ontologie de façon reproductible ;
- la qualité réelle des images rend la caractérisation trop incertaine ;
- le modèle dépend fortement d'un appareil ou d'un éclairage ;
- les performances chutent sur des participantes ou appareils jamais vus ;
- le système est contraint de forcer des classifications pour maintenir un taux de couverture élevé.
