import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const classifyTemplate: QuestionTemplate = {
  id: "m05-itm-classification",
  conceptId: "m05-itm-atm-otm",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const optionType = pick(rng, ["call", "put"] as const);
    const S = randomInt(rng, 50, 150);
    const K = randomInt(rng, 50, 150);
    const status = S === K ? "atm" : optionType === "call" ? (S > K ? "itm" : "otm") : S < K ? "itm" : "otm";

    return {
      prompt: {
        fr: `Un ${optionType === "call" ? "call" : "put"} de strike K = ${fmt(K, "fr")} sur un sous-jacent qui cote S = ${fmt(S, "fr")}. Est-il ITM, ATM ou OTM ?`,
        en: `A ${optionType} with strike K = ${fmt(K, "en")} on an underlying trading at S = ${fmt(S, "en")}. Is it ITM, ATM or OTM?`,
      },
      choices: buildChoices([
        { id: "itm", label: { fr: "ITM (dans la monnaie)", en: "ITM (in the money)" } },
        { id: "atm", label: { fr: "ATM (à la monnaie)", en: "ATM (at the money)" } },
        { id: "otm", label: { fr: "OTM (hors la monnaie)", en: "OTM (out of the money)" } },
      ]),
      hint: {
        fr: optionType === "call" ? "Un call est ITM si S > K." : "Un put est ITM si S < K.",
        en: optionType === "call" ? "A call is ITM if S > K." : "A put is ITM if S < K.",
      },
      correctChoiceIds: [status],
      explanation: {
        fr: `S=${fmt(S, "fr")}, K=${fmt(K, "fr")}, ${optionType} : ${status === "atm" ? "S = K, donc ATM." : status === "itm" ? "l'exercice immédiat serait profitable, donc ITM." : "l'exercice immédiat ne rapporterait rien, donc OTM."}`,
        en: `S=${fmt(S, "en")}, K=${fmt(K, "en")}, ${optionType}: ${status === "atm" ? "S = K, so ATM." : status === "itm" ? "immediate exercise would be profitable, so ITM." : "immediate exercise would yield nothing, so OTM."}`,
      },
      commonMistake: {
        fr: "Appliquer la règle du call (ITM si S>K) à un put, alors que c'est l'inverse.",
        en: "Applying the call's rule (ITM if S>K) to a put, when it is the reverse.",
      },
    };
  },
};

const timeValueNumericTemplate: QuestionTemplate = {
  id: "m05-itm-valeur-temps",
  conceptId: "m05-itm-atm-otm",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const optionType = pick(rng, ["call", "put"] as const);
    const K = randomInt(rng, 50, 150);
    const S = optionType === "call" ? K + randomInt(rng, 1, 30) : K - randomInt(rng, 1, 30);
    const intrinsic = optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
    const premium = intrinsic + randomInt(rng, 1, 10);
    const timeValue = premium - intrinsic;

    return {
      isScenario: true,
      prompt: {
        fr: `Un ${optionType} de strike K = ${fmt(K, "fr")} sur un sous-jacent à S = ${fmt(S, "fr")} se négocie à une prime de ${fmt(premium, "fr")}. Quelle est sa valeur temps ?`,
        en: `A ${optionType} with strike K = ${fmt(K, "en")} on an underlying at S = ${fmt(S, "en")} trades at a premium of ${fmt(premium, "en")}. What is its time value?`,
      },
      numericUnit: { fr: "même devise que la prime", en: "same currency as the premium" },
      numericTolerance: "± 0.1",
      hint: { fr: "Valeur temps = Prime − Valeur intrinsèque.", en: "Time value = Premium − Intrinsic value." },
      numeric: { value: timeValue, tolerance: 0.1 },
      calculation: {
        fr: `Valeur intrinsèque = ${optionType === "call" ? `max(${S}−${K},0)` : `max(${K}−${S},0)`} = ${intrinsic}. Valeur temps = ${premium} − ${intrinsic} = ${timeValue}.`,
        en: `Intrinsic value = ${optionType === "call" ? `max(${S}−${K},0)` : `max(${K}−${S},0)`} = ${intrinsic}. Time value = ${premium} − ${intrinsic} = ${timeValue}.`,
      },
      explanation: {
        fr: "La valeur temps est toujours la part de la prime qui dépasse ce que rapporterait un exercice immédiat.",
        en: "Time value is always the part of the premium beyond what immediate exercise would yield.",
      },
      commonMistake: {
        fr: "Oublier de calculer d'abord la valeur intrinsèque avant de la soustraire de la prime.",
        en: "Forgetting to compute intrinsic value first before subtracting it from the premium.",
      },
    };
  },
};

const americanEarlyExerciseTemplate: QuestionTemplate = {
  id: "m05-itm-europeenne-anticipe",
  conceptId: "m05-itm-atm-otm",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une option européenne, même profondément ITM, peut être exercée par son détenteur à tout moment avant l'échéance s'il le juge avantageux.",
      en: "A European option, even deep ITM, can be exercised by its holder at any time before expiry if they find it advantageous.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : par définition, une option européenne ne peut être exercée qu'à l'échéance, quel que soit son niveau ITM. Seule une option américaine permet un exercice anticipé.",
      en: "False: by definition, a European option can only be exercised at expiry, regardless of how deep ITM it is. Only an American option allows early exercise.",
    },
    commonMistake: {
      fr: "Confondre les deux styles d'exercice, une erreur très fréquente en début d'apprentissage.",
      en: "Confusing the two exercise styles, a very common early mistake.",
    },
  }),
};

const zeroTimeValueTemplate: QuestionTemplate = {
  id: "m05-itm-expiry-vocab",
  conceptId: "m05-itm-atm-otm",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Exactement à l'échéance d'une option, sa valeur temps devient toujours ______.",
      en: "Exactly at an option's expiry, its time value always becomes ______.",
    },
    fillBlankPlaceholder: { fr: "un mot ou nombre", en: "one word or number" },
    acceptedAnswers: ["nulle", "zero", "nul", "0"],
    hint: { fr: "Il ne reste plus de temps pour que l'incertitude joue.", en: "There is no time left for uncertainty to play out." },
    explanation: {
      fr: "À l'échéance, la prime égale exactement la valeur intrinsèque : la valeur temps, qui rémunère l'incertitude restante, disparaît.",
      en: "At expiry, the premium equals exactly the intrinsic value: time value, which compensates for remaining uncertainty, vanishes.",
    },
    commonMistake: {
      fr: "Penser que la valeur temps peut rester positive après l'échéance.",
      en: "Thinking time value can remain positive after expiry.",
    },
  }),
};

export const templates: QuestionTemplate[] = [classifyTemplate, timeValueNumericTemplate, americanEarlyExerciseTemplate, zeroTimeValueTemplate];
