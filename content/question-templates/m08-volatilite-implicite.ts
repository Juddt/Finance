import { randomInt, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

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

const comprehensionTemplate = mcqTemplate({
  id: "m08-iv-comprehension",
  conceptId: "m08-volatilite-implicite",
  difficulty: "easy",
  prompt: {
    fr: "Que représente concrètement la volatilité implicite d'une option ?",
    en: "What does an option's implied volatility concretely represent?",
  },
  choices: [
    { id: "price-in-vol-units", label: { fr: "Le prix de marché de l'option, réexprimé dans l'unité \"volatilité\" via le modèle Black-Scholes", en: "The option's market price, re-expressed in \"volatility\" units via the Black-Scholes model" } },
    { id: "historical-avg", label: { fr: "La moyenne historique des volatilités réalisées passées de l'actif", en: "The historical average of the asset's past realized volatilities" } },
    { id: "risk-free-rate", label: { fr: "Une estimation du taux sans risque implicite dans le prix de l'option", en: "An estimate of the risk-free rate implicit in the option's price" } },
  ],
  correctId: "price-in-vol-units",
  hint: { fr: "On \"inverse\" Black-Scholes : on connaît le prix, on cherche le σ qui le reproduit.", en: "You \"invert\" Black-Scholes: you know the price, you look for the σ that reproduces it." },
  explanation: {
    fr: "La volatilité implicite est le σ qu'il faut injecter dans la formule de Black-Scholes pour retrouver exactement le prix de marché coté de l'option : c'est une façon de reformuler un prix en unité de volatilité, ce qui permet de comparer des options de strikes, maturités ou sous-jacents différents.",
    en: "Implied volatility is the σ that must be plugged into the Black-Scholes formula to exactly reproduce the option's quoted market price: it is a way to restate a price in volatility units, which allows comparing options across different strikes, maturities, or underlyings.",
  },
  commonMistake: {
    fr: "Croire que la volatilité implicite est une statistique historique calculée sur les rendements passés du sous-jacent.",
    en: "Believing implied volatility is a historical statistic computed from the underlying's past returns.",
  },
});

const comparisonVegaPrecisionTemplate = mcqTemplate({
  id: "m08-iv-comparaison-vega-precision",
  conceptId: "m08-volatilite-implicite",
  difficulty: "medium",
  prompt: {
    fr: "Pour extraire une volatilité implicite fiable, vaut-il mieux utiliser une option ATM (Vega élevé) ou une option très en dehors de la monnaie (Vega quasi nul) ?",
    en: "To extract a reliable implied volatility, is it better to use an ATM option (high Vega) or a deep out-of-the-money option (near-zero Vega)?",
  },
  choices: [
    { id: "atm-better", label: { fr: "L'option ATM : un Vega élevé rend l'extraction peu sensible aux petites erreurs de prix coté", en: "The ATM option: a high Vega makes the extraction relatively insensitive to small errors in the quoted price" } },
    { id: "otm-better", label: { fr: "L'option très OTM, car son prix est plus faible donc plus précis", en: "The deep OTM option, because its price is lower and therefore more precise" } },
    { id: "no-difference", label: { fr: "Aucune différence, le Vega n'intervient pas dans la qualité de l'extraction", en: "No difference, Vega plays no role in extraction quality" } },
  ],
  correctId: "atm-better",
  hint: { fr: "ΔIV ≈ ΔPrix / Vega : que se passe-t-il si le Vega au dénominateur est proche de zéro ?", en: "ΔIV ≈ ΔPrice / Vega: what happens if the Vega in the denominator is close to zero?" },
  explanation: {
    fr: "Comme ΔIV ≈ ΔPrix / Vega, une option avec un Vega faible (très ITM ou très OTM) amplifie fortement toute petite erreur de prix coté en une grande erreur de volatilité implicite : les options proches de la monnaie, au Vega élevé, donnent une extraction bien mieux conditionnée numériquement.",
    en: "Since ΔIV ≈ ΔPrice / Vega, an option with low Vega (deep ITM or deep OTM) strongly amplifies any small quoted-price error into a large implied volatility error: near-the-money options, with high Vega, give a much better-conditioned numerical extraction.",
  },
  commonMistake: {
    fr: "Penser que le choix du strike n'a aucun impact sur la précision numérique de la volatilité implicite extraite.",
    en: "Thinking the strike choice has no impact on the numerical precision of the extracted implied volatility.",
  },
});

const whatIfNearZeroVegaTemplate = mcqTemplate({
  id: "m08-iv-what-if-vega-quasi-nul",
  conceptId: "m08-volatilite-implicite",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "On tente d'extraire la volatilité implicite d'une option très profondément dans la monnaie, dont le Vega est proche de zéro. Que risque-t-il de se passer avec une méthode de Newton-Raphson ?",
    en: "Someone tries to extract the implied volatility of a deep in-the-money option, whose Vega is close to zero. What is likely to happen with a Newton-Raphson method?",
  },
  choices: [
    { id: "instability", label: { fr: "La convergence devient lente, instable ou peut diverger, car chaque pas divise par un Vega proche de zéro", en: "Convergence becomes slow, unstable, or can diverge, since each step divides by a near-zero Vega" } },
    { id: "instant-convergence", label: { fr: "La méthode converge encore plus vite qu'avec une option ATM", en: "The method converges even faster than with an ATM option" } },
    { id: "no-impact", label: { fr: "Le Vega n'intervient pas dans les itérations de Newton-Raphson", en: "Vega plays no role in Newton-Raphson iterations" } },
  ],
  correctId: "instability",
  hint: { fr: "σ1 = σ0 − (Prix−Marché)/Vega : un Vega minuscule au dénominateur produit un grand pas, potentiellement incontrôlé.", en: "σ1 = σ0 − (Price−Market)/Vega: a tiny Vega in the denominator produces a large, potentially uncontrolled step." },
  explanation: {
    fr: "Chaque itération de Newton-Raphson divise l'écart de prix par le Vega courant : avec un Vega quasi nul, ce pas devient énorme et incontrôlé, ce qui peut faire diverger ou osciller la méthode — les praticiens utilisent alors des méthodes plus robustes (bissection) ou évitent simplement ces strikes extrêmes pour l'extraction.",
    en: "Each Newton-Raphson iteration divides the price gap by the current Vega: with near-zero Vega, this step becomes huge and uncontrolled, which can make the method diverge or oscillate — practitioners then use more robust methods (bisection) or simply avoid these extreme strikes for extraction.",
  },
  commonMistake: {
    fr: "Supposer que Newton-Raphson converge toujours de façon fiable, quel que soit le Vega de l'option utilisée.",
    en: "Assuming Newton-Raphson always converges reliably, regardless of the Vega of the option used.",
  },
});

const whatIfBelowIntrinsicTemplate = mcqTemplate({
  id: "m08-iv-what-if-prix-sous-intrinseque",
  conceptId: "m08-volatilite-implicite",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un prix de marché coté pour un call est strictement inférieur à sa valeur intrinsèque (S0 − K actualisé). Peut-on en extraire une volatilité implicite positive ?",
    en: "A quoted market price for a call is strictly below its intrinsic value (discounted S0 − K). Can a positive implied volatility be extracted from it?",
  },
  choices: [
    { id: "no-arbitrage", label: { fr: "Non : ce prix viole une borne d'arbitrage du modèle, aucune volatilité positive ne peut le reproduire", en: "No: this price violates a no-arbitrage bound of the model, no positive volatility can reproduce it" } },
    { id: "yes-negative", label: { fr: "Oui, on obtient simplement une volatilité implicite négative", en: "Yes, one simply obtains a negative implied volatility" } },
    { id: "yes-zero", label: { fr: "Oui, la méthode converge toujours vers exactement 0%", en: "Yes, the method always converges to exactly 0%" } },
  ],
  correctId: "no-arbitrage",
  hint: { fr: "Le prix Black-Scholes d'un call est une fonction strictement croissante de σ, dont la limite quand σ→0 est la valeur intrinsèque actualisée.", en: "The Black-Scholes call price is a strictly increasing function of σ, whose limit as σ→0 is the discounted intrinsic value." },
  explanation: {
    fr: "Le prix Black-Scholes d'un call est une fonction strictement croissante de σ qui tend vers la valeur intrinsèque actualisée quand σ→0 : un prix de marché en dessous de cette borne ne peut être reproduit par aucun σ ≥ 0, ce qui signale une opportunité d'arbitrage ou une donnée de marché erronée plutôt qu'un problème numérique à résoudre.",
    en: "The Black-Scholes call price is a strictly increasing function of σ that tends to the discounted intrinsic value as σ→0: a market price below this bound cannot be reproduced by any σ ≥ 0, signaling an arbitrage opportunity or a bad market data point rather than a numerical problem to solve.",
  },
  commonMistake: {
    fr: "Lancer une méthode d'inversion numérique sur un prix qui viole les bornes d'arbitrage, en espérant qu'elle produise un résultat interprétable.",
    en: "Running a numerical inversion method on a price that violates the arbitrage bounds, hoping it produces an interpretable result.",
  },
});

const errorPropagationNumericTemplate: QuestionTemplate = {
  id: "m08-iv-calcul-propagation-erreur",
  conceptId: "m08-volatilite-implicite",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const vega = randomFloat(rng, 15, 40, 1);
    const priceError = randomFloat(rng, 0.05, 0.3, 2);
    const ivErrorPct = Math.round(((priceError / vega) * 10000)) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une option a un Vega de ${fmt(vega, "fr", 1)} (variation de prix pour 1 point de volatilité, en %). Le prix de marché coté comporte une erreur de ${fmt(priceError, "fr")}. Quelle erreur approximative cela induit-il sur la volatilité implicite extraite, en points de % ?`,
        en: `An option has a Vega of ${fmt(vega, "en", 1)} (price change per 1 vol point, in %). The quoted market price contains an error of ${fmt(priceError, "en")}. What approximate error does this induce on the extracted implied volatility, in percentage points?`,
      },
      numericUnit: { fr: "points de %", en: "percentage points" },
      numericTolerance: "± 0.1",
      hint: { fr: "ΔIV ≈ ΔPrix / Vega, où Vega est exprimé par point de volatilité.", en: "ΔIV ≈ ΔPrice / Vega, where Vega is expressed per volatility point." },
      numeric: { value: ivErrorPct, tolerance: 0.1 },
      calculation: {
        fr: `ΔIV ≈ ΔPrix / Vega = ${fmt(priceError, "fr")} / ${fmt(vega, "fr", 1)} ≈ ${fmt(ivErrorPct / 100, "fr", 4)}, soit ≈ ${fmt(ivErrorPct, "fr")} points de %.`,
        en: `ΔIV ≈ ΔPrice / Vega = ${fmt(priceError, "en")} / ${fmt(vega, "en", 1)} ≈ ${fmt(ivErrorPct / 100, "en", 4)}, i.e. ≈ ${fmt(ivErrorPct, "en")} percentage points.`,
      },
      explanation: {
        fr: "Le Vega joue le rôle de \"taux de change\" local entre erreur de prix et erreur de volatilité implicite : approximer cette propagation par ΔIV ≈ ΔPrix / Vega permet d'anticiper, sans relancer toute la procédure d'inversion, à quel point une imprécision de cotation dégrade la fiabilité de l'IV extraite.",
        en: "Vega acts as a local \"exchange rate\" between price error and implied volatility error: approximating this propagation as ΔIV ≈ ΔPrice / Vega lets you anticipate, without rerunning the whole inversion procedure, how much a quoting imprecision degrades the reliability of the extracted IV.",
      },
      commonMistake: {
        fr: "Oublier que le Vega doit être exprimé par la même unité de variation de volatilité (ex. par point de %) que celle demandée dans la réponse.",
        en: "Forgetting that Vega must be expressed per the same volatility change unit (e.g. per percentage point) as requested in the answer.",
      },
    };
  },
};

const newtonAlwaysConvergesMistakeTemplate = trueFalseTemplate({
  id: "m08-iv-erreur-newton-converge-toujours",
  conceptId: "m08-volatilite-implicite",
  difficulty: "medium",
  statement: {
    fr: "La méthode de Newton-Raphson pour extraire la volatilité implicite converge toujours, quel que soit le Vega de l'option et le point de départ choisi.",
    en: "The Newton-Raphson method for extracting implied volatility always converges, regardless of the option's Vega and the chosen starting point.",
  },
  correct: false,
  hint: { fr: "Chaque pas divise par le Vega courant : que se passe-t-il si celui-ci est très petit ?", en: "Each step divides by the current Vega: what happens if it is very small?" },
  explanation: {
    fr: "Faux : la convergence de Newton-Raphson dépend du Vega (un Vega quasi nul produit des pas instables) et du point de départ — en pratique, les moteurs de pricing combinent souvent Newton-Raphson avec une méthode de secours plus robuste (bissection) pour garantir un résultat même dans les cas difficiles.",
    en: "False: Newton-Raphson's convergence depends on Vega (a near-zero Vega produces unstable steps) and on the starting point — in practice, pricing engines often combine Newton-Raphson with a more robust fallback method (bisection) to guarantee a result even in difficult cases.",
  },
  commonMistake: {
    fr: "Faire confiance aveuglément à Newton-Raphson sans mécanisme de repli pour les cas à faible Vega ou mal initialisés.",
    en: "Blindly trusting Newton-Raphson with no fallback mechanism for low-Vega or poorly-initialized cases.",
  },
});

const marketMakerQuoteScenarioTemplate = mcqTemplate({
  id: "m08-iv-scenario-market-maker-cotation",
  conceptId: "m08-volatilite-implicite",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un market maker d'options cote systématiquement ses prix en termes de volatilité implicite plutôt qu'en prix bruts (ex. \"j'achète à 18%, je vends à 19%\"). Quel est l'intérêt principal de cette pratique ?",
    en: "An options market maker systematically quotes prices in implied volatility terms rather than raw prices (e.g. \"I buy at 18%, sell at 19%\"). What is the main benefit of this practice?",
  },
  choices: [
    { id: "stable-comparable", label: { fr: "La volatilité implicite reste relativement stable et comparable dans le temps, même quand le spot bouge, contrairement au prix brut", en: "Implied volatility stays relatively stable and comparable over time, even as spot moves, unlike the raw price" } },
    { id: "avoids-greeks", label: { fr: "Cela permet d'ignorer complètement les Greeks lors de la cotation", en: "It allows completely ignoring the Greeks when quoting" } },
    { id: "no-benefit", label: { fr: "Aucun intérêt particulier, c'est une simple convention sans justification", en: "No particular benefit, it's just a convention with no justification" } },
  ],
  correctId: "stable-comparable",
  hint: { fr: "Le prix brut d'une option change automatiquement avec le spot, même sans réelle vue nouvelle sur le risque ; la volatilité implicite, elle, isole ce qui change vraiment.", en: "An option's raw price automatically changes with spot, even without any new view on risk; implied volatility isolates what actually changes." },
  explanation: {
    fr: "Le prix brut d'une option bouge mécaniquement avec le spot (effet Delta) même sans changement de vue sur le risque futur, alors que la volatilité implicite reste une mesure relativement stable et directement comparable entre strikes, maturités et jours de cotation — c'est pourquoi les salles de marché raisonnent et cotent en volatilité plutôt qu'en prix brut.",
    en: "An option's raw price moves mechanically with spot (Delta effect) even without any change in the view on future risk, while implied volatility remains a relatively stable measure directly comparable across strikes, maturities, and quoting days — which is why trading desks think and quote in volatility rather than in raw price.",
  },
  commonMistake: {
    fr: "Croire que coter en volatilité est une pure convention esthétique, sans avantage pratique par rapport à coter en prix brut.",
    en: "Believing quoting in volatility is a purely cosmetic convention, with no practical advantage over quoting in raw price.",
  },
});

const staleQuoteScenarioTemplate = mcqTemplate({
  id: "m08-iv-scenario-cotation-obsolete",
  conceptId: "m08-volatilite-implicite",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk de gestion des risques valorise son portefeuille d'options avec une volatilité implicite figée depuis trois semaines, alors que le marché a connu un choc majeur entre-temps. Quel est le risque principal de cette pratique ?",
    en: "A risk management desk values its options book using an implied volatility frozen for three weeks, while the market has gone through a major shock in the meantime. What is the main risk of this practice?",
  },
  choices: [
    { id: "mismark", label: { fr: "Le portefeuille est mal valorisé (mark erroné) et les mesures de risque (Greeks, VaR) qui en découlent sont faussées", en: "The book is mismarked (wrong valuation) and the risk measures (Greeks, VaR) derived from it are distorted" } },
    { id: "no-risk", label: { fr: "Aucun risque, la volatilité implicite ne varie jamais significativement en quelques semaines", en: "No risk, implied volatility never varies significantly over a few weeks" } },
    { id: "only-pnl", label: { fr: "Cela affecte uniquement le P&L comptable, sans conséquence sur les mesures de risque", en: "It only affects accounting P&L, with no consequence on risk measures" } },
  ],
  correctId: "mismark",
  hint: { fr: "La valorisation Black-Scholes dépend directement de σ : une IV obsolète fausse le prix ET les sensibilités calculées à partir de ce prix.", en: "Black-Scholes valuation depends directly on σ: a stale IV distorts both the price AND the sensitivities computed from that price." },
  explanation: {
    fr: "Comme le prix Black-Scholes et tous les Greeks qui en dérivent dépendent directement de σ, utiliser une volatilité implicite obsolète après un choc de marché fausse simultanément la valorisation du portefeuille et l'ensemble des mesures de risque qui s'appuient dessus — d'où l'importance de rafraîchir régulièrement les IV utilisées pour le marking.",
    en: "Since the Black-Scholes price and every Greek derived from it depend directly on σ, using a stale implied volatility after a market shock simultaneously distorts the book's valuation and every risk measure built on top of it — hence the importance of regularly refreshing the IVs used for marking.",
  },
  commonMistake: {
    fr: "Penser qu'une volatilité implicite obsolète n'affecte que l'affichage du prix, sans se propager aux mesures de risque dérivées.",
    en: "Thinking a stale implied volatility only affects the displayed price, without propagating to derived risk measures.",
  },
});

export const templates: QuestionTemplate[] = [
  newtonStepNumericTemplate,
  notForecastTemplate,
  noClosedFormTemplate,
  vocabTemplate,
  comprehensionTemplate,
  comparisonVegaPrecisionTemplate,
  whatIfNearZeroVegaTemplate,
  whatIfBelowIntrinsicTemplate,
  errorPropagationNumericTemplate,
  newtonAlwaysConvergesMistakeTemplate,
  marketMakerQuoteScenarioTemplate,
  staleQuoteScenarioTemplate,
];
