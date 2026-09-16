import type { LessonContent } from "@/lib/lesson-types";

export const m11ModelesPricingAutocall: LessonContent = {
  conceptId: "m11-modeles-pricing-autocall",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la simulation Monte-Carlo et les modèles de volatilité locale/stochastique.",
      en: "You need to know Monte Carlo simulation and local/stochastic volatility models.",
    },
    conceptIds: ["m06-monte-carlo", "m08-vol-locale-stochastique"],
  },
  glossary: [
    { term: { fr: "Skew forward", en: "Forward skew" }, definition: { fr: "La forme du sourire de volatilité anticipée à une date future, qui diffère structurellement selon le modèle utilisé (volatilité locale vs. stochastique), avec un impact direct sur le prix d'un produit à observations multiples comme l'autocall.", en: "The shape of the anticipated volatility smile at a future date, which structurally differs depending on the model used (local vs. stochastic volatility), with a direct impact on the price of a multi-observation product like an autocall." } },
  ],
  intuition: {
    fr: "Un autocall ne dépend pas seulement de la volatilité \"aujourd'hui\", mais de la façon dont le marché anticipe que cette volatilité (et sa forme, le skew) évoluera à CHAQUE date d'observation future — deux modèles calibrés de façon identique sur les prix d'options vanilles observés aujourd'hui peuvent donner des prix d'autocall différents, car ils extrapolent différemment le comportement futur de la volatilité.",
    en: "An autocall doesn't only depend on \"today's\" volatility, but on how the market anticipates this volatility (and its shape, the skew) will evolve on EACH future observation date — two models calibrated identically to today's observed vanilla option prices can give different autocall prices, since they extrapolate the volatility's future behavior differently.",
  },
  definition: {
    fr: "Le prix d'un autocall dépend de probabilités conjointes complexes (franchir ou non chaque barrière successive), qui sont très sensibles à la structure fine de la volatilité future, pas seulement à son niveau actuel. Un modèle à volatilité constante (Black-Scholes simple) est généralement insuffisant : il faut un modèle capturant le smile/skew (M08-3) et sa dynamique dans le temps — volatilité locale (calibrée pour reproduire exactement les prix vanilles observés à toutes les maturités) ou volatilité stochastique (modélisant explicitement le caractère aléatoire de la volatilité elle-même), ces deux familles de modèles produisant des \"forward skews\" différents et donc des prix d'autocall différents malgré une calibration identique aux vanilles d'aujourd'hui.",
    en: "An autocall's price depends on complex joint probabilities (crossing or not each successive barrier), which are highly sensitive to future volatility's fine structure, not just its current level. A constant-volatility model (simple Black-Scholes) is generally insufficient: a model capturing the smile/skew (M08-3) and its dynamics over time is needed — local volatility (calibrated to exactly reproduce observed vanilla prices at all maturities) or stochastic volatility (explicitly modeling volatility's own random nature), these two model families producing different \"forward skews\" and so different autocall prices despite identical calibration to today's vanillas.",
  },
  utility: {
    fr: "Le choix du modèle de pricing d'un autocall a un impact direct et significatif sur son prix théorique et sur la couverture nécessaire, ce qui en fait une décision cruciale pour tout desk exotique — contrairement à une option vanille simple où le choix du modèle a généralement peu d'impact une fois calibré sur le marché.",
    en: "An autocall's pricing model choice has a direct and significant impact on its theoretical price and required hedging, making it a crucial decision for any exotics desk — unlike a simple vanilla option where the model choice generally has little impact once calibrated to the market.",
  },
  example: {
    fr: "Deux modèles (volatilité locale et volatilité stochastique) calibrés tous deux exactement sur les mêmes prix d'options vanilles cotées aujourd'hui pour toutes les maturités peuvent néanmoins donner des prix différents (parfois de plusieurs pourcents) pour un autocall à 3 ans avec observations annuelles, car le modèle à volatilité locale a tendance à \"aplatir\" le skew forward de façon plus rapide que le modèle stochastique — un écart qui n'existe pas pour une option vanille simple, mais qui devient significatif pour un produit multi-observations comme l'autocall.",
    en: "Two models (local volatility and stochastic volatility), both calibrated exactly to the same vanilla option prices quoted today across all maturities, can nonetheless give different prices (sometimes several percent apart) for a 3-year autocall with annual observations, since the local volatility model tends to \"flatten\" the forward skew faster than the stochastic model — a gap that doesn't exist for a simple vanilla option, but becomes significant for a multi-observation product like the autocall.",
  },
  alternativeExplanation: {
    fr: "C'est comme prévoir la météo sur plusieurs jours à partir des mêmes observations d'aujourd'hui : deux modèles météorologiques peuvent tomber d'accord parfaitement sur la météo d'aujourd'hui, mais diverger fortement sur leurs prévisions à 3 jours, selon les hypothèses qu'ils font sur la dynamique future. Un autocall, avec ses multiples dates d'observation, est bien plus sensible à ces divergences de prévision qu'un pari météo à un seul horizon (une option vanille).",
    en: "It's like forecasting weather over several days from the same today's observations: two weather models can agree perfectly on today's weather, but diverge sharply in their 3-day forecasts, depending on the assumptions they make about future dynamics. An autocall, with its multiple observation dates, is far more sensitive to these forecasting divergences than a single-horizon weather bet (a vanilla option).",
  },
  formula: {
    latex: "\\text{Erreur type MC} = \\text{SE} = \\frac{\\sigma_{\\text{MC}}}{\\sqrt{N}}",
    variables: [
      { symbol: "\\sigma_{\\text{MC}}", description: { fr: "Écart-type des payoffs simulés sous le modèle choisi", en: "Standard deviation of the simulated payoffs under the chosen model" } },
      { symbol: "N", description: { fr: "Nombre de trajectoires simulées", en: "Number of simulated paths" } },
    ],
    assumptions: { fr: "Formule de convergence Monte-Carlo standard (M06-7), rappelée ici car quasiment tout pricing d'autocall en pratique repose sur simulation plutôt que formule fermée.", en: "Standard Monte Carlo convergence formula (M06-7), recalled here since almost all practical autocall pricing relies on simulation rather than a closed formula." },
    units: { fr: "Même unité que le prix.", en: "Same unit as the price." },
    example: { fr: "σ_MC=15, N=100 000 : SE = 15/√100000 ≈ 0,047 — la précision requise dépend du nombre de dates d'observation et de la complexité de la structure.", en: "σ_MC=15, N=100,000: SE = 15/√100,000 ≈ 0.047 — the required precision depends on the number of observation dates and the structure's complexity." },
  },
  calculation: {
    fr: "1) Calibrer un modèle (volatilité locale ou stochastique) sur l'ensemble des prix d'options vanilles cotées, à toutes les maturités pertinentes. 2) Simuler un grand nombre de trajectoires du sous-jacent sous ce modèle jusqu'à l'échéance finale de l'autocall. 3) Pour chaque trajectoire, appliquer la logique de rappel et de remboursement final (M11-2) pour obtenir un payoff. 4) Moyenner les payoffs actualisés sur toutes les trajectoires, et vérifier la convergence (SE) en augmentant N si nécessaire.",
    en: "1) Calibrate a model (local or stochastic volatility) to the full set of quoted vanilla option prices, across all relevant maturities. 2) Simulate a large number of underlying paths under this model up to the autocall's final maturity. 3) For each path, apply the call and final repayment logic (M11-2) to get a payoff. 4) Average the discounted payoffs across all paths, and check convergence (SE) by increasing N if needed.",
  },
  interpretation: {
    fr: "L'écart de prix entre modèles calibrés de façon identique sur le marché vanille n'est pas une erreur de calcul, mais une incertitude de modèle réelle et inévitable : plus un produit dépend de multiples observations futures (comme l'autocall), plus cette incertitude devient significative, et plus le choix du modèle (et sa justification) devient une décision de gestion des risques à part entière, pas un simple détail technique.",
    en: "The price gap between models identically calibrated to the vanilla market isn't a calculation error, but a real and unavoidable model uncertainty: the more a product depends on multiple future observations (like an autocall), the more significant this uncertainty becomes, and the more the model choice (and its justification) becomes a risk-management decision in its own right, not a mere technical detail.",
  },
  pitfalls: {
    fr: "Utiliser un modèle à volatilité constante (Black-Scholes simple) pour pricer un autocall sous prétexte de simplicité : cela ignore complètement le skew et peut conduire à des erreurs de prix significatives. Autre piège : croire qu'un seul modèle \"correct\" existe — en réalité, différents modèles bien calibrés restent des approximations légitimes mais différentes de la réalité, d'où l'importance de tester la sensibilité du prix au choix du modèle (model risk).",
    en: "Using a constant-volatility model (simple Black-Scholes) to price an autocall for simplicity's sake: this completely ignores the skew and can lead to significant pricing errors. Another trap: believing a single \"correct\" model exists — in reality, different well-calibrated models remain legitimate but different approximations of reality, hence the importance of testing the price's sensitivity to the model choice (model risk).",
  },
  keyPoints: {
    fr: [
      "Un autocall dépend fortement du skew forward, pas seulement du niveau de volatilité actuel.",
      "Volatilité locale et volatilité stochastique, bien que calibrées de façon identique aux vanilles d'aujourd'hui, donnent des prix d'autocall différents.",
      "Le pricing repose quasi systématiquement sur la simulation Monte-Carlo, dont la précision suit SE = σ_MC/√N.",
    ],
    en: [
      "An autocall depends heavily on the forward skew, not just the current volatility level.",
      "Local and stochastic volatility, though identically calibrated to today's vanillas, give different autocall prices.",
      "Pricing relies almost systematically on Monte Carlo simulation, whose precision follows SE = σ_MC/√N.",
    ],
  },
  advancedDemonstration: {
    fr: "L'écart de forward skew entre modèles de volatilité locale et stochastique est un résultat bien documenté en finance quantitative : le modèle de volatilité locale de Dupire, bien qu'exactement calibré aux prix vanilles d'aujourd'hui, tend à produire un skew forward qui s'aplatit trop rapidement dans le temps par rapport à ce qu'observent empiriquement les marchés, tandis que les modèles à volatilité stochastique (Heston, SABR) ou hybrides (local-stochastique) préservent mieux la persistance du skew dans le temps — un choix de modélisation qui, pour un autocall dont le risque se matérialise précisément à des dates futures successives, peut représenter un écart de valorisation de plusieurs pourcents du nominal, largement supérieur aux écarts observés sur des produits vanilles.",
    en: "The forward skew gap between local and stochastic volatility models is a well-documented result in quantitative finance: Dupire's local volatility model, though exactly calibrated to today's vanilla prices, tends to produce a forward skew that flattens too quickly over time relative to what markets empirically observe, while stochastic volatility models (Heston, SABR) or hybrid (local-stochastic) ones better preserve the skew's persistence over time — a modeling choice that, for an autocall whose risk materializes precisely on successive future dates, can represent a valuation gap of several percent of face value, far exceeding gaps observed on vanilla products.",
  },
};
