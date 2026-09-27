# RPS-02 — Pilote G1 synthétique

Version 0.1

## Objet
Ce pilote vérifie la mécanique du protocole avant toute étude avec des participantes : structure des annotations, détection des désaccords, adjudication déclarée, séparation par participante et absence de labels cliniques.

Il utilise uniquement des cas synthétiques. Il ne contient aucune photographie intime réelle et ne constitue pas une validation humaine.

## Cas couverts
- observation à caractéristiques crémeuses ;
- observation à caractéristiques transparentes/extensibles ;
- observation mixte ;
- observation insuffisante ;
- observation incertaine ;
- observation autre/indéterminée.

## Ce que le pilote doit démontrer
1. deux annotations indépendantes peuvent être représentées sans écraser l'original ;
2. un désaccord est détectable ;
3. une adjudication peut être enregistrée séparément ;
4. une participante ne peut pas être répartie entre train/validation/test ;
5. les cas insuffisants ou incertains restent explicitement incertains ;
6. aucun résultat fertile/infertile, ovulation, Peak, contraception ou diagnostic n'est produit.

## Limite
La réussite de ce pilote permet seulement de passer à la préparation de G1. Elle ne démontre ni la qualité d'une IA ni la reproductibilité de l'observation humaine. Une étude réelle nécessitera le cadre éthique, le consentement approprié, la gouvernance des images et des évaluateurs qualifiés. L'OMS indique que les recherches impliquant des êtres humains doivent faire l'objet d'un examen éthique approprié.