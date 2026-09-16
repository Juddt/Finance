import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const directionTemplate: QuestionTemplate = {
  id: "m09-dispersion-direction",
  conceptId: "m09-dispersion",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenario = pick(rng, ["lower", "higher"] as const);
    return {
      prompt: {
        fr: `Un gérant vend un variance swap sur un indice et achète des variance swaps sur ses composants (pondérés). La corrélation réalisée s'avère être ${scenario === "lower" ? "nettement plus faible" : "nettement plus élevée"} que celle implicitement pricée à l'origine. Le trade est-il profitable ?`,
        en: `A manager sells a variance swap on an index and buys variance swaps on its components (weighted). Realized correlation turns out to be ${scenario === "lower" ? "significantly lower" : "significantly higher"} than what was implicitly priced at inception. Is the trade profitable?`,
      },
      choices: buildChoices([
        { id: "yes", label: { fr: "Oui, profitable", en: "Yes, profitable" } },
        { id: "no", label: { fr: "Non, perdant", en: "No, losing" } },
      ]),
      hint: { fr: "Ce trade parie sur une baisse de la corrélation par rapport à celle implicitement pricée.", en: "This trade bets on correlation falling relative to what was implicitly priced." },
      correctChoiceIds: [scenario === "lower" ? "yes" : "no"],
      explanation:
        scenario === "lower"
          ? { fr: "Vendre l'indice/acheter les composants profite d'une corrélation réalisée plus faible que l'implicite pricée : le trade est profitable.", en: "Selling the index/buying the components profits from realized correlation being lower than the priced implied: the trade is profitable." }
          : { fr: "Une corrélation réalisée plus élevée que prévu pénalise ce sens de trade (vendeur d'indice/acheteur de composants) : le trade est perdant.", en: "Realized correlation coming in higher than expected hurts this trade direction (index seller/component buyer): the trade is losing." },
      commonMistake: {
        fr: "Inverser le sens de la relation entre corrélation réalisée et profitabilité du trade de dispersion.",
        en: "Reversing the relationship between realized correlation and the dispersion trade's profitability.",
      },
    };
  },
};

const notRiskFreeTemplate: QuestionTemplate = {
  id: "m09-dispersion-pas-sans-risque",
  conceptId: "m09-dispersion",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un trade de dispersion, étant neutre en direction de marché, est une stratégie sans risque.",
      en: "A dispersion trade, being market-direction-neutral, is a risk-free strategy.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le trade reste fortement exposé au risque de corrélation, qui peut évoluer brutalement (notamment à la hausse lors d'un choc de marché) — la neutralité directionnelle ne signifie pas l'absence de risque.",
      en: "False: the trade remains strongly exposed to correlation risk, which can move sharply (particularly upward during a market shock) — directional neutrality doesn't mean risk-free.",
    },
    commonMistake: {
      fr: "Assimiler \"neutre en direction\" à \"sans risque\", une confusion fréquente pour toute stratégie de volatilité/corrélation.",
      en: "Equating \"direction-neutral\" with \"risk-free\", a frequent confusion for any volatility/correlation strategy.",
    },
  }),
};

const whatIsDispersionTemplate: QuestionTemplate = {
  id: "m09-dispersion-definition",
  conceptId: "m09-dispersion",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Sur quoi porte fondamentalement un trade de dispersion ?",
      en: "What does a dispersion trade fundamentally bet on?",
    },
    choices: buildChoices([
      { id: "correlation", label: { fr: "La corrélation future entre les composants d'un indice", en: "Future correlation between an index's components" } },
      { id: "direction", label: { fr: "La direction future du marché", en: "The market's future direction" } },
    ]),
    hint: { fr: "Le trade combine une position sur l'indice et une position opposée sur ses composants.", en: "The trade combines a position on the index with an opposite position on its components." },
    correctChoiceIds: ["correlation"],
    explanation: {
      fr: "Le trade de dispersion est structurellement un pari sur la corrélation future entre les composants d'un indice, pas sur la direction du marché.",
      en: "The dispersion trade is structurally a bet on future correlation between an index's components, not on market direction.",
    },
    commonMistake: {
      fr: "Confondre un pari sur la corrélation avec un pari directionnel classique.",
      en: "Confusing a bet on correlation with a classic directional bet.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m09-dispersion-vocab",
  conceptId: "m09-dispersion",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une stratégie qui parie sur l'écart entre la volatilité d'un indice et la volatilité moyenne pondérée de ses composants s'appelle un trade de ______.",
      en: "A strategy betting on the gap between an index's volatility and the weighted average volatility of its components is called a ______ trade.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["dispersion"],
    hint: { fr: "Le mot qui décrit à quel point les composants \"se dispersent\" les uns des autres.", en: "The word describing how much the components \"spread out\" from each other." },
    explanation: {
      fr: "Le trade de dispersion exploite l'écart entre volatilité de l'indice et volatilité pondérée des composants, ce qui revient à parier sur la corrélation.",
      en: "The dispersion trade exploits the gap between the index's volatility and the components' weighted volatility, which amounts to betting on correlation.",
    },
    commonMistake: {
      fr: "Confondre dispersion (l'écart entre composants et indice) avec la simple volatilité de l'indice seul.",
      en: "Confusing dispersion (the gap between components and index) with the index's volatility alone.",
    },
  }),
};

export const templates: QuestionTemplate[] = [directionTemplate, notRiskFreeTemplate, whatIsDispersionTemplate, vocabTemplate];
