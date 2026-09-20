import type { LessonContent } from "@/lib/lesson-types";

export const m09SensibilitesPayoff: LessonContent = {
  conceptId: "m09-sensibilites-payoff",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les paniers, Worst-Of, Best-Of, et la notion de dispersion.",
      en: "You need to know baskets, Worst-Of, Best-Of, and the concept of dispersion.",
    },
    conceptIds: ["m09-panier-worst-best-of", "m09-dispersion"],
  },
  glossary: [
    { term: { fr: "Sensibilité à la corrélation (\"corrélation vega\")", en: "Correlation sensitivity (\"correlation vega\")" }, definition: { fr: "La variation de la valeur d'un produit multi-actifs pour une petite variation de la corrélation entre ses composants.", en: "The change in a multi-asset product's value for a small change in the correlation between its components." } },
  ],
  intuition: {
    fr: "Contrairement au Vega classique (toujours positif pour une option longue, voir M07-1), la sensibilité d'un produit multi-actifs à la volatilité, à la corrélation et à la dispersion N'A PAS de signe universel : elle dépend précisément du type de payoff (panier, Worst-Of, Best-Of) et du sens (call ou put). Généraliser un signe unique est l'erreur la plus fréquente sur ce sujet.",
    en: "Unlike the classic Vega (always positive for a long option, see M07-1), a multi-asset product's sensitivity to volatility, correlation and dispersion has NO universal sign: it depends precisely on the payoff type (basket, Worst-Of, Best-Of) and direction (call or put). Generalizing a single sign is the most common mistake on this topic.",
  },
  definition: {
    fr: "Un panier call est typiquement long corrélation (une hausse de corrélation augmente la variance du panier, donc sa valeur d'option) ET long volatilité individuelle. Un Worst-Of call est typiquement COURT corrélation (une corrélation plus faible augmente la dispersion des résultats, donc la probabilité qu'un actif traîne loin derrière, ce qui pénalise le \"pire\" résultat retenu) — l'inverse exact du panier sur cette dimension. Un Best-Of call est typiquement long dispersion (l'inverse du Worst-Of).",
    en: "A basket call is typically long correlation (a correlation rise increases the basket's variance, hence its option value) AND long individual volatility. A Worst-Of call is typically SHORT correlation (lower correlation increases the spread of outcomes, hence the chance one asset lags far behind, which hurts the \"worst\" outcome retained) — the exact opposite of the basket on this dimension. A Best-Of call is typically long dispersion (the opposite of Worst-Of).",
  },
  utility: {
    fr: "Comprendre ces sensibilités opposées est indispensable pour tout desk gérant un livre mêlant paniers et Worst-Of/Best-Of : les deux types de produits peuvent partiellement se couvrir mutuellement en corrélation, une opportunité (et un risque de mauvaise gestion) que seule une analyse fine du payoff révèle.",
    en: "Understanding these opposite sensitivities is essential for any desk managing a book mixing baskets and Worst-Of/Best-Of: the two product types can partially hedge each other in correlation, an opportunity (and a mismanagement risk) that only careful payoff analysis reveals.",
  },
  example: {
    fr: "Deux actifs A et B, chacun rendant +10% ou −10% avec 50% de chance. À ρ=1 (mouvements identiques) : 50% du temps les deux font +10% (panier=+10%, pire=+10%), 50% du temps les deux font −10% (panier=−10%, pire=−10%) → E[panier]=0%, E[pire]=0% : aucune différence. À ρ=0 (mouvements indépendants), 4 combinaisons équiprobables (25% chacune) : (+10,+10)→panier=10,pire=10 ; (+10,−10)→panier=0,pire=−10 ; (−10,+10)→panier=0,pire=−10 ; (−10,−10)→panier=−10,pire=−10. E[panier]=0,25×(10+0+0−10)=0% (inchangé), mais E[pire]=0,25×(10−10−10−10)=−5% : la baisse de corrélation pénalise strictement le Worst-Of, sans affecter le panier.",
    en: "Two assets A and B, each returning +10% or −10% with 50% probability. At ρ=1 (identical moves): 50% of the time both do +10% (basket=+10%, worst=+10%), 50% of the time both do −10% (basket=−10%, worst=−10%) → E[basket]=0%, E[worst]=0%: no difference. At ρ=0 (independent moves), 4 equally likely combinations (25% each): (+10,+10)→basket=10,worst=10; (+10,−10)→basket=0,worst=−10; (−10,+10)→basket=0,worst=−10; (−10,−10)→basket=−10,worst=−10. E[basket]=0.25×(10+0+0−10)=0% (unchanged), but E[worst]=0.25×(10−10−10−10)=−5%: the correlation drop strictly hurts the Worst-Of, without affecting the basket.",
  },
  alternativeExplanation: {
    fr: "Reprenez l'analogie de l'examen à trois épreuves (M09-4) : si les trois notes sont toujours identiques (corrélation=1), la moyenne et la pire note sont la même chose. Si les notes deviennent indépendantes (corrélation basse), la moyenne reste stable (les bonnes et mauvaises surprises se compensent), mais la pire note, elle, a de bonnes chances de chuter fortement (il suffit d'UNE mauvaise surprise) — d'où la sensibilité opposée entre panier et Worst-Of face à la corrélation.",
    en: "Revisit the three-test exam analogy (M09-4): if all three scores are always identical (correlation=1), the average and the worst score are the same thing. If the scores become independent (low correlation), the average stays stable (good and bad surprises offset each other), but the worst score has a good chance of dropping sharply (just ONE bad surprise is enough) — hence the opposite sensitivity between basket and Worst-Of to correlation.",
  },
  formula: {
    latex: "\\text{Var}(\\text{panier}) = \\sum_i w_i^{2}\\sigma_i^{2} + \\sum_{i \\neq j} w_i w_j \\sigma_i \\sigma_j \\rho_{ij}",
    variables: [
      { symbol: "w_i", description: { fr: "Poids de l'actif i dans le panier", en: "Asset i's weight in the basket" } },
      { symbol: "\\rho_{ij}", description: { fr: "Corrélation entre les actifs i et j", en: "Correlation between assets i and j" } },
    ],
    assumptions: { fr: "Cette formule s'applique littéralement au PANIER ; le Worst-Of et le Best-Of n'ont pas de formule de variance aussi simple, leur sensibilité s'établissant plutôt par simulation ou raisonnement qualitatif sur la dispersion des résultats.", en: "This formula literally applies to the BASKET; Worst-Of and Best-Of don't have as simple a variance formula, their sensitivity being established instead by simulation or qualitative reasoning about the spread of outcomes." },
    units: { fr: "Variance en proportion au carré.", en: "Variance as a proportion squared." },
    example: { fr: "w1=w2=0,5, σ1=σ2=25% : à ρ=1, σ_panier=25% ; à ρ=0,2, Var_panier=0,03125+0,03125×0,2=0,0375, σ_panier=√0,0375≈19,36% — le panier devient moins volatil (donc son call moins cher) quand la corrélation baisse, exactement l'inverse du Worst-Of.", en: "w1=w2=0.5, σ1=σ2=25%: at ρ=1, σ_basket=25%; at ρ=0.2, Var_basket=0.03125+0.03125×0.2=0.0375, σ_basket=√0.0375≈19.36% — the basket becomes less volatile (so its call cheaper) as correlation falls, the exact opposite of the Worst-Of." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Corrélation ρ", en: "Correlation ρ" },
    yLabel: { fr: "Valeur espérée du payoff (%)", en: "Expected payoff value (%)" },
    series: [
      {
        label: { fr: "Panier (inchangé)", en: "Basket (unchanged)" },
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
      },
      {
        label: { fr: "Worst-of (pénalisé à basse corrélation)", en: "Worst-of (hurt at low correlation)" },
        points: [
          { x: 0, y: -5 },
          { x: 1, y: 0 },
        ],
      },
    ],
  },
  calculation: {
    fr: "1) Identifier le type exact de payoff (panier, Worst-Of call, Worst-Of put, Best-Of call, Best-Of put). 2) Pour un panier : la variance croît avec la corrélation (formule ci-dessus, σ_panier passe de 19,36% à 25% quand ρ passe de 0,2 à 1), donc un panier CALL est long corrélation. 3) Pour un Worst-Of/Best-Of : raisonner sur l'effet de la corrélation sur la DISPERSION des résultats individuels, pas sur la variance globale — dans notre exemple à 2 états, E[pire]=−5% à ρ=0 contre 0% à ρ=1, alors que E[panier] reste à 0% dans les deux cas. 4) Ne jamais transposer directement la conclusion d'un type de payoff à un autre sans revérifier ce raisonnement.",
    en: "1) Identify the exact payoff type (basket, Worst-Of call, Worst-Of put, Best-Of call, Best-Of put). 2) For a basket: variance grows with correlation (formula above, σ_basket goes from 19.36% to 25% as ρ goes from 0.2 to 1), so a basket CALL is long correlation. 3) For a Worst-Of/Best-Of: reason about correlation's effect on the SPREAD of individual outcomes, not overall variance — in our 2-state example, E[worst]=−5% at ρ=0 versus 0% at ρ=1, while E[basket] stays at 0% in both cases. 4) Never directly transpose one payoff type's conclusion to another without re-checking this reasoning.",
  },
  interpretation: {
    fr: "Cette diversité de sensibilités explique pourquoi les desks de dérivés sur multi-actifs distinguent soigneusement leurs positions par type de payoff plutôt que de les agréger naïvement en un seul \"risque de corrélation\" : un livre avec des paniers longs et des Worst-Of courts peut avoir un risque de corrélation net bien plus faible que la somme des positions individuelles ne le suggérerait.",
    en: "This diversity of sensitivities explains why multi-asset derivatives desks carefully distinguish their positions by payoff type rather than naively aggregating them into a single \"correlation risk\": a book with long baskets and short Worst-Ofs can have a much lower net correlation risk than the sum of individual positions would suggest.",
  },
  pitfalls: {
    fr: "L'erreur la plus fréquente et la plus dangereuse sur ce sujet : appliquer machinalement \"long corrélation\" ou \"court corrélation\" à TOUS les produits multi-actifs, sans revérifier au cas par cas selon le payoff exact (panier vs Worst-Of vs Best-Of, call vs put). Chaque payoff mérite une analyse spécifique — c'est précisément la mise en garde de cette notion.",
    en: "The most frequent and dangerous mistake on this topic: mechanically applying \"long correlation\" or \"short correlation\" to ALL multi-asset products, without re-checking case by case based on the exact payoff (basket vs Worst-Of vs Best-Of, call vs put). Each payoff deserves specific analysis — precisely this concept's core warning.",
  },
  keyPoints: {
    fr: [
      "Panier call : typiquement long corrélation (la variance du panier croît avec la corrélation).",
      "Worst-Of call : typiquement court corrélation (une corrélation basse disperse davantage les résultats, pénalisant le pire).",
      "Ne jamais généraliser un signe unique : chaque combinaison payoff/sens (call vs put) mérite une analyse spécifique.",
    ],
    en: [
      "Basket call: typically long correlation (the basket's variance grows with correlation).",
      "Worst-Of call: typically short correlation (lower correlation spreads outcomes more, hurting the worst one).",
      "Never generalize a single sign: each payoff/direction combination (call vs put) deserves specific analysis.",
    ],
  },
  businessApplication: {
    fr: "Un desk actions multi-actifs qui vend simultanément des paniers (long corrélation) et des Worst-Of (court corrélation) peut structurer son inventaire pour que ces positions se couvrent partiellement l'une l'autre en risque de corrélation, réduisant le coût total de couverture — une opportunité invisible à quiconque agrégerait naïvement toutes les positions multi-actifs en un seul chiffre de \"risque de corrélation\".",
    en: "A multi-asset equity desk that simultaneously sells baskets (long correlation) and Worst-Ofs (short correlation) can structure its inventory so these positions partially hedge each other's correlation risk, reducing total hedging cost — an opportunity invisible to anyone naively aggregating all multi-asset positions into a single \"correlation risk\" figure.",
  },
  interviewQuestion: {
    question: "Is a Worst-Of call long or short correlation? And is that the same answer for every multi-asset payoff?",
    answer: "A Worst-Of call is short correlation — lower correlation increases the spread between the underlyings' outcomes, which increases the chance that at least one drags the 'worst' result down, hurting the payoff. But that's specifically for baskets vs. Worst-Of calls; it's not a universal rule. A basket call is the opposite, long correlation, since basket variance actually increases with correlation. And a Best-Of call flips again, being long dispersion like the Worst-Of but in the opposite direction on value. Puts can flip the sign again relative to the corresponding call. So I'd never apply a single mnemonic to 'multi-asset products' as a category — I'd work out the sign fresh for each specific payoff type and direction.",
  },
  advancedDemonstration: {
    fr: "Pour un PUT (plutôt qu'un call), les sensibilités peuvent s'inverser par rapport au call correspondant : un Worst-Of PUT, par exemple, peut avoir une sensibilité à la corrélation de signe différent de celle d'un Worst-Of CALL, car ce n'est plus la même extrémité de la distribution des résultats qui détermine le payoff. Cette asymétrie call/put, combinée à celle entre panier/Worst-Of/Best-Of, crée une matrice de sensibilités à quatre cas (au minimum) qu'aucune règle mnémotechnique simple ne peut résumer correctement — seule une analyse par simulation Monte-Carlo (perturbant la matrice de corrélation et en observant l'effet sur le prix) permet de conclure de façon fiable pour un payoff exotique complexe donné.",
    en: "For a PUT (rather than a call), sensitivities can flip relative to the corresponding call: a Worst-Of PUT, for instance, can have a correlation sensitivity of opposite sign to a Worst-Of CALL's, since it's no longer the same tail of the outcome distribution that determines the payoff. This call/put asymmetry, combined with the basket/Worst-Of/Best-Of one, creates a sensitivity matrix of at least four cases that no simple mnemonic rule can correctly summarize — only Monte-Carlo simulation analysis (perturbing the correlation matrix and observing the price effect) reliably concludes for a given complex exotic payoff.",
  },
};
