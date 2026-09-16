import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const roleMatchTemplate: QuestionTemplate = {
  id: "m01-org-role",
  conceptId: "m01-organisation-banque",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const task = pick(
      rng,
      [
        { id: "front", fr: "négocier directement avec un client pour lui vendre un produit dérivé", en: "trade directly with a client to sell them a derivative product" },
        { id: "middle", fr: "vérifier de façon indépendante que la position respecte les limites de risque", en: "independently verify the position respects risk limits" },
        { id: "back", fr: "régler la transaction avec la contrepartie et l'enregistrer en comptabilité", en: "settle the transaction with the counterparty and record it in the books" },
      ] as const
    );

    return {
      prompt: {
        fr: `Quelle fonction bancaire est chargée de : « ${task.fr} » ?`,
        en: `Which banking function is responsible for: "${task.en}"?`,
      },
      choices: buildChoices([
        { id: "front", label: { fr: "Front office", en: "Front office" } },
        { id: "middle", label: { fr: "Middle office", en: "Middle office" } },
        { id: "back", label: { fr: "Back office", en: "Back office" } },
      ]),
      hint: { fr: "Négocier, contrôler, ou régler ?", en: "Trading, controlling, or settling?" },
      correctChoiceIds: [task.id],
      explanation: {
        fr: `« ${task.fr} » relève du ${task.id === "front" ? "front" : task.id === "middle" ? "middle" : "back"} office, dans la séparation classique des tâches.`,
        en: `"${task.en}" falls under the ${task.id} office, in the classic separation of duties.`,
      },
      commonMistake: {
        fr: "Confondre le rôle de contrôle indépendant (middle) avec le rôle purement administratif (back).",
        en: "Confusing the independent control role (middle) with the purely administrative role (back).",
      },
    };
  },
};

const costIncomeNumericTemplate: QuestionTemplate = {
  id: "m01-org-coefficient-exploitation",
  conceptId: "m01-organisation-banque",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const costs = randomInt(rng, 3, 9);
    const revenue = costs + randomInt(rng, 1, 6);
    const ratio = Math.round((costs / revenue) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une banque a des charges d'exploitation de ${costs} milliards et un produit net bancaire de ${revenue} milliards. Quel est son coefficient d'exploitation, en % ?`,
        en: `A bank has operating costs of ${costs} billion and net banking revenue of ${revenue} billion. What is its cost-income ratio, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "Coefficient = Charges / Produit net bancaire.", en: "Ratio = Costs / Net banking revenue." },
      numeric: { value: ratio, tolerance: 0.5 },
      calculation: { fr: `Coefficient = ${costs}/${revenue} ≈ ${fmt(ratio, "fr")}%.`, en: `Ratio = ${costs}/${revenue} ≈ ${fmt(ratio, "en")}%.` },
      explanation: {
        fr: "Un coefficient plus bas signale une structure plus efficiente, générant plus de revenu par euro de coût.",
        en: "A lower ratio signals a more efficient structure, generating more revenue per euro of cost.",
      },
      commonMistake: {
        fr: "Inverser le numérateur et le dénominateur (diviser le revenu par les charges).",
        en: "Swapping numerator and denominator (dividing revenue by costs).",
      },
    };
  },
};

const separationTemplate: QuestionTemplate = {
  id: "m01-org-separation",
  conceptId: "m01-organisation-banque",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un trader peut, dans une organisation bancaire saine, valider et régler lui-même les opérations qu'il a négociées, pour gagner en rapidité.",
      en: "In a sound banking organization, a trader can validate and settle themselves the trades they negotiated, to gain speed.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la séparation des tâches entre front, middle et back office existe précisément pour empêcher qu'une même personne négocie, valide et règle sa propre opération — plusieurs scandales financiers ont résulté du contournement de cette règle.",
      en: "False: the separation of duties between front, middle and back office exists precisely to prevent the same person from trading, validating and settling their own trade — several financial scandals resulted from bypassing this rule.",
    },
    commonMistake: {
      fr: "Voir cette séparation comme une lourdeur administrative évitable plutôt qu'un contrôle de risque essentiel.",
      en: "Seeing this separation as avoidable administrative overhead rather than an essential risk control.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-org-vocab",
  conceptId: "m01-organisation-banque",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'équipe qui contrôle indépendamment le risque de chaque opération avant qu'elle ne soit définitivement enregistrée s'appelle le ______ office.",
      en: "The team that independently controls each trade's risk before it is finally recorded is called the ______ office.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["middle"],
    hint: { fr: "Ni le front (qui négocie), ni le back (qui règle) : celui entre les deux.", en: "Neither the front (which trades) nor the back (which settles): the one in between." },
    explanation: {
      fr: "Le middle office assure un contrôle des risques indépendant du front office qui a négocié l'opération.",
      en: "The middle office provides risk control independent of the front office that negotiated the trade.",
    },
    commonMistake: {
      fr: "Répondre \"back\", qui gère le règlement et la comptabilité, pas le contrôle de risque en amont.",
      en: "Answering \"back\", which handles settlement and accounting, not upstream risk control.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-org-comprehension-utilite",
  conceptId: "m01-organisation-banque",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi une banque maintient-elle un middle office séparé, alors que cela ajoute du coût et ralentit chaque opération ?",
    en: "Why does a bank maintain a separate middle office, when it adds cost and slows down every trade?",
  },
  choices: [
    { id: "control", label: { fr: "Pour un contrôle des risques indépendant du front, qui réduit le risque d'erreur ou de fraude non détectée", en: "For risk control independent of the front, reducing the risk of undetected error or fraud" } },
    { id: "formality", label: { fr: "Uniquement pour respecter une formalité administrative, sans réel impact sur le risque", en: "Only to satisfy an administrative formality, with no real risk impact" } },
  ],
  correctId: "control",
  hint: { fr: "Pensez à ce qui se passerait si le trader validait lui-même ses propres opérations.", en: "Think about what would happen if the trader validated their own trades." },
  explanation: {
    fr: "Le coût et la lenteur du middle office sont le prix d'un contrôle réellement indépendant : sans lui, rien n'empêche une position risquée ou frauduleuse de passer inaperçue avant qu'elle ne devienne catastrophique.",
    en: "The middle office's cost and slowness are the price of a genuinely independent control: without it, nothing stops a risky or fraudulent position from going unnoticed before it becomes catastrophic.",
  },
  commonMistake: {
    fr: "Voir le middle office comme une couche bureaucratique évitable plutôt qu'un mécanisme de sécurité fondamental.",
    en: "Seeing the middle office as an avoidable bureaucratic layer rather than a fundamental safety mechanism.",
  },
});

const comparisonTemplate = mcqTemplate({
  id: "m01-org-comparaison-middle-back",
  conceptId: "m01-organisation-banque",
  difficulty: "medium",
  prompt: {
    fr: "Quelle est la différence essentielle entre le rôle du middle office et celui du back office ?",
    en: "What is the essential difference between the middle office's role and the back office's?",
  },
  choices: [
    { id: "correct", label: { fr: "Le middle contrôle le risque AVANT que l'opération soit définitivement validée ; le back règle et comptabilise APRÈS validation", en: "The middle controls risk BEFORE the trade is finally validated; the back settles and books it AFTER validation" } },
    { id: "same", label: { fr: "Les deux exécutent exactement les mêmes contrôles, seulement à des horaires différents", en: "Both perform exactly the same checks, just at different times of day" } },
  ],
  correctId: "correct",
  hint: { fr: "L'ordre chronologique dans le cycle de vie d'une opération compte ici.", en: "The chronological order in a trade's lifecycle matters here." },
  explanation: {
    fr: "Le middle office est un filtre de contrôle de risque en amont, tandis que le back office est un exécutant administratif en aval, une fois que l'opération a déjà passé ce filtre.",
    en: "The middle office is an upstream risk-control filter, while the back office is a downstream administrative executor, once the trade has already passed that filter.",
  },
  commonMistake: {
    fr: "Croire que middle et back office font le même travail de vérification, alors que leurs objectifs (risque vs règlement) sont différents.",
    en: "Believing the middle and back office do the same verification work, when their objectives (risk vs settlement) differ.",
  },
});

const whatIfMiddleRemovedTemplate = trueFalseTemplate({
  id: "m01-org-whatif-suppression-middle",
  conceptId: "m01-organisation-banque",
  difficulty: "medium",
  statement: {
    fr: "Si une banque supprime son middle office pour réduire ses coûts, le risque qu'une position comme celles des affaires Kerviel ou Leeson passe inaperçue diminue.",
    en: "If a bank removes its middle office to cut costs, the risk that a position like those in the Kerviel or Leeson cases goes unnoticed decreases.",
  },
  correct: false,
  explanation: {
    fr: "Faux : c'est l'inverse. Le middle office est précisément la fonction qui aurait pu détecter ces positions dissimulées ; le supprimer augmente ce risque, il ne le réduit pas.",
    en: "False: the opposite is true. The middle office is precisely the function that could have caught these hidden positions; removing it increases that risk, it doesn't reduce it.",
  },
  commonMistake: {
    fr: "Confondre \"réduire les coûts de contrôle\" avec \"réduire le risque\", alors que c'est l'inverse qui se produit.",
    en: "Confusing \"reducing control costs\" with \"reducing risk\", when the opposite happens.",
  },
});

const whatIfDoubleHatTemplate = mcqTemplate({
  id: "m01-org-whatif-double-casquette",
  conceptId: "m01-organisation-banque",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader occupe temporairement aussi un poste au back office pendant une absence de collègue. Quel risque augmente le plus directement dans cette situation ?",
    en: "A trader temporarily also holds a back-office role while covering for an absent colleague. Which risk increases most directly in this situation?",
  },
  choices: [
    { id: "concealment", label: { fr: "Le risque qu'il dissimule ou retarde la déclaration d'une position, puisqu'il peut désormais valider/régler sa propre opération", en: "The risk he conceals or delays declaring a position, since he can now validate/settle his own trade" } },
    { id: "market", label: { fr: "Le risque de marché général sur le portefeuille de la banque, indépendamment de ses fonctions", en: "The bank's general market risk on its portfolio, independent of his roles" } },
  ],
  correctId: "concealment",
  hint: { fr: "C'est exactement le schéma structurel des scandales de trader voyou.", en: "This is exactly the structural pattern behind rogue-trader scandals." },
  explanation: {
    fr: "Cumuler front et back office recrée exactement la faille structurelle qui a permis les fraudes de type Kerviel/Leeson : une même personne négocie, valide et règle sa propre opération, sans contrôle indépendant possible.",
    en: "Combining front and back office roles recreates exactly the structural flaw that enabled Kerviel/Leeson-type frauds: the same person trades, validates and settles their own trade, with no possible independent control.",
  },
  commonMistake: {
    fr: "Penser que le risque de marché change avec l'organisation interne, alors que c'est le risque de fraude/erreur non détectée qui est directement affecté.",
    en: "Thinking market risk changes with internal organization, when it's undetected fraud/error risk that's directly affected.",
  },
});

const targetCostIncomeNumericTemplate: QuestionTemplate = {
  id: "m01-org-charges-max-calcul",
  conceptId: "m01-organisation-banque",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const pnb = randomInt(rng, 4, 15);
    const targetRatioPct = randomInt(rng, 40, 65);
    const maxCosts = Math.round(pnb * (targetRatioPct / 100) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une banque a un produit net bancaire de ${pnb} milliards et vise un coefficient d'exploitation de ${targetRatioPct}% au maximum. Quel est le niveau maximal de charges d'exploitation qu'elle peut se permettre, en milliards ?`,
        en: `A bank has net banking revenue of ${pnb} billion and targets a cost-income ratio of at most ${targetRatioPct}%. What is the maximum level of operating costs it can afford, in billions?`,
      },
      numericUnit: { fr: "milliards", en: "billion" },
      numericTolerance: "± 0.1",
      hint: { fr: "Inversez la formule : Charges = Coefficient cible × PNB.", en: "Invert the formula: Costs = Target ratio × Net revenue." },
      numeric: { value: maxCosts, tolerance: 0.1 },
      calculation: {
        fr: `Charges max = ${targetRatioPct}% × ${pnb} = ${maxCosts} milliards.`,
        en: `Max costs = ${targetRatioPct}% × ${pnb} = ${maxCosts} billion.`,
      },
      explanation: {
        fr: "Plutôt que de calculer directement le ratio, ici il faut le résoudre à l'envers : partir du ratio cible et du PNB pour retrouver le budget de charges compatible.",
        en: "Rather than computing the ratio directly, here it must be solved backward: start from the target ratio and net revenue to find the compatible cost budget.",
      },
      commonMistake: {
        fr: "Diviser le PNB par le ratio cible au lieu de le multiplier par celui-ci.",
        en: "Dividing net revenue by the target ratio instead of multiplying by it.",
      },
    };
  },
};

const middleOfficerTrustErrorTemplate = mcqTemplate({
  id: "m01-org-erreur-confiance-middle",
  conceptId: "m01-organisation-banque",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un middle officer valide systématiquement, sans vérification approfondie, les opérations d'un trader senior en qui il a une grande confiance. Quelle erreur commet-il ?",
    en: "A middle officer systematically validates, without thorough checks, the trades of a senior trader they deeply trust. What mistake are they making?",
  },
  choices: [
    { id: "trust-error", label: { fr: "Il abandonne le principe de contrôle indépendant systématique, quel que soit le niveau de confiance envers le trader", en: "He abandons the principle of systematic independent control, regardless of trust in the trader" } },
    { id: "no-error", label: { fr: "Aucune erreur : la confiance envers un trader expérimenté justifie d'alléger les contrôles", en: "No mistake: trust in an experienced trader justifies lighter controls" } },
  ],
  correctId: "trust-error",
  hint: { fr: "Le contrôle indépendant doit rester systématique, pas conditionné à la réputation du trader.", en: "Independent control must stay systematic, not conditional on the trader's reputation." },
  explanation: {
    fr: "Le middle office existe précisément pour contrôler indépendamment de la confiance personnelle : les plus gros scandales impliquent souvent des traders très respectés, dont le statut avait relâché la vigilance des contrôles.",
    en: "The middle office exists precisely to control independently of personal trust: the biggest scandals often involve highly respected traders, whose status had relaxed control vigilance.",
  },
  commonMistake: {
    fr: "Croire que la réputation ou l'ancienneté d'un trader est un substitut valable à un contrôle indépendant systématique.",
    en: "Believing a trader's reputation or seniority is a valid substitute for systematic independent control.",
  },
});

const headcountProductivityNumericTemplate: QuestionTemplate = {
  id: "m01-org-pnb-par-employe-calcul",
  conceptId: "m01-organisation-banque",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const pnbMillions = randomInt(rng, 200, 900);
    const employees = randomInt(rng, 400, 2000);
    const perEmployee = Math.round((pnbMillions * 1_000_000) / employees);

    return {
      isScenario: true,
      prompt: {
        fr: `Une banque de marché (front + middle + back confondus) a un produit net bancaire de ${pnbMillions} millions et emploie ${employees} personnes au total. Quel est le PNB généré par employé ?`,
        en: `A markets bank (front + middle + back combined) has net banking revenue of ${pnbMillions} million and employs ${employees} people in total. What is the net revenue generated per employee?`,
      },
      numericUnit: { fr: "même devise que le PNB", en: "same currency as net revenue" },
      numericTolerance: "± 2000",
      hint: { fr: "PNB par employé = PNB total / Nombre total d'employés.", en: "Revenue per employee = Total net revenue / Total headcount." },
      numeric: { value: perEmployee, tolerance: 2000 },
      calculation: {
        fr: `${fmtM(pnbMillions)} / ${employees} ≈ ${fmtM(perEmployee / 1_000_000, 3)} par employé.`,
        en: `${fmtM(pnbMillions)} / ${employees} ≈ ${fmtM(perEmployee / 1_000_000, 3)} per employee.`,
      },
      explanation: {
        fr: "Ce ratio de productivité inclut volontairement toutes les fonctions (front, middle, back) : il mesure l'efficacité de l'organisation entière, pas seulement des équipes qui génèrent directement du revenu.",
        en: "This productivity ratio deliberately includes all functions (front, middle, back): it measures the whole organization's efficiency, not just the teams directly generating revenue.",
      },
      commonMistake: {
        fr: "Ne diviser que par les effectifs du front office, alors que la question porte sur l'ensemble de la banque de marché.",
        en: "Dividing only by front-office headcount, when the question concerns the whole markets bank.",
      },
    };
  },
};

function fmtM(millions: number, decimals = 0): string {
  return `${millions.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} M`;
}

const reconciliationScenarioTemplate = mcqTemplate({
  id: "m01-org-scenario-rapprochement",
  conceptId: "m01-organisation-banque",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La position qu'un trader déclare comme détenue ne correspond pas exactement à ce que la contrepartie confirme de son côté. Quelle fonction est chargée de détecter cet écart ?",
    en: "The position a trader reports holding doesn't exactly match what the counterparty confirms on their side. Which function is responsible for catching this gap?",
  },
  choices: [
    { id: "back", label: { fr: "Le back office, via le rapprochement (réconciliation) des confirmations", en: "The back office, via reconciliation of confirmations" } },
    { id: "front", label: { fr: "Le front office, qui a lui-même négocié l'opération", en: "The front office, which negotiated the trade itself" } },
  ],
  correctId: "back",
  hint: { fr: "Ce n'est pas au négociateur lui-même de vérifier sa propre déclaration.", en: "It's not the trader's own job to verify their own reported position." },
  explanation: {
    fr: "Le rapprochement entre la position déclarée par le front et celle confirmée par la contrepartie est une tâche typique du back office, un contrôle qui a justement permis de révéler certaines fraudes historiques.",
    en: "Reconciling the position reported by the front against what the counterparty confirms is a typical back-office task, a control that has historically helped uncover fraud.",
  },
  commonMistake: {
    fr: "Croire que le trader qui a négocié l'opération est bien placé pour vérifier lui-même sa propre déclaration.",
    en: "Believing the trader who negotiated the trade is well placed to verify their own report.",
  },
});

export const templates: QuestionTemplate[] = [
  roleMatchTemplate,
  costIncomeNumericTemplate,
  separationTemplate,
  vocabTemplate,
  comprehensionTemplate,
  comparisonTemplate,
  whatIfMiddleRemovedTemplate,
  whatIfDoubleHatTemplate,
  targetCostIncomeNumericTemplate,
  middleOfficerTrustErrorTemplate,
  headcountProductivityNumericTemplate,
  reconciliationScenarioTemplate,
];
