import type { LessonContent } from "@/lib/lesson-types";

export const m05StrategiesClassiques: LessonContent = {
  conceptId: "m05-strategies-classiques",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir combiner des payoffs de call et de put, et connaître la notion de valeur intrinsèque / valeur temps.",
      en: "You need to know how to combine call and put payoffs, and the idea of intrinsic value / time value.",
    },
    conceptIds: ["m05-call-put", "m05-itm-atm-otm"],
  },
  glossary: [
    { term: { fr: "Débit / crédit net", en: "Net debit / credit" }, definition: { fr: "Le coût net (débit) ou le gain net (crédit) encaissé à la mise en place de la stratégie, selon que les primes achetées dépassent ou non les primes vendues.", en: "The net cost (debit) or net gain (credit) received when setting up the strategy, depending on whether bought premiums exceed sold premiums or not." } },
  ],
  intuition: {
    fr: "Combiner plusieurs calls et puts permet de sculpter un payoff sur mesure : parier sur une hausse limitée moins cher qu'un call seul, parier sur un mouvement fort sans savoir dans quel sens, ou se protéger à coût réduit. Chaque stratégie classique répond à une vue de marché précise.",
    en: "Combining several calls and puts lets you sculpt a custom payoff: bet on a limited rise more cheaply than a lone call, bet on a big move without knowing the direction, or hedge at a reduced cost. Each classic strategy answers a specific market view.",
  },
  definition: {
    fr: "Call spread (bull ou bear) : acheter un call et en vendre un autre de strike différent, pour réduire le coût en échange d'un gain plafonné. Straddle : acheter un call et un put de même strike, pour parier sur un fort mouvement sans direction connue. Strangle : la même idée avec des strikes différents (moins cher, demande un mouvement plus grand). Butterfly : combinaison de trois strikes qui profite d'un marché stable autour du strike central. Collar : détenir le sous-jacent, acheter un put (protection) financé par la vente d'un call (plafonnant le gain). Risk reversal : vendre un put et acheter un call (ou l'inverse), pour une exposition directionnelle à coût réduit voire nul.",
    en: "Call spread (bull or bear): buy one call and sell another at a different strike, reducing cost in exchange for a capped gain. Straddle: buy a call and a put at the same strike, betting on a large move with unknown direction. Strangle: the same idea with different strikes (cheaper, needs a bigger move). Butterfly: a three-strike combination that profits from a stable market around the middle strike. Collar: hold the underlying, buy a put (protection) financed by selling a call (capping the gain). Risk reversal: sell a put and buy a call (or the reverse), for directional exposure at reduced or zero cost.",
  },
  utility: {
    fr: "Ces stratégies permettent d'exprimer une vue précise (direction, amplitude, volatilité) tout en maîtrisant le coût et le risque, plutôt que de se limiter à un call ou un put isolé qui coûte plein prix pour un pari souvent trop large.",
    en: "These strategies let you express a precise view (direction, magnitude, volatility) while controlling cost and risk, rather than being limited to a single call or put that pays full price for a bet that is often too broad.",
  },
  example: {
    fr: "Un investisseur anticipe une hausse modérée d'une action à 100. Plutôt que d'acheter un call K=100 (prime 8), il met en place un bull call spread : achète le call K=100 (prime 8) et vend un call K=110 (prime 3). Coût net = 8 − 3 = 5, contre 8 pour le call seul, mais le gain est plafonné à (110−100) − 5 = 5 si le titre dépasse 110, contre un gain illimité pour le call seul.",
    en: "An investor expects a moderate rise in a stock trading at 100. Rather than buying a K=100 call (premium 8), they set up a bull call spread: buy the K=100 call (premium 8) and sell a K=110 call (premium 3). Net cost = 8 − 3 = 5, versus 8 for the lone call, but the gain is capped at (110−100) − 5 = 5 if the stock exceeds 110, versus an unlimited gain for the lone call.",
  },
  alternativeExplanation: {
    fr: "Voyez chaque stratégie comme un compromis entre coût et plafond : vendre une option pour financer partiellement celle qu'on achète réduit toujours le risque payé, mais coupe aussi le potentiel de gain au-delà d'un certain seuil. Straddle et strangle sont l'exception : ils ne parient pas sur une direction mais sur l'AMPLITUDE du mouvement — peu importe le sens, seul le fait de bouger beaucoup (ou peu, si on les vend) compte.",
    en: "See each strategy as a trade-off between cost and ceiling: selling an option to partly finance the one you buy always reduces the price paid, but also cuts the upside beyond a certain point. Straddle and strangle are the exception: they don't bet on a direction but on the SIZE of the move — regardless of sign, only whether it moves a lot (or a little, if sold) matters.",
  },
  formula: {
    latex: "\\text{Payoff}_{\\text{bull call spread}} = \\max(S_T - K_1, 0) - \\max(S_T - K_2, 0), \\quad K_1 < K_2",
    variables: [
      { symbol: "K_1", description: { fr: "Strike du call acheté (plus bas)", en: "Strike of the bought call (lower)" } },
      { symbol: "K_2", description: { fr: "Strike du call vendu (plus haut)", en: "Strike of the sold call (higher)" } },
    ],
    assumptions: { fr: "Payoff brut, avant déduction du coût net (débit) de mise en place de la stratégie.", en: "Gross payoff, before subtracting the strategy's net setup cost (debit)." },
    units: { fr: "Même devise que le sous-jacent, par unité.", en: "Same currency as the underlying, per unit." },
    example: { fr: "K1=100, K2=110, S_T=115 : Payoff = 15 − 5 = 10 (plafond atteint : 110−100=10).", en: "K1=100, K2=110, S_T=115: Payoff = 15 − 5 = 10 (cap reached: 110−100=10)." },
  },
  calculation: {
    fr: "1) Identifier les strikes et le sens de chaque jambe (achat/vente). 2) Calculer le payoff de chaque jambe séparément à l'échéance : max(S_T−K,0) pour un call acheté, −max(S_T−K,0) pour un call vendu (et symétriquement pour les puts). 3) Additionner tous les payoffs des jambes. 4) Soustraire le coût net payé (ou ajouter le crédit reçu) à la mise en place pour obtenir le profit net.",
    en: "1) Identify the strikes and direction of each leg (bought/sold). 2) Compute each leg's payoff separately at expiry: max(S_T−K,0) for a bought call, −max(S_T−K,0) for a sold call (symmetrically for puts). 3) Add up all legs' payoffs. 4) Subtract the net cost paid (or add the credit received) at setup to get the net profit.",
  },
  interpretation: {
    fr: "Vendre une jambe pour financer l'autre transforme toujours un profil de gain illimité en un profil plafonné : il n'y a pas de gratuité, seulement un arbitrage explicite entre coût réduit et potentiel de gain réduit. Comprendre cet arbitrage est la clé pour choisir la bonne stratégie selon sa vue de marché et son budget de prime.",
    en: "Selling one leg to finance the other always turns an unlimited-gain profile into a capped one: there is no free lunch, only an explicit trade-off between reduced cost and reduced upside. Understanding this trade-off is the key to choosing the right strategy for one's market view and premium budget.",
  },
  pitfalls: {
    fr: "Confondre straddle/strangle (pari sur l'amplitude, position longue en volatilité) avec un spread directionnel (pari sur le sens). Autre piège fréquent : oublier que vendre une jambe non couverte (par exemple un put nu dans un risk reversal) expose à une perte potentiellement illimitée ou très importante, contrairement aux spreads où les deux jambes bornent mutuellement le risque.",
    en: "Confusing a straddle/strangle (a bet on magnitude, a long-volatility position) with a directional spread (a bet on direction). Another common trap: forgetting that selling an uncovered leg (e.g. a naked put in a risk reversal) exposes you to a potentially unlimited or very large loss, unlike spreads where both legs mutually bound the risk.",
  },
  keyPoints: {
    fr: [
      "Spreads (bull/bear) : réduisent le coût en échange d'un gain plafonné, pari directionnel modéré.",
      "Straddle/strangle : parient sur l'amplitude d'un mouvement, pas sur sa direction.",
      "Collar et risk reversal combinent achat et vente d'options pour ajuster le coût d'une exposition directionnelle ou de couverture.",
    ],
    en: [
      "Spreads (bull/bear): reduce cost in exchange for a capped gain, a moderate directional bet.",
      "Straddle/strangle: bet on the size of a move, not its direction.",
      "Collar and risk reversal combine buying and selling options to adjust the cost of a directional or hedging exposure.",
    ],
  },
  advancedDemonstration: {
    fr: "Un butterfly (achat K1, vente de 2×K2, achat K3, avec K1<K2<K3 équidistants) peut se décomposer comme la différence entre deux call spreads adjacents (K1-K2) et (K2-K3) : cette décomposition explique pourquoi son coût est toujours faible (il profite d'un scénario très précis) et pourquoi son Gamma est fortement positif autour de K2 mais négatif ailleurs (voir M07). Le collar, en particulier le \"zero-cost collar\" où le strike du call vendu est choisi pour que sa prime finance exactement celle du put acheté, est très utilisé en gestion de trésorerie d'entreprise pour couvrir une position actions existante sans déboursé de prime, au prix d'un renoncement au potentiel de hausse au-delà du strike du call — un compromis qui doit être choisi consciemment, pas subi.",
    en: "A butterfly (buy K1, sell 2×K2, buy K3, with K1<K2<K3 equidistant) can be decomposed as the difference between two adjacent call spreads (K1-K2) and (K2-K3): this decomposition explains why its cost is always low (it profits from a very specific scenario) and why its Gamma is strongly positive around K2 but negative elsewhere (see M07). The collar, particularly the \"zero-cost collar\" where the sold call's strike is chosen so its premium exactly funds the bought put, is widely used in corporate treasury management to hedge an existing equity position with no premium outlay, at the cost of giving up upside beyond the call's strike — a trade-off that should be chosen consciously, not incurred by accident.",
  },
};
