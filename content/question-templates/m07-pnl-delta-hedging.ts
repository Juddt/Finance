import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const periodPnlNumericTemplate: QuestionTemplate = {
  id: "m07-pnl-periode-calcul",
  conceptId: "m07-pnl-delta-hedging",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const theta = -1 * randomInt(rng, 5, 40);
    const dt = 1 / 365;
    const gamma = randomFloat(rng, 0.01, 0.1, 3);
    const dS = randomInt(rng, 1, 8);
    const pnl = Math.round((theta * dt + 0.5 * gamma * dS * dS) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position delta-hedgée a Θ=${theta} (par an) et Γ=${fmt(gamma, "fr", 3)}. Sur un jour (dt=1/365), le sous-jacent bouge de ${dS} (dS). Quel est le P&L de cette journée ?`,
        en: `A delta-hedged position has Θ=${theta} (per year) and Γ=${fmt(gamma, "en", 3)}. Over one day (dt=1/365), the underlying moves by ${dS} (dS). What is that day's P&L?`,
      },
      numericUnit: { fr: "même devise que la position", en: "same currency as the position" },
      numericTolerance: "± 0.5",
      hint: { fr: "P&L ≈ Θ×dt + ½×Γ×(dS)².", en: "P&L ≈ Θ×dt + ½×Γ×(dS)²." },
      numeric: { value: pnl, tolerance: 0.5 },
      calculation: {
        fr: `P&L ≈ ${theta}×(1/365) + 0,5×${fmt(gamma, "fr", 3)}×${dS}² ≈ ${(theta * dt).toFixed(3)} + ${(0.5 * gamma * dS * dS).toFixed(3)} ≈ ${fmt(pnl, "fr")}.`,
        en: `P&L ≈ ${theta}×(1/365) + 0.5×${fmt(gamma, "en", 3)}×${dS}² ≈ ${(theta * dt).toFixed(3)} + ${(0.5 * gamma * dS * dS).toFixed(3)} ≈ ${fmt(pnl, "en")}.`,
      },
      explanation: {
        fr: "Le terme de Gamma dépend du CARRÉ du mouvement, donc il devient dominant lors de mouvements importants, tandis que le Theta s'accumule régulièrement à chaque jour qui passe.",
        en: "The Gamma term depends on the SQUARED move, so it becomes dominant during large moves, while Theta accumulates steadily every passing day.",
      },
      commonMistake: {
        fr: "Oublier d'élever dS au carré, ou oublier le facteur ½ devant le terme de Gamma.",
        en: "Forgetting to square dS, or forgetting the ½ factor in front of the Gamma term.",
      },
    };
  },
};

const sellerProfitableTemplate: QuestionTemplate = {
  id: "m07-pnl-vendeur-profitable",
  conceptId: "m07-pnl-delta-hedging",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const realizedHigher = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Un trader vend une option couverte en delta à une volatilité implicite de 20%. La volatilité réellement réalisée sur le sous-jacent s'avère être ${realizedHigher ? "30%" : "12%"}. Le P&L moyen de cette position est-il positif ou négatif pour le vendeur ?`,
        en: `A trader sells a delta-hedged option at 20% implied volatility. The volatility actually realized on the underlying turns out to be ${realizedHigher ? "30%" : "12%"}. Is the average P&L of this position positive or negative for the seller?`,
      },
      choices: buildChoices([
        { id: "positive", label: { fr: "Positif", en: "Positive" } },
        { id: "negative", label: { fr: "Négatif", en: "Negative" } },
      ]),
      hint: { fr: "Le vendeur gagne si la volatilité réalisée est plus BASSE que l'implicite vendue.", en: "The seller wins if realized volatility is LOWER than the sold implied." },
      correctChoiceIds: [realizedHigher ? "negative" : "positive"],
      explanation: realizedHigher
        ? { fr: "La volatilité réalisée (30%) dépasse largement l'implicite vendue (20%) : les pertes de Gamma dépassent en moyenne le Theta encaissé, P&L négatif pour le vendeur.", en: "Realized volatility (30%) far exceeds the sold implied (20%): Gamma losses exceed the collected Theta on average, negative P&L for the seller." }
        : { fr: "La volatilité réalisée (12%) est bien inférieure à l'implicite vendue (20%) : le Theta encaissé dépasse en moyenne le coût du Gamma, P&L positif pour le vendeur.", en: "Realized volatility (12%) is well below the sold implied (20%): the collected Theta exceeds the average Gamma cost, positive P&L for the seller." },
      commonMistake: {
        fr: "Inverser la règle et croire que le vendeur gagne quand la volatilité réalisée dépasse l'implicite.",
        en: "Reversing the rule and believing the seller wins when realized volatility exceeds the implied.",
      },
    };
  },
};

const discreteGapTemplate: QuestionTemplate = {
  id: "m07-pnl-gap-discret",
  conceptId: "m07-pnl-delta-hedging",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'approximation P&L ≈ Θdt + ½Γ(dS)² capture parfaitement le risque d'un mouvement de marché brutal (gap) survenant entre deux rééquilibrages, sans aucune sous-estimation.",
      en: "The approximation P&L ≈ Θdt + ½Γ(dS)² perfectly captures the risk of a sharp market move (gap) occurring between two rebalances, with no underestimation.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : cette approximation de Taylor au second ordre sous-estime le risque réel lors d'un gap important, car elle ignore les termes d'ordre supérieur qui deviennent significatifs pour de grands mouvements — le risque de gap reste un danger réel non pleinement capturé.",
      en: "False: this second-order Taylor approximation underestimates the real risk during a large gap, since it ignores higher-order terms that become significant for large moves — gap risk remains a real danger not fully captured.",
    },
    commonMistake: {
      fr: "Croire que cette formule d'approximation est exacte quelle que soit l'ampleur du mouvement de marché.",
      en: "Believing this approximation formula is exact whatever the market move's magnitude.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-pnl-vocab",
  conceptId: "m07-pnl-delta-hedging",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La volatilité effectivement observée sur le sous-jacent pendant la durée de vie de l'option, mesurée a posteriori, s'appelle la volatilité ______.",
      en: "The volatility actually observed on the underlying during the option's life, measured after the fact, is called ______ volatility.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["realisee", "réalisée", "realized"],
    hint: { fr: "Par opposition à la volatilité « implicite » du prix de marché.", en: "As opposed to the market price's \"implied\" volatility." },
    explanation: {
      fr: "La volatilité réalisée est mesurée a posteriori sur les mouvements effectifs du sous-jacent, contrairement à la volatilité implicite qui est extraite des prix d'options cotés aujourd'hui.",
      en: "Realized volatility is measured after the fact on the underlying's actual moves, unlike implied volatility, which is extracted from today's quoted option prices.",
    },
    commonMistake: {
      fr: "Confondre volatilité réalisée et volatilité implicite, deux concepts distincts dont l'écart détermine le P&L du vendeur d'options couvert.",
      en: "Confusing realized and implied volatility, two distinct concepts whose gap determines the hedged option seller's P&L.",
    },
  }),
};

export const templates: QuestionTemplate[] = [periodPnlNumericTemplate, sellerProfitableTemplate, discreteGapTemplate, vocabTemplate];
