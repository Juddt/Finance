import type { LessonContent } from "@/lib/lesson-types";

export const m11Autocall: LessonContent = {
  conceptId: "m11-autocall",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la mécanique générale des produits structurés et les options digitales.",
      en: "You need to know structured products' general mechanics and digital options.",
    },
    conceptIds: ["m11-produit-structure", "m10-options-digitales", "m10-pdi"],
  },
  glossary: [
    { term: { fr: "Rappel anticipé (autocall)", en: "Early redemption (autocall)" }, definition: { fr: "Le remboursement automatique et anticipé du produit à une date d'observation, si le sous-jacent est au-dessus de la barrière de rappel.", en: "The product's automatic, early redemption on an observation date, if the underlying is above the call barrier." } },
    { term: { fr: "Mémoire (coupon à mémoire)", en: "Memory (coupon memory)" }, definition: { fr: "Une clause qui permet de récupérer, à une date d'observation où le coupon est payé, tous les coupons manqués aux dates précédentes.", en: "A clause allowing recovery, on an observation date where the coupon is paid, of all coupons missed on previous dates." } },
  ],
  intuition: {
    fr: "Un autocall est un pari répété sur la stabilité ou la hausse d'un sous-jacent : à chaque date d'observation, si le sous-jacent est \"assez haut\", le produit se rembourse automatiquement avec un coupon et le pari s'arrête — sinon, il continue jusqu'à la date suivante, avec un risque de perte en capital qui n'apparaît qu'à l'échéance finale si aucun rappel n'a eu lieu.",
    en: "An autocall is a repeated bet on an underlying's stability or rise: on each observation date, if the underlying is \"high enough\", the product automatically redeems with a coupon and the bet stops — otherwise, it continues to the next date, with capital loss risk appearing only at final maturity if no redemption occurred.",
  },
  definition: {
    fr: "Un autocall observe le sous-jacent à des dates prédéfinies t1 < t2 < ... < tn. À chaque date ti, si S(ti) ≥ Barrière_rappel, le produit est automatiquement remboursé avec le nominal plus un coupon (cumulé si mémoire active), et s'arrête. Si aucun rappel n'a eu lieu à l'échéance finale tn : si S(tn) ≥ Barrière_capital, l'investisseur récupère son capital (avec ou sans coupon final selon la structure) ; si S(tn) < Barrière_capital, l'investisseur subit une perte en capital, souvent proportionnelle à la baisse du sous-jacent (mécanisme du put down-and-in, M10-4).",
    en: "An autocall observes the underlying on predefined dates t1 < t2 < ... < tn. On each date ti, if S(ti) ≥ Call_barrier, the product is automatically redeemed with the face value plus a coupon (cumulative if memory is active), and stops. If no redemption occurred by the final maturity tn: if S(tn) ≥ Capital_barrier, the investor recovers their capital (with or without a final coupon depending on the structure); if S(tn) < Capital_barrier, the investor suffers a capital loss, often proportional to the underlying's decline (down-and-in put mechanism, M10-4).",
  },
  utility: {
    fr: "Les autocalls sont l'un des produits structurés les plus vendus au grand public en Europe, car ils offrent un coupon attractif dans des marchés stables ou modérément haussiers. Comprendre leur mécanique exacte est essentiel pour évaluer si le coupon proposé compense correctement le risque de perte en capital réellement pris.",
    en: "Autocalls are among the most widely sold retail structured products in Europe, since they offer an attractive coupon in stable or moderately bullish markets. Understanding their exact mechanics is essential to assess whether the proposed coupon properly compensates for the capital loss risk actually taken.",
  },
  example: {
    fr: "Un autocall à 3 ans sur une action à 100, observations annuelles, barrière de rappel à 100 (= spot initial), coupon de 8% par an avec mémoire, barrière de capital à 60%. Année 1 : action à 95, pas de rappel, coupon non payé (mais mémorisé). Année 2 : action à 105 (≥100), rappel : l'investisseur reçoit le nominal + 8%×2=16% (les deux coupons cumulés grâce à la mémoire), le produit s'arrête. Si au contraire l'action était restée sous 100 aux deux premières observations et terminait à 50 (<60% de barrière) en année 3, l'investisseur subirait une perte en capital d'environ 50%.",
    en: "A 3-year autocall on a stock at 100, annual observations, call barrier at 100 (= initial spot), 8% annual coupon with memory, capital barrier at 60%. Year 1: stock at 95, no redemption, coupon unpaid (but memorized). Year 2: stock at 105 (≥100), redemption: the investor receives the face value + 8%×2=16% (both coupons cumulated via memory), the product stops. If instead the stock had stayed below 100 for the first two observations and ended at 50 (<60% barrier) in year 3, the investor would suffer a roughly 50% capital loss.",
  },
  alternativeExplanation: {
    fr: "Un autocall ressemble à un jeu de \"premier arrivé, premier servi\" : à chaque étape, si le sous-jacent franchit la ligne d'arrivée (la barrière de rappel), le jeu s'arrête et le gagnant empoche son gain immédiatement. S'il ne la franchit jamais avant la dernière étape, le jeu se termine sur un résultat qui dépend entièrement de la position finale, potentiellement très défavorable si le sous-jacent a beaucoup chuté.",
    en: "An autocall resembles a \"first come, first served\" game: at each step, if the underlying crosses the finish line (the call barrier), the game stops and the winner pockets their gain immediately. If it never crosses before the last step, the game ends on a result entirely dependent on the final position, potentially very unfavorable if the underlying has fallen a lot.",
  },
  formula: {
    latex: "\\text{Payoff}_{ti} = \\text{Nominal} \\times (1 + \\text{Coupon}_{\\text{cumulé}}) \\text{ si } S(t_i) \\ge B_{\\text{rappel}}, \\text{ premier } i \\text{ vérifiant la condition}",
    variables: [
      { symbol: "B_{\\text{rappel}}", description: { fr: "Barrière de rappel anticipé (souvent 100% du spot initial, parfois décroissante dans le temps)", en: "Early call barrier (often 100% of initial spot, sometimes decreasing over time)" } },
      { symbol: "\\text{Coupon}_{\\text{cumulé}}", description: { fr: "Somme des coupons de la date courante et de toutes les dates précédentes non payées, si la clause de mémoire est active", en: "Sum of the current date's coupon and all previous unpaid dates', if the memory clause is active" } },
    ],
    assumptions: { fr: "Version simplifiée ; les structures réelles varient (barrière de rappel dégressive, absence de mémoire, coupon conditionnel indépendant du rappel).", en: "Simplified version; real structures vary (stepped-down call barrier, no memory, coupon conditional independent of the call)." },
    units: { fr: "Payoff en pourcentage du nominal.", en: "Payoff as a percentage of face value." },
    example: { fr: "Nominal=100, coupon 8%/an avec mémoire, rappel à l'année 2 après un coupon manqué en année 1 : Payoff = 100×(1+16%) = 116.", en: "Face value=100, 8%/year coupon with memory, called in year 2 after a missed year-1 coupon: Payoff = 100×(1+16%) = 116." },
  },
  calculation: {
    fr: "1) Lister les dates d'observation et les barrières associées (rappel, capital). 2) À chaque date, dans l'ordre chronologique, vérifier si la condition de rappel est remplie. 3) Si oui, calculer le remboursement (nominal + coupon cumulé le cas échéant) et arrêter. 4) Si aucune date ne déclenche le rappel, appliquer la règle de remboursement final selon la position de S(tn) par rapport à la barrière de capital.",
    en: "1) List the observation dates and their associated barriers (call, capital). 2) On each date, in chronological order, check whether the call condition is met. 3) If so, compute the repayment (face value + cumulative coupon if applicable) and stop. 4) If no date triggers the call, apply the final repayment rule based on S(tn)'s position relative to the capital barrier.",
  },
  interpretation: {
    fr: "Le coupon élevé d'un autocall est en réalité la prime de plusieurs options vendues implicitement par l'investisseur : une composante digitale conditionnelle (le coupon lui-même, M10-7) et un put down-and-in sur la barrière de capital (M10-4). Plus ces barrières sont proches du spot, plus ces options implicites sont chères à vendre, donc plus le coupon peut être élevé — au prix d'un risque de rappel plus fréquent (moins de coupons accumulés) et d'un risque de perte en capital plus grand.",
    en: "An autocall's high coupon is in reality the premium of several options implicitly sold by the investor: a conditional digital component (the coupon itself, M10-7) and a down-and-in put on the capital barrier (M10-4). The closer these barriers are to spot, the more expensive these implicit options are to sell, so the higher the coupon can be — at the cost of more frequent redemption (fewer accumulated coupons) and greater capital loss risk.",
  },
  pitfalls: {
    fr: "Confondre la barrière de rappel (déclenche le remboursement anticipé, généralement favorable) et la barrière de capital (déclenche la perte en capital, généralement défavorable) — ce sont deux niveaux distincts avec des rôles opposés. Autre piège : oublier que le rappel anticipé limite le gain total possible (moins de coupons perçus qu'en cas de maintien jusqu'à l'échéance), ce qui n'est pas toujours dans l'intérêt de l'investisseur malgré les apparences.",
    en: "Confusing the call barrier (triggers early redemption, generally favorable) with the capital barrier (triggers capital loss, generally unfavorable) — these are two distinct levels with opposite roles. Another trap: forgetting that early redemption caps the total possible gain (fewer coupons received than if held to maturity), which isn't always in the investor's interest despite appearances.",
  },
  keyPoints: {
    fr: [
      "À chaque date d'observation, si S(ti) ≥ barrière de rappel, le produit se rembourse automatiquement avec coupon (cumulé si mémoire).",
      "Si aucun rappel n'a lieu, le remboursement final dépend de la barrière de capital, avec risque de perte en capital en dessous.",
      "Le coupon élevé finance la vente implicite d'une composante digitale et d'un put down-and-in.",
    ],
    en: [
      "On each observation date, if S(ti) ≥ the call barrier, the product automatically redeems with a coupon (cumulative if memory).",
      "If no call occurs, final repayment depends on the capital barrier, with capital loss risk below it.",
      "The high coupon funds the implicit sale of a digital component and a down-and-in put.",
    ],
  },
  advancedDemonstration: {
    fr: "Le pricing exact d'un autocall nécessite de traiter simultanément plusieurs conditions de barrière corrélées dans le temps (rappel à chaque date) et une condition finale (capital), ce qui rend la valorisation analytique en forme close généralement impraticable dès que le nombre de dates d'observation dépasse deux ou trois — d'où le recours quasi systématique à des méthodes numériques (arbres, ou plus couramment simulation Monte-Carlo, M06-7) capables de gérer nativement ce caractère path-dependent multi-barrières, et calibrées sur une surface de volatilité complète (M11-5) plutôt qu'une volatilité constante.",
    en: "Exact autocall pricing requires simultaneously handling several barrier conditions correlated over time (a call on each date) and a final condition (capital), which makes closed-form analytical valuation generally impractical once the number of observation dates exceeds two or three — hence the near-systematic recourse to numerical methods (trees, or more commonly Monte Carlo simulation, M06-7) natively able to handle this multi-barrier path-dependent nature, and calibrated on a full volatility surface (M11-5) rather than a constant volatility.",
  },
};
