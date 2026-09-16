import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const whichCurveTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-role",
  conceptId: "m04-mono-multi-courbe",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const task = pick(
      rng,
      [
        { id: "discount", fr: "actualiser un flux futur, quel que soit l'indice sur lequel il est calculé", en: "discount a future flow, whatever index it is computed on" },
        { id: "project", fr: "estimer le taux forward de la jambe variable indexée EURIBOR 3M", en: "estimate the forward rate of the EURIBOR 3M-indexed floating leg" },
      ] as const
    );

    return {
      prompt: {
        fr: `En cadre multi-courbe, quelle courbe utilise-t-on pour ${task.fr} ?`,
        en: `In a multi-curve framework, which curve is used to ${task.en}?`,
      },
      choices: buildChoices([
        { id: "discount", label: { fr: "La courbe d'actualisation (OIS)", en: "The discounting curve (OIS)" } },
        { id: "project", label: { fr: "La courbe de projection (EURIBOR 3M)", en: "The projection curve (EURIBOR 3M)" } },
      ]),
      hint: { fr: "Une courbe sert à actualiser, l'autre à projeter les taux forward par tenor.", en: "One curve discounts, the other projects forward rates per tenor." },
      correctChoiceIds: [task.id],
      explanation:
        task.id === "discount"
          ? { fr: "Toute actualisation, quel que soit l'indice du flux, utilise la courbe OIS jugée la plus proche du sans-risque.", en: "All discounting, whatever the flow's index, uses the OIS curve seen as closest to risk-free." }
          : { fr: "Chaque indice (ici EURIBOR 3M) a sa propre courbe de projection, distincte de la courbe d'actualisation.", en: "Each index (here EURIBOR 3M) has its own projection curve, distinct from the discounting curve." },
      commonMistake: {
        fr: "Utiliser la même courbe pour les deux usages, l'erreur classique du cadre mono-courbe devenu obsolète après 2008.",
        en: "Using the same curve for both purposes, the classic single-curve mistake made obsolete after 2008.",
      },
    };
  },
};

const basisTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-basis",
  conceptId: "m04-mono-multi-courbe",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const euribor = randomInt(rng, 100, 400);
    const ois = euribor - randomInt(rng, 20, 200);
    const basisBp = euribor - ois;

    return {
      isScenario: true,
      prompt: {
        fr: `Le taux EURIBOR 3M cote ${euribor} points de base, le taux OIS équivalent cote ${ois} points de base. Quel est le spread EURIBOR-OIS (le "basis"), en points de base ?`,
        en: `The 3M EURIBOR rate quotes ${euribor} basis points, the equivalent OIS rate quotes ${ois} basis points. What is the EURIBOR-OIS spread (the "basis"), in basis points?`,
      },
      numericUnit: { fr: "points de base", en: "basis points" },
      numericTolerance: "± 1",
      hint: { fr: "Basis = EURIBOR − OIS.", en: "Basis = EURIBOR − OIS." },
      numeric: { value: basisBp, tolerance: 1 },
      calculation: { fr: `Basis = ${euribor} − ${ois} = ${basisBp} pb.`, en: `Basis = ${euribor} − ${ois} = ${basisBp} bp.` },
      explanation: {
        fr: "Ce spread capture le risque de crédit et de liquidité implicite du marché interbancaire non collatéralisé par rapport au taux au jour le jour garanti.",
        en: "This spread captures the implicit credit and liquidity risk of the uncollateralized interbank market relative to the secured overnight rate.",
      },
      commonMistake: {
        fr: "Calculer OIS − EURIBOR au lieu de EURIBOR − OIS, inversant le signe du basis.",
        en: "Computing OIS − EURIBOR instead of EURIBOR − OIS, flipping the basis's sign.",
      },
    };
  },
};

const crisisOriginTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-origine",
  conceptId: "m04-mono-multi-courbe",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Avant la crise financière de 2008, le spread entre taux interbancaire (EURIBOR) et taux garanti (OIS) était déjà considéré comme trop important pour être ignoré dans le pricing des swaps.",
      en: "Before the 2008 financial crisis, the spread between the interbank rate (EURIBOR) and the secured rate (OIS) was already considered too large to ignore in swap pricing.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : avant 2008, ce spread était jugé négligeable (quelques points de base), justifiant le cadre mono-courbe. La crise l'a fait grimper à plus de 200 points de base, rendant le cadre multi-courbe indispensable.",
      en: "False: before 2008, this spread was seen as negligible (a few basis points), justifying the single-curve framework. The crisis pushed it above 200 basis points, making the multi-curve framework essential.",
    },
    commonMistake: {
      fr: "Croire que le cadre multi-courbe a toujours existé, alors qu'il est directement né de la crise de 2008.",
      en: "Believing the multi-curve framework has always existed, when it directly emerged from the 2008 crisis.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-vocab",
  conceptId: "m04-mono-multi-courbe",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La courbe utilisée pour actualiser les flux d'un swap collatéralisé en cash est généralement fondée sur le taux ______, jugé plus proche du sans-risque que le taux interbancaire.",
      en: "The curve used to discount a cash-collateralized swap's flows is generally based on the ______ rate, seen as closer to risk-free than the interbank rate.",
    },
    fillBlankPlaceholder: { fr: "un sigle", en: "one acronym" },
    acceptedAnswers: ["ois"],
    hint: { fr: "Overnight Index Swap.", en: "Overnight Index Swap." },
    explanation: {
      fr: "Le taux OIS, basé sur des taux au jour le jour garantis, sert de référence d'actualisation en cadre multi-courbe.",
      en: "The OIS rate, based on secured overnight rates, serves as the discounting reference in the multi-curve framework.",
    },
    commonMistake: {
      fr: "Répondre EURIBOR, qui est la courbe de PROJECTION, pas d'actualisation.",
      en: "Answering EURIBOR, which is the PROJECTION curve, not the discounting one.",
    },
  }),
};

export const templates: QuestionTemplate[] = [whichCurveTemplate, basisTemplate, crisisOriginTemplate, vocabTemplate];
