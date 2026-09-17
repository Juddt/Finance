import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 3): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const standardErrorNumericTemplate: QuestionTemplate = {
  id: "m06-mc-erreur-standard",
  conceptId: "m06-monte-carlo",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const stdDev = randomInt(rng, 10, 50);
    const nThousands = randomInt(rng, 1, 100);
    const N = nThousands * 1000;
    const se = Math.round((stdDev / Math.sqrt(N)) * 1000) / 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Une simulation Monte-Carlo utilise N = ${N.toLocaleString("fr-FR")} trajectoires, avec un écart-type des payoffs actualisés estimé à ${stdDev}. Quelle est l'erreur standard de l'estimation du prix ?`,
        en: `A Monte-Carlo simulation uses N = ${N.toLocaleString("en-US")} paths, with an estimated standard deviation of discounted payoffs of ${stdDev}. What is the price estimate's standard error?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 0.01",
      hint: { fr: "Erreur standard = écart-type / √N.", en: "Standard error = standard deviation / √N." },
      numeric: { value: se, tolerance: 0.01 },
      calculation: { fr: `Erreur standard = ${stdDev} / √${N} ≈ ${fmt(se, "fr")}.`, en: `Standard error = ${stdDev} / √${N} ≈ ${fmt(se, "en")}.` },
      explanation: {
        fr: "Plus N est grand, plus l'estimation est précise, mais la convergence en 1/√N est lente.",
        en: "The larger N is, the more precise the estimate, but convergence at 1/√N is slow.",
      },
      commonMistake: {
        fr: "Diviser par N au lieu de √N, ce qui sous-estime largement l'erreur restante.",
        en: "Dividing by N instead of √N, which greatly underestimates the remaining error.",
      },
    };
  },
};

const quadrupleNTemplate: QuestionTemplate = {
  id: "m06-mc-quadrupler-n",
  conceptId: "m06-monte-carlo",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pour diviser par 2 l'erreur standard d'une estimation Monte-Carlo, par quel facteur faut-il multiplier le nombre de trajectoires simulées N ?",
      en: "To halve a Monte-Carlo estimate's standard error, by what factor must the number of simulated paths N be multiplied?",
    },
    choices: buildChoices([
      { id: "four", label: { fr: "Par 4", en: "By 4" } },
      { id: "two", label: { fr: "Par 2", en: "By 2" } },
      { id: "eight", label: { fr: "Par 8", en: "By 8" } },
    ]),
    hint: { fr: "L'erreur standard décroît en 1/√N.", en: "The standard error decreases as 1/√N." },
    correctChoiceIds: ["four"],
    explanation: {
      fr: "Puisque l'erreur standard est proportionnelle à 1/√N, diviser l'erreur par 2 nécessite de multiplier N par 2² = 4.",
      en: "Since the standard error is proportional to 1/√N, halving the error requires multiplying N by 2² = 4.",
    },
    commonMistake: {
      fr: "Croire que doubler N suffit à diviser l'erreur par 2, en oubliant la racine carrée.",
      en: "Believing doubling N is enough to halve the error, forgetting the square root.",
    },
  }),
};

const measureTemplate: QuestionTemplate = {
  id: "m06-mc-mesure",
  conceptId: "m06-monte-carlo",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const usesRealDrift = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Pour pricer une option par Monte-Carlo, on simule les trajectoires du sous-jacent en utilisant ${usesRealDrift ? "le vrai rendement moyen attendu de l'actif (estimé historiquement)" : "le taux sans risque r comme drift"}.`,
        en: `To price an option via Monte-Carlo, you simulate the underlying's paths using ${usesRealDrift ? "the asset's true expected average return (historically estimated)" : "the risk-free rate r as the drift"}.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [usesRealDrift ? "false" : "true"],
      explanation: usesRealDrift
        ? { fr: "Faux : il faut simuler sous la mesure RISQUE-NEUTRE, avec un drift égal au taux sans risque r, pas le vrai rendement attendu de l'actif.", en: "False: you must simulate under the RISK-NEUTRAL measure, with drift equal to the risk-free rate r, not the asset's true expected return." }
        : { fr: "Vrai : le pricing Monte-Carlo simule sous la mesure risque-neutre, où le drift est le taux sans risque r.", en: "True: Monte-Carlo pricing simulates under the risk-neutral measure, where the drift is the risk-free rate r." },
      commonMistake: {
        fr: "Simuler avec le vrai drift historique de l'actif, une erreur qui fausse complètement le prix obtenu.",
        en: "Simulating with the asset's true historical drift, a mistake that completely distorts the resulting price.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-mc-vocab",
  conceptId: "m06-monte-carlo",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une technique qui consiste à simuler aussi la trajectoire avec −Z pour chaque nombre aléatoire Z tiré, afin de réduire la variance de l'estimateur sans biais, s'appelle les variables ______.",
      en: "A technique that also simulates the path with −Z for each drawn random number Z, to reduce the estimator's variance without bias, is called ______ variates.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["antithetiques", "antithétiques", "antithetic"],
    hint: { fr: "\"Anti-\" quelque chose, car on utilise l'opposé du tirage.", en: "\"Anti-\" something, since the draw's opposite is used." },
    explanation: {
      fr: "Les variables antithétiques réduisent la variance de l'estimateur Monte-Carlo en exploitant la symétrie de la loi normale, sans biaiser le résultat.",
      en: "Antithetic variates reduce the Monte-Carlo estimator's variance by exploiting the normal distribution's symmetry, without biasing the result.",
    },
    commonMistake: {
      fr: "Confondre les variables antithétiques avec les variables de contrôle, une autre technique de réduction de variance basée sur un principe différent.",
      en: "Confusing antithetic variates with control variates, another variance-reduction technique based on a different principle.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-mc-comprehension-utilite",
  conceptId: "m06-monte-carlo",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi Monte-Carlo est-il la technique de référence pour pricer un produit sur panier de plusieurs actifs corrélés (M09), alors qu'une formule fermée existe pour une option vanille simple ?",
    en: "Why is Monte-Carlo the reference technique for pricing a basket product on several correlated assets (M09), when a closed-form formula exists for a simple vanilla option?",
  },
  choices: [
    { id: "no-closed-form", label: { fr: "Parce qu'aucune formule fermée n'existe en général pour un payoff dépendant de plusieurs actifs corrélés, alors que la simulation reste applicable quelle que soit la complexité du payoff", en: "Because no closed-form formula generally exists for a payoff depending on several correlated assets, while simulation remains applicable whatever the payoff's complexity" } },
    { id: "always-faster", label: { fr: "Parce que Monte-Carlo est toujours plus rapide à calculer qu'une formule fermée", en: "Because Monte-Carlo is always faster to compute than a closed-form formula" } },
    { id: "more-accurate", label: { fr: "Parce que Monte-Carlo est toujours plus précis qu'une formule fermée", en: "Because Monte-Carlo is always more accurate than a closed-form formula" } },
  ],
  correctId: "no-closed-form",
  hint: { fr: "Black-Scholes n'a une solution fermée que pour des payoffs simples sur un seul actif — que se passe-t-il avec plusieurs actifs corrélés ?", en: "Black-Scholes only has a closed-form solution for simple single-asset payoffs — what happens with several correlated assets?" },
  explanation: {
    fr: "Dès que le payoff dépend de plusieurs actifs corrélés (un panier, M09) ou de la trajectoire complète du sous-jacent (une barrière, M10), aucune formule fermée générale n'existe : Monte-Carlo reste applicable dans ces cas en simulant simplement les trajectoires jointes de tous les actifs, au prix d'un temps de calcul plus long et d'une incertitude statistique, contrairement à une formule fermée exacte et instantanée quand elle existe.",
    en: "As soon as the payoff depends on several correlated assets (a basket, M09) or the underlying's full path (a barrier, M10), no general closed-form formula exists: Monte-Carlo remains applicable in these cases by simply simulating all the assets' joint paths, at the cost of longer computation time and statistical uncertainty, unlike an exact, instant closed-form formula when one exists.",
  },
  commonMistake: {
    fr: "Croire que Monte-Carlo est toujours préférable à une formule fermée, en oubliant qu'il n'apporte un vrai avantage que lorsqu'aucune formule fermée n'existe.",
    en: "Believing Monte-Carlo is always preferable to a closed-form formula, forgetting it only offers a real advantage when no closed-form formula exists.",
  },
});

const pathDependentComparisonTemplate = mcqTemplate({
  id: "m06-mc-comparaison-path-dependent",
  conceptId: "m06-monte-carlo",
  difficulty: "hard",
  prompt: {
    fr: "Comparez la simulation Monte-Carlo d'un call européen classique (payoff basé sur S_T seul) et celle d'une option barrière (payoff dépendant de toute la trajectoire, M10). Quelle différence de mise en œuvre distingue les deux ?",
    en: "Compare Monte-Carlo simulation of a plain European call (payoff based on S_T alone) and a barrier option (payoff depending on the whole path, M10). What implementation difference distinguishes the two?",
  },
  choices: [
    { id: "full-path-needed", label: { fr: "Le call vanille ne nécessite que de simuler S_T directement (une étape), tandis que la barrière exige de discrétiser et simuler toute la trajectoire (plusieurs pas de temps) pour vérifier le franchissement de la barrière", en: "The vanilla call only needs S_T simulated directly (one step), while the barrier requires discretizing and simulating the whole path (multiple time steps) to check the barrier crossing" } },
    { id: "same-method", label: { fr: "Les deux se simulent de façon rigoureusement identique, sans aucune différence de méthode", en: "Both are simulated in a rigorously identical way, with no method difference" } },
    { id: "barrier-simpler", label: { fr: "L'option barrière est en réalité plus simple à simuler que le call vanille", en: "The barrier option is actually simpler to simulate than the vanilla call" } },
  ],
  correctId: "full-path-needed",
  hint: { fr: "Le payoff d'un call vanille ne dépend que du prix final ; celui d'une barrière dépend de tout le chemin parcouru.", en: "A vanilla call's payoff depends only on the final price; a barrier's depends on the entire path taken." },
  explanation: {
    fr: "Pour un call vanille, il suffit de tirer directement S_T (une seule variable aléatoire par trajectoire, grâce à la formule fermée de la loi de S_T). Pour une option barrière, il faut discrétiser [0,T] en plusieurs pas et simuler chaque valeur intermédiaire du sous-jacent, pour vérifier si la barrière a été franchie à un moment quelconque de la vie du contrat : un calcul nettement plus lourd, proportionnel au nombre de pas de discrétisation en plus du nombre de trajectoires.",
    en: "For a vanilla call, it's enough to directly draw S_T (a single random variable per path, thanks to S_T's closed-form distribution). For a barrier option, [0,T] must be discretized into several steps and each intermediate underlying value simulated, to check whether the barrier was crossed at any point in the contract's life: a much heavier calculation, proportional to the number of discretization steps in addition to the number of paths.",
  },
  commonMistake: {
    fr: "Simuler un produit path-dependent en ne tirant que S_T directement, comme pour un vanille, sans discrétiser la trajectoire complète — une erreur qui ignore totalement le risque de franchissement de barrière en cours de route.",
    en: "Simulating a path-dependent product by only drawing S_T directly, as for a vanilla, without discretizing the full path — an error that entirely ignores the risk of a barrier crossing along the way.",
  },
});

const whatIfAntitheticTemplate = mcqTemplate({
  id: "m06-mc-whatif-variables-antithetiques",
  conceptId: "m06-monte-carlo",
  difficulty: "hard",
  prompt: {
    fr: "En utilisant des variables antithétiques (simuler aussi la trajectoire avec −Z pour chaque Z tiré), que devient l'erreur standard de l'estimation, pour un même nombre de tirages aléatoires indépendants effectivement générés ?",
    en: "Using antithetic variates (also simulating the path with −Z for each drawn Z), what happens to the estimate's standard error, for the same number of actually generated independent random draws?",
  },
  choices: [
    { id: "reduced", label: { fr: "Elle diminue généralement, car les deux trajectoires (Z et −Z) sont négativement corrélées, réduisant la variance de leur moyenne sans introduire de biais", en: "It generally decreases, since both paths (Z and −Z) are negatively correlated, reducing the variance of their average with no bias introduced" } },
    { id: "unchanged", label: { fr: "Elle reste rigoureusement identique, la technique n'a aucun effet sur la variance", en: "It stays rigorously identical, the technique has no effect on variance" } },
    { id: "biased", label: { fr: "Elle diminue, mais au prix d'un biais introduit dans l'estimation", en: "It decreases, but at the cost of a bias introduced in the estimate" } },
  ],
  correctId: "reduced",
  hint: { fr: "Deux variables négativement corrélées réduisent la variance de leur moyenne, un résultat de théorie des probabilités de base.", en: "Two negatively correlated variables reduce the variance of their average, a basic probability theory result." },
  explanation: {
    fr: "En moyennant le payoff obtenu avec Z et celui obtenu avec −Z (négativement corrélés par construction, grâce à la symétrie de la loi normale), la variance de cette moyenne par paire est réduite par rapport à deux tirages complètement indépendants, sans introduire aucun biais (l'espérance reste inchangée) : c'est une technique de réduction de variance « gratuite », pour un budget de calcul aléatoire équivalent.",
    en: "By averaging the payoff obtained with Z and the one obtained with −Z (negatively correlated by construction, thanks to the normal distribution's symmetry), the variance of this per-pair average is reduced compared to two fully independent draws, with no bias introduced at all (the expectation stays unchanged): a \"free\" variance-reduction technique, for an equivalent random-draw computation budget.",
  },
  commonMistake: {
    fr: "Croire que toute technique de réduction de variance introduit nécessairement un compromis en termes de biais, alors que les variables antithétiques restent rigoureusement non biaisées.",
    en: "Believing any variance-reduction technique necessarily introduces a bias trade-off, when antithetic variates remain rigorously unbiased.",
  },
});

const whatIfHundredTimesNTemplate = mcqTemplate({
  id: "m06-mc-whatif-n-fois-100",
  conceptId: "m06-monte-carlo",
  difficulty: "medium",
  prompt: {
    fr: "Si le nombre de simulations N est multiplié par 100, par quel facteur l'erreur standard de l'estimation est-elle divisée ?",
    en: "If the number of simulations N is multiplied by 100, by what factor is the estimate's standard error divided?",
  },
  choices: [
    { id: "ten", label: { fr: "Par 10 (= √100)", en: "By 10 (= √100)" } },
    { id: "hundred", label: { fr: "Par 100, exactement comme N", en: "By 100, exactly like N" } },
    { id: "fifty", label: { fr: "Par 50", en: "By 50" } },
  ],
  correctId: "ten",
  hint: { fr: "Erreur standard ∝ 1/√N : quelle est la racine carrée de 100 ?", en: "Standard error ∝ 1/√N: what is the square root of 100?" },
  explanation: {
    fr: "Puisque l'erreur standard est proportionnelle à 1/√N, multiplier N par 100 divise l'erreur standard par √100 = 10, pas par 100 : c'est la même logique de racine carrée qui explique pourquoi il faut multiplier N par 4 (pas 2) pour diviser l'erreur par 2 (M06-quadrupler-N).",
    en: "Since the standard error is proportional to 1/√N, multiplying N by 100 divides the standard error by √100 = 10, not by 100: the same square-root logic explaining why N must be multiplied by 4 (not 2) to halve the error (M06-quadruple-N).",
  },
  commonMistake: {
    fr: "Appliquer directement le facteur de N (×100) à la réduction de l'erreur standard, en oubliant la racine carrée qui gouverne la convergence Monte-Carlo.",
    en: "Directly applying N's factor (×100) to the standard error's reduction, forgetting the square root governing Monte-Carlo convergence.",
  },
});

const requiredNNumericTemplate: QuestionTemplate = {
  id: "m06-mc-n-requis-calcul",
  conceptId: "m06-monte-carlo",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const stdDev = randomInt(rng, 10, 50);
    const targetSE = randomInt(rng, 1, 5) / 10;
    const requiredN = Math.ceil(Math.pow(stdDev / targetSE, 2) / 1000) * 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Une simulation Monte-Carlo a un écart-type des payoffs actualisés estimé à ${stdDev}. Combien de trajectoires N (arrondies au millier supérieur) faut-il simuler au minimum pour atteindre une erreur standard cible de ${targetSE} ?`,
        en: `A Monte-Carlo simulation has an estimated standard deviation of discounted payoffs of ${stdDev}. How many paths N (rounded up to the nearest thousand) must be simulated at minimum to reach a target standard error of ${targetSE}?`,
      },
      numericUnit: { fr: "trajectoires", en: "paths" },
      numericTolerance: "± 1000",
      hint: { fr: "Inversez Erreur standard = écart-type/√N : N = (écart-type / erreur cible)².", en: "Invert Standard error = standard deviation/√N: N = (standard deviation / target error)²." },
      numeric: { value: requiredN, tolerance: 1000 },
      calculation: {
        fr: `N = (${stdDev} / ${targetSE})² = ${(stdDev / targetSE).toFixed(1)}² ≈ ${requiredN.toLocaleString("fr-FR")}.`,
        en: `N = (${stdDev} / ${targetSE})² = ${(stdDev / targetSE).toFixed(1)}² ≈ ${requiredN.toLocaleString("en-US")}.`,
      },
      explanation: {
        fr: "Inverser la formule de l'erreur standard permet de dimensionner à l'avance le nombre de simulations nécessaires pour atteindre une précision cible, un calcul pratique avant de lancer un calcul potentiellement coûteux en temps machine.",
        en: "Inverting the standard error formula lets you size in advance the number of simulations needed to reach a target precision, a practical calculation before launching a potentially computation-time-costly run.",
      },
      commonMistake: {
        fr: "Oublier d'élever le ratio au carré lors de l'inversion, ce qui sous-estime fortement le nombre de trajectoires réellement nécessaires.",
        en: "Forgetting to square the ratio when inverting, which strongly understates the number of paths actually needed.",
      },
    };
  },
};

const neverZeroErrorTemplate = trueFalseTemplate({
  id: "m06-mc-erreur-jamais-nulle",
  conceptId: "m06-monte-carlo",
  difficulty: "medium",
  statement: {
    fr: "En utilisant un nombre de simulations N suffisamment grand, l'erreur standard de l'estimation Monte-Carlo finit par devenir rigoureusement nulle.",
    en: "By using a large enough number of simulations N, the Monte-Carlo estimate's standard error eventually becomes rigorously zero.",
  },
  correct: false,
  explanation: {
    fr: "Faux : l'erreur standard, proportionnelle à 1/√N, tend vers zéro quand N tend vers l'infini, mais ne l'atteint jamais exactement pour un N fini, aussi grand soit-il. Il subsiste toujours une incertitude statistique résiduelle, simplement de plus en plus petite — une nuance importante pour ne jamais présenter un prix Monte-Carlo comme une valeur exacte.",
    en: "False: the standard error, proportional to 1/√N, tends toward zero as N tends toward infinity, but never exactly reaches it for a finite N, however large. A residual statistical uncertainty always remains, simply smaller and smaller — an important nuance for never presenting a Monte-Carlo price as an exact value.",
  },
  commonMistake: {
    fr: "Croire qu'un très grand nombre de simulations élimine toute incertitude statistique, en oubliant qu'elle ne fait que diminuer, sans jamais s'annuler exactement.",
    en: "Believing a very large number of simulations eliminates all statistical uncertainty, forgetting it only decreases, never exactly vanishing.",
  },
});

const computeBudgetScenarioTemplate = mcqTemplate({
  id: "m06-mc-scenario-budget-calcul",
  conceptId: "m06-monte-carlo",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk a un budget de calcul fixe (temps machine limité avant la clôture des marchés) et doit pricer un produit exotique avec la meilleure précision possible dans ce temps imparti. Que doit-il privilégier plutôt que de simplement augmenter N au maximum ?",
    en: "A desk has a fixed compute budget (limited machine time before markets close) and must price an exotic product with the best possible precision in that time. What should it prioritize rather than simply maximizing N?",
  },
  choices: [
    { id: "variance-reduction", label: { fr: "Des techniques de réduction de variance (variables antithétiques, variables de contrôle), qui améliorent la précision sans nécessiter davantage de temps de calcul brut", en: "Variance-reduction techniques (antithetic variates, control variates), which improve precision without requiring more raw computation time" } },
    { id: "just-more-n", label: { fr: "Simplement augmenter N au maximum autorisé par le budget, sans autre optimisation", en: "Simply increase N to the maximum the budget allows, with no other optimization" } },
    { id: "reduce-precision", label: { fr: "Accepter une précision réduite, aucune autre option n'existe", en: "Accept reduced precision, no other option exists" } },
    { id: "impossible", label: { fr: "Il est impossible d'améliorer la précision sans augmenter le temps de calcul", en: "It's impossible to improve precision without increasing computation time" } },
  ],
  correctId: "variance-reduction",
  hint: { fr: "Certaines techniques réduisent la variance de l'estimateur sans nécessiter davantage de tirages aléatoires bruts.", en: "Some techniques reduce the estimator's variance without requiring more raw random draws." },
  explanation: {
    fr: "Face à une contrainte de temps de calcul, les techniques de réduction de variance (variables antithétiques, variables de contrôle) permettent d'améliorer la précision de l'estimation SANS augmenter proportionnellement le nombre de tirages aléatoires nécessaires : c'est une alternative bien plus efficace que de simplement augmenter N, dont le coût en calcul croît alors que le gain de précision décroît (convergence lente en 1/√N).",
    en: "Facing a computation-time constraint, variance-reduction techniques (antithetic variates, control variates) let precision be improved WITHOUT proportionally increasing the number of random draws needed: a much more efficient alternative than simply increasing N, whose computation cost grows while the precision gain shrinks (slow 1/√N convergence).",
  },
  commonMistake: {
    fr: "Se rabattre systématiquement sur une simple augmentation de N pour améliorer la précision, en négligeant les techniques de réduction de variance bien plus efficaces sous contrainte de temps de calcul.",
    en: "Systematically falling back on simply increasing N to improve precision, neglecting the much more efficient variance-reduction techniques under a computation-time constraint.",
  },
});

const validationScenarioTemplate = mcqTemplate({
  id: "m06-mc-scenario-validation-vanille",
  conceptId: "m06-monte-carlo",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Avant de déployer un nouveau moteur Monte-Carlo pour pricer des produits exotiques, un quant le teste d'abord sur un call européen vanille classique. Pourquoi ce test, alors que le moteur est destiné aux produits exotiques ?",
    en: "Before deploying a new Monte-Carlo engine to price exotic products, a quant first tests it on a plain vanilla European call. Why this test, when the engine is meant for exotic products?",
  },
  choices: [
    { id: "known-benchmark", label: { fr: "Parce que le call vanille a une formule fermée connue (Black-Scholes) servant de référence exacte, pour vérifier que le moteur Monte-Carlo converge bien vers le bon prix avant de lui faire confiance sur des produits sans référence connue", en: "Because the vanilla call has a known closed-form formula (Black-Scholes) serving as an exact reference, to check the Monte-Carlo engine correctly converges to the right price before trusting it on products with no known reference" } },
    { id: "useless-test", label: { fr: "Ce test est inutile puisque le moteur ne sera jamais utilisé pour des vanilles en production", en: "This test is useless since the engine will never be used for vanillas in production" } },
    { id: "different-engine", label: { fr: "Un moteur Monte-Carlo pour vanilles et un pour exotiques sont fondamentalement différents, ce test ne prouve rien", en: "A Monte-Carlo engine for vanillas and one for exotics are fundamentally different, this test proves nothing" } },
  ],
  correctId: "known-benchmark",
  hint: { fr: "Pour valider un nouvel outil, il faut le tester là où la bonne réponse est déjà connue avec certitude.", en: "To validate a new tool, it must be tested where the right answer is already known with certainty." },
  explanation: {
    fr: "Le call vanille sert de cas de test idéal car son prix exact est connu indépendamment (formule de Black-Scholes, M06) : si le moteur Monte-Carlo converge bien vers ce prix connu à mesure que N augmente, cela valide sa correction (implémentation, discrétisation, générateur aléatoire) avant de l'utiliser sur des produits exotiques où aucune référence exacte n'existe pour détecter une éventuelle erreur cachée.",
    en: "The vanilla call serves as an ideal test case since its exact price is independently known (the Black-Scholes formula, M06): if the Monte-Carlo engine correctly converges to this known price as N grows, this validates its correctness (implementation, discretization, random generator) before using it on exotic products where no exact reference exists to catch a potentially hidden error.",
  },
  commonMistake: {
    fr: "Ne pas valider un nouveau moteur de simulation sur un cas simple et connu avant de le déployer sur des produits complexes, un réflexe pourtant essentiel pour détecter des erreurs d'implémentation.",
    en: "Not validating a new simulation engine on a simple, known case before deploying it on complex products, a reflex that's nonetheless essential for catching implementation errors.",
  },
});

export const templates: QuestionTemplate[] = [
  standardErrorNumericTemplate,
  quadrupleNTemplate,
  measureTemplate,
  vocabTemplate,
  comprehensionTemplate,
  pathDependentComparisonTemplate,
  whatIfAntitheticTemplate,
  whatIfHundredTimesNTemplate,
  requiredNNumericTemplate,
  neverZeroErrorTemplate,
  computeBudgetScenarioTemplate,
  validationScenarioTemplate,
];
