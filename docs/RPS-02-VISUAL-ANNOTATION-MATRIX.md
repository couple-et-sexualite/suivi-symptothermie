# RPS-02 — Matrice d’annotation visuelle v0.1

## Objet

Cette matrice définit ce qu'une image peut documenter pédagogiquement dans SymRella et ce qu'elle ne doit jamais permettre d'inférer.

Elle complète `RPS-02-CERVICAL.md` sans remplacer la validation experte du référentiel.

## 1. Dimensions observables

| Dimension | Valeurs contrôlées | Visible sur image | Déductible sans image | Règle |
|---|---|---:|---:|---|
| sensation | dry, not_dry, moist, slippery, unknown | non | oui, si déclarée | jamais inférée d'une photo |
| présence | none, present, unknown | partiellement | oui | ne pas confondre « rien visible » et absence biologique |
| couleur apparente | clear/translucent, white/cloudy, yellowish, greenish, brownish, mixed, other, unknown | oui, sous réserve lumière | non | couleur apparente uniquement |
| texture apparente | sticky, creamy, watery, gummy, lumpy, other, unknown | partiellement | non | terme descriptif, pas conclusion clinique |
| filance apparente | none, short, moderate, long, not_assessable | parfois | non | longueur exacte non garantie par photo |
| transparence | opaque, translucent, clear, mixed, unknown | oui, sous réserve lumière | non | ne pas confondre transparence et « fertile » |
| quantité apparente | none, small, moderate, large, not_assessable | très limitée | non | jamais utilisée seule |
| support | tissue, finger, external_surface, unknown | oui | non | contexte de capture obligatoire |
| éclairage | good, acceptable, poor, unknown | oui | non | conditionne la lecture |
| qualité photo | sufficient, insufficient, uncertain | oui | non | image insuffisante = non utilisable pédagogiquement |

## 2. Dimensions non observables par photographie

Une photographie ne doit jamais attribuer :
- sensation sèche/humide/glissante ;
- ressenti au wiping ;
- sensation individuelle de la journée ;
- évolution temporelle ;
- Peak ;
- fertilité ;
- ovulation ;
- diagnostic d'infection ;
- effet hormonal ;
- cause d'une sécrétion.

Ces éléments peuvent être affichés comme informations associées à un cas seulement lorsqu'ils ont été déclarés indépendamment et que leur source est connue.

## 3. Vocabulaire pédagogique

SymRella doit préférer :
- « aspect transparent/translucide »
- « aspect blanchâtre/opaque »
- « aspect fluide »
- « aspect crémeux »
- « aspect collant »
- « aspect filant »
- « couleur apparente »
- « caractéristique difficile à évaluer »

Éviter de présenter comme synonymes :
- transparent = fertile ;
- blanc d'œuf = ovulation ;
- abondant = fertile ;
- jaune = infection ;
- glissant = ovulation.

Ces équivalences peuvent appartenir à certaines méthodes ou être utilisées dans certains contextes, mais elles ne sont pas des règles RPS-02 tant qu'elles ne sont pas validées.

## 4. Annotation à deux niveaux

### Niveau A — annotation visuelle

L'annotateur décrit uniquement ce qu'il voit.

Exemple :

```
visibleColor: clear
transparency: translucent
texture: watery
stretchiness: moderate
qualityStatus: sufficient
```

### Niveau B — correspondance méthodologique

Une deuxième annotation peut indiquer :

```
referenceSystem: InVivo
referenceLabel: <terme exact de la méthode>
rps02Mapping: pending_expert
```

Une annotation InVivo ne devient jamais automatiquement une annotation RPS-02.

## 5. Accord inter-évaluateurs

Deux évaluateurs indépendants annotent les images sans voir l'annotation de l'autre.

Pour chaque dimension :
- accord ;
- désaccord ;
- non-assessable.

Les désaccords sont conservés.

L'adjudication est enregistrée séparément et ne doit pas effacer les annotations originales.

## 6. Classes d'utilisation

### pédagogique primaire

Image suffisamment claire pour montrer une caractéristique précise.

### comparaison

Image utile pour comparer deux caractéristiques proches.

### ambiguë

Image utile pour apprendre que certaines observations sont difficiles à classer.

### contexte particulier

Image associée à un contexte documenté, sans en déduire une cause.

### non utilisable

Image floue, insuffisamment éclairée, ambiguë au-delà de l'objectif ou dont les droits ne sont pas établis.

## 7. Cas pédagogiques prioritaires

Le premier corpus pédagogique doit couvrir les contrastes suivants :

1. absence visible vs présence visible ;
2. opaque/blanchâtre vs translucide/clair ;
3. fluide vs crémeux ;
4. collant vs filant ;
5. filance courte vs plus importante ;
6. observation simple vs observation mixte ;
7. image claire vs image difficile à interpréter ;
8. support différent ;
9. éclairage différent ;
10. cas ambigu.

Il ne faut pas chercher immédiatement à couvrir toutes les variantes biologiques.

## 8. Cas volontairement trompeurs

Le corpus doit comporter des paires montrant pourquoi l'image seule est insuffisante :

- même apparence, sensations différentes ;
- même sensation déclarée, apparences différentes ;
- photo claire mais contexte inconnu ;
- photo montrant une couleur mais lumière non standardisée ;
- sécrétion mélangée ;
- image qui semble correspondre à plusieurs descriptions.

L'objectif est d'apprendre à l'utilisatrice à ne pas surinterpréter la photographie.

## 9. Exigences photographiques

Pour une image candidate :
- aucune donnée EXIF inutile ;
- aucun visage ;
- aucun élément permettant d'identifier une personne ;
- support identifiable si pertinent ;
- éclairage décrit ;
- cadrage suffisamment proche ;
- absence de texte incrusté ;
- pas de retouche de couleur ;
- aucune IA générative présentée comme photographie réelle ;
- conservation de l'original hors application si nécessaire pour audit.

Les recadrages pédagogiques doivent être enregistrés comme dérivés de l'original.

## 10. Provenance

Chaque image doit comporter :

```
imageId
sourceType
sourceName
sourceUrl
creator
license
licenseUrl
commercialUse
modificationAllowed
attribution
accessDate
originalHash
derivedHash
referenceSystem
referenceLabel
```

SourceType :
- licensed_external
- user_contributed
- commissioned
- original_symrella
- synthetic_training_only

Une image `synthetic_training_only` ne peut pas être présentée comme une observation humaine réelle.

## 11. Règle spéciale pour les images externes

La galerie Justisse indique que ses images sont sous CC BY-SA, autorisent l'usage commercial sous cette licence, et qu'elles représentent les notations de la méthode Justisse. Elle avertit explicitement de ne pas mélanger ses notations avec celles d'autres méthodes. Cette source peut donc être utilisée comme source de référence ou potentiellement sous licence, mais le mapping RPS-02 doit rester indépendant. citeturn0search0turn0search1

L'étude InVivo décrit également un dictionnaire pictural utilisé pour comparer les sécrétions propres des participantes à des exemples standardisés, avec supervision d'instructeurs. Elle montre l'intérêt pédagogique d'une comparaison visuelle, mais son système comporte ses propres catégories et zones ; elles ne doivent pas être copiées comme ontologie RPS-02. citeturn0search3turn0search4

## 12. Consentement des photos utilisatrices

Une contribution doit enregistrer séparément :

```
consentImageTransmission
consentPedagogicalReview
consentPedagogicalReuse
consentResearchReuse
consentWithdrawal
consentVersion
consentTimestamp
```

Les quatre premiers consentements doivent pouvoir être refusés indépendamment.

## 13. Retrait

Si un consentement est retiré :
- l'image est immédiatement retirée du catalogue actif ;
- son statut passe à `withdrawn` ;
- elle n'est plus utilisée dans une nouvelle expérience pédagogique ;
- le registre d'audit conserve uniquement les métadonnées nécessaires à la traçabilité, selon la politique de conservation applicable.

## 14. Critère de publication

Une image ne peut apparaître dans l'application que si :

```
rightsStatus === "documented"
AND qualityStatus === "sufficient"
AND pedagogicalStatus === "validated"
AND consentStatus !== "withdrawn"
AND referenceSystem est renseigné si l'image vient d'une méthode externe
```

Pour une image utilisateur :
```
consentPedagogicalReuse === true
```

Pour une image dont le mapping RPS-02 n'est pas validé :
```
rps02Mapping === "pending_expert"
```
et elle ne peut être utilisée que dans une expérience explicitement étiquetée « exemple non validé », jamais comme réponse normative.

## 15. Règle d'interface

Le bouton de comparaison doit proposer :

- « Cela ressemble à cet exemple »
- « Cela ne ressemble pas »
- « Je ne sais toujours pas »

Il ne doit jamais afficher :
- « bonne réponse » ;
- « mauvaise réponse » ;
- « vous êtes fertile » ;
- « vous ovulez » ;
- « c'est votre glaire fertile ».

## 16. Objectif pédagogique mesurable

Le système peut mesurer :
- nombre de caractéristiques identifiées ;
- stabilité de la description ;
- capacité à distinguer deux exemples ;
- recours à « je ne sais pas » ;
- progression entre observations.

Il ne doit pas transformer ces données en :
- score médical ;
- score de fertilité ;
- probabilité d'ovulation.

## 17. Gate

Une image devient « validée » uniquement après :
1. droits vérifiés ;
2. qualité vérifiée ;
3. annotation visuelle ;
4. revue pédagogique ;
5. revue méthodologique ;
6. validation RPS-02 ou maintien explicite en pending ;
7. test d'affichage ;
8. test de confidentialité.

