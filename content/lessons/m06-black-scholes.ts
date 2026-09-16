import type { LessonContent } from "@/lib/lesson-types";

export const m06BlackScholes: LessonContent = {
  conceptId: "m06-black-scholes",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le lemme d'Itô et l'idée de portefeuille de réplication déjà rencontrée pour la parité call-put.",
      en: "You need to know Itô's lemma and the replicating portfolio idea already seen for put-call parity.",
    },
    conceptIds: ["m06-prerequis-ito", "m05-parite-call-put"],
  },
  glossary: [
    { term: { fr: "Portefeuille auto-financé", en: "Self-financing portfolio" }, definition: { fr: "Un portefeuille dont la valeur ne change qu'à cause des variations de prix des actifs qui le composent, sans apport ni retrait externe d'argent.", en: "A portfolio whose value only changes due to price moves of its component assets, with no external cash added or withdrawn." } },
  ],
  intuition: {
    fr: "L'idée géniale de Black et Scholes : à chaque instant, on peut répliquer exactement le comportement d'une option en détenant la bonne quantité d'actions et d'obligations, rééquilibrée en continu. Si cette réplication est parfaite, le prix de l'option est forcément le coût de cette réplication — sinon un arbitrage serait possible.",
    en: "Black and Scholes's brilliant idea: at every instant, an option's behavior can be exactly replicated by holding the right amount of stock and bonds, continuously rebalanced. If this replication is perfect, the option's price must be the cost of that replication — otherwise an arbitrage would be possible.",
  },
  definition: {
    fr: "Le modèle de Black-Scholes établit que le prix V(S,t) de toute option européenne sur un actif suivant un brownien géométrique vérifie l'équation aux dérivées partielles : ∂V/∂t + rS∂V/∂S + ½σ²S²∂²V/∂S² − rV = 0, sous les hypothèses de volatilité et taux sans risque constants, marché sans friction, trading continu et absence de dividende.",
    en: "The Black-Scholes model establishes that the price V(S,t) of any European option on an asset following a geometric Brownian motion satisfies the partial differential equation: ∂V/∂t + rS∂V/∂S + ½σ²S²∂²V/∂S² − rV = 0, under the assumptions of constant volatility and risk-free rate, a frictionless market, continuous trading and no dividend.",
  },
  utility: {
    fr: "Cette équation, une fois résolue avec les bonnes conditions aux limites, donne les formules fermées de pricing d'un call et d'un put (M06-5) — le résultat le plus utilisé de toute la finance quantitative, qui a valu le prix Nobel d'économie à Scholes et Merton en 1997 (Black étant décédé en 1995).",
    en: "This equation, once solved with the right boundary conditions, gives the closed-form pricing formulas for a call and a put (M06-5) — the most widely used result in all of quantitative finance, which earned Scholes and Merton the Nobel Prize in Economics in 1997 (Black having passed away in 1995).",
  },
  example: {
    fr: "Considérons un portefeuille Π = V(S,t) − Δ×S, où Δ = ∂V/∂S : une position longue sur l'option et courte sur Δ actions. En choisissant Δ pour éliminer le risque instantané de S (delta-hedging, voir M07-4), la variation dΠ ne dépend plus de dW_t : le portefeuille devient localement sans risque, et doit donc rapporter exactement le taux sans risque r par unité de temps — c'est cette condition qui, une fois développée avec le lemme d'Itô, donne l'équation de Black-Scholes.",
    en: "Consider a portfolio Π = V(S,t) − Δ×S, where Δ = ∂V/∂S: a long position in the option and short Δ shares. Choosing Δ to eliminate S's instantaneous risk (delta-hedging, see M07-4), the change dΠ no longer depends on dW_t: the portfolio becomes locally risk-free, and so must earn exactly the risk-free rate r per unit of time — this condition, once expanded with Itô's lemma, gives the Black-Scholes equation.",
  },
  alternativeExplanation: {
    fr: "Imaginez un funambule qui ajuste en permanence son balancier pour rester en équilibre malgré le vent (les mouvements aléatoires du sous-jacent). Le \"bon\" delta est exactement le réglage du balancier qui annule l'effet du vent à chaque instant. Si ce réglage existe et fonctionne parfaitement (marché sans friction, trading continu), alors la seule façon cohérente de pricer l'option est de calculer le coût de ce funambulisme permanent.",
    en: "Picture a tightrope walker constantly adjusting their balance pole to stay steady despite the wind (the underlying's random moves). The \"right\" delta is exactly the pole adjustment that cancels the wind's effect at every instant. If this adjustment exists and works perfectly (frictionless market, continuous trading), then the only consistent way to price the option is to compute the cost of this permanent balancing act.",
  },
  formula: {
    latex: "\\frac{\\partial V}{\\partial t} + rS\\frac{\\partial V}{\\partial S} + \\frac{1}{2}\\sigma^{2}S^{2}\\frac{\\partial^{2} V}{\\partial S^{2}} - rV = 0",
    variables: [
      { symbol: "V(S,t)", description: { fr: "Prix de l'option, fonction du sous-jacent S et du temps t", en: "The option's price, a function of the underlying S and time t" } },
      { symbol: "r", description: { fr: "Taux sans risque (constant)", en: "The (constant) risk-free rate" } },
      { symbol: "\\sigma", description: { fr: "Volatilité du sous-jacent (constante)", en: "The underlying's (constant) volatility" } },
    ],
    assumptions: { fr: "Trading continu, pas de coûts de transaction, taux et volatilité constants, pas de dividende, ventes à découvert autorisées, S suit un brownien géométrique.", en: "Continuous trading, no transaction costs, constant rate and volatility, no dividend, short selling allowed, S follows a geometric Brownian motion." },
    units: { fr: "V dans la devise du sous-jacent ; r, σ en proportion annuelle.", en: "V in the underlying's currency; r, σ as annual proportions." },
    example: { fr: "Cette équation ne se résout pas \"à la main\" avec un exemple numérique direct : sa résolution complète (avec conditions aux limites d'un call/put) est donnée en M06-5.", en: "This equation isn't solved \"by hand\" with a direct numerical example: its full solution (with call/put boundary conditions) is given in M06-5." },
  },
  calculation: {
    fr: "1) Construire le portefeuille Π = V − ΔS avec Δ = ∂V/∂S (delta-hedging). 2) Appliquer le lemme d'Itô à V(S,t) pour obtenir dV. 3) Calculer dΠ = dV − ΔdS, et constater que le terme en dW_t s'annule grâce au choix de Δ. 4) Écrire que dΠ = rΠdt (absence d'arbitrage, portefeuille sans risque). 5) Réarranger pour obtenir l'équation aux dérivées partielles de Black-Scholes.",
    en: "1) Build the portfolio Π = V − ΔS with Δ = ∂V/∂S (delta-hedging). 2) Apply Itô's lemma to V(S,t) to get dV. 3) Compute dΠ = dV − ΔdS, and note the dW_t term cancels thanks to the choice of Δ. 4) Write dΠ = rΠdt (no-arbitrage, risk-free portfolio). 5) Rearrange to get the Black-Scholes partial differential equation.",
  },
  interpretation: {
    fr: "Remarquablement, l'équation ne contient PAS le drift μ du sous-jacent : seul le taux sans risque r intervient. C'est exactement le résultat de la mesure risque-neutre (M06-3) — l'appétit pour le risque des investisseurs, reflété dans μ, ne joue aucun rôle dans le prix d'une option, une fois le delta-hedging effectué.",
    en: "Remarkably, the equation does NOT contain the underlying's drift μ: only the risk-free rate r appears. This is exactly the risk-neutral measure result (M06-3) — investors' risk appetite, reflected in μ, plays no role in an option's price, once delta-hedging is performed.",
  },
  pitfalls: {
    fr: "Croire que le prix d'une option dépend du rendement attendu du sous-jacent (μ) : c'est une confusion très répandue, alors que le modèle montre précisément l'inverse. Autre piège : oublier que ces hypothèses (trading continu, pas de coûts, volatilité constante) sont des simplifications fortes, jamais vérifiées exactement en pratique — voir les limites du modèle abordées dans les notions suivantes.",
    en: "Believing an option's price depends on the underlying's expected return (μ): a very common confusion, when the model shows precisely the opposite. Another trap: forgetting these assumptions (continuous trading, no costs, constant volatility) are strong simplifications, never exactly met in practice — see the model's limits covered in later concepts.",
  },
  keyPoints: {
    fr: [
      "L'équation de Black-Scholes vient d'un portefeuille de réplication delta-neutre, rendu sans risque par construction.",
      "Le prix d'une option ne dépend jamais du rendement attendu μ du sous-jacent, seulement de r et σ.",
      "Les hypothèses du modèle (vol constante, pas de friction) sont de fortes simplifications de la réalité.",
    ],
    en: [
      "The Black-Scholes equation comes from a delta-neutral replicating portfolio, made risk-free by construction.",
      "An option's price never depends on the underlying's expected return μ, only on r and σ.",
      "The model's assumptions (constant vol, no friction) are strong simplifications of reality.",
    ],
  },
  advancedDemonstration: {
    fr: "Les limites empiriques du modèle sont aujourd'hui bien documentées : la volatilité n'est pas constante (elle varie avec le strike — le \"smile\" de volatilité, voir M08 — et dans le temps), le trading n'est pas continu (coûts de transaction, discrétisation du rééquilibrage, voir le P&L du delta-hedging en M07-5), et les queues de distribution réelles des rendements sont plus épaisses que ne le prédit la loi log-normale (risque de saut, krachs). Ces limites ont donné naissance à toute une famille de modèles plus sophistiqués (volatilité locale, volatilité stochastique, modèles à sauts) qui relâchent une ou plusieurs de ces hypothèses, au prix d'une complexité mathématique et calculatoire bien supérieure.",
    en: "The model's empirical limits are now well documented: volatility is not constant (it varies with strike — the volatility \"smile\", see M08 — and over time), trading is not continuous (transaction costs, discretized rebalancing, see delta-hedging P&L in M07-5), and real return distributions have fatter tails than the log-normal law predicts (jump risk, crashes). These limits gave rise to an entire family of more sophisticated models (local volatility, stochastic volatility, jump models) that relax one or more of these assumptions, at the cost of far greater mathematical and computational complexity.",
  },
};
