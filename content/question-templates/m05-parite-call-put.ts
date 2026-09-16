import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const impliedPutTemplate: QuestionTemplate = {
  id: "m05-parite-put-implicite",
  conceptId: "m05-parite-call-put",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const K = randomInt(rng, 50, 200);
    const rPct = randomInt(rng, 1, 6);
    const T = randomInt(rng, 1, 2);
    const C = randomInt(rng, 3, 25);
    const r = rPct / 100;
    const P = Math.round((C - S0 + K / Math.pow(1 + r, T)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = ${T} an(s), call coté C = ${C}. Par la parité call-put, quel devrait être le prix du put de même strike et échéance ?`,
        en: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = ${T} year(s), quoted call C = ${C}. By put-call parity, what should the price of the put with the same strike and maturity be?`,
      },
      numericUnit: { fr: "même devise", en: "same currency" },
      numericTolerance: "± 0.5",
      hint: { fr: "P = C − S0 + K×(1+r)^(−T).", en: "P = C − S0 + K×(1+r)^(−T)." },
      numeric: { value: P, tolerance: 0.5 },
      calculation: {
        fr: `P = ${C} − ${S0} + ${K}/(1+${r})^${T} = ${C} − ${S0} + ${fmt(K / Math.pow(1 + r, T), "fr")} ≈ ${fmt(P, "fr")}.`,
        en: `P = ${C} − ${S0} + ${K}/(1+${r})^${T} = ${C} − ${S0} + ${fmt(K / Math.pow(1 + r, T), "en")} ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "Cette relation découle d'un argument de réplication : call + obligation ≡ put + sous-jacent, quelle que soit l'évolution future du prix.",
        en: "This relationship comes from a replication argument: call + bond ≡ put + underlying, whatever the price's future path.",
      },
      commonMistake: {
        fr: "Oublier d'actualiser K, ou inverser un signe dans la formule réarrangée.",
        en: "Forgetting to discount K, or flipping a sign in the rearranged formula.",
      },
    };
  },
};

const arbitrageDirectionTemplate: QuestionTemplate = {
  id: "m05-parite-arbitrage",
  conceptId: "m05-parite-call-put",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 80, 120);
    const K = 100;
    const rPct = 3;
    const r = rPct / 100;
    const T = 1;
    const fairDiff = S0 - K / Math.pow(1 + r, T);
    const marketAboveFair = pick(rng, [true, false] as const);
    const C = 8;
    const P = marketAboveFair ? Math.round((C - fairDiff - 2) * 100) / 100 : Math.round((C - fairDiff + 2) * 100) / 100;
    const observedDiff = C - P;
    const correctId = observedDiff > fairDiff ? "sell-call-buy-put" : "buy-call-sell-put";

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = 1 an. Le call cote C = ${C}, le put cote P = ${fmt(P, "fr")}. C − P (${fmt(observedDiff, "fr")}) est-il supérieur ou inférieur à S0 − K(1+r)^(−T) (${fmt(fairDiff, "fr")}) ? Quelle stratégie d'arbitrage en découle ?`,
        en: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = 1 year. The call trades at C = ${C}, the put at P = ${fmt(P, "en")}. Is C − P (${fmt(observedDiff, "en")}) above or below S0 − K(1+r)^(−T) (${fmt(fairDiff, "en")})? What arbitrage strategy follows?`,
      },
      choices: buildChoices([
        { id: "sell-call-buy-put", label: { fr: "Vendre le call, acheter le put et l'action (synthétique inverse)", en: "Sell the call, buy the put and the underlying (reverse synthetic)" } },
        { id: "buy-call-sell-put", label: { fr: "Acheter le call, vendre le put et l'action à découvert", en: "Buy the call, sell the put and short the underlying" } },
      ]),
      hint: {
        fr: "Si C−P est trop élevé par rapport à la relation théorique, le call est relativement cher : il faut le vendre.",
        en: "If C−P is too high relative to the theoretical relationship, the call is relatively expensive: sell it.",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `C − P = ${fmt(observedDiff, "fr")} est ${observedDiff > fairDiff ? "supérieur" : "inférieur"} à la valeur théorique ${fmt(fairDiff, "fr")} : le call est relativement ${observedDiff > fairDiff ? "surévalué, on le vend" : "sous-évalué, on l'achète"} et on prend la position inverse sur le put et l'action pour verrouiller le profit.`,
        en: `C − P = ${fmt(observedDiff, "en")} is ${observedDiff > fairDiff ? "above" : "below"} the theoretical value ${fmt(fairDiff, "en")}: the call is relatively ${observedDiff > fairDiff ? "overpriced, sell it" : "underpriced, buy it"} and take the opposite position on the put and the underlying to lock in the profit.`,
      },
      commonMistake: {
        fr: "Inverser le sens de la stratégie d'arbitrage par rapport à l'écart observé.",
        en: "Reversing the arbitrage strategy's direction relative to the observed gap.",
      },
    };
  },
};

const europeanOnlyTemplate: QuestionTemplate = {
  id: "m05-parite-europeenne-seulement",
  conceptId: "m05-parite-call-put",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La relation stricte de parité call-put C − P = S0 − K(1+r)^(−T) s'applique aussi bien aux options américaines qu'européennes.",
      en: "The strict put-call parity relationship C − P = S0 − K(1+r)^(−T) applies equally to American and European options.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la possibilité d'exercice anticipé d'une option américaine casse l'argument de réplication utilisé pour démontrer la parité, qui ne s'applique donc strictement qu'aux options européennes.",
      en: "False: the possibility of early exercise on an American option breaks the replication argument used to prove parity, so it strictly applies only to European options.",
    },
    commonMistake: {
      fr: "Appliquer la parité sans vérifier le style d'exercice des options concernées.",
      en: "Applying parity without checking the exercise style of the options involved.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m05-parite-vocab",
  conceptId: "m05-parite-call-put",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La démonstration de la parité call-put repose sur la construction de deux portefeuilles qui produisent le même résultat final : on parle d'argument de ______.",
      en: "The proof of put-call parity relies on building two portfolios that produce the same final outcome: this is called a ______ argument.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["replication", "réplication"],
    hint: { fr: "Les deux portefeuilles \"répliquent\" le même payoff.", en: "The two portfolios \"replicate\" the same payoff." },
    explanation: {
      fr: "Un argument de réplication montre que deux combinaisons d'instruments produisant le même payoff doivent avoir le même prix, sous peine d'arbitrage.",
      en: "A replication argument shows that two combinations of instruments producing the same payoff must have the same price, or an arbitrage exists.",
    },
    commonMistake: {
      fr: "Confondre cet argument avec une simple observation empirique de corrélation de prix.",
      en: "Confusing this argument with a mere empirical observation of price correlation.",
    },
  }),
};

export const templates: QuestionTemplate[] = [impliedPutTemplate, arbitrageDirectionTemplate, europeanOnlyTemplate, vocabTemplate];
