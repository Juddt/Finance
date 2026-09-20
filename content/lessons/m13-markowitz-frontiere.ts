import type { LessonContent } from "@/lib/lesson-types";

export const m13MarkowitzFrontiere: LessonContent = {
  conceptId: "m13-markowitz-frontiere",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la formule de variance d'un portefeuille et le rôle de la covariance.",
      en: "You need to know a portfolio's variance formula and covariance's role.",
    },
    conceptIds: ["m13-covariance-diversification"],
  },
  glossary: [
    { term: { fr: "Frontière efficiente", en: "Efficient frontier" }, definition: { fr: "L'ensemble des portefeuilles offrant le meilleur rendement espéré possible pour chaque niveau de risque, ou le risque le plus faible possible pour chaque niveau de rendement.", en: "The set of portfolios offering the best possible expected return for each risk level, or the lowest possible risk for each return level." } },
    { term: { fr: "Portefeuille minimum variance", en: "Minimum variance portfolio" }, definition: { fr: "Le portefeuille situé à l'extrémité gauche de la frontière efficiente, ayant la plus faible volatilité possible parmi tous les portefeuilles réalisables.", en: "The portfolio at the efficient frontier's leftmost point, having the lowest possible volatility among all achievable portfolios." } },
  ],
  intuition: {
    fr: "Parmi toutes les combinaisons possibles de poids entre plusieurs actifs, certaines sont clairement meilleures que d'autres : pour un même niveau de risque, il existe une combinaison qui maximise le rendement espéré, et il est absurde de choisir une combinaison moins bonne. L'ensemble de ces combinaisons optimales dessine une courbe, la frontière efficiente de Markowitz.",
    en: "Among all possible weight combinations between several assets, some are clearly better than others: for a given risk level, there's a combination maximizing expected return, and it's irrational to choose a worse one. The set of these optimal combinations traces a curve, Markowitz's efficient frontier.",
  },
  definition: {
    fr: "Pour un ensemble d'actifs donné (rendements espérés, volatilités, corrélations), la théorie moderne du portefeuille (Markowitz, 1952) cherche, pour chaque niveau de rendement espéré cible, la combinaison de poids qui minimise la variance du portefeuille (M13-gp-a). L'ensemble de ces portefeuilles optimaux forme la frontière efficiente : tout portefeuille situé EN DESSOUS de cette frontière est sous-optimal (un autre portefeuille offre plus de rendement pour le même risque, ou moins de risque pour le même rendement). Le portefeuille situé à l'extrémité gauche de la frontière, celui de variance minimale absolue, est le portefeuille minimum variance.",
    en: "For a given set of assets (expected returns, volatilities, correlations), modern portfolio theory (Markowitz, 1952) seeks, for each target expected return level, the weight combination minimizing the portfolio's variance (M13-gp-a). The set of these optimal portfolios forms the efficient frontier: any portfolio BELOW this frontier is suboptimal (another portfolio offers more return for the same risk, or less risk for the same return). The portfolio at the frontier's leftmost point, the one with absolute minimum variance, is the minimum variance portfolio.",
  },
  utility: {
    fr: "La frontière efficiente formalise mathématiquement l'intuition de diversification (M13-gp-a) en un cadre de décision concret : elle permet à un gérant de portefeuille de choisir objectivement la meilleure allocation possible selon son niveau de tolérance au risque, plutôt que de se fier à une intuition qualitative sur quels actifs combiner.",
    en: "The efficient frontier mathematically formalizes the diversification intuition (M13-gp-a) into a concrete decision framework: it lets a portfolio manager objectively choose the best possible allocation according to their risk tolerance level, rather than relying on qualitative intuition about which assets to combine.",
  },
  example: {
    fr: "Actions (μ=8%, σ=20%) et obligations (μ=3%, σ=6%), corrélation ρ=0,1. À 50%/50% : μ_p=0,5×8%+0,5×3%=5,5% et σ_p²=0,5²×0,20²+0,5²×0,06²+2×0,5×0,5×0,1×0,20×0,06=0,01+0,0009+0,0006=0,0115, soit σ_p=√0,0115≈10,72%. Une moyenne pondérée NAÏVE des volatilités aurait donné 0,5×20%+0,5×6%=13% : le portefeuille réel (10,72%) est nettement moins risqué que cette moyenne naïve pour le même rendement de 5,5%, précisément grâce au bénéfice de diversification — c'est cette courbure qui distingue la frontière efficiente d'une simple ligne droite.",
    en: "Stocks (μ=8%, σ=20%) and bonds (μ=3%, σ=6%), correlation ρ=0.1. At 50%/50%: μ_p=0.5×8%+0.5×3%=5.5% and σ_p²=0.5²×0.20²+0.5²×0.06²+2×0.5×0.5×0.1×0.20×0.06=0.01+0.0009+0.0006=0.0115, i.e. σ_p=√0.0115≈10.72%. A NAIVE weighted average of the volatilities would have given 0.5×20%+0.5×6%=13%: the real portfolio (10.72%) is noticeably less risky than this naive average for the same 5.5% return, precisely thanks to the diversification benefit — this curvature is what distinguishes the efficient frontier from a straight line.",
  },
  alternativeExplanation: {
    fr: "Imaginez un menu de plats où chaque plat a un niveau de \"plaisir\" et un niveau de \"calories\" : la frontière efficiente, c'est l'ensemble des plats qui offrent le maximum de plaisir pour chaque niveau de calories donné — aucun gourmet rationnel ne choisirait un plat moins savoureux à calories égales, quand une meilleure option existe sur cette frontière.",
    en: "Imagine a menu of dishes where each has a \"pleasure\" level and a \"calorie\" level: the efficient frontier is the set of dishes offering maximum pleasure for each given calorie level — no rational food lover would choose a less tasty dish at equal calories, when a better option exists on that frontier.",
  },
  formula: {
    latex: "\\min_{w} \\; w^\\top \\Sigma w \\quad \\text{sous} \\quad w^\\top \\mu = \\mu_{\\text{cible}}, \\; \\sum_i w_i = 1",
    variables: [
      { symbol: "\\Sigma", description: { fr: "Matrice de covariance complète entre tous les actifs", en: "Full covariance matrix between all assets" } },
      { symbol: "\\mu, \\mu_{\\text{cible}}", description: { fr: "Vecteur des rendements espérés de chaque actif, et rendement cible du portefeuille", en: "Vector of each asset's expected return, and the portfolio's target return" } },
    ],
    assumptions: { fr: "Problème d'optimisation quadratique sous contraintes ; résolu pour chaque niveau de rendement cible pour tracer toute la frontière.", en: "Constrained quadratic optimization problem; solved for each target return level to trace the entire frontier." },
    units: { fr: "w sans dimension (poids), Σ en unités de variance.", en: "w dimensionless (weights), Σ in variance units." },
    example: { fr: "w_actions=50% → μ_p=5,5%, σ_p≈10,72% (contre 13% en moyenne naïve non diversifiée) — le gain de diversification est de plus de 2 points de volatilité au même rendement.", en: "w_stocks=50% → μ_p=5.5%, σ_p≈10.72% (versus 13% in a naive non-diversified average) — the diversification gain is over 2 volatility points at the same return." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Risque σ_p (%)", en: "Risk σ_p (%)" },
    yLabel: { fr: "Rendement espéré μ_p (%)", en: "Expected return μ_p (%)" },
    series: [
      {
        label: { fr: "Frontière (actions/obligations, ρ=0,1)", en: "Frontier (stocks/bonds, ρ=0.1)" },
        points: [
          { x: 6, y: 3 },
          { x: 7.05, y: 4.25 },
          { x: 10.72, y: 5.5 },
          { x: 15.22, y: 6.75 },
          { x: 20, y: 8 },
        ],
      },
    ],
  },
  calculation: {
    fr: "1) Estimer les rendements espérés, volatilités et corrélations de tous les actifs candidats : ici μ_actions=8%, σ_actions=20%, μ_obligations=3%, σ_obligations=6%, ρ=0,1. 2) Construire la matrice de covariance Σ. 3) Pour une grille de poids w_actions (0%, 25%, 50%, 75%, 100%), calculer μ_p et σ_p à chaque fois : par exemple à 25% d'actions, μ_p=4,25% et σ_p≈7,05% ; à 75%, μ_p=6,75% et σ_p≈15,22%. 4) Tracer l'ensemble des points (σ_p, μ_p) pour obtenir la frontière efficiente complète — une courbe bombée vers la gauche, jamais une ligne droite (sauf ρ=1).",
    en: "1) Estimate all candidate assets' expected returns, volatilities and correlations: here μ_stocks=8%, σ_stocks=20%, μ_bonds=3%, σ_bonds=6%, ρ=0.1. 2) Build the covariance matrix Σ. 3) For a grid of stock weights (0%, 25%, 50%, 75%, 100%), compute μ_p and σ_p each time: for example at 25% stocks, μ_p=4.25% and σ_p≈7.05%; at 75%, μ_p=6.75% and σ_p≈15.22%. 4) Plot the set of (σ_p, μ_p) points to get the full efficient frontier — a curve bowed leftward, never a straight line (except ρ=1).",
  },
  interpretation: {
    fr: "Un portefeuille situé sur la frontière efficiente est \"optimal\" au sens de Markowitz : aucune réallocation ne peut l'améliorer sans dégrader soit le rendement, soit le risque. En pratique, la position choisie sur cette frontière (plus proche du portefeuille minimum variance ou plus loin vers un rendement élevé) dépend de l'aversion au risque propre à chaque investisseur.",
    en: "A portfolio on the efficient frontier is \"optimal\" in Markowitz's sense: no reallocation can improve it without worsening either return or risk. In practice, the chosen position on this frontier (closer to the minimum variance portfolio or further toward a high return) depends on each investor's own risk aversion.",
  },
  pitfalls: {
    fr: "Estimer les rendements espérés futurs à partir des seuls rendements historiques passés, une pratique notoirement peu fiable (les rendements passés prédisent mal les rendements futurs, contrairement aux volatilités et corrélations, relativement plus stables). Autre piège : la frontière de Markowitz est très sensible aux erreurs d'estimation des rendements espérés, produisant parfois des allocations extrêmes et peu robustes en pratique (concentration excessive sur quelques actifs).",
    en: "Estimating future expected returns solely from past historical returns, a notoriously unreliable practice (past returns poorly predict future returns, unlike volatilities and correlations, relatively more stable). Another trap: the Markowitz frontier is highly sensitive to expected-return estimation errors, sometimes producing extreme, poorly robust allocations in practice (excessive concentration on a few assets).",
  },
  keyPoints: {
    fr: [
      "La frontière efficiente est l'ensemble des portefeuilles offrant le meilleur rendement pour chaque niveau de risque.",
      "Elle se construit en résolvant un problème d'optimisation quadratique sous contraintes pour chaque rendement cible.",
      "Elle est très sensible aux erreurs d'estimation des rendements espérés, une limite pratique majeure de la méthode.",
    ],
    en: [
      "The efficient frontier is the set of portfolios offering the best return for each risk level.",
      "It's built by solving a constrained quadratic optimization problem for each target return.",
      "It's highly sensitive to expected-return estimation errors, a major practical limitation of the method.",
    ],
  },
  advancedDemonstration: {
    fr: "L'ajout d'un actif sans risque (taux sans risque r_f, M03) transforme radicalement la frontière : au lieu d'une courbe, la combinaison optimale devient une droite (la Capital Market Line) tangente à la frontière de Markowitz des actifs risqués, reliant l'actif sans risque à un unique portefeuille risqué optimal (le portefeuille tangent) — un résultat central appelé théorème de séparation, qui stipule que tout investisseur rationnel, quel que soit son aversion au risque, devrait détenir la même composition d'actifs risqués (le portefeuille tangent), et ajuster son risque global uniquement via la proportion investie dans l'actif sans risque. Ce résultat est directement à l'origine du CAPM (M13-gp-c).",
    en: "Adding a risk-free asset (risk-free rate r_f, M03) radically transforms the frontier: instead of a curve, the optimal combination becomes a line (the Capital Market Line) tangent to the risky-assets Markowitz frontier, connecting the risk-free asset to a single optimal risky portfolio (the tangency portfolio) — a central result called the separation theorem, stating that any rational investor, whatever their risk aversion, should hold the same risky-asset composition (the tangency portfolio), and adjust their overall risk only via the proportion invested in the risk-free asset. This result directly underlies CAPM (M13-gp-c).",
  },
  businessApplication: {
    fr: "Un allocataire d'actifs (asset allocator) utilise concrètement cette optimisation pour proposer une allocation stratégique à un client selon son profil de risque : au lieu de recommander arbitrairement \"60% actions / 40% obligations\", il résout le problème de Markowitz avec les rendements, volatilités et corrélations estimés pour identifier objectivement la combinaison de poids optimale pour le niveau de risque cible du client.",
    en: "An asset allocator concretely uses this optimization to propose a strategic allocation to a client based on their risk profile: instead of arbitrarily recommending \"60% stocks / 40% bonds\", they solve the Markowitz problem with estimated returns, volatilities and correlations to objectively identify the optimal weight combination for the client's target risk level.",
  },
  interviewQuestion: {
    question: "Why does combining two assets in a portfolio usually produce less risk than the weighted average of their individual volatilities? Walk me through the intuition and the math.",
    answer: "It comes down to correlation being less than 1. Portfolio variance is w1²σ1² + w2²σ2² + 2w1w2ρσ1σ2 — if the assets were perfectly correlated (ρ=1), this would collapse exactly to (w1σ1+w2σ2)², so portfolio volatility would just be the weighted average. But whenever ρ is below 1, that cross term is smaller than it would be at perfect correlation, so the portfolio's actual volatility comes out below the naive weighted average — that gap is the diversification benefit. For example, mixing 50% of an asset at 20% vol with 50% of one at 6% vol, at a correlation of 0.1, gives a portfolio volatility around 10.7%, well below the 13% naive average — because when one asset has a bad day, the other doesn't move nearly as much in the same direction, so their combined swings partly cancel out.",
  },
};
