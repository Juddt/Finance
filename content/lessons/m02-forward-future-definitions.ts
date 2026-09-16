import type { LessonContent } from "@/lib/lesson-types";

export const m02ForwardFutureDefinitions: LessonContent = {
  conceptId: "m02-forward-future-definitions",
  prerequisiteReminder: {
    text: {
      fr: "Il est utile de savoir ce qu'est un marché de gré à gré (OTC) par opposition à un marché organisé, et ce qu'est une opportunité d'arbitrage.",
      en: "It helps to know what an over-the-counter (OTC) market is as opposed to an exchange, and what an arbitrage opportunity is.",
    },
    conceptIds: ["m01-classes-actifs", "m01-arbitrage"],
  },
  glossary: [
    {
      term: { fr: "Sous-jacent", en: "Underlying" },
      definition: {
        fr: "L'actif réel dont dépend le contrat (une action, une devise, une matière première...).",
        en: "The real asset the contract depends on (a stock, a currency, a commodity...).",
      },
    },
    {
      term: { fr: "Position longue / courte", en: "Long / short position" },
      definition: {
        fr: "Longue = engagé à acheter le sous-jacent à l'échéance. Courte = engagé à le vendre.",
        en: "Long = committed to buying the underlying at maturity. Short = committed to selling it.",
      },
    },
    {
      term: { fr: "Échéance (maturité)", en: "Maturity" },
      definition: {
        fr: "La date future à laquelle le contrat doit être exécuté.",
        en: "The future date at which the contract must be executed.",
      },
    },
  ],
  intuition: {
    fr: "Un forward ou un future, c'est une promesse ferme : acheter ou vendre un actif à un prix décidé aujourd'hui, mais livré et payé plus tard. Personne ne peut se rétracter, quoi qu'il arrive entre-temps.",
    en: "A forward or a future is a firm promise: buy or sell an asset at a price decided today, but delivered and paid later. Neither side can back out, whatever happens in between.",
  },
  definition: {
    fr: "Un forward est un contrat bilatéral de gré à gré (négocié directement entre deux parties) par lequel l'acheteur (position longue) s'engage à acheter, et le vendeur (position courte) à vendre, une quantité donnée d'un sous-jacent à une date future T, à un prix K fixé aujourd'hui. Un future est l'équivalent standardisé et coté sur un marché organisé, avec règlement quotidien des gains et pertes (voir la notion suivante pour le détail des différences).",
    en: "A forward is a bilateral over-the-counter contract in which the buyer (long position) commits to buying, and the seller (short position) to selling, a given quantity of an underlying at a future date T, at a price K fixed today. A future is the standardized, exchange-traded equivalent, with daily settlement of gains and losses (see the next concept for the detailed differences).",
  },
  utility: {
    fr: "Ces contrats permettent de fixer aujourd'hui le prix d'une transaction future : pour se couvrir contre une variation de prix qu'on ne contrôle pas, ou pour spéculer sur la direction du marché sans détenir l'actif.",
    en: "These contracts let you lock in today the price of a future transaction: to hedge against a price move you do not control, or to speculate on market direction without holding the asset.",
  },
  example: {
    fr: "Une compagnie aérienne sait qu'elle devra acheter 1 000 000 de gallons de kérosène dans 6 mois. Plutôt que de subir le prix du marché à cette date, elle prend une position longue sur un forward kérosène à K = 2,40 USD/gallon : dans 6 mois, elle achètera à 2,40 USD quel que soit le prix spot réel.",
    en: "An airline knows it will need to buy 1,000,000 gallons of jet fuel in 6 months. Rather than face whatever the market price is then, it takes a long position on a jet-fuel forward at K = USD 2.40/gallon: in 6 months, it will buy at USD 2.40 regardless of the actual spot price.",
  },
  alternativeExplanation: {
    fr: "Imaginez une réservation à prix garanti : vous signez aujourd'hui un accord pour payer un prix fixe dans 6 mois, que ce bien ait entre-temps augmenté ou baissé de valeur. Contrairement à une option, vous n'avez pas le choix de renoncer : c'est un engagement ferme des deux côtés, pas juste un droit.",
    en: "Think of it as a guaranteed-price booking: you sign an agreement today to pay a fixed price in 6 months, whether that good has gone up or down in value by then. Unlike an option, you have no right to walk away: it is a firm commitment on both sides, not just a right.",
  },
  formula: {
    latex: "\\text{Payoff}_{\\text{long}} = S_T - K \\quad ; \\quad \\text{Payoff}_{\\text{court}} = K - S_T",
    variables: [
      { symbol: "S_T", description: { fr: "Prix spot du sous-jacent à l'échéance T", en: "Spot price of the underlying at maturity T" } },
      { symbol: "K", description: { fr: "Prix de livraison (prix forward) fixé dans le contrat", en: "Delivery price (forward price) fixed in the contract" } },
    ],
    assumptions: {
      fr: "Aucune prime n'est payée à la conclusion du contrat (contrairement à une option) ; le payoff est le profit ou la perte totale de la position, par unité de sous-jacent.",
      en: "No premium is paid at inception (unlike an option); the payoff is the total profit or loss of the position, per unit of underlying.",
    },
    units: {
      fr: "Dans la devise du contrat, par unité de sous-jacent (ex. USD par gallon, EUR par action).",
      en: "In the contract's currency, per unit of underlying (e.g. USD per gallon, EUR per share).",
    },
    example: {
      fr: "Position longue, K = 2,40 USD, S_T = 2,65 USD : Payoff = 2,65 − 2,40 = +0,25 USD par gallon (gain).",
      en: "Long position, K = USD 2.40, S_T = USD 2.65: Payoff = 2.65 − 2.40 = +USD 0.25 per gallon (gain).",
    },
  },
  calculation: {
    fr: "1) Identifier la position (longue ou courte) et le prix de livraison K. 2) Observer (ou simuler) le prix spot S_T à l'échéance. 3) Position longue : Payoff = S_T − K. Position courte : Payoff = K − S_T. 4) Multiplier par la quantité de sous-jacent pour obtenir le gain ou la perte totale.",
    en: "1) Identify the position (long or short) and the delivery price K. 2) Observe (or simulate) the spot price S_T at maturity. 3) Long position: Payoff = S_T − K. Short position: Payoff = K − S_T. 4) Multiply by the underlying quantity to get the total gain or loss.",
  },
  interpretation: {
    fr: "Une position longue gagne si le prix monte au-dessus de K, et perd s'il descend en dessous : c'est un pari symétrique sur la hausse. Une position courte gagne si le prix baisse sous K. Contrairement à une option, il n'y a pas de plancher : les pertes peuvent être aussi importantes que les gains, dans les deux sens.",
    en: "A long position gains if the price rises above K, and loses if it falls below: it is a symmetric bet on a rise. A short position gains if the price falls below K. Unlike an option, there is no floor: losses can be as large as gains, in either direction.",
  },
  pitfalls: {
    fr: "Confondre payoff et profit d'une option : pour un forward, il n'y a pas de prime à soustraire, le payoff EST le profit. Autre piège fréquent : inverser long et court, ou oublier que le payoff peut être négatif (ce n'est pas un droit qu'on exerce seulement si c'est avantageux, c'est une obligation).",
    en: "Confusing this with an option's payoff: for a forward there is no premium to subtract, the payoff IS the profit. Another common mistake: mixing up long and short, or forgetting the payoff can be negative (it is not a right exercised only when favorable, it is an obligation).",
  },
  keyPoints: {
    fr: [
      "Forward = accord bilatéral de gré à gré ; future = équivalent standardisé coté en bourse.",
      "Payoff long = S_T − K ; payoff court = K − S_T ; aucune prime payée à la conclusion.",
      "C'est un engagement ferme dans les deux sens, pas un droit : les pertes ne sont pas plafonnées.",
    ],
    en: [
      "Forward = bilateral OTC agreement; future = standardized, exchange-listed equivalent.",
      "Long payoff = S_T − K; short payoff = K − S_T; no premium paid at inception.",
      "It is a firm two-way commitment, not a right: losses are not capped.",
    ],
  },
  advancedDemonstration: {
    fr: "Le payoff d'un forward est une droite de pente +1 (position longue) ou −1 (position courte) en fonction de S_T, qui coupe l'axe des abscisses en S_T = K. C'est un jeu à somme nulle entre les deux parties (hors coûts de transaction) : le gain de l'un est exactement la perte de l'autre, Payoff_long + Payoff_court = (S_T − K) + (K − S_T) = 0. Cette linéarité est la différence structurelle majeure avec une option, dont le payoff est asymétrique (borné d'un côté) — voir M05-1.",
    en: "The payoff of a forward is a straight line of slope +1 (long) or −1 (short) as a function of S_T, crossing the x-axis at S_T = K. It is a zero-sum game between the two parties (ignoring transaction costs): one side's gain is exactly the other's loss, Payoff_long + Payoff_short = (S_T − K) + (K − S_T) = 0. This linearity is the key structural difference from an option, whose payoff is asymmetric (capped on one side) — see M05-1.",
  },
};
