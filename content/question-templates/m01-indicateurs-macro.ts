import { randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const vocabTemplate: QuestionTemplate = {
  id: "m01-macro-vocab",
  conceptId: "m01-indicateurs-macro",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La valeur totale des biens et services produits dans un pays sur une période donnée s'appelle le ______.",
      en: "The total value of goods and services produced in a country over a given period is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un sigle", en: "an acronym" },
    acceptedAnswers: ["pib", "gdp"],
    hint: { fr: "Trois lettres, la mesure de référence de l'activité économique.", en: "Three letters, the benchmark measure of economic activity." },
    explanation: {
      fr: "Le PIB (Produit Intérieur Brut) est la mesure de référence de l'activité économique totale d'un pays.",
      en: "GDP (Gross Domestic Product) is the benchmark measure of a country's total economic activity.",
    },
    commonMistake: {
      fr: "Confondre le PIB avec le budget de l'État, qui n'est qu'une composante de la dépense publique.",
      en: "Confusing GDP with the government budget, which is only a component of public spending.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-macro-comprehension",
  conceptId: "m01-indicateurs-macro",
  difficulty: "easy",
  prompt: {
    fr: "À quoi servent principalement les indicateurs macroéconomiques (PIB, inflation, emploi) pour un acteur de marché ?",
    en: "What are macroeconomic indicators (GDP, inflation, employment) mainly used for by a market participant?",
  },
  choices: [
    { id: "read-cycle-and-policy", label: { fr: "Lire l'état du cycle économique et anticiper les décisions de politique monétaire qui en découlent", en: "Reading the state of the economic cycle and anticipating the monetary policy decisions that follow from it" } },
    { id: "predict-single-stock", label: { fr: "Prédire avec certitude le cours d'une action individuelle", en: "Predicting a single stock's price with certainty" } },
    { id: "no-market-use", label: { fr: "Aucune utilité pratique pour les marchés financiers", en: "No practical use for financial markets" } },
  ],
  correctId: "read-cycle-and-policy",
  hint: { fr: "Pensez au lien entre ces indicateurs et les décisions des banques centrales.", en: "Think about the link between these indicators and central bank decisions." },
  explanation: {
    fr: "Le PIB, l'inflation et l'emploi sont les principaux intrants des décisions de politique monétaire des banques centrales, qui déterminent à leur tour le niveau des taux d'intérêt — un input central pour le pricing de la quasi-totalité des actifs financiers (obligations, changes, actions).",
    en: "GDP, inflation and employment are the main inputs to central banks' monetary policy decisions, which in turn determine the level of interest rates — a central input to pricing almost every financial asset (bonds, FX, equities).",
  },
  commonMistake: {
    fr: "Croire que ces indicateurs macro permettent de prédire le cours d'une action individuelle, alors qu'ils informent surtout sur le contexte économique global.",
    en: "Believing these macro indicators allow predicting an individual stock's price, when they mainly inform about the overall economic backdrop.",
  },
});

const headlineVsCoreComparisonTemplate = mcqTemplate({
  id: "m01-macro-comparaison-headline-core",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare l'inflation \"headline\" de l'inflation \"core\" ?",
    en: "What difference separates \"headline\" inflation from \"core\" inflation?",
  },
  choices: [
    { id: "core-excludes-volatile", label: { fr: "L'inflation core exclut les composantes les plus volatiles (énergie, alimentation), pour donner une lecture plus stable de la tendance sous-jacente", en: "Core inflation excludes the most volatile components (energy, food), to give a more stable reading of the underlying trend" } },
    { id: "same-thing", label: { fr: "Aucune différence, ce sont deux noms pour le même chiffre", en: "No difference, they are two names for the same figure" } },
    { id: "headline-excludes-volatile", label: { fr: "C'est l'inflation headline qui exclut l'énergie et l'alimentation", en: "It is headline inflation that excludes energy and food" } },
  ],
  correctId: "core-excludes-volatile",
  hint: { fr: "Laquelle des deux les banques centrales préfèrent-elles suivre pour juger la tendance de fond ?", en: "Which of the two do central banks prefer to track to judge the underlying trend?" },
  explanation: {
    fr: "L'inflation headline mesure la hausse des prix de l'ensemble du panier de consommation, tandis que l'inflation core retire les composantes les plus volatiles (énergie, alimentation), sujettes à des chocs temporaires (ex. prix du pétrole) : elle donne une lecture plus stable de la tendance inflationniste sous-jacente, souvent privilégiée par les banques centrales pour leurs décisions.",
    en: "Headline inflation measures the price rise across the entire consumption basket, while core inflation strips out the most volatile components (energy, food), prone to temporary shocks (e.g. oil prices): it gives a more stable reading of the underlying inflation trend, often preferred by central banks for their decisions.",
  },
  commonMistake: {
    fr: "Utiliser l'inflation headline pour juger la tendance de fond, sans tenir compte des chocs temporaires qu'elle peut inclure.",
    en: "Using headline inflation to judge the underlying trend, without accounting for the temporary shocks it may include.",
  },
});

const realVsNominalGdpComparisonTemplate = trueFalseTemplate({
  id: "m01-macro-comparaison-pib-reel-nominal",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  statement: {
    fr: "Un PIB nominal en hausse de 5% signifie nécessairement que l'activité économique réelle (le volume de biens et services produits) a progressé de 5%.",
    en: "A nominal GDP up 5% necessarily means real economic activity (the volume of goods and services produced) grew by 5%.",
  },
  correct: false,
  hint: { fr: "Le PIB nominal est mesuré aux prix courants, qui incluent l'effet de l'inflation.", en: "Nominal GDP is measured at current prices, which include the effect of inflation." },
  explanation: {
    fr: "Faux : le PIB nominal est mesuré aux prix courants et inclut donc l'effet de l'inflation — une hausse de 5% du PIB nominal avec 4% d'inflation ne représente qu'environ 1% de croissance réelle. Seul le PIB réel (corrigé de l'inflation) mesure l'évolution du volume physique d'activité.",
    en: "False: nominal GDP is measured at current prices and therefore includes the effect of inflation — a 5% rise in nominal GDP with 4% inflation represents only about 1% of real growth. Only real GDP (inflation-adjusted) measures the change in the physical volume of activity.",
  },
  commonMistake: {
    fr: "Lire un chiffre de croissance du PIB nominal comme s'il mesurait directement la croissance réelle de l'activité, sans corriger de l'inflation.",
    en: "Reading a nominal GDP growth figure as if it directly measured real activity growth, without adjusting for inflation.",
  },
});

const whatIfStrongJobsReportTemplate = mcqTemplate({
  id: "m01-macro-what-if-emploi-fort",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le rapport mensuel sur l'emploi publie un nombre de créations d'emplois nettement supérieur au consensus, avec une croissance des salaires également plus forte que prévu. Quelle est la réaction typique des marchés de taux ?",
    en: "The monthly jobs report publishes job creation figures well above consensus, with wage growth also stronger than expected. What is the typical reaction of rates markets?",
  },
  choices: [
    { id: "yields-rise", label: { fr: "Les taux d'intérêt remontent : un marché du travail tendu avec des salaires en hausse alimente les craintes d'inflation et de taux directeurs plus élevés", en: "Interest rates rise: a tight labor market with rising wages fuels fears of inflation and higher policy rates" } },
    { id: "yields-fall", label: { fr: "Les taux d'intérêt baissent systématiquement face à de bonnes nouvelles économiques", en: "Interest rates systematically fall in the face of good economic news" } },
    { id: "no-reaction", label: { fr: "Aucune réaction, l'emploi n'ayant aucun lien avec les taux d'intérêt", en: "No reaction, since employment has no link to interest rates" } },
  ],
  correctId: "yields-rise",
  hint: { fr: "Un marché du travail tendu (salaires en hausse) est un moteur classique de l'inflation par les coûts.", en: "A tight labor market (rising wages) is a classic driver of cost-push inflation." },
  explanation: {
    fr: "Un rapport sur l'emploi nettement plus fort que prévu, combiné à une croissance salariale élevée, est lu comme un signal de surchauffe du marché du travail, moteur classique de l'inflation par les coûts : les marchés anticipent alors des taux directeurs plus élevés (ou maintenus plus longtemps), ce qui pousse les taux d'intérêt à la hausse.",
    en: "A jobs report well above expectations, combined with strong wage growth, is read as a sign of labor market overheating, a classic driver of cost-push inflation: markets then price in higher (or higher-for-longer) policy rates, pushing interest rates up.",
  },
  commonMistake: {
    fr: "Croire qu'une \"bonne nouvelle\" économique fait toujours baisser les taux, en ignorant le canal par lequel un marché du travail tendu alimente les craintes d'inflation.",
    en: "Believing \"good\" economic news always pushes rates down, ignoring the channel through which a tight labor market fuels inflation fears.",
  },
});

const whatIfInflationSurpriseTemplate = mcqTemplate({
  id: "m01-macro-what-if-surprise-inflation",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "L'inflation publiée ressort exactement en ligne avec le consensus des économistes, mais représente tout de même une hausse par rapport au mois précédent. Que devrait-il typiquement se passer sur les marchés au moment de la publication ?",
    en: "Published inflation comes in exactly in line with economists' consensus, but still represents an increase versus the prior month. What should typically happen in markets at the moment of the release?",
  },
  choices: [
    { id: "limited-reaction", label: { fr: "Une réaction limitée, car l'information était déjà intégrée dans les prix avant la publication", en: "A limited reaction, since the information was already priced in before the release" } },
    { id: "large-reaction", label: { fr: "Un mouvement de marché important, proportionnel à la hausse du chiffre par rapport au mois précédent", en: "A large market move, proportional to the figure's rise versus the prior month" } },
    { id: "guaranteed-crash", label: { fr: "Un krach systématique dès qu'un chiffre d'inflation augmente", en: "A systematic crash whenever an inflation figure rises" } },
  ],
  correctId: "limited-reaction",
  hint: { fr: "Ce qui compte pour la réaction de marché est l'écart au consensus, pas l'évolution par rapport au mois précédent.", en: "What matters for the market reaction is the gap to consensus, not the change versus the prior month." },
  explanation: {
    fr: "Un chiffre en ligne avec le consensus a généralement un impact de marché limité au moment de la publication, même s'il représente une évolution significative par rapport au mois précédent : cette évolution attendue était déjà intégrée dans les prix par les investisseurs avant même la publication officielle.",
    en: "A figure in line with consensus generally has limited market impact at the moment of release, even if it represents a meaningful change versus the prior month: that expected change was already priced in by investors before the official release.",
  },
  commonMistake: {
    fr: "Anticiper un mouvement de marché proportionnel à l'évolution du chiffre par rapport au mois précédent, plutôt qu'à son écart au consensus.",
    en: "Expecting a market move proportional to the figure's change versus the prior month, rather than to its gap to consensus.",
  },
});

const yoyInflationNumericTemplate: QuestionTemplate = {
  id: "m01-macro-calcul-inflation-glissement-annuel",
  conceptId: "m01-indicateurs-macro",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ipcBase = randomInt(rng, 100, 115);
    const ipcNow = ipcBase + randomInt(rng, 3, 9);
    const inflation = Math.round(((ipcNow / ipcBase - 1) * 100) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `L'indice des prix à la consommation (IPC) s'établissait à ${ipcBase} il y a 12 mois, et s'établit aujourd'hui à ${ipcNow}. Quel est le taux d'inflation en glissement annuel, en % ?`,
        en: `The consumer price index (CPI) stood at ${ipcBase} 12 months ago, and stands at ${ipcNow} today. What is the year-on-year inflation rate, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "π = IPC_t / IPC_{t-12} − 1.", en: "π = CPI_t / CPI_{t-12} − 1." },
      numeric: { value: inflation, tolerance: 0.1 },
      calculation: {
        fr: `π = ${ipcNow} / ${ipcBase} − 1 ≈ ${fmt(inflation, "fr")}%.`,
        en: `π = ${ipcNow} / ${ipcBase} − 1 ≈ ${fmt(inflation, "en")}%.`,
      },
      explanation: {
        fr: "Le taux d'inflation en glissement annuel se calcule en comparant le niveau actuel de l'indice des prix à son niveau il y a exactement 12 mois, ce qui élimine naturellement les effets saisonniers (ex. prix de l'énergie plus élevés en hiver).",
        en: "The year-on-year inflation rate is computed by comparing the price index's current level to its level exactly 12 months ago, which naturally removes seasonal effects (e.g. higher energy prices in winter).",
      },
      commonMistake: {
        fr: "Comparer l'IPC au mois précédent (glissement mensuel) au lieu d'il y a 12 mois, ce qui capture des effets saisonniers plutôt que la vraie tendance d'inflation.",
        en: "Comparing the CPI to the prior month (month-on-month) instead of 12 months ago, which captures seasonal effects rather than the true inflation trend.",
      },
    };
  },
};

const revisionPitfallTemplate = trueFalseTemplate({
  id: "m01-macro-erreur-revision",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  statement: {
    fr: "La première publication d'un chiffre de PIB ou d'emploi est définitive et ne sera plus modifiée par la suite.",
    en: "The first release of a GDP or employment figure is final and will not be changed afterward.",
  },
  correct: false,
  hint: { fr: "Les statisticiens publient d'abord une estimation \"flash\", avec des données encore incomplètes.", en: "Statisticians first publish a \"flash\" estimate, with still-incomplete data." },
  explanation: {
    fr: "Faux : le PIB et l'emploi sont systématiquement révisés dans les publications suivantes, à mesure que des données plus complètes deviennent disponibles — ces révisions peuvent être significatives et sont elles-mêmes suivies par les marchés comme une source d'information à part entière.",
    en: "False: GDP and employment are systematically revised in subsequent releases, as more complete data becomes available — these revisions can be significant and are themselves tracked by markets as a source of information in their own right.",
  },
  commonMistake: {
    fr: "Traiter la première estimation publiée d'un indicateur macro comme un chiffre figé, sans anticiper de révisions ultérieures.",
    en: "Treating a macro indicator's first published estimate as a fixed number, without anticipating later revisions.",
  },
});

const nfpTraderScenarioTemplate = mcqTemplate({
  id: "m01-macro-scenario-trader-nfp",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader obligataire sait que le rapport mensuel sur l'emploi américain sera publié dans 10 minutes, un événement historiquement très volatil pour les taux. Quelle attitude est la plus cohérente avec ce risque ?",
    en: "A bond trader knows the monthly US jobs report will be released in 10 minutes, a historically very volatile event for rates. Which attitude is most consistent with this risk?",
  },
  choices: [
    { id: "reduce-risk-before", label: { fr: "Réduire la taille de ses positions ou élargir ses stops avant la publication, pour limiter l'exposition à un mouvement brutal et imprévisible", en: "Reduce position size or widen stops ahead of the release, to limit exposure to a sudden, unpredictable move" } },
    { id: "increase-size", label: { fr: "Augmenter fortement sa position juste avant la publication pour maximiser le gain potentiel", en: "Sharply increase the position just before the release to maximize potential gain" } },
    { id: "ignore-event", label: { fr: "Ignorer complètement l'événement, les publications macro n'affectant jamais les taux à si court terme", en: "Completely ignore the event, since macro releases never affect rates over such a short horizon" } },
  ],
  correctId: "reduce-risk-before",
  hint: { fr: "Une publication à fort impact et binaire (surprise haussière ou baissière) est un risque à gérer activement.", en: "A high-impact, binary release (upside or downside surprise) is a risk to actively manage." },
  explanation: {
    fr: "Les publications macro à fort impact (comme le rapport mensuel sur l'emploi américain) provoquent typiquement des mouvements de taux brutaux et imprévisibles dans les secondes qui suivent : un trader prudent réduit sa taille de position ou élargit ses stops avant la publication, plutôt que de s'exposer sans filet à un résultat binaire.",
    en: "High-impact macro releases (like the monthly US jobs report) typically trigger sudden, unpredictable rate moves in the seconds that follow: a prudent trader reduces position size or widens stops ahead of the release, rather than being exposed with no safety net to a binary outcome.",
  },
  commonMistake: {
    fr: "Augmenter son exposition juste avant une publication macro à fort impact, en pariant sur le sens du chiffre plutôt qu'en gérant le risque d'incertitude.",
    en: "Increasing exposure right before a high-impact macro release, betting on the figure's direction rather than managing the uncertainty risk.",
  },
});

const pmiExpansionScenarioTemplate = mcqTemplate({
  id: "m01-macro-scenario-pmi-expansion",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "L'indice PMI manufacturier d'un pays passe de 48,5 le mois dernier à 51,2 ce mois-ci. Comment un analyste interprète-t-il typiquement ce franchissement du seuil de 50 ?",
    en: "A country's manufacturing PMI rises from 48.5 last month to 51.2 this month. How does an analyst typically interpret this crossing of the 50 threshold?",
  },
  choices: [
    { id: "contraction-to-expansion", label: { fr: "L'activité manufacturière passe d'un état de contraction à un état d'expansion, un signal avancé positif pour le cycle économique", en: "Manufacturing activity moves from contraction to expansion, a positive leading signal for the economic cycle" } },
    { id: "no-meaning", label: { fr: "Ce seuil de 50 n'a aucune signification particulière dans la lecture d'un indice PMI", en: "This 50 threshold has no particular meaning when reading a PMI index" } },
    { id: "recession-signal", label: { fr: "C'est au contraire un signal avancé de récession imminente", en: "This is, on the contrary, a leading signal of imminent recession" } },
  ],
  correctId: "contraction-to-expansion",
  hint: { fr: "Par convention, un PMI au-dessus de 50 signale une expansion de l'activité, en dessous une contraction.", en: "By convention, a PMI above 50 signals activity expansion, below 50 a contraction." },
  explanation: {
    fr: "Un indice PMI est construit pour que 50 sépare conventionnellement l'expansion (au-dessus) de la contraction (en dessous) de l'activité : passer de 48,5 à 51,2 signale un basculement vers l'expansion, un signal avancé positif souvent suivi de près car les enquêtes PMI sont publiées plus tôt que les données \"dures\" (PIB, production industrielle).",
    en: "A PMI index is built so that 50 conventionally separates expansion (above) from contraction (below) in activity: moving from 48.5 to 51.2 signals a shift toward expansion, a positive leading signal closely watched because PMI surveys are published earlier than \"hard\" data (GDP, industrial production).",
  },
  commonMistake: {
    fr: "Ignorer le seuil conventionnel de 50 et interpréter un indice PMI comme n'importe quel chiffre, sans tenir compte de sa construction spécifique.",
    en: "Ignoring the conventional 50 threshold and interpreting a PMI index like any other figure, without accounting for its specific construction.",
  },
});

const invertedCurveRecessionScenarioTemplate = mcqTemplate({
  id: "m01-macro-scenario-courbe-inversee",
  conceptId: "m01-indicateurs-macro",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un économiste observe simultanément une courbe des taux inversée (taux courts supérieurs aux taux longs) et des indices PMI sous 50 dans plusieurs grandes économies. Quelle lecture combinée est la plus cohérente avec ces deux signaux ?",
    en: "An economist simultaneously observes an inverted yield curve (short rates above long rates) and PMI indices below 50 in several major economies. What combined reading is most consistent with these two signals?",
  },
  choices: [
    { id: "combined-recession-signal", label: { fr: "Un signal combiné de ralentissement, voire de récession, particulièrement surveillé par les salles de marché lorsque les deux signaux convergent", en: "A combined signal of slowdown, or even recession, particularly watched by trading floors when the two signals converge" } },
    { id: "unrelated-signals", label: { fr: "Deux signaux sans aucun lien entre eux, qu'il ne faut jamais analyser ensemble", en: "Two unrelated signals that should never be analyzed together" } },
    { id: "bullish-signal", label: { fr: "Un signal haussier pour l'activité économique à court terme", en: "A bullish signal for short-term economic activity" } },
  ],
  correctId: "combined-recession-signal",
  hint: { fr: "Les deux signaux pointent historiquement dans la même direction en amont d'un ralentissement économique.", en: "The two signals historically point in the same direction ahead of an economic slowdown." },
  explanation: {
    fr: "Une courbe des taux inversée reflète l'anticipation par le marché d'une baisse future des taux directeurs (donc d'un ralentissement économique à venir), tandis que des PMI sous 50 confirment une contraction déjà en cours de l'activité manufacturière : la convergence de ces deux signaux, l'un prospectif et l'autre contemporain, renforce la lecture d'un risque de récession et explique pourquoi les salles de marché les surveillent conjointement.",
    en: "An inverted yield curve reflects the market's anticipation of future policy rate cuts (hence an upcoming economic slowdown), while PMIs below 50 confirm an already ongoing contraction in manufacturing activity: the convergence of these two signals, one forward-looking and the other contemporaneous, reinforces the recession-risk reading and explains why trading floors monitor them jointly.",
  },
  commonMistake: {
    fr: "Analyser la courbe des taux et les indices PMI comme deux signaux indépendants, sans voir qu'ils se renforcent mutuellement en amont d'un ralentissement.",
    en: "Analyzing the yield curve and PMI indices as two independent signals, without seeing that they reinforce each other ahead of a slowdown.",
  },
});

const leadingVsLaggingComparisonTemplate = mcqTemplate({
  id: "m01-macro-comparaison-avance-retard",
  conceptId: "m01-indicateurs-macro",
  difficulty: "medium",
  prompt: {
    fr: "Entre le taux de chômage et les indices PMI/ISM, lequel est un indicateur \"avancé\" (leading) du cycle économique, et lequel est \"retardé\" (lagging) ?",
    en: "Between the unemployment rate and PMI/ISM indices, which is a \"leading\" indicator of the economic cycle, and which is \"lagging\"?",
  },
  choices: [
    { id: "pmi-leading-unemployment-lagging", label: { fr: "Les PMI/ISM sont avancés (publiés tôt, anticipent le cycle) ; le taux de chômage est retardé (il réagit après un retournement de l'activité)", en: "PMI/ISM are leading (published early, anticipate the cycle); unemployment is lagging (it reacts after activity turns)" } },
    { id: "unemployment-leading-pmi-lagging", label: { fr: "C'est l'inverse : le taux de chômage est avancé, les PMI/ISM sont retardés", en: "It's the opposite: unemployment is leading, PMI/ISM are lagging" } },
    { id: "both-same-timing", label: { fr: "Les deux réagissent avec exactement le même délai au cycle économique", en: "Both react to the economic cycle with exactly the same delay" } },
  ],
  correctId: "pmi-leading-unemployment-lagging",
  hint: { fr: "Les entreprises ajustent leurs commandes/achats avant d'ajuster leurs effectifs.", en: "Companies adjust orders/purchases before adjusting headcount." },
  explanation: {
    fr: "Les entreprises réagissent généralement à un ralentissement en ajustant d'abord leurs commandes et achats (ce que capturent les PMI/ISM, publiés mensuellement et rapidement), et n'ajustent leurs effectifs qu'ensuite, avec un délai : le taux de chômage est donc un indicateur retardé (lagging), qui confirme un retournement déjà entamé plutôt qu'il ne l'annonce.",
    en: "Companies typically react to a slowdown by first adjusting their orders and purchases (what PMI/ISM surveys capture, published monthly and quickly), and only adjust headcount afterward, with a lag: the unemployment rate is therefore a lagging indicator, confirming a turn already underway rather than announcing it.",
  },
  commonMistake: {
    fr: "Traiter tous les indicateurs macro comme équivalents en termes de calendrier, sans distinguer ceux qui anticipent le cycle de ceux qui le confirment après coup.",
    en: "Treating all macro indicators as equivalent in timing, without distinguishing those that anticipate the cycle from those that confirm it after the fact.",
  },
});

export const templates: QuestionTemplate[] = [
  vocabTemplate,
  comprehensionTemplate,
  headlineVsCoreComparisonTemplate,
  realVsNominalGdpComparisonTemplate,
  leadingVsLaggingComparisonTemplate,
  whatIfStrongJobsReportTemplate,
  whatIfInflationSurpriseTemplate,
  yoyInflationNumericTemplate,
  revisionPitfallTemplate,
  nfpTraderScenarioTemplate,
  pmiExpansionScenarioTemplate,
  invertedCurveRecessionScenarioTemplate,
];
