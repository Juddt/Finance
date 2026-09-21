import { mcqTemplate } from "@/lib/question-template-kit";
import type { QuestionTemplate } from "@/lib/question-templates";

const motivationQualityTemplate: QuestionTemplate = mcqTemplate({
  id: "m13-entretiens-cas-motivation",
  conceptId: "m13-entretiens-cas-brainteasers",
  difficulty: "easy",
  prompt: {
    fr: "Quelle réponse de motivation est généralement la plus convaincante en entretien ?",
    en: "Which motivation answer is generally most convincing in an interview?",
  },
  choices: [
    {
      id: "specific",
      label: {
        fr: "Des éléments spécifiques et vérifiables, comme un projet concret ou une expérience particulière",
        en: "Specific, verifiable elements, such as a concrete project or a particular experience",
      },
    },
    {
      id: "generic",
      label: {
        fr: "Une formule générale et consensuelle, comme « j'aime les marchés financiers »",
        en: "A general, consensual formula, like “I like financial markets”",
      },
    },
    {
      id: "flattery",
      label: {
        fr: "Une comparaison flatteuse avec l'intervieweur, sans lien avec son propre parcours",
        en: "A flattering comparison with the interviewer, unrelated to one's own background",
      },
    },
    {
      id: "list",
      label: {
        fr: "Une longue liste de qualités personnelles, sans exemple concret pour les illustrer",
        en: "A long list of personal qualities, with no concrete example to back them up",
      },
    },
  ],
  correctId: "specific",
  hint: { fr: "Une bonne motivation est difficile à copier d'un candidat à l'autre.", en: "Good motivation is hard to copy from one candidate to another." },
  explanation: {
    fr: "Une motivation efficace évite les généralités interchangeables au profit d'éléments spécifiques et vérifiables, difficiles à copier d'un candidat à l'autre.",
    en: "Effective motivation avoids interchangeable generalities in favor of specific, verifiable elements, hard to copy from one candidate to another.",
  },
  commonMistake: {
    fr: "Croire qu'une formule générale, une flatterie ou une liste de qualités non illustrée suffit à convaincre un intervieweur expérimenté.",
    en: "Believing a general formula, flattery, or an unillustrated list of qualities is enough to convince an experienced interviewer.",
  },
  distractorRationale: {
    generic: {
      fr: "Une formule consensuelle est interchangeable d'un candidat à l'autre et ne prouve rien de personnel.",
      en: "A consensual formula is interchangeable from one candidate to another and proves nothing personal.",
    },
    flattery: {
      fr: "Complimenter l'intervieweur ou la banque ne dit rien des compétences ou de la motivation réelle du candidat.",
      en: "Complimenting the interviewer or the bank says nothing about the candidate's actual skills or motivation.",
    },
    list: {
      fr: "Des qualités énoncées sans preuve concrète sont difficiles à croire et vite oubliées.",
      en: "Qualities stated without concrete proof are hard to believe and quickly forgotten.",
    },
  },
});

const caseStudyEvaluationTemplate: QuestionTemplate = mcqTemplate({
  id: "m13-entretiens-cas-evaluation",
  conceptId: "m13-entretiens-cas-brainteasers",
  difficulty: "medium",
  prompt: {
    fr: "Dans une étude de cas ouverte sans solution unique, qu'est-ce qui détermine surtout la note d'un candidat ?",
    en: "In an open case study with no single right answer, what mainly determines a candidate's grade?",
  },
  choices: [
    {
      id: "reasoning",
      label: {
        fr: "La rigueur et la structure de son raisonnement (enjeux, risques, compromis identifiés)",
        en: "The rigor and structure of their reasoning (identified issues, risks, trade-offs)",
      },
    },
    {
      id: "match-interviewer",
      label: {
        fr: "La recommandation finale retenue, qui doit correspondre à celle de l'intervieweur",
        en: "The final recommendation chosen, which must match the interviewer's own view",
      },
    },
    {
      id: "speed",
      label: {
        fr: "La rapidité avec laquelle il annonce une conclusion, avant de structurer son analyse",
        en: "How quickly they announce a conclusion, before structuring their analysis",
      },
    },
    {
      id: "figures",
      label: {
        fr: "Le nombre de chiffres précis cités, même sans lien direct avec la décision",
        en: "The number of precise figures cited, even without a clear link to the decision",
      },
    },
  ],
  correctId: "reasoning",
  explanation: {
    fr: "Pour une étude de cas sans solution unique évidente, l'intervieweur évalue principalement la structure du raisonnement (enjeux, risques, compromis identifiés), pas la conclusion elle-même : deux candidats aux recommandations différentes peuvent donc être également bien notés.",
    en: "For a case study with no single obvious solution, the interviewer mainly assesses the reasoning's structure (identified issues, risks, trade-offs), not the conclusion itself: two candidates reaching different recommendations can therefore be equally well rated.",
  },
  commonMistake: {
    fr: "Croire qu'il existe toujours une seule bonne réponse attendue à une étude de cas ouverte.",
    en: "Believing there's always a single expected right answer to an open case study.",
  },
  distractorRationale: {
    "match-interviewer": {
      fr: "Il n'existe généralement pas de recommandation « attendue » unique pour une étude de cas ouverte ; deux conclusions différentes peuvent être également valables.",
      en: "There is usually no single \"expected\" recommendation for an open case study; two different conclusions can be equally valid.",
    },
    speed: {
      fr: "Annoncer une conclusion trop vite, sans expliciter le raisonnement, empêche justement l'intervieweur d'observer ce qu'il cherche à évaluer.",
      en: "Announcing a conclusion too fast, without explaining the reasoning, prevents the interviewer from observing exactly what they are looking for.",
    },
    figures: {
      fr: "Citer des chiffres précis sans les relier à la décision ne remplace pas un raisonnement structuré.",
      en: "Citing precise figures without connecting them to the decision does not replace structured reasoning.",
    },
  },
});

const brainteaserPurposeTemplate: QuestionTemplate = mcqTemplate({
  id: "m13-entretiens-cas-brainteaser-objectif",
  conceptId: "m13-entretiens-cas-brainteasers",
  difficulty: "medium",
  prompt: {
    fr: "Que teste principalement un brainteaser en entretien ?",
    en: "What does a brainteaser mainly test in an interview?",
  },
  choices: [
    {
      id: "reasoning",
      label: {
        fr: "Le raisonnement structuré sous pression, plutôt qu'une connaissance financière spécifique",
        en: "Structured reasoning under pressure, rather than specific financial knowledge",
      },
    },
    {
      id: "finance-knowledge",
      label: {
        fr: "Une connaissance financière technique précise, plutôt qu'un raisonnement général",
        en: "Precise technical financial knowledge, rather than general reasoning",
      },
    },
    {
      id: "speed",
      label: {
        fr: "La rapidité de calcul mental, plutôt que la méthode utilisée pour y arriver",
        en: "Mental calculation speed, rather than the method used to get there",
      },
    },
    {
      id: "guess",
      label: {
        fr: "La capacité à deviner la bonne réponse numérique dès la première tentative",
        en: "The ability to guess the correct numeric answer on the first try",
      },
    },
  ],
  correctId: "reasoning",
  hint: { fr: "Un brainteaser est généralement une énigme logique ou probabiliste.", en: "A brainteaser is generally a logic or probability puzzle." },
  explanation: {
    fr: "Un brainteaser évalue la capacité à décomposer un problème complexe en étapes simples et à communiquer chaque étape à voix haute, généralement sans tester de connaissance financière spécifique.",
    en: "A brainteaser assesses the ability to break a complex problem into simple steps and communicate each step aloud, generally without testing specific financial knowledge.",
  },
  commonMistake: {
    fr: "Croire qu'un brainteaser récompense la vitesse ou une réponse devinée, plutôt qu'un raisonnement explicité étape par étape.",
    en: "Believing a brainteaser rewards speed or a guessed answer, rather than reasoning explained step by step.",
  },
  distractorRationale: {
    "finance-knowledge": {
      fr: "Un brainteaser est généralement une énigme logique ou probabiliste, résolvable sans connaissance financière technique avancée.",
      en: "A brainteaser is generally a logic or probability puzzle, solvable without advanced technical financial knowledge.",
    },
    speed: {
      fr: "La vitesse de calcul compte moins que la clarté de la méthode : l'intervieweur veut suivre le raisonnement, pas seulement le résultat.",
      en: "Calculation speed matters less than clarity of method: the interviewer wants to follow the reasoning, not just the result.",
    },
    guess: {
      fr: "L'intervieweur évalue la démarche pas à pas, pas la capacité à deviner un nombre juste dès le premier essai.",
      en: "The interviewer assesses the step-by-step approach, not the ability to guess a correct number on the first try.",
    },
  },
});

const vocabTemplate: QuestionTemplate = mcqTemplate({
  id: "m13-entretiens-cas-vocab",
  conceptId: "m13-entretiens-cas-brainteasers",
  difficulty: "medium",
  prompt: {
    fr: "Comment appelle-t-on une énigme logique ou probabiliste posée en entretien pour évaluer le raisonnement sous pression ?",
    en: "What is a logic or probability puzzle asked in an interview to assess reasoning under pressure called?",
  },
  choices: [
    { id: "brainteaser", label: { fr: "Un brainteaser", en: "A brainteaser" } },
    { id: "case-study", label: { fr: "Une étude de cas", en: "A case study" } },
    { id: "psychometric", label: { fr: "Un test psychométrique", en: "A psychometric test" } },
    { id: "behavioral", label: { fr: "Un entretien comportemental", en: "A behavioral interview" } },
  ],
  correctId: "brainteaser",
  hint: { fr: "Le même mot que dans le glossaire de la leçon.", en: "The same word as in the lesson's glossary." },
  explanation: {
    fr: "Un brainteaser est une énigme logique ou probabiliste destinée à évaluer le raisonnement structuré sous pression plutôt qu'une connaissance financière spécifique.",
    en: "A brainteaser is a logic or probability puzzle meant to assess structured reasoning under pressure rather than specific financial knowledge.",
  },
  commonMistake: {
    fr: "Confondre ce terme avec une étude de cas, un test psychométrique ou un entretien comportemental.",
    en: "Confusing this term with a case study, a psychometric test, or a behavioral interview.",
  },
  distractorRationale: {
    "case-study": {
      fr: "Une étude de cas porte généralement sur une situation financière concrète à analyser, pas sur une énigme abstraite de logique.",
      en: "A case study is generally about a concrete financial situation to analyze, not an abstract logic puzzle.",
    },
    psychometric: {
      fr: "Un test psychométrique mesure des traits de personnalité standardisés, pas un raisonnement ponctuel sous pression.",
      en: "A psychometric test measures standardized personality traits, not one-off reasoning under pressure.",
    },
    behavioral: {
      fr: "Un entretien comportemental porte sur des expériences passées du candidat (« parlez-moi d'une fois où... »), pas sur une énigme à résoudre en direct.",
      en: "A behavioral interview is about the candidate's past experiences (\"tell me about a time when...\"), not a live puzzle to solve.",
    },
  },
});

export const templates: QuestionTemplate[] = [motivationQualityTemplate, caseStudyEvaluationTemplate, brainteaserPurposeTemplate, vocabTemplate];
