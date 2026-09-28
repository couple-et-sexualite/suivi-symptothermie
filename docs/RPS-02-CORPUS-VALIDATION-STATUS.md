# RPS-02 — État de validation du corpus pilote

Date de contrôle : 2026-09-28

## Résultat technique du registre

Le registre `data/rps02-visual-corpus.json` contient 9 références photographiques réelles.

Les 9 enregistrements sont maintenant cohérents avec le schéma `schemas/rps02-visual-image-record.schema.json` pour les champs de statut :
- `rightsStatus: documented`
- `qualityStatus: uncertain`
- `rps02Mapping: pending_expert`
- `mappedFeatures` présent avec toutes les dimensions à `unknown`

Aucune annotation visuelle n'a été inventée pour faire passer une image en validation. Les caractéristiques restent volontairement inconnues jusqu'à une annotation indépendante.

## Provenance

- 8 références : Justisse College Cervical Mucus Gallery, licence CC BY-SA.
- 1 référence : Wikimedia Commons, Ipertornado, CC BY-SA 4.0.

La galerie Justisse précise que ses images sont sous CC BY-SA, avec attribution, et rappelle que ses notations appartiennent à la méthode Justisse et ne doivent pas être combinées avec d'autres méthodes. Elle indique aussi que les photographies ne sont pas toujours faciles à interpréter. (source : https://mucus.justisse.ca/finger-testable-observations ; https://mucus.justisse.ca/)

La page Wikimedia de `Presumed cervical mucus.jpg` indique une licence CC BY-SA 4.0 et précise que le mucus représenté n'a pas été évalué médicalement. (source : https://commons.wikimedia.org/wiki/File:Presumed_cervical_mucus.jpg)

## Ce qui reste ouvert

### 1. Miroir local
Les 9 assets sont encore référencés depuis leurs hébergeurs d'origine. Ils ne sont pas encore des fichiers locaux versionnés dans le dépôt.

À réaliser avant publication commerciale :
- téléchargement contrôlé ;
- vérification MIME ;
- vérification dimensions ;
- SHA-256 de l'original ;
- éventuel recadrage dérivé avec hash distinct ;
- conservation de l'attribution ;
- test d'affichage local.

### 2. Annotation indépendante
Deux annotateurs doivent décrire séparément les caractéristiques observables sans voir l'annotation de l'autre. Les désaccords doivent être conservés et l'adjudication enregistrée séparément.

### 3. Revue pédagogique
Vérifier que chaque image sert un objectif précis : contraste, comparaison, ambiguïté ou apprentissage de la limite de l'image.

### 4. Revue méthodologique
Le mapping RPS-02 doit rester `pending_expert` jusqu'à revue méthodologique indépendante.

### 5. Sécurité et confidentialité
Vérifier que les images utilisateur restent locales tant qu'aucun consentement explicite de transmission/réutilisation n'est donné, et qu'aucune donnée EXIF inutile n'est conservée.

## Gate de publication

Une image ne doit pas être considérée comme validée uniquement parce que sa licence est documentée ou parce que la photo est visuellement plausible.

Gate cible :

`rightsStatus = documented`
AND `qualityStatus = sufficient`
AND `pedagogicalStatus = validated`
AND `rps02Mapping = validated` ou statut explicitement autorisé par la revue méthodologique
AND tests d'affichage/confidentialité réussis.

Le corpus actuel est donc **techniquement structuré mais pas encore pédagogiquement ou méthodologiquement validé**.

## Étape suivante — annotation aveugle lancée

Le gate technique CI étant vert, le dépôt contient maintenant :

- `docs/RPS-02-BLIND-ANNOTATION-PROTOCOL.md` : protocole d’annotation indépendante ;
- `schemas/rps02-blind-annotation.schema.json` : structure contrôlée des annotations ;
- `data/rps02-blind-annotation-template.json` : 9 identifiants aveugles, sans annotation préremplie ;
- `docs/RPS-02-ADJUDICATION-PROTOCOL.md` : conservation des désaccords et procédure d’arbitrage.

Les annotateurs ne doivent pas recevoir les labels de la méthode source ni un mapping RPS-02 attendu. Les deux tours sont indépendants. L’adjudication intervient seulement après conservation des deux annotations.

### Statut au 28 septembre 2026

| Gate | État |
|---|---|
| registre / schéma | **vert** |
| CI technique | **vert** |
| annotation indépendante | **à réaliser** |
| analyse des désaccords | **à réaliser** |
| adjudication | **à réaliser** |
| revue pédagogique | **à réaliser** |
| revue méthodologique RPS-02 | **à réaliser** |
| miroir local des assets | **ouvert** |
| sécurité/confidentialité des photos utilisatrices | **à vérifier** |

Le passage du CI vert n’autorise donc pas encore l’affichage commercial des 9 photographies comme exemples validés.
