import type { LessonContent } from "@/lib/lesson-types";

export const m13CapmSml: LessonContent = {
  conceptId: "m13-capm-sml",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la frontière efficiente de Markowitz et le théorème de séparation.",
      en: "You need to know Markowitz's efficient frontier and the separation theorem.",
    },
    conceptIds: ["m13-markowitz-frontiere"],
  },
  glossary: [
    { term: { fr: "Bêta (β)", en: "Beta (β)" }, definition: { fr: "Une mesure de la sensibilité d'un actif aux mouvements du marché global : un bêta de 1,5 signifie qu'un mouvement de 1% du marché s'accompagne en moyenne d'un mouvement de 1,5% de l'actif.", en: "A measure of an asset's sensitivity to overall market movements: a beta of 1.5 means a 1% market move is accompanied on average by a 1.5% move in the asset." } },
    { term: { fr: "Prime de risque de marché", en: "Market risk premium" }, definition: { fr: "Le rendement additionnel exigé par les investisseurs pour détenir le marché risqué plutôt que l'actif sans risque.", en: "The additional return investors demand to hold the risky market rather than the risk-free asset." } },
  ],
  intuition: {
    fr: "Le CAPM répond à une question centrale : quel rendement un investisseur doit-il exiger pour un actif risqué donné ? Sa réponse est contre-intuitive au premier abord : seul le risque qui ne peut PAS être diversifié (le risque systématique, lié au marché global) doit être rémunéré — le risque spécifique à un actif, qui peut être éliminé par diversification (M13-gp-a), ne mérite aucune prime supplémentaire.",
    en: "CAPM answers a central question: what return should an investor demand for a given risky asset? Its answer is counterintuitive at first: only risk that CANNOT be diversified away (systematic risk, tied to the overall market) should be compensated — an asset's specific risk, which can be eliminated through diversification (M13-gp-a), deserves no additional premium.",
  },
  definition: {
    fr: "Le CAPM (Capital Asset Pricing Model) énonce que le rendement espéré d'un actif est E(R) = r_f + β×(E(R_m) − r_f), où β mesure la sensibilité de l'actif aux mouvements du marché (covariance avec le marché divisée par la variance du marché), et (E(R_m) − r_f) est la prime de risque de marché. La Security Market Line (SML) est la représentation graphique de cette relation : une droite reliant le rendement espéré de chaque actif à son bêta, tout actif correctement pricé devant se situer exactement SUR cette droite.",
    en: "CAPM (Capital Asset Pricing Model) states that an asset's expected return is E(R) = r_f + β×(E(R_m) − r_f), where β measures the asset's sensitivity to market movements (covariance with the market divided by the market's variance), and (E(R_m) − r_f) is the market risk premium. The Security Market Line (SML) is this relationship's graphical representation: a line connecting each asset's expected return to its beta, with any correctly priced asset lying exactly ON this line.",
  },
  utility: {
    fr: "Le CAPM fournit un taux de rendement exigé théorique pour n'importe quel actif, un ingrédient essentiel pour actualiser des flux futurs (M13-mathfin-b) dans une évaluation d'entreprise, ou pour juger si un actif est \"sous-évalué\" (rendement attendu au-dessus de la SML) ou \"survalorisé\" (en dessous) par rapport à son risque systématique.",
    en: "CAPM provides a theoretical required rate of return for any asset, an essential ingredient for discounting future cash flows (M13-mathfin-b) in a company valuation, or for judging whether an asset is \"undervalued\" (expected return above the SML) or \"overvalued\" (below) relative to its systematic risk.",
  },
  example: {
    fr: "Avec r_f=2%, un rendement de marché espéré de 8% (prime de risque de marché = 6%), et une action de bêta 1,3 : le rendement exigé selon le CAPM est 2% + 1,3×6% = 9,8%. Si cette action a un rendement espéré (estimé par ailleurs) de 12%, elle apparaît sous-évaluée (au-dessus de la SML) ; si son rendement espéré n'est que de 7%, elle apparaît survalorisée (en dessous de la SML).",
    en: "With r_f=2%, an expected market return of 8% (market risk premium = 6%), and a stock with beta 1.3: the CAPM-required return is 2% + 1.3×6% = 9.8%. If this stock has an (otherwise estimated) expected return of 12%, it appears undervalued (above the SML); if its expected return is only 7%, it appears overvalued (below the SML).",
  },
  alternativeExplanation: {
    fr: "Imaginez une entreprise de transport qui paie ses employés selon leur exposition réelle au danger : un employé de bureau (risque \"spécifique\", évitable) ne reçoit pas de prime de risque, mais un employé exposé à un danger inhérent au métier lui-même (risque \"systématique\", inévitable) reçoit une prime proportionnelle à ce danger structurel. Le CAPM applique la même logique aux actifs financiers : seul le risque structurel et inévitable (lié au marché) est rémunéré.",
    en: "Imagine a transport company paying employees based on their real exposure to danger: an office employee (\"specific\", avoidable risk) receives no risk premium, but an employee exposed to a danger inherent to the job itself (\"systematic\", unavoidable risk) receives a premium proportional to that structural danger. CAPM applies the same logic to financial assets: only structural, unavoidable risk (tied to the market) is compensated.",
  },
  formula: {
    latex: "E(R_i) = r_f + \\beta_i \\times (E(R_m) - r_f), \\quad \\beta_i = \\frac{\\text{Cov}(R_i, R_m)}{\\text{Var}(R_m)}",
    variables: [
      { symbol: "\\beta_i", description: { fr: "Sensibilité de l'actif i aux mouvements du marché", en: "Asset i's sensitivity to market movements" } },
      { symbol: "E(R_m) - r_f", description: { fr: "Prime de risque de marché, la compensation exigée pour détenir le marché risqué", en: "Market risk premium, the compensation demanded for holding the risky market" } },
    ],
    assumptions: { fr: "Marchés efficients, tous les investisseurs détiennent le portefeuille de marché combiné à l'actif sans risque (théorème de séparation, M13-gp-b) ; hypothèses souvent simplificatrices en pratique.", en: "Efficient markets, all investors hold the market portfolio combined with the risk-free asset (separation theorem, M13-gp-b); often simplifying assumptions in practice." },
    units: { fr: "Rendement en pourcentage annualisé ; β sans dimension.", en: "Return as an annualized percentage; β dimensionless." },
    example: { fr: "β=1 : l'actif bouge comme le marché, rendement exigé = rendement du marché. β=0 : rendement exigé = r_f (aucune prime, comme l'actif sans risque).", en: "β=1: the asset moves like the market, required return = market return. β=0: required return = r_f (no premium, like the risk-free asset)." },
  },
  calculation: {
    fr: "1) Estimer le bêta de l'actif (régression linéaire des rendements de l'actif sur les rendements du marché, un lien direct avec M12-1). 2) Obtenir le taux sans risque et une estimation de la prime de risque de marché (souvent basée sur des moyennes historiques longues). 3) Appliquer la formule du CAPM pour obtenir le rendement exigé. 4) Comparer ce rendement exigé au rendement espéré réel (estimé par ailleurs) pour juger de la valorisation relative de l'actif.",
    en: "1) Estimate the asset's beta (linear regression of the asset's returns on market returns, a direct link to M12-1). 2) Obtain the risk-free rate and an estimate of the market risk premium (often based on long historical averages). 3) Apply the CAPM formula to get the required return. 4) Compare this required return to the real expected return (otherwise estimated) to judge the asset's relative valuation.",
  },
  interpretation: {
    fr: "Un bêta supérieur à 1 signifie un actif plus volatil que le marché (amplifie les mouvements), un bêta inférieur à 1 signifie un actif plus défensif (amortit les mouvements), un bêta négatif (rare) signifie un actif qui évolue en sens inverse du marché, une couverture naturelle. La SML fournit une référence objective : un actif s'écartant significativement de la droite, à la hausse comme à la baisse, mérite une investigation plus poussée sur ce qui explique cet écart.",
    en: "A beta above 1 means an asset more volatile than the market (amplifies movements), a beta below 1 means a more defensive asset (dampens movements), a negative beta (rare) means an asset moving opposite to the market, a natural hedge. The SML provides an objective reference: an asset deviating significantly from the line, whether above or below, deserves further investigation into what explains that gap.",
  },
  pitfalls: {
    fr: "Traiter le CAPM comme une vérité empirique parfaitement vérifiée plutôt qu'un modèle théorique simplifié : de nombreuses études empiriques montrent que le bêta seul explique imparfaitement les rendements observés (d'où l'existence de modèles multi-facteurs plus riches, comme Fama-French). Autre piège : estimer un bêta sur une période trop courte ou trop instable, produisant une estimation peu fiable du rendement exigé.",
    en: "Treating CAPM as a perfectly verified empirical truth rather than a simplified theoretical model: many empirical studies show beta alone imperfectly explains observed returns (hence richer multi-factor models like Fama-French). Another trap: estimating a beta over too short or too unstable a period, producing an unreliable required-return estimate.",
  },
  keyPoints: {
    fr: [
      "Le CAPM ne rémunère que le risque systématique (bêta), pas le risque spécifique diversifiable.",
      "La Security Market Line relie rendement exigé et bêta ; un actif au-dessus est sous-évalué, en dessous survalorisé.",
      "Le CAPM reste un modèle théorique simplifié, imparfaitement vérifié empiriquement.",
    ],
    en: [
      "CAPM only compensates systematic (beta) risk, not diversifiable specific risk.",
      "The Security Market Line connects required return and beta; an asset above it is undervalued, below it overvalued.",
      "CAPM remains a simplified theoretical model, imperfectly verified empirically.",
    ],
  },
  advancedDemonstration: {
    fr: "Le CAPM se dérive directement du théorème de séparation (M13-gp-b) : si tout investisseur rationnel détient le même portefeuille de marché combiné à l'actif sans risque, alors à l'équilibre, la contribution marginale de chaque actif au risque du portefeuille de marché (sa covariance avec le marché) doit être proportionnelle à sa contribution au rendement espéré du portefeuille — un raisonnement d'équilibre général qui explique pourquoi seule la covariance avec le marché (et non la volatilité totale de l'actif) apparaît dans la formule finale. Les limites empiriques du CAPM simple (bêta seul) ont motivé des extensions comme le modèle à trois facteurs de Fama-French (ajoutant taille et valeur) ou à cinq facteurs, qui expliquent mieux les rendements observés en pratique.",
    en: "CAPM derives directly from the separation theorem (M13-gp-b): if every rational investor holds the same market portfolio combined with the risk-free asset, then in equilibrium, each asset's marginal contribution to the market portfolio's risk (its covariance with the market) must be proportional to its contribution to the portfolio's expected return — a general equilibrium argument explaining why only covariance with the market (not the asset's total volatility) appears in the final formula. Simple CAPM's (beta-only) empirical limitations have motivated extensions like the Fama-French three-factor model (adding size and value) or five-factor model, which better explain returns observed in practice.",
  },
};
