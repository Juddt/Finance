import type { LessonContent } from "@/lib/lesson-types";

export const m02CouvertureForward: LessonContent = {
  conceptId: "m02-couverture-forward",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion suppose que vous savez déjà ce qu'est un forward (position longue/courte, prix de livraison) et ce qu'est un risque de change.",
      en: "This concept assumes you already know what a forward is (long/short position, delivery price) and what FX risk is.",
    },
    conceptIds: ["m02-forward-future-definitions", "m02-forward-contract-value", "m01-taux-change"],
  },
  glossary: [
    {
      term: { fr: "Exposition", en: "Exposure" },
      definition: {
        fr: "Le risque financier subi parce qu'une opération future se fera dans une devise ou à un prix encore incertain aujourd'hui.",
        en: "The financial risk incurred because a future transaction will happen at a currency rate or price that is still uncertain today.",
      },
    },
    {
      term: { fr: "Se couvrir (hedger)", en: "To hedge" },
      definition: {
        fr: "Prendre une position qui compense un risque déjà présent, dans le seul but de réduire l'incertitude — pas de gagner plus.",
        en: "Taking a position that offsets a risk you already carry, purely to reduce uncertainty — not to make extra profit.",
      },
    },
  ],
  intuition: {
    fr: "Un forward permet de fixer aujourd'hui le prix d'une opération qui aura lieu dans le futur, pour ne plus dépendre de ce qui se passera d'ici là.",
    en: "A forward lets you fix today the price of a transaction that will happen in the future, so you no longer depend on what happens in between.",
  },
  definition: {
    fr: "Se couvrir avec un forward consiste à prendre une position forward opposée à son exposition naturelle : les gains ou pertes sur le forward compensent exactement les pertes ou gains sur l'exposition réelle, de sorte que le prix final est fixé dès aujourd'hui.",
    en: "Hedging with a forward means taking a forward position opposite to your natural exposure: gains or losses on the forward exactly offset losses or gains on the real exposure, so the final price is locked in today.",
  },
  utility: {
    fr: "Utile pour toute entreprise qui sait qu'elle va recevoir ou payer un montant dans une devise (ou à un prix) qui peut bouger d'ici là, et qui préfère la certitude à un potentiel gain incertain.",
    en: "Useful for any company that knows it will receive or pay an amount in a currency (or at a price) that may move before then, and prefers certainty to an uncertain potential gain.",
  },
  example: {
    fr: "Une entreprise française exportatrice va recevoir 1 000 000 USD dans 3 mois. Si l'euro s'apprécie d'ici là, elle recevra moins d'euros une fois convertis. Pour supprimer ce risque, elle vend aujourd'hui ses 1 000 000 USD à terme, à un prix fixé F0 : dans 3 mois, quel que soit le taux spot, elle échangera ses dollars contre le même montant d'euros.",
    en: "A French exporter will receive USD 1,000,000 in 3 months. If the euro appreciates by then, it will receive fewer euros once converted. To remove that risk, it sells its USD 1,000,000 forward today, at a fixed price F0: in 3 months, whatever the spot rate is, it will exchange its dollars for the same amount of euros.",
  },
  alternativeExplanation: {
    fr: "Voyez le forward comme une assurance sur un prix : vous acceptez de renoncer à un éventuel meilleur taux futur, en échange de la certitude de connaître aujourd'hui le montant exact que vous recevrez ou paierez. Ce n'est pas un pari pour gagner plus, c'est un outil pour ne plus avoir à s'inquiéter.",
    en: "Think of the forward as price insurance: you give up a potentially better future rate, in exchange for knowing today the exact amount you will receive or pay. It is not a bet to make more money, it is a tool to stop worrying.",
  },
  formula: {
    latex: "\\text{Montant}_{\\text{EUR}} = \\text{Montant}_{\\text{USD}} \\times F_0",
    variables: [
      { symbol: "\\text{Montant}_{\\text{EUR}}", description: { fr: "Montant garanti en euros à l'échéance", en: "Guaranteed euro amount at maturity" } },
      { symbol: "\\text{Montant}_{\\text{USD}}", description: { fr: "Montant en dollars à convertir (l'exposition)", en: "Dollar amount to convert (the exposure)" } },
      { symbol: "F_0", description: { fr: "Prix de change à terme fixé aujourd'hui (en EUR par USD)", en: "Forward exchange rate fixed today (in EUR per USD)" } },
    ],
    assumptions: {
      fr: "Le montant et la date de l'exposition sont connus avec certitude ; pas de risque de contrepartie sur le forward ; F0 est déjà coté par la banque (il résulte de la parité des taux, voir M01-7).",
      en: "The exposure's amount and date are known with certainty; no counterparty risk on the forward; F0 is already quoted by the bank (it results from interest rate parity, see M01-7).",
    },
    units: {
      fr: "F0 est un taux de change (EUR par USD, ex. 0,92) ; les montants sont dans leurs devises respectives.",
      en: "F0 is an exchange rate (EUR per USD, e.g. 0.92); amounts are in their respective currencies.",
    },
    example: {
      fr: "Avec Montant_USD = 1 000 000 et F0 = 0,92 : Montant_EUR = 1 000 000 × 0,92 = 920 000 EUR, garantis.",
      en: "With Amount_USD = 1,000,000 and F0 = 0.92: Amount_EUR = 1,000,000 × 0.92 = 920,000 EUR, guaranteed.",
    },
  },
  calculation: {
    fr: "1) Identifier le montant et la devise de l'exposition future (ex. recevoir 1 000 000 USD dans 3 mois). 2) Déterminer le sens de la couverture : si vous allez RECEVOIR une devise étrangère, vous la VENDEZ à terme ; si vous allez la PAYER, vous l'ACHETEZ à terme. 3) Obtenir le prix forward F0 coté par la banque pour cette échéance. 4) Calculer le montant garanti : Montant_EUR = Montant_USD × F0. 5) À l'échéance, l'échange se fait à F0, quel que soit le taux spot du moment.",
    en: "1) Identify the amount and currency of the future exposure (e.g. receiving USD 1,000,000 in 3 months). 2) Determine the hedge direction: if you will RECEIVE a foreign currency, you SELL it forward; if you will PAY it, you BUY it forward. 3) Get the forward price F0 quoted by the bank for that maturity. 4) Compute the guaranteed amount: Amount_EUR = Amount_USD × F0. 5) At maturity, the exchange happens at F0, whatever the spot rate is then.",
  },
  interpretation: {
    fr: "Le montant en euros est garanti, ni plus ni moins. Si le taux spot final est plus favorable que F0, l'entreprise ne profite pas de cet avantage — ce n'est pas une perte comptable, juste un manque à gagner par rapport à ce qu'elle aurait eu sans se couvrir.",
    en: "The euro amount is guaranteed, no more and no less. If the final spot rate turns out more favorable than F0, the company does not benefit from it — this is not an accounting loss, just a missed opportunity compared to not hedging.",
  },
  pitfalls: {
    fr: "Confondre « se couvrir » et « spéculer » : un forward de couverture réduit le risque, il ne cherche pas à gagner plus que le marché. Autre piège : le risque de base, qui apparaît quand le montant ou la date réels de l'opération diffèrent de ce qui a été couvert par le forward.",
    en: "Confusing \"hedging\" with \"speculating\": a hedging forward reduces risk, it does not try to beat the market. Another trap: basis risk, which appears when the real amount or date of the transaction differs from what the forward covered.",
  },
  keyPoints: {
    fr: [
      "Se couvrir = prendre une position forward opposée à l'exposition, pour fixer aujourd'hui le prix futur.",
      "Le montant final dans la devise domestique est garanti, indépendamment du taux spot à l'échéance.",
      "Le risque de base apparaît si le montant ou la date réels diffèrent du contrat forward souscrit.",
    ],
    en: [
      "Hedging = taking a forward position opposite to the exposure, to lock in today's price for a future date.",
      "The final domestic-currency amount is guaranteed, regardless of the spot rate at maturity.",
      "Basis risk appears if the real amount or date differs from the forward contract taken out.",
    ],
  },
  advancedDemonstration: {
    fr: "Le prix forward F0 lui-même n'est pas choisi librement : il découle de la parité des taux d'intérêt couverte (voir M01-7), F0 = S0 × (1 + r_dom × T) / (1 + r_étr × T) en composition simple, où S0 est le taux spot actuel et r_dom, r_étr les taux sans risque domestique et étranger. Le risque de base peut se chiffrer : si l'entreprise a couvert 1 000 000 USD mais ne reçoit finalement que 950 000 USD, 50 000 USD restent non couverts et exposés au taux spot du jour — ce qui peut faire perdre une partie du bénéfice de la couverture si le spot a fortement bougé. En pratique, les trésoriers ajustent parfois la couverture (roll, sur-couverture partielle) pour limiter ce résidu.",
    en: "The forward price F0 itself is not chosen freely: it follows from covered interest rate parity (see M01-7), F0 = S0 × (1 + r_dom × T) / (1 + r_for × T) under simple compounding, where S0 is the current spot rate and r_dom, r_for the domestic and foreign risk-free rates. Basis risk can be quantified: if the company hedged USD 1,000,000 but ultimately receives only USD 950,000, USD 50,000 remain uncovered and exposed to that day's spot rate — which can erode part of the hedge's benefit if the spot has moved a lot. In practice, treasurers sometimes adjust the hedge (rolling, partial over-hedging) to limit this residual.",
  },
};
