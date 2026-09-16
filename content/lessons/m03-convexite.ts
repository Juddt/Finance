import type { LessonContent } from "@/lib/lesson-types";

export const m03Convexite: LessonContent = {
  conceptId: "m03-convexite",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion prolonge directement la duration modifiée : assurez-vous de savoir ce qu'elle mesure et comment l'utiliser pour approximer une variation de prix.",
      en: "This concept directly extends modified duration: make sure you know what it measures and how to use it to approximate a price change.",
    },
    conceptIds: ["m03-duration"],
  },
  glossary: [
    { term: { fr: "Approximation du premier ordre", en: "First-order approximation" }, definition: { fr: "Une estimation basée uniquement sur la pente (dérivée première) — ici, la duration — qui devient imprécise pour de grandes variations.", en: "An estimate based only on the slope (first derivative) — here, duration — which becomes inaccurate for large changes." } },
  ],
  intuition: {
    fr: "La relation prix-taux d'une obligation n'est pas une droite, c'est une courbe légèrement incurvée vers le haut. La duration seule trace une droite tangente à cette courbe ; la convexité corrige cette approximation pour les variations de taux plus importantes.",
    en: "A bond's price-yield relationship is not a straight line, it is a curve slightly bowed upward. Duration alone draws a straight line tangent to that curve; convexity corrects this approximation for larger rate moves.",
  },
  definition: {
    fr: "La convexité mesure la courbure de la relation prix-taux : c'est la dérivée seconde du prix par rapport au rendement, normalisée par le prix. Combinée à la duration modifiée, elle permet une meilleure approximation de la variation de prix : ΔP/P ≈ −D_mod × Δy + ½ × Convexité × Δy².",
    en: "Convexity measures the curvature of the price-yield relationship: the second derivative of price with respect to yield, normalized by price. Combined with modified duration, it gives a better approximation of the price change: ΔP/P ≈ −D_mod × Δy + ½ × Convexity × Δy².",
  },
  utility: {
    fr: "Pour des variations de taux importantes (crise, choc de politique monétaire), l'approximation par la seule duration devient trop imprécise : la convexité affine l'estimation et explique pourquoi une obligation convexe protège mieux en cas de hausse des taux qu'elle ne pénalise en cas de baisse.",
    en: "For large rate moves (a crisis, a monetary policy shock), the duration-only approximation becomes too imprecise: convexity refines the estimate and explains why a convex bond protects better against a rate rise than it costs in a rate fall.",
  },
  example: {
    fr: "Obligation : P0 = 973,28 EUR, D_mod = 2,79, Convexité = 9,6. Les taux montent de 200 points de base (Δy = +0,02). Approximation par duration seule : ΔP/P ≈ −2,79 × 0,02 = −5,58%. Avec la convexité : ΔP/P ≈ −5,58% + ½ × 9,6 × 0,02² = −5,58% + 0,19% = −5,39% : la perte réelle est un peu moins sévère que ce que prédit la duration seule.",
    en: "Bond: P0 = EUR 973.28, D_mod = 2.79, Convexity = 9.6. Rates rise by 200 basis points (Δy = +0.02). Duration-only approximation: ΔP/P ≈ −2.79 × 0.02 = −5.58%. With convexity: ΔP/P ≈ −5.58% + ½ × 9.6 × 0.02² = −5.58% + 0.19% = −5.39%: the actual loss is a bit less severe than duration alone predicts.",
  },
  alternativeExplanation: {
    fr: "Imaginez conduire sur une route qui tourne légèrement. La duration, c'est rouler tout droit dans la direction où pointe le volant à l'instant présent — correct sur une courte distance. La convexité, c'est le fait que la route tourne réellement : plus vous avancez (plus Δy est grand), plus l'écart entre la ligne droite et la vraie route se creuse, et cet écart joue toujours en faveur du porteur obligataire (le prix baisse moins qu'attendu en cas de hausse des taux, et monte plus qu'attendu en cas de baisse).",
    en: "Imagine driving on a road that curves slightly. Duration is driving straight in the direction the wheel points right now — accurate over a short distance. Convexity is the fact that the road actually curves: the further you go (the bigger Δy is), the wider the gap between the straight line and the real road — and that gap always works in the bondholder's favor (the price falls less than expected when rates rise, and rises more than expected when rates fall).",
  },
  formula: {
    latex: "\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\times \\Delta y + \\frac{1}{2} \\times C \\times \\Delta y^{2}",
    variables: [
      { symbol: "D_{\\text{mod}}", description: { fr: "Duration modifiée de l'obligation", en: "The bond's modified duration" } },
      { symbol: "C", description: { fr: "Convexité de l'obligation", en: "The bond's convexity" } },
      { symbol: "\\Delta y", description: { fr: "Variation du rendement (en proportion, ex. +0,02 pour +200 pb)", en: "Change in yield (as a proportion, e.g. +0.02 for +200 bp)" } },
    ],
    assumptions: { fr: "Développement de Taylor au second ordre ; suppose un déplacement parallèle et instantané de la courbe des taux.", en: "Second-order Taylor expansion; assumes a parallel, instantaneous shift of the yield curve." },
    units: { fr: "ΔP/P en proportion (multiplier par 100 pour un pourcentage) ; Δy en proportion (200 pb = 0,02).", en: "ΔP/P as a proportion (multiply by 100 for a percentage); Δy as a proportion (200 bp = 0.02)." },
    example: { fr: "D_mod=2,79, C=9,6, Δy=0,02 : ΔP/P ≈ −5,58% + 0,19% = −5,39%.", en: "D_mod=2.79, C=9.6, Δy=0.02: ΔP/P ≈ −5.58% + 0.19% = −5.39%." },
  },
  calculation: {
    fr: "1) Calculer le terme de duration : −D_mod × Δy. 2) Calculer le terme de convexité : ½ × C × Δy². 3) Additionner les deux termes pour obtenir ΔP/P. 4) Multiplier par P0 pour obtenir la variation de prix en valeur, puis par 100 pour un pourcentage.",
    en: "1) Compute the duration term: −D_mod × Δy. 2) Compute the convexity term: ½ × C × Δy². 3) Add the two terms to get ΔP/P. 4) Multiply by P0 to get the price change in value, and by 100 for a percentage.",
  },
  interpretation: {
    fr: "Le terme de convexité est toujours positif (car Δy² ≥ 0 et C > 0 pour une obligation classique) : il adoucit systématiquement les pertes en cas de hausse des taux et amplifie systématiquement les gains en cas de baisse. Plus une obligation est convexe, plus cet effet protecteur est marqué — une qualité recherchée, toutes choses égales par ailleurs.",
    en: "The convexity term is always positive (since Δy² ≥ 0 and C > 0 for a plain-vanilla bond): it systematically softens losses when rates rise and systematically amplifies gains when rates fall. The more convex a bond, the more pronounced this protective effect — a desirable trait, all else equal.",
  },
  pitfalls: {
    fr: "Oublier le facteur ½ devant la convexité dans la formule. Autre piège fréquent : croire que la convexité peut être négative pour une obligation classique sans option intégrée (call/put) — ce n'est le cas que pour des instruments particuliers comme les obligations remboursables par anticipation (callable).",
    en: "Forgetting the ½ factor in front of convexity in the formula. Another common trap: thinking convexity can be negative for a plain-vanilla bond with no embedded option (call/put) — this only happens for special instruments like callable bonds.",
  },
  keyPoints: {
    fr: [
      "La convexité corrige l'approximation par duration seule, surtout utile pour de grandes variations de taux.",
      "ΔP/P ≈ −D_mod × Δy + ½ × C × Δy² : le terme de convexité est toujours favorable au porteur.",
      "Plus une obligation est convexe, mieux elle protège en cas de hausse des taux et profite en cas de baisse.",
    ],
    en: [
      "Convexity corrects the duration-only approximation, especially useful for large rate moves.",
      "ΔP/P ≈ −D_mod × Δy + ½ × C × Δy²: the convexity term always favors the bondholder.",
      "The more convex a bond, the better it protects against a rate rise and benefits from a rate fall.",
    ],
  },
  advancedDemonstration: {
    fr: "Formellement, la convexité est C = (1/P) × d²P/dy², qui se calcule à partir des flux comme C = (1/P) × Σ [CF_t × t × (t+1)] / (1+y)^(t+2). Pour un nominal fixe, la convexité augmente avec la maturité et diminue avec le taux de coupon (une obligation zéro-coupon a la convexité la plus élevée à maturité donnée, car tout le flux est concentré loin dans le temps). Cette propriété motive des stratégies de gestion obligataire qui \"achètent de la convexité\" (barbell : combiner des obligations courtes et longues plutôt qu'une seule obligation intermédiaire) pour un même niveau de duration, dans le seul but de profiter de ce terme quadratique toujours favorable.",
    en: "Formally, convexity is C = (1/P) × d²P/dy², computed from cash flows as C = (1/P) × Σ [CF_t × t × (t+1)] / (1+y)^(t+2). For a fixed face value, convexity rises with maturity and falls with the coupon rate (a zero-coupon bond has the highest convexity for a given maturity, since all the cash flow is concentrated far out in time). This property motivates bond management strategies that \"buy convexity\" (barbell: combining short and long bonds instead of a single intermediate bond) for the same duration level, purely to benefit from this always-favorable quadratic term.",
  },
};
