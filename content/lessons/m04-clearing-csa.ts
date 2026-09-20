import type { LessonContent } from "@/lib/lesson-types";

export const m04ClearingCsa: LessonContent = {
  conceptId: "m04-clearing-csa",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir comment un swap de taux est pricé et comment sa valeur évolue dans le temps, présenté dans la notion précédente.",
      en: "You need to know how an interest rate swap is priced and how its value evolves over time, covered in the previous concept.",
    },
    conceptIds: ["m04-pricing-swap"],
  },
  glossary: [
    { term: { fr: "CCP (Chambre de compensation)", en: "CCP (Central Counterparty)" }, definition: { fr: "Une entité qui s'interpose entre l'acheteur et le vendeur d'un dérivé, devenant l'acheteur de tout vendeur et le vendeur de tout acheteur, pour mutualiser et gérer le risque de contrepartie.", en: "An entity that interposes itself between a derivative's buyer and seller, becoming the buyer to every seller and the seller to every buyer, to pool and manage counterparty risk." } },
    { term: { fr: "CSA (Credit Support Annex)", en: "CSA (Credit Support Annex)" }, definition: { fr: "L'annexe d'un contrat-cadre ISDA qui définit les règles d'échange de collatéral entre deux contreparties dans une relation bilatérale (non compensée).", en: "The annex to an ISDA master agreement that defines the rules for exchanging collateral between two counterparties in a bilateral (non-cleared) relationship." } },
  ],
  intuition: {
    fr: "Sur un contrat dérivé de plusieurs années, la valeur de la position évolue constamment : si votre contrepartie fait défaut au moment où le contrat vous est favorable, vous perdez cette valeur. Le clearing central et les appels de marge existent pour répondre à une question simple : qui paie qui, et combien, si l'une des deux parties ne peut plus honorer ses engagements ?",
    en: "On a multi-year derivative contract, the position's value keeps changing: if your counterparty defaults while the contract is in your favor, you lose that value. Central clearing and margin calls exist to answer a simple question: who pays whom, and how much, if one of the two parties can no longer honor its commitments?",
  },
  definition: {
    fr: "Deux cadres coexistent pour gérer ce risque de contrepartie. En bilatéral, un contrat-cadre ISDA et son annexe CSA définissent les règles d'échange de collatéral (cash ou titres) entre les deux contreparties directement. En compensation centrale, une chambre de compensation (CCP) s'interpose entre les deux parties via la novation : chaque contrepartie ne fait plus face qu'à la CCP, qui devient acheteuse de tout vendeur et vendeuse de tout acheteur. Dans les deux cas, deux types de marge circulent : la marge de variation (VM), échangée régulièrement pour refléter la variation de valeur de marché de la position, et la marge initiale (IM), un coussin de sécurité déposé une fois et conservé pour couvrir le risque que la position se dégrade encore avant qu'une position en défaut puisse être débouclée.",
    en: "Two frameworks coexist to manage this counterparty risk. Bilaterally, an ISDA master agreement and its CSA annex define the rules for exchanging collateral (cash or securities) directly between the two counterparties. In central clearing, a central counterparty (CCP) interposes itself between the two parties via novation: each counterparty now only faces the CCP, which becomes the buyer to every seller and the seller to every buyer. In both cases, two types of margin circulate: variation margin (VM), exchanged regularly to reflect the position's mark-to-market change, and initial margin (IM), a safety buffer posted once and held to cover the risk that the position deteriorates further before a defaulting position can be closed out.",
  },
  utility: {
    fr: "Ce cadre a été profondément renforcé après la crise de 2008, où des positions dérivées massives et insuffisamment collatéralisées (notamment chez AIG) ont amplifié la crise systémique. Les réglementations EMIR (en Europe) et Dodd-Frank (aux États-Unis) imposent désormais la compensation centrale pour la plupart des dérivés standardisés. Ce cadre a aussi une conséquence directe sur le pricing : les flux collatéralisés en cash (VM) se refinancent au taux au jour le jour du collatéral, ce qui a poussé l'industrie à actualiser les swaps collatéralisés à ce taux plutôt qu'au taux LIBOR historique — la motivation directe du cadre multi-courbe (notion suivante).",
    en: "This framework was deeply strengthened after the 2008 crisis, where massive, insufficiently collateralized derivative positions (notably at AIG) amplified the systemic crisis. EMIR (in Europe) and Dodd-Frank (in the US) regulations now mandate central clearing for most standardized derivatives. This framework also has a direct pricing consequence: cash-collateralized flows (VM) refinance at the collateral's overnight rate, which pushed the industry to discount collateralized swaps at that rate rather than the historical LIBOR rate — the direct motivation for the multi-curve framework (next concept).",
  },
  example: {
    fr: "Un swap de taux a une valeur de marché (MtM) de 95 000 EUR en faveur de la banque A à la dernière date d'échange de marge. Le lendemain, suite à une baisse des taux, sa valeur passe à 120 000 EUR en faveur de A. L'appel de marge de variation correspond à cette variation : 120 000 − 95 000 = 25 000 EUR, que la contrepartie B doit transférer à A pour ramener l'exposition non collatéralisée à zéro.",
    en: "An interest rate swap has a mark-to-market (MtM) value of EUR 95,000 in bank A's favor at the last margin exchange date. The next day, following a rate decline, its value rises to EUR 120,000 in A's favor. The variation margin call corresponds to this change: 120,000 − 95,000 = EUR 25,000, which counterparty B must transfer to A to bring the uncollateralized exposure back to zero.",
  },
  alternativeExplanation: {
    fr: "Voyez la CCP comme un intermédiaire de confiance de type \"séquestre\" (escrow) sur une place de marché en ligne : au lieu que l'acheteur et le vendeur se fassent mutuellement confiance directement, une plateforme garantit la transaction des deux côtés, exigeant de chacun un dépôt de garantie. La marge de variation, elle, fonctionne comme un compte courant remis à zéro régulièrement : au lieu de laisser s'accumuler une dette potentiellement énorme sur toute la durée du contrat, elle est réglée au fil de l'eau.",
    en: "Think of the CCP as a trusted \"escrow\"-type intermediary on an online marketplace: instead of the buyer and seller trusting each other directly, a platform guarantees the transaction on both sides, requiring a security deposit from each. Variation margin, meanwhile, works like a running account reset regularly: instead of letting a potentially huge debt accumulate over the contract's entire life, it is settled along the way.",
  },
  formula: {
    latex: "\\begin{aligned} \\text{Appel de marge (VM)} &= MtM_t - MtM_{t-1} \\\\ IM &= \\alpha \\times \\text{Notionnel} \\end{aligned}",
    variables: [
      { symbol: "MtM_t, MtM_{t-1}", description: { fr: "Valeur de marché de la position à la date courante et à la date précédente d'échange de marge", en: "The position's market value at the current and previous margin exchange dates" } },
      { symbol: "\\alpha", description: { fr: "Taux de marge initiale fixé par la CCP ou le CSA (issu d'un modèle de risque)", en: "Initial margin rate set by the CCP or CSA (derived from a risk model)" } },
    ],
    assumptions: { fr: "L'appel de marge de variation est ici simplifié (échange net entre deux dates) ; en pratique, il peut être quotidien voire intrajournalier. Le taux de marge initiale α est simplifié : en réalité, il provient d'un modèle de risque (ex. VaR historique) plutôt que d'un taux fixe unique.", en: "The variation margin call is simplified here (a net exchange between two dates); in practice it can be daily or even intraday. The initial margin rate α is simplified: in reality it comes from a risk model (e.g. historical VaR) rather than a single fixed rate." },
    units: { fr: "Montants en devise du notionnel.", en: "Amounts in the notional's currency." },
    example: { fr: "MtM_t=120 000, MtM_{t-1}=95 000 → VM=25 000. α=4%, Notionnel=10 000 000 → IM=400 000.", en: "MtM_t=120,000, MtM_{t-1}=95,000 → VM=25,000. α=4%, Notional=10,000,000 → IM=400,000." },
  },
  calculation: {
    fr: "1) Relever la valeur de marché (MtM) de la position à la date courante et à la date précédente d'échange de marge. 2) Soustraire pour obtenir l'appel de marge de variation : la contrepartie perdante paie ce montant à la contrepartie gagnante. 3) Pour la marge initiale : appliquer le taux fixé par la CCP/CSA au notionnel de la position.",
    en: "1) Read off the position's mark-to-market (MtM) value at the current and previous margin exchange dates. 2) Subtract to get the variation margin call: the losing counterparty pays this amount to the winning counterparty. 3) For initial margin: apply the rate set by the CCP/CSA to the position's notional.",
  },
  interpretation: {
    fr: "Un échange fréquent (souvent quotidien) de marge de variation maintient l'exposition non collatéralisée entre deux contreparties proche de zéro à tout instant : la perte potentielle en cas de défaut se limite alors, en théorie, à la variation de valeur survenue depuis le dernier appel de marge, plus la période nécessaire pour déboucler la position (le \"margin period of risk\") — c'est précisément ce que la marge initiale est calibrée pour couvrir.",
    en: "Frequent (often daily) variation margin exchange keeps the uncollateralized exposure between two counterparties close to zero at any time: the potential loss in case of default is then theoretically limited to the value change since the last margin call, plus the time needed to close out the position (the \"margin period of risk\") — exactly what initial margin is calibrated to cover.",
  },
  pitfalls: {
    fr: "Confondre marge initiale et marge de variation : l'IM est un coussin déposé une fois et restitué (avec intérêts) au dénouement de la position si tout se passe bien, tandis que la VM est un règlement définitif qui transfère réellement de la valeur d'une contrepartie à l'autre au fil du temps, sans jamais être restituée. Autre piège : croire que la compensation centrale élimine totalement le risque systémique — elle le concentre plutôt sur un nombre réduit d'acteurs (les CCP), qui deviennent eux-mêmes des nœuds critiques du système financier.",
    en: "Confusing initial margin and variation margin: IM is a buffer posted once and returned (with interest) at the position's unwind if all goes well, while VM is a final settlement that genuinely transfers value from one counterparty to the other over time, never returned. Another trap: believing central clearing eliminates systemic risk entirely — it rather concentrates it on a small number of players (the CCPs), which themselves become critical nodes of the financial system.",
  },
  keyPoints: {
    fr: [
      "CCP (compensation centrale, via novation) et CSA (bilatéral) sont deux cadres pour gérer le risque de contrepartie sur les dérivés.",
      "Marge de variation (VM) : règlement régulier reflétant la variation de valeur de marché, transféré définitivement. Marge initiale (IM) : coussin déposé, restitué au dénouement.",
      "EMIR/Dodd-Frank imposent la compensation centrale pour la plupart des dérivés standardisés depuis la crise de 2008.",
    ],
    en: [
      "CCP (central clearing, via novation) and CSA (bilateral) are two frameworks to manage counterparty risk on derivatives.",
      "Variation margin (VM): regular settlement reflecting the mark-to-market change, transferred permanently. Initial margin (IM): a posted buffer, returned at unwind.",
      "EMIR/Dodd-Frank have mandated central clearing for most standardized derivatives since the 2008 crisis.",
    ],
  },
  advancedDemonstration: {
    fr: "L'exemple le plus cité de défaillance de ce cadre est celui d'AIG en 2008 : la filiale AIG Financial Products avait vendu d'énormes volumes de protection CDS sans exiger de collatéral suffisant de sa part (peu de VM échangée), et sans marge initiale substantielle. Quand la crise a fait chuter la valeur des actifs sous-jacents, AIG s'est retrouvée incapable de honorer les appels de marge colossaux qui en découlaient, nécessitant un sauvetage massif par l'État américain pour éviter une cascade de défauts chez ses contreparties. En cas de défaut d'un membre d'une CCP aujourd'hui, une \"cascade de défaut\" (default waterfall) prédéfinie s'enclenche : d'abord la marge initiale du membre défaillant, puis sa contribution au fonds de défaut mutualisé, puis le capital propre de la CCP elle-même (son \"skin in the game\"), et enfin, en dernier recours, les contributions mutualisées des autres membres survivants — une structure conçue pour que la perte soit absorbée par étapes, avant d'affecter l'ensemble du système.",
    en: "The most cited example of this framework's failure is AIG in 2008: the AIG Financial Products subsidiary had sold enormous volumes of CDS protection without requiring sufficient collateral from itself (little VM exchanged), and with no substantial initial margin. When the crisis drove down the value of the underlying assets, AIG found itself unable to meet the resulting colossal margin calls, requiring a massive US government bailout to prevent a cascade of defaults among its counterparties. If a CCP member defaults today, a predefined \"default waterfall\" kicks in: first the defaulting member's own initial margin, then its contribution to the mutualized default fund, then the CCP's own capital (its \"skin in the game\"), and finally, as a last resort, the mutualized contributions of the other surviving members — a structure designed so the loss is absorbed in stages, before affecting the whole system.",
  },
};
