import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

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

export const templates: QuestionTemplate[] = [roleMatchTemplate, costIncomeNumericTemplate, separationTemplate, vocabTemplate];
