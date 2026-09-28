# RPS-02 — Protocole de sélection et validation des images v0.1

## Objectif

Créer un corpus pédagogique juridiquement exploitable, méthodologiquement traçable et adapté à l'apprentissage progressif.

## Étape 1 — Recherche

Pour chaque image candidate, enregistrer immédiatement :
- URL exacte ;
- nom de la source ;
- auteur ;
- licence ;
- autorisation commerciale ;
- autorisation de modification ;
- date de consultation ;
- méthode d'origine ;
- description d'origine.

Une image sans provenance vérifiable est rejetée.

## Étape 2 — Filtre juridique

Rejeter :
- captures Google Images sans licence ;
- images Pinterest sans licence primaire ;
- publications sociales sans autorisation ;
- images dont l'auteur ou la licence ne peut être établi ;
- images dont la licence interdit l'usage commercial si SymRella est commercial ;
- images dont les conditions de modification ne permettent pas le recadrage nécessaire.

## Étape 3 — Filtre pédagogique

L'image doit avoir un objectif précis :
- montrer une caractéristique ;
- comparer deux caractéristiques ;
- montrer une ambiguïté ;
- montrer une limite de la photographie.

Une image spectaculaire mais pédagogiquement redondante est inutile.

## Étape 4 — Annotation indépendante

Deux évaluateurs décrivent séparément :
- présence ;
- couleur apparente ;
- transparence ;
- texture ;
- filance apparente ;
- quantité apparente ;
- qualité ;
- incertitude.

Ils ne doivent pas utiliser le terme « fertile » comme annotation visuelle.

## Étape 5 — Revue méthodologique

Comparer les annotations aux définitions RPS-02 et, lorsque pertinent, à la terminologie de la méthode d'origine.

Ne jamais convertir automatiquement :
- InVivo → RPS-02 ;
- Justisse → RPS-02 ;
- Sensiplan → RPS-02.

Le mapping doit être explicitement décidé.

## Étape 6 — Validation

Statut :
- candidate ;
- rights_verified ;
- pedagogical_review ;
- expert_review ;
- validated.

Tout doute maintient l'image hors du corpus commercial principal.

## Étape 7 — Intégration

Une image validée reçoit :
- imageId stable ;
- hash ;
- miniature ;
- métadonnées ;
- attribution si nécessaire ;
- mapping RPS-02 ;
- test de chargement.

## Étape 8 — Audit périodique

Revoir :
- disponibilité de la source ;
- licence ;
- consentement ;
- intégrité du fichier ;
- adéquation pédagogique ;
- cohérence avec la version RPS-02.

## Corpus initial recommandé

Ne pas chercher un grand nombre d'images.

Constituer d'abord des paires pédagogiques :
1. opaque vs translucide ;
2. fluide vs crémeux ;
3. collant vs filant ;
4. absence visible vs présence visible ;
5. simple vs mixte ;
6. bonne vs mauvaise qualité d'image ;
7. cas clairement observable vs cas ambigu.

Une seule image peut servir plusieurs exercices si son usage est clairement documenté.

## Source Justisse

La Cervical Mucus Gallery de Justisse indique que ses images sont sous CC BY-SA, avec usage commercial autorisé sous les conditions de la licence et obligation d'attribution ; elle précise également que les notations sont celles de la méthode Justisse. Elle constitue donc une source potentielle à étudier, mais pas une source de catégories RPS-02. citeturn0search0turn0search1

## Source InVivo

L'étude InVivo décrit l'utilisation d'un dictionnaire pictural pour comparer les sécrétions observées par les participantes à des exemples standardisés, avec formation et supervision. Elle montre un intérêt pédagogique de la standardisation visuelle, mais ses catégories et son protocole restent ceux d'InVivo. citeturn0search3turn0search5

## Interdiction

Aucune image de l'étude scientifique ne doit être copiée dans le produit simplement parce qu'elle est visible dans un article. L'accès à l'article et les droits de reproduction sont deux questions distinctes.
