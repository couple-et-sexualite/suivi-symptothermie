# RPS-02-CERVICAL-AI-RESEARCH-ROADMAP — v0.1

## Phase 0 — spécification
- ontologie provisoire ;
- schéma de données ;
- gouvernance ;
- protocole de validation ;
- règles d'incertitude.

## Phase 1 — faisabilité
Objectif : mesurer si les observations structurées sont suffisamment reproductibles pour justifier un corpus photographique.

Mesures :
- taux d'observations exploitables ;
- désaccord entre évaluateurs ;
- difficultés de prise de vue ;
- taux d'ambiguïté ;
- révision de l'ontologie.

Aucun modèle de production à ce stade.

## Phase 2 — corpus de développement
Les participantes sont séparées par split avant entraînement. Toutes les observations d'une même participante restent dans un seul split.

## Phase 3 — baseline
Comparer :
1. règle simple basée sur les caractéristiques structurées ;
2. image seule ;
3. image + questionnaire.

Le but est de vérifier que la photo apporte réellement une information supplémentaire.

## Phase 4 — validation
Test verrouillé sur des participantes jamais vues. Mesures par caractéristique, calibration et analyse des erreurs.

## Phase 5 — validation externe
Tester de nouvelles participantes, appareils et conditions lumineuses. Réaliser une revue méthodologique indépendante.

## Phase 6 — intégration produit
Uniquement après satisfaction de toutes les gates RPS-02.

La première version doit pouvoir répondre « observation insuffisante ou ambiguë » plutôt que forcer une classification.

## Décision d'architecture
Le premier objectif n'est pas de créer une IA qui « sait reconnaître la glaire ».

Le premier objectif est de démontrer expérimentalement qu'une assistance visuelle ajoute une information suffisamment fiable à l'auto-observation.

Si la photo seule n'est pas assez fiable, conserver le modèle multimodal photo + questionnaire. Si même ce modèle n'est pas suffisamment reproductible, ne pas déployer la fonction.
