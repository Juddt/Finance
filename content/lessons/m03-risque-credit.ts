import type { LessonContent } from "@/lib/lesson-types";

export const m03RisqueCredit: LessonContent = {
  conceptId: "m03-risque-credit",
  glossary: [
    {
      term: { fr: "Défaut", en: "Default" },
      definition: {
        fr: "Le fait, pour un emprunteur, de ne pas payer (totalement ou partiellement, à temps) ce qu'il doit.",
        en: "A borrower failing to pay (fully or partially, on time) what it owes.",
      },
    },
    {
      term: { fr: "Agence de notation", en: "Rating agency" },
      definition: {
        fr: "Une société spécialisée (S&P, Moody's, Fitch...) qui évalue la capacité d'un emprunteur à rembourser sa dette et publie cette évaluation sous forme de note.",
        en: "A specialized firm (S&P, Moody's, Fitch...) that assesses a borrower's ability to repay its debt and publishes that assessment as a rating.",
      },
    },
  ],
  intuition: {
    fr: "Le risque de crédit, c'est simplement le risque qu'un emprunteur ne rembourse pas ce qu'il doit. Pour ne pas avoir à analyser chaque emprunteur soi-même, le marché s'appuie sur des notations qui résument ce risque en une lettre.",
    en: "Credit risk is simply the risk that a borrower doesn't repay what it owes. So as not to have to analyze every borrower yourself, the market relies on ratings that summarize this risk as a letter grade.",
  },
  definition: {
    fr: "Le risque de crédit est le risque de perte subie si une contrepartie fait défaut. Une notation de crédit (rating) est l'évaluation, par une agence spécialisée, de la capacité d'un emprunteur à honorer sa dette, résumée par une lettre (de AAA, le plus sûr, à D, en défaut).",
    en: "Credit risk is the risk of loss incurred if a counterparty defaults. A credit rating is a specialized agency's assessment of a borrower's ability to honor its debt, summarized as a letter (from AAA, the safest, to D, in default).",
  },
  utility: {
    fr: "La notation sert de raccourci pour comparer rapidement le risque de nombreux émetteurs sans analyser chacun en détail, et sert souvent de référence contractuelle ou réglementaire (covenants, exigences de fonds propres bancaires).",
    en: "The rating serves as a shortcut to quickly compare the risk of many issuers without analyzing each in detail, and is often used as a contractual or regulatory reference (covenants, bank capital requirements).",
  },
  example: {
    fr: "Une entreprise notée BBB a historiquement un taux de défaut à 5 ans de quelques %, contre un taux quasi nul pour une entreprise notée AAA. Face à deux obligations de rendement proche, un investisseur utilisera d'abord la notation comme filtre de risque.",
    en: "A BBB-rated company has historically had a 5-year default rate of a few percent, versus a near-zero rate for an AAA-rated company. Facing two bonds with similar yields, an investor will first use the rating as a risk filter.",
  },
  alternativeExplanation: {
    fr: "Voyez la notation comme un carnet de bulletins scolaires mis à jour une ou deux fois par an : utile pour se faire une idée générale et stable, mais qui ne dira jamais qu'un élève a eu une très mauvaise semaine juste avant l'examen. Pour une info plus fraîche, il faut d'autres sources (marché, données financières récentes).",
    en: "Think of the rating like a report card updated once or twice a year: useful for a general, stable picture, but it will never tell you a student had a very bad week right before the exam. For fresher information, you need other sources (market data, recent financials).",
  },
  formula: {
    latex: "\\widehat{PD} = \\dfrac{\\text{Nombre de défauts observés}}{\\text{Nombre d'émetteurs dans la catégorie}}",
    variables: [
      { symbol: "\\widehat{PD}", description: { fr: "Probabilité de défaut estimée sur l'horizon considéré", en: "Estimated default probability over the considered horizon" } },
      { symbol: "\\text{Défauts observés}", description: { fr: "Nombre d'émetteurs de cette catégorie ayant fait défaut sur l'historique", en: "Number of issuers in that category that defaulted historically" } },
      { symbol: "\\text{Émetteurs}", description: { fr: "Nombre total d'émetteurs ayant appartenu à cette catégorie sur la période", en: "Total number of issuers that belonged to that category over the period" } },
    ],
    assumptions: {
      fr: "Le taux de défaut passé d'une catégorie de notation est supposé représentatif du futur (approche « through-the-cycle ») ; échantillon assez grand pour être statistiquement significatif ; ne capture pas les conditions macroéconomiques actuelles.",
      en: "A rating category's past default rate is assumed representative of the future (\"through-the-cycle\" approach); sample large enough to be statistically meaningful; does not capture current macroeconomic conditions.",
    },
    units: {
      fr: "PD exprimée en % sur un horizon donné (ex. 5 ans) — toujours préciser l'horizon.",
      en: "PD expressed in % over a given horizon (e.g. 5 years) — always specify the horizon.",
    },
    example: {
      fr: "Catégorie BBB : 40 défauts observés sur 2 000 émetteurs sur 5 ans → PD ≈ 40/2000 = 2% à 5 ans.",
      en: "BBB category: 40 observed defaults out of 2,000 issuers over 5 years → PD ≈ 40/2000 = 2% over 5 years.",
    },
  },
  calculation: {
    fr: "1) Identifier la catégorie de notation de l'émetteur. 2) Consulter le taux de défaut historique publié par l'agence pour cette catégorie et cet horizon. 3) Ajuster éventuellement selon le secteur ou le cycle économique actuel. 4) Si une estimation plus fine ou plus réactive est nécessaire, compléter par un modèle structurel (Merton, si l'entreprise est cotée) ou un modèle statistique (scoring sur ratios financiers, si un historique de défauts propre est disponible).",
    en: "1) Identify the issuer's rating category. 2) Look up the historical default rate published by the agency for that category and horizon. 3) Optionally adjust for sector or the current economic cycle. 4) If a finer or more reactive estimate is needed, complement it with a structural model (Merton, if the company is listed) or a statistical model (scoring on financial ratios, if a proprietary default history is available).",
  },
  interpretation: {
    fr: "Une notation est une opinion mise à jour lentement (« through-the-cycle »), pas une mesure de marché en temps réel : elle peut réagir avec retard à une vraie dégradation du crédit d'un émetteur.",
    en: "A rating is a slowly-updated opinion (\"through-the-cycle\"), not a real-time market measure: it can lag behind a real deterioration in an issuer's credit.",
  },
  pitfalls: {
    fr: "Traiter une notation comme une probabilité de défaut exacte et figée. Oublier ses limites connues : mise à jour lente, hétérogénéité entre agences, et historiquement, un conflit d'intérêts (l'émetteur paie l'agence qui le note). Confondre la stabilité voulue d'une notation « through-the-cycle » avec la probabilité de défaut réelle, qui varie elle avec le cycle économique.",
    en: "Treating a rating as an exact, fixed default probability. Forgetting its known limits: slow updates, inconsistency across agencies, and historically, a conflict of interest (the issuer pays the agency that rates it). Confusing a rating's intended \"through-the-cycle\" stability with the actual default probability, which does vary with the economic cycle.",
  },
  keyPoints: {
    fr: [
      "Le risque de crédit est le risque de perte si une contrepartie fait défaut.",
      "Une notation résume ce risque en une lettre, mais reste une opinion mise à jour lentement, pas une mesure de marché en temps réel.",
      "Pour une PD plus précise ou plus réactive, on complète la notation par un modèle structurel (Merton) ou statistique (scoring), selon les données disponibles.",
    ],
    en: [
      "Credit risk is the risk of loss if a counterparty defaults.",
      "A rating summarizes this risk as a letter, but remains a slowly-updated opinion, not a real-time market measure.",
      "For a more precise or reactive PD, the rating is complemented by a structural (Merton) or statistical (scoring) model, depending on available data.",
    ],
  },
  advancedDemonstration: {
    fr: "Trois grandes familles pour estimer une probabilité de défaut, à choisir selon les données disponibles : (1) Taux de défaut historique par catégorie de notation — simple et stable, mais lent et peu réactif à la situation propre d'un émetteur donné ; à privilégier en l'absence d'autres données (émetteur non coté, pas d'historique propre). (2) Modèles structurels (ex. Merton) — modélisent le défaut comme le moment où la valeur des actifs de l'entreprise passe sous la valeur de sa dette ; utiles quand l'entreprise est cotée (on peut estimer la valeur et la volatilité des actifs depuis le cours de l'action), mais reposent sur une structure de bilan simplifiée. (3) Modèles statistiques / scoring (ex. régression logistique sur des ratios financiers, voir M12) — réactifs et calibrables sur des données propres à l'émetteur ou au secteur, mais nécessitent un historique de défauts suffisant pour être fiables, sous peine de surapprentissage. Le bon choix dépend donc à la fois des données disponibles et de l'usage visé (recherche rapide vs pricing précis d'un CDS).",
    en: "Three main families to estimate a default probability, chosen based on available data: (1) Historical default rate by rating category — simple and stable, but slow and not very reactive to a specific issuer's situation; preferred when no other data exists (unlisted issuer, no proprietary history). (2) Structural models (e.g. Merton) — model default as the moment the firm's asset value falls below its debt value; useful when the company is listed (asset value and volatility can be estimated from the stock price), but rely on a simplified balance-sheet structure. (3) Statistical / scoring models (e.g. logistic regression on financial ratios, see M12) — reactive and calibratable on issuer- or sector-specific data, but need a large enough default history to be reliable, or risk overfitting. The right choice therefore depends both on available data and the intended use (quick screening vs precise CDS pricing).",
  },
};
