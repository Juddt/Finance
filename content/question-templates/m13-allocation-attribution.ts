import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const allocationEffectNumericTemplate: QuestionTemplate = {
  id: "m13-allocation-effet-calcul",
  conceptId: "m13-allocation-attribution",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const weightGap = randomInt(rng, -10, 15) / 100;
    const sectorReturn = randomInt(rng, -5, 20) / 100;
    const effect = Math.round(weightGap * sectorReturn * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un secteur est surpondéré de ${fmt(weightGap * 100, "fr", 0)} points de pourcentage par rapport au benchmark, et ce secteur a rendu ${fmt(sectorReturn * 100, "fr", 0)}% dans le benchmark. Quelle est la contribution de ce secteur à l'effet d'allocation ?`,
        en: `A sector is overweighted by ${fmt(weightGap * 100, "en", 0)} percentage points versus the benchmark, and this sector returned ${fmt(sectorReturn * 100, "en", 0)}% in the benchmark. What is this sector's contribution to the allocation effect?`,
      },
      numericUnit: { fr: "% de rendement", en: "% return" },
      numericTolerance: "± 0.1",
      hint: { fr: "Effet d'allocation = (poids portefeuille − poids benchmark) × rendement du benchmark pour ce secteur.", en: "Allocation effect = (portfolio weight − benchmark weight) × the benchmark's return for that sector." },
      numeric: { value: effect, tolerance: 0.1 },
      calculation: {
        fr: `Effet = ${fmt(weightGap * 100, "fr", 0)}% × ${fmt(sectorReturn * 100, "fr", 0)}% ≈ ${fmt(effect, "fr")}%.`,
        en: `Effect = ${fmt(weightGap * 100, "en", 0)}% × ${fmt(sectorReturn * 100, "en", 0)}% ≈ ${fmt(effect, "en")}%.`,
      },
      explanation: {
        fr: "L'effet d'allocation isole la contribution des choix de pondération sectorielle à la performance relative, indépendamment de la sélection de titres au sein de chaque secteur.",
        en: "The allocation effect isolates sector-weighting choices' contribution to relative performance, independent of security selection within each sector.",
      },
      commonMistake: {
        fr: "Utiliser le rendement du portefeuille pour ce secteur au lieu du rendement du benchmark, ce qui mélangerait allocation et sélection.",
        en: "Using the portfolio's return for that sector instead of the benchmark's, which would mix allocation and selection.",
      },
    };
  },
};

const activeVsPassiveTemplate: QuestionTemplate = {
  id: "m13-allocation-active-passive",
  conceptId: "m13-allocation-attribution",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Quelle est la différence fondamentale entre gestion active et gestion passive ?",
      en: "What is the fundamental difference between active and passive management?",
    },
    choices: buildChoices([
      { id: "active-alpha", label: { fr: "La gestion active cherche un alpha positif par rapport à un benchmark, la passive réplique simplement l'indice", en: "Active management seeks a positive alpha versus a benchmark, passive simply replicates the index" } },
      { id: "active-riskfree", label: { fr: "La gestion active investit uniquement dans l'actif sans risque", en: "Active management invests only in the risk-free asset" } },
    ]),
    hint: { fr: "L'alpha est le rendement non expliqué par l'exposition au marché.", en: "Alpha is the return not explained by market exposure." },
    correctChoiceIds: ["active-alpha"],
    explanation: {
      fr: "La gestion active vise à générer un alpha positif via la sélection de titres ou le timing, en échange de frais généralement plus élevés ; la gestion passive se contente de répliquer un indice à moindre coût.",
      en: "Active management aims to generate a positive alpha through security selection or timing, in exchange for generally higher fees; passive management is content to replicate an index at lower cost.",
    },
    commonMistake: {
      fr: "Confondre gestion active et passive avec des stratégies liées à l'actif sans risque, qui sont des concepts distincts.",
      en: "Confusing active and passive management with strategies tied to the risk-free asset, which are distinct concepts.",
    },
  }),
};

const feesNetAlphaTemplate: QuestionTemplate = {
  id: "m13-allocation-alpha-net-frais",
  conceptId: "m13-allocation-attribution",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un alpha brut positif reste nécessairement positif une fois les frais de gestion active déduits.",
      en: "A positive gross alpha necessarily remains positive once active management fees are deducted.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un alpha brut positif peut devenir négatif une fois les frais de gestion active déduits, si ces frais dépassent la surperformance générée. Il faut toujours évaluer l'alpha net de frais.",
      en: "False: a positive gross alpha can turn negative once active management fees are deducted, if those fees exceed the generated outperformance. Alpha must always be evaluated net of fees.",
    },
    commonMistake: {
      fr: "Évaluer la performance d'un gérant uniquement sur son alpha brut, sans tenir compte des frais qui la réduisent.",
      en: "Evaluating a manager's performance solely on gross alpha, without accounting for the fees that reduce it.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-allocation-vocab",
  conceptId: "m13-allocation-attribution",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le rendement d'un portefeuille non expliqué par son exposition au marché (bêta) s'appelle l'______.",
      en: "A portfolio's return not explained by its market exposure (beta) is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot grec", en: "one Greek letter name" },
    acceptedAnswers: ["alpha"],
    hint: { fr: "Une autre lettre grecque, distincte du bêta.", en: "Another Greek letter, distinct from beta." },
    explanation: {
      fr: "L'alpha mesure la surperformance (ou sous-performance) d'un portefeuille après ajustement du risque systématique capturé par le bêta.",
      en: "Alpha measures a portfolio's outperformance (or underperformance) after adjusting for the systematic risk captured by beta.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le bêta, qui mesure au contraire l'exposition au risque de marché.",
      en: "Confusing this term with beta, which instead measures market risk exposure.",
    },
  }),
};

export const templates: QuestionTemplate[] = [allocationEffectNumericTemplate, activeVsPassiveTemplate, feesNetAlphaTemplate, vocabTemplate];
