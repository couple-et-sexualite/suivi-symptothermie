# RPS-02-CERVICAL-AI-DATASET — Schéma et gouvernance v0.1

## Objectif
Définir le format canonique d'un corpus d'images destiné à l'étude d'une assistance visuelle SymRella.

Aucune image dont les droits de collecte, conservation, annotation et utilisation ne sont pas documentés ne doit entrer dans le corpus.

## Identifiants
participantId, observationId, imageId, annotationId et reviewerId sont pseudonymes.

Aucun nom, email, téléphone ou identifiant de compte dans le dataset scientifique.

## Métadonnées
Chaque image conserve au minimum :
- imageId ;
- participantId pseudonyme ;
- observationId ;
- classe d'appareil ;
- dimensions ;
- qualité lumineuse ;
- qualité photo ;
- sourceType ;
- consentVersion ;
- licenseStatus ;
- datasetVersion.

La date exacte doit être omise ou réduite si elle n'est pas nécessaire.

## Annotation
Une annotation comporte :
- reviewerId ;
- reviewerRole ;
- ontologyVersion ;
- observedFeatures ;
- manualObservation ;
- ambiguity ;
- rationale ;
- timestamp ;
- statut/signature.

Une correction crée une nouvelle version ; l'annotation originale reste conservée.

## Gold set
Créé uniquement après annotations indépendantes, mesure des désaccords, adjudication, justification documentée et validation des cas particuliers.

## Droits
Statuts :
- owned_explicit_consent ;
- licensed_reuse ;
- research_only ;
- unknown ;
- prohibited.

Une page web publique n'est pas, à elle seule, une autorisation de réutilisation commerciale.

## Retrait
Le pipeline doit permettre de retrouver et retirer une observation dans les images originales, crops, augmentations, annotations, embeddings et exports dérivés.

## Splits
participantId -> train OU validation OU test.

Jamais deux images d'une même participante dans des splits différents.

## Augmentation
Réservée au train. Les transformations qui peuvent modifier la couleur, la texture ou l'extensibilité apparente sont interdites par défaut.

Toute augmentation doit être traçable vers son image source.

## Contrôle de fuite
Recherche obligatoire de doublons, quasi-doublons, crops issus du même original, observations présentes dans plusieurs splits, métadonnées contenant un label et noms de fichiers révélateurs.

## Taille cible
Phase pilote :
- 200–300 participantes ;
- 2–5 observations utilisables par participante en moyenne ;
- objectif initial 500–1 000 images.

C'est un objectif de développement, pas une preuve que ce volume suffit à la production.

## Diversité
Mesurer la diversité des appareils, lumières, langues, observations ambiguës et observations mixtes. Ne pas supposer la représentativité.

## Anonymisation
Ne jamais demander visage, corps entier, document ou information personnelle visible.

## Organisation
research / development / locked_test / gold.

locked_test ne doit jamais servir à régler le modèle.

## Audit de chaque version
- comptage par classe ;
- comptage par participante ;
- droits ;
- retraits ;
- fuites ;
- annotations ;
- hash des manifestes.

## Règle commerciale
Aucune image tierce ne doit entraîner un modèle commercial SymRella tant que le droit d'utilisation commerciale et de dérivation n'est pas explicitement établi.
