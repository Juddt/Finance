import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 3): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const standardErrorNumericTemplate: QuestionTemplate = {
  id: "m06-mc-erreur-standard",
  conceptId: "m06-monte-carlo",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const stdDev = randomInt(rng, 10, 50);
    const nThousands = randomInt(rng, 1, 100);
    const N = nThousands * 1000;
    const se = Math.round((stdDev / Math.sqrt(N)) * 1000) / 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Une simulation Monte-Carlo utilise N = ${N.toLocaleString("fr-FR")} trajectoires, avec un écart-type des payoffs actualisés estimé à ${stdDev}. Quelle est l'erreur standard de l'estimation du prix ?`,
        en: `A Monte-Carlo simulation uses N = ${N.toLocaleString("en-US")} paths, with an estimated standard deviation of discounted payoffs of ${stdDev}. What is the price estimate's standard error?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 0.01",
      hint: { fr: "Erreur standard = écart-type / √N.", en: "Standard error = standard deviation / √N." },
      numeric: { value: se, tolerance: 0.01 },
      calculation: { fr: `Erreur standard = ${stdDev} / √${N} ≈ ${fmt(se, "fr")}.`, en: `Standard error = ${stdDev} / √${N} ≈ ${fmt(se, "en")}.` },
      explanation: {
        fr: "Plus N est grand, plus l'estimation est précise, mais la convergence en 1/√N est lente.",
        en: "The larger N is, the more precise the estimate, but convergence at 1/√N is slow.",
      },
      commonMistake: {
        fr: "Diviser par N au lieu de √N, ce qui sous-estime largement l'erreur restante.",
        en: "Dividing by N instead of √N, which greatly underestimates the remaining error.",
      },
    };
  },
};

const quadrupleNTemplate: QuestionTemplate = {
  id: "m06-mc-quadrupler-n",
  conceptId: "m06-monte-carlo",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pour diviser par 2 l'erreur standard d'une estimation Monte-Carlo, par quel facteur faut-il multiplier le nombre de trajectoires simulées N ?",
      en: "To halve a Monte-Carlo estimate's standard error, by what factor must the number of simulated paths N be multiplied?",
    },
    choices: buildChoices([
      { id: "four", label: { fr: "Par 4", en: "By 4" } },
      { id: "two", label: { fr: "Par 2", en: "By 2" } },
      { id: "eight", label: { fr: "Par 8", en: "By 8" } },
    ]),
    hint: { fr: "L'erreur standard décroît en 1/√N.", en: "The standard error decreases as 1/√N." },
    correctChoiceIds: ["four"],
    explanation: {
      fr: "Puisque l'erreur standard est proportionnelle à 1/√N, diviser l'erreur par 2 nécessite de multiplier N par 2² = 4.",
      en: "Since the standard error is proportional to 1/√N, halving the error requires multiplying N by 2² = 4.",
    },
    commonMistake: {
      fr: "Croire que doubler N suffit à diviser l'erreur par 2, en oubliant la racine carrée.",
      en: "Believing doubling N is enough to halve the error, forgetting the square root.",
    },
  }),
};

const measureTemplate: QuestionTemplate = {
  id: "m06-mc-mesure",
  conceptId: "m06-monte-carlo",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const usesRealDrift = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Pour pricer une option par Monte-Carlo, on simule les trajectoires du sous-jacent en utilisant ${usesRealDrift ? "le vrai rendement moyen attendu de l'actif (estimé historiquement)" : "le taux sans risque r comme drift"}.`,
        en: `To price an option via Monte-Carlo, you simulate the underlying's paths using ${usesRealDrift ? "the asset's true expected average return (historically estimated)" : "the risk-free rate r as the drift"}.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [usesRealDrift ? "false" : "true"],
      explanation: usesRealDrift
        ? { fr: "Faux : il faut simuler sous la mesure RISQUE-NEUTRE, avec un drift égal au taux sans risque r, pas le vrai rendement attendu de l'actif.", en: "False: you must simulate under the RISK-NEUTRAL measure, with drift equal to the risk-free rate r, not the asset's true expected return." }
        : { fr: "Vrai : le pricing Monte-Carlo simule sous la mesure risque-neutre, où le drift est le taux sans risque r.", en: "True: Monte-Carlo pricing simulates under the risk-neutral measure, where the drift is the risk-free rate r." },
      commonMistake: {
        fr: "Simuler avec le vrai drift historique de l'actif, une erreur qui fausse complètement le prix obtenu.",
        en: "Simulating with the asset's true historical drift, a mistake that completely distorts the resulting price.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-mc-vocab",
  conceptId: "m06-monte-carlo",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une technique qui consiste à simuler aussi la trajectoire avec −Z pour chaque nombre aléatoire Z tiré, afin de réduire la variance de l'estimateur sans biais, s'appelle les variables ______.",
      en: "A technique that also simulates the path with −Z for each drawn random number Z, to reduce the estimator's variance without bias, is called ______ variates.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["antithetiques", "antithétiques", "antithetic"],
    hint: { fr: "\"Anti-\" quelque chose, car on utilise l'opposé du tirage.", en: "\"Anti-\" something, since the draw's opposite is used." },
    explanation: {
      fr: "Les variables antithétiques réduisent la variance de l'estimateur Monte-Carlo en exploitant la symétrie de la loi normale, sans biaiser le résultat.",
      en: "Antithetic variates reduce the Monte-Carlo estimator's variance by exploiting the normal distribution's symmetry, without biasing the result.",
    },
    commonMistake: {
      fr: "Confondre les variables antithétiques avec les variables de contrôle, une autre technique de réduction de variance basée sur un principe différent.",
      en: "Confusing antithetic variates with control variates, another variance-reduction technique based on a different principle.",
    },
  }),
};

export const templates: QuestionTemplate[] = [standardErrorNumericTemplate, quadrupleNTemplate, measureTemplate, vocabTemplate];
