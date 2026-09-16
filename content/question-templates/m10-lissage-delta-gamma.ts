import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const maxGammaNumericTemplate: QuestionTemplate = {
  id: "m10-lissage-gamma-max",
  conceptId: "m10-lissage-delta-gamma",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const deltaV = randomInt(rng, 500, 2000);
    const delta = randomInt(rng, 2, 8);
    const gammaMax = Math.round((deltaV / (delta * delta)) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Un payoff discontinu a une amplitude de saut ΔV=${fmt(deltaV, "fr")}. Un desk choisit un intervalle de lissage δ=${delta}. Quel est le Gamma maximal approximatif résultant ?`,
        en: `A discontinuous payoff has a jump amplitude ΔV=${fmt(deltaV, "en")}. A desk chooses a smoothing interval δ=${delta}. What is the resulting approximate maximum Gamma?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 15",
      hint: { fr: "Gamma_max ≈ ΔV/δ².", en: "Gamma_max ≈ ΔV/δ²." },
      numeric: { value: gammaMax, tolerance: 15 },
      calculation: {
        fr: `Gamma_max ≈ ${fmt(deltaV, "fr")}/${delta}² = ${fmt(deltaV, "fr")}/${delta * delta} ≈ ${fmt(gammaMax, "fr")}.`,
        en: `Gamma_max ≈ ${fmt(deltaV, "en")}/${delta}² = ${fmt(deltaV, "en")}/${delta * delta} ≈ ${fmt(gammaMax, "en")}.`,
      },
      explanation: {
        fr: "Le Gamma maximal après lissage dépend du carré de la largeur de l'intervalle choisi : doubler δ divise le Gamma maximal par 4.",
        en: "The post-smoothing maximum Gamma depends on the square of the chosen interval's width: doubling δ divides the maximum Gamma by 4.",
      },
      commonMistake: {
        fr: "Diviser par δ au lieu de δ² (oublier que la relation est quadratique, pas linéaire).",
        en: "Dividing by δ instead of δ² (forgetting the relationship is quadratic, not linear).",
      },
    };
  },
};

const tradeOffTemplate: QuestionTemplate = {
  id: "m10-lissage-arbitrage",
  conceptId: "m10-lissage-delta-gamma",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un δ (largeur de lissage) trop grand réduit bien le Gamma, mais crée quel effet secondaire ?",
      en: "A too-large δ (smoothing width) does reduce Gamma, but creates what side effect?",
    },
    choices: buildChoices([
      { id: "basis-risk", label: { fr: "Un écart de prix (basis risk) avec le contrat théorique exact", en: "A price gap (basis risk) versus the exact theoretical contract" } },
      { id: "higher-vega", label: { fr: "Une augmentation systématique du Vega", en: "A systematic increase in Vega" } },
    ]),
    hint: { fr: "Le contrat lissé n'est plus exactement le contrat vendu au client.", en: "The smoothed contract is no longer exactly the contract sold to the client." },
    correctChoiceIds: ["basis-risk"],
    explanation: {
      fr: "Un δ trop grand fait diverger le prix effectivement chargé (basé sur le payoff lissé) de la valeur théorique exacte du contrat pur — un basis risk qui doit être budgété comme un coût.",
      en: "A too-large δ makes the price actually charged (based on the smoothed payoff) diverge from the pure contract's exact theoretical value — a basis risk that must be budgeted as a cost.",
    },
    commonMistake: {
      fr: "Croire qu'élargir δ est une solution sans contrepartie au problème de Gamma extrême.",
      en: "Believing widening δ is a cost-free solution to the extreme Gamma problem.",
    },
  }),
};

const noFullEliminationTemplate: QuestionTemplate = {
  id: "m10-lissage-elimination-totale",
  conceptId: "m10-lissage-delta-gamma",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le lissage élimine complètement le risque de Gamma extrême, quel que soit le δ choisi.",
      en: "Smoothing completely eliminates extreme Gamma risk, whatever δ is chosen.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le lissage réduit et rend gérable le risque de Gamma, mais ne l'annule jamais totalement — un Gamma élevé (même fini) reste coûteux à couvrir.",
      en: "False: smoothing reduces and makes Gamma risk manageable, but never fully cancels it — a high (even finite) Gamma remains costly to hedge.",
    },
    commonMistake: {
      fr: "Croire à tort que le lissage est une solution parfaite qui supprime totalement tout risque de couverture.",
      en: "Wrongly believing smoothing is a perfect solution that fully removes all hedging risk.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-lissage-vocab",
  conceptId: "m10-lissage-delta-gamma",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'écart entre le payoff lissé réellement couvert et le payoff exact du contrat est appelé le risque de ______.",
      en: "The gap between the actually hedged smoothed payoff and the contract's exact payoff is called ______ risk.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["base", "basis"],
    hint: { fr: "Le même terme utilisé en anglais financier.", en: "The same English finance term." },
    explanation: {
      fr: "Le \"basis risk\" désigne cet écart entre le contrat vendu au client et la couverture effectivement mise en place, un coût structurel à budgéter.",
      en: "\"Basis risk\" denotes this gap between the contract sold to the client and the hedge actually put in place, a structural cost to budget.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le risque de Gamma général, qui est une notion différente.",
      en: "Confusing this term with general Gamma risk, a different notion.",
    },
  }),
};

export const templates: QuestionTemplate[] = [maxGammaNumericTemplate, tradeOffTemplate, noFullEliminationTemplate, vocabTemplate];
