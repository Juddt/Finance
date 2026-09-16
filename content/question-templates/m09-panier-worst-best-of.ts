import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const worstOfPayoffNumericTemplate: QuestionTemplate = {
  id: "m09-worstof-payoff-calcul",
  conceptId: "m09-panier-worst-best-of",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const r1 = randomInt(rng, -20, 25);
    const r2 = randomInt(rng, -20, 25);
    const r3 = randomInt(rng, -20, 25);
    const kPct = randomInt(rng, -10, 5);
    const worst = Math.min(r1, r2, r3);
    const payoff = Math.max(worst - kPct, 0);

    return {
      isScenario: true,
      prompt: {
        fr: `Un Worst-Of call sur 3 actions a un strike K=${kPct}%. Les rendements réalisés sont ${r1}%, ${r2}%, ${r3}%. Quel est le payoff, en % (avant multiplication par le notionnel) ?`,
        en: `A Worst-Of call on 3 stocks has strike K=${kPct}%. Realized returns are ${r1}%, ${r2}%, ${r3}%. What is the payoff, in % (before multiplying by the notional)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "Payoff = max(min(R1,R2,R3) − K, 0).", en: "Payoff = max(min(R1,R2,R3) − K, 0)." },
      numeric: { value: payoff, tolerance: 0.5 },
      calculation: {
        fr: `Pire rendement = min(${r1}%, ${r2}%, ${r3}%) = ${worst}%. Payoff = max(${worst}%−${kPct}%, 0) = ${fmt(payoff, "fr")}%.`,
        en: `Worst return = min(${r1}%, ${r2}%, ${r3}%) = ${worst}%. Payoff = max(${worst}%−${kPct}%, 0) = ${fmt(payoff, "en")}%.`,
      },
      explanation: {
        fr: "Même si un ou deux actifs performent très bien, seul le pire des trois détermine le payoff du Worst-Of.",
        en: "Even if one or two assets perform very well, only the worst of the three determines the Worst-Of's payoff.",
      },
      commonMistake: {
        fr: "Utiliser la moyenne des trois rendements (comme pour un panier) au lieu du minimum.",
        en: "Using the average of the three returns (as for a basket) instead of the minimum.",
      },
    };
  },
};

const worstOfCheaperTemplate: QuestionTemplate = {
  id: "m09-worstof-moins-cher",
  conceptId: "m09-panier-worst-best-of",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un Worst-Of call sur plusieurs actions est toujours moins cher qu'un call classique sur la meilleure de ces actions, prise isolément.",
      en: "A Worst-Of call on several stocks is always cheaper than a classic call on the best of these stocks, taken alone.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : la condition de succès d'un Worst-Of est plus stricte (TOUS les actifs doivent bien performer, pas un seul), ce qui le rend structurellement moins cher — une décote exploitée par les émetteurs de produits structurés.",
      en: "True: a Worst-Of's success condition is stricter (ALL assets must perform well, not just one), making it structurally cheaper — a discount exploited by structured product issuers.",
    },
    commonMistake: {
      fr: "Croire qu'un Worst-Of coûte le même prix qu'un call sur le meilleur actif du groupe.",
      en: "Believing a Worst-Of costs the same as a call on the group's best asset.",
    },
  }),
};

const bestOfTemplate: QuestionTemplate = {
  id: "m09-bestof-definition",
  conceptId: "m09-panier-worst-best-of",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const r1 = randomInt(rng, -15, 20);
    const r2 = randomInt(rng, -15, 20);
    const best = Math.max(r1, r2);
    return {
      isScenario: true,
      prompt: {
        fr: `Un Best-Of porte sur deux actions dont les rendements sont ${r1}% et ${r2}%. Quel rendement le Best-Of retient-il pour calculer le payoff ?`,
        en: `A Best-Of covers two stocks whose returns are ${r1}% and ${r2}%. Which return does the Best-Of retain to compute the payoff?`,
      },
      choices: buildChoices([
        { id: "best", label: { fr: `${fmt(best, "fr")}% (le meilleur)`, en: `${fmt(best, "en")}% (the best)` } },
        { id: "avg", label: { fr: `${fmt((r1 + r2) / 2, "fr")}% (la moyenne)`, en: `${fmt((r1 + r2) / 2, "en")}% (the average)` } },
      ]),
      hint: { fr: "Best-Of retient le MEILLEUR rendement, pas la moyenne.", en: "Best-Of retains the BEST return, not the average." },
      correctChoiceIds: ["best"],
      explanation: {
        fr: `Un Best-Of retient le meilleur rendement parmi les actifs, ici max(${r1}%, ${r2}%) = ${best}%.`,
        en: `A Best-Of retains the best return among the assets, here max(${r1}%, ${r2}%) = ${best}%.`,
      },
      commonMistake: {
        fr: "Confondre Best-Of (le meilleur) avec un panier (la moyenne).",
        en: "Confusing Best-Of (the best) with a basket (the average).",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m09-worstof-vocab",
  conceptId: "m09-panier-worst-best-of",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La moyenne pondérée des rendements individuels de chaque actif composant un ensemble d'actifs s'appelle le rendement du ______.",
      en: "The weighted average of the individual returns of each asset in a group of assets is called the ______ return.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["panier", "basket"],
    hint: { fr: "Le terme utilisé quand on \"met tous les actifs dans le même panier\".", en: "The term used when all assets are put \"in the same basket\"." },
    explanation: {
      fr: "Le rendement du panier moyenne tous les composants, contrairement au Worst-Of (minimum) ou au Best-Of (maximum).",
      en: "The basket return averages all components, unlike Worst-Of (minimum) or Best-Of (maximum).",
    },
    commonMistake: {
      fr: "Confondre le rendement du panier avec le rendement du Worst-Of ou du Best-Of.",
      en: "Confusing the basket return with the Worst-Of's or Best-Of's return.",
    },
  }),
};

export const templates: QuestionTemplate[] = [worstOfPayoffNumericTemplate, worstOfCheaperTemplate, bestOfTemplate, vocabTemplate];
