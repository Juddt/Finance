import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const correlationFromCovNumericTemplate: QuestionTemplate = {
  id: "m09-corr-realisee-calcul",
  conceptId: "m09-correlation-realisee",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const sigma1Pct = randomInt(rng, 10, 35);
    const sigma2Pct = randomInt(rng, 10, 35);
    const covPct2 = randomInt(rng, -sigma1Pct * sigma2Pct, sigma1Pct * sigma2Pct) / 10000;
    const sigma1 = sigma1Pct / 100;
    const sigma2 = sigma2Pct / 100;
    const rho = Math.round((covPct2 / (sigma1 * sigma2)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Deux actifs ont des volatilités σ1=${sigma1Pct}%, σ2=${sigma2Pct}%, et une covariance de leurs rendements de ${covPct2.toFixed(4)}. Quelle est leur corrélation réalisée ?`,
        en: `Two assets have volatilities σ1=${sigma1Pct}%, σ2=${sigma2Pct}%, and a return covariance of ${covPct2.toFixed(4)}. What is their realized correlation?`,
      },
      numericUnit: { fr: "sans dimension (entre -1 et 1)", en: "dimensionless (between -1 and 1)" },
      numericTolerance: "± 0.02",
      hint: { fr: "ρ = Cov / (σ1 × σ2).", en: "ρ = Cov / (σ1 × σ2)." },
      numeric: { value: rho, tolerance: 0.02 },
      calculation: {
        fr: `ρ = ${covPct2.toFixed(4)} / (${sigma1Pct}%×${sigma2Pct}%) = ${covPct2.toFixed(4)} / ${(sigma1 * sigma2).toFixed(4)} ≈ ${fmt(rho, "fr")}.`,
        en: `ρ = ${covPct2.toFixed(4)} / (${sigma1Pct}%×${sigma2Pct}%) = ${covPct2.toFixed(4)} / ${(sigma1 * sigma2).toFixed(4)} ≈ ${fmt(rho, "en")}.`,
      },
      explanation: {
        fr: "La corrélation normalise la covariance par le produit des volatilités, ce qui donne toujours un résultat entre −1 et +1.",
        en: "Correlation normalizes covariance by the product of volatilities, always giving a result between −1 and +1.",
      },
      commonMistake: {
        fr: "Oublier de diviser par le produit des deux volatilités, en confondant covariance et corrélation.",
        en: "Forgetting to divide by the product of both volatilities, confusing covariance and correlation.",
      },
    };
  },
};

const boundsTemplate: QuestionTemplate = {
  id: "m09-corr-realisee-bornes",
  conceptId: "m09-correlation-realisee",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const claimedValue = pick(rng, [1.5, -1.2, 0.7, -0.3] as const);
    const isValid = claimedValue >= -1 && claimedValue <= 1;
    return {
      prompt: {
        fr: `Une corrélation réalisée calculée entre deux actifs vaut ${claimedValue}. Ce résultat est-il mathématiquement possible ?`,
        en: `A realized correlation computed between two assets equals ${claimedValue}. Is this result mathematically possible?`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai (possible)", en: "True (possible)" } },
        { id: "false", label: { fr: "Faux (impossible)", en: "False (impossible)" } },
      ]),
      correctChoiceIds: [isValid ? "true" : "false"],
      explanation: isValid
        ? { fr: `${claimedValue} est bien compris entre −1 et +1, donc mathématiquement possible pour une corrélation.`, en: `${claimedValue} does lie between −1 and +1, so it's mathematically possible for a correlation.` }
        : { fr: `${claimedValue} est en dehors de l'intervalle [−1, 1] : une corrélation ne peut jamais dépasser ces bornes, une erreur de calcul serait à chercher.`, en: `${claimedValue} is outside the [−1, 1] range: a correlation can never exceed these bounds, a calculation error should be sought.` },
      commonMistake: {
        fr: "Ne pas vérifier qu'un résultat de corrélation reste dans les bornes mathématiquement possibles.",
        en: "Not checking a correlation result stays within the mathematically possible bounds.",
      },
    };
  },
};

const stressCorrelationTemplate: QuestionTemplate = {
  id: "m09-corr-realisee-stress",
  conceptId: "m09-correlation-realisee",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Lors d'un krach de marché généralisé, que fait typiquement la corrélation réalisée entre la plupart des actions ?",
      en: "During a widespread market crash, what does realized correlation between most stocks typically do?",
    },
    choices: buildChoices([
      { id: "up", label: { fr: "Elle augmente fortement (« tout baisse ensemble »)", en: "It rises sharply (\"everything falls together\")" } },
      { id: "down", label: { fr: "Elle diminue fortement", en: "It falls sharply" } },
    ]),
    hint: { fr: "Pensez à l'expression \"tout baisse ensemble\" en période de panique.", en: "Think of the \"everything falls together\" phrase during panic periods." },
    correctChoiceIds: ["up"],
    explanation: {
      fr: "La corrélation réalisée tend à grimper fortement en période de stress, réduisant précisément le bénéfice de diversification au moment où on en aurait le plus besoin.",
      en: "Realized correlation tends to spike during stress periods, precisely reducing the diversification benefit at the moment it's most needed.",
    },
    commonMistake: {
      fr: "Croire que la corrélation reste stable indépendamment des conditions de marché.",
      en: "Believing correlation stays stable regardless of market conditions.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m09-corr-realisee-vocab",
  conceptId: "m09-correlation-realisee",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une mesure de la tendance de deux variables à bouger ensemble (positive) ou en sens opposé (négative), avant normalisation, s'appelle la ______.",
      en: "A measure of two variables' tendency to move together (positive) or in opposite directions (negative), before normalization, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["covariance"],
    hint: { fr: "La corrélation en est la version normalisée.", en: "Correlation is its normalized version." },
    explanation: {
      fr: "La covariance est la mesure brute (non bornée) que l'on normalise par le produit des écarts-types pour obtenir la corrélation, bornée entre −1 et +1.",
      en: "Covariance is the raw (unbounded) measure that gets normalized by the product of standard deviations to get correlation, bounded between −1 and +1.",
    },
    commonMistake: {
      fr: "Confondre covariance (non bornée) et corrélation (toujours entre −1 et +1).",
      en: "Confusing covariance (unbounded) and correlation (always between −1 and +1).",
    },
  }),
};

export const templates: QuestionTemplate[] = [correlationFromCovNumericTemplate, boundsTemplate, stressCorrelationTemplate, vocabTemplate];
