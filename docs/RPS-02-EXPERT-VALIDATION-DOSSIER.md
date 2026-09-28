# RPS-02 — Dossier de validation experte v1.0

## Objet
Ce dossier prépare la revue humaine du moteur pédagogique RPS-02 de SymRella. Il ne constitue pas une validation clinique ou méthodologique en lui-même.

SymRella doit rester descriptif tant que les règles cervicales et leur correspondance avec le référentiel choisi n'ont pas été validées par des personnes qualifiées.

## 1. Références à examiner
- AWMF S2k 015-095 — guideline sur la contraception non hormonale.
- Référentiel et documents officiels Sensiplan.
- Documentation interne SymRella, explicitement séparée des règles de la méthode de référence.

L'AWMF décrit notamment, pour l'évaluation thermique, six valeurs basses de référence et trois valeurs plus hautes, avec le critère de hausse de 0,2 °C et des règles d'exception. Cette formulation doit être vérifiée ligne par ligne par l'expert avant toute revendication de conformité. 

Sensiplan décrit officiellement une méthode symptothermale combinant température et observation de la glaire cervicale ou du col, avec une double vérification.

## 2. Règles thermiques à valider

| ID | Question experte | Code | Tests | Décision |
|---|---|---|---|---|
| R01 | La sélection des six valeurs de référence correspond-elle exactement au référentiel ? | thermal.sixReferenceValues | T03,T06,T08 | pending |
| R02 | Le critère des trois valeurs hautes est-il correctement traduit ? | thermal.threeHigherValues | T06 | pending |
| R03 | Le seuil de +0,20 °C est-il correctement appliqué ? | thermal.plusTwoTenths | T06,T07 | pending |
| R04 | L'exception de quatrième valeur est-elle correctement implémentée ? | thermal.exceptionFourthValue | T05 | pending |
| R05 | L'exception d'une valeur basse ignorée est-elle correctement implémentée ? | thermal.exceptionIgnoredLow | T31 | pending |

L'expert doit fournir une référence précise (document, section/page) pour toute correction.

## 3. Règles cervicales à valider

Les règles R06–R08 restent bloquées.

| ID | Question experte | Code | Décision |
|---|---|---|---|
| R06 | Quelle définition opérationnelle du Peak doit SymRella utiliser ? | cervical.peak | pending_expert |
| R07 | Quelles conditions exactes permettent Peak+3 ? | cervical.peakPlusThree | pending_expert |
| R08 | Comment la double vérification doit-elle combiner les deux critères ? | doubleCheck.laterCriterion | pending_expert |

Aucune catégorie visuelle issue d'une photo ne doit être convertie automatiquement en Peak.

Les supports officiels Sensiplan montrent que l'apprentissage de la glaire repose sur des descriptions et des exercices structurés ; les documents d'exercices distinguent plusieurs caractéristiques et abréviations. Cela justifie une revue du vocabulaire avant de transformer une ontologie pédagogique SymRella en règle algorithmique.

## 4. Revue de l'ontologie

Pour chaque champ proposé par SymRella, l'expert doit répondre :
1. Est-il directement observable ?
2. Est-il une sensation rapportée par l'utilisatrice ?
3. Est-il une interprétation ?
4. Est-il nécessaire à une règle de méthode ?
5. Peut-il être conservé sans produire une conclusion ?
6. Existe-t-il une définition officielle correspondante ?
7. Existe-t-il des cas limites documentés ?

Toute réponse « non documenté » conserve le champ au statut descriptif.

## 5. Validation des scénarios

Les 28 scénarios du catalogue constituent la batterie d'ingénierie.

Pour chaque scénario méthodologique, l'expert indique :
- conforme ;
- conforme avec correction ;
- non conforme ;
- non déterminable avec les sources fournies.

Aucune modification de code ne doit être faite directement dans le formulaire de validation.

## 6. Validation visuelle

La validation des neuf références photographiques reste distincte de la validation des règles.

Les annotateurs doivent d'abord décrire indépendamment les caractéristiques visibles. Le mapping vers une catégorie méthodologique vient ensuite.

Les photos provenant de sources externes ne doivent pas être considérées comme un gold set simplement parce qu'une légende existe. Les droits, la provenance, l'intégrité et la qualité pédagogique doivent également être contrôlés.

## 7. Multilingue

Les versions française, anglaise, espagnole et arabe doivent conserver exactement le même état moteur.

La traduction ne doit jamais créer :
- Peak ;
- Peak+3 ;
- une conclusion diagnostique ;
- une conclusion contraceptive ;
- une conclusion de fertilité non produite par le moteur validé.

Le test automatisé T35 vérifie actuellement cette invariance de base.

## 8. Critères de signature

Une règle ne passe de pending_expert à validated que si :
- la source est identifiée ;
- la définition est sans ambiguïté ;
- les cas limites sont documentés ;
- le comportement attendu est testable ;
- les tests couvrent les cas normaux et limites ;
- l'expert valide la formulation ;
- aucune adaptation SymRella n'est présentée comme une règle de la méthode source.

## 9. Signataires à renseigner

| Rôle | Nom | Qualification | Date | Décision |
|---|---|---|---|---|
| Expert méthode | à renseigner | à renseigner | à renseigner | pending |
| Expert pédagogique | à renseigner | à renseigner | à renseigner | pending |
| Relecteur technique | à renseigner | à renseigner | à renseigner | pending |
| Relecteur protection des données | à renseigner | à renseigner | à renseigner | pending |

## 10. Décision de mise en production

La présence de tests verts ne suffit pas.

Le passage à une interprétation cervicale nécessite simultanément :
- validation des règles de référence ;
- validation de l'ontologie cervicale ;
- validation humaine indépendante ;
- validation pédagogique ;
- audit des droits et des actifs ;
- revue sécurité/confidentialité ;
- tests E2E desktop et mobile ;
- traçabilité versionnée.

**Statut actuel : NON VALIDÉ POUR INTERPRÉTATION CERVICALE.**

## 11. Principe directeur

Tant que la validation n'est pas signée, SymRella peut :

**observer → conserver → expliquer → comparer → signaler une limite**

mais ne doit pas :

**déduire automatiquement une catégorie cervicale méthodologique → Peak → Peak+3 → conclusion de fertilité/contraception.**
