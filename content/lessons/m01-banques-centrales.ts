import type { LessonContent } from "@/lib/lesson-types";

export const m01BanquesCentrales: LessonContent = {
  conceptId: "m01-banques-centrales",
  glossary: [
    { term: { fr: "Mandat", en: "Mandate" }, definition: { fr: "L'objectif légal fixé à une banque centrale (ex. stabilité des prix), qui détermine ses priorités de politique monétaire.", en: "The legal objective set for a central bank (e.g. price stability), which drives its monetary policy priorities." } },
    { term: { fr: "Taux directeur", en: "Policy rate" }, definition: { fr: "Le taux d'intérêt fixé par la banque centrale, qui influence l'ensemble des taux de l'économie.", en: "The interest rate set by the central bank, which influences the whole economy's rates." } },
  ],
  intuition: {
    fr: "Une banque centrale ajuste un seul levier principal, le taux directeur, pour tenter de piloter toute l'économie : le monter freine l'inflation en renchérissant le crédit, le baisser stimule l'activité en le rendant moins cher.",
    en: "A central bank adjusts one main lever, the policy rate, to try to steer the whole economy: raising it slows inflation by making credit more expensive, lowering it stimulates activity by making it cheaper.",
  },
  definition: {
    fr: "La FED (Réserve fédérale américaine) a un double mandat légal : stabilité des prix ET plein emploi. La BCE (Banque centrale européenne) a un mandat principal unique : la stabilité des prix (objectif d'inflation à moyen terme), l'emploi n'étant qu'un objectif secondaire \"sans préjudice\" du premier. Les deux fixent un taux directeur et utilisent des outils non conventionnels (assouplissement quantitatif, forward guidance) en période de crise.",
    en: "The FED (US Federal Reserve) has a dual legal mandate: price stability AND maximum employment. The ECB (European Central Bank) has a single primary mandate: price stability (a medium-term inflation objective), employment being only a secondary goal \"without prejudice\" to the first. Both set a policy rate and use unconventional tools (quantitative easing, forward guidance) during crises.",
  },
  utility: {
    fr: "Comprendre le mandat d'une banque centrale permet d'anticiper sa réaction probable face à une donnée économique (inflation, chômage) et d'expliquer pourquoi FED et BCE peuvent réagir différemment à un même choc mondial.",
    en: "Understanding a central bank's mandate lets you anticipate its likely reaction to an economic data release (inflation, unemployment) and explains why the FED and ECB can react differently to the same global shock.",
  },
  example: {
    fr: "Face à une hausse du chômage combinée à une inflation modérée, la FED, avec son double mandat, peut légitimement baisser ses taux pour soutenir l'emploi. La BCE, avec son mandat centré sur les prix, doit d'abord s'assurer que l'inflation reste maîtrisée avant de justifier la même baisse — ce qui peut créer un décalage de calendrier entre les deux politiques monétaires.",
    en: "Facing rising unemployment combined with moderate inflation, the FED, with its dual mandate, can legitimately cut rates to support employment. The ECB, with its price-focused mandate, must first ensure inflation stays under control before justifying the same cut — which can create a timing gap between the two monetary policies.",
  },
  alternativeExplanation: {
    fr: "Imaginez deux thermostats réglés différemment : celui de la FED cherche un compromis entre \"température confortable\" (emploi) et \"pas de surchauffe\" (inflation) ; celui de la BCE ne regarde presque exclusivement que la surchauffe. Face à la même pièce trop froide, les deux thermostats ne déclenchent pas le chauffage de la même façon.",
    en: "Picture two differently-set thermostats: the FED's seeks a compromise between \"comfortable temperature\" (employment) and \"no overheating\" (inflation); the ECB's looks almost exclusively at overheating. Facing the same too-cold room, the two thermostats won't trigger the heating the same way.",
  },
  formula: {
    latex: "i = r^{*} + \\pi + 0{,}5(\\pi - \\pi^{*}) + 0{,}5(y - y^{*})",
    variables: [
      { symbol: "i", description: { fr: "Taux directeur suggéré", en: "Suggested policy rate" } },
      { symbol: "r^{*}", description: { fr: "Taux d'intérêt réel naturel de l'économie", en: "The economy's natural real interest rate" } },
      { symbol: "\\pi, \\pi^{*}", description: { fr: "Inflation observée et inflation cible", en: "Observed inflation and target inflation" } },
      { symbol: "y - y^{*}", description: { fr: "Écart de production (output gap) : activité réelle vs potentielle", en: "Output gap: actual vs potential activity" } },
    ],
    assumptions: { fr: "La règle de Taylor est une heuristique descriptive, pas une règle mécanique suivie à la lettre par les banques centrales.", en: "The Taylor rule is a descriptive heuristic, not a mechanical rule literally followed by central banks." },
    units: { fr: "Toutes les variables en proportion annuelle.", en: "All variables as annual proportions." },
    example: { fr: "r*=1%, π=2,5%, π*=2%, y-y*=1% : i = 1+2,5+0,5×0,5+0,5×1 ≈ 4,25%.", en: "r*=1%, π=2.5%, π*=2%, y-y*=1%: i = 1+2.5+0.5×0.5+0.5×1 ≈ 4.25%." },
  },
  calculation: {
    fr: "1) Estimer le taux réel naturel r* et l'inflation cible π*. 2) Relever l'inflation observée π et l'écart de production (y−y*). 3) Additionner r* + π (composante de base) + 0,5 fois chaque écart. 4) Le résultat est une estimation du taux directeur \"cohérent\" avec ces objectifs, selon la règle de Taylor.",
    en: "1) Estimate the natural real rate r* and target inflation π*. 2) Read off observed inflation π and the output gap (y−y*). 3) Add r* + π (base component) + 0.5 times each gap. 4) The result is an estimate of the policy rate \"consistent\" with these objectives, per the Taylor rule.",
  },
  interpretation: {
    fr: "La règle de Taylor illustre concrètement comment un double mandat (FED, avec un terme sur l'écart de production) diffère structurellement d'un mandat unique centré sur les prix (BCE, qui pondère implicitement moins ce terme) : ce n'est pas qu'une différence de discours, c'est une différence d'arbitrage mathématique dans la façon de fixer le taux.",
    en: "The Taylor rule concretely illustrates how a dual mandate (FED, with a term on the output gap) structurally differs from a single, price-focused mandate (ECB, which implicitly weighs that term less): it is not just a difference in rhetoric, it is a difference in the mathematical trade-off used to set the rate.",
  },
  pitfalls: {
    fr: "Prendre la règle de Taylor pour une formule que les banques centrales appliquent mécaniquement : en réalité, elle sert de repère et de grille de lecture a posteriori, pas de mode d'emploi suivi en temps réel. Autre piège : croire que le mandat de la BCE ignore totalement l'emploi — il reste un objectif secondaire légitime, seulement subordonné à la stabilité des prix.",
    en: "Taking the Taylor rule as a formula central banks mechanically apply: in reality it serves as a benchmark and a retrospective reading grid, not a real-time instruction manual. Another trap: believing the ECB's mandate ignores employment entirely — it remains a legitimate secondary goal, only subordinated to price stability.",
  },
  keyPoints: {
    fr: [
      "FED : double mandat (stabilité des prix ET plein emploi) ; BCE : mandat principal unique (stabilité des prix).",
      "Les deux pilotent un taux directeur et recourent à des outils non conventionnels en crise (QE, forward guidance).",
      "La règle de Taylor illustre formellement comment ces mandats différents pondèrent différemment inflation et emploi.",
    ],
    en: [
      "FED: dual mandate (price stability AND maximum employment); ECB: single primary mandate (price stability).",
      "Both steer a policy rate and use unconventional tools during crises (QE, forward guidance).",
      "The Taylor rule formally illustrates how these different mandates weigh inflation and employment differently.",
    ],
  },
  advancedDemonstration: {
    fr: "Ces mandats sont ancrés légalement : le mandat de la FED découle du Federal Reserve Act (amendé en 1977, \"dual mandate\"), tandis que celui de la BCE découle du Traité sur le fonctionnement de l'Union européenne (article 127), qui fixe la stabilité des prix comme objectif principal \"sans préjudice\" d'un objectif secondaire de soutien aux politiques économiques générales de l'Union. Cette différence institutionnelle explique pourquoi la BCE a historiquement communiqué une cible d'inflation précise (\"proche de, mais inférieure à 2%\", révisée en 2021 en \"2% symétrique\"), alors que la FED articule son objectif de façon plus qualitative autour de ses deux piliers. Pour une lecture à jour et sourcée des cibles et outils actuels, consulter les publications institutionnelles de la Federal Reserve (federalreserve.gov) et de la BCE (ecb.europa.eu), qui évoluent avec le temps.",
    en: "These mandates are legally anchored: the FED's mandate stems from the Federal Reserve Act (amended in 1977, the \"dual mandate\"), while the ECB's stems from the Treaty on the Functioning of the European Union (Article 127), which sets price stability as the primary objective \"without prejudice\" to a secondary goal of supporting the Union's general economic policies. This institutional difference explains why the ECB has historically communicated a precise inflation target (\"below, but close to, 2%\", revised in 2021 to a \"symmetric 2%\"), while the FED frames its objective more qualitatively around its two pillars. For an up-to-date, sourced reading of current targets and tools, consult the Federal Reserve's (federalreserve.gov) and the ECB's (ecb.europa.eu) institutional publications, which evolve over time.",
  },
};
