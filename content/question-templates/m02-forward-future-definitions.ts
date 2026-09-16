import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const ASSETS = ["une action", "un baril de pétrole", "une devise", "une tonne de blé"] as const;
const ASSETS_EN = ["a share", "a barrel of oil", "a currency", "a tonne of wheat"] as const;

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const payoffNumericTemplate: QuestionTemplate = {
  id: "m02-forward-def-payoff-calcul",
  conceptId: "m02-forward-future-definitions",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const idx = randomInt(rng, 0, ASSETS.length - 1);
    const K = randomInt(rng, 40, 120);
    const sT = randomInt(rng, 20, 150);
    const direction = pick(rng, ["long", "short"] as const);
    const answer = direction === "long" ? sT - K : K - sT;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous détenez une position ${direction === "long" ? "longue" : "courte"} sur un forward portant sur ${ASSETS[idx]}, avec un prix de livraison K = ${fmt(K, "fr")}. À l'échéance, le prix spot est S_T = ${fmt(sT, "fr")}. Quel est votre payoff ?`,
        en: `You hold a ${direction} position on a forward on ${ASSETS_EN[idx]}, with delivery price K = ${fmt(K, "en")}. At maturity, the spot price is S_T = ${fmt(sT, "en")}. What is your payoff?`,
      },
      numericUnit: { fr: "par unité", en: "per unit" },
      numericTolerance: "± 0.5",
      hint: {
        fr: direction === "long" ? "Payoff long = S_T − K." : "Payoff court = K − S_T.",
        en: direction === "long" ? "Long payoff = S_T − K." : "Short payoff = K − S_T.",
      },
      numeric: { value: answer, tolerance: 0.5 },
      calculation: {
        fr:
          direction === "long"
            ? `Payoff = S_T − K = ${fmt(sT, "fr")} − ${fmt(K, "fr")} = ${fmt(answer, "fr")}.`
            : `Payoff = K − S_T = ${fmt(K, "fr")} − ${fmt(sT, "fr")} = ${fmt(answer, "fr")}.`,
        en:
          direction === "long"
            ? `Payoff = S_T − K = ${fmt(sT, "en")} − ${fmt(K, "en")} = ${fmt(answer, "en")}.`
            : `Payoff = K − S_T = ${fmt(K, "en")} − ${fmt(sT, "en")} = ${fmt(answer, "en")}.`,
      },
      explanation: {
        fr: "Il n'y a pas de prime à déduire pour un forward : le payoff calculé est directement le profit ou la perte de la position.",
        en: "There is no premium to subtract for a forward: the computed payoff is directly the position's profit or loss.",
      },
      commonMistake: {
        fr: "Inverser la formule long/court, ou soustraire une prime comme on le ferait pour une option.",
        en: "Swapping the long/short formula, or subtracting a premium as one would for an option.",
      },
    };
  },
};

const noPremiumTemplate: QuestionTemplate = {
  id: "m02-forward-def-pas-de-prime",
  conceptId: "m02-forward-future-definitions",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Comme pour une option, l'acheteur d'un forward paie une prime au vendeur à la conclusion du contrat.",
      en: "As with an option, the buyer of a forward pays a premium to the seller at inception.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un forward est un engagement ferme des deux côtés, sans paiement initial. C'est justement ce qui le distingue d'une option, où l'acheteur paie une prime pour un droit (et non une obligation).",
      en: "False: a forward is a firm two-way commitment, with no upfront payment. This is precisely what distinguishes it from an option, where the buyer pays a premium for a right (not an obligation).",
    },
    commonMistake: {
      fr: "Confondre le fonctionnement d'un forward avec celui d'une option, en particulier sur la notion de prime.",
      en: "Confusing how a forward works with how an option works, particularly regarding the premium.",
    },
  }),
};

const directionMcqTemplate: QuestionTemplate = {
  id: "m02-forward-def-direction",
  conceptId: "m02-forward-future-definitions",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 40, 120);
    const sT = randomInt(rng, 20, 150);
    const direction = pick(rng, ["long", "short"] as const);
    const payoff = direction === "long" ? sT - K : K - sT;
    const correctId = payoff > 0 ? "gain" : payoff < 0 ? "loss" : "zero";

    return {
      isScenario: true,
      prompt: {
        fr: `Position ${direction === "long" ? "longue" : "courte"}, K = ${fmt(K, "fr")}, S_T = ${fmt(sT, "fr")}. La position se solde-t-elle par un gain, une perte, ou exactement zéro ?`,
        en: `${direction === "long" ? "Long" : "Short"} position, K = ${fmt(K, "en")}, S_T = ${fmt(sT, "en")}. Does the position end in a gain, a loss, or exactly zero?`,
      },
      choices: buildChoices([
        { id: "gain", label: { fr: "Un gain", en: "A gain" } },
        { id: "loss", label: { fr: "Une perte", en: "A loss" } },
        { id: "zero", label: { fr: "Exactement zéro", en: "Exactly zero" } },
      ]),
      hint: {
        fr: direction === "long" ? "Comparez S_T à K : le long profite si S_T > K." : "Comparez K à S_T : le court profite si S_T < K.",
        en: direction === "long" ? "Compare S_T to K: the long profits if S_T > K." : "Compare K to S_T: the short profits if S_T < K.",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `Payoff = ${direction === "long" ? `${fmt(sT, "fr")} − ${fmt(K, "fr")}` : `${fmt(K, "fr")} − ${fmt(sT, "fr")}`} = ${fmt(payoff, "fr")}, ce qui est ${payoff > 0 ? "positif (gain)" : payoff < 0 ? "négatif (perte)" : "nul"}.`,
        en: `Payoff = ${direction === "long" ? `${fmt(sT, "en")} − ${fmt(K, "en")}` : `${fmt(K, "en")} − ${fmt(sT, "en")}`} = ${fmt(payoff, "en")}, which is ${payoff > 0 ? "positive (gain)" : payoff < 0 ? "negative (loss)" : "zero"}.`,
      },
      commonMistake: {
        fr: "Se tromper de sens pour la position courte : elle gagne quand le prix baisse, pas quand il monte.",
        en: "Getting the short position's direction backwards: it gains when the price falls, not when it rises.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m02-forward-def-vocab",
  conceptId: "m02-forward-future-definitions",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Celui qui s'engage à ACHETER le sous-jacent à l'échéance détient une position ______.",
      en: "Whoever commits to BUYING the underlying at maturity holds a ______ position.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["longue", "long"],
    hint: {
      fr: "C'est le même mot qu'en anglais financier.",
      en: "Same word used in French finance jargon (longue).",
    },
    explanation: {
      fr: "La position longue est engagée à l'achat ; la position courte est engagée à la vente.",
      en: "The long position is committed to buying; the short position is committed to selling.",
    },
    commonMistake: {
      fr: "Confondre position longue et position courte, une confusion fréquente au début.",
      en: "Confusing long and short positions, a common early mistake.",
    },
  }),
};

export const templates: QuestionTemplate[] = [payoffNumericTemplate, noPremiumTemplate, directionMcqTemplate, vocabTemplate];
