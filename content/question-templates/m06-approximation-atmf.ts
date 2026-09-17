import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const atmfNumericTemplate: QuestionTemplate = {
  id: "m06-atmf-calcul",
  conceptId: "m06-approximation-atmf",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 300);
    const sigmaPct = randomInt(rng, 10, 40);
    const T = randomInt(rng, 1, 4) / 4;
    const sigma = sigmaPct / 100;
    const C = Math.round(0.4 * S0 * sigma * Math.sqrt(T) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une option ATMF (K=F0) sur un sous-jacent S0=${S0}, σ=${sigmaPct}%, T=${T} an(s). Estimez son prix avec l'approximation ATMF.`,
        en: `An ATMF option (K=F0) on an underlying S0=${S0}, σ=${sigmaPct}%, T=${T} year(s). Estimate its price using the ATMF approximation.`,
      },
      numericUnit: { fr: "même devise que S0", en: "same currency as S0" },
      numericTolerance: "± 1",
      hint: { fr: "C ≈ 0,4 × S0 × σ × √T.", en: "C ≈ 0.4 × S0 × σ × √T." },
      numeric: { value: C, tolerance: 1 },
      calculation: {
        fr: `C ≈ 0,4 × ${S0} × ${sigmaPct}% × √${T} ≈ ${fmt(C, "fr")}.`,
        en: `C ≈ 0.4 × ${S0} × ${sigmaPct}% × √${T} ≈ ${fmt(C, "en")}.`,
      },
      explanation: {
        fr: "Cette approximation de calcul mental est valable uniquement pour une option à la monnaie forward (K=F0).",
        en: "This mental-math approximation is only valid for an at-the-forward-money option (K=F0).",
      },
      commonMistake: {
        fr: "Oublier la racine carrée sur T, ou utiliser σ² au lieu de σ.",
        en: "Forgetting the square root on T, or using σ² instead of σ.",
      },
    };
  },
};

const constantOriginTemplate: QuestionTemplate = {
  id: "m06-atmf-origine-constante",
  conceptId: "m06-approximation-atmf",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "D'où vient la constante \"0,4\" de l'approximation ATMF ?",
      en: "Where does the ATMF approximation's \"0.4\" constant come from?",
    },
    choices: buildChoices([
      { id: "peak", label: { fr: "1/√(2π), la hauteur du pic de la loi normale standard", en: "1/√(2π), the peak height of the standard normal distribution" } },
      { id: "arbitrary", label: { fr: "Une constante empirique calibrée sur des données de marché", en: "An empirical constant calibrated on market data" } },
    ]),
    hint: { fr: "0,3989... vous rappelle-t-il quelque chose en statistiques ?", en: "Does 0.3989... remind you of something in statistics?" },
    correctChoiceIds: ["peak"],
    explanation: {
      fr: "0,4 est l'arrondi de 1/√(2π) ≈ 0,3989, qui apparaît dans le développement de Taylor de N(x) autour de x=0 utilisé pour dériver cette approximation.",
      en: "0.4 is the rounding of 1/√(2π) ≈ 0.3989, which appears in the Taylor expansion of N(x) around x=0 used to derive this approximation.",
    },
    commonMistake: {
      fr: "Croire que cette constante est un simple ajustement empirique sans fondement mathématique précis.",
      en: "Believing this constant is a simple empirical adjustment with no precise mathematical basis.",
    },
  }),
};

const validityTemplate: QuestionTemplate = {
  id: "m06-atmf-validite",
  conceptId: "m06-approximation-atmf",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'approximation C ≈ 0,4 × S0 × σ × √T reste précise pour une option très éloignée de la monnaie (fortement ITM ou OTM).",
      en: "The approximation C ≈ 0.4 × S0 × σ × √T stays accurate for an option far from the money (deep ITM or OTM).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : cette approximation n'est valable qu'à (ou très près de) la monnaie forward K=F0 — elle devient rapidement fausse en dehors de ce cas.",
      en: "False: this approximation is only valid at (or very close to) the forward money K=F0 — it quickly becomes wrong outside that case.",
    },
    commonMistake: {
      fr: "Appliquer cette formule de calcul mental à n'importe quel strike, sans vérifier qu'on est bien à la monnaie forward.",
      en: "Applying this mental-math formula to any strike, without checking one is indeed at the forward money.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-atmf-vocab",
  conceptId: "m06-approximation-atmf",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une option ATMF a un strike K exactement égal au prix ______ du sous-jacent, pas à son prix spot.",
      en: "An ATMF option has a strike K exactly equal to the underlying's ______ price, not its spot price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["forward"],
    hint: { fr: "Le \"F\" de ATMF.", en: "The \"F\" in ATMF." },
    explanation: {
      fr: "ATMF = At-The-Money-Forward : le strike égale le prix forward F0 = S0×e^(rT), pas le spot S0.",
      en: "ATMF = At-The-Money-Forward: the strike equals the forward price F0 = S0×e^(rT), not the spot S0.",
    },
    commonMistake: {
      fr: "Confondre ATMF (K=F0) avec ATM au sens spot (K=S0), une différence subtile mais significative.",
      en: "Confusing ATMF (K=F0) with spot ATM (K=S0), a subtle but significant difference.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-atmf-comprehension-utilite",
  conceptId: "m06-approximation-atmf",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi un trader sur un desk a-t-il besoin d'une approximation de calcul mental, alors qu'il dispose généralement d'un terminal calculant Black-Scholes instantanément ?",
    en: "Why would a trader on a desk need a mental-math approximation, when they generally have a terminal computing Black-Scholes instantly?",
  },
  choices: [
    { id: "sanity-check", label: { fr: "Pour vérifier très rapidement, de tête, qu'un prix affiché ou proposé par un contrepartiste est dans le bon ordre de grandeur, sans dépendre d'un outil", en: "To very quickly check, mentally, that a price displayed or proposed by a counterparty is in the right ballpark, without relying on a tool" } },
    { id: "more-accurate", label: { fr: "Parce que cette approximation est en réalité plus précise que la formule exacte de Black-Scholes", en: "Because this approximation is actually more accurate than the exact Black-Scholes formula" } },
    { id: "no-real-use", label: { fr: "Elle n'a aucun usage réel, c'est un exercice purement académique", en: "It has no real use, it's a purely academic exercise" } },
  ],
  correctId: "sanity-check",
  hint: { fr: "Pensez à une situation où le trader n'a pas le temps ou l'accès immédiat à un outil de calcul (au téléphone, en réunion).", en: "Think of a situation where the trader has no time or immediate access to a calculation tool (on the phone, in a meeting)." },
  explanation: {
    fr: "Cette approximation permet une estimation instantanée « de tête », par exemple pour vérifier en quelques secondes qu'un prix proposé au téléphone par une contrepartie est dans le bon ordre de grandeur, sans attendre le calcul exact d'un terminal : un réflexe précieux pour détecter rapidement une erreur grossière (de saisie, de paramètre) avant qu'elle ne devienne coûteuse.",
    en: "This approximation allows an instant \"back of the envelope\" estimate, for example to check in a few seconds that a price proposed over the phone by a counterparty is in the right ballpark, without waiting for a terminal's exact calculation: a valuable reflex for quickly catching a gross error (a typo, a wrong parameter) before it becomes costly.",
  },
  commonMistake: {
    fr: "Sous-estimer l'utilité pratique d'une approximation mentale rapide, en pensant qu'un outil de calcul exact la rend toujours superflue.",
    en: "Underestimating a quick mental approximation's practical usefulness, thinking an exact calculation tool always makes it superfluous.",
  },
});

const speedVsPrecisionComparisonTemplate = mcqTemplate({
  id: "m06-atmf-comparaison-vitesse-precision",
  conceptId: "m06-approximation-atmf",
  difficulty: "medium",
  prompt: {
    fr: "Comparez l'approximation ATMF (C ≈ 0,4×S0×σ×√T) et la formule exacte de Black-Scholes, pour une option à la monnaie forward. Quel compromis distingue les deux ?",
    en: "Compare the ATMF approximation (C ≈ 0.4×S0×σ×√T) and the exact Black-Scholes formula, for an at-the-forward-money option. What trade-off distinguishes the two?",
  },
  choices: [
    { id: "speed-vs-exactness", label: { fr: "L'approximation sacrifie une petite marge de précision pour un calcul quasi instantané de tête ; la formule exacte est rigoureuse mais nécessite un outil de calcul", en: "The approximation sacrifices a small margin of precision for an almost instant mental calculation; the exact formula is rigorous but requires a calculation tool" } },
    { id: "identical", label: { fr: "Les deux donnent des résultats rigoureusement identiques dans tous les cas", en: "Both give rigorously identical results in every case" } },
    { id: "approx-always-better", label: { fr: "L'approximation est toujours strictement plus précise que la formule exacte", en: "The approximation is always strictly more accurate than the exact formula" } },
  ],
  correctId: "speed-vs-exactness",
  hint: { fr: "L'approximation est un développement de Taylor tronqué de la vraie formule : elle gagne en simplicité ce qu'elle perd en exactitude.", en: "The approximation is a truncated Taylor expansion of the real formula: it gains simplicity what it loses in exactness." },
  explanation: {
    fr: "L'approximation ATMF, dérivée d'un développement de Taylor de N(x) autour de x=0, offre un résultat très proche de la formule exacte pour une option à la monnaie forward (où l'approximation est la plus précise), au prix d'une petite marge d'erreur (généralement de l'ordre de quelques pourcents) — un compromis délibéré entre vitesse de calcul mental et exactitude parfaite.",
    en: "The ATMF approximation, derived from a Taylor expansion of N(x) around x=0, gives a result very close to the exact formula for an at-the-forward-money option (where the approximation is most accurate), at the cost of a small error margin (typically a few percent) — a deliberate trade-off between mental calculation speed and perfect exactness.",
  },
  commonMistake: {
    fr: "Croire que l'approximation est toujours parfaitement exacte, en oubliant qu'elle repose sur une simplification mathématique qui introduit une petite erreur résiduelle.",
    en: "Believing the approximation is always perfectly exact, forgetting it rests on a mathematical simplification introducing a small residual error.",
  },
});

const whatIfLargeSigmaSqrtTTemplate = mcqTemplate({
  id: "m06-atmf-whatif-grand-sigma-racine-t",
  conceptId: "m06-approximation-atmf",
  difficulty: "hard",
  prompt: {
    fr: "L'approximation ATMF repose sur un développement de Taylor valable pour un petit σ√T. Si σ√T devient très grand (volatilité très élevée et/ou échéance très longue), que devient la précision de l'approximation, même toujours à la monnaie forward ?",
    en: "The ATMF approximation rests on a Taylor expansion valid for small σ√T. If σ√T becomes very large (very high volatility and/or very long maturity), what happens to the approximation's precision, even still at the forward money?",
  },
  choices: [
    { id: "degrades", label: { fr: "Elle se dégrade : l'approximation linéaire du développement de Taylor devient de moins en moins fidèle quand σ√T s'éloigne de zéro", en: "It degrades: the Taylor expansion's linear approximation becomes less and less faithful as σ√T moves away from zero" } },
    { id: "improves", label: { fr: "Elle s'améliore avec un σ√T plus grand", en: "It improves with a larger σ√T" } },
    { id: "unaffected", label: { fr: "La précision ne dépend jamais de σ√T, seulement du fait d'être à la monnaie forward", en: "Precision never depends on σ√T, only on being at the forward money" } },
  ],
  correctId: "degrades",
  hint: { fr: "Un développement de Taylor n'est une bonne approximation que localement, près du point de développement (ici σ√T proche de 0).", en: "A Taylor expansion is only a good approximation locally, near the expansion point (here σ√T close to 0)." },
  explanation: {
    fr: "Être exactement à la monnaie forward garantit que l'approximation soit centrée au bon endroit, mais ne suffit pas à elle seule : le développement de Taylor sous-jacent n'est précis que pour un petit σ√T. Pour une option très longue (T élevé) et/ou très volatile (σ élevé), l'erreur d'approximation peut devenir significative même en restant strictement ATMF — un rappel que toute approximation a un domaine de validité, pas juste une condition (ici, K=F0).",
    en: "Being exactly at the forward money ensures the approximation is centered at the right point, but isn't enough by itself: the underlying Taylor expansion is only accurate for small σ√T. For a very long-dated (high T) and/or very volatile (high σ) option, the approximation error can become significant even while staying strictly ATMF — a reminder that any approximation has a validity domain, not just a single condition (here, K=F0).",
  },
  commonMistake: {
    fr: "Croire que le seul critère de validité de l'approximation ATMF est K=F0, en oubliant qu'elle repose aussi implicitement sur un σ√T pas trop grand.",
    en: "Believing the ATMF approximation's only validity criterion is K=F0, forgetting it also implicitly relies on σ√T not being too large.",
  },
});

const impliedVolNumericTemplate: QuestionTemplate = {
  id: "m06-atmf-vol-implicite-calcul",
  conceptId: "m06-approximation-atmf",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 300);
    const sigmaPct = randomInt(rng, 10, 40);
    const T = randomInt(rng, 1, 4) / 4;
    const sigma = sigmaPct / 100;
    const C = Math.round(0.4 * S0 * sigma * Math.sqrt(T) * 100) / 100;
    const impliedSigmaPct = Math.round((C / (0.4 * S0 * Math.sqrt(T))) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une option ATMF (K=F0) sur un sous-jacent S0=${S0}, T=${T} an(s), se négocie à un prix coté de ${C.toFixed(2)}. Quelle volatilité implicite approximative σ ce prix suggère-t-il, en % ?`,
        en: `An ATMF option (K=F0) on an underlying S0=${S0}, T=${T} year(s), trades at a quoted price of ${C.toFixed(2)}. What approximate implied volatility σ does this price suggest, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "Inversez C ≈ 0,4×S0×σ×√T : σ ≈ C / (0,4×S0×√T).", en: "Invert C ≈ 0.4×S0×σ×√T: σ ≈ C / (0.4×S0×√T)." },
      numeric: { value: impliedSigmaPct, tolerance: 0.5 },
      calculation: {
        fr: `σ ≈ ${C.toFixed(2)} / (0,4×${S0}×√${T}) ≈ ${fmt(impliedSigmaPct, "fr")}%.`,
        en: `σ ≈ ${C.toFixed(2)} / (0.4×${S0}×√${T}) ≈ ${fmt(impliedSigmaPct, "en")}%.`,
      },
      explanation: {
        fr: "Inverser l'approximation ATMF donne une estimation rapide « de tête » de la volatilité implicite d'un prix coté, sans avoir à inverser numériquement la vraie formule de Black-Scholes (qui n'a pas de solution fermée pour σ) — un raccourci utile en salle de marché.",
        en: "Inverting the ATMF approximation gives a quick \"back of the envelope\" estimate of a quoted price's implied volatility, without having to numerically invert the real Black-Scholes formula (which has no closed-form solution for σ) — a useful shortcut on a trading desk.",
      },
      commonMistake: {
        fr: "Oublier de diviser par √T en plus de 0,4×S0, ou inverser la formule de façon incorrecte.",
        en: "Forgetting to divide by √T in addition to 0.4×S0, or incorrectly inverting the formula.",
      },
    };
  },
};

const wrongTimeUnitErrorTemplate = trueFalseTemplate({
  id: "m06-atmf-erreur-unite-temps",
  conceptId: "m06-approximation-atmf",
  difficulty: "medium",
  statement: {
    fr: "Dans l'approximation C ≈ 0,4×S0×σ×√T, on peut directement utiliser T exprimé en mois (par exemple T=6 pour 6 mois) sans le convertir en années.",
    en: "In the approximation C ≈ 0.4×S0×σ×√T, T expressed in months (e.g. T=6 for 6 months) can be used directly without converting to years.",
  },
  correct: false,
  explanation: {
    fr: "Faux : σ est conventionnellement une volatilité ANNUALISÉE, donc T doit être exprimé en années dans la formule (T=0,5 pour 6 mois, pas T=6) pour que les unités soient cohérentes. Utiliser T=6 par erreur multiplierait le résultat par √12 ≈ 3,46, une erreur considérable.",
    en: "False: σ is conventionally an ANNUALIZED volatility, so T must be expressed in years in the formula (T=0.5 for 6 months, not T=6) for the units to be consistent. Mistakenly using T=6 would multiply the result by √12 ≈ 3.46, a considerable error.",
  },
  commonMistake: {
    fr: "Utiliser T directement en mois ou en jours sans le convertir en années, un piège classique commun à toutes les formules utilisant une volatilité annualisée.",
    en: "Using T directly in months or days without converting to years, a classic trap common to every formula using annualized volatility.",
  },
});

const phoneCallScenarioTemplate = mcqTemplate({
  id: "m06-atmf-scenario-cotation-telephone",
  conceptId: "m06-approximation-atmf",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader reçoit au téléphone une cotation ATMF pour S0=100, σ=20%, T=1 an, et le prix annoncé par la contrepartie est de 25. Sans accès à un terminal, doit-il s'inquiéter de ce prix ?",
    en: "A trader receives a phone quote for an ATMF option with S0=100, σ=20%, T=1 year, and the counterparty announces a price of 25. With no terminal access, should they be concerned about this price?",
  },
  choices: [
    { id: "too-high", label: { fr: "Oui : l'estimation mentale ATMF donne environ 0,4×100×20%×1 = 8, très loin des 25 annoncés — probablement une erreur", en: "Yes: the ATMF mental estimate gives about 0.4×100×20%×1 = 8, far from the announced 25 — likely an error" } },
    { id: "reasonable", label: { fr: "Non, 25 est parfaitement cohérent avec ces paramètres", en: "No, 25 is perfectly consistent with these parameters" } },
    { id: "cannot-tell", label: { fr: "Impossible de se prononcer sans un terminal de calcul exact", en: "Impossible to judge without an exact calculation terminal" } },
  ],
  correctId: "too-high",
  hint: { fr: "Appliquez rapidement l'approximation mentale avec les paramètres donnés.", en: "Quickly apply the mental approximation with the given parameters." },
  explanation: {
    fr: "L'estimation ATMF donne C ≈ 0,4×100×0,20×√1 = 8 : le prix annoncé de 25 est plus de trois fois supérieur à cette estimation, un écart bien trop important pour être expliqué par la seule marge d'erreur de l'approximation. Le trader doit immédiatement suspecter une erreur (de paramètre, de devise, de conversion) et demander une clarification avant de traiter, exactement l'usage pour lequel cette approximation existe.",
    en: "The ATMF estimate gives C ≈ 0.4×100×0.20×√1 = 8: the announced price of 25 is more than three times higher than this estimate, a gap far too large to be explained by the approximation's margin of error alone. The trader should immediately suspect an error (a parameter, a currency, a conversion) and ask for clarification before trading, exactly the use case this approximation exists for.",
  },
  commonMistake: {
    fr: "Accepter un prix coté sans effectuer de vérification rapide de cohérence, exposant à des erreurs coûteuses qu'une simple estimation de tête aurait permis de détecter immédiatement.",
    en: "Accepting a quoted price with no quick consistency check, exposing to costly errors a simple mental estimate would have immediately caught.",
  },
});

const whatIfNearAtmfTemplate = mcqTemplate({
  id: "m06-atmf-whatif-proche-mais-pas-exact",
  conceptId: "m06-approximation-atmf",
  difficulty: "medium",
  prompt: {
    fr: "Un strike K est très légèrement différent du forward F0 (par exemple K = 1,01×F0), plutôt qu'exactement égal. L'approximation ATMF reste-t-elle globalement utilisable pour une estimation rapide ?",
    en: "A strike K is very slightly different from the forward F0 (e.g. K = 1.01×F0), rather than exactly equal. Does the ATMF approximation remain broadly usable for a quick estimate?",
  },
  choices: [
    { id: "roughly-usable", label: { fr: "Oui, approximativement : l'erreur reste faible pour un écart minime autour du forward, mais elle grandit à mesure que K s'éloigne de F0", en: "Yes, roughly: the error stays small for a minor gap around the forward, but grows as K moves away from F0" } },
    { id: "totally-invalid", label: { fr: "Non, l'approximation devient immédiatement totalement invalide dès que K ≠ F0 exactement", en: "No, the approximation immediately becomes totally invalid as soon as K ≠ F0 exactly" } },
    { id: "no-change", label: { fr: "Cela ne change absolument rien à la précision, quelle que soit l'ampleur de l'écart", en: "It makes absolutely no difference to the precision, whatever the size of the gap" } },
  ],
  correctId: "roughly-usable",
  hint: { fr: "Une approximation basée sur un développement de Taylor se dégrade progressivement, pas brutalement, en s'éloignant du point de développement.", en: "An approximation based on a Taylor expansion degrades gradually, not abruptly, as you move away from the expansion point." },
  explanation: {
    fr: "Comme toute approximation de premier ordre, la précision de l'approximation ATMF se dégrade progressivement (pas de façon brutale) à mesure que K s'éloigne de F0 : pour un écart minime, elle reste une estimation grossière raisonnable, mais elle devient franchement inadaptée pour une option nettement ITM ou OTM (voir la mise en garde de validité ci-dessus).",
    en: "Like any first-order approximation, the ATMF approximation's precision degrades gradually (not abruptly) as K moves away from F0: for a minor gap, it remains a reasonable rough estimate, but becomes clearly unsuited for a clearly ITM or OTM option (see the validity warning above).",
  },
  commonMistake: {
    fr: "Traiter la condition K=F0 comme un interrupteur tout-ou-rien plutôt que comme une dégradation progressive de la précision à mesure que l'on s'en éloigne.",
    en: "Treating the K=F0 condition as an all-or-nothing switch rather than a gradual degradation in precision as one moves away from it.",
  },
});

const juniorSanityCheckScenarioTemplate = mcqTemplate({
  id: "m06-atmf-scenario-verification-junior",
  conceptId: "m06-approximation-atmf",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un junior soumet un prix de call ATMF calculé via Black-Scholes complet (S0=200, σ=25%, T=0,5 an), obtenant 14,50. Un senior veut vérifier ce résultat en quelques secondes, sans relancer le calcul complet. Que fait-il ?",
    en: "A junior submits an ATMF call price computed via full Black-Scholes (S0=200, σ=25%, T=0.5 year), getting 14.50. A senior wants to verify this result in a few seconds, without rerunning the full calculation. What do they do?",
  },
  choices: [
    { id: "use-atmf-check", label: { fr: "Appliquer l'approximation ATMF de tête (≈0,4×200×25%×√0,5 ≈ 14,1) et comparer : l'écart avec 14,50 est faible, le résultat du junior semble cohérent", en: "Mentally apply the ATMF approximation (≈0.4×200×25%×√0.5 ≈ 14.1) and compare: the gap with 14.50 is small, the junior's result looks consistent" } },
    { id: "must-recompute", label: { fr: "Il doit obligatoirement relancer le calcul Black-Scholes complet, aucun raccourci n'est fiable", en: "They must necessarily rerun the full Black-Scholes calculation, no shortcut is reliable" } },
    { id: "guess", label: { fr: "Il ne peut que deviner au hasard si le résultat est correct", en: "They can only randomly guess whether the result is correct" } },
  ],
  correctId: "use-atmf-check",
  hint: { fr: "C'est exactement le cas d'usage classique de cette approximation : une vérification rapide, pas un calcul de précision.", en: "This is exactly this approximation's classic use case: a quick check, not a precision calculation." },
  explanation: {
    fr: "L'approximation ATMF donne ici ≈14,1, très proche des 14,50 soumis par le junior : cet écart faible (de l'ordre de la marge d'erreur normale de l'approximation) permet au senior de valider rapidement, sans recalcul complet, que le résultat est dans le bon ordre de grandeur — exactement l'usage de vérification rapide (sanity check) pour lequel cette approximation a été conçue.",
    en: "The ATMF approximation gives ≈14.1 here, very close to the 14.50 submitted by the junior: this small gap (within the approximation's normal error margin) lets the senior quickly validate, without a full recalculation, that the result is in the right ballpark — exactly the quick sanity-check use case this approximation was designed for.",
  },
  commonMistake: {
    fr: "Négliger cette vérification rapide disponible et devoir systématiquement relancer un calcul complet pour valider chaque résultat soumis, perdant un temps précieux en salle de marché.",
    en: "Neglecting this available quick check and having to systematically rerun a full calculation to validate every submitted result, wasting valuable trading-desk time.",
  },
});

export const templates: QuestionTemplate[] = [
  atmfNumericTemplate,
  constantOriginTemplate,
  validityTemplate,
  vocabTemplate,
  comprehensionTemplate,
  speedVsPrecisionComparisonTemplate,
  whatIfLargeSigmaSqrtTTemplate,
  whatIfNearAtmfTemplate,
  impliedVolNumericTemplate,
  wrongTimeUnitErrorTemplate,
  phoneCallScenarioTemplate,
  juniorSanityCheckScenarioTemplate,
];
