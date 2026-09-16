import type { LessonContent } from "@/lib/lesson-types";

export const m04Dv01Swap: LessonContent = {
  conceptId: "m04-dv01-swap",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le DV01 d'une obligation et le pricing d'un swap par différence de jambes obligataires.",
      en: "You need to know a bond's DV01 and how to price a swap via the bond-legs difference.",
    },
    conceptIds: ["m03-dv01", "m04-pricing-swap"],
  },
  glossary: [
    { term: { fr: "Swap payeur / receveur", en: "Payer / receiver swap" }, definition: { fr: "Payeur = paie la jambe fixe, reçoit la jambe variable. Receveur = l'inverse.", en: "Payer = pays the fixed leg, receives the floating leg. Receiver = the reverse." } },
  ],
  intuition: {
    fr: "Puisqu'un swap se décompose en une jambe fixe (qui se comporte comme une obligation classique) et une jambe variable (qui se comporte comme un compte au taux du jour, presque insensible aux taux), le risque de taux d'un swap vient presque entièrement de sa jambe fixe — exactement comme celui d'une obligation à coupon fixe.",
    en: "Since a swap decomposes into a fixed leg (behaving like a plain bond) and a floating leg (behaving like an account paid at today's rate, almost rate-insensitive), a swap's interest rate risk comes almost entirely from its fixed leg — exactly like a fixed-coupon bond's.",
  },
  definition: {
    fr: "Le DV01 d'un swap mesure la variation de sa valeur pour une hausse de 1 point de base des taux. Il s'obtient comme DV01_swap ≈ DV01_jambe fixe − DV01_jambe variable, où le DV01 de la jambe variable est faible (proche de celui d'un instrument qui se \"reset\" au pair à chaque période) : en pratique, DV01_swap ≈ DV01_jambe fixe pour un swap qui vient d'être resetté.",
    en: "A swap's DV01 measures its value change for a 1 basis point rate rise. It is obtained as DV01_swap ≈ DV01_fixed_leg − DV01_floating_leg, where the floating leg's DV01 is small (close to that of an instrument that \"resets\" to par each period): in practice, DV01_swap ≈ DV01_fixed_leg for a swap that has just reset.",
  },
  utility: {
    fr: "Le DV01 d'un swap permet de dimensionner une couverture (avec des obligations, des futures de taux, ou d'autres swaps) et d'agréger le risque de taux d'un portefeuille mêlant obligations et swaps dans une seule unité commune, comme pour n'importe quel instrument de taux.",
    en: "A swap's DV01 lets you size a hedge (with bonds, rate futures, or other swaps) and aggregate the interest rate risk of a portfolio mixing bonds and swaps into a single common unit, just like any other rate instrument.",
  },
  example: {
    fr: "Un swap receveur fixe de notionnel 20 000 000 EUR, maturité 5 ans, se comporte comme une obligation 5 ans de duration modifiée 4,6 : DV01_swap ≈ 20 000 000 × 4,6 × 0,0001 ≈ 9 200 EUR par point de base. Si les taux montent de 1 pb, la valeur du swap pour son détenteur receveur fixe baisse d'environ 9 200 EUR (comme pour un porteur obligataire).",
    en: "A fixed-receiver swap with notional EUR 20,000,000, 5-year maturity, behaves like a 5-year bond of modified duration 4.6: DV01_swap ≈ 20,000,000 × 4.6 × 0.0001 ≈ EUR 9,200 per basis point. If rates rise by 1 bp, the swap's value for its fixed-receiver holder falls by about EUR 9,200 (just like a bondholder).",
  },
  alternativeExplanation: {
    fr: "Un receveur fixe sur un swap est, en termes de sensibilité aux taux, presque identique à quelqu'un qui détient une obligation à taux fixe financée par un emprunt à taux variable : la jambe variable (l'emprunt) ne bouge quasiment pas de valeur quand les taux changent (elle se réajuste automatiquement), donc toute la sensibilité vient de la jambe fixe (l'obligation détenue).",
    en: "A fixed-rate receiver on a swap is, in terms of rate sensitivity, almost identical to someone holding a fixed-rate bond funded by a floating-rate loan: the floating leg (the loan) barely changes value when rates move (it automatically resets), so all the sensitivity comes from the fixed leg (the bond held).",
  },
  formula: {
    latex: "\\text{DV01}_{\\text{swap}} \\approx \\text{Notionnel} \\times D_{\\text{mod, jambe fixe}} \\times 0{,}0001",
    variables: [
      { symbol: "D_{\\text{mod, jambe fixe}}", description: { fr: "Duration modifiée de la jambe fixe, traitée comme une obligation à coupon R_fixe", en: "Modified duration of the fixed leg, treated as a bond with coupon R_fixed" } },
    ],
    assumptions: { fr: "Le swap vient d'être resetté (jambe variable exactement au pair, DV01 négligeable) ; approximation locale pour 1 point de base.", en: "The swap has just reset (floating leg exactly at par, negligible DV01); local approximation for 1 basis point." },
    units: { fr: "DV01 dans la devise du notionnel, par point de base.", en: "DV01 in the notional's currency, per basis point." },
    example: { fr: "Notionnel=20 000 000, D_mod=4,6 : DV01 ≈ 20 000 000 × 4,6 × 0,0001 = 9 200.", en: "Notional=20,000,000, D_mod=4.6: DV01 ≈ 20,000,000 × 4.6 × 0.0001 = 9,200." },
  },
  calculation: {
    fr: "1) Traiter la jambe fixe comme une obligation classique de coupon R_fixe, maturité et notionnel identiques. 2) Calculer sa duration modifiée (M03-3). 3) Appliquer la formule du DV01 obligataire (M03-8) à cette jambe. 4) Le DV01 du swap complet est approximativement celui de cette seule jambe fixe.",
    en: "1) Treat the fixed leg as a plain bond with coupon R_fixed, identical maturity and notional. 2) Compute its modified duration (M03-3). 3) Apply the bond DV01 formula (M03-8) to that leg. 4) The full swap's DV01 is approximately that of the fixed leg alone.",
  },
  interpretation: {
    fr: "Un receveur fixe a un DV01 positif au sens obligataire (il perd si les taux montent) ; un payeur fixe a un DV01 de signe opposé (il gagne si les taux montent, comme un emprunteur à taux fixe protégé contre la hausse). Cette symétrie permet d'utiliser les swaps comme outil de couverture de taux flexible, sans mobiliser le bilan comme le ferait l'achat ou la vente d'obligations physiques.",
    en: "A fixed receiver has a positive bond-like DV01 (loses if rates rise); a fixed payer has the opposite sign (gains if rates rise, like a fixed-rate borrower protected against a rise). This symmetry lets swaps be used as a flexible rate-hedging tool, without tying up the balance sheet the way buying or selling physical bonds would.",
  },
  pitfalls: {
    fr: "Oublier la jambe variable et supposer qu'elle a un DV01 rigoureusement nul en permanence : entre deux dates de reset, elle porte un petit risque de taux résiduel, généralement négligeable mais pas nul. Autre piège : confondre le signe du DV01 entre payeur et receveur fixe, ce qui inverse le sens d'une couverture.",
    en: "Forgetting the floating leg and assuming its DV01 is strictly zero at all times: between two reset dates, it carries a small residual rate risk, usually negligible but not zero. Another trap: mixing up the DV01 sign between fixed payer and receiver, which flips a hedge's direction.",
  },
  keyPoints: {
    fr: [
      "DV01_swap ≈ DV01 de la jambe fixe seule, la jambe variable ayant un DV01 quasi nul juste après un reset.",
      "Receveur fixe : DV01 positif (perd si les taux montent) ; payeur fixe : DV01 négatif (gagne si les taux montent).",
      "Les swaps permettent de couvrir un risque de taux sans mobiliser le bilan comme des obligations physiques.",
    ],
    en: [
      "DV01_swap ≈ the fixed leg's DV01 alone, since the floating leg's DV01 is near zero right after a reset.",
      "Fixed receiver: positive DV01 (loses if rates rise); fixed payer: negative DV01 (gains if rates rise).",
      "Swaps let you hedge rate risk without tying up the balance sheet the way physical bonds would.",
    ],
  },
  advancedDemonstration: {
    fr: "Comme pour le DV01 obligataire, l'approximation DV01_swap ≈ DV01_jambe fixe suppose un déplacement parallèle de la courbe ; en cadre multi-courbe (M04-4), un mouvement du seul basis EURIBOR-OIS (sans mouvement de la courbe OIS elle-même) affecte la jambe variable projetée sans affecter l'actualisation, un risque distinct que les desks professionnels suivent séparément sous le nom de \"basis DV01\". Les gérants sophistiqués décomposent également le DV01 par \"seau\" de maturité (key rate DV01, voir M03-8) plutôt que de le traiter comme un chiffre unique, pour couvrir séparément le risque sur différentes parties de la courbe.",
    en: "As with bond DV01, the DV01_swap ≈ DV01_fixed_leg approximation assumes a parallel curve shift; in a multi-curve framework (M04-4), a move in the EURIBOR-OIS basis alone (without a move in the OIS curve itself) affects the projected floating leg without affecting discounting, a distinct risk professional desks track separately as \"basis DV01\". Sophisticated managers also decompose DV01 by maturity \"bucket\" (key rate DV01, see M03-8) rather than treating it as a single number, to separately hedge risk on different parts of the curve.",
  },
};
