import type { LessonContent } from "@/lib/lesson-types";

export const m13AllocationAttribution: LessonContent = {
  conceptId: "m13-allocation-attribution",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le CAPM et la notion de bêta, pour comprendre ce qu'un benchmark cherche à capturer.",
      en: "You need to know CAPM and the beta concept, to understand what a benchmark aims to capture.",
    },
    conceptIds: ["m13-capm-sml"],
  },
  glossary: [
    { term: { fr: "Alpha (α)", en: "Alpha (α)" }, definition: { fr: "Le rendement d'un portefeuille non expliqué par son exposition au marché (bêta) : un alpha positif indique une surperformance après ajustement du risque systématique.", en: "A portfolio's return not explained by its market exposure (beta): a positive alpha indicates outperformance after adjusting for systematic risk." } },
    { term: { fr: "Attribution de performance", en: "Performance attribution" }, definition: { fr: "La décomposition de la surperformance ou sous-performance d'un portefeuille par rapport à son benchmark en composantes explicatives (allocation sectorielle, sélection de titres, etc.).", en: "Decomposing a portfolio's outperformance or underperformance versus its benchmark into explanatory components (sector allocation, security selection, etc.)." } },
  ],
  intuition: {
    fr: "Une fois un portefeuille construit et son rendement observé, une question essentielle reste : ce rendement vient-il d'un talent réel de gestion, ou simplement d'avoir pris plus de risque de marché qu'un indice de référence ? La gestion active prétend battre un benchmark par la sélection de titres ou le timing, tandis que la gestion passive se contente de répliquer un indice à moindre coût — l'attribution de performance sépare rigoureusement ces différentes sources de rendement.",
    en: "Once a portfolio is built and its return observed, an essential question remains: does this return come from real management skill, or simply from taking more market risk than a benchmark index? Active management claims to beat a benchmark through security selection or timing, while passive management is content to replicate an index at lower cost — performance attribution rigorously separates these different return sources.",
  },
  definition: {
    fr: "La gestion active cherche à générer un alpha positif (surperformance après ajustement du risque, voir M13-gp-c) par rapport à un benchmark choisi, en échange de frais généralement plus élevés que la gestion passive (qui réplique simplement l'indice). L'attribution de performance décompose l'écart entre le rendement du portefeuille et celui du benchmark en plusieurs composantes : l'effet d'allocation (surpondérer les secteurs qui ont surperformé) et l'effet de sélection (choisir de meilleurs titres au sein de chaque secteur), les deux effets classiques du modèle de Brinson.",
    en: "Active management seeks to generate a positive alpha (risk-adjusted outperformance, see M13-gp-c) relative to a chosen benchmark, in exchange for generally higher fees than passive management (which simply replicates the index). Performance attribution decomposes the gap between the portfolio's return and the benchmark's into several components: the allocation effect (overweighting sectors that outperformed) and the selection effect (picking better securities within each sector), the two classic effects of the Brinson model.",
  },
  utility: {
    fr: "Choisir un benchmark pertinent et décomposer la performance sont essentiels pour évaluer objectivement un gérant : un rendement de 10% peut sembler excellent en absolu, mais décevant si le benchmark approprié a fait 15% sur la même période avec un risque comparable — l'attribution révèle si la performance vient d'un choix d'allocation judicieux, d'une bonne sélection de titres, ou simplement d'une exposition accrue au risque de marché.",
    en: "Choosing a relevant benchmark and decomposing performance are essential to objectively evaluate a manager: a 10% return can seem excellent in absolute terms, but disappointing if the appropriate benchmark returned 15% over the same period with comparable risk — attribution reveals whether performance comes from sound allocation choices, good security selection, or simply increased market risk exposure.",
  },
  example: {
    fr: "Un fonds actions européennes rend 8% sur l'année, contre 6% pour son benchmark (l'indice actions européennes) : la surperformance de 2 points se décompose en +1,2 point d'effet d'allocation (le gérant a surpondéré le secteur technologie, qui a surperformé le marché) et +0,8 point d'effet de sélection (au sein de chaque secteur, le gérant a choisi des titres qui ont fait mieux que la moyenne sectorielle) — une attribution qui révèle précisément d'où vient la valeur ajoutée du gérant.",
    en: "A European equity fund returns 8% for the year, versus 6% for its benchmark (the European equity index): the 2-point outperformance decomposes into +1.2 points of allocation effect (the manager overweighted the technology sector, which outperformed the market) and +0.8 points of selection effect (within each sector, the manager picked securities that beat the sector average) — an attribution precisely revealing where the manager's added value comes from.",
  },
  alternativeExplanation: {
    fr: "Évaluer un gérant sans attribution de performance, c'est comme juger un chef cuisinier uniquement sur le goût final d'un plat, sans savoir s'il a utilisé de meilleurs ingrédients (allocation) ou une meilleure technique de cuisson (sélection) — l'attribution décompose le résultat final pour révéler précisément quelle décision a créé (ou détruit) de la valeur.",
    en: "Evaluating a manager without performance attribution is like judging a chef solely on a dish's final taste, without knowing whether they used better ingredients (allocation) or better cooking technique (selection) — attribution decomposes the final result to precisely reveal which decision created (or destroyed) value.",
  },
  formula: {
    latex: "\\text{Effet d'allocation} = \\sum_i (w_i^p - w_i^b) \\times R_i^b",
    variables: [
      { symbol: "w_i^p, w_i^b", description: { fr: "Poids du secteur i dans le portefeuille (p) et dans le benchmark (b)", en: "Sector i's weight in the portfolio (p) and in the benchmark (b)" } },
      { symbol: "R_i^b", description: { fr: "Rendement du benchmark pour le secteur i", en: "The benchmark's return for sector i" } },
    ],
    assumptions: { fr: "Modèle de Brinson simplifié à deux facteurs (allocation, sélection) ; des versions plus complètes ajoutent un effet d'interaction croisant les deux.", en: "Simplified two-factor Brinson model (allocation, selection); more complete versions add a cross-interaction effect between the two." },
    units: { fr: "Pourcentage de rendement.", en: "Percentage return." },
    example: { fr: "Un secteur surpondéré de +5 points (w_i^p−w_i^b=5%) qui a rendu 12% (R_i^b=12%, au-dessus de la moyenne du benchmark) contribue +0,6 point à l'effet d'allocation.", en: "A sector overweighted by +5 points (w_i^p−w_i^b=5%) that returned 12% (R_i^b=12%, above the benchmark average) contributes +0.6 points to the allocation effect." },
  },
  calculation: {
    fr: "1) Choisir un benchmark pertinent et comparable au mandat du portefeuille (même univers d'investissement, même profil de risque). 2) Décomposer le portefeuille et le benchmark par secteur (ou toute autre dimension pertinente). 3) Calculer l'effet d'allocation (écart de poids sectoriel × rendement du benchmark pour ce secteur) et l'effet de sélection (poids du portefeuille × écart de rendement au sein du secteur). 4) Sommer les deux effets sur tous les secteurs pour retrouver l'écart total de performance.",
    en: "1) Choose a benchmark relevant and comparable to the portfolio's mandate (same investment universe, same risk profile). 2) Break down the portfolio and benchmark by sector (or any other relevant dimension). 3) Compute the allocation effect (sector weight gap × the benchmark's return for that sector) and the selection effect (portfolio weight × return gap within the sector). 4) Sum both effects across all sectors to recover the total performance gap.",
  },
  interpretation: {
    fr: "Un effet d'allocation positif et répété dans le temps suggère un talent de \"market timing\" sectoriel ; un effet de sélection positif et répété suggère un talent de choix de titres individuels — ces deux compétences sont distinctes et un gérant peut exceller dans l'une sans l'autre. Comparer les frais de gestion active à l'alpha réellement généré (net de frais) est essentiel : un alpha brut positif peut devenir négatif net de frais.",
    en: "A positive, repeated allocation effect over time suggests sector \"market timing\" skill; a positive, repeated selection effect suggests individual security-picking skill — these are distinct skills and a manager can excel at one without the other. Comparing active management fees to the alpha actually generated (net of fees) is essential: a positive gross alpha can turn negative net of fees.",
  },
  pitfalls: {
    fr: "Choisir un benchmark non représentatif du mandat réel du portefeuille (par exemple, comparer un fonds small-cap à un indice large-cap), ce qui fausse complètement l'interprétation de la performance relative. Autre piège classique : confondre un alpha positif sur une courte période avec un talent de gestion durable — la significativité statistique d'un alpha nécessite généralement un historique de plusieurs années pour distinguer talent réel et simple chance (voir aussi le data snooping, M12-cross).",
    en: "Choosing a benchmark not representative of the portfolio's real mandate (e.g., comparing a small-cap fund to a large-cap index), which completely distorts relative performance interpretation. Another classic trap: confusing a positive alpha over a short period with durable management skill — an alpha's statistical significance generally requires several years of history to distinguish real skill from mere luck (see also data snooping, M12-cross).",
  },
  keyPoints: {
    fr: [
      "La gestion active vise un alpha positif par rapport à un benchmark, en échange de frais plus élevés que la gestion passive.",
      "L'attribution de Brinson décompose la surperformance en effet d'allocation (choix sectoriels) et effet de sélection (choix de titres).",
      "L'alpha doit toujours être évalué net de frais, et sur un historique suffisamment long pour être statistiquement significatif.",
    ],
    en: [
      "Active management targets a positive alpha versus a benchmark, in exchange for higher fees than passive management.",
      "Brinson attribution decomposes outperformance into allocation effect (sector choices) and selection effect (security choices).",
      "Alpha must always be evaluated net of fees, and over a sufficiently long history to be statistically significant.",
    ],
  },
  advancedDemonstration: {
    fr: "Le modèle de Brinson simple néglige un troisième terme, l'effet d'interaction (w_i^p−w_i^b)×(R_i^p−R_i^b), qui capture la partie de la performance résultant de la combinaison simultanée d'une sur/sous-pondération ET d'une sur/sous-performance au sein du même secteur — un terme souvent petit mais non nul, dont l'omission peut fausser légèrement la décomposition. Sur le plan statistique, distinguer un alpha réellement significatif du simple bruit nécessite un raisonnement similaire au \"skill score\" rencontré en M12-cross : comparer l'alpha observé à sa propre variabilité (erreur de tracking, tracking error) via un ratio d'information, plutôt que juger l'alpha brut isolément.",
    en: "The simple Brinson model omits a third term, the interaction effect (w_i^p−w_i^b)×(R_i^p−R_i^b), capturing the portion of performance resulting from simultaneously combining an over/underweight AND an over/underperformance within the same sector — a term often small but non-zero, whose omission can slightly distort the decomposition. Statistically, distinguishing a genuinely significant alpha from mere noise requires reasoning similar to the \"skill score\" encountered in M12-cross: comparing the observed alpha to its own variability (tracking error) via an information ratio, rather than judging the raw alpha in isolation.",
  },
};
