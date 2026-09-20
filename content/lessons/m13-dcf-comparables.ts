import type { LessonContent } from "@/lib/lesson-types";

export const m13DcfComparables: LessonContent = {
  conceptId: "m13-dcf-comparables",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir actualiser un flux futur et calculer la valeur d'une annuité, présentés dans la notion précédente.",
      en: "You need to know how to discount a future cash flow and value an annuity, covered in the previous concept.",
    },
    conceptIds: ["m13-actualisation-annuites"],
  },
  glossary: [
    { term: { fr: "WACC (coût moyen pondéré du capital)", en: "WACC (Weighted Average Cost of Capital)" }, definition: { fr: "Le taux de rendement moyen exigé par l'ensemble des apporteurs de capitaux (actionnaires et créanciers) d'une entreprise, pondéré par leur part respective dans le financement.", en: "The average return rate required by all of a company's capital providers (shareholders and creditors), weighted by their respective share of funding." } },
    { term: { fr: "Valeur terminale", en: "Terminal value" }, definition: { fr: "La valeur, à la fin de la période de projection explicite d'un DCF, de tous les flux de trésorerie encore à venir au-delà de cet horizon, généralement estimée par une formule de croissance perpétuelle.", en: "The value, at the end of a DCF's explicit projection period, of all cash flows still to come beyond that horizon, usually estimated via a perpetual growth formula." } },
  ],
  intuition: {
    fr: "Il existe deux grandes façons de répondre à la question \"combien vaut cette action ?\". La première (DCF) consiste à estimer directement tout le cash que l'entreprise va générer dans le futur, et à ramener cette somme à sa valeur d'aujourd'hui. La seconde (comparables) consiste à regarder à quel prix se négocient des entreprises similaires, et à appliquer ce même ratio à l'entreprise étudiée — exactement comme on évaluerait un bien immobilier soit en estimant ses loyers futurs actualisés, soit en le comparant aux prix récents de biens similaires dans le même quartier.",
    en: "There are two main ways to answer \"what is this share worth?\". The first (DCF) directly estimates all the cash the company will generate in the future, and discounts that sum to today's value. The second (comparables) looks at what similar companies trade for, and applies that same ratio to the company being studied — exactly like valuing a property either by estimating its discounted future rents, or by comparing it to recent prices of similar properties in the same neighborhood.",
  },
  definition: {
    fr: "La méthode DCF (Discounted Cash Flow) actualise les flux de trésorerie disponibles futurs de l'entreprise (FCF) au coût moyen pondéré du capital (WACC), et ajoute une valeur terminale représentant tous les flux au-delà de l'horizon de projection explicite, généralement estimée par une formule de croissance perpétuelle (modèle de Gordon). La somme donne la valeur d'entreprise (VE) ; en soustrayant la dette nette, on obtient la valeur des capitaux propres. La méthode des comparables applique directement un multiple de valorisation observé sur un groupe d'entreprises jugées comparables (ex. EV/EBITDA, price-to-earnings) à l'indicateur correspondant de l'entreprise étudiée, sans construire de projection de flux détaillée.",
    en: "The DCF (Discounted Cash Flow) method discounts the company's future free cash flows (FCF) at the weighted average cost of capital (WACC), and adds a terminal value representing all cash flows beyond the explicit projection horizon, usually estimated via a perpetual growth formula (Gordon growth model). The sum gives enterprise value (EV); subtracting net debt gives equity value. The comparables method directly applies a valuation multiple observed across a group of companies deemed comparable (e.g. EV/EBITDA, price-to-earnings) to the corresponding metric of the company being studied, with no need to build a detailed cash-flow projection.",
  },
  utility: {
    fr: "Ces deux méthodes sont utilisées en recherche actions, en fusions-acquisitions et lors des introductions en bourse, souvent en parallèle pour se recouper mutuellement : le DCF donne une valeur \"intrinsèque\", fondée sur les fondamentaux propres de l'entreprise, tandis que les comparables donnent une valeur \"relative\", ancrée sur ce que le marché paie actuellement pour un profil similaire. Un écart important entre les deux méthodes est un signal à investiguer, pas à ignorer.",
    en: "Both methods are used in equity research, mergers and acquisitions, and IPOs, often in parallel to cross-check each other: DCF gives an \"intrinsic\" value, grounded in the company's own fundamentals, while comparables give a \"relative\" value, anchored to what the market currently pays for a similar profile. A large gap between the two methods is a signal to investigate, not ignore.",
  },
  example: {
    fr: "Une entreprise génère un FCF de 100 EUR ce qui, avec un WACC de 8% et une croissance perpétuelle de 3%, donne une valeur terminale de 100 × 1,03 / (8% − 3%) = 2 060 EUR. En parallèle, ses pairs cotés se négocient en moyenne à 12x l'EBITDA ; avec un EBITDA de 150 EUR, la méthode des comparables donne une valeur d'entreprise de 12 × 150 = 1 800 EUR — un écart de 15% avec le DCF à examiner (hypothèses de croissance trop optimistes ? pairs mal choisis ?).",
    en: "A company generates a FCF of EUR 100, which, with an 8% WACC and 3% perpetual growth, gives a terminal value of 100 × 1.03 / (8% − 3%) = EUR 2,060. Meanwhile, its listed peers trade on average at 12x EBITDA; with an EBITDA of EUR 150, the comparables method gives an enterprise value of 12 × 150 = EUR 1,800 — a 15% gap versus the DCF to investigate (overly optimistic growth assumptions? poorly chosen peers?).",
  },
  alternativeExplanation: {
    fr: "Pensez à l'achat d'un appartement locatif. Le DCF, c'est calculer combien vaut aujourd'hui la somme de tous les loyers futurs que vous encaisserez, actualisés. Les comparables, c'est regarder à quel prix se sont vendus récemment des appartements similaires dans le même immeuble ou le même quartier. Les deux méthodes devraient converger vers un prix voisin — si elles divergent fortement, il faut se demander laquelle des deux hypothèses (vos projections de loyers, ou la comparabilité des biens vendus) est la plus fragile.",
    en: "Think of buying a rental apartment. DCF is calculating what the sum of all your future discounted rents is worth today. Comparables is looking at what similar apartments in the same building or neighborhood recently sold for. Both methods should converge to a similar price — if they diverge sharply, you should ask which of the two assumptions (your rent projections, or the comparability of the sold properties) is the weaker one.",
  },
  formula: {
    latex: "\\begin{aligned} VE &= \\sum_{t=1}^{n} \\frac{FCF_t}{(1+WACC)^t} + \\frac{FCF_n(1+g)}{(WACC-g)(1+WACC)^n} \\\\ P &= \\text{Multiple}_{pairs} \\times \\text{Indicateur}_{entreprise} \\end{aligned}",
    variables: [
      { symbol: "VE", description: { fr: "Valeur d'entreprise obtenue par DCF", en: "Enterprise value obtained via DCF" } },
      { symbol: "FCF_t", description: { fr: "Flux de trésorerie disponible projeté à la période t", en: "Projected free cash flow at period t" } },
      { symbol: "WACC", description: { fr: "Coût moyen pondéré du capital, taux d'actualisation", en: "Weighted average cost of capital, the discount rate" } },
      { symbol: "g", description: { fr: "Taux de croissance perpétuelle supposé au-delà de l'horizon n", en: "Assumed perpetual growth rate beyond horizon n" } },
      { symbol: "\\text{Multiple}_{pairs}", description: { fr: "Multiple de valorisation moyen observé sur le groupe de pairs comparables", en: "Average valuation multiple observed across the comparable peer group" } },
    ],
    assumptions: { fr: "Le modèle de croissance perpétuelle exige g < WACC (sinon la valeur terminale diverge). La méthode des comparables suppose que le groupe de pairs est correctement valorisé par le marché et réellement comparable en risque et en croissance.", en: "The perpetual growth model requires g < WACC (otherwise the terminal value diverges). The comparables method assumes the peer group is correctly priced by the market and genuinely comparable in risk and growth." },
    units: { fr: "Valeurs en devise ; WACC et g en proportion annuelle ; multiples sans unité.", en: "Values in currency; WACC and g as annual proportions; multiples are unitless." },
    example: { fr: "FCF=100, WACC=8%, g=3% → Valeur terminale ≈ 2060. Multiple pairs=12x, EBITDA=150 → VE comparables=1800.", en: "FCF=100, WACC=8%, g=3% → Terminal value ≈ 2060. Peer multiple=12x, EBITDA=150 → Comparables EV=1800." },
  },
  calculation: {
    fr: "1) Pour un DCF : projeter les FCF sur l'horizon explicite, les actualiser au WACC, calculer la valeur terminale et l'actualiser également, puis sommer le tout. 2) Pour les comparables : identifier un groupe de pairs réellement comparables, calculer leur multiple moyen (ex. VE/EBITDA), puis l'appliquer à l'indicateur correspondant de l'entreprise étudiée.",
    en: "1) For a DCF: project FCF over the explicit horizon, discount them at the WACC, compute the terminal value and discount it too, then sum everything. 2) For comparables: identify a group of genuinely comparable peers, compute their average multiple (e.g. EV/EBITDA), then apply it to the studied company's corresponding metric.",
  },
  interpretation: {
    fr: "Le DCF est extrêmement sensible à ses hypothèses de long terme : une petite variation du WACC ou du taux de croissance perpétuelle g peut faire varier la valeur terminale (souvent 60 à 80% de la valeur d'entreprise totale) de façon très importante. Les comparables sont ancrés sur le marché actuel, ce qui les rend plus \"objectifs\" à court terme, mais aussi vulnérables si l'ensemble du secteur de référence est lui-même mal valorisé (ex. bulle sectorielle).",
    en: "DCF is extremely sensitive to its long-term assumptions: a small change in the WACC or the perpetual growth rate g can swing the terminal value (often 60 to 80% of total enterprise value) very significantly. Comparables are anchored to the current market, making them more \"objective\" in the short term, but also vulnerable if the entire reference sector is itself mispriced (e.g. a sector bubble).",
  },
  pitfalls: {
    fr: "Confondre valeur d'entreprise (VE, avant dette) et valeur des capitaux propres (après avoir soustrait la dette nette) : un multiple VE/EBITDA et un multiple de résultat net (P/E) ne se comparent pas sur la même base. Autre piège : choisir un taux de croissance perpétuelle g proche voire supérieur au WACC, ce qui fait diverger ou devenir absurde la formule de valeur terminale. Enfin, comparer des entreprises aux structures de capital, marges ou profils de croissance trop différents, en oubliant que la comparabilité est la condition de validité de toute la méthode.",
    en: "Confusing enterprise value (EV, before debt) and equity value (after subtracting net debt): an EV/EBITDA multiple and a net-income multiple (P/E) are not comparable on the same basis. Another trap: choosing a perpetual growth rate g close to or above the WACC, which makes the terminal value formula diverge or become nonsensical. Finally, comparing companies with too-different capital structures, margins or growth profiles, forgetting comparability is the very condition for the method's validity.",
  },
  keyPoints: {
    fr: [
      "DCF = valeur intrinsèque, fondée sur les flux futurs propres de l'entreprise, actualisés au WACC.",
      "Comparables = valeur relative, ancrée sur les multiples de marché d'un groupe de pairs comparables.",
      "La valeur terminale représente souvent la majorité de la valeur d'un DCF : elle exige g strictement inférieur au WACC.",
    ],
    en: [
      "DCF = intrinsic value, based on the company's own future cash flows, discounted at the WACC.",
      "Comparables = relative value, anchored to a comparable peer group's market multiples.",
      "The terminal value often represents the majority of a DCF's value: it requires g strictly below the WACC.",
    ],
  },
  advancedDemonstration: {
    fr: "En pratique, les analystes ne s'appuient jamais sur une seule méthode : ils construisent un \"football field\" (graphique en bandes horizontales) combinant plusieurs approches — DCF avec plusieurs jeux d'hypothèses (WACC et g optimistes/pessimistes), comparables boursiers (multiples d'entreprises cotées), et transactions précédentes comparables (multiples payés lors de fusions-acquisitions récentes sur des cibles similaires, qui incluent typiquement une prime de contrôle) — pour faire ressortir une fourchette de valorisation plutôt qu'un chiffre unique trompeur de précision. Le choix entre multiple VE/EBITDA (neutre vis-à-vis de la structure de capital, utile pour comparer des entreprises diversement endettées) et multiple P/E (sur les capitaux propres uniquement, sensible à la structure de capital et à la fiscalité) dépend précisément de l'objectif de la comparaison. Pour une entreprise en forte croissance sans historique de flux de trésorerie positifs (typique d'une IPO technologique), la méthode des comparables — voire des multiples sur des indicateurs non financiers comme le nombre d'utilisateurs — prend souvent le pas sur le DCF, dont les hypothèses de long terme seraient trop spéculatives.",
    en: "In practice, analysts never rely on a single method: they build a \"football field\" (a chart of horizontal bars) combining several approaches — DCF under multiple assumption sets (optimistic/pessimistic WACC and g), trading comparables (listed companies' multiples), and precedent transaction comparables (multiples paid in recent M&A deals on similar targets, which typically include a control premium) — to produce a valuation range rather than a single, misleadingly precise number. The choice between an EV/EBITDA multiple (capital-structure-neutral, useful for comparing differently leveraged companies) and a P/E multiple (on equity only, sensitive to capital structure and taxation) depends precisely on the comparison's objective. For a fast-growing company with no history of positive cash flows (typical of a tech IPO), the comparables method — sometimes even multiples on non-financial metrics like user count — often takes precedence over DCF, whose long-term assumptions would be too speculative.",
  },
};
