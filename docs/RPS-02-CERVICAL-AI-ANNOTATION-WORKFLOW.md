# RPS-02 — Workflow opérationnel d'annotation cervicale

Version 0.1 — recherche uniquement

## 1. Chaîne de traitement

`capture → contrôle qualité → observation participante → annotation A → annotation B → comparaison → adjudication → gel de version`

Aucune étape ne doit écraser silencieusement l'étape précédente.

## 2. Capture
Chaque observation reçoit un identifiant aléatoire/pseudonyme.

Les métadonnées nécessaires à l'étude sont séparées des données directement identifiantes.

La capture doit permettre, lorsque pertinent :
- observation suffisamment visible ;
- éclairage documenté ;
- appareil documenté sous forme de classe ;
- absence d'informations personnelles visibles dans l'image.

## 3. Contrôle qualité
Statuts :
- `sufficient`
- `insufficient`
- `uncertain`

Une image insuffisante n'est pas transformée en exemple positif par recadrage ou amélioration artificielle.

Le motif du refus est enregistré.

## 4. Annotation A et B
Deux évaluateurs qualifiés utilisent exactement la même version du manuel.

Ils annotent indépendamment :
- transparence ;
- aspect chromatique ;
- texture ;
- extensibilité ;
- longueur d'étirement ;
- surface ;
- incertitude.

L'annotation de la participante est conservée séparément.

## 5. Comparaison
Le système calcule les différences dimension par dimension.

Un désaccord n'est pas automatiquement une erreur d'un évaluateur.

Les cas suivants sont distingués :
- accord ;
- désaccord résoluble ;
- ambiguïté intrinsèque ;
- image insuffisante ;
- ontologie insuffisante.

## 6. Adjudication
L'adjudicateur reçoit :
- image ;
- contexte d'observation autorisé par le protocole ;
- annotation A ;
- annotation B ;
- justification du désaccord.

Il produit une décision finale séparée.

Les annotations originales restent immuables.

## 7. Gel du corpus
Une observation est `locked` seulement si :
- ses métadonnées sont valides ;
- son statut de qualité est renseigné ;
- les deux annotations existent ;
- les désaccords sont documentés ;
- l'adjudication est terminée lorsque requise ;
- la version de l'ontologie est enregistrée.

Le corpus verrouillé est immuable par convention de recherche. Toute correction produit une nouvelle version.

## 8. Prévention de fuite de données
La séparation train/validation/test se fait par participante.

Interdictions :
- même participante dans deux splits ;
- dérivé d'une image de test dans train ;
- augmentation avant séparation ;
- réglage d'un seuil avec le test ;
- sélection manuelle d'exemples de test après consultation des résultats.

## 9. Sortie autorisée
Le workflow peut produire une caractérisation descriptive ou `indeterminate`.

Il ne peut pas transformer une annotation visuelle en :
- statut fertile/infertile ;
- ovulation ;
- Peak/Peak+3 ;
- conseil contraceptif ;
- diagnostic.
