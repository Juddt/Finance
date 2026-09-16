import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const forwardRateNumericTemplate: QuestionTemplate = {
  id: "m03-taux-forward-calcul",
  conceptId: "m03-taux-sans-risque",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const z1Pct = randomInt(rng, 1, 6);
    const z2Pct = z1Pct + randomInt(rng, 1, 4);
    const z1 = z1Pct / 100;
    const z2 = z2Pct / 100;
    const forward = Math.round((Math.pow(1 + z2, 2) / (1 + z1) - 1) * 10000) / 100;

    return {
      prompt: {
        fr: `Le taux spot à 1 an est z1 = ${z1Pct}%, le taux spot à 2 ans est z2 = ${z2Pct}%. Quel est le taux forward implicite f_{1,2} entre l'année 1 et l'année 2, en % ?`,
        en: `The 1-year spot rate is z1 = ${z1Pct}%, the 2-year spot rate is z2 = ${z2Pct}%. What is the implied forward rate f_{1,2} between year 1 and year 2, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "(1+z2)² = (1+z1)(1+f_{1,2}).", en: "(1+z2)² = (1+z1)(1+f_{1,2})." },
      numeric: { value: forward, tolerance: 0.1 },
      calculation: {
        fr: `f_{1,2} = (1,${z2Pct.toString().padStart(2, "0")})² / (1,${z1Pct.toString().padStart(2, "0")}) − 1 ≈ ${fmt(forward, "fr")}%.`,
        en: `f_{1,2} = (1.${z2Pct.toString().padStart(2, "0")})² / (1.${z1Pct.toString().padStart(2, "0")}) − 1 ≈ ${fmt(forward, "en")}%.`,
      },
      explanation: {
        fr: "Emprunter à 2 ans directement doit coûter exactement la même chose qu'emprunter à 1 an puis reconduire l'emprunt à f_{1,2} : c'est ce qui fixe ce taux forward par non-arbitrage.",
        en: "Borrowing for 2 years directly must cost exactly the same as borrowing for 1 year then rolling at f_{1,2}: this is what pins down this forward rate by no-arbitrage.",
      },
      commonMistake: {
        fr: "Faire une simple moyenne ou différence de z1 et z2 au lieu d'appliquer la formule de non-arbitrage correcte.",
        en: "Taking a simple average or difference of z1 and z2 instead of applying the correct no-arbitrage formula.",
      },
    };
  },
};

const curveShapeTemplate: QuestionTemplate = {
  id: "m03-taux-forme-courbe",
  conceptId: "m03-taux-sans-risque",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const upward = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `La courbe des taux est ${upward ? "croissante (taux longs > taux courts)" : "inversée (taux longs < taux courts)"}. Le taux forward f_{1,2} est-il supérieur ou inférieur au taux spot z2 ?`,
        en: `The yield curve is ${upward ? "upward-sloping (long rates > short rates)" : "inverted (long rates < short rates)"}. Is the forward rate f_{1,2} above or below the spot rate z2?`,
      },
      choices: buildChoices([
        { id: "above", label: { fr: "Supérieur à z2", en: "Above z2" } },
        { id: "below", label: { fr: "Inférieur à z2", en: "Below z2" } },
      ]),
      hint: { fr: "(1+z2)² = (1+z1)(1+f_{1,2}) : comparez z1 à z2 selon la forme de la courbe.", en: "(1+z2)² = (1+z1)(1+f_{1,2}): compare z1 to z2 given the curve's shape." },
      correctChoiceIds: [upward ? "above" : "below"],
      explanation: upward
        ? { fr: "Sur une courbe croissante, z1 < z2, donc le forward doit être plus élevé que z2 pour compenser ce départ plus bas dans la moyenne géométrique.", en: "On an upward-sloping curve, z1 < z2, so the forward must be higher than z2 to compensate for that lower starting point in the geometric average." }
        : { fr: "Sur une courbe inversée, z1 > z2, donc le forward doit être plus bas que z2.", en: "On an inverted curve, z1 > z2, so the forward must be lower than z2." },
      commonMistake: {
        fr: "Croire que le taux forward est toujours égal ou proche du taux spot correspondant, indépendamment de la forme de la courbe.",
        en: "Believing the forward rate is always equal or close to the corresponding spot rate, regardless of the curve's shape.",
      },
    };
  },
};

const forecastMythTemplate: QuestionTemplate = {
  id: "m03-taux-forward-prevision",
  conceptId: "m03-taux-sans-risque",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le taux forward implicite dans la courbe des taux est, avant tout, une prévision fiable du taux spot qui sera observé à cette date future.",
      en: "The forward rate implied by the yield curve is, first and foremost, a reliable forecast of the spot rate that will be observed on that future date.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le taux forward est avant tout un résultat mécanique de non-arbitrage entre deux stratégies de placement équivalentes, pas une prévision de marché — même si son écart avec le taux futur réalisé intéresse les chercheurs.",
      en: "False: the forward rate is primarily a mechanical no-arbitrage result between two equivalent investment strategies, not a market forecast — even though its gap with the realized future rate interests researchers.",
    },
    commonMistake: {
      fr: "Faire la même confusion prévision/mécanique que pour le prix forward des matières premières.",
      en: "Making the same forecast/mechanical confusion as for commodity forward prices.",
    },
  }),
};

const proxyVocabTemplate: QuestionTemplate = {
  id: "m03-taux-proxy-vocab",
  conceptId: "m03-taux-sans-risque",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Le taux applicable à un unique flux reçu à une date T précise, tel qu'il ressort aujourd'hui de la courbe des taux, est appelé le taux ______.",
      en: "The rate applicable to a single cash flow received on a specific date T, as read off today's yield curve, is called the ______ rate.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["spot"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "Same word used in French finance jargon." },
    explanation: {
      fr: "Le taux spot z_T actualise un flux unique reçu en T, par opposition au taux forward qui porte sur une période future.",
      en: "The spot rate z_T discounts a single flow received at T, as opposed to the forward rate which applies to a future period.",
    },
    commonMistake: {
      fr: "Confondre taux spot et taux forward.",
      en: "Confusing spot rate and forward rate.",
    },
  }),
};

export const templates: QuestionTemplate[] = [forwardRateNumericTemplate, curveShapeTemplate, forecastMythTemplate, proxyVocabTemplate];
