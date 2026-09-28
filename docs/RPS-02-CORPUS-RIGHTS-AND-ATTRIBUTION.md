# RPS-02 — corpus photographique réel et droits

## Statut

Le corpus pilote contient **9 références photographiques réelles** :
- 8 provenant de la Justisse College Cervical Mucus Gallery ;
- 1 provenant de Wikimedia Commons.

Les fichiers ne sont pas présentés comme des catégories SymRella. Chaque photo reste un exemple d'observation à annoter selon la matrice RPS-02.

## Droits

### Justisse College Cervical Mucus Gallery

La galerie indique que ses images sont sous **CC BY-SA** et que la licence autorise notamment la réutilisation commerciale, avec attribution ; les adaptations doivent rester sous les conditions de partage prévues par la licence. La source précise également que ses notations sont celles de la méthode Justisse et qu'elles ne doivent pas être mélangées avec d'autres méthodes.

Source : https://mucus.justisse.ca/finger-testable-observations

Attribution affichée dans SymRella :

> Justisse College Cervical Mucus Gallery — CC BY-SA

Licence : https://creativecommons.org/licenses/by-sa/4.0/

### Wikimedia Commons — Presumed cervical mucus.jpg

Auteur : **Ipertornado**  
Licence : **CC BY-SA 4.0**  
Source : https://commons.wikimedia.org/wiki/File:Presumed_cervical_mucus.jpg

La page source précise que l'image représente du mucus cervical présumé et qu'il n'a pas été évalué médicalement. SymRella ne doit donc en tirer aucune conclusion médicale.

Attribution :

> Ipertornado / Wikimedia Commons — CC BY-SA 4.0

## Règle de publication SymRella

Avant de considérer une photo comme **validée pédagogiquement**, elle doit encore passer :
1. contrôle de provenance et de licence ;
2. contrôle technique de l'image ;
3. annotation visuelle indépendante ;
4. revue pédagogique ;
5. revue méthodologique RPS-02 ;
6. contrôle de l'absence d'inférence clinique ;
7. validation finale et date de validation.

Le champ `rps02Mapping` reste donc `pending_expert` pour le corpus actuel.

## Pourquoi les notations Justisse ne sont pas reprises comme catégories

Une photo peut être accompagnée d'une notation Justisse comme « 10K » ou « 10CKG ». Cette notation décrit le système de la source. SymRella utilise sa propre matrice d'observation : sensation, présence, couleur apparente, texture apparente, transparence, étirement apparent, quantité apparente et contexte photographique.

La sensation ne doit jamais être déduite de l'image.

## Dépendance externe actuelle

Le corpus pilote référence encore les originaux hébergés par les sources. Il s'agit d'une étape transitoire : pour une version commerciale robuste, les images doivent être **copiées localement dans le dépôt après vérification de la licence et conservation des métadonnées d'attribution**, puis leur hash SHA-256 doit être enregistré.

Tant que cette étape n'est pas réalisée, le corpus est marqué `pilot_external_references`.
