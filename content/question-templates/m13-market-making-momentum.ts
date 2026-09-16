import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const spreadProfitNumericTemplate: QuestionTemplate = {
  id: "m13-mm-profit-spread",
  conceptId: "m13-market-making-momentum",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const spread = randomInt(rng, 2, 20) / 100;
    const cycles = randomInt(rng, 100, 2000);
    const profit = Math.round(spread * cycles * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un market maker capte un spread de ${fmt(spread, "fr")} par action sur ${fmt(cycles, "fr", 0)} cycles achat-vente complétés, sans déséquilibre d'inventaire. Quel est son profit brut total ?`,
        en: `A market maker captures a ${fmt(spread, "en")} spread per share over ${fmt(cycles, "en", 0)} completed buy-sell cycles, with no inventory imbalance. What is their total gross profit?`,
      },
      numericUnit: { fr: "même devise que le spread", en: "same currency as the spread" },
      numericTolerance: "± 5",
      hint: { fr: "Profit ≈ N × (Ask − Bid).", en: "Profit ≈ N × (Ask − Bid)." },
      numeric: { value: profit, tolerance: 5 },
      calculation: {
        fr: `Profit = ${fmt(spread, "fr")} × ${fmt(cycles, "fr", 0)} ≈ ${fmt(profit, "fr")}.`,
        en: `Profit = ${fmt(spread, "en")} × ${fmt(cycles, "en", 0)} ≈ ${fmt(profit, "en")}.`,
      },
      explanation: {
        fr: "Le market maker capte le spread bid-ask à chaque cycle complété d'achat-vente, un profit qui n'a nécessité aucune vue directionnelle sur l'actif.",
        en: "The market maker captures the bid-ask spread on each completed buy-sell cycle, a profit that required no directional view on the asset.",
      },
      commonMistake: {
        fr: "Oublier de multiplier le spread unitaire par le nombre de cycles complétés.",
        en: "Forgetting to multiply the unit spread by the number of completed cycles.",
      },
    };
  },
};

const arbitrageDefinitionTemplate: QuestionTemplate = {
  id: "m13-mm-definition-arbitrage",
  conceptId: "m13-market-making-momentum",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "En théorie, l'arbitrage pur génère un profit :",
      en: "In theory, pure arbitrage generates a profit:",
    },
    choices: buildChoices([
      { id: "riskfree", label: { fr: "Sans risque directionnel, en exploitant une incohérence de prix entre instruments équivalents", en: "With no directional risk, by exploiting a price inconsistency between equivalent instruments" } },
      { id: "directional", label: { fr: "En pariant sur la direction future du marché", en: "By betting on the market's future direction" } },
    ]),
    hint: { fr: "L'arbitrage exploite une incohérence de prix, pas une prédiction de tendance.", en: "Arbitrage exploits a price inconsistency, not a trend prediction." },
    correctChoiceIds: ["riskfree"],
    explanation: {
      fr: "L'arbitrage pur exploite une différence de prix entre deux marchés ou instruments économiquement équivalents, générant un profit sans risque directionnel si l'écart se referme — bien que le risque d'exécution reste présent en pratique.",
      en: "Pure arbitrage exploits a price difference between two economically equivalent markets or instruments, generating a risk-free profit if the gap closes — though execution risk remains present in practice.",
    },
    commonMistake: {
      fr: "Confondre l'arbitrage pur avec des stratégies qualifiées d'\"arbitrage\" par abus de langage mais portant un vrai risque directionnel résiduel.",
      en: "Confusing pure arbitrage with strategies loosely called \"arbitrage\" but carrying real residual directional risk.",
    },
  }),
};

const momentumVsMeanReversionTemplate: QuestionTemplate = {
  id: "m13-mm-momentum-vs-mean-reversion",
  conceptId: "m13-market-making-momentum",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Momentum et mean reversion font des paris fondamentalement opposés sur le comportement futur des prix.",
      en: "Momentum and mean reversion make fundamentally opposite bets on future price behavior.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : le momentum parie que la tendance récente va continuer, tandis que le mean reversion parie sur un retour vers une moyenne historique après un écart jugé excessif — des hypothèses opposées, qui peuvent néanmoins coexister sur des horizons temporels ou des actifs différents.",
      en: "True: momentum bets the recent trend continues, while mean reversion bets on a return to a historical average after an excessive deviation — opposite hypotheses, which can nonetheless coexist over different time horizons or assets.",
    },
    commonMistake: {
      fr: "Croire que momentum et mean reversion sont des variantes d'une même stratégie plutôt que des paris opposés.",
      en: "Believing momentum and mean reversion are variants of the same strategy rather than opposite bets.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-mm-vocab",
  conceptId: "m13-market-making-momentum",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'écart entre le meilleur prix d'achat et le meilleur prix de vente affiché sur un marché s'appelle le spread ______.",
      en: "The gap between the best buy price and best sell price displayed on a market is called the ______-ask spread.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["bid"],
    hint: { fr: "Le prix d'achat s'appelle le \"bid\".", en: "The buy price is called the \"bid\"." },
    explanation: {
      fr: "Le spread bid-ask est l'écart entre le meilleur prix d'achat (bid) et le meilleur prix de vente (ask), la principale source de revenu du market maker.",
      en: "The bid-ask spread is the gap between the best buy price (bid) and best sell price (ask), the market maker's main revenue source.",
    },
    commonMistake: {
      fr: "Inverser bid et ask, qui désignent respectivement le prix d'achat et de vente proposés sur le marché.",
      en: "Swapping bid and ask, which respectively denote the buy and sell prices offered in the market.",
    },
  }),
};

export const templates: QuestionTemplate[] = [spreadProfitNumericTemplate, arbitrageDefinitionTemplate, momentumVsMeanReversionTemplate, vocabTemplate];
