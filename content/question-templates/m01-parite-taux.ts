import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const cipNumericTemplate: QuestionTemplate = {
  id: "m01-cip-calcul",
  conceptId: "m01-parite-taux",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomFloat(rng, 0.85, 1.35, 4);
    const rDomPct = randomInt(rng, 1, 7);
    const rForPct = randomInt(rng, 1, 7);
    const F0 = Math.round(S0 * ((1 + rDomPct / 100) / (1 + rForPct / 100)) * 10000) / 10000;

    return {
      prompt: {
        fr: `S0 = ${fmt(S0, "fr")}, r_dom = ${rDomPct}%, r_étr = ${rForPct}%, T = 1 an. Par la parité couverte des taux, quel est le prix forward F0 ?`,
        en: `S0 = ${fmt(S0, "en")}, r_dom = ${rDomPct}%, r_for = ${rForPct}%, T = 1 year. By covered interest rate parity, what is the forward price F0?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 0.002",
      hint: { fr: "F0 = S0 × (1+r_dom)/(1+r_étr).", en: "F0 = S0 × (1+r_dom)/(1+r_for)." },
      numeric: { value: F0, tolerance: 0.002 },
      calculation: {
        fr: `F0 = ${fmt(S0, "fr")} × (1,${rDomPct.toString().padStart(2, "0")}/1,${rForPct.toString().padStart(2, "0")}) ≈ ${fmt(F0, "fr")}.`,
        en: `F0 = ${fmt(S0, "en")} × (1.${rDomPct.toString().padStart(2, "0")}/1.${rForPct.toString().padStart(2, "0")}) ≈ ${fmt(F0, "en")}.`,
      },
      explanation: {
        fr: "Ce prix forward est mécaniquement imposé par non-arbitrage, indépendamment de toute anticipation sur la direction future du change.",
        en: "This forward price is mechanically enforced by no-arbitrage, independent of any expectation about the future FX direction.",
      },
      commonMistake: {
        fr: "Inverser r_dom et r_étr dans le rapport, ce qui inverse le sens de l'ajustement.",
        en: "Swapping r_dom and r_for in the ratio, which flips the adjustment's direction.",
      },
    };
  },
};

const cipVsUipTemplate: QuestionTemplate = {
  id: "m01-cip-vs-uip",
  conceptId: "m01-parite-taux",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "cip", fr: "cette relation est vérifiée quasi systématiquement sur les devises liquides, car protégée par un mécanisme d'arbitrage", en: "this relationship holds almost systematically on liquid currencies, protected by an arbitrage mechanism" },
        { id: "uip", fr: "cette relation repose sur une anticipation du marché et est souvent invalidée empiriquement (le \"forward premium puzzle\")", en: "this relationship rests on a market expectation and is often empirically invalidated (the \"forward premium puzzle\")" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle des deux parités correspond à : « ${scenario.fr} » ?`,
        en: `Which parity matches: "${scenario.en}"?`,
      },
      choices: buildChoices([
        { id: "cip", label: { fr: "Parité couverte (CIP)", en: "Covered parity (CIP)" } },
        { id: "uip", label: { fr: "Parité non couverte (UIP)", en: "Uncovered parity (UIP)" } },
      ]),
      hint: { fr: "L'une est un résultat d'arbitrage exact, l'autre une hypothèse comportementale.", en: "One is an exact arbitrage result, the other a behavioral assumption." },
      correctChoiceIds: [scenario.id],
      explanation:
        scenario.id === "cip"
          ? { fr: "La CIP est une identité de non-arbitrage : un investisseur peut se couvrir intégralement avec un forward, donc elle se vérifie presque toujours.", en: "CIP is a no-arbitrage identity: an investor can fully hedge with a forward, so it almost always holds." }
          : { fr: "L'UIP suppose que le taux spot futur anticipé égale le forward, sans aucune protection d'arbitrage — une hypothèse souvent contredite empiriquement.", en: "UIP assumes the expected future spot rate equals the forward, with no arbitrage protection — an assumption often empirically contradicted." },
      commonMistake: {
        fr: "Croire que CIP et UIP sont également fiables, alors que seule la CIP est un résultat d'arbitrage garanti.",
        en: "Believing CIP and UIP are equally reliable, when only CIP is a guaranteed arbitrage result.",
      },
    };
  },
};

const carryTradeTemplate: QuestionTemplate = {
  id: "m01-cip-carry-trade",
  conceptId: "m01-parite-taux",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le carry trade non couvert (emprunter dans la devise à taux bas, placer dans celle à taux élevé sans se couvrir) ne serait jamais profitable en moyenne si l'UIP se vérifiait parfaitement.",
      en: "The unhedged carry trade (borrowing in the low-rate currency, investing in the high-rate one unhedged) would never be profitable on average if UIP held perfectly.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : si l'UIP se vérifiait parfaitement, la dépréciation attendue de la devise à taux élevé annulerait exactement son avantage de taux, rendant le carry trade non rentable en moyenne — c'est justement parce que l'UIP est empiriquement violée que le carry trade reste une stratégie étudiée et pratiquée.",
      en: "True: if UIP held perfectly, the high-rate currency's expected depreciation would exactly cancel its rate advantage, making the carry trade unprofitable on average — it is precisely because UIP is empirically violated that the carry trade remains a studied and practiced strategy.",
    },
    commonMistake: {
      fr: "Ne pas voir le lien direct entre la validité empirique de l'UIP et la profitabilité du carry trade.",
      en: "Missing the direct link between UIP's empirical validity and the carry trade's profitability.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-cip-vocab",
  conceptId: "m01-parite-taux",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La parité des taux d'intérêt protégée par un forward, toujours vraie sous hypothèses de marché parfait, est dite parité ______.",
      en: "The interest rate parity protected by a forward, always true under perfect-market assumptions, is called ______ parity.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["couverte", "covered"],
    hint: { fr: "Le risque de change est « couvert » par le forward.", en: "The FX risk is \"covered\" by the forward." },
    explanation: {
      fr: "La parité couverte (CIP) est protégée par la couverture au forward, contrairement à la parité non couverte (UIP).",
      en: "Covered parity (CIP) is protected by the forward hedge, unlike uncovered parity (UIP).",
    },
    commonMistake: {
      fr: "Répondre \"non couverte\", qui décrit l'hypothèse comportementale (UIP), pas le résultat d'arbitrage garanti.",
      en: "Answering \"uncovered\", which describes the behavioral assumption (UIP), not the guaranteed arbitrage result.",
    },
  }),
};

export const templates: QuestionTemplate[] = [cipNumericTemplate, cipVsUipTemplate, carryTradeTemplate, vocabTemplate];
