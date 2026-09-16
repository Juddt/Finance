import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const sigmoidNumericTemplate: QuestionTemplate = {
  id: "m12-regression-logistique-sigmoide",
  conceptId: "m12-regression-logistique",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const z = pick2(rng);
    const p = Math.round((1 / (1 + Math.exp(-z))) * 1000) / 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Un modèle de régression logistique calcule un score Xβ = ${fmt(z, "fr")} pour une entreprise emprunteuse. Quelle est la probabilité de défaut estimée par la sigmoïde ?`,
        en: `A logistic regression model computes a score Xβ = ${fmt(z, "en")} for a borrowing company. What is the default probability estimated by the sigmoid?`,
      },
      numericUnit: { fr: "probabilité entre 0 et 1", en: "probability between 0 and 1" },
      numericTolerance: "± 0.02",
      hint: { fr: "p = 1 / (1 + e^(-z)).", en: "p = 1 / (1 + e^(-z))." },
      numeric: { value: p, tolerance: 0.02 },
      calculation: {
        fr: `p = 1 / (1 + e^(-${fmt(z, "fr")})) ≈ ${fmt(p, "fr", 3)}.`,
        en: `p = 1 / (1 + e^(-${fmt(z, "en")})) ≈ ${fmt(p, "en", 3)}.`,
      },
      explanation: {
        fr: "La fonction sigmoïde transforme n'importe quel score réel en une probabilité valide entre 0 et 1.",
        en: "The sigmoid function transforms any real score into a valid probability between 0 and 1.",
      },
      commonMistake: {
        fr: "Oublier le signe négatif dans l'exposant, ou confondre avec une simple normalisation linéaire.",
        en: "Forgetting the negative sign in the exponent, or confusing it with a simple linear normalization.",
      },
    };
  },
};

function pick2(rng: Rng): number {
  return randomInt(rng, -30, 30) / 10;
}

const aucVsCalibrationTemplate: QuestionTemplate = {
  id: "m12-regression-logistique-auc-calibration",
  conceptId: "m12-regression-logistique",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Un modèle a une excellente AUC (0,92) mais ses probabilités prédites sont mal calibrées (une prédiction de 70% correspond en réalité à 40% de cas positifs observés). Que peut-on conclure ?",
      en: "A model has an excellent AUC (0.92) but its predicted probabilities are poorly calibrated (a 70% prediction actually corresponds to 40% of observed positive cases). What can be concluded?",
    },
    choices: buildChoices([
      { id: "ranking-ok", label: { fr: "Le classement relatif est bon, mais les probabilités en valeur absolue ne sont pas fiables", en: "The relative ranking is good, but the absolute probabilities aren't reliable" } },
      { id: "model-useless", label: { fr: "Le modèle est totalement inutilisable, l'AUC élevée est nécessairement une erreur", en: "The model is totally unusable, the high AUC must be an error" } },
    ]),
    hint: { fr: "AUC et calibration sont deux propriétés indépendantes d'un modèle de classification.", en: "AUC and calibration are two independent properties of a classification model." },
    correctChoiceIds: ["ranking-ok"],
    explanation: {
      fr: "L'AUC mesure uniquement la qualité du classement relatif (le modèle ordonne-t-il bien les cas à risque par rapport aux autres ?), indépendamment de la calibration. Un modèle peut très bien classer sans que ses probabilités absolues soient fiables — les deux propriétés doivent être vérifiées séparément.",
      en: "AUC only measures relative ranking quality (does the model rank at-risk cases correctly relative to others?), independent of calibration. A model can rank very well without its absolute probabilities being reliable — both properties must be checked separately.",
    },
    commonMistake: {
      fr: "Croire qu'une AUC élevée garantit automatiquement des probabilités bien calibrées.",
      en: "Believing a high AUC automatically guarantees well-calibrated probabilities.",
    },
  }),
};

const thresholdTemplate: QuestionTemplate = {
  id: "m12-regression-logistique-seuil",
  conceptId: "m12-regression-logistique",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le seuil de décision de 0,5 est toujours le choix optimal pour convertir une probabilité prédite en décision binaire.",
      en: "The 0.5 decision threshold is always the optimal choice to convert a predicted probability into a binary decision.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le seuil optimal dépend du coût métier réel des faux positifs et faux négatifs. Si rater un défaut coûte beaucoup plus cher qu'un refus de crédit à tort, un seuil inférieur à 0,5 peut être préférable.",
      en: "False: the optimal threshold depends on the real business cost of false positives and false negatives. If missing a default costs much more than wrongly refusing credit, a threshold below 0.5 may be preferable.",
    },
    commonMistake: {
      fr: "Appliquer systématiquement 0,5 sans considérer l'asymétrie des coûts d'erreur propre au problème métier.",
      en: "Systematically applying 0.5 without considering the error costs' asymmetry specific to the business problem.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m12-regression-logistique-vocab",
  conceptId: "m12-regression-logistique",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La fonction de perte standard de la régression logistique, qui pénalise fortement une prédiction confiante et fausse, s'appelle le ______.",
      en: "The standard loss function of logistic regression, which heavily penalizes a confident, wrong prediction, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un terme", en: "one term" },
    acceptedAnswers: ["log-loss", "logloss", "entropie croisee", "entropie croisée", "cross-entropy", "cross entropy"],
    hint: { fr: "Aussi appelée entropie croisée.", en: "Also called cross-entropy." },
    explanation: {
      fr: "Le log-loss (ou entropie croisée) est la fonction de perte minimisée pour entraîner une régression logistique, dérivée du principe de maximum de vraisemblance.",
      en: "Log-loss (or cross-entropy) is the loss function minimized to train logistic regression, derived from the maximum likelihood principle.",
    },
    commonMistake: {
      fr: "Confondre cette fonction de perte avec l'erreur quadratique (MSE), utilisée pour la régression linéaire, pas la classification probabiliste.",
      en: "Confusing this loss function with squared error (MSE), used for linear regression, not probabilistic classification.",
    },
  }),
};

export const templates: QuestionTemplate[] = [sigmoidNumericTemplate, aucVsCalibrationTemplate, thresholdTemplate, vocabTemplate];
