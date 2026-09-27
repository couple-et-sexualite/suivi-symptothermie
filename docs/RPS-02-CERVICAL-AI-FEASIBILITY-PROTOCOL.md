# RPS-02 — Protocole de faisabilité de l'assistance visuelle cervicale
Version 0.1 — document de recherche, non destiné à l'activation en production

## 1. Objectif
Déterminer si une photographie standardisée, seule ou combinée à une observation structurée, apporte une information descriptive reproductible sur l'aspect des sécrétions cervicales.

L'étude ne cherche pas à diagnostiquer une maladie, à confirmer une ovulation, ni à déterminer un statut fertile/infertile.

Une publication de 2024 décrit une approche où les participantes évaluent sensation, aspect, consistance et extensibilité, prennent une photographie en bonne lumière et la comparent à un dictionnaire pictographique. Cette expérience constitue un précédent méthodologique, pas une validation d'une IA SymRella. 

## 2. Questions expérimentales
Q1. Les caractéristiques visuelles retenues sont-elles suffisamment compréhensibles et reproductibles ?
Q2. Une photographie permet-elle de caractériser ces propriétés avec un accord acceptable entre évaluateurs ?
Q3. L'auto-observation structurée apporte-t-elle une information complémentaire à la photographie ?
Q4. Les erreurs varient-elles selon l'appareil, l'éclairage ou la qualité de l'image ?

## 3. Unité d'analyse
L'unité primaire est l'observation d'une participante à une occasion donnée.

Toutes les observations et images provenant d'une même participante restent dans le même groupe de données.

## 4. Variables descriptives
Les évaluateurs travaillent sur des propriétés observables :
- transparence/opacité ;
- aspect de couleur ;
- texture apparente ;
- extensibilité visible ;
- longueur d'étirement lorsqu'elle est mesurable ;
- caractère mixte ;
- qualité de l'image.

La sensation corporelle est renseignée séparément par la participante et ne doit jamais être déduite de la photographie.

## 5. Trois sources séparées
A. Auto-observation structurée.
B. Observation photographique indépendante.
C. Adjudication humaine lorsque A et B ou deux évaluateurs divergent.

Aucune source ne doit être modifiée silencieusement pour faire correspondre les autres.

## 6. Annotation indépendante
Deux évaluateurs qualifiés annotent indépendamment les mêmes observations selon la même version de l'ontologie.

Ils ne doivent pas voir l'annotation de l'autre avant la fin de leur propre annotation.

Les désaccords sont conservés comme données et ne sont pas supprimés.

## 7. Adjudication
Lorsqu'un désaccord existe :
1. conserver les deux annotations originales ;
2. documenter la caractéristique en désaccord ;
3. documenter la justification de l'adjudication ;
4. enregistrer la décision finale dans un champ distinct ;
5. ne jamais remplacer rétroactivement les annotations originales.

## 8. Contrôle qualité des photographies
Chaque image reçoit un statut :
- sufficient ;
- insufficient ;
- uncertain.

Motifs possibles d'insuffisance :
- flou ;
- exposition inadéquate ;
- observation non visible ;
- cadrage inadéquat ;
- quantité insuffisante pour caractériser la propriété ;
- ambiguïté excessive.

Une image insuffisante ne doit pas produire une caractérisation forcée.

## 9. Séparation des données
La séparation train/validation/test est faite par participante avant tout entraînement.

Les images, recadrages, augmentations et observations dérivées d'une participante restent dans son groupe.

Aucune information issue du test verrouillé ne doit servir à modifier le modèle ou les seuils.

## 10. Baselines
Avant tout modèle complexe :
1. règles descriptives à partir du questionnaire ;
2. modèle image seule ;
3. modèle image + observation structurée.

L'objectif est de mesurer la valeur ajoutée réelle de l'image.

## 11. Critères de mesure
Rapporter séparément :
- accord inter-évaluateurs ;
- précision par caractéristique ;
- rappel par caractéristique ;
- F1 lorsque pertinent ;
- matrice de confusion ;
- calibration ;
- taux de sortie « incertain/insuffisant » ;
- performance selon appareil et conditions lumineuses.

Les effectifs et intervalles d'incertitude doivent accompagner les estimations.

## 12. Analyse des erreurs
Chaque erreur importante est classée selon une cause probable :
- qualité photographique ;
- caractéristiques réellement mixtes ;
- ambiguïté de l'ontologie ;
- désaccord humain ;
- problème de généralisation ;
- autre.

Les cas difficiles ne doivent pas être retirés uniquement parce qu'ils dégradent les résultats.

## 13. Décisions de fin de phase
CONTINUER : reproductibilité suffisante et corpus exploitable.

MODIFIER : certaines catégories ou le protocole sont trop ambigus ; révision puis nouvelle phase.

ARRÊTER : la photographie n'apporte pas une information suffisamment reproductible.

## 14. Règle produit
Même après expérimentation, le système doit pouvoir retourner « observation insuffisante ou ambiguë ».

Aucune sortie « fertile », « infertile », « ovulation », « Peak », « Peak+3 », « sûr » ou « dangereux » ne doit être produite par cette assistance tant que les référentiels et validations correspondants ne sont pas indépendamment validés.
