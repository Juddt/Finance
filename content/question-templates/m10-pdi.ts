import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const pdiPriceNumericTemplate: QuestionTemplate = {
  id: "m10-pdi-calcul-prix",
  conceptId: "m10-pdi",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const vanille = randomInt(rng, 800, 2000) / 10;
    const dO = Math.round((vanille - randomInt(rng, 100, Math.round(vanille * 10) - 100) / 10) * 10) / 10;
    const pdi = Math.round((vanille - dO) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un put vanille vaut ${fmt(vanille, "fr")}. Le put down-and-out correspondant (même strike, échéance, barrière) vaut ${fmt(dO, "fr")}. Quel est le prix du put down-and-in ?`,
        en: `A vanilla put is worth ${fmt(vanille, "en")}. The corresponding down-and-out put (same strike, maturity, barrier) is worth ${fmt(dO, "en")}. What is the down-and-in put's price?`,
      },
      numericUnit: { fr: "même devise que le vanille", en: "same currency as the vanilla" },
      numericTolerance: "± 0.3",
      hint: { fr: "P_DI = P_vanille − P_DO.", en: "P_DI = P_vanilla − P_DO." },
      numeric: { value: pdi, tolerance: 0.3 },
      calculation: {
        fr: `P_DI = ${fmt(vanille, "fr")} − ${fmt(dO, "fr")} = ${fmt(pdi, "fr")}.`,
        en: `P_DI = ${fmt(vanille, "en")} − ${fmt(dO, "en")} = ${fmt(pdi, "en")}.`,
      },
      explanation: {
        fr: "C'est une application directe de la barrier parity (M10-3) : le put vanille se décompose exactement en la somme du put down-and-in et du put down-and-out.",
        en: "This is a direct application of barrier parity (M10-3): the vanilla put decomposes exactly into the sum of the down-and-in and down-and-out puts.",
      },
      commonMistake: {
        fr: "Additionner au lieu de soustraire, ou confondre le rôle du DO et du DI dans la formule.",
        en: "Adding instead of subtracting, or mixing up the DO's and DI's roles in the formula.",
      },
    };
  },
};

const reverseConvertibleTemplate: QuestionTemplate = {
  id: "m10-pdi-reverse-convertible",
  conceptId: "m10-pdi",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans une reverse convertible offrant un coupon anormalement élevé, quel est généralement le signal caché à surveiller ?",
      en: "In a reverse convertible offering an abnormally high coupon, what is generally the hidden signal to watch for?",
    },
    choices: buildChoices([
      { id: "close-barrier", label: { fr: "Une barrière du PDI implicite proche du spot initial", en: "An implicit PDI barrier close to the initial spot" } },
      { id: "low-rates", label: { fr: "Des taux sans risque anormalement bas", en: "Abnormally low risk-free rates" } },
    ]),
    hint: { fr: "Plus le PDI est facile à activer, plus il est cher, donc plus le coupon peut être élevé.", en: "The easier the PDI is to trigger, the more expensive it is, so the higher the coupon can be." },
    correctChoiceIds: ["close-barrier"],
    explanation: {
      fr: "Un coupon élevé finance la vente implicite d'un put down-and-in : plus la barrière est proche du spot, plus ce put est cher, donc plus le coupon peut être élevé — au prix d'un risque de perte en capital plus grand.",
      en: "A high coupon funds the implicit sale of a down-and-in put: the closer the barrier is to spot, the more expensive this put is, so the higher the coupon can be — at the cost of greater capital-loss risk.",
    },
    commonMistake: {
      fr: "Croire qu'un coupon élevé est simplement un signe de générosité de l'émetteur, sans lien avec un risque caché.",
      en: "Believing a high coupon is simply a sign of issuer generosity, unrelated to any hidden risk.",
    },
  }),
};

const irreversibilityTemplate: QuestionTemplate = {
  id: "m10-pdi-irreversibilite",
  conceptId: "m10-pdi",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Si le sous-jacent d'une reverse convertible touche la barrière basse du PDI implicite puis remonte fortement avant l'échéance, l'investisseur est protégé de toute perte en capital.",
      en: "If a reverse convertible's underlying touches the implicit PDI's low barrier then rebounds strongly before expiry, the investor is protected from any capital loss.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : une fois la barrière touchée, le PDI s'active et le reste définitivement (irréversible, M10-1). Si S_T < K à l'échéance, l'investisseur subit une perte, même si le sous-jacent est remonté entre-temps.",
      en: "False: once the barrier is touched, the PDI activates and stays activated (irreversible, M10-1). If S_T < K at expiry, the investor suffers a loss, even if the underlying rebounded in the meantime.",
    },
    commonMistake: {
      fr: "Croire que seul le niveau final compte, en ignorant que le déclenchement de la barrière est un événement permanent.",
      en: "Believing only the final level matters, ignoring that the barrier trigger is a permanent event.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-pdi-vocab",
  conceptId: "m10-pdi",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans une reverse convertible, l'investisseur est implicitement ______ (acheteur/vendeur) d'un put down-and-in.",
      en: "In a reverse convertible, the investor is implicitly the ______ (buyer/seller) of a down-and-in put.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vendeur", "seller"],
    hint: { fr: "L'investisseur encaisse une prime (coupon) en échange du risque.", en: "The investor collects a premium (coupon) in exchange for the risk." },
    explanation: {
      fr: "L'investisseur est vendeur (implicite) du PDI : il encaisse la prime sous forme de coupon élevé, mais supporte le risque de baisse conditionnel si la barrière est touchée.",
      en: "The investor is the (implicit) seller of the PDI: they collect the premium as a high coupon, but bear the conditional downside risk if the barrier is touched.",
    },
    commonMistake: {
      fr: "Croire que l'investisseur est acheteur du put, ce qui inverserait complètement le sens du risque encouru.",
      en: "Believing the investor is the put's buyer, which would completely reverse the risk direction.",
    },
  }),
};

export const templates: QuestionTemplate[] = [pdiPriceNumericTemplate, reverseConvertibleTemplate, irreversibilityTemplate, vocabTemplate];
