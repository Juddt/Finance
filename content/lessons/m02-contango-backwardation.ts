import type { LessonContent } from "@/lib/lesson-types";

export const m02ContangoBackwardation: LessonContent = {
  conceptId: "m02-contango-backwardation",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion s'appuie directement sur le coût de stockage et le rendement de convenance des matières premières.",
      en: "This concept builds directly on the storage cost and convenience yield of commodities.",
    },
    conceptIds: ["m02-matieres-premieres"],
  },
  glossary: [
    {
      term: { fr: "Courbe à terme (forward curve)", en: "Forward curve" },
      definition: {
        fr: "L'ensemble des prix forward cotés pour une même matière première à différentes échéances futures.",
        en: "The set of forward prices quoted for the same commodity at different future maturities.",
      },
    },
    {
      term: { fr: "Base", en: "Basis" },
      definition: {
        fr: "L'écart entre le prix forward (ou future) et le prix spot : Base = F0 − S0.",
        en: "The gap between the forward (or future) price and the spot price: Basis = F0 − S0.",
      },
    },
  ],
  intuition: {
    fr: "Contango et backwardation décrivent juste la forme de la courbe des prix forward : elle monte, ou elle descend, avec l'échéance. Le piège est de croire que cette forme prédit ce que fera le prix — alors qu'elle reflète surtout le coût de stockage et l'état des stocks aujourd'hui.",
    en: "Contango and backwardation simply describe the shape of the forward price curve: it slopes up, or it slopes down, with maturity. The trap is believing this shape predicts what the price will do — when it mostly reflects today's storage cost and inventory situation.",
  },
  definition: {
    fr: "On parle de contango quand le prix forward est supérieur au prix spot (F0 > S0, la courbe à terme est croissante), et de backwardation quand il lui est inférieur (F0 < S0, la courbe est décroissante). D'après la formule M02-6, contango correspond à un coût de portage net positif (u > y) et backwardation à un rendement de convenance dominant (y > u).",
    en: "Contango describes a forward price above the spot price (F0 > S0, an upward-sloping term curve), and backwardation a forward price below spot (F0 < S0, a downward-sloping curve). From the M02-6 formula, contango corresponds to a positive net cost of carry (u > y) and backwardation to a dominant convenience yield (y > u).",
  },
  utility: {
    fr: "Reconnaître si un marché est en contango ou en backwardation aide à comprendre le coût de \"rouler\" une position (renouveler un contrat future qui arrive à échéance), un enjeu majeur pour les ETF matières premières et les gérants qui détiennent des positions longues sur plusieurs mois.",
    en: "Recognizing whether a market is in contango or backwardation helps understand the cost of \"rolling\" a position (renewing a future contract nearing expiry), a major issue for commodity ETFs and managers holding long positions over several months.",
  },
  example: {
    fr: "En 2020, lors du choc de demande pétrolière, le pétrole WTI est passé brièvement en contango extrême : le stockage disponible était saturé, poussant le prix spot très bas par rapport aux contrats à plus longue échéance (personne ne voulait recevoir du pétrole physique immédiatement). À l'inverse, en période de tension géopolitique sur l'offre, le marché passe souvent en backwardation : le spot devient cher car tout le monde veut du pétrole tout de suite.",
    en: "In 2020, during the oil demand shock, WTI crude briefly went into extreme contango: available storage was saturated, pushing the spot price far below longer-dated contracts (nobody wanted to receive physical oil immediately). Conversely, during a geopolitical supply squeeze, the market often flips into backwardation: spot becomes expensive because everyone wants oil right now.",
  },
  alternativeExplanation: {
    fr: "Imaginez deux étiquettes de prix pour la même matière première : une pour la livraison immédiate, une pour la livraison dans 6 mois. Si les entrepôts débordent, personne ne veut payer cher pour la livraison immédiate (spot bas, contango) ; si les entrepôts sont vides et l'usine tourne à flux tendu, tout le monde veut la livraison immédiate quitte à payer plus cher que le contrat à terme (spot élevé, backwardation).",
    en: "Imagine two price tags for the same commodity: one for immediate delivery, one for delivery in 6 months. If warehouses are overflowing, nobody wants to pay up for immediate delivery (spot low, contango); if warehouses are empty and the factory is running lean, everyone wants immediate delivery even at a premium over the forward contract (spot high, backwardation).",
  },
  formula: {
    latex: "\\text{Base} = F_0 - S_0",
    variables: [
      { symbol: "F_0", description: { fr: "Prix forward coté aujourd'hui pour une échéance donnée", en: "Today's quoted forward price for a given maturity" } },
      { symbol: "S_0", description: { fr: "Prix spot actuel", en: "Current spot price" } },
    ],
    assumptions: {
      fr: "Base > 0 signale un contango, Base < 0 signale une backwardation ; on parle de backwardation \"normale\" (théorie de Keynes) quand ce phénomène reflète en plus une prime de risque payée aux vendeurs à découvert, au-delà du seul effet de convenance.",
      en: "Basis > 0 signals contango, Basis < 0 signals backwardation; \"normal\" backwardation (Keynes's theory) refers to when this also reflects a risk premium paid to short sellers, beyond the pure convenience effect.",
    },
    units: {
      fr: "Même unité que le prix (devise par baril, par tonne...).",
      en: "Same unit as the price (currency per barrel, per tonne...).",
    },
    example: {
      fr: "F0 = 78, S0 = 82 : Base = 78 − 82 = −4, le marché est en backwardation de 4.",
      en: "F0 = 78, S0 = 82: Basis = 78 − 82 = −4, the market is in backwardation of 4.",
    },
  },
  calculation: {
    fr: "1) Relever le prix spot S0 et le prix forward F0 pour l'échéance étudiée. 2) Calculer Base = F0 − S0. 3) Base positive → contango ; Base négative → backwardation. 4) Relier ce signe au coût de portage net (r + u − y) pour en comprendre la cause.",
    en: "1) Read off spot S0 and forward F0 for the maturity studied. 2) Compute Basis = F0 − S0. 3) Positive basis → contango; negative basis → backwardation. 4) Link the sign back to the net cost of carry (r + u − y) to understand its cause.",
  },
  interpretation: {
    fr: "Le contango et la backwardation ne sont pas des paris sur la direction future du prix spot : ils décrivent l'état présent de l'offre, de la demande et des stocks. Un marché en backwardation ne signifie pas que le prix va monter, il signifie que la livraison immédiate est plus recherchée que la livraison différée, aujourd'hui.",
    en: "Contango and backwardation are not bets on the future direction of the spot price: they describe the present state of supply, demand and inventories. A market in backwardation does not mean the price will rise, it means immediate delivery is more sought-after than deferred delivery, right now.",
  },
  pitfalls: {
    fr: "L'erreur la plus commune : penser que \"contango = le marché anticipe une hausse\" ou \"backwardation = le marché anticipe une baisse\". C'est faux dans le cadre du coût de portage pur — ces formes reflètent la structure de coûts et de stocks présents, pas une anticipation. Deuxième piège : oublier le coût de \"roll\" en contango — un fonds qui doit vendre un contrat proche de l'échéance moins cher pour racheter un contrat plus lointain plus cher perd de l'argent à chaque renouvellement, même si le prix spot ne bouge pas.",
    en: "The most common mistake: thinking \"contango = the market expects a rise\" or \"backwardation = the market expects a fall\". This is wrong under pure cost-of-carry reasoning — these shapes reflect the present cost and inventory structure, not a forecast. Second trap: forgetting the \"roll\" cost in contango — a fund that must sell a near-expiry contract cheap to buy a more distant, pricier one loses money on every rollover, even if the spot price does not move at all.",
  },
  keyPoints: {
    fr: [
      "Contango : F0 > S0, courbe croissante, coût de portage net positif (stockage cher, stocks abondants).",
      "Backwardation : F0 < S0, courbe décroissante, rendement de convenance dominant (stocks tendus).",
      "Ni l'un ni l'autre ne prédit la direction future du prix spot — c'est une erreur d'interprétation fréquente.",
    ],
    en: [
      "Contango: F0 > S0, upward-sloping curve, positive net cost of carry (expensive storage, ample inventory).",
      "Backwardation: F0 < S0, downward-sloping curve, dominant convenience yield (tight inventory).",
      "Neither predicts the spot price's future direction — a frequent misreading.",
    ],
  },
  advancedDemonstration: {
    fr: "La théorie de la \"backwardation normale\" de Keynes ajoute une couche supplémentaire : les producteurs (ex. agriculteurs) sont structurellement vendeurs à terme pour se couvrir, et doivent offrir une prime de risque aux spéculateurs qui acceptent la position longue en face. Cette prime pousse F0 en dessous de l'espérance du prix spot futur E[S_T], indépendamment de l'effet de convenance : F0 = E[S_T] − prime de risque. Distinguer les deux effets (convenance vs prime de risque de Keynes) reste débattu empiriquement et dépend fortement du marché et de la période — c'est une des raisons pour lesquelles \"le contango prédit une baisse\" est une simplification dangereuse à prendre pour argent comptant.",
    en: "Keynes's \"normal backwardation\" theory adds another layer: producers (e.g. farmers) are structural forward sellers to hedge, and must offer a risk premium to speculators who take the long side. This premium pushes F0 below the expected future spot price E[S_T], independent of the convenience effect: F0 = E[S_T] − risk premium. Disentangling the two effects (convenience vs Keynes's risk premium) remains empirically debated and depends heavily on the market and period — one reason \"contango predicts a fall\" is a dangerous oversimplification to take at face value.",
  },
};
