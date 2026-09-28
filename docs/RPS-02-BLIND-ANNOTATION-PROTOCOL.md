# RPS-02 — Protocole d’annotation visuelle en aveugle v1.0

## Objet

Ce protocole lance la validation visuelle réelle du corpus pilote RPS-02 après le passage du gate technique CI.

Il sépare strictement :

1. **ce qui est observable sur l’image** ;
2. **ce qui est déclaré indépendamment par une personne** ;
3. **la terminologie de la source** ;
4. **la correspondance éventuelle avec RPS-02**.

Les annotateurs ne doivent jamais déduire une catégorie RPS-02 à partir d’une notation Justisse, d’un nom de fichier, d’une URL ou d’une annotation antérieure.

La galerie Justisse indique elle-même que ses photographies peuvent être difficiles à interpréter et que ses notations appartiennent à sa propre méthode. Elle déconseille de les mélanger avec d’autres méthodes. citeturn0search0turn0search1

## 1. Gate d’entrée

Le protocole ne commence que si :

- le registre contient les références attendues ;
- le schéma est valide ;
- `mappedFeatures` est présent ;
- les caractéristiques restent `unknown` avant annotation ;
- le CI technique est vert ;
- aucune annotation RPS-02 n’a été préremplie.

Au 28 septembre 2026, ces conditions techniques sont remplies pour le corpus pilote de 9 références.

Cela ne constitue pas une validation pédagogique ou méthodologique.

## 2. Aveuglement

Chaque image reçoit un identifiant neutre :

`RPS02-A01` à `RPS02-A09`.

L’annotateur ne reçoit pas :

- le `imageId` source ;
- la notation Justisse ;
- le mapping RPS-02 ;
- l’annotation d’un autre évaluateur ;
- une réponse attendue ;
- une explication indiquant ce que l’image « devrait » montrer.

Le registre de correspondance entre identifiant aveugle et provenance reste séparé du formulaire d’annotation.

### Règle importante

L’annotateur doit ignorer toute information visible dans l’URL, le nom de fichier ou la page source qui pourrait révéler une étiquette. Si une telle information est impossible à masquer, elle est signalée dans `technicalIssues` et l’image peut être retirée de la comparaison aveugle.

## 3. Deux tours indépendants

Chaque image est annotée séparément par au moins deux évaluateurs.

### Tour A

L’évaluateur A décrit chaque image sans consulter B.

### Tour B

L’évaluateur B recommence indépendamment, sans consulter A.

Les deux formulaires sont conservés même s’ils sont identiques.

Aucun consensus n’est recherché pendant les tours A et B.

## 4. Ce qui doit être décrit

Pour chaque image, renseigner uniquement les caractéristiques contrôlées :

| Dimension | Valeurs |
|---|---|
| présence visible | none / present / unknown / not_assessable |
| couleur apparente | clear_translucent / white_cloudy / yellowish / greenish / brownish / mixed / other / unknown |
| texture apparente | sticky / creamy / watery / gummy / lumpy / other / unknown / not_assessable |
| filance apparente | none / short / moderate / long / unknown / not_assessable |
| transparence | opaque / translucent / clear / mixed / unknown / not_assessable |
| quantité apparente | none / small / moderate / large / unknown / not_assessable |
| support | tissue / finger / external_surface / unknown |
| éclairage | good / acceptable / poor / unknown |
| qualité pédagogique de l’image | sufficient / insufficient / uncertain |

### Sensation

La sensation n’est jamais annotée à partir de la photo.

Ne pas renseigner « humide », « glissant », « lubrificatif » ou équivalent comme résultat visuel.

Une sensation ne peut être enregistrée que comme donnée déclarée indépendamment.

## 5. Règle de prudence

Si une caractéristique n’est pas clairement évaluable :

- utiliser `unknown` ou `not_assessable` ;
- ne pas choisir la valeur qui semble la plus probable ;
- expliquer brièvement la limite si elle est utile.

L’absence de matière clairement visible ne signifie pas automatiquement « absence biologique ».

Une photo ne permet pas d'établir :

- fertilité ;
- ovulation ;
- Peak ;
- cause d’une sécrétion ;
- infection ;
- statut hormonal ;
- évolution temporelle.

## 6. Description libre

Le champ libre doit rester descriptif.

### Acceptable

> « Aspect translucide, avec une zone blanchâtre ; la filance est difficile à évaluer sur cette prise de vue. »

### À éviter

> « Glaire fertile. »

> « Ovulation imminente. »

> « Infection. »

> « C’est du type 10K. »

La terminologie de la source est une information de provenance, pas une observation RPS-02.

## 7. Détection des cas difficiles

L’annotateur doit pouvoir signaler :

- image trop sombre ;
- contraste insuffisant ;
- mise au point insuffisante ;
- matière mélangée ;
- support gênant la lecture ;
- filance non observable ;
- couleur dépendante de l’éclairage ;
- cadrage insuffisant ;
- image potentiellement retouchée ;
- URL ou métadonnée révélant une information d’étiquette ;
- autre problème technique.

Un cas difficile n’est pas un échec de l’annotateur.

## 8. Aucun seuil arbitraire

Ce protocole ne fixe pas de seuil numérique de « bon accord » sans décision méthodologique explicite.

Après les deux tours, on calculera au minimum :

- accord exact par dimension ;
- désaccord par dimension ;
- cas non-assessables ;
- commentaires récurrents ;
- images présentant des difficultés systématiques.

Un statisticien ou méthodologue pourra ensuite choisir, si nécessaire, une mesure d’accord adaptée aux variables retenues.

Des travaux sur l’évaluation d’images cervicales montrent que l’interprétation d’images statiques peut présenter une variabilité importante ; cela justifie la conservation des annotations indépendantes et des limites plutôt qu’une réponse forcée. citeturn0search8turn0search9

## 9. Adjudication

L’adjudication intervient **après** les deux annotations indépendantes.

Elle ne remplace jamais les données originales.

Pour chaque désaccord important :

1. afficher les deux annotations ;
2. identifier la dimension en désaccord ;
3. examiner uniquement l’image et les règles du protocole ;
4. décider si une catégorie est réellement observable ;
5. sinon conserver `unknown` ou `not_assessable` ;
6. documenter la justification ;
7. enregistrer séparément la décision d’adjudication.

L’adjudication ne doit pas servir à fabriquer une apparence de consensus.

## 10. Mapping RPS-02

Le mapping RPS-02 est une étape distincte.

Il ne peut commencer qu’après la conservation des deux annotations indépendantes.

Pour chaque image, la revue méthodologique doit pouvoir conclure :

- mapping validé ;
- mapping non applicable ;
- mapping rejeté ;
- mapping toujours en attente.

Une notation Justisse comme `10K`, `8CK` ou `10CKG` ne constitue jamais, à elle seule, un mapping RPS-02.

## 11. Critères d’exclusion

Une image doit être exclue de la validation visuelle si :

- son intégrité ne peut pas être suffisamment établie ;
- son contenu est techniquement illisible ;
- une information de provenance révèle directement la réponse attendue et ne peut pas être masquée ;
- son usage pédagogique est incompatible avec les droits documentés ;
- elle ne permet aucune observation utile pour l’objectif défini.

L’exclusion est documentée ; elle n’est pas transformée en annotation « unknown » silencieuse.

## 12. Photos des utilisatrices

Les photos personnelles restent locales par défaut.

Une photo ne rejoint jamais ce protocole parce qu’elle a été prise dans l’application.

Pour une contribution volontaire, les consentements sont séparés :

- transmission ;
- revue pédagogique ;
- réutilisation pédagogique ;
- recherche éventuelle ;
- retrait.

Une photo dont le consentement applicable est retiré est retirée du catalogue actif.

## 13. Sorties attendues

À la fin du tour indépendant :

- 9 × annotation A ;
- 9 × annotation B ;
- registre des difficultés techniques ;
- tableau des désaccords ;
- aucune décision RPS-02 automatique.

À la fin de l’adjudication :

- décisions d’adjudication séparées ;
- justification de chaque décision ;
- statut de mapping RPS-02 par image ;
- décision sur l’utilisation pédagogique éventuelle.

## 14. Gate suivant

Le corpus ne peut passer au gate « validation pédagogique » que si :

- les annotations A et B sont complètes ou explicitement marquées non-assessables ;
- les désaccords sont conservés ;
- les exclusions sont documentées ;
- l’adjudication est séparée ;
- aucune catégorie RPS-02 n’a été fabriquée à partir de la notation source ;
- la revue pédagogique a été effectuée ;
- la revue méthodologique reste explicitement séparée.

## 15. Principe directeur

Le but n’est pas de démontrer qu’une photographie permet à SymRella de « reconnaître la glaire ».

Le but est de vérifier si une image peut soutenir un apprentissage prudent de l’observation :

**voir → décrire → comparer → reconnaître une limite → revenir à son observation réelle.**
