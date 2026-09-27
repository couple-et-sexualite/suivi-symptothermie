# Prototype d’aide à la caractérisation cervicale

Version : 0.1  
Statut : expérimental, descriptif, non validé pour une interprétation de fertilité.

## Objectif

Le prototype aide l’utilisatrice à décrire une observation cervicale à partir de caractéristiques structurées :

- aspect visuel ;
- texture ;
- extensibilité ;
- sensation ;
- longueur approximative de l’étirement.

Une photo peut être ajoutée pour un aperçu local et un contrôle élémentaire de résolution.

## Limites actuelles

La photo n’est pas analysée par un modèle d’intelligence artificielle. Elle reste locale à la session et n’est pas envoyée à un serveur applicatif ni enregistrée dans les données de suivi.

Le moteur actuel est une règle descriptive expérimentale basée sur les réponses de l’utilisatrice. Il peut produire :

- une description principalement crémeuse/épaisse ;
- une description principalement transparente/étirable ;
- une observation incertaine ou mixte.

Il ne produit pas :

- fertile / infertile ;
- ovulation ;
- Peak ;
- Peak+3 ;
- recommandation contraceptive ;
- diagnostic ou interprétation d’infection.

## Principe de contribution volontaire

Le fonctionnement retenu est **local par défaut** : une photo utilisée pour aider l’utilisatrice à décrire son observation ne quitte pas son appareil dans le prototype.

Après validation méthodologique, éthique et scientifique du dispositif, une fonction séparée pourra permettre aux utilisatrices qui le souhaitent de contribuer volontairement une ou plusieurs images au corpus de recherche. Cette contribution sera :

- facultative et sans impact sur l’utilisation de SymRella ;
- déclenchée par une action explicite de l’utilisatrice ;
- précédée d'une information claire sur les finalités, la conservation, l’annotation, l’évaluation et, si applicable, l’entraînement de modèles ;
- couverte par un consentement spécifique avant tout transfert ;
- révocable selon une procédure définie par le protocole et la gouvernance du corpus ;
- séparée des données ordinaires du journal de cycle.

Aucune photo ne sera envoyée simplement parce qu’elle a été utilisée dans l’assistant local. Une intention de contribuer exprimée antérieurement ne vaut pas autorisation de transfert ou d’utilisation d’une image déterminée.

## Évolution prévue

Le prototype est conçu pour être remplacé par un moteur validé sans modifier l’interface générale :

1. validation du référentiel cervical ;
2. validation humaine des observations ;
3. constitution d’un corpus gouverné et autorisé ;
4. comparaison questionnaire seul / image seule / image + observations structurées ;
5. validation interne puis externe ;
6. seulement ensuite, extension éventuelle des sorties autorisées.

Cette séparation suit le principe d’une tâche d’IA de santé clairement définie et évaluée pour son usage prévu. L’OMS souligne également la nécessité de transparence, de gouvernance, de sécurité et de supervision humaine pour les technologies d’IA en santé.

## Données

Aucune photo de l’utilisatrice n’est persistée par ce prototype. L’URL d’objet utilisée pour l’aperçu est révoquée lorsque l’image est remplacée, réinitialisée ou lorsque la page est quittée.

Les données descriptives saisies dans ce module ne sont pas automatiquement ajoutées au journal du cycle : l’utilisatrice conserve le contrôle de ce qu’elle enregistre comme observation.

## Stockage et transfert

Le prototype actuel ne possède aucun mécanisme d’envoi de photo. Une future fonction de contribution ne sera activée qu’après le passage des gates de gouvernance applicables et la mise en place du consentement et de l’infrastructure correspondants.

## Statut de validation

Ce prototype ne fait pas passer les gates G1 à G5. Il constitue uniquement une implémentation produit limitée permettant de tester l’ergonomie et le flux descriptif avant validation humaine et scientifique.


## Spécification future — contribution volontaire de photos

Cette fonction n'est pas activée dans le prototype actuel.

### Déclenchement

Une future version pourra proposer une action distincte, par exemple **« Contribuer à l’amélioration de SymRella »**, uniquement après les validations et autorisations requises.

L'envoi devra toujours résulter d'une action explicite de l'utilisatrice. L'utilisation de l'assistant, la présence d'une photo locale ou l'enregistrement d'une observation ne devront jamais déclencher automatiquement un transfert.

### Avant l'envoi

L'interface devra afficher séparément :

- la finalité exacte de la contribution ;
- les catégories de personnes ayant accès aux images ;
- la durée et le lieu de conservation ;
- les usages autorisés : annotation, validation, recherche et, si prévu, entraînement de modèles ;
- les éventuels usages futurs ;
- la procédure de retrait ;
- les conséquences éventuelles d'un retrait sur les dérivés déjà créés, selon le protocole applicable.

L'utilisatrice devra pouvoir refuser sans perdre l'accès aux fonctions normales de SymRella.

### Architecture technique prévue

Le futur flux sera séparé du journal local :

`photo locale → information/consentement → confirmation explicite → transfert sécurisé → identifiant pseudonyme → corpus gouverné`

Il ne devra pas exister de chemin implicite :

`photo locale → serveur`

### Règles de sécurité

- aucun transfert sans action explicite ;
- aucun envoi en arrière-plan ;
- aucune URL d'upload codée dans le prototype local ;
- aucune photo dans le dépôt GitHub ;
- suppression des métadonnées inutiles avant transfert si compatible avec le protocole ;
- chiffrement en transit et au repos dans l'infrastructure future ;
- journalisation des opérations de contribution ;
- mécanisme de retrait et de traçabilité.

### Condition d'activation

La fonction restera désactivée tant que les gates de gouvernance, de consentement, de droits d'utilisation et de validation scientifique applicables ne sont pas franchies.
