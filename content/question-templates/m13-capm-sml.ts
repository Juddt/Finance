import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const capmNumericTemplate: QuestionTemplate = {
  id: "m13-capm-calcul-rendement",
  conceptId: "m13-capm-sml",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const rf = randomInt(rng, 1, 4) / 100;
    const marketPremium = randomInt(rng, 4, 8) / 100;
    const beta = randomInt(rng, 50, 200) / 100;
    const requiredReturn = Math.round((rf + beta * marketPremium) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Taux sans risque r_f=${fmt(rf * 100, "fr", 0)}%, prime de risque de marché=${fmt(marketPremium * 100, "fr", 0)}%, bêta de l'action=${fmt(beta, "fr", 2)}. Quel est le rendement exigé selon le CAPM ?`,
        en: `Risk-free rate r_f=${fmt(rf * 100, "en", 0)}%, market risk premium=${fmt(marketPremium * 100, "en", 0)}%, stock beta=${fmt(beta, "en", 2)}. What is the CAPM-required return?`,
      },
      numericUnit: { fr: "% annualisé", en: "% annualized" },
      numericTolerance: "± 0.3",
      hint: { fr: "E(R) = r_f + β×(prime de risque de marché).", en: "E(R) = r_f + β×(market risk premium)." },
      numeric: { value: requiredReturn, tolerance: 0.3 },
      calculation: {
        fr: `E(R) = ${fmt(rf * 100, "fr", 0)}% + ${fmt(beta, "fr", 2)}×${fmt(marketPremium * 100, "fr", 0)}% ≈ ${fmt(requiredReturn, "fr")}%.`,
        en: `E(R) = ${fmt(rf * 100, "en", 0)}% + ${fmt(beta, "en", 2)}×${fmt(marketPremium * 100, "en", 0)}% ≈ ${fmt(requiredReturn, "en")}%.`,
      },
      explanation: {
        fr: "Le CAPM ajoute au taux sans risque une prime proportionnelle au bêta de l'actif, capturant uniquement le risque systématique non diversifiable.",
        en: "CAPM adds to the risk-free rate a premium proportional to the asset's beta, capturing only non-diversifiable systematic risk.",
      },
      commonMistake: {
        fr: "Multiplier le bêta par le rendement du marché total au lieu de la prime de risque (rendement du marché moins taux sans risque).",
        en: "Multiplying beta by the total market return instead of the risk premium (market return minus risk-free rate).",
      },
    };
  },
};

const smlPositionTemplate: QuestionTemplate = {
  id: "m13-capm-position-sml",
  conceptId: "m13-capm-sml",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une action a un rendement espéré (estimé indépendamment) supérieur à celui exigé par le CAPM pour son bêta. Comment se positionne-t-elle par rapport à la Security Market Line ?",
      en: "A stock has an (independently estimated) expected return above what CAPM requires for its beta. How is it positioned relative to the Security Market Line?",
    },
    choices: buildChoices([
      { id: "above", label: { fr: "Au-dessus de la SML : elle apparaît sous-évaluée", en: "Above the SML: it appears undervalued" } },
      { id: "below", label: { fr: "En dessous de la SML : elle apparaît survalorisée", en: "Below the SML: it appears overvalued" } },
    ]),
    hint: { fr: "Un rendement attendu supérieur à celui exigé pour le même risque est une bonne nouvelle pour l'investisseur.", en: "An expected return above what's required for the same risk is good news for the investor." },
    correctChoiceIds: ["above"],
    explanation: {
      fr: "Un actif dont le rendement espéré dépasse celui exigé par le CAPM pour son niveau de bêta se situe au-dessus de la SML, ce qui suggère qu'il est actuellement sous-évalué (son prix devrait monter).",
      en: "An asset whose expected return exceeds what CAPM requires for its beta level lies above the SML, suggesting it's currently undervalued (its price should rise).",
    },
    commonMistake: {
      fr: "Inverser la relation, en croyant qu'un rendement plus élevé signale une survalorisation plutôt qu'une sous-évaluation.",
      en: "Reversing the relationship, believing a higher return signals overvaluation rather than undervaluation.",
    },
  }),
};

const systematicRiskTemplate: QuestionTemplate = {
  id: "m13-capm-risque-systematique",
  conceptId: "m13-capm-sml",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Selon le CAPM, le risque spécifique à un actif (diversifiable) doit être rémunéré par une prime de rendement, au même titre que le risque systématique.",
      en: "According to CAPM, an asset's specific (diversifiable) risk should be compensated by a return premium, just like systematic risk.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : selon le CAPM, seul le risque systématique (non diversifiable, capturé par le bêta) doit être rémunéré. Le risque spécifique, éliminable par diversification, ne mérite aucune prime supplémentaire.",
      en: "False: according to CAPM, only systematic (non-diversifiable) risk, captured by beta, should be compensated. Specific risk, eliminable through diversification, deserves no additional premium.",
    },
    commonMistake: {
      fr: "Croire que toute forme de risque, diversifiable ou non, doit être rémunérée par le marché.",
      en: "Believing any form of risk, diversifiable or not, should be compensated by the market.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-capm-vocab",
  conceptId: "m13-capm-sml",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La mesure de la sensibilité d'un actif aux mouvements du marché global s'appelle le ______.",
      en: "The measure of an asset's sensitivity to overall market movements is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot grec", en: "one Greek letter name" },
    acceptedAnswers: ["beta", "bêta"],
    hint: { fr: "Une lettre grecque, déjà utilisée en M07 pour les Greeks d'options.", en: "A Greek letter, already used in M07 for option Greeks." },
    explanation: {
      fr: "Le bêta mesure la sensibilité d'un actif aux mouvements du marché, calculé comme la covariance de l'actif avec le marché divisée par la variance du marché.",
      en: "Beta measures an asset's sensitivity to market movements, computed as the asset's covariance with the market divided by the market's variance.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec l'alpha, qui mesure au contraire la performance non expliquée par l'exposition au marché.",
      en: "Confusing this term with alpha, which instead measures performance not explained by market exposure.",
    },
  }),
};

export const templates: QuestionTemplate[] = [capmNumericTemplate, smlPositionTemplate, systematicRiskTemplate, vocabTemplate];
