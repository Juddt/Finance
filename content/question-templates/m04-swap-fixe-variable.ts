import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const netFlowNumericTemplate: QuestionTemplate = {
  id: "m04-swap-flux-net",
  conceptId: "m04-swap-fixe-variable",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 50) * 500_000;
    const rFixedPct = randomInt(rng, 1, 6);
    const rFloatPct = rFixedPct + randomInt(rng, -3, 3) || rFixedPct + 1;
    const delta = pick(rng, [0.25, 0.5, 1] as const);
    const netFlow = Math.round(notional * (rFloatPct / 100 - rFixedPct / 100) * delta * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un swap de notionnel ${fmt(notional, "fr", 0)}, taux fixe ${rFixedPct}%, période δ = ${delta}. Le taux variable observé pour cette période est ${rFloatPct}%. Quel est le flux net reçu par le RECEVEUR VARIABLE (positif si en sa faveur) ?`,
        en: `A swap with notional ${fmt(notional, "en", 0)}, fixed rate ${rFixedPct}%, period δ = ${delta}. The observed floating rate for this period is ${rFloatPct}%. What is the net flow received by the FLOATING RECEIVER (positive if in their favor)?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 10",
      hint: { fr: "Flux net = Notionnel × (R_variable − R_fixe) × δ.", en: "Net flow = Notional × (R_variable − R_fixed) × δ." },
      numeric: { value: netFlow, tolerance: 10 },
      calculation: {
        fr: `Flux net = ${fmt(notional, "fr", 0)} × (${rFloatPct}%−${rFixedPct}%) × ${delta} = ${fmt(netFlow, "fr")}.`,
        en: `Net flow = ${fmt(notional, "en", 0)} × (${rFloatPct}%−${rFixedPct}%) × ${delta} = ${fmt(netFlow, "en")}.`,
      },
      explanation: {
        fr: "Seule la différence nette est échangée en pratique (netting), pas les deux flux bruts séparément.",
        en: "Only the net difference is exchanged in practice (netting), not the two gross flows separately.",
      },
      commonMistake: {
        fr: "Inverser le sens (R_fixe − R_variable au lieu de R_variable − R_fixe) pour le receveur variable.",
        en: "Flipping the sign (R_fixed − R_variable instead of R_variable − R_fixed) for the floating receiver.",
      },
    };
  },
};

const payerBenefitsTemplate: QuestionTemplate = {
  id: "m04-swap-qui-profite",
  conceptId: "m04-swap-fixe-variable",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratesUp = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Après la conclusion d'un swap, les taux d'intérêt de marché ${ratesUp ? "montent fortement" : "baissent fortement"}. Qui en profite ?`,
        en: `After a swap's conclusion, market interest rates ${ratesUp ? "rise sharply" : "fall sharply"}. Who benefits?`,
      },
      choices: buildChoices([
        { id: "payer", label: { fr: "Le payeur fixe (reçoit variable)", en: "The fixed payer (receives floating)" } },
        { id: "receiver", label: { fr: "Le receveur fixe (paie variable)", en: "The fixed receiver (pays floating)" } },
      ]),
      hint: { fr: "Qui reçoit la jambe variable, qui devient plus intéressante si les taux montent ?", en: "Who receives the floating leg, which becomes more attractive if rates rise?" },
      correctChoiceIds: [ratesUp ? "payer" : "receiver"],
      explanation: ratesUp
        ? { fr: "Le payeur fixe reçoit la jambe variable : si les taux montent, il reçoit plus qu'il ne paie sur la jambe fixe.", en: "The fixed payer receives the floating leg: if rates rise, they receive more than they pay on the fixed leg." }
        : { fr: "Le receveur fixe paie la jambe variable : si les taux baissent, il paie moins qu'il ne reçoit sur la jambe fixe.", en: "The fixed receiver pays the floating leg: if rates fall, they pay less than they receive on the fixed leg." },
      commonMistake: {
        fr: "Oublier que \"payeur fixe\" signifie aussi \"receveur variable\", et inversement.",
        en: "Forgetting that \"fixed payer\" also means \"floating receiver\", and vice versa.",
      },
    };
  },
};

const noNotionalExchangeTemplate: QuestionTemplate = {
  id: "m04-swap-pas-echange-notionnel",
  conceptId: "m04-swap-fixe-variable",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Dans un swap de taux fixe/variable classique (sur une seule devise), le notionnel est échangé au début et à la fin du contrat.",
      en: "In a plain fixed/floating rate swap (single currency), the notional is exchanged at the start and end of the contract.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le notionnel n'est jamais échangé dans un swap de taux mono-devise, il ne sert qu'à calculer les intérêts (à la différence d'un swap de devises).",
      en: "False: the notional is never exchanged in a single-currency rate swap, it only serves to compute interest (unlike a currency swap).",
    },
    commonMistake: {
      fr: "Confondre un swap de taux avec un swap de devises, où le notionnel est bien échangé.",
      en: "Confusing a rate swap with a currency swap, where the notional is indeed exchanged.",
    },
  }),
};

const parValueTemplate: QuestionTemplate = {
  id: "m04-swap-vocab-pair",
  conceptId: "m04-swap-fixe-variable",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le taux fixe qui rend la valeur d'un swap nulle à sa conclusion s'appelle le taux au ______.",
      en: "The fixed rate that makes a swap's value zero at inception is called the ______ rate.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["pair", "par"],
    hint: { fr: "Même idée qu'une obligation qui se négocie « au pair ».", en: "Same idea as a bond trading \"at par\"." },
    explanation: {
      fr: "Le taux au pair est celui qui égalise la valeur des deux jambes à l'origine, de sorte qu'aucune des parties ne paie de prime.",
      en: "The par rate is the one that equalizes the value of both legs at inception, so neither party pays a premium.",
    },
    commonMistake: {
      fr: "Confondre le taux au pair du swap avec le taux de coupon au pair d'une obligation, qui sont des concepts analogues mais distincts.",
      en: "Confusing the swap's par rate with a bond's par coupon rate, which are analogous but distinct concepts.",
    },
  }),
};

export const templates: QuestionTemplate[] = [netFlowNumericTemplate, payerBenefitsTemplate, noNotionalExchangeTemplate, parValueTemplate];
