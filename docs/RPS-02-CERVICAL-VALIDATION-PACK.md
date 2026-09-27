# RPS-02 — Pack de validation cervicale v0.2

## Contenu
1. docs/RPS-02-CERVICAL.md — ontologie proposée.
2. docs/RPS-02-CERVICAL-AUDIT.md — audit méthodologique et points bloquants.
3. docs/RPS-02-CERVICAL-CORPUS.md — corpus de validation.
4. docs/RPS-02-CERVICAL-ANNOTATION.md — protocole d'annotation.
5. tests/fixtures/rps02-cervical-corpus.json — corpus machine-readable.
6. tests/rps02-cervical-corpus.test.js — invariants logiciels.
7. tests/rps02-cervical-corpus-fixture.test.js — contrôle du corpus.
8. docs/RPS-02-TRACEABILITY.md — traçabilité.
9. docs/RPS-02-CERVICAL-AI-01.md — spécification de l'assistance visuelle.
10. docs/RPS-02-CERVICAL-AI-DATASET.md — gouvernance du corpus photographique.
11. docs/RPS-02-CERVICAL-AI-VALIDATION.md — plan expérimental.
12. schemas/rps02-cervical-ai-observation.schema.json — schéma machine-readable.

## Gate G0 — logiciel
Le moteur doit :
- conserver les données originales ;
- ne pas produire Peak ;
- ne pas produire Peak+3 ;
- signaler interpretationBlocked=true ;
- rester déterministe ;
- ne pas transformer contexte, quantité ou traduction en conclusion méthodologique.

## Gate G1 — méthode
Avant activation :
- référentiel cervical figé ;
- définitions approuvées ;
- vocabulaire multilingue validé ;
- cas particuliers définis ;
- règles Peak/Peak+3 documentées ;
- séparation entre source externe et adaptation SymRella.

## Gate G2 — validation humaine
Deux évaluateurs qualifiés annotent indépendamment le corpus. Les annotations originales sont conservées. Les désaccords sont classés puis soumis à adjudication. L'adjudication produit une version signée du gold set.

Pour l'IA, la même exigence s'applique au corpus photographique : aucune image ne devient une vérité de référence par simple consensus logiciel.

## Gate G3 — reproductibilité
Le corpus validé doit être versionné. Toute modification du référentiel ou de l'ontologie entraîne une nouvelle version du corpus et une nouvelle campagne de validation.

Pour le modèle visuel, les splits sont obligatoirement réalisés par participante et le test final doit être verrouillé.

## Gate G4 — données et droits
Avant toute utilisation d'images :
- provenance documentée ;
- consentement ou licence compatible avec l'usage prévu ;
- statut commercial explicite si le modèle est destiné à un produit commercial ;
- procédure de retrait ;
- contrôle des dérivés et augmentations.

Une image publique sur Internet n'est pas automatiquement réutilisable commercialement.

## Gate G5 — produit
Les textes utilisateur sont revus pour éviter toute conclusion diagnostique ou contraceptive non autorisée par le référentiel validé.

L'assistance visuelle doit rester descriptive tant que la validation méthodologique n'autorise pas une interprétation.

## Règle de déblocage
Aucun code ne doit passer du niveau descriptif au niveau interprétatif cervical sur la seule base des tests logiciels.

Pour l'assistance visuelle, une mise en production exige simultanément :
G0 + G1 + G2 + G3 + G4 + G5,
ainsi que les gates spécifiques du document RPS-02-CERVICAL-AI-01.

## Statut actuel
- G0 : implémentation et vérification CI en cours.
- G1 : proposition non validée.
- G2 : validation humaine non réalisée.
- G3 : infrastructure documentaire prête, validation non réalisée.
- G4 : gouvernance documentaire ajoutée ; droits des images à établir avant collecte.
- G5 : garde-fous présents, revue finale à réaliser.

**Conclusion opérationnelle : le moteur cervical et toute IA cervicale restent bloqués.**