import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

const comprehensionTemplate = mcqTemplate({
  id: "m01-anticip-comprehension",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "easy",
  prompt: {
    fr: "Que représente la \"probabilité de marché\" d'une décision de taux, telle qu'affichée par un outil comme le CME FedWatch ?",
    en: "What does a rate decision's \"market probability\", as displayed by a tool like CME FedWatch, represent?",
  },
  choices: [
    { id: "collective-price-implied", label: { fr: "La probabilité que les prix des instruments de taux courts (futures, OIS) intègrent collectivement, à un instant donné", en: "The probability that short-rate instrument prices (futures, OIS) collectively embed, at a given moment" } },
    { id: "official-forecast", label: { fr: "Une prévision officielle publiée directement par la banque centrale elle-même", en: "An official forecast published directly by the central bank itself" } },
    { id: "poll-of-economists", label: { fr: "Un sondage d'opinion réalisé auprès d'un panel d'économistes", en: "An opinion poll conducted among a panel of economists" } },
    { id: "guaranteed-outcome", label: { fr: "Le résultat garanti de la prochaine décision de politique monétaire", en: "The guaranteed outcome of the next monetary policy decision" } },
  ],
  correctId: "collective-price-implied",
  hint: { fr: "Ce chiffre se calcule à partir de prix de marché, pas d'une déclaration officielle.", en: "This figure is computed from market prices, not an official statement." },
  explanation: {
    fr: "Cette \"probabilité de marché\" est calculée à partir des prix des instruments de taux courts (futures Fed Funds, swaps OIS), qui reflètent la vue collective des investisseurs à un instant donné. Ce n'est ni une prévision officielle de la banque centrale (qui ne communique jamais de probabilité chiffrée précise sur sa propre décision), ni un sondage d'économistes (une méthode différente, moins réactive), ni un résultat garanti : les prix peuvent évoluer d'ici la décision, et la décision elle-même reste incertaine jusqu'à son annonce.",
    en: "This \"market probability\" is computed from short-rate instrument prices (Fed Funds futures, OIS swaps), reflecting investors' collective view at a given moment. It is neither an official central bank forecast (which never communicates a precise numerical probability on its own decision), nor an economist poll (a different, less reactive method), nor a guaranteed outcome: prices can move before the decision, and the decision itself remains uncertain until announced.",
  },
  commonMistake: {
    fr: "Confondre une probabilité déduite des prix de marché avec une prévision officielle ou garantie de la banque centrale.",
    en: "Confusing a probability derived from market prices with an official or guaranteed central bank forecast.",
  },
});

const decisionImpactComparisonTemplate = mcqTemplate({
  id: "m01-anticip-comparaison-impact-decision",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  prompt: {
    fr: "Comparez l'impact de marché typique d'une décision \"conforme aux attentes\" à celui d'une décision \"surprise\", de même ampleur en points de base.",
    en: "Compare the typical market impact of a decision \"in line with expectations\" versus a \"surprise\" decision, of the same size in basis points.",
  },
  choices: [
    { id: "surprise-bigger-impact", label: { fr: "La décision surprise provoque un impact bien plus fort, car l'information n'était pas encore intégrée dans les prix", en: "The surprise decision triggers a much larger impact, since the information was not yet priced in" } },
    { id: "same-impact", label: { fr: "Les deux ont un impact strictement identique, seule l'ampleur en points de base compte", en: "Both have a strictly identical impact, only the basis-point size matters" } },
    { id: "expected-bigger-impact", label: { fr: "La décision conforme aux attentes a paradoxalement un impact plus fort", en: "The decision in line with expectations paradoxically has a stronger impact" } },
    { id: "neither-moves-market", label: { fr: "Ni l'une ni l'autre ne provoque de mouvement de marché mesurable", en: "Neither one triggers any measurable market move" } },
  ],
  correctId: "surprise-bigger-impact",
  hint: { fr: "Ce qui n'est pas déjà dans les prix doit encore s'y intégrer au moment de l'annonce.", en: "What isn't already in prices still has to get priced in at the moment of the announcement." },
  explanation: {
    fr: "Une décision conforme aux attentes ne fait qu'entériner ce que les prix intégraient déjà : son impact marginal est donc limité. Une surprise de même ampleur, elle, oblige les prix à intégrer une information nouvelle et non anticipée, ce qui provoque un mouvement bien plus marqué — l'ampleur en points de base seule ne détermine donc pas l'impact de marché.",
    en: "A decision in line with expectations only confirms what prices already embedded: its marginal impact is therefore limited. A surprise of the same size forces prices to incorporate new, unanticipated information, triggering a much sharper move — the basis-point size alone does not determine the market impact.",
  },
  commonMistake: {
    fr: "Croire que seule l'ampleur en points de base d'une décision détermine son impact de marché, en ignorant si elle était déjà anticipée ou non.",
    en: "Believing only a decision's basis-point size determines its market impact, ignoring whether it was already expected or not.",
  },
});

const fedFundsVsOisComparisonTemplate = mcqTemplate({
  id: "m01-anticip-comparaison-futures-ois",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare les futures Fed Funds (utilisés aux États-Unis) des swaps OIS (utilisés plus largement, y compris en zone euro) pour lire les anticipations de taux ?",
    en: "What difference separates Fed Funds futures (used in the US) from OIS swaps (more broadly used, including in the euro area) to read rate expectations?",
  },
  choices: [
    { id: "specific-vs-general-instrument", label: { fr: "Les futures Fed Funds sont un instrument coté spécifique au marché américain ; les OIS sont un instrument de swap plus général, utilisé sur de nombreuses devises", en: "Fed Funds futures are a listed instrument specific to the US market; OIS are a more general swap instrument, used across many currencies" } },
    { id: "no-difference-at-all", label: { fr: "Aucune différence, ce sont deux noms interchangeables pour le même produit", en: "No difference at all, these are two interchangeable names for the same product" } },
    { id: "ois-only-for-equities", label: { fr: "Les OIS ne s'utilisent que pour les anticipations sur le marché actions, jamais sur les taux", en: "OIS are only used for equity market expectations, never for rates" } },
    { id: "futures-worldwide-ois-us-only", label: { fr: "C'est l'inverse : les futures Fed Funds sont utilisés mondialement, les OIS seulement aux États-Unis", en: "It's the opposite: Fed Funds futures are used worldwide, OIS only in the US" } },
  ],
  correctId: "specific-vs-general-instrument",
  hint: { fr: "L'un est un contrat coté propre au marché américain, l'autre un swap de gré à gré utilisable sur toute devise avec un taux au jour le jour de référence.", en: "One is a listed contract specific to the US market, the other an OTC swap usable on any currency with a reference overnight rate." },
  explanation: {
    fr: "Les futures Fed Funds sont un contrat coté spécifique au marché américain, construit sur le taux Fed Funds effectif. Les swaps OIS reposent sur le même principe (échanger un taux fixe contre le taux au jour le jour moyen réalisé) mais existent sur de nombreuses devises, avec leur propre taux de référence (€STR en zone euro, SONIA au Royaume-Uni) : c'est l'instrument le plus généralement utilisé pour lire les anticipations de taux directeurs hors des États-Unis.",
    en: "Fed Funds futures are a listed contract specific to the US market, built on the effective Fed Funds rate. OIS swaps rest on the same principle (exchanging a fixed rate against the realized average overnight rate) but exist across many currencies, each with its own reference rate (€STR in the euro area, SONIA in the UK): it is the most generally used instrument to read policy rate expectations outside the US.",
  },
  commonMistake: {
    fr: "Croire que futures Fed Funds et swaps OIS sont un seul et même instrument utilisable indifféremment sur toute devise.",
    en: "Believing Fed Funds futures and OIS swaps are one and the same instrument usable interchangeably on any currency.",
  },
});

const whatIfMatchesExpectationTemplate = mcqTemplate({
  id: "m01-anticip-what-if-conforme-attentes",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le marché priçait 95% de probabilité d'un statu quo des taux directeurs, sans aucun changement de discours attendu. La banque centrale annonce effectivement un statu quo, avec un discours inchangé. Quelle est la réaction de marché la plus probable ?",
    en: "The market was pricing a 95% probability of a policy rate hold, with no change in tone expected. The central bank indeed announces a hold, with unchanged tone. What is the most likely market reaction?",
  },
  choices: [
    { id: "muted-reaction", label: { fr: "Une réaction limitée : la décision et le discours confirment simplement ce qui était déjà intégré dans les prix", en: "A muted reaction: the decision and tone simply confirm what was already priced in" } },
    { id: "sharp-reaction", label: { fr: "Un mouvement de marché violent, car toute décision de banque centrale provoque systématiquement un choc", en: "A sharp market move, since any central bank decision systematically triggers a shock" } },
    { id: "reaction-proportional-to-rate-level", label: { fr: "Une réaction proportionnelle au niveau absolu du taux directeur, indépendamment de ce qui était anticipé", en: "A reaction proportional to the policy rate's absolute level, independent of what was expected" } },
    { id: "delayed-reaction-next-day", label: { fr: "Aucune réaction avant le lendemain, les marchés ayant besoin d'un jour complet pour intégrer l'information", en: "No reaction before the next day, markets needing a full day to price in the information" } },
  ],
  correctId: "muted-reaction",
  hint: { fr: "Rien de nouveau n'est révélé ici par rapport à ce que le marché anticipait déjà.", en: "Nothing new is revealed here relative to what the market already expected." },
  explanation: {
    fr: "Lorsque la décision ET le discours confirment exactement ce qui était déjà intégré dans les prix (probabilité de 95%, aucun changement de ton anticipé), il ne reste quasiment aucune information nouvelle à intégrer : la réaction de marché est donc typiquement limitée, contrairement à l'idée reçue qu'une décision de banque centrale provoque toujours un choc de marché.",
    en: "When the decision AND the tone exactly confirm what was already priced in (95% probability, no tone change expected), there is almost no new information left to price: the market reaction is therefore typically muted, contrary to the common belief that a central bank decision always triggers a market shock.",
  },
  commonMistake: {
    fr: "Croire que toute décision de banque centrale provoque nécessairement un mouvement de marché important, sans tenir compte de ce qui était déjà anticipé.",
    en: "Believing any central bank decision necessarily triggers a significant market move, without accounting for what was already expected.",
  },
});

const hawkishHoldWhatIfTemplate = mcqTemplate({
  id: "m01-anticip-what-if-hawkish-hold",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une banque centrale maintient ses taux inchangés comme attendu, mais son discours suggère que de nouvelles hausses sont désormais plus probables qu'avant la réunion (un \"hawkish hold\"). Quel est l'effet le plus probable sur les taux d'intérêt à plus long terme ?",
    en: "A central bank keeps rates unchanged as expected, but its tone suggests further hikes are now more likely than before the meeting (a \"hawkish hold\"). What is the most likely effect on longer-term interest rates?",
  },
  choices: [
    { id: "long-rates-rise", label: { fr: "Les taux plus longs remontent, car le chemin de taux futur anticipé par le marché se révise à la hausse", en: "Longer rates rise, as the market's anticipated future rate path is revised upward" } },
    { id: "no-movement-since-hold", label: { fr: "Aucun mouvement, puisque la décision elle-même (le statu quo) était déjà anticipée", en: "No movement at all, since the decision itself (the hold) was already expected" } },
    { id: "long-rates-fall", label: { fr: "Les taux plus longs baissent, un statu quo étant toujours interprété comme accommodant", en: "Longer rates fall, a hold always being read as accommodative" } },
    { id: "only-short-rates-affected", label: { fr: "Seuls les taux très courts sont affectés, les taux longs restant indifférents au discours de la banque centrale", en: "Only very short-term rates are affected, longer rates staying indifferent to the central bank's tone" } },
  ],
  correctId: "long-rates-rise",
  hint: { fr: "Ce n'est pas la décision du jour qui bouge ici, mais le CHEMIN de taux anticipé sur les réunions futures.", en: "It's not today's decision that moves here, but the anticipated PATH of rates over future meetings." },
  explanation: {
    fr: "Même si la décision du jour (statu quo) était déjà intégrée dans les prix, un discours plus \"hawkish\" que prévu révise à la hausse le chemin de taux anticipé sur les réunions futures : les taux d'intérêt à plus long terme, qui reflètent une moyenne des taux courts anticipés sur leur horizon, remontent en conséquence — un exemple typique de mouvement de marché déclenché par la révision du discours plutôt que par la décision elle-même.",
    en: "Even though today's decision (a hold) was already priced in, a more \"hawkish\" tone than expected revises the anticipated rate path upward for future meetings: longer-term interest rates, which reflect an average of expected short rates over their horizon, rise as a result — a typical example of a market move triggered by the revision of the tone rather than by the decision itself.",
  },
  commonMistake: {
    fr: "Se concentrer uniquement sur la décision du jour (le statu quo) en ignorant l'effet du discours sur le chemin de taux anticipé pour les réunions futures.",
    en: "Focusing only on the day's decision (the hold) while ignoring the tone's effect on the anticipated rate path for future meetings.",
  },
});

const impliedProbabilityCalcTemplate = mcqTemplate({
  id: "m01-anticip-calcul-probabilite-implicite",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  isScenario: true,
  calculation: {
    fr: "p = (f − r0) / Δ = (5,10% − 5,00%) / 0,25% = 0,10% / 0,25% = 40%.",
    en: "p = (f − r0) / Δ = (5.10% − 5.00%) / 0.25% = 0.10% / 0.25% = 40%.",
  },
  prompt: {
    fr: "Le taux directeur actuel est de 5,00%. Le taux OIS à l'échéance de la prochaine réunion implique un taux moyen anticipé de 5,10%. Le marché n'envisage qu'une seule taille de mouvement possible : une hausse de 0,25%. Quelle est la probabilité implicite de cette hausse ?",
    en: "The current policy rate is 5.00%. The OIS rate at the next meeting's horizon implies an average expected rate of 5.10%. The market only considers one possible move size: a 0.25% hike. What is the implied probability of this hike?",
  },
  choices: [
    { id: "40pct", label: { fr: "40%, en divisant l'écart de taux (0,10 point) par la taille du mouvement (0,25 point)", en: "40%, by dividing the rate gap (0.10 point) by the move size (0.25 point)" } },
    { id: "10pct", label: { fr: "10%, l'écart de taux lui-même exprimé en %", en: "10%, the rate gap itself expressed as a %" } },
    { id: "100pct", label: { fr: "100%, puisque le taux OIS est supérieur au taux directeur actuel", en: "100%, since the OIS rate is above the current policy rate" } },
    { id: "50pct", label: { fr: "50%, en supposant par défaut une probabilité égale entre hausse et statu quo", en: "50%, by defaulting to an equal probability between a hike and a hold" } },
  ],
  correctId: "40pct",
  hint: { fr: "p = (f − r0) / Δ.", en: "p = (f − r0) / Δ." },
  explanation: {
    fr: "La probabilité implicite se calcule en divisant l'écart entre le taux anticipé (5,10%) et le taux actuel (5,00%), soit 0,10 point, par la taille du mouvement envisagé (0,25 point), ce qui donne 40%. Confondre l'écart de taux (10%, en oubliant de diviser par Δ) avec la probabilité elle-même est l'erreur la plus fréquente ; déduire 100% du simple signe de l'écart ignore l'amplitude relative du mouvement ; et 50% n'est qu'une supposition arbitraire sans lien avec les données fournies.",
    en: "The implied probability is computed by dividing the gap between the expected rate (5.10%) and the current rate (5.00%), i.e. 0.10 point, by the envisioned move size (0.25 point), giving 40%. Confusing the rate gap (10%, forgetting to divide by Δ) with the probability itself is the most frequent error; deducing 100% from the gap's sign alone ignores the move's relative magnitude; and 50% is just an arbitrary guess unrelated to the given data.",
  },
  commonMistake: {
    fr: "Oublier de diviser l'écart de taux par la taille du mouvement envisagé Δ, en reportant directement l'écart comme s'il était la probabilité.",
    en: "Forgetting to divide the rate gap by the envisioned move size Δ, directly reporting the gap as if it were the probability.",
  },
});

const futuresPriceCalcTemplate = mcqTemplate({
  id: "m01-anticip-calcul-prix-futures",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  isScenario: true,
  calculation: {
    fr: "Taux anticipé = 100 − 94,85 = 5,15%.",
    en: "Expected rate = 100 − 94.85 = 5.15%.",
  },
  prompt: {
    fr: "Un contrat futures Fed Funds se négocie à un prix de 94,85. Quel taux Fed Funds moyen ce prix implique-t-il pour le mois du contrat ?",
    en: "A Fed Funds futures contract trades at a price of 94.85. What average Fed Funds rate does this price imply for the contract's month?",
  },
  choices: [
    { id: "5.15pct", label: { fr: "5,15%, en soustrayant le prix coté de 100", en: "5.15%, by subtracting the quoted price from 100" } },
    { id: "94.85pct", label: { fr: "94,85%, directement égal au prix coté", en: "94.85%, directly equal to the quoted price" } },
    { id: "0.85pct", label: { fr: "0,85%, en ne retenant que les deux derniers chiffres du prix", en: "0.85%, keeping only the price's last two digits" } },
    { id: "cannot-determine", label: { fr: "Impossible à déterminer sans connaître le taux directeur actuel", en: "Impossible to determine without knowing the current policy rate" } },
  ],
  correctId: "5.15pct",
  hint: { fr: "Prix futures = 100 − taux anticipé.", en: "Futures price = 100 − expected rate." },
  explanation: {
    fr: "Un contrat futures Fed Funds se cote conventionnellement comme 100 moins le taux Fed Funds moyen anticipé : un prix de 94,85 implique donc directement un taux anticipé de 100 − 94,85 = 5,15%, sans qu'il soit nécessaire de connaître le taux directeur actuel pour effectuer cette seule conversion (celui-ci ne serait nécessaire que pour en déduire ensuite une probabilité de mouvement).",
    en: "A Fed Funds futures contract is conventionally quoted as 100 minus the average expected Fed Funds rate: a price of 94.85 therefore directly implies an expected rate of 100 − 94.85 = 5.15%, with no need to know the current policy rate for this specific conversion alone (that would only be needed afterward to derive a move probability).",
  },
  commonMistake: {
    fr: "Lire directement le prix coté comme s'il était lui-même le taux anticipé, en oubliant la convention \"100 moins le taux\".",
    en: "Directly reading the quoted price as if it were itself the expected rate, forgetting the \"100 minus the rate\" convention.",
  },
});

const nextMeetingVsFullPathMistakeTemplate = mcqTemplate({
  id: "m01-anticip-erreur-prochaine-reunion-vs-chemin",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations décrit correctement ce que révèle la probabilité implicite calculée pour la PROCHAINE réunion de banque centrale ?",
    en: "Which of these statements correctly describes what the implied probability computed for the NEXT central bank meeting reveals?",
  },
  choices: [
    { id: "only-next-meeting", label: { fr: "Elle ne renseigne que sur la décision anticipée à cette réunion précise, pas sur l'ensemble du chemin de taux anticipé pour les réunions suivantes", en: "It only informs about the decision expected at that specific meeting, not the entire rate path expected for subsequent meetings" } },
    { id: "reveals-entire-path", label: { fr: "Elle révèle automatiquement l'ensemble du chemin de taux anticipé jusqu'à la fin du cycle de politique monétaire", en: "It automatically reveals the entire rate path expected until the end of the monetary policy cycle" } },
    { id: "irrelevant-info", label: { fr: "Elle ne contient aucune information exploitable pour un trader de taux", en: "It contains no usable information for a rates trader" } },
    { id: "same-as-economist-forecast", label: { fr: "Elle est toujours strictement identique à la prévision médiane des économistes interrogés", en: "It is always strictly identical to the median forecast of surveyed economists" } },
  ],
  correctId: "only-next-meeting",
  hint: { fr: "Une seule probabilité pour une seule réunion ne dit rien, à elle seule, sur les réunions suivantes.", en: "A single probability for a single meeting says nothing, on its own, about subsequent meetings." },
  explanation: {
    fr: "La probabilité implicite calculée pour une réunion donnée ne renseigne que sur cette réunion précise : pour connaître l'ensemble du chemin de taux anticipé par le marché, il faut examiner la courbe complète des instruments de taux courts sur toutes les échéances futures, pas un seul point isolé — une distinction essentielle, car c'est souvent la révision de ce chemin complet qui explique le plus les mouvements de marché.",
    en: "The implied probability computed for a given meeting only informs about that specific meeting: to know the entire rate path the market expects, one must examine the full curve of short-rate instruments across all future horizons, not a single isolated point — an essential distinction, since it is often the revision of this entire path that best explains market moves.",
  },
  commonMistake: {
    fr: "Extrapoler l'ensemble du chemin de taux futur à partir d'une seule probabilité calculée pour une seule réunion.",
    en: "Extrapolating the entire future rate path from a single probability computed for a single meeting.",
  },
});

const probabilityNotCertaintyMistakeTemplate = mcqTemplate({
  id: "m01-anticip-erreur-probabilite-vs-certitude",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  prompt: {
    fr: "Le marché price 85% de probabilité qu'une banque centrale abaisse ses taux lors de sa prochaine réunion. Laquelle de ces conclusions est correcte ?",
    en: "The market prices an 85% probability that a central bank cuts rates at its next meeting. Which of these conclusions is correct?",
  },
  choices: [
    { id: "likely-not-certain", label: { fr: "Une baisse est jugée nettement plus probable qu'un statu quo, mais elle n'est pas certaine : un scénario à 15% reste possible", en: "A cut is judged clearly more likely than a hold, but it is not certain: a 15% scenario remains possible" } },
    { id: "certain-to-happen", label: { fr: "La baisse va nécessairement se produire, 85% étant assimilable à une certitude en pratique", en: "The cut will necessarily happen, 85% being effectively equivalent to certainty" } },
    { id: "guaranteed-not-to-happen", label: { fr: "Cette probabilité de 85% garantit au contraire qu'aucune baisse n'aura lieu", en: "This 85% probability in fact guarantees no cut will occur" } },
    { id: "meaningless-number", label: { fr: "Ce chiffre n'a aucune valeur informative et peut être ignoré sans conséquence", en: "This figure has no informative value and can be ignored with no consequence" } },
  ],
  correctId: "likely-not-certain",
  hint: { fr: "85% laisse un scénario alternatif à 15%, qui reste un scénario possible, pas nul.", en: "85% leaves a 15% alternative scenario, which remains possible, not zero." },
  explanation: {
    fr: "Une probabilité implicite de 85% signifie que le marché juge une baisse nettement plus probable qu'un statu quo, mais elle n'élimine pas le scénario alternatif à 15%, qui reste un résultat possible et parfois réalisé — c'est précisément ce qui explique qu'une décision \"surprise\" (même peu probable a priori) puisse survenir et provoquer un choc de marché important.",
    en: "An 85% implied probability means the market judges a cut clearly more likely than a hold, but it does not eliminate the alternative 15% scenario, which remains a possible — and sometimes realized — outcome: this is precisely why a \"surprise\" decision (even one deemed unlikely beforehand) can occur and trigger a significant market shock.",
  },
  commonMistake: {
    fr: "Traiter une probabilité de marché élevée (mais inférieure à 100%) comme une certitude absolue, en oubliant le scénario alternatif restant.",
    en: "Treating a high (but below 100%) market probability as absolute certainty, forgetting the remaining alternative scenario.",
  },
});

const traderPositioningScenarioTemplate = mcqTemplate({
  id: "m01-anticip-scenario-trader-positionnement",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader de taux court remarque que le marché price seulement 20% de probabilité d'une hausse à la prochaine réunion, alors que ses propres données macroéconomiques (indicateurs d'emploi et d'inflation, voir notion précédente) lui suggèrent une probabilité bien plus élevée. Quelle action est la plus cohérente avec cette analyse ?",
    en: "A short-rate trader notices the market prices only a 20% probability of a hike at the next meeting, while their own macro data (employment and inflation indicators, see previous concept) suggests a much higher probability. Which action is most consistent with this analysis?",
  },
  choices: [
    { id: "position-for-hike", label: { fr: "Se positionner pour profiter d'une révision à la hausse de cette probabilité si les données macro se confirment", en: "Position to profit from an upward revision of this probability if the macro data is confirmed" } },
    { id: "ignore-own-analysis", label: { fr: "Ignorer sa propre analyse macro et se fier uniquement à la probabilité déjà pricée par le marché", en: "Ignore their own macro analysis and rely solely on the probability already priced by the market" } },
    { id: "assume-market-wrong-forever", label: { fr: "Conclure que le marché est structurellement incapable d'intégrer correctement l'information macro", en: "Conclude the market is structurally unable to correctly incorporate macro information" } },
    { id: "wait-for-decision-only", label: { fr: "Ne rien faire avant la décision elle-même, la probabilité pricée aujourd'hui n'ayant aucune utilité pour se positionner", en: "Do nothing before the decision itself, since today's priced probability is of no use for positioning" } },
  ],
  correctId: "position-for-hike",
  hint: { fr: "Un désaccord entre sa propre analyse et le prix de marché est précisément ce qui motive une prise de position en trading de taux.", en: "A disagreement between one's own analysis and the market price is precisely what motivates taking a position in rates trading." },
  explanation: {
    fr: "Repérer un écart entre sa propre analyse fondamentale (ici, des données macro suggérant une probabilité de hausse plus élevée) et la probabilité actuellement intégrée dans les prix de marché est précisément le point de départ d'une prise de position en trading de taux courts : si l'analyse se confirme, la probabilité pricée devrait se réviser à la hausse, ce qui génère un profit sur la position prise en anticipation de cette révision.",
    en: "Spotting a gap between one's own fundamental analysis (here, macro data suggesting a higher hike probability) and the probability currently priced by the market is precisely the starting point for taking a position in short-rate trading: if the analysis is confirmed, the priced probability should be revised upward, generating a profit on the position taken in anticipation of that revision.",
  },
  commonMistake: {
    fr: "Supposer que le prix de marché actuel est toujours la meilleure estimation possible, sans jamais remettre en question la probabilité pricée à la lumière de sa propre analyse.",
    en: "Assuming the current market price is always the best possible estimate, never questioning the priced probability in light of one's own analysis.",
  },
});

const multiMeetingProbabilityScenarioTemplate = mcqTemplate({
  id: "m01-anticip-scenario-plusieurs-reunions",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste veut construire une vue complète du chemin de taux directeurs anticipé par le marché sur les six prochaines réunions, pas seulement la prochaine. Quelle démarche est la plus cohérente ?",
    en: "An analyst wants to build a complete view of the policy rate path the market expects over the next six meetings, not just the next one. What approach is most consistent?",
  },
  choices: [
    { id: "full-curve-each-horizon", label: { fr: "Examiner la courbe complète des instruments de taux courts (futures ou OIS) à chacune des six échéances correspondantes", en: "Examine the full curve of short-rate instruments (futures or OIS) at each of the six corresponding horizons" } },
    { id: "extrapolate-single-point", label: { fr: "Extrapoler simplement la probabilité calculée pour la prochaine réunion aux cinq suivantes", en: "Simply extrapolate the probability computed for the next meeting to the following five" } },
    { id: "ask-central-bank-directly", label: { fr: "Demander directement à la banque centrale sa trajectoire de taux exacte pour les six prochaines réunions", en: "Directly ask the central bank for its exact rate trajectory over the next six meetings" } },
    { id: "single-instrument-suffices", label: { fr: "Un seul instrument, quelle que soit son échéance, suffit à couvrir l'ensemble des six réunions", en: "A single instrument, regardless of its maturity, is enough to cover all six meetings" } },
  ],
  correctId: "full-curve-each-horizon",
  hint: { fr: "Chaque échéance de taux court correspond à une fenêtre d'anticipation différente : il en faut une par réunion étudiée.", en: "Each short-rate maturity corresponds to a different expectation window: one is needed per studied meeting." },
  explanation: {
    fr: "Construire une vue complète du chemin de taux anticipé exige d'examiner un instrument de taux court à CHAQUE échéance correspondant aux réunions étudiées (une méthode proche de celle utilisée par des outils comme le CME FedWatch) : un seul point isolé ou une extrapolation grossière ne peut pas capturer les variations de probabilité d'une réunion à l'autre, et aucune banque centrale ne communique de trajectoire de taux exacte et engageante à l'avance.",
    en: "Building a complete view of the anticipated rate path requires examining a short-rate instrument at EACH horizon corresponding to the studied meetings (a method close to that used by tools like CME FedWatch): a single isolated point or a crude extrapolation cannot capture probability variations from one meeting to the next, and no central bank communicates an exact, binding rate trajectory in advance.",
  },
  commonMistake: {
    fr: "Croire qu'un seul point de la courbe des taux courts suffit à décrire l'ensemble du chemin de taux anticipé sur plusieurs réunions futures.",
    en: "Believing a single point on the short-rate curve is enough to describe the entire rate path expected over several future meetings.",
  },
});

const dataReleaseMovesProbabilityScenarioTemplate = mcqTemplate({
  id: "m01-anticip-scenario-publication-macro",
  conceptId: "m01-anticipations-taux-directeurs",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La veille d'une réunion de banque centrale, une publication d'inflation ressort nettement plus élevée que le consensus (voir notion précédente). Quel est l'effet le plus probable sur la probabilité de hausse de taux pricée par le marché pour cette réunion ?",
    en: "The day before a central bank meeting, an inflation release comes in well above consensus (see previous concept). What is the most likely effect on the market-priced probability of a rate hike at that meeting?",
  },
  choices: [
    { id: "probability-rises", label: { fr: "La probabilité pricée d'une hausse augmente, les prix des instruments de taux courts intégrant immédiatement cette nouvelle information", en: "The priced probability of a hike rises, as short-rate instrument prices immediately incorporate this new information" } },
    { id: "probability-unchanged", label: { fr: "La probabilité pricée reste inchangée jusqu'à la décision elle-même, quelle que soit la publication", en: "The priced probability stays unchanged until the decision itself, regardless of the release" } },
    { id: "probability-falls", label: { fr: "La probabilité pricée d'une hausse baisse mécaniquement après toute publication d'inflation élevée", en: "The priced probability of a hike mechanically falls after any high inflation release" } },
    { id: "only-affects-following-meeting", label: { fr: "Seule la probabilité pricée pour la réunion suivante peut être affectée, jamais celle de la réunion imminente", en: "Only the probability priced for the following meeting can be affected, never that of the imminent meeting" } },
  ],
  correctId: "probability-rises",
  hint: { fr: "Une inflation surprise à la hausse renforce le scénario d'une réponse plus ferme de la banque centrale.", en: "An upside inflation surprise reinforces the case for a firmer central bank response." },
  explanation: {
    fr: "Les prix des instruments de taux courts se mettent à jour en continu à mesure que de nouvelles informations arrivent : une surprise d'inflation à la hausse renforce le scénario d'une réponse plus ferme de la banque centrale, ce qui se traduit immédiatement par une révision à la hausse de la probabilité pricée d'un geste plus restrictif à la réunion imminente — exactement le mécanisme qui relie indicateurs macro et anticipations de taux.",
    en: "Short-rate instrument prices update continuously as new information arrives: an upside inflation surprise reinforces the case for a firmer central bank response, which immediately translates into an upward revision of the priced probability of a more restrictive move at the imminent meeting — exactly the mechanism linking macro indicators and rate expectations.",
  },
  commonMistake: {
    fr: "Croire que les probabilités pricées restent figées entre deux réunions, sans réagir aux nouvelles données macroéconomiques publiées entre-temps.",
    en: "Believing priced probabilities stay frozen between two meetings, without reacting to new macro data published in the meantime.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  decisionImpactComparisonTemplate,
  fedFundsVsOisComparisonTemplate,
  whatIfMatchesExpectationTemplate,
  hawkishHoldWhatIfTemplate,
  impliedProbabilityCalcTemplate,
  futuresPriceCalcTemplate,
  nextMeetingVsFullPathMistakeTemplate,
  probabilityNotCertaintyMistakeTemplate,
  traderPositioningScenarioTemplate,
  multiMeetingProbabilityScenarioTemplate,
  dataReleaseMovesProbabilityScenarioTemplate,
];
