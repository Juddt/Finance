import type { LessonContent } from "@/lib/lesson-types";

export const m07PnlDeltaHedging: LessonContent = {
  conceptId: "m07-pnl-delta-hedging",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le delta-hedging, le Gamma et le Theta.",
      en: "You need to know delta-hedging, Gamma and Theta.",
    },
    conceptIds: ["m07-delta-hedging"],
  },
  glossary: [
    { term: { fr: "Volatilité réalisée", en: "Realized volatility" }, definition: { fr: "La volatilité effectivement observée sur le sous-jacent pendant la durée de vie de l'option, mesurée a posteriori.", en: "The volatility actually observed on the underlying during the option's life, measured after the fact." } },
  ],
  intuition: {
    fr: "Un vendeur d'options qui se couvre en delta-hedging ne parie plus sur la direction du marché, mais il continue de parier, sans forcément s'en rendre compte, sur un seul chiffre : la volatilité réalisée sera-t-elle plus haute ou plus basse que la volatilité implicite au moment de la vente ?",
    en: "An option seller who delta-hedges no longer bets on market direction, but keeps betting, whether they realize it or not, on a single number: will realized volatility end up higher or lower than the implied volatility at the time of the sale?",
  },
  definition: {
    fr: "Le P&L d'une position delta-hedgée sur une courte période s'approxime par P&L ≈ Θ×dt + ½×Γ×(dS)², où le terme en Gamma capture le \"gain de convexité\" lié au mouvement réalisé du sous-jacent, et le terme en Theta capture la perte de valeur temps. Sur toute la durée de vie de l'option, ce P&L cumulé dépend essentiellement de l'écart entre volatilité réalisée et volatilité implicite au moment de la vente.",
    en: "A delta-hedged position's P&L over a short period is approximated by P&L ≈ Θ×dt + ½×Γ×(dS)², where the Gamma term captures the \"convexity gain\" linked to the underlying's realized move, and the Theta term captures the time-value loss. Over the option's full life, this cumulative P&L essentially depends on the gap between realized and implied volatility at the time of sale.",
  },
  utility: {
    fr: "Cette décomposition explique pourquoi un vendeur d'options gagne de l'argent en moyenne si la volatilité réalisée est plus faible que la volatilité implicite vendue (le Theta encaissé dépasse le coût du Gamma), et en perd dans le cas contraire — une vision beaucoup plus fine qu'un simple \"j'ai vendu, le marché n'a pas bougé, donc j'ai gagné\".",
    en: "This decomposition explains why an option seller makes money on average if realized volatility is lower than the sold implied volatility (the collected Theta exceeds the Gamma cost), and loses in the opposite case — a much finer view than a simple \"I sold, the market didn't move, so I won\".",
  },
  example: {
    fr: "Un trader vend un call avec une volatilité implicite de 20% et se couvre en delta. Si la volatilité réellement réalisée sur le sous-jacent est de 15% (marché plus calme que prévu), le Theta encaissé (positif pour le vendeur) dépasse en moyenne le coût du Gamma (négatif pour le vendeur), et la position est profitable. Si la volatilité réalisée grimpe à 30%, c'est l'inverse : les pertes de Gamma dépassent le Theta encaissé.",
    en: "A trader sells a call with 20% implied volatility and delta-hedges it. If realized volatility on the underlying turns out to be 15% (calmer market than expected), the collected Theta (positive for the seller) exceeds on average the Gamma cost (negative for the seller), and the position is profitable. If realized volatility spikes to 30%, it's the reverse: Gamma losses exceed the collected Theta.",
  },
  alternativeExplanation: {
    fr: "Vendre une option couverte en delta, c'est un peu comme vendre une assurance : vous encaissez une prime régulière (le Theta), mais vous devez payer chaque fois qu'un \"sinistre\" survient (un mouvement du marché, capté par le Gamma). Si les sinistres sont moins fréquents/importants que ce que la prime supposait (volatilité réalisée < implicite), l'assureur (le vendeur d'options) gagne de l'argent en moyenne.",
    en: "Selling a delta-hedged option is a bit like selling insurance: you collect a regular premium (Theta), but you must pay out every time a \"claim\" occurs (a market move, captured by Gamma). If claims are less frequent/large than the premium assumed (realized volatility < implied), the insurer (the option seller) makes money on average.",
  },
  formula: {
    latex: "d\\text{P\\&L} \\approx \\Theta \\, dt + \\frac{1}{2}\\Gamma (dS)^{2}",
    variables: [
      { symbol: "\\Theta", description: { fr: "Perte de valeur temps par unité de temps (généralement négatif pour une position longue)", en: "Time-value loss per unit of time (generally negative for a long position)" } },
      { symbol: "\\Gamma", description: { fr: "Convexité de la position par rapport au sous-jacent", en: "The position's convexity with respect to the underlying" } },
      { symbol: "(dS)^2", description: { fr: "Le carré du mouvement du sous-jacent sur la période", en: "The squared move of the underlying over the period" } },
    ],
    assumptions: { fr: "Approximation de Taylor au second ordre, valable pour un intervalle de temps court et un rééquilibrage fréquent du delta-hedge.", en: "Second-order Taylor approximation, valid for a short time interval and frequent delta-hedge rebalancing." },
    units: { fr: "P&L dans la devise de la position.", en: "P&L in the position's currency." },
    example: { fr: "Voir l'exemple ci-dessus pour l'intuition sur un horizon complet plutôt qu'une seule période.", en: "See the example above for the intuition over a full horizon rather than a single period." },
  },
  calculation: {
    fr: "1) Sur chaque période de rééquilibrage, calculer le mouvement réalisé dS du sous-jacent. 2) Calculer le terme de Gamma : ½×Γ×(dS)². 3) Calculer le terme de Theta sur cette période : Θ×dt. 4) Additionner les deux pour le P&L de la période. 5) Cumuler sur toute la durée de vie de l'option pour le P&L total.",
    en: "1) Over each rebalancing period, compute the underlying's realized move dS. 2) Compute the Gamma term: ½×Γ×(dS)². 3) Compute the Theta term over that period: Θ×dt. 4) Add both for the period's P&L. 5) Cumulate over the option's full life for the total P&L.",
  },
  interpretation: {
    fr: "Pour un vendeur d'options (Γ<0, Θ>0), le P&L moyen sur la durée de vie est positif si la volatilité réalisée est inférieure à l'implicite vendue, car le Theta encaissé compense alors le coût moyen du Gamma négatif — un résultat qui formalise précisément l'intuition \"vendre cher, racheter (implicitement, via le hedge) bon marché\".",
    en: "For an option seller (Γ<0, Θ>0), the average P&L over the life is positive if realized volatility is below the sold implied, since the collected Theta then offsets the average cost of negative Gamma — a result that precisely formalizes the \"sell high, buy back (implicitly, via the hedge) cheap\" intuition.",
  },
  pitfalls: {
    fr: "Croire que le P&L de delta-hedging est garanti positif ou négatif à l'avance : il dépend de la volatilité RÉALISÉE, qui n'est connue qu'a posteriori. Autre piège : négliger le risque de gap (un mouvement brutal entre deux rééquilibrages), qui peut générer une perte bien plus importante que ne le suggère l'approximation ½Γ(dS)² sur un intervalle discret trop large.",
    en: "Believing delta-hedging P&L is guaranteed positive or negative in advance: it depends on REALIZED volatility, only known after the fact. Another trap: neglecting gap risk (a sharp move between two rebalances), which can generate a much larger loss than the ½Γ(dS)² approximation suggests over too wide a discrete interval.",
  },
  keyPoints: {
    fr: [
      "P&L ≈ Θdt + ½Γ(dS)² : la décomposition fondamentale du P&L d'une position delta-hedgée.",
      "Un vendeur d'options gagne en moyenne si volatilité réalisée < volatilité implicite vendue, et perd dans le cas inverse.",
      "Le rééquilibrage discret (pas continu) introduit un risque de gap non capturé par l'approximation continue.",
    ],
    en: [
      "P&L ≈ Θdt + ½Γ(dS)²: the fundamental decomposition of a delta-hedged position's P&L.",
      "An option seller makes money on average if realized volatility < sold implied volatility, and loses otherwise.",
      "Discrete (not continuous) rebalancing introduces gap risk not captured by the continuous approximation.",
    ],
  },
  advancedDemonstration: {
    fr: "En intégrant cette relation sur toute la durée de vie sous l'hypothèse Black-Scholes (où Θ = −½ΓS²σ_implicite²  −  rKe^{−rT}N(d2), en négligeant le terme de taux pour simplifier), le P&L cumulé attendu d'un vendeur d'options couvert en delta s'écrit approximativement ½∫Γ_t S_t² (σ_réalisée,t² − σ_implicite²) dt : c'est le \"P&L de Gamma\" classique de la littérature, qui montre explicitement que le signe du P&L moyen dépend du signe de (σ_réalisée² − σ_implicite²), pondéré par le Gamma (toujours positif pour une option longue) à chaque instant. Cette formule est au cœur de toutes les stratégies de \"vol trading\" (trading de volatilité) où l'on parie explicitement sur cet écart plutôt que sur la direction du marché.",
    en: "Integrating this relation over the full life under the Black-Scholes assumption (where Θ = −½ΓS²σ_implied² − rKe^{−rT}N(d2), ignoring the rate term for simplicity), a delta-hedged option seller's expected cumulative P&L is approximately ½∫Γ_t S_t² (σ_realized,t² − σ_implied²) dt: this is the classic \"Gamma P&L\" from the literature, explicitly showing the average P&L's sign depends on the sign of (σ_realized² − σ_implied²), weighted by Gamma (always positive for a long option) at each instant. This formula is at the heart of all \"vol trading\" strategies, where one explicitly bets on this gap rather than on market direction.",
  },
};
