import type { LessonContent } from "@/lib/lesson-types";

export const m10DoublesBarrieres: LessonContent = {
  conceptId: "m10-doubles-barrieres",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les mécanismes des options à barrière simple.",
      en: "You need to know single-barrier option mechanics.",
    },
    conceptIds: ["m10-mecanismes-barrieres"],
  },
  glossary: [
    { term: { fr: "Corridor", en: "Corridor" }, definition: { fr: "L'intervalle de prix entre les deux barrières, à l'intérieur duquel le sous-jacent doit rester pour que l'option double-barrière reste active.", en: "The price range between the two barriers, within which the underlying must stay for the double-barrier option to remain active." } },
  ],
  intuition: {
    fr: "Une option à double barrière ajoute une seconde condition à une barrière simple : au lieu de surveiller un seul niveau, on surveille un COULOIR de prix — l'option reste vivante seulement si le sous-jacent reste à l'intérieur de ce couloir tout au long de sa vie.",
    en: "A double-barrier option adds a second condition to a single barrier: instead of watching one level, you watch a PRICE CORRIDOR — the option stays alive only if the underlying remains inside that corridor throughout its life.",
  },
  definition: {
    fr: "Une option double-barrière knock-out a deux barrières, une supérieure H_up et une inférieure H_down (H_down < S0 < H_up). L'option est knock-out (perd toute sa valeur, sauf rebate) dès que le sous-jacent touche H_up OU H_down, à n'importe quel moment avant l'échéance. La version knock-in symétrique ne s'active que si l'une des deux barrières est touchée.",
    en: "A double-barrier knock-out option has two barriers, an upper H_up and a lower H_down (H_down < S0 < H_up). The option is knocked out (loses all its value, except for a rebate) as soon as the underlying touches EITHER H_up OR H_down, at any point before expiry. The symmetric knock-in version only activates if either barrier is touched.",
  },
  utility: {
    fr: "Les doubles-barrières permettent d'exprimer une vue de marché très ciblée : \"je crois que le marché va rester dans une fourchette précise\", en échange d'une prime beaucoup plus faible qu'une option à barrière simple — mais avec un risque de knock-out accru, puisqu'il y a désormais DEUX façons de déclencher la sortie.",
    en: "Double barriers let you express a very targeted market view: \"I believe the market will stay within a precise range\", in exchange for a much lower premium than a single-barrier option — but with increased knock-out risk, since there are now TWO ways to trigger the exit.",
  },
  example: {
    fr: "Une action à 100 avec un call double knock-out de strike K=100, barrières à 85 et 120, rebate=2 (par action), sur 1 000 actions de notionnel. Si l'action évolue entre 90 et 115 pendant toute la durée du contrat et termine à 110, l'option reste vivante et paie max(110−100,0)=10 par action, soit 10×1 000=10 000. Mais si l'action grimpe brièvement à 121 à un moment quelconque (même une seule minute), l'option est immédiatement et définitivement knock-out : elle ne paie que le rebate, 2×1 000=2 000, quelle que soit son évolution ultérieure — y compris si elle retombe ensuite à 110, où elle aurait sinon valu 10 000.",
    en: "A stock at 100 with a double knock-out call of strike K=100, barriers at 85 and 120, rebate=2 (per share), on a 1,000-share notional. If the stock trades between 90 and 115 throughout the contract's life and ends at 110, the option stays alive and pays max(110−100,0)=10 per share, i.e. 10×1,000=10,000. But if the stock briefly spikes to 121 at any point (even for one minute), the option is immediately and permanently knocked out: it only pays the rebate, 2×1,000=2,000, whatever it does afterward — including if it later falls back to 110, where it would otherwise have been worth 10,000.",
  },
  alternativeExplanation: {
    fr: "Une barrière simple est comme un précipice d'un seul côté du chemin ; une double-barrière, c'est marcher sur une corde raide étroite avec un précipice DE CHAQUE CÔTÉ. Rester en vie demande de rester précisément dans le couloir central, ce qui est plus exigeant qu'éviter un seul danger — mais rend aussi le \"billet\" beaucoup moins cher, puisque peu de trajectoires y parviennent.",
    en: "A single barrier is like a precipice on one side of the path; a double barrier is walking a narrow tightrope with a precipice ON EACH SIDE. Staying alive requires staying precisely within the central corridor, more demanding than avoiding a single danger — but this also makes the \"ticket\" much cheaper, since few paths manage it.",
  },
  formula: {
    latex: "\\text{Vivant à } T \\iff H_{\\text{down}} < \\min_{0 \\le t \\le T}(S_t) \\text{ et } \\max_{0 \\le t \\le T}(S_t) < H_{\\text{up}}",
    variables: [
      { symbol: "H_{\\text{down}}, H_{\\text{up}}", description: { fr: "Barrières inférieure et supérieure du corridor", en: "The corridor's lower and upper barriers" } },
      { symbol: "\\min(S_t), \\max(S_t)", description: { fr: "Plus bas et plus haut niveaux atteints par le sous-jacent sur la période", en: "The lowest and highest levels reached by the underlying over the period" } },
    ],
    assumptions: { fr: "Condition de survie pour une option double knock-out ; sans rebate.", en: "Survival condition for a double knock-out option; no rebate." },
    units: { fr: "Condition logique, sans unité.", en: "A logical condition, with no unit." },
    example: { fr: "H_down=85, H_up=120, K=100, trajectoire entre 90 et 115 terminant à 110 : vivant, payoff=max(110−100,0)=10 par action. Trajectoire touchant 121 à un instant puis retombant à 110 : mort (knock-out), payoff=rebate=2 par action seulement.", en: "H_down=85, H_up=120, K=100, a path between 90 and 115 ending at 110: alive, payoff=max(110−100,0)=10 per share. A path touching 121 at some point then falling back to 110: dead (knocked out), payoff=rebate=2 per share only." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Temps (fraction de la durée du contrat)", en: "Time (fraction of contract life)" },
    yLabel: { fr: "Prix du sous-jacent", en: "Underlying price" },
    series: [
      {
        label: { fr: "Trajectoire vivante (paie 10)", en: "Alive path (pays 10)" },
        points: [
          { x: 0, y: 100 },
          { x: 0.25, y: 105 },
          { x: 0.5, y: 112 },
          { x: 0.75, y: 108 },
          { x: 1, y: 110 },
        ],
      },
      {
        label: { fr: "Trajectoire knock-out (paie rebate=2)", en: "Knock-out path (pays rebate=2)" },
        points: [
          { x: 0, y: 100 },
          { x: 0.25, y: 108 },
          { x: 0.5, y: 118 },
          { x: 0.6, y: 121 },
          { x: 0.75, y: 115 },
          { x: 1, y: 110 },
        ],
      },
    ],
    refLines: [
      { label: { fr: "Barrière haute 120", en: "Upper barrier 120" }, y: 120 },
      { label: { fr: "Barrière basse 85", en: "Lower barrier 85" }, y: 85 },
    ],
  },
  calculation: {
    fr: "1) Identifier les deux barrières H_down et H_up : ici 85 et 120. 2) Observer la trajectoire complète du sous-jacent (selon la fréquence d'observation prévue). 3) Vérifier si le minimum de la trajectoire est resté strictement au-dessus de H_down ET si le maximum est resté strictement en dessous de H_up : dans le scénario \"vivant\", le maximum est 112 (<120), l'option survit ; dans le scénario \"knock-out\", le maximum atteint 121 (>120) à t=0,6, l'option meurt immédiatement à cet instant. 4) Si les deux conditions sont vérifiées, calculer le payoff normalement (10 par action pour K=100 et un prix final de 110) ; sinon, l'option est knock-out (payoff = rebate = 2 par action).",
    en: "1) Identify both barriers H_down and H_up: here 85 and 120. 2) Observe the underlying's full path (per the specified observation frequency). 3) Check whether the path's minimum stayed strictly above H_down AND its maximum stayed strictly below H_up: in the \"alive\" scenario, the maximum is 112 (<120), the option survives; in the \"knock-out\" scenario, the maximum reaches 121 (>120) at t=0.6, the option dies immediately at that instant. 4) If both conditions hold, compute the payoff normally (10 per share for K=100 and a final price of 110); otherwise, the option is knocked out (payoff = rebate = 2 per share).",
  },
  interpretation: {
    fr: "Plus le corridor [H_down, H_up] est étroit, plus la prime de l'option double-barrière est faible (car la probabilité de survie diminue), et plus le risque de knock-out (dans un sens ou dans l'autre) est élevé. C'est un arbitrage direct entre coût et probabilité de succès, contrôlable en ajustant la largeur du corridor.",
    en: "The narrower the corridor [H_down, H_up], the lower the double-barrier option's premium (since survival probability decreases), and the higher the knock-out risk (in either direction). This is a direct trade-off between cost and success probability, controllable by adjusting the corridor's width.",
  },
  pitfalls: {
    fr: "Oublier que le risque de knock-out d'une double-barrière n'est PAS simplement la somme des risques de chaque barrière prise séparément : les deux barrières interagissent (le pricing exact nécessite de considérer leur effet combiné sur toute la trajectoire, pas juste indépendamment). Autre piège : croire qu'une double-barrière est toujours moins chère qu'une barrière simple équivalente — cela dépend fortement de la largeur du corridor et de la volatilité du sous-jacent.",
    en: "Forgetting that a double barrier's knock-out risk is NOT simply the sum of each barrier's risk taken separately: the two barriers interact (exact pricing requires considering their combined effect over the whole path, not just independently). Another trap: believing a double barrier is always cheaper than an equivalent single barrier — this depends heavily on the corridor's width and the underlying's volatility.",
  },
  keyPoints: {
    fr: [
      "Une double-barrière surveille un corridor de prix : knock-out si l'une OU l'autre des deux barrières est touchée.",
      "Plus le corridor est étroit, plus la prime est faible mais plus le risque de knock-out est élevé.",
      "Les deux barrières interagissent : le pricing exact n'est pas une simple somme de deux barrières simples indépendantes.",
    ],
    en: [
      "A double barrier watches a price corridor: knocked out if EITHER barrier is touched.",
      "The narrower the corridor, the lower the premium but the higher the knock-out risk.",
      "The two barriers interact: exact pricing isn't a simple sum of two independent single barriers.",
    ],
  },
  advancedDemonstration: {
    fr: "Le pricing exact d'une option double-barrière sous Black-Scholes nécessite une série infinie de termes issus de la méthode des images (reflection principle) appliquée successivement aux deux barrières — une formule de Kunitomo-Ikeda, sensiblement plus complexe que les formules à barrière simple. En pratique, cette série converge rapidement (quelques termes suffisent pour une précision satisfaisante) et est aussi couramment approchée par simulation Monte-Carlo (M06-7) pour des structures encore plus complexes (barrières à fenêtre temporelle limitée, corridors à niveaux variables dans le temps).",
    en: "Exact pricing of a double-barrier option under Black-Scholes requires an infinite series of terms from the method of images (reflection principle) applied successively to both barriers — a Kunitomo-Ikeda formula, noticeably more complex than single-barrier formulas. In practice, this series converges quickly (a few terms suffice for satisfactory precision) and is also commonly approximated via Monte-Carlo simulation (M06-7) for even more complex structures (time-windowed barriers, corridors with time-varying levels).",
  },
  businessApplication: {
    fr: "Un desk de dérivés actions structure des doubles-barrières pour des clients ayant une vue de marché très précise (\"je pense que l'action va rester dans cette fourchette\"), en échange d'une prime nettement réduite par rapport à une option vanille ou à barrière simple ; le risk management du desk doit alors surveiller en continu les deux distances aux barrières, puisqu'un franchissement de l'une OU l'autre modifie instantanément et discontinûment la valeur de la position (voir M10-5, Greeks des barrières).",
    en: "An equity derivatives desk structures double barriers for clients with a very precise market view (\"I think the stock will stay within this range\"), in exchange for a markedly reduced premium versus a vanilla or single-barrier option; the desk's risk management must then continuously monitor both distances to the barriers, since breaching either one instantly and discontinuously changes the position's value (see M10-5, barrier Greeks).",
  },
  interviewQuestion: {
    question: "A client holds a double knock-out call. The stock briefly touches the upper barrier intraday, then falls back well within the range by the close. What happened to the option, and why does that surprise some clients?",
    answer: "The option is knocked out, permanently, the moment the barrier was touched — it doesn't matter that the stock fell back within the range afterward. This surprises clients because they intuitively think of the option's value based on where the stock ends up, like a vanilla option, but a barrier option's payoff depends on the entire path, not just the endpoint. Once the barrier condition triggers, the option's fate is sealed for the rest of its life, and at most it pays a small pre-agreed rebate instead of its full payoff. I'd explain that this path-dependency is exactly what makes double barriers so much cheaper than a vanilla option — the client is being compensated with a lower premium precisely for accepting this all-or-nothing risk on the barrier being touched.",
  },
};
