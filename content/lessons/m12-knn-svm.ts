import type { LessonContent } from "@/lib/lesson-types";

export const m12KnnSvm: LessonContent = {
  conceptId: "m12-knn-svm",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les arbres de décision, pour comparer différentes façons de capturer des non-linéarités.",
      en: "You need to know decision trees, to compare different ways of capturing non-linearities.",
    },
    conceptIds: ["m12-arbres-forets"],
  },
  glossary: [
    { term: { fr: "Apprentissage paresseux (lazy learning)", en: "Lazy learning" }, definition: { fr: "Une approche (comme KNN) qui ne construit aucun modèle à l'entraînement : toute la mémorisation des données et le calcul ont lieu au moment de la prédiction.", en: "An approach (like KNN) that builds no model at training time: all data memorization and computation happen at prediction time." } },
    { term: { fr: "Astuce du noyau (kernel trick)", en: "Kernel trick" }, definition: { fr: "Une technique qui permet à un SVM de séparer des classes non-linéairement séparables, en calculant implicitement une similarité dans un espace de dimension supérieure sans jamais y transformer explicitement les données.", en: "A technique letting an SVM separate non-linearly separable classes, by implicitly computing a similarity in a higher-dimensional space without ever explicitly transforming the data into it." } },
  ],
  intuition: {
    fr: "KNN et SVM abordent la classification depuis deux angles très différents : KNN classe une observation selon ses voisins les plus proches dans l'espace des variables, sans jamais vraiment \"apprendre\" de modèle ; SVM cherche au contraire la frontière de décision qui sépare les classes avec la marge la plus large possible, un objectif géométrique explicite.",
    en: "KNN and SVM approach classification from two very different angles: KNN classifies an observation based on its nearest neighbors in variable space, without ever really \"learning\" a model; SVM instead looks for the decision boundary separating classes with the widest possible margin, an explicit geometric objective.",
  },
  definition: {
    fr: "Quel problème ? Classer (ou prédire une valeur continue pour SVR) en se basant sur la proximité entre observations (KNN) ou sur une séparation géométrique optimale (SVM). Quand utiliser KNN ? Sur des données de dimension modérée avec une notion de distance significative. Quand l'éviter ? En haute dimension (la notion de \"proximité\" perd son sens, le fléau de la dimension) ou sur de très grands jeux de données (chaque prédiction nécessite de comparer à toutes les observations d'entraînement). Quand utiliser SVM ? Sur des données de dimension modérée à élevée, en particulier si les classes ne sont pas linéairement séparables (via l'astuce du noyau, qui projette implicitement les données dans un espace où elles le deviennent). Quand l'éviter ? Sur de très grands jeux de données (SVM devient coûteux à entraîner) ou quand une interprétabilité directe est requise.",
    en: "What problem? Classifying (or predicting a continuous value for SVR) based on proximity between observations (KNN) or on an optimal geometric separation (SVM). When to use KNN? On moderate-dimensional data with a meaningful notion of distance. When to avoid it? In high dimensions (the notion of \"proximity\" loses meaning, the curse of dimensionality) or on very large datasets (each prediction requires comparing to all training observations). When to use SVM? On moderate-to-high-dimensional data, especially if classes aren't linearly separable (via the kernel trick, which implicitly projects the data into a space where they become so). When to avoid it? On very large datasets (SVM becomes costly to train) or when direct interpretability is required.",
  },
  utility: {
    fr: "Quelles données/sortie ? Des variables numériques impérativement normalisées (même échelle) en entrée, une classe (ou une valeur continue pour KNN-régression/SVR) en sortie. Comment l'entraîner/évaluer ? KNN n'a pas de phase d'entraînement à proprement parler (juste stocker les données) mais nécessite de choisir K par validation croisée ; SVM s'entraîne en résolvant un problème d'optimisation (maximiser la marge), avec deux hyperparamètres clés à régler par validation croisée : C (tolérance aux erreurs de classification) et le choix/paramètre du noyau. Pourquoi ces modèles ? Ils offrent des frontières de décision non-linéaires sans passer par la structure arborescente des forêts aléatoires, une alternative utile quand la géométrie du problème s'y prête mieux.",
    en: "What data/output? Numerical variables that must be normalized (same scale) as input, a class (or a continuous value for KNN regression/SVR) as output. How to train/evaluate it? KNN has no real training phase (just storing the data) but requires choosing K via cross-validation; SVM trains by solving an optimization problem (maximizing the margin), with two key hyperparameters to tune via cross-validation: C (tolerance to classification errors) and the kernel choice/parameter. Why these models? They offer non-linear decision boundaries without going through random forests' tree structure, a useful alternative when the problem's geometry suits it better.",
  },
  example: {
    fr: "Classer un nouvel émetteur (levier=2,2 ; rentabilité=14%, ratios déjà normalisés) par KNN avec K=3, à partir de 4 émetteurs déjà classés : Émetteur 1 (2,0 ; 15%, \"risque faible\"), Émetteur 2 (2,5 ; 12%, \"risque faible\"), Émetteur 3 (6,0 ; 3%, \"risque élevé\"), Émetteur 4 (7,0 ; 2%, \"risque élevé\"). Distances euclidiennes au nouvel émetteur : d1=√(0,2²+1²)≈1,02 ; d2=√(0,3²+2²)≈2,02 ; d3=√(3,8²+11²)≈11,64 ; d4=√(4,8²+12²)≈12,92. Les 3 plus proches voisins sont 1, 2 puis 3 : majorité \"risque faible\" (2 voix contre 1) → le nouvel émetteur est classé \"risque faible\".",
    en: "Classifying a new issuer (leverage=2.2; profitability=14%, ratios already normalized) via KNN with K=3, from 4 already-classified issuers: Issuer 1 (2.0; 15%, \"low risk\"), Issuer 2 (2.5; 12%, \"low risk\"), Issuer 3 (6.0; 3%, \"high risk\"), Issuer 4 (7.0; 2%, \"high risk\"). Euclidean distances to the new issuer: d1=√(0.2²+1²)≈1.02; d2=√(0.3²+2²)≈2.02; d3=√(3.8²+11²)≈11.64; d4=√(4.8²+12²)≈12.92. The 3 nearest neighbors are 1, 2 then 3: majority \"low risk\" (2 votes to 1) → the new issuer is classified \"low risk\".",
  },
  alternativeExplanation: {
    fr: "KNN, c'est comme deviner le quartier d'une maison inconnue en regardant simplement les quartiers de ses voisines les plus proches sur une carte — aucune règle générale n'est apprise, juste une comparaison directe. SVM, c'est comme tracer la route la plus large possible entre deux quartiers rivaux sur cette même carte, en s'assurant qu'elle reste équidistante des maisons les plus proches de chaque côté — une frontière explicite et optimisée, pas une simple comparaison locale.",
    en: "KNN is like guessing an unknown house's neighborhood by simply looking at the neighborhoods of its nearest neighbors on a map — no general rule is learned, just a direct comparison. SVM is like drawing the widest possible road between two rival neighborhoods on that same map, making sure it stays equidistant from the closest houses on each side — an explicit, optimized boundary, not a simple local comparison.",
  },
  formula: {
    latex: "\\min_{w,b} \\frac{1}{2}\\|w\\|^2 \\quad \\text{sous} \\quad y_i(w^\\top x_i + b) \\ge 1 \\; \\forall i",
    variables: [
      { symbol: "w, b", description: { fr: "Vecteur normal et biais définissant l'hyperplan séparateur", en: "Normal vector and bias defining the separating hyperplane" } },
      { symbol: "\\frac{2}{\\|w\\|}", description: { fr: "La marge géométrique entre les deux classes, que le SVM cherche à maximiser (équivalent à minimiser ‖w‖)", en: "The geometric margin between the two classes, which the SVM seeks to maximize (equivalent to minimizing ‖w‖)" } },
    ],
    assumptions: { fr: "SVM à marge dure (séparation parfaite) ; en pratique, une version à marge souple avec le paramètre C tolère des erreurs de classification pour rester robuste au bruit.", en: "Hard-margin SVM (perfect separation); in practice, a soft-margin version with parameter C tolerates classification errors to stay robust to noise." },
    units: { fr: "Sans dimension.", en: "Dimensionless." },
    example: { fr: "Avec w=(0,5 ; 0,5), ‖w‖=√0,5≈0,707, marge=2/0,707≈2,83. Avec un autre séparateur w=(1 ; 1), ‖w‖=√2≈1,414, marge=2/1,414≈1,41 : le premier séparateur offre une marge deux fois plus large, donc le SVM le préfère strictement.", en: "With w=(0.5, 0.5), ‖w‖=√0.5≈0.707, margin=2/0.707≈2.83. With another separator w=(1, 1), ‖w‖=√2≈1.414, margin=2/1.414≈1.41: the first separator gives a margin twice as wide, so the SVM strictly prefers it." },
  },
  chart: {
    kind: "scatter",
    xLabel: { fr: "Levier normalisé", en: "Normalized leverage" },
    yLabel: { fr: "Rentabilité normalisée (%)", en: "Normalized profitability (%)" },
    points: [
      { x: 2.0, y: 15 },
      { x: 2.5, y: 12 },
      { x: 6.0, y: 3 },
      { x: 7.0, y: 2 },
      { x: 2.2, y: 14 },
    ],
  },
  calculation: {
    fr: "1) Normaliser impérativement toutes les variables (moyenne 0, écart-type 1) avant KNN ou SVM, sous peine que les variables à grande échelle dominent artificiellement la distance ou la marge. 2) Pour KNN : choisir K par validation croisée (K trop petit = surapprentissage au bruit, K trop grand = frontière trop lisse) — avec K=3 dans notre exemple, les 3 plus proches voisins votent \"risque faible\" à 2 contre 1. 3) Pour SVM : choisir le noyau (linéaire, RBF, polynomial) et régler C et les paramètres du noyau par validation croisée (recherche en grille) — le séparateur à ‖w‖=0,707 (marge 2,83) est préféré à celui à ‖w‖=1,414 (marge 1,41). 4) Évaluer sur un jeu de test avec les métriques adaptées (AUC, précision/rappel).",
    en: "1) Always normalize every variable (mean 0, standard deviation 1) before KNN or SVM, or large-scale variables will artificially dominate the distance or margin. 2) For KNN: choose K via cross-validation (K too small = overfitting to noise, K too large = an overly smooth boundary) — with K=3 in our example, the 3 nearest neighbors vote \"low risk\" 2 to 1. 3) For SVM: choose the kernel (linear, RBF, polynomial) and tune C and kernel parameters via cross-validation (grid search) — the separator with ‖w‖=0.707 (margin 2.83) is preferred over the one with ‖w‖=1.414 (margin 1.41). 4) Evaluate on a test set with suitable metrics (AUC, precision/recall).",
  },
  pythonExample: {
    fr: `from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

# La normalisation (StandardScaler) est indispensable avant KNN/SVM
pipeline = make_pipeline(StandardScaler(), SVC(kernel="rbf", probability=True))

grille = {"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.01, 0.1]}
recherche = GridSearchCV(pipeline, grille, cv=5, scoring="roc_auc")
recherche.fit(X_train, y_train)

print("Meilleurs paramètres :", recherche.best_params_)
print("AUC (validation croisée) :", recherche.best_score_)`,
    en: `from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

# Normalization (StandardScaler) is essential before KNN/SVM
pipeline = make_pipeline(StandardScaler(), SVC(kernel="rbf", probability=True))

grid = {"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.01, 0.1]}
search = GridSearchCV(pipeline, grid, cv=5, scoring="roc_auc")
search.fit(X_train, y_train)

print("Best params:", search.best_params_)
print("AUC (cross-validation):", search.best_score_)`,
  },
  interpretation: {
    fr: "Pour KNN, un K faible donne une frontière de décision très irrégulière (sensible au bruit local), un K élevé donne une frontière plus lisse mais potentiellement trop simpliste. Pour SVM, un C élevé pénalise fortement les erreurs de classification (marge plus étroite, risque de surapprentissage), un C faible tolère plus d'erreurs (marge plus large, risque de sous-apprentissage) — les deux hyperparamètres contrôlent le même compromis biais-variance sous des formes différentes.",
    en: "For KNN, a small K gives a very irregular decision boundary (sensitive to local noise), a large K gives a smoother but potentially too simplistic boundary. For SVM, a high C heavily penalizes classification errors (narrower margin, overfitting risk), a low C tolerates more errors (wider margin, underfitting risk) — both hyperparameters control the same bias-variance trade-off in different forms.",
  },
  pitfalls: {
    fr: "Oublier de normaliser les variables avant KNN ou SVM : une variable à grande échelle (par exemple un chiffre d'affaires en millions à côté d'un ratio entre 0 et 1) dominerait artificiellement toute mesure de distance ou de marge. Autre piège spécifique à KNN : l'appliquer naïvement en haute dimension (beaucoup de variables), où la notion de \"proximité\" devient statistiquement peu significative (fléau de la dimension) — presque toutes les observations finissent à une distance similaire les unes des autres.",
    en: "Forgetting to normalize variables before KNN or SVM: a large-scale variable (e.g. revenue in millions next to a ratio between 0 and 1) would artificially dominate any distance or margin measure. Another KNN-specific trap: naively applying it in high dimensions (many variables), where the notion of \"proximity\" becomes statistically meaningless (the curse of dimensionality) — almost all observations end up at a similar distance from each other.",
  },
  keyPoints: {
    fr: [
      "KNN classe par proximité aux voisins les plus proches, sans modèle appris explicitement (apprentissage paresseux).",
      "SVM cherche la frontière de séparation à marge maximale, avec l'astuce du noyau pour des frontières non-linéaires.",
      "Normaliser les variables est indispensable pour les deux modèles, sous peine de fausser distance et marge.",
    ],
    en: [
      "KNN classifies by proximity to the nearest neighbors, with no explicitly learned model (lazy learning).",
      "SVM looks for the maximum-margin separating boundary, with the kernel trick for non-linear boundaries.",
      "Normalizing variables is essential for both models, or distance and margin get distorted.",
    ],
  },
  advancedDemonstration: {
    fr: "L'astuce du noyau repose sur un résultat mathématique élégant : plutôt que de transformer explicitement chaque observation x dans un espace de dimension beaucoup plus grande φ(x) (coûteux, voire de dimension infinie pour le noyau RBF), il suffit de calculer directement le produit scalaire dans cet espace via une fonction noyau K(x_i, x_j) = φ(x_i)·φ(x_j), sans jamais calculer φ(x) explicitement — car la solution du SVM ne dépend des données que via ces produits scalaires. Le fléau de la dimension affectant KNN a une origine quantitative précise : dans un espace à d dimensions, le volume d'une coquille proche de la frontière d'un hypercube croît relativement au volume total à mesure que d augmente, si bien que presque tous les points finissent \"proches du bord\" et les distances entre points deviennent presque toutes similaires, rendant le concept même de \"plus proche voisin\" peu discriminant.",
    en: "The kernel trick relies on an elegant mathematical result: rather than explicitly transforming each observation x into a much higher-dimensional space φ(x) (costly, even infinite-dimensional for the RBF kernel), it suffices to directly compute the dot product in that space via a kernel function K(x_i, x_j) = φ(x_i)·φ(x_j), without ever explicitly computing φ(x) — since the SVM's solution depends on the data only through these dot products. The curse of dimensionality affecting KNN has a precise quantitative origin: in a d-dimensional space, the volume of a shell near a hypercube's boundary grows relative to the total volume as d increases, so almost all points end up \"near the edge\" and distances between points become nearly all similar, making the very concept of \"nearest neighbor\" poorly discriminating.",
  },
  businessApplication: {
    fr: "Un analyste crédit utilise KNN pour trouver rapidement les \"comparables\" les plus proches d'un nouvel émetteur non noté, en s'appuyant sur ses ratios financiers, afin de proposer une fourchette de notation ou de spread cohérente avec le marché ; un desk de trading algorithmique peut utiliser un SVM pour classer en temps réel un régime de marché (tendanciel vs. agité) à partir de plusieurs indicateurs, afin d'activer automatiquement la stratégie adaptée.",
    en: "A credit analyst uses KNN to quickly find the closest \"comparables\" to a new unrated issuer, based on its financial ratios, to propose a rating or spread range consistent with the market; an algorithmic trading desk can use an SVM to classify a market regime in real time (trending vs. choppy) from several indicators, to automatically switch on the matching strategy.",
  },
  interviewQuestion: {
    question: "When would you reach for KNN versus an SVM for a classification problem, and what's the one preprocessing step you must never skip for either?",
    answer: "KNN is my go-to when I want something simple and interpretable, on moderate-dimensional data with a meaningful distance, and I don't mind the cost of comparing against the full training set at prediction time. SVM is better when I suspect the true decision boundary isn't linear but the data isn't huge, since the kernel trick lets me capture non-linear boundaries without exploding computation. The one step I'd never skip for either: normalizing every variable to the same scale first. If one feature is measured in millions and another is a ratio between 0 and 1, it will dominate the distance calculation in KNN or the margin in SVM, making the model's decisions driven by units rather than by actual signal — I'd standardize everything to mean 0, standard deviation 1 before fitting either model.",
  },
};
