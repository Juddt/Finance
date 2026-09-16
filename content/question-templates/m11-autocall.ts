import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const payoffScenarioTemplate: QuestionTemplate = {
  id: "m11-autocall-payoff-scenario",
  conceptId: "m11-autocall",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const coupon = randomInt(rng, 5, 10);
    const callBarrier = 100;
    const s1 = randomInt(rng, 80, 99);
    const s2 = randomInt(rng, 100, 130);
    const nominal = 100;
    const called = s2 >= callBarrier;
    const payoff = called ? Math.round((nominal * (1 + (2 * coupon) / 100)) * 10) / 10 : 0;

    return {
      isScenario: true,
      prompt: {
        fr: `Un autocall (nominal 100) a un coupon annuel de ${coupon}% avec mémoire, barrière de rappel à 100. Année 1 : sous-jacent à ${s1} (pas de rappel, coupon mémorisé). Année 2 : sous-jacent à ${s2}. Quel est le remboursement total reçu en année 2 (0 si pas de rappel) ?`,
        en: `An autocall (face value 100) has an annual coupon of ${coupon}% with memory, call barrier at 100. Year 1: underlying at ${s1} (no call, coupon memorized). Year 2: underlying at ${s2}. What is the total repayment received in year 2 (0 if not called)?`,
      },
      numericUnit: { fr: "même unité que le nominal", en: "same unit as the face value" },
      numericTolerance: "± 0.5",
      hint: { fr: "Vérifiez si S(t2) ≥ barrière de rappel (100). Si oui, le nominal plus les DEUX coupons cumulés sont versés.", en: "Check whether S(t2) ≥ the call barrier (100). If so, the face value plus BOTH cumulative coupons are paid." },
      numeric: { value: payoff, tolerance: 0.5 },
      calculation: {
        fr: called
          ? `S(t2)=${s2} ≥ 100 : rappel. Payoff = 100×(1+2×${coupon}%) = ${fmt(payoff, "fr", 1)}.`
          : `S(t2)=${s2} < 100 : pas de rappel, le produit continue, aucun remboursement cette année-là (payoff intermédiaire = 0).`,
        en: called
          ? `S(t2)=${s2} ≥ 100: called. Payoff = 100×(1+2×${coupon}%) = ${fmt(payoff, "en", 1)}.`
          : `S(t2)=${s2} < 100: not called, the product continues, no repayment that year (interim payoff = 0).`,
      },
      explanation: {
        fr: "Grâce à la clause de mémoire, un rappel récupère tous les coupons manqués aux dates précédentes, pas seulement celui de la date courante.",
        en: "Thanks to the memory clause, a call recovers all coupons missed on previous dates, not just the current date's.",
      },
      commonMistake: {
        fr: "Oublier la clause de mémoire et ne compter qu'un seul coupon au lieu des deux cumulés.",
        en: "Forgetting the memory clause and counting only one coupon instead of both cumulated ones.",
      },
    };
  },
};

const barrierRolesTemplate: QuestionTemplate = {
  id: "m11-autocall-roles-barrieres",
  conceptId: "m11-autocall",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quelle est la différence de rôle entre la barrière de rappel et la barrière de capital d'un autocall ?",
      en: "What is the difference in role between an autocall's call barrier and capital barrier?",
    },
    choices: buildChoices([
      { id: "correct", label: { fr: "Rappel = remboursement anticipé favorable ; Capital = seuil de perte à l'échéance finale", en: "Call = favorable early redemption; Capital = loss threshold at final maturity" } },
      { id: "same", label: { fr: "Ce sont deux noms pour le même niveau de barrière", en: "They are two names for the same barrier level" } },
    ]),
    hint: { fr: "L'une est observée à chaque date, l'autre seulement à l'échéance finale si aucun rappel n'a eu lieu.", en: "One is observed on every date, the other only at final maturity if no call occurred." },
    correctChoiceIds: ["correct"],
    explanation: {
      fr: "La barrière de rappel, testée à chaque date d'observation, déclenche un remboursement anticipé favorable si elle est franchie. La barrière de capital, testée seulement à l'échéance finale si aucun rappel n'a eu lieu, déclenche une perte en capital si le sous-jacent est en dessous.",
      en: "The call barrier, tested on each observation date, triggers a favorable early redemption if crossed. The capital barrier, tested only at final maturity if no call occurred, triggers a capital loss if the underlying is below it.",
    },
    commonMistake: {
      fr: "Confondre les deux barrières, qui ont des rôles et des conséquences opposés pour l'investisseur.",
      en: "Confusing the two barriers, which have opposite roles and consequences for the investor.",
    },
  }),
};

const capLimitTemplate: QuestionTemplate = {
  id: "m11-autocall-plafonnement-gain",
  conceptId: "m11-autocall",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un rappel anticipé plafonne le gain total possible pour l'investisseur, comparé à un maintien du produit jusqu'à l'échéance finale.",
      en: "An early call caps the investor's total possible gain, compared to holding the product until final maturity.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : un rappel anticipé arrête le produit, donc empêche l'accumulation de coupons supplémentaires aux dates ultérieures, contrairement à un maintien qui pourrait générer plus de coupons.",
      en: "True: an early call stops the product, preventing further coupon accumulation on later dates, unlike holding it which could generate more coupons.",
    },
    commonMistake: {
      fr: "Croire qu'un rappel anticipé est toujours strictement le meilleur scénario possible pour l'investisseur.",
      en: "Believing an early call is always strictly the best possible scenario for the investor.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m11-autocall-vocab",
  conceptId: "m11-autocall",
  kind: "fill_blank",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const term = pick(rng, ["memoire", "rappel"] as const);
    return {
      prompt: term === "memoire"
        ? { fr: "La clause qui permet de récupérer tous les coupons manqués aux dates précédentes lors d'un rappel s'appelle la clause de ______.", en: "The clause allowing recovery of all coupons missed on previous dates upon a call is called the ______ clause." }
        : { fr: "Le remboursement automatique anticipé d'un autocall, déclenché quand le sous-jacent franchit sa barrière, s'appelle un ______.", en: "An autocall's automatic early redemption, triggered when the underlying crosses its barrier, is called a ______." },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: term === "memoire" ? ["memoire", "mémoire", "memory"] : ["rappel", "call"],
      hint: { fr: "Le même mot que dans le glossaire de la leçon.", en: "The same word as in the lesson's glossary." },
      explanation: term === "memoire"
        ? { fr: "La clause de mémoire permet de cumuler et récupérer les coupons manqués lors d'un rappel ultérieur, plutôt que de les perdre définitivement.", en: "The memory clause lets missed coupons be cumulated and recovered on a later call, rather than being permanently lost." }
        : { fr: "Le rappel (autocall) est le remboursement automatique anticipé du produit lorsque le sous-jacent franchit la barrière de rappel à une date d'observation.", en: "The call (autocall) is the product's automatic early redemption when the underlying crosses the call barrier on an observation date." },
      commonMistake: {
        fr: "Confondre ce terme avec la barrière de capital, qui a un rôle opposé.",
        en: "Confusing this term with the capital barrier, which has an opposite role.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [payoffScenarioTemplate, barrierRolesTemplate, capLimitTemplate, vocabTemplate];
