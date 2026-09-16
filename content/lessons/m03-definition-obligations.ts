import type { LessonContent } from "@/lib/lesson-types";

export const m03DefinitionObligations: LessonContent = {
  conceptId: "m03-definition-obligations",
  prerequisiteReminder: {
    text: {
      fr: "Il suffit de savoir ce qu'est le marché des capitaux et la différence entre dette et capital (actions).",
      en: "It helps to know what the capital market is and the difference between debt and equity (shares).",
    },
    conceptIds: ["m01-classes-actifs"],
  },
  glossary: [
    { term: { fr: "Valeur nominale (face value)", en: "Face value (par value)" }, definition: { fr: "Le montant remboursé à l'échéance, servant aussi de base au calcul des coupons.", en: "The amount repaid at maturity, also the base used to compute coupons." } },
    { term: { fr: "Taux de coupon", en: "Coupon rate" }, definition: { fr: "Le taux d'intérêt annuel fixé sur le nominal, versé périodiquement au porteur.", en: "The annual interest rate fixed on the face value, paid periodically to the holder." } },
    { term: { fr: "Émetteur", en: "Issuer" }, definition: { fr: "L'entité (État, entreprise) qui emprunte de l'argent en émettant l'obligation.", en: "The entity (government, company) borrowing money by issuing the bond." } },
  ],
  intuition: {
    fr: "Une obligation, c'est un prêt inversé : au lieu d'aller voir votre banque, c'est l'émetteur qui vous emprunte de l'argent, et s'engage à vous verser des intérêts réguliers puis à vous rembourser le capital à une date fixée.",
    en: "A bond is a loan in reverse: instead of you going to your bank, the issuer borrows money from you, and commits to paying regular interest then repaying the principal on a fixed date.",
  },
  definition: {
    fr: "Une obligation est un titre de créance : l'émetteur reçoit aujourd'hui un montant (le prix payé par l'investisseur), s'engage à verser des coupons périodiques calculés sur la valeur nominale, puis à rembourser cette valeur nominale à l'échéance. Une obligation zéro-coupon ne verse aucun coupon : elle est vendue avec une décote et remboursée à sa valeur nominale, la totalité du gain venant de cet écart.",
    en: "A bond is a debt security: the issuer receives an amount today (the price paid by the investor), commits to paying periodic coupons computed on the face value, then to repaying that face value at maturity. A zero-coupon bond pays no coupon at all: it is sold at a discount and redeemed at face value, with the entire gain coming from that gap.",
  },
  utility: {
    fr: "Les obligations permettent aux États et entreprises de financer leurs besoins sans diluer le capital, et aux investisseurs d'obtenir un revenu régulier et prévisible, avec un profil de risque généralement plus bas que les actions.",
    en: "Bonds let governments and companies finance their needs without diluting equity, and let investors earn a regular, predictable income, with a generally lower risk profile than equities.",
  },
  example: {
    fr: "Une obligation d'État de valeur nominale 1 000 EUR, coupon annuel 3%, maturité 5 ans, verse 30 EUR chaque année pendant 5 ans, puis rembourse 1 000 EUR la dernière année (en plus du dernier coupon). Une obligation zéro-coupon de même nominal et maturité serait vendue aujourd'hui environ 860 EUR et remboursée 1 000 EUR dans 5 ans, sans aucun versement intermédiaire.",
    en: "A government bond with face value EUR 1,000, annual coupon 3%, 5-year maturity, pays EUR 30 every year for 5 years, then repays EUR 1,000 in the final year (on top of the last coupon). A zero-coupon bond with the same face value and maturity would be sold today for about EUR 860 and redeemed at EUR 1,000 in 5 years, with no interim payment at all.",
  },
  alternativeExplanation: {
    fr: "Pensez à un zéro-coupon comme à un billet à ordre acheté en soldes : vous payez 860 EUR aujourd'hui pour un papier qui vaudra 1 000 EUR dans 5 ans, garanti par l'émetteur. La \"remise\" de 140 EUR est votre rémunération pour avoir prêté cet argent pendant 5 ans, condensée en un seul paiement final plutôt qu'étalée en coupons.",
    en: "Think of a zero-coupon bond as a promissory note bought on sale: you pay EUR 860 today for a piece of paper that will be worth EUR 1,000 in 5 years, guaranteed by the issuer. The EUR 140 \"discount\" is your compensation for lending that money for 5 years, condensed into one final payment instead of spread across coupons.",
  },
  formula: {
    latex: "P_{\\text{zéro-coupon}} = \\frac{F}{(1+r)^{T}}",
    variables: [
      { symbol: "F", description: { fr: "Valeur nominale remboursée à l'échéance", en: "Face value repaid at maturity" } },
      { symbol: "r", description: { fr: "Taux de rendement exigé pour cette échéance", en: "Required yield for that maturity" } },
      { symbol: "T", description: { fr: "Durée jusqu'à l'échéance, en années", en: "Time to maturity, in years" } },
    ],
    assumptions: { fr: "Aucun coupon intermédiaire ; F est garanti sans risque de défaut pour cet exemple.", en: "No intermediate coupon; F is assumed default-risk-free for this example." },
    units: { fr: "P et F dans la même devise ; r en proportion annuelle.", en: "P and F in the same currency; r as an annual proportion." },
    example: { fr: "F = 1 000, r = 3%, T = 5 : P = 1 000 / 1,03^5 ≈ 862,61.", en: "F = 1,000, r = 3%, T = 5: P = 1,000 / 1.03^5 ≈ 862.61." },
  },
  calculation: {
    fr: "1) Identifier la valeur nominale F et la maturité T. 2) Déterminer le taux de rendement exigé r pour cette échéance et ce risque de crédit. 3) Calculer (1+r)^T. 4) Diviser F par ce facteur pour obtenir le prix aujourd'hui.",
    en: "1) Identify the face value F and the maturity T. 2) Determine the required yield r for that maturity and credit risk. 3) Compute (1+r)^T. 4) Divide F by that factor to get today's price.",
  },
  interpretation: {
    fr: "Plus le taux exigé r est élevé ou la maturité T longue, plus le prix payé aujourd'hui est faible par rapport au nominal : l'investisseur \"paie moins cher\" un remboursement lointain et incertain.",
    en: "The higher the required yield r or the longer the maturity T, the lower today's price relative to face value: the investor \"pays less\" for a distant, less certain repayment.",
  },
  pitfalls: {
    fr: "Confondre valeur nominale et prix de marché : le prix fluctue avec les taux, la valeur nominale ne change jamais. Autre piège : croire qu'un zéro-coupon ne rapporte rien puisqu'il ne verse aucun coupon — en réalité toute sa rémunération est dans la décote initiale.",
    en: "Confusing face value with market price: the price fluctuates with rates, the face value never changes. Another trap: thinking a zero-coupon bond earns nothing since it pays no coupon — in reality all of its return sits in the initial discount.",
  },
  keyPoints: {
    fr: [
      "Une obligation = prêt : coupons périodiques + remboursement du nominal à l'échéance.",
      "Un zéro-coupon ne verse rien avant l'échéance : toute la rémunération est dans le prix d'achat décoté.",
      "Le prix d'un zéro-coupon P = F / (1+r)^T diminue quand r ou T augmentent.",
    ],
    en: [
      "A bond = a loan: periodic coupons + repayment of face value at maturity.",
      "A zero-coupon bond pays nothing before maturity: the entire return sits in the discounted purchase price.",
      "A zero-coupon's price P = F / (1+r)^T falls as r or T rise.",
    ],
  },
  advancedDemonstration: {
    fr: "Une obligation à coupons peut se décomposer analytiquement en un portefeuille de zéro-coupons : chaque coupon C_t est un zéro-coupon de valeur nominale C_t et de maturité t, et le remboursement final est un zéro-coupon de valeur nominale F et de maturité N. Le prix de l'obligation à coupons est alors simplement la somme des prix de ces zéro-coupons, chacun actualisé à son propre taux spot (voir la courbe des taux, M03-7) : P = Σ C_t/(1+z_t)^t + F/(1+z_N)^N. Cette décomposition justifie pourquoi le pricing obligataire (M03-2) actualise chaque flux séparément plutôt que d'utiliser un taux unique — c'est une approximation utile mais imparfaite si la courbe des taux n'est pas plate.",
    en: "A coupon bond can be decomposed analytically into a portfolio of zero-coupon bonds: each coupon C_t is a zero-coupon bond of face value C_t and maturity t, and the final repayment is a zero-coupon bond of face value F and maturity N. The coupon bond's price is then simply the sum of these zero-coupon prices, each discounted at its own spot rate (see the yield curve, M03-7): P = Σ C_t/(1+z_t)^t + F/(1+z_N)^N. This decomposition explains why bond pricing (M03-2) discounts each cash flow separately rather than using a single rate — a useful but imperfect approximation when the yield curve is not flat.",
  },
};
