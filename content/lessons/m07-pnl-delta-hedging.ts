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
    fr: "Un trader vend un call avec une volatilité implicite de 20% et se couvre en delta : position Θ=+80 par jour (collecté), Γ=−0,05. Sur 5 jours, les mouvements réalisés du sous-jacent sont dS=+1, −2, +0,5, −1, +3. P&L du jour = Θ + ½Γ(dS)² : jour 1=80+0,5×(−0,05)×1=79,975 ; jour 2=80+0,5×(−0,05)×4=79,9 ; jour 3=80+0,5×(−0,05)×0,25=79,994 ; jour 4=79,975 ; jour 5=80+0,5×(−0,05)×9=79,775. P&L cumulé sur 5 jours≈399,62 : la volatilité réalisée (mouvements journaliers modestes) est restée sous l'implicite vendue à 20%, donc le Theta encaissé domine largement le coût de Gamma chaque jour.",
    en: "A trader sells a call with 20% implied volatility and delta-hedges it: position Θ=+80 per day (collected), Γ=−0.05. Over 5 days, the underlying's realized moves are dS=+1, −2, +0.5, −1, +3. Day P&L = Θ + ½Γ(dS)²: day 1=80+0.5×(−0.05)×1=79.975; day 2=80+0.5×(−0.05)×4=79.9; day 3=80+0.5×(−0.05)×0.25=79.994; day 4=79.975; day 5=80+0.5×(−0.05)×9=79.775. Cumulative P&L over 5 days≈399.62: realized volatility (modest daily moves) stayed below the 20% sold implied, so the collected Theta heavily dominates the Gamma cost every day.",
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
    example: { fr: "Θ=+80/jour, Γ=−0,05, dS=+1 le jour 1 → P&L=80+0,5×(−0,05)×1²=79,975. Répété et cumulé sur 5 jours avec les mouvements de l'exemple ci-dessus ≈399,62 au total.", en: "Θ=+80/day, Γ=−0.05, dS=+1 on day 1 → P&L=80+0.5×(−0.05)×1²=79.975. Repeated and cumulated over 5 days with the moves from the example above ≈399.62 in total." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Jour", en: "Day" },
    yLabel: { fr: "P&L cumulé", en: "Cumulative P&L" },
    series: [
      {
        label: { fr: "P&L cumulé du vendeur couvert en delta", en: "Delta-hedged seller's cumulative P&L" },
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 79.975 },
          { x: 2, y: 159.875 },
          { x: 3, y: 239.869 },
          { x: 4, y: 319.844 },
          { x: 5, y: 399.619 },
        ],
      },
    ],
  },
  calculation: {
    fr: "1) Sur chaque période de rééquilibrage, calculer le mouvement réalisé dS du sous-jacent : +1, −2, +0,5, −1, +3 sur nos 5 jours. 2) Calculer le terme de Gamma : ½×Γ×(dS)², par exemple ½×(−0,05)×1²=−0,025 le jour 1. 3) Calculer le terme de Theta sur cette période : Θ×dt=+80 chaque jour. 4) Additionner les deux pour le P&L de la période : 79,975 le jour 1. 5) Cumuler sur toute la durée de vie de l'option pour le P&L total : ≈399,62 sur les 5 jours.",
    en: "1) Over each rebalancing period, compute the underlying's realized move dS: +1, −2, +0.5, −1, +3 over our 5 days. 2) Compute the Gamma term: ½×Γ×(dS)², e.g. ½×(−0.05)×1²=−0.025 on day 1. 3) Compute the Theta term over that period: Θ×dt=+80 each day. 4) Add both for the period's P&L: 79.975 on day 1. 5) Cumulate over the option's full life for the total P&L: ≈399.62 over the 5 days.",
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
  businessApplication: {
    fr: "Un desk options suit quotidiennement le P&L de Gamma décomposé (Theta vs coût de Gamma) pour chaque position couverte en delta, précisément pour vérifier en temps réel si le marché réalise plus ou moins de volatilité que celle vendue — cette lecture guide les décisions de resserrer ou d'alléger une position de vente de volatilité avant l'échéance de l'option, plutôt que d'attendre passivement le résultat final.",
    en: "An options desk tracks the decomposed Gamma P&L (Theta vs Gamma cost) daily for every delta-hedged position, precisely to check in real time whether the market is realizing more or less volatility than what was sold — this reading guides decisions to tighten or reduce a short-volatility position before the option's expiry, rather than passively waiting for the final result.",
  },
  interviewQuestion: {
    question: "You're short a delta-hedged call. The stock barely moves today. Are you making or losing money, and why?",
    answer: "I'm almost certainly making money on this position today. Being short a delta-hedged call means I have negative Gamma and positive Theta: I collect time decay every day (Theta), and I pay a cost proportional to the square of the stock's move each time I rebalance the hedge (the Gamma cost). On a day where the stock barely moves, that squared-move term is tiny, so the Gamma cost is negligible and the Theta I collected is basically pure profit. The real risk shows up on a day with a large move — the Gamma cost then scales with the square of that move, and if realized volatility over the option's life ends up higher than the implied volatility I sold it at, the accumulated Gamma losses will exceed the Theta I collected, and the position ends up unprofitable overall.",
  },
  advancedDemonstration: {
    fr: "En intégrant cette relation sur toute la durée de vie sous l'hypothèse Black-Scholes (où Θ = −½ΓS²σ_implicite²  −  rKe^{−rT}N(d2), en négligeant le terme de taux pour simplifier), le P&L cumulé attendu d'un vendeur d'options couvert en delta s'écrit approximativement ½∫Γ_t S_t² (σ_réalisée,t² − σ_implicite²) dt : c'est le \"P&L de Gamma\" classique de la littérature, qui montre explicitement que le signe du P&L moyen dépend du signe de (σ_réalisée² − σ_implicite²), pondéré par le Gamma (toujours positif pour une option longue) à chaque instant. Cette formule est au cœur de toutes les stratégies de \"vol trading\" (trading de volatilité) où l'on parie explicitement sur cet écart plutôt que sur la direction du marché.",
    en: "Integrating this relation over the full life under the Black-Scholes assumption (where Θ = −½ΓS²σ_implied² − rKe^{−rT}N(d2), ignoring the rate term for simplicity), a delta-hedged option seller's expected cumulative P&L is approximately ½∫Γ_t S_t² (σ_realized,t² − σ_implied²) dt: this is the classic \"Gamma P&L\" from the literature, explicitly showing the average P&L's sign depends on the sign of (σ_realized² − σ_implied²), weighted by Gamma (always positive for a long option) at each instant. This formula is at the heart of all \"vol trading\" strategies, where one explicitly bets on this gap rather than on market direction.",
  },
};
