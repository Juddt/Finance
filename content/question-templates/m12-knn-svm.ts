import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const marginNumericTemplate: QuestionTemplate = {
  id: "m12-knn-svm-marge-calcul",
  conceptId: "m12-knn-svm",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const normW = randomInt(rng, 10, 50) / 10;
    const margin = Math.round((2 / normW) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un SVM entraîné a un vecteur de poids w tel que ‖w‖ = ${normW.toFixed(1)}. Quelle est la marge géométrique entre les deux classes ?`,
        en: `A trained SVM has a weight vector w such that ‖w‖ = ${normW.toFixed(1)}. What is the geometric margin between the two classes?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.05",
      hint: { fr: "Marge = 2 / ‖w‖.", en: "Margin = 2 / ‖w‖." },
      numeric: { value: margin, tolerance: 0.05 },
      calculation: {
        fr: `Marge = 2 / ${normW.toFixed(1)} ≈ ${margin.toFixed(2)}.`,
        en: `Margin = 2 / ${normW.toFixed(1)} ≈ ${margin.toFixed(2)}.`,
      },
      explanation: {
        fr: "Le SVM minimise ‖w‖, ce qui revient exactement à maximiser la marge 2/‖w‖ entre les deux classes.",
        en: "The SVM minimizes ‖w‖, which is exactly equivalent to maximizing the margin 2/‖w‖ between the two classes.",
      },
      commonMistake: {
        fr: "Oublier le facteur 2 au numérateur, ou inverser numérateur et dénominateur.",
        en: "Forgetting the factor of 2 in the numerator, or swapping numerator and denominator.",
      },
    };
  },
};

const normalizationTemplate: QuestionTemplate = {
  id: "m12-knn-svm-normalisation",
  conceptId: "m12-knn-svm",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Il est indispensable de normaliser les variables (même échelle) avant d'entraîner un KNN ou un SVM.",
      en: "It is essential to normalize variables (same scale) before training a KNN or an SVM.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : sans normalisation, une variable à grande échelle (par exemple un chiffre d'affaires en millions) dominerait artificiellement toute mesure de distance (KNN) ou de marge (SVM).",
      en: "True: without normalization, a large-scale variable (e.g. revenue in millions) would artificially dominate any distance measure (KNN) or margin (SVM).",
    },
    commonMistake: {
      fr: "Croire que la normalisation n'est nécessaire que pour les réseaux de neurones, pas pour KNN/SVM.",
      en: "Believing normalization is only needed for neural networks, not for KNN/SVM.",
    },
  }),
};

const kernelTrickTemplate: QuestionTemplate = {
  id: "m12-knn-svm-astuce-noyau",
  conceptId: "m12-knn-svm",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Que permet l'astuce du noyau (kernel trick) dans un SVM ?",
      en: "What does the kernel trick allow in an SVM?",
    },
    choices: buildChoices([
      { id: "implicit", label: { fr: "Séparer des classes non-linéairement séparables, sans transformer explicitement les données dans un espace de dimension supérieure", en: "Separate non-linearly separable classes, without explicitly transforming the data into a higher-dimensional space" } },
      { id: "reduce-dim", label: { fr: "Réduire le nombre de variables avant l'entraînement", en: "Reduce the number of variables before training" } },
    ]),
    hint: { fr: "L'astuce évite de calculer explicitement φ(x), en calculant directement un produit scalaire équivalent.", en: "The trick avoids explicitly computing φ(x), by directly computing an equivalent dot product." },
    correctChoiceIds: ["implicit"],
    explanation: {
      fr: "L'astuce du noyau calcule directement le produit scalaire dans un espace de dimension supérieure via une fonction noyau K(x_i,x_j), sans jamais transformer explicitement les données — ce qui permet des frontières de décision non-linéaires à un coût de calcul maîtrisé.",
      en: "The kernel trick directly computes the dot product in a higher-dimensional space via a kernel function K(x_i,x_j), without ever explicitly transforming the data — enabling non-linear decision boundaries at a controlled computational cost.",
    },
    commonMistake: {
      fr: "Croire que l'astuce du noyau réduit la dimensionnalité, alors qu'elle permet au contraire de travailler implicitement dans un espace de dimension supérieure.",
      en: "Believing the kernel trick reduces dimensionality, when it instead enables implicit work in a higher-dimensional space.",
    },
  }),
};

const curseOfDimensionalityTemplate: QuestionTemplate = {
  id: "m12-knn-svm-vocab",
  conceptId: "m12-knn-svm",
  kind: "fill_blank",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const variant = pick(rng, ["curse", "lazy"] as const);
    return {
      prompt: variant === "curse"
        ? { fr: "En haute dimension, la notion de \"plus proche voisin\" devient peu significative, un phénomène appelé le ______ de la dimension.", en: "In high dimensions, the notion of \"nearest neighbor\" becomes poorly meaningful, a phenomenon called the ______ of dimensionality." }
        : { fr: "KNN, qui ne construit aucun modèle à l'entraînement et fait tout le calcul à la prédiction, est un exemple d'apprentissage ______.", en: "KNN, which builds no model at training time and does all the computation at prediction time, is an example of ______ learning." },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: variant === "curse" ? ["fleau", "fléau", "curse"] : ["paresseux", "lazy"],
      hint: { fr: "Le même terme que dans le glossaire de la leçon.", en: "The same term as in the lesson's glossary." },
      explanation: variant === "curse"
        ? { fr: "Le \"fléau de la dimension\" désigne le fait qu'en haute dimension, presque tous les points finissent à une distance similaire les uns des autres, rendant la proximité peu discriminante.", en: "The \"curse of dimensionality\" denotes the fact that in high dimensions, almost all points end up at a similar distance from each other, making proximity poorly discriminating." }
        : { fr: "L'apprentissage paresseux (lazy learning) désigne une approche comme KNN qui reporte tout le calcul au moment de la prédiction, sans phase d'entraînement à proprement parler.", en: "Lazy learning denotes an approach like KNN that defers all computation to prediction time, with no real training phase." },
      commonMistake: {
        fr: "Confondre ce terme avec le surapprentissage, qui est un phénomène différent.",
        en: "Confusing this term with overfitting, a different phenomenon.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [marginNumericTemplate, normalizationTemplate, kernelTrickTemplate, curseOfDimensionalityTemplate];
