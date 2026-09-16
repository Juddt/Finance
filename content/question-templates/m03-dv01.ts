import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const dv01NumericTemplate: QuestionTemplate = {
  id: "m03-dv01-calcul",
  conceptId: "m03-dv01",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const marketValue = randomInt(rng, 10, 200) * 100_000;
    const Dmod = randomFloat(rng, 1, 12, 2);
    const dv01 = Math.round(marketValue * Dmod * 0.0001 * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a une valeur de marché de ${fmt(marketValue, "fr", 0)} et une duration modifiée de ${fmt(Dmod, "fr")}. Quel est son DV01 ?`,
        en: `A position has a market value of ${fmt(marketValue, "en", 0)} and a modified duration of ${fmt(Dmod, "en")}. What is its DV01?`,
      },
      numericUnit: { fr: "même devise, par point de base", en: "same currency, per basis point" },
      numericTolerance: "± 5",
      hint: { fr: "DV01 ≈ Valeur de marché × D_mod × 0,0001.", en: "DV01 ≈ Market value × D_mod × 0.0001." },
      numeric: { value: dv01, tolerance: 5 },
      calculation: {
        fr: `DV01 ≈ ${fmt(marketValue, "fr", 0)} × ${fmt(Dmod, "fr")} × 0,0001 ≈ ${fmt(dv01, "fr")}.`,
        en: `DV01 ≈ ${fmt(marketValue, "en", 0)} × ${fmt(Dmod, "en")} × 0.0001 ≈ ${fmt(dv01, "en")}.`,
      },
      explanation: {
        fr: "C'est la perte (ou le gain, selon le sens de la position) approximative pour une hausse des taux de 1 point de base.",
        en: "This is the approximate loss (or gain, depending on the position's direction) for a 1 basis point rise in rates.",
      },
      commonMistake: {
        fr: "Oublier le facteur 0,0001 (1 point de base), ou l'appliquer deux fois.",
        en: "Forgetting the 0.0001 factor (1 basis point), or applying it twice.",
      },
    };
  },
};

const additiveTemplate: QuestionTemplate = {
  id: "m03-dv01-additivite",
  conceptId: "m03-dv01",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dv01A = randomInt(rng, 100, 5000);
    const dv01B = randomInt(rng, 100, 5000);
    const claimedTotal = pick(rng, [dv01A + dv01B, dv01A + dv01B + randomInt(rng, 50, 500)] as const);
    const isCorrect = claimedTotal === dv01A + dv01B;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille contient deux obligations, de DV01 respectifs ${dv01A} et ${dv01B}. On affirme que le DV01 total du portefeuille est ${claimedTotal}.`,
        en: `A portfolio holds two bonds, with DV01 of ${dv01A} and ${dv01B} respectively. It is claimed the portfolio's total DV01 is ${claimedTotal}.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [isCorrect ? "true" : "false"],
      explanation: {
        fr: `Le DV01 est additif à travers un portefeuille : total = ${dv01A} + ${dv01B} = ${dv01A + dv01B}. ${isCorrect ? "L'affirmation est donc correcte." : `L'affirmation (${claimedTotal}) est donc incorrecte.`}`,
        en: `DV01 is additive across a portfolio: total = ${dv01A} + ${dv01B} = ${dv01A + dv01B}. ${isCorrect ? "The claim is therefore correct." : `The claim (${claimedTotal}) is therefore incorrect.`}`,
      },
      commonMistake: {
        fr: "Essayer de pondérer ou moyenner les DV01 comme on le ferait pour des durations, alors que le DV01 s'additionne simplement.",
        en: "Trying to weight or average DV01s the way one would for durations, when DV01 simply adds up.",
      },
    };
  },
};

const hedgeSizingTemplate: QuestionTemplate = {
  id: "m03-dv01-couverture",
  conceptId: "m03-dv01",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const portfolioDv01 = randomInt(rng, 5000, 50000);
    const hedgeDv01 = randomInt(rng, 20, 200);
    const contracts = Math.round((portfolioDv01 / hedgeDv01) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille obligataire a un DV01 total de ${portfolioDv01}. Chaque contrat future utilisé pour la couverture a un DV01 de ${hedgeDv01}. Combien de contrats faut-il vendre pour neutraliser exactement le risque de taux du portefeuille ?`,
        en: `A bond portfolio has a total DV01 of ${portfolioDv01}. Each hedging future contract has a DV01 of ${hedgeDv01}. How many contracts must be sold to exactly neutralize the portfolio's interest rate risk?`,
      },
      numericUnit: { fr: "contrats", en: "contracts" },
      numericTolerance: "± 1",
      hint: { fr: "N = DV01_portefeuille / DV01_instrument.", en: "N = DV01_portfolio / DV01_instrument." },
      numeric: { value: contracts, tolerance: 1 },
      calculation: {
        fr: `N = ${portfolioDv01} / ${hedgeDv01} ≈ ${fmt(contracts, "fr")} contrats à vendre.`,
        en: `N = ${portfolioDv01} / ${hedgeDv01} ≈ ${fmt(contracts, "en")} contracts to sell.`,
      },
      explanation: {
        fr: "Vendre des futures de taux compense le DV01 positif d'un portefeuille long obligataire, neutralisant l'exposition à une hausse des taux.",
        en: "Selling rate futures offsets the positive DV01 of a long bond portfolio, neutralizing exposure to a rate rise.",
      },
      commonMistake: {
        fr: "Inverser le ratio (diviser le DV01 de l'instrument par celui du portefeuille) ou oublier que la couverture suppose un mouvement parallèle de la courbe.",
        en: "Inverting the ratio (dividing the instrument's DV01 by the portfolio's) or forgetting the hedge assumes a parallel curve shift.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m03-dv01-vocab",
  conceptId: "m03-dv01",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Le DV01 mesure la variation de prix pour une hausse de rendement d'un point de ______.",
      en: "DV01 measures the price change for a rise in yield of one ______ point.",
    },
    fillBlankPlaceholder: { fr: "deux mots", en: "two words" },
    acceptedAnswers: ["base", "basis"],
    hint: { fr: "1 pb = 0,01%.", en: "1 bp = 0.01%." },
    explanation: {
      fr: "DV01 = Dollar Value of 01, la variation de prix pour un mouvement de 1 point de base (0,01%) du rendement.",
      en: "DV01 = Dollar Value of 01, the price change for a 1 basis point (0.01%) move in yield.",
    },
    commonMistake: {
      fr: "Confondre point de base (0,01%) et point de pourcentage entier (1%), un facteur 100 d'erreur.",
      en: "Confusing a basis point (0.01%) with a full percentage point (1%), a 100x error.",
    },
  }),
};

export const templates: QuestionTemplate[] = [dv01NumericTemplate, additiveTemplate, hedgeSizingTemplate, vocabTemplate];
