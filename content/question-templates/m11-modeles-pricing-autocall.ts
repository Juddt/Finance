import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 3): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const monteCarloSeNumericTemplate: QuestionTemplate = {
  id: "m11-modele-erreur-type-mc",
  conceptId: "m11-modeles-pricing-autocall",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const sigmaMc = randomInt(rng, 100, 250) / 10;
    const nThousands = randomInt(rng, 10, 500);
    const N = nThousands * 1000;
    const se = Math.round((sigmaMc / Math.sqrt(N)) * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `Une simulation Monte-Carlo pour un autocall utilise ${fmt(N, "fr", 0)} trajectoires, avec un écart-type des payoffs simulés de ${fmt(sigmaMc, "fr", 1)}. Quelle est l'erreur type (SE) de l'estimation du prix ?`,
        en: `A Monte Carlo simulation for an autocall uses ${fmt(N, "en", 0)} paths, with a simulated-payoffs standard deviation of ${fmt(sigmaMc, "en", 1)}. What is the price estimate's standard error (SE)?`,
      },
      numericUnit: { fr: "même unité que le prix", en: "same unit as the price" },
      numericTolerance: "± 0.005",
      hint: { fr: "SE = σ_MC / √N.", en: "SE = σ_MC / √N." },
      numeric: { value: se, tolerance: 0.005 },
      calculation: {
        fr: `SE = ${fmt(sigmaMc, "fr", 1)} / √${fmt(N, "fr", 0)} ≈ ${fmt(se, "fr", 4)}.`,
        en: `SE = ${fmt(sigmaMc, "en", 1)} / √${fmt(N, "en", 0)} ≈ ${fmt(se, "en", 4)}.`,
      },
      explanation: {
        fr: "La précision d'une estimation Monte-Carlo s'améliore avec la racine carrée du nombre de trajectoires : quadrupler N divise l'erreur type par 2.",
        en: "A Monte Carlo estimate's precision improves with the square root of the number of paths: quadrupling N halves the standard error.",
      },
      commonMistake: {
        fr: "Diviser par N au lieu de √N, ce qui surestime largement la vitesse de convergence.",
        en: "Dividing by N instead of √N, which greatly overstates the convergence speed.",
      },
    };
  },
};

const modelChoiceTemplate: QuestionTemplate = {
  id: "m11-modele-choix-constant",
  conceptId: "m11-modeles-pricing-autocall",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un modèle à volatilité constante (Black-Scholes simple) est généralement suffisant pour pricer un autocall avec précision.",
      en: "A constant-volatility model (simple Black-Scholes) is generally sufficient to accurately price an autocall.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un autocall est très sensible au skew et à sa dynamique future (forward skew), qu'un modèle à volatilité constante ignore complètement, ce qui peut conduire à des erreurs de prix significatives.",
      en: "False: an autocall is highly sensitive to the skew and its future dynamics (forward skew), which a constant-volatility model completely ignores, potentially leading to significant pricing errors.",
    },
    commonMistake: {
      fr: "Croire qu'un modèle simple bien calibré sur le niveau de volatilité actuel suffit, sans tenir compte du skew.",
      en: "Believing a simple model well calibrated to the current volatility level suffices, ignoring the skew.",
    },
  }),
};

const modelDivergenceTemplate: QuestionTemplate = {
  id: "m11-modele-divergence-forward-skew",
  conceptId: "m11-modeles-pricing-autocall",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Deux modèles (volatilité locale et stochastique), calibrés de façon identique aux prix d'options vanilles cotées aujourd'hui, peuvent-ils donner des prix d'autocall différents ?",
      en: "Can two models (local and stochastic volatility), identically calibrated to today's quoted vanilla option prices, give different autocall prices?",
    },
    choices: buildChoices([
      { id: "yes", label: { fr: "Oui, à cause de forward skews différents", en: "Yes, due to different forward skews" } },
      { id: "no", label: { fr: "Non, une calibration identique garantit des prix identiques", en: "No, identical calibration guarantees identical prices" } },
    ]),
    hint: { fr: "Les deux modèles peuvent s'accorder sur les prix vanilles d'aujourd'hui mais diverger sur l'évolution future anticipée du skew.", en: "Both models can agree on today's vanilla prices but diverge on the skew's anticipated future evolution." },
    correctChoiceIds: ["yes"],
    explanation: {
      fr: "Oui : les modèles de volatilité locale et stochastique produisent des forward skews différents, ce qui affecte significativement le prix d'un produit multi-observations comme l'autocall, malgré une calibration identique sur les vanilles d'aujourd'hui.",
      en: "Yes: local and stochastic volatility models produce different forward skews, which significantly affects the price of a multi-observation product like an autocall, despite identical calibration to today's vanillas.",
    },
    commonMistake: {
      fr: "Croire qu'une calibration identique sur le marché vanille élimine toute incertitude de modèle pour des produits plus complexes.",
      en: "Believing identical calibration to the vanilla market eliminates all model uncertainty for more complex products.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m11-modele-vocab",
  conceptId: "m11-modeles-pricing-autocall",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La forme du sourire de volatilité anticipée à une date future, qui diffère selon le modèle utilisé, est appelée le skew ______.",
      en: "The shape of the anticipated volatility smile at a future date, which differs depending on the model used, is called the ______ skew.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["forward"],
    hint: { fr: "Le même mot que dans « forward skew ».", en: "The same word as in \"forward skew\"." },
    explanation: {
      fr: "Le forward skew désigne la forme anticipée du sourire de volatilité à une date future, un élément déterminant pour le prix d'un produit à observations multiples comme l'autocall.",
      en: "The forward skew denotes the anticipated shape of the volatility smile at a future date, a determining element for the price of a multi-observation product like an autocall.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le skew spot (la forme du sourire observée aujourd'hui), qui est une notion différente.",
      en: "Confusing this term with the spot skew (the smile's shape observed today), a different notion.",
    },
  }),
};

export const templates: QuestionTemplate[] = [monteCarloSeNumericTemplate, modelChoiceTemplate, modelDivergenceTemplate, vocabTemplate];
