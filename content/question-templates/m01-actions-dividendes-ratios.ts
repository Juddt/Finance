import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

const comprehensionTemplate = mcqTemplate({
  id: "m01-actions-ratios-comprehension",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert principalement un ratio comme le P/E (cours/bénéfice) pour un investisseur ?",
    en: "What is a ratio like the P/E (price-to-earnings) mainly used for by an investor?",
  },
  choices: [
    { id: "quick-relative-comparison", label: { fr: "Comparer rapidement, en un seul chiffre, ce que le marché paie pour un euro de bénéfice entre plusieurs actions", en: "Quickly comparing, in a single number, what the market pays for one euro of profit across several stocks" } },
    { id: "guarantee-future-price", label: { fr: "Garantir avec certitude le cours futur de l'action", en: "Guaranteeing the share's future price with certainty" } },
    { id: "compute-corporate-tax", label: { fr: "Calculer directement l'impôt sur les sociétés dû par l'entreprise", en: "Directly computing the corporate tax owed by the company" } },
    { id: "replace-full-analysis", label: { fr: "Remplacer intégralement toute analyse financière plus approfondie", en: "Fully replacing any deeper financial analysis" } },
  ],
  correctId: "quick-relative-comparison",
  hint: { fr: "C'est un outil de comparaison RAPIDE, pas une prévision ni un calcul fiscal.", en: "It's a QUICK comparison tool, not a forecast or a tax calculation." },
  explanation: {
    fr: "Le P/E est avant tout un outil de comparaison rapide entre actions : il résume en un seul chiffre ce que le marché est prêt à payer pour un euro de bénéfice. Il ne garantit rien sur le cours futur, n'a aucun lien direct avec le calcul de l'impôt sur les sociétés, et ne remplace pas une analyse plus complète (DCF, comparables approfondis) quand la décision d'investissement l'exige.",
    en: "The P/E is above all a quick comparison tool between stocks: it summarizes in a single number what the market is willing to pay for one euro of profit. It guarantees nothing about the future price, has no direct link to corporate tax computation, and does not replace a more complete analysis (DCF, deeper comparables) when the investment decision requires it.",
  },
  commonMistake: {
    fr: "Traiter un ratio simple comme le P/E comme une prévision fiable du cours futur de l'action.",
    en: "Treating a simple ratio like the P/E as a reliable forecast of the share's future price.",
  },
});

const epsVsDividendComparisonTemplate = mcqTemplate({
  id: "m01-actions-ratios-comparaison-bpa-dividende",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare le bénéfice par action (BPA) du dividende par action ?",
    en: "What difference separates earnings per share (EPS) from the dividend per share?",
  },
  choices: [
    { id: "eps-total-dividend-distributed-part", label: { fr: "Le BPA est le bénéfice total généré par action ; le dividende n'en est que la part effectivement reversée en cash aux actionnaires", en: "EPS is the total profit generated per share; the dividend is only the portion actually paid out in cash to shareholders" } },
    { id: "always-equal", label: { fr: "Ils sont toujours strictement égaux pour toute entreprise cotée", en: "They are always strictly equal for any listed company" } },
    { id: "dividend-always-higher", label: { fr: "Le dividende par action est toujours supérieur au BPA", en: "The dividend per share is always higher than EPS" } },
    { id: "unrelated-figures", label: { fr: "Ce sont deux chiffres totalement indépendants, sans aucun lien entre eux", en: "These are two totally independent figures, with no link between them" } },
  ],
  correctId: "eps-total-dividend-distributed-part",
  hint: { fr: "Une entreprise ne reverse généralement pas 100% de son bénéfice en dividende.", en: "A company generally doesn't pay out 100% of its profit as a dividend." },
  explanation: {
    fr: "Le BPA représente le bénéfice total généré par action, avant toute décision d'affectation ; le dividende n'en est que la fraction que l'entreprise choisit de reverser en cash aux actionnaires (le taux de distribution), le reste étant réinvesti dans l'activité — les deux chiffres sont donc liés, mais rarement égaux.",
    en: "EPS represents the total profit generated per share, before any allocation decision; the dividend is only the fraction the company chooses to pay out in cash to shareholders (the payout ratio), the rest being reinvested in the business — the two figures are therefore related, but rarely equal.",
  },
  commonMistake: {
    fr: "Confondre le bénéfice total généré par action avec la seule part effectivement distribuée aux actionnaires.",
    en: "Confusing the total profit generated per share with only the portion actually distributed to shareholders.",
  },
});

const trailingVsForwardComparisonTemplate = mcqTemplate({
  id: "m01-actions-ratios-comparaison-trailing-forward",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare un P/E \"trailing\" d'un P/E \"forward\" ?",
    en: "What difference separates a \"trailing\" P/E from a \"forward\" P/E?",
  },
  choices: [
    { id: "past-vs-projected-earnings", label: { fr: "Le trailing utilise les bénéfices déjà publiés des 12 derniers mois ; le forward utilise des bénéfices projetés sur les 12 prochains mois", en: "Trailing uses already published earnings from the last 12 months; forward uses projected earnings for the next 12 months" } },
    { id: "same-calculation", label: { fr: "Les deux utilisent exactement les mêmes bénéfices, seul le nom diffère", en: "Both use exactly the same earnings, only the name differs" } },
    { id: "forward-uses-past-too", label: { fr: "Le forward utilise en réalité aussi des bénéfices déjà publiés, jamais de projections", en: "Forward actually also uses already published earnings, never projections" } },
    { id: "trailing-only-for-dividends", label: { fr: "Le trailing ne s'applique qu'au calcul du dividende, jamais du P/E", en: "Trailing only applies to the dividend calculation, never to the P/E" } },
  ],
  correctId: "past-vs-projected-earnings",
  hint: { fr: "\"Trailing\" regarde en arrière, \"forward\" regarde en avant.", en: "\"Trailing\" looks backward, \"forward\" looks forward." },
  explanation: {
    fr: "Le P/E trailing se fonde sur des bénéfices déjà publiés et connus (les 12 derniers mois), tandis que le P/E forward se fonde sur des bénéfices projetés (souvent le consensus des analystes pour les 12 prochains mois) : pour une entreprise en forte croissance, ces deux chiffres peuvent différer significativement, ce qui impose de toujours préciser lequel des deux est utilisé.",
    en: "The trailing P/E is based on already published, known earnings (the last 12 months), while the forward P/E is based on projected earnings (often the analyst consensus for the next 12 months): for a fast-growing company, these two figures can differ significantly, which requires always specifying which of the two is used.",
  },
  commonMistake: {
    fr: "Comparer un P/E trailing d'une entreprise à un P/E forward d'une autre, sans réaliser qu'ils ne mesurent pas la même chose.",
    en: "Comparing one company's trailing P/E to another's forward P/E, without realizing they don't measure the same thing.",
  },
});

const whatIfPriceFallsDividendConstantTemplate = mcqTemplate({
  id: "m01-actions-ratios-what-if-chute-cours",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le cours d'une action chute de 40% en quelques mois, sans que l'entreprise n'annonce de changement de son dividende annuel par action. Que devient le rendement du dividende affiché ?",
    en: "A stock's price falls 40% over a few months, with no announced change to the company's annual dividend per share. What happens to the displayed dividend yield?",
  },
  choices: [
    { id: "yield-mechanically-rises", label: { fr: "Il augmente mécaniquement, puisque le même dividende est désormais rapporté à un cours plus bas", en: "It mechanically rises, since the same dividend is now divided by a lower price" } },
    { id: "yield-unchanged", label: { fr: "Il reste inchangé, le rendement du dividende ne dépendant pas du cours de l'action", en: "It stays unchanged, since the dividend yield doesn't depend on the share price" } },
    { id: "yield-falls", label: { fr: "Il baisse, car une chute de cours reflète toujours une réduction anticipée du dividende", en: "It falls, since a price drop always reflects an anticipated dividend reduction" } },
    { id: "yield-becomes-undefined", label: { fr: "Il devient impossible à calculer tant que le dividende n'est pas officiellement modifié", en: "It becomes impossible to compute until the dividend is officially changed" } },
  ],
  correctId: "yield-mechanically-rises",
  hint: { fr: "Rendement = Dividende / Cours : que devient une fraction quand son dénominateur baisse, le numérateur restant fixe ?", en: "Yield = Dividend / Price: what happens to a fraction when its denominator falls, the numerator staying fixed?" },
  explanation: {
    fr: "Le rendement du dividende est un simple ratio (dividende annuel / cours) : si le dividende reste inchangé et que le cours chute, ce ratio augmente mécaniquement — un rendement affiché anormalement élevé est donc souvent le symptôme d'une chute de cours récente plutôt qu'un signe de générosité de l'entreprise, ce qui doit alerter sur un possible \"piège à dividende\" (le marché anticipant une coupe future).",
    en: "The dividend yield is a simple ratio (annual dividend / price): if the dividend stays unchanged and the price falls, this ratio mechanically rises — an abnormally high displayed yield is therefore often the symptom of a recent price drop rather than a sign of corporate generosity, which should raise a flag about a possible \"dividend trap\" (the market anticipating a future cut).",
  },
  commonMistake: {
    fr: "Interpréter systématiquement un rendement du dividende élevé comme une bonne nouvelle, sans vérifier s'il résulte d'une chute récente du cours.",
    en: "Systematically interpreting a high dividend yield as good news, without checking whether it results from a recent price drop.",
  },
});

const whatIfGrowthOutlookTemplate = mcqTemplate({
  id: "m01-actions-ratios-what-if-perspectives-croissance",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise technologique voit ses perspectives de croissance des bénéfices révisées fortement à la hausse par les analystes, sans que son bénéfice actuel ne change. Quel est l'effet le plus probable sur son P/E, toutes choses égales par ailleurs sur le cours ?",
    en: "A tech company sees its earnings growth outlook revised sharply upward by analysts, with no change to its current profit. What is the most likely effect on its P/E, all else equal on the price?",
  },
  choices: [
    { id: "price-rises-pe-rises", label: { fr: "Le marché est prêt à payer davantage pour ce même bénéfice actuel, ce qui fait monter le cours et donc le P/E", en: "The market is willing to pay more for that same current profit, pushing the price and hence the P/E up" } },
    { id: "pe-unaffected", label: { fr: "Le P/E n'est jamais affecté par des révisions de perspectives de croissance futures", en: "The P/E is never affected by revisions of future growth outlooks" } },
    { id: "pe-falls", label: { fr: "Le P/E baisse mécaniquement dès qu'une perspective de croissance est révisée à la hausse", en: "The P/E mechanically falls whenever a growth outlook is revised upward" } },
    { id: "only-eps-changes", label: { fr: "Seul le BPA change dans ce scénario, le P/E restant rigoureusement identique", en: "Only the EPS changes in this scenario, the P/E staying strictly identical" } },
  ],
  correctId: "price-rises-pe-rises",
  hint: { fr: "Le P/E reflète ce que le marché est prêt à payer AUJOURD'HUI pour le bénéfice actuel, y compris en anticipation de sa croissance future.", en: "The P/E reflects what the market is willing to pay TODAY for current profit, including in anticipation of its future growth." },
  explanation: {
    fr: "Le prix qu'un investisseur accepte de payer pour une action intègre ses attentes de croissance future des bénéfices : une révision à la hausse de ces perspectives, même sans changement du bénéfice actuel, pousse typiquement le cours à la hausse (le marché anticipant des bénéfices futurs plus élevés), ce qui fait mécaniquement monter le P/E calculé sur le bénéfice actuel inchangé — c'est précisément pourquoi les entreprises de forte croissance affichent structurellement des P/E élevés.",
    en: "The price an investor agrees to pay for a share incorporates their expectations of future earnings growth: an upward revision of that outlook, even with no change to current profit, typically pushes the price up (the market anticipating higher future profits), which mechanically raises the P/E computed on the unchanged current profit — precisely why fast-growing companies structurally display high P/Es.",
  },
  commonMistake: {
    fr: "Croire que le P/E ne dépend que du bénéfice actuel, sans tenir compte de la façon dont les attentes de croissance future influencent le cours payé aujourd'hui.",
    en: "Believing the P/E only depends on current profit, without accounting for how future growth expectations influence the price paid today.",
  },
});

const epsCalcTemplate = mcqTemplate({
  id: "m01-actions-ratios-calcul-bpa",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  calculation: {
    fr: "BPA = 480 000 000 / 80 000 000 = 6 EUR.",
    en: "EPS = 480,000,000 / 80,000,000 = EUR 6.",
  },
  prompt: {
    fr: "Une entreprise réalise un résultat net de 480 millions EUR, avec 80 millions d'actions en circulation. Quel est son bénéfice par action (BPA) ?",
    en: "A company posts a net income of EUR 480 million, with 80 million shares outstanding. What is its earnings per share (EPS)?",
  },
  choices: [
    { id: "6eur", label: { fr: "6 EUR, en divisant le résultat net par le nombre d'actions", en: "EUR 6, by dividing net income by the number of shares" } },
    { id: "400eur", label: { fr: "400 EUR, en multipliant les deux montants au lieu de les diviser", en: "EUR 400, by multiplying the two amounts instead of dividing them" } },
    { id: "0.17eur", label: { fr: "0,17 EUR, en inversant le numérateur et le dénominateur", en: "EUR 0.17, by inverting the numerator and denominator" } },
    { id: "480eur", label: { fr: "480 EUR, en oubliant de diviser par le nombre d'actions", en: "EUR 480, forgetting to divide by the number of shares" } },
  ],
  correctId: "6eur",
  hint: { fr: "BPA = Résultat net / Nombre d'actions.", en: "EPS = Net income / Number of shares." },
  explanation: {
    fr: "Le BPA s'obtient en divisant simplement le résultat net total de l'entreprise par le nombre d'actions en circulation : 480 000 000 / 80 000 000 = 6 EUR par action. Inverser cette division, multiplier au lieu de diviser, ou oublier l'une des deux grandeurs sont les erreurs les plus fréquentes sur ce calcul pourtant direct.",
    en: "EPS is obtained by simply dividing the company's total net income by the number of shares outstanding: 480,000,000 / 80,000,000 = EUR 6 per share. Inverting this division, multiplying instead of dividing, or forgetting one of the two quantities are the most frequent errors on this otherwise direct calculation.",
  },
  commonMistake: {
    fr: "Diviser le nombre d'actions par le résultat net au lieu de l'inverse.",
    en: "Dividing the number of shares by net income instead of the other way around.",
  },
});

const dividendYieldCalcTemplate = mcqTemplate({
  id: "m01-actions-ratios-calcul-rendement-dividende",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  calculation: {
    fr: "Rendement = 3 / 60 = 5%.",
    en: "Yield = 3 / 60 = 5%.",
  },
  prompt: {
    fr: "Une action cote 60 EUR et verse un dividende annuel de 3 EUR par action. Quel est son rendement du dividende ?",
    en: "A share trades at EUR 60 and pays an annual dividend of EUR 3 per share. What is its dividend yield?",
  },
  choices: [
    { id: "5pct", label: { fr: "5%, en divisant le dividende par le cours de l'action", en: "5%, by dividing the dividend by the share price" } },
    { id: "20pct", label: { fr: "20%, en divisant le cours de l'action par le dividende", en: "20%, by dividing the share price by the dividend" } },
    { id: "3pct", label: { fr: "3%, en confondant le rendement avec le montant du dividende lui-même", en: "3%, confusing the yield with the dividend amount itself" } },
    { id: "63pct", label: { fr: "63%, en additionnant le cours et le dividende au lieu de diviser", en: "63%, by adding the price and the dividend instead of dividing" } },
  ],
  correctId: "5pct",
  hint: { fr: "Rendement du dividende = Dividende annuel / Cours de l'action.", en: "Dividend yield = Annual dividend / Share price." },
  explanation: {
    fr: "Le rendement du dividende rapporte le dividende annuel par action au cours de l'action : 3 / 60 = 5%. Inverser cette division (obtenant un multiple plutôt qu'un pourcentage), reporter directement le montant du dividende, ou additionner les deux grandeurs sont des confusions fréquentes entre ce ratio et d'autres calculs proches.",
    en: "The dividend yield relates the annual dividend per share to the share price: 3 / 60 = 5%. Inverting this division (getting a multiple rather than a percentage), directly reporting the dividend amount, or adding the two quantities are frequent confusions between this ratio and other nearby calculations.",
  },
  commonMistake: {
    fr: "Diviser le cours de l'action par le dividende au lieu de l'inverse, ce qui donne un multiple sans rapport avec un rendement.",
    en: "Dividing the share price by the dividend instead of the other way around, giving a multiple unrelated to a yield.",
  },
});

const highYieldAlwaysGoodMistakeTemplate = mcqTemplate({
  id: "m01-actions-ratios-erreur-rendement-eleve",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur un rendement du dividende inhabituellement élevé est correcte ?",
    en: "Which of these statements about an unusually high dividend yield is correct?",
  },
  choices: [
    { id: "needs-payout-check", label: { fr: "Il doit être vérifié en croisant le taux de distribution : un taux supérieur à 100% signale un dividende potentiellement non soutenable", en: "It must be checked against the payout ratio: a ratio above 100% signals a potentially unsustainable dividend" } },
    { id: "always-attractive", label: { fr: "Il est toujours une bonne nouvelle pour l'investisseur, sans exception", en: "It is always good news for the investor, with no exception" } },
    { id: "irrelevant-metric", label: { fr: "Il s'agit d'une métrique sans intérêt, à ignorer systématiquement", en: "It is a metric with no interest, to be systematically ignored" } },
    { id: "guarantees-future-increase", label: { fr: "Il garantit que le dividende continuera d'augmenter à l'avenir", en: "It guarantees the dividend will keep increasing in the future" } },
  ],
  correctId: "needs-payout-check",
  hint: { fr: "Un rendement élevé peut venir d'une politique généreuse OU d'une chute de cours annonçant une coupe.", en: "A high yield can come from a generous policy OR a price drop foreshadowing a cut." },
  explanation: {
    fr: "Un rendement du dividende inhabituellement élevé doit toujours être croisé avec le taux de distribution : si celui-ci dépasse 100% (l'entreprise verse plus qu'elle ne gagne), c'est un signal d'alerte sérieux sur la soutenabilité du dividende, souvent annonciateur d'une coupe future — un rendement élevé n'est donc ni automatiquement une bonne nouvelle, ni à ignorer, ni une garantie de hausses futures.",
    en: "An unusually high dividend yield should always be cross-checked against the payout ratio: if it exceeds 100% (the company pays out more than it earns), it is a serious warning sign about the dividend's sustainability, often foreshadowing a future cut — a high yield is therefore neither automatically good news, nor to be ignored, nor a guarantee of future increases.",
  },
  commonMistake: {
    fr: "Sélectionner des actions uniquement sur la base d'un rendement du dividende élevé, sans jamais vérifier le taux de distribution sous-jacent.",
    en: "Selecting stocks solely based on a high dividend yield, without ever checking the underlying payout ratio.",
  },
});

const crossSectorPeMistakeTemplate = mcqTemplate({
  id: "m01-actions-ratios-erreur-comparaison-secteurs",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur conclut qu'une banque au P/E de 8x est \"moins chère\" qu'une entreprise technologique au P/E de 35x, et achète directement la banque sur cette seule base. Quelle est l'erreur dans ce raisonnement ?",
    en: "An investor concludes that a bank with an 8x P/E is \"cheaper\" than a tech company with a 35x P/E, and directly buys the bank on this basis alone. What is the flaw in this reasoning?",
  },
  choices: [
    { id: "different-growth-risk-profiles", label: { fr: "Comparer des P/E d'entreprises à profils de croissance et de risque très différents, sans ajustement, peut être trompeur", en: "Comparing P/Es of companies with very different growth and risk profiles, with no adjustment, can be misleading" } },
    { id: "pe-always-comparable", label: { fr: "Aucune erreur : un P/E plus bas signifie toujours qu'une action est sous-évaluée, quel que soit le secteur", en: "No flaw at all: a lower P/E always means a stock is undervalued, whatever the sector" } },
    { id: "pe-meaningless-alone", label: { fr: "Le P/E n'a en réalité jamais aucune utilité, quelle que soit la comparaison effectuée", en: "The P/E in fact never has any use, whatever the comparison performed" } },
    { id: "should-compare-nominal-price", label: { fr: "Il aurait fallu comparer directement les cours nominaux des deux actions plutôt que leur P/E", en: "The nominal share prices of the two stocks should have been compared directly instead of their P/E" } },
  ],
  correctId: "different-growth-risk-profiles",
  hint: { fr: "Le P/E d'un secteur mature à faible croissance et celui d'un secteur en forte croissance ne répondent pas à la même logique.", en: "The P/E of a mature, low-growth sector and that of a fast-growing sector don't follow the same logic." },
  explanation: {
    fr: "Un P/E plus bas n'est significatif que comparé à des entreprises réellement similaires en profil de croissance et de risque (voir M13, méthode des comparables) : une banque mature et une entreprise technologique en forte croissance ont des P/E structurellement différents pour des raisons légitimes, et les comparer directement sans ajustement conduit à des conclusions erronées.",
    en: "A lower P/E is only meaningful when compared against genuinely similar companies in growth and risk profile (see M13, comparables method): a mature bank and a fast-growing tech company have structurally different P/Es for legitimate reasons, and comparing them directly with no adjustment leads to flawed conclusions.",
  },
  commonMistake: {
    fr: "Comparer directement les P/E d'entreprises de secteurs très différents, en concluant qu'un chiffre plus bas signifie systématiquement une meilleure opportunité.",
    en: "Directly comparing P/Es of companies from very different sectors, concluding a lower figure systematically means a better opportunity.",
  },
});

const screeningScenarioTemplate = mcqTemplate({
  id: "m01-actions-ratios-scenario-screening",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un analyste veut présélectionner rapidement, parmi des centaines d'actions d'un même secteur, celles qui semblent les moins chères en relatif. Quelle démarche est la plus cohérente avec cet objectif ?",
    en: "An analyst wants to quickly pre-screen, among hundreds of stocks from the same sector, those that appear relatively cheapest. What approach is most consistent with this goal?",
  },
  choices: [
    { id: "compare-pe-within-sector", label: { fr: "Comparer le P/E de chaque action à la moyenne du même secteur, pour identifier rapidement des écarts à approfondir", en: "Compare each stock's P/E to the same sector's average, to quickly identify gaps worth investigating further" } },
    { id: "compare-nominal-price-only", label: { fr: "Classer les actions uniquement par leur cours nominal en devise, du plus bas au plus élevé", en: "Rank stocks solely by their nominal price in currency, from lowest to highest" } },
    { id: "full-dcf-every-stock", label: { fr: "Construire immédiatement un DCF complet pour chacune des centaines d'actions avant toute présélection", en: "Immediately build a full DCF for each of the hundreds of stocks before any pre-screening" } },
    { id: "random-selection", label: { fr: "Sélectionner un échantillon aléatoire, les ratios de valorisation n'étant pas fiables pour ce type d'exercice", en: "Select a random sample, since valuation ratios aren't reliable for this kind of exercise" } },
  ],
  correctId: "compare-pe-within-sector",
  hint: { fr: "L'objectif est un premier tri RAPIDE et RELATIF, au sein d'un même secteur : quel outil est fait pour ça ?", en: "The goal is a QUICK, RELATIVE first screen, within the same sector: which tool is built for that?" },
  explanation: {
    fr: "Comparer le P/E de chaque action à la moyenne de son secteur est exactement l'usage pour lequel ce ratio a été conçu : un premier tri rapide et peu coûteux en temps, permettant d'identifier les écarts les plus significatifs à approfondir ensuite avec des méthodes plus complètes (DCF) — construire un DCF complet pour des centaines d'actions dès la présélection serait disproportionné, et le cours nominal seul (sans le rapporter au bénéfice) ne dit rien de la cherté relative d'une action.",
    en: "Comparing each stock's P/E to its sector average is exactly the use case this ratio was designed for: a quick, low-time-cost first screen, allowing the most significant gaps to be identified for further investigation with more complete methods (DCF) — building a full DCF for hundreds of stocks at the pre-screening stage would be disproportionate, and the nominal price alone (without relating it to profit) says nothing about a stock's relative cheapness.",
  },
  commonMistake: {
    fr: "Comparer directement les cours nominaux de plusieurs actions, sans les rapporter à leur bénéfice, pour juger de leur cherté relative.",
    en: "Directly comparing several stocks' nominal prices, without relating them to their profit, to judge their relative cheapness.",
  },
});

const payoutRatioCalcTemplate = mcqTemplate({
  id: "m01-actions-ratios-calcul-taux-distribution",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "medium",
  isScenario: true,
  calculation: {
    fr: "Taux de distribution = 2,50 / 5,00 = 50%.",
    en: "Payout ratio = 2.50 / 5.00 = 50%.",
  },
  prompt: {
    fr: "Une entreprise a un BPA de 5,00 EUR et verse un dividende annuel de 2,50 EUR par action. Quel est son taux de distribution (payout ratio) ?",
    en: "A company has an EPS of EUR 5.00 and pays an annual dividend of EUR 2.50 per share. What is its payout ratio?",
  },
  choices: [
    { id: "50pct", label: { fr: "50%, en divisant le dividende par le BPA", en: "50%, by dividing the dividend by the EPS" } },
    { id: "200pct", label: { fr: "200%, en divisant le BPA par le dividende", en: "200%, by dividing the EPS by the dividend" } },
    { id: "2.5pct", label: { fr: "2,5%, en confondant le taux de distribution avec le rendement du dividende", en: "2.5%, confusing the payout ratio with the dividend yield" } },
    { id: "7.5pct", label: { fr: "7,5%, en additionnant les deux montants au lieu de les diviser", en: "7.5%, by adding the two amounts instead of dividing them" } },
  ],
  correctId: "50pct",
  hint: { fr: "Taux de distribution = Dividende par action / BPA.", en: "Payout ratio = Dividend per share / EPS." },
  explanation: {
    fr: "Le taux de distribution rapporte le dividende versé au bénéfice total généré par action : 2,50 / 5,00 = 50%, ce qui signifie que la moitié du bénéfice est reversée en cash, l'autre moitié étant réinvestie. Ce ratio se distingue du rendement du dividende (qui rapporte le dividende au COURS de l'action, pas au bénéfice).",
    en: "The payout ratio relates the dividend paid to the total profit generated per share: 2.50 / 5.00 = 50%, meaning half the profit is paid out in cash, the other half reinvested. This ratio is distinct from the dividend yield (which relates the dividend to the share's PRICE, not to profit).",
  },
  commonMistake: {
    fr: "Confondre le taux de distribution (dividende / BPA) avec le rendement du dividende (dividende / cours de l'action), deux ratios aux dénominateurs différents.",
    en: "Confusing the payout ratio (dividend / EPS) with the dividend yield (dividend / share price), two ratios with different denominators.",
  },
});

const growthVsMatureScenarioTemplate = mcqTemplate({
  id: "m01-actions-ratios-scenario-croissance-vs-mature",
  conceptId: "m01-actions-dividendes-ratios",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Deux entreprises ont exactement le même BPA de 4 EUR. La première (secteur technologique) cote à un P/E de 40x ; la seconde (secteur des services publics) cote à un P/E de 10x. Quelle explication est la plus cohérente avec cet écart, en l'absence de toute survalorisation ou sous-évaluation ?",
    en: "Two companies have exactly the same EPS of EUR 4. The first (tech sector) trades at a 40x P/E; the second (utilities sector) trades at a 10x P/E. What explanation is most consistent with this gap, absent any overvaluation or undervaluation?",
  },
  choices: [
    { id: "growth-expectations-differ", label: { fr: "Le marché anticipe une croissance future des bénéfices bien plus forte pour la première entreprise, ce qui justifie un P/E structurellement plus élevé", en: "The market expects much stronger future earnings growth for the first company, justifying a structurally higher P/E" } },
    { id: "calculation-error-somewhere", label: { fr: "Un tel écart ne peut s'expliquer que par une erreur de calcul dans l'un des deux P/E", en: "Such a gap can only be explained by a calculation error in one of the two P/Es" } },
    { id: "second-company-always-better-buy", label: { fr: "La seconde entreprise est nécessairement le meilleur achat, un P/E plus bas étant toujours préférable", en: "The second company is necessarily the better buy, a lower P/E always being preferable" } },
    { id: "identical-eps-means-identical-pe", label: { fr: "Un même BPA devrait toujours impliquer un P/E identique pour deux entreprises quelconques", en: "The same EPS should always imply an identical P/E for any two companies" } },
  ],
  correctId: "growth-expectations-differ",
  hint: { fr: "Le P/E intègre les attentes de croissance FUTURE, pas seulement le bénéfice actuel.", en: "The P/E incorporates FUTURE growth expectations, not just current profit." },
  explanation: {
    fr: "Un même BPA actuel n'implique pas un même P/E, car le P/E intègre aussi les attentes de croissance future des bénéfices : une entreprise technologique en forte croissance justifie structurellement un P/E plus élevé qu'une entreprise de services publics mature, dont la croissance est plus lente mais dont les bénéfices sont plus prévisibles — un ratio comme le PEG (P/E rapporté à la croissance anticipée) permet justement d'ajuster cette comparaison.",
    en: "The same current EPS does not imply the same P/E, since the P/E also incorporates future earnings growth expectations: a fast-growing tech company structurally justifies a higher P/E than a mature utility company, whose growth is slower but whose profits are more predictable — a ratio like the PEG (P/E related to expected growth) precisely allows adjusting this comparison.",
  },
  commonMistake: {
    fr: "S'attendre à ce qu'un même BPA implique automatiquement un même P/E, en ignorant le rôle des attentes de croissance future dans la valorisation.",
    en: "Expecting the same EPS to automatically imply the same P/E, ignoring the role of future growth expectations in valuation.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  epsVsDividendComparisonTemplate,
  trailingVsForwardComparisonTemplate,
  whatIfPriceFallsDividendConstantTemplate,
  whatIfGrowthOutlookTemplate,
  epsCalcTemplate,
  dividendYieldCalcTemplate,
  payoutRatioCalcTemplate,
  highYieldAlwaysGoodMistakeTemplate,
  crossSectorPeMistakeTemplate,
  screeningScenarioTemplate,
  growthVsMatureScenarioTemplate,
];
