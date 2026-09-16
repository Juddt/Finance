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
    fr: "Avec seulement deux actifs (actions et obligations), faire varier le poids des actions de 0% à 100% dessine une courbe reliant le point \"100% obligations\" au point \"100% actions\" : cette courbe n'est pas une ligne droite (sauf corrélation parfaite de 1), elle se courbe vers la gauche grâce au bénéfice de diversification — c'est précisément cette courbure qui permet, pour un rendement cible donné, d'obtenir moins de risque qu'une simple moyenne pondérée des deux actifs pris isolément.",
    en: "With just two assets (stocks and bonds), varying the stock weight from 0% to 100% traces a curve connecting the \"100% bonds\" point to the \"100% stocks\" point: this curve isn't a straight line (except for perfect correlation of 1), it bows leftward thanks to the diversification benefit — it's precisely this curvature that, for a given target return, achieves less risk than a simple weighted average of the two assets taken individually.",
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
    example: { fr: "Faire varier μ_cible et résoudre à chaque fois donne un point de la frontière ; relier tous ces points dessine la courbe complète.", en: "Varying μ_cible and solving each time gives one frontier point; connecting all these points traces the full curve." },
  },
  calculation: {
    fr: "1) Estimer les rendements espérés, volatilités et corrélations de tous les actifs candidats. 2) Construire la matrice de covariance Σ. 3) Pour une grille de rendements cibles, résoudre le problème d'optimisation quadratique (minimiser wᵀΣw sous contrainte de rendement et de somme des poids égale à 1). 4) Tracer l'ensemble des solutions pour obtenir la frontière efficiente complète.",
    en: "1) Estimate all candidate assets' expected returns, volatilities and correlations. 2) Build the covariance matrix Σ. 3) For a grid of target returns, solve the quadratic optimization problem (minimize wᵀΣw subject to the return constraint and weights summing to 1). 4) Plot the set of solutions to get the full efficient frontier.",
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
};
