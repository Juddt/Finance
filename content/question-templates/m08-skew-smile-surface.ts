import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const linearSkewNumericTemplate: QuestionTemplate = {
  id: "m08-skew-lineaire-calcul",
  conceptId: "m08-skew-smile-surface",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ivAtm = randomInt(rng, 15, 30);
    const betaPct = -1 * randomInt(rng, 5, 20);
    const moneyness = randomInt(rng, 80, 95) / 100;
    const beta = betaPct / 100;
    const iv = Math.round((ivAtm / 100 + beta * Math.log(moneyness)) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `IV_ATM=${ivAtm}%, pente de skew β=${betaPct}%, un strike à K/F0=${moneyness.toFixed(2)}. Avec l'approximation IV(K) ≈ IV_ATM + β×ln(K/F0), quelle est l'IV de ce strike, en % ?`,
        en: `IV_ATM=${ivAtm}%, skew slope β=${betaPct}%, a strike at K/F0=${moneyness.toFixed(2)}. Using the approximation IV(K) ≈ IV_ATM + β×ln(K/F0), what is this strike's IV, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.3",
      hint: { fr: "IV(K) ≈ IV_ATM + β×ln(K/F0).", en: "IV(K) ≈ IV_ATM + β×ln(K/F0)." },
      numeric: { value: iv, tolerance: 0.3 },
      calculation: {
        fr: `IV ≈ ${ivAtm}% + (${betaPct}%)×ln(${moneyness.toFixed(2)}) ≈ ${ivAtm}% + (${betaPct}%)×(${Math.log(moneyness).toFixed(4)}) ≈ ${fmt(iv, "fr")}%.`,
        en: `IV ≈ ${ivAtm}% + (${betaPct}%)×ln(${moneyness.toFixed(2)}) ≈ ${ivAtm}% + (${betaPct}%)×(${Math.log(moneyness).toFixed(4)}) ≈ ${fmt(iv, "en")}%.`,
      },
      explanation: {
        fr: "Pour K<F0 (un strike de put OTM typique), ln(K/F0) est négatif, donc avec un β négatif (skew equity typique), le terme correctif est positif : l'IV augmente pour les strikes bas, conformément au skew.",
        en: "For K<F0 (a typical OTM put strike), ln(K/F0) is negative, so with a negative β (typical equity skew), the correction term is positive: IV rises for low strikes, consistent with the skew.",
      },
      commonMistake: {
        fr: "Oublier de prendre le logarithme du ratio K/F0, en utilisant directement K/F0 dans la formule.",
        en: "Forgetting to take the logarithm of the K/F0 ratio, using K/F0 directly in the formula.",
      },
    };
  },
};

const equitySkewSignTemplate: QuestionTemplate = {
  id: "m08-skew-signe-equity",
  conceptId: "m08-skew-smile-surface",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Sur un marché actions typique, comparez la volatilité implicite d'un put OTM et celle d'un call OTM de même distance à la monnaie.",
      en: "In a typical equity market, compare the implied volatility of an OTM put and an OTM call at the same distance from the money.",
    },
    choices: buildChoices([
      { id: "put-higher", label: { fr: "Le put OTM a une IV plus élevée que le call OTM", en: "The OTM put has a higher IV than the OTM call" } },
      { id: "call-higher", label: { fr: "Le call OTM a une IV plus élevée que le put OTM", en: "The OTM call has a higher IV than the OTM put" } },
    ]),
    hint: { fr: "Pensez à la demande de protection contre les baisses de marché.", en: "Think about demand for protection against market declines." },
    correctChoiceIds: ["put-higher"],
    explanation: {
      fr: "Sur les actions, le skew est typiquement négatif : les puts OTM (protection à la baisse) ont une IV plus élevée que les calls OTM, reflétant la demande de protection et l'effet de levier.",
      en: "For equities, skew is typically negative: OTM puts (downside protection) have higher IV than OTM calls, reflecting protection demand and the leverage effect.",
    },
    commonMistake: {
      fr: "Inverser la relation typique entre put et call OTM sur les actions.",
      en: "Reversing the typical put/call OTM relationship for equities.",
    },
  }),
};

const surfaceDimensionsTemplate: QuestionTemplate = {
  id: "m08-skew-dimensions-surface",
  conceptId: "m08-skew-smile-surface",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La surface de volatilité combine deux dimensions : la variation par strike (skew/smile) et la variation par échéance (structure par terme).",
      en: "The volatility surface combines two dimensions: variation by strike (skew/smile) and variation by maturity (term structure).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : la surface de volatilité est une nappe à deux dimensions (strike × échéance), le skew/smile étant sa coupe à échéance fixe, la structure par terme sa coupe à strike fixe.",
      en: "True: the volatility surface is a two-dimensional sheet (strike × maturity), with the skew/smile being its cross-section at fixed maturity, the term structure its cross-section at fixed strike.",
    },
    commonMistake: {
      fr: "Réduire la surface de volatilité à une seule dimension (uniquement le strike, ou uniquement l'échéance).",
      en: "Reducing the volatility surface to a single dimension (only strike, or only maturity).",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-skew-vocab",
  conceptId: "m08-skew-smile-surface",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La position relative du strike par rapport au spot ou au forward, utilisée pour comparer des options sur une échelle indépendante du niveau de prix, s'appelle la ______.",
      en: "The strike's relative position versus spot or forward, used to compare options on a scale independent of the price level, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["moneyness"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "The English finance term itself." },
    explanation: {
      fr: "La moneyness (souvent K/S0 ou K/F0) permet de comparer des options de strikes différents sur une échelle standardisée.",
      en: "Moneyness (often K/S0 or K/F0) lets you compare options of different strikes on a standardized scale.",
    },
    commonMistake: {
      fr: "Confondre moneyness avec le strike absolu K, qui n'est pas comparable d'un actif à l'autre.",
      en: "Confusing moneyness with the absolute strike K, which isn't comparable across assets.",
    },
  }),
};

export const templates: QuestionTemplate[] = [linearSkewNumericTemplate, equitySkewSignTemplate, surfaceDimensionsTemplate, vocabTemplate];
