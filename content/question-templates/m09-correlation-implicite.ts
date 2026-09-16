import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const impliedCorrNumericTemplate: QuestionTemplate = {
  id: "m09-corr-implicite-calcul",
  conceptId: "m09-correlation-implicite",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const sigmaPct = randomInt(rng, 15, 35);
    const sigmaIndexPct = randomInt(rng, Math.round(sigmaPct * 0.5), sigmaPct - 1);
    const sigma = sigmaPct / 100;
    const sigmaIndex = sigmaIndexPct / 100;
    const w = 0.5;
    const varIndex = sigmaIndex * sigmaIndex;
    const term1 = w * w * sigma * sigma + w * w * sigma * sigma;
    const crossCoef = 2 * w * w * sigma * sigma;
    const rho = Math.round(((varIndex - term1) / crossCoef) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un indice à deux actions de poids égaux (50/50), chacune de volatilité implicite σ=${sigmaPct}%. L'indice lui-même a une volatilité implicite de ${sigmaIndexPct}%. Quelle est la corrélation implicite entre les deux actions ?`,
        en: `An index of two equally-weighted (50/50) stocks, each with implied volatility σ=${sigmaPct}%. The index itself has an implied volatility of ${sigmaIndexPct}%. What is the implied correlation between the two stocks?`,
      },
      numericUnit: { fr: "sans dimension (entre -1 et 1)", en: "dimensionless (between -1 and 1)" },
      numericTolerance: "± 0.03",
      hint: { fr: "σ²_indice = w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ, avec w1=w2=0,5, σ1=σ2=σ.", en: "σ²_index = w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ, with w1=w2=0.5, σ1=σ2=σ." },
      numeric: { value: rho, tolerance: 0.03 },
      calculation: {
        fr: `σ²_indice=${(sigmaIndex * sigmaIndex).toFixed(4)}. Terme carré=${term1.toFixed(4)}. ρ = (${(sigmaIndex * sigmaIndex).toFixed(4)}−${term1.toFixed(4)})/${crossCoef.toFixed(4)} ≈ ${fmt(rho, "fr")}.`,
        en: `σ²_index=${(sigmaIndex * sigmaIndex).toFixed(4)}. Squared term=${term1.toFixed(4)}. ρ = (${(sigmaIndex * sigmaIndex).toFixed(4)}−${term1.toFixed(4)})/${crossCoef.toFixed(4)} ≈ ${fmt(rho, "en")}.`,
      },
      explanation: {
        fr: "Puisque la volatilité de l'indice est toujours inférieure à celle des composants (grâce à la diversification, sauf ρ=1), on peut résoudre pour la corrélation implicite qui explique cet écart.",
        en: "Since the index's volatility is always below the components' (thanks to diversification, unless ρ=1), one can solve for the implied correlation explaining that gap.",
      },
      commonMistake: {
        fr: "Oublier de mettre les volatilités au carré (travailler en variance, pas en volatilité) avant de résoudre pour ρ.",
        en: "Forgetting to square the volatilities (working in variance, not volatility) before solving for ρ.",
      },
    };
  },
};

const notForecastTemplate: QuestionTemplate = {
  id: "m09-corr-implicite-pas-prevision",
  conceptId: "m09-correlation-implicite",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La corrélation implicite est une mesure statistique calculée directement à partir des rendements passés des actifs, comme la corrélation réalisée.",
      en: "Implied correlation is a statistical measure computed directly from assets' past returns, like realized correlation.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la corrélation implicite se déduit des PRIX d'options de marché (indice vs composants), pas des rendements historiques — c'est une mesure prospective de marché, pas une statistique rétrospective.",
      en: "False: implied correlation is derived from market option PRICES (index vs components), not historical returns — a forward-looking market measure, not a retrospective statistic.",
    },
    commonMistake: {
      fr: "Confondre corrélation implicite (dérivée de prix d'options) et corrélation réalisée (calculée sur des rendements historiques).",
      en: "Confusing implied correlation (derived from option prices) with realized correlation (computed on historical returns).",
    },
  }),
};

const premiumTemplate: QuestionTemplate = {
  id: "m09-corr-implicite-prime",
  conceptId: "m09-correlation-implicite",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "En moyenne sur longue période, comment la corrélation implicite se compare-t-elle à la corrélation réalisée qui se matérialise ensuite ?",
      en: "On average over the long run, how does implied correlation compare to the realized correlation that subsequently materializes?",
    },
    choices: buildChoices([
      { id: "higher", label: { fr: "La corrélation implicite est structurellement plus élevée", en: "Implied correlation is structurally higher" } },
      { id: "equal", label: { fr: "Elles sont égales en moyenne, sans biais systématique", en: "They are equal on average, with no systematic bias" } },
    ]),
    hint: { fr: "Pensez à la prime de volatilité déjà vue en M07-5, un phénomène analogue existe pour la corrélation.", en: "Think of the volatility premium already seen in M07-5, an analogous phenomenon exists for correlation." },
    correctChoiceIds: ["higher"],
    explanation: {
      fr: "Comme pour la volatilité implicite (prime de volatilité), la corrélation implicite est en moyenne plus élevée que la corrélation réalisée qui se matérialise ensuite — une prime de corrélation, rémunération du risque pour les vendeurs de protection contre la hausse de corrélation.",
      en: "Like implied volatility (the volatility premium), implied correlation is on average higher than the realized correlation that subsequently materializes — a correlation premium, compensation for sellers of protection against rising correlation.",
    },
    commonMistake: {
      fr: "Croire que corrélation implicite et réalisée sont égales en moyenne, sans aucun biais systématique.",
      en: "Believing implied and realized correlation are equal on average, with no systematic bias.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m09-corr-implicite-vocab",
  conceptId: "m09-correlation-implicite",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une corrélation unique et simplifiée, supposée identique entre toutes les paires d'actifs d'un panier, s'appelle la corrélation ______ implicite.",
      en: "A single, simplified correlation, assumed identical across all asset pairs in a basket, is called the ______ implied correlation.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["moyenne", "average"],
    hint: { fr: "Une simplification qui \"moyenne\" toutes les paires en un seul chiffre.", en: "A simplification that \"averages\" all pairs into a single number." },
    explanation: {
      fr: "La corrélation moyenne implicite simplifie une matrice complète de corrélations par paire en une seule valeur, au prix d'une perte d'information sur l'hétérogénéité réelle des paires.",
      en: "Average implied correlation simplifies a full pairwise correlation matrix into a single value, at the cost of losing information about the real heterogeneity between pairs.",
    },
    commonMistake: {
      fr: "Croire que cette corrélation moyenne capture parfaitement toute la structure de corrélation d'un panier de nombreux actifs.",
      en: "Believing this average correlation perfectly captures a large basket's entire correlation structure.",
    },
  }),
};

export const templates: QuestionTemplate[] = [impliedCorrNumericTemplate, notForecastTemplate, premiumTemplate, vocabTemplate];
