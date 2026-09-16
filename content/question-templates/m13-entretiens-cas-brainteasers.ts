import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const motivationQualityTemplate: QuestionTemplate = {
  id: "m13-entretiens-cas-motivation",
  conceptId: "m13-entretiens-cas-brainteasers",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Quelle réponse de motivation est généralement la plus convaincante en entretien ?",
      en: "Which motivation answer is generally most convincing in an interview?",
    },
    choices: buildChoices([
      { id: "specific", label: { fr: "Des éléments spécifiques et vérifiables (projet concret, expérience particulière)", en: "Specific, verifiable elements (a concrete project, a particular experience)" } },
      { id: "generic", label: { fr: "Une formule générale comme \"j'aime les marchés financiers\"", en: "A general formula like \"I like financial markets\"" } },
    ]),
    hint: { fr: "Une bonne motivation est difficile à copier d'un candidat à l'autre.", en: "Good motivation is hard to copy from one candidate to another." },
    correctChoiceIds: ["specific"],
    explanation: {
      fr: "Une motivation efficace évite les généralités interchangeables au profit d'éléments spécifiques et vérifiables, difficiles à copier d'un candidat à l'autre.",
      en: "Effective motivation avoids interchangeable generalities in favor of specific, verifiable elements, hard to copy from one candidate to another.",
    },
    commonMistake: {
      fr: "Croire qu'une formule générale et consensuelle est suffisante pour convaincre un intervieweur expérimenté.",
      en: "Believing a general, consensual formula suffices to convince an experienced interviewer.",
    },
  }),
};

const caseStudyEvaluationTemplate: QuestionTemplate = {
  id: "m13-entretiens-cas-evaluation",
  conceptId: "m13-entretiens-cas-brainteasers",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pour une étude de cas ouverte, deux candidats arrivant à des recommandations différentes peuvent être également bien notés si leur raisonnement est également rigoureux.",
      en: "For an open case study, two candidates reaching different recommendations can be equally well rated if their reasoning is equally rigorous.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : pour une étude de cas sans solution unique évidente, l'intervieweur évalue principalement la structure du raisonnement (enjeux, risques, compromis identifiés), pas la conclusion elle-même.",
      en: "True: for a case study with no single obvious solution, the interviewer mainly assesses the reasoning's structure (identified issues, risks, trade-offs), not the conclusion itself.",
    },
    commonMistake: {
      fr: "Croire qu'il existe toujours une seule bonne réponse attendue à une étude de cas ouverte.",
      en: "Believing there's always a single expected right answer to an open case study.",
    },
  }),
};

const brainteaserPurposeTemplate: QuestionTemplate = {
  id: "m13-entretiens-cas-brainteaser-objectif",
  conceptId: "m13-entretiens-cas-brainteasers",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Que teste principalement un brainteaser en entretien ?",
      en: "What does a brainteaser mainly test in an interview?",
    },
    choices: buildChoices([
      { id: "reasoning", label: { fr: "Le raisonnement structuré sous pression, pas une connaissance financière spécifique", en: "Structured reasoning under pressure, not specific financial knowledge" } },
      { id: "finance-knowledge", label: { fr: "Une connaissance financière technique précise", en: "Precise technical financial knowledge" } },
    ]),
    hint: { fr: "Un brainteaser est généralement une énigme logique ou probabiliste.", en: "A brainteaser is generally a logic or probability puzzle." },
    correctChoiceIds: ["reasoning"],
    explanation: {
      fr: "Un brainteaser évalue la capacité à décomposer un problème complexe en étapes simples et à communiquer chaque étape à voix haute, généralement sans tester de connaissance financière spécifique.",
      en: "A brainteaser assesses the ability to break a complex problem into simple steps and communicate each step aloud, generally without testing specific financial knowledge.",
    },
    commonMistake: {
      fr: "Croire qu'un brainteaser nécessite des connaissances financières techniques avancées pour être résolu.",
      en: "Believing a brainteaser requires advanced technical financial knowledge to be solved.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-entretiens-cas-vocab",
  conceptId: "m13-entretiens-cas-brainteasers",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une énigme logique ou probabiliste posée en entretien pour évaluer le raisonnement sous pression s'appelle un ______.",
      en: "A logic or probability puzzle asked in an interview to assess reasoning under pressure is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["brainteaser"],
    hint: { fr: "Le même mot que dans le glossaire de la leçon.", en: "The same word as in the lesson's glossary." },
    explanation: {
      fr: "Un brainteaser est une énigme logique ou probabiliste destinée à évaluer le raisonnement structuré sous pression plutôt qu'une connaissance financière spécifique.",
      en: "A brainteaser is a logic or probability puzzle meant to assess structured reasoning under pressure rather than specific financial knowledge.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec une étude de cas, qui porte généralement sur une situation financière concrète plutôt qu'une énigme abstraite.",
      en: "Confusing this term with a case study, which generally concerns a concrete financial situation rather than an abstract puzzle.",
    },
  }),
};

export const templates: QuestionTemplate[] = [motivationQualityTemplate, caseStudyEvaluationTemplate, brainteaserPurposeTemplate, vocabTemplate];
