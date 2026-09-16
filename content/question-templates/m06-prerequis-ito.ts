import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const itoRuleTemplate: QuestionTemplate = {
  id: "m06-ito-regle",
  conceptId: "m06-prerequis-ito",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "En calcul stochastique, à quoi (dW_t)² est-il égal, contrairement au calcul classique où (dx)² est négligé ?",
      en: "In stochastic calculus, what does (dW_t)² equal, unlike ordinary calculus where (dx)² is ignored?",
    },
    choices: buildChoices([
      { id: "dt", label: { fr: "dt", en: "dt" } },
      { id: "zero", label: { fr: "0", en: "0" } },
      { id: "dwt", label: { fr: "dW_t", en: "dW_t" } },
    ]),
    hint: { fr: "C'est cette règle qui fait toute la différence du lemme d'Itô par rapport au calcul classique.", en: "This rule is what makes Itô's lemma different from ordinary calculus." },
    correctChoiceIds: ["dt"],
    explanation: {
      fr: "La règle fondamentale du calcul d'Itô est (dW_t)² = dt : ce terme, négligeable en calcul classique, ne l'est pas ici et donne naissance au terme additionnel du lemme d'Itô.",
      en: "The fundamental rule of Itô calculus is (dW_t)² = dt: this term, negligible in ordinary calculus, is not here, giving rise to Itô's lemma's additional term.",
    },
    commonMistake: {
      fr: "Croire que (dW_t)² est négligeable comme en calcul classique, ce qui fait perdre le terme clé du lemme d'Itô.",
      en: "Believing (dW_t)² is negligible as in ordinary calculus, losing Itô's lemma's key term.",
    },
  }),
};

const itoTermTemplate: QuestionTemplate = {
  id: "m06-ito-terme-additionnel",
  conceptId: "m06-prerequis-ito",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le lemme d'Itô ajoute un terme en ½σ²∂²f/∂x² par rapport à la règle de dérivation classique d'une fonction composée.",
      en: "Itô's lemma adds a ½σ²∂²f/∂x² term compared to the ordinary chain rule for a composite function.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : c'est précisément ce terme additionnel, issu de (dW_t)²=dt, qui distingue le lemme d'Itô du calcul classique.",
      en: "True: this is precisely the additional term, coming from (dW_t)²=dt, that distinguishes Itô's lemma from ordinary calculus.",
    },
    commonMistake: {
      fr: "Oublier ce terme et appliquer la règle de dérivation classique à une fonction d'un processus stochastique.",
      en: "Forgetting this term and applying the ordinary chain rule to a function of a stochastic process.",
    },
  }),
};

const riskNeutralTemplate: QuestionTemplate = {
  id: "m06-ito-mesure-risque-neutre",
  conceptId: "m06-prerequis-ito",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "replace", fr: "remplacer le vrai drift μ par le taux sans risque r dans les formules de pricing", en: "replace the true drift μ with the risk-free rate r in pricing formulas" },
        { id: "keep-vol", fr: "conserver la même volatilité σ que sous la mesure réelle", en: "keep the same volatility σ as under the real-world measure" },
      ] as const
    );

    return {
      prompt: {
        fr: `Le passage à la mesure risque-neutre permet de ${scenario.fr}. Cette affirmation est-elle correcte ?`,
        en: `Switching to the risk-neutral measure lets you ${scenario.en}. Is this statement correct?`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: { fr: "Le théorème de Girsanov ne change que le drift, jamais la volatilité.", en: "Girsanov's theorem only changes the drift, never the volatility." },
      correctChoiceIds: ["true"],
      explanation: {
        fr: `${scenario.id === "replace" ? "Vrai : c'est exactement le résultat du théorème de Girsanov, qui permet de pricer sans connaître le vrai rendement attendu des investisseurs." : "Vrai : la volatilité σ reste identique sous la mesure réelle et sous la mesure risque-neutre, seul le drift change."}`,
        en: `${scenario.id === "replace" ? "True: this is exactly the result of Girsanov's theorem, which lets you price without knowing investors' true expected return." : "True: volatility σ stays identical under the real-world and risk-neutral measures, only the drift changes."}`,
      },
      commonMistake: {
        fr: "Croire que le changement de mesure risque-neutre modifie aussi la volatilité, ce qui est faux.",
        en: "Believing the risk-neutral measure change also modifies volatility, which is false.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-ito-vocab",
  conceptId: "m06-prerequis-ito",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un processus dont la meilleure prévision de la valeur future, sachant le présent, est exactement la valeur actuelle, s'appelle une ______.",
      en: "A process whose best forecast of its future value, given the present, is exactly the current value, is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["martingale"],
    hint: { fr: "Le terme utilisé pour \"pas de tendance prévisible\".", en: "The term used for \"no predictable trend\"." },
    explanation: {
      fr: "Une martingale n'a, par définition, aucune tendance prévisible — c'est le comportement de tout actif actualisé sous la mesure risque-neutre.",
      en: "A martingale has, by definition, no predictable trend — the behavior of any discounted asset under the risk-neutral measure.",
    },
    commonMistake: {
      fr: "Confondre martingale avec mouvement brownien, alors qu'un mouvement brownien est un exemple particulier de martingale, pas l'inverse.",
      en: "Confusing martingale with Brownian motion, when Brownian motion is a particular example of a martingale, not the other way around.",
    },
  }),
};

export const templates: QuestionTemplate[] = [itoRuleTemplate, itoTermTemplate, riskNeutralTemplate, vocabTemplate];
