import { randomInt, pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmtPct(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + "%";
}

function fmtDf(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

const comprehensionTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-comprehension",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  prompt: {
    fr: "Que signifie \"construire une courbe zéro-coupon par bootstrap\" ?",
    en: "What does \"building a zero-coupon curve by bootstrapping\" mean?",
  },
  choices: [
    { id: "successive-derivation", label: { fr: "Déduire successivement les taux zéro-coupon de maturités croissantes à partir des prix d'instruments de marché, en utilisant à chaque étape les taux déjà obtenus", en: "Successively deriving zero-coupon rates of increasing maturities from market instrument prices, using at each step the rates already obtained" } },
    { id: "direct-market-reading", label: { fr: "Lire directement sur le marché le taux zéro-coupon de n'importe quelle maturité, sans aucun calcul", en: "Directly reading off the market the zero-coupon rate for any maturity, with no calculation" } },
    { id: "average-of-quoted-rates", label: { fr: "Calculer une simple moyenne arithmétique de tous les taux cotés sur le marché", en: "Computing a simple arithmetic average of all market-quoted rates" } },
    { id: "credit-spread-adjustment", label: { fr: "Ajuster une courbe existante pour refléter le spread de crédit d'un émetteur particulier", en: "Adjusting an existing curve to reflect a particular issuer's credit spread" } },
  ],
  correctId: "successive-derivation",
  hint: { fr: "\"Successivement\" est le mot clé : chaque étape s'appuie sur le résultat de la précédente.", en: "\"Successively\" is the key word: each step relies on the previous one's result." },
  explanation: {
    fr: "Le bootstrap est précisément une méthode SUCCESSIVE : on part des maturités les plus courtes, directement observables, puis on déduit étape par étape les taux de maturités croissantes à partir d'instruments composites, en s'appuyant sur les taux déjà obtenus — ce n'est ni une lecture directe, ni une simple moyenne, ni un ajustement de crédit.",
    en: "Bootstrapping is precisely a SUCCESSIVE method: one starts from the shortest, directly observable maturities, then derives step by step the rates of increasing maturities from composite instruments, relying on the rates already obtained — it is neither a direct reading, nor a simple average, nor a credit adjustment.",
  },
  commonMistake: {
    fr: "Croire que tous les taux zéro-coupon peuvent être lus directement sur le marché, sans nécessiter de construction par bootstrap pour les maturités intermédiaires ou longues.",
    en: "Believing all zero-coupon rates can be directly read off the market, with no need for bootstrap construction at intermediate or long maturities.",
  },
});

const shortVsLongMaturityComparisonTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-comparaison-court-long",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  prompt: {
    fr: "En quoi l'obtention du taux zéro-coupon à 1 an diffère-t-elle de celle du taux zéro-coupon à 10 ans dans une construction par bootstrap ?",
    en: "How does obtaining the 1-year zero-coupon rate differ from obtaining the 10-year zero-coupon rate in a bootstrap construction?",
  },
  choices: [
    { id: "short-direct-long-derived", label: { fr: "Le taux à 1 an s'obtient directement d'un dépôt monétaire à flux unique, tandis que le taux à 10 ans nécessite de résoudre une équation à partir d'un instrument à flux multiples et des taux déjà obtenus", en: "The 1-year rate is obtained directly from a single-flow money-market deposit, while the 10-year rate requires solving an equation from a multi-flow instrument and the rates already obtained" } },
    { id: "both-direct-always", label: { fr: "Les deux s'obtiennent toujours directement du marché, sans aucune différence de méthode", en: "Both are always obtained directly from the market, with no difference in method" } },
    { id: "both-require-full-bootstrap", label: { fr: "Les deux nécessitent la même équation de bootstrap à flux multiples, y compris le taux à 1 an", en: "Both require the same multi-flow bootstrap equation, including the 1-year rate" } },
    { id: "long-maturity-impossible-to-derive", label: { fr: "Le taux à 10 ans est par nature impossible à déduire, faute d'instrument coté sur le marché à cette maturité", en: "The 10-year rate is by nature impossible to derive, for lack of a market-quoted instrument at that maturity" } },
  ],
  correctId: "short-direct-long-derived",
  hint: { fr: "Un dépôt monétaire a un flux UNIQUE ; un swap à 10 ans a PLUSIEURS flux annuels — cela change-t-il la méthode d'extraction du taux ?", en: "A money-market deposit has a SINGLE flow; a 10-year swap has SEVERAL annual flows — does this change the rate extraction method?" },
  explanation: {
    fr: "Un dépôt monétaire court comporte un flux unique, donc son taux zéro-coupon se lit directement de son prix de marché sans calcul de bootstrap ; un instrument à 10 ans (généralement un swap) comporte plusieurs flux annuels intermédiaires, donc son taux zéro-coupon ne peut être isolé qu'en résolvant une équation qui utilise les facteurs d'actualisation déjà obtenus aux maturités antérieures — c'est précisément cette différence qui rend le bootstrap nécessaire au-delà des toutes premières maturités.",
    en: "A short money-market deposit has a single flow, so its zero-coupon rate can be read directly from its market price with no bootstrap calculation; a 10-year instrument (generally a swap) has several intermediate annual flows, so its zero-coupon rate can only be isolated by solving an equation using the discount factors already obtained at earlier maturities — this exact difference is what makes bootstrapping necessary beyond the very first maturities.",
  },
  commonMistake: {
    fr: "Appliquer la même méthode de lecture directe aux instruments à flux multiples qu'aux instruments à flux unique, en ignorant la nécessité de résoudre une équation pour les premiers.",
    en: "Applying the same direct-reading method to multi-flow instruments as to single-flow ones, ignoring the need to solve an equation for the former.",
  },
});

const wrongOrderWhatIfTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-what-if-mauvais-ordre",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste tente de bootstrapper directement le taux zéro-coupon à 5 ans à partir d'un swap 5 ans, sans avoir préalablement déterminé les taux zéro-coupon aux maturités 1 à 4 ans. Que se passe-t-il ?",
    en: "An analyst tries to directly bootstrap the 5-year zero-coupon rate from a 5-year swap, without having first determined the 1- to 4-year zero-coupon rates. What happens?",
  },
  choices: [
    { id: "cannot-isolate-unknown", label: { fr: "Le calcul est impossible : l'équation du swap 5 ans comporte plusieurs facteurs d'actualisation inconnus (aux maturités 1 à 5 ans), pas seulement celui à 5 ans", en: "The calculation is impossible: the 5-year swap's equation involves several unknown discount factors (at maturities 1 to 5 years), not just the 5-year one" } },
    { id: "works-fine-single-equation", label: { fr: "Le calcul fonctionne parfaitement, une seule équation suffisant toujours à isoler le taux à 5 ans indépendamment des autres maturités", en: "The calculation works perfectly, a single equation always being enough to isolate the 5-year rate independently of other maturities" } },
    { id: "gives-approximate-but-usable-result", label: { fr: "Le calcul donne un résultat approximatif mais suffisamment fiable pour un usage professionnel", en: "The calculation gives an approximate but sufficiently reliable result for professional use" } },
    { id: "only-affects-precision-not-feasibility", label: { fr: "Le calcul reste faisable, l'ordre des étapes n'affectant que la précision numérique du résultat final", en: "The calculation remains feasible, the order of steps only affecting the final result's numerical precision" } },
  ],
  correctId: "cannot-isolate-unknown",
  hint: { fr: "L'équation du swap 5 ans contient les facteurs d'actualisation de TOUTES les maturités de 1 à 5 ans : combien d'inconnues reste-t-il sans les taux 1-4 ans déjà connus ?", en: "The 5-year swap's equation contains the discount factors of ALL maturities from 1 to 5 years: how many unknowns remain without the already-known 1-4 year rates?" },
  explanation: {
    fr: "L'équation de valeur actuelle nette nulle d'un swap 5 ans à flux annuels comporte les facteurs d'actualisation aux maturités 1, 2, 3, 4 et 5 ans : sans connaître déjà les quatre premiers (obtenus aux étapes précédentes du bootstrap), il reste plusieurs inconnues dans une seule équation, ce qui rend le système mathématiquement indéterminé — le bootstrap n'est PAS optionnel dans son ordre, chaque étape dépendant strictement des précédentes.",
    en: "A 5-year annual-flow swap's zero net present value equation involves the discount factors at maturities 1, 2, 3, 4 and 5 years: without already knowing the first four (obtained at earlier bootstrap steps), several unknowns remain in a single equation, making the system mathematically indeterminate — the bootstrap's order is NOT optional, each step strictly depending on the previous ones.",
  },
  commonMistake: {
    fr: "Croire qu'un instrument à flux multiples permet d'isoler directement le taux de sa seule maturité finale, en ignorant les inconnues intermédiaires non encore résolues.",
    en: "Believing a multi-flow instrument allows directly isolating the rate of only its final maturity, ignoring the intermediate unknowns not yet resolved.",
  },
});

const inconsistentConventionsWhatIfTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-what-if-conventions-incoherentes",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un analyste mélange, sans les harmoniser, des instruments de bases de calcul de jours différentes (actual/360 pour les dépôts courts, 30/360 pour les swaps longs) dans une même construction de courbe par bootstrap. Quel est le risque probable ?",
    en: "An analyst mixes, without harmonizing them, instruments with different day-count bases (actual/360 for short deposits, 30/360 for long swaps) in the same bootstrap curve construction. What is the likely risk?",
  },
  choices: [
    { id: "inconsistent-curve", label: { fr: "La courbe obtenue devient incohérente, avec des facteurs d'actualisation faussés par le mélange non harmonisé des conventions", en: "The resulting curve becomes inconsistent, with discount factors distorted by the unharmonized mix of conventions" } },
    { id: "no-effect-conventions-irrelevant", label: { fr: "Aucun risque : la base de calcul des jours n'a par nature aucun effet sur le résultat du bootstrap", en: "No risk at all: the day-count basis has by nature no effect on the bootstrap's result" } },
    { id: "only-affects-short-end", label: { fr: "Le risque ne concerne que les maturités courtes, jamais les maturités longues obtenues plus tard dans le processus", en: "The risk only concerns short maturities, never the long maturities obtained later in the process" } },
    { id: "self-corrects-automatically", label: { fr: "Le bootstrap corrige automatiquement toute incohérence de convention à l'étape suivante", en: "Bootstrapping automatically corrects any convention inconsistency at the next step" } },
  ],
  correctId: "inconsistent-curve",
  hint: { fr: "Chaque étape du bootstrap s'appuie sur les résultats de la précédente : une erreur de convention à une étape courte se propage-t-elle aux étapes suivantes ?", en: "Each bootstrap step relies on the previous step's results: does a convention error at a short step propagate to later steps?" },
  explanation: {
    fr: "Mélanger des conventions de calcul de jours différentes sans les harmoniser fausse les facteurs d'actualisation calculés à chaque étape, et puisque le bootstrap s'appuie systématiquement sur les résultats des étapes précédentes, cette incohérence initiale se propage et s'amplifie potentiellement aux maturités plus longues obtenues ensuite — ce n'est ni sans effet, ni limité aux seules maturités courtes, ni corrigé automatiquement par la méthode.",
    en: "Mixing different day-count conventions without harmonizing them distorts the discount factors computed at each step, and since bootstrapping systematically relies on previous steps' results, this initial inconsistency propagates and potentially amplifies into the longer maturities obtained afterward — it is neither without effect, nor limited to short maturities alone, nor automatically corrected by the method.",
  },
  commonMistake: {
    fr: "Négliger l'harmonisation des conventions de marché (bases de calcul de jours, fréquences) avant de lancer un bootstrap, en supposant à tort que la méthode est insensible à ces détails.",
    en: "Neglecting to harmonize market conventions (day-count bases, frequencies) before running a bootstrap, wrongly assuming the method is insensitive to these details.",
  },
});

const bootstrapCalcTemplate: QuestionTemplate = {
  id: "m04-construction-courbe-zero-coupon-calcul-bootstrap",
  conceptId: "m04-construction-courbe-zero-coupon",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const df1 = randomInt(rng, 955, 980) / 1000;
    const cPercent = randomInt(rng, 28, 40) / 10;
    const c = cPercent / 100;
    const correctDf2 = Math.round(((1 - c * df1) / (1 + c)) * 1000) / 1000;
    const wrongForgetsDf1 = Math.round((1 / (1 + c)) * 1000) / 1000;
    const wrongAddsInsteadOfSubtracts = Math.round(((1 + c * df1) / (1 + c)) * 1000) / 1000;
    const wrongDividesByTwo = Math.round((correctDf2 / 2) * 1000) / 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Le facteur d'actualisation à 1 an, déjà obtenu, est de ${fmtDf(df1, "fr")}. Un swap 2 ans à flux annuels cote un taux fixe de ${fmtPct(cPercent, "fr", 1)}. Quel est le facteur d'actualisation à 2 ans obtenu par bootstrap ?`,
        en: `The already-obtained 1-year discount factor is ${fmtDf(df1, "en")}. A 2-year annual-flow swap quotes a fixed rate of ${fmtPct(cPercent, "en", 1)}. What is the 2-year discount factor obtained by bootstrapping?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmtDf(correctDf2, "fr")}, en résolvant DF_2 = (1 − c × DF_1) / (1 + c)`, en: `${fmtDf(correctDf2, "en")}, by solving DF_2 = (1 − c × DF_1) / (1 + c)` } },
        { id: "wrong-forgets-df1", label: { fr: `${fmtDf(wrongForgetsDf1, "fr")}, en oubliant le terme c × DF_1 au numérateur`, en: `${fmtDf(wrongForgetsDf1, "en")}, forgetting the c × DF_1 term in the numerator` } },
        { id: "wrong-sign", label: { fr: `${fmtDf(wrongAddsInsteadOfSubtracts, "fr")}, en additionnant au lieu de soustraire le terme c × DF_1`, en: `${fmtDf(wrongAddsInsteadOfSubtracts, "en")}, by adding instead of subtracting the c × DF_1 term` } },
        { id: "wrong-halved", label: { fr: `${fmtDf(wrongDividesByTwo, "fr")}, en divisant le résultat correct par deux par erreur`, en: `${fmtDf(wrongDividesByTwo, "en")}, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "DF_2 = (1 − c × DF_1) / (1 + c), issu de l'équation de valeur actuelle nette nulle du swap au pair.", en: "DF_2 = (1 − c × DF_1) / (1 + c), from the swap's zero net present value equation at par." },
      explanation: {
        fr: `DF_2 = (1 − ${cPercent}%×${fmtDf(df1, "fr")}) / (1+${cPercent}%) ≈ ${fmtDf(correctDf2, "fr")}. Ce résultat vient de l'équation d'un swap au pair : la somme actualisée des coupons fixes plus le principal actualisé au dernier facteur doit égaler 1 (valeur nominale). Oublier le terme lié au premier facteur déjà connu, ou inverser un signe, sont les erreurs les plus fréquentes.`,
        en: `DF_2 = (1 − ${cPercent}%×${fmtDf(df1, "en")}) / (1+${cPercent}%) ≈ ${fmtDf(correctDf2, "en")}. This result comes from an at-par swap's equation: the discounted sum of fixed coupons plus the principal discounted at the last factor must equal 1 (face value). Forgetting the term tied to the already-known first factor, or flipping a sign, are the most frequent errors.`,
      },
      commonMistake: {
        fr: "Oublier d'inclure le terme lié au facteur d'actualisation déjà connu de la maturité précédente dans l'équation de bootstrap.",
        en: "Forgetting to include the term tied to the already-known discount factor from the previous maturity in the bootstrap equation.",
      },
    };
  },
};

const dfToRateConversionCalcTemplate: QuestionTemplate = {
  id: "m04-construction-courbe-zero-coupon-calcul-facteur-vers-taux",
  conceptId: "m04-construction-courbe-zero-coupon",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const maturity = pick(rng, [2, 3, 4, 5] as const);
    const df = randomInt(rng, 850, 950) / 1000;
    const correctRatePercent = Math.round((Math.pow(1 / df, 1 / maturity) - 1) * 10000) / 100;
    const wrongLinear = Math.round(((1 / df - 1) / maturity) * 10000) / 100;
    const wrongNoRoot = Math.round((1 / df - 1) * 10000) / 100;
    const wrongInverted = Math.round((1 - df) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Le facteur d'actualisation obtenu par bootstrap à la maturité ${maturity} ans est de ${fmtDf(df, "fr")}. Quel est le taux zéro-coupon composé annuellement correspondant ?`,
        en: `The bootstrap-derived discount factor at maturity ${maturity} years is ${fmtDf(df, "en")}. What is the corresponding annually-compounded zero-coupon rate?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmtPct(correctRatePercent, "fr", 2)}, en résolvant (1+r)^${maturity} = 1/DF puis en isolant r`, en: `${fmtPct(correctRatePercent, "en", 2)}, by solving (1+r)^${maturity} = 1/DF then isolating r` } },
        { id: "wrong-linear", label: { fr: `${fmtPct(wrongLinear, "fr", 2)}, en divisant (1/DF − 1) par la maturité au lieu d'utiliser une racine`, en: `${fmtPct(wrongLinear, "en", 2)}, by dividing (1/DF − 1) by maturity instead of using a root` } },
        { id: "wrong-no-root", label: { fr: `${fmtPct(wrongNoRoot, "fr", 2)}, en oubliant totalement d'ajuster pour le nombre d'années de composition`, en: `${fmtPct(wrongNoRoot, "en", 2)}, fully forgetting to adjust for the number of compounding years` } },
        { id: "wrong-inverted", label: { fr: `${fmtPct(wrongInverted, "fr", 2)}, en utilisant directement (1 − DF) au lieu de composer sur la maturité`, en: `${fmtPct(wrongInverted, "en", 2)}, by directly using (1 − DF) instead of compounding over maturity` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "DF = 1/(1+r)^maturité, donc r = (1/DF)^(1/maturité) − 1.", en: "DF = 1/(1+r)^maturity, so r = (1/DF)^(1/maturity) − 1." },
      explanation: {
        fr: `r = (1/${fmtDf(df, "fr")})^(1/${maturity}) − 1 ≈ ${fmtPct(correctRatePercent, "fr", 2)}. Diviser linéairement par la maturité au lieu d'utiliser une racine (composition) est l'erreur la plus fréquente : le facteur d'actualisation reflète une composition sur plusieurs années, pas un effet linéaire simple.`,
        en: `r = (1/${fmtDf(df, "en")})^(1/${maturity}) − 1 ≈ ${fmtPct(correctRatePercent, "en", 2)}. Dividing linearly by maturity instead of using a root (compounding) is the most frequent error: the discount factor reflects compounding over several years, not a simple linear effect.`,
      },
      commonMistake: {
        fr: "Convertir un facteur d'actualisation en taux zéro-coupon par une division linéaire par la maturité, en ignorant l'effet de composition sur plusieurs années.",
        en: "Converting a discount factor into a zero-coupon rate via a linear division by maturity, ignoring the compounding effect over several years.",
      },
    };
  },
};

const singleCurveSufficientMistakeTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-erreur-courbe-unique",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur la construction d'une courbe zéro-coupon par bootstrap est correcte ?",
    en: "Which of these statements about building a zero-coupon curve by bootstrapping is correct?",
  },
  choices: [
    { id: "single-curve-simplified-not-universal", label: { fr: "Une courbe zéro-coupon unique reste une simplification pédagogique utile, mais le cadre multi-courbe est devenu la norme professionnelle post-2008", en: "A single zero-coupon curve remains a useful teaching simplification, but the multi-curve framework has become the post-2008 professional standard" } },
    { id: "single-curve-always-sufficient", label: { fr: "Une seule courbe zéro-coupon, quelle que soit la méthode de construction, suffit toujours à pricer correctement tout produit de taux", en: "A single zero-coupon curve, whatever the construction method, is always enough to correctly price any rate product" } },
    { id: "bootstrap-only-for-swaps", label: { fr: "La méthode de bootstrap ne s'applique qu'aux swaps, jamais aux dépôts monétaires ou aux futures", en: "The bootstrap method only applies to swaps, never to money-market deposits or futures" } },
    { id: "curve-construction-irrelevant-to-pricing", label: { fr: "La méthode exacte de construction de la courbe n'a en pratique aucune influence sur le pricing des produits dérivés", en: "The curve's exact construction method has in practice no influence on derivative pricing" } },
  ],
  correctId: "single-curve-simplified-not-universal",
  hint: { fr: "Une courbe unique est une hypothèse SIMPLIFICATRICE, pas une description exacte du marché moderne des taux.", en: "A single curve is a SIMPLIFYING assumption, not an exact description of the modern rates market." },
  explanation: {
    fr: "Une courbe zéro-coupon unique, construite par bootstrap sur un seul jeu d'instruments, reste une simplification pédagogique utile pour comprendre le principe, mais le marché professionnel post-2008 utilise un cadre multi-courbe (une courbe pour l'actualisation, une autre pour la projection des taux variables), comme vu dans la notion suivante : le bootstrap s'applique à toute une gamme d'instruments (dépôts, futures, swaps), et la méthodologie de construction de courbe influence bien réellement le pricing des produits dérivés.",
    en: "A single zero-coupon curve, built by bootstrapping on one set of instruments, remains a useful teaching simplification for understanding the principle, but the post-2008 professional market uses a multi-curve framework (one curve for discounting, another for projecting floating rates), as seen in the next concept: bootstrapping applies to a whole range of instruments (deposits, futures, swaps), and the curve construction methodology does genuinely influence derivative pricing.",
  },
  commonMistake: {
    fr: "Croire qu'une seule courbe zéro-coupon suffit toujours en pratique, en ignorant le cadre multi-courbe devenu la norme professionnelle post-2008.",
    en: "Believing a single zero-coupon curve is always enough in practice, ignoring the multi-curve framework that has become the post-2008 professional standard.",
  },
});

const validationScenarioTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-scenario-validation",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk taux vient de construire une nouvelle courbe zéro-coupon par bootstrap. Comment valider concrètement que cette construction est correcte ?",
    en: "A rates desk has just built a new zero-coupon curve by bootstrapping. How can this construction concretely be validated?",
  },
  choices: [
    { id: "reprice-original-instruments", label: { fr: "Repricer avec la courbe obtenue les instruments de marché d'origine utilisés pour la construire, et vérifier qu'on retrouve exactement leurs prix cotés", en: "Reprice with the resulting curve the original market instruments used to build it, and verify their exact quoted prices are recovered" } },
    { id: "compare-to-other-desk-arbitrarily", label: { fr: "Comparer arbitrairement à la courbe d'un autre desk, la moindre différence signalant une erreur", en: "Arbitrarily compare to another desk's curve, the slightest difference signaling an error" } },
    { id: "no-validation-needed", label: { fr: "Aucune validation n'est nécessaire : la méthode de bootstrap garantit mathématiquement l'absence de toute erreur", en: "No validation is needed: the bootstrap method mathematically guarantees the absence of any error" } },
    { id: "check-only-shortest-maturity", label: { fr: "Vérifier uniquement le taux à la maturité la plus courte, les autres maturités en découlant automatiquement sans risque d'erreur", en: "Check only the shortest maturity's rate, other maturities following automatically with no risk of error" } },
  ],
  correctId: "reprice-original-instruments",
  hint: { fr: "Le test de cohérence standard consiste à vérifier que la courbe reproduit exactement les prix qui ont servi à la construire.", en: "The standard consistency test is checking the curve exactly reproduces the prices used to build it." },
  explanation: {
    fr: "Le test de validation standard consiste à repricer, avec la courbe zéro-coupon obtenue, chacun des instruments de marché d'origine (dépôts, futures, swaps) ayant servi à la construire : si la construction est correcte, on doit retrouver exactement leurs prix de marché cotés, à l'erreur numérique près — une comparaison arbitraire à un autre desk, l'absence de toute vérification, ou un contrôle limité à une seule maturité ne constituent pas une validation rigoureuse.",
    en: "The standard validation test is repricing, with the resulting zero-coupon curve, each of the original market instruments (deposits, futures, swaps) used to build it: if the construction is correct, their exact quoted market prices should be recovered, up to numerical error — an arbitrary comparison to another desk, no verification at all, or a check limited to a single maturity do not constitute rigorous validation.",
  },
  commonMistake: {
    fr: "Considérer qu'une construction de courbe par bootstrap est automatiquement sans erreur, sans effectuer le test de repricing des instruments d'origine.",
    en: "Considering a bootstrap curve construction is automatically error-free, without performing the repricing test on the original instruments.",
  },
});

const interpolationMethodComparisonTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-comparaison-interpolation",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  prompt: {
    fr: "Le marché ne cote pas d'instrument à exactement 7 ans, mais seulement à 5 et à 10 ans. Comment le desk obtient-il un taux zéro-coupon utilisable à 7 ans ?",
    en: "The market doesn't quote an instrument at exactly 7 years, only at 5 and 10 years. How does the desk get a usable 7-year zero-coupon rate?",
  },
  choices: [
    { id: "interpolate-between-known-points", label: { fr: "En interpolant (linéairement ou selon une méthode plus sophistiquée) entre les points de courbe déjà obtenus à 5 et 10 ans", en: "By interpolating (linearly or via a more sophisticated method) between the curve points already obtained at 5 and 10 years" } },
    { id: "impossible-without-quoted-instrument", label: { fr: "C'est par nature impossible : seules les maturités directement cotées sur le marché peuvent avoir un taux zéro-coupon", en: "It's by nature impossible: only market-quoted maturities can have a zero-coupon rate" } },
    { id: "use-5y-rate-directly", label: { fr: "En utilisant directement le taux à 5 ans, sans aucun ajustement, pour toute maturité intermédiaire", en: "By directly using the 5-year rate, with no adjustment, for any intermediate maturity" } },
    { id: "average-all-curve-points", label: { fr: "En calculant la moyenne de TOUS les points de la courbe déjà construite, quelle que soit leur maturité", en: "By computing the average of ALL points on the already-built curve, whatever their maturity" } },
  ],
  correctId: "interpolate-between-known-points",
  hint: { fr: "Le bootstrap donne des points DISCRETS aux maturités cotées ; une méthode complémentaire est nécessaire pour les maturités intermédiaires.", en: "Bootstrapping gives DISCRETE points at quoted maturities; a complementary method is needed for intermediate maturities." },
  explanation: {
    fr: "Le bootstrap ne fournit des points de courbe qu'aux maturités effectivement cotées sur le marché : pour une maturité intermédiaire non cotée comme 7 ans (entre 5 et 10 ans cotés), le desk interpole entre les points déjà obtenus, selon une méthode choisie (linéaire, cubique, log-linéaire sur les facteurs d'actualisation) — ce n'est ni impossible, ni une simple reprise du taux voisin le plus court, ni une moyenne de toute la courbe.",
    en: "Bootstrapping only provides curve points at maturities actually quoted in the market: for an unquoted intermediate maturity like 7 years (between the quoted 5 and 10 years), the desk interpolates between the points already obtained, using a chosen method (linear, cubic, log-linear on discount factors) — it is neither impossible, nor simply reusing the nearest shorter rate, nor an average of the whole curve.",
  },
  commonMistake: {
    fr: "Croire qu'une maturité non directement cotée sur le marché ne peut jamais avoir de taux zéro-coupon exploitable, en ignorant le rôle de l'interpolation.",
    en: "Believing a maturity not directly quoted in the market can never have a usable zero-coupon rate, ignoring interpolation's role.",
  },
});

const positiveForwardRateCalcTemplate: QuestionTemplate = {
  id: "m04-construction-courbe-zero-coupon-calcul-taux-forward-implicite",
  conceptId: "m04-construction-courbe-zero-coupon",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const df3 = randomInt(rng, 900, 940) / 1000;
    const df4 = df3 - randomInt(rng, 15, 30) / 1000;
    const correctForwardPercent = Math.round((df3 / df4 - 1) * 10000) / 100;
    const wrongInverted = Math.round((df4 / df3 - 1) * 10000) / 100;
    const wrongDifference = Math.round((df3 - df4) * 10000) / 100;
    const wrongAverage = Math.round(((df3 + df4) / 2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une courbe bootstrap donne un facteur d'actualisation à 3 ans de ${fmtDf(df3, "fr")} et à 4 ans de ${fmtDf(df4, "fr")}. Quel est le taux forward implicite entre l'année 3 et l'année 4 ?`,
        en: `A bootstrap curve gives a 3-year discount factor of ${fmtDf(df3, "en")} and a 4-year one of ${fmtDf(df4, "en")}. What is the implied forward rate between year 3 and year 4?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmtPct(correctForwardPercent, "fr", 2)}, en calculant DF_3/DF_4 − 1`, en: `${fmtPct(correctForwardPercent, "en", 2)}, by computing DF_3/DF_4 − 1` } },
        { id: "wrong-inverted", label: { fr: `${fmtPct(wrongInverted, "fr", 2)}, en inversant le ratio des deux facteurs d'actualisation`, en: `${fmtPct(wrongInverted, "en", 2)}, by inverting the ratio of the two discount factors` } },
        { id: "wrong-difference", label: { fr: `${fmtPct(wrongDifference, "fr", 2)}, en soustrayant directement les deux facteurs au lieu de calculer leur ratio`, en: `${fmtPct(wrongDifference, "en", 2)}, by directly subtracting the two factors instead of computing their ratio` } },
        { id: "wrong-average", label: { fr: `${fmtPct(wrongAverage * 100, "fr", 2)}, en faisant à tort la moyenne des deux facteurs d'actualisation`, en: `${fmtPct(wrongAverage * 100, "en", 2)}, by wrongly averaging the two discount factors` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Taux forward entre deux maturités = DF_courte/DF_longue − 1 (sur un an, ici).", en: "Forward rate between two maturities = DF_short/DF_long − 1 (over one year, here)." },
      explanation: {
        fr: `Taux forward 3→4 ans = ${fmtDf(df3, "fr")}/${fmtDf(df4, "fr")} − 1 ≈ ${fmtPct(correctForwardPercent, "fr", 2)}. Le ratio DF_3/DF_4 reflète le taux d'intérêt implicite sur la période intermédiaire ; inverser le ratio, soustraire au lieu de diviser, ou faire une moyenne sont des erreurs fréquentes qui ne reflètent pas la relation d'actualisation composée sous-jacente.`,
        en: `Forward rate 3→4yr = ${fmtDf(df3, "en")}/${fmtDf(df4, "en")} − 1 ≈ ${fmtPct(correctForwardPercent, "en", 2)}. The DF_3/DF_4 ratio reflects the implicit interest rate over the intermediate period; inverting the ratio, subtracting instead of dividing, or averaging are frequent errors that don't reflect the underlying compound discounting relationship.`,
      },
      commonMistake: {
        fr: "Confondre le calcul d'un taux forward implicite avec une simple différence ou moyenne des facteurs d'actualisation, au lieu de leur ratio.",
        en: "Confusing an implied forward rate's calculation with a simple difference or average of discount factors, instead of their ratio.",
      },
    };
  },
};

const wrongInstrumentTypeMistakeTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-erreur-mauvais-instrument",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk utilise une obligation d'entreprise notée BBB (avec un spread de crédit significatif) comme instrument d'entrée pour bootstrapper une courbe censée représenter le taux SANS RISQUE. Quel est le problème ?",
    en: "A desk uses a BBB-rated corporate bond (with a significant credit spread) as an input instrument to bootstrap a curve meant to represent the RISK-FREE rate. What is the problem?",
  },
  choices: [
    { id: "curve-contaminated-by-credit-spread", label: { fr: "La courbe obtenue intègre le spread de crédit de l'émetteur, et ne représente donc plus un taux réellement sans risque", en: "The resulting curve embeds the issuer's credit spread, and therefore no longer represents a genuinely risk-free rate" } },
    { id: "no-problem-any-bond-works", label: { fr: "Aucun problème : n'importe quel instrument obligataire, quelle que soit sa qualité de crédit, donne un taux sans risque équivalent après bootstrap", en: "No problem: any bond instrument, whatever its credit quality, gives an equivalent risk-free rate after bootstrapping" } },
    { id: "only-affects-short-maturities", label: { fr: "Le problème ne concerne que les maturités courtes de la courbe, jamais les maturités longues", en: "The problem only concerns the curve's short maturities, never the long maturities" } },
    { id: "bootstrap-automatically-strips-credit-spread", label: { fr: "Le processus de bootstrap élimine automatiquement tout spread de crédit contenu dans l'instrument d'entrée", en: "The bootstrapping process automatically strips out any credit spread contained in the input instrument" } },
  ],
  correctId: "curve-contaminated-by-credit-spread",
  hint: { fr: "Le bootstrap extrait un taux à partir du prix de l'instrument fourni : que contient ce prix si l'instrument porte un risque de crédit ?", en: "Bootstrapping extracts a rate from the input instrument's price: what does that price embed if the instrument carries credit risk?" },
  explanation: {
    fr: "Le choix des instruments d'entrée est déterminant : le bootstrap extrait un taux directement du prix de marché fourni, donc utiliser une obligation d'entreprise porteuse d'un spread de crédit produit une courbe qui mélange taux sans risque et prime de risque de crédit, la rendant impropre à représenter un taux réellement sans risque — c'est pourquoi les desks utilisent des instruments comme les dépôts interbancaires, les futures de taux courts ou les swaps OIS, réputés proches du sans-risque, plutôt que des obligations d'entreprise.",
    en: "The choice of input instruments is decisive: bootstrapping extracts a rate directly from the provided market price, so using a corporate bond carrying a credit spread produces a curve blending the risk-free rate and the credit risk premium, making it unfit to represent a genuinely risk-free rate — this is why desks use instruments like interbank deposits, short-rate futures or OIS swaps, considered close to risk-free, rather than corporate bonds.",
  },
  commonMistake: {
    fr: "Utiliser un instrument porteur de risque de crédit comme entrée d'un bootstrap censé produire une courbe sans risque, en ignorant que le résultat hérite de ce spread.",
    en: "Using a credit-risk-bearing instrument as a bootstrap input meant to produce a risk-free curve, ignoring that the result inherits that spread.",
  },
});

const curveShiftRepricingScenarioTemplate = mcqTemplate({
  id: "m04-construction-courbe-zero-coupon-scenario-repricing-quotidien",
  conceptId: "m04-construction-courbe-zero-coupon",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Chaque jour, les prix des instruments de marché (dépôts, futures, swaps) utilisés pour la courbe bootstrap évoluent légèrement. Quelle est la conséquence directe pour un desk taux ?",
    en: "Each day, the market instrument prices (deposits, futures, swaps) used for the bootstrap curve move slightly. What is the direct consequence for a rates desk?",
  },
  choices: [
    { id: "curve-rebuilt-daily", label: { fr: "La courbe zéro-coupon doit être reconstruite (au moins réévaluée) quotidiennement, pour rester cohérente avec les prix de marché actuels", en: "The zero-coupon curve must be rebuilt (at least reassessed) daily, to stay consistent with current market prices" } },
    { id: "curve-built-once-forever", label: { fr: "La courbe, une fois construite, reste valable indéfiniment sans jamais nécessiter de mise à jour", en: "The curve, once built, remains valid indefinitely, never needing an update" } },
    { id: "only-rebuild-after-major-events", label: { fr: "La courbe n'a besoin d'être reconstruite qu'après un événement de marché majeur, jamais en routine quotidienne", en: "The curve only needs rebuilding after a major market event, never as daily routine" } },
    { id: "manual-adjustment-sufficient", label: { fr: "Un simple ajustement manuel approximatif des anciens taux suffit, sans nécessiter un nouveau bootstrap complet", en: "A simple approximate manual adjustment of old rates is enough, with no need for a full new bootstrap" } },
  ],
  correctId: "curve-rebuilt-daily",
  hint: { fr: "Le bootstrap dépend directement des prix de marché observés : que se passe-t-il quand ces prix changent ?", en: "Bootstrapping directly depends on observed market prices: what happens when those prices change?" },
  explanation: {
    fr: "Puisque le bootstrap construit la courbe directement à partir des prix de marché observés, toute évolution de ces prix (même légère) rend la courbe précédente obsolète pour un pricing précis : un desk taux professionnel reconstruit donc sa courbe zéro-coupon quotidiennement (voire plus fréquemment), afin de rester cohérent avec les conditions de marché actuelles pour valoriser ses positions et calculer ses risques.",
    en: "Since bootstrapping builds the curve directly from observed market prices, any change in those prices (even slight) makes the previous curve stale for accurate pricing: a professional rates desk therefore rebuilds its zero-coupon curve daily (or even more frequently), to stay consistent with current market conditions when valuing positions and computing risk.",
  },
  commonMistake: {
    fr: "Croire qu'une courbe zéro-coupon construite une fois reste valable sans mise à jour, en ignorant que les prix de marché des instruments d'entrée évoluent en continu.",
    en: "Believing a zero-coupon curve built once remains valid without updating, ignoring that the input instruments' market prices continuously evolve.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  shortVsLongMaturityComparisonTemplate,
  wrongOrderWhatIfTemplate,
  inconsistentConventionsWhatIfTemplate,
  bootstrapCalcTemplate,
  dfToRateConversionCalcTemplate,
  singleCurveSufficientMistakeTemplate,
  validationScenarioTemplate,
  interpolationMethodComparisonTemplate,
  positiveForwardRateCalcTemplate,
  wrongInstrumentTypeMistakeTemplate,
  curveShiftRepricingScenarioTemplate,
];
