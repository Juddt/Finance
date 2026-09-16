import type { LessonContent } from "@/lib/lesson-types";

export const m01TauxChange: LessonContent = {
  conceptId: "m01-taux-change",
  glossary: [
    { term: { fr: "Devise de base / devise de cotation", en: "Base currency / quote currency" }, definition: { fr: "Dans une paire X/Y, X est la devise de base (1 unité de X), Y la devise de cotation (combien d'unités de Y pour 1 X).", en: "In a pair X/Y, X is the base currency (1 unit of X), Y the quote currency (how many units of Y per 1 X)." } },
  ],
  intuition: {
    fr: "Un taux de change n'est qu'un prix comme un autre — le prix d'une devise exprimé dans une autre — mais sa notation en paire (EUR/USD) prête facilement à confusion sur qui est acheté et qui sert d'unité de mesure.",
    en: "An exchange rate is just a price like any other — the price of one currency expressed in another — but its pair notation (EUR/USD) easily creates confusion about which is being bought and which serves as the unit of measurement.",
  },
  definition: {
    fr: "Une cotation X/Y = n signifie \"1 unité de X vaut n unités de Y\" : X est la devise de base, Y la devise de cotation. Pour convertir un montant en devise de base vers la devise de cotation, on multiplie par le taux ; pour convertir dans l'autre sens, on divise.",
    en: "A quote X/Y = n means \"1 unit of X is worth n units of Y\": X is the base currency, Y the quote currency. To convert an amount from the base currency to the quote currency, multiply by the rate; to convert the other way, divide.",
  },
  utility: {
    fr: "Savoir lire une cotation sans erreur est la base de toute conversion, tout pricing de forward de change (M02) ou de parité des taux (M01-7) — une erreur de sens ici se propage à tous les calculs suivants.",
    en: "Reading a quote correctly is the basis of every conversion, every FX forward pricing (M02) or rate parity calculation (M01-7) — a directional mistake here propagates into every downstream calculation.",
  },
  example: {
    fr: "EUR/USD = 1,10 signifie que 1 EUR vaut 1,10 USD. Pour convertir 5 000 EUR en USD : 5 000 × 1,10 = 5 500 USD. Pour convertir 5 500 USD en EUR : 5 500 / 1,10 = 5 000 EUR.",
    en: "EUR/USD = 1.10 means 1 EUR is worth 1.10 USD. To convert EUR 5,000 to USD: 5,000 × 1.10 = 5,500 USD. To convert USD 5,500 to EUR: 5,500 / 1.10 = 5,000 EUR.",
  },
  alternativeExplanation: {
    fr: "Lisez toujours la paire comme une étiquette de prix : \"EUR/USD\" se lit \"le prix d'un EUR, en USD\". La devise de base (avant la barre) est toujours l'article qu'on achète ; la devise de cotation (après la barre) est toujours la monnaie qui sert à payer.",
    en: "Always read the pair like a price tag: \"EUR/USD\" reads \"the price of one EUR, in USD\". The base currency (before the slash) is always the item being priced; the quote currency (after the slash) is always the currency used to pay for it.",
  },
  formula: {
    latex: "\\text{Montant}_Y = \\text{Montant}_X \\times S_{X/Y}",
    variables: [
      { symbol: "S_{X/Y}", description: { fr: "Taux de change coté, X étant la devise de base", en: "The quoted exchange rate, with X as the base currency" } },
      { symbol: "\\text{Montant}_X", description: { fr: "Montant exprimé dans la devise de base", en: "Amount expressed in the base currency" } },
    ],
    assumptions: { fr: "Conversion directe sans frais ni écart bid/ask (voir M01-8 pour le spread).", en: "Direct conversion with no fees or bid/ask spread (see M01-8 for the spread)." },
    units: { fr: "Le taux S_X/Y est en unités de Y par unité de X.", en: "The rate S_X/Y is in units of Y per unit of X." },
    example: { fr: "Montant_EUR=5 000, S_EUR/USD=1,10 : Montant_USD = 5 500.", en: "Amount_EUR=5,000, S_EUR/USD=1.10: Amount_USD = 5,500." },
  },
  calculation: {
    fr: "1) Identifier quelle devise est la devise de base dans la cotation donnée. 2) Vérifier dans quel sens on convertit (de la base vers la cotation, ou l'inverse). 3) Multiplier par le taux si on part de la devise de base ; diviser si on part de la devise de cotation. 4) Vérifier le résultat par un ordre de grandeur (le montant converti doit être cohérent avec le sens du taux).",
    en: "1) Identify which currency is the base in the given quote. 2) Check which direction the conversion goes (from base to quote, or the reverse). 3) Multiply by the rate if starting from the base currency; divide if starting from the quote currency. 4) Sanity-check the result with an order of magnitude (the converted amount should be consistent with the rate's direction).",
  },
  interpretation: {
    fr: "Une hausse du taux X/Y signifie que X s'apprécie par rapport à Y (il faut plus d'unités de Y pour acheter 1 X) : \"EUR/USD monte\" veut dire que l'euro se renforce face au dollar, pas l'inverse — une confusion très fréquente.",
    en: "A rise in the X/Y rate means X is appreciating against Y (more units of Y are needed to buy 1 X): \"EUR/USD rising\" means the euro is strengthening against the dollar, not the reverse — a very frequent confusion.",
  },
  pitfalls: {
    fr: "Multiplier au lieu de diviser (ou l'inverse) en confondant devise de base et devise de cotation — l'erreur de conversion la plus fréquente et la plus coûteuse en pratique. Autre piège : oublier que \"le dollar s'apprécie face à l'euro\" et \"EUR/USD baisse\" décrivent le même phénomène, formulé dans les deux sens.",
    en: "Multiplying instead of dividing (or vice versa) by confusing base and quote currency — the most frequent and costly conversion mistake in practice. Another trap: forgetting that \"the dollar strengthens against the euro\" and \"EUR/USD falls\" describe the same phenomenon, phrased in opposite directions.",
  },
  keyPoints: {
    fr: [
      "X/Y = n signifie \"1 X vaut n Y\" : X est la devise de base, Y la devise de cotation.",
      "Convertir de X vers Y : multiplier par le taux. Convertir de Y vers X : diviser.",
      "Une hausse de X/Y signifie que X s'apprécie face à Y.",
    ],
    en: [
      "X/Y = n means \"1 X is worth n Y\": X is the base currency, Y the quote currency.",
      "Converting from X to Y: multiply by the rate. Converting from Y to X: divide.",
      "A rise in X/Y means X is appreciating against Y.",
    ],
  },
  advancedDemonstration: {
    fr: "Le risque de change apparaît dès qu'un flux futur est connu dans une devise mais doit être converti dans une autre à une date incertaine : c'est exactement le problème résolu par la couverture au forward (M02-5) et sous-tendu par la parité des taux d'intérêt (M01-7), qui relie mathématiquement le taux spot d'aujourd'hui au taux forward coté par les banques pour n'importe quelle échéance future.",
    en: "FX risk appears as soon as a future flow is known in one currency but must be converted into another at an uncertain date: this is exactly the problem solved by forward hedging (M02-5) and underpinned by interest rate parity (M01-7), which mathematically ties today's spot rate to the forward rate quoted by banks for any future maturity.",
  },
};
