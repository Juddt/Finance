import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const discountingNumericTemplate: QuestionTemplate = {
  id: "m13-actualisation-calcul",
  conceptId: "m13-actualisation-annuites",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 1000, 10000);
    const r = randomInt(rng, 2, 8) / 100;
    const t = randomInt(rng, 2, 10);
    const pv = Math.round(F * Math.exp(-r * t) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous recevrez ${fmt(F, "fr", 0)} dans ${t} ans. Au taux d'actualisation continu de ${fmt(r * 100, "fr", 0)}%, quelle est la valeur actualisée de ce flux aujourd'hui ?`,
        en: `You will receive ${fmt(F, "en", 0)} in ${t} years. At a continuous discount rate of ${fmt(r * 100, "en", 0)}%, what is this flow's present value today?`,
      },
      numericUnit: { fr: "même devise que F", en: "same currency as F" },
      numericTolerance: "± 15",
      hint: { fr: "VA = F × e^(−rt).", en: "PV = F × e^(−rt)." },
      numeric: { value: pv, tolerance: 15 },
      calculation: {
        fr: `VA = ${fmt(F, "fr", 0)} × e^(−${fmt(r, "fr", 2)}×${t}) ≈ ${fmt(pv, "fr")}.`,
        en: `PV = ${fmt(F, "en", 0)} × e^(−${fmt(r, "en", 2)}×${t}) ≈ ${fmt(pv, "en")}.`,
      },
      explanation: {
        fr: "L'actualisation \"ramène\" un flux futur à sa valeur équivalente présente, en tenant compte du fait qu'un euro aujourd'hui vaut plus qu'un euro futur.",
        en: "Discounting \"brings back\" a future flow to its equivalent present value, accounting for the fact that a euro today is worth more than a future euro.",
      },
      commonMistake: {
        fr: "Oublier le signe négatif dans l'exposant, ce qui reviendrait à capitaliser au lieu d'actualiser.",
        en: "Forgetting the negative sign in the exponent, which would amount to compounding instead of discounting.",
      },
    };
  },
};

const yieldCurveTemplate: QuestionTemplate = {
  id: "m13-actualisation-courbe-taux",
  conceptId: "m13-actualisation-annuites",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une courbe des taux inversée (taux courts plus élevés que les taux longs) est souvent interprétée comme un signal de quoi ?",
      en: "An inverted yield curve (short rates higher than long rates) is often interpreted as a signal of what?",
    },
    choices: buildChoices([
      { id: "slowdown", label: { fr: "Un ralentissement économique anticipé", en: "An anticipated economic slowdown" } },
      { id: "growth", label: { fr: "Une accélération de la croissance anticipée", en: "Anticipated growth acceleration" } },
    ]),
    hint: { fr: "Une inversion de courbe est un signal de marché largement suivi par les économistes.", en: "A curve inversion is a market signal widely watched by economists." },
    correctChoiceIds: ["slowdown"],
    explanation: {
      fr: "Une courbe des taux inversée est traditionnellement interprétée comme un signal anticipé de ralentissement économique, les investisseurs s'attendant à ce que les taux baissent à l'avenir.",
      en: "An inverted yield curve is traditionally interpreted as an anticipated economic slowdown signal, with investors expecting rates to fall in the future.",
    },
    commonMistake: {
      fr: "Croire qu'une courbe inversée est un phénomène neutre ou sans signification économique particulière.",
      en: "Believing an inverted curve is a neutral phenomenon with no particular economic meaning.",
    },
  }),
};

const monthlyRateTemplate: QuestionTemplate = {
  id: "m13-actualisation-taux-mensuel",
  conceptId: "m13-actualisation-annuites",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pour actualiser des flux mensuels, il faut convertir le taux annuel au taux mensuel équivalent avant de l'appliquer.",
      en: "To discount monthly flows, the annual rate must be converted to the equivalent monthly rate before applying it.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : utiliser directement le taux annuel pour actualiser des flux mensuels sans conversion est une erreur fréquente qui fausse significativement le résultat.",
      en: "True: directly using the annual rate to discount monthly flows without conversion is a frequent error that significantly distorts the result.",
    },
    commonMistake: {
      fr: "Appliquer le taux annuel tel quel à chaque flux mensuel, sans ajustement de fréquence.",
      en: "Applying the annual rate as-is to each monthly flow, without frequency adjustment.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-actualisation-vocab",
  conceptId: "m13-actualisation-annuites",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une série de flux de trésorerie identiques versés à intervalles réguliers s'appelle une ______.",
      en: "A series of identical cash flows paid at regular intervals is called an ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["annuite", "annuité", "annuity"],
    hint: { fr: "Comme les mensualités d'un prêt ou les coupons d'une obligation.", en: "Like a loan's monthly payments or a bond's coupons." },
    explanation: {
      fr: "Une annuité est une série de flux identiques à intervalles réguliers, dont la valeur actualisée se calcule via une formule fermée plutôt qu'en sommant chaque flux individuellement.",
      en: "An annuity is a series of identical flows at regular intervals, whose present value is computed via a closed formula rather than summing each flow individually.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec un flux unique actualisé, qui n'implique pas de répétition périodique.",
      en: "Confusing this term with a single discounted flow, which doesn't involve periodic repetition.",
    },
  }),
};

export const templates: QuestionTemplate[] = [discountingNumericTemplate, yieldCurveTemplate, monthlyRateTemplate, vocabTemplate];
