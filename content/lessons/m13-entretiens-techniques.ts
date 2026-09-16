import type { LessonContent } from "@/lib/lesson-types";

export const m13EntretiensTechniques: LessonContent = {
  conceptId: "m13-entretiens-techniques",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion suppose une bonne maîtrise transversale des modules précédents (options, Greeks, taux, gestion de portefeuille), qu'elle mobilise sans les réexpliquer.",
      en: "This lesson assumes solid cross-module command of prior material (options, Greeks, rates, portfolio management), which it draws on without re-explaining.",
    },
    conceptIds: ["m05-call-put", "m07-greeks-premier-ordre"],
  },
  glossary: [
    { term: { fr: "Question de marché", en: "Market question" }, definition: { fr: "Une question portant sur l'actualité des marchés financiers (niveaux, tendances, événements macroéconomiques récents), destinée à évaluer la curiosité et la culture générale financière du candidat.", en: "A question about current financial market events (levels, trends, recent macroeconomic events), meant to assess the candidate's curiosity and general financial literacy." } },
  ],
  intuition: {
    fr: "Un entretien technique en finance de marché évalue rarement la mémorisation pure de formules : il cherche surtout à vérifier que le candidat COMPREND ce qu'il utilise, sait raisonner à voix haute quand il ne connaît pas immédiatement la réponse, et suit l'actualité des marchés avec un intérêt réel plutôt que superficiel.",
    en: "A technical interview in market finance rarely evaluates pure formula memorization: it mainly seeks to verify the candidate UNDERSTANDS what they use, can reason aloud when they don't immediately know the answer, and follows market news with genuine rather than superficial interest.",
  },
  definition: {
    fr: "Les questions techniques classiques couvrent typiquement : le pricing et les Greeks d'options vanilles (\"comment le Delta d'un call évolue-t-il quand le sous-jacent approche le strike près de l'échéance ?\", M07-1), les mécanismes de taux et de swaps (\"pourquoi la courbe des taux peut-elle s'inverser ?\", M13-mathfin-b), et des questions de gestion de portefeuille (\"pourquoi diversifier réduit le risque, mais pas jusqu'à zéro ?\", M13-gp-a). Les questions de marché portent sur l'actualité récente : niveaux d'indices, décisions de banques centrales, événements géopolitiques ayant un impact sur les marchés, et la capacité du candidat à expliquer SIMPLEMENT un phénomène de marché complexe.",
    en: "Classic technical questions typically cover: vanilla option pricing and Greeks (\"how does a call's Delta evolve as the underlying approaches the strike near expiry?\", M07-1), rate and swap mechanics (\"why can the yield curve invert?\", M13-mathfin-b), and portfolio management questions (\"why does diversification reduce risk, but not to zero?\", M13-gp-a). Market questions cover recent news: index levels, central bank decisions, geopolitical events impacting markets, and the candidate's ability to SIMPLY explain a complex market phenomenon.",
  },
  utility: {
    fr: "Cette notion sert de récapitulatif transversal et de méthode de préparation, plutôt que d'introduire une théorie nouvelle : elle rappelle comment mobiliser les connaissances acquises dans les modules précédents (M01 à M13) sous la pression d'un entretien, où la clarté d'explication compte souvent plus que l'exhaustivité technique.",
    en: "This lesson serves as a cross-cutting recap and preparation method, rather than introducing new theory: it reminds how to mobilize knowledge acquired in previous modules (M01 to M13) under interview pressure, where clarity of explanation often matters more than technical exhaustiveness.",
  },
  example: {
    fr: "À la question \"pourquoi un call a-t-il un Delta positif et un put un Delta négatif ?\", une bonne réponse ne se contente pas de citer N(d1) (M06-5) : elle explique d'abord l'intuition (un call gagne de la valeur quand le sous-jacent monte, donc sa valeur et le prix du sous-jacent évoluent dans le même sens), puis relie cette intuition à la formule pour montrer une compréhension à deux niveaux — exactement la structure \"intuition puis formule\" utilisée dans les cours de ce site.",
    en: "To the question \"why does a call have a positive Delta and a put a negative one?\", a good answer doesn't just cite N(d1) (M06-5): it first explains the intuition (a call gains value when the underlying rises, so its value and the underlying's price move in the same direction), then connects that intuition to the formula to show understanding at two levels — exactly the \"intuition then formula\" structure used in this site's lessons.",
  },
  alternativeExplanation: {
    fr: "Un entretien technique ressemble à un examen oral de médecine : le jury ne veut pas seulement savoir si vous connaissez le nom d'une maladie, mais si vous comprenez le mécanisme sous-jacent au point de pouvoir l'expliquer à un patient non-spécialiste — la clarté de l'explication est souvent le signal le plus fort de la compréhension réelle, plus que la précision technique du vocabulaire employé.",
    en: "A technical interview resembles a medical oral exam: the panel doesn't just want to know if you know a disease's name, but whether you understand the underlying mechanism well enough to explain it to a non-specialist patient — clarity of explanation is often the strongest signal of real understanding, more than the technical precision of the vocabulary used.",
  },
  formula: {
    latex: "\\text{Qualité de réponse} \\approx \\text{Structure} \\times \\text{Justesse} \\times \\text{Clarté}",
    variables: [
      { symbol: "\\text{Structure}", description: { fr: "Une réponse organisée (intuition → mécanisme → exemple chiffré) plutôt qu'un flux de pensée désorganisé", en: "An organized answer (intuition → mechanism → numerical example) rather than a disorganized stream of thought" } },
      { symbol: "\\text{Clarté}", description: { fr: "La capacité à simplifier sans dénaturer, à l'image de l'explication alternative de chaque leçon de ce site", en: "The ability to simplify without distorting, mirroring each lesson's alternative explanation on this site" } },
    ],
    assumptions: { fr: "Un cadre mnémotechnique, pas une formule mathématique rigoureuse — utile pour structurer sa préparation.", en: "A mnemonic framework, not a rigorous mathematical formula — useful for structuring preparation." },
    units: { fr: "Sans dimension.", en: "Dimensionless." },
    example: { fr: "Une réponse techniquement juste mais mal structurée ou inutilement jargonneuse laisse une impression bien moins forte qu'une réponse structurée et claire, même légèrement moins exhaustive.", en: "A technically correct but poorly structured or needlessly jargon-heavy answer leaves a far weaker impression than a structured, clear answer, even a slightly less exhaustive one." },
  },
  calculation: {
    fr: "1) Réviser systématiquement les notions essentielles de chaque module (niveau \"essential\" du catalogue) avant les notions avancées, car elles reviennent plus fréquemment en entretien. 2) Pour chaque notion clé, s'entraîner à l'expliquer à voix haute en 60 secondes, avec l'intuition avant la formule. 3) Suivre l'actualité des marchés financiers de façon régulière (pas uniquement la veille d'un entretien) pour pouvoir en discuter naturellement. 4) Utiliser les sessions de quiz de ce site (mode révision, M14) pour identifier ses points faibles avant l'entretien.",
    en: "1) Systematically review each module's essential-level concepts before advanced ones, since they come up more frequently in interviews. 2) For each key concept, practice explaining it aloud in 60 seconds, intuition before formula. 3) Follow financial market news regularly (not just the day before an interview) to discuss it naturally. 4) Use this site's quiz sessions (review mode) to identify weak points before the interview.",
  },
  interpretation: {
    fr: "Un candidat qui admet honnêtement ne pas connaître une réponse, puis raisonne à voix haute pour s'en approcher logiquement, fait généralement une meilleure impression qu'un candidat qui bluffe ou reste silencieux. Les questions de marché évaluent surtout la régularité de l'intérêt du candidat pour la finance, un signal difficile à simuler sous pression si cet intérêt n'est pas authentique.",
    en: "A candidate who honestly admits not knowing an answer, then reasons aloud to logically approach it, generally makes a better impression than one who bluffs or stays silent. Market questions mainly assess the regularity of the candidate's interest in finance, a signal hard to fake under pressure if that interest isn't genuine.",
  },
  pitfalls: {
    fr: "Réciter une formule mémorisée sans pouvoir expliquer l'intuition sous-jacente, ce qui se révèle immédiatement si l'intervieweur pose une question de suivi légèrement différente de la question attendue. Autre piège fréquent : ne réviser l'actualité des marchés que juste avant l'entretien, ce qui donne une impression de connaissance superficielle plutôt que d'un intérêt réel et suivi pour les marchés financiers.",
    en: "Reciting a memorized formula without being able to explain the underlying intuition, which immediately shows if the interviewer asks a follow-up question slightly different from the expected one. Another frequent trap: only reviewing market news right before the interview, which gives an impression of superficial knowledge rather than a real, sustained interest in financial markets.",
  },
  keyPoints: {
    fr: [
      "Les questions techniques évaluent la compréhension (intuition + mécanisme), pas la simple mémorisation de formules.",
      "Réviser en priorité les notions essentielles de chaque module, qui reviennent plus fréquemment que les notions avancées.",
      "Suivre l'actualité des marchés régulièrement plutôt qu'à la dernière minute, pour un intérêt qui paraît authentique.",
    ],
    en: [
      "Technical questions assess understanding (intuition + mechanism), not simple formula memorization.",
      "Prioritize reviewing each module's essential concepts, which come up more frequently than advanced ones.",
      "Follow market news regularly rather than last-minute, for an interest that appears genuine.",
    ],
  },
  advancedDemonstration: {
    fr: "Une technique avancée de préparation consiste à s'entraîner spécifiquement sur les questions de \"suivi\" (follow-up) qu'un intervieweur pose après une première bonne réponse, pour tester la profondeur réelle de la compréhension au-delà de la surface : par exemple, après avoir correctement expliqué pourquoi le Delta d'un call est positif, un intervieweur expérimenté enchaînera souvent sur \"et le Gamma, pourquoi est-il maximal près de la monnaie ?\" (M07-2) ou \"comment cela change-t-il pour une option barrière proche de sa barrière ?\" (M10-2) — anticiper ces enchaînements naturels entre notions liées, tels qu'organisés par les rappels de prérequis de ce site, est une préparation nettement plus robuste que réviser chaque notion isolément.",
    en: "An advanced preparation technique is to specifically train on the \"follow-up\" questions an interviewer asks after a first good answer, to test real understanding depth beyond the surface: for example, after correctly explaining why a call's Delta is positive, an experienced interviewer will often follow with \"and Gamma, why is it maximal near the money?\" (M07-2) or \"how does this change for a barrier option near its barrier?\" (M10-2) — anticipating these natural chains between related concepts, as organized by this site's prerequisite reminders, is markedly more robust preparation than reviewing each concept in isolation.",
  },
};
