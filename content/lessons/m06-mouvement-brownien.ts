import type { LessonContent } from "@/lib/lesson-types";

export const m06MouvementBrownien: LessonContent = {
  conceptId: "m06-mouvement-brownien",
  glossary: [
    { term: { fr: "Accroissement (increment)", en: "Increment" }, definition: { fr: "La variation W_t − W_s d'un processus entre deux instants s < t.", en: "The change W_t − W_s of a process between two times s < t." } },
    { term: { fr: "Processus stochastique", en: "Stochastic process" }, definition: { fr: "Une famille de variables aléatoires indexée par le temps, décrivant l'évolution incertaine d'une quantité.", en: "A family of random variables indexed by time, describing a quantity's uncertain evolution." } },
  ],
  intuition: {
    fr: "Le mouvement brownien modélise une trajectoire qui bouge sans cesse de façon imprévisible, sans jamais garder de mémoire de la direction qu'elle vient de prendre : à chaque instant, l'avenir est aussi incertain que si on repartait de zéro.",
    en: "Brownian motion models a path that keeps moving unpredictably, with no memory of the direction it just took: at every instant, the future is as uncertain as if starting fresh.",
  },
  definition: {
    fr: "Un mouvement brownien standard (W_t) est un processus continu tel que W_0 = 0, ses accroissements sont indépendants et stationnaires, et pour tout s < t, W_t − W_s suit une loi normale de moyenne 0 et de variance (t − s). Ses trajectoires sont continues mais nulle part dérivables : \"infiniment dentelées\" à toute échelle.",
    en: "A standard Brownian motion (W_t) is a continuous process such that W_0 = 0, its increments are independent and stationary, and for any s < t, W_t − W_s follows a normal distribution with mean 0 and variance (t − s). Its paths are continuous but nowhere differentiable: \"infinitely jagged\" at every scale.",
  },
  utility: {
    fr: "C'est la brique de base de toute la finance quantitative moderne : le modèle de Black-Scholes (M06-4), le lemme d'Itô (M06-3) et la simulation Monte-Carlo (M06-7) reposent tous directement sur le mouvement brownien pour modéliser l'incertitude des prix d'actifs dans le temps.",
    en: "It is the foundational building block of modern quantitative finance: the Black-Scholes model (M06-4), Itô's lemma (M06-3) and Monte-Carlo simulation (M06-7) all directly rely on Brownian motion to model asset price uncertainty over time.",
  },
  example: {
    fr: "Le grain de pollen observé par Robert Brown en 1827, ballotté sans cesse par les chocs des molécules d'eau environnantes, a donné son nom au phénomène. En finance, ce n'est pas le prix lui-même mais souvent son logarithme qui suit un mouvement brownien (avec dérive), pour garantir que le prix reste positif — voir M06-2.",
    en: "The pollen grain observed by Robert Brown in 1827, constantly jostled by surrounding water molecules, gave the phenomenon its name. In finance, it is often not the price itself but its logarithm that follows a Brownian motion (with drift), to guarantee the price stays positive — see M06-2.",
  },
  alternativeExplanation: {
    fr: "Imaginez lancer une pièce toutes les millisecondes et avancer d'un pas minuscule à droite (pile) ou à gauche (face) : en accélérant ce jeu à l'infini (des pas de plus en plus petits, de plus en plus fréquents), la trajectoire cumulée converge vers un mouvement brownien. C'est une marche aléatoire poussée à sa limite continue.",
    en: "Picture flipping a coin every millisecond and taking a tiny step right (heads) or left (tails): speeding this game up to infinity (smaller, more frequent steps) makes the cumulative path converge to a Brownian motion. It is a random walk pushed to its continuous limit.",
  },
  formula: {
    latex: "W_t \\sim \\mathcal{N}(0, t) \\quad ; \\quad \\text{Cov}(W_s, W_t) = \\min(s,t)",
    variables: [
      { symbol: "W_t", description: { fr: "Position du mouvement brownien à l'instant t", en: "The Brownian motion's position at time t" } },
      { symbol: "\\min(s,t)", description: { fr: "Le plus petit des deux instants s et t", en: "The smaller of the two times s and t" } },
    ],
    assumptions: { fr: "W_0 = 0 ; accroissements indépendants et stationnaires ; trajectoires continues presque sûrement.", en: "W_0 = 0; independent and stationary increments; paths continuous almost surely." },
    units: { fr: "W_t sans dimension (ou dans l'unité du processus modélisé) ; t en années ou fraction d'année.", en: "W_t dimensionless (or in the modeled process's unit); t in years or a fraction of a year." },
    example: { fr: "À t=1 an, W_1 suit une loi normale d'écart-type 1 ; à t=0,25 an, l'écart-type est √0,25 = 0,5.", en: "At t=1 year, W_1 follows a normal distribution with standard deviation 1; at t=0.25 year, the standard deviation is √0.25 = 0.5." },
  },
  calculation: {
    fr: "1) Pour simuler une trajectoire, discrétiser le temps en petits pas Δt. 2) À chaque pas, tirer Z ~ N(0,1). 3) Mettre à jour : W_{t+Δt} = W_t + √Δt × Z. 4) Répéter pour construire la trajectoire complète — c'est l'algorithme de simulation le plus simple d'un mouvement brownien.",
    en: "1) To simulate a path, discretize time into small steps Δt. 2) At each step, draw Z ~ N(0,1). 3) Update: W_{t+Δt} = W_t + √Δt × Z. 4) Repeat to build the full path — the simplest simulation algorithm for Brownian motion.",
  },
  interpretation: {
    fr: "La variance croît linéairement avec le temps (Var = t), donc l'écart-type croît en √t : c'est pourquoi l'incertitude sur un horizon 4 fois plus long n'est multipliée que par 2, pas par 4 — une propriété qui structure toute la théorie de la volatilité (M08).",
    en: "Variance grows linearly with time (Var = t), so the standard deviation grows as √t: this is why uncertainty over a horizon 4 times longer is only multiplied by 2, not 4 — a property that structures all of volatility theory (M08).",
  },
  pitfalls: {
    fr: "Croire que le mouvement brownien peut être dérivé comme une fonction usuelle (calculer \"dW_t/dt\") : ses trajectoires sont nulle part dérivables, ce qui est justement la raison d'être du calcul stochastique et du lemme d'Itô (M06-3). Autre piège : confondre l'indépendance des accroissements avec l'indépendance des valeurs W_t elles-mêmes (qui sont, elles, fortement corrélées dans le temps).",
    en: "Believing Brownian motion can be differentiated like an ordinary function (computing \"dW_t/dt\"): its paths are nowhere differentiable, which is precisely why stochastic calculus and Itô's lemma (M06-3) exist. Another trap: confusing the independence of increments with independence of the values W_t themselves (which are, in fact, strongly correlated over time).",
  },
  keyPoints: {
    fr: [
      "W_0 = 0, accroissements indépendants, W_t − W_s ~ N(0, t−s) : la définition complète d'un brownien standard.",
      "Trajectoires continues mais nulle part dérivables — d'où le besoin du calcul stochastique (Itô).",
      "L'écart-type croît en √t, pas en t : l'incertitude ralentit relativement avec l'horizon.",
    ],
    en: [
      "W_0 = 0, independent increments, W_t − W_s ~ N(0, t−s): the complete definition of a standard Brownian motion.",
      "Continuous but nowhere-differentiable paths — hence the need for stochastic calculus (Itô).",
      "The standard deviation grows as √t, not t: uncertainty relatively slows down with the horizon.",
    ],
  },
  advancedDemonstration: {
    fr: "Cette non-dérivabilité se justifie intuitivement : sur un petit intervalle Δt, l'accroissement typique est d'ordre √Δt (l'écart-type), donc le taux de variation (accroissement/Δt) est d'ordre 1/√Δt, qui diverge vers l'infini quand Δt → 0. C'est cette même échelle en √Δt qui explique pourquoi, dans le lemme d'Itô, le terme du second ordre (dW_t)² ne s'annule pas au premier ordre comme en calcul classique, mais se comporte comme dt — la clé de voûte de toute la construction qui mène à l'équation de Black-Scholes (M06-3, M06-4).",
    en: "This non-differentiability can be justified intuitively: over a small interval Δt, the typical increment is of order √Δt (the standard deviation), so the rate of change (increment/Δt) is of order 1/√Δt, which diverges to infinity as Δt → 0. This same √Δt scale is why, in Itô's lemma, the second-order term (dW_t)² does not vanish at first order as in ordinary calculus, but behaves like dt — the keystone of the entire construction leading to the Black-Scholes equation (M06-3, M06-4).",
  },
};
