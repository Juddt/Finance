import type { LessonContent } from "@/lib/lesson-types";

export const m08VolLocaleStochastique: LessonContent = {
  conceptId: "m08-vol-locale-stochastique",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la surface de volatilité et les limites du modèle de Black-Scholes à volatilité constante.",
      en: "You need to know the volatility surface and the limits of the constant-volatility Black-Scholes model.",
    },
    conceptIds: ["m08-skew-smile-surface", "m06-black-scholes"],
  },
  glossary: [
    { term: { fr: "Calibration", en: "Calibration" }, definition: { fr: "Le processus qui consiste à choisir les paramètres d'un modèle pour qu'il reproduise exactement (ou au mieux) les prix observés sur le marché.", en: "The process of choosing a model's parameters so it exactly (or best) reproduces market-observed prices." } },
  ],
  intuition: {
    fr: "Puisque Black-Scholes à volatilité constante ne peut pas expliquer le smile (M08-3), deux familles de modèles plus riches ont été développées pour y remédier — mais elles font des compromis très différents entre \"coller parfaitement aux prix d'aujourd'hui\" et \"bien prédire comment ces prix évolueront demain\".",
    en: "Since constant-volatility Black-Scholes can't explain the smile (M08-3), two richer model families were developed to address this — but they make very different trade-offs between \"perfectly fitting today's prices\" and \"correctly predicting how those prices will evolve tomorrow\".",
  },
  definition: {
    fr: "La volatilité locale (modèle de Dupire) suppose que la volatilité est une fonction déterministe σ_loc(S,t) du niveau du sous-jacent et du temps, calibrée pour reproduire EXACTEMENT tous les prix d'options vanilles cotés sur le marché à un instant donné. La volatilité stochastique (ex. modèle de Heston) suppose que la volatilité elle-même suit son propre processus aléatoire, avec sa propre source d'incertitude, offrant un ajustement moins parfait aux prix actuels mais une dynamique de smile plus réaliste dans le temps.",
    en: "Local volatility (Dupire's model) assumes volatility is a deterministic function σ_loc(S,t) of the underlying's level and time, calibrated to EXACTLY reproduce all vanilla option prices quoted in the market at a given instant. Stochastic volatility (e.g. the Heston model) assumes volatility itself follows its own random process, with its own source of uncertainty, offering a less perfect fit to current prices but more realistic smile dynamics over time.",
  },
  utility: {
    fr: "Le choix du modèle a un impact direct sur le pricing et la couverture des produits exotiques (M09-M11), dont la valeur dépend souvent de la façon dont le smile de volatilité évolue dans le temps, pas seulement de sa forme à l'instant présent.",
    en: "The model choice directly impacts the pricing and hedging of exotic products (M09-M11), whose value often depends on how the volatility smile evolves over time, not just its shape at the present instant.",
  },
  example: {
    fr: "Une banque doit pricer une option exotique dont la valeur dépend fortement de la façon dont le smile va se déformer au fur et à mesure que le sous-jacent bouge (une option \"forward start\", par exemple). Un modèle de vol locale, bien qu'il colle parfaitement aux prix vanilles d'aujourd'hui, prédit un aplatissement du smile futur qui contredit systématiquement l'observation empirique — un modèle de vol stochastique (ou une combinaison des deux, \"local-stochastique\") donne une dynamique plus réaliste.",
    en: "A bank must price an exotic option whose value strongly depends on how the smile will deform as the underlying moves (a \"forward start\" option, for example). A local vol model, although perfectly fitting today's vanilla prices, predicts a future smile flattening that systematically contradicts empirical observation — a stochastic vol model (or a combination of both, \"local-stochastic\") gives more realistic dynamics.",
  },
  alternativeExplanation: {
    fr: "La vol locale, c'est comme dessiner une carte météo qui explique parfaitement le temps qu'il a fait AUJOURD'HUI partout sur le territoire, mais qui suppose ensuite que ce temps évoluera de façon totalement déterministe (sans nouvel aléa). La vol stochastique, c'est accepter que la météo de demain comporte elle-même une part d'incertitude propre, en plus de celle déjà présente aujourd'hui — un modèle moins \"parfait\" sur l'instant, mais plus honnête sur le futur.",
    en: "Local vol is like drawing a weather map that perfectly explains TODAY's weather everywhere on the territory, but then assumes that weather will evolve in a fully deterministic way (with no new randomness). Stochastic vol is accepting that tomorrow's weather itself carries its own layer of uncertainty, on top of what's already present today — a less \"perfect\" model for the instant, but more honest about the future.",
  },
  formula: {
    latex: "\\sigma_{\\text{loc}}^{2}(K,T) = \\frac{\\partial_T C + rK\\partial_K C}{\\frac{1}{2}K^{2}\\partial_{KK} C}",
    variables: [
      { symbol: "C(K,T)", description: { fr: "Prix de marché du call de strike K et échéance T (supposé connu en continu)", en: "The market price of the call with strike K and maturity T (assumed known continuously)" } },
      { symbol: "\\partial_T C, \\partial_K C, \\partial_{KK} C", description: { fr: "Dérivées du prix par rapport à l'échéance, au strike, et dérivée seconde au strike", en: "Price derivatives with respect to maturity, strike, and the second derivative in strike" } },
    ],
    assumptions: { fr: "Formule de Dupire, valable si les prix C(K,T) sont connus (ou interpolés) pour tous K et T ; en pratique, dérive numériquement sur une surface interpolée.", en: "Dupire's formula, valid if prices C(K,T) are known (or interpolated) for all K and T; in practice, computed numerically on an interpolated surface." },
    units: { fr: "σ²_loc en proportion annuelle au carré.", en: "σ²_loc as an annual proportion squared." },
    example: { fr: "Illustration simplifiée (taux r=0, grille grossière, PAS une calibration de marché réelle) : C(95,T=1)=8,5 ; C(100,T=1)=6,0 ; C(105,T=1)=4,0 ; C(100,T=1,1)=6,4. ∂_T C≈(6,4−6,0)/0,1=4,0. ∂_KK C≈(8,5−2×6,0+4,0)/5²=0,5/25=0,02. σ²_loc(100,1)≈4,0/(0,5×100²×0,02)=4,0/100=0,04, soit σ_loc=√0,04=20% — un résultat plausible, obtenu ici sur une grille grossière à but pédagogique ; une calibration réelle utilise une surface beaucoup plus dense.", en: "Simplified illustration (rate r=0, coarse grid, NOT a real market calibration): C(95,T=1)=8.5; C(100,T=1)=6.0; C(105,T=1)=4.0; C(100,T=1.1)=6.4. ∂_T C≈(6.4−6.0)/0.1=4.0. ∂_KK C≈(8.5−2×6.0+4.0)/5²=0.5/25=0.02. σ²_loc(100,1)≈4.0/(0.5×100²×0.02)=4.0/100=0.04, i.e. σ_loc=√0.04=20% — a plausible result, obtained here on a coarse grid for teaching purposes; a real calibration uses a much denser surface." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Strike / Spot (%)", en: "Strike / Spot (%)" },
    yLabel: { fr: "Volatilité implicite (%)", en: "Implied volatility (%)" },
    series: [
      {
        label: { fr: "Smile actuel (marché)", en: "Current smile (market)" },
        points: [
          { x: 80, y: 28 },
          { x: 90, y: 24 },
          { x: 100, y: 20 },
          { x: 110, y: 22 },
          { x: 120, y: 26 },
        ],
      },
      {
        label: { fr: "Smile futur prédit (vol locale, trop plat)", en: "Predicted future smile (local vol, too flat)" },
        points: [
          { x: 80, y: 21 },
          { x: 90, y: 20.5 },
          { x: 100, y: 20 },
          { x: 110, y: 20.5 },
          { x: 120, y: 21 },
        ],
      },
      {
        label: { fr: "Smile futur prédit (vol stochastique, persistant)", en: "Predicted future smile (stochastic vol, persistent)" },
        points: [
          { x: 80, y: 27 },
          { x: 90, y: 23.5 },
          { x: 100, y: 19.5 },
          { x: 110, y: 21.5 },
          { x: 120, y: 25 },
        ],
      },
    ],
  },
  calculation: {
    fr: "1) Construire (ou interpoler) une surface de prix d'options vanilles C(K,T) arbitrage-free (voir M08-3). 2) Calculer numériquement les dérivées ∂_T C, ∂_K C et ∂_KK C sur cette surface : par exemple ∂_T C≈4,0 et ∂_KK C≈0,02 sur notre grille illustrative. 3) Assembler selon la formule de Dupire pour obtenir σ²_loc(K,T) en chaque point : ici σ_loc(100,1)≈20%. 4) Utiliser cette fonction de volatilité locale pour pricer et couvrir des produits exotiques par Monte-Carlo (M06-7) ou différences finies.",
    en: "1) Build (or interpolate) an arbitrage-free vanilla option price surface C(K,T) (see M08-3). 2) Numerically compute the derivatives ∂_T C, ∂_K C and ∂_KK C on this surface: e.g. ∂_T C≈4.0 and ∂_KK C≈0.02 on our illustrative grid. 3) Assemble per Dupire's formula to get σ²_loc(K,T) at each point: here σ_loc(100,1)≈20%. 4) Use this local volatility function to price and hedge exotic products via Monte-Carlo (M06-7) or finite differences.",
  },
  interpretation: {
    fr: "Le modèle de vol locale est mathématiquement remarquable (une seule fonction déterministe suffit à répliquer tous les prix vanilles cotés), mais sa dynamique implicite du smile futur est connue pour être irréaliste (le smile s'aplatit trop vite). Le modèle de vol stochastique corrige ce défaut au prix d'une calibration plus difficile (plusieurs paramètres à ajuster, pas de formule fermée systématique) — un compromis fondamental entre fidélité statique et réalisme dynamique.",
    en: "The local vol model is mathematically remarkable (a single deterministic function suffices to replicate all quoted vanilla prices), but its implied dynamics for the future smile are known to be unrealistic (the smile flattens too quickly). The stochastic vol model fixes this flaw at the cost of harder calibration (several parameters to fit, no systematic closed form) — a fundamental trade-off between static fidelity and dynamic realism.",
  },
  pitfalls: {
    fr: "Croire qu'un modèle de vol locale, parce qu'il colle parfaitement aux prix vanilles actuels, donne automatiquement une couverture fiable pour des produits exotiques : sa dynamique de smile erronée peut conduire à des erreurs de couverture significatives sur des produits sensibles à cette dynamique. Autre piège : penser que la vol stochastique élimine tout compromis — elle reste un modèle, avec ses propres limites et un risque de mauvaise calibration si les paramètres ne sont pas bien estimés.",
    en: "Believing a local vol model, because it perfectly fits current vanilla prices, automatically gives reliable hedging for exotic products: its flawed smile dynamics can lead to significant hedging errors on products sensitive to that dynamic. Another trap: thinking stochastic vol eliminates all trade-offs — it remains a model, with its own limits and a mis-calibration risk if parameters aren't well estimated.",
  },
  keyPoints: {
    fr: [
      "Vol locale (Dupire) : fonction déterministe σ(S,t), colle exactement aux prix vanilles d'aujourd'hui.",
      "Vol stochastique (Heston...) : la volatilité a sa propre source d'aléa, dynamique de smile plus réaliste.",
      "Compromis fondamental : fidélité statique (vol locale) vs réalisme dynamique (vol stochastique).",
    ],
    en: [
      "Local vol (Dupire): a deterministic function σ(S,t), exactly fits today's vanilla prices.",
      "Stochastic vol (Heston...): volatility has its own source of randomness, more realistic smile dynamics.",
      "Fundamental trade-off: static fidelity (local vol) vs dynamic realism (stochastic vol).",
    ],
  },
  businessApplication: {
    fr: "Un desk exotiques choisit le modèle utilisé pour pricer un produit spécifiquement en fonction de sa sensibilité à la dynamique du smile : un produit peu sensible à cette dynamique (barrière simple proche de l'échéance) peut être raisonnablement prické en vol locale, tandis qu'un produit fortement sensible (forward start, cliquet) exige un modèle de vol stochastique ou local-stochastique, sous peine d'une erreur de couverture significative et récurrente.",
    en: "An exotics desk chooses the model used to price a specific product based on its sensitivity to smile dynamics: a product with low sensitivity to this dynamic (a simple barrier near expiry) can reasonably be priced with local vol, while a highly sensitive product (forward start, cliquet) requires a stochastic or local-stochastic vol model, or risks a significant, recurring hedging error.",
  },
  interviewQuestion: {
    question: "A local volatility model perfectly reprices every vanilla option quoted in the market today. Does that mean it's the right model to use for pricing an exotic option?",
    answer: "Not necessarily. Fitting today's vanilla prices exactly only tells you the model is consistent with the current static snapshot of the market — it says nothing about whether the model correctly predicts how the smile will evolve as time passes and the underlying moves, which is exactly what many exotic payoffs, like forward-start options, actually depend on. Local vol is known to predict a future smile that flattens unrealistically fast, which is a bad approximation of what markets actually do. A stochastic volatility model like Heston sacrifices a bit of that perfect fit to today's prices in exchange for much more realistic smile dynamics over time. So the right choice depends on how sensitive the specific exotic is to smile dynamics — for that, I'd lean stochastic or local-stochastic, not pure local vol, despite its perfect static fit.",
  },
  advancedDemonstration: {
    fr: "Les modèles \"local-stochastiques\" (LSV, combinant les deux approches) cherchent à obtenir le meilleur des deux mondes : une composante stochastique pour une dynamique réaliste, ajustée par une fonction de \"leverage\" locale pour retrouver un ajustement exact aux prix vanilles cotés — une approche aujourd'hui standard sur de nombreux desks exotiques. Le modèle de Heston lui-même suppose que la variance instantanée suit un processus de retour à la moyenne (mean-reverting, de type Cox-Ingersoll-Ross), ce qui produit naturellement une forme de smile réaliste avec des paramètres interprétables (vitesse de retour à la moyenne, volatilité de la volatilité, corrélation entre le sous-jacent et sa volatilité — cette dernière étant directement responsable de l'asymétrie du smile généré).",
    en: "\"Local-stochastic\" (LSV, combining both approaches) models seek to get the best of both worlds: a stochastic component for realistic dynamics, adjusted by a local \"leverage\" function to recover an exact fit to quoted vanilla prices — an approach now standard on many exotics desks. The Heston model itself assumes instantaneous variance follows a mean-reverting process (Cox-Ingersoll-Ross type), which naturally produces a realistic smile shape with interpretable parameters (mean-reversion speed, vol-of-vol, correlation between the underlying and its volatility — the latter directly responsible for the generated smile's asymmetry).",
  },
};
