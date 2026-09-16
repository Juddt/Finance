import type { LessonContent } from "@/lib/lesson-types";

export const m13EntretiensCasBrainteasers: LessonContent = {
  conceptId: "m13-entretiens-cas-brainteasers",
  prerequisiteReminder: {
    text: {
      fr: "Il faut avoir préparé les questions techniques et de marché avant d'aborder les études de cas.",
      en: "You need to have prepared technical and market questions before tackling case studies.",
    },
    conceptIds: ["m13-entretiens-techniques"],
  },
  glossary: [
    { term: { fr: "Brainteaser", en: "Brainteaser" }, definition: { fr: "Une énigme logique ou probabiliste posée en entretien, destinée à évaluer le raisonnement structuré sous pression plutôt qu'une connaissance financière spécifique.", en: "A logic or probability puzzle asked in interviews, meant to assess structured reasoning under pressure rather than specific financial knowledge." } },
  ],
  intuition: {
    fr: "Au-delà des questions techniques (M13-entretiens-a), un entretien en finance de marché évalue trois autres dimensions bien distinctes : la MOTIVATION (pourquoi ce métier, pourquoi cette entreprise, de façon crédible et spécifique), le raisonnement appliqué à un CAS CONCRET (souvent sans solution unique évidente), et la capacité à structurer un raisonnement logique sous pression via des BRAINTEASERS, qui ne testent généralement aucune connaissance financière.",
    en: "Beyond technical questions (M13-entretiens-a), a market finance interview assesses three other quite distinct dimensions: MOTIVATION (why this job, why this company, credibly and specifically), reasoning applied to a CONCRETE CASE (often with no single obvious solution), and the ability to structure logical reasoning under pressure via BRAINTEASERS, which generally test no financial knowledge at all.",
  },
  definition: {
    fr: "Une question de motivation efficace évite les généralités (\"j'aime les marchés financiers\") au profit d'éléments spécifiques et vérifiables (un projet concret, une expérience particulière, une compréhension précise du métier visé). Une étude de cas typique en risque, trading, structuration ou quant présente une situation ouverte (\"comment structureriez-vous un produit pour un client cherchant X ?\", en lien direct avec M11) et évalue la méthode de raisonnement, pas uniquement la conclusion finale. Un brainteaser classique (par exemple, un problème de probabilités ou de logique) évalue la capacité à décomposer un problème complexe en étapes simples et à communiquer chaque étape du raisonnement à voix haute.",
    en: "An effective motivation answer avoids generalities (\"I like financial markets\") in favor of specific, verifiable elements (a concrete project, a particular experience, a precise understanding of the targeted role). A typical risk, trading, structuring or quant case study presents an open situation (\"how would you structure a product for a client seeking X?\", directly tied to M11) and assesses the reasoning method, not just the final conclusion. A classic brainteaser (e.g., a probability or logic problem) assesses the ability to break a complex problem into simple steps and communicate each reasoning step aloud.",
  },
  utility: {
    fr: "Ces trois dimensions complètent la préparation technique : un candidat techniquement excellent mais incapable d'articuler une motivation crédible, de raisonner sur un cas ouvert sans solution évidente, ou de structurer sa pensée sous pression logique, échoue fréquemment en entretien malgré ses compétences réelles — la préparation à l'entretien est une compétence distincte de la compétence technique elle-même.",
    en: "These three dimensions complete technical preparation: a technically excellent candidate unable to articulate credible motivation, reason through an open case with no obvious solution, or structure their thinking under logical pressure, frequently fails interviews despite real competence — interview preparation is a skill distinct from technical competence itself.",
  },
  example: {
    fr: "Étude de cas typique de structuration : \"Un client souhaite un rendement de 8% par an, avec une protection du capital à 90%. Comment structureriez-vous ce produit ?\" Une bonne réponse mobilise directement les notions du module M11 : décomposer le produit en une brique obligataire (protection à 90%) et une brique optionnelle (potentiel de gain), tout en reconnaissant explicitement qu'un rendement de 8% avec une protection élevée implique probablement un risque caché (barrière proche, sous-jacent volatil, ou risque de crédit de l'émetteur) — la même vigilance qu'un investisseur doit avoir face à un coupon d'autocall \"trop beau\" (M11-3).",
    en: "A typical structuring case study: \"A client wants an 8% annual return, with 90% capital protection. How would you structure this product?\" A good answer directly mobilizes M11's concepts: decomposing the product into a bond building block (90% protection) and an optional building block (upside potential), while explicitly acknowledging that an 8% return with high protection likely implies a hidden risk (close barrier, volatile underlying, or issuer credit risk) — the same vigilance an investor should have toward a \"too good\" autocall coupon (M11-3).",
  },
  alternativeExplanation: {
    fr: "Un brainteaser est comme un test de conduite sur un parcours d'obstacles inconnu : peu importe que vous n'ayez jamais vu exactement ce parcours auparavant, ce qui compte est votre capacité à rester calme, à avancer méthodiquement obstacle par obstacle, et à corriger votre trajectoire si une première approche échoue — exactement les qualités qu'un desk de trading recherche face à un marché imprévisible.",
    en: "A brainteaser is like a driving test on an unfamiliar obstacle course: it doesn't matter that you've never seen exactly this course before, what matters is your ability to stay calm, methodically advance obstacle by obstacle, and correct your path if a first approach fails — exactly the qualities a trading desk looks for when facing an unpredictable market.",
  },
  formula: {
    latex: "P(\\text{Succès entretien}) \\approx f(\\text{Technique}, \\text{Motivation}, \\text{Raisonnement}, \\text{Communication})",
    variables: [
      { symbol: "\\text{Raisonnement}", description: { fr: "La capacité à décomposer un problème ouvert (cas ou brainteaser) en étapes logiques explicites", en: "The ability to break an open problem (case or brainteaser) into explicit logical steps" } },
      { symbol: "\\text{Communication}", description: { fr: "La clarté avec laquelle chaque étape du raisonnement est partagée à voix haute avec l'intervieweur", en: "The clarity with which each reasoning step is shared aloud with the interviewer" } },
    ],
    assumptions: { fr: "Cadre qualitatif de préparation, pas une formule quantitative rigoureuse.", en: "A qualitative preparation framework, not a rigorous quantitative formula." },
    units: { fr: "Sans dimension.", en: "Dimensionless." },
    example: { fr: "Un candidat qui trouve la bonne réponse à un brainteaser en silence, sans expliquer son raisonnement, transmet moins d'information à l'intervieweur qu'un candidat qui raisonne à voix haute même avec quelques hésitations.", en: "A candidate who finds a brainteaser's right answer silently, without explaining their reasoning, conveys less information to the interviewer than one who reasons aloud even with some hesitation." },
  },
  calculation: {
    fr: "1) Préparer une motivation spécifique et vérifiable pour chaque type de poste visé (risque, trading, structuration, quant), en évitant les formulations génériques interchangeables d'un candidat à l'autre. 2) S'entraîner sur des études de cas ouvertes en explicitant systématiquement la méthode de décomposition du problème, pas seulement la conclusion. 3) Pratiquer des brainteasers classiques (probabilités, logique, estimation) en verbalisant chaque étape du raisonnement, même incertaine. 4) Simuler des conditions de pression (temps limité, questions de suivi inattendues) pour s'habituer à raisonner sous stress.",
    en: "1) Prepare specific, verifiable motivation for each targeted role type (risk, trading, structuring, quant), avoiding generic phrasing interchangeable between candidates. 2) Practice open case studies by systematically making explicit the problem-decomposition method, not just the conclusion. 3) Practice classic brainteasers (probability, logic, estimation) by verbalizing each reasoning step, even when uncertain. 4) Simulate pressure conditions (limited time, unexpected follow-up questions) to get used to reasoning under stress.",
  },
  interpretation: {
    fr: "Pour une étude de cas ouverte, l'absence de \"bonne\" réponse unique signifie que l'intervieweur évalue principalement la structure du raisonnement (identification des enjeux, des risques, des compromis) plutôt que la conclusion elle-même — deux candidats peuvent arriver à des recommandations différentes et être également bien notés si leur raisonnement est également rigoureux. Pour un brainteaser, se tromper n'est généralement pas éliminatoire si la méthode de raisonnement reste solide et bien communiquée.",
    en: "For an open case study, the absence of a single \"right\" answer means the interviewer mainly assesses the reasoning's structure (identifying issues, risks, trade-offs) rather than the conclusion itself — two candidates can reach different recommendations and be equally well rated if their reasoning is equally rigorous. For a brainteaser, being wrong generally isn't disqualifying if the reasoning method remains sound and well communicated.",
  },
  pitfalls: {
    fr: "Répondre à une question de motivation avec des généralités interchangeables (\"j'aime les chiffres et la finance\") plutôt qu'avec des éléments spécifiques et personnels difficiles à copier d'un autre candidat. Autre piège classique face à un brainteaser : se précipiter vers une réponse sans structurer le problème à voix haute, ce qui prive l'intervieweur de toute information sur le raisonnement, même si la réponse finale se révèle correcte par chance.",
    en: "Answering a motivation question with interchangeable generalities (\"I like numbers and finance\") rather than specific, personal elements hard to copy from another candidate. Another classic brainteaser trap: rushing to an answer without structuring the problem aloud, depriving the interviewer of any information about the reasoning, even if the final answer turns out correct by luck.",
  },
  keyPoints: {
    fr: [
      "Une motivation efficace est spécifique et vérifiable, jamais une généralité interchangeable entre candidats.",
      "Une étude de cas évalue la structure du raisonnement, pas une conclusion unique attendue.",
      "Un brainteaser teste la décomposition logique d'un problème et sa communication à voix haute, pas une connaissance financière.",
    ],
    en: [
      "Effective motivation is specific and verifiable, never a generality interchangeable between candidates.",
      "A case study assesses the reasoning's structure, not one expected unique conclusion.",
      "A brainteaser tests a problem's logical decomposition and its verbal communication, not financial knowledge.",
    ],
  },
  advancedDemonstration: {
    fr: "Les études de cas de structuration les plus avancées combinent souvent plusieurs modules déjà vus dans un même exercice : structurer un produit adapté à un scénario de marché spécifique peut nécessiter de mobiliser simultanément la mécanique des autocalls (M11-2), l'impact de la volatilité sur une composante barrière (M10-5), et une réflexion sur le risque de contrepartie côté émetteur (M13-risques-d) — un candidat capable de tisser explicitement ces liens entre modules, plutôt que de traiter chaque notion isolément, démontre une compréhension intégrée nettement plus proche de ce qu'un desk réel exige au quotidien qu'une simple récitation de définitions indépendantes.",
    en: "The most advanced structuring case studies often combine several previously seen modules in a single exercise: structuring a product suited to a specific market scenario can require simultaneously mobilizing autocall mechanics (M11-2), volatility's impact on a barrier component (M10-5), and a reflection on issuer-side counterparty risk (M13-risques-d) — a candidate able to explicitly weave these links between modules, rather than treating each concept in isolation, demonstrates an integrated understanding markedly closer to what a real desk demands daily than a simple recitation of independent definitions.",
  },
};
