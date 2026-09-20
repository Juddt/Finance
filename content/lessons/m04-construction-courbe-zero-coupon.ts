import type { LessonContent } from "@/lib/lesson-types";

export const m04ConstructionCourbeZeroCoupon: LessonContent = {
  conceptId: "m04-construction-courbe-zero-coupon",
  prerequisiteReminder: {
    text: {
      fr: "Il faut comprendre l'exposition future et la CVA, ainsi que la notion de taux sans risque, spot et forward, présentées dans les notions précédentes.",
      en: "You need to understand future exposure and CVA, as well as the notion of risk-free, spot and forward rates, covered in previous concepts.",
    },
    conceptIds: ["m04-exposition-cva", "m03-taux-sans-risque"],
  },
  glossary: [
    { term: { fr: "Bootstrap", en: "Bootstrapping" }, definition: { fr: "La méthode consistant à déduire successivement les taux zéro-coupon de maturités croissantes à partir des prix d'instruments de marché observés, en utilisant à chaque étape les taux déjà déduits.", en: "The method of successively deriving zero-coupon rates of increasing maturities from observed market instrument prices, using at each step the rates already derived." } },
    { term: { fr: "Taux zéro-coupon", en: "Zero-coupon rate" }, definition: { fr: "Le taux d'actualisation applicable à un flux unique payé à une maturité donnée, sans aucun flux intermédiaire.", en: "The discount rate applicable to a single cash flow paid at a given maturity, with no intermediate flow." } },
  ],
  intuition: {
    fr: "On ne peut observer directement sur le marché qu'un nombre limité de taux zéro-coupon \"purs\" (sans flux intermédiaire), en particulier sur les maturités courtes. Pour les maturités plus longues, le marché ne cote que des instruments à flux multiples (obligations à coupon, swaps) : construire une courbe zéro-coupon complète consiste à \"démêler\" ces instruments composites pour en extraire, étape par étape, les taux purs sous-jacents à chaque maturité.",
    en: "Only a limited number of \"pure\" zero-coupon rates (with no intermediate flow) can be directly observed in the market, especially at short maturities. For longer maturities, the market only quotes multi-flow instruments (coupon bonds, swaps): building a complete zero-coupon curve means \"untangling\" these composite instruments to extract, step by step, the pure underlying rates at each maturity.",
  },
  definition: {
    fr: "Le bootstrap est la méthode standard de construction d'une courbe de taux zéro-coupon : on part des instruments de marché les plus courts (dépôts monétaires), puis on utilise successivement des instruments de maturités croissantes (futures de taux courts, swaps), en déduisant à chaque étape le nouveau taux zéro-coupon à partir des taux déjà obtenus aux maturités antérieures et du prix de marché observé de l'instrument courant — d'où le nom \"bootstrap\", chaque étape s'appuyant sur les résultats de la précédente.",
    en: "Bootstrapping is the standard method for building a zero-coupon rate curve: one starts from the shortest market instruments (money-market deposits), then successively uses instruments of increasing maturity (short-rate futures, swaps), deriving at each step the new zero-coupon rate from the rates already obtained at earlier maturities and the current instrument's observed market price — hence the name \"bootstrapping\", each step relying on the previous step's results.",
  },
  utility: {
    fr: "Une courbe zéro-coupon complète est un outil fondamental de tout desk taux : elle sert à actualiser n'importe quel flux futur, quelle que soit sa maturité, pour pricer des obligations, des swaps, ou tout autre produit dérivé de taux. Sans une courbe correctement construite par bootstrap, il serait impossible d'obtenir des taux d'actualisation cohérents entre eux pour des maturités non directement cotées sur le marché.",
    en: "A complete zero-coupon curve is a fundamental tool for any rates desk: it's used to discount any future flow, whatever its maturity, to price bonds, swaps, or any other rate derivative. Without a curve properly built via bootstrapping, it would be impossible to obtain mutually consistent discount rates for maturities not directly quoted in the market.",
  },
  example: {
    fr: "Le taux zéro-coupon à 1 an est observé directement sur un dépôt monétaire : 3,0%. Pour obtenir le taux zéro-coupon à 2 ans, on utilise un swap de taux à 2 ans coté sur le marché (taux fixe 3,2%) : connaissant déjà le taux zéro-coupon à 1 an, on résout l'équation qui égalise la valeur actualisée des flux du swap à zéro, ce qui permet d'isoler le taux zéro-coupon à 2 ans (par exemple 3,25%) — un calcul impossible à faire directement, puisque le swap à 2 ans comporte deux flux annuels, pas un seul.",
    en: "The 1-year zero-coupon rate is directly observed on a money-market deposit: 3.0%. To get the 2-year zero-coupon rate, a 2-year swap quoted in the market is used (3.2% fixed rate): already knowing the 1-year zero-coupon rate, one solves the equation setting the swap's discounted cash flows to zero, which isolates the 2-year zero-coupon rate (say 3.25%) — a calculation impossible to do directly, since the 2-year swap has two annual flows, not just one.",
  },
  alternativeExplanation: {
    fr: "Imaginez devoir reconstituer le prix unitaire de chaque brique d'un mur, alors que le vendeur ne facture que des \"lots\" de briques empilées (2 briques, puis 3, puis 5...). Connaissant déjà le prix du premier lot (une seule brique), on peut en déduire le prix de la deuxième brique à partir du prix du lot de 2, puis celui de la troisième à partir du lot de 3, et ainsi de suite : chaque étape s'appuie sur les briques déjà \"prix-ées\" à l'étape précédente. C'est exactement la logique du bootstrap appliquée aux taux.",
    en: "Picture having to reconstruct each brick's unit price in a wall, when the seller only invoices \"bundles\" of stacked bricks (2 bricks, then 3, then 5...). Already knowing the first bundle's price (a single brick), one can deduce the second brick's price from the 2-bundle's price, then the third from the 3-bundle, and so on: each step relies on the bricks already \"priced\" at the previous step. This is exactly the bootstrapping logic applied to rates.",
  },
  formula: {
    latex: "\\begin{aligned} 1 &= \\sum_{i=1}^{n-1} c \\times DF_i + (1+c) \\times DF_n \\\\ DF_n &= \\frac{1 - c \\times \\sum_{i=1}^{n-1} DF_i}{1+c} \\end{aligned}",
    variables: [
      { symbol: "c", description: { fr: "Taux fixe (coupon) coté sur le marché pour l'instrument de maturité n", en: "The market-quoted fixed rate (coupon) for the maturity-n instrument" } },
      { symbol: "DF_i", description: { fr: "Facteur d'actualisation à la maturité i, déjà connu des étapes précédentes du bootstrap pour i < n", en: "The discount factor at maturity i, already known from earlier bootstrap steps for i < n" } },
      { symbol: "DF_n", description: { fr: "Facteur d'actualisation à la nouvelle maturité n, inconnue recherchée à cette étape", en: "The discount factor at the new maturity n, the unknown sought at this step" } },
    ],
    assumptions: { fr: "Suppose un instrument au pair (valeur actuelle nette nulle à l'émission) et des paiements annuels simplifiés à but pédagogique ; en pratique les conventions de fréquence de paiement et de base de calcul des jours varient selon l'instrument et doivent être respectées avec précision.", en: "Assumes an at-par instrument (zero net present value at issuance) and simplified annual payments for teaching purposes; in practice, payment frequency conventions and day-count bases vary by instrument and must be precisely respected." },
    units: { fr: "DF_i sans unité (entre 0 et 1) ; le taux zéro-coupon associé s'en déduit ensuite par actualisation composée standard.", en: "DF_i unitless (between 0 and 1); the associated zero-coupon rate is then derived via standard compound discounting." },
    example: { fr: "DF_1 déjà connu=0,970. Swap 2 ans coté c=3,2% → DF_2=(1−0,032×0,970)/1,032≈0,939, d'où un taux zéro-coupon 2 ans≈3,25%.", en: "DF_1 already known=0.970. 2-year swap quoted c=3.2% → DF_2=(1−0.032×0.970)/1.032≈0.939, giving a 2-year zero-coupon rate≈3.25%." },
  },
  calculation: {
    fr: "1) Extraire les taux zéro-coupon des maturités les plus courtes directement depuis les dépôts monétaires cotés (aucun calcul de bootstrap nécessaire, flux unique). 2) Pour chaque maturité suivante, utiliser l'instrument coté correspondant (future ou swap), résoudre l'équation de valeur actuelle nette nulle pour isoler le facteur d'actualisation inconnu, en utilisant les facteurs déjà obtenus aux maturités antérieures. 3) Répéter successivement jusqu'à la maturité maximale souhaitée, puis convertir chaque facteur d'actualisation en taux zéro-coupon.",
    en: "1) Extract the shortest maturities' zero-coupon rates directly from quoted money-market deposits (no bootstrap calculation needed, single flow). 2) For each subsequent maturity, use the corresponding quoted instrument (future or swap), solve the zero net present value equation to isolate the unknown discount factor, using the factors already obtained at earlier maturities. 3) Repeat successively up to the desired maximum maturity, then convert each discount factor into a zero-coupon rate.",
  },
  interpretation: {
    fr: "Une courbe bootstrap bien construite doit être cohérente avec TOUS les prix de marché observés simultanément : si l'on reprice les instruments d'origine (dépôts, futures, swaps) avec la courbe zéro-coupon obtenue, on doit retrouver exactement leurs prix de marché cotés, à l'erreur numérique près. C'est le test de validation standard d'une construction de courbe.",
    en: "A well-built bootstrap curve must be consistent with ALL simultaneously observed market prices: if one reprices the original instruments (deposits, futures, swaps) using the resulting zero-coupon curve, their exact quoted market prices should be recovered, up to numerical error. This is the standard validation test for a curve construction.",
  },
  pitfalls: {
    fr: "Mélanger des instruments de conventions différentes (bases de calcul de jours, fréquences de paiement) sans les harmoniser avant le bootstrap, ce qui produit une courbe incohérente. Autre piège fréquent : croire qu'une seule courbe zéro-coupon suffit pour tout pricer, alors qu'en pratique un cadre multi-courbe (actualisation via une courbe, projection des taux variables via une autre) est devenu la norme post-2008, comme vu dans la notion suivante.",
    en: "Mixing instruments with different conventions (day-count bases, payment frequencies) without harmonizing them before bootstrapping, which produces an inconsistent curve. Another frequent trap: believing a single zero-coupon curve is enough to price everything, when in practice a multi-curve framework (discounting via one curve, projecting floating rates via another) has become the post-2008 standard, as seen in the next concept.",
  },
  keyPoints: {
    fr: [
      "Le bootstrap construit une courbe zéro-coupon complète à partir d'instruments de marché de maturités croissantes, chaque étape s'appuyant sur les précédentes.",
      "Les taux courts s'obtiennent directement (dépôts) ; les taux plus longs nécessitent de résoudre une équation de valeur actuelle nette nulle à chaque étape.",
      "Une courbe correctement construite doit exactement repricer tous les instruments de marché utilisés pour la construire.",
    ],
    en: [
      "Bootstrapping builds a complete zero-coupon curve from market instruments of increasing maturity, each step relying on the previous ones.",
      "Short rates are obtained directly (deposits); longer rates require solving a zero net present value equation at each step.",
      "A correctly built curve must exactly reprice all the market instruments used to construct it.",
    ],
  },
  advancedDemonstration: {
    fr: "En pratique, le choix des instruments utilisés à chaque maturité (dépôts vs futures vs swaps) et les méthodes d'interpolation entre les points cotés sur le marché (linéaire, cubique, log-linéaire sur les facteurs d'actualisation) influencent sensiblement la forme de la courbe obtenue, en particulier sur les maturités intermédiaires non directement cotées — deux desks utilisant des méthodologies de bootstrap légèrement différentes peuvent obtenir des courbes très proches mais jamais rigoureusement identiques, ce qui explique pourquoi la méthodologie de construction de courbe est un sujet de gouvernance et de standardisation important sur un desk taux professionnel.",
    en: "In practice, the choice of instruments used at each maturity (deposits vs futures vs swaps) and the interpolation methods between market-quoted points (linear, cubic, log-linear on discount factors) noticeably influence the resulting curve's shape, especially at intermediate maturities not directly quoted — two desks using slightly different bootstrapping methodologies can obtain very close but never strictly identical curves, which is why curve-building methodology is an important governance and standardization topic on a professional rates desk.",
  },
};
