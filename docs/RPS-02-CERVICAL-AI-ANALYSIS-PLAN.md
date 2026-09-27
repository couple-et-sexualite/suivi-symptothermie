# RPS-02 — Plan d'analyse de validation de l'assistance visuelle

Version 0.1 — pré-enregistré avant entraînement

## 1. Comparaisons principales
Trois systèmes sont comparés sur exactement les mêmes observations :
- A : observation structurée seule ;
- B : image seule ;
- C : image + observation structurée.

La cible est une caractérisation descriptive définie par l'ontologie, pas un statut de fertilité.

## 2. Unité statistique
L'unité indépendante principale est la participante.

Les observations multiples d'une même participante ne doivent pas être traitées comme des participantes indépendantes dans les intervalles d'incertitude.

## 3. Analyse par caractéristique
Pour chaque dimension :
- transparence ;
- aspect chromatique ;
- texture ;
- extensibilité ;
- longueur d'étirement ;
- surface.

Rapporter :
- matrice de confusion ;
- précision ;
- rappel ;
- F1 lorsque pertinent ;
- taux d'indétermination ;
- accord avec l'annotation adjudicée ;
- intervalle d'incertitude.

## 4. Accord humain
Avant de considérer un modèle comme exploitable, mesurer l'accord entre A et B.

Pour les variables catégorielles, rapporter une mesure d'accord adaptée à la structure de la variable, accompagnée des effectifs bruts.

Un score global unique ne doit pas masquer une catégorie particulièrement peu reproductible.

## 5. Analyse de couverture
Mesurer séparément :
- toutes les observations ;
- images `sufficient` ;
- images `uncertain` ;
- images `insufficient`.

Un modèle qui améliore son score uniquement en refusant une grande partie des observations n'est pas considéré comme automatiquement supérieur.

## 6. Robustesse
Stratifier, lorsque les effectifs le permettent, par :
- classe d'appareil ;
- qualité lumineuse ;
- qualité d'image ;
- caractéristiques mixtes ;
- cas difficiles préspécifiés.

## 7. Test verrouillé
Le test final est :
- séparé par participante ;
- jamais utilisé pour modifier le modèle ;
- jamais utilisé pour choisir les seuils ;
- jamais utilisé pour choisir les augmentations ;
- analysé selon le plan préétabli.

## 8. Analyse des erreurs
Chaque erreur importante est attribuée à une cause :
1. image insuffisante ;
2. ambiguïté visuelle ;
3. caractéristique mixte ;
4. ambiguïté de l'ontologie ;
5. erreur de généralisation ;
6. artefact technique ;
7. autre.

## 9. Critères de décision
`CONTINUE` si la reproductibilité humaine et la robustesse sont compatibles avec une assistance descriptive.

`MODIFY` si une dimension ou le protocole doit être révisé.

`STOP` si l'assistance visuelle n'apporte pas une information suffisamment fiable ou généralisable.

## 10. Interdiction d'usage clinique
Même un résultat expérimental positif ne constitue pas à lui seul une validation de l'utilisation contraceptive, diagnostique ou clinique.

Une validation distincte est nécessaire pour toute interprétation dépassant la description visuelle.
