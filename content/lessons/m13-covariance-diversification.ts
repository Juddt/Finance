import type { LessonContent } from "@/lib/lesson-types";

export const m13CovarianceDiversification: LessonContent = {
  conceptId: "m13-covariance-diversification",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la corrélation réalisée et son rôle dans la dispersion d'un panier.",
      en: "You need to know realized correlation and its role in a basket's dispersion.",
    },
    conceptIds: ["m09-correlation-realisee"],
  },
  glossary: [
    { term: { fr: "Covariance", en: "Covariance" }, definition: { fr: "Une mesure de la façon dont deux actifs évoluent ensemble : positive s'ils montent et descendent en même temps, négative s'ils évoluent en sens opposé.", en: "A measure of how two assets move together: positive if they rise and fall together, negative if they move in opposite directions." } },
  ],
  intuition: {
    fr: "Combiner plusieurs actifs dans un portefeuille réduit le risque global, mais l'ampleur de cette réduction dépend crucialement de la façon dont ces actifs évoluent les uns par rapport aux autres : combiner des actifs qui bougent ensemble (forte covariance) diversifie peu, combiner des actifs qui bougent indépendamment ou en sens opposé diversifie beaucoup.",
    en: "Combining several assets in a portfolio reduces overall risk, but the extent of this reduction crucially depends on how these assets move relative to each other: combining assets that move together (high covariance) diversifies little, combining assets that move independently or oppositely diversifies a lot.",
  },
  definition: {
    fr: "La variance d'un portefeuille de deux actifs pondérés w₁ et w₂ est σ²_p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂Cov(1,2), où Cov(1,2) = ρ₁,₂×σ₁×σ₂ est la covariance entre les deux actifs, liée à leur corrélation ρ (déjà vue en M09-1 pour un contexte de produits dérivés). Le terme croisé 2w₁w₂Cov(1,2) est précisément le \"bénéfice de diversification\" : plus la covariance est faible (voire négative), plus ce terme réduit la variance totale du portefeuille par rapport à la simple moyenne pondérée des variances individuelles.",
    en: "A two-asset portfolio's variance with weights w₁ and w₂ is σ²_p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂Cov(1,2), where Cov(1,2) = ρ₁,₂×σ₁×σ₂ is the covariance between the two assets, tied to their correlation ρ (already seen in M09-1 in a derivatives context). The cross term 2w₁w₂Cov(1,2) is precisely the \"diversification benefit\": the lower (or even negative) the covariance, the more this term reduces the portfolio's total variance relative to the simple weighted average of individual variances.",
  },
  utility: {
    fr: "Cette formule est le fondement mathématique de toute construction de portefeuille : elle explique pourquoi un gérant cherche activement des actifs peu corrélés entre eux, pas seulement des actifs individuellement peu risqués — un portefeuille de deux actifs très volatils mais peu corrélés peut être globalement moins risqué qu'un portefeuille de deux actifs peu volatils mais fortement corrélés.",
    en: "This formula is the mathematical foundation of all portfolio construction: it explains why a manager actively seeks assets weakly correlated with each other, not just individually low-risk assets — a portfolio of two highly volatile but weakly correlated assets can be globally less risky than a portfolio of two low-volatility but strongly correlated assets.",
  },
  example: {
    fr: "Deux actions, chacune avec une volatilité de 20%, pondérées à 50/50. Si leur corrélation est de 1 (parfaitement corrélées), la volatilité du portefeuille reste 20% (aucune diversification). Si leur corrélation est de 0 (indépendantes), la volatilité du portefeuille tombe à environ 14,1% (20%/√2). Si leur corrélation est de −1 (parfaitement opposées), la volatilité du portefeuille peut même tomber à 0% — un cas extrême illustrant la puissance théorique maximale de la diversification.",
    en: "Two stocks, each with 20% volatility, weighted 50/50. If their correlation is 1 (perfectly correlated), the portfolio's volatility stays at 20% (no diversification). If their correlation is 0 (independent), the portfolio's volatility falls to about 14.1% (20%/√2). If their correlation is −1 (perfectly opposite), the portfolio's volatility can even fall to 0% — an extreme case illustrating diversification's maximum theoretical power.",
  },
  alternativeExplanation: {
    fr: "Porter deux parapluies identiques ne vous protège pas mieux d'un jour de pluie qu'un seul (ils \"bougent ensemble\", corrélation parfaite). Mais porter un parapluie ET une crème solaire vous protège contre deux scénarios opposés (pluie ou soleil) — c'est l'équivalent d'actifs négativement corrélés : chacun compense la faiblesse de l'autre selon les circonstances.",
    en: "Carrying two identical umbrellas doesn't protect you better on a rainy day than carrying one (they \"move together\", perfect correlation). But carrying an umbrella AND sunscreen protects you against two opposite scenarios (rain or sun) — this is the equivalent of negatively correlated assets: each compensates for the other's weakness depending on circumstances.",
  },
  formula: {
    latex: "\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2\\rho_{1,2}\\sigma_1\\sigma_2",
    variables: [
      { symbol: "\\rho_{1,2}", description: { fr: "Corrélation entre les rendements des deux actifs, entre −1 et 1", en: "Correlation between the two assets' returns, between −1 and 1" } },
      { symbol: "w_1, w_2", description: { fr: "Poids de chaque actif dans le portefeuille (w₁+w₂=1 sans effet de levier)", en: "Each asset's weight in the portfolio (w₁+w₂=1 with no leverage)" } },
    ],
    assumptions: { fr: "Portefeuille à deux actifs ; se généralise à N actifs via une matrice de covariance complète (σ²_p = wᵀΣw).", en: "Two-asset portfolio; generalizes to N assets via a full covariance matrix (σ²_p = wᵀΣw)." },
    units: { fr: "Variance (carré de la volatilité).", en: "Variance (squared volatility)." },
    example: { fr: "σ₁=σ₂=20%, w₁=w₂=0,5, ρ=0 : σ²_p = 0,25×0,04+0,25×0,04+0 = 0,02, donc σ_p≈14,1%.", en: "σ₁=σ₂=20%, w₁=w₂=0.5, ρ=0: σ²_p = 0.25×0.04+0.25×0.04+0 = 0.02, so σ_p≈14.1%." },
  },
  calculation: {
    fr: "1) Estimer la volatilité individuelle de chaque actif (M08-1). 2) Estimer la corrélation entre chaque paire d'actifs (M09-1). 3) Construire la matrice de covariance complète (diagonale = variances, hors-diagonale = covariances). 4) Calculer la variance du portefeuille via σ²_p = wᵀΣw, où w est le vecteur des poids.",
    en: "1) Estimate each asset's individual volatility (M08-1). 2) Estimate the correlation between each pair of assets (M09-1). 3) Build the full covariance matrix (diagonal = variances, off-diagonal = covariances). 4) Compute the portfolio's variance via σ²_p = wᵀΣw, where w is the weight vector.",
  },
  interpretation: {
    fr: "La volatilité du portefeuille est presque toujours inférieure à la moyenne pondérée des volatilités individuelles, sauf dans le cas extrême d'une corrélation parfaite (ρ=1). Cet écart, appelé bénéfice de diversification, est d'autant plus grand que le nombre d'actifs est élevé et que leurs corrélations moyennes sont faibles — mais ce bénéfice a des limites, car les corrélations entre classes d'actifs ont tendance à augmenter précisément pendant les crises de marché (quand la diversification serait la plus utile).",
    en: "The portfolio's volatility is almost always lower than the weighted average of individual volatilities, except in the extreme case of perfect correlation (ρ=1). This gap, called the diversification benefit, grows larger as the number of assets increases and their average correlations decrease — but this benefit has limits, since correlations between asset classes tend to increase precisely during market crises (when diversification would be most useful).",
  },
  pitfalls: {
    fr: "Croire que diversifier signifie simplement \"détenir plus d'actifs\", sans tenir compte de leur corrélation réelle — détenir 50 actions du même secteur fortement corrélées entre elles diversifie beaucoup moins que détenir 5 actions de secteurs et zones géographiques différentes. Autre piège classique : supposer que les corrélations historiques resteront stables en période de crise, alors qu'elles ont tendance à converger vers 1 précisément quand la diversification serait le plus nécessaire.",
    en: "Believing diversification simply means \"holding more assets\", without accounting for their real correlation — holding 50 stocks from the same strongly correlated sector diversifies much less than holding 5 stocks from different sectors and geographies. Another classic trap: assuming historical correlations will stay stable during a crisis, when they tend to converge toward 1 precisely when diversification would be most needed.",
  },
  keyPoints: {
    fr: [
      "La variance d'un portefeuille dépend des variances individuelles ET des covariances croisées entre actifs.",
      "Plus la corrélation moyenne entre actifs est faible, plus le bénéfice de diversification est important.",
      "Les corrélations tendent à augmenter en période de crise, réduisant le bénéfice de diversification quand on en a le plus besoin.",
    ],
    en: [
      "A portfolio's variance depends on individual variances AND cross-covariances between assets.",
      "The lower the average correlation between assets, the greater the diversification benefit.",
      "Correlations tend to rise during crises, reducing the diversification benefit precisely when it's most needed.",
    ],
  },
  advancedDemonstration: {
    fr: "Pour un portefeuille de N actifs également pondérés (w=1/N chacun) avec une variance individuelle moyenne σ̄² et une covariance moyenne C̄ᵥ entre paires, la variance du portefeuille converge, quand N devient grand, vers σ²_p ≈ C̄ᵥ (la variance individuelle moyenne s'efface en 1/N, mais la covariance moyenne persiste) — un résultat fondamental montrant que le risque \"diversifiable\" (spécifique à chaque actif) peut être quasiment éliminé en ajoutant des actifs, mais le risque \"systématique\" (capturé par la covariance moyenne) ne peut jamais être diversifié, quel que soit le nombre d'actifs détenus — un lien direct avec le CAPM (M13-gp-c) qui formalise cette distinction entre risque diversifiable et risque systématique.",
    en: "For an N-asset equally weighted portfolio (w=1/N each) with average individual variance σ̄² and average pairwise covariance C̄ᵥ, the portfolio's variance converges, as N grows large, to σ²_p ≈ C̄ᵥ (the average individual variance fades at 1/N, but the average covariance persists) — a fundamental result showing that \"diversifiable\" risk (specific to each asset) can be nearly eliminated by adding assets, but \"systematic\" risk (captured by the average covariance) can never be diversified away, whatever the number of assets held — a direct link to CAPM (M13-gp-c), which formalizes this distinction between diversifiable and systematic risk.",
  },
};
