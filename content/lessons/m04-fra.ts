import type { LessonContent } from "@/lib/lesson-types";

export const m04Fra: LessonContent = {
  conceptId: "m04-fra",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la distinction entre taux spot et taux forward, et le principe général d'un forward.",
      en: "You need to know the distinction between spot and forward rates, and the general principle of a forward.",
    },
    conceptIds: ["m03-taux-sans-risque", "m02-forward-future-definitions"],
  },
  glossary: [
    { term: { fr: "Notionnel", en: "Notional" }, definition: { fr: "Le montant de référence utilisé pour calculer les flux d'intérêt, jamais échangé lui-même.", en: "The reference amount used to compute interest flows, never actually exchanged." } },
    { term: { fr: "Taux de référence", en: "Reference rate" }, definition: { fr: "Le taux variable observé sur le marché à la date de fixing (ex. EURIBOR, SOFR), comparé au taux contractuel du FRA.", en: "The floating rate observed in the market on the fixing date (e.g. EURIBOR, SOFR), compared against the FRA's contract rate." } },
  ],
  intuition: {
    fr: "Un FRA permet de figer aujourd'hui le taux d'intérêt d'un emprunt ou d'un placement qui n'existera que plus tard, sans jamais prêter ou emprunter le capital lui-même : seul l'écart de taux est réglé, en cash.",
    en: "An FRA lets you lock in today the interest rate of a loan or deposit that will only exist later, without ever lending or borrowing the principal itself: only the rate difference is settled, in cash.",
  },
  definition: {
    fr: "Un Forward Rate Agreement (FRA) est un contrat de gré à gré par lequel deux parties fixent aujourd'hui un taux d'intérêt contractuel R_FRA, applicable à un notionnel donné sur une période future définie (ex. \"3x6\" : période de 3 mois débutant dans 3 mois). À la date de fixing, on compare R_FRA au taux de référence observé R_ref, et un seul flux net est réglé — en général au DÉBUT de la période, actualisé, plutôt qu'à la fin.",
    en: "A Forward Rate Agreement (FRA) is an over-the-counter contract by which two parties fix today a contractual interest rate R_FRA, applicable to a given notional over a defined future period (e.g. \"3x6\": a 3-month period starting in 3 months). On the fixing date, R_FRA is compared to the observed reference rate R_ref, and a single net flow is settled — usually at the START of the period, discounted, rather than at the end.",
  },
  utility: {
    fr: "Le FRA permet à une entreprise ou une banque de se couvrir contre une variation de taux sur un emprunt ou placement futur précis, sans mobiliser le capital sous-jacent ni affecter le bilan de la même façon qu'un vrai prêt.",
    en: "The FRA lets a company or bank hedge against a rate move on a specific future loan or deposit, without tying up the underlying principal or affecting the balance sheet the way an actual loan would.",
  },
  example: {
    fr: "Une entreprise sait qu'elle empruntera 10 000 000 EUR dans 3 mois, pour 3 mois, à un taux variable. Elle achète un FRA \"3x6\" à R_FRA = 3%, notionnel 10 000 000 EUR. Si à la date de fixing le taux de référence R_ref = 3,5%, elle reçoit un paiement compensant ce surcoût, ramenant son coût de financement effectif à 3%, quel que soit le taux réellement observé.",
    en: "A company knows it will borrow EUR 10,000,000 in 3 months, for 3 months, at a floating rate. It buys a \"3x6\" FRA at R_FRA = 3%, notional EUR 10,000,000. If on the fixing date the reference rate R_ref = 3.5%, it receives a payment offsetting that extra cost, bringing its effective financing cost back to 3%, whatever rate is actually observed.",
  },
  alternativeExplanation: {
    fr: "Voyez le FRA comme un pari réglé en espèces sur un taux d'intérêt futur, sans jamais toucher au capital : deux parties s'engagent sur \"quel sera le bon taux dans 3 mois pour un prêt de 3 mois\", et celle qui avait raison le plus près reçoit la différence de celle qui avait tort — un peu comme parier sur un match sans jamais y jouer soi-même.",
    en: "Think of the FRA as a cash-settled bet on a future interest rate, without ever touching the principal: two parties commit to \"what will the right rate be in 3 months for a 3-month loan\", and whoever was closer receives the difference from the other — a bit like betting on a match without ever playing it yourself.",
  },
  formula: {
    latex: "\\text{Règlement} = \\text{Notionnel} \\times \\frac{(R_{\\text{ref}} - R_{\\text{FRA}}) \\times \\frac{d}{360}}{1 + R_{\\text{ref}} \\times \\frac{d}{360}}",
    variables: [
      { symbol: "R_{\\text{ref}}", description: { fr: "Taux de référence observé à la date de fixing", en: "Reference rate observed on the fixing date" } },
      { symbol: "R_{\\text{FRA}}", description: { fr: "Taux contractuel fixé dans le FRA", en: "Contractual rate fixed in the FRA" } },
      { symbol: "d", description: { fr: "Nombre de jours de la période couverte par le FRA", en: "Number of days in the period covered by the FRA" } },
    ],
    assumptions: { fr: "Convention Actual/360 (marché EUR/USD) ; réglé à l'acheteur du FRA (qui bénéficie d'une hausse des taux) si R_ref > R_FRA.", en: "Actual/360 convention (EUR/USD market); paid to the FRA buyer (who benefits from a rate rise) if R_ref > R_FRA." },
    units: { fr: "Règlement dans la devise du notionnel ; taux en proportion annuelle.", en: "Settlement in the notional's currency; rates as annual proportions." },
    example: { fr: "Notionnel=10 000 000, R_ref=3,5%, R_FRA=3%, d=91 : Règlement ≈ 10 000 000 × (0,005×91/360)/(1+0,035×91/360) ≈ 12 600.", en: "Notional=10,000,000, R_ref=3.5%, R_FRA=3%, d=91: Settlement ≈ 10,000,000 × (0.005×91/360)/(1+0.035×91/360) ≈ 12,600." },
  },
  calculation: {
    fr: "1) Calculer l'écart de taux : R_ref − R_FRA. 2) Multiplier par le notionnel et par la fraction de période d/360. 3) Diviser par (1 + R_ref × d/360) pour actualiser ce montant au début de la période (puisqu'un vrai prêt aurait payé ses intérêts à la fin, pas au début). 4) Le résultat est reçu par l'acheteur du FRA si positif, payé s'il est négatif.",
    en: "1) Compute the rate gap: R_ref − R_FRA. 2) Multiply by the notional and by the period fraction d/360. 3) Divide by (1 + R_ref × d/360) to discount that amount back to the start of the period (since an actual loan would have paid interest at the end, not the start). 4) The result is received by the FRA buyer if positive, paid if negative.",
  },
  interpretation: {
    fr: "L'acheteur d'un FRA (celui qui \"emprunte\" fictivement) se protège contre une hausse des taux : si R_ref monte au-dessus de R_FRA, il reçoit une compensation. Le vendeur se protège symétriquement contre une baisse. Le FRA est un jeu à somme nulle entre les deux parties, comme tout forward.",
    en: "The FRA buyer (the fictitious \"borrower\") protects against a rate rise: if R_ref rises above R_FRA, they receive compensation. The seller symmetrically protects against a fall. The FRA is a zero-sum game between the two parties, like any forward.",
  },
  pitfalls: {
    fr: "Oublier d'actualiser le règlement au début de la période : c'est l'erreur la plus fréquente, car elle diffère d'un forward classique réglé à l'échéance. Autre piège : confondre le notionnel (jamais échangé) avec un vrai prêt échangé — le FRA ne modifie jamais le bilan de trésorerie comme le ferait un emprunt réel.",
    en: "Forgetting to discount the settlement back to the start of the period: this is the most common mistake, since it differs from a classic forward settled at maturity. Another trap: confusing the notional (never exchanged) with an actual loan being exchanged — the FRA never affects the cash balance sheet the way a real loan would.",
  },
  keyPoints: {
    fr: [
      "Un FRA fixe aujourd'hui un taux d'intérêt pour une période future, sans jamais échanger le notionnel.",
      "Le règlement est un flux net unique, actualisé et versé au DÉBUT de la période couverte, pas à la fin.",
      "L'acheteur profite d'une hausse des taux, le vendeur d'une baisse — un jeu à somme nulle.",
    ],
    en: [
      "An FRA locks in today an interest rate for a future period, without ever exchanging the notional.",
      "Settlement is a single net flow, discounted and paid at the START of the covered period, not the end.",
      "The buyer benefits from a rate rise, the seller from a fall — a zero-sum game.",
    ],
  },
  advancedDemonstration: {
    fr: "Le taux R_FRA \"juste\" (par non-arbitrage) est exactement le taux forward implicite f_{T1,T2} dérivé de la courbe des taux spot (voir M03-7) : (1+z_{T2})^{T2} = (1+z_{T1})^{T1} × (1+f_{T1,T2})^{(T2-T1)}. Un FRA n'est donc rien d'autre qu'un pari cash-settled sur ce taux forward théorique, ce qui explique pourquoi un portefeuille de FRA consécutifs (\"strip de FRA\") permet de répliquer approximativement un swap de taux (voir M04-2 et M04-3) — la différence tenant essentiellement à la fréquence de règlement et à la convention d'actualisation en début vs fin de période.",
    en: "The \"fair\" R_FRA (by no-arbitrage) is exactly the implied forward rate f_{T1,T2} derived from the spot rate curve (see M03-7): (1+z_{T2})^{T2} = (1+z_{T1})^{T1} × (1+f_{T1,T2})^{(T2-T1)}. An FRA is therefore nothing more than a cash-settled bet on this theoretical forward rate, which explains why a portfolio of consecutive FRAs (a \"FRA strip\") approximately replicates an interest rate swap (see M04-2 and M04-3) — the difference lying mainly in settlement frequency and the start-vs-end-of-period discounting convention.",
  },
};
