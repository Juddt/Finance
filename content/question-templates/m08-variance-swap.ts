import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const payoffNumericTemplate: QuestionTemplate = {
  id: "m08-varswap-payoff-calcul",
  conceptId: "m08-variance-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 5, 50) * 10_000;
    const kVarPct = randomInt(rng, 12, 30);
    const realizedPct = kVarPct + randomInt(rng, -10, 10) || kVarPct + 3;
    const kVar2 = (kVarPct / 100) * (kVarPct / 100);
    const realized2 = (realizedPct / 100) * (realizedPct / 100);
    const payoff = Math.round(notional * (realized2 - kVar2));

    return {
      isScenario: true,
      prompt: {
        fr: `Un variance swap a un notionnel de variance de ${fmt(notional, "fr")}, un strike K_var=${kVarPct}%. La volatilité réalisée s'avère être ${realizedPct}%. Quel est le payoff (positif si reçu par l'acheteur) ?`,
        en: `A variance swap has variance notional ${fmt(notional, "en")}, strike K_var=${kVarPct}%. Realized volatility turns out to be ${realizedPct}%. What is the payoff (positive if received by the buyer)?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 50",
      hint: { fr: "Payoff = N_var × (σ²_réalisée − K²_var).", en: "Payoff = N_var × (σ²_realized − K²_var)." },
      numeric: { value: payoff, tolerance: 50 },
      calculation: {
        fr: `σ²_réalisée = ${(realizedPct / 100).toFixed(2)}² = ${realized2.toFixed(4)}. K²_var = ${(kVarPct / 100).toFixed(2)}² = ${kVar2.toFixed(4)}. Payoff = ${fmt(notional, "fr")}×(${realized2.toFixed(4)}−${kVar2.toFixed(4)}) ≈ ${fmt(payoff, "fr")}.`,
        en: `σ²_realized = ${(realizedPct / 100).toFixed(2)}² = ${realized2.toFixed(4)}. K²_var = ${(kVarPct / 100).toFixed(2)}² = ${kVar2.toFixed(4)}. Payoff = ${fmt(notional, "en")}×(${realized2.toFixed(4)}−${kVar2.toFixed(4)}) ≈ ${fmt(payoff, "en")}.`,
      },
      explanation: {
        fr: "N'oubliez pas d'élever au carré les deux volatilités avant de les soustraire : le payoff dépend de la VARIANCE, pas de la volatilité elle-même.",
        en: "Don't forget to square both volatilities before subtracting: the payoff depends on VARIANCE, not volatility itself.",
      },
      commonMistake: {
        fr: "Soustraire directement les volatilités (σ_réalisée − K_var) sans les élever au carré.",
        en: "Directly subtracting the volatilities (σ_realized − K_var) without squaring them.",
      },
    };
  },
};

const noDeltaRiskTemplate: QuestionTemplate = {
  id: "m08-varswap-pas-delta",
  conceptId: "m08-variance-swap",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un variance swap comporte un risque de Delta, comme une option classique non couverte.",
      en: "A variance swap carries Delta risk, like an uncovered classic option.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le variance swap offre une exposition PURE à la variance réalisée, sans risque de Delta — c'est précisément son avantage par rapport à une option delta-hedgée manuellement.",
      en: "False: a variance swap offers PURE exposure to realized variance, with no Delta risk — precisely its advantage over a manually delta-hedged option.",
    },
    commonMistake: {
      fr: "Croire que tout instrument dérivé sur un sous-jacent comporte nécessairement un risque directionnel.",
      en: "Believing any derivative on an underlying necessarily carries directional risk.",
    },
  }),
};

const varianceVsVolSwapTemplate: QuestionTemplate = {
  id: "m08-varswap-vs-volswap",
  conceptId: "m08-variance-swap",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Un variance swap est-il plus ou moins sensible aux mouvements extrêmes (queues de distribution) qu'un volatility swap (payoff linéaire en volatilité), à écart identique par rapport au strike ?",
      en: "Is a variance swap more or less sensitive to extreme moves (distribution tails) than a volatility swap (payoff linear in volatility), for the same gap versus the strike?",
    },
    choices: buildChoices([
      { id: "more", label: { fr: "Plus sensible, à cause du payoff en carré (σ²)", en: "More sensitive, because of the squared (σ²) payoff" } },
      { id: "same", label: { fr: "Également sensible, les deux payoffs se comportent pareil", en: "Equally sensitive, both payoffs behave the same" } },
    ]),
    hint: { fr: "Le payoff d'un variance swap dépend de σ², celui d'un vol swap de σ.", en: "A variance swap's payoff depends on σ², a vol swap's on σ." },
    correctChoiceIds: ["more"],
    explanation: {
      fr: "Le variance swap est structurellement plus sensible aux mouvements extrêmes, car son payoff dépend du CARRÉ de la volatilité — un doublement de volatilité quadruple l'écart en variance, mais seulement double l'écart en volatilité.",
      en: "The variance swap is structurally more sensitive to extreme moves, since its payoff depends on volatility SQUARED — a doubling of volatility quadruples the variance gap, but only doubles the volatility gap.",
    },
    commonMistake: {
      fr: "Croire que variance swap et volatility swap ont un comportement équivalent, car tous deux \"parient sur la volatilité\".",
      en: "Believing variance and volatility swaps behave equivalently, since both \"bet on volatility\".",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-varswap-vocab",
  conceptId: "m08-variance-swap",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le niveau de variance fixé au contrat, déterminé pour que la valeur du swap soit nulle à la conclusion, s'appelle le strike de ______.",
      en: "The variance level fixed in the contract, set so the swap's value is zero at inception, is called the ______ strike.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["variance"],
    hint: { fr: "Le carré de la volatilité qu'on \"parie\".", en: "The square of the volatility being \"bet\" on." },
    explanation: {
      fr: "Le strike de variance K_var est fixé au départ, sa valeur au carré K²_var étant comparée à la variance réellement réalisée à l'échéance.",
      en: "The variance strike K_var is fixed at inception, its squared value K²_var being compared to actually realized variance at maturity.",
    },
    commonMistake: {
      fr: "Confondre le strike de variance avec le strike d'une option classique, qui porte sur un niveau de prix, pas sur une variance.",
      en: "Confusing the variance strike with a classic option's strike, which relates to a price level, not a variance.",
    },
  }),
};

export const templates: QuestionTemplate[] = [payoffNumericTemplate, noDeltaRiskTemplate, varianceVsVolSwapTemplate, vocabTemplate];
