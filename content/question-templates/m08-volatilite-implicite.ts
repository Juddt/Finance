import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function normalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);
  return 0.5 * (1 + sign * y);
}

function normalDensity(x: number): number {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

function bsCall(S0: number, K: number, r: number, sigma: number, T: number): number {
  const d1 = (Math.log(S0 / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return S0 * normalCdf(d1) - K * Math.exp(-r * T) * normalCdf(d2);
}

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const newtonStepNumericTemplate: QuestionTemplate = {
  id: "m08-iv-newton-etape",
  conceptId: "m08-volatilite-implicite",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = 100;
    const K = 100;
    const r = 0.03;
    const T = 1;
    const trueSigma = randomInt(rng, 18, 28) / 100;
    const marketPrice = Math.round(bsCall(S0, K, r, trueSigma, T) * 100) / 100;
    const sigma0 = 0.20;
    const d1 = (Math.log(S0 / K) + (r + (sigma0 * sigma0) / 2) * T) / (sigma0 * Math.sqrt(T));
    const vega0 = S0 * normalDensity(d1) * Math.sqrt(T);
    const price0 = bsCall(S0, K, r, sigma0, T);
    const sigma1 = Math.round((sigma0 - (price0 - marketPrice) / vega0) * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `S0=K=100, r=3%, T=1. Le call cote ${fmt(marketPrice, "fr")} sur le marché. En partant de σ0=20% (prix BS=${fmt(price0, "fr")}, Vega=${fmt(vega0, "fr")}), quelle est l'estimation σ1 après une itération de Newton-Raphson ?`,
        en: `S0=K=100, r=3%, T=1. The call trades at ${fmt(marketPrice, "en")} in the market. Starting from σ0=20% (BS price=${fmt(price0, "en")}, Vega=${fmt(vega0, "en")}), what is the σ1 estimate after one Newton-Raphson iteration?`,
      },
      numericUnit: { fr: "proportion (ex. 0,21 pour 21%)", en: "proportion (e.g. 0.21 for 21%)" },
      numericTolerance: "± 0.01",
      hint: { fr: "σ1 = σ0 − (Prix_BS(σ0) − Prix_marché) / Vega(σ0).", en: "σ1 = σ0 − (Price_BS(σ0) − Market price) / Vega(σ0)." },
      numeric: { value: sigma1, tolerance: 0.01 },
      calculation: {
        fr: `σ1 = 0,20 − (${fmt(price0, "fr")}−${fmt(marketPrice, "fr")})/${fmt(vega0, "fr")} ≈ ${fmt(sigma1, "fr", 4)}.`,
        en: `σ1 = 0.20 − (${fmt(price0, "en")}−${fmt(marketPrice, "en")})/${fmt(vega0, "en")} ≈ ${fmt(sigma1, "en", 4)}.`,
      },
      explanation: {
        fr: "Une seule itération de Newton-Raphson rapproche déjà considérablement l'estimation de la vraie volatilité implicite, grâce à la convergence quadratique de la méthode.",
        en: "A single Newton-Raphson iteration already brings the estimate considerably closer to the true implied volatility, thanks to the method's quadratic convergence.",
      },
      commonMistake: {
        fr: "Inverser le signe de la correction (ajouter au lieu de soustraire l'écart divisé par le Vega).",
        en: "Flipping the correction's sign (adding instead of subtracting the gap divided by Vega).",
      },
    };
  },
};

const notForecastTemplate: QuestionTemplate = {
  id: "m08-iv-pas-prevision",
  conceptId: "m08-volatilite-implicite",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La volatilité implicite est une prévision statistique de la volatilité future du sous-jacent.",
      en: "Implied volatility is a statistical forecast of the underlying's future volatility.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la volatilité implicite est simplement le prix de marché de l'option exprimé dans une unité différente — elle incorpore l'offre/demande et une prime de risque, sans être une prévision statistique pure.",
      en: "False: implied volatility is simply the option's market price expressed in a different unit — it incorporates supply/demand and a risk premium, without being a pure statistical forecast.",
    },
    commonMistake: {
      fr: "Confondre volatilité implicite et prévision de volatilité future réalisée.",
      en: "Confusing implied volatility with a forecast of future realized volatility.",
    },
  }),
};

const noClosedFormTemplate: QuestionTemplate = {
  id: "m08-iv-pas-formule-fermee",
  conceptId: "m08-volatilite-implicite",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Existe-t-il une formule fermée (calculable directement, sans itération) pour extraire la volatilité implicite d'un prix d'option Black-Scholes coté ?",
      en: "Is there a closed-form formula (directly computable, without iteration) to extract implied volatility from a quoted Black-Scholes option price?",
    },
    choices: buildChoices([
      { id: "no", label: { fr: "Non, il faut résoudre numériquement (ex. Newton-Raphson)", en: "No, it must be solved numerically (e.g. Newton-Raphson)" } },
      { id: "yes", label: { fr: "Oui, en réarrangeant simplement la formule de Black-Scholes", en: "Yes, by simply rearranging the Black-Scholes formula" } },
    ]),
    hint: { fr: "La formule de Black-Scholes implique σ à travers N(d1) et N(d2), qui ne s'inversent pas analytiquement.", en: "The Black-Scholes formula involves σ through N(d1) and N(d2), which don't invert analytically." },
    correctChoiceIds: ["no"],
    explanation: {
      fr: "Non : σ apparaît de façon non linéaire dans d1 et d2, à l'intérieur de la fonction N(), ce qui empêche toute inversion analytique directe — d'où le besoin de méthodes numériques itératives.",
      en: "No: σ appears non-linearly in d1 and d2, inside the N() function, which prevents any direct analytical inversion — hence the need for iterative numerical methods.",
    },
    commonMistake: {
      fr: "Croire qu'on peut simplement \"réarranger\" la formule de Black-Scholes pour isoler σ.",
      en: "Believing one can simply \"rearrange\" the Black-Scholes formula to isolate σ.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-iv-vocab",
  conceptId: "m08-volatilite-implicite",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La méthode itérative qui utilise le Vega pour converger rapidement vers la volatilité implicite s'appelle la méthode de ______.",
      en: "The iterative method using Vega to quickly converge to implied volatility is called the ______ method.",
    },
    fillBlankPlaceholder: { fr: "deux noms propres", en: "two proper names" },
    acceptedAnswers: ["newton-raphson", "newton raphson", "newton"],
    hint: { fr: "Un nom associé à la méthode des tangentes en analyse numérique.", en: "A name associated with the tangent-line method in numerical analysis." },
    explanation: {
      fr: "La méthode de Newton-Raphson utilise le Vega (la dérivée du prix par rapport à σ) pour converger rapidement (quadratiquement) vers la volatilité implicite.",
      en: "The Newton-Raphson method uses Vega (the price's derivative with respect to σ) to quickly (quadratically) converge to implied volatility.",
    },
    commonMistake: {
      fr: "Oublier le rôle central du Vega dans cette méthode d'inversion.",
      en: "Forgetting Vega's central role in this inversion method.",
    },
  }),
};

export const templates: QuestionTemplate[] = [newtonStepNumericTemplate, notForecastTemplate, noClosedFormTemplate, vocabTemplate];
