import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const gbmNumericTemplate: QuestionTemplate = {
  id: "m06-gbm-calcul",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const muPct = randomInt(rng, 2, 12);
    const sigmaPct = randomInt(rng, 10, 40);
    const t = 1;
    const Wt = randomFloat(rng, -1, 1, 2);
    const mu = muPct / 100;
    const sigma = sigmaPct / 100;
    const St = Math.round(S0 * Math.exp((mu - (sigma * sigma) / 2) * t + sigma * Wt) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0=${S0}, μ=${muPct}%, σ=${sigmaPct}%, t=1, W_1=${fmt(Wt, "fr")}. Quelle est la valeur de S_1 selon le brownien géométrique ?`,
        en: `S0=${S0}, μ=${muPct}%, σ=${sigmaPct}%, t=1, W_1=${fmt(Wt, "en")}. What is S_1 under the geometric Brownian motion?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 1",
      hint: { fr: "S_t = S0 × exp[(μ−σ²/2)t + σW_t].", en: "S_t = S0 × exp[(μ−σ²/2)t + σW_t]." },
      numeric: { value: St, tolerance: 1 },
      calculation: {
        fr: `Exposant = (${muPct}%−${sigmaPct}%²/2)×1 + ${sigmaPct}%×${fmt(Wt, "fr")} = ${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}. S_1 = ${S0} × exp(${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}) ≈ ${fmt(St, "fr")}.`,
        en: `Exponent = (${muPct}%−${sigmaPct}%²/2)×1 + ${sigmaPct}%×${fmt(Wt, "en")} = ${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}. S_1 = ${S0} × exp(${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}) ≈ ${fmt(St, "en")}.`,
      },
      explanation: {
        fr: "N'oubliez jamais la correction d'Itô −σ²/2 dans l'exposant, qui distingue le brownien géométrique d'une simple exponentielle du brownien arithmétique.",
        en: "Never forget the Itô correction −σ²/2 in the exponent, which distinguishes geometric Brownian motion from a simple exponential of arithmetic Brownian motion.",
      },
      commonMistake: {
        fr: "Oublier la correction −σ²/2 et utiliser directement exp(μt + σW_t).",
        en: "Forgetting the −σ²/2 correction and directly using exp(μt + σW_t).",
      },
    };
  },
};

const canGoNegativeTemplate: QuestionTemplate = {
  id: "m06-gbm-negatif",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const modelType = pick(rng, ["arithmetic", "geometric"] as const);
    return {
      prompt: {
        fr: `Un processus suit un brownien ${modelType === "arithmetic" ? "arithmétique" : "géométrique"} : dX_t = μ${modelType === "arithmetic" ? "" : "X_t"}dt + σ${modelType === "arithmetic" ? "" : "X_t"}dW_t. Ce processus peut-il devenir négatif ?`,
        en: `A process follows ${modelType === "arithmetic" ? "an arithmetic" : "a geometric"} Brownian motion: dX_t = μ${modelType === "arithmetic" ? "" : "X_t"}dt + σ${modelType === "arithmetic" ? "" : "X_t"}dW_t. Can this process go negative?`,
      },
      choices: buildChoices([
        { id: "yes", label: { fr: "Oui, il peut devenir négatif", en: "Yes, it can go negative" } },
        { id: "no", label: { fr: "Non, il reste toujours positif", en: "No, it always stays positive" } },
      ]),
      hint: { fr: "Un des deux modèles a une dérive et une volatilité proportionnelles au niveau actuel.", en: "One of the two models has drift and volatility proportional to the current level." },
      correctChoiceIds: [modelType === "arithmetic" ? "yes" : "no"],
      explanation:
        modelType === "arithmetic"
          ? { fr: "Le brownien arithmétique a une dérive et une volatilité en valeur absolue, il peut donc mathématiquement devenir négatif.", en: "Arithmetic Brownian motion has drift and volatility in absolute terms, so it can mathematically go negative." }
          : { fr: "Le brownien géométrique s'écrit S_t = S0×exp(...), une exponentielle qui reste toujours strictement positive.", en: "Geometric Brownian motion is written S_t = S0×exp(...), an exponential that always stays strictly positive." },
      commonMistake: {
        fr: "Confondre les deux modèles et leur capacité (ou non) à devenir négatifs.",
        en: "Mixing up the two models and their ability (or not) to go negative.",
      },
    };
  },
};

const stockChoiceTemplate: QuestionTemplate = {
  id: "m06-gbm-choix-action",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le modèle standard pour un prix d'action en finance quantitative est le mouvement brownien géométrique, pas arithmétique.",
      en: "The standard model for a stock price in quantitative finance is geometric, not arithmetic, Brownian motion.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : le brownien géométrique garantit un prix toujours positif, une propriété indispensable pour un prix d'action, contrairement au brownien arithmétique.",
      en: "True: geometric Brownian motion guarantees an always-positive price, an essential property for a stock price, unlike arithmetic Brownian motion.",
    },
    commonMistake: {
      fr: "Croire que le choix entre les deux modèles est arbitraire ou sans conséquence pratique.",
      en: "Believing the choice between the two models is arbitrary or without practical consequence.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-gbm-vocab",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La tendance moyenne, déterministe, autour de laquelle un processus stochastique fluctue de façon aléatoire, s'appelle la ______.",
      en: "The average, deterministic trend around which a stochastic process randomly fluctuates, is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["derive", "dérive", "drift"],
    hint: { fr: "Le terme μ dans dX_t = μdt + σdW_t.", en: "The μ term in dX_t = μdt + σdW_t." },
    explanation: {
      fr: "La dérive (μ) est la composante déterministe de la dynamique, tandis que σdW_t est la composante aléatoire.",
      en: "The drift (μ) is the deterministic component of the dynamics, while σdW_t is the random component.",
    },
    commonMistake: {
      fr: "Confondre la dérive μ avec la volatilité σ, qui mesure l'amplitude des fluctuations aléatoires, pas la tendance moyenne.",
      en: "Confusing the drift μ with volatility σ, which measures the amplitude of random fluctuations, not the average trend.",
    },
  }),
};

export const templates: QuestionTemplate[] = [gbmNumericTemplate, canGoNegativeTemplate, stockChoiceTemplate, vocabTemplate];
