import type { LessonContent } from "@/lib/lesson-types";

export const m01IndicateursMacro: LessonContent = {
  conceptId: "m01-indicateurs-macro",
  glossary: [
    { term: { fr: "PIB (Produit Intérieur Brut)", en: "GDP (Gross Domestic Product)" }, definition: { fr: "La valeur totale des biens et services produits dans un pays sur une période donnée : la mesure de référence de l'activité économique.", en: "The total value of goods and services produced in a country over a given period: the benchmark measure of economic activity." } },
    { term: { fr: "IPC (Indice des Prix à la Consommation)", en: "CPI (Consumer Price Index)" }, definition: { fr: "Un indice qui suit l'évolution du prix d'un panier de biens et services représentatif de la consommation des ménages, utilisé pour mesurer l'inflation.", en: "An index tracking the price evolution of a basket of goods and services representative of household consumption, used to measure inflation." } },
  ],
  intuition: {
    fr: "Les marchés ne réagissent pas au niveau absolu d'un indicateur macroéconomique, mais à sa \"surprise\" : l'écart entre le chiffre publié et ce que les investisseurs anticipaient déjà (le consensus). Un PIB \"fort\" peut faire baisser les marchés s'il est plus fort qu'anticipé — c'est cette logique de surprise, plus que le niveau lui-même, qui explique la plupart des réactions de marché aux publications macro.",
    en: "Markets do not react to a macroeconomic indicator's absolute level, but to its \"surprise\": the gap between the published figure and what investors already expected (the consensus). A \"strong\" GDP print can make markets fall if it is stronger than expected — this surprise logic, more than the level itself, explains most market reactions to macro releases.",
  },
  definition: {
    fr: "Trois familles d'indicateurs macroéconomiques structurent la lecture d'une économie. Le PIB mesure l'activité économique totale (sa croissance, en % par trimestre ou par an) ; on distingue le PIB nominal (aux prix courants) du PIB réel (corrigé de l'inflation, qui reflète la croissance \"physique\"). L'inflation mesure la hausse générale des prix, le plus souvent via l'IPC ; on distingue l'inflation \"headline\" (globale) de l'inflation \"core\" (hors composantes volatiles comme l'énergie et l'alimentation). L'emploi se lit via le taux de chômage, les créations d'emplois (ex. les \"non-farm payrolls\" américains) et les salaires, qui informent sur la tension du marché du travail.",
    en: "Three families of macroeconomic indicators structure how an economy is read. GDP measures total economic activity (its growth rate, in % per quarter or year); nominal GDP (at current prices) is distinguished from real GDP (adjusted for inflation, reflecting \"physical\" growth). Inflation measures the general rise in prices, most often via the CPI; \"headline\" (overall) inflation is distinguished from \"core\" inflation (excluding volatile components like energy and food). Employment is read via the unemployment rate, job creation (e.g. US \"non-farm payrolls\"), and wages, which signal how tight the labor market is.",
  },
  utility: {
    fr: "Ces indicateurs sont l'intrant principal des décisions de politique monétaire des banques centrales (voir la notion suivante) : une inflation trop élevée ou un marché du travail trop tendu pousse vers des taux directeurs plus élevés, ce qui affecte directement le pricing des obligations, des changes et des actions. Savoir lire un calendrier économique et anticiper l'impact d'une publication est une compétence de base pour tout métier de marché.",
    en: "These indicators are the main input to central banks' monetary policy decisions (see the next concept): inflation running too high or a labor market that is too tight pushes toward higher policy rates, which directly affects the pricing of bonds, FX and equities. Knowing how to read an economic calendar and anticipate a release's impact is a basic skill for any market-facing role.",
  },
  example: {
    fr: "Le consensus des économistes anticipe une inflation américaine (IPC) de 3,2% sur un an. La publication tombe à 3,6% : c'est une \"surprise\" positive de 0,4 point. Les marchés obligataires anticipent alors des taux directeurs plus élevés plus longtemps, et les taux longs remontent immédiatement — même si 3,6% reste un niveau d'inflation historiquement modéré en absolu.",
    en: "Economists' consensus expects US inflation (CPI) at 3.2% year-on-year. The release comes in at 3.6%: a positive \"surprise\" of 0.4 points. Bond markets then price in higher-for-longer policy rates, and long-term yields immediately rise — even though 3.6% remains a historically moderate inflation level in absolute terms.",
  },
  alternativeExplanation: {
    fr: "Voyez le PIB, l'inflation et l'emploi comme le \"bulletin de notes\" trimestriel d'un pays : ce qui fait bouger la note d'une entreprise en bourse n'est pas que son bénéfice soit positif ou négatif dans l'absolu, mais qu'il batte ou déçoive ce que les analystes attendaient. Un pays, comme une entreprise, est jugé par rapport aux attentes du marché, pas dans l'absolu.",
    en: "Think of GDP, inflation and employment as a country's quarterly \"report card\": what moves a company's stock is not whether its profit is positive or negative in absolute terms, but whether it beats or disappoints what analysts expected. A country, like a company, is judged against market expectations, not in absolute terms.",
  },
  formula: {
    latex: "\\begin{aligned} g_t &= \\frac{PIB_t}{PIB_{t-1}} - 1 \\\\ \\pi_t &= \\frac{IPC_t}{IPC_{t-12}} - 1 \\end{aligned}",
    variables: [
      { symbol: "g_t", description: { fr: "Taux de croissance du PIB sur la période", en: "GDP growth rate over the period" } },
      { symbol: "PIB_t, PIB_{t-1}", description: { fr: "Niveau du PIB à la période courante et à la période précédente", en: "GDP level in the current and previous period" } },
      { symbol: "\\pi_t", description: { fr: "Taux d'inflation annuel (en glissement sur 12 mois)", en: "Annual inflation rate (year-on-year)" } },
      { symbol: "IPC_t, IPC_{t-12}", description: { fr: "Niveau de l'indice des prix ce mois-ci et il y a 12 mois", en: "Price index level this month and 12 months ago" } },
    ],
    assumptions: { fr: "Le PIB peut être mesuré en glissement trimestriel ou annuel selon la convention du pays ; l'inflation est ici calculée en glissement annuel (sur 12 mois), la convention la plus courante pour lisser les effets saisonniers.", en: "GDP can be measured quarter-on-quarter or year-on-year depending on the country's convention; inflation here is computed year-on-year (over 12 months), the most common convention to smooth out seasonal effects." },
    units: { fr: "Taux en proportion (ou %) par période.", en: "Rates as a proportion (or %) per period." },
    example: { fr: "PIB_t=105, PIB_{t-1}=103 → g ≈ 1,94%. IPC_t=118, IPC_{t-12}=115 → π ≈ 2,61%.", en: "PIB_t=105, PIB_{t-1}=103 → g ≈ 1.94%. CPI_t=118, CPI_{t-12}=115 → π ≈ 2.61%." },
  },
  calculation: {
    fr: "1) Relever le niveau de l'indicateur à la période courante et à la période de référence. 2) Diviser le niveau courant par le niveau de référence. 3) Soustraire 1 pour obtenir le taux de variation. 4) Comparer ce chiffre au consensus des économistes, pas seulement à sa valeur absolue.",
    en: "1) Read off the indicator's level at the current and reference periods. 2) Divide the current level by the reference level. 3) Subtract 1 to get the growth/change rate. 4) Compare this figure to the economists' consensus, not just its absolute value.",
  },
  interpretation: {
    fr: "Un chiffre \"en ligne\" avec le consensus a généralement peu d'impact de marché, même s'il représente une évolution économique significative : l'information était déjà intégrée dans les prix. C'est l'écart au consensus (la surprise) qui déclenche un mouvement de marché, et son ampleur dépend aussi de l'importance accordée à cet indicateur par la banque centrale à ce moment précis du cycle.",
    en: "A figure \"in line\" with consensus generally has little market impact, even if it represents a meaningful economic development: the information was already priced in. It is the gap to consensus (the surprise) that triggers a market move, and its magnitude also depends on how much weight the central bank places on that indicator at that specific point in the cycle.",
  },
  pitfalls: {
    fr: "Confondre PIB nominal et PIB réel : un PIB nominal en hausse peut refléter uniquement de l'inflation, sans aucune croissance réelle de l'activité. Autre piège : traiter la première publication d'un chiffre comme définitive — le PIB et l'emploi sont systématiquement révisés dans les publications suivantes, parfois significativement. Enfin, oublier que ces indicateurs sont des variables retardées (lagging) ou avancées (leading) selon leur nature : le chômage réagit en retard au cycle économique, tandis que les indices PMI/ISM l'anticipent.",
    en: "Confusing nominal and real GDP: a rising nominal GDP can simply reflect inflation, with no real growth in activity at all. Another trap: treating the first release of a figure as final — GDP and employment are systematically revised in later releases, sometimes significantly. Finally, forgetting these indicators are lagging or leading relative to the cycle depending on their nature: unemployment reacts to the economic cycle with a lag, while PMI/ISM surveys anticipate it.",
  },
  keyPoints: {
    fr: [
      "PIB (croissance de l'activité), inflation (IPC) et emploi (chômage, créations d'emplois) sont les trois familles d'indicateurs macro de référence.",
      "Les marchés réagissent à la surprise (écart au consensus), pas au niveau absolu du chiffre publié.",
      "PIB nominal ≠ PIB réel ; inflation headline ≠ inflation core ; les premières publications sont révisées ensuite.",
    ],
    en: [
      "GDP (activity growth), inflation (CPI) and employment (unemployment, job creation) are the three benchmark macro indicator families.",
      "Markets react to the surprise (gap to consensus), not the published figure's absolute level.",
      "Nominal GDP ≠ real GDP; headline inflation ≠ core inflation; first releases get revised afterward.",
    ],
  },
  advancedDemonstration: {
    fr: "Au-delà des trois indicateurs \"phares\", les salles de marché suivent des dizaines de publications secondaires, choisies pour leur pouvoir prédictif ou leur rapidité. Les indices PMI/ISM (enquêtes mensuelles auprès des directeurs d'achat, avec un seuil de 50 séparant expansion et contraction) sont des indicateurs avancés très suivis car publiés tôt, avant les données \"dures\" (PIB, production industrielle). Les modèles de \"nowcasting\" (comme GDPNow de la Fed d'Atlanta) recalculent en continu une estimation du PIB du trimestre en cours à partir des données déjà publiées, avant la publication officielle. Le rapport mensuel sur l'emploi américain (\"jobs report\") est scruté dans ses moindres détails : le chiffre principal des créations d'emplois (non-farm payrolls), mais aussi le taux de participation à la population active (qui peut faire baisser le taux de chômage sans réelle amélioration si des gens quittent le marché du travail) et la croissance du salaire horaire moyen (un indicateur avancé de pressions inflationnistes salariales). Une courbe des taux inversée (taux courts supérieurs aux taux longs), combinée à des PMI sous 50, est un signal combiné de récession particulièrement surveillé par les salles de marché.",
    en: "Beyond the three \"headline\" indicators, trading floors track dozens of secondary releases, chosen for their predictive power or timeliness. PMI/ISM indices (monthly surveys of purchasing managers, with a threshold of 50 separating expansion from contraction) are closely watched leading indicators because they are published early, ahead of \"hard\" data (GDP, industrial production). \"Nowcasting\" models (like the Atlanta Fed's GDPNow) continuously recompute an estimate of the current quarter's GDP from already-published data, ahead of the official release. The monthly US employment report (\"jobs report\") is scrutinized down to its finest details: the headline job-creation figure (non-farm payrolls), but also the labor force participation rate (which can push the unemployment rate down with no real improvement if people leave the labor force) and average hourly wage growth (a leading indicator of wage-driven inflationary pressure). An inverted yield curve (short rates above long rates), combined with PMIs below 50, is a combined recession signal that trading floors watch particularly closely.",
  },
};
