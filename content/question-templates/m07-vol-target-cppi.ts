import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const cppiExposureNumericTemplate: QuestionTemplate = {
  id: "m07-cppi-exposition-calcul",
  conceptId: "m07-vol-target-cppi",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const V = randomInt(rng, 90, 150);
    const P = V - randomInt(rng, 5, 30);
    const m = randomInt(rng, 3, 6);
    const exposure = m * (V - P);

    return {
      isScenario: true,
      prompt: {
        fr: `Un CPPI a une valeur de portefeuille V=${V}, un plancher actualisé P=${P}, et un multiplicateur m=${m}. Quelle est l'exposition à l'actif risqué ?`,
        en: `A CPPI has portfolio value V=${V}, discounted floor P=${P}, and multiplier m=${m}. What is the risky asset exposure?`,
      },
      numericUnit: { fr: "même devise que V", en: "same currency as V" },
      numericTolerance: "± 1",
      hint: { fr: "Exposition = m × (V − P).", en: "Exposure = m × (V − P)." },
      numeric: { value: exposure, tolerance: 1 },
      calculation: { fr: `Coussin = ${V}−${P} = ${V - P}. Exposition = ${m}×${V - P} = ${fmt(exposure, "fr")}.`, en: `Cushion = ${V}−${P} = ${V - P}. Exposure = ${m}×${V - P} = ${fmt(exposure, "en")}.` },
      explanation: {
        fr: "L'exposition ne peut jamais dépasser la valeur totale du portefeuille en pratique — si m×coussin > V, l'exposition est plafonnée à V (règle non modélisée ici pour simplifier).",
        en: "In practice, exposure can never exceed the portfolio's total value — if m×cushion > V, exposure is capped at V (a rule not modeled here for simplicity).",
      },
      commonMistake: {
        fr: "Multiplier m par V au lieu de multiplier m par le coussin (V−P).",
        en: "Multiplying m by V instead of multiplying m by the cushion (V−P).",
      },
    };
  },
};

const volTargetDirectionTemplate: QuestionTemplate = {
  id: "m07-voltarget-direction",
  conceptId: "m07-vol-target-cppi",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const volRising = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Dans une stratégie Vol Target, la volatilité réalisée observée ${volRising ? "augmente fortement" : "diminue fortement"}. Que devient l'allocation à l'actif risqué ?`,
        en: `In a Vol Target strategy, observed realized volatility ${volRising ? "rises sharply" : "falls sharply"}. What happens to the risky asset allocation?`,
      },
      choices: buildChoices([
        { id: "down", label: { fr: "Elle diminue", en: "It decreases" } },
        { id: "up", label: { fr: "Elle augmente", en: "It increases" } },
      ]),
      hint: { fr: "Allocation = min(1, σ_cible/σ_réalisée).", en: "Allocation = min(1, σ_target/σ_realized)." },
      correctChoiceIds: [volRising ? "down" : "up"],
      explanation: volRising
        ? { fr: "Une volatilité réalisée plus élevée au dénominateur réduit le ratio σ_cible/σ_réalisée, donc l'allocation diminue — le mécanisme désinvestit en période agitée.", en: "A higher realized volatility in the denominator lowers the σ_target/σ_realized ratio, so the allocation decreases — the mechanism de-risks in turbulent periods." }
        : { fr: "Une volatilité réalisée plus basse augmente le ratio σ_cible/σ_réalisée, donc l'allocation augmente (jusqu'au plafond de 100%) — le mécanisme réinvestit en période calme.", en: "A lower realized volatility raises the σ_target/σ_realized ratio, so the allocation increases (up to the 100% cap) — the mechanism re-invests in calm periods." },
      commonMistake: {
        fr: "Inverser la relation entre volatilité observée et allocation à l'actif risqué.",
        en: "Reversing the relationship between observed volatility and risky asset allocation.",
      },
    };
  },
};

const cppiGuaranteeTemplate: QuestionTemplate = {
  id: "m07-cppi-garantie",
  conceptId: "m07-vol-target-cppi",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un CPPI garantit absolument que la valeur du portefeuille ne descendra jamais sous le plancher, en toutes circonstances de marché.",
      en: "A CPPI absolutely guarantees the portfolio's value will never fall below the floor, under all market circumstances.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un gap de marché suffisamment brutal entre deux rééquilibrages (un krach) peut faire passer le portefeuille sous le plancher, malgré le mécanisme de désinvestissement automatique — ce n'est pas une garantie absolue.",
      en: "False: a sufficiently sharp market gap between two rebalances (a crash) can push the portfolio below the floor, despite the automatic de-risking mechanism — not an absolute guarantee.",
    },
    commonMistake: {
      fr: "Croire que le mécanisme CPPI élimine tout risque de gap, quelle que soit l'ampleur du choc de marché.",
      en: "Believing the CPPI mechanism eliminates all gap risk, whatever the market shock's magnitude.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-cppi-vocab",
  conceptId: "m07-vol-target-cppi",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans un CPPI, la différence entre la valeur du portefeuille et le plancher actualisé s'appelle le ______.",
      en: "In a CPPI, the gap between the portfolio's value and the discounted floor is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["coussin", "cushion"],
    hint: { fr: "La marge de sécurité disponible, comme un « coussin » amortisseur.", en: "The available safety margin, like a cushioning \"pillow\"." },
    explanation: {
      fr: "Le coussin (cushion) est la marge de sécurité disponible au-dessus du plancher, qui détermine directement l'exposition à l'actif risqué via le multiplicateur.",
      en: "The cushion is the available safety margin above the floor, which directly determines risky asset exposure via the multiplier.",
    },
    commonMistake: {
      fr: "Confondre le coussin avec la valeur totale du portefeuille, alors que c'est seulement l'excédent au-dessus du plancher.",
      en: "Confusing the cushion with the portfolio's total value, when it is only the excess above the floor.",
    },
  }),
};

export const templates: QuestionTemplate[] = [cppiExposureNumericTemplate, volTargetDirectionTemplate, cppiGuaranteeTemplate, vocabTemplate];
