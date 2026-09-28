# Utilisation de l'outil d'annotation aveugle RPS-02

## Objectif

Permettre à deux annotateurs indépendants (A et B) de décrire les mêmes 9 images sans exposer les labels de source ni le mapping RPS-02.

## Accès

L'outil est disponible dans :

`tools/rps02-blind-annotation/index.html`

Sur GitHub Pages, ouvrir le chemin correspondant :

`/suivi-symptothermie/tools/rps02-blind-annotation/`

## Procédure

1. Donner l'outil à l'annotateur A.
2. Lui attribuer uniquement l'identifiant `A` (ou un identifiant neutre).
3. Il annote les 9 images indépendamment.
4. Il clique sur **Exporter mes annotations en JSON**.
5. Le fichier exporté reste sur son appareil et doit être transmis au responsable de l'étude par le canal convenu.
6. Réinitialiser l'outil avant de le remettre à l'annotateur B, ou utiliser un autre navigateur/appareil.
7. L'annotateur B reçoit les mêmes 9 images, sans voir les réponses de A.
8. Après réception des deux fichiers, seulement alors effectuer la comparaison et l'adjudication.

## Consignes aux annotateurs

Décrire uniquement les caractéristiques visibles.

Ne pas déduire à partir de la photo :

- fertilité ;
- ovulation ;
- Peak ;
- état hormonal ;
- infection ;
- sensation ;
- état biologique.

Une caractéristique non observable doit être indiquée comme **non déterminable**.

## Confidentialité méthodologique

Le manifeste utilisé par l'outil contient uniquement :

- l'identifiant neutre `RPS02-A01` à `RPS02-A09` ;
- l'URL technique de l'image.

Il ne contient pas les noms de fichiers source, les labels Justisse, les catégories attendues ou le mapping RPS-02.

Le JSON complet `data/rps02-blind-annotation-set.json` ne doit **pas** être remis aux annotateurs, car il contient des métadonnées de provenance.

## Important

Les résultats exportés par A et B ne doivent pas être modifiés avant comparaison. Les désaccords doivent rester visibles et l'adjudication doit être enregistrée séparément.

Cette étape ne constitue pas une validation biologique ou clinique du corpus.
