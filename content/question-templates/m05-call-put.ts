import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const netProfitTemplate: QuestionTemplate = {
  id: "m05-call-profit-net",
  conceptId: "m05-call-put",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 6, 15) * 10; // 60..150
    const premium = randomInt(rng, 2, 8);
    const sT = randomInt(rng, K - 30, K + 30);
    const grossPayoff = Math.max(sT - K, 0);
    const netProfit = grossPayoff - premium;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous avez acheté un call de strike K = ${fmt(K, "fr")} € pour une prime de ${fmt(premium, "fr")} €. À l'échéance, le sous-jacent vaut S_T = ${fmt(sT, "fr")} €. Quel est votre profit net (avec son signe) ?`,
        en: `You bought a call with strike K = ${fmt(K, "en")} for a premium of ${fmt(premium, "en")}. At maturity, the underlying is worth S_T = ${fmt(sT, "en")}. What is your net profit (with its sign)?`,
      },
      numericUnit: { fr: "€", en: "$" },
      numericTolerance: "± 0,5",
      hint: {
        fr: "Profit net = max(S_T − K, 0) − prime.",
        en: "Net profit = max(S_T − K, 0) − premium.",
      },
      numeric: { value: netProfit, tolerance: 0.5 },
      calculation: {
        fr: `Payoff brut = max(${fmt(sT, "fr")} − ${fmt(K, "fr")}, 0) = ${fmt(grossPayoff, "fr")}. Profit net = ${fmt(grossPayoff, "fr")} − ${fmt(premium, "fr")} = ${fmt(netProfit, "fr")} €.`,
        en: `Gross payoff = max(${fmt(sT, "en")} − ${fmt(K, "en")}, 0) = ${fmt(grossPayoff, "en")}. Net profit = ${fmt(grossPayoff, "en")} − ${fmt(premium, "en")} = ${fmt(netProfit, "en")}.`,
      },
      explanation: {
        fr:
          netProfit < 0
            ? "Le profit net est négatif : soit le call n'a pas été exercé (S_T ≤ K), soit il l'a été mais le payoff ne couvrait pas la prime payée."
            : "Le profit net est positif : le payoff brut a dépassé la prime payée.",
        en:
          netProfit < 0
            ? "The net profit is negative: either the call wasn't exercised (S_T ≤ K), or it was but the payoff didn't cover the premium paid."
            : "The net profit is positive: the gross payoff exceeded the premium paid.",
      },
      commonMistake: {
        fr: "Oublier de soustraire la prime, ou exercer mentalement le call même quand S_T ≤ K (dans ce cas le payoff brut est nul, pas négatif).",
        en: "Forgetting to subtract the premium, or mentally exercising the call even when S_T ≤ K (in that case the gross payoff is zero, not negative).",
      },
    };
  },
};

const maxLossTemplate: QuestionTemplate = {
  id: "m05-call-perte-max",
  conceptId: "m05-call-put",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const premium = randomInt(rng, 2, 10);
    return {
      prompt: {
        fr: `Un investisseur achète un call en payant une prime de ${fmt(premium, "fr")} €. Il peut perdre plus que cette prime si le sous-jacent chute fortement.`,
        en: `An investor buys a call, paying a premium of ${fmt(premium, "en")}. They can lose more than that premium if the underlying falls sharply.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "L'acheteur a un droit, pas une obligation : il n'est jamais forcé d'exercer un mauvais deal.",
        en: "The buyer has a right, not an obligation: they are never forced to exercise a bad deal.",
      },
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : l'acheteur d'une option n'exerce que si c'est avantageux. Sa perte est toujours plafonnée à la prime payée, quelle que soit l'ampleur de la baisse du sous-jacent.",
        en: "False: an option buyer only exercises when it's advantageous. Their loss is always capped at the premium paid, however far the underlying falls.",
      },
      commonMistake: {
        fr: "Confondre acheteur et vendeur : c'est le VENDEUR d'un call qui a un risque de perte illimité si le sous-jacent monte, pas l'acheteur.",
        en: "Confusing buyer and seller: it's the call SELLER who has unlimited downside risk if the underlying rises, not the buyer.",
      },
    };
  },
};

const breakEvenTemplate: QuestionTemplate = {
  id: "m05-call-seuil-rentabilite",
  conceptId: "m05-call-put",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 6, 15) * 10;
    const premium = randomInt(rng, 2, 8);
    const breakEven = K + premium;

    const choiceValues = [
      { id: "k_plus_p", value: breakEven },
      { id: "k_minus_p", value: K - premium },
      { id: "k_only", value: K },
    ];

    return {
      prompt: {
        fr: `Pour un call de strike K = ${fmt(K, "fr")} € et de prime ${fmt(premium, "fr")} €, à quel prix du sous-jacent à l'échéance l'acheteur atteint-il son seuil de rentabilité (profit net nul) ?`,
        en: `For a call with strike K = ${fmt(K, "en")} and premium ${fmt(premium, "en")}, at what underlying price at maturity does the buyer reach break-even (zero net profit)?`,
      },
      choices: buildChoices(
        choiceValues.map((c) => ({ id: c.id, label: { fr: `${fmt(c.value, "fr")} €`, en: `${fmt(c.value, "en")}` } }))
      ),
      hint: {
        fr: "Il faut que le payoff brut couvre exactement la prime payée.",
        en: "The gross payoff must exactly cover the premium paid.",
      },
      correctChoiceIds: ["k_plus_p"],
      explanation: {
        fr: `Le seuil de rentabilité est S_T = K + prime = ${fmt(K, "fr")} + ${fmt(premium, "fr")} = ${fmt(breakEven, "fr")} €. En dessous, le call est perdant au net ; au-dessus, il devient gagnant.`,
        en: `Break-even is S_T = K + premium = ${fmt(K, "en")} + ${fmt(premium, "en")} = ${fmt(breakEven, "en")}. Below it the call is a net loss; above it, a net gain.`,
      },
      commonMistake: {
        fr: "Croire que le seuil de rentabilité est simplement K : c'est le seuil d'exercice, pas de rentabilité — il faut encore couvrir la prime au-delà de K.",
        en: "Believing the break-even is simply K: that's the exercise threshold, not break-even — the premium still needs to be covered beyond K.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m05-call-put-vocab-perte-max",
  conceptId: "m05-call-put",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Pour l'acheteur d'une option (call ou put), la perte maximale possible est toujours limitée au montant de la ______ payée.",
      en: "For an option buyer (call or put), the maximum possible loss is always limited to the amount of the ______ paid.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["prime", "premium"],
    hint: {
      fr: "C'est le prix payé à la conclusion du contrat, non remboursable.",
      en: "It's the price paid at inception, non-refundable.",
    },
    explanation: {
      fr: "La prime est le montant maximal que l'acheteur peut perdre : au pire, il n'exerce simplement pas son droit.",
      en: "The premium is the maximum amount the buyer can lose: at worst, they simply don't exercise their right.",
    },
    commonMistake: {
      fr: "Confondre avec le strike, qui est le prix d'exercice, pas le montant risqué par l'acheteur.",
      en: "Confusing it with the strike, which is the exercise price, not the amount the buyer risks.",
    },
  }),
};

const chartReadingTemplate: QuestionTemplate = {
  id: "m05-call-lecture-graphique",
  conceptId: "m05-call-put",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 8, 14) * 10;
    const premium = randomInt(rng, 3, 9);
    const breakEven = K + premium;

    return {
      isScenario: true,
      chart: { type: "payoff_call", params: { strike: K, premium } },
      prompt: {
        fr: `Le graphique montre le profit net à l'échéance de l'achat d'un call (strike K = ${fmt(K, "fr")} €, prime = ${fmt(premium, "fr")} €). En lisant la courbe, à partir de quel prix du sous-jacent le profit net devient-il positif ?`,
        en: `The chart shows the net profit at maturity of buying a call (strike K = ${fmt(K, "en")}, premium = ${fmt(premium, "en")}). Reading the curve, from what underlying price does the net profit become positive?`,
      },
      numericUnit: { fr: "€", en: "$" },
      numericTolerance: "± 1",
      hint: {
        fr: "C'est le point où la courbe traverse l'axe horizontal (profit net = 0).",
        en: "It's the point where the curve crosses the horizontal axis (net profit = 0).",
      },
      numeric: { value: breakEven, tolerance: 1 },
      calculation: {
        fr: `La courbe croise l'axe des abscisses à S_T = K + prime = ${fmt(K, "fr")} + ${fmt(premium, "fr")} = ${fmt(breakEven, "fr")} €.`,
        en: `The curve crosses the x-axis at S_T = K + premium = ${fmt(K, "en")} + ${fmt(premium, "en")} = ${fmt(breakEven, "en")}.`,
      },
      explanation: {
        fr: "Sur le graphique, la partie plate en dessous de zéro (à gauche) correspond à la perte plafonnée à la prime ; la droite montante à droite du strike ne redevient positive qu'après avoir remonté toute la prime perdue.",
        en: "On the chart, the flat part below zero (on the left) is the loss capped at the premium; the rising line right of the strike only turns positive after climbing back the whole lost premium.",
      },
      commonMistake: {
        fr: "Lire le point où la courbe quitte la partie plate (S_T = K) au lieu du point où elle repasse au-dessus de zéro (S_T = K + prime).",
        en: "Reading the point where the curve leaves the flat part (S_T = K) instead of the point where it rises back above zero (S_T = K + premium).",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [
  netProfitTemplate,
  maxLossTemplate,
  breakEvenTemplate,
  vocabTemplate,
  chartReadingTemplate,
];
