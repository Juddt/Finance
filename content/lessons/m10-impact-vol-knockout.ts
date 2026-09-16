import type { LessonContent } from "@/lib/lesson-types";

export const m10ImpactVolKnockout: LessonContent = {
  conceptId: "m10-impact-vol-knockout",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les mécanismes des options barrières et le Vega d'une option vanille.",
      en: "You need to know barrier option mechanics and a vanilla option's Vega.",
    },
    conceptIds: ["m10-mecanismes-barrieres", "m07-greeks-premier-ordre"],
  },
  glossary: [
    { term: { fr: "Déplacement de barrière (barrier shift)", en: "Barrier shift" }, definition: { fr: "Une technique de pricing qui déplace légèrement le niveau de barrière utilisé dans le modèle, pour compenser l'écart entre observation continue théorique et observation discrète réelle.", en: "A pricing technique that slightly shifts the barrier level used in the model, to compensate for the gap between theoretical continuous observation and real discrete observation." } },
  ],
  intuition: {
    fr: "Pour une option vanille, plus de volatilité signifie presque toujours plus de valeur (M07-1). Pour un knock-out, c'est plus subtil : une volatilité plus élevée augmente certes le potentiel de gain final, mais augmente AUSSI la probabilité de toucher la barrière et de tout perdre en cours de route — ces deux effets s'opposent.",
    en: "For a vanilla option, more volatility almost always means more value (M07-1). For a knock-out, it's more subtle: higher volatility does increase the final payoff potential, but ALSO increases the probability of touching the barrier and losing everything along the way — these two effects oppose each other.",
  },
  definition: {
    fr: "Le Vega d'une option knock-out n'a pas de signe universel : il peut être positif (comme un vanille) quand la barrière est lointaine et peu susceptible d'être touchée, ou devenir négatif quand le spot est proche de la barrière, car l'effet dominant devient alors la probabilité accrue de knock-out plutôt que le potentiel de gain. Séparément, le \"déplacement de barrière\" ajuste le niveau de barrière du modèle pour tenir compte de l'observation discrète plutôt que continue : H_ajustée = H × exp(±0,5826 × σ × √(Δt)).",
    en: "A knock-out option's Vega has no universal sign: it can be positive (like a vanilla) when the barrier is far away and unlikely to be touched, or turn negative when spot is close to the barrier, since the dominant effect then becomes the increased knock-out probability rather than the payoff potential. Separately, the \"barrier shift\" adjusts the model's barrier level to account for discrete rather than continuous observation: H_adjusted = H × exp(±0.5826 × σ × √(Δt)).",
  },
  utility: {
    fr: "Comprendre que le Vega d'un knock-out peut être négatif est crucial pour tout gérant de portefeuille d'options exotiques : une couverture qui suppose naïvement \"long option = long Vega\" peut se retrouver structurellement mal positionnée sur des knock-out proches de leur barrière. Le déplacement de barrière, lui, permet d'utiliser des formules de pricing à observation continue (plus simples) tout en approximant fidèlement un contrat réel à observation discrète.",
    en: "Understanding a knock-out's Vega can be negative is crucial for any exotic options portfolio manager: a hedge that naively assumes \"long option = long Vega\" can end up structurally mispositioned on knock-outs close to their barrier. The barrier shift, meanwhile, lets you use (simpler) continuous-observation pricing formulas while faithfully approximating a real discrete-observation contract.",
  },
  example: {
    fr: "Un call up-and-out dont le spot est proche de la barrière : si la volatilité augmente, la probabilité de dépasser la barrière (et donc de tout perdre) augmente plus vite que ne le fait le potentiel de gain en cas de non-déclenchement — la valeur de l'option BAISSE avec une hausse de volatilité, un Vega négatif contre-intuitif. Pour le déplacement de barrière : H=130, σ=25%, observations hebdomadaires (Δt=1/52) : ajustement ≈ 130×exp(0,5826×0,25×√(1/52)) ≈ 130×1,0202 ≈ 132,6, la barrière \"effective\" utilisée dans un modèle continu.",
    en: "An up-and-out call with spot close to the barrier: if volatility rises, the probability of exceeding the barrier (and so losing everything) rises faster than the payoff potential in the no-trigger case — the option's value FALLS with rising volatility, a counter-intuitive negative Vega. For the barrier shift: H=130, σ=25%, weekly observations (Δt=1/52): adjustment ≈ 130×exp(0.5826×0.25×√(1/52)) ≈ 130×1.0202 ≈ 132.6, the \"effective\" barrier used in a continuous model.",
  },
  alternativeExplanation: {
    fr: "Pensez à un funambule qui doit atteindre l'autre côté d'un canyon sans tomber dans un précipice situé juste à côté de son chemin : plus il \"secoue\" (volatilité), plus il a de chances de progresser vite, mais aussi plus il risque de tomber dans le précipice avant même d'arriver. Près du bord (barrière proche), le risque de chute domine ; loin du bord, l'effet de progression domine.",
    en: "Picture a tightrope walker who must reach the other side of a canyon without falling into a precipice right next to their path: the more they \"shake\" (volatility), the faster they might progress, but also the more likely they fall into the precipice before even arriving. Near the edge (barrier close), the fall risk dominates; far from the edge, the progress effect dominates.",
  },
  formula: {
    latex: "H_{\\text{ajustée}} = H \\times \\exp\\left(\\pm 0{,}5826 \\times \\sigma \\times \\sqrt{\\Delta t}\\right)",
    variables: [
      { symbol: "H", description: { fr: "Niveau de barrière contractuel (observation discrète)", en: "Contractual barrier level (discrete observation)" } },
      { symbol: "\\sigma", description: { fr: "Volatilité annualisée du sous-jacent", en: "The underlying's annualized volatility" } },
      { symbol: "\\Delta t", description: { fr: "Intervalle de temps entre deux observations (en années)", en: "Time interval between two observations (in years)" } },
    ],
    assumptions: { fr: "Approximation de Broadie-Glasserman-Kou ; signe + pour une barrière \"up\" (déplacée vers le haut), signe − pour une barrière \"down\" (déplacée vers le bas), pour compenser la sous-estimation du risque de franchissement en observation discrète.", en: "Broadie-Glasserman-Kou approximation; + sign for an \"up\" barrier (shifted upward), − sign for a \"down\" barrier (shifted downward), to compensate for underestimating breach risk under discrete observation." },
    units: { fr: "H_ajustée dans la même unité que H.", en: "H_adjusted in the same unit as H." },
    example: { fr: "H=130, σ=25%, Δt=1/52 : H_ajustée ≈ 132,6.", en: "H=130, σ=25%, Δt=1/52: H_adjusted ≈ 132.6." },
  },
  calculation: {
    fr: "1) Identifier la barrière contractuelle H et la fréquence d'observation (donc Δt). 2) Calculer 0,5826 × σ × √Δt. 3) Appliquer le signe + (barrière up) ou − (barrière down) à l'exposant. 4) Multiplier H par exp(exposant) pour obtenir la barrière ajustée à utiliser dans un modèle à observation continue.",
    en: "1) Identify the contractual barrier H and observation frequency (hence Δt). 2) Compute 0.5826 × σ × √Δt. 3) Apply the + sign (up barrier) or − sign (down barrier) to the exponent. 4) Multiply H by exp(exponent) to get the adjusted barrier to use in a continuous-observation model.",
  },
  interpretation: {
    fr: "Le déplacement de barrière \"pousse\" artificiellement la barrière plus loin du spot pour un up (ou plus proche pour compenser dans l'autre sens selon le cas), reproduisant l'effet réel qu'une surveillance discrète (moins fréquente qu'en continu) laisse techniquement un peu plus de marge au sous-jacent avant de déclencher le knock-out.",
    en: "The barrier shift artificially \"pushes\" the barrier further from spot for an up barrier (or closer to compensate the other way depending on the case), reproducing the real effect that discrete monitoring (less frequent than continuous) technically leaves the underlying a bit more room before triggering the knock-out.",
  },
  pitfalls: {
    fr: "Appliquer une formule de pricing à observation continue directement à un contrat à observation discrète sans ajustement : cela surestime systématiquement la probabilité de knock-out (et donc sous-estime le prix d'un knock-out, surestime celui d'un knock-in). Autre piège : croire que le Vega d'un knock-out est toujours positif comme pour une option vanille, une généralisation dangereuse près de la barrière.",
    en: "Applying a continuous-observation pricing formula directly to a discrete-observation contract without adjustment: this systematically overstates knock-out probability (and so understates a knock-out's price, overstates a knock-in's). Another trap: believing a knock-out's Vega is always positive like a vanilla's, a dangerous generalization near the barrier.",
  },
  keyPoints: {
    fr: [
      "Le Vega d'un knock-out peut être négatif près de sa barrière : plus de volatilité augmente le risque de tout perdre.",
      "L'observation discrète réduit légèrement le risque de franchissement par rapport à l'observation continue.",
      "Le déplacement de barrière (Broadie-Glasserman-Kou) permet d'approximer l'observation discrète avec des formules continues.",
    ],
    en: [
      "A knock-out's Vega can be negative near its barrier: more volatility raises the risk of losing everything.",
      "Discrete observation slightly reduces breach risk compared to continuous observation.",
      "The barrier shift (Broadie-Glasserman-Kou) lets you approximate discrete observation with continuous formulas.",
    ],
  },
  advancedDemonstration: {
    fr: "La constante 0,5826 (= −ζ(1/2)/√(2π), liée à la fonction zêta de Riemann) provient d'une analyse asymptotique du pont brownien entre deux dates d'observation consécutives, quantifiant précisément l'écart entre le maximum atteint par une trajectoire discrètement observée et celui d'une trajectoire réellement continue. Cette approximation, bien que dérivée sous des hypothèses de diffusion simples (Black-Scholes), reste largement utilisée en pratique comme point de départ, même dans des modèles plus sophistiqués (vol locale/stochastique, M08-7), car elle isole proprement l'effet de la fréquence d'observation indépendamment du choix de modèle de volatilité.",
    en: "The constant 0.5826 (= −ζ(1/2)/√(2π), tied to the Riemann zeta function) comes from an asymptotic analysis of the Brownian bridge between two consecutive observation dates, precisely quantifying the gap between the maximum reached by a discretely observed path and that of a truly continuous one. This approximation, though derived under simple diffusion assumptions (Black-Scholes), remains widely used in practice as a starting point, even within more sophisticated models (local/stochastic vol, M08-7), since it cleanly isolates the observation-frequency effect independent of the chosen volatility model.",
  },
};
