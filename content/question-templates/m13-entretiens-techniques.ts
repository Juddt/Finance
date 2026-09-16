import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const structureAnswerTemplate: QuestionTemplate = {
  id: "m13-entretiens-tech-structure",
  conceptId: "m13-entretiens-techniques",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quelle structure de réponse est généralement la plus efficace pour une question technique en entretien ?",
      en: "What answer structure is generally most effective for a technical interview question?",
    },
    choices: buildChoices([
      { id: "intuition-first", label: { fr: "Intuition d'abord, puis mécanisme/formule, puis exemple chiffré", en: "Intuition first, then mechanism/formula, then a numerical example" } },
      { id: "formula-only", label: { fr: "Réciter directement la formule mathématique la plus complexe possible", en: "Directly recite the most complex possible mathematical formula" } },
    ]),
    hint: { fr: "La même structure que celle utilisée dans les cours de ce site.", en: "The same structure used in this site's lessons." },
    correctChoiceIds: ["intuition-first"],
    explanation: {
      fr: "Une réponse structurée en \"intuition puis formule\" démontre une compréhension à deux niveaux, plus convaincante qu'une récitation directe de formule sans explication du mécanisme sous-jacent.",
      en: "An answer structured as \"intuition then formula\" demonstrates two-level understanding, more convincing than a direct formula recitation with no explanation of the underlying mechanism.",
    },
    commonMistake: {
      fr: "Croire qu'une réponse plus jargonneuse ou plus mathématiquement complexe est toujours perçue comme meilleure.",
      en: "Believing a more jargon-heavy or mathematically complex answer is always perceived as better.",
    },
  }),
};

const marketQuestionPurposeTemplate: QuestionTemplate = {
  id: "m13-entretiens-tech-question-marche",
  conceptId: "m13-entretiens-techniques",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une question de marché évalue principalement la régularité de l'intérêt du candidat pour la finance, pas seulement sa connaissance de l'actualité de la veille.",
      en: "A market question mainly assesses the regularity of the candidate's interest in finance, not just their knowledge of yesterday's news.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : un candidat qui ne suit l'actualité des marchés que juste avant l'entretien donne une impression de connaissance superficielle, contrairement à un intérêt régulier et authentique qui transparaît naturellement dans les réponses.",
      en: "True: a candidate who only follows market news right before the interview gives an impression of superficial knowledge, unlike a regular, genuine interest that naturally shows through in answers.",
    },
    commonMistake: {
      fr: "Croire qu'une révision de dernière minute de l'actualité des marchés suffit à donner l'impression d'un intérêt authentique.",
      en: "Believing a last-minute review of market news suffices to give the impression of a genuine interest.",
    },
  }),
};

const dontKnowAnswerTemplate: QuestionTemplate = {
  id: "m13-entretiens-tech-ne-sait-pas",
  conceptId: "m13-entretiens-techniques",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un candidat ne connaît pas immédiatement la réponse à une question technique. Quelle est généralement la meilleure attitude ?",
      en: "A candidate doesn't immediately know a technical question's answer. What is generally the best attitude?",
    },
    choices: buildChoices([
      { id: "reason-aloud", label: { fr: "Raisonner à voix haute pour s'approcher logiquement de la réponse", en: "Reason aloud to logically approach the answer" } },
      { id: "bluff", label: { fr: "Bluffer avec assurance une réponse inventée", en: "Confidently bluff a made-up answer" } },
    ]),
    hint: { fr: "L'intervieweur évalue souvent la méthode de raisonnement, pas uniquement la réponse finale.", en: "The interviewer often assesses the reasoning method, not just the final answer." },
    correctChoiceIds: ["reason-aloud"],
    explanation: {
      fr: "Un candidat qui raisonne à voix haute pour s'approcher logiquement d'une réponse, même sans la connaître immédiatement, fait généralement une meilleure impression qu'un candidat qui bluffe ou reste silencieux.",
      en: "A candidate who reasons aloud to logically approach an answer, even without immediately knowing it, generally makes a better impression than one who bluffs or stays silent.",
    },
    commonMistake: {
      fr: "Croire qu'admettre ne pas savoir immédiatement est toujours pénalisant, sans tenter de raisonner malgré tout.",
      en: "Believing admitting not to know immediately is always penalizing, without attempting to reason anyway.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-entretiens-tech-vocab",
  conceptId: "m13-entretiens-techniques",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une question portant sur l'actualité des marchés financiers, destinée à évaluer la curiosité du candidat, est appelée une question de ______.",
      en: "A question about current financial market events, meant to assess the candidate's curiosity, is called a ______ question.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["marche", "marché", "market"],
    hint: { fr: "Le même terme que dans le glossaire de la leçon.", en: "The same term as in the lesson's glossary." },
    explanation: {
      fr: "Une question de marché porte sur l'actualité récente des marchés financiers, destinée à évaluer la curiosité et la culture générale financière du candidat.",
      en: "A market question covers recent financial market news, meant to assess the candidate's curiosity and general financial literacy.",
    },
    commonMistake: {
      fr: "Confondre ce type de question avec une question technique portant sur un modèle ou une formule précise.",
      en: "Confusing this question type with a technical question about a specific model or formula.",
    },
  }),
};

export const templates: QuestionTemplate[] = [structureAnswerTemplate, marketQuestionPurposeTemplate, dontKnowAnswerTemplate, vocabTemplate];
