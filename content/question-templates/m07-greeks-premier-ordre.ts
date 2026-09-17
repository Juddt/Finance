import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function normalDensity(x: number): number {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const gammaNumericTemplate: QuestionTemplate = {
  id: "m07-greeks-gamma-calcul",
  conceptId: "m07-greeks-premier-ordre",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const sigmaPct = randomInt(rng, 10, 40);
    const d1 = (randomInt(rng, -30, 30)) / 100;
    const sigma = sigmaPct / 100;
    const T = 1;
    const gamma = Math.round((normalDensity(d1) / (S0 * sigma * Math.sqrt(T))) * 100000) / 100000;

    return {
      isScenario: true,
      prompt: {
        fr: `Pour une option avec S0=${S0}, σ=${sigmaPct}%, T=1 an et d1=${d1.toFixed(2)}, quel est le Gamma ?`,
        en: `For an option with S0=${S0}, σ=${sigmaPct}%, T=1 year and d1=${d1.toFixed(2)}, what is Gamma?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.001",
      hint: { fr: "Γ = N'(d1) / (S0 × σ × √T).", en: "Γ = N'(d1) / (S0 × σ × √T)." },
      numeric: { value: gamma, tolerance: 0.001 },
      calculation: {
        fr: `N'(${d1.toFixed(2)}) ≈ ${fmt(normalDensity(d1), "fr")}. Γ = ${fmt(normalDensity(d1), "fr")} / (${S0}×${sigmaPct}%×1) ≈ ${fmt(gamma, "fr", 5)}.`,
        en: `N'(${d1.toFixed(2)}) ≈ ${fmt(normalDensity(d1), "en")}. Γ = ${fmt(normalDensity(d1), "en")} / (${S0}×${sigmaPct}%×1) ≈ ${fmt(gamma, "en", 5)}.`,
      },
      explanation: {
        fr: "Le Gamma est identique pour un call et un put de mêmes caractéristiques, une conséquence de la parité call-put.",
        en: "Gamma is identical for a call and a put with the same characteristics, a consequence of put-call parity.",
      },
      commonMistake: {
        fr: "Oublier de diviser par σ√T, ou utiliser la densité au lieu de la fonction de répartition N(x).",
        en: "Forgetting to divide by σ√T, or using the density instead of the cumulative function N(x).",
      },
    };
  },
};

const putSignTemplate: QuestionTemplate = {
  id: "m07-greeks-signe-put",
  conceptId: "m07-greeks-premier-ordre",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Quel est le signe du Delta d'un put (position longue) ?",
      en: "What is the sign of a put's Delta (long position)?",
    },
    choices: buildChoices([
      { id: "negative", label: { fr: "Toujours négatif (entre −1 et 0)", en: "Always negative (between −1 and 0)" } },
      { id: "positive", label: { fr: "Toujours positif (entre 0 et 1)", en: "Always positive (between 0 and 1)" } },
    ]),
    hint: { fr: "Que se passe-t-il pour le prix d'un put quand le sous-jacent monte ?", en: "What happens to a put's price when the underlying rises?" },
    correctChoiceIds: ["negative"],
    explanation: {
      fr: "Un put perd de la valeur quand le sous-jacent monte, donc son Delta est toujours négatif, entre −1 et 0 — l'inverse d'un call.",
      en: "A put loses value as the underlying rises, so its Delta is always negative, between −1 and 0 — the opposite of a call.",
    },
    commonMistake: {
      fr: "Croire que le Delta d'un put a le même signe que celui d'un call.",
      en: "Believing a put's Delta has the same sign as a call's.",
    },
  }),
};

const sameGammaVegaTemplate: QuestionTemplate = {
  id: "m07-greeks-gamma-vega-identiques",
  conceptId: "m07-greeks-premier-ordre",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const greek = pick(rng, ["gamma-vega", "delta-rho"] as const);
    return {
      prompt: {
        fr:
          greek === "gamma-vega"
            ? "Le Gamma et le Vega sont identiques pour un call et un put de mêmes strike, échéance et sous-jacent."
            : "Le Delta et le Rho sont identiques pour un call et un put de mêmes strike, échéance et sous-jacent.",
        en:
          greek === "gamma-vega"
            ? "Gamma and Vega are identical for a call and a put with the same strike, maturity and underlying."
            : "Delta and Rho are identical for a call and a put with the same strike, maturity and underlying.",
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [greek === "gamma-vega" ? "true" : "false"],
      explanation:
        greek === "gamma-vega"
          ? { fr: "Vrai : Gamma et Vega sont identiques pour un call et un put de mêmes caractéristiques, une conséquence de la parité call-put.", en: "True: Gamma and Vega are identical for a call and a put with the same characteristics, a consequence of put-call parity." }
          : { fr: "Faux : Delta et Rho DIFFÈRENT entre un call et un put (signes opposés notamment), contrairement à Gamma et Vega.", en: "False: Delta and Rho DIFFER between a call and a put (opposite signs notably), unlike Gamma and Vega." },
      commonMistake: {
        fr: "Généraliser à tous les Greeks une propriété qui ne vaut que pour Gamma et Vega.",
        en: "Generalizing to all Greeks a property that only holds for Gamma and Vega.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-greeks-vocab",
  conceptId: "m07-greeks-premier-ordre",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Greek qui mesure la sensibilité du prix d'une option à la volatilité, ∂V/∂σ, s'appelle le ______.",
      en: "The Greek measuring an option's price sensitivity to volatility, ∂V/∂σ, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vega"],
    hint: { fr: "Ce n'est pas une lettre grecque, contrairement aux autres Greeks classiques.", en: "Unlike the other classic Greeks, it isn't actually a Greek letter." },
    explanation: {
      fr: "Le Vega mesure la sensibilité à la volatilité — un nom qui, ironiquement, ne vient pas de l'alphabet grec contrairement à Delta, Gamma, Theta et Rho.",
      en: "Vega measures sensitivity to volatility — a name that, ironically, isn't from the Greek alphabet unlike Delta, Gamma, Theta and Rho.",
    },
    commonMistake: {
      fr: "Confondre Vega avec Gamma, qui mesure la sensibilité du Delta au sous-jacent, pas à la volatilité.",
      en: "Confusing Vega with Gamma, which measures Delta's sensitivity to the underlying, not to volatility.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m07-greeks-comprehension-utilite",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi un trader d'options a-t-il besoin de connaître les Greeks (Delta, Gamma, Vega, Theta, Rho) plutôt que de se contenter du prix de l'option seul ?",
    en: "Why does an options trader need to know the Greeks (Delta, Gamma, Vega, Theta, Rho) rather than just the option's price alone?",
  },
  choices: [
    { id: "decompose-risk", label: { fr: "Parce qu'ils décomposent le risque total de la position selon chaque facteur de marché (prix, volatilité, temps, taux), permettant de gérer et couvrir chaque risque séparément", en: "Because they decompose the position's total risk by each market factor (price, volatility, time, rate), allowing each risk to be managed and hedged separately" } },
    { id: "same-as-price", label: { fr: "Les Greeks ne sont qu'une autre façon d'exprimer le même prix, sans information supplémentaire", en: "The Greeks are just another way of expressing the same price, with no additional information" } },
    { id: "only-for-vega", label: { fr: "Ils ne servent qu'à mesurer le risque de volatilité, les autres facteurs n'ont pas besoin d'être suivis séparément", en: "They only serve to measure volatility risk, the other factors don't need to be tracked separately" } },
  ],
  correctId: "decompose-risk",
  hint: { fr: "Le prix seul est un unique chiffre ; que se passe-t-il si le trader veut savoir PRÉCISÉMENT ce qui le fait bouger ?", en: "The price alone is a single number; what if the trader wants to know PRECISELY what makes it move?" },
  explanation: {
    fr: "Le prix d'une option dépend simultanément de plusieurs facteurs (le sous-jacent, la volatilité, le temps, le taux), mais ne dit rien sur la CONTRIBUTION de chacun à un mouvement donné : les Greeks isolent la sensibilité à chaque facteur pris séparément, permettant de savoir précisément quel risque domine une position, et de le couvrir spécifiquement (par exemple, delta-hedger sans se soucier du Vega, ou inversement).",
    en: "An option's price simultaneously depends on several factors (the underlying, volatility, time, rate), but says nothing about each one's CONTRIBUTION to a given move: the Greeks isolate the sensitivity to each factor taken separately, allowing you to know precisely which risk dominates a position, and to hedge it specifically (e.g., delta-hedging without worrying about Vega, or vice versa).",
  },
  commonMistake: {
    fr: "Croire que suivre uniquement le prix de l'option suffit à gérer son risque, en négligeant que ce prix agrège plusieurs sources de risque distinctes.",
    en: "Believing tracking only the option's price is enough to manage its risk, neglecting that this price aggregates several distinct risk sources.",
  },
});

const deltaByMoneynessComparisonTemplate = mcqTemplate({
  id: "m07-greeks-comparaison-delta-moneyness",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "medium",
  prompt: {
    fr: "Comparez le Delta approximatif d'un call profondément ITM, d'un call ATM, et d'un call profondément OTM. Quel est l'ordre typique de ces trois valeurs ?",
    en: "Compare the approximate Delta of a deep ITM call, an ATM call, and a deep OTM call. What is the typical order of these three values?",
  },
  choices: [
    { id: "itm-high-otm-low", label: { fr: "ITM proche de 1, ATM proche de 0,5, OTM proche de 0", en: "ITM close to 1, ATM close to 0.5, OTM close to 0" } },
    { id: "all-same", label: { fr: "Les trois sont toujours proches de 0,5, quel que soit le niveau de moneyness", en: "All three are always close to 0.5, whatever the moneyness level" } },
    { id: "reversed", label: { fr: "ITM proche de 0, ATM proche de 0,5, OTM proche de 1", en: "ITM close to 0, ATM close to 0.5, OTM close to 1" } },
  ],
  correctId: "itm-high-otm-low",
  hint: { fr: "Le Delta = N(d1) approche 1 quand l'exercice devient quasi certain, et 0 quand il devient quasi improbable.", en: "Delta = N(d1) approaches 1 when exercise becomes near certain, and 0 when it becomes near improbable." },
  explanation: {
    fr: "Le Delta d'un call (N(d1)) évolue de façon monotone avec le niveau de moneyness : proche de 1 pour une option profondément ITM (l'exercice est quasi certain, l'option se comporte presque comme le sous-jacent lui-même), proche de 0,5 exactement à la monnaie, et proche de 0 pour une option profondément OTM (l'exercice est quasi improbable, l'option réagit à peine aux mouvements du sous-jacent).",
    en: "A call's Delta (N(d1)) moves monotonically with the moneyness level: close to 1 for a deep ITM option (exercise is near certain, the option behaves almost like the underlying itself), close to 0.5 exactly at the money, and close to 0 for a deep OTM option (exercise is near improbable, the option barely reacts to the underlying's moves).",
  },
  commonMistake: {
    fr: "Croire que le Delta reste toujours proche de 0,5, en oubliant qu'il évolue continuellement avec le niveau de moneyness de l'option.",
    en: "Believing Delta always stays close to 0.5, forgetting it continuously evolves with the option's moneyness level.",
  },
});

const whatIfNearExpiryAtmTemplate = mcqTemplate({
  id: "m07-greeks-whatif-proche-echeance-atm",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "hard",
  prompt: {
    fr: "Pour une option exactement à la monnaie (ATM), que devient le Gamma à mesure que l'échéance approche (T→0) ?",
    en: "For an exactly at-the-money (ATM) option, what happens to Gamma as expiry approaches (T→0)?",
  },
  choices: [
    { id: "spikes", label: { fr: "Il augmente fortement, tendant vers l'infini : le Delta d'une option ATM proche de l'échéance devient extrêmement sensible au moindre mouvement du sous-jacent", en: "It increases sharply, tending toward infinity: an ATM option's Delta near expiry becomes extremely sensitive to the slightest underlying move" } },
    { id: "vanishes", label: { fr: "Il tend vers zéro à mesure que l'échéance approche", en: "It tends toward zero as expiry approaches" } },
    { id: "unchanged", label: { fr: "Il reste constant, indépendamment du temps restant", en: "It stays constant, independent of remaining time" } },
  ],
  correctId: "spikes",
  hint: { fr: "Γ = N'(d1)/(S0σ√T) : que devient le dénominateur quand T→0 ?", en: "Γ = N'(d1)/(S0σ√T): what happens to the denominator as T→0?" },
  explanation: {
    fr: "Le dénominateur de la formule du Gamma, S0×σ×√T, tend vers zéro quand T→0, faisant exploser le Gamma pour une option ATM proche de l'échéance : un mouvement infime du sous-jacent fait alors basculer brutalement l'option entre \"quasi certaine d'être exercée\" et \"quasi certaine de ne pas l'être\", rendant sa couverture par delta-hedging extrêmement délicate — un phénomène similaire au pic de Gamma près d'une barrière (M10-2).",
    en: "Gamma's formula denominator, S0×σ×√T, tends toward zero as T→0, making Gamma explode for a near-expiry ATM option: an infinitesimal move in the underlying then abruptly flips the option between \"near certain to be exercised\" and \"near certain not to be\", making delta-hedging extremely tricky — a phenomenon similar to the Gamma spike near a barrier (M10-2).",
  },
  commonMistake: {
    fr: "Croire que le Gamma d'une option ATM reste modéré tout au long de sa vie, en sous-estimant le pic caractéristique qui apparaît juste avant l'échéance.",
    en: "Believing an ATM option's Gamma stays moderate throughout its life, underestimating the characteristic spike that appears right before expiry.",
  },
});

const whatIfHigherVolGammaTemplate = mcqTemplate({
  id: "m07-greeks-whatif-volatilite-gamma",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "hard",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même S0, K, T), si σ augmente, que devient le Gamma d'une option ATM ?",
    en: "All else equal (same S0, K, T), if σ rises, what happens to an ATM option's Gamma?",
  },
  choices: [
    { id: "decreases", label: { fr: "Il diminue : une volatilité plus élevée \"étale\" le Gamma sur une plage de prix plus large, réduisant son pic autour de la monnaie", en: "It decreases: higher volatility \"spreads out\" Gamma over a wider price range, reducing its peak around the money" } },
    { id: "increases", label: { fr: "Il augmente avec σ", en: "It increases with σ" } },
    { id: "unaffected", label: { fr: "Le Gamma ne dépend jamais de σ", en: "Gamma never depends on σ" } },
  ],
  correctId: "decreases",
  hint: { fr: "Γ = N'(d1)/(S0σ√T) : σ apparaît aussi directement au dénominateur, en plus de son effet sur d1.", en: "Γ = N'(d1)/(S0σ√T): σ also appears directly in the denominator, in addition to its effect on d1." },
  explanation: {
    fr: "σ apparaît directement au dénominateur de la formule du Gamma : une volatilité plus élevée réduit le Gamma \"de pointe\" à la monnaie, car le marché anticipe des mouvements plus amples du sous-jacent, rendant moins brutale (plus étalée dans le temps et l'espace des prix) la transition entre ITM et OTM — l'inverse de l'effet observé quand T diminue.",
    en: "σ appears directly in Gamma's formula denominator: higher volatility reduces the \"peak\" Gamma at the money, since the market anticipates larger underlying moves, making the ITM-to-OTM transition less abrupt (more spread out in time and price space) — the opposite of the effect observed when T decreases.",
  },
  commonMistake: {
    fr: "Confondre l'effet de σ et celui de T sur le Gamma : une baisse de T augmente le Gamma ATM, tandis qu'une hausse de σ le diminue — des effets de sens opposé.",
    en: "Confusing σ's effect and T's effect on Gamma: a fall in T increases ATM Gamma, while a rise in σ decreases it — effects of opposite direction.",
  },
});

const deltaFromD1NumericTemplate: QuestionTemplate = {
  id: "m07-greeks-delta-depuis-d1-calcul",
  conceptId: "m07-greeks-premier-ordre",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const d1 = randomInt(rng, -150, 150) / 100;
    const isCall = pick(rng, [true, false] as const);
    const nD1 = normalCdf(d1);
    const delta = Math.round((isCall ? nD1 : nD1 - 1) * 10000) / 10000;

    return {
      prompt: {
        fr: `Pour un ${isCall ? "call" : "put"}, avec d1 = ${d1.toFixed(2)} (N(d1) ≈ ${fmt(nD1, "fr")}), quel est le Delta de cette option (4 décimales) ?`,
        en: `For a ${isCall ? "call" : "put"}, with d1 = ${d1.toFixed(2)} (N(d1) ≈ ${fmt(nD1, "en")}), what is this option's Delta (4 decimals)?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.01",
      hint: {
        fr: isCall ? "Δ_call = N(d1)." : "Δ_put = N(d1) − 1.",
        en: isCall ? "Δ_call = N(d1)." : "Δ_put = N(d1) − 1.",
      },
      numeric: { value: delta, tolerance: 0.01 },
      calculation: {
        fr: isCall ? `Δ = N(${d1.toFixed(2)}) ≈ ${fmt(delta, "fr")}.` : `Δ = N(${d1.toFixed(2)}) − 1 ≈ ${fmt(nD1, "fr")} − 1 ≈ ${fmt(delta, "fr")}.`,
        en: isCall ? `Δ = N(${d1.toFixed(2)}) ≈ ${fmt(delta, "en")}.` : `Δ = N(${d1.toFixed(2)}) − 1 ≈ ${fmt(nD1, "en")} − 1 ≈ ${fmt(delta, "en")}.`,
      },
      explanation: {
        fr: "Le Delta d'un call est directement N(d1) ; celui d'un put est N(d1) − 1 (voir la comparaison des deux Delta, M06). Ce calcul applique directement cette distinction à partir d'un d1 déjà connu.",
        en: "A call's Delta is directly N(d1); a put's is N(d1) − 1 (see the comparison of both Deltas, M06). This calculation directly applies this distinction from an already-known d1.",
      },
      commonMistake: {
        fr: "Oublier de soustraire 1 pour un put, ou appliquer la formule du call à un put par erreur.",
        en: "Forgetting to subtract 1 for a put, or mistakenly applying the call's formula to a put.",
      },
    };
  },
};

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

const fixedDeltaErrorTemplate = trueFalseTemplate({
  id: "m07-greeks-erreur-delta-fixe",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "medium",
  statement: {
    fr: "Le Delta d'une option, une fois calculé à l'achat, reste constant pendant toute la durée de vie de l'option, tant que le strike ne change pas.",
    en: "An option's Delta, once computed at purchase, stays constant throughout the option's life, as long as the strike doesn't change.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le Delta (N(d1)) évolue en permanence avec le prix du sous-jacent, le temps restant et la volatilité, puisque ces trois grandeurs entrent dans le calcul de d1. C'est précisément parce que le Delta change constamment qu'un delta-hedge doit être rééquilibré régulièrement (M07, delta-hedging) — un Delta figé une fois pour toutes ne protégerait plus la position après le moindre mouvement de marché.",
    en: "False: Delta (N(d1)) constantly evolves with the underlying's price, the remaining time, and volatility, since all three quantities enter d1's calculation. It's precisely because Delta constantly changes that a delta-hedge must be regularly rebalanced (M07, delta-hedging) — a Delta fixed once and for all would no longer protect the position after the slightest market move.",
  },
  commonMistake: {
    fr: "Croire que le Delta est une caractéristique fixe de l'option, calculée une seule fois, en oubliant qu'il varie en continu avec les conditions de marché.",
    en: "Believing Delta is a fixed characteristic of the option, computed once, forgetting it continuously varies with market conditions.",
  },
});

const deltaNeutralScenarioTemplate = mcqTemplate({
  id: "m07-greeks-scenario-delta-neutre",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader vend 100 calls, chacun de Delta 0,60. Combien d'actions du sous-jacent doit-il ACHETER pour rendre sa position globale delta-neutre ?",
    en: "A trader sells 100 calls, each with a Delta of 0.60. How many shares of the underlying must they BUY to make their overall position delta-neutral?",
  },
  choices: [
    { id: "sixty", label: { fr: "60 actions", en: "60 shares" } },
    { id: "hundred", label: { fr: "100 actions", en: "100 shares" } },
    { id: "six", label: { fr: "6 actions", en: "6 shares" } },
  ],
  correctId: "sixty",
  hint: { fr: "Le Delta d'une position courte sur 100 calls est −100×0,60 = −60 : il faut compenser exactement cette exposition.", en: "A short position on 100 calls has Delta −100×0.60 = −60: this exposure must be exactly offset." },
  explanation: {
    fr: "Vendre 100 calls de Delta 0,60 chacun crée une exposition Delta de −100×0,60 = −60 (position courte). Pour neutraliser cette exposition, le trader doit détenir +60 en Delta via le sous-jacent, soit acheter exactement 60 actions (le Delta d'une action étant toujours 1) : c'est le calcul de base de tout delta-hedge (M07).",
    en: "Selling 100 calls of Delta 0.60 each creates a Delta exposure of −100×0.60 = −60 (a short position). To neutralize this exposure, the trader must hold +60 in Delta via the underlying, i.e. buy exactly 60 shares (a share's Delta always being 1): the basic calculation behind any delta-hedge (M07).",
  },
  commonMistake: {
    fr: "Acheter 100 actions (le nombre de contrats) au lieu de 60 (le nombre de contrats multiplié par le Delta), en oubliant de pondérer par le Delta de chaque option.",
    en: "Buying 100 shares (the number of contracts) instead of 60 (the number of contracts multiplied by Delta), forgetting to weight by each option's Delta.",
  },
});

const vegaExposureScenarioTemplate = mcqTemplate({
  id: "m07-greeks-scenario-exposition-vega",
  conceptId: "m07-greeks-premier-ordre",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un trader veut exprimer une pure vue sur la volatilité future (sans se soucier de la direction du sous-jacent). Entre une option très profondément ITM et une option ATM de même échéance, laquelle a généralement le Vega le plus élevé, donc la plus forte exposition à ce pari ?",
    en: "A trader wants to express a pure view on future volatility (without caring about the underlying's direction). Between a very deep ITM option and an ATM option of the same maturity, which generally has the higher Vega, hence the strongest exposure to this bet?",
  },
  choices: [
    { id: "atm-higher-vega", label: { fr: "L'option ATM : le Vega est généralement maximal à la monnaie, exactement comme le Gamma", en: "The ATM option: Vega is generally maximal at the money, exactly like Gamma" } },
    { id: "itm-higher-vega", label: { fr: "L'option profondément ITM, dont le Vega est toujours plus élevé", en: "The deep ITM option, whose Vega is always higher" } },
    { id: "same-vega", label: { fr: "Les deux ont toujours exactement le même Vega", en: "Both always have exactly the same Vega" } },
  ],
  correctId: "atm-higher-vega",
  hint: { fr: "Une option ATM a la plus grande incertitude sur son issue finale (ITM ou OTM) — un lien direct avec la valeur temps maximale à la monnaie (M05).", en: "An ATM option has the greatest uncertainty about its final outcome (ITM or OTM) — a direct link to time value being maximal at the money (M05)." },
  explanation: {
    fr: "Comme le Gamma, le Vega est généralement maximal pour une option ATM : c'est là que l'incertitude sur l'issue finale de l'option (donc la sensibilité de sa valeur temps à la volatilité) est la plus grande. Une option profondément ITM ou OTM, dont l'issue est déjà presque certaine, réagit beaucoup moins à un changement de volatilité — pour un pari pur sur la volatilité, l'ATM est donc le choix le plus efficace.",
    en: "Like Gamma, Vega is generally maximal for an ATM option: this is where uncertainty about the option's final outcome (and so its time value's sensitivity to volatility) is greatest. A deep ITM or OTM option, whose outcome is already near certain, reacts much less to a volatility change — for a pure bet on volatility, ATM is therefore the most efficient choice.",
  },
  commonMistake: {
    fr: "Croire qu'une option ITM, plus chère en valeur absolue, a nécessairement une plus forte exposition à la volatilité, en confondant le niveau de prime avec la sensibilité Vega.",
    en: "Believing a pricier ITM option necessarily has stronger volatility exposure, confusing the premium level with Vega sensitivity.",
  },
});

export const templates: QuestionTemplate[] = [
  gammaNumericTemplate,
  putSignTemplate,
  sameGammaVegaTemplate,
  vocabTemplate,
  comprehensionTemplate,
  deltaByMoneynessComparisonTemplate,
  whatIfNearExpiryAtmTemplate,
  whatIfHigherVolGammaTemplate,
  deltaFromD1NumericTemplate,
  fixedDeltaErrorTemplate,
  deltaNeutralScenarioTemplate,
  vegaExposureScenarioTemplate,
];
