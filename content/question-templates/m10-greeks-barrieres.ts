import { randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 1): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const effectiveDeltaNumericTemplate: QuestionTemplate = {
  id: "m10-greeks-delta-effectif",
  conceptId: "m10-greeks-barrieres",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const valueBefore = randomFloat(rng, 1, 5, 2);
    const rebate = 0;
    const epsilon = randomFloat(rng, 0.01, 0.1, 2);
    const deltaEff = Math.round(((rebate - valueBefore) / (2 * epsilon)) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Une option barrière vaut ${fmt(valueBefore, "fr", 2)} juste avant la barrière et 0 juste après (rebate nul). L'intervalle de prix entre les deux points de mesure est de ${fmt(epsilon * 2, "fr", 2)} (soit ε=${fmt(epsilon, "fr", 2)} de chaque côté). Quel est le Delta effectif local (Δ prix option / Δ sous-jacent), avec son signe ?`,
        en: `A barrier option is worth ${fmt(valueBefore, "en", 2)} just before the barrier and 0 just after (zero rebate). The price interval between the two measurement points is ${fmt(epsilon * 2, "en", 2)} (i.e. ε=${fmt(epsilon, "en", 2)} on each side). What is the local effective Delta (Δ option price / Δ underlying), with its sign?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 2",
      hint: { fr: "Delta_effectif = (V(H+ε) − V(H−ε)) / (2ε).", en: "Delta_effective = (V(H+ε) − V(H−ε)) / (2ε)." },
      numeric: { value: deltaEff, tolerance: 2 },
      calculation: {
        fr: `Delta_effectif = (0 − ${fmt(valueBefore, "fr", 2)}) / (2×${fmt(epsilon, "fr", 2)}) ≈ ${fmt(deltaEff, "fr")}.`,
        en: `Delta_effective = (0 − ${fmt(valueBefore, "en", 2)}) / (2×${fmt(epsilon, "en", 2)}) ≈ ${fmt(deltaEff, "en")}.`,
      },
      explanation: {
        fr: "Cette valeur extrême illustre pourquoi le delta-hedging classique devient impraticable à proximité immédiate d'une barrière.",
        en: "This extreme value illustrates why classic delta-hedging becomes impractical in the barrier's immediate vicinity.",
      },
      commonMistake: {
        fr: "Oublier le signe négatif (la valeur chute), ou diviser par ε au lieu de 2ε.",
        en: "Forgetting the negative sign (the value drops), or dividing by ε instead of 2ε.",
      },
    };
  },
};

const gammaSpikeTemplate: QuestionTemplate = {
  id: "m10-greeks-pic-gamma",
  conceptId: "m10-greeks-barrieres",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le pic de Gamma d'une option knock-out près de sa barrière s'amplifie à mesure que l'échéance approche.",
      en: "A knock-out option's Gamma spike near its barrier grows more pronounced as expiry approaches.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : plus T−t est petit, plus la transition entre \"vivant\" et \"knock-out\" se compresse sur un intervalle de sous-jacent étroit, amplifiant le pic de Gamma.",
      en: "True: the smaller T−t is, the more the transition between \"alive\" and \"knocked out\" compresses onto a narrow underlying interval, amplifying the Gamma spike.",
    },
    commonMistake: {
      fr: "Croire que le risque de Gamma près de la barrière est constant tout au long de la vie du contrat.",
      en: "Believing Gamma risk near the barrier is constant throughout the contract's life.",
    },
  }),
};

const comparisonTemplate: QuestionTemplate = {
  id: "m10-greeks-comparaison-vanille",
  conceptId: "m10-greeks-barrieres",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Loin de sa barrière, comment le comportement du Delta et du Gamma d'une option barrière se compare-t-il à celui d'une option vanille équivalente ?",
      en: "Far from its barrier, how does a barrier option's Delta and Gamma behave compared to an equivalent vanilla option?",
    },
    choices: buildChoices([
      { id: "similar", label: { fr: "Globalement similaire, sans le comportement extrême", en: "Broadly similar, without the extreme behavior" } },
      { id: "always-extreme", label: { fr: "Toujours extrême, quelle que soit la distance à la barrière", en: "Always extreme, regardless of distance to the barrier" } },
    ]),
    hint: { fr: "Le comportement extrême est spécifique au VOISINAGE de la barrière.", en: "The extreme behavior is specific to the barrier's VICINITY." },
    correctChoiceIds: ["similar"],
    explanation: {
      fr: "Loin de la barrière, le comportement des Greeks est globalement similaire à celui d'une option vanille — l'explosion de Delta/Gamma est spécifique au voisinage immédiat de la barrière.",
      en: "Far from the barrier, the Greeks' behavior is broadly similar to a vanilla option's — the Delta/Gamma explosion is specific to the barrier's immediate vicinity.",
    },
    commonMistake: {
      fr: "Généraliser le comportement extrême près de la barrière à toute la vie de l'option, quel que soit le niveau du sous-jacent.",
      en: "Generalizing the extreme near-barrier behavior to the option's entire life, regardless of the underlying's level.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-greeks-vocab",
  conceptId: "m10-greeks-barrieres",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le risque résiduel, non couvrable de façon parfaite, situé près d'une barrière ou d'un seuil, est parfois appelé le risque de ______ (terme anglais).",
      en: "The residual, imperfectly hedgeable risk located near a barrier or threshold is sometimes called ______ risk (English term).",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["pin"],
    hint: { fr: "Une image d'épingle, un point précis et fin.", en: "The image of a pin, a precise, thin point." },
    explanation: {
      fr: "Le \"pin risk\" désigne le risque résiduel concentré autour d'un niveau précis (barrière, strike), impossible à couvrir parfaitement à cause de la discontinuité locale.",
      en: "\"Pin risk\" denotes the residual risk concentrated around a precise level (barrier, strike), impossible to perfectly hedge because of the local discontinuity.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le risque de Gamma général, qui existe même loin de tout seuil précis.",
      en: "Confusing this term with general Gamma risk, which exists even far from any precise threshold.",
    },
  }),
};

export const templates: QuestionTemplate[] = [effectiveDeltaNumericTemplate, gammaSpikeTemplate, comparisonTemplate, vocabTemplate];
