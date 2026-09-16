import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const forwardPriceNumericTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-f0-calcul",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 20, 300);
    const rPct = randomInt(rng, 1, 8);
    const T = randomFloat(rng, 0.25, 3, 2);
    const r = rPct / 100;
    const F0 = Math.round(S0 * Math.pow(1 + r, T) * 100) / 100;

    return {
      prompt: {
        fr: `Un actif sans revenu cote S0 = ${fmt(S0, "fr", 0)} et le taux sans risque est r = ${rPct}%. Quel est le prix forward par non-arbitrage à T = ${fmt(T, "fr")} an(s) ?`,
        en: `An income-free asset trades at S0 = ${fmt(S0, "en", 0)} and the risk-free rate is r = ${rPct}%. What is the no-arbitrage forward price at T = ${fmt(T, "en")} year(s)?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 0.5",
      hint: {
        fr: "F0 = S0 × (1 + r)^T.",
        en: "F0 = S0 × (1 + r)^T.",
      },
      numeric: { value: F0, tolerance: 0.5 },
      calculation: {
        fr: `F0 = ${fmt(S0, "fr", 0)} × (1 + ${r})^${fmt(T, "fr")} = ${fmt(S0, "fr", 0)} × ${fmt(Math.pow(1 + r, T), "fr", 4)} = ${fmt(F0, "fr")}.`,
        en: `F0 = ${fmt(S0, "en", 0)} × (1 + ${r})^${fmt(T, "en")} = ${fmt(S0, "en", 0)} × ${fmt(Math.pow(1 + r, T), "en", 4)} = ${fmt(F0, "en")}.`,
      },
      explanation: {
        fr: "C'est le seul prix qui empêche une stratégie cash-and-carry (ou son inverse) de dégager un profit sans risque.",
        en: "This is the only price that prevents a cash-and-carry strategy (or its reverse) from locking in a risk-free profit.",
      },
      commonMistake: {
        fr: "Oublier d'élever (1+r) à la puissance T, ou utiliser T en mois au lieu d'années.",
        en: "Forgetting to raise (1+r) to the power T, or using T in months instead of years.",
      },
    };
  },
};

const higherRateTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-effet-taux",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Toutes choses égales par ailleurs (même S0, même T, actif sans revenu), si le taux sans risque r augmente, que devient le prix forward F0 ?",
      en: "All else equal (same S0, same T, income-free asset), if the risk-free rate r rises, what happens to the forward price F0?",
    },
    choices: buildChoices([
      { id: "up", label: { fr: "F0 augmente", en: "F0 rises" } },
      { id: "down", label: { fr: "F0 diminue", en: "F0 falls" } },
      { id: "same", label: { fr: "F0 ne change pas", en: "F0 stays the same" } },
    ]),
    hint: {
      fr: "F0 = S0 × (1 + r)^T : regardez le sens de la formule par rapport à r.",
      en: "F0 = S0 × (1 + r)^T: look at how the formula behaves as r changes.",
    },
    correctChoiceIds: ["up"],
    explanation: {
      fr: "F0 croît avec r : un taux plus élevé augmente le coût de financement pour porter l'actif jusqu'à l'échéance, donc le prix forward qui compense ce coût augmente aussi.",
      en: "F0 rises with r: a higher rate increases the financing cost of carrying the asset to maturity, so the forward price that compensates for that cost also rises.",
    },
    commonMistake: {
      fr: "Penser que F0 dépend d'une anticipation de marché sur le prix futur, plutôt que du taux de financement.",
      en: "Thinking F0 depends on a market forecast of the future price, rather than the financing rate.",
    },
  }),
};

const arbitrageDirectionTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-strategie",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const rPct = randomInt(rng, 2, 6);
    const r = rPct / 100;
    const T = 1;
    const F0 = Math.round(S0 * Math.pow(1 + r, T) * 100) / 100;
    const marketAboveFair = pick2(rng);
    const marketF = marketAboveFair ? F0 + randomInt(rng, 3, 10) : F0 - randomInt(rng, 3, 10);
    const correctId = marketAboveFair ? "cash-carry" : "reverse";

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = ${fmt(S0, "fr", 0)}, r = ${rPct}%, T = 1 an, donc F0 théorique = ${fmt(F0, "fr")}. Le marché cote ce forward à ${fmt(marketF, "fr")}. Quelle stratégie d'arbitrage sans risque est possible ?`,
        en: `S0 = ${fmt(S0, "en", 0)}, r = ${rPct}%, T = 1 year, so theoretical F0 = ${fmt(F0, "en")}. The market quotes this forward at ${fmt(marketF, "en")}. Which risk-free arbitrage strategy is available?`,
      },
      choices: buildChoices([
        { id: "cash-carry", label: { fr: "Emprunter, acheter l'actif comptant, vendre le forward", en: "Borrow, buy the asset spot, sell the forward" } },
        { id: "reverse", label: { fr: "Vendre l'actif à découvert, placer le produit, acheter le forward", en: "Short the asset, invest the proceeds, buy the forward" } },
        { id: "none", label: { fr: "Aucune, le prix est correct", en: "None, the price is fair" } },
      ]),
      hint: {
        fr: "Comparez le prix forward coté au prix forward théorique F0 : est-il trop cher ou trop bon marché ?",
        en: "Compare the quoted forward price to the theoretical F0: is it overpriced or underpriced?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: marketAboveFair
          ? `Le forward coté (${fmt(marketF, "fr")}) est plus cher que F0 (${fmt(F0, "fr")}) : il est surévalué. On le vend, et on réplique la position inverse moins cher via le cash-and-carry (emprunter + acheter comptant).`
          : `Le forward coté (${fmt(marketF, "fr")}) est moins cher que F0 (${fmt(F0, "fr")}) : il est sous-évalué. On l'achète, et on réplique la position inverse via la vente à découvert de l'actif comptant.`,
        en: marketAboveFair
          ? `The quoted forward (${fmt(marketF, "en")}) is more expensive than F0 (${fmt(F0, "en")}): it is overpriced. Sell it, and replicate the opposite position more cheaply via cash-and-carry (borrow + buy spot).`
          : `The quoted forward (${fmt(marketF, "en")}) is cheaper than F0 (${fmt(F0, "en")}): it is underpriced. Buy it, and replicate the opposite position via shorting the asset spot.`,
      },
      commonMistake: {
        fr: "Inverser les deux stratégies : le cash-and-carry sert à profiter d'un forward SURÉVALUÉ, pas sous-évalué.",
        en: "Swapping the two strategies: cash-and-carry is used to exploit an OVERPRICED forward, not an underpriced one.",
      },
    };
  },
};

function pick2(rng: Rng): boolean {
  return rng() < 0.5;
}

const vocabTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-vocab",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La stratégie qui consiste à emprunter de l'argent pour acheter l'actif comptant et le \"porter\" jusqu'à l'échéance du forward s'appelle cash-and-______.",
      en: "The strategy of borrowing money to buy the asset spot and \"carry\" it until the forward's maturity is called cash-and-______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["carry", "carrie"],
    hint: {
      fr: "Le même mot qu'en anglais financier.",
      en: "The English finance term itself.",
    },
    explanation: {
      fr: "Cash-and-carry : on achète comptant avec de l'argent emprunté, et on \"porte\" (carry) l'actif jusqu'à la livraison du forward.",
      en: "Cash-and-carry: you buy spot with borrowed money, and \"carry\" the asset until the forward's delivery.",
    },
    commonMistake: {
      fr: "Confondre cash-and-carry avec le coût de portage lui-même (cost of carry), qui est le résultat chiffré de cette stratégie, pas son nom.",
      en: "Confusing cash-and-carry with the cost of carry itself, which is the numerical result of this strategy, not its name.",
    },
  }),
};

export const templates: QuestionTemplate[] = [forwardPriceNumericTemplate, higherRateTemplate, arbitrageDirectionTemplate, vocabTemplate];
