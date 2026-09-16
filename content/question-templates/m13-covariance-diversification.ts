import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const portfolioVarianceNumericTemplate: QuestionTemplate = {
  id: "m13-covariance-variance-portefeuille",
  conceptId: "m13-covariance-diversification",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const sigma1 = randomInt(rng, 10, 30) / 100;
    const sigma2 = randomInt(rng, 10, 30) / 100;
    const rho = randomInt(rng, -50, 80) / 100;
    const w1 = 0.5;
    const w2 = 0.5;
    const variance = w1 ** 2 * sigma1 ** 2 + w2 ** 2 * sigma2 ** 2 + 2 * w1 * w2 * rho * sigma1 * sigma2;
    const vol = Math.round(Math.sqrt(variance) * 1000) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille 50/50 combine deux actifs de volatilité ${fmt(sigma1 * 100, "fr", 0)}% et ${fmt(sigma2 * 100, "fr", 0)}%, corrélés à ${fmt(rho, "fr", 2)}. Quelle est la volatilité du portefeuille ?`,
        en: `A 50/50 portfolio combines two assets with volatility ${fmt(sigma1 * 100, "en", 0)}% and ${fmt(sigma2 * 100, "en", 0)}%, correlated at ${fmt(rho, "en", 2)}. What is the portfolio's volatility?`,
      },
      numericUnit: { fr: "% annualisé", en: "% annualized" },
      numericTolerance: "± 1.5",
      hint: { fr: "σ²_p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂, puis prendre la racine carrée.", en: "σ²_p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂, then take the square root." },
      numeric: { value: vol, tolerance: 1.5 },
      calculation: {
        fr: `σ²_p = 0,25×${fmt(sigma1 ** 2, "fr", 4)} + 0,25×${fmt(sigma2 ** 2, "fr", 4)} + 2×0,25×${fmt(rho, "fr", 2)}×${fmt(sigma1, "fr", 2)}×${fmt(sigma2, "fr", 2)} ≈ ${fmt(variance, "fr", 4)}. σ_p = √${fmt(variance, "fr", 4)} ≈ ${fmt(vol, "fr", 1)}%.`,
        en: `σ²_p = 0.25×${fmt(sigma1 ** 2, "en", 4)} + 0.25×${fmt(sigma2 ** 2, "en", 4)} + 2×0.25×${fmt(rho, "en", 2)}×${fmt(sigma1, "en", 2)}×${fmt(sigma2, "en", 2)} ≈ ${fmt(variance, "en", 4)}. σ_p = √${fmt(variance, "en", 4)} ≈ ${fmt(vol, "en", 1)}%.`,
      },
      explanation: {
        fr: "Plus la corrélation est faible (voire négative), plus le terme croisé réduit la variance totale du portefeuille par rapport à la moyenne pondérée des variances individuelles.",
        en: "The lower (or even negative) the correlation, the more the cross term reduces the portfolio's total variance relative to the weighted average of individual variances.",
      },
      commonMistake: {
        fr: "Oublier le facteur 2 devant le terme croisé, ou omettre de prendre la racine carrée pour obtenir la volatilité à partir de la variance.",
        en: "Forgetting the factor of 2 in front of the cross term, or omitting the square root to get volatility from variance.",
      },
    };
  },
};

const perfectCorrelationTemplate: QuestionTemplate = {
  id: "m13-covariance-correlation-parfaite",
  conceptId: "m13-covariance-diversification",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Si deux actifs sont parfaitement corrélés (ρ=1), combiner les deux dans un portefeuille réduit la volatilité par rapport à la moyenne pondérée des volatilités individuelles.",
      en: "If two assets are perfectly correlated (ρ=1), combining both in a portfolio reduces volatility relative to the weighted average of individual volatilities.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : avec une corrélation parfaite (ρ=1), la volatilité du portefeuille est exactement égale à la moyenne pondérée des volatilités individuelles — aucun bénéfice de diversification n'existe dans ce cas extrême.",
      en: "False: with perfect correlation (ρ=1), the portfolio's volatility exactly equals the weighted average of individual volatilities — no diversification benefit exists in this extreme case.",
    },
    commonMistake: {
      fr: "Croire que combiner plusieurs actifs réduit toujours le risque, indépendamment de leur corrélation.",
      en: "Believing combining several assets always reduces risk, regardless of their correlation.",
    },
  }),
};

const crisisCorrelationTemplate: QuestionTemplate = {
  id: "m13-covariance-crise",
  conceptId: "m13-covariance-diversification",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Que se passe-t-il généralement avec les corrélations entre classes d'actifs pendant une crise de marché ?",
      en: "What generally happens to correlations between asset classes during a market crisis?",
    },
    choices: buildChoices([
      { id: "increase", label: { fr: "Elles ont tendance à augmenter, réduisant le bénéfice de diversification", en: "They tend to increase, reducing the diversification benefit" } },
      { id: "decrease", label: { fr: "Elles ont tendance à diminuer, augmentant le bénéfice de diversification", en: "They tend to decrease, increasing the diversification benefit" } },
    ]),
    hint: { fr: "C'est une des limites pratiques les plus connues de la diversification.", en: "This is one of diversification's best-known practical limitations." },
    correctChoiceIds: ["increase"],
    explanation: {
      fr: "Les corrélations entre classes d'actifs tendent à converger vers 1 précisément pendant les crises de marché, réduisant le bénéfice de diversification exactement quand il serait le plus utile.",
      en: "Correlations between asset classes tend to converge toward 1 precisely during market crises, reducing the diversification benefit exactly when it would be most useful.",
    },
    commonMistake: {
      fr: "Supposer que les corrélations historiques calmes restent stables en toutes circonstances, y compris en crise.",
      en: "Assuming calm historical correlations stay stable in all circumstances, including during a crisis.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-covariance-vocab",
  conceptId: "m13-covariance-diversification",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une mesure de la façon dont deux actifs évoluent ensemble, positive s'ils bougent dans le même sens, s'appelle la ______.",
      en: "A measure of how two assets move together, positive if they move in the same direction, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["covariance"],
    hint: { fr: "Liée à la corrélation par σ₁×σ₂×ρ.", en: "Related to correlation via σ₁×σ₂×ρ." },
    explanation: {
      fr: "La covariance mesure comment deux actifs évoluent ensemble ; elle est directement liée à la corrélation via Cov(1,2) = ρ×σ₁×σ₂.",
      en: "Covariance measures how two assets move together; it's directly linked to correlation via Cov(1,2) = ρ×σ₁×σ₂.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec la corrélation, qui est une version normalisée (sans dimension) de la covariance.",
      en: "Confusing this term with correlation, which is a normalized (dimensionless) version of covariance.",
    },
  }),
};

export const templates: QuestionTemplate[] = [portfolioVarianceNumericTemplate, perfectCorrelationTemplate, crisisCorrelationTemplate, vocabTemplate];
