import type { LessonContent } from "@/lib/lesson-types";

export const m01VenteDecouvert: LessonContent = {
  conceptId: "m01-vente-decouvert",
  prerequisiteReminder: {
    text: {
      fr: "Il est utile de connaître la notion de marché organisé et de position \"courte\" déjà rencontrée pour les forwards.",
      en: "It helps to know the concept of an organized market and a \"short\" position already seen for forwards.",
    },
    conceptIds: ["m01-classes-actifs", "m02-forward-future-definitions"],
  },
  glossary: [
    { term: { fr: "Frais d'emprunt de titres", en: "Stock borrow fee" }, definition: { fr: "Le coût payé au prêteur des titres, proportionnel à la durée et à la difficulté d'emprunter ce titre.", en: "The cost paid to the securities lender, proportional to the duration and the difficulty of borrowing that stock." } },
  ],
  intuition: {
    fr: "Vendre à découvert, c'est parier sur une baisse de prix en vendant un titre qu'on ne possède pas encore : on l'emprunte, on le vend, et on espère le racheter moins cher plus tard pour le rendre à son propriétaire, empochant la différence.",
    en: "Short selling is betting on a price fall by selling a security you don't yet own: you borrow it, sell it, and hope to buy it back cheaper later to return it to its owner, pocketing the difference.",
  },
  definition: {
    fr: "La vente à découvert consiste à (1) emprunter un titre auprès d'un prêteur (moyennant des frais), (2) le vendre immédiatement sur le marché, (3) plus tard, racheter ce même titre sur le marché, et (4) le restituer au prêteur. Le profit est la différence entre le prix de vente initial et le prix de rachat, diminuée des frais d'emprunt et de tout dividende versé entre-temps (dû au prêteur).",
    en: "Short selling consists of (1) borrowing a security from a lender (for a fee), (2) immediately selling it in the market, (3) later buying back that same security in the market, and (4) returning it to the lender. The profit is the difference between the initial sale price and the buy-back price, minus the borrow fee and any dividend paid in between (owed to the lender).",
  },
  utility: {
    fr: "La vente à découvert permet de profiter d'une baisse anticipée d'un titre, ou de couvrir un portefeuille contre une baisse de marché, sans attendre de posséder déjà le titre concerné.",
    en: "Short selling lets you profit from an anticipated decline in a security, or hedge a portfolio against a market fall, without needing to already own the security involved.",
  },
  example: {
    fr: "Un investisseur emprunte 1 000 actions à 50 EUR et les vend immédiatement (encaisse 50 000 EUR). Trois mois plus tard, le titre a baissé à 42 EUR : il rachète 1 000 actions pour 42 000 EUR et les restitue. Profit brut = 50 000 − 42 000 = 8 000 EUR, dont il faut déduire les frais d'emprunt payés sur la période.",
    en: "An investor borrows 1,000 shares at EUR 50 and immediately sells them (collects EUR 50,000). Three months later, the stock has fallen to EUR 42: they buy back 1,000 shares for EUR 42,000 and return them. Gross profit = 50,000 − 42,000 = EUR 8,000, from which the borrow fees paid over the period must be deducted.",
  },
  alternativeExplanation: {
    fr: "Pensez à emprunter le vélo d'un voisin pour le revendre tout de suite, en pariant que son prix de marché va baisser d'ici à ce que vous deviez lui rendre un vélo identique : vous rachetez alors un vélo moins cher pour le lui restituer, et gardez la différence — mais si le prix monte au lieu de baisser, vous devrez payer plus cher pour racheter ce même vélo, quel que soit le prix.",
    en: "Think of borrowing a neighbor's bike to resell it immediately, betting its market price will fall before you must return an identical bike: you then buy back a cheaper bike to return it, and keep the difference — but if the price rises instead of falling, you'll have to pay more to buy back that same bike, whatever the price.",
  },
  formula: {
    latex: "\\text{Profit} = (P_{\\text{vente}} - P_{\\text{rachat}}) \\times Q - \\text{Frais d'emprunt} - \\text{Dividendes dus}",
    variables: [
      { symbol: "P_{\\text{vente}}", description: { fr: "Prix de vente initial du titre emprunté", en: "Initial sale price of the borrowed security" } },
      { symbol: "P_{\\text{rachat}}", description: { fr: "Prix de rachat du titre pour le restituer", en: "Buy-back price of the security to return it" } },
      { symbol: "Q", description: { fr: "Quantité de titres vendus à découvert", en: "Quantity of shares sold short" } },
    ],
    assumptions: { fr: "Tout dividende versé par le titre pendant la période d'emprunt est dû au prêteur, pas gardé par le vendeur à découvert.", en: "Any dividend paid by the security during the borrow period is owed to the lender, not kept by the short seller." },
    units: { fr: "Profit dans la devise du titre.", en: "Profit in the security's currency." },
    example: { fr: "P_vente=50, P_rachat=42, Q=1000 : Profit brut = (50−42)×1000 = 8 000, avant frais.", en: "P_sell=50, P_buyback=42, Q=1000: Gross profit = (50−42)×1000 = 8,000, before fees." },
  },
  calculation: {
    fr: "1) Calculer le produit de la vente initiale : P_vente × Q. 2) Calculer le coût du rachat : P_rachat × Q. 3) Soustraire : (P_vente − P_rachat) × Q. 4) Déduire les frais d'emprunt cumulés et tout dividende versé pendant la période pour obtenir le profit net.",
    en: "1) Compute the initial sale proceeds: P_sell × Q. 2) Compute the buy-back cost: P_buyback × Q. 3) Subtract: (P_sell − P_buyback) × Q. 4) Deduct cumulative borrow fees and any dividend paid during the period to get the net profit.",
  },
  interpretation: {
    fr: "Contrairement à une position longue, où la perte maximale est limitée à la mise initiale (le prix ne peut pas descendre sous zéro), la perte d'une vente à découvert est théoriquement illimitée : le prix de rachat peut monter sans limite connue.",
    en: "Unlike a long position, where the maximum loss is limited to the initial stake (the price can't fall below zero), a short sale's loss is theoretically unlimited: the buy-back price can rise with no known ceiling.",
  },
  pitfalls: {
    fr: "Sous-estimer le risque de perte illimitée, souvent aggravé par un \"short squeeze\" (une hausse brutale forçant de nombreux vendeurs à découvert à racheter en urgence, ce qui accélère encore la hausse). Autre piège : oublier les frais d'emprunt et les dividendes dus, qui érodent le profit même quand le pari sur la baisse est gagnant.",
    en: "Underestimating the unlimited-loss risk, often worsened by a \"short squeeze\" (a sharp rise forcing many short sellers to urgently buy back, further accelerating the rise). Another trap: forgetting borrow fees and dividends owed, which erode profit even when the bet on the decline is correct.",
  },
  keyPoints: {
    fr: [
      "Vente à découvert = emprunter, vendre, racheter plus tard, restituer — un pari sur la baisse.",
      "Profit = (Prix de vente − Prix de rachat) × Quantité, moins frais d'emprunt et dividendes dus.",
      "Contrairement à une position longue, la perte potentielle est théoriquement illimitée.",
    ],
    en: [
      "Short selling = borrow, sell, buy back later, return — a bet on a decline.",
      "Profit = (Sale price − Buy-back price) × Quantity, minus borrow fees and dividends owed.",
      "Unlike a long position, the potential loss is theoretically unlimited.",
    ],
  },
  advancedDemonstration: {
    fr: "La vente à découvert est aussi la brique de base de plusieurs stratégies vues ailleurs dans ce cours : le cash-and-carry inverse (M02-2, quand le forward est sous-évalué), la vente à découvert de l'actif dans la preuve de la parité call-put (M05-3), ou encore la jambe courte d'un spread d'options (M05-4). Sur le plan réglementaire, certains marchés imposent une règle de \"locate\" (obligation de confirmer que le titre est réellement disponible à l'emprunt avant de vendre à découvert) et peuvent suspendre temporairement la vente à découvert sur un titre en cas de chute désordonnée (\"circuit breakers\"), pour limiter les spirales de panique.",
    en: "Short selling is also the building block of several strategies seen elsewhere in this course: reverse cash-and-carry (M02-2, when the forward is underpriced), shorting the asset in the put-call parity proof (M05-3), or the short leg of an options spread (M05-4). On the regulatory side, some markets impose a \"locate\" rule (an obligation to confirm the security is actually available to borrow before shorting) and can temporarily suspend short selling on a stock during a disorderly fall (\"circuit breakers\"), to limit panic spirals.",
  },
};
