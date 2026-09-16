import type { LessonContent } from "@/lib/lesson-types";

export const m11ProduitStructure: LessonContent = {
  conceptId: "m11-produit-structure",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les notions de risque de crédit et d'obligation zéro-coupon.",
      en: "You need to know credit risk and zero-coupon bond concepts.",
    },
    conceptIds: ["m03-risque-credit", "m03-definition-obligations"],
  },
  glossary: [
    { term: { fr: "Risque émetteur", en: "Issuer risk" }, definition: { fr: "Le risque que l'émetteur du produit structuré fasse défaut, auquel cas l'investisseur peut perdre tout ou partie de son capital, indépendamment de la performance du sous-jacent.", en: "The risk that the structured product's issuer defaults, in which case the investor may lose all or part of their capital, regardless of the underlying's performance." } },
    { term: { fr: "Note structurée", en: "Structured note" }, definition: { fr: "Un titre de dette émis par une banque, dont le remboursement dépend de la performance d'un sous-jacent selon une formule contractuelle.", en: "A debt security issued by a bank, whose repayment depends on an underlying's performance according to a contractual formula." } },
  ],
  intuition: {
    fr: "Un produit structuré est un emballage juridique unique qui combine en réalité plusieurs briques simples (une obligation, une ou plusieurs options) pour offrir un profil de gain sur mesure — mais cet emballage ajoute deux ingrédients qui n'existent pas dans les briques séparées : le risque de crédit de l'émetteur et des frais de structuration souvent peu visibles.",
    en: "A structured product is a single legal wrapper that actually combines several simple building blocks (a bond, one or more options) to offer a tailored payoff profile — but this wrapper adds two ingredients absent from the separate building blocks: the issuer's credit risk and often poorly visible structuring fees.",
  },
  definition: {
    fr: "Un produit structuré est un titre émis par une banque qui promet, à une ou plusieurs dates, un remboursement dépendant d'une formule contractuelle liée à un sous-jacent (action, indice, panier). Les grandes catégories incluent les produits à capital garanti (protection totale, potentiel de hausse limité), à capital conditionnellement protégé (protection sous conditions, ex. barrière), et à capital non protégé (type reverse convertible, risque de perte en capital dès le premier euro sous barrière). L'investisseur est exposé (1) au risque de marché du sous-jacent selon la formule, (2) au risque de crédit de l'émetteur, et (3) à un risque de liquidité si le produit doit être revendu avant échéance.",
    en: "A structured product is a security issued by a bank that promises, on one or more dates, a repayment depending on a contractual formula tied to an underlying (stock, index, basket). Broad categories include capital-guaranteed products (full protection, limited upside), conditionally capital-protected products (protection under conditions, e.g. a barrier), and non-capital-protected products (reverse-convertible type, capital loss risk from the first euro below the barrier). The investor is exposed to (1) the underlying's market risk per the formula, (2) the issuer's credit risk, and (3) liquidity risk if the product must be resold before maturity.",
  },
  utility: {
    fr: "Comprendre la mécanique générale des produits structurés est indispensable avant d'étudier un cas particulier comme l'autocall (M11-2) : la plupart des complexités et des pièges spécifiques (coupon élevé finançant un risque caché, illiquidité, risque de crédit sous-estimé) s'appliquent à toute la catégorie, pas seulement à un produit donné.",
    en: "Understanding structured products' general mechanics is essential before studying a specific case like the autocall (M11-2): most of the category's specific complexities and traps (a high coupon funding a hidden risk, illiquidity, underestimated credit risk) apply to the whole category, not just to one product.",
  },
  example: {
    fr: "Un produit à capital garanti à 5 ans sur un indice actions : l'émetteur place environ 86% du capital collecté dans une obligation zéro-coupon qui, actualisée à 5 ans au taux sans risque, reconstitue 100% du nominal à l'échéance, et utilise les 14% restants pour acheter des calls sur l'indice, offrant une participation à la hausse. Si l'indice baisse, l'investisseur récupère 100% (le zéro-coupon suffit), mais perd les 14% investis en options — un coût d'opportunité implicite, pas une perte affichée.",
    en: "A 5-year capital-guaranteed product on an equity index: the issuer places about 86% of the collected capital in a zero-coupon bond that, discounted over 5 years at the risk-free rate, reconstitutes 100% of the face value at maturity, and uses the remaining 14% to buy calls on the index, offering upside participation. If the index falls, the investor recovers 100% (the zero-coupon suffices), but loses the 14% invested in options — an implicit opportunity cost, not a displayed loss.",
  },
  alternativeExplanation: {
    fr: "Pensez à un produit structuré comme à un plat cuisiné vendu déjà assemblé au restaurant : les ingrédients de base (farine, œufs, légumes — ici une obligation et des options) sont souvent bon marché séparément, mais le plat fini coûte plus cher à cause du travail d'assemblage (la structuration) et du risque que le cuisinier (l'émetteur) ne livre pas ce qu'il a promis.",
    en: "Think of a structured product like a pre-assembled dish sold at a restaurant: the base ingredients (flour, eggs, vegetables — here a bond and options) are often cheap separately, but the finished dish costs more because of the assembly work (structuring) and the risk that the cook (the issuer) doesn't deliver what was promised.",
  },
  formula: {
    latex: "\\text{Valeur}_{\\text{produit}} = \\text{Obligation}_{\\text{zéro-coupon}} + \\text{Composante}_{\\text{optionnelle}} - \\text{Frais}",
    variables: [
      { symbol: "\\text{Obligation}_{\\text{zéro-coupon}}", description: { fr: "Valeur actualisée du remboursement garanti à l'échéance", en: "Present value of the guaranteed repayment at maturity" } },
      { symbol: "\\text{Composante}_{\\text{optionnelle}}", description: { fr: "Valeur des options (achetées ou vendues) déterminant le profil de gain conditionnel", en: "Value of the options (bought or sold) driving the conditional payoff profile" } },
    ],
    assumptions: { fr: "Décomposition statique simplifiée ; la vraie structure peut inclure plusieurs options et des composantes plus complexes (barrières, mémoire).", en: "Simplified static decomposition; the real structure may include several options and more complex components (barriers, memory)." },
    units: { fr: "Valeur en pourcentage ou en unité du nominal.", en: "Value as a percentage or unit of face value." },
    example: { fr: "Obligation zéro-coupon à 86%, composante optionnelle achetée à 14%, frais 1% : Valeur_produit ≈ 86%+14%−1% = 99% du nominal collecté à l'émission.", en: "Zero-coupon bond at 86%, purchased optional component at 14%, fees 1%: Product value ≈ 86%+14%−1% = 99% of the nominal collected at issuance." },
  },
  calculation: {
    fr: "1) Identifier le type de protection du capital (garantie totale, conditionnelle, ou nulle). 2) Décomposer le produit en sa brique obligataire (zéro-coupon) et sa/ses brique(s) optionnelle(s). 3) Évaluer chaque brique séparément à l'aide des outils déjà vus (M03 pour l'obligataire, M05/M06/M10 pour les options). 4) Ajouter les frais de structuration, souvent non affichés explicitement mais intégrés dans l'écart entre le prix théorique des briques et le prix de vente au client.",
    en: "1) Identify the type of capital protection (full guarantee, conditional, or none). 2) Decompose the product into its bond building block (zero-coupon) and its optional building block(s). 3) Value each building block separately using tools already seen (M03 for the bond, M05/M06/M10 for the options). 4) Add structuring fees, often not explicitly displayed but embedded in the gap between the building blocks' theoretical price and the price sold to the client.",
  },
  interpretation: {
    fr: "Un produit structuré n'est jamais un « gain gratuit » : chaque caractéristique attractive (protection, coupon, participation) a un coût, financé soit par une réduction du potentiel de hausse, soit par la vente implicite d'un risque (souvent de baisse) par l'investisseur. Décomposer systématiquement le produit en briques simples révèle où ce coût se cache.",
    en: "A structured product is never a \"free gain\": every attractive feature (protection, coupon, participation) has a cost, funded either by reduced upside potential or by the investor implicitly selling a risk (often downside). Systematically decomposing the product into simple building blocks reveals where this cost hides.",
  },
  pitfalls: {
    fr: "Négliger le risque de crédit de l'émetteur en se concentrant uniquement sur le risque de marché du sous-jacent : un produit à \"capital garanti\" ne l'est que si l'émetteur ne fait pas défaut. Autre piège : sous-estimer le risque de liquidité — revendre un produit structuré avant échéance se fait souvent à un prix nettement inférieur à sa valeur théorique, faute de marché secondaire liquide.",
    en: "Neglecting the issuer's credit risk by focusing solely on the underlying's market risk: a \"capital-guaranteed\" product is only guaranteed if the issuer doesn't default. Another trap: underestimating liquidity risk — reselling a structured product before maturity often happens at a price noticeably below its theoretical value, for lack of a liquid secondary market.",
  },
  keyPoints: {
    fr: [
      "Un produit structuré se décompose en une brique obligataire (zéro-coupon) et une ou plusieurs briques optionnelles.",
      "Trois risques distincts : marché (sous-jacent), crédit (émetteur), liquidité (revente anticipée).",
      "Aucune caractéristique attractive n'est gratuite : elle est toujours financée par une réduction de potentiel ou une vente implicite de risque.",
    ],
    en: [
      "A structured product decomposes into a bond building block (zero-coupon) and one or more optional building blocks.",
      "Three distinct risks: market (underlying), credit (issuer), liquidity (early resale).",
      "No attractive feature is free: it is always funded by reduced potential or an implicit risk sale.",
    ],
  },
  advancedDemonstration: {
    fr: "La décomposition statique en obligation + option(s) est une simplification pédagogique utile, mais les structures réelles (autocalls, M11-2) sont souvent path-dependent — leur valeur dépend de la trajectoire complète du sous-jacent, pas seulement de son niveau final — ce qui empêche une décomposition aussi propre en briques indépendantes et nécessite des méthodes de pricing dédiées (Monte-Carlo, M11-5) capturant les interactions entre les différentes dates d'observation.",
    en: "The static decomposition into bond + option(s) is a useful teaching simplification, but real structures (autocalls, M11-2) are often path-dependent — their value depends on the underlying's entire path, not just its final level — which prevents such a clean decomposition into independent building blocks and requires dedicated pricing methods (Monte Carlo, M11-5) capturing the interactions between the different observation dates.",
  },
};
