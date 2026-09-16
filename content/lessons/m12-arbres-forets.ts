import type { LessonContent } from "@/lib/lesson-types";

export const m12ArbresForets: LessonContent = {
  conceptId: "m12-arbres-forets",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la régression logistique, pour comparer un modèle linéaire à un modèle non-linéaire.",
      en: "You need to know logistic regression, to compare a linear model to a non-linear one.",
    },
    conceptIds: ["m12-regression-logistique"],
  },
  glossary: [
    { term: { fr: "Ensemble (ensemble learning)", en: "Ensemble learning" }, definition: { fr: "Combiner les prédictions de plusieurs modèles pour obtenir une prédiction plus robuste qu'un seul modèle.", en: "Combining several models' predictions to get a more robust prediction than any single model." } },
    { term: { fr: "Importance des variables", en: "Feature importance" }, definition: { fr: "Une mesure de la contribution de chaque variable aux prédictions d'un arbre ou d'une forêt, à interpréter avec prudence en cas de variables corrélées.", en: "A measure of each variable's contribution to a tree's or forest's predictions, to be interpreted cautiously when variables are correlated." } },
  ],
  intuition: {
    fr: "Un arbre de décision capture des non-linéarités et des interactions entre variables qu'une régression linéaire ne peut pas voir, en découpant récursivement les données par des règles simples (\"si levier > 3, alors...\") ; une forêt aléatoire moyenne de nombreux arbres légèrement différents pour réduire la variance et la sensibilité au bruit d'un arbre unique.",
    en: "A decision tree captures non-linearities and interactions between variables that linear regression can't see, by recursively splitting the data with simple rules (\"if leverage > 3, then...\"); a random forest averages many slightly different trees to reduce a single tree's variance and noise sensitivity.",
  },
  definition: {
    fr: "Quel problème ? Capturer des relations non-linéaires et des interactions entre variables, en classification comme en régression. Quand l'utiliser ? Quand la relation entre variables et cible n'est pas linéaire, ou quand on veut un modèle robuste avec peu de réglages. Quand l'éviter ? Quand l'interprétabilité stricte est requise (un arbre unique reste lisible, mais une forêt de centaines d'arbres redevient une boîte noire) ou quand les données sont peu nombreuses (risque de surapprentissage élevé). Un arbre découpe récursivement l'espace des variables pour minimiser l'impureté (Gini en classification, variance en régression) dans chaque feuille ; une forêt aléatoire entraîne de nombreux arbres sur des échantillons bootstrap différents, avec un sous-ensemble aléatoire de variables testées à chaque split, puis moyenne leurs prédictions.",
    en: "What problem? Capturing non-linear relationships and interactions between variables, in both classification and regression. When to use it? When the relationship between variables and target isn't linear, or when a robust model with little tuning is wanted. When to avoid it? When strict interpretability is required (a single tree stays readable, but a forest of hundreds of trees becomes a black box again) or when data is scarce (high overfitting risk). A tree recursively splits the variable space to minimize impurity (Gini for classification, variance for regression) in each leaf; a random forest trains many trees on different bootstrap samples, with a random subset of variables tested at each split, then averages their predictions.",
  },
  utility: {
    fr: "Quelles données/sortie ? Variables numériques ou catégorielles en entrée (pas besoin de normalisation, contrairement à la régression), une classe ou une valeur continue en sortie. Comment l'entraîner/évaluer ? Contrôler la profondeur maximale et le nombre minimal d'observations par feuille pour limiter le surapprentissage d'un arbre unique ; pour une forêt, régler le nombre d'arbres et la taille du sous-ensemble de variables, évaluer via validation croisée ou l'erreur out-of-bag (calculée automatiquement sur les observations non utilisées dans chaque arbre bootstrap). Pourquoi ce modèle ? Il capture des non-linéarités sans nécessiter de spécifier manuellement des termes d'interaction, contrairement à une régression linéaire.",
    en: "What data/output? Numerical or categorical input variables (no normalization needed, unlike regression), a class or continuous value as output. How to train/evaluate it? Control a single tree's maximum depth and minimum observations per leaf to limit overfitting; for a forest, tune the number of trees and the variable subset size, evaluate via cross-validation or the out-of-bag error (automatically computed on observations not used in each bootstrap tree). Why this model? It captures non-linearities without needing to manually specify interaction terms, unlike linear regression.",
  },
  example: {
    fr: "Classer des entreprises emprunteuses en catégories de notation de crédit à partir de dizaines de ratios financiers, dont certains n'ont d'effet que combinés (un fort levier n'est problématique que si la couverture des intérêts est également faible) : une forêt aléatoire capture naturellement cette interaction, alors qu'une régression logistique nécessiterait de créer manuellement un terme d'interaction levier×couverture.",
    en: "Classifying borrowing companies into credit rating categories from dozens of financial ratios, some of which only matter in combination (high leverage is only problematic if interest coverage is also weak): a random forest naturally captures this interaction, while logistic regression would require manually creating a leverage×coverage interaction term.",
  },
  alternativeExplanation: {
    fr: "Un arbre de décision fonctionne comme une série de questions oui/non en cascade, un peu comme un arbre de diagnostic médical : \"le levier dépasse-t-il 3 ? Si oui, la couverture des intérêts est-elle inférieure à 2 ? Si oui, catégorie à risque.\" Une forêt aléatoire, c'est demander cette série de questions à des centaines d'\"experts\" légèrement différents (chacun voyant un sous-échantillon différent des données et des variables), puis prendre la réponse majoritaire — plus fiable qu'un seul expert, aussi bon soit-il.",
    en: "A decision tree works like a cascade of yes/no questions, a bit like a medical diagnosis tree: \"is leverage above 3? If so, is interest coverage below 2? If so, at-risk category.\" A random forest means asking this series of questions to hundreds of slightly different \"experts\" (each seeing a different subsample of the data and variables), then taking the majority answer — more reliable than any single expert, however good.",
  },
  formula: {
    latex: "\\text{Gini}(D) = 1 - \\sum_{k} p_k^2",
    variables: [
      { symbol: "p_k", description: { fr: "Proportion d'observations de la classe k dans le nœud D", en: "Proportion of class-k observations in node D" } },
      { symbol: "\\text{Gini}(D)", description: { fr: "Impureté du nœud : 0 si toutes les observations sont de la même classe, maximale si les classes sont équiréparties", en: "The node's impurity: 0 if all observations belong to the same class, maximal if classes are evenly split" } },
    ],
    assumptions: { fr: "Un split choisit la variable et le seuil qui réduisent le plus l'impureté pondérée des deux nœuds enfants par rapport au nœud parent.", en: "A split picks the variable and threshold that most reduce the weighted impurity of the two child nodes relative to the parent node." },
    units: { fr: "Sans dimension, entre 0 et 1 (cas à 2 classes).", en: "Dimensionless, between 0 and 1 (2-class case)." },
    example: { fr: "Nœud avec 90% défauts, 10% non-défauts : Gini = 1−(0,9²+0,1²) = 0,18 — faible impureté, nœud déjà assez \"pur\".", en: "Node with 90% defaults, 10% non-defaults: Gini = 1−(0.9²+0.1²) = 0.18 — low impurity, an already fairly \"pure\" node." },
  },
  calculation: {
    fr: "1) Pour un arbre : à chaque nœud, tester tous les splits possibles (variable, seuil) et choisir celui qui minimise l'impureté pondérée résultante ; répéter récursivement jusqu'à une profondeur maximale ou un nombre minimal d'observations par feuille. 2) Pour une forêt : répéter la construction d'arbre B fois sur des échantillons bootstrap différents, avec un sous-ensemble aléatoire de variables testées à chaque split ; la prédiction finale est la moyenne (régression) ou le vote majoritaire (classification) des B arbres.",
    en: "1) For a tree: at each node, test all possible splits (variable, threshold) and pick the one minimizing the resulting weighted impurity; repeat recursively down to a maximum depth or a minimum observations-per-leaf count. 2) For a forest: repeat tree construction B times on different bootstrap samples, with a random variable subset tested at each split; the final prediction is the average (regression) or majority vote (classification) across the B trees.",
  },
  pythonExample: {
    fr: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)

modele = RandomForestClassifier(n_estimators=300, max_depth=6, random_state=0)
modele.fit(X_train, y_train)

probabilites = modele.predict_proba(X_test)[:, 1]
print("AUC :", roc_auc_score(y_test, probabilites))

# Importance des variables (à interpréter avec prudence si variables corrélées)
importances = dict(zip(X.columns, modele.feature_importances_))
print(sorted(importances.items(), key=lambda kv: -kv[1])[:5])`,
    en: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)

model = RandomForestClassifier(n_estimators=300, max_depth=6, random_state=0)
model.fit(X_train, y_train)

probabilities = model.predict_proba(X_test)[:, 1]
print("AUC:", roc_auc_score(y_test, probabilities))

# Feature importance (interpret cautiously if variables are correlated)
importances = dict(zip(X.columns, model.feature_importances_))
print(sorted(importances.items(), key=lambda kv: -kv[1])[:5])`,
  },
  interpretation: {
    fr: "L'erreur out-of-bag d'une forêt aléatoire donne une estimation de la performance de généralisation sans avoir besoin d'un jeu de test séparé (chaque arbre est évalué sur les observations qu'il n'a pas vues). L'importance des variables indique quelles variables contribuent le plus aux prédictions, mais deux variables très corrélées se \"partagent\" artificiellement l'importance, ce qui peut sous-estimer leur rôle réel individuel.",
    en: "A random forest's out-of-bag error gives an estimate of generalization performance without needing a separate test set (each tree is evaluated on the observations it hasn't seen). Feature importance shows which variables contribute most to predictions, but two highly correlated variables artificially \"split\" the importance, which can understate their real individual role.",
  },
  pitfalls: {
    fr: "Laisser un arbre unique croître sans limite de profondeur : il finit par mémoriser les données d'entraînement (surapprentissage extrême, un arbre par observation). Autre piège : croire qu'une forêt aléatoire est un modèle \"boîte noire\" totalement inexplicable — l'importance des variables et les valeurs SHAP offrent une interprétabilité partielle, moins directe qu'une régression mais pas nulle. Enfin, ne pas régler le nombre d'arbres ou la profondeur (garder les valeurs par défaut sans validation croisée) peut laisser un surapprentissage résiduel non détecté.",
    en: "Letting a single tree grow without a depth limit: it ends up memorizing the training data (extreme overfitting, one tree per observation). Another trap: believing a random forest is a totally inexplicable \"black box\" model — feature importance and SHAP values offer partial interpretability, less direct than a regression but not zero. Finally, not tuning the number of trees or depth (keeping defaults without cross-validation) can leave residual overfitting undetected.",
  },
  keyPoints: {
    fr: [
      "Un arbre découpe récursivement les données pour minimiser l'impureté (Gini) dans chaque feuille, capturant non-linéarités et interactions.",
      "Une forêt aléatoire moyenne de nombreux arbres entraînés sur des échantillons bootstrap différents, réduisant la variance d'un arbre unique.",
      "L'importance des variables doit être interprétée avec prudence en présence de variables corrélées.",
    ],
    en: [
      "A tree recursively splits data to minimize impurity (Gini) in each leaf, capturing non-linearities and interactions.",
      "A random forest averages many trees trained on different bootstrap samples, reducing a single tree's variance.",
      "Feature importance must be interpreted cautiously when variables are correlated.",
    ],
  },
  advancedDemonstration: {
    fr: "Le bagging (bootstrap aggregating) sur lequel repose la forêt aléatoire réduit la variance d'un ensemble de modèles sans en augmenter le biais, à condition que les modèles individuels soient suffisamment décorrélés entre eux : c'est précisément le rôle du sous-échantillonnage aléatoire des variables à chaque split (au-delà du simple bootstrap des observations), qui force les arbres à explorer des chemins de décision différents plutôt que de converger systématiquement vers les mêmes variables les plus prédictives — un mécanisme statistiquement proche de la diversification d'un portefeuille (M13-gp-a), où combiner des actifs peu corrélés réduit le risque global sans sacrifier le rendement espéré.",
    en: "The bagging (bootstrap aggregating) underlying the random forest reduces an ensemble's variance without increasing its bias, provided the individual models are sufficiently decorrelated from each other: this is precisely the role of randomly subsampling variables at each split (beyond simple observation bootstrapping), which forces trees to explore different decision paths rather than systematically converging on the same most-predictive variables — a mechanism statistically close to portfolio diversification (M13-gp-a), where combining weakly correlated assets reduces overall risk without sacrificing expected return.",
  },
};
