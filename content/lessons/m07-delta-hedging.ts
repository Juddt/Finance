import type { LessonContent } from "@/lib/lesson-types";

export const m07DeltaHedging: LessonContent = {
  conceptId: "m07-delta-hedging",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le Delta d'une option et le principe du portefeuille de réplication de Black-Scholes.",
      en: "You need to know an option's Delta and the Black-Scholes replicating portfolio principle.",
    },
    conceptIds: ["m07-greeks-premier-ordre", "m06-black-scholes"],
  },
  glossary: [
    { term: { fr: "Rééquilibrage (rebalancing)", en: "Rebalancing" }, definition: { fr: "L'action d'ajuster la quantité de sous-jacent détenue pour que le Delta total de la position reste proche de zéro.", en: "Adjusting the quantity of underlying held so the position's total Delta stays close to zero." } },
  ],
  intuition: {
    fr: "Un vendeur d'options ne veut pas parier sur la direction du marché : il veut gagner sa marge de vente sans risque directionnel. Le delta-hedging consiste à détenir juste ce qu'il faut de sous-jacent pour neutraliser le Delta de l'option vendue — et à réajuster cette quantité au fil du temps, car le Delta change constamment.",
    en: "An option seller doesn't want to bet on market direction: they want to earn their selling margin without directional risk. Delta-hedging means holding exactly enough underlying to neutralize the sold option's Delta — and readjusting that amount over time, since Delta constantly changes.",
  },
  definition: {
    fr: "Le delta-hedging consiste à détenir une position de −Δ unités de sous-jacent pour chaque option longue détenue (ou +Δ pour une option courte), afin que le Delta total du portefeuille (option + couverture) reste proche de zéro. Comme Δ change avec S, σ et t, la couverture doit être régulièrement rééquilibrée.",
    en: "Delta-hedging means holding a position of −Δ units of the underlying for each long option held (or +Δ for a short option), so the total portfolio Delta (option + hedge) stays close to zero. Since Δ changes with S, σ and t, the hedge must be regularly rebalanced.",
  },
  utility: {
    fr: "C'est la pratique centrale de tout desk d'options : elle permet de vendre des options tout en maîtrisant le risque directionnel, en transformant un pari sur la direction du marché en un pari beaucoup plus ciblé sur la volatilité réalisée par rapport à la volatilité implicite vendue (voir M07-5).",
    en: "This is the central practice of any options desk: it lets you sell options while controlling directional risk, turning a bet on market direction into a much more targeted bet on realized volatility versus the sold implied volatility (see M07-5).",
  },
  example: {
    fr: "Un trader vend 100 calls (Delta=0,55 chacun) sur une action. Il achète 100 × 0,55 = 55 actions pour neutraliser le Delta. Si le lendemain le Delta grimpe à 0,60 (le sous-jacent a monté), il doit acheter 100 × (0,60−0,55) = 5 actions supplémentaires pour rester couvert — c'est le rééquilibrage.",
    en: "A trader sells 100 calls (Delta=0.55 each) on a stock. They buy 100 × 0.55 = 55 shares to neutralize the Delta. If the next day the Delta rises to 0.60 (the underlying has risen), they must buy 100 × (0.60−0.55) = 5 more shares to stay hedged — this is rebalancing.",
  },
  alternativeExplanation: {
    fr: "Imaginez tenir un plateau en équilibre sur lequel repose une bille qui roule sans cesse (le sous-jacent) : le delta-hedging, c'est incliner continuellement le plateau (ajuster la quantité de sous-jacent détenue) pour que la bille ne tombe jamais d'un côté — un ajustement permanent, jamais définitif, car la bille (et donc l'inclinaison nécessaire) bouge sans arrêt.",
    en: "Picture keeping a tray balanced with a ball constantly rolling on it (the underlying): delta-hedging is continuously tilting the tray (adjusting the underlying quantity held) so the ball never falls off one side — a permanent, never-final adjustment, since the ball (and so the needed tilt) keeps moving.",
  },
  formula: {
    latex: "\\Delta \\text{Sous-jacent à trader} = (\\Delta_{\\text{nouveau}} - \\Delta_{\\text{ancien}}) \\times \\text{Nombre de contrats}",
    variables: [
      { symbol: "\\Delta_{\\text{nouveau}}, \\Delta_{\\text{ancien}}", description: { fr: "Delta de l'option après et avant le mouvement de marché", en: "The option's Delta after and before the market move" } },
      { symbol: "\\text{Nombre de contrats}", description: { fr: "Quantité d'options détenues (positive si longue, négative si courte)", en: "Quantity of options held (positive if long, negative if short)" } },
    ],
    assumptions: { fr: "Rééquilibrage discret, en pratique à intervalles réguliers ou selon un seuil de tolérance de Delta.", en: "Discrete rebalancing, in practice at regular intervals or per a Delta tolerance threshold." },
    units: { fr: "Unités de sous-jacent (actions, contrats).", en: "Units of underlying (shares, contracts)." },
    example: { fr: "Δ_nouveau=0,60, Δ_ancien=0,55, 100 contrats vendus (−100) : achat de −100×(0,60−0,55) = −5, soit vente de 5 actions (à corriger selon le sens réel de la position).", en: "Δ_new=0.60, Δ_old=0.55, 100 contracts sold (−100): trade of −100×(0.60−0.55) = −5, i.e. selling 5 shares (adjust per the position's actual direction)." },
  },
  calculation: {
    fr: "1) Calculer le Delta actuel de la position d'options. 2) Comparer à la quantité de sous-jacent actuellement détenue. 3) Calculer l'écart entre les deux. 4) Trader la quantité nécessaire de sous-jacent pour ramener l'écart à zéro (ou en dessous d'un seuil de tolérance).",
    en: "1) Compute the option position's current Delta. 2) Compare to the underlying quantity currently held. 3) Compute the gap between the two. 4) Trade the needed underlying quantity to bring the gap to zero (or below a tolerance threshold).",
  },
  interpretation: {
    fr: "Le delta-hedging ne rend jamais le portefeuille parfaitement sans risque : entre deux rééquilibrages, une exposition résiduelle liée au Gamma subsiste (le Delta a changé mais n'a pas encore été rééquilibré). C'est cette exposition résiduelle qui génère le P&L de delta-hedging, positif ou négatif selon la réalisation de la volatilité (voir M07-5).",
    en: "Delta-hedging never makes the portfolio perfectly risk-free: between two rebalances, a residual Gamma-linked exposure remains (Delta has changed but hasn't yet been rebalanced). This residual exposure is what generates delta-hedging P&L, positive or negative depending on how volatility actually unfolds (see M07-5).",
  },
  pitfalls: {
    fr: "Croire que le delta-hedging élimine tout risque : il neutralise le risque directionnel de premier ordre, pas le risque de Gamma (mouvements larges entre deux rééquilibrages) ni le risque de Vega (variation de la volatilité elle-même). Autre piège : rééquilibrer trop rarement (risque de gap important) ou trop souvent (coûts de transaction qui rongent la marge).",
    en: "Believing delta-hedging eliminates all risk: it neutralizes first-order directional risk, not Gamma risk (large moves between two rebalances) nor Vega risk (volatility itself changing). Another trap: rebalancing too rarely (significant gap risk) or too often (transaction costs eating into the margin).",
  },
  keyPoints: {
    fr: [
      "Detenir −Δ unités de sous-jacent par option longue pour neutraliser le risque directionnel de premier ordre.",
      "Le Delta change en continu (avec S, σ, t) : la couverture doit être régulièrement rééquilibrée.",
      "Le delta-hedging ne supprime pas le risque de Gamma ni de Vega, seulement le risque directionnel instantané.",
    ],
    en: [
      "Hold −Δ units of underlying per long option to neutralize first-order directional risk.",
      "Delta constantly changes (with S, σ, t): the hedge must be regularly rebalanced.",
      "Delta-hedging doesn't remove Gamma or Vega risk, only instantaneous directional risk.",
    ],
  },
  advancedDemonstration: {
    fr: "La fréquence optimale de rééquilibrage résulte d'un arbitrage entre risque résiduel de Gamma (plus on rééquilibre rarement, plus l'écart de Delta non couvert peut devenir important) et coûts de transaction (plus on rééquilibre souvent, plus les frais s'accumulent). En pratique, les desks utilisent souvent un rééquilibrage à seuil (retrader dès que le Delta dévie de plus d'un montant fixé) plutôt qu'à intervalle fixe, pour s'adapter automatiquement à la volatilité du marché — rééquilibrer plus souvent en période agitée, moins souvent en période calme.",
    en: "The optimal rebalancing frequency results from a trade-off between residual Gamma risk (the less often you rebalance, the larger the uncovered Delta gap can become) and transaction costs (the more often you rebalance, the more fees accumulate). In practice, desks often use threshold-based rebalancing (retrade as soon as Delta deviates by more than a set amount) rather than fixed intervals, to automatically adapt to market volatility — rebalancing more often in turbulent periods, less often in calm ones.",
  },
};
