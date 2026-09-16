import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 1): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const cet1NumericTemplate: QuestionTemplate = {
  id: "m13-bale-cet1-calcul",
  conceptId: "m13-bale",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const rwa = randomInt(rng, 50, 300);
    const cet1Ratio = randomInt(rng, 8, 18) / 100;
    const cet1Capital = Math.round(rwa * cet1Ratio * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Une banque a des RWA de ${rwa} Md€ et vise un ratio CET1 de ${fmt(cet1Ratio * 100, "fr", 0)}%. Quel montant de fonds propres CET1 (en Md€) doit-elle détenir ?`,
        en: `A bank has RWA of €${rwa}bn and targets a CET1 ratio of ${fmt(cet1Ratio * 100, "en", 0)}%. What amount of CET1 capital (in €bn) must it hold?`,
      },
      numericUnit: { fr: "Md€", en: "€bn" },
      numericTolerance: "± 0.5",
      hint: { fr: "Fonds propres CET1 = Ratio CET1 × RWA.", en: "CET1 capital = CET1 ratio × RWA." },
      numeric: { value: cet1Capital, tolerance: 0.5 },
      calculation: {
        fr: `Fonds propres CET1 = ${fmt(cet1Ratio * 100, "fr", 0)}% × ${rwa} ≈ ${fmt(cet1Capital, "fr")} Md€.`,
        en: `CET1 capital = ${fmt(cet1Ratio * 100, "en", 0)}% × ${rwa} ≈ ${fmt(cet1Capital, "en")} €bn.`,
      },
      explanation: {
        fr: "Le ratio CET1 rapporte les fonds propres de meilleure qualité aux actifs pondérés du risque (RWA), le principal indicateur de solvabilité bancaire.",
        en: "The CET1 ratio relates the highest-quality capital to risk-weighted assets (RWA), the main bank solvency indicator.",
      },
      commonMistake: {
        fr: "Diviser au lieu de multiplier, ou confondre RWA et actifs totaux non pondérés.",
        en: "Dividing instead of multiplying, or confusing RWA with total unweighted assets.",
      },
    };
  },
};

const jurisdictionTemplate: QuestionTemplate = {
  id: "m13-bale-juridiction",
  conceptId: "m13-bale",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La finalisation de Bâle III s'applique selon exactement le même calendrier dans l'Union européenne, au Royaume-Uni et aux États-Unis.",
      en: "Basel III's finalization applies on exactly the same timeline in the European Union, the United Kingdom and the United States.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : l'UE applique CRR3 depuis le 1er janvier 2025, le Royaume-Uni applique son propre calendrier (Basel 3.1) à partir du 1er janvier 2027, et les États-Unis visent 2027-2028 avec le Basel III Endgame — trois calendriers distincts pour un même socle de standards internationaux.",
      en: "False: the EU applies CRR3 since 1 January 2025, the UK applies its own timeline (Basel 3.1) from 1 January 2027, and the US targets 2027-2028 with the Basel III Endgame — three distinct timelines for the same international standards baseline.",
    },
    commonMistake: {
      fr: "Croire qu'un standard international du Comité de Bâle s'applique automatiquement de façon uniforme et simultanée dans toutes les juridictions.",
      en: "Believing an international Basel Committee standard automatically applies uniformly and simultaneously across all jurisdictions.",
    },
  }),
};

const outputFloorTemplate: QuestionTemplate = {
  id: "m13-bale-output-floor",
  conceptId: "m13-bale",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "À quoi sert l'output floor introduit par la finalisation de Bâle III ?",
      en: "What is the output floor introduced by Basel III's finalization for?",
    },
    choices: buildChoices([
      { id: "limit", label: { fr: "Limiter l'écart entre les RWA calculés par modèles internes et par la méthode standard", en: "Limiting the gap between RWA computed by internal models and the standard method" } },
      { id: "raise-min", label: { fr: "Augmenter directement le minimum réglementaire du ratio CET1", en: "Directly raising the CET1 ratio's regulatory minimum" } },
    ]),
    hint: { fr: "L'output floor est calibré à 72,5% dans l'accord finalisé.", en: "The output floor is calibrated at 72.5% in the finalized accord." },
    correctChoiceIds: ["limit"],
    explanation: {
      fr: "L'output floor limite l'avantage que les grandes banques utilisant des modèles internes sophistiqués pouvaient tirer d'une pondération du risque plus favorable que la méthode standard, en fixant un plancher (72,5%) sur la réduction possible des RWA via ces modèles.",
      en: "The output floor limits the advantage large banks using sophisticated internal models could draw from more favorable risk weighting than the standard method, by setting a floor (72.5%) on the possible RWA reduction via these models.",
    },
    commonMistake: {
      fr: "Confondre l'output floor avec une augmentation directe du minimum réglementaire du ratio CET1 lui-même.",
      en: "Confusing the output floor with a direct increase in the CET1 ratio's own regulatory minimum.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-bale-vocab",
  conceptId: "m13-bale",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le ratio qui exige de détenir suffisamment d'actifs liquides de haute qualité pour couvrir les sorties nettes sur 30 jours de stress s'appelle le ______.",
      en: "The ratio requiring enough high-quality liquid assets to cover net outflows over 30 days of stress is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un sigle", en: "an acronym" },
    acceptedAnswers: ["lcr"],
    hint: { fr: "Liquidity Coverage Ratio.", en: "Liquidity Coverage Ratio." },
    explanation: {
      fr: "Le LCR (Liquidity Coverage Ratio) mesure la capacité d'une banque à résister à un choc de liquidité sur un horizon court de 30 jours, complémentaire au NSFR qui couvre un horizon d'un an.",
      en: "The LCR (Liquidity Coverage Ratio) measures a bank's ability to withstand a liquidity shock over a short 30-day horizon, complementary to the NSFR which covers a one-year horizon.",
    },
    commonMistake: {
      fr: "Confondre le LCR (horizon court, 30 jours) avec le NSFR (horizon long, un an).",
      en: "Confusing the LCR (short horizon, 30 days) with the NSFR (long horizon, one year).",
    },
  }),
};

export const templates: QuestionTemplate[] = [cet1NumericTemplate, jurisdictionTemplate, outputFloorTemplate, vocabTemplate];
