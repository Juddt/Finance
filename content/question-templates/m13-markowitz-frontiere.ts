import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { randomInt, type Rng } from "@/lib/prng";

const belowFrontierTemplate: QuestionTemplate = {
  id: "m13-markowitz-sous-optimal",
  conceptId: "m13-markowitz-frontiere",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un portefeuille situé en dessous de la frontière efficiente est qualifié de :",
      en: "A portfolio located below the efficient frontier is described as:",
    },
    choices: buildChoices([
      { id: "suboptimal", label: { fr: "Sous-optimal : un autre portefeuille offre plus de rendement pour le même risque", en: "Suboptimal: another portfolio offers more return for the same risk" } },
      { id: "optimal", label: { fr: "Optimal, car il a un risque plus faible que la frontière", en: "Optimal, since it has lower risk than the frontier" } },
    ]),
    hint: { fr: "La frontière représente le MEILLEUR rendement possible pour chaque niveau de risque.", en: "The frontier represents the BEST possible return for each risk level." },
    correctChoiceIds: ["suboptimal"],
    explanation: {
      fr: "Tout portefeuille en dessous de la frontière efficiente est sous-optimal : il existe toujours un autre portefeuille sur la frontière offrant plus de rendement pour le même risque, ou moins de risque pour le même rendement.",
      en: "Any portfolio below the efficient frontier is suboptimal: there's always another portfolio on the frontier offering more return for the same risk, or less risk for the same return.",
    },
    commonMistake: {
      fr: "Croire qu'un portefeuille en dessous de la frontière est automatiquement plus sûr, sans comparer à ce qui est réellement atteignable.",
      en: "Believing a portfolio below the frontier is automatically safer, without comparing to what's actually achievable.",
    },
  }),
};

const separationTheoremTemplate: QuestionTemplate = {
  id: "m13-markowitz-separation",
  conceptId: "m13-markowitz-frontiere",
  kind: "true_false",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Selon le théorème de séparation, tous les investisseurs rationnels, quelle que soit leur aversion au risque, devraient détenir la même composition d'actifs risqués (le portefeuille tangent).",
      en: "According to the separation theorem, all rational investors, whatever their risk aversion, should hold the same risky-asset composition (the tangency portfolio).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : avec un actif sans risque disponible, tout investisseur devrait détenir le même portefeuille tangent d'actifs risqués, et ajuster son risque global uniquement via la proportion investie dans l'actif sans risque.",
      en: "True: with a risk-free asset available, every investor should hold the same tangency portfolio of risky assets, and adjust their overall risk only via the proportion invested in the risk-free asset.",
    },
    commonMistake: {
      fr: "Croire que des investisseurs avec des aversions au risque différentes devraient détenir des combinaisons d'actifs risqués différentes.",
      en: "Believing investors with different risk aversions should hold different risky-asset combinations.",
    },
  }),
};

const estimationRiskTemplate: QuestionTemplate = {
  id: "m13-markowitz-risque-estimation",
  conceptId: "m13-markowitz-frontiere",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quelle est une limite pratique majeure de la frontière efficiente de Markowitz ?",
      en: "What is a major practical limitation of the Markowitz efficient frontier?",
    },
    choices: buildChoices([
      { id: "sensitivity", label: { fr: "Elle est très sensible aux erreurs d'estimation des rendements espérés", en: "It's highly sensitive to expected-return estimation errors" } },
      { id: "no-limit", label: { fr: "Elle n'a aucune limite pratique connue", en: "It has no known practical limitation" } },
    ]),
    hint: { fr: "Les rendements futurs sont notoirement difficiles à estimer, contrairement aux volatilités et corrélations.", en: "Future returns are notoriously hard to estimate, unlike volatilities and correlations." },
    correctChoiceIds: ["sensitivity"],
    explanation: {
      fr: "La frontière de Markowitz est très sensible aux erreurs d'estimation des rendements espérés, produisant parfois des allocations extrêmes et peu robustes en pratique.",
      en: "The Markowitz frontier is highly sensitive to expected-return estimation errors, sometimes producing extreme, poorly robust allocations in practice.",
    },
    commonMistake: {
      fr: "Croire que la théorie de Markowitz est directement applicable sans ajustement pratique aux incertitudes d'estimation.",
      en: "Believing Markowitz theory is directly applicable with no practical adjustment for estimation uncertainty.",
    },
  }),
};

const targetReturnNumericTemplate: QuestionTemplate = {
  id: "m13-markowitz-nombre-portefeuilles",
  conceptId: "m13-markowitz-frontiere",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const n = randomInt(rng, 5, 20);
    return {
      isScenario: true,
      prompt: {
        fr: `Pour tracer une frontière efficiente avec ${n} niveaux de rendement cible différents, combien de problèmes d'optimisation quadratique distincts faut-il résoudre (un par niveau de rendement) ?`,
        en: `To trace an efficient frontier with ${n} different target return levels, how many distinct quadratic optimization problems must be solved (one per return level)?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.5",
      hint: { fr: "Un problème d'optimisation par niveau de rendement cible.", en: "One optimization problem per target return level." },
      numeric: { value: n, tolerance: 0.5 },
      calculation: {
        fr: `Chaque niveau de rendement cible nécessite de résoudre un problème d'optimisation distinct : ${n} niveaux → ${n} problèmes.`,
        en: `Each target return level requires solving a distinct optimization problem: ${n} levels → ${n} problems.`,
      },
      explanation: {
        fr: "La frontière efficiente complète se construit en résolvant le problème de minimisation de variance pour chaque niveau de rendement cible souhaité, puis en reliant tous les points obtenus.",
        en: "The full efficient frontier is built by solving the variance-minimization problem for each desired target return level, then connecting all the resulting points.",
      },
      commonMistake: {
        fr: "Croire qu'un seul problème d'optimisation suffit à tracer toute la frontière.",
        en: "Believing a single optimization problem suffices to trace the entire frontier.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [belowFrontierTemplate, separationTheoremTemplate, estimationRiskTemplate, targetReturnNumericTemplate];
