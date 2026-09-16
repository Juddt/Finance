import type { ConceptDef } from "../types";

/**
 * Chaque famille répond obligatoirement à (voir doc section M12) : quel problème ?
 * quand l'utiliser / l'éviter ? pourquoi ce modèle ? quelles données/sortie ?
 * comment l'entraîner/évaluer ? quelles erreurs éviter ? + exemple financier et
 * mini-code Python commenté. Ce contrat est porté par le futur contenu de leçon,
 * pas par les métadonnées de catalogue ci-dessous.
 */
export const m12: ConceptDef[] = [
  {
    id: "m12-regression-lineaire",
    chapterId: "m12",
    sourceRef: "M12-1",
    level: "essential",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Régression linéaire", en: "Linear regression" },
    objective: {
      fr: "Prédire une quantité continue : interprétation, hypothèses, régularisation et limites.",
      en: "Predict a continuous quantity: interpretation, assumptions, regularization and limits.",
    },
  },
  {
    id: "m12-regression-logistique",
    chapterId: "m12",
    sourceRef: "M12-2",
    level: "essential",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Régression logistique", en: "Logistic regression" },
    objective: {
      fr: "Classer/estimer une probabilité, différencier de la régression linéaire, calibrer le modèle.",
      en: "Classify/estimate a probability, differentiate from linear regression, calibrate the model.",
    },
  },
  {
    id: "m12-arbres-forets",
    chapterId: "m12",
    sourceRef: "M12-3",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Arbres de décision et forêts aléatoires", en: "Decision trees & random forests" },
    objective: {
      fr: "Capturer des non-linéarités, évaluer interprétabilité, surapprentissage et compromis.",
      en: "Capture non-linearities, assess interpretability, overfitting and trade-offs.",
    },
  },
  {
    id: "m12-series-temporelles",
    chapterId: "m12",
    sourceRef: "M12-4",
    level: "advanced",
    estimatedMinutes: 9,
    status: "published",
    title: { fr: "Séries temporelles : AR/ARIMA, GARCH", en: "Time series: AR/ARIMA, GARCH" },
    objective: {
      fr: "Modéliser dépendance temporelle et stationnarité ; introduire AR/ARIMA, GARCH et validation chronologique, en distinguant économétrie et machine learning.",
      en: "Model temporal dependence and stationarity; introduce AR/ARIMA, GARCH and chronological validation, distinguishing econometrics from machine learning.",
    },
  },
  {
    id: "m12-knn-svm",
    chapterId: "m12",
    sourceRef: "M12-5",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "KNN et SVM/SVR", en: "KNN & SVM/SVR" },
    objective: {
      fr: "Utiliser la proximité (KNN, normalisation, dimension) et les marges/noyaux (SVM/SVR) pour classer ou régresser.",
      en: "Use proximity (KNN, normalization, dimensionality) and margins/kernels (SVM/SVR) for classification or regression.",
    },
  },
  {
    id: "m12-deep-learning-intro",
    chapterId: "m12",
    sourceRef: "M12-6",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Introduction au deep learning", en: "Introduction to deep learning" },
    objective: {
      fr: "Présenter réseaux de neurones, entraînement, modèles séquentiels, besoins en données et raisons de préférer parfois un modèle simple.",
      en: "Present neural networks, training, sequential models, data requirements and reasons to sometimes prefer a simple model.",
    },
  },
  {
    id: "m12-methodologie-ml",
    chapterId: "m12",
    sourceRef: "M12-cross",
    level: "essential",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Méthodologie et bonnes pratiques du ML en finance", en: "Methodology & best practices for ML in finance" },
    objective: {
      fr: "Appliquer train/validation/test chronologiques, walk-forward, fuite de données, biais de survivance, overfitting, métriques adaptées, benchmark naïf et coûts de transaction, sans promettre de prédire les marchés.",
      en: "Apply chronological train/validation/test splits, walk-forward, data leakage, survivorship bias, overfitting, adapted metrics, naive benchmark and transaction costs, without promising to predict markets.",
    },
  },
];
