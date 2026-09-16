import type { LessonContent } from "@/lib/lesson-types";

export const m06BrownienArithmetiqueGeometrique: LessonContent = {
  conceptId: "m06-brownien-arithmetique-geometrique",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les propriétés de base du mouvement brownien standard.",
      en: "You need to know the basic properties of standard Brownian motion.",
    },
    conceptIds: ["m06-mouvement-brownien"],
  },
  glossary: [
    { term: { fr: "Dérive (drift)", en: "Drift" }, definition: { fr: "La tendance moyenne, déterministe, autour de laquelle le processus fluctue de façon aléatoire.", en: "The average, deterministic trend around which the process randomly fluctuates." } },
  ],
  intuition: {
    fr: "Un brownien standard seul ne suffit pas à modéliser un prix d'actif : il peut devenir négatif, et ses fluctuations en valeur absolue ne s'adaptent pas au niveau du prix. Deux variantes corrigent ces défauts, chacune pour un usage différent.",
    en: "A standard Brownian motion alone can't model an asset price: it can go negative, and its absolute fluctuations don't scale with the price level. Two variants fix these issues, each for a different use.",
  },
  definition: {
    fr: "Le brownien arithmétique s'écrit dX_t = μ dt + σ dW_t : la dérive et la volatilité sont exprimées en valeur absolue, et X_t peut devenir négatif — adapté aux taux d'intérêt ou aux écarts de prix. Le brownien géométrique s'écrit dS_t = μ S_t dt + σ S_t dW_t : la dérive et la volatilité sont proportionnelles au niveau S_t, ce qui garantit S_t > 0 — le modèle standard pour un prix d'action.",
    en: "Arithmetic Brownian motion is written dX_t = μ dt + σ dW_t: drift and volatility are expressed in absolute terms, and X_t can go negative — suited to interest rates or price spreads. Geometric Brownian motion is written dS_t = μ S_t dt + σ S_t dW_t: drift and volatility are proportional to the level S_t, which guarantees S_t > 0 — the standard model for a stock price.",
  },
  utility: {
    fr: "Le choix entre les deux détermine tout le comportement du modèle : le brownien géométrique est la fondation du modèle de Black-Scholes (M06-4) car il empêche mathématiquement un prix d'action de devenir négatif, une propriété indispensable.",
    en: "The choice between the two determines the model's entire behavior: geometric Brownian motion is the foundation of the Black-Scholes model (M06-4) because it mathematically prevents a stock price from going negative, an essential property.",
  },
  example: {
    fr: "Un taux d'intérêt à 2% peut, dans un modèle simplifié, être représenté par un brownien arithmétique (il peut en théorie devenir légèrement négatif, comme observé sur certains marchés). Le cours d'une action à 100 EUR sera presque toujours modélisé par un brownien géométrique : une variation de 5% se traduit par ±5 EUR autour de 100, mais seulement ±2,50 EUR autour de 50 — la volatilité s'adapte au niveau.",
    en: "A 2% interest rate can, in a simplified model, be represented by an arithmetic Brownian motion (it can in theory turn slightly negative, as observed in some markets). A stock trading at EUR 100 will almost always be modeled by a geometric Brownian motion: a 5% move translates to ±EUR 5 around 100, but only ±EUR 2.50 around 50 — volatility scales with the level.",
  },
  alternativeExplanation: {
    fr: "Le brownien arithmétique ajoute ou retire un montant fixe en euros à chaque instant, quel que soit le niveau actuel — comme un compte qui gagne ou perd un nombre d'euros aléatoire chaque jour. Le brownien géométrique ajoute ou retire un POURCENTAGE du niveau actuel — comme un compte qui gagne ou perd un pourcentage aléatoire chaque jour, ce qui est beaucoup plus réaliste pour un actif financier (une action à 1000 EUR ne bouge pas du même nombre d'euros qu'une à 10 EUR pour le même \"choc\" de marché).",
    en: "Arithmetic Brownian motion adds or removes a fixed euro amount at every instant, whatever the current level — like an account gaining or losing a random number of euros each day. Geometric Brownian motion adds or removes a PERCENTAGE of the current level — like an account gaining or losing a random percentage each day, far more realistic for a financial asset (a EUR 1,000 stock doesn't move by the same euro amount as a EUR 10 one for the same market \"shock\").",
  },
  formula: {
    latex: "S_t = S_0 \\times \\exp\\left[\\left(\\mu - \\frac{\\sigma^2}{2}\\right)t + \\sigma W_t\\right]",
    variables: [
      { symbol: "S_0", description: { fr: "Prix initial de l'actif", en: "The asset's initial price" } },
      { symbol: "\\mu", description: { fr: "Taux de rendement moyen (drift) du brownien géométrique", en: "The geometric Brownian motion's average return (drift)" } },
      { symbol: "\\sigma", description: { fr: "Volatilité (écart-type des rendements)", en: "Volatility (standard deviation of returns)" } },
    ],
    assumptions: { fr: "Solution explicite de l'équation différentielle stochastique dS_t = μS_t dt + σS_t dW_t, obtenue via le lemme d'Itô (M06-3).", en: "Explicit solution of the stochastic differential equation dS_t = μS_t dt + σS_t dW_t, obtained via Itô's lemma (M06-3)." },
    units: { fr: "S_t dans la même unité que S_0 ; μ, σ en proportion annuelle ; t en années.", en: "S_t in the same unit as S_0; μ, σ as annual proportions; t in years." },
    example: { fr: "S0=100, μ=8%, σ=20%, t=1, W_1=0,3 : S_1 = 100×exp[(0,08−0,02)×1+0,20×0,3] = 100×exp(0,12) ≈ 112,75.", en: "S0=100, μ=8%, σ=20%, t=1, W_1=0.3: S_1 = 100×exp[(0.08−0.02)×1+0.20×0.3] = 100×exp(0.12) ≈ 112.75." },
  },
  calculation: {
    fr: "1) Relever S0, μ, σ et t. 2) Calculer le terme de dérive ajustée : (μ − σ²/2) × t. 3) Tirer ou observer W_t. 4) Calculer l'exposant total : terme de dérive + σ×W_t. 5) S_t = S0 × exp(exposant).",
    en: "1) Read off S0, μ, σ and t. 2) Compute the adjusted drift term: (μ − σ²/2) × t. 3) Draw or observe W_t. 4) Compute the total exponent: drift term + σ×W_t. 5) S_t = S0 × exp(exponent).",
  },
  interpretation: {
    fr: "Le terme −σ²/2 (la \"correction d'Itô\") signifie que le rendement moyen ARITHMÉTIQUE μ n'est pas directement le taux de croissance du prix : à cause de la variance, la croissance moyenne du LOGARITHME du prix est plus faible que μ. Cette correction, souvent contre-intuitive, est une conséquence directe du calcul d'Itô (M06-3).",
    en: "The −σ²/2 term (the \"Itô correction\") means the arithmetic average return μ is not directly the price's growth rate: because of variance, the average growth of the price's LOGARITHM is lower than μ. This correction, often counter-intuitive, is a direct consequence of Itô calculus (M06-3).",
  },
  pitfalls: {
    fr: "Oublier le terme −σ²/2 et croire que S_t = S0 × exp(μt + σW_t) : c'est une erreur très fréquente qui biaiserait systématiquement à la hausse toute simulation ou estimation. Autre piège : appliquer un brownien arithmétique à un prix d'action, ce qui autoriserait mathématiquement un prix négatif — non-sens économique.",
    en: "Forgetting the −σ²/2 term and believing S_t = S0 × exp(μt + σW_t): a very common mistake that would systematically bias any simulation or estimate upward. Another trap: applying an arithmetic Brownian motion to a stock price, which would mathematically allow a negative price — an economic nonsense.",
  },
  keyPoints: {
    fr: [
      "Arithmétique : dX_t = μdt + σdW_t, peut devenir négatif, adapté aux taux/spreads.",
      "Géométrique : dS_t = μS_t dt + σS_t dW_t, reste positif, standard pour les prix d'actions.",
      "S_t = S0 × exp[(μ−σ²/2)t + σW_t] : ne pas oublier la correction d'Itô −σ²/2.",
    ],
    en: [
      "Arithmetic: dX_t = μdt + σdW_t, can go negative, suited to rates/spreads.",
      "Geometric: dS_t = μS_t dt + σS_t dW_t, stays positive, the standard for stock prices.",
      "S_t = S0 × exp[(μ−σ²/2)t + σW_t]: don't forget the Itô correction −σ²/2.",
    ],
  },
  advancedDemonstration: {
    fr: "La résolution de dS_t = μS_t dt + σS_t dW_t passe par le changement de variable Y_t = ln(S_t) et l'application du lemme d'Itô (M06-3) : dY_t = (1/S_t)dS_t − (1/2)(1/S_t²)(dS_t)², où (dS_t)² = σ²S_t²dt (règle d'Itô, voir M06-3). En substituant, dY_t = (μ − σ²/2)dt + σdW_t, un brownien arithmétique en Y_t = ln(S_t) qui s'intègre directement pour redonner la formule fermée de S_t. C'est cette dérivation qui explique pourquoi le brownien géométrique est \"log-normal\" : c'est son LOGARITHME qui suit un brownien arithmétique standard.",
    en: "Solving dS_t = μS_t dt + σS_t dW_t goes through the change of variable Y_t = ln(S_t) and applying Itô's lemma (M06-3): dY_t = (1/S_t)dS_t − (1/2)(1/S_t²)(dS_t)², where (dS_t)² = σ²S_t²dt (Itô's rule, see M06-3). Substituting, dY_t = (μ − σ²/2)dt + σdW_t, an arithmetic Brownian motion in Y_t = ln(S_t) that integrates directly to give S_t's closed-form formula. This derivation is why geometric Brownian motion is \"log-normal\": it is its LOGARITHM that follows a standard arithmetic Brownian motion.",
  },
};
