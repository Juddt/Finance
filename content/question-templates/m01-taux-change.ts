import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const CURRENCY_PAIRS = [
  { base: "EUR", quote: "USD" },
  { base: "GBP", quote: "USD" },
  { base: "EUR", quote: "CHF" },
  { base: "USD", quote: "JPY" },
] as const;

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const conversionNumericTemplate: QuestionTemplate = {
  id: "m01-fx-conversion-calcul",
  conceptId: "m01-taux-change",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const pair = pick(rng, CURRENCY_PAIRS);
    const rate = randomFloat(rng, 0.8, 1.5, 4);
    const amount = randomInt(rng, 1, 50) * 1000;
    const direction = pick(rng, ["toQuote", "toBase"] as const);
    const result = direction === "toQuote" ? Math.round(amount * rate * 100) / 100 : Math.round((amount / rate) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr:
          direction === "toQuote"
            ? `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. Combien de ${pair.quote} obtient-on en convertissant ${fmt(amount, "fr", 0)} ${pair.base} ?`
            : `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. Combien de ${pair.base} obtient-on en convertissant ${fmt(amount, "fr", 0)} ${pair.quote} ?`,
        en:
          direction === "toQuote"
            ? `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. How many ${pair.quote} do you get converting ${fmt(amount, "en", 0)} ${pair.base}?`
            : `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. How many ${pair.base} do you get converting ${fmt(amount, "en", 0)} ${pair.quote}?`,
      },
      numericUnit: { fr: direction === "toQuote" ? pair.quote : pair.base, en: direction === "toQuote" ? pair.quote : pair.base },
      numericTolerance: "± 5",
      hint: {
        fr: direction === "toQuote" ? `Montant_${pair.quote} = Montant_${pair.base} × taux.` : `Montant_${pair.base} = Montant_${pair.quote} / taux.`,
        en: direction === "toQuote" ? `Amount_${pair.quote} = Amount_${pair.base} × rate.` : `Amount_${pair.base} = Amount_${pair.quote} / rate.`,
      },
      numeric: { value: result, tolerance: 5 },
      calculation: {
        fr: direction === "toQuote" ? `${fmt(amount, "fr", 0)} × ${rate.toFixed(4)} = ${fmt(result, "fr")}.` : `${fmt(amount, "fr", 0)} / ${rate.toFixed(4)} = ${fmt(result, "fr")}.`,
        en: direction === "toQuote" ? `${fmt(amount, "en", 0)} × ${rate.toFixed(4)} = ${fmt(result, "en")}.` : `${fmt(amount, "en", 0)} / ${rate.toFixed(4)} = ${fmt(result, "en")}.`,
      },
      explanation: {
        fr: `${pair.base} est la devise de base : on multiplie pour convertir vers ${pair.quote}, on divise pour convertir depuis ${pair.quote}.`,
        en: `${pair.base} is the base currency: multiply to convert to ${pair.quote}, divide to convert from ${pair.quote}.`,
      },
      commonMistake: {
        fr: "Inverser multiplication et division selon le sens de la conversion.",
        en: "Swapping multiplication and division depending on the conversion direction.",
      },
    };
  },
};

const appreciationTemplate: QuestionTemplate = {
  id: "m01-fx-appreciation",
  conceptId: "m01-taux-change",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const pair = pick(rng, CURRENCY_PAIRS);
    const goingUp = pick(rng, [true, false] as const);

    return {
      prompt: {
        fr: `${pair.base}/${pair.quote} ${goingUp ? "monte" : "baisse"} nettement. Que se passe-t-il pour le ${pair.base} par rapport au ${pair.quote} ?`,
        en: `${pair.base}/${pair.quote} ${goingUp ? "rises" : "falls"} sharply. What happens to the ${pair.base} relative to the ${pair.quote}?`,
      },
      choices: buildChoices([
        { id: "appreciate", label: { fr: `Le ${pair.base} s'apprécie`, en: `The ${pair.base} appreciates` } },
        { id: "depreciate", label: { fr: `Le ${pair.base} se déprécie`, en: `The ${pair.base} depreciates` } },
      ]),
      hint: { fr: "Le taux X/Y monte quand X vaut plus en unités de Y.", en: "The X/Y rate rises when X is worth more in units of Y." },
      correctChoiceIds: [goingUp ? "appreciate" : "depreciate"],
      explanation: goingUp
        ? { fr: `${pair.base}/${pair.quote} qui monte signifie qu'il faut plus de ${pair.quote} pour acheter 1 ${pair.base} : le ${pair.base} s'apprécie.`, en: `${pair.base}/${pair.quote} rising means more ${pair.quote} is needed to buy 1 ${pair.base}: the ${pair.base} appreciates.` }
        : { fr: `${pair.base}/${pair.quote} qui baisse signifie qu'il faut moins de ${pair.quote} pour acheter 1 ${pair.base} : le ${pair.base} se déprécie.`, en: `${pair.base}/${pair.quote} falling means less ${pair.quote} is needed to buy 1 ${pair.base}: the ${pair.base} depreciates.` },
      commonMistake: {
        fr: "Croire qu'une hausse du taux signifie que la devise de base perd de la valeur, alors que c'est l'inverse.",
        en: "Believing a rising rate means the base currency loses value, when it's the opposite.",
      },
    };
  },
};

const baseCurrencyTemplate: QuestionTemplate = {
  id: "m01-fx-devise-base",
  conceptId: "m01-taux-change",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const pair = pick(rng, CURRENCY_PAIRS);
    return {
      prompt: {
        fr: `Dans la cotation ${pair.base}/${pair.quote}, le ${pair.quote} est la devise de base.`,
        en: `In the ${pair.base}/${pair.quote} quote, the ${pair.quote} is the base currency.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : dans X/Y, X (ici ${pair.base}) est toujours la devise de base, Y (ici ${pair.quote}) la devise de cotation.`,
        en: `False: in X/Y, X (here ${pair.base}) is always the base currency, Y (here ${pair.quote}) the quote currency.`,
      },
      commonMistake: {
        fr: "Inverser devise de base et devise de cotation dans la lecture d'une paire.",
        en: "Swapping base and quote currency when reading a pair.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-fx-vocab",
  conceptId: "m01-taux-change",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans une cotation X/Y, X est appelée la devise de ______.",
      en: "In an X/Y quote, X is called the ______ currency.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["base"],
    hint: { fr: "C'est \"1 unité de\" cette devise que le taux exprime.", en: "It's \"1 unit of\" this currency that the rate expresses." },
    explanation: {
      fr: "X est la devise de base (1 unité de X), Y la devise de cotation (le nombre d'unités de Y pour cette unité de X).",
      en: "X is the base currency (1 unit of X), Y the quote currency (the number of units of Y for that unit of X).",
    },
    commonMistake: {
      fr: "Confondre devise de base et devise de cotation.",
      en: "Confusing base currency and quote currency.",
    },
  }),
};

export const templates: QuestionTemplate[] = [conversionNumericTemplate, appreciationTemplate, baseCurrencyTemplate, vocabTemplate];
