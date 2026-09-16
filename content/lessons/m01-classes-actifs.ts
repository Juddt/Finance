import type { LessonContent } from "@/lib/lesson-types";

export const m01ClassesActifs: LessonContent = {
  conceptId: "m01-classes-actifs",
  glossary: [
    { term: { fr: "Marché primaire", en: "Primary market" }, definition: { fr: "Le marché où un titre est émis pour la première fois (ex. une entreprise émet de nouvelles actions ou obligations).", en: "The market where a security is issued for the first time (e.g. a company issues new shares or bonds)." } },
    { term: { fr: "Marché secondaire", en: "Secondary market" }, definition: { fr: "Le marché où des titres déjà émis s'échangent entre investisseurs, sans flux vers l'émetteur d'origine.", en: "The market where already-issued securities trade between investors, with no flow to the original issuer." } },
  ],
  intuition: {
    fr: "Les marchés financiers se structurent selon plusieurs axes indépendants : la durée de l'instrument (court terme vs long terme), le fait qu'il s'agisse d'une première émission ou d'un simple échange entre investisseurs, et le lieu où la transaction se déroule (bourse organisée ou accord privé).",
    en: "Financial markets are structured along several independent axes: the instrument's duration (short-term vs long-term), whether it's a first issuance or a simple exchange between investors, and where the transaction happens (an organized exchange or a private agreement).",
  },
  definition: {
    fr: "Le marché monétaire regroupe les instruments de dette à court terme (< 1 an, ex. billets de trésorerie, bons du Trésor courts), tandis que le marché de capitaux regroupe les instruments long terme (actions, obligations). Le marché primaire est celui de l'émission initiale d'un titre ; le marché secondaire celui de sa revente ultérieure. Un marché organisé (bourse) impose des règles standardisées et une chambre de compensation ; un marché de gré à gré (OTC) est négocié bilatéralement, sans standardisation obligatoire.",
    en: "The money market covers short-term debt instruments (< 1 year, e.g. commercial paper, short-term Treasury bills), while the capital market covers long-term instruments (equities, bonds). The primary market is where a security is first issued; the secondary market is where it is later resold. An organized market (an exchange) imposes standardized rules and a clearinghouse; an over-the-counter (OTC) market is negotiated bilaterally, with no mandatory standardization.",
  },
  utility: {
    fr: "Ce découpage permet de situer immédiatement n'importe quel instrument financier (à quelle échéance, à quel stade de sa vie, sur quel type de marché) et d'anticiper ses caractéristiques (liquidité, risque de contrepartie, standardisation).",
    en: "This breakdown immediately places any financial instrument (which maturity, which stage of its life, which market type) and anticipates its characteristics (liquidity, counterparty risk, standardization).",
  },
  example: {
    fr: "Une entreprise émet des obligations à 10 ans pour la première fois (marché primaire, marché de capitaux). Le lendemain, un investisseur les revend à un autre sur le marché obligataire (marché secondaire, toujours marché de capitaux). En parallèle, cette même entreprise émet des billets de trésorerie à 3 mois pour ses besoins de liquidité immédiats (marché monétaire).",
    en: "A company issues 10-year bonds for the first time (primary market, capital market). The next day, an investor resells them to another on the bond market (secondary market, still capital market). Meanwhile, that same company issues 3-month commercial paper for its immediate liquidity needs (money market).",
  },
  alternativeExplanation: {
    fr: "Pensez au marché immobilier : le marché primaire, c'est un promoteur qui vend un appartement neuf pour la première fois ; le marché secondaire, c'est la revente de cet appartement entre particuliers des années plus tard. Le marché monétaire ressemble à une location courte durée, le marché de capitaux à un achat immobilier de long terme.",
    en: "Think of the real estate market: the primary market is a developer selling a new apartment for the first time; the secondary market is that apartment being resold between individuals years later. The money market is like a short-term rental, the capital market like a long-term property purchase.",
  },
  formula: {
    latex: "P = F \\times \\left(1 - r \\times \\frac{d}{360}\\right)",
    variables: [
      { symbol: "F", description: { fr: "Valeur nominale remboursée à l'échéance", en: "Face value repaid at maturity" } },
      { symbol: "r", description: { fr: "Taux d'escompte du marché monétaire", en: "The money market discount rate" } },
      { symbol: "d", description: { fr: "Nombre de jours jusqu'à l'échéance", en: "Number of days to maturity" } },
    ],
    assumptions: { fr: "Convention d'escompte typique du marché monétaire (ex. billets de trésorerie), différente de l'actualisation composée utilisée sur le marché obligataire (M03-2).", en: "A discounting convention typical of the money market (e.g. commercial paper), different from the compound discounting used on the bond market (M03-2)." },
    units: { fr: "P et F dans la même devise ; r en proportion annuelle ; d en jours.", en: "P and F in the same currency; r as an annual proportion; d in days." },
    example: { fr: "F=1 000 000, r=4%, d=90 : P = 1 000 000×(1−0,04×90/360) = 990 000.", en: "F=1,000,000, r=4%, d=90: P = 1,000,000×(1−0.04×90/360) = 990,000." },
  },
  calculation: {
    fr: "1) Identifier la valeur nominale F et l'échéance en jours d. 2) Relever le taux d'escompte r du marché monétaire. 3) Calculer la décote : r × d/360. 4) Multiplier F par (1 − cette décote) pour obtenir le prix P.",
    en: "1) Identify the face value F and the maturity in days d. 2) Read off the money market discount rate r. 3) Compute the discount: r × d/360. 4) Multiply F by (1 − that discount) to get the price P.",
  },
  interpretation: {
    fr: "Cette convention d'escompte simple diffère de l'actualisation composée des obligations (M03-2) précisément parce que le marché monétaire traite des échéances courtes, où la différence entre les deux conventions reste faible — mais elle deviendrait trompeuse si appliquée telle quelle à un instrument de long terme.",
    en: "This simple discounting convention differs from bonds' compound discounting (M03-2) precisely because the money market deals in short maturities, where the gap between the two conventions stays small — but it would become misleading if applied as-is to a long-term instrument.",
  },
  pitfalls: {
    fr: "Appliquer la convention d'escompte du marché monétaire à un instrument de long terme (ou l'inverse) : chaque marché a ses propres conventions, non interchangeables. Autre piège : confondre marché primaire/secondaire avec marché organisé/OTC — ce sont deux axes de classification indépendants (une émission primaire peut se faire de gré à gré, une transaction secondaire peut se faire en bourse).",
    en: "Applying the money market's discounting convention to a long-term instrument (or the reverse): each market has its own conventions, not interchangeable. Another trap: confusing primary/secondary market with organized/OTC market — these are two independent classification axes (a primary issuance can happen OTC, a secondary trade can happen on an exchange).",
  },
  keyPoints: {
    fr: [
      "Marché monétaire (court terme, < 1 an) vs marché de capitaux (long terme : actions, obligations).",
      "Marché primaire (émission initiale) vs marché secondaire (échange entre investisseurs).",
      "Marché organisé (standardisé, chambre de compensation) vs marché de gré à gré (OTC, bilatéral).",
    ],
    en: [
      "Money market (short-term, < 1 year) vs capital market (long-term: equities, bonds).",
      "Primary market (initial issuance) vs secondary market (exchange between investors).",
      "Organized market (standardized, clearinghouse) vs over-the-counter market (OTC, bilateral).",
    ],
  },
  advancedDemonstration: {
    fr: "Ces trois axes de classification (durée, stade de vie, lieu de négociation) se combinent librement : un forward de change (M02) est un instrument dérivé, de gré à gré, dont la \"durée\" dépend de l'échéance choisie ; un future sur indice actions est un dérivé standardisé sur marché organisé. Cette grille de lecture à trois axes, plutôt qu'une simple liste de produits, est ce qui permet de classer n'importe quel nouvel instrument financier rencontré, même inédit, en le positionnant sur chacun des trois axes plutôt qu'en cherchant une catégorie toute faite.",
    en: "These three classification axes (duration, life stage, trading venue) combine freely: an FX forward (M02) is a derivative instrument, traded OTC, whose \"duration\" depends on the chosen maturity; an equity index future is a standardized derivative on an organized market. This three-axis reading grid, rather than a simple product list, is what lets you classify any new financial instrument you encounter, even an unfamiliar one, by positioning it on each of the three axes rather than searching for a ready-made category.",
  },
};
