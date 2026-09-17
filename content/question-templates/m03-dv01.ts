import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const dv01NumericTemplate: QuestionTemplate = {
  id: "m03-dv01-calcul",
  conceptId: "m03-dv01",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const marketValue = randomInt(rng, 10, 200) * 100_000;
    const Dmod = randomFloat(rng, 1, 12, 2);
    const dv01 = Math.round(marketValue * Dmod * 0.0001 * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a une valeur de marché de ${fmt(marketValue, "fr", 0)} et une duration modifiée de ${fmt(Dmod, "fr")}. Quel est son DV01 ?`,
        en: `A position has a market value of ${fmt(marketValue, "en", 0)} and a modified duration of ${fmt(Dmod, "en")}. What is its DV01?`,
      },
      numericUnit: { fr: "même devise, par point de base", en: "same currency, per basis point" },
      numericTolerance: "± 5",
      hint: { fr: "DV01 ≈ Valeur de marché × D_mod × 0,0001.", en: "DV01 ≈ Market value × D_mod × 0.0001." },
      numeric: { value: dv01, tolerance: 5 },
      calculation: {
        fr: `DV01 ≈ ${fmt(marketValue, "fr", 0)} × ${fmt(Dmod, "fr")} × 0,0001 ≈ ${fmt(dv01, "fr")}.`,
        en: `DV01 ≈ ${fmt(marketValue, "en", 0)} × ${fmt(Dmod, "en")} × 0.0001 ≈ ${fmt(dv01, "en")}.`,
      },
      explanation: {
        fr: "C'est la perte (ou le gain, selon le sens de la position) approximative pour une hausse des taux de 1 point de base.",
        en: "This is the approximate loss (or gain, depending on the position's direction) for a 1 basis point rise in rates.",
      },
      commonMistake: {
        fr: "Oublier le facteur 0,0001 (1 point de base), ou l'appliquer deux fois.",
        en: "Forgetting the 0.0001 factor (1 basis point), or applying it twice.",
      },
    };
  },
};

const additiveTemplate: QuestionTemplate = {
  id: "m03-dv01-additivite",
  conceptId: "m03-dv01",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dv01A = randomInt(rng, 100, 5000);
    const dv01B = randomInt(rng, 100, 5000);
    const claimedTotal = pick(rng, [dv01A + dv01B, dv01A + dv01B + randomInt(rng, 50, 500)] as const);
    const isCorrect = claimedTotal === dv01A + dv01B;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille contient deux obligations, de DV01 respectifs ${dv01A} et ${dv01B}. On affirme que le DV01 total du portefeuille est ${claimedTotal}.`,
        en: `A portfolio holds two bonds, with DV01 of ${dv01A} and ${dv01B} respectively. It is claimed the portfolio's total DV01 is ${claimedTotal}.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [isCorrect ? "true" : "false"],
      explanation: {
        fr: `Le DV01 est additif à travers un portefeuille : total = ${dv01A} + ${dv01B} = ${dv01A + dv01B}. ${isCorrect ? "L'affirmation est donc correcte." : `L'affirmation (${claimedTotal}) est donc incorrecte.`}`,
        en: `DV01 is additive across a portfolio: total = ${dv01A} + ${dv01B} = ${dv01A + dv01B}. ${isCorrect ? "The claim is therefore correct." : `The claim (${claimedTotal}) is therefore incorrect.`}`,
      },
      commonMistake: {
        fr: "Essayer de pondérer ou moyenner les DV01 comme on le ferait pour des durations, alors que le DV01 s'additionne simplement.",
        en: "Trying to weight or average DV01s the way one would for durations, when DV01 simply adds up.",
      },
    };
  },
};

const hedgeSizingTemplate: QuestionTemplate = {
  id: "m03-dv01-couverture",
  conceptId: "m03-dv01",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const portfolioDv01 = randomInt(rng, 5000, 50000);
    const hedgeDv01 = randomInt(rng, 20, 200);
    const contracts = Math.round((portfolioDv01 / hedgeDv01) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille obligataire a un DV01 total de ${portfolioDv01}. Chaque contrat future utilisé pour la couverture a un DV01 de ${hedgeDv01}. Combien de contrats faut-il vendre pour neutraliser exactement le risque de taux du portefeuille ?`,
        en: `A bond portfolio has a total DV01 of ${portfolioDv01}. Each hedging future contract has a DV01 of ${hedgeDv01}. How many contracts must be sold to exactly neutralize the portfolio's interest rate risk?`,
      },
      numericUnit: { fr: "contrats", en: "contracts" },
      numericTolerance: "± 1",
      hint: { fr: "N = DV01_portefeuille / DV01_instrument.", en: "N = DV01_portfolio / DV01_instrument." },
      numeric: { value: contracts, tolerance: 1 },
      calculation: {
        fr: `N = ${portfolioDv01} / ${hedgeDv01} ≈ ${fmt(contracts, "fr")} contrats à vendre.`,
        en: `N = ${portfolioDv01} / ${hedgeDv01} ≈ ${fmt(contracts, "en")} contracts to sell.`,
      },
      explanation: {
        fr: "Vendre des futures de taux compense le DV01 positif d'un portefeuille long obligataire, neutralisant l'exposition à une hausse des taux.",
        en: "Selling rate futures offsets the positive DV01 of a long bond portfolio, neutralizing exposure to a rate rise.",
      },
      commonMistake: {
        fr: "Inverser le ratio (diviser le DV01 de l'instrument par celui du portefeuille) ou oublier que la couverture suppose un mouvement parallèle de la courbe.",
        en: "Inverting the ratio (dividing the instrument's DV01 by the portfolio's) or forgetting the hedge assumes a parallel curve shift.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m03-dv01-vocab",
  conceptId: "m03-dv01",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Le DV01 mesure la variation de prix pour une hausse de rendement d'un point de ______.",
      en: "DV01 measures the price change for a rise in yield of one ______ point.",
    },
    fillBlankPlaceholder: { fr: "deux mots", en: "two words" },
    acceptedAnswers: ["base", "basis"],
    hint: { fr: "1 pb = 0,01%.", en: "1 bp = 0.01%." },
    explanation: {
      fr: "DV01 = Dollar Value of 01, la variation de prix pour un mouvement de 1 point de base (0,01%) du rendement.",
      en: "DV01 = Dollar Value of 01, the price change for a 1 basis point (0.01%) move in yield.",
    },
    commonMistake: {
      fr: "Confondre point de base (0,01%) et point de pourcentage entier (1%), un facteur 100 d'erreur.",
      en: "Confusing a basis point (0.01%) with a full percentage point (1%), a 100x error.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-dv01-comprehension-utilite",
  conceptId: "m03-dv01",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi un trader de taux préfère-t-il souvent raisonner en DV01 (une somme d'argent) plutôt qu'en duration modifiée (un pourcentage) pour piloter son risque au quotidien ?",
    en: "Why does a rate trader often prefer reasoning in DV01 (a money amount) rather than modified duration (a percentage) to manage risk day-to-day?",
  },
  choices: [
    { id: "common-unit", label: { fr: "Le DV01 s'exprime dans une unité monétaire commune et directement additive, quelle que soit la taille ou le type de chaque obligation", en: "DV01 is expressed in a common, directly additive monetary unit, whatever each bond's size or type" } },
    { id: "no-approximation", label: { fr: "Le DV01 est exact, contrairement à la duration modifiée qui est toujours une approximation", en: "DV01 is exact, unlike modified duration which is always an approximation" } },
    { id: "no-reason", label: { fr: "Il n'y a pas de vraie raison, les deux mesures sont strictement interchangeables en toute situation", en: "There's no real reason, the two measures are strictly interchangeable in any situation" } },
  ],
  correctId: "common-unit",
  hint: { fr: "Comment agréger le risque de 50 obligations différentes en un seul chiffre parlant ?", en: "How do you aggregate the risk of 50 different bonds into one meaningful number?" },
  explanation: {
    fr: "Le DV01 traduit directement le risque en une unité monétaire commune (euros, dollars par point de base), qui s'additionne simplement à travers tout un portefeuille, quelle que soit la taille ou la duration propre de chaque ligne — contrairement à un pourcentage (duration modifiée) qu'il faudrait repondérer par la valeur de chaque position pour l'agréger correctement.",
    en: "DV01 directly translates risk into a common monetary unit (euros, dollars per basis point), which simply adds up across an entire portfolio, whatever each line's size or duration — unlike a percentage (modified duration) which would need to be reweighted by each position's value to aggregate correctly.",
  },
  commonMistake: {
    fr: "Croire que le DV01 est une mesure exacte plutôt qu'une approximation locale (comme la duration), au lieu de son véritable avantage : l'agrégation directe en unité monétaire.",
    en: "Believing DV01 is an exact measure rather than a local approximation (like duration), instead of its real advantage: direct aggregation in monetary units.",
  },
});

const equalValueComparisonTemplate = mcqTemplate({
  id: "m03-dv01-comparaison-meme-valeur",
  conceptId: "m03-dv01",
  difficulty: "medium",
  prompt: {
    fr: "Deux positions ont exactement la même valeur de marché, mais l'une a une duration modifiée de 3 et l'autre de 9. Laquelle a le DV01 le plus élevé ?",
    en: "Two positions have exactly the same market value, but one has a modified duration of 3 and the other of 9. Which one has the higher DV01?",
  },
  choices: [
    { id: "dmod9", label: { fr: "Celle avec D_mod = 9", en: "The one with D_mod = 9" } },
    { id: "dmod3", label: { fr: "Celle avec D_mod = 3", en: "The one with D_mod = 3" } },
    { id: "same", label: { fr: "Les deux ont le même DV01, seule la valeur de marché compte", en: "Both have the same DV01, only market value matters" } },
  ],
  correctId: "dmod9",
  hint: { fr: "DV01 ≈ Valeur × D_mod × 0,0001 : à valeur identique, D_mod est le seul facteur qui diffère.", en: "DV01 ≈ Value × D_mod × 0.0001: at equal value, D_mod is the only differing factor." },
  explanation: {
    fr: "À valeur de marché identique, le DV01 est directement proportionnel à D_mod : la position avec D_mod = 9 a un DV01 trois fois plus élevé que celle avec D_mod = 3, reflétant sa plus grande sensibilité relative aux taux.",
    en: "At equal market value, DV01 is directly proportional to D_mod: the position with D_mod = 9 has a DV01 three times higher than the one with D_mod = 3, reflecting its greater relative rate sensitivity.",
  },
  commonMistake: {
    fr: "Croire que seule la valeur de marché détermine le DV01, en oubliant que la duration modifiée est un facteur tout aussi déterminant.",
    en: "Believing only market value determines DV01, forgetting modified duration is just as determining a factor.",
  },
});

const whatIfDoubleNotionalTemplate = mcqTemplate({
  id: "m03-dv01-whatif-double-notionnel",
  conceptId: "m03-dv01",
  difficulty: "easy",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même D_mod), si la valeur de marché d'une position double, que devient son DV01 ?",
    en: "All else equal (same D_mod), if a position's market value doubles, what happens to its DV01?",
  },
  choices: [
    { id: "doubles", label: { fr: "Il double exactement", en: "It exactly doubles" } },
    { id: "unchanged", label: { fr: "Il reste inchangé", en: "It stays unchanged" } },
    { id: "quadruples", label: { fr: "Il quadruple", en: "It quadruples" } },
  ],
  correctId: "doubles",
  hint: { fr: "DV01 ≈ Valeur × D_mod × 0,0001 : la valeur de marché entre de façon linéaire.", en: "DV01 ≈ Value × D_mod × 0.0001: market value enters linearly." },
  explanation: {
    fr: "Le DV01 est directement proportionnel à la valeur de marché de la position, D_mod restant fixe : doubler la taille de la position double exactement son DV01, une relation linéaire simple.",
    en: "DV01 is directly proportional to the position's market value, with D_mod fixed: doubling the position's size exactly doubles its DV01, a simple linear relationship.",
  },
  commonMistake: {
    fr: "Supposer une relation non linéaire entre la taille de la position et son DV01, alors que la valeur de marché entre de façon purement proportionnelle dans la formule.",
    en: "Assuming a non-linear relationship between position size and DV01, when market value enters the formula purely proportionally.",
  },
});

const whatIfBondAgesTemplate = mcqTemplate({
  id: "m03-dv01-whatif-obligation-vieillit",
  conceptId: "m03-dv01",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même valeur de marché), à mesure qu'une obligation se rapproche de son échéance, que devient généralement son DV01 ?",
    en: "All else equal (same market value), as a bond approaches its maturity, what generally happens to its DV01?",
  },
  choices: [
    { id: "decreases", label: { fr: "Il diminue, car la duration modifiée diminue à mesure que l'échéance approche", en: "It decreases, since modified duration decreases as maturity approaches" } },
    { id: "increases", label: { fr: "Il augmente à mesure que l'échéance approche", en: "It increases as maturity approaches" } },
    { id: "unaffected", label: { fr: "Il reste constant durant toute la vie de l'obligation", en: "It stays constant throughout the bond's life" } },
  ],
  correctId: "decreases",
  hint: { fr: "Le DV01 dépend directement de D_mod, qui diminue elle-même avec le temps qui passe (M03-3).", en: "DV01 directly depends on D_mod, which itself decreases as time passes (M03-3)." },
  explanation: {
    fr: "Puisque DV01 ≈ Valeur × D_mod × 0,0001, et que D_mod diminue mécaniquement à mesure que l'échéance se rapproche (moins de flux restants, de plus en plus proches), le DV01 diminue lui aussi, à valeur de marché égale — un risque de taux qui s'atténue naturellement avec le temps, sans qu'aucune couverture active ne soit nécessaire pour cet effet particulier.",
    en: "Since DV01 ≈ Value × D_mod × 0.0001, and D_mod mechanically decreases as maturity approaches (fewer remaining flows, increasingly close), DV01 also decreases, at equal market value — a rate risk that naturally fades over time, with no active hedging needed for this particular effect.",
  },
  commonMistake: {
    fr: "Croire que le DV01 d'une obligation reste fixe pendant toute sa durée de vie, en oubliant sa dépendance directe à la duration modifiée, elle-même décroissante avec le temps.",
    en: "Believing a bond's DV01 stays fixed throughout its life, forgetting its direct dependence on modified duration, itself decreasing over time.",
  },
});

const requiredValueNumericTemplate: QuestionTemplate = {
  id: "m03-dv01-valeur-requise-calcul",
  conceptId: "m03-dv01",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const targetDv01 = randomInt(rng, 500, 10000);
    const Dmod = randomFloat(rng, 1, 12, 2);
    const requiredValue = Math.round((targetDv01 / (Dmod * 0.0001)) / 100) * 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un gérant veut construire une position de duration modifiée ${fmt(Dmod, "fr")} avec un DV01 cible de ${targetDv01}. Quelle valeur de marché de position doit-il détenir (arrondie à la centaine) ?`,
        en: `A manager wants to build a position with modified duration ${fmt(Dmod, "en")} and a target DV01 of ${targetDv01}. What market value of position must they hold (rounded to the nearest hundred)?`,
      },
      numericUnit: { fr: "même devise que le DV01", en: "same currency as the DV01" },
      numericTolerance: "± 500",
      hint: { fr: "Inversez DV01 = Valeur × D_mod × 0,0001 : Valeur = DV01 / (D_mod × 0,0001).", en: "Invert DV01 = Value × D_mod × 0.0001: Value = DV01 / (D_mod × 0.0001)." },
      numeric: { value: requiredValue, tolerance: 500 },
      calculation: {
        fr: `Valeur = ${targetDv01} / (${fmt(Dmod, "fr")} × 0,0001) ≈ ${fmt(requiredValue, "fr", 0)}.`,
        en: `Value = ${targetDv01} / (${fmt(Dmod, "en")} × 0.0001) ≈ ${fmt(requiredValue, "en", 0)}.`,
      },
      explanation: {
        fr: "Inverser la formule du DV01 pour trouver la taille de position nécessaire est utile pour dimensionner une exposition cible (par exemple, une limite de risque exprimée en DV01), plutôt que pour évaluer le DV01 d'une position déjà existante.",
        en: "Inverting the DV01 formula to find the needed position size is useful for sizing a target exposure (e.g., a risk limit expressed in DV01), rather than for evaluating an already-existing position's DV01.",
      },
      commonMistake: {
        fr: "Oublier de diviser par 0,0001 en plus de D_mod, ce qui produit une valeur 10 000 fois trop petite.",
        en: "Forgetting to divide by 0.0001 in addition to D_mod, which produces a value 10,000 times too small.",
      },
    };
  },
};

const parallelShiftErrorTemplate = trueFalseTemplate({
  id: "m03-dv01-erreur-mouvement-parallele",
  conceptId: "m03-dv01",
  difficulty: "medium",
  statement: {
    fr: "Le DV01 mesure précisément l'impact de n'importe quel mouvement de la courbe des taux, y compris un mouvement où seuls les taux courts bougent et les taux longs restent fixes.",
    en: "DV01 precisely measures the impact of any yield curve movement, including one where only short rates move and long rates stay fixed.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le DV01 standard suppose un déplacement PARALLÈLE de la courbe des taux (tous les points bougent de façon identique). Un mouvement non parallèle (seulement les taux courts, ou seulement les taux longs) n'est pas correctement capturé par ce DV01 global — c'est pour cela que les desks professionnels utilisent aussi des « key rate DV01 » par tranche de maturité.",
    en: "False: standard DV01 assumes a PARALLEL shift of the yield curve (every point moves identically). A non-parallel move (only short rates, or only long rates) isn't correctly captured by this aggregate DV01 — this is why professional desks also use \"key rate DV01\" by maturity bucket.",
  },
  commonMistake: {
    fr: "Croire que le DV01 global capture tout type de mouvement de courbe, en oubliant l'hypothèse implicite de déplacement parallèle sur laquelle il repose.",
    en: "Believing the aggregate DV01 captures any type of curve movement, forgetting the implicit parallel-shift assumption it rests on.",
  },
});

const multiCurrencyPortfolioScenarioTemplate = mcqTemplate({
  id: "m03-dv01-scenario-portefeuille-multi-devises",
  conceptId: "m03-dv01",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un portefeuille détient une obligation en EUR de DV01 = 5 000 EUR et une obligation en USD de DV01 = 4 000 USD. Peut-on simplement les additionner pour obtenir « un » DV01 total de portefeuille de 9 000 ?",
    en: "A portfolio holds a EUR bond with DV01 = EUR 5,000 and a USD bond with DV01 = USD 4,000. Can these simply be added to get \"a\" total portfolio DV01 of 9,000?",
  },
  choices: [
    { id: "no-currency", label: { fr: "Non : les deux DV01 sont dans des devises différentes et mesurent une sensibilité à des courbes de taux différentes, il faut les garder séparés (ou les convertir en une devise commune)", en: "No: the two DV01s are in different currencies and measure sensitivity to different rate curves, they must be kept separate (or converted to a common currency)" } },
    { id: "yes-simple", label: { fr: "Oui, le DV01 est toujours additif, quelle que soit la devise concernée", en: "Yes, DV01 is always additive, whatever currency is involved" } },
    { id: "irrelevant", label: { fr: "La devise n'a aucune importance pour le calcul du DV01", en: "Currency has no importance for the DV01 calculation" } },
  ],
  correctId: "no-currency",
  hint: { fr: "Le DV01 mesure la sensibilité à SA propre courbe de taux (EUR pour l'un, USD pour l'autre) : ce sont deux risques de nature différente.", en: "DV01 measures sensitivity to ITS OWN rate curve (EUR for one, USD for the other): these are two risks of a different nature." },
  explanation: {
    fr: "L'additivité du DV01 (M03-8) ne vaut qu'au sein d'une même courbe de taux (même devise) : additionner un DV01 en EUR et un DV01 en USD mélangerait deux risques distincts (les taux EUR et les taux USD bougent rarement de façon identique), produisant un chiffre trompeur. Il faut soit les garder séparés, soit les convertir dans une devise commune en tenant compte du taux de change, pour une agrégation économiquement significative.",
    en: "DV01's additivity (M03-8) only holds within the same rate curve (same currency): adding a EUR DV01 and a USD DV01 would mix two distinct risks (EUR and USD rates rarely move identically), producing a misleading figure. They must either be kept separate, or converted into a common currency accounting for the exchange rate, for a meaningful aggregation.",
  },
  commonMistake: {
    fr: "Additionner naïvement des DV01 exprimés dans des devises différentes, en oubliant que l'additivité du DV01 suppose une même courbe de taux sous-jacente.",
    en: "Naively adding DV01s expressed in different currencies, forgetting DV01's additivity assumes the same underlying rate curve.",
  },
});

const riskLimitScenarioTemplate = mcqTemplate({
  id: "m03-dv01-scenario-limite-risque",
  conceptId: "m03-dv01",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk a une limite de risque fixée à un DV01 maximal de 20 000. Son portefeuille actuel a un DV01 de 17 000, et un trader propose d'ajouter une position dont le DV01 est de 4 000. Cette nouvelle position respecte-t-elle la limite ?",
    en: "A desk has a risk limit set at a maximum DV01 of 20,000. Its current portfolio has a DV01 of 17,000, and a trader proposes adding a position with a DV01 of 4,000. Does this new position respect the limit?",
  },
  choices: [
    { id: "breach", label: { fr: "Non : le DV01 total atteindrait 21 000, dépassant la limite de 20 000", en: "No: total DV01 would reach 21,000, exceeding the 20,000 limit" } },
    { id: "ok", label: { fr: "Oui, tant que chaque position individuelle reste sous la limite", en: "Yes, as long as each individual position stays under the limit" } },
    { id: "not-comparable", label: { fr: "On ne peut pas savoir sans connaître la duration de chaque obligation individuellement", en: "It's impossible to know without knowing each individual bond's duration" } },
  ],
  correctId: "breach",
  hint: { fr: "Le DV01 s'additionne directement à travers tout le portefeuille, la limite s'applique au total.", en: "DV01 adds up directly across the whole portfolio, the limit applies to the total." },
  explanation: {
    fr: "Grâce à l'additivité du DV01 (M03-8), le DV01 total après l'ajout serait 17 000 + 4 000 = 21 000, dépassant la limite fixée à 20 000 : la position ne peut pas être ajoutée telle quelle. C'est précisément cette additivité qui rend le DV01 pratique pour fixer et surveiller des limites de risque au niveau d'un desk entier, sans avoir à examiner chaque duration individuelle.",
    en: "Thanks to DV01's additivity (M03-8), the total DV01 after the addition would be 17,000 + 4,000 = 21,000, exceeding the 20,000 limit set: the position cannot be added as is. It is precisely this additivity that makes DV01 practical for setting and monitoring risk limits at an entire desk's level, without having to examine each individual duration.",
  },
  commonMistake: {
    fr: "Vérifier une limite de risque au niveau de chaque position individuelle plutôt qu'au niveau du portefeuille agrégé, en oubliant que le DV01 s'additionne directement.",
    en: "Checking a risk limit at each individual position's level rather than the aggregated portfolio's, forgetting DV01 adds up directly.",
  },
});

export const templates: QuestionTemplate[] = [
  dv01NumericTemplate,
  additiveTemplate,
  hedgeSizingTemplate,
  vocabTemplate,
  comprehensionTemplate,
  equalValueComparisonTemplate,
  whatIfDoubleNotionalTemplate,
  whatIfBondAgesTemplate,
  requiredValueNumericTemplate,
  parallelShiftErrorTemplate,
  multiCurrencyPortfolioScenarioTemplate,
  riskLimitScenarioTemplate,
];
