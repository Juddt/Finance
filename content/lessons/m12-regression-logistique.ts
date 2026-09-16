import type { LessonContent } from "@/lib/lesson-types";

export const m12RegressionLogistique: LessonContent = {
  conceptId: "m12-regression-logistique",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la régression linéaire et la notion de régularisation.",
      en: "You need to know linear regression and the concept of regularization.",
    },
    conceptIds: ["m12-regression-lineaire"],
  },
  glossary: [
    { term: { fr: "Log-loss (entropie croisée)", en: "Log-loss (cross-entropy)" }, definition: { fr: "La fonction de perte standard de la régression logistique, qui pénalise fortement une prédiction confiante et fausse.", en: "The standard loss function for logistic regression, which heavily penalizes a confident, wrong prediction." } },
    { term: { fr: "Calibration", en: "Calibration" }, definition: { fr: "La propriété qu'une probabilité prédite de 70% corresponde réellement à environ 70% de cas positifs observés, pas seulement à un bon classement relatif.", en: "The property that a predicted probability of 70% actually corresponds to roughly 70% of observed positive cases, not just a good relative ranking." } },
  ],
  intuition: {
    fr: "Contrairement à la régression linéaire qui prédit une valeur continue, la régression logistique estime une probabilité (entre 0 et 1) qu'un événement binaire se produise — typiquement un défaut de crédit, une hausse ou une baisse — en appliquant une fonction sigmoïde à une combinaison linéaire des variables.",
    en: "Unlike linear regression, which predicts a continuous value, logistic regression estimates a probability (between 0 and 1) that a binary event occurs — typically a credit default, a rise or a fall — by applying a sigmoid function to a linear combination of the variables.",
  },
  definition: {
    fr: "Quel problème ? Classer une observation en deux catégories, ou plus précisément estimer une probabilité d'appartenance à une catégorie. Quand l'utiliser ? Quand la sortie est binaire (défaut/non-défaut) et qu'une probabilité interprétable est utile, pas seulement une étiquette. Quand l'éviter ? Quand la frontière de décision est fortement non-linéaire, ou en cas de déséquilibre extrême des classes sans traitement adapté (pondération, rééchantillonnage). Le modèle s'écrit p = σ(Xβ) où σ est la fonction sigmoïde, entraîné en minimisant le log-loss (maximum de vraisemblance) plutôt que l'erreur quadratique.",
    en: "What problem? Classifying an observation into two categories, or more precisely estimating a probability of belonging to a category. When to use it? When the output is binary (default/no default) and an interpretable probability is useful, not just a label. When to avoid it? When the decision boundary is strongly non-linear, or under extreme class imbalance without proper treatment (weighting, resampling). The model is p = σ(Xβ) where σ is the sigmoid function, trained by minimizing the log-loss (maximum likelihood) rather than squared error.",
  },
  utility: {
    fr: "Quelles données/sortie ? Des variables numériques en entrée, une probabilité entre 0 et 1 en sortie (convertible en classe via un seuil, souvent 0,5 mais pas toujours). Comment l'entraîner/évaluer ? Minimiser le log-loss sur le jeu d'entraînement, évaluer sur le jeu de test avec l'aire sous la courbe ROC (AUC, indépendante du seuil choisi) et vérifier la calibration des probabilités. Pourquoi ce modèle ? Comme la régression linéaire, sa simplicité et son interprétabilité (coefficients = impact sur le log-odds) en font une référence indispensable en classification.",
    en: "What data/output? Numerical input variables, a probability between 0 and 1 as output (convertible to a class via a threshold, often 0.5 but not always). How to train/evaluate it? Minimize log-loss on the training set, evaluate on the test set with the area under the ROC curve (AUC, threshold-independent) and check the probabilities' calibration. Why this model? Like linear regression, its simplicity and interpretability (coefficients = impact on log-odds) make it an essential classification baseline.",
  },
  example: {
    fr: "Estimer la probabilité de défaut d'une entreprise emprunteuse à 1 an à partir de ratios financiers (levier, couverture des intérêts, liquidité) : un score de crédit interne utilise souvent une régression logistique comme brique de base, précisément parce que les coefficients restent interprétables par un comité de crédit, contrairement à un modèle boîte noire.",
    en: "Estimating a borrowing company's 1-year default probability from financial ratios (leverage, interest coverage, liquidity): an internal credit score often uses logistic regression as a base building block, precisely because the coefficients remain interpretable by a credit committee, unlike a black-box model.",
  },
  alternativeExplanation: {
    fr: "La fonction sigmoïde agit comme un \"compresseur\" : elle prend n'importe quel score réel (de -∞ à +∞ issu de la combinaison linéaire) et l'écrase dans l'intervalle [0,1], de façon à ce qu'un score très négatif donne une probabilité proche de 0, un score très positif une probabilité proche de 1, et un score nul une probabilité de 0,5 — une façon naturelle de transformer un score continu en probabilité valide.",
    en: "The sigmoid function acts as a \"compressor\": it takes any real score (from -∞ to +∞, coming from the linear combination) and squashes it into the [0,1] interval, so that a very negative score gives a probability near 0, a very positive score gives a probability near 1, and a zero score gives a probability of 0.5 — a natural way to turn a continuous score into a valid probability.",
  },
  formula: {
    latex: "p = \\sigma(X\\beta) = \\frac{1}{1 + e^{-X\\beta}}, \\quad \\mathcal{L} = -\\frac{1}{n}\\sum_i \\left[y_i \\log p_i + (1-y_i)\\log(1-p_i)\\right]",
    variables: [
      { symbol: "\\sigma(z)", description: { fr: "Fonction sigmoïde, transforme un score réel en probabilité entre 0 et 1", en: "Sigmoid function, transforms a real score into a probability between 0 and 1" } },
      { symbol: "\\mathcal{L}", description: { fr: "Log-loss (entropie croisée), la fonction de perte minimisée pendant l'entraînement", en: "Log-loss (cross-entropy), the loss function minimized during training" } },
    ],
    assumptions: { fr: "Suppose une relation linéaire entre les variables et le log-odds (logit) de l'événement, pas entre les variables et la probabilité elle-même.", en: "Assumes a linear relationship between the variables and the event's log-odds (logit), not between the variables and the probability itself." },
    units: { fr: "p sans dimension, entre 0 et 1.", en: "p dimensionless, between 0 and 1." },
    example: { fr: "Xβ=0 : p=0,5. Xβ=2 : p=1/(1+e⁻²)≈0,88. Xβ=−2 : p≈0,12.", en: "Xβ=0: p=0.5. Xβ=2: p=1/(1+e⁻²)≈0.88. Xβ=−2: p≈0.12." },
  },
  calculation: {
    fr: "1) Séparer les données en entraînement/test. 2) Ajuster β en minimisant le log-loss (par descente de gradient ou méthode de Newton). 3) Prédire une probabilité pour chaque observation du jeu de test. 4) Évaluer avec l'AUC (qualité du classement, indépendante du seuil) puis choisir un seuil de décision adapté au coût métier des faux positifs/négatifs.",
    en: "1) Split the data into training/test. 2) Fit β by minimizing log-loss (via gradient descent or Newton's method). 3) Predict a probability for each test-set observation. 4) Evaluate with AUC (ranking quality, threshold-independent) then choose a decision threshold suited to the business cost of false positives/negatives.",
  },
  pythonExample: {
    fr: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# X : ratios financiers (levier, couverture des intérêts, liquidité...)
# y : 1 si défaut observé dans l'année, 0 sinon
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)

modele = LogisticRegression(class_weight="balanced")  # compense le déséquilibre des classes
modele.fit(X_train, y_train)

probabilites = modele.predict_proba(X_test)[:, 1]  # probabilité de défaut
print("AUC :", roc_auc_score(y_test, probabilites))`,
    en: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# X: financial ratios (leverage, interest coverage, liquidity...)
# y: 1 if default observed within the year, 0 otherwise
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)

model = LogisticRegression(class_weight="balanced")  # compensates for class imbalance
model.fit(X_train, y_train)

probabilities = model.predict_proba(X_test)[:, 1]  # default probability
print("AUC:", roc_auc_score(y_test, probabilities))`,
  },
  interpretation: {
    fr: "Un coefficient positif β_j signifie que la variable j augmente le log-odds (donc la probabilité) de l'événement ; son exponentielle exp(β_j) s'interprète comme un rapport de cotes (odds ratio). Une AUC de 0,5 signifie un classement aussi bon que le hasard ; une AUC proche de 1 indique un excellent pouvoir discriminant entre les deux classes.",
    en: "A positive coefficient β_j means variable j increases the event's log-odds (and so its probability); its exponential exp(β_j) is interpreted as an odds ratio. An AUC of 0.5 means ranking as good as chance; an AUC close to 1 indicates excellent discriminative power between the two classes.",
  },
  pitfalls: {
    fr: "Utiliser systématiquement un seuil de 0,5 pour convertir la probabilité en décision, sans tenir compte du coût réel asymétrique entre faux positifs et faux négatifs (rater un défaut coûte généralement plus cher qu'un refus de crédit à tort). Autre piège : confondre une bonne AUC (bon classement relatif) avec une bonne calibration (probabilités réalistes en valeur absolue) — les deux propriétés sont différentes et doivent être vérifiées séparément.",
    en: "Systematically using a 0.5 threshold to convert the probability into a decision, without accounting for the real asymmetric cost between false positives and false negatives (missing a default is generally costlier than wrongly refusing credit). Another trap: confusing a good AUC (good relative ranking) with good calibration (realistic probabilities in absolute terms) — these are two different properties and must be checked separately.",
  },
  keyPoints: {
    fr: [
      "La régression logistique estime une probabilité via une sigmoïde appliquée à une combinaison linéaire, entraînée par minimisation du log-loss.",
      "L'AUC évalue la qualité du classement indépendamment du seuil ; la calibration évalue le réalisme des probabilités elles-mêmes.",
      "Le seuil de décision doit refléter le coût métier réel des faux positifs et faux négatifs, pas systématiquement 0,5.",
    ],
    en: [
      "Logistic regression estimates a probability via a sigmoid applied to a linear combination, trained by minimizing log-loss.",
      "AUC evaluates ranking quality independent of the threshold; calibration evaluates the probabilities' own realism.",
      "The decision threshold should reflect the real business cost of false positives and negatives, not systematically 0.5.",
    ],
  },
  advancedDemonstration: {
    fr: "Le lien entre régression logistique et pricing d'options n'est pas qu'une analogie : N(d2) dans la formule de Black-Scholes (M06-5) est structurellement une probabilité risque-neutre obtenue via la fonction de répartition normale appliquée à une combinaison de variables (d2), un mécanisme conceptuellement proche de la sigmoïde de la régression logistique — les deux transforment un score continu non borné en une probabilité valide entre 0 et 1, bien que par des fonctions différentes (normale cumulée vs. sigmoïde) et dans des cadres théoriques distincts (absence d'arbitrage vs. maximum de vraisemblance).",
    en: "The link between logistic regression and option pricing isn't just an analogy: N(d2) in the Black-Scholes formula (M06-5) is structurally a risk-neutral probability obtained via the normal CDF applied to a combination of variables (d2), a mechanism conceptually close to logistic regression's sigmoid — both transform an unbounded continuous score into a valid probability between 0 and 1, though via different functions (cumulative normal vs. sigmoid) and within distinct theoretical frameworks (no-arbitrage vs. maximum likelihood).",
  },
};
