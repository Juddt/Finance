import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const stdDevNumericTemplate: QuestionTemplate = {
  id: "m06-brownien-ecart-type",
  conceptId: "m06-mouvement-brownien",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const t = randomInt(rng, 1, 16);
    const stdDev = Math.round(Math.sqrt(t) * 1000) / 1000;

    return {
      prompt: {
        fr: `Pour un mouvement brownien standard W_t, quel est l'écart-type de W_${t} ?`,
        en: `For a standard Brownian motion W_t, what is the standard deviation of W_${t}?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.01",
      hint: { fr: "W_t ~ N(0,t) : l'écart-type est √t.", en: "W_t ~ N(0,t): the standard deviation is √t." },
      numeric: { value: stdDev, tolerance: 0.01 },
      calculation: { fr: `Écart-type = √${t} ≈ ${fmt(stdDev, "fr")}.`, en: `Standard deviation = √${t} ≈ ${fmt(stdDev, "en")}.` },
      explanation: {
        fr: "La variance de W_t vaut t, donc l'écart-type vaut √t, pas t.",
        en: "W_t's variance equals t, so the standard deviation equals √t, not t.",
      },
      commonMistake: {
        fr: "Répondre t directement au lieu de √t, en confondant variance et écart-type.",
        en: "Answering t directly instead of √t, confusing variance and standard deviation.",
      },
    };
  },
};

const propertiesTemplate: QuestionTemplate = {
  id: "m06-brownien-proprietes",
  conceptId: "m06-mouvement-brownien",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const claim = pick(
      rng,
      [
        { id: "continuous", fr: "Les trajectoires sont continues mais nulle part dérivables", en: "Paths are continuous but nowhere differentiable" },
        { id: "independent", fr: "Les accroissements sur des intervalles disjoints sont indépendants", en: "Increments over disjoint intervals are independent" },
        { id: "zero", fr: "W_0 = 0 par définition", en: "W_0 = 0 by definition" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle de ces propriétés caractérise un mouvement brownien standard : « ${claim.fr} » ?`,
        en: `Which of these properties characterizes a standard Brownian motion: "${claim.en}"?`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "C'est une propriété correcte du mouvement brownien", en: "This is a correct property of Brownian motion" } },
        { id: "false", label: { fr: "Ce n'est pas une propriété du mouvement brownien", en: "This is not a property of Brownian motion" } },
      ]),
      hint: { fr: "Les trois propriétés citées dans ce quiz sont toutes vraies pour un brownien standard — réfléchissez à la définition complète.", en: "All three properties cited in this quiz are true for a standard Brownian motion — think about the full definition." },
      correctChoiceIds: ["true"],
      explanation: {
        fr: `« ${claim.fr} » est bien une propriété fondamentale du mouvement brownien standard, avec W_0=0, les accroissements indépendants et stationnaires, et la continuité sans dérivabilité.`,
        en: `"${claim.en}" is indeed a fundamental property of standard Brownian motion, along with W_0=0, independent and stationary increments, and continuity without differentiability.`,
      },
      commonMistake: {
        fr: "Penser que la continuité implique la dérivabilité, ce qui est faux pour le mouvement brownien.",
        en: "Thinking continuity implies differentiability, which is false for Brownian motion.",
      },
    };
  },
};

const differentiableTemplate: QuestionTemplate = {
  id: "m06-brownien-derivable",
  conceptId: "m06-mouvement-brownien",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Les trajectoires d'un mouvement brownien standard sont dérivables presque partout, comme la plupart des fonctions continues rencontrées en calcul classique.",
      en: "Standard Brownian motion paths are differentiable almost everywhere, like most continuous functions encountered in ordinary calculus.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : les trajectoires du mouvement brownien sont continues mais NULLE PART dérivables, une propriété contre-intuitive qui distingue radicalement le calcul stochastique du calcul classique.",
      en: "False: Brownian motion paths are continuous but NOWHERE differentiable, a counter-intuitive property that radically distinguishes stochastic calculus from ordinary calculus.",
    },
    commonMistake: {
      fr: "Généraliser l'intuition du calcul classique (continu ⇒ presque toujours dérivable) au mouvement brownien.",
      en: "Generalizing ordinary calculus intuition (continuous ⇒ almost always differentiable) to Brownian motion.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-brownien-vocab",
  conceptId: "m06-mouvement-brownien",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une famille de variables aléatoires indexée par le temps, décrivant l'évolution incertaine d'une quantité, s'appelle un processus ______.",
      en: "A family of random variables indexed by time, describing a quantity's uncertain evolution, is called a ______ process.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["stochastique", "stochastic"],
    hint: { fr: "Le terme mathématique pour « aléatoire dans le temps ».", en: "The mathematical term for \"random over time\"." },
    explanation: {
      fr: "Un processus stochastique est la structure mathématique générale dont le mouvement brownien est un cas particulier fondamental.",
      en: "A stochastic process is the general mathematical structure of which Brownian motion is a foundational special case.",
    },
    commonMistake: {
      fr: "Confondre \"processus stochastique\" (la structure générale) avec \"mouvement brownien\" (un exemple particulier de cette structure).",
      en: "Confusing \"stochastic process\" (the general structure) with \"Brownian motion\" (a particular example of that structure).",
    },
  }),
};

export const templates: QuestionTemplate[] = [stdDevNumericTemplate, propertiesTemplate, differentiableTemplate, vocabTemplate];
