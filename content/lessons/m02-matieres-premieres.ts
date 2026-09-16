import type { LessonContent } from "@/lib/lesson-types";

export const m02MatieresPremieres: LessonContent = {
  conceptId: "m02-matieres-premieres",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion approfondit la formule de prix forward par non-arbitrage pour le cas particulier des matières premières physiques.",
      en: "This concept extends the no-arbitrage forward pricing formula to the special case of physical commodities.",
    },
    conceptIds: ["m02-prix-forward-non-arbitrage"],
  },
  glossary: [
    {
      term: { fr: "Coût de stockage", en: "Storage cost" },
      definition: {
        fr: "Le coût réel de garder physiquement une matière première (entrepôt, assurance, réfrigération...) jusqu'à l'échéance.",
        en: "The real cost of physically holding a commodity (warehousing, insurance, refrigeration...) until maturity.",
      },
    },
    {
      term: { fr: "Rendement de convenance", en: "Convenience yield" },
      definition: {
        fr: "L'avantage immatériel de détenir le stock physique tout de suite plutôt qu'un contrat papier — par exemple ne jamais être en rupture pour sa production.",
        en: "The intangible benefit of holding physical stock right now rather than a paper contract — for example never running short for one's production.",
      },
    },
  ],
  intuition: {
    fr: "Pour une action, porter l'actif jusqu'à l'échéance ne coûte que le financement. Pour du pétrole ou du blé, il faut en plus payer pour le stocker — mais en avoir un stock sous la main peut aussi valoir quelque chose de précieux si la matière vient à manquer. Ces deux forces tirent le prix forward dans des sens opposés.",
    en: "For a stock, carrying the asset to maturity only costs financing. For oil or wheat, you also have to pay to store it physically — but having stock on hand right now can also be worth something valuable if the material runs short. These two forces pull the forward price in opposite directions.",
  },
  definition: {
    fr: "Pour une matière première, la formule de non-arbitrage s'étend avec un coût de stockage u (qui augmente le prix forward, comme un coût de financement supplémentaire) et un rendement de convenance y (qui le diminue, comme un revenu implicite) : F0 = S0 × (1 + r + u − y)^T en approximation discrète.",
    en: "For a commodity, the no-arbitrage formula extends with a storage cost u (which raises the forward price, like an extra financing cost) and a convenience yield y (which lowers it, like an implicit income): F0 = S0 × (1 + r + u − y)^T in discrete approximation.",
  },
  utility: {
    fr: "Cette formule explique pourquoi les matières premières se comportent différemment des actifs financiers purs : elle permet d'anticiper la forme de la courbe des prix forward selon le niveau des stocks disponibles.",
    en: "This formula explains why commodities behave differently from pure financial assets: it lets you anticipate the shape of the forward price curve based on available inventory levels.",
  },
  example: {
    fr: "Le blé (S0 = 200 EUR/tonne) coûte cher à stocker (silos, risque de moisissure) : u = 4%. En période d'abondance, le rendement de convenance est faible : y = 1%. Avec r = 3% et T = 1 an : F0 = 200 × (1 + 0,03 + 0,04 − 0,01) = 200 × 1,06 = 212 EUR/tonne.",
    en: "Wheat (S0 = EUR 200/tonne) is expensive to store (silos, mold risk): u = 4%. In a period of abundance, the convenience yield is low: y = 1%. With r = 3% and T = 1 year: F0 = 200 × (1 + 0.03 + 0.04 − 0.01) = 200 × 1.06 = EUR 212/tonne.",
  },
  alternativeExplanation: {
    fr: "Pensez au rendement de convenance comme à une prime d'assurance contre la pénurie : une usine qui a du pétrole brut dans ses cuves ne s'arrête jamais de tourner, même si un embargo coupe les livraisons demain. Cette tranquillité a une valeur, et plus les stocks mondiaux sont bas, plus cette valeur — donc y — augmente, tirant le prix forward vers le bas relativement au spot.",
    en: "Think of the convenience yield as an insurance premium against shortage: a factory with crude oil in its tanks never stops running, even if an embargo cuts off deliveries tomorrow. That peace of mind has value, and the lower global inventories are, the more that value — hence y — rises, pulling the forward price down relative to spot.",
  },
  formula: {
    latex: "F_0 = S_0 \\times (1 + r + u - y)^{T}",
    variables: [
      { symbol: "S_0", description: { fr: "Prix spot de la matière première aujourd'hui", en: "Today's spot price of the commodity" } },
      { symbol: "r", description: { fr: "Taux sans risque annuel", en: "Annual risk-free rate" } },
      { symbol: "u", description: { fr: "Coût de stockage annuel, en proportion du prix spot", en: "Annual storage cost, as a proportion of the spot price" } },
      { symbol: "y", description: { fr: "Rendement de convenance annuel, en proportion du prix spot", en: "Annual convenience yield, as a proportion of the spot price" } },
      { symbol: "T", description: { fr: "Durée jusqu'à l'échéance, en années", en: "Time to maturity, in years" } },
    ],
    assumptions: {
      fr: "Approximation en taux simples additionnés (r + u − y), valable pour de petites valeurs ; u et y sont supposés connus et constants sur la période.",
      en: "Simple-rate approximation with additive terms (r + u − y), valid for small values; u and y are assumed known and constant over the period.",
    },
    units: {
      fr: "r, u, y en proportion annuelle (ex. 3% = 0,03) ; S0 et F0 dans la même unité (devise par tonne, baril...).",
      en: "r, u, y as annual proportions (e.g. 3% = 0.03); S0 and F0 in the same unit (currency per tonne, barrel...).",
    },
    example: {
      fr: "S0 = 200, r = 0,03, u = 0,04, y = 0,01, T = 1 : F0 = 200 × (1 + 0,06) = 212.",
      en: "S0 = 200, r = 0.03, u = 0.04, y = 0.01, T = 1: F0 = 200 × (1 + 0.06) = 212.",
    },
  },
  calculation: {
    fr: "1) Relever S0, r, u et y pour la matière première et l'échéance considérées. 2) Calculer le taux de portage net : r + u − y. 3) Calculer (1 + r + u − y)^T. 4) Multiplier par S0 pour obtenir F0.",
    en: "1) Read off S0, r, u and y for the commodity and maturity in question. 2) Compute the net cost of carry: r + u − y. 3) Compute (1 + r + u − y)^T. 4) Multiply by S0 to get F0.",
  },
  interpretation: {
    fr: "Si u > y (stockage cher, matière abondante), le coût de portage net est positif et F0 > S0. Si y > u (matière rare, tension sur les stocks), le rendement de convenance domine et F0 peut passer sous S0 — une situation que la formule d'un actif financier pur ne peut jamais produire.",
    en: "If u > y (storage expensive, commodity abundant), the net cost of carry is positive and F0 > S0. If y > u (commodity scarce, inventory tight), the convenience yield dominates and F0 can fall below S0 — a situation a pure financial asset's formula can never produce.",
  },
  pitfalls: {
    fr: "Oublier le rendement de convenance et n'appliquer que la formule d'un actif financier (comme M02-2) : cela ne fonctionne que si y = 0, ce qui n'est presque jamais le cas pour une matière première réellement consommée. Autre piège : traiter l'or comme une matière première \"normale\" — il est surtout détenu comme actif d'investissement, avec un rendement de convenance proche de zéro, donc sa formule ressemble à celle d'un actif financier.",
    en: "Forgetting the convenience yield and only applying a pure financial asset's formula (as in M02-2): this only works if y = 0, which is almost never true for a commodity that is actually consumed. Another trap: treating gold as a \"normal\" commodity — it is mostly held as an investment asset, with a convenience yield near zero, so its formula looks like a financial asset's.",
  },
  keyPoints: {
    fr: [
      "F0 = S0 × (1 + r + u − y)^T : le stockage renchérit le forward, le rendement de convenance l'allège.",
      "Le rendement de convenance monte quand les stocks disponibles sont bas (risque de pénurie).",
      "Pour un actif d'investissement pur (or, actions), y ≈ 0 et on retrouve la formule financière standard.",
    ],
    en: [
      "F0 = S0 × (1 + r + u − y)^T: storage raises the forward, convenience yield lowers it.",
      "The convenience yield rises when available inventories are low (shortage risk).",
      "For a pure investment asset (gold, stocks), y ≈ 0 and the standard financial formula is recovered.",
    ],
  },
  advancedDemonstration: {
    fr: "Le rendement de convenance n'est pas directement observable : en pratique, on l'infère en inversant la formule à partir du prix forward coté sur le marché, y = r + u − (F0/S0 − 1)/T. Cette valeur implicite varie dans le temps et sert d'indicateur de tension sur le marché physique : un rendement de convenance qui grimpe brutalement signale souvent des stocks au plus bas et un risque de rupture, information précieuse pour les industriels qui dépendent de cette matière première, indépendamment de toute vue directionnelle sur le prix.",
    en: "The convenience yield is not directly observable: in practice, it is inferred by inverting the formula from the market's quoted forward price, y = r + u − (F0/S0 − 1)/T. This implied value moves over time and serves as an indicator of physical-market tightness: a convenience yield spiking upward often signals inventories at multi-year lows and shortage risk — valuable information for industrial users who depend on that commodity, independent of any directional price view.",
  },
};
