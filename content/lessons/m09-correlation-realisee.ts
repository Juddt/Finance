import type { LessonContent } from "@/lib/lesson-types";

export const m09CorrelationRealisee: LessonContent = {
  conceptId: "m09-correlation-realisee",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir calculer un rendement logarithmique et une volatilité réalisée.",
      en: "You need to know how to compute a log return and realized volatility.",
    },
    conceptIds: ["m08-volatilite-realisee"],
  },
  glossary: [
    { term: { fr: "Covariance", en: "Covariance" }, definition: { fr: "Une mesure de la tendance de deux variables à bouger ensemble (positive) ou en sens opposé (négative).", en: "A measure of two variables' tendency to move together (positive) or in opposite directions (negative)." } },
  ],
  intuition: {
    fr: "La corrélation réalisée mesure, a posteriori, à quel point deux actifs ont effectivement bougé ensemble : proche de +1, ils montent et descendent en même temps ; proche de −1, l'un monte quand l'autre baisse ; proche de 0, leurs mouvements semblent indépendants.",
    en: "Realized correlation measures, after the fact, how much two assets actually moved together: close to +1, they rise and fall at the same time; close to −1, one rises when the other falls; close to 0, their moves appear independent.",
  },
  definition: {
    fr: "La corrélation réalisée entre deux actifs est ρ = Cov(r1, r2) / (σ1 × σ2), où r1 et r2 sont leurs rendements logarithmiques sur une même période, Cov leur covariance et σ1, σ2 leurs volatilités (écarts-types) respectives. Elle est toujours comprise entre −1 et +1.",
    en: "The realized correlation between two assets is ρ = Cov(r1, r2) / (σ1 × σ2), where r1 and r2 are their log returns over the same period, Cov their covariance and σ1, σ2 their respective volatilities (standard deviations). It always lies between −1 and +1.",
  },
  utility: {
    fr: "La corrélation réalisée est la base de toute gestion de portefeuille diversifié (voir la théorie moderne du portefeuille) et de tout produit dérivé sur plusieurs actifs (paniers, Worst-Of/Best-Of, voir M09-4) : elle détermine si combiner plusieurs actifs réduit réellement le risque, ou non.",
    en: "Realized correlation is the foundation of any diversified portfolio management (see modern portfolio theory) and any multi-asset derivative (baskets, Worst-Of/Best-Of, see M09-4): it determines whether combining several assets actually reduces risk, or not.",
  },
  example: {
    fr: "Sur 4 jours, les rendements de l'actif A sont 1%, −0,5%, 0,8%, −0,3% et ceux de l'actif B sont 0,9%, −0,4%, 0,6%, −0,2% : les deux actifs bougent presque toujours dans le même sens et avec une amplitude comparable, donnant une corrélation réalisée proche de +0,95 — typique de deux actions du même secteur.",
    en: "Over 4 days, asset A's returns are 1%, −0.5%, 0.8%, −0.3% and asset B's are 0.9%, −0.4%, 0.6%, −0.2%: the two assets almost always move in the same direction with comparable magnitude, giving a realized correlation close to +0.95 — typical of two stocks in the same sector.",
  },
  alternativeExplanation: {
    fr: "Imaginez deux danseurs sur une piste : une corrélation de +1 signifie qu'ils exécutent exactement les mêmes pas en même temps ; une corrélation de −1 signifie que l'un recule exactement quand l'autre avance ; une corrélation de 0 signifie que leurs mouvements n'ont aucun rapport entre eux, chacun dansant \"à sa façon\" indépendamment de l'autre.",
    en: "Picture two dancers on a floor: a correlation of +1 means they execute exactly the same steps at the same time; a correlation of −1 means one steps back exactly when the other steps forward; a correlation of 0 means their movements have no relation to each other, each dancing \"their own way\" independently.",
  },
  formula: {
    latex: "\\rho = \\frac{\\text{Cov}(r_1, r_2)}{\\sigma_1 \\times \\sigma_2} = \\frac{\\frac{1}{N-1}\\sum_{i=1}^{N}(r_{1,i}-\\bar{r_1})(r_{2,i}-\\bar{r_2})}{\\sigma_1 \\sigma_2}",
    variables: [
      { symbol: "r_{1,i}, r_{2,i}", description: { fr: "Rendements logarithmiques des deux actifs à la période i", en: "The two assets' log returns at period i" } },
      { symbol: "\\sigma_1, \\sigma_2", description: { fr: "Écarts-types (volatilités) des rendements de chaque actif", en: "Each asset's return standard deviation (volatility)" } },
    ],
    assumptions: { fr: "Rendements mesurés sur la même fréquence et la même période pour les deux actifs.", en: "Returns measured at the same frequency and over the same period for both assets." },
    units: { fr: "Sans dimension, toujours entre −1 et +1.", en: "Dimensionless, always between −1 and +1." },
    example: { fr: "Voir l'exemple ci-dessus pour une illustration qualitative d'une forte corrélation positive.", en: "See the example above for a qualitative illustration of strong positive correlation." },
  },
  calculation: {
    fr: "1) Calculer les rendements logarithmiques des deux actifs sur des périodes identiques. 2) Calculer la covariance de ces deux séries de rendements. 3) Calculer l'écart-type (volatilité) de chaque série séparément. 4) Diviser la covariance par le produit des deux écarts-types.",
    en: "1) Compute both assets' log returns over identical periods. 2) Compute the covariance of these two return series. 3) Compute each series's standard deviation (volatility) separately. 4) Divide the covariance by the product of the two standard deviations.",
  },
  interpretation: {
    fr: "La corrélation réalisée n'est pas stable dans le temps : elle a tendance à augmenter fortement lors des phases de stress de marché (\"tout baisse ensemble\" lors d'un krach), ce qui réduit précisément le bénéfice de diversification au moment où on en aurait le plus besoin.",
    en: "Realized correlation isn't stable over time: it tends to rise sharply during market stress (\"everything falls together\" during a crash), precisely reducing the diversification benefit at the moment it's most needed.",
  },
  pitfalls: {
    fr: "Calculer une corrélation sur des séries de longueurs ou de fréquences différentes, ce qui fausse le résultat. Autre piège : extrapoler une corrélation calmement mesurée en période normale à une période de stress, sans tenir compte de cette instabilité bien documentée.",
    en: "Computing a correlation on series of different lengths or frequencies, which distorts the result. Another trap: extrapolating a correlation calmly measured in normal times to a stress period, ignoring this well-documented instability.",
  },
  keyPoints: {
    fr: [
      "ρ = Cov(r1,r2) / (σ1×σ2), toujours comprise entre −1 et +1.",
      "C'est une mesure rétrospective, pas une prévision — comme la volatilité réalisée.",
      "La corrélation réalisée tend à augmenter fortement en période de stress de marché.",
    ],
    en: [
      "ρ = Cov(r1,r2) / (σ1×σ2), always between −1 and +1.",
      "It's a retrospective measure, not a forecast — like realized volatility.",
      "Realized correlation tends to rise sharply during market stress periods.",
    ],
  },
  advancedDemonstration: {
    fr: "Pour un portefeuille de N actifs, la matrice de corrélation complète (N×N, symétrique, diagonale de 1) est nécessaire pour calculer précisément la variance du portefeuille — voir la théorie moderne du portefeuille (catégorie Gestion de portefeuille) pour la formule complète Var(portefeuille) = w'Σw, où Σ est la matrice de covariance. En pratique, cette matrice de corrélation historique est souvent instable statistiquement (bruit d'estimation important avec un nombre limité d'observations face à un grand nombre d'actifs), ce qui motive des techniques de régularisation (shrinkage) pour obtenir une estimation plus robuste.",
    en: "For a portfolio of N assets, the full correlation matrix (N×N, symmetric, diagonal of 1) is needed to precisely compute the portfolio's variance — see modern portfolio theory (Portfolio Management category) for the full formula Var(portfolio) = w'Σw, where Σ is the covariance matrix. In practice, this historical correlation matrix is often statistically unstable (significant estimation noise with a limited number of observations against a large number of assets), which motivates regularization techniques (shrinkage) to get a more robust estimate.",
  },
};
