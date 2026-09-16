import type { LessonContent } from "@/lib/lesson-types";

export const m07GreeksPremierOrdre: LessonContent = {
  conceptId: "m07-greeks-premier-ordre",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les formules de Black-Scholes et l'interprétation de N(d1) comme Delta.",
      en: "You need to know the Black-Scholes formulas and N(d1)'s interpretation as Delta.",
    },
    conceptIds: ["m06-formules-call-put"],
  },
  glossary: [
    { term: { fr: "Densité normale N'(x)", en: "Normal density N'(x)" }, definition: { fr: "La fonction de densité (la courbe en cloche) de la loi normale centrée réduite, N'(x) = e^{−x²/2}/√(2π).", en: "The density function (the bell curve) of the standard normal distribution, N'(x) = e^{−x²/2}/√(2π)." } },
  ],
  intuition: {
    fr: "Les Greeks mesurent, un par un, à quel point le prix d'une option réagit à chaque ingrédient qui la compose : le prix du sous-jacent, la volatilité, le temps qui passe, le taux d'intérêt. Chaque Greek isole l'effet d'un seul de ces facteurs, toutes choses égales par ailleurs.",
    en: "The Greeks measure, one at a time, how sensitive an option's price is to each ingredient that makes it up: the underlying's price, volatility, the passage of time, the interest rate. Each Greek isolates the effect of a single factor, all else equal.",
  },
  definition: {
    fr: "Delta = ∂V/∂S (sensibilité au sous-jacent). Gamma = ∂²V/∂S² (sensibilité du Delta au sous-jacent). Vega = ∂V/∂σ (sensibilité à la volatilité). Theta = ∂V/∂t (sensibilité au temps, généralement présentée comme −∂V/∂t, la perte de valeur par jour). Rho = ∂V/∂r (sensibilité au taux sans risque).",
    en: "Delta = ∂V/∂S (sensitivity to the underlying). Gamma = ∂²V/∂S² (sensitivity of Delta to the underlying). Vega = ∂V/∂σ (sensitivity to volatility). Theta = ∂V/∂t (sensitivity to time, usually presented as −∂V/∂t, the value lost per day). Rho = ∂V/∂r (sensitivity to the risk-free rate).",
  },
  utility: {
    fr: "Les Greeks sont le langage universel de tout desk d'options : ils permettent de décomposer et de couvrir chaque source de risque séparément, plutôt que de subir en bloc l'incertitude sur le prix de l'option.",
    en: "The Greeks are the universal language of any options desk: they let you decompose and hedge each source of risk separately, rather than being exposed in bulk to the option's price uncertainty.",
  },
  example: {
    fr: "Un call a Delta=0,6, Gamma=0,02, Vega=25, Theta=−15 (par an), Rho=30. Si le sous-jacent monte de 1, le prix de l'option monte d'environ 0,6 (Delta) — et ce Delta lui-même montera d'environ 0,02 (Gamma) après ce mouvement. Si la volatilité monte de 1 point (1%), le prix monte d'environ 0,25 (Vega/100). Chaque jour qui passe, l'option perd environ 15/365 ≈ 0,04 de valeur, toutes choses égales par ailleurs (Theta).",
    en: "A call has Delta=0.6, Gamma=0.02, Vega=25, Theta=−15 (per year), Rho=30. If the underlying rises by 1, the option's price rises by about 0.6 (Delta) — and that Delta itself will rise by about 0.02 (Gamma) after this move. If volatility rises by 1 point (1%), the price rises by about 0.25 (Vega/100). Every day that passes, the option loses about 15/365 ≈ 0.04 of value, all else equal (Theta).",
  },
  alternativeExplanation: {
    fr: "Pensez à une voiture : le Delta est la vitesse (comment la position change avec le temps), le Gamma est l'accélération (comment la vitesse elle-même change). Le Vega et le Rho sont comme la sensibilité du trajet à la météo (vol) et au prix du carburant (taux) — des facteurs externes qui influencent le voyage indépendamment de la vitesse ou de l'accélération.",
    en: "Think of a car: Delta is speed (how position changes over time), Gamma is acceleration (how speed itself changes). Vega and Rho are like the trip's sensitivity to the weather (vol) and fuel price (rate) — external factors influencing the journey independent of speed or acceleration.",
  },
  formula: {
    latex: "\\Gamma = \\frac{N'(d_1)}{S_0 \\sigma \\sqrt{T}} \\quad ; \\quad \\text{Vega} = S_0 N'(d_1) \\sqrt{T}",
    variables: [
      { symbol: "N'(d_1)", description: { fr: "Densité normale évaluée en d1 (identique pour call et put)", en: "Normal density evaluated at d1 (identical for call and put)" } },
      { symbol: "S_0, \\sigma, T", description: { fr: "Prix spot, volatilité, durée jusqu'à l'échéance", en: "Spot price, volatility, time to maturity" } },
    ],
    assumptions: { fr: "Gamma et Vega sont identiques pour un call et un put de mêmes caractéristiques (conséquence de la parité call-put) ; Delta et Rho diffèrent en revanche entre call et put.", en: "Gamma and Vega are identical for a call and a put with the same characteristics (a consequence of put-call parity); Delta and Rho, however, differ between call and put." },
    units: { fr: "Gamma en unité de Delta par unité de S ; Vega en unité de prix par point de volatilité (souvent divisé par 100).", en: "Gamma in units of Delta per unit of S; Vega in price units per volatility point (often divided by 100)." },
    example: { fr: "d1=0,25, S0=100, σ=20%, T=1 : N'(0,25)≈0,3867. Gamma ≈ 0,3867/(100×0,20×1) ≈ 0,0193. Vega ≈ 100×0,3867×1 ≈ 38,67.", en: "d1=0.25, S0=100, σ=20%, T=1: N'(0.25)≈0.3867. Gamma ≈ 0.3867/(100×0.20×1) ≈ 0.0193. Vega ≈ 100×0.3867×1 ≈ 38.67." },
  },
  calculation: {
    fr: "1) Calculer d1 comme dans Black-Scholes (M06-5). 2) Calculer la densité normale N'(d1) = e^(−d1²/2)/√(2π). 3) Pour Gamma : diviser par (S0 × σ × √T). 4) Pour Vega : multiplier N'(d1) par S0 et par √T.",
    en: "1) Compute d1 as in Black-Scholes (M06-5). 2) Compute the normal density N'(d1) = e^(−d1²/2)/√(2π). 3) For Gamma: divide by (S0 × σ × √T). 4) For Vega: multiply N'(d1) by S0 and by √T.",
  },
  interpretation: {
    fr: "Gamma et Vega sont toujours positifs pour une position longue sur une option (call ou put) : être acheteur d'options, c'est structurellement être \"long Gamma\" (profiter des mouvements) et \"long Vega\" (profiter d'une hausse de la volatilité). Le vendeur d'options est dans la situation symétrique inverse.",
    en: "Gamma and Vega are always positive for a long option position (call or put): being an option buyer structurally means being \"long Gamma\" (benefiting from moves) and \"long Vega\" (benefiting from a rise in volatility). The option seller is in the symmetric opposite situation.",
  },
  pitfalls: {
    fr: "Croire que le Delta d'un put est positif comme celui d'un call : le Delta d'un put est toujours négatif (entre −1 et 0), car sa valeur baisse quand le sous-jacent monte. Autre piège : oublier que le Theta est généralement négatif pour une position longue (l'option perd de la valeur temps chaque jour), sauf cas particuliers (certaines positions sur put profondément ITM sur taux élevés).",
    en: "Believing a put's Delta is positive like a call's: a put's Delta is always negative (between −1 and 0), since its value falls as the underlying rises. Another trap: forgetting Theta is generally negative for a long position (the option loses time value every day), except special cases (some deep ITM put positions with high rates).",
  },
  keyPoints: {
    fr: [
      "Delta, Gamma, Vega, Theta, Rho mesurent chacun la sensibilité du prix à un facteur distinct.",
      "Gamma et Vega sont identiques pour un call et un put ; Delta et Rho diffèrent en signe/valeur.",
      "Être long une option = long Gamma et long Vega ; être court = l'inverse.",
    ],
    en: [
      "Delta, Gamma, Vega, Theta, Rho each measure the price's sensitivity to a distinct factor.",
      "Gamma and Vega are identical for a call and a put; Delta and Rho differ in sign/value.",
      "Being long an option = long Gamma and long Vega; being short = the opposite.",
    ],
  },
  advancedDemonstration: {
    fr: "Ces formules se dérivent en différentiant directement C = S0N(d1) − Ke^{−rT}N(d2) par rapport à chaque variable, en utilisant la relation remarquable S0N'(d1) = Ke^{−rT}N'(d2) (qui découle de d1−d2=σ√T et simplifie considérablement les calculs). Le Theta complet d'un call s'écrit Θ = −S0N'(d1)σ/(2√T) − rKe^{−rT}N(d2), et le Rho, Ρ = KTe^{−rT}N(d2) — des formules moins utilisées en calcul mental que Gamma/Vega mais indispensables pour un système de pricing complet.",
    en: "These formulas are derived by directly differentiating C = S0N(d1) − Ke^{−rT}N(d2) with respect to each variable, using the remarkable relation S0N'(d1) = Ke^{−rT}N'(d2) (which follows from d1−d2=σ√T and considerably simplifies the calculations). A call's full Theta is Θ = −S0N'(d1)σ/(2√T) − rKe^{−rT}N(d2), and Rho, Ρ = KTe^{−rT}N(d2) — formulas less used in mental math than Gamma/Vega but essential for a complete pricing system.",
  },
};
