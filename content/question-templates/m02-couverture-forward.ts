import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const CURRENCIES = ["USD", "GBP", "JPY", "CHF"] as const;

function fmtAmount(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

function fmtRate(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

const directionTemplate: QuestionTemplate = {
  id: "m02-couverture-direction",
  conceptId: "m02-couverture-forward",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const amount = randomInt(rng, 2, 20) * 100_000;
    const months = randomInt(rng, 1, 12);
    const direction = pick(rng, ["receive", "pay"] as const);
    const correctId = direction === "receive" ? "sell" : "buy";

    const verbFr = direction === "receive" ? "va recevoir" : "devra payer";
    const verbEn = direction === "receive" ? "will receive" : "will have to pay";

    return {
      isScenario: true,
      prompt: {
        fr: `Une entreprise française ${verbFr} ${fmtAmount(amount, "fr")} ${currency} dans ${months} mois. Elle veut fixer dès aujourd'hui le montant en euros correspondant. Quelle position forward doit-elle prendre ?`,
        en: `A French company ${verbEn} ${fmtAmount(amount, "en")} ${currency} in ${months} months. It wants to lock in today the corresponding euro amount. Which forward position should it take?`,
      },
      choices: buildChoices([
        { id: "sell", label: { fr: `Vendre des ${currency} à terme`, en: `Sell ${currency} forward` } },
        { id: "buy", label: { fr: `Acheter des ${currency} à terme`, en: `Buy ${currency} forward` } },
        { id: "wait", label: { fr: "Ne pas se couvrir et attendre le taux spot", en: "Not hedge and wait for the spot rate" } },
      ]),
      hint: {
        fr: "Pensez à ce que l'entreprise doit faire de sa devise étrangère : la recevoir puis s'en débarrasser, ou en avoir besoin ?",
        en: "Think about what the company must do with the foreign currency: receive it and get rid of it, or need to obtain it?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr:
          direction === "receive"
            ? `L'entreprise va recevoir des ${currency} : pour fixer leur valeur en euros, elle doit les VENDRE à terme dès aujourd'hui.`
            : `L'entreprise devra payer des ${currency} : pour fixer leur coût en euros, elle doit les ACHETER à terme dès aujourd'hui.`,
        en:
          direction === "receive"
            ? `The company will receive ${currency}: to lock in their euro value, it must SELL them forward today.`
            : `The company will have to pay ${currency}: to lock in their euro cost, it must BUY them forward today.`,
      },
      commonMistake: {
        fr: "Inverser le sens de la couverture (acheter au lieu de vendre, ou l'inverse) est l'erreur la plus fréquente : la position forward doit toujours être opposée à l'exposition naturelle.",
        en: "Reversing the hedge direction (buying instead of selling, or vice versa) is the most common mistake: the forward position must always be opposite to the natural exposure.",
      },
    };
  },
};

const conversionTemplate: QuestionTemplate = {
  id: "m02-couverture-conversion",
  conceptId: "m02-couverture-forward",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const amountForeign = randomInt(rng, 1, 20) * 100_000;
    const forwardRate = randomFloat(rng, 0.75, 0.98, 4);
    const answer = Math.round(amountForeign * forwardRate * 100) / 100;

    return {
      prompt: {
        fr: `Une entreprise vend à terme ${fmtAmount(amountForeign, "fr")} ${currency} au prix forward F0 = ${fmtRate(forwardRate, "fr")} EUR par ${currency}. Combien d'euros recevra-t-elle à l'échéance, quel que soit le taux spot à ce moment-là ?`,
        en: `A company sells ${fmtAmount(amountForeign, "en")} ${currency} forward at forward price F0 = ${fmtRate(forwardRate, "en")} EUR per ${currency}. How many euros will it receive at maturity, whatever the spot rate is then?`,
      },
      numericUnit: { fr: "EUR", en: "EUR" },
      numericTolerance: "± 10",
      hint: {
        fr: "Montant_EUR = Montant devise × F0.",
        en: "Amount_EUR = Foreign amount × F0.",
      },
      numeric: { value: answer, tolerance: 10 },
      calculation: {
        fr: `Montant_EUR = ${fmtAmount(amountForeign, "fr")} × ${fmtRate(forwardRate, "fr")} = ${fmtAmount(answer, "fr")} EUR.`,
        en: `Amount_EUR = ${fmtAmount(amountForeign, "en")} × ${fmtRate(forwardRate, "en")} = ${fmtAmount(answer, "en")} EUR.`,
      },
      explanation: {
        fr: "Le forward garantit ce montant en euros, indépendamment de ce que fera le taux spot d'ici l'échéance.",
        en: "The forward guarantees this euro amount, regardless of what the spot rate does before maturity.",
      },
      commonMistake: {
        fr: "Utiliser le taux spot actuel au lieu du prix forward F0 fixé dans le contrat.",
        en: "Using today's spot rate instead of the forward price F0 fixed in the contract.",
      },
    };
  },
};

const certaintyTemplate: QuestionTemplate = {
  id: "m02-couverture-certitude",
  conceptId: "m02-couverture-forward",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    return {
      prompt: {
        fr: `Une entreprise a vendu des ${currency} à terme pour se couvrir. Si le taux spot à l'échéance est plus favorable que le prix forward fixé, elle peut quand même bénéficier de ce meilleur taux.`,
        en: `A company sold ${currency} forward to hedge. If the spot rate at maturity turns out more favorable than the fixed forward price, it can still benefit from that better rate.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : un forward est un engagement ferme. L'échange se fait obligatoirement au prix fixé F0, que le spot final soit plus ou moins favorable.",
        en: "False: a forward is a firm commitment. The exchange happens at the fixed price F0 regardless of whether the final spot is more or less favorable.",
      },
      commonMistake: {
        fr: "Confondre un forward (engagement ferme) avec une option (droit, pas obligation) qui permettrait de profiter d'un meilleur taux spot.",
        en: "Confusing a forward (firm commitment) with an option (a right, not an obligation) which would allow benefiting from a better spot rate.",
      },
    };
  },
};

const basisRiskVocabTemplate: QuestionTemplate = {
  id: "m02-couverture-risque-base-vocab",
  conceptId: "m02-couverture-forward",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le risque qui subsiste quand le montant ou la date de l'opération réelle diffère de ce qui a été couvert par le forward s'appelle le risque de ______.",
      en: "The risk that remains when the real transaction's amount or date differs from what the forward covered is called ______ risk.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["base", "basis"],
    hint: {
      fr: "Même mot qu'en anglais financier : « basis risk ».",
      en: "Same term used in English finance jargon.",
    },
    explanation: {
      fr: "On parle de risque de base : le forward couvre un montant et une date précis, tout écart avec la réalité reste exposé au marché.",
      en: "This is called basis risk: the forward covers a specific amount and date, any gap with reality stays exposed to the market.",
    },
    commonMistake: {
      fr: "Confondre le risque de base avec le risque de contrepartie (le risque que la banque ne tienne pas ses engagements), qui est un risque différent.",
      en: "Confusing basis risk with counterparty risk (the risk that the bank fails to honor its commitment), which is a different risk.",
    },
  }),
};

const basisRiskNumericTemplate: QuestionTemplate = {
  id: "m02-couverture-risque-base-calcul",
  conceptId: "m02-couverture-forward",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const hedgedAmount = randomInt(rng, 5, 15) * 100_000;
    const shortfallPct = randomFloat(rng, 0.03, 0.15, 3);
    const actualAmount = Math.round(hedgedAmount * (1 - shortfallPct));
    const uncovered = hedgedAmount - actualAmount;

    return {
      isScenario: true,
      prompt: {
        fr: `Une entreprise couvre ${fmtAmount(hedgedAmount, "fr")} ${currency} à terme, mais reçoit finalement seulement ${fmtAmount(actualAmount, "fr")} ${currency}. Combien de ${currency} restent non couverts, exposés au taux spot du jour ?`,
        en: `A company hedges ${fmtAmount(hedgedAmount, "en")} ${currency} forward, but ultimately receives only ${fmtAmount(actualAmount, "en")} ${currency}. How many ${currency} remain uncovered, exposed to that day's spot rate?`,
      },
      numericUnit: { fr: currency, en: currency },
      numericTolerance: "± 1",
      hint: {
        fr: "Comparez le montant couvert par le forward au montant réellement reçu.",
        en: "Compare the amount hedged by the forward to the amount actually received.",
      },
      numeric: { value: uncovered, tolerance: 1 },
      calculation: {
        fr: `Non couvert = ${fmtAmount(hedgedAmount, "fr")} − ${fmtAmount(actualAmount, "fr")} = ${fmtAmount(uncovered, "fr")} ${currency}. Pire encore : l'entreprise doit aussi trouver ${fmtAmount(uncovered, "fr")} ${currency} au taux spot pour honorer son forward, ou le renégocier.`,
        en: `Uncovered = ${fmtAmount(hedgedAmount, "en")} − ${fmtAmount(actualAmount, "en")} = ${fmtAmount(uncovered, "en")} ${currency}. Worse still: the company must also source ${fmtAmount(uncovered, "en")} ${currency} at the spot rate to honor its forward, or renegotiate it.`,
      },
      explanation: {
        fr: "C'est le risque de base : le forward porte sur un montant fixe, tout écart avec le flux réel reste exposé au marché — voire crée un besoin supplémentaire de devise.",
        en: "This is basis risk: the forward covers a fixed amount, any gap with the real cash flow stays exposed to the market — and can even create an extra currency need.",
      },
      commonMistake: {
        fr: "Penser que se couvrir élimine tout risque : cela élimine le risque sur le montant couvert, pas sur l'écart entre prévision et réalité.",
        en: "Thinking that hedging removes all risk: it removes the risk on the hedged amount, not the gap between forecast and reality.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [
  directionTemplate,
  conversionTemplate,
  certaintyTemplate,
  basisRiskVocabTemplate,
  basisRiskNumericTemplate,
];
