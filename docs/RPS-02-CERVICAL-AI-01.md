# RPS-02-CERVICAL-AI-01 — Spécification exécutable d'assistance visuelle v0.1

## Statut
PROPOSITION À VALIDER. Aucun modèle IA clinique ou méthodologique n'est activé.

Cette spécification définit une future aide à la caractérisation descriptive d'observations cervicales. Elle ne constitue ni un diagnostic, ni une méthode contraceptive, ni une preuve d'ovulation ou de fertilité.

Une étude InVivo publiée en 2024 rapporte un dictionnaire pictographique construit à partir de plus de 2 000 images de sécrétions et près de 430 cycles. La méthode associe sensation, examen visuel, palpation, étirement et photographie en bonne lumière. Cette publication ne valide pas une IA SymRella.

## Finalité
Aider l'utilisatrice à décrire ce qu'elle observe, notamment lorsqu'elle hésite entre des descriptions comme « crémeux » et « transparent/extensible ».

Sorties interdites :
- fertile / infertile ;
- ovulation / ovulation confirmée ;
- Peak / Peak+3 ;
- jour sûr / dangereux ;
- recommandation contraceptive ;
- diagnostic d'infection ou de maladie.

## Architecture cible
PHOTO -> contrôle qualité -> caractéristiques visuelles
     -> questionnaire d'auto-observation
     -> caractérisation descriptive -> incertitude
     -> aide pédagogique

Le modèle est un assistant de caractérisation, jamais l'autorité méthodologique finale.

## Ontologie visuelle initiale
Dimensions :
- opacité : transparent, translucide, opaque, inconnu ;
- apparence de couleur : clair, blanc, blanchâtre, autre, inconnu ;
- texture apparente : crémeux, épais, aqueux, gélatineux, filant, mixte, autre, inconnu ;
- extensibilité visible : absente, faible, nette, indéterminée ;
- longueur d'étirement : 0, <1 cm, 1–2 cm, >2 cm, non mesurable ;
- surface : mate, brillante, mixte, inconnue ;
- matériau mixte : oui, non, indéterminé.

Ces catégories sont une ontologie technique SymRella et ne doivent pas être présentées comme des catégories Sensiplan sans validation.

## Sensations
- sec ;
- humide ;
- mouillé ;
- glissant ;
- inconnu.

Une sensation ne doit jamais être déduite de la photo.

## Contrôle qualité
Une image peut être refusée si elle est trop sombre, floue, trop petite, surexposée, mal cadrée, sans observation détectable ou trop ambiguë.

Etats : sufficient, insufficient, uncertain.

Si insufficient : aucune caractérisation IA.

## Sortie descriptive
Classes expérimentales :
- creamy_like ;
- clear_or_translucent_like ;
- stretchy_like ;
- watery_like ;
- sticky_like ;
- mixed_or_ambiguous ;
- insufficient_evidence.

La sortie peut être multi-caractéristique. Elle doit préférer l'incertitude à une classification forcée.

## Fusion photo + auto-observation
Les données visuelles et manuelles restent séparées. Une divergence doit être signalée, pas résolue silencieusement.

Exemple :
photo : extensibilité incertaine ;
utilisatrice : s'étire nettement ;
résultat : conserver les deux observations et signaler la divergence.

## Données interdites comme variables initiales
Nom, adresse, email, identifiant public, diagnostic, historique médical libre et données sociales ne sont pas nécessaires à la première version.

## Apprentissage personnalisé
Une comparaison avec les observations précédentes d'une même utilisatrice peut être étudiée ultérieurement. Elle ne doit pas réentraîner automatiquement le modèle global et doit rester distincte de toute interprétation méthodologique.

## Séparation des données
La séparation doit être faite par participante, jamais seulement par image.

Cible initiale : 70 % participantes train, 15 % validation, 15 % test. Le principe de non-fuite entre participantes est obligatoire.

## Validation
Avant utilisation :
1. test interne ;
2. participantes non vues ;
3. appareils différents ;
4. conditions de lumière différentes ;
5. questionnaire multilingue ;
6. revue d'erreurs ;
7. revue humaine ;
8. validation méthodologique externe.

## Métriques
Sensibilité, spécificité, précision, NPV, F1, matrice de confusion, calibration et intervalles de confiance. AUROC lorsque pertinent.

Aucune métrique unique ne suffit à autoriser la production.

## Versionnement
Chaque modèle enregistre modelVersion, datasetVersion, ontologyVersion, commit, paramètres, seuils, métriques, population d'évaluation et erreurs connues.

Un changement d'ontologie impose une nouvelle version du dataset et une nouvelle validation.

## Gates de déploiement
G0 ontologie validée
G1 protocole photo validé
G2 droits des images documentés
G3 gold set annoté par au moins deux évaluateurs
G4 splits par participante vérifiés
G5 validation interne terminée
G6 test indépendant verrouillé réussi
G7 analyse des erreurs terminée
G8 revue méthodologique externe
G9 messages utilisateur validés
G10 autorisation de production

G10 ne peut pas être obtenu par des tests logiciels seuls.
