import type { LessonContent } from "@/lib/lesson-types";

export const m06ApproximationAtmf: LessonContent = {
  conceptId: "m06-approximation-atmf",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les formules complètes de Black-Scholes et la notion de prix forward.",
      en: "You need to know the full Black-Scholes formulas and the concept of a forward price.",
    },
    conceptIds: ["m06-formules-call-put", "m02-prix-forward-non-arbitrage"],
  },
  glossary: [
    { term: { fr: "At-the-money-forward (ATMF)", en: "At-the-money-forward (ATMF)" }, definition: { fr: "Une option dont le strike K est exactement égal au prix forward F0 = S0×e^{rT}, et non au spot S0.", en: "An option whose strike K exactly equals the forward price F0 = S0×e^{rT}, not the spot S0." } },
  ],
  intuition: {
    fr: "Quand le strike d'un call est exactement égal au prix forward du sous-jacent, les formules de Black-Scholes se simplifient radicalement en une approximation célèbre et très rapide à calculer mentalement — un outil de calcul de coin de table indispensable sur un desk d'options.",
    en: "When a call's strike exactly equals the underlying's forward price, the Black-Scholes formulas simplify dramatically into a famous, very fast mental-math approximation — an indispensable back-of-envelope tool on an options desk.",
  },
  definition: {
    fr: "Pour une option ATMF (K = F0 = S0×e^{rT}), la formule de Black-Scholes se simplifie en l'approximation C ≈ 0,4 × S0 × σ × √T, valable pour des volatilités et échéances raisonnables (pas trop extrêmes).",
    en: "For an ATMF option (K = F0 = S0×e^{rT}), the Black-Scholes formula simplifies into the approximation C ≈ 0.4 × S0 × σ × √T, valid for reasonable volatilities and maturities (not too extreme).",
  },
  utility: {
    fr: "Cette approximation permet d'estimer mentalement, en quelques secondes et sans calculatrice, le prix d'une option ATMF — extrêmement utile pour vérifier rapidement un ordre de grandeur ou détecter une erreur de saisie dans un système de pricing.",
    en: "This approximation lets you mentally estimate, in seconds and without a calculator, an ATMF option's price — extremely useful to quickly sanity-check an order of magnitude or catch a data-entry error in a pricing system.",
  },
  example: {
    fr: "Une action à S0=100, volatilité σ=25%, échéance T=1 an, taux r négligé pour simplifier (K≈F0≈S0). Approximation : C ≈ 0,4 × 100 × 0,25 × √1 = 10. Le calcul complet par Black-Scholes donnerait une valeur très proche (autour de 9,95), confirmant la qualité de l'approximation.",
    en: "A stock at S0=100, volatility σ=25%, maturity T=1 year, rate r ignored for simplicity (K≈F0≈S0). Approximation: C ≈ 0.4 × 100 × 0.25 × √1 = 10. The full Black-Scholes calculation would give a very close value (around 9.95), confirming the approximation's quality.",
  },
  alternativeExplanation: {
    fr: "Le \"0,4\" de la formule n'est pas magique : c'est (arrondi) 1/√(2π) ≈ 0,3989, la hauteur du pic de la courbe en cloche de la loi normale standard. À la monnaie forward, le call se comporte comme une petite fraction constante de S0×σ×√T (l'écart-type du prix à l'échéance), et cette fraction constante est précisément liée à la forme de la courbe normale.",
    en: "The formula's \"0.4\" isn't magic: it is (rounded) 1/√(2π) ≈ 0.3989, the peak height of the standard normal bell curve. At the forward money, the call behaves like a small constant fraction of S0×σ×√T (the price's standard deviation at maturity), and that constant fraction is precisely tied to the normal curve's shape.",
  },
  formula: {
    latex: "C_{\\text{ATMF}} \\approx 0{,}4 \\times S_0 \\times \\sigma \\times \\sqrt{T}",
    variables: [
      { symbol: "S_0", description: { fr: "Prix spot du sous-jacent (proche de F0 pour cette approximation)", en: "The underlying's spot price (close to F0 for this approximation)" } },
      { symbol: "\\sigma", description: { fr: "Volatilité annualisée", en: "Annualized volatility" } },
      { symbol: "T", description: { fr: "Durée jusqu'à l'échéance en années", en: "Time to maturity in years" } },
    ],
    assumptions: { fr: "K = F0 exactement (option ATMF) ; approximation de petit angle valable pour σ√T pas trop grand (typiquement < 50-60%).", en: "K = F0 exactly (ATMF option); small-angle approximation valid for σ√T not too large (typically < 50-60%)." },
    units: { fr: "C dans la même devise que S0.", en: "C in the same currency as S0." },
    example: { fr: "S0=100, σ=25%, T=1 : C ≈ 0,4×100×0,25×1 = 10.", en: "S0=100, σ=25%, T=1: C ≈ 0.4×100×0.25×1 = 10." },
  },
  calculation: {
    fr: "1) Vérifier que le strike est proche du forward (approximation valable seulement dans ce cas). 2) Calculer σ√T (l'écart-type du log-rendement à l'échéance). 3) Multiplier par S0. 4) Multiplier par 0,4 (l'approximation de 1/√(2π)).",
    en: "1) Check the strike is close to the forward (approximation only valid in that case). 2) Compute σ√T (the standard deviation of the log-return at maturity). 3) Multiply by S0. 4) Multiply by 0.4 (the approximation of 1/√(2π)).",
  },
  interpretation: {
    fr: "Cette formule révèle une intuition profonde : à la monnaie forward, le prix d'un call (ou d'un put, de valeur presque identique par la parité call-put quand K≈F0) dépend presque uniquement de σ√T, le produit de la volatilité et de la racine du temps — la vraie \"unité de risque\" perçue par le marché, plutôt que σ et T séparément.",
    en: "This formula reveals a deep intuition: at the forward money, a call's price (or a put's, nearly identical in value by put-call parity when K≈F0) depends almost entirely on σ√T, the product of volatility and the square root of time — the true \"unit of risk\" perceived by the market, rather than σ and T separately.",
  },
  pitfalls: {
    fr: "Appliquer cette approximation à une option loin de la monnaie (ITM ou OTM) : elle devient rapidement fausse en dehors du cas ATMF. Autre piège : oublier que c'est une approximation, pas une formule exacte — l'écart avec Black-Scholes complet grandit pour de grandes volatilités ou échéances (σ√T élevé).",
    en: "Applying this approximation to an option far from the money (ITM or OTM): it quickly becomes wrong outside the ATMF case. Another trap: forgetting it is an approximation, not an exact formula — the gap with full Black-Scholes grows for large volatilities or maturities (high σ√T).",
  },
  keyPoints: {
    fr: [
      "Pour K = F0 (ATMF), C ≈ 0,4 × S0 × σ × √T — un calcul mental en quelques secondes.",
      "Le \"0,4\" vient de 1/√(2π), la hauteur du pic de la loi normale standard.",
      "Cette approximation n'est valable qu'à la monnaie forward et pour σ√T pas trop grand.",
    ],
    en: [
      "For K = F0 (ATMF), C ≈ 0.4 × S0 × σ × √T — a mental calculation in seconds.",
      "The \"0.4\" comes from 1/√(2π), the standard normal distribution's peak height.",
      "This approximation is only valid at the forward money and for σ√T not too large.",
    ],
  },
  advancedDemonstration: {
    fr: "La dérivation exacte part de d1 = σ√T/2 et d2 = −σ√T/2 quand K=F0 (car ln(F0/K)=0). Pour σ√T petit, un développement limité de N(x) autour de 0 donne N(x) ≈ 0,5 + x/√(2π), donc N(d1)−N(d2) ≈ (d1−d2)/√(2π) = σ√T/√(2π). En substituant dans C = S0[N(d1)−N(d2)e^{−rT}] (en négligeant r pour simplifier, cas T court ou r petit), on retrouve C ≈ S0 × σ√T/√(2π) ≈ 0,3989 × S0 × σ√T, arrondi à 0,4. Cette dérivation montre explicitement les limites de l'approximation : elle repose sur un développement de Taylor au premier ordre de N(x), qui se dégrade quand σ√T s'éloigne de zéro.",
    en: "The exact derivation starts from d1 = σ√T/2 and d2 = −σ√T/2 when K=F0 (since ln(F0/K)=0). For small σ√T, a Taylor expansion of N(x) around 0 gives N(x) ≈ 0.5 + x/√(2π), so N(d1)−N(d2) ≈ (d1−d2)/√(2π) = σ√T/√(2π). Substituting into C = S0[N(d1)−N(d2)e^{−rT}] (ignoring r for simplicity, short T or small r case), we recover C ≈ S0 × σ√T/√(2π) ≈ 0.3989 × S0 × σ√T, rounded to 0.4. This derivation explicitly shows the approximation's limits: it relies on a first-order Taylor expansion of N(x), which degrades as σ√T moves away from zero.",
  },
};
