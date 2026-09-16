import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const spreadReplicationNumericTemplate: QuestionTemplate = {
  id: "m10-replication-calcul",
  conceptId: "m10-replication-digitale",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const C = randomInt(rng, 500, 2000);
    const epsilon = randomInt(rng, 1, 4);
    const callLow = randomInt(rng, 15, 25);
    const callHigh = callLow - randomInt(rng, 3, 8);
    const price = Math.round((C / (2 * epsilon)) * (callLow - callHigh) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une digitale cash-or-nothing (C=${fmt(C, "fr")}) est répliquée par un call spread avec ε=${epsilon}. Le call K−ε vaut ${callLow}, le call K+ε vaut ${callHigh}. Quel est le prix approché de la digitale ?`,
        en: `A cash-or-nothing digital (C=${fmt(C, "en")}) is replicated by a call spread with ε=${epsilon}. The K−ε call is worth ${callLow}, the K+ε call is worth ${callHigh}. What is the digital's approximate price?`,
      },
      numericUnit: { fr: "même devise que C", en: "same currency as C" },
      numericTolerance: "± 20",
      hint: { fr: "Digitale ≈ (C/2ε) × [C_BS(K−ε) − C_BS(K+ε)].", en: "Digital ≈ (C/2ε) × [C_BS(K−ε) − C_BS(K+ε)]." },
      numeric: { value: price, tolerance: 20 },
      calculation: {
        fr: `Digitale ≈ (${fmt(C, "fr")}/(2×${epsilon})) × (${callLow}−${callHigh}) = ${fmt(C / (2 * epsilon), "fr")} × ${callLow - callHigh} ≈ ${fmt(price, "fr")}.`,
        en: `Digital ≈ (${fmt(C, "en")}/(2×${epsilon})) × (${callLow}−${callHigh}) = ${fmt(C / (2 * epsilon), "en")} × ${callLow - callHigh} ≈ ${fmt(price, "en")}.`,
      },
      explanation: {
        fr: "Le facteur d'échelle C/(2ε) multiplie la différence de prix des deux calls pour approximer le payoff 'tout ou rien' de la digitale.",
        en: "The scaling factor C/(2ε) multiplies the two calls' price difference to approximate the digital's 'all or nothing' payoff.",
      },
      commonMistake: {
        fr: "Oublier le facteur d'échelle C/(2ε) et se contenter de la simple différence de prix des deux calls.",
        en: "Forgetting the scaling factor C/(2ε) and settling for the two calls' plain price difference.",
      },
    };
  },
};

const smallerEpsilonTemplate: QuestionTemplate = {
  id: "m10-replication-epsilon-plus-petit",
  conceptId: "m10-replication-digitale",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Réduire ε dans la réplication call spread d'une digitale améliore la précision du payoff, mais au prix de quoi ?",
      en: "Reducing ε in a digital's call-spread replication improves payoff precision, but at what cost?",
    },
    choices: buildChoices([
      { id: "hedging-risk", label: { fr: "Un risque de couverture accru (Delta/Gamma extrêmes)", en: "Increased hedging risk (extreme Delta/Gamma)" } },
      { id: "lower-price", label: { fr: "Un prix systématiquement plus faible", en: "A systematically lower price" } },
    ]),
    hint: { fr: "C'est le même compromis que celui rencontré pour les barrières près de leur seuil.", en: "This is the same trade-off encountered for barriers near their threshold." },
    correctChoiceIds: ["hedging-risk"],
    explanation: {
      fr: "Réduire ε rend le portefeuille de réplication de plus en plus difficile à couvrir dynamiquement, exactement le même problème de Delta/Gamma extrême rencontré pour les options barrières (M10-2).",
      en: "Reducing ε makes the replicating portfolio increasingly difficult to dynamically hedge, exactly the same extreme Delta/Gamma problem encountered for barrier options (M10-2).",
    },
    commonMistake: {
      fr: "Croire qu'un ε plus petit est toujours strictement préférable sans contrepartie.",
      en: "Believing a smaller ε is always strictly preferable with no trade-off.",
    },
  }),
};

const convergenceTemplate: QuestionTemplate = {
  id: "m10-replication-convergence",
  conceptId: "m10-replication-digitale",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quand ε tend vers 0, le call spread converge vers le payoff exact de la digitale.",
      en: "As ε tends to 0, the call spread converges to the digital's exact payoff.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : à la limite ε→0, le call spread reproduit exactement la discontinuité \"tout ou rien\" de la digitale.",
      en: "True: in the limit ε→0, the call spread exactly reproduces the digital's \"all or nothing\" discontinuity.",
    },
    commonMistake: {
      fr: "Croire que le call spread ne peut jamais approximer parfaitement une digitale, même à la limite.",
      en: "Believing the call spread can never perfectly approximate a digital, even in the limit.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-replication-vocab",
  conceptId: "m10-replication-digitale",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un call spread avec deux strikes très proches, utilisé pour approximer une digitale, est dit ______.",
      en: "A call spread with two very close strikes, used to approximate a digital, is said to be ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["serre", "serré", "tight"],
    hint: { fr: "Les deux strikes sont proches l'un de l'autre.", en: "The two strikes are close to each other." },
    explanation: {
      fr: "Un call spread \"serré\" a des strikes proches, ce qui produit une transition abrupte proche du payoff \"tout ou rien\" d'une digitale.",
      en: "A \"tight\" call spread has close strikes, producing a sharp transition close to a digital's \"all or nothing\" payoff.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec un call spread large, qui approxime mal une digitale.",
      en: "Confusing this term with a wide call spread, which poorly approximates a digital.",
    },
  }),
};

export const templates: QuestionTemplate[] = [spreadReplicationNumericTemplate, smallerEpsilonTemplate, convergenceTemplate, vocabTemplate];
