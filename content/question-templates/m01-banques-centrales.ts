import { pick, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const taylorRuleNumericTemplate: QuestionTemplate = {
  id: "m01-bc-taylor-calcul",
  conceptId: "m01-banques-centrales",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const rStar = randomFloat(rng, 0.5, 2, 1);
    const targetInflation = 2;
    const inflation = randomFloat(rng, 0.5, 5, 1);
    const outputGap = randomFloat(rng, -2, 2, 1);
    const i = Math.round((rStar + inflation + 0.5 * (inflation - targetInflation) + 0.5 * outputGap) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Règle de Taylor : r* = ${fmt(rStar, "fr", 1)}%, inflation observée = ${fmt(inflation, "fr", 1)}%, cible = 2%, écart de production = ${fmt(outputGap, "fr", 1)}%. Quel taux directeur suggère la règle, en % ?`,
        en: `Taylor rule: r* = ${fmt(rStar, "en", 1)}%, observed inflation = ${fmt(inflation, "en", 1)}%, target = 2%, output gap = ${fmt(outputGap, "en", 1)}%. What policy rate does the rule suggest, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.2",
      hint: { fr: "i = r* + π + 0,5(π−π*) + 0,5(y−y*).", en: "i = r* + π + 0.5(π−π*) + 0.5(y−y*)." },
      numeric: { value: i, tolerance: 0.2 },
      calculation: {
        fr: `i = ${fmt(rStar, "fr", 1)} + ${fmt(inflation, "fr", 1)} + 0,5×(${fmt(inflation, "fr", 1)}−2) + 0,5×${fmt(outputGap, "fr", 1)} ≈ ${fmt(i, "fr")}%.`,
        en: `i = ${fmt(rStar, "en", 1)} + ${fmt(inflation, "en", 1)} + 0.5×(${fmt(inflation, "en", 1)}−2) + 0.5×${fmt(outputGap, "en", 1)} ≈ ${fmt(i, "en")}%.`,
      },
      explanation: {
        fr: "La règle de Taylor combine le taux réel naturel, l'inflation observée et deux termes de correction pondérés à 0,5 chacun.",
        en: "The Taylor rule combines the natural real rate, observed inflation and two correction terms each weighted at 0.5.",
      },
      commonMistake: {
        fr: "Oublier le facteur 0,5 devant chacun des deux termes d'écart, ou omettre d'ajouter l'inflation observée elle-même (pas seulement son écart à la cible).",
        en: "Forgetting the 0.5 factor in front of each gap term, or omitting to add observed inflation itself (not just its gap to target).",
      },
    };
  },
};

const mandateTemplate: QuestionTemplate = {
  id: "m01-bc-mandat",
  conceptId: "m01-banques-centrales",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const bank = pick(rng, ["fed", "ecb"] as const);
    return {
      prompt: {
        fr: `Quel mandat légal décrit le mieux la ${bank === "fed" ? "FED" : "BCE"} ?`,
        en: `Which legal mandate best describes the ${bank === "fed" ? "FED" : "ECB"}?`,
      },
      choices: buildChoices([
        { id: "dual", label: { fr: "Double mandat : stabilité des prix ET plein emploi", en: "Dual mandate: price stability AND maximum employment" } },
        { id: "single", label: { fr: "Mandat principal unique : stabilité des prix", en: "Single primary mandate: price stability" } },
      ]),
      hint: { fr: "L'une des deux banques centrales a un objectif d'emploi légalement au même niveau que l'inflation.", en: "One of the two central banks has an employment objective legally on par with inflation." },
      correctChoiceIds: [bank === "fed" ? "dual" : "single"],
      explanation:
        bank === "fed"
          ? { fr: "La FED a un double mandat légal (Federal Reserve Act) : stabilité des prix et plein emploi, sur un pied d'égalité.", en: "The FED has a dual legal mandate (Federal Reserve Act): price stability and maximum employment, on equal footing." }
          : { fr: "La BCE a un mandat principal unique (stabilité des prix), l'emploi n'étant qu'un objectif secondaire, subordonné au premier.", en: "The ECB has a single primary mandate (price stability), with employment only a secondary goal, subordinate to the first." },
      commonMistake: {
        fr: "Inverser les mandats des deux institutions, une confusion fréquente.",
        en: "Swapping the two institutions' mandates, a frequent confusion.",
      },
    };
  },
};

const mechanicalRuleTemplate: QuestionTemplate = {
  id: "m01-bc-regle-mecanique",
  conceptId: "m01-banques-centrales",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La règle de Taylor est une formule que la FED et la BCE appliquent mécaniquement pour fixer leur taux directeur à chaque réunion.",
      en: "The Taylor rule is a formula that the FED and ECB mechanically apply to set their policy rate at every meeting.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : c'est une heuristique descriptive et un repère de lecture a posteriori, pas une règle mécanique suivie à la lettre — les décisions réelles intègrent bien d'autres facteurs et jugements qualitatifs.",
      en: "False: it is a descriptive heuristic and a retrospective reading benchmark, not a mechanical rule followed literally — real decisions incorporate many other factors and qualitative judgment.",
    },
    commonMistake: {
      fr: "Croire que la politique monétaire se réduit à une formule mathématique unique et automatique.",
      en: "Believing monetary policy reduces to a single, automatic mathematical formula.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-bc-vocab",
  conceptId: "m01-banques-centrales",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le taux d'intérêt fixé par une banque centrale, qui influence l'ensemble des taux de l'économie, s'appelle le taux ______.",
      en: "The interest rate set by a central bank, which influences the whole economy's rates, is called the ______ rate.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["directeur", "policy"],
    hint: { fr: "Le taux \"qui dirige\" tous les autres.", en: "The rate that \"steers\" all others." },
    explanation: {
      fr: "Le taux directeur (policy rate) est le principal outil d'une banque centrale pour piloter les conditions monétaires de l'économie.",
      en: "The policy rate is a central bank's main tool for steering the economy's monetary conditions.",
    },
    commonMistake: {
      fr: "Confondre le taux directeur avec un taux de marché comme l'EURIBOR, qui en découle mais n'est pas fixé directement par la banque centrale.",
      en: "Confusing the policy rate with a market rate like EURIBOR, which derives from it but isn't directly set by the central bank.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-bc-comprehension-utilite",
  conceptId: "m01-banques-centrales",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert concrètement de connaître le mandat légal d'une banque centrale, au-delà de la théorie ?",
    en: "What is the concrete use of knowing a central bank's legal mandate, beyond theory?",
  },
  choices: [
    { id: "anticipate", label: { fr: "Anticiper sa réaction probable face à une donnée économique, et pourquoi FED et BCE peuvent diverger sur un même choc", en: "Anticipating its likely reaction to economic data, and why the FED and ECB can diverge on the same shock" } },
    { id: "trivia", label: { fr: "Une simple curiosité institutionnelle sans conséquence pratique sur les marchés", en: "A simple institutional trivia with no practical market consequence" } },
  ],
  correctId: "anticipate",
  hint: { fr: "Le mandat détermine littéralement ce que la banque centrale cherche à optimiser.", en: "The mandate literally determines what the central bank is trying to optimize." },
  explanation: {
    fr: "Le mandat n'est pas un détail juridique abstrait : il détermine directement quels indicateurs économiques pèsent le plus dans la décision de taux, donc la réaction probable de la banque centrale à une nouvelle donnée.",
    en: "The mandate isn't an abstract legal detail: it directly determines which economic indicators weigh most in the rate decision, and so the central bank's likely reaction to new data.",
  },
  commonMistake: {
    fr: "Traiter le mandat comme un détail institutionnel sans impact concret sur les décisions de marché.",
    en: "Treating the mandate as an institutional detail with no concrete market impact.",
  },
});

const toolsComparisonTemplate = mcqTemplate({
  id: "m01-bc-comparaison-outils-crise",
  conceptId: "m01-banques-centrales",
  difficulty: "medium",
  prompt: {
    fr: "En période de crise, quel point commun partagent la FED et la BCE malgré leurs mandats différents ?",
    en: "During a crisis, what common point do the FED and ECB share despite their different mandates?",
  },
  choices: [
    { id: "unconventional", label: { fr: "Les deux recourent à des outils non conventionnels (assouplissement quantitatif, forward guidance) quand le taux directeur seul ne suffit plus", en: "Both resort to unconventional tools (quantitative easing, forward guidance) when the policy rate alone is no longer enough" } },
    { id: "identical-mandate", label: { fr: "Les deux adoptent alors temporairement un mandat identique, fusionné en cas de crise", en: "Both then temporarily adopt an identical, merged mandate during a crisis" } },
  ],
  correctId: "unconventional",
  hint: { fr: "Le mandat ne change jamais ; ce sont les outils disponibles qui s'élargissent.", en: "The mandate never changes; it's the available toolkit that widens." },
  explanation: {
    fr: "Le mandat légal reste distinct et permanent, mais les deux institutions partagent le même arsenal d'outils non conventionnels quand le taux directeur atteint ses limites.",
    en: "The legal mandate stays distinct and permanent, but both institutions share the same unconventional toolkit when the policy rate reaches its limits.",
  },
  commonMistake: {
    fr: "Croire qu'une crise change le mandat légal d'une banque centrale, alors que seuls ses outils s'adaptent.",
    en: "Believing a crisis changes a central bank's legal mandate, when only its tools adapt.",
  },
});

const whatIfUnemploymentTemplate = trueFalseTemplate({
  id: "m01-bc-whatif-chomage-inflation-cible",
  conceptId: "m01-banques-centrales",
  difficulty: "medium",
  isScenario: true,
  statement: {
    fr: "Si le chômage augmente fortement alors que l'inflation reste exactement à sa cible, la BCE a légalement la même latitude que la FED pour baisser ses taux au nom du plein emploi.",
    en: "If unemployment rises sharply while inflation stays exactly at target, the ECB has legally the same latitude as the FED to cut rates in the name of full employment.",
  },
  correct: false,
  explanation: {
    fr: "Faux : la BCE peut baisser ses taux dans ce cas, mais son mandat ne lui donne pas la même légitimité légale directe sur l'emploi que le double mandat de la FED — l'emploi n'y reste qu'un objectif secondaire.",
    en: "False: the ECB can cut rates in this case, but its mandate doesn't give it the same direct legal legitimacy on employment as the FED's dual mandate — employment remains only a secondary goal for it.",
  },
  commonMistake: {
    fr: "Croire que les deux banques centrales ont exactement la même base légale pour agir sur l'emploi, simplement parce que les deux PEUVENT baisser leurs taux.",
    en: "Believing both central banks have exactly the same legal basis to act on employment, simply because both CAN cut rates.",
  },
});

const whatIfNaturalRateTemplate = mcqTemplate({
  id: "m01-bc-whatif-taux-naturel",
  conceptId: "m01-banques-centrales",
  difficulty: "medium",
  prompt: {
    fr: "Selon la règle de Taylor, si le taux réel naturel r* augmente alors que tout le reste (inflation, écart de production) reste inchangé, que devient le taux directeur suggéré ?",
    en: "Per the Taylor rule, if the natural real rate r* rises while everything else (inflation, output gap) stays unchanged, what happens to the suggested policy rate?",
  },
  choices: [
    { id: "up", label: { fr: "Il augmente d'autant, car r* entre directement et intégralement dans la somme", en: "It rises by the same amount, since r* enters the sum directly and fully" } },
    { id: "unchanged", label: { fr: "Il reste inchangé, car r* n'influence que les termes d'écart, pas le niveau final", en: "It stays unchanged, since r* only influences the gap terms, not the final level" } },
  ],
  correctId: "up",
  hint: { fr: "Regardez comment r* apparaît dans la formule i = r* + π + 0,5(π−π*) + 0,5(y−y*).", en: "Look at how r* appears in the formula i = r* + π + 0.5(π−π*) + 0.5(y−y*)." },
  explanation: {
    fr: "r* entre dans la formule sans aucune pondération (coefficient 1) : toute variation de r* se répercute intégralement, point pour point, sur le taux directeur suggéré.",
    en: "r* enters the formula with no weighting (coefficient 1): any change in r* fully carries through, point for point, to the suggested policy rate.",
  },
  commonMistake: {
    fr: "Croire que r* est pondéré par 0,5 comme les termes d'écart, alors qu'il entre avec un poids de 1.",
    en: "Believing r* is weighted by 0.5 like the gap terms, when it enters with a weight of 1.",
  },
});

const outputGapReverseNumericTemplate: QuestionTemplate = {
  id: "m01-bc-taylor-ecart-production-calcul",
  conceptId: "m01-banques-centrales",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const rStar = randomFloat(rng, 0.5, 2, 1);
    const inflation = randomFloat(rng, 1, 4, 1);
    const targetInflation = 2;
    const suggestedRate = randomFloat(rng, rStar + inflation, rStar + inflation + 3, 1);
    const outputGap = Math.round(((suggestedRate - rStar - inflation - 0.5 * (inflation - targetInflation)) / 0.5) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Règle de Taylor : r* = ${fmt(rStar, "fr", 1)}%, inflation = ${fmt(inflation, "fr", 1)}%, cible = 2%. Le taux directeur suggéré est de ${fmt(suggestedRate, "fr", 1)}%. Quel écart de production (y−y*) cela implique-t-il, en % ?`,
        en: `Taylor rule: r* = ${fmt(rStar, "en", 1)}%, inflation = ${fmt(inflation, "en", 1)}%, target = 2%. The suggested policy rate is ${fmt(suggestedRate, "en", 1)}%. What output gap (y−y*) does this imply, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.3",
      hint: { fr: "Isolez le terme 0,5(y−y*) dans i = r* + π + 0,5(π−π*) + 0,5(y−y*), puis divisez par 0,5.", en: "Isolate the 0.5(y−y*) term in i = r* + π + 0.5(π−π*) + 0.5(y−y*), then divide by 0.5." },
      numeric: { value: outputGap, tolerance: 0.3 },
      calculation: {
        fr: `0,5(y−y*) = ${fmt(suggestedRate, "fr", 1)} − ${fmt(rStar, "fr", 1)} − ${fmt(inflation, "fr", 1)} − 0,5×(${fmt(inflation, "fr", 1)}−2), donc y−y* ≈ ${fmt(outputGap, "fr")}%.`,
        en: `0.5(y−y*) = ${fmt(suggestedRate, "en", 1)} − ${fmt(rStar, "en", 1)} − ${fmt(inflation, "en", 1)} − 0.5×(${fmt(inflation, "en", 1)}−2), so y−y* ≈ ${fmt(outputGap, "en")}%.`,
      },
      explanation: {
        fr: "Il faut ici inverser la règle de Taylor : partir du taux suggéré pour retrouver l'écart de production implicite, plutôt que de calculer le taux à partir de l'écart.",
        en: "Here the Taylor rule must be inverted: start from the suggested rate to recover the implicit output gap, rather than computing the rate from the gap.",
      },
      commonMistake: {
        fr: "Oublier de diviser par 0,5 à la fin, ou oublier de soustraire d'abord le terme d'écart d'inflation.",
        en: "Forgetting to divide by 0.5 at the end, or forgetting to first subtract the inflation gap term.",
      },
    };
  },
};

const legalBasisErrorTemplate = mcqTemplate({
  id: "m01-bc-erreur-base-legale",
  conceptId: "m01-banques-centrales",
  difficulty: "medium",
  prompt: {
    fr: "Un commentateur affirme : « La BCE ignore complètement l'emploi, seule l'inflation compte pour elle. » Où est l'erreur dans cette affirmation ?",
    en: "A commentator claims: \"The ECB completely ignores employment, only inflation matters to it.\" What is wrong with this statement?",
  },
  choices: [
    { id: "secondary", label: { fr: "L'emploi reste un objectif secondaire légitime pour la BCE, seulement subordonné à la stabilité des prix, pas totalement ignoré", en: "Employment remains a legitimate secondary goal for the ECB, only subordinate to price stability, not entirely ignored" } },
    { id: "correct-as-is", label: { fr: "Aucune erreur, l'affirmation est exacte et complète", en: "No error, the statement is accurate and complete" } },
  ],
  correctId: "secondary",
  hint: { fr: "« Objectif secondaire » n'est pas la même chose qu'« objectif inexistant ».", en: "\"Secondary goal\" is not the same as \"nonexistent goal\"." },
  explanation: {
    fr: "Le mandat de la BCE subordonne l'emploi à la stabilité des prix, mais ne l'exclut pas : c'est un objectif secondaire légitime \"sans préjudice\" du premier, pas une préoccupation totalement absente.",
    en: "The ECB's mandate subordinates employment to price stability, but doesn't exclude it: it's a legitimate secondary goal \"without prejudice\" to the first, not a totally absent concern.",
  },
  commonMistake: {
    fr: "Simplifier à l'excès un mandat hiérarchisé (principal + secondaire) en un mandat qui ignorerait purement et simplement un objectif.",
    en: "Oversimplifying a hierarchical mandate (primary + secondary) into a mandate that would purely and simply ignore a goal.",
  },
});

const stagflationScenarioTemplate = mcqTemplate({
  id: "m01-bc-scenario-stagflation",
  conceptId: "m01-banques-centrales",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "L'inflation dépasse largement la cible ET le chômage augmente en même temps (stagflation). Pour laquelle des deux banques centrales ce scénario crée-t-il le conflit d'objectifs légal le plus direct ?",
    en: "Inflation is well above target AND unemployment is rising at the same time (stagflation). For which of the two central banks does this scenario create the most direct legal conflict of objectives?",
  },
  choices: [
    { id: "fed", label: { fr: "La FED, dont les deux objectifs légaux (prix et emploi) pointent alors dans des directions opposées", en: "The FED, whose two legal objectives (prices and employment) then point in opposite directions" } },
    { id: "ecb", label: { fr: "La BCE, dont le mandat unique élimine par construction tout conflit d'objectifs", en: "The ECB, whose single mandate eliminates any objective conflict by construction" } },
  ],
  correctId: "fed",
  hint: { fr: "Un double mandat peut, par définition, entrer en tension interne ; un mandat hiérarchisé tranche déjà la priorité.", en: "A dual mandate can, by definition, come into internal tension; a hierarchical mandate already settles the priority." },
  explanation: {
    fr: "La stagflation met en tension directe les deux objectifs légaux de la FED (combattre l'inflation exigerait normalement de monter les taux, soutenir l'emploi de les baisser). La BCE, avec un mandat hiérarchisé, a une priorité légale déjà tranchée : la stabilité des prix prime.",
    en: "Stagflation directly tensions the FED's two legal objectives (fighting inflation would normally call for raising rates, supporting employment for cutting them). The ECB, with a hierarchical mandate, already has its legal priority settled: price stability comes first.",
  },
  commonMistake: {
    fr: "Croire qu'un mandat hiérarchisé (BCE) crée plus de conflit qu'un double mandat à égalité (FED), alors que c'est l'inverse.",
    en: "Believing a hierarchical mandate (ECB) creates more conflict than an equally-weighted dual mandate (FED), when the opposite is true.",
  },
});

const qeMechanismTemplate = trueFalseTemplate({
  id: "m01-bc-whatif-qe-taux-zero",
  conceptId: "m01-banques-centrales",
  difficulty: "medium",
  isScenario: true,
  statement: {
    fr: "Si le taux directeur est déjà proche de zéro et que l'économie a encore besoin de soutien, une banque centrale ne dispose plus d'aucun outil supplémentaire.",
    en: "If the policy rate is already close to zero and the economy still needs support, a central bank has no further tools left.",
  },
  correct: false,
  explanation: {
    fr: "Faux : c'est précisément dans cette situation que les outils non conventionnels (assouplissement quantitatif, forward guidance) prennent le relais du taux directeur, qui ne peut plus baisser beaucoup plus.",
    en: "False: this is precisely the situation where unconventional tools (quantitative easing, forward guidance) take over from the policy rate, which can no longer fall much further.",
  },
  commonMistake: {
    fr: "Assimiler \"taux directeur proche de zéro\" à \"banque centrale à court de moyens d'action\".",
    en: "Equating \"policy rate near zero\" with \"central bank out of tools\".",
  },
});

export const templates: QuestionTemplate[] = [
  taylorRuleNumericTemplate,
  mandateTemplate,
  mechanicalRuleTemplate,
  vocabTemplate,
  comprehensionTemplate,
  toolsComparisonTemplate,
  whatIfUnemploymentTemplate,
  whatIfNaturalRateTemplate,
  outputGapReverseNumericTemplate,
  legalBasisErrorTemplate,
  stagflationScenarioTemplate,
  qeMechanismTemplate,
];
