import type { LessonContent } from "@/lib/lesson-types";

export const m03PricingObligation: LessonContent = {
  conceptId: "m03-pricing-obligation",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la structure d'une obligation à coupons (nominal, taux de coupon, échéance).",
      en: "You need to know a coupon bond's structure (face value, coupon rate, maturity).",
    },
    conceptIds: ["m03-definition-obligations"],
  },
  glossary: [
    { term: { fr: "Rendement actuariel (YTM)", en: "Yield to maturity (YTM)" }, definition: { fr: "Le taux d'actualisation unique qui égalise la somme des flux futurs actualisés au prix observé aujourd'hui.", en: "The single discount rate that equates the sum of discounted future cash flows to today's observed price." } },
    { term: { fr: "Coupon couru", en: "Accrued interest" }, definition: { fr: "La part du prochain coupon déjà \"gagnée\" par le vendeur depuis le dernier paiement, due par l'acheteur en plus du prix coté.", en: "The portion of the next coupon already \"earned\" by the seller since the last payment, owed by the buyer on top of the quoted price." } },
  ],
  intuition: {
    fr: "Le prix d'une obligation n'est rien d'autre que la somme de tous ses paiements futurs, ramenés à leur valeur d'aujourd'hui : plus un euro futur est lointain ou incertain, moins il vaut aujourd'hui.",
    en: "A bond's price is nothing more than the sum of all its future payments, brought back to today's value: the more distant or uncertain a future euro is, the less it is worth today.",
  },
  definition: {
    fr: "Le prix d'une obligation est la somme actualisée de tous ses coupons futurs et de son remboursement final, au taux de rendement actuariel y exigé par le marché. Le \"clean price\" (prix coté) exclut le coupon couru depuis le dernier paiement ; le \"dirty price\" (prix effectivement payé à l'achat) l'inclut : Dirty = Clean + Coupon couru.",
    en: "A bond's price is the discounted sum of all its future coupons and final repayment, at the yield to maturity y required by the market. The \"clean price\" (quoted price) excludes accrued interest since the last payment; the \"dirty price\" (price actually paid on purchase) includes it: Dirty = Clean + Accrued interest.",
  },
  utility: {
    fr: "C'est le calcul de base de toute salle de marché obligataire : il permet de coter une obligation, de comparer des obligations entre elles via leur rendement, et de comprendre comment le prix réagit à une variation des taux.",
    en: "This is the core calculation of any bond trading desk: it lets you quote a bond, compare bonds against each other via their yield, and understand how price reacts to a change in rates.",
  },
  example: {
    fr: "Obligation nominal 1 000 EUR, coupon annuel 4% (40 EUR/an), maturité 3 ans, rendement exigé y = 5%. Prix = 40/1,05 + 40/1,05² + (40+1 000)/1,05³ = 38,10 + 36,28 + 898,90 ≈ 973,28 EUR : elle se négocie en dessous du nominal car le marché exige plus (5%) que le coupon offert (4%).",
    en: "Bond with face value EUR 1,000, annual coupon 4% (EUR 40/year), 3-year maturity, required yield y = 5%. Price = 40/1.05 + 40/1.05² + (40+1,000)/1.05³ = 38.10 + 36.28 + 898.90 ≈ EUR 973.28: it trades below par because the market demands more (5%) than the offered coupon (4%).",
  },
  alternativeExplanation: {
    fr: "Voyez chaque coupon et le remboursement final comme des billets de train achetés séparément, chacun avec sa propre \"réduction\" pour le temps d'attente : plus le billet est loin dans le futur, plus la réduction (l'actualisation) est forte. Le prix total de l'obligation est juste la facture globale de tous ces billets.",
    en: "Picture each coupon and the final repayment as train tickets bought separately, each with its own \"discount\" for the wait: the further out the ticket, the bigger the discount (the more it is discounted). The bond's total price is just the combined bill for all these tickets.",
  },
  formula: {
    latex: "P = \\sum_{t=1}^{N} \\frac{C}{(1+y)^{t}} + \\frac{F}{(1+y)^{N}}",
    variables: [
      { symbol: "C", description: { fr: "Coupon périodique (taux de coupon × valeur nominale)", en: "Periodic coupon (coupon rate × face value)" } },
      { symbol: "F", description: { fr: "Valeur nominale remboursée à l'échéance", en: "Face value repaid at maturity" } },
      { symbol: "y", description: { fr: "Rendement actuariel exigé par le marché (YTM)", en: "Market-required yield to maturity (YTM)" } },
      { symbol: "N", description: { fr: "Nombre de périodes jusqu'à l'échéance", en: "Number of periods to maturity" } },
    ],
    assumptions: { fr: "Coupons versés à intervalles réguliers ; pas de risque de défaut pris en compte séparément (il est déjà reflété dans y) ; on se place juste après un paiement de coupon (clean = dirty).", en: "Coupons paid at regular intervals; default risk not modeled separately (already reflected in y); valuation done right after a coupon payment (clean = dirty)." },
    units: { fr: "P, C et F dans la même devise ; y en proportion par période.", en: "P, C and F in the same currency; y as a proportion per period." },
    example: { fr: "C=40, F=1000, y=5%, N=3 : P ≈ 973,28.", en: "C=40, F=1000, y=5%, N=3: P ≈ 973.28." },
  },
  calculation: {
    fr: "1) Lister chaque coupon C aux dates 1 à N, plus F à la date N. 2) Actualiser chaque flux : flux_t / (1+y)^t. 3) Sommer tous les flux actualisés. 4) Comparer au nominal : P < F si y > taux de coupon (décote), P > F si y < taux de coupon (prime), P = F si y = taux de coupon (au pair).",
    en: "1) List each coupon C at dates 1 to N, plus F at date N. 2) Discount each flow: flow_t / (1+y)^t. 3) Sum all discounted flows. 4) Compare to face value: P < F if y > coupon rate (discount), P > F if y < coupon rate (premium), P = F if y = coupon rate (at par).",
  },
  interpretation: {
    fr: "Le prix et le rendement varient toujours en sens opposé : si le marché exige un rendement plus élevé (les taux montent), le prix baisse mécaniquement, et inversement. C'est la relation fondamentale de toute la gestion obligataire.",
    en: "Price and yield always move in opposite directions: if the market demands a higher yield (rates rise), the price mechanically falls, and vice versa. This is the foundational relationship of all bond management.",
  },
  pitfalls: {
    fr: "Confondre taux de coupon (fixe, inscrit dans le contrat) et rendement actuariel (variable, dépend du prix de marché) : une obligation à coupon 4% peut très bien avoir un rendement de 6% si son prix a baissé. Autre piège : oublier le coupon couru en comparant deux prix cotés entre deux dates de paiement différentes.",
    en: "Confusing the coupon rate (fixed, written into the contract) with the yield to maturity (variable, depends on the market price): a 4%-coupon bond can easily have a 6% yield if its price has fallen. Another trap: forgetting accrued interest when comparing two quoted prices between different payment dates.",
  },
  keyPoints: {
    fr: [
      "P = somme des coupons actualisés + nominal actualisé, au taux y exigé par le marché.",
      "P < F (décote) si y > coupon ; P > F (prime) si y < coupon ; P = F (pair) si y = coupon.",
      "Dirty price = Clean price + coupon couru ; c'est le dirty price qui est réellement payé.",
    ],
    en: [
      "P = sum of discounted coupons + discounted face value, at the market-required yield y.",
      "P < F (discount) if y > coupon; P > F (premium) if y < coupon; P = F (at par) if y = coupon.",
      "Dirty price = Clean price + accrued interest; the dirty price is what is actually paid.",
    ],
  },
  advancedDemonstration: {
    fr: "En réalité chaque flux devrait être actualisé à son propre taux spot z_t issu de la courbe des taux (voir M03-7), et non à un taux unique y : le YTM est une moyenne pondérée implicite qui n'est exacte que si la courbe est plate. Le coupon couru se calcule proportionnellement au temps écoulé depuis le dernier paiement : Coupon couru = C × (jours écoulés / jours de la période), en convention Actual/365 ou 30/360 selon le marché. La sensibilité du prix à y n'est pas linéaire : elle décroît (en valeur absolue de la pente) quand y augmente, un phénomène appelé convexité (voir M03-4), que la seule dérivée première (la duration, M03-3) ne capture pas complètement.",
    en: "In reality each cash flow should be discounted at its own spot rate z_t from the yield curve (see M03-7), not a single rate y: the YTM is an implicit weighted average that is only exact if the curve is flat. Accrued interest is computed proportionally to time elapsed since the last payment: Accrued = C × (days elapsed / days in the period), under an Actual/365 or 30/360 convention depending on the market. The price's sensitivity to y is not linear: its slope shrinks in absolute value as y rises, a phenomenon called convexity (see M03-4), which the first derivative alone (duration, M03-3) does not fully capture.",
  },
};
