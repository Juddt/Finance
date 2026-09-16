import type { LessonContent } from "@/lib/lesson-types";

export const m07GreeksSecondOrdre: LessonContent = {
  conceptId: "m07-greeks-second-ordre",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les Greeks de premier ordre, en particulier Delta et Vega.",
      en: "You need to know the first-order Greeks, particularly Delta and Vega.",
    },
    conceptIds: ["m07-greeks-premier-ordre"],
  },
  glossary: [
    { term: { fr: "Volatilité implicite", en: "Implied volatility" }, definition: { fr: "La volatilité qui, injectée dans Black-Scholes, redonne exactement le prix coté sur le marché — voir le smile de volatilité en M08.", en: "The volatility that, plugged into Black-Scholes, exactly reproduces the market-quoted price — see the volatility smile in M08." } },
  ],
  intuition: {
    fr: "Les Greeks de premier ordre supposent que la volatilité elle-même ne bouge jamais. En réalité, elle varie constamment, et sa relation avec le prix du sous-jacent (le \"smile\") change aussi. Vanna et Volga capturent ces effets croisés, au-delà de ce que Delta, Gamma et Vega peuvent mesurer seuls.",
    en: "First-order Greeks assume volatility itself never moves. In reality, it constantly changes, and its relationship with the underlying's price (the \"smile\") changes too. Vanna and Volga capture these cross effects, beyond what Delta, Gamma and Vega alone can measure.",
  },
  definition: {
    fr: "Vanna = ∂²V/∂S∂σ mesure comment le Delta change quand la volatilité bouge (ou, de façon équivalente, comment le Vega change quand le sous-jacent bouge). Volga (ou Vomma) = ∂²V/∂σ² mesure comment le Vega lui-même change quand la volatilité bouge — la \"convexité\" du prix par rapport à la volatilité.",
    en: "Vanna = ∂²V/∂S∂σ measures how Delta changes when volatility moves (or, equivalently, how Vega changes when the underlying moves). Volga (or Vomma) = ∂²V/∂σ² measures how Vega itself changes when volatility moves — the price's \"convexity\" with respect to volatility.",
  },
  utility: {
    fr: "Ces sensibilités de second ordre sont essentielles pour gérer un livre d'options complexe (produits structurés, options exotiques) où l'exposition à la FORME de la courbe de volatilité (le smile) compte autant que le niveau moyen de volatilité — au-delà de ce que le Vega seul peut capturer.",
    en: "These second-order sensitivities are essential for managing a complex options book (structured products, exotic options) where exposure to the SHAPE of the volatility curve (the smile) matters as much as the average volatility level — beyond what Vega alone can capture.",
  },
  example: {
    fr: "Une position a un Vanna positif important : si la volatilité implicite grimpe (souvent lors d'une baisse de marché, phénomène connu), son Delta va changer de façon significative même sans que le sous-jacent bouge — un risque caché que le Delta et le Gamma seuls ne révèlent pas, mais que le Vanna quantifie précisément.",
    en: "A position has a large positive Vanna: if implied volatility spikes (often during a market decline, a well-known phenomenon), its Delta will change significantly even without the underlying moving — a hidden risk that Delta and Gamma alone don't reveal, but that Vanna precisely quantifies.",
  },
  alternativeExplanation: {
    fr: "Si le Vega est \"la sensibilité au niveau de l'eau\" (la volatilité globale), le Vanna est \"comment ce niveau d'eau affecte différemment les bateaux selon leur position\" (comment la sensibilité au sous-jacent change avec la marée de volatilité), et le Volga est \"comment le niveau d'eau lui-même devient plus ou moins volatil\" — un effet de second ordre sur un effet de premier ordre, comme la convexité obligataire (M03-4) l'était pour la duration.",
    en: "If Vega is \"sensitivity to the water level\" (overall volatility), Vanna is \"how that water level affects different boats depending on their position\" (how underlying-sensitivity changes with the volatility tide), and Volga is \"how the water level itself becomes more or less volatile\" — a second-order effect on a first-order effect, much like bond convexity (M03-4) was for duration.",
  },
  formula: {
    latex: "\\text{Vanna} = \\frac{\\partial \\text{Vega}}{\\partial S} = -N'(d_1)\\frac{d_2}{\\sigma}",
    variables: [
      { symbol: "d_1, d_2", description: { fr: "Les mêmes d1, d2 que dans la formule de Black-Scholes", en: "The same d1, d2 as in the Black-Scholes formula" } },
      { symbol: "N'(d_1)", description: { fr: "Densité normale évaluée en d1", en: "Normal density evaluated at d1" } },
    ],
    assumptions: { fr: "Formule pour une option vanille sous Black-Scholes ; identique pour call et put (comme Gamma et Vega).", en: "Formula for a vanilla option under Black-Scholes; identical for call and put (like Gamma and Vega)." },
    units: { fr: "Unité de Delta par point de volatilité.", en: "Units of Delta per volatility point." },
    example: { fr: "d1=0,25, d2=0,05, σ=20% : Vanna = −0,3867×0,05/0,20 ≈ −0,097.", en: "d1=0.25, d2=0.05, σ=20%: Vanna = −0.3867×0.05/0.20 ≈ −0.097." },
  },
  calculation: {
    fr: "1) Calculer d1, d2 comme dans Black-Scholes. 2) Calculer N'(d1). 3) Pour le Vanna : multiplier par −d2/σ. 4) Interpréter le signe : un Vanna négatif signifie que le Delta baisse quand la volatilité monte (typique d'un call ITM/ATM).",
    en: "1) Compute d1, d2 as in Black-Scholes. 2) Compute N'(d1). 3) For Vanna: multiply by −d2/σ. 4) Interpret the sign: a negative Vanna means Delta falls as volatility rises (typical of an ITM/ATM call).",
  },
  interpretation: {
    fr: "Un desk qui ne suit que Delta, Gamma, Vega et Theta peut se retrouver exposé sans le savoir à des mouvements combinés de spot et de volatilité (comme lors d'un krach, où les deux bougent ensemble) — c'est exactement ce risque que Vanna (et Volga pour la convexité vol-vol) permet d'identifier et de couvrir séparément.",
    en: "A desk that only tracks Delta, Gamma, Vega and Theta can unknowingly end up exposed to combined spot-and-volatility moves (as in a crash, where both move together) — exactly the risk Vanna (and Volga for vol-vol convexity) lets you identify and hedge separately.",
  },
  pitfalls: {
    fr: "Ignorer ces Greeks de second ordre sur un portefeuille d'options à strikes ou échéances variés, en pensant que Delta/Gamma/Vega suffisent : c'est risqué dès que le portefeuille est exposé de façon non triviale à la forme du smile de volatilité. Autre piège : confondre Vanna (sensibilité croisée spot-vol) avec Volga (convexité pure en volatilité) — ce sont deux effets distincts.",
    en: "Ignoring these second-order Greeks on a portfolio of options with varied strikes or maturities, assuming Delta/Gamma/Vega suffice: risky as soon as the portfolio is non-trivially exposed to the volatility smile's shape. Another trap: confusing Vanna (spot-vol cross sensitivity) with Volga (pure volatility convexity) — two distinct effects.",
  },
  keyPoints: {
    fr: [
      "Vanna = sensibilité croisée entre Delta et volatilité (ou Vega et spot) — ∂²V/∂S∂σ.",
      "Volga (Vomma) = convexité du prix par rapport à la volatilité elle-même — ∂²V/∂σ².",
      "Essentiels pour gérer un risque exposé à la forme du smile de volatilité, pas seulement à son niveau.",
    ],
    en: [
      "Vanna = cross-sensitivity between Delta and volatility (or Vega and spot) — ∂²V/∂S∂σ.",
      "Volga (Vomma) = the price's convexity with respect to volatility itself — ∂²V/∂σ².",
      "Essential for managing risk exposed to the volatility smile's shape, not just its level.",
    ],
  },
  advancedDemonstration: {
    fr: "Le Volga s'écrit Volga = Vega × d1×d2/σ, une formule qui montre que le Volga change de signe selon la position relative de d1 et d2 par rapport à zéro (c'est-à-dire selon que l'option est loin ou près de la monnaie). Ces sensibilités de second ordre sont au cœur des méthodes de couverture \"vanna-volga\", une technique de marché largement utilisée sur le marché des changes pour ajuster un prix Black-Scholes de base afin de refléter le coût de couverture du risque de smile, sans avoir à recalibrer un modèle de volatilité stochastique complet.",
    en: "Volga is written Volga = Vega × d1×d2/σ, a formula showing Volga changes sign depending on d1 and d2's relative position to zero (i.e. whether the option is far from or near the money). These second-order sensitivities are at the heart of \"vanna-volga\" hedging methods, a market technique widely used in FX markets to adjust a base Black-Scholes price to reflect the cost of hedging smile risk, without needing to recalibrate a full stochastic volatility model.",
  },
};
