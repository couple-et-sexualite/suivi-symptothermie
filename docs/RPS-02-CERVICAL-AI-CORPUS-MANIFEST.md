# RPS-02 — Manifest du corpus cervical AI

Version 0.1 — structure uniquement, aucune donnée personnelle ou image réelle incluse.

## Identifiant
Chaque participante reçoit un identifiant pseudonyme stable dans le corpus de recherche.

## Unité
Une ligne de manifest correspond à une observation. Une observation peut référencer une image, mais le manifest ne contient pas l'image elle-même.

## Champs obligatoires
- participantId pseudonyme ;
- observationId ;
- imageId ;
- ontologyVersion ;
- consentStatus ;
- rightsStatus ;
- qualityStatus ;
- split ;
- captureDeviceClass ;
- lightingClass.

## Gouvernance
Une observation ne peut entrer dans le corpus de développement que si le consentement et les droits d'utilisation applicables sont documentés.

Les identifiants directs, coordonnées, noms, adresses, métadonnées EXIF inutiles et autres informations personnelles ne doivent pas être conservés dans le corpus d'entraînement.

## Split
Le split est attribué au niveau participante :
- train ;
- validation ;
- test.

Une participante ne peut apparaître que dans un seul split.

## Retrait
Le retrait d'une participante doit permettre de retrouver et supprimer tous ses éléments dérivés :
- images ;
- recadrages ;
- augmentations ;
- annotations ;
- résultats intermédiaires.

## Gel
Après gel du test, toute modification du protocole ou des paramètres doit produire une nouvelle version documentée.
