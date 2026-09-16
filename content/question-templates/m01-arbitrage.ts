import { randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const triangularNumericTemplate: QuestionTemplate = {
  id: "m01-arbitrage-triangulaire-calcul",
  conceptId: "m01-arbitrage",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const eurUsd = randomFloat(rng, 1.02, 1.18, 4);
    const usdGbp = randomFloat(rng, 0.74, 0.86, 4);
    const gbpEur = randomFloat(rng, 1.08, 1.22, 4);
    const result = Math.round(eurUsd * usdGbp * gbpEur * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `EUR/USD = ${fmt(eurUsd, "fr")}, USD/GBP = ${fmt(usdGbp, "fr")}, GBP/EUR = ${fmt(gbpEur, "fr")}. En partant de 1 EUR et en suivant ce cycle complet, combien d'EUR obtient-on à la fin ?`,
        en: `EUR/USD = ${fmt(eurUsd, "en")}, USD/GBP = ${fmt(usdGbp, "en")}, GBP/EUR = ${fmt(gbpEur, "en")}. Starting from 1 EUR and following this full cycle, how many EUR do you end up with?`,
      },
      numericUnit: { fr: "EUR", en: "EUR" },
      numericTolerance: "± 0.001",
      hint: { fr: "Multipliez les trois taux entre eux.", en: "Multiply the three rates together." },
      numeric: { value: result, tolerance: 0.001 },
      calculation: {
        fr: `${fmt(eurUsd, "fr")} × ${fmt(usdGbp, "fr")} × ${fmt(gbpEur, "fr")} ≈ ${fmt(result, "fr")}.`,
        en: `${fmt(eurUsd, "en")} × ${fmt(usdGbp, "en")} × ${fmt(gbpEur, "en")} ≈ ${fmt(result, "en")}.`,
      },
      explanation: {
        fr: `Si ce produit diffère de 1, un arbitrage triangulaire existe : ici il vaut ${fmt(result, "fr")}, ${result > 1 ? "donc le cycle génère un profit sans risque" : result < 1 ? "donc le cycle inverse génère un profit sans risque" : "donc aucun arbitrage n'est possible"}.`,
        en: `If this product differs from 1, a triangular arbitrage exists: here it equals ${fmt(result, "en")}, ${result > 1 ? "so the cycle generates a risk-free profit" : result < 1 ? "so the reverse cycle generates a risk-free profit" : "so no arbitrage is possible"}.`,
      },
      commonMistake: {
        fr: "Additionner les taux au lieu de les multiplier.",
        en: "Adding the rates instead of multiplying them.",
      },
    };
  },
};

const definitionTemplate: QuestionTemplate = {
  id: "m01-arbitrage-definition",
  conceptId: "m01-arbitrage",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Une stratégie qui a une chance de générer une petite perte mais une chance beaucoup plus grande de générer un gros gain, sans mise de fonds initiale, constitue un arbitrage au sens strict.",
      en: "A strategy with a small chance of a loss but a much larger chance of a big gain, requiring no initial capital, is an arbitrage in the strict sense.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un arbitrage, par définition stricte, ne peut JAMAIS produire de perte, même avec une probabilité infime. Une stratégie avec un risque de perte, même faible, n'est pas un arbitrage — c'est un pari favorable.",
      en: "False: an arbitrage, by strict definition, can NEVER produce a loss, even with a tiny probability. A strategy with any loss risk, however small, is not an arbitrage — it's a favorable bet.",
    },
    commonMistake: {
      fr: "Assimiler \"arbitrage\" à \"pari très favorable\", alors que la définition exige une absence totale de risque de perte.",
      en: "Equating \"arbitrage\" with \"very favorable bet\", when the definition requires a total absence of loss risk.",
    },
  }),
};

const limitsToArbitrageTemplate: QuestionTemplate = {
  id: "m01-arbitrage-limites",
  conceptId: "m01-arbitrage",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un écart de prix apparent entre deux actifs théoriquement identiques persiste pendant des mois malgré un profit sans risque apparent. Quelle explication est la plus probable ?",
      en: "An apparent price gap between two theoretically identical assets persists for months despite an apparent risk-free profit. What is the most likely explanation?",
    },
    choices: buildChoices([
      { id: "limits", label: { fr: "Des limites pratiques à l'arbitrage (coûts, financement, contraintes réglementaires)", en: "Practical limits to arbitrage (costs, funding, regulatory constraints)" } },
      { id: "impossible", label: { fr: "C'est mathématiquement impossible, l'observation doit être erronée", en: "This is mathematically impossible, the observation must be wrong" } },
    ]),
    hint: { fr: "Un écart théorique n'est pas toujours capturable en pratique.", en: "A theoretical gap isn't always capturable in practice." },
    correctChoiceIds: ["limits"],
    explanation: {
      fr: "Les limites à l'arbitrage (coûts de transaction, contraintes de financement, risque de contrepartie sur la durée) expliquent pourquoi certains écarts persistent malgré l'absence apparente de risque — le cas académique Royal Dutch/Shell en est un exemple classique.",
      en: "Limits to arbitrage (transaction costs, funding constraints, counterparty risk over time) explain why certain gaps persist despite an apparent lack of risk — the academic Royal Dutch/Shell case is a classic example.",
    },
    commonMistake: {
      fr: "Croire que la théorie de l'absence d'arbitrage garantit l'absence de TOUT écart de prix observable en pratique.",
      en: "Believing no-arbitrage theory guarantees the absence of ANY observable price gap in practice.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-arbitrage-vocab",
  conceptId: "m01-arbitrage",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le principe selon lequel deux combinaisons d'actifs produisant exactement le même résultat doivent avoir le même prix s'appelle la loi du prix ______.",
      en: "The principle that two combinations of assets producing exactly the same outcome must have the same price is called the law of ______ price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["unique", "one"],
    hint: { fr: "« Un seul » prix pour un même résultat.", en: "\"Only one\" price for the same outcome." },
    explanation: {
      fr: "La loi du prix unique est le principe sous-jacent à toutes les démonstrations par arbitrage de ce cours.",
      en: "The law of one price is the underlying principle behind every arbitrage proof in this course.",
    },
    commonMistake: {
      fr: "Confondre ce principe avec la simple observation empirique que les prix de marché convergent souvent.",
      en: "Confusing this principle with the mere empirical observation that market prices often converge.",
    },
  }),
};

export const templates: QuestionTemplate[] = [triangularNumericTemplate, definitionTemplate, limitsToArbitrageTemplate, vocabTemplate];
