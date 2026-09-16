import type { LessonContent } from "@/lib/lesson-types";

export const m08VolatiliteRealisee: LessonContent = {
  conceptId: "m08-volatilite-realisee",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le rendement logarithmique d'un actif et l'idée d'écart-type.",
      en: "You need to know an asset's log return and the idea of standard deviation.",
    },
    conceptIds: ["m06-brownien-arithmetique-geometrique"],
  },
  glossary: [
    { term: { fr: "Rendement logarithmique", en: "Log return" }, definition: { fr: "r_t = ln(S_t/S_{t-1}), la variation en pourcentage du prix, mesurée sur une échelle logarithmique.", en: "r_t = ln(S_t/S_{t-1}), the price's percentage change, measured on a logarithmic scale." } },
    { term: { fr: "Annualisation", en: "Annualization" }, definition: { fr: "La conversion d'une volatilité mesurée sur une fréquence donnée (jour, semaine) en équivalent annuel, en multipliant par la racine du nombre de périodes par an.", en: "Converting a volatility measured on a given frequency (day, week) into an annual equivalent, by multiplying by the square root of the number of periods per year." } },
  ],
  intuition: {
    fr: "La volatilité réalisée mesure, a posteriori, à quel point un actif a effectivement bougé : ce n'est pas une prévision, c'est un simple calcul statistique sur des prix déjà observés.",
    en: "Realized volatility measures, after the fact, how much an asset actually moved: it isn't a forecast, it's a simple statistical calculation on already-observed prices.",
  },
  definition: {
    fr: "La volatilité réalisée est l'écart-type des rendements logarithmiques observés sur une période, annualisé en multipliant par la racine carrée du nombre de périodes par an (√252 pour des données journalières, en supposant 252 jours de bourse par an).",
    en: "Realized volatility is the standard deviation of observed log returns over a period, annualized by multiplying by the square root of the number of periods per year (√252 for daily data, assuming 252 trading days per year).",
  },
  utility: {
    fr: "C'est la mesure de référence pour comparer ce qu'un actif a réellement fait à ce que le marché anticipait (la volatilité implicite, M08-2) — le point de départ de toute analyse de performance d'une stratégie vendeuse ou acheteuse d'options (voir le P&L de delta-hedging, M07-5).",
    en: "This is the reference measure for comparing what an asset actually did to what the market expected (implied volatility, M08-2) — the starting point of any performance analysis for an option-selling or -buying strategy (see delta-hedging P&L, M07-5).",
  },
  example: {
    fr: "Sur 5 jours, les rendements logarithmiques journaliers sont 1%, −0,5%, 0,8%, −1,2%, 0,3%. L'écart-type de cette série (environ 0,88%) est multiplié par √252 ≈ 15,87 pour obtenir une volatilité annualisée d'environ 14%.",
    en: "Over 5 days, the daily log returns are 1%, −0.5%, 0.8%, −1.2%, 0.3%. This series's standard deviation (about 0.88%) is multiplied by √252 ≈ 15.87 to get an annualized volatility of about 14%.",
  },
  alternativeExplanation: {
    fr: "Imaginez mesurer à quel point un marcheur zigzague sur un trottoir en observant ses pas des derniers jours (pas une prédiction de ses futurs pas) : la volatilité réalisée est cette mesure rétrospective de l'amplitude du zigzag, extrapolée à l'échelle d'une année entière pour être comparable d'un actif à l'autre.",
    en: "Picture measuring how much a walker zigzags on a sidewalk by observing their recent steps (not a prediction of future ones): realized volatility is this retrospective measure of the zigzag's amplitude, extrapolated to a full year's scale to be comparable across assets.",
  },
  formula: {
    latex: "\\sigma_{\\text{réalisée}} = \\sqrt{\\frac{1}{N-1}\\sum_{i=1}^{N}(r_i - \\bar{r})^{2}} \\times \\sqrt{252}",
    variables: [
      { symbol: "r_i", description: { fr: "Rendement logarithmique de la période i", en: "Log return for period i" } },
      { symbol: "\\bar{r}", description: { fr: "Rendement logarithmique moyen sur l'échantillon", en: "The sample's average log return" } },
      { symbol: "N", description: { fr: "Nombre d'observations", en: "Number of observations" } },
    ],
    assumptions: { fr: "252 jours de bourse par an (convention usuelle) ; en pratique r̄ est souvent négligé (supposé ≈0) pour des données journalières à court terme.", en: "252 trading days per year (usual convention); in practice r̄ is often neglected (assumed ≈0) for short-term daily data." },
    units: { fr: "Proportion annuelle, souvent exprimée en %.", en: "Annual proportion, often expressed as a %." },
    example: { fr: "Écart-type journalier ≈0,88%, ×√252 ≈ 14%.", en: "Daily standard deviation ≈0.88%, ×√252 ≈ 14%." },
  },
  calculation: {
    fr: "1) Calculer les rendements logarithmiques r_i = ln(S_i/S_{i-1}) sur la période observée. 2) Calculer leur moyenne r̄ (souvent approximée à 0). 3) Calculer l'écart-type de ces rendements. 4) Multiplier par la racine carrée du nombre de périodes par an pour annualiser.",
    en: "1) Compute log returns r_i = ln(S_i/S_{i-1}) over the observed period. 2) Compute their mean r̄ (often approximated as 0). 3) Compute these returns' standard deviation. 4) Multiply by the square root of the number of periods per year to annualize.",
  },
  interpretation: {
    fr: "La volatilité réalisée dépend fortement de la fenêtre d'observation choisie (10 jours, 1 mois, 1 an) et de la fréquence des données (journalière, horaire) : deux calculs \"corrects\" mais sur des fenêtres différentes peuvent donner des résultats très différents, ce qui rend la comparaison entre sources toujours sensible au choix méthodologique.",
    en: "Realized volatility depends heavily on the chosen observation window (10 days, 1 month, 1 year) and data frequency (daily, hourly): two \"correct\" calculations on different windows can give very different results, making cross-source comparison always sensitive to methodological choices.",
  },
  pitfalls: {
    fr: "Utiliser des rendements simples (S_t/S_{t-1} − 1) au lieu de rendements logarithmiques : les deux convergent pour de petites variations, mais diffèrent pour de grands mouvements, et seuls les rendements log s'additionnent proprement dans le temps. Autre piège : oublier d'annualiser, ou annualiser avec le mauvais facteur (252 jours, 52 semaines, 12 mois selon la fréquence des données).",
    en: "Using simple returns (S_t/S_{t-1} − 1) instead of log returns: the two converge for small changes, but differ for large moves, and only log returns cleanly add up over time. Another trap: forgetting to annualize, or annualizing with the wrong factor (252 days, 52 weeks, 12 months depending on data frequency).",
  },
  keyPoints: {
    fr: [
      "Volatilité réalisée = écart-type des rendements logarithmiques observés, annualisé par √(périodes/an).",
      "C'est une mesure rétrospective (a posteriori), pas une prévision.",
      "Le résultat dépend fortement de la fenêtre d'observation et de la fréquence des données choisies.",
    ],
    en: [
      "Realized volatility = standard deviation of observed log returns, annualized by √(periods/year).",
      "It is a retrospective (after-the-fact) measure, not a forecast.",
      "The result depends heavily on the chosen observation window and data frequency.",
    ],
  },
  advancedDemonstration: {
    fr: "Des estimateurs plus sophistiqués que le simple écart-type des clôtures journalières exploitent l'information intra-journalière disponible (ranges haut/bas/ouverture/clôture) pour réduire le bruit d'estimation à nombre d'observations égal : l'estimateur de Parkinson (utilisant le range haut-bas), celui de Garman-Klass (combinant ouverture/haut/bas/clôture), ou celui de Yang-Zhang (qui gère aussi les sauts d'ouverture entre séances) sont statistiquement plus efficaces que l'estimateur \"close-to-close\" présenté ici, un enjeu important pour l'estimation de volatilité sur de courtes fenêtres où le bruit d'échantillonnage domine.",
    en: "More sophisticated estimators than the simple standard deviation of daily closes exploit available intraday information (high/low/open/close ranges) to reduce estimation noise for the same number of observations: the Parkinson estimator (using the high-low range), Garman-Klass (combining open/high/low/close), or Yang-Zhang (which also handles overnight opening gaps) are statistically more efficient than the \"close-to-close\" estimator presented here, an important consideration for volatility estimation over short windows where sampling noise dominates.",
  },
};
