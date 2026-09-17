import { randomInt, type Rng } from "@/lib/prng";
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

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const callPriceNumericTemplate: QuestionTemplate = {
  id: "m06-formules-call-prix",
  conceptId: "m06-formules-call-put",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 60, 150);
    const K = S0;
    const rPct = randomInt(rng, 1, 6);
    const sigmaPct = randomInt(rng, 10, 40);
    const T = 1;
    const r = rPct / 100;
    const sigma = sigmaPct / 100;
    const d1 = (Math.log(S0 / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const C = Math.round((S0 * normalCdf(d1) - K * Math.exp(-r * T) * normalCdf(d2)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = K = ${S0}, r = ${rPct}%, σ = ${sigmaPct}%, T = 1 an. Quel est le prix du call européen selon Black-Scholes ?`,
        en: `S0 = K = ${S0}, r = ${rPct}%, σ = ${sigmaPct}%, T = 1 year. What is the European call price under Black-Scholes?`,
      },
      numericUnit: { fr: "même devise que S0", en: "same currency as S0" },
      numericTolerance: "± 1",
      hint: { fr: "C = S0×N(d1) − K×e^(−rT)×N(d2), avec d1=[ln(S0/K)+(r+σ²/2)T]/(σ√T), d2=d1−σ√T.", en: "C = S0×N(d1) − K×e^(−rT)×N(d2), with d1=[ln(S0/K)+(r+σ²/2)T]/(σ√T), d2=d1−σ√T." },
      numeric: { value: C, tolerance: 1 },
      calculation: {
        fr: `d1 = (0+(${rPct}%+${sigmaPct}%²/2))/${sigmaPct}% ≈ ${d1.toFixed(4)}. d2 = d1−σ ≈ ${d2.toFixed(4)}. N(d1)≈${normalCdf(d1).toFixed(4)}, N(d2)≈${normalCdf(d2).toFixed(4)}. C = ${S0}×${normalCdf(d1).toFixed(4)} − ${K}×e^(−${rPct}%)×${normalCdf(d2).toFixed(4)} ≈ ${fmt(C, "fr")}.`,
        en: `d1 = (0+(${rPct}%+${sigmaPct}%²/2))/${sigmaPct}% ≈ ${d1.toFixed(4)}. d2 = d1−σ ≈ ${d2.toFixed(4)}. N(d1)≈${normalCdf(d1).toFixed(4)}, N(d2)≈${normalCdf(d2).toFixed(4)}. C = ${S0}×${normalCdf(d1).toFixed(4)} − ${K}×e^(−${rPct}%)×${normalCdf(d2).toFixed(4)} ≈ ${fmt(C, "en")}.`,
      },
      explanation: {
        fr: "Puisque S0=K (à la monnaie), on peut aussi comparer ce résultat à l'approximation ATMF (M06-6) pour vérifier l'ordre de grandeur.",
        en: "Since S0=K (at the money), this result can also be compared to the ATMF approximation (M06-6) to check the order of magnitude.",
      },
      commonMistake: {
        fr: "Utiliser −σ²/2 au lieu de +σ²/2 dans d1, une confusion avec la formule du brownien géométrique (M06-2).",
        en: "Using −σ²/2 instead of +σ²/2 in d1, a confusion with the geometric Brownian motion formula (M06-2).",
      },
    };
  },
};

const d1InterpretationTemplate: QuestionTemplate = {
  id: "m06-formules-n-d1",
  conceptId: "m06-formules-call-put",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans la formule de Black-Scholes pour un call, à quelle grandeur financière N(d1) correspond-il ?",
      en: "In the Black-Scholes call formula, which financial quantity does N(d1) correspond to?",
    },
    choices: buildChoices([
      { id: "delta", label: { fr: "Le Delta du call", en: "The call's Delta" } },
      { id: "pd", label: { fr: "La probabilité de défaut de l'émetteur", en: "The issuer's probability of default" } },
      { id: "vega", label: { fr: "Le Vega du call", en: "The call's Vega" } },
    ]),
    hint: { fr: "C'est la sensibilité du prix de l'option à une petite variation du sous-jacent.", en: "It's the option price's sensitivity to a small change in the underlying." },
    correctChoiceIds: ["delta"],
    explanation: {
      fr: "N(d1) est exactement le Delta du call (∂C/∂S0), une interprétation qui sera reprise en détail en M07-1.",
      en: "N(d1) is exactly the call's Delta (∂C/∂S0), an interpretation covered in detail in M07-1.",
    },
    commonMistake: {
      fr: "Confondre N(d1) avec N(d2), qui est la vraie probabilité risque-neutre d'exercice.",
      en: "Confusing N(d1) with N(d2), which is the true risk-neutral exercise probability.",
    },
  }),
};

const d2ProbabilityTemplate: QuestionTemplate = {
  id: "m06-formules-n-d2",
  conceptId: "m06-formules-call-put",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "N(d2) représente la vraie probabilité risque-neutre que l'option termine dans la monnaie (S_T > K).",
      en: "N(d2) represents the true risk-neutral probability that the option ends in the money (S_T > K).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : contrairement à N(d1) (le Delta), N(d2) est la véritable probabilité risque-neutre d'exercice de l'option.",
      en: "True: unlike N(d1) (the Delta), N(d2) is the true risk-neutral probability of the option's exercise.",
    },
    commonMistake: {
      fr: "Attribuer cette interprétation probabiliste à N(d1) au lieu de N(d2).",
      en: "Attributing this probabilistic interpretation to N(d1) instead of N(d2).",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-formules-vocab",
  conceptId: "m06-formules-call-put",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "N(x) désigne la fonction de ______ de la loi normale centrée réduite.",
      en: "N(x) denotes the ______ function of the standard normal distribution.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["repartition", "répartition", "cumulative", "distribution"],
    hint: { fr: "La fonction qui donne P(Z ≤ x).", en: "The function giving P(Z ≤ x)." },
    explanation: {
      fr: "N(x) est la fonction de répartition (CDF) de la loi normale centrée réduite, toujours comprise entre 0 et 1.",
      en: "N(x) is the standard normal distribution's cumulative distribution function (CDF), always between 0 and 1.",
    },
    commonMistake: {
      fr: "Confondre la fonction de répartition N(x) avec la fonction de densité (la courbe en cloche elle-même).",
      en: "Confusing the cumulative distribution function N(x) with the density function (the bell curve itself).",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-formules-comprehension-utilite",
  conceptId: "m06-formules-call-put",
  difficulty: "medium",
  prompt: {
    fr: "Quel est l'intérêt pratique d'avoir une formule FERMÉE (Black-Scholes) pour une option vanille, plutôt que de toujours recourir à une simulation Monte-Carlo ?",
    en: "What is the practical benefit of having a CLOSED-FORM (Black-Scholes) formula for a vanilla option, rather than always resorting to Monte-Carlo simulation?",
  },
  choices: [
    { id: "instant-exact", label: { fr: "Un calcul instantané et exact (pas d'erreur statistique), essentiel pour coter des milliers d'options en continu sur un desk", en: "An instant, exact calculation (no statistical error), essential for continuously quoting thousands of options on a desk" } },
    { id: "no-benefit", label: { fr: "Aucun avantage réel, Monte-Carlo donne toujours un résultat aussi rapide et précis", en: "No real benefit, Monte-Carlo always gives an equally fast and precise result" } },
    { id: "only-teaching", label: { fr: "Un intérêt purement pédagogique, sans usage professionnel réel", en: "A purely pedagogical interest, with no real professional use" } },
  ],
  correctId: "instant-exact",
  hint: { fr: "Pensez à la vitesse de calcul et à l'absence d'erreur statistique d'une formule fermée par rapport à une simulation.", en: "Think about a closed-form formula's calculation speed and lack of statistical error compared to a simulation." },
  explanation: {
    fr: "Une formule fermée se calcule instantanément et sans aucune erreur statistique (contrairement à Monte-Carlo, dont la précision dépend du nombre de simulations, M06), ce qui est indispensable pour un desk qui doit coter et recalculer en continu des milliers d'options : Monte-Carlo n'est nécessaire que lorsqu'aucune formule fermée n'existe (produits complexes, M10-M11).",
    en: "A closed-form formula computes instantly and with no statistical error at all (unlike Monte-Carlo, whose precision depends on the number of simulations, M06), which is essential for a desk that must continuously quote and recompute thousands of options: Monte-Carlo is only needed when no closed-form formula exists (complex products, M10-M11).",
  },
  commonMistake: {
    fr: "Sous-estimer l'importance pratique d'une formule fermée en pensant que Monte-Carlo est toujours une alternative équivalente, en ignorant son coût en temps de calcul et son incertitude statistique.",
    en: "Underestimating a closed-form formula's practical importance by thinking Monte-Carlo is always an equivalent alternative, ignoring its computation time cost and statistical uncertainty.",
  },
});

const callVsPutDeltaComparisonTemplate = mcqTemplate({
  id: "m06-formules-comparaison-delta-call-put",
  conceptId: "m06-formules-call-put",
  difficulty: "hard",
  prompt: {
    fr: "Le Delta d'un call est N(d1). Par la parité call-put (M05), quel est le Delta d'un put de même strike et échéance, en fonction de N(d1) ?",
    en: "A call's Delta is N(d1). By put-call parity (M05), what is a put's Delta of the same strike and maturity, as a function of N(d1)?",
  },
  choices: [
    { id: "n-d1-minus-1", label: { fr: "N(d1) − 1, toujours négatif ou nul", en: "N(d1) − 1, always negative or zero" } },
    { id: "same-as-call", label: { fr: "Exactement le même Delta que le call, N(d1)", en: "Exactly the same Delta as the call, N(d1)" } },
    { id: "negative-n-d1", label: { fr: "−N(d1)", en: "−N(d1)" } },
  ],
  correctId: "n-d1-minus-1",
  hint: { fr: "Dérivez la parité C − P = S0 − K(1+r)^(−T) par rapport à S0 : ∂C/∂S0 − ∂P/∂S0 = 1.", en: "Differentiate parity C − P = S0 − K(1+r)^(−T) with respect to S0: ∂C/∂S0 − ∂P/∂S0 = 1." },
  explanation: {
    fr: "En dérivant la parité call-put par rapport à S0, on obtient Δ_call − Δ_put = 1, donc Δ_put = Δ_call − 1 = N(d1) − 1. Puisque N(d1) ∈ [0,1], le Delta du put est toujours compris entre −1 et 0 — cohérent avec l'intuition qu'un put gagne de la valeur quand le sous-jacent baisse (Delta négatif).",
    en: "Differentiating put-call parity with respect to S0 gives Δ_call − Δ_put = 1, so Δ_put = Δ_call − 1 = N(d1) − 1. Since N(d1) ∈ [0,1], the put's Delta is always between −1 and 0 — consistent with the intuition that a put gains value when the underlying falls (a negative Delta).",
  },
  commonMistake: {
    fr: "Croire que le Delta du put est simplement l'opposé du Delta du call (−N(d1)), en oubliant le décalage de −1 issu de la dérivation de la parité.",
    en: "Believing the put's Delta is simply the call's Delta's opposite (−N(d1)), forgetting the −1 offset coming from differentiating parity.",
  },
});

const whatIfZeroVolTemplate = mcqTemplate({
  id: "m06-formules-whatif-volatilite-nulle",
  conceptId: "m06-formules-call-put",
  difficulty: "hard",
  prompt: {
    fr: "Si la volatilité σ tend vers zéro (un sous-jacent parfaitement déterministe), vers quoi converge le prix d'un call selon Black-Scholes ?",
    en: "If volatility σ tends to zero (a perfectly deterministic underlying), what does a call's Black-Scholes price converge to?",
  },
  choices: [
    { id: "discounted-intrinsic", label: { fr: "Vers max(F0−K,0) actualisé, la valeur intrinsèque déterministe sans aucune incertitude", en: "Toward discounted max(F0−K,0), the deterministic intrinsic value with no uncertainty at all" } },
    { id: "zero-price", label: { fr: "Vers zéro, quel que soit le niveau du strike", en: "Toward zero, whatever the strike level" } },
    { id: "infinite", label: { fr: "Vers l'infini", en: "Toward infinity" } },
  ],
  correctId: "discounted-intrinsic",
  hint: { fr: "Sans volatilité, le prix futur du sous-jacent est parfaitement connu à l'avance (égal à son prix forward) : quelle incertitude reste-t-il à rémunérer ?", en: "With no volatility, the underlying's future price is perfectly known in advance (equal to its forward price): what uncertainty remains to be compensated for?" },
  explanation: {
    fr: "Sans volatilité, le sous-jacent évolue de façon parfaitement déterministe jusqu'à son prix forward F0 : il n'y a plus aucune incertitude à rémunérer par une valeur temps, donc le prix de l'option converge vers sa valeur intrinsèque actualisée max(F0−K,0)×e^{−rT}, un résultat cohérent avec l'intuition que la valeur temps disparaît quand l'incertitude disparaît.",
    en: "With no volatility, the underlying evolves perfectly deterministically toward its forward price F0: there is no more uncertainty left to compensate via time value, so the option's price converges to its discounted intrinsic value max(F0−K,0)×e^{−rT}, a result consistent with the intuition that time value vanishes when uncertainty vanishes.",
  },
  commonMistake: {
    fr: "Croire que le prix d'une option tend systématiquement vers zéro quand la volatilité tend vers zéro, en oubliant que la valeur intrinsèque (actualisée) peut rester strictement positive.",
    en: "Believing an option's price systematically tends to zero as volatility tends to zero, forgetting the (discounted) intrinsic value can remain strictly positive.",
  },
});

const whatIfNearExpiryTemplate = mcqTemplate({
  id: "m06-formules-whatif-proche-echeance",
  conceptId: "m06-formules-call-put",
  difficulty: "hard",
  prompt: {
    fr: "Quand T tend vers zéro (échéance imminente) pour un call ITM (S0 > K), vers quelles valeurs tendent N(d1) et N(d2) ?",
    en: "As T tends to zero (imminent expiry) for an ITM call (S0 > K), what values do N(d1) and N(d2) tend toward?",
  },
  choices: [
    { id: "both-one", label: { fr: "Les deux tendent vers 1 : d1 et d2 tendent tous les deux vers +∞ quand T→0 pour une option ITM", en: "Both tend toward 1: d1 and d2 both tend toward +∞ as T→0 for an ITM option" } },
    { id: "both-zero", label: { fr: "Les deux tendent vers 0", en: "Both tend toward 0" } },
    { id: "opposite", label: { fr: "N(d1) tend vers 1 tandis que N(d2) tend vers 0", en: "N(d1) tends toward 1 while N(d2) tends toward 0" } },
  ],
  correctId: "both-one",
  hint: { fr: "d1 = [ln(S0/K)+(r+σ²/2)T]/(σ√T) : pour S0>K, que devient le numérateur (positif et fixe) divisé par un dénominateur qui tend vers 0 ?", en: "d1 = [ln(S0/K)+(r+σ²/2)T]/(σ√T): for S0>K, what happens to the numerator (positive and fixed) divided by a denominator tending to 0?" },
  explanation: {
    fr: "Pour une option ITM (ln(S0/K) > 0), le numérateur de d1 (et de d2) reste positif tandis que le dénominateur σ√T tend vers 0 : les deux quantités divergent vers +∞, donc N(d1) et N(d2) tendent tous les deux vers 1. Le prix de l'option converge alors vers S0 − K×e^{−rT} → S0 − K, exactement la valeur intrinsèque, cohérent avec la disparition de la valeur temps à l'échéance (M05-2).",
    en: "For an ITM option (ln(S0/K) > 0), d1's (and d2's) numerator stays positive while the denominator σ√T tends to 0: both quantities diverge toward +∞, so N(d1) and N(d2) both tend toward 1. The option's price then converges to S0 − K×e^{−rT} → S0 − K, exactly the intrinsic value, consistent with time value vanishing at expiry (M05-2).",
  },
  commonMistake: {
    fr: "Croire que N(d1) et N(d2) se comportent différemment près de l'échéance, en oubliant que pour une option nettement ITM (ou OTM), les deux convergent vers la même limite (1 ou 0).",
    en: "Believing N(d1) and N(d2) behave differently near expiry, forgetting that for a clearly ITM (or OTM) option, both converge to the same limit (1 or 0).",
  },
});

const putPriceNumericTemplate: QuestionTemplate = {
  id: "m06-formules-put-prix-calcul",
  conceptId: "m06-formules-call-put",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 60, 150);
    const K = S0;
    const rPct = randomInt(rng, 1, 6);
    const sigmaPct = randomInt(rng, 10, 40);
    const T = 1;
    const r = rPct / 100;
    const sigma = sigmaPct / 100;
    const d1 = (Math.log(S0 / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const P = Math.round((K * Math.exp(-r * T) * normalCdf(-d2) - S0 * normalCdf(-d1)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = K = ${S0}, r = ${rPct}%, σ = ${sigmaPct}%, T = 1 an. Quel est le prix du put européen selon Black-Scholes (formule directe, pas la parité) ?`,
        en: `S0 = K = ${S0}, r = ${rPct}%, σ = ${sigmaPct}%, T = 1 year. What is the European put price under Black-Scholes (direct formula, not parity)?`,
      },
      numericUnit: { fr: "même devise que S0", en: "same currency as S0" },
      numericTolerance: "± 1",
      hint: { fr: "P = K×e^(−rT)×N(−d2) − S0×N(−d1).", en: "P = K×e^(−rT)×N(−d2) − S0×N(−d1)." },
      numeric: { value: P, tolerance: 1 },
      calculation: {
        fr: `d1≈${d1.toFixed(4)}, d2≈${d2.toFixed(4)}. N(−d1)≈${normalCdf(-d1).toFixed(4)}, N(−d2)≈${normalCdf(-d2).toFixed(4)}. P = ${K}×e^(−${rPct}%)×${normalCdf(-d2).toFixed(4)} − ${S0}×${normalCdf(-d1).toFixed(4)} ≈ ${fmt(P, "fr")}.`,
        en: `d1≈${d1.toFixed(4)}, d2≈${d2.toFixed(4)}. N(−d1)≈${normalCdf(-d1).toFixed(4)}, N(−d2)≈${normalCdf(-d2).toFixed(4)}. P = ${K}×e^(−${rPct}%)×${normalCdf(-d2).toFixed(4)} − ${S0}×${normalCdf(-d1).toFixed(4)} ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "La formule du put utilise les MÊMES d1 et d2 que le call, mais avec N(−d1) et N(−d2) au lieu de N(d1) et N(d2), et les termes S0 et K inversés — une structure miroir cohérente avec la parité call-put (M05).",
        en: "The put's formula uses the SAME d1 and d2 as the call, but with N(−d1) and N(−d2) instead of N(d1) and N(d2), and the S0 and K terms swapped — a mirror structure consistent with put-call parity (M05).",
      },
      commonMistake: {
        fr: "Utiliser N(d1) et N(d2) directement (comme pour le call) au lieu de N(−d1) et N(−d2), ou oublier d'inverser l'ordre des termes S0 et K.",
        en: "Using N(d1) and N(d2) directly (as for the call) instead of N(−d1) and N(−d2), or forgetting to swap the order of the S0 and K terms.",
      },
    };
  },
};

const wrongSignErrorTemplate = trueFalseTemplate({
  id: "m06-formules-erreur-mauvais-signe-put",
  conceptId: "m06-formules-call-put",
  difficulty: "medium",
  statement: {
    fr: "La formule du put de Black-Scholes utilise les mêmes N(d1) et N(d2) que celle du call, sans aucun changement de signe.",
    en: "The Black-Scholes put formula uses the same N(d1) and N(d2) as the call's, with no sign change at all.",
  },
  correct: false,
  explanation: {
    fr: "Faux : la formule du put utilise N(−d1) et N(−d2), pas N(d1) et N(d2) directement — un changement de signe indispensable qui découle de la symétrie de la loi normale (N(−x) = 1−N(x)) et du raisonnement de réplication propre au put (droit de vendre, pas d'acheter).",
    en: "False: the put formula uses N(−d1) and N(−d2), not N(d1) and N(d2) directly — an essential sign change stemming from the normal distribution's symmetry (N(−x) = 1−N(x)) and the replication reasoning specific to the put (the right to sell, not to buy).",
  },
  commonMistake: {
    fr: "Réutiliser directement N(d1) et N(d2) du call dans la formule du put, sans appliquer le changement de signe nécessaire.",
    en: "Directly reusing the call's N(d1) and N(d2) in the put formula, without applying the necessary sign change.",
  },
});

const deepOtmSanityCheckScenarioTemplate = mcqTemplate({
  id: "m06-formules-scenario-verification-otm-profond",
  conceptId: "m06-formules-call-put",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un quant implémente la formule Black-Scholes dans son code et teste un call très profondément OTM (S0 très inférieur à K). Que doit-il observer pour N(d1) et N(d2), comme test de cohérence (sanity check) ?",
    en: "A quant implements the Black-Scholes formula in code and tests a very deep OTM call (S0 far below K). What should they observe for N(d1) and N(d2), as a sanity check?",
  },
  choices: [
    { id: "close-to-zero", label: { fr: "Les deux doivent être proches de zéro, donnant un prix de call proche de zéro", en: "Both should be close to zero, giving a call price close to zero" } },
    { id: "close-to-one", label: { fr: "Les deux doivent être proches de un", en: "Both should be close to one" } },
    { id: "opposite-extremes", label: { fr: "N(d1) proche de un, N(d2) proche de zéro", en: "N(d1) close to one, N(d2) close to zero" } },
  ],
  correctId: "close-to-zero",
  hint: { fr: "Un call très profondément OTM a une probabilité d'exercice quasi nulle, et un Delta quasi nul.", en: "A very deep OTM call has an almost-zero exercise probability, and an almost-zero Delta." },
  explanation: {
    fr: "Pour un call très profondément OTM, ln(S0/K) est très négatif, faisant tendre d1 et d2 vers −∞ : N(d1) (le Delta) et N(d2) (la probabilité d'exercice) doivent tous deux être proches de zéro, cohérent avec l'intuition qu'un tel call a très peu de chances de finir dans la monnaie et vaut donc très peu. Si le code du quant donne un résultat très différent, c'est un signal d'erreur d'implémentation à vérifier immédiatement.",
    en: "For a very deep OTM call, ln(S0/K) is very negative, driving d1 and d2 toward −∞: N(d1) (the Delta) and N(d2) (the exercise probability) should both be close to zero, consistent with the intuition that such a call has very little chance of ending in the money and is therefore worth very little. If the quant's code gives a very different result, that's a signal of an implementation error to check immediately.",
  },
  commonMistake: {
    fr: "Ne pas effectuer de tests de cohérence sur les cas limites (très ITM, très OTM, T→0) lors de l'implémentation d'une formule de pricing, un réflexe pourtant essentiel pour détecter des erreurs de signe ou de formule.",
    en: "Not running consistency checks on edge cases (very ITM, very OTM, T→0) when implementing a pricing formula, a reflex that's nonetheless essential for catching sign or formula errors.",
  },
});

const consistencyCheckScenarioTemplate = mcqTemplate({
  id: "m06-formules-scenario-coherence-parite",
  conceptId: "m06-formules-call-put",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un développeur calcule un call et un put avec les formules directes de Black-Scholes (mêmes S0, K, r, σ, T pour les deux), puis vérifie C − P = S0 − K×e^{−rT}. Que doit-il constater si son code est correct ?",
    en: "A developer computes a call and a put with the direct Black-Scholes formulas (same S0, K, r, σ, T for both), then checks C − P = S0 − K×e^{−rT}. What should they find if their code is correct?",
  },
  choices: [
    { id: "exactly-equal", label: { fr: "L'égalité doit être exactement vérifiée (aux erreurs d'arrondi près) : c'est un test de cohérence puissant entre les deux formules et la parité", en: "The equality should hold exactly (up to rounding errors): a powerful consistency check between the two formulas and parity" } },
    { id: "approximately-only", label: { fr: "Seulement approximativement, un écart significatif est normal", en: "Only approximately, a significant gap is normal" } },
    { id: "unrelated", label: { fr: "Il n'y a aucune raison que cette égalité soit vérifiée par les formules directes", en: "There's no reason this equality should hold for the direct formulas" } },
  ],
  correctId: "exactly-equal",
  hint: { fr: "Les formules directes du call et du put ne sont pas indépendantes : elles doivent être mathématiquement cohérentes avec la parité call-put (M05).", en: "The direct call and put formulas aren't independent: they must be mathematically consistent with put-call parity (M05)." },
  explanation: {
    fr: "Les formules directes de Black-Scholes pour le call et le put sont dérivées de façon cohérente : en les combinant algébriquement, C − P se simplifie exactement en S0 − K×e^{−rT}, la relation de parité call-put (M05). Vérifier cette égalité dans une implémentation logicielle est donc un excellent test de cohérence : un écart significatif signale presque toujours une erreur de code (signe, formule) plutôt qu'un phénomène réel.",
    en: "The direct Black-Scholes formulas for the call and the put are derived consistently: combining them algebraically, C − P exactly simplifies to S0 − K×e^{−rT}, the put-call parity relationship (M05). Checking this equality in a software implementation is therefore an excellent consistency test: a significant gap almost always signals a code error (sign, formula) rather than a real phenomenon.",
  },
  commonMistake: {
    fr: "Ne pas utiliser cette vérification de cohérence disponible gratuitement lors de l'implémentation, alors qu'elle permet de détecter rapidement une erreur de signe ou de formule.",
    en: "Not using this freely available consistency check when implementing the code, when it allows quickly catching a sign or formula error.",
  },
});

export const templates: QuestionTemplate[] = [
  callPriceNumericTemplate,
  d1InterpretationTemplate,
  d2ProbabilityTemplate,
  vocabTemplate,
  comprehensionTemplate,
  callVsPutDeltaComparisonTemplate,
  whatIfZeroVolTemplate,
  whatIfNearExpiryTemplate,
  putPriceNumericTemplate,
  wrongSignErrorTemplate,
  deepOtmSanityCheckScenarioTemplate,
  consistencyCheckScenarioTemplate,
];
