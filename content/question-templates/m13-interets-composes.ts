import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const compoundNumericTemplate: QuestionTemplate = {
  id: "m13-interets-composes-calcul",
  conceptId: "m13-interets-composes",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const C0 = randomInt(rng, 500, 5000);
    const r = randomInt(rng, 2, 8) / 100;
    const t = randomInt(rng, 3, 15);
    const value = Math.round(C0 * Math.exp(r * t) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un capital de ${fmt(C0, "fr", 0)} est placé à un taux continu de ${fmt(r * 100, "fr", 0)}% par an pendant ${t} ans. Quelle est sa valeur finale (capitalisation continue) ?`,
        en: `A capital of ${fmt(C0, "en", 0)} is invested at a continuous rate of ${fmt(r * 100, "en", 0)}% per year for ${t} years. What is its final value (continuous compounding)?`,
      },
      numericUnit: { fr: "même devise que le capital", en: "same currency as the capital" },
      numericTolerance: "± 10",
      hint: { fr: "V = C₀ × e^(rt).", en: "V = C₀ × e^(rt)." },
      numeric: { value, tolerance: 10 },
      calculation: {
        fr: `V = ${fmt(C0, "fr", 0)} × e^(${fmt(r, "fr", 2)}×${t}) = ${fmt(C0, "fr", 0)} × e^${fmt(r * t, "fr", 2)} ≈ ${fmt(value, "fr")}.`,
        en: `V = ${fmt(C0, "en", 0)} × e^(${fmt(r, "en", 2)}×${t}) = ${fmt(C0, "en", 0)} × e^${fmt(r * t, "en", 2)} ≈ ${fmt(value, "en")}.`,
      },
      explanation: {
        fr: "La capitalisation continue est la limite mathématique de la capitalisation composée quand la fréquence de capitalisation tend vers l'infini.",
        en: "Continuous compounding is the mathematical limit of compound interest as compounding frequency tends toward infinity.",
      },
      commonMistake: {
        fr: "Utiliser la formule des intérêts simples C₀×(1+rt) au lieu de la formule exponentielle.",
        en: "Using the simple-interest formula C₀×(1+rt) instead of the exponential formula.",
      },
    };
  },
};

const simpleVsCompoundTemplate: QuestionTemplate = {
  id: "m13-interets-composes-simple-vs-compose",
  conceptId: "m13-interets-composes",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Sur un horizon de placement long, les intérêts composés produisent toujours une valeur finale au moins aussi élevée que les intérêts simples, pour un même taux nominal.",
      en: "Over a long investment horizon, compound interest always produces a final value at least as high as simple interest, for the same nominal rate.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : les intérêts composés génèrent des intérêts sur les intérêts déjà accumulés, ce qui produit toujours une croissance au moins égale (et généralement supérieure au-delà de la première période) à celle des intérêts simples.",
      en: "True: compound interest generates interest on already-accumulated interest, always producing growth at least equal to (and generally greater beyond the first period than) simple interest.",
    },
    commonMistake: {
      fr: "Croire que les deux méthodes donnent des résultats similaires sur le long terme, alors que l'écart devient très significatif.",
      en: "Believing both methods give similar results long-term, when the gap becomes very significant.",
    },
  }),
};

const conventionComparisonTemplate: QuestionTemplate = {
  id: "m13-interets-composes-convention",
  conceptId: "m13-interets-composes",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Deux taux affichent le même pourcentage nominal, mais l'un est composé mensuellement et l'autre annuellement. Sont-ils directement comparables ?",
      en: "Two rates display the same nominal percentage, but one compounds monthly and the other annually. Are they directly comparable?",
    },
    choices: buildChoices([
      { id: "no", label: { fr: "Non, il faut d'abord les convertir dans la même convention", en: "No, they must first be converted to the same convention" } },
      { id: "yes", label: { fr: "Oui, le pourcentage nominal suffit à les comparer", en: "Yes, the nominal percentage is enough to compare them" } },
    ]),
    hint: { fr: "Une capitalisation plus fréquente produit une croissance effective plus élevée pour un même taux nominal.", en: "More frequent compounding produces higher effective growth for the same nominal rate." },
    correctChoiceIds: ["no"],
    explanation: {
      fr: "Non : à taux nominal identique, une capitalisation plus fréquente (mensuelle) produit un taux effectif plus élevé qu'une capitalisation annuelle. Il faut convertir les deux taux dans une convention commune (taux équivalent) avant de les comparer.",
      en: "No: at the same nominal rate, more frequent (monthly) compounding produces a higher effective rate than annual compounding. Both rates must be converted to a common convention (equivalent rate) before comparing.",
    },
    commonMistake: {
      fr: "Comparer directement deux taux nominaux sans vérifier leur fréquence de capitalisation respective.",
      en: "Directly comparing two nominal rates without checking their respective compounding frequency.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-interets-composes-vocab",
  conceptId: "m13-interets-composes",
  kind: "fill_blank",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const variant = pick(rng, ["capitalisation", "continue"] as const);
    return {
      prompt: variant === "capitalisation"
        ? { fr: "Le processus par lequel les intérêts déjà générés produisent eux-mêmes des intérêts s'appelle la ______.", en: "The process by which already-generated interest itself produces interest is called ______." }
        : { fr: "La limite mathématique de la capitalisation composée quand la fréquence tend vers l'infini est appelée capitalisation ______.", en: "The mathematical limit of compound interest as frequency tends toward infinity is called ______ compounding." },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: variant === "capitalisation" ? ["capitalisation", "compounding"] : ["continue", "continuous"],
      hint: { fr: "Le même mot que dans le glossaire de la leçon.", en: "The same word as in the lesson's glossary." },
      explanation: variant === "capitalisation"
        ? { fr: "La capitalisation est ce processus par lequel les intérêts accumulés génèrent eux-mêmes de nouveaux intérêts, créant une croissance exponentielle.", en: "Compounding is this process by which accumulated interest itself generates new interest, creating exponential growth." }
        : { fr: "La capitalisation continue (formule e^(rt)) est le standard mathématique en finance quantitative, bien que jamais littéralement observée sur un marché réel.", en: "Continuous compounding (the e^(rt) formula) is the mathematical standard in quantitative finance, though never literally observed in a real market." },
      commonMistake: {
        fr: "Confondre ce terme avec l'actualisation, qui est l'opération inverse.",
        en: "Confusing this term with discounting, which is the inverse operation.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [compoundNumericTemplate, simpleVsCompoundTemplate, conventionComparisonTemplate, vocabTemplate];
