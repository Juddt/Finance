import type { LessonContent } from "@/lib/lesson-types";

export const m12RegressionLineaire: LessonContent = {
  conceptId: "m12-regression-lineaire",
  glossary: [
    { term: { fr: "Surapprentissage (overfitting)", en: "Overfitting" }, definition: { fr: "Un modèle qui colle trop précisément aux données d'entraînement, au point de mal généraliser sur des données nouvelles.", en: "A model that fits the training data too closely, to the point of generalizing poorly to new data." } },
    { term: { fr: "Régularisation", en: "Regularization" }, definition: { fr: "Une pénalité ajoutée à la fonction de perte pour contraindre la taille des coefficients et réduire le surapprentissage (Ridge = pénalité L2, Lasso = pénalité L1).", en: "A penalty added to the loss function to constrain coefficient size and reduce overfitting (Ridge = L2 penalty, Lasso = L1 penalty)." } },
  ],
  intuition: {
    fr: "La régression linéaire cherche la meilleure combinaison pondérée de variables explicatives pour prédire une quantité continue : c'est le modèle le plus simple, le plus interprétable, et presque toujours le premier réflexe avant d'essayer quelque chose de plus complexe.",
    en: "Linear regression looks for the best weighted combination of explanatory variables to predict a continuous quantity: it's the simplest, most interpretable model, and almost always the first thing to try before reaching for something more complex.",
  },
  definition: {
    fr: "La régression linéaire modélise y = Xβ + ε, où β est estimé en minimisant la somme des carrés des résidus (moindres carrés ordinaires, OLS). Quel problème ? Prédire une valeur continue (rendement, spread, prix) à partir de variables numériques. Quand l'utiliser ? Quand une relation approximativement linéaire est plausible et que l'interprétabilité des coefficients compte. Quand l'éviter ? Quand la relation est fortement non-linéaire, ou que les variables explicatives sont très corrélées entre elles (multicolinéarité) sans traitement adapté. La régularisation (Ridge, pénalité sur Σβ² ; Lasso, pénalité sur Σ|β|) contraint les coefficients pour limiter le surapprentissage, Lasso ayant en plus la propriété de mettre certains coefficients exactement à zéro (sélection de variables).",
    en: "Linear regression models y = Xβ + ε, with β estimated by minimizing the sum of squared residuals (ordinary least squares, OLS). What problem? Predicting a continuous value (a yield, a spread, a price) from numerical variables. When to use it? When an approximately linear relationship is plausible and coefficient interpretability matters. When to avoid it? When the relationship is strongly non-linear, or explanatory variables are highly correlated (multicollinearity) without proper treatment. Regularization (Ridge, a penalty on Σβ²; Lasso, a penalty on Σ|β|) constrains coefficients to limit overfitting, with Lasso additionally able to set some coefficients exactly to zero (variable selection).",
  },
  utility: {
    fr: "Quelles données/sortie ? Des variables numériques en entrée (features), une valeur continue en sortie (target). Comment l'entraîner/évaluer ? Ajuster β sur un jeu d'entraînement, puis évaluer sur un jeu de test séparé avec le R² (variance expliquée) et l'erreur quadratique moyenne (MSE). Pourquoi ce modèle ? Sa simplicité en fait une référence (baseline) indispensable : tout modèle plus complexe doit démontrer qu'il fait significativement mieux qu'une régression linéaire pour justifier sa complexité additionnelle.",
    en: "What data/output? Numerical input variables (features), a continuous output value (target). How to train/evaluate it? Fit β on a training set, then evaluate on a separate test set using R² (explained variance) and mean squared error (MSE). Why this model? Its simplicity makes it an essential baseline: any more complex model must demonstrate it significantly outperforms linear regression to justify its added complexity.",
  },
  example: {
    fr: "Prédire le rendement à l'échéance (yield to maturity) d'une obligation d'entreprise à partir de sa duration, de son spread de crédit et de sa notation encodée numériquement : un modèle linéaire donnera des coefficients directement interprétables (« chaque année de duration supplémentaire ajoute X points de base »), utile pour un desk obligataire qui veut comprendre le \"pourquoi\" autant que la prédiction elle-même.",
    en: "Predicting a corporate bond's yield to maturity from its duration, credit spread and numerically encoded rating: a linear model gives directly interpretable coefficients (\"each extra year of duration adds X basis points\"), useful for a bond desk that wants to understand the \"why\" as much as the prediction itself.",
  },
  alternativeExplanation: {
    fr: "Imaginez régler plusieurs curseurs (un par variable) pour que la somme pondérée des curseurs colle le mieux possible à une cible : la régression linéaire trouve automatiquement le meilleur réglage de chaque curseur, celui qui minimise l'écart moyen au carré entre la prédiction et la vraie valeur sur les données observées.",
    en: "Imagine adjusting several sliders (one per variable) so their weighted sum matches a target as closely as possible: linear regression automatically finds the best setting for each slider, the one minimizing the average squared gap between the prediction and the true value on the observed data.",
  },
  formula: {
    latex: "\\hat{\\beta} = \\arg\\min_{\\beta} \\sum_{i=1}^{n} (y_i - x_i^\\top \\beta)^2 + \\lambda \\sum_{j} \\beta_j^2",
    variables: [
      { symbol: "y_i - x_i^\\top \\beta", description: { fr: "Résidu (écart entre valeur réelle et prédiction) pour l'observation i", en: "The residual (gap between the real value and the prediction) for observation i" } },
      { symbol: "\\lambda", description: { fr: "Force de la régularisation (Ridge ici) : 0 = OLS classique, plus λ est grand, plus les coefficients sont contraints vers zéro", en: "Regularization strength (Ridge here): 0 = classic OLS, the larger λ, the more coefficients are pulled toward zero" } },
    ],
    assumptions: { fr: "OLS classique suppose une relation linéaire, des résidus indépendants et de variance constante (homoscédasticité) ; la régularisation nécessite des variables normalisées (même échelle) pour que λ pénalise équitablement.", en: "Classic OLS assumes a linear relationship, independent residuals with constant variance (homoscedasticity); regularization requires normalized variables (same scale) so λ penalizes fairly." },
    units: { fr: "Coefficients dans l'unité de y par unité de x.", en: "Coefficients in y's unit per unit of x." },
    example: { fr: "λ=0 : régression linéaire classique (OLS). λ grand : les coefficients β sont fortement rétrécis vers 0, réduisant la variance du modèle au prix d'un léger biais.", en: "λ=0: classic linear regression (OLS). Large λ: the β coefficients are strongly shrunk toward 0, reducing the model's variance at the cost of a slight bias." },
  },
  calculation: {
    fr: "1) Séparer les données en un jeu d'entraînement et un jeu de test (jamais évaluer sur les données d'entraînement). 2) Normaliser les variables si une régularisation est utilisée. 3) Ajuster β en minimisant la fonction de perte sur le jeu d'entraînement. 4) Évaluer sur le jeu de test avec R² et MSE, jamais sur le jeu d'entraînement (qui donnerait une performance artificiellement optimiste).",
    en: "1) Split the data into a training set and a test set (never evaluate on the training data). 2) Normalize variables if regularization is used. 3) Fit β by minimizing the loss function on the training set. 4) Evaluate on the test set with R² and MSE, never on the training set (which would give an artificially optimistic performance).",
  },
  pythonExample: {
    fr: `from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# X : variables explicatives (duration, spread, notation...)
# y : rendement à l'échéance observé
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# alpha = force de régularisation (équivalent de λ dans la formule)
modele = Ridge(alpha=1.0)
modele.fit(X_train, y_train)

predictions = modele.predict(X_test)
print("R2 :", r2_score(y_test, predictions))
print("MSE :", mean_squared_error(y_test, predictions))
print("Coefficients :", dict(zip(X.columns, modele.coef_)))`,
    en: `from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# X: explanatory variables (duration, spread, rating...)
# y: observed yield to maturity
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# alpha = regularization strength (equivalent to λ in the formula)
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print("R2:", r2_score(y_test, predictions))
print("MSE:", mean_squared_error(y_test, predictions))
print("Coefficients:", dict(zip(X.columns, model.coef_)))`,
  },
  interpretation: {
    fr: "Un R² proche de 1 indique que le modèle explique bien la variance de y ; un R² proche de 0 (voire négatif sur le jeu de test) indique un pouvoir prédictif faible ou nul. Le signe et l'amplitude de chaque coefficient β s'interprètent directement : un coefficient positif signifie que la variable associée augmente la prédiction, toutes choses égales par ailleurs.",
    en: "An R² close to 1 indicates the model explains y's variance well; an R² close to 0 (or even negative on the test set) indicates weak or no predictive power. Each β coefficient's sign and magnitude are directly interpretable: a positive coefficient means the associated variable increases the prediction, all else equal.",
  },
  pitfalls: {
    fr: "Évaluer le modèle sur les mêmes données que celles utilisées pour l'entraîner, ce qui surestime systématiquement la performance réelle. Autre piège : interpréter un coefficient significatif comme une preuve de causalité, alors qu'une corrélation (même forte) entre variables financières ne prouve jamais un lien causal. Enfin, ignorer la multicolinéarité entre variables explicatives peut rendre les coefficients individuels instables et trompeurs, même si la prédiction globale reste correcte.",
    en: "Evaluating the model on the same data used to train it, which systematically overstates real performance. Another trap: interpreting a significant coefficient as proof of causality, when a correlation (even a strong one) between financial variables never proves a causal link. Finally, ignoring multicollinearity between explanatory variables can make individual coefficients unstable and misleading, even if the overall prediction remains correct.",
  },
  keyPoints: {
    fr: [
      "La régression linéaire prédit une valeur continue via une combinaison pondérée des variables, en minimisant l'erreur quadratique.",
      "La régularisation (Ridge/Lasso) contraint les coefficients pour réduire le surapprentissage, au prix d'un léger biais.",
      "Toujours évaluer sur un jeu de test séparé, jamais sur les données d'entraînement.",
    ],
    en: [
      "Linear regression predicts a continuous value via a weighted combination of variables, by minimizing squared error.",
      "Regularization (Ridge/Lasso) constrains coefficients to reduce overfitting, at the cost of a slight bias.",
      "Always evaluate on a separate test set, never on the training data.",
    ],
  },
  advancedDemonstration: {
    fr: "La solution OLS a une forme fermée, β̂ = (XᵀX)⁻¹Xᵀy, dérivée en annulant le gradient de la somme des carrés des résidus — mais cette inversion matricielle devient instable si les colonnes de X sont fortement corrélées (multicolinéarité), un problème que la régularisation Ridge résout élégamment en ajoutant λI à XᵀX avant inversion, garantissant que la matrice reste inversible même en cas de colinéarité parfaite. Lasso, en revanche, n'a pas de solution fermée (sa pénalité L1 n'est pas différentiable en zéro) et nécessite des méthodes d'optimisation itératives (descente de coordonnées), mais offre en échange une sélection automatique de variables — une propriété que Ridge n'a pas.",
    en: "The OLS solution has a closed form, β̂ = (XᵀX)⁻¹Xᵀy, derived by zeroing the residual sum of squares' gradient — but this matrix inversion becomes unstable if X's columns are strongly correlated (multicollinearity), a problem Ridge regularization elegantly solves by adding λI to XᵀX before inversion, guaranteeing the matrix stays invertible even under perfect collinearity. Lasso, by contrast, has no closed form (its L1 penalty isn't differentiable at zero) and requires iterative optimization methods (coordinate descent), but offers automatic variable selection in exchange — a property Ridge lacks.",
  },
};
