import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const esVsVarTemplate: QuestionTemplate = {
  id: "m13-var-es-comparaison",
  conceptId: "m13-var-es-stress",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'Expected Shortfall est toujours supérieure ou égale à la VaR calculée au même niveau de confiance.",
      en: "Expected Shortfall is always greater than or equal to VaR computed at the same confidence level.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : l'Expected Shortfall est la perte MOYENNE dans les scénarios où la VaR est dépassée, donc elle est mathématiquement toujours au moins aussi élevée que la VaR elle-même.",
      en: "True: Expected Shortfall is the AVERAGE loss in scenarios where VaR is exceeded, so it's mathematically always at least as high as VaR itself.",
    },
    commonMistake: {
      fr: "Croire que les deux mesures peuvent être interchangeables ou que l'ES pourrait être inférieure à la VaR.",
      en: "Believing the two measures are interchangeable or that ES could be lower than VaR.",
    },
  }),
};

const varInterpretationTemplate: QuestionTemplate = {
  id: "m13-var-interpretation",
  conceptId: "m13-var-es-stress",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const amount = randomInt(rng, 100, 900) * 1000;
    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille a une VaR à 95% sur 1 jour de ${fmt(amount, "fr")}. Comment interpréter correctement ce chiffre ?`,
        en: `A portfolio has a 1-day 95% VaR of ${fmt(amount, "en")}. How should this figure be correctly interpreted?`,
      },
      choices: buildChoices([
        { id: "correct", label: { fr: `Il y a 5% de chances de perdre plus de ${fmt(amount, "fr")} en un jour`, en: `There's a 5% chance of losing more than ${fmt(amount, "en")} in one day` } },
        { id: "wrong", label: { fr: `La perte maximale possible en un jour est ${fmt(amount, "fr")}`, en: `The maximum possible loss in one day is ${fmt(amount, "en")}` } },
      ]),
      hint: { fr: "La VaR est un seuil probabiliste, pas un plafond absolu.", en: "VaR is a probabilistic threshold, not an absolute ceiling." },
      correctChoiceIds: ["correct"],
      explanation: {
        fr: "La VaR à 95% indique qu'il y a 5% de chances de dépasser cette perte, pas que cette perte est un plafond absolu — les pertes au-delà de ce seuil peuvent être bien plus importantes, ce que capture l'Expected Shortfall.",
        en: "The 95% VaR indicates a 5% chance of exceeding this loss, not that this loss is an absolute ceiling — losses beyond this threshold can be much larger, which is what Expected Shortfall captures.",
      },
      commonMistake: {
        fr: "Confondre la VaR avec une perte maximale garantie, une erreur d'interprétation très répandue.",
        en: "Confusing VaR with a guaranteed maximum loss, a very widespread interpretation error.",
      },
    };
  },
};

const stressTestPurposeTemplate: QuestionTemplate = {
  id: "m13-var-stress-test-role",
  conceptId: "m13-var-es-stress",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quel est l'apport spécifique d'un stress test par rapport à la VaR et l'Expected Shortfall ?",
      en: "What is a stress test's specific contribution compared to VaR and Expected Shortfall?",
    },
    choices: buildChoices([
      { id: "scenario", label: { fr: "Il évalue un scénario concret spécifique, sans hypothèse de distribution statistique", en: "It evaluates a specific concrete scenario, with no statistical distribution assumption" } },
      { id: "same", label: { fr: "Il donne exactement la même information que la VaR, avec une méthode différente", en: "It gives exactly the same information as VaR, using a different method" } },
    ]),
    hint: { fr: "Le stress test ne repose sur aucune hypothèse de distribution statistique.", en: "The stress test relies on no statistical distribution assumption." },
    correctChoiceIds: ["scenario"],
    explanation: {
      fr: "Un stress test évalue l'impact d'un scénario historique ou hypothétique spécifique, sans hypothèse de distribution statistique, complétant les mesures probabilistes (VaR, ES) qui peuvent sous-estimer des scénarios extrêmes rares mais possibles.",
      en: "A stress test evaluates a specific historical or hypothetical scenario's impact, with no statistical distribution assumption, complementing probabilistic measures (VaR, ES) which can understate rare but possible extreme scenarios.",
    },
    commonMistake: {
      fr: "Croire qu'un stress test est redondant avec la VaR et l'ES plutôt qu'un complément indispensable.",
      en: "Believing a stress test is redundant with VaR and ES rather than an essential complement.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-var-vocab",
  conceptId: "m13-var-es-stress",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une mesure de risque qui ne considère que les mouvements défavorables, contrairement à la volatilité symétrique, est appelée ______ risk.",
      en: "A risk measure considering only unfavorable movements, unlike symmetric volatility, is called ______ risk.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["downside"],
    hint: { fr: "Le même mot que dans le glossaire de la leçon.", en: "The same word as in the lesson's glossary." },
    explanation: {
      fr: "Le downside risk ne considère que les mouvements défavorables (pertes), contrairement à la volatilité qui traite hausses et baisses symétriquement.",
      en: "Downside risk considers only unfavorable movements (losses), unlike volatility which treats gains and losses symmetrically.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec la volatilité totale, qui inclut aussi les mouvements favorables.",
      en: "Confusing this term with total volatility, which also includes favorable movements.",
    },
  }),
};

export const templates: QuestionTemplate[] = [esVsVarTemplate, varInterpretationTemplate, stressTestPurposeTemplate, vocabTemplate];
