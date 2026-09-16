import type { LessonContent } from "@/lib/lesson-types";

export const m02PrixForwardNonArbitrage: LessonContent = {
  conceptId: "m02-prix-forward-non-arbitrage",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion suppose que vous savez ce qu'est un forward et son payoff, et ce qu'est une opportunité d'arbitrage (un profit garanti sans mise de fonds ni risque).",
      en: "This assumes you know what a forward is and its payoff, and what an arbitrage opportunity is (a guaranteed profit with no capital and no risk).",
    },
    conceptIds: ["m02-forward-future-definitions", "m01-arbitrage"],
  },
  glossary: [
    {
      term: { fr: "Cash-and-carry", en: "Cash-and-carry" },
      definition: {
        fr: "Stratégie qui consiste à acheter l'actif au comptant en empruntant l'argent, puis à le \"porter\" jusqu'à l'échéance du forward.",
        en: "A strategy of buying the asset spot with borrowed money, then \"carrying\" it until the forward's maturity.",
      },
    },
    {
      term: { fr: "Taux sans risque", en: "Risk-free rate" },
      definition: {
        fr: "Le taux auquel on peut emprunter ou prêter sans risque de défaut, sur la durée considérée.",
        en: "The rate at which one can borrow or lend with no default risk, over the period considered.",
      },
    },
  ],
  intuition: {
    fr: "Le prix forward n'est pas une prédiction du marché sur ce que vaudra l'actif plus tard : c'est un prix imposé mécaniquement, pour qu'il soit impossible de gagner de l'argent gratuitement en combinant le forward et le marché au comptant.",
    en: "The forward price is not the market's prediction of what the asset will be worth later: it is mechanically forced to a level that makes it impossible to earn free money by combining the forward with the spot market.",
  },
  definition: {
    fr: "Le prix forward par non-arbitrage F0 est le seul prix qui empêche toute stratégie sans risque et sans mise de fonds de générer un profit garanti. Pour un actif qui ne verse aucun revenu pendant la vie du contrat, F0 = S0 × (1 + r)^T, où S0 est le prix spot actuel, r le taux sans risque et T la durée en années.",
    en: "The no-arbitrage forward price F0 is the only price that prevents any risk-free, zero-cost strategy from generating a guaranteed profit. For an asset paying no income during the contract's life, F0 = S0 × (1 + r)^T, where S0 is today's spot price, r the risk-free rate and T the time in years.",
  },
  utility: {
    fr: "Cette formule permet à n'importe qui de calculer (ou de vérifier) un prix forward sans avoir besoin de prévoir le marché : elle sert à coter des forwards, détecter des opportunités d'arbitrage, et comprendre pourquoi les prix forward et spot bougent presque toujours ensemble.",
    en: "This formula lets anyone compute (or check) a forward price without needing to forecast the market: it is used to quote forwards, detect arbitrage opportunities, and understand why forward and spot prices almost always move together.",
  },
  example: {
    fr: "Une action ne verse pas de dividende, cote S0 = 100 EUR, et le taux sans risque à 1 an est r = 5%. Le prix forward à 1 an doit être F0 = 100 × (1,05)^1 = 105 EUR. S'il cotait 110 EUR sur le marché, tout le monde aurait intérêt à l'acheter au comptant à crédit et à la vendre à terme à 110 : profit garanti de 5 EUR sans rien miser.",
    en: "A stock pays no dividend, trades at S0 = EUR 100, and the 1-year risk-free rate is r = 5%. The 1-year forward price must be F0 = 100 × (1.05)^1 = EUR 105. If it traded at EUR 110 in the market, everyone would want to buy it spot on credit and sell it forward at 110: a guaranteed EUR 5 profit for no stake at all.",
  },
  alternativeExplanation: {
    fr: "Deux chemins mènent au même endroit : (1) acheter le forward directement, ou (2) emprunter S0 aujourd'hui, acheter l'actif comptant, le garder jusqu'à T, puis le livrer contre K. Le chemin (2) coûte exactement S0 × (1+r)^T en remboursement du prêt. Si le forward valait autre chose que ce montant, un des deux chemins serait systématiquement moins cher que l'autre pour obtenir exactement le même actif à la même date — ce qui est impossible sur un marché sans friction : les deux chemins doivent donc coûter pareil.",
    en: "Two paths lead to the same place: (1) buy the forward directly, or (2) borrow S0 today, buy the asset spot, hold it until T, then deliver it against K. Path (2) costs exactly S0 × (1+r)^T in loan repayment. If the forward were priced at anything else, one path would systematically be cheaper than the other for obtaining the exact same asset on the exact same date — which is impossible in a frictionless market: the two paths must therefore cost the same.",
  },
  formula: {
    latex: "F_0 = S_0 \\times (1 + r)^{T}",
    variables: [
      { symbol: "S_0", description: { fr: "Prix spot (au comptant) de l'actif aujourd'hui", en: "Today's spot price of the asset" } },
      { symbol: "r", description: { fr: "Taux sans risque annuel (composé annuellement)", en: "Annual risk-free rate (annually compounded)" } },
      { symbol: "T", description: { fr: "Durée jusqu'à l'échéance, en années", en: "Time to maturity, in years" } },
    ],
    assumptions: {
      fr: "L'actif ne verse aucun revenu (pas de dividende, pas de coupon) pendant la vie du contrat ; on peut emprunter et prêter au même taux sans risque r ; pas de coûts de transaction ni de contrainte d'accès au marché.",
      en: "The asset pays no income (no dividend, no coupon) during the contract's life; one can borrow and lend at the same risk-free rate r; no transaction costs and no market-access constraints.",
    },
    units: {
      fr: "S0 et F0 dans la même devise et unité ; r en proportion annuelle (5% = 0,05) ; T en années (6 mois = 0,5).",
      en: "S0 and F0 in the same currency and unit; r as an annual proportion (5% = 0.05); T in years (6 months = 0.5).",
    },
    example: {
      fr: "S0 = 100, r = 5%, T = 1 : F0 = 100 × 1,05^1 = 105.",
      en: "S0 = 100, r = 5%, T = 1: F0 = 100 × 1.05^1 = 105.",
    },
  },
  calculation: {
    fr: "1) Relever le prix spot S0. 2) Relever le taux sans risque r pour la durée du contrat. 3) Convertir T en années. 4) Calculer (1 + r)^T. 5) Multiplier : F0 = S0 × (1 + r)^T.",
    en: "1) Read off the spot price S0. 2) Read off the risk-free rate r for the contract's duration. 3) Convert T to years. 4) Compute (1 + r)^T. 5) Multiply: F0 = S0 × (1 + r)^T.",
  },
  interpretation: {
    fr: "F0 est toujours supérieur à S0 dès que r > 0 : c'est le coût de financement pour \"porter\" l'actif jusqu'à l'échéance, pas une prévision de hausse. Plus le taux ou la durée augmentent, plus l'écart entre F0 et S0 se creuse mécaniquement.",
    en: "F0 is always above S0 as soon as r > 0: this is the financing cost of \"carrying\" the asset until maturity, not a forecast of a rise. The higher the rate or the longer the duration, the more F0 mechanically pulls away from S0.",
  },
  pitfalls: {
    fr: "Croire que F0 > S0 signifie que le marché anticipe une hausse du prix : c'est faux, c'est uniquement le coût de portage. Autre erreur : utiliser le rendement attendu de l'actif au lieu du taux sans risque — la formule de non-arbitrage n'a besoin d'aucune anticipation, seulement du taux de financement.",
    en: "Believing F0 > S0 means the market expects the price to rise: this is wrong, it is purely the cost of carry. Another mistake: using the asset's expected return instead of the risk-free rate — the no-arbitrage formula needs no forecast at all, only the financing rate.",
  },
  keyPoints: {
    fr: [
      "F0 = S0 × (1 + r)^T pour un actif sans revenu : c'est un prix imposé, pas une prévision.",
      "Si le forward coté s'écarte de F0, une stratégie cash-and-carry (ou l'inverse) dégage un profit sans risque.",
      "F0 > S0 reflète le coût de financement (portage), pas une anticipation de hausse du marché.",
    ],
    en: [
      "F0 = S0 × (1 + r)^T for an income-free asset: it is an enforced price, not a forecast.",
      "If the quoted forward departs from F0, a cash-and-carry strategy (or its reverse) locks in a risk-free profit.",
      "F0 > S0 reflects the cost of financing (carry), not a market expectation of a rise.",
    ],
  },
  advancedDemonstration: {
    fr: "Avec un actif versant un revenu connu (dividende, coupon) de valeur actuelle PV(revenu), le coût net de portage diminue : F0 = (S0 − PV(revenu)) × (1 + r)^T. En composition continue, la formule équivalente est F0 = S0 × e^{(r−q)T}, où q est le taux de rendement du revenu (dividend yield continu). Preuve par arbitrage complète : si F_marché > F0, on vend le forward, on emprunte S0, on achète l'actif comptant ; à l'échéance on livre l'actif contre F_marché et on rembourse S0×(1+r)^T < F_marché — profit sans risque de F_marché − F0. Si F_marché < F0, la stratégie inverse (vente à découvert de l'actif, placement du produit, achat du forward) dégage le même type de profit. C'est cette symétrie des deux arbitrages qui verrouille F0 à une valeur unique.",
    en: "With an asset paying a known income (dividend, coupon) whose present value is PV(income), the net cost of carry decreases: F0 = (S0 − PV(income)) × (1 + r)^T. Under continuous compounding, the equivalent formula is F0 = S0 × e^{(r−q)T}, where q is the income's continuous yield (dividend yield). Full arbitrage proof: if F_market > F0, sell the forward, borrow S0, buy the asset spot; at maturity deliver the asset against F_market and repay S0×(1+r)^T < F_market — a risk-free profit of F_market − F0. If F_market < F0, the reverse strategy (short the asset, invest the proceeds, buy the forward) locks in the same type of profit. It is this symmetry of the two arbitrages that pins F0 to a single value.",
  },
};
