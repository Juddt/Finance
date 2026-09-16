import type { LessonContent } from "@/lib/lesson-types";

/**
 * Source : cours magistral standard de produits dérivés (Hull, "Options, Futures,
 * and Other Derivatives", chapitre sur le pricing des forwards par non-arbitrage).
 * Convention retenue : composition continue, sans dividende ni coût de portage
 * (cas traité dans M02-2 pour les extensions avec revenus/coûts).
 */
export const m02ForwardContractValue: LessonContent = {
  conceptId: "m02-forward-contract-value",
  intuition: {
    fr: "Le prix de livraison est figé pour toute la vie du contrat, mais le prix forward de marché bouge : leur écart, actualisé, donne la valeur du contrat.",
    en: "The delivery price is frozen for the life of the contract, but the market forward price moves: their discounted gap is the contract's value.",
  },
  definition: {
    fr: "À un instant t, on distingue trois grandeurs : le prix forward de marché F(t) (le prix de livraison qui donnerait une valeur nulle à un nouveau contrat conclu maintenant), le prix de livraison K (fixé une fois pour toutes à la conclusion du contrat étudié) et la valeur V(t) de ce contrat déjà engagé, qui dépend de l'écart entre F(t) et K.",
    en: "At time t, distinguish three quantities: the market forward price F(t) (the delivery price that would give zero value to a new contract entered into now), the delivery price K (fixed once and for all when the studied contract was entered into) and the value V(t) of that existing contract, which depends on the gap between F(t) and K.",
  },
  utility: {
    fr: "Cette distinction sert à marquer au marché (mark-to-market) une position forward déjà en portefeuille, sans attendre l'échéance, et à comprendre pourquoi un contrat peut valoir plus ou moins que zéro après sa conclusion.",
    en: "This distinction is used to mark an existing forward position to market, without waiting for maturity, and to understand why a contract can be worth more or less than zero after inception.",
  },
  example: {
    fr: "Un exportateur conclut aujourd'hui (t = 0) un forward de vente d'EUR/USD à 3 mois, prix de livraison K = 1,0800 (égal au prix forward de marché F(0) à cette date : la valeur initiale est donc nulle, hors frais). Un mois plus tard, le prix forward de marché à 2 mois est passé à F(t) = 1,1000 : son contrat, lui, reste fixé à K = 1,0800. Sa position (vendeuse à terme) a perdu de la valeur car le marché est prêt à vendre plus cher que son prix contractuel.",
    en: "An exporter enters today (t = 0) into a 3-month EUR/USD sell forward, delivery price K = 1.0800 (equal to the market forward price F(0) on that date: the initial value is therefore zero, ignoring fees). One month later, the 2-month market forward price has moved to F(t) = 1.1000: their contract, however, stays fixed at K = 1.0800. Their (short forward) position has lost value because the market is now willing to sell at a higher price than their contractual price.",
  },
  formula: {
    latex: "V_t^{\\text{long}} = \\left(F_t - K\\right) e^{-r(T-t)}",
    variables: [
      { symbol: "V_t^{\\text{long}}", description: { fr: "Valeur à l'instant t d'une position longue sur le forward", en: "Value at time t of a long forward position" } },
      { symbol: "F_t", description: { fr: "Prix forward de marché à t, pour livraison en T", en: "Market forward price at t, for delivery at T" } },
      { symbol: "K", description: { fr: "Prix de livraison fixé à la conclusion du contrat", en: "Delivery price fixed at contract inception" } },
      { symbol: "r", description: { fr: "Taux sans risque annualisé, composition continue", en: "Annualized risk-free rate, continuous compounding" } },
      { symbol: "T-t", description: { fr: "Durée restante jusqu'à l'échéance, en années", en: "Remaining time to maturity, in years" } },
    ],
    assumptions: {
      fr: "Absence d'arbitrage, absence de coûts de transaction, taux sans risque constant sur la période, pas de dividende ni de coût de portage (cas simple ; voir M02-2 pour l'extension).",
      en: "No arbitrage, no transaction costs, constant risk-free rate over the period, no dividend or carry cost (simple case; see M02-2 for the extension).",
    },
    units: {
      fr: "V_t est exprimée dans la même devise/unité que le sous-jacent ; r est un taux annuel (ex. 0,03 pour 3 %) ; T−t est en années (ex. 0,25 pour 3 mois).",
      en: "V_t is expressed in the same currency/unit as the underlying; r is an annual rate (e.g. 0.03 for 3%); T−t is in years (e.g. 0.25 for 3 months).",
    },
    example: {
      fr: "Avec F_t = 1,1000, K = 1,0800, r = 2 % et T−t = 2/12 an : V_t = (1,1000 − 1,0800) × e^{−0,02 × 2/12} ≈ 0,0200 × 0,9967 ≈ 0,01993 par unité de sous-jacent.",
      en: "With F_t = 1.1000, K = 1.0800, r = 2% and T−t = 2/12 year: V_t = (1.1000 − 1.0800) × e^(−0.02 × 2/12) ≈ 0.0200 × 0.9967 ≈ 0.01993 per unit of underlying.",
    },
  },
  calculation: {
    fr: "1) Identifier F_t, le prix forward de marché observé aujourd'hui pour la même échéance T. 2) Relever K, le prix de livraison inscrit dans le contrat existant (il ne change jamais). 3) Calculer l'écart (F_t − K) pour une position longue, ou (K − F_t) pour une position courte. 4) Actualiser cet écart au taux sans risque sur la durée restante T−t : V_t = (F_t − K) e^{−r(T−t)}. 5) À la conclusion (t = 0), si K a été fixé égal à F(0), alors V_0 = (F_0 − F_0) e^{-rT} = 0.",
    en: "1) Identify F_t, today's observed market forward price for the same maturity T. 2) Read K, the delivery price written into the existing contract (it never changes). 3) Compute the gap (F_t − K) for a long position, or (K − F_t) for a short position. 4) Discount that gap at the risk-free rate over the remaining time T−t: V_t = (F_t − K) e^(−r(T−t)). 5) At inception (t = 0), if K was set equal to F(0), then V_0 = (F_0 − F_0) e^(-rT) = 0.",
  },
  interpretation: {
    fr: "Un forward est un engagement ferme, pas une option : sa valeur peut devenir négative. Elle n'est nulle qu'au moment précis où K est fixé égal au prix forward de marché du jour ; ensuite, elle évolue avec F_t tout en gardant K figé.",
    en: "A forward is a firm commitment, not an option: its value can become negative. It is zero only at the exact moment K is set equal to that day's market forward price; afterwards it moves with F_t while K stays fixed.",
  },
  pitfalls: {
    fr: "Confondre prix forward de marché (F_t, qui bouge) et prix de livraison (K, figé) est l'erreur la plus fréquente. Autre piège : croire qu'un forward vaut toujours zéro pendant toute sa vie — c'est vrai uniquement à l'instant de sa conclusion, hors frais.",
    en: "Confusing the market forward price (F_t, which moves) with the delivery price (K, frozen) is the most common mistake. Another trap: believing a forward is always worth zero throughout its life — this is true only at the moment it is entered into, ignoring fees.",
  },
  keyPoints: {
    fr: [
      "Le prix de livraison K est fixé une fois pour toutes ; le prix forward de marché F(t) bouge en continu.",
      "La valeur du contrat existant est V_t = (F_t − K) e^(−r(T−t)) pour une position longue.",
      "V_0 = 0 seulement au moment où K est choisi égal au prix forward de marché du jour, hors frais.",
    ],
    en: [
      "The delivery price K is fixed once and for all; the market forward price F(t) keeps moving.",
      "The value of the existing contract is V_t = (F_t − K) e^(−r(T−t)) for a long position.",
      "V_0 = 0 only at the moment K is chosen equal to that day's market forward price, ignoring fees.",
    ],
  },
  advancedDemonstration: {
    fr: "Démonstration par portefeuille de réplication : construisons un portefeuille A composé d'un forward long (livraison K, échéance T) et d'un placement sans risque de K × e^{−r(T−t)} unités monétaires jusqu'en T. À l'échéance, le placement vaut exactement K, qui sert à payer la livraison : le portefeuille A livre donc le sous-jacent au prix K, tout comme un forward conclu aujourd'hui au prix F_t accompagné d'un placement de F_t × e^{−r(T−t)}. Par absence d'arbitrage, ces deux portefeuilles doivent avoir la même valeur à l'instant t. Le second (conclu au prix de marché F_t) a une valeur nulle par définition du prix forward. On en déduit : V_t + K e^{−r(T−t)} = 0 + F_t e^{−r(T−t)}, soit V_t = (F_t − K) e^{−r(T−t)}. La démonstration symétrique pour une position courte donne V_t = (K − F_t) e^{−r(T−t)}.",
    en: "Replicating-portfolio proof: build portfolio A made of a long forward (delivery K, maturity T) and a risk-free deposit of K × e^(−r(T−t)) monetary units held until T. At maturity the deposit is worth exactly K, used to pay for delivery: portfolio A therefore delivers the underlying at price K, exactly like a forward entered into today at price F_t together with a deposit of F_t × e^(−r(T−t)). By no-arbitrage, both portfolios must have the same value at time t. The second one (struck at the market price F_t) has zero value by definition of the forward price. This gives: V_t + K e^(−r(T−t)) = 0 + F_t e^(−r(T−t)), i.e. V_t = (F_t − K) e^(−r(T−t)). The symmetric proof for a short position gives V_t = (K − F_t) e^(−r(T−t)).",
  },
};
