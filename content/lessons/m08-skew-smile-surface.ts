import type { LessonContent } from "@/lib/lesson-types";

export const m08SkewSmileSurface: LessonContent = {
  conceptId: "m08-skew-smile-surface",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est la volatilité implicite et comment elle s'extrait d'un prix d'option.",
      en: "You need to know what implied volatility is and how it's extracted from an option price.",
    },
    conceptIds: ["m08-volatilite-implicite"],
  },
  glossary: [
    { term: { fr: "Moneyness", en: "Moneyness" }, definition: { fr: "La position relative du strike par rapport au spot ou au forward (K/S0 ou K/F0), utilisée pour comparer des options sur une échelle indépendante du niveau absolu du prix.", en: "The strike's relative position versus the spot or forward (K/S0 or K/F0), used to compare options on a scale independent of the absolute price level." } },
  ],
  intuition: {
    fr: "Si le modèle de Black-Scholes était parfaitement exact, la volatilité implicite serait la même pour toutes les options sur un même sous-jacent, quels que soient leur strike et leur échéance. En réalité, elle varie systématiquement — et cette variation, loin d'être un défaut, contient une information précieuse sur ce que le marché anticipe réellement.",
    en: "If the Black-Scholes model were perfectly exact, implied volatility would be the same for all options on a given underlying, whatever their strike and maturity. In reality, it varies systematically — and that variation, far from being a flaw, carries valuable information about what the market actually expects.",
  },
  definition: {
    fr: "Le skew désigne la variation de volatilité implicite selon le strike, typiquement décroissante sur les actions (les puts OTM ont une IV plus élevée que les calls OTM). Le smile désigne une forme en U, plus symétrique, typique du marché des changes. La structure par terme désigne la variation de l'IV ATM selon l'échéance. La surface de volatilité combine ces deux dimensions (strike × échéance) en une seule nappe.",
    en: "Skew refers to implied volatility's variation by strike, typically downward-sloping for equities (OTM puts have higher IV than OTM calls). Smile refers to a U-shape, more symmetric, typical of FX markets. The term structure refers to ATM IV's variation by maturity. The volatility surface combines both dimensions (strike × maturity) into a single sheet.",
  },
  utility: {
    fr: "Toute activité de trading ou de gestion de risque sérieuse sur options doit tenir compte de la surface complète, pas d'une volatilité unique : un desk qui ignore le skew mispriera systématiquement les options loin de la monnaie, avec des conséquences potentiellement importantes sur un livre de taille significative.",
    en: "Any serious options trading or risk-management activity must account for the full surface, not a single volatility: a desk that ignores skew will systematically mis-price options far from the money, with potentially significant consequences on a sizeable book.",
  },
  example: {
    fr: "Sur une action, l'IV à 3 mois peut être de 25% pour un put à 80% du spot, 20% pour l'option ATM, et 18% pour un call à 120% du spot — une pente descendante typique du skew equity. Sur une paire de devises, l'IV peut être de 12% pour un strike loin dans les deux sens et 10% à la monnaie, dessinant un smile symétrique en U.",
    en: "On a stock, the 3-month IV might be 25% for a put at 80% of spot, 20% for the ATM option, and 18% for a call at 120% of spot — a typical downward equity skew slope. On a currency pair, IV might be 12% for a strike far in either direction and 10% at the money, drawing a symmetric U-shaped smile.",
  },
  alternativeExplanation: {
    fr: "Pensez à la surface de volatilité comme à une carte topographique : l'altitude en chaque point représente le niveau de volatilité implicite pour ce couple (strike, échéance) précis. Le skew, c'est la pente de cette carte dans la direction du strike ; la structure par terme, c'est la pente dans la direction de l'échéance ; le smile, c'est une vallée qui remonte des deux côtés plutôt qu'une pente continue.",
    en: "Think of the volatility surface as a topographic map: the elevation at each point represents the implied volatility level for that specific (strike, maturity) pair. Skew is this map's slope in the strike direction; the term structure is the slope in the maturity direction; a smile is a valley that rises on both sides rather than a continuous slope.",
  },
  formula: {
    latex: "\\text{IV}(K) \\approx \\text{IV}_{\\text{ATM}} + \\beta \\times \\ln(K/F_0)",
    variables: [
      { symbol: "\\text{IV}_{\\text{ATM}}", description: { fr: "Volatilité implicite à la monnaie forward", en: "At-the-forward-money implied volatility" } },
      { symbol: "\\beta", description: { fr: "Pente du skew (négative pour un skew equity typique)", en: "The skew's slope (negative for a typical equity skew)" } },
      { symbol: "\\ln(K/F_0)", description: { fr: "Log-moneyness du strike par rapport au forward", en: "The strike's log-moneyness relative to the forward" } },
    ],
    assumptions: { fr: "Approximation linéaire simple, valable localement autour de la monnaie ; les vraies surfaces sont généralement plus complexes (convexité, asymétrie).", en: "Simple linear approximation, valid locally around the money; real surfaces are generally more complex (convexity, asymmetry)." },
    units: { fr: "IV en proportion annuelle ; β sans dimension.", en: "IV as an annual proportion; β dimensionless." },
    example: { fr: "IV_ATM=20%, β=−10%, K/F0=0,9 : IV ≈ 20% − 10%×ln(0,9) ≈ 20%+1,05% ≈ 21,05%.", en: "IV_ATM=20%, β=−10%, K/F0=0.9: IV ≈ 20% − 10%×ln(0.9) ≈ 20%+1.05% ≈ 21.05%." },
  },
  calculation: {
    fr: "1) Extraire la volatilité implicite de plusieurs options de même échéance mais de strikes différents (voir M08-2). 2) Tracer IV en fonction du strike (ou du log-moneyness). 3) Observer la pente locale autour de la monnaie pour caractériser le skew. 4) Répéter pour différentes échéances pour construire la structure par terme, puis la surface complète.",
    en: "1) Extract implied volatility from several options of the same maturity but different strikes (see M08-2). 2) Plot IV against strike (or log-moneyness). 3) Observe the local slope around the money to characterize the skew. 4) Repeat for different maturities to build the term structure, then the full surface.",
  },
  interpretation: {
    fr: "Un skew equity négatif (puts OTM plus chers) reflète en partie une demande de protection contre les baisses (les investisseurs paient une prime pour cette assurance) et en partie l'effet de levier (une baisse du prix de l'action augmente mécaniquement son levier financier, donc son risque perçu). Un smile FX symétrique reflète le caractère \"à deux sens\" du risque de change, où aucune des deux devises n'est structurellement \"la valeur refuge\".",
    en: "A negative equity skew (pricier OTM puts) partly reflects demand for downside protection (investors pay a premium for that insurance) and partly the leverage effect (a stock price decline mechanically increases its financial leverage, hence its perceived risk). A symmetric FX smile reflects the \"two-way\" nature of FX risk, where neither currency is structurally \"the safe haven\".",
  },
  pitfalls: {
    fr: "Utiliser une volatilité unique (généralement l'ATM) pour pricer une option loin de la monnaie : c'est une source d'erreur systématique dès que le skew est significatif. Autre piège : confondre le skew (asymétrie en strike) avec la structure par terme (variation en échéance) — deux dimensions indépendantes de la même surface.",
    en: "Using a single (usually ATM) volatility to price an option far from the money: a source of systematic error whenever skew is significant. Another trap: confusing skew (strike asymmetry) with the term structure (maturity variation) — two independent dimensions of the same surface.",
  },
  keyPoints: {
    fr: [
      "Skew : IV varie avec le strike, typiquement décroissante sur les actions (protection à la baisse + levier).",
      "Smile : forme en U plus symétrique, typique du marché des changes.",
      "La surface de volatilité complète combine strike et échéance en une seule nappe.",
    ],
    en: [
      "Skew: IV varies with strike, typically downward-sloping for equities (downside protection + leverage).",
      "Smile: a more symmetric U-shape, typical of FX markets.",
      "The full volatility surface combines strike and maturity into a single sheet.",
    ],
  },
  advancedDemonstration: {
    fr: "La construction d'une surface de volatilité arbitrage-free (sans opportunité d'arbitrage calendaire ni de \"butterfly\") est un exercice technique non trivial : elle doit respecter des contraintes de convexité en strike (le prix d'un butterfly doit rester positif) et de monotonie en échéance sur la variance totale (σ²×T doit être croissante avec T pour éviter un arbitrage calendaire). Des paramétrisations comme SVI (Stochastic Volatility Inspired, Gatheral) sont largement utilisées en pratique pour interpoler/extrapoler une surface lisse et arbitrage-free à partir d'un nombre limité de cotations de marché.",
    en: "Building an arbitrage-free volatility surface (no calendar or \"butterfly\" arbitrage) is a non-trivial technical exercise: it must respect strike convexity constraints (a butterfly's price must stay positive) and maturity monotonicity constraints on total variance (σ²×T must be increasing in T to avoid calendar arbitrage). Parametrizations like SVI (Stochastic Volatility Inspired, Gatheral) are widely used in practice to interpolate/extrapolate a smooth, arbitrage-free surface from a limited number of market quotes.",
  },
};
