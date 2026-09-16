import type { LessonContent } from "@/lib/lesson-types";

export const m06FormulesCallPut: LessonContent = {
  conceptId: "m06-formules-call-put",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître l'équation de Black-Scholes et la loi normale centrée réduite N(x).",
      en: "You need to know the Black-Scholes equation and the standard normal distribution N(x).",
    },
    conceptIds: ["m06-black-scholes"],
  },
  glossary: [
    { term: { fr: "Fonction de répartition normale N(x)", en: "Standard normal CDF N(x)" }, definition: { fr: "La probabilité qu'une variable normale centrée réduite soit inférieure à x ; toujours comprise entre 0 et 1.", en: "The probability that a standard normal random variable is below x; always between 0 and 1." } },
  ],
  intuition: {
    fr: "Résoudre l'équation de Black-Scholes avec les bonnes conditions pour un call ou un put donne des formules fermées, calculables avec juste une calculatrice (et une table ou fonction N(x)) — pas besoin de résoudre une équation différentielle à chaque fois.",
    en: "Solving the Black-Scholes equation with the right conditions for a call or a put gives closed-form formulas, computable with just a calculator (and an N(x) table or function) — no need to solve a differential equation every time.",
  },
  definition: {
    fr: "Pour un call européen : C = S0×N(d1) − K×e^{−rT}×N(d2). Pour un put européen : P = K×e^{−rT}×N(−d2) − S0×N(−d1). Avec d1 = [ln(S0/K) + (r + σ²/2)T] / (σ√T) et d2 = d1 − σ√T.",
    en: "For a European call: C = S0×N(d1) − K×e^{−rT}×N(d2). For a European put: P = K×e^{−rT}×N(−d2) − S0×N(−d1). With d1 = [ln(S0/K) + (r + σ²/2)T] / (σ√T) and d2 = d1 − σ√T.",
  },
  utility: {
    fr: "Ces formules sont utilisées littéralement des milliards de fois par jour sur les marchés dérivés pour coter, valoriser et couvrir des options — la référence universelle malgré ses limites connues (voir M06-4).",
    en: "These formulas are used literally billions of times a day in derivatives markets to quote, value and hedge options — the universal reference despite its known limits (see M06-4).",
  },
  example: {
    fr: "S0=100, K=100, r=3%, σ=20%, T=1. d1 = [ln(1) + (0,03+0,02)×1]/(0,20×1) = 0,05/0,20 = 0,25. d2 = 0,25 − 0,20 = 0,05. Avec N(0,25)≈0,5987 et N(0,05)≈0,5199 : C = 100×0,5987 − 100×e^{−0,03}×0,5199 ≈ 59,87 − 50,46 ≈ 9,41.",
    en: "S0=100, K=100, r=3%, σ=20%, T=1. d1 = [ln(1) + (0.03+0.02)×1]/(0.20×1) = 0.05/0.20 = 0.25. d2 = 0.25 − 0.20 = 0.05. With N(0.25)≈0.5987 and N(0.05)≈0.5199: C = 100×0.5987 − 100×e^{−0.03}×0.5199 ≈ 59.87 − 50.46 ≈ 9.41.",
  },
  alternativeExplanation: {
    fr: "On peut lire la formule du call comme : \"la valeur actuelle probabiliste de ce qu'on reçoit (l'action, pondérée par N(d1), la probabilité risque-neutre ajustée d'être exercé) moins la valeur actuelle probabiliste de ce qu'on paie (le strike actualisé, pondéré par N(d2), la vraie probabilité risque-neutre d'exercice)\". N(d1) et N(d2) sont proches mais subtilement différents, un point souvent source de confusion.",
    en: "One can read the call formula as: \"the probability-weighted present value of what you receive (the stock, weighted by N(d1), the adjusted risk-neutral probability of exercise) minus the probability-weighted present value of what you pay (the discounted strike, weighted by N(d2), the true risk-neutral exercise probability)\". N(d1) and N(d2) are close but subtly different, often a source of confusion.",
  },
  formula: {
    latex: "C = S_0 N(d_1) - K e^{-rT} N(d_2) \\quad ; \\quad d_1 = \\frac{\\ln(S_0/K) + (r+\\sigma^2/2)T}{\\sigma\\sqrt{T}}, \\; d_2 = d_1 - \\sigma\\sqrt{T}",
    variables: [
      { symbol: "S_0", description: { fr: "Prix spot actuel du sous-jacent", en: "Current spot price of the underlying" } },
      { symbol: "K", description: { fr: "Prix d'exercice (strike)", en: "Strike price" } },
      { symbol: "r, \\sigma, T", description: { fr: "Taux sans risque, volatilité, durée jusqu'à l'échéance", en: "Risk-free rate, volatility, time to maturity" } },
      { symbol: "N(\\cdot)", description: { fr: "Fonction de répartition de la loi normale centrée réduite", en: "The standard normal cumulative distribution function" } },
    ],
    assumptions: { fr: "Option européenne, pas de dividende, hypothèses de Black-Scholes (M06-4).", en: "European option, no dividend, Black-Scholes assumptions (M06-4)." },
    units: { fr: "C, P dans la devise du sous-jacent.", en: "C, P in the underlying's currency." },
    example: { fr: "S0=100, K=100, r=3%, σ=20%, T=1 : C ≈ 9,41 (voir exemple ci-dessus).", en: "S0=100, K=100, r=3%, σ=20%, T=1: C ≈ 9.41 (see example above)." },
  },
  calculation: {
    fr: "1) Calculer d1 = [ln(S0/K) + (r+σ²/2)T] / (σ√T). 2) Calculer d2 = d1 − σ√T. 3) Lire ou calculer N(d1) et N(d2) (via table, fonction, ou approximation). 4) Assembler C = S0×N(d1) − K×e^{−rT}×N(d2). 5) Pour le put, utiliser N(−d1) et N(−d2) selon la formule symétrique, ou déduire P de C via la parité call-put (M05-3).",
    en: "1) Compute d1 = [ln(S0/K) + (r+σ²/2)T] / (σ√T). 2) Compute d2 = d1 − σ√T. 3) Look up or compute N(d1) and N(d2) (via table, function, or approximation). 4) Assemble C = S0×N(d1) − K×e^{−rT}×N(d2). 5) For the put, use N(−d1) and N(−d2) per the symmetric formula, or derive P from C via put-call parity (M05-3).",
  },
  interpretation: {
    fr: "N(d1) s'interprète aussi comme le Delta du call (M07-1) : la sensibilité du prix de l'option à une petite variation de S0. N(d2), lui, est la vraie probabilité risque-neutre que l'option termine dans la monnaie (S_T > K) — une distinction technique mais importante entre les deux.",
    en: "N(d1) also has the interpretation of the call's Delta (M07-1): the option's price sensitivity to a small change in S0. N(d2), on the other hand, is the true risk-neutral probability the option ends in the money (S_T > K) — a technical but important distinction between the two.",
  },
  pitfalls: {
    fr: "Confondre d1 et d2, ou oublier le terme +σ²/2 (et non −σ²/2) dans d1 — un piège fréquent car le brownien géométrique (M06-2) utilise −σ²/2. Autre piège : utiliser un taux ou une volatilité en pourcentage brut (\"20\") au lieu de la proportion décimale (\"0,20\") dans la formule.",
    en: "Confusing d1 and d2, or forgetting the +σ²/2 term (not −σ²/2) in d1 — a frequent trap since geometric Brownian motion (M06-2) uses −σ²/2. Another trap: using a rate or volatility as a raw percentage (\"20\") instead of the decimal proportion (\"0.20\") in the formula.",
  },
  keyPoints: {
    fr: [
      "C = S0×N(d1) − K×e^{−rT}×N(d2), avec d1 = [ln(S0/K)+(r+σ²/2)T]/(σ√T) et d2 = d1 − σ√T.",
      "N(d1) = Delta du call ; N(d2) = vraie probabilité risque-neutre d'exercice.",
      "Le put se déduit soit par formule symétrique, soit via la parité call-put.",
    ],
    en: [
      "C = S0×N(d1) − K×e^{−rT}×N(d2), with d1 = [ln(S0/K)+(r+σ²/2)T]/(σ√T) and d2 = d1 − σ√T.",
      "N(d1) = the call's Delta; N(d2) = the true risk-neutral exercise probability.",
      "The put follows either from the symmetric formula, or via put-call parity.",
    ],
  },
  advancedDemonstration: {
    fr: "On peut vérifier que ces formules satisfont exactement l'équation aux dérivées partielles de Black-Scholes (M06-4) avec la condition terminale V(S,T) = max(S−K,0) pour un call, en calculant explicitement ∂V/∂t, ∂V/∂S et ∂²V/∂S² et en substituant. On peut aussi vérifier que C et P ainsi définis satisfont exactement la parité call-put (M05-3) : C − P = S0×N(d1) − K e^{−rT}N(d2) − [Ke^{−rT}N(−d2) − S0N(−d1)] = S0[N(d1)+N(−d1)] − Ke^{−rT}[N(d2)+N(−d2)] = S0 − Ke^{−rT} (car N(x)+N(−x)=1 pour tout x) — une cohérence interne remarquable entre deux résultats obtenus par des voies complètement différentes (équation aux dérivées partielles vs argument de réplication statique).",
    en: "One can verify these formulas exactly satisfy the Black-Scholes partial differential equation (M06-4) with the terminal condition V(S,T) = max(S−K,0) for a call, by explicitly computing ∂V/∂t, ∂V/∂S and ∂²V/∂S² and substituting. One can also verify C and P as defined exactly satisfy put-call parity (M05-3): C − P = S0×N(d1) − K e^{−rT}N(d2) − [Ke^{−rT}N(−d2) − S0N(−d1)] = S0[N(d1)+N(−d1)] − Ke^{−rT}[N(d2)+N(−d2)] = S0 − Ke^{−rT} (since N(x)+N(−x)=1 for any x) — a remarkable internal consistency between two results obtained through completely different routes (a partial differential equation vs a static replication argument).",
  },
};
