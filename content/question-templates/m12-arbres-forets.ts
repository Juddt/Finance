import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 3): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const giniNumericTemplate: QuestionTemplate = {
  id: "m12-arbres-gini-calcul",
  conceptId: "m12-arbres-forets",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const pctClass1 = randomInt(rng, 60, 95) / 100;
    const pctClass2 = Math.round((1 - pctClass1) * 100) / 100;
    const gini = Math.round((1 - (pctClass1 ** 2 + pctClass2 ** 2)) * 1000) / 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Un nœud d'arbre de décision contient ${Math.round(pctClass1 * 100)}% d'observations de la classe "défaut" et ${Math.round(pctClass2 * 100)}% de la classe "non-défaut". Quelle est l'impureté de Gini de ce nœud ?`,
        en: `A decision tree node contains ${Math.round(pctClass1 * 100)}% of "default" class observations and ${Math.round(pctClass2 * 100)}% of "non-default" class. What is this node's Gini impurity?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.01",
      hint: { fr: "Gini = 1 − Σp_k².", en: "Gini = 1 − Σp_k²." },
      numeric: { value: gini, tolerance: 0.01 },
      calculation: {
        fr: `Gini = 1 − (${fmt(pctClass1, "fr", 2)}² + ${fmt(pctClass2, "fr", 2)}²) = ${fmt(gini, "fr")}.`,
        en: `Gini = 1 − (${fmt(pctClass1, "en", 2)}² + ${fmt(pctClass2, "en", 2)}²) = ${fmt(gini, "en")}.`,
      },
      explanation: {
        fr: "Plus un nœud est \"pur\" (dominé par une seule classe), plus son Gini est proche de 0 ; un nœud parfaitement équilibré entre deux classes a un Gini de 0,5.",
        en: "The \"purer\" a node (dominated by a single class), the closer its Gini is to 0; a node perfectly balanced between two classes has a Gini of 0.5.",
      },
      commonMistake: {
        fr: "Oublier d'élever chaque proportion au carré avant de les additionner et de soustraire de 1.",
        en: "Forgetting to square each proportion before summing and subtracting from 1.",
      },
    };
  },
};

const overfittingSingleTreeTemplate: QuestionTemplate = {
  id: "m12-arbres-surapprentissage-arbre-unique",
  conceptId: "m12-arbres-forets",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un arbre de décision unique, sans limite de profondeur, finit généralement par mémoriser les données d'entraînement plutôt que d'apprendre un motif généralisable.",
      en: "A single decision tree, with no depth limit, generally ends up memorizing the training data rather than learning a generalizable pattern.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : un arbre sans contrainte de profondeur peut continuer à se découper jusqu'à isoler chaque observation individuellement, un cas extrême de surapprentissage.",
      en: "True: a tree with no depth constraint can keep splitting until it isolates each observation individually, an extreme overfitting case.",
    },
    commonMistake: {
      fr: "Croire qu'un arbre de décision est intrinsèquement robuste au surapprentissage sans nécessiter de contrainte de profondeur.",
      en: "Believing a decision tree is inherently robust to overfitting without needing a depth constraint.",
    },
  }),
};

const randomForestVsTreeTemplate: QuestionTemplate = {
  id: "m12-arbres-foret-vs-arbre",
  conceptId: "m12-arbres-forets",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pourquoi une forêt aléatoire réduit-elle la variance par rapport à un arbre unique ?",
      en: "Why does a random forest reduce variance compared to a single tree?",
    },
    choices: buildChoices([
      { id: "average", label: { fr: "Elle moyenne les prédictions de nombreux arbres décorrélés entraînés sur des échantillons différents", en: "It averages the predictions of many decorrelated trees trained on different samples" } },
      { id: "deeper", label: { fr: "Elle utilise un seul arbre mais beaucoup plus profond", en: "It uses a single tree but much deeper" } },
    ]),
    hint: { fr: "Le mot clé est \"ensemble\" : plusieurs modèles combinés, pas un seul modèle plus complexe.", en: "The key word is \"ensemble\": several combined models, not one more complex model." },
    correctChoiceIds: ["average"],
    explanation: {
      fr: "Une forêt aléatoire entraîne de nombreux arbres sur des échantillons bootstrap différents avec un sous-ensemble aléatoire de variables à chaque split, puis moyenne leurs prédictions — cette moyenne réduit la variance sans augmenter significativement le biais, à condition que les arbres soient suffisamment décorrélés.",
      en: "A random forest trains many trees on different bootstrap samples with a random variable subset at each split, then averages their predictions — this averaging reduces variance without significantly increasing bias, provided the trees are sufficiently decorrelated.",
    },
    commonMistake: {
      fr: "Croire qu'une forêt aléatoire n'est qu'un arbre plus profond ou plus complexe, plutôt qu'un ensemble de plusieurs modèles.",
      en: "Believing a random forest is just a deeper or more complex tree, rather than an ensemble of several models.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m12-arbres-vocab",
  conceptId: "m12-arbres-forets",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'erreur calculée automatiquement sur les observations non utilisées dans chaque arbre bootstrap d'une forêt aléatoire s'appelle l'erreur ______.",
      en: "The error automatically computed on the observations not used in each bootstrap tree of a random forest is called the ______ error.",
    },
    fillBlankPlaceholder: { fr: "un terme (2 mots ou une abréviation)", en: "one term (2 words or an abbreviation)" },
    acceptedAnswers: ["out-of-bag", "oob", "out of bag"],
    hint: { fr: "Littéralement « hors du sac » (bootstrap).", en: "Literally \"out of the bag\" (bootstrap)." },
    explanation: {
      fr: "L'erreur out-of-bag (OOB) est calculée sur les observations exclues de l'échantillon bootstrap de chaque arbre, offrant une estimation de la performance de généralisation sans avoir besoin d'un jeu de test séparé.",
      en: "The out-of-bag (OOB) error is computed on the observations excluded from each tree's bootstrap sample, giving a generalization performance estimate without needing a separate test set.",
    },
    commonMistake: {
      fr: "Confondre cette erreur avec l'erreur d'entraînement classique, calculée sur toutes les observations utilisées par chaque arbre.",
      en: "Confusing this error with the classic training error, computed on all observations used by each tree.",
    },
  }),
};

export const templates: QuestionTemplate[] = [giniNumericTemplate, overfittingSingleTreeTemplate, randomForestVsTreeTemplate, vocabTemplate];
