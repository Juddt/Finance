import type { LessonContent } from "@/lib/lesson-types";

export const m08VolatiliteImplicite: LessonContent = {
  conceptId: "m08-volatilite-implicite",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les formules de Black-Scholes et le Vega.",
      en: "You need to know the Black-Scholes formulas and Vega.",
    },
    conceptIds: ["m06-formules-call-put", "m07-greeks-premier-ordre"],
  },
  glossary: [
    { term: { fr: "Inversion de formule", en: "Formula inversion" }, definition: { fr: "Trouver l'entrée (ici σ) qui produit une sortie donnée (le prix coté), plutôt que de calculer la sortie à partir d'une entrée connue.", en: "Finding the input (here σ) that produces a given output (the quoted price), rather than computing the output from a known input." } },
  ],
  intuition: {
    fr: "Plutôt que de partir d'une volatilité pour calculer un prix d'option (Black-Scholes classique), on peut faire l'inverse : partir du prix réellement coté sur le marché, et se demander quelle volatilité, une fois injectée dans Black-Scholes, redonnerait exactement ce prix.",
    en: "Rather than starting from a volatility to compute an option price (classic Black-Scholes), you can do the reverse: start from the price actually quoted in the market, and ask what volatility, plugged into Black-Scholes, would exactly reproduce that price.",
  },
  definition: {
    fr: "La volatilité implicite σ_implicite est la valeur de σ qui, insérée dans la formule de Black-Scholes, égalise le prix théorique au prix de marché observé : C_BS(σ_implicite) = C_marché. Contrairement au prix, cette équation n'a pas de solution fermée et doit être résolue numériquement.",
    en: "Implied volatility σ_implied is the value of σ that, inserted into the Black-Scholes formula, equates the theoretical price to the observed market price: C_BS(σ_implied) = C_market. Unlike the price, this equation has no closed-form solution and must be solved numerically.",
  },
  utility: {
    fr: "La volatilité implicite est LE langage commun du marché des options : les traders cotent et discutent en volatilité implicite plutôt qu'en prix brut, car elle permet de comparer des options de strikes et échéances différents sur une même échelle.",
    en: "Implied volatility is THE common language of the options market: traders quote and discuss in implied volatility rather than raw price, since it lets you compare options of different strikes and maturities on the same scale.",
  },
  example: {
    fr: "Un call cote 9,50 sur le marché, avec S0=100, K=100, r=3%, T=1. En essayant σ=18%, Black-Scholes donne un prix de 8,80 (trop bas). En essayant σ=20%, on obtient 9,41 (encore un peu bas). En essayant σ=21%, on obtient environ 9,60 (un peu haut). La volatilité implicite se situe donc entre 20% et 21%, à affiner par itérations successives.",
    en: "A call trades at 9.50 in the market, with S0=100, K=100, r=3%, T=1. Trying σ=18%, Black-Scholes gives a price of 8.80 (too low). Trying σ=20%, we get 9.41 (still a bit low). Trying σ=21%, we get about 9.60 (a bit high). Implied volatility thus lies between 20% and 21%, to refine through successive iterations.",
  },
  alternativeExplanation: {
    fr: "C'est comme deviner la température qui a produit un certain niveau de dilatation d'un thermomètre à mercure, en connaissant la relation physique entre température et dilatation, mais sans avoir mesuré la température directement : on ajuste une valeur d'essai jusqu'à ce que la dilatation prédite corresponde exactement à celle observée.",
    en: "It's like guessing the temperature that produced a certain expansion level in a mercury thermometer, knowing the physical relationship between temperature and expansion, but without having measured the temperature directly: you adjust a trial value until the predicted expansion exactly matches the observed one.",
  },
  formula: {
    latex: "\\sigma_{n+1} = \\sigma_n - \\frac{C_{\\text{BS}}(\\sigma_n) - C_{\\text{marché}}}{\\text{Vega}(\\sigma_n)}",
    variables: [
      { symbol: "\\sigma_n", description: { fr: "Estimation courante de la volatilité implicite, à l'itération n", en: "Current implied volatility estimate, at iteration n" } },
      { symbol: "C_{\\text{BS}}(\\sigma_n)", description: { fr: "Prix Black-Scholes calculé avec σ_n", en: "Black-Scholes price computed with σ_n" } },
      { symbol: "\\text{Vega}(\\sigma_n)", description: { fr: "Vega de l'option, évalué à σ_n", en: "The option's Vega, evaluated at σ_n" } },
    ],
    assumptions: { fr: "Méthode de Newton-Raphson : converge rapidement (quadratiquement) si le point de départ est raisonnable et le Vega non nul.", en: "Newton-Raphson method: converges quickly (quadratically) if the starting point is reasonable and Vega is non-zero." },
    units: { fr: "σ en proportion annuelle.", en: "σ as an annual proportion." },
    example: { fr: "Voir l'exemple ci-dessus pour une illustration par tâtonnement plutôt que Newton-Raphson formel.", en: "See the example above for a trial-and-error illustration rather than formal Newton-Raphson." },
  },
  calculation: {
    fr: "1) Choisir une estimation initiale σ0 (ex. 20%, un niveau typique). 2) Calculer le prix Black-Scholes et le Vega à ce σ. 3) Calculer l'écart entre le prix théorique et le prix de marché. 4) Ajuster σ via la formule de Newton-Raphson. 5) Répéter jusqu'à ce que l'écart devienne négligeable.",
    en: "1) Choose an initial estimate σ0 (e.g. 20%, a typical level). 2) Compute the Black-Scholes price and Vega at that σ. 3) Compute the gap between the theoretical and market price. 4) Adjust σ via the Newton-Raphson formula. 5) Repeat until the gap becomes negligible.",
  },
  interpretation: {
    fr: "La volatilité implicite n'est pas une prévision statistique de la volatilité future : c'est le prix de l'option lui-même, simplement exprimé dans une unité différente. Elle incorpore l'offre et la demande du marché, y compris une prime de risque que la volatilité réalisée future ne reflète pas nécessairement (voir M07-5).",
    en: "Implied volatility is not a statistical forecast of future volatility: it is the option's price itself, simply expressed in a different unit. It incorporates market supply and demand, including a risk premium that future realized volatility doesn't necessarily reflect (see M07-5).",
  },
  pitfalls: {
    fr: "Confondre volatilité implicite et volatilité réalisée future : la première est un prix de marché aujourd'hui, la seconde une observation qui n'existera qu'après coup — les deux diffèrent systématiquement en moyenne (voir M07-5). Autre piège : croire que l'inversion se fait toujours facilement — un Vega proche de zéro (option très ITM/OTM, échéance très courte) rend la méthode de Newton-Raphson instable, nécessitant des méthodes plus robustes.",
    en: "Confusing implied volatility with future realized volatility: the first is a market price today, the second an observation that will only exist after the fact — the two systematically differ on average (see M07-5). Another trap: believing inversion is always easy — a Vega near zero (very ITM/OTM option, very short maturity) makes Newton-Raphson unstable, requiring more robust methods.",
  },
  keyPoints: {
    fr: [
      "σ_implicite est la volatilité qui, dans Black-Scholes, redonne exactement le prix de marché — pas une prévision.",
      "Aucune formule fermée : on résout numériquement, typiquement par Newton-Raphson en utilisant le Vega.",
      "C'est le langage commun du marché des options, permettant de comparer des options de strikes/échéances différents.",
    ],
    en: [
      "σ_implied is the volatility that, in Black-Scholes, exactly reproduces the market price — not a forecast.",
      "No closed-form formula: solved numerically, typically via Newton-Raphson using Vega.",
      "It's the options market's common language, letting you compare options of different strikes/maturities.",
    ],
  },
  advancedDemonstration: {
    fr: "En pratique, les systèmes de production utilisent souvent une combinaison d'une bonne approximation initiale (l'approximation ATMF de M06-6 inversée donne un point de départ raisonnable : σ0 ≈ Prix/(0,4×S0×√T)) suivie de quelques itérations de Newton-Raphson, ou des méthodes de bissection plus lentes mais garanties de converger quand le Vega est trop faible pour Newton-Raphson. Le fait que la volatilité implicite varie systématiquement avec le strike et l'échéance (plutôt que d'être une constante unique, comme le suppose le modèle de Black-Scholes de base) est précisément ce qui motive l'étude du smile et de la surface de volatilité en M08-3.",
    en: "In practice, production systems often use a combination of a good initial approximation (inverting the M06-6 ATMF approximation gives a reasonable starting point: σ0 ≈ Price/(0.4×S0×√T)) followed by a few Newton-Raphson iterations, or slower but guaranteed-to-converge bisection methods when Vega is too small for Newton-Raphson. The fact that implied volatility systematically varies with strike and maturity (rather than being a single constant, as the basic Black-Scholes model assumes) is precisely what motivates studying the smile and volatility surface in M08-3.",
  },
};
