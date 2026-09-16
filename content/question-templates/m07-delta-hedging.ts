import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const rebalanceNumericTemplate: QuestionTemplate = {
  id: "m07-hedge-rebalance-calcul",
  conceptId: "m07-delta-hedging",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const contracts = randomInt(rng, 20, 200);
    const deltaOld = randomFloat(rng, 0.2, 0.8, 2);
    const deltaNew = deltaOld + (randomInt(rng, -15, 15) / 100 || 0.05);
    const trade = Math.round(contracts * (deltaNew - deltaOld) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader détient ${contracts} calls longs. Le Delta de chaque call passe de ${fmt(deltaOld, "fr")} à ${fmt(deltaNew, "fr")}. Combien d'unités de sous-jacent doit-il acheter (positif) ou vendre (négatif) pour rester couvert ?`,
        en: `A trader holds ${contracts} long calls. Each call's Delta moves from ${fmt(deltaOld, "en")} to ${fmt(deltaNew, "en")}. How many units of underlying must they buy (positive) or sell (negative) to stay hedged?`,
      },
      numericUnit: { fr: "unités de sous-jacent", en: "units of underlying" },
      numericTolerance: "± 1",
      hint: { fr: "Quantité à trader = (Δ_nouveau − Δ_ancien) × nombre de contrats.", en: "Amount to trade = (Δ_new − Δ_old) × number of contracts." },
      numeric: { value: trade, tolerance: 1 },
      calculation: {
        fr: `Quantité = (${fmt(deltaNew, "fr")} − ${fmt(deltaOld, "fr")}) × ${contracts} ≈ ${fmt(trade, "fr")}.`,
        en: `Amount = (${fmt(deltaNew, "en")} − ${fmt(deltaOld, "en")}) × ${contracts} ≈ ${fmt(trade, "en")}.`,
      },
      explanation: {
        fr: "Pour rester delta-neutre avec des calls longs, il faut VENDRE du sous-jacent à hauteur du Delta total détenu — cet exercice calcule l'ajustement nécessaire, pas la position brute complète.",
        en: "To stay delta-neutral with long calls, one must SELL underlying equal to the total Delta held — this exercise computes the needed adjustment, not the full gross position.",
      },
      commonMistake: {
        fr: "Inverser l'ordre de la soustraction (Δ_ancien − Δ_nouveau), ce qui inverse le signe du trade nécessaire.",
        en: "Reversing the subtraction order (Δ_old − Δ_new), which flips the needed trade's sign.",
      },
    };
  },
};

const eliminatesAllRiskTemplate: QuestionTemplate = {
  id: "m07-hedge-elimine-tout",
  conceptId: "m07-delta-hedging",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le delta-hedging élimine totalement tout risque d'une position optionnelle, y compris le risque de Gamma et de Vega.",
      en: "Delta-hedging totally eliminates all risk of an option position, including Gamma and Vega risk.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le delta-hedging neutralise seulement le risque directionnel de premier ordre (Delta). Le risque de Gamma (entre deux rééquilibrages) et le risque de Vega (variation de la volatilité) subsistent.",
      en: "False: delta-hedging only neutralizes first-order directional risk (Delta). Gamma risk (between two rebalances) and Vega risk (volatility changing) remain.",
    },
    commonMistake: {
      fr: "Croire qu'une position \"delta-neutre\" est totalement sans risque.",
      en: "Believing a \"delta-neutral\" position is entirely risk-free.",
    },
  }),
};

const frequencyTradeoffTemplate: QuestionTemplate = {
  id: "m07-hedge-frequence",
  conceptId: "m07-delta-hedging",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const tooOften = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Un trader rééquilibre son delta-hedge ${tooOften ? "extrêmement fréquemment, à chaque infime mouvement du marché" : "très rarement, seulement une fois par mois"}. Quel est le principal risque de cette approche ?`,
        en: `A trader rebalances their delta-hedge ${tooOften ? "extremely frequently, at every tiny market move" : "very rarely, only once a month"}. What is the main risk of this approach?`,
      },
      choices: buildChoices([
        { id: "costs", label: { fr: "Des coûts de transaction excessifs qui rongent la marge", en: "Excessive transaction costs eating into the margin" } },
        { id: "gap", label: { fr: "Un risque de Gamma résiduel important (exposition non couverte entre rééquilibrages)", en: "Significant residual Gamma risk (uncovered exposure between rebalances)" } },
      ]),
      hint: { fr: "L'un des deux excès coûte cher en frais, l'autre expose à des mouvements non couverts.", en: "One extreme costs a lot in fees, the other exposes you to uncovered moves." },
      correctChoiceIds: [tooOften ? "costs" : "gap"],
      explanation: tooOften
        ? { fr: "Rééquilibrer à chaque mouvement infime génère des coûts de transaction qui s'accumulent et rongent la marge de la stratégie.", en: "Rebalancing at every tiny move generates transaction costs that accumulate and eat into the strategy's margin." }
        : { fr: "Rééquilibrer trop rarement laisse le Delta dévier fortement entre deux ajustements, exposant à un risque de Gamma non couvert important.", en: "Rebalancing too rarely lets Delta drift significantly between two adjustments, exposing to significant uncovered Gamma risk." },
      commonMistake: {
        fr: "Ne pas voir qu'il existe un arbitrage entre ces deux excès, plutôt qu'une réponse \"plus c'est fréquent, mieux c'est\" absolue.",
        en: "Not seeing there's a trade-off between these two extremes, rather than an absolute \"more frequent is always better\" answer.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-hedge-vocab",
  conceptId: "m07-delta-hedging",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'action d'ajuster la quantité de sous-jacent détenue pour que le Delta total reste proche de zéro s'appelle le ______.",
      en: "Adjusting the quantity of underlying held so total Delta stays near zero is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["rebalancing", "reequilibrage", "rééquilibrage"],
    hint: { fr: "Le même mot utilisé pour un portefeuille qu'on remet en équilibre.", en: "The same word used for bringing a portfolio back into balance." },
    explanation: {
      fr: "Le rééquilibrage (rebalancing) est l'ajustement périodique de la couverture qui maintient le delta-hedge efficace au fil du temps.",
      en: "Rebalancing is the periodic hedge adjustment that keeps the delta-hedge effective over time.",
    },
    commonMistake: {
      fr: "Croire qu'un delta-hedge, une fois mis en place, reste valable indéfiniment sans ajustement.",
      en: "Believing a delta-hedge, once set up, stays valid indefinitely without adjustment.",
    },
  }),
};

export const templates: QuestionTemplate[] = [rebalanceNumericTemplate, eliminatesAllRiskTemplate, frequencyTradeoffTemplate, vocabTemplate];
