import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 1): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const effectiveDeltaNumericTemplate: QuestionTemplate = {
  id: "m11-greeks-delta-effectif",
  conceptId: "m11-greeks-autocall",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const vCalled = randomInt(rng, 1050, 1200) / 10;
    const vNotCalled = randomInt(rng, 950, 1040) / 10;
    const epsilon = randomInt(rng, 5, 20) / 10;
    const deltaEff = Math.round(((vCalled - vNotCalled) / epsilon) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Juste avant une date d'observation, un autocall vaudrait ${fmt(vCalled, "fr")} s'il est rappelé et ${fmt(vNotCalled, "fr")} s'il ne l'est pas, pour un mouvement du sous-jacent de ${fmt(epsilon, "fr")} de part et d'autre de la barrière. Quel est le Delta effectif local ?`,
        en: `Just before an observation date, an autocall would be worth ${fmt(vCalled, "en")} if called and ${fmt(vNotCalled, "en")} if not, for an underlying move of ${fmt(epsilon, "en")} on either side of the barrier. What is the local effective Delta?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 3",
      hint: { fr: "Delta_effectif ≈ (V(rappelé) − V(non rappelé)) / ε.", en: "Effective Delta ≈ (V(called) − V(not called)) / ε." },
      numeric: { value: deltaEff, tolerance: 3 },
      calculation: {
        fr: `Delta_effectif ≈ (${fmt(vCalled, "fr")} − ${fmt(vNotCalled, "fr")}) / ${fmt(epsilon, "fr")} ≈ ${fmt(deltaEff, "fr")}.`,
        en: `Effective Delta ≈ (${fmt(vCalled, "en")} − ${fmt(vNotCalled, "en")}) / ${fmt(epsilon, "en")} ≈ ${fmt(deltaEff, "en")}.`,
      },
      explanation: {
        fr: "Ce Delta très élevé illustre à quel point la couverture d'un autocall devient délicate juste avant chaque date d'observation, quand le spot est proche de la barrière de rappel.",
        en: "This very high Delta illustrates how tricky hedging an autocall becomes just before each observation date, when spot is close to the call barrier.",
      },
      commonMistake: {
        fr: "Diviser par 2ε au lieu de ε, ou inverser V(rappelé) et V(non rappelé) dans la soustraction.",
        en: "Dividing by 2ε instead of ε, or swapping V(called) and V(not called) in the subtraction.",
      },
    };
  },
};

const vegaRegimeTemplate: QuestionTemplate = {
  id: "m11-greeks-regime-vega",
  conceptId: "m11-greeks-autocall",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Le spot d'un autocall est proche de sa barrière de capital, loin de sa barrière de rappel. Quel est le signe le plus probable du Vega dans ce régime ?",
      en: "An autocall's spot is close to its capital barrier, far from its call barrier. What is the most likely Vega sign in this regime?",
    },
    choices: buildChoices([
      { id: "negative", label: { fr: "Négatif", en: "Negative" } },
      { id: "positive", label: { fr: "Positif", en: "Positive" } },
    ]),
    hint: { fr: "Comparez à un knock-out proche de sa barrière (M10-5).", en: "Compare to a knock-out close to its barrier (M10-5)." },
    correctChoiceIds: ["negative"],
    explanation: {
      fr: "Près de la barrière de capital, plus de volatilité augmente le risque de toucher cette barrière (donc de subir une perte en capital), un effet dominant qui rend le Vega négatif, exactement comme pour un knock-out proche de sa barrière (M10-5).",
      en: "Near the capital barrier, more volatility increases the risk of touching it (so suffering a capital loss), a dominant effect that makes Vega negative, exactly like a knock-out close to its barrier (M10-5).",
    },
    commonMistake: {
      fr: "Supposer que le Vega d'un autocall est toujours positif comme pour une option vanille standard.",
      en: "Assuming an autocall's Vega is always positive like a standard vanilla option's.",
    },
  }),
};

const timingConcentrationTemplate: QuestionTemplate = {
  id: "m11-greeks-concentration-temporelle",
  conceptId: "m11-greeks-autocall",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Contrairement à une option barrière simple, le risque de Greeks extrêmes d'un autocall se concentre dans le temps, autour de chaque date d'observation successive.",
      en: "Unlike a simple barrier option, an autocall's extreme-Greeks risk concentrates in time, around each successive observation date.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : loin d'une date d'observation, les Greeks sont relativement calmes ; ils deviennent extrêmes juste avant chaque date, puis retombent immédiatement après (rappel ou passage sans rappel).",
      en: "True: far from an observation date, the Greeks are relatively calm; they become extreme just before each date, then drop back immediately after (call or pass without call).",
    },
    commonMistake: {
      fr: "Croire que le risque de Greeks extrêmes d'un autocall est constant tout au long de sa vie, comme pour une barrière simple à observation continue.",
      en: "Believing an autocall's extreme-Greeks risk is constant throughout its life, like a simple continuously-observed barrier.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m11-greeks-vocab",
  conceptId: "m11-greeks-autocall",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'influence des observations passées (coupons déjà accumulés) sur les Greeks présents d'un autocall est appelée l'effet ______ de trajectoire.",
      en: "The influence of past observations (already accumulated coupons) on an autocall's current Greeks is called the path-______ effect.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["memoire", "mémoire", "memory"],
    hint: { fr: "Le même mot que dans « coupon à mémoire ».", en: "The same word as in \"coupon memory\"." },
    explanation: {
      fr: "L'effet mémoire de trajectoire désigne l'influence de l'historique déjà observé (coupons accumulés, dates déjà passées sans rappel) sur les Greeks actuels de l'autocall.",
      en: "The path-memory effect denotes the influence of the already-observed history (accumulated coupons, dates already passed without a call) on the autocall's current Greeks.",
    },
    commonMistake: {
      fr: "Confondre cet effet avec le Gamma, qui est une mesure de sensibilité distincte.",
      en: "Confusing this effect with Gamma, which is a distinct sensitivity measure.",
    },
  }),
};

export const templates: QuestionTemplate[] = [effectiveDeltaNumericTemplate, vegaRegimeTemplate, timingConcentrationTemplate, vocabTemplate];
