# RPS-02 — État de préparation éthique et gouvernance

Version 0.1 — avant toute collecte humaine

## Principe
Le projet concerne une recherche impliquant des données de santé intimes et potentiellement identifiantes. Aucune collecte réelle ne doit commencer avant l'examen éthique approprié et la mise en place d'un consentement adapté.

L'OMS indique que les recherches impliquant des êtres humains doivent faire l'objet d'une supervision éthique appropriée et que la dignité, les droits et le bien-être des participants doivent être protégés. citeturn0search0turn0search3

## Conditions préalables

### G-ETH-01 — Protocole
- protocole de recherche versionné ;
- objectif descriptif clairement défini ;
- absence d'objectif diagnostique ou contraceptif dans cette phase ;
- critères d'arrêt préspécifiés.

### G-ETH-02 — Consentement
Le consentement doit couvrir explicitement :
- la collecte de photographies ;
- l'utilisation pour la recherche ;
- la conservation ;
- l'annotation par des évaluateurs ;
- l'utilisation pour l'entraînement/évaluation d'un modèle si cela est prévu ;
- les modalités de retrait ;
- les usages futurs autorisés ou exclus.

Les lignes directrices internationales soulignent l'importance d'une gouvernance définissant notamment l'autorisation, le retrait, l'accès et la confidentialité des données de recherche. citeturn0search24

### G-ETH-03 — Minimisation
- aucune identité directe dans le corpus de développement ;
- suppression des métadonnées inutiles ;
- séparation des informations de contact et des données de recherche ;
- accès limité aux personnes autorisées ;
- journalisation des accès lorsque l'infrastructure le permet.

### G-ETH-04 — Droits d'utilisation
Pour chaque image :
- provenance documentée ;
- consentement ou licence documenté ;
- droit d'utilisation pour recherche/ML explicitement établi ;
- statut de retrait traçable.

Une image trouvée publiquement sur Internet ne doit pas être considérée automatiquement comme utilisable pour l'entraînement commercial.

### G-ETH-05 — Retrait
Le système de gouvernance doit permettre d'identifier tous les dérivés liés à une participante afin de traiter un retrait :
- image originale ;
- copies ;
- recadrages ;
- augmentations ;
- annotations ;
- exports ;
- résultats intermédiaires.

### G-ETH-06 — Accès
Définir avant collecte :
- responsable du corpus ;
- annotateurs autorisés ;
- personne chargée de l'adjudication ;
- emplacement de stockage ;
- sauvegardes ;
- procédure de révocation d'accès.

## Statut actuel

| Gate | Statut |
|---|---|
| Protocole de faisabilité | PRÊT |
| Ontologie provisoire | PRÊTE POUR VALIDATION |
| Schémas | PRÊTS |
| Workflow d'annotation | PRÊT |
| Plan d'analyse | PRÊT |
| Consentement recherche | À FAIRE |
| Avis éthique approprié | À FAIRE |
| Droits/licences des images | À FAIRE |
| Corpus humain | BLOQUÉ |
| Entraînement IA | BLOQUÉ |
| Intégration SymRella | BLOQUÉE |

## Règle
Aucune image intime réelle ne doit être ajoutée au dépôt GitHub public.
