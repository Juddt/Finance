import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const forwardRateNumericTemplate: QuestionTemplate = {
  id: "m03-taux-forward-calcul",
  conceptId: "m03-taux-sans-risque",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const z1Pct = randomInt(rng, 1, 6);
    const z2Pct = z1Pct + randomInt(rng, 1, 4);
    const z1 = z1Pct / 100;
    const z2 = z2Pct / 100;
    const forward = Math.round((Math.pow(1 + z2, 2) / (1 + z1) - 1) * 10000) / 100;

    return {
      prompt: {
        fr: `Le taux spot à 1 an est z1 = ${z1Pct}%, le taux spot à 2 ans est z2 = ${z2Pct}%. Quel est le taux forward implicite f_{1,2} entre l'année 1 et l'année 2, en % ?`,
        en: `The 1-year spot rate is z1 = ${z1Pct}%, the 2-year spot rate is z2 = ${z2Pct}%. What is the implied forward rate f_{1,2} between year 1 and year 2, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "(1+z2)² = (1+z1)(1+f_{1,2}).", en: "(1+z2)² = (1+z1)(1+f_{1,2})." },
      numeric: { value: forward, tolerance: 0.1 },
      calculation: {
        fr: `f_{1,2} = (1,${z2Pct.toString().padStart(2, "0")})² / (1,${z1Pct.toString().padStart(2, "0")}) − 1 ≈ ${fmt(forward, "fr")}%.`,
        en: `f_{1,2} = (1.${z2Pct.toString().padStart(2, "0")})² / (1.${z1Pct.toString().padStart(2, "0")}) − 1 ≈ ${fmt(forward, "en")}%.`,
      },
      explanation: {
        fr: "Emprunter à 2 ans directement doit coûter exactement la même chose qu'emprunter à 1 an puis reconduire l'emprunt à f_{1,2} : c'est ce qui fixe ce taux forward par non-arbitrage.",
        en: "Borrowing for 2 years directly must cost exactly the same as borrowing for 1 year then rolling at f_{1,2}: this is what pins down this forward rate by no-arbitrage.",
      },
      commonMistake: {
        fr: "Faire une simple moyenne ou différence de z1 et z2 au lieu d'appliquer la formule de non-arbitrage correcte.",
        en: "Taking a simple average or difference of z1 and z2 instead of applying the correct no-arbitrage formula.",
      },
    };
  },
};

const curveShapeTemplate: QuestionTemplate = {
  id: "m03-taux-forme-courbe",
  conceptId: "m03-taux-sans-risque",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const upward = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `La courbe des taux est ${upward ? "croissante (taux longs > taux courts)" : "inversée (taux longs < taux courts)"}. Le taux forward f_{1,2} est-il supérieur ou inférieur au taux spot z2 ?`,
        en: `The yield curve is ${upward ? "upward-sloping (long rates > short rates)" : "inverted (long rates < short rates)"}. Is the forward rate f_{1,2} above or below the spot rate z2?`,
      },
      choices: buildChoices([
        { id: "above", label: { fr: "Supérieur à z2", en: "Above z2" } },
        { id: "below", label: { fr: "Inférieur à z2", en: "Below z2" } },
      ]),
      hint: { fr: "(1+z2)² = (1+z1)(1+f_{1,2}) : comparez z1 à z2 selon la forme de la courbe.", en: "(1+z2)² = (1+z1)(1+f_{1,2}): compare z1 to z2 given the curve's shape." },
      correctChoiceIds: [upward ? "above" : "below"],
      explanation: upward
        ? { fr: "Sur une courbe croissante, z1 < z2, donc le forward doit être plus élevé que z2 pour compenser ce départ plus bas dans la moyenne géométrique.", en: "On an upward-sloping curve, z1 < z2, so the forward must be higher than z2 to compensate for that lower starting point in the geometric average." }
        : { fr: "Sur une courbe inversée, z1 > z2, donc le forward doit être plus bas que z2.", en: "On an inverted curve, z1 > z2, so the forward must be lower than z2." },
      commonMistake: {
        fr: "Croire que le taux forward est toujours égal ou proche du taux spot correspondant, indépendamment de la forme de la courbe.",
        en: "Believing the forward rate is always equal or close to the corresponding spot rate, regardless of the curve's shape.",
      },
    };
  },
};

const forecastMythTemplate: QuestionTemplate = {
  id: "m03-taux-forward-prevision",
  conceptId: "m03-taux-sans-risque",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le taux forward implicite dans la courbe des taux est, avant tout, une prévision fiable du taux spot qui sera observé à cette date future.",
      en: "The forward rate implied by the yield curve is, first and foremost, a reliable forecast of the spot rate that will be observed on that future date.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le taux forward est avant tout un résultat mécanique de non-arbitrage entre deux stratégies de placement équivalentes, pas une prévision de marché — même si son écart avec le taux futur réalisé intéresse les chercheurs.",
      en: "False: the forward rate is primarily a mechanical no-arbitrage result between two equivalent investment strategies, not a market forecast — even though its gap with the realized future rate interests researchers.",
    },
    commonMistake: {
      fr: "Faire la même confusion prévision/mécanique que pour le prix forward des matières premières.",
      en: "Making the same forecast/mechanical confusion as for commodity forward prices.",
    },
  }),
};

const proxyVocabTemplate: QuestionTemplate = {
  id: "m03-taux-proxy-vocab",
  conceptId: "m03-taux-sans-risque",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Le taux applicable à un unique flux reçu à une date T précise, tel qu'il ressort aujourd'hui de la courbe des taux, est appelé le taux ______.",
      en: "The rate applicable to a single cash flow received on a specific date T, as read off today's yield curve, is called the ______ rate.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["spot"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "Same word used in French finance jargon." },
    explanation: {
      fr: "Le taux spot z_T actualise un flux unique reçu en T, par opposition au taux forward qui porte sur une période future.",
      en: "The spot rate z_T discounts a single flow received at T, as opposed to the forward rate which applies to a future period.",
    },
    commonMistake: {
      fr: "Confondre taux spot et taux forward.",
      en: "Confusing spot rate and forward rate.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-taux-comprehension-utilite",
  conceptId: "m03-taux-sans-risque",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi actualise-t-on chaque flux futur avec un taux spot z_T spécifique à SA propre échéance, plutôt qu'avec un unique taux unique pour tous les flux ?",
    en: "Why is each future cash flow discounted with a spot rate z_T specific to ITS OWN maturity, rather than a single uniform rate for all flows?",
  },
  choices: [
    { id: "term-structure", label: { fr: "Parce que le coût de financement/placement n'est pas le même selon l'horizon (la courbe des taux n'est presque jamais parfaitement plate)", en: "Because the funding/investment cost isn't the same across horizons (the yield curve is almost never perfectly flat)" } },
    { id: "convention", label: { fr: "C'est une convention arbitraire sans réel fondement économique", en: "It's an arbitrary convention with no real economic basis" } },
    { id: "always-same", label: { fr: "En réalité un seul taux suffit toujours, la distinction est purement théorique", en: "In reality a single rate is always enough, the distinction is purely theoretical" } },
  ],
  correctId: "term-structure",
  hint: { fr: "Emprunter à 1 an et emprunter à 10 ans coûtent rarement exactement le même taux.", en: "Borrowing for 1 year and borrowing for 10 years rarely cost exactly the same rate." },
  explanation: {
    fr: "Le coût de financement dépend en général de l'horizon (structure par terme des taux) : un taux unique pour tous les flux ignorerait cette réalité de marché et donnerait un prix incohérent avec ce qui est réellement observable. Utiliser z_T propre à chaque échéance garantit un prix cohérent avec la courbe des taux effectivement cotée.",
    en: "Financing cost generally depends on the horizon (the term structure of rates): a single rate for all flows would ignore this market reality and give a price inconsistent with what's actually observable. Using a z_T specific to each maturity ensures a price consistent with the actually quoted yield curve.",
  },
  commonMistake: {
    fr: "Utiliser le même taux pour actualiser des flux d'échéances très différentes, en ignorant que la courbe des taux n'est presque jamais plate.",
    en: "Using the same rate to discount flows of very different maturities, ignoring that the yield curve is almost never flat.",
  },
});

const flatVsSteepComparisonTemplate = mcqTemplate({
  id: "m03-taux-comparaison-plate-pentue",
  conceptId: "m03-taux-sans-risque",
  difficulty: "medium",
  prompt: {
    fr: "Comparez deux courbes de taux : l'une parfaitement plate (z1 = z2 pour toutes les échéances), l'autre nettement croissante. Dans quel cas le taux forward f_{1,2} diffère-t-il le plus du taux spot z2 ?",
    en: "Compare two yield curves: one perfectly flat (z1 = z2 for all maturities), the other markedly upward-sloping. In which case does the forward rate f_{1,2} differ most from the spot rate z2?",
  },
  choices: [
    { id: "steep", label: { fr: "Sur la courbe nettement croissante : l'écart entre z1 et z2 se répercute directement sur le forward", en: "On the markedly upward-sloping curve: the gap between z1 and z2 directly carries over to the forward" } },
    { id: "flat", label: { fr: "Sur la courbe plate : le forward s'écarte toujours du spot, quelle que soit la forme de la courbe", en: "On the flat curve: the forward always departs from spot, whatever the curve's shape" } },
    { id: "always-same", label: { fr: "L'écart est toujours identique, indépendamment de la forme de la courbe", en: "The gap is always identical, independent of the curve's shape" } },
  ],
  correctId: "steep",
  hint: { fr: "Si z1 = z2 exactement, que devient la formule (1+z2)² = (1+z1)(1+f) ?", en: "If z1 = z2 exactly, what does the formula (1+z2)² = (1+z1)(1+f) become?" },
  explanation: {
    fr: "Sur une courbe parfaitement plate, z1 = z2 = f_{1,2} : le forward coïncide exactement avec le spot, aucune distorsion. Plus la courbe est pentue (écart marqué entre z1 et z2), plus le forward s'écarte du taux spot correspondant pour respecter la relation de non-arbitrage entre les deux stratégies de placement.",
    en: "On a perfectly flat curve, z1 = z2 = f_{1,2}: the forward coincides exactly with spot, no distortion. The steeper the curve (a marked gap between z1 and z2), the more the forward departs from the corresponding spot rate to satisfy the no-arbitrage relationship between the two investment strategies.",
  },
  commonMistake: {
    fr: "Croire que le taux forward s'écarte toujours significativement du taux spot, en oubliant le cas particulier (et instructif) d'une courbe plate où les deux coïncident.",
    en: "Believing the forward rate always departs significantly from the spot rate, forgetting the special (and instructive) case of a flat curve where the two coincide.",
  },
});

const whatIfFlatCurveTemplate = trueFalseTemplate({
  id: "m03-taux-whatif-courbe-plate",
  conceptId: "m03-taux-sans-risque",
  difficulty: "easy",
  statement: {
    fr: "Si la courbe des taux est parfaitement plate (z1 = z2), le taux forward f_{1,2} est exactement égal à ce taux commun.",
    en: "If the yield curve is perfectly flat (z1 = z2), the forward rate f_{1,2} is exactly equal to that common rate.",
  },
  correct: true,
  explanation: {
    fr: "Vrai : avec (1+z2)² = (1+z1)(1+f_{1,2}) et z1 = z2 = z, on obtient (1+z)² = (1+z)(1+f), donc f = z. Sur une courbe plate, le taux forward ne diffère jamais du taux spot commun, un cas limite utile pour vérifier sa compréhension de la formule.",
    en: "True: with (1+z2)² = (1+z1)(1+f_{1,2}) and z1 = z2 = z, this gives (1+z)² = (1+z)(1+f), so f = z. On a flat curve, the forward rate never differs from the common spot rate, a useful limiting case to check one's understanding of the formula.",
  },
  commonMistake: {
    fr: "Croire que le taux forward est systématiquement différent du taux spot, même dans le cas particulier d'une courbe plate.",
    en: "Believing the forward rate is systematically different from the spot rate, even in the special case of a flat curve.",
  },
});

const whatIfShortRateSpikeTemplate = mcqTemplate({
  id: "m03-taux-whatif-pic-taux-court",
  conceptId: "m03-taux-sans-risque",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une crise de liquidité fait temporairement bondir le taux spot z1 (1 an) bien au-dessus du taux z2 (2 ans), qui reste stable. Toutes choses égales par ailleurs, que devient le taux forward f_{1,2} par rapport à z2 ?",
    en: "A liquidity crunch temporarily spikes the 1-year spot rate z1 well above the 2-year rate z2, which stays stable. All else equal, what happens to the forward rate f_{1,2} relative to z2?",
  },
  choices: [
    { id: "below", label: { fr: "f_{1,2} devient inférieur à z2, potentiellement fortement", en: "f_{1,2} becomes below z2, potentially sharply" } },
    { id: "above", label: { fr: "f_{1,2} devient supérieur à z2", en: "f_{1,2} becomes above z2" } },
    { id: "unaffected", label: { fr: "f_{1,2} n'est pas affecté par un mouvement de z1", en: "f_{1,2} is unaffected by a move in z1" } },
  ],
  correctId: "below",
  hint: { fr: "(1+z2)² = (1+z1)(1+f) : si z1 grimpe fortement à z2 fixé, il faut que f compense en baissant.", en: "(1+z2)² = (1+z1)(1+f): if z1 spikes sharply with z2 fixed, f must compensate by falling." },
  explanation: {
    fr: "Puisque (1+z2)² doit rester constant (z2 stable) et que (1+z1) a fortement augmenté, le facteur (1+f_{1,2}) doit mécaniquement diminuer pour que le produit reste égal à (1+z2)² : le forward implicite chute sous z2, une conséquence directe et purement mécanique de la formule de non-arbitrage, sans lien avec une quelconque anticipation.",
    en: "Since (1+z2)² must stay constant (z2 stable) and (1+z1) has risen sharply, the factor (1+f_{1,2}) must mechanically fall so the product stays equal to (1+z2)²: the implied forward drops below z2, a direct, purely mechanical consequence of the no-arbitrage formula, unrelated to any forecast.",
  },
  commonMistake: {
    fr: "Croire qu'un choc temporaire sur le taux court n'affecte pas le taux forward calculé à partir de lui, en oubliant leur lien mécanique direct via la formule de non-arbitrage.",
    en: "Believing a temporary shock to the short rate doesn't affect the forward rate computed from it, forgetting their direct mechanical link via the no-arbitrage formula.",
  },
});

const secondYearForwardNumericTemplate: QuestionTemplate = {
  id: "m03-taux-forward-2-3-calcul",
  conceptId: "m03-taux-sans-risque",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const z2Pct = randomInt(rng, 1, 5);
    const z3Pct = z2Pct + randomInt(rng, 1, 4);
    const z2 = z2Pct / 100;
    const z3 = z3Pct / 100;
    const forward = Math.round((Math.pow(1 + z3, 3) / Math.pow(1 + z2, 2) - 1) * 10000) / 100;

    return {
      prompt: {
        fr: `Le taux spot à 2 ans est z2 = ${z2Pct}%, le taux spot à 3 ans est z3 = ${z3Pct}%. Quel est le taux forward implicite f_{2,3} entre l'année 2 et l'année 3, en % ?`,
        en: `The 2-year spot rate is z2 = ${z2Pct}%, the 3-year spot rate is z3 = ${z3Pct}%. What is the implied forward rate f_{2,3} between year 2 and year 3, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "(1+z3)³ = (1+z2)²(1+f_{2,3}).", en: "(1+z3)³ = (1+z2)²(1+f_{2,3})." },
      numeric: { value: forward, tolerance: 0.1 },
      calculation: {
        fr: `f_{2,3} = (1,${z3Pct.toString().padStart(2, "0")})³ / (1,${z2Pct.toString().padStart(2, "0")})² − 1 ≈ ${fmt(forward, "fr")}%.`,
        en: `f_{2,3} = (1.${z3Pct.toString().padStart(2, "0")})³ / (1.${z2Pct.toString().padStart(2, "0")})² − 1 ≈ ${fmt(forward, "en")}%.`,
      },
      explanation: {
        fr: "Le principe se généralise à n'importe quelle paire de périodes consécutives : le placement à 3 ans doit rapporter exactement autant que le placement à 2 ans suivi d'une reconduction 1 an à f_{2,3}, quelle que soit la période considérée.",
        en: "The principle generalizes to any pair of consecutive periods: the 3-year investment must earn exactly as much as the 2-year investment followed by a 1-year rollover at f_{2,3}, whatever the period considered.",
      },
      commonMistake: {
        fr: "Réutiliser par erreur les exposants de la relation z1/z2 (puissances 1 et 2) au lieu des exposants corrects pour cette période (puissances 2 et 3).",
        en: "Mistakenly reusing the z1/z2 relation's exponents (powers 1 and 2) instead of the correct exponents for this period (powers 2 and 3).",
      },
    };
  },
};

const arithmeticAverageErrorTemplate = trueFalseTemplate({
  id: "m03-taux-erreur-moyenne-arithmetique",
  conceptId: "m03-taux-sans-risque",
  difficulty: "medium",
  statement: {
    fr: "On peut approximer le taux forward f_{1,2} par une simple moyenne arithmétique ou une différence de z1 et z2, sans passer par la formule de composition (1+z2)² = (1+z1)(1+f).",
    en: "You can approximate the forward rate f_{1,2} with a simple arithmetic average or difference of z1 and z2, without going through the compounding formula (1+z2)² = (1+z1)(1+f).",
  },
  correct: false,
  explanation: {
    fr: "Faux : le taux forward résulte d'une relation de composition des intérêts (multiplicative), pas d'une simple opération arithmétique (additive). Une moyenne ou une différence simples donnent un résultat approximatif mais incorrect, l'écart grandissant avec le niveau des taux et l'horizon considéré.",
    en: "False: the forward rate comes from a compounding (multiplicative) relationship, not a simple arithmetic (additive) operation. A simple average or difference gives an approximate but incorrect result, with the gap growing as rate levels and the horizon considered increase.",
  },
  commonMistake: {
    fr: "Simplifier la formule de non-arbitrage en une opération linéaire, ce qui semble \"presque juste\" pour de petits taux mais devient significativement faux pour des taux ou des écarts plus importants.",
    en: "Simplifying the no-arbitrage formula into a linear operation, which seems \"almost right\" for small rates but becomes significantly wrong for larger rates or gaps.",
  },
});

const fraPricingScenarioTemplate = mcqTemplate({
  id: "m03-taux-scenario-tarification-fra",
  conceptId: "m03-taux-sans-risque",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une entreprise veut fixer aujourd'hui le taux d'un emprunt de 1 an qu'elle contractera dans 1 an (un besoin de financement futur, pas immédiat). Quel taux de référence théorique une banque utiliserait-elle pour coter ce taux à terme ?",
    en: "A company wants to lock in today the rate for a 1-year loan it will take out in 1 year (a future, not immediate, funding need). What theoretical reference rate would a bank use to quote this forward rate?",
  },
  choices: [
    { id: "forward", label: { fr: "Le taux forward implicite f_{1,2}, extrait de la courbe des taux spot actuelle", en: "The implied forward rate f_{1,2}, extracted from the current spot yield curve" } },
    { id: "current-spot", label: { fr: "Le taux spot actuel à 1 an z1, sans ajustement", en: "The current 1-year spot rate z1, with no adjustment" } },
    { id: "guess", label: { fr: "Une estimation subjective de ce que seront les taux dans 1 an", en: "A subjective guess of what rates will be in 1 year" } },
  ],
  correctId: "forward",
  hint: { fr: "C'est exactement la situation qui définit le taux forward : un taux fixé aujourd'hui pour une période qui commence dans le futur.", en: "This is exactly the situation defining the forward rate: a rate fixed today for a period starting in the future." },
  explanation: {
    fr: "Le taux forward f_{1,2} est précisément le taux théorique de non-arbitrage pour un engagement de financement futur fixé aujourd'hui : c'est le taux de référence qu'une banque utiliserait pour coter un contrat à terme sur taux (FRA, voir M04), garantissant qu'aucune des deux parties ne puisse arbitrer la différence entre ce taux et une stratégie équivalente via le marché spot.",
    en: "The forward rate f_{1,2} is precisely the theoretical no-arbitrage rate for a future funding commitment fixed today: it's the reference rate a bank would use to quote a forward rate agreement (FRA, see M04), ensuring neither party can arbitrage the difference between this rate and an equivalent strategy via the spot market.",
  },
  commonMistake: {
    fr: "Utiliser le taux spot actuel à 1 an pour un besoin de financement qui ne débutera que dans 1 an, en oubliant que c'est le taux forward, pas le taux spot, qui correspond à cet horizon décalé.",
    en: "Using the current 1-year spot rate for a funding need that only starts in 1 year, forgetting it's the forward rate, not the spot rate, that matches this shifted horizon.",
  },
});

const rollVsDirectScenarioTemplate = mcqTemplate({
  id: "m03-taux-scenario-emprunt-direct-vs-roule",
  conceptId: "m03-taux-sans-risque",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sur un marché sans friction et sans arbitrage, une entreprise compare deux façons de financer un besoin sur 2 ans : (A) émettre directement une dette à 2 ans au taux z2, (B) émettre une dette à 1 an au taux z1, puis la refinancer dans 1 an au taux forward f_{1,2}. Quelle relation existe entre le coût total de ces deux stratégies ?",
    en: "In a frictionless, arbitrage-free market, a company compares two ways to fund a 2-year need: (A) issue 2-year debt directly at rate z2, (B) issue 1-year debt at rate z1, then refinance in 1 year at the forward rate f_{1,2}. What relationship exists between these two strategies' total cost?",
  },
  choices: [
    { id: "equal", label: { fr: "Les deux coûts sont mathématiquement identiques, par construction même du taux forward", en: "The two costs are mathematically identical, by the very construction of the forward rate" } },
    { id: "direct-cheaper", label: { fr: "L'émission directe à 2 ans est toujours moins chère", en: "Direct 2-year issuance is always cheaper" } },
    { id: "roll-cheaper", label: { fr: "Le refinancement en deux étapes est toujours moins cher", en: "The two-step refinancing is always cheaper" } },
  ],
  correctId: "equal",
  hint: { fr: "Le taux forward est précisément DÉFINI comme le taux qui rend ces deux stratégies équivalentes.", en: "The forward rate is precisely DEFINED as the rate that makes these two strategies equivalent." },
  explanation: {
    fr: "C'est la définition même du taux forward par non-arbitrage : f_{1,2} est construit pour que le coût total de la stratégie B (emprunter à 1 an puis refinancer à f_{1,2}) soit exactement égal au coût de la stratégie A (emprunter directement à 2 ans au taux z2). Si ce n'était pas le cas, une opportunité d'arbitrage sans risque existerait, ce que le marché élimine presque instantanément.",
    en: "This is the very definition of the no-arbitrage forward rate: f_{1,2} is constructed so that strategy B's total cost (borrowing 1 year then refinancing at f_{1,2}) exactly equals strategy A's cost (borrowing directly for 2 years at rate z2). If this weren't the case, a risk-free arbitrage opportunity would exist, which the market eliminates almost instantly.",
  },
  commonMistake: {
    fr: "Croire que l'une des deux stratégies est structurellement moins coûteuse que l'autre, en oubliant que c'est précisément l'absence d'arbitrage qui garantit leur équivalence exacte SI le refinancement se fait au taux forward implicite.",
    en: "Believing one strategy is structurally cheaper than the other, forgetting it is precisely the absence of arbitrage that guarantees their exact equivalence IF the refinancing happens at the implied forward rate.",
  },
});

export const templates: QuestionTemplate[] = [
  forwardRateNumericTemplate,
  curveShapeTemplate,
  forecastMythTemplate,
  proxyVocabTemplate,
  comprehensionTemplate,
  flatVsSteepComparisonTemplate,
  whatIfFlatCurveTemplate,
  whatIfShortRateSpikeTemplate,
  secondYearForwardNumericTemplate,
  arithmeticAverageErrorTemplate,
  fraPricingScenarioTemplate,
  rollVsDirectScenarioTemplate,
];
