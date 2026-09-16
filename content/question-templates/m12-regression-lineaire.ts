import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const predictionNumericTemplate: QuestionTemplate = {
  id: "m12-regression-lineaire-prediction",
  conceptId: "m12-regression-lineaire",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const b0 = randomInt(rng, 10, 50) / 10;
    const b1 = randomInt(rng, 5, 30) / 10;
    const x = randomInt(rng, 2, 10);
    const pred = Math.round((b0 + b1 * x) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un modèle de régression linéaire simple estime : rendement prédit = ${fmt(b0, "fr")} + ${fmt(b1, "fr")} × duration. Pour une duration de ${x}, quelle est la prédiction du modèle ?`,
        en: `A simple linear regression model estimates: predicted yield = ${fmt(b0, "en")} + ${fmt(b1, "en")} × duration. For a duration of ${x}, what is the model's prediction?`,
      },
      numericUnit: { fr: "même unité que la cible", en: "same unit as the target" },
      numericTolerance: "± 0.1",
      hint: { fr: "Remplacez simplement x par la valeur donnée dans β0 + β1×x.", en: "Simply substitute x with the given value in β0 + β1×x." },
      numeric: { value: pred, tolerance: 0.1 },
      calculation: {
        fr: `Prédiction = ${fmt(b0, "fr")} + ${fmt(b1, "fr")} × ${x} = ${fmt(pred, "fr")}.`,
        en: `Prediction = ${fmt(b0, "en")} + ${fmt(b1, "en")} × ${x} = ${fmt(pred, "en")}.`,
      },
      explanation: {
        fr: "Une fois les coefficients β estimés par entraînement, la prédiction pour une nouvelle observation est simplement l'évaluation directe de la combinaison linéaire.",
        en: "Once the β coefficients are estimated through training, the prediction for a new observation is simply the direct evaluation of the linear combination.",
      },
      commonMistake: {
        fr: "Inverser β0 (l'ordonnée à l'origine) et β1 (la pente) dans le calcul.",
        en: "Swapping β0 (the intercept) and β1 (the slope) in the calculation.",
      },
    };
  },
};

const evaluationSplitTemplate: QuestionTemplate = {
  id: "m12-regression-lineaire-evaluation",
  conceptId: "m12-regression-lineaire",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Évaluer un modèle de régression linéaire sur les mêmes données que celles utilisées pour l'entraîner donne une estimation fiable de sa performance réelle.",
      en: "Evaluating a linear regression model on the same data used to train it gives a reliable estimate of its real performance.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : évaluer sur les données d'entraînement surestime systématiquement la performance, car le modèle a été ajusté précisément pour bien coller à ces données. Il faut toujours évaluer sur un jeu de test séparé.",
      en: "False: evaluating on the training data systematically overstates performance, since the model was fitted precisely to fit that data well. Evaluation must always happen on a separate test set.",
    },
    commonMistake: {
      fr: "Croire qu'un bon score sur les données d'entraînement garantit une bonne généralisation à de nouvelles données.",
      en: "Believing a good score on training data guarantees good generalization to new data.",
    },
  }),
};

const regularizationEffectTemplate: QuestionTemplate = {
  id: "m12-regression-lineaire-regularisation",
  conceptId: "m12-regression-lineaire",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const type = pick(rng, ["ridge", "lasso"] as const);
    return {
      prompt: type === "ridge"
        ? { fr: "Augmenter λ dans une régression Ridge a quel effet sur les coefficients β ?", en: "Increasing λ in a Ridge regression has what effect on the β coefficients?" }
        : { fr: "Contrairement à Ridge, quelle propriété distinctive a la régularisation Lasso ?", en: "Unlike Ridge, what distinctive property does Lasso regularization have?" },
      choices: type === "ridge"
        ? buildChoices([
            { id: "shrink", label: { fr: "Il les rétrécit vers zéro", en: "It shrinks them toward zero" } },
            { id: "grow", label: { fr: "Il les fait croître sans limite", en: "It makes them grow without limit" } },
          ])
        : buildChoices([
            { id: "zero", label: { fr: "Il peut mettre certains coefficients exactement à zéro (sélection de variables)", en: "It can set some coefficients exactly to zero (variable selection)" } },
            { id: "never-zero", label: { fr: "Il rétrécit les coefficients mais ne les annule jamais exactement", en: "It shrinks coefficients but never sets them exactly to zero" } },
          ]),
      hint: { fr: "Pensez au rôle de la pénalité L2 (Ridge) vs. L1 (Lasso).", en: "Think about the role of the L2 (Ridge) vs. L1 (Lasso) penalty." },
      correctChoiceIds: type === "ridge" ? ["shrink"] : ["zero"],
      explanation: type === "ridge"
        ? { fr: "Plus λ est grand, plus la pénalité sur Σβ² est forte, ce qui rétrécit systématiquement les coefficients vers zéro sans jamais les annuler exactement.", en: "The larger λ, the stronger the penalty on Σβ², systematically shrinking coefficients toward zero without ever exactly zeroing them." }
        : { fr: "La pénalité L1 de Lasso (Σ|β|) peut mettre certains coefficients exactement à zéro, réalisant une sélection automatique de variables, une propriété que Ridge n'a pas.", en: "Lasso's L1 penalty (Σ|β|) can set some coefficients exactly to zero, performing automatic variable selection, a property Ridge lacks." },
      commonMistake: {
        fr: "Confondre les effets de Ridge (rétrécissement continu) et Lasso (sélection de variables par annulation exacte).",
        en: "Confusing Ridge's effect (continuous shrinkage) with Lasso's (variable selection via exact zeroing).",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m12-regression-lineaire-vocab",
  conceptId: "m12-regression-lineaire",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un modèle qui colle trop précisément aux données d'entraînement, au point de mal généraliser, souffre de ______.",
      en: "A model that fits the training data too closely, to the point of generalizing poorly, suffers from ______.",
    },
    fillBlankPlaceholder: { fr: "un terme", en: "one term" },
    acceptedAnswers: ["surapprentissage", "overfitting"],
    hint: { fr: "Le contraire du sous-apprentissage.", en: "The opposite of underfitting." },
    explanation: {
      fr: "Le surapprentissage (overfitting) désigne un modèle trop ajusté aux particularités (y compris le bruit) des données d'entraînement, ce qui dégrade sa performance sur de nouvelles données.",
      en: "Overfitting denotes a model too closely fitted to the training data's particularities (including noise), degrading its performance on new data.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le sous-apprentissage (underfitting), qui désigne au contraire un modèle trop simple pour capturer le signal.",
      en: "Confusing this term with underfitting, which instead denotes a model too simple to capture the signal.",
    },
  }),
};

export const templates: QuestionTemplate[] = [predictionNumericTemplate, evaluationSplitTemplate, regularizationEffectTemplate, vocabTemplate];
