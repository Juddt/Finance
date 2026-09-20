import { randomInt, pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const comprehensionTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-comprehension",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "medium",
  prompt: {
    fr: "Que mesure la key rate duration d'une position ?",
    en: "What does a position's key rate duration measure?",
  },
  choices: [
    { id: "single-maturity-sensitivity", label: { fr: "La sensibilité du prix à un déplacement d'une seule maturité clé de la courbe, les autres restant fixes", en: "The price's sensitivity to a shift in a single key maturity of the curve, others held fixed" } },
    { id: "global-parallel-sensitivity", label: { fr: "La sensibilité du prix à un déplacement parallèle de toute la courbe des taux", en: "The price's sensitivity to a parallel shift of the entire yield curve" } },
    { id: "credit-spread-sensitivity", label: { fr: "La sensibilité du prix à une variation du spread de crédit de l'émetteur", en: "The price's sensitivity to a change in the issuer's credit spread" } },
    { id: "coupon-frequency-effect", label: { fr: "L'effet de la fréquence de versement des coupons sur le prix de l'obligation", en: "The effect of the coupon payment frequency on the bond's price" } },
  ],
  correctId: "single-maturity-sensitivity",
  hint: { fr: "\"Key rate\" signifie \"taux clé\" : une seule maturité isolée, pas toute la courbe.", en: "\"Key rate\" means one isolated maturity, not the whole curve." },
  explanation: {
    fr: "La key rate duration isole la sensibilité à UNE SEULE maturité clé de la courbe, les autres points restant fixes, contrairement au DV01 global qui suppose un déplacement parallèle de toute la courbe. Elle ne mesure ni le risque de crédit (CS01), ni un effet lié à la fréquence des coupons.",
    en: "Key rate duration isolates sensitivity to ONE SINGLE key maturity of the curve, other points held fixed, unlike global DV01 which assumes a parallel shift of the entire curve. It measures neither credit risk (CS01) nor an effect tied to coupon frequency.",
  },
  commonMistake: {
    fr: "Confondre la key rate duration avec le DV01 global, en oubliant qu'elle isole une seule maturité plutôt que de supposer un déplacement parallèle.",
    en: "Confusing key rate duration with global DV01, forgetting it isolates a single maturity rather than assuming a parallel shift.",
  },
});

const globalVsKeyRateComparisonTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-comparaison-global-key-rate",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "medium",
  prompt: {
    fr: "En quoi le DV01 global d'un portefeuille diffère-t-il fondamentalement de sa décomposition en key rate duration ?",
    en: "How does a portfolio's global DV01 fundamentally differ from its key rate duration breakdown?",
  },
  choices: [
    { id: "global-assumes-parallel-krd-reveals-shape", label: { fr: "Le DV01 global suppose un déplacement parallèle de la courbe, tandis que la key rate duration révèle le risque lié à sa déformation (pentification, aplatissement)", en: "Global DV01 assumes a parallel curve shift, while key rate duration reveals the risk tied to its deformation (steepening, flattening)" } },
    { id: "identical-information-different-units", label: { fr: "Les deux mesures contiennent exactement la même information, exprimée simplement dans des unités différentes", en: "Both measures contain exactly the same information, simply expressed in different units" } },
    { id: "krd-only-for-derivatives", label: { fr: "La key rate duration ne s'applique qu'aux produits dérivés, jamais aux obligations classiques", en: "Key rate duration only applies to derivative products, never to classic bonds" } },
    { id: "global-dv01-always-more-precise", label: { fr: "Le DV01 global est toujours plus précis que la key rate duration, qui n'est qu'une approximation grossière", en: "Global DV01 is always more precise than key rate duration, which is only a rough approximation" } },
  ],
  correctId: "global-assumes-parallel-krd-reveals-shape",
  hint: { fr: "Le DV01 global perd de l'information dès que la courbe ne se déplace pas parfaitement en bloc.", en: "Global DV01 loses information as soon as the curve doesn't shift perfectly as a block." },
  explanation: {
    fr: "Le DV01 global agrège toute la sensibilité en un seul chiffre en supposant implicitement un déplacement parallèle de la courbe, tandis que la key rate duration décompose cette sensibilité maturité par maturité, révélant un risque de déformation de courbe (pentification, aplatissement) totalement invisible dans le seul chiffre global. Ce n'est donc pas la même information sous une autre forme : la key rate duration contient strictement plus d'information.",
    en: "Global DV01 aggregates all sensitivity into a single number, implicitly assuming a parallel curve shift, while key rate duration breaks this sensitivity down maturity by maturity, revealing curve-deformation risk (steepening, flattening) that is totally invisible in the single global figure. This is therefore not the same information in another form: key rate duration strictly contains more information.",
  },
  commonMistake: {
    fr: "Croire que le DV01 global et la key rate duration apportent la même information, alors que le premier masque le risque de déformation de la courbe.",
    en: "Believing global DV01 and key rate duration convey the same information, when the former hides curve-deformation risk.",
  },
});

const steepenerWhatIfTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-what-if-steepener",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un portefeuille est long une obligation courte et court une obligation longue, avec un DV01 global net rigoureusement nul. La courbe des taux pentifie (le taux long monte, le taux court reste stable). Quel est l'effet probable sur le portefeuille ?",
    en: "A portfolio is long a short-maturity bond and short a long-maturity bond, with a net global DV01 of strictly zero. The yield curve steepens (the long rate rises, the short rate stays flat). What is the likely effect on the portfolio?",
  },
  choices: [
    { id: "gain-despite-zero-global-dv01", label: { fr: "Le portefeuille peut réaliser un gain ou une perte selon le sens exact des positions, malgré un DV01 global nul, car seule la maturité longue bouge", en: "The portfolio can realize a gain or a loss depending on the positions' exact direction, despite a zero global DV01, because only the long maturity moves" } },
    { id: "no-effect-dv01-zero", label: { fr: "Aucun effet, un DV01 global nul garantissant l'absence totale de variation de valeur quel que soit le scénario de taux", en: "No effect at all, a zero global DV01 guaranteeing a total absence of value change regardless of the rate scenario" } },
    { id: "always-a-loss", label: { fr: "Le portefeuille subit nécessairement une perte, toute pentification étant par nature défavorable à un DV01 global nul", en: "The portfolio necessarily suffers a loss, any steepening being by nature unfavorable to a zero global DV01" } },
    { id: "always-a-gain", label: { fr: "Le portefeuille réalise nécessairement un gain, toute pentification étant par nature favorable à un DV01 global nul", en: "The portfolio necessarily realizes a gain, any steepening being by nature favorable to a zero global DV01" } },
  ],
  correctId: "gain-despite-zero-global-dv01",
  hint: { fr: "Un DV01 global nul ne protège que contre un déplacement PARALLÈLE ; ici, seule une des deux maturités bouge.", en: "A zero global DV01 only protects against a PARALLEL shift; here, only one of the two maturities moves." },
  explanation: {
    fr: "Un DV01 global nul ne protège que contre un déplacement parallèle de la courbe, pas contre une déformation : ici, seul le taux long bouge, donc seule la position courte en maturité longue est affectée, produisant un gain ou une perte selon son sens exact — le résultat dépend de la structure précise de la position, jamais uniforme dans un sens ou dans l'autre par construction.",
    en: "A zero global DV01 only protects against a parallel curve shift, not against a deformation: here, only the long rate moves, so only the short position in the long maturity is affected, producing a gain or a loss depending on its exact direction — the result depends on the position's precise structure, never uniformly one way or the other by construction.",
  },
  commonMistake: {
    fr: "Croire qu'un DV01 global nul garantit une absence totale de variation de valeur, même quand la courbe se déforme plutôt que de se déplacer en bloc.",
    en: "Believing a zero global DV01 guarantees a total absence of value change, even when the curve deforms rather than shifting as a block.",
  },
});

const flattenerWhatIfTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-what-if-flattener",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La courbe des taux s'aplatit : le taux à 10 ans baisse tandis que le taux à 2 ans reste stable. Comment décrire ce mouvement en termes de key rate duration ?",
    en: "The yield curve flattens: the 10-year rate falls while the 2-year rate stays flat. How is this move described in key rate duration terms?",
  },
  choices: [
    { id: "only-10y-key-rate-moves", label: { fr: "Seule la key rate duration associée à la maturité 10 ans est concernée par ce mouvement, la key rate 2 ans restant sans effet", en: "Only the key rate duration tied to the 10-year maturity is affected by this move, the 2-year key rate having no effect" } },
    { id: "both-key-rates-equally", label: { fr: "Les key rate durations 2 ans et 10 ans sont affectées de façon strictement identique par ce mouvement", en: "Both the 2-year and 10-year key rate durations are affected in a strictly identical way by this move" } },
    { id: "not-a-curve-concept", label: { fr: "Ce mouvement ne peut pas être décrit avec la notion de key rate duration, réservée aux déplacements parallèles", en: "This move cannot be described using the key rate duration concept, which is reserved for parallel shifts" } },
    { id: "global-dv01-only", label: { fr: "Seul le DV01 global permet de décrire correctement ce mouvement, la key rate duration étant inutile ici", en: "Only the global DV01 allows correctly describing this move, key rate duration being useless here" } },
  ],
  correctId: "only-10y-key-rate-moves",
  hint: { fr: "Le taux 2 ans ne bouge pas dans cet énoncé : quelle key rate duration est donc concernée ?", en: "The 2-year rate doesn't move in this scenario: which key rate duration is therefore involved?" },
  explanation: {
    fr: "Puisque seul le taux à 10 ans bouge, seule la contribution associée à la key rate duration de maturité 10 ans est concernée : c'est précisément l'intérêt de la décomposition par maturité clé, qui permet de décrire un mouvement non parallèle comme celui-ci, impossible à capturer correctement avec le seul DV01 global.",
    en: "Since only the 10-year rate moves, only the contribution tied to the 10-year key rate duration is involved: this is precisely the point of the maturity-by-maturity breakdown, which allows describing a non-parallel move like this one, impossible to correctly capture with the global DV01 alone.",
  },
  commonMistake: {
    fr: "Supposer qu'un mouvement de courbe affecte toujours toutes les maturités de façon identique, en ignorant que seule une maturité peut bouger isolément.",
    en: "Assuming a curve move always affects all maturities identically, ignoring that a single maturity can move in isolation.",
  },
});

const dv01SumCalcTemplate: QuestionTemplate = {
  id: "m03-sensibilite-courbe-calcul-somme-dv01",
  conceptId: "m03-sensibilite-courbe",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dv01Short = randomInt(rng, 1, 5) * 1000;
    const dv01Long = -randomInt(rng, 1, 5) * 1000;
    const correctSum = dv01Short + dv01Long;
    const wrongAbsSum = Math.abs(dv01Short) + Math.abs(dv01Long);
    const wrongProduct = Math.round((dv01Short * dv01Long) / 1000);
    const wrongShortOnly = dv01Short;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a une key rate duration de ${fmt(dv01Short, "fr")} sur la maturité courte et de ${fmt(dv01Long, "fr")} sur la maturité longue. Quel est le DV01 global du portefeuille (déplacement parallèle) ?`,
        en: `A position has a key rate duration of ${fmt(dv01Short, "en")} on the short maturity and ${fmt(dv01Long, "en")} on the long maturity. What is the portfolio's global DV01 (parallel shift)?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctSum, "fr")}, en additionnant les deux key rate durations avec leur signe`, en: `${fmt(correctSum, "en")}, by adding the two key rate durations with their sign` } },
        { id: "wrong-abs-sum", label: { fr: `${fmt(wrongAbsSum, "fr")}, en additionnant les valeurs absolues, en ignorant les signes opposés`, en: `${fmt(wrongAbsSum, "en")}, by adding the absolute values, ignoring the opposite signs` } },
        { id: "wrong-product", label: { fr: `${fmt(wrongProduct, "fr")}, en multipliant les deux key rate durations au lieu de les additionner`, en: `${fmt(wrongProduct, "en")}, by multiplying the two key rate durations instead of adding them` } },
        { id: "wrong-short-only", label: { fr: `${fmt(wrongShortOnly, "fr")}, en ne retenant que la key rate duration de la maturité courte`, en: `${fmt(wrongShortOnly, "en")}, by keeping only the short maturity's key rate duration` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Sous l'hypothèse d'un déplacement parallèle, le DV01 global est la SOMME algébrique des key rate durations.", en: "Under the parallel-shift assumption, global DV01 is the algebraic SUM of the key rate durations." },
      explanation: {
        fr: `DV01 global = ${fmt(dv01Short, "fr")} + (${fmt(dv01Long, "fr")}) = ${fmt(correctSum, "fr")}, en additionnant les key rate durations AVEC leur signe (une position courte donnant un DV01 négatif). Ignorer les signes en additionnant les valeurs absolues est l'erreur la plus fréquente sur ce calcul.`,
        en: `Global DV01 = ${fmt(dv01Short, "en")} + (${fmt(dv01Long, "en")}) = ${fmt(correctSum, "en")}, by adding the key rate durations WITH their sign (a short position giving a negative DV01). Ignoring signs by adding absolute values is the most frequent error on this calculation.`,
      },
      commonMistake: {
        fr: "Additionner les valeurs absolues des key rate durations au lieu de respecter leur signe, ce qui fausse le DV01 global calculé.",
        en: "Adding the absolute values of the key rate durations instead of respecting their sign, which distorts the computed global DV01.",
      },
    };
  },
};

const curveTwistImpactCalcTemplate: QuestionTemplate = {
  id: "m03-sensibilite-courbe-calcul-impact-deformation",
  conceptId: "m03-sensibilite-courbe",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const dv01Long = randomInt(rng, 2, 6) * 1000;
    const rateChangeBp = pick(rng, [5, 10, 15, 20] as const);
    const correctLoss = -dv01Long * rateChangeBp;
    const wrongSign = -correctLoss;
    const wrongUsesGlobalZero = 0;
    const halved = Math.round(correctLoss / 2);

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille a un DV01 global net de zéro, mais une key rate duration de ${fmt(dv01Long, "fr")} sur la maturité longue (et l'opposé sur la maturité courte). Seul le taux long monte de ${rateChangeBp} points de base, le taux court restant stable. Quelle est la variation de valeur estimée du portefeuille ?`,
        en: `A portfolio has a net global DV01 of zero, but a key rate duration of ${fmt(dv01Long, "en")} on the long maturity (and the opposite on the short maturity). Only the long rate rises by ${rateChangeBp} basis points, the short rate staying flat. What is the portfolio's estimated value change?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctLoss, "fr")}, en appliquant −DV01_long × Δr_long uniquement, le taux court ne bougeant pas`, en: `${fmt(correctLoss, "en")}, by applying −DV01_long × Δr_long only, the short rate not moving` } },
        { id: "wrong-zero", label: { fr: `0, un DV01 global nul impliquant nécessairement une valeur inchangée quel que soit le mouvement de courbe`, en: `0, a zero global DV01 necessarily implying an unchanged value regardless of the curve move` } },
        { id: "wrong-sign", label: { fr: `+${fmt(Math.abs(wrongSign), "fr")}, en inversant le signe de la contribution de la maturité longue`, en: `+${fmt(Math.abs(wrongSign), "en")}, by flipping the sign of the long maturity's contribution` } },
        { id: "halved", label: { fr: `${fmt(halved, "fr")}, en divisant le résultat correct par deux par erreur`, en: `${fmt(halved, "en")}, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Seule la maturité longue bouge : seule sa key rate duration contribue à la variation de valeur, le DV01 global nul étant sans pertinence ici.", en: "Only the long maturity moves: only its key rate duration contributes to the value change, the zero global DV01 being irrelevant here." },
      explanation: {
        fr: `ΔP ≈ −${fmt(dv01Long, "fr")} × ${rateChangeBp} = ${fmt(correctLoss, "fr")}. Le DV01 global nul ne s'applique qu'à un déplacement parallèle ; ici, seul le taux long bouge, donc seule la key rate duration de la maturité longue détermine la variation de valeur — le résultat n'est PAS zéro malgré le DV01 global nul.`,
        en: `ΔP ≈ −${fmt(dv01Long, "en")} × ${rateChangeBp} = ${fmt(correctLoss, "en")}. The zero global DV01 only applies to a parallel shift; here, only the long rate moves, so only the long maturity's key rate duration determines the value change — the result is NOT zero despite the zero global DV01.`,
      },
      commonMistake: {
        fr: "Conclure qu'un DV01 global nul implique automatiquement une valeur inchangée, même lorsque seule une maturité isolée bouge.",
        en: "Concluding a zero global DV01 automatically implies an unchanged value, even when only an isolated maturity moves.",
      },
    };
  },
};

const parallelShiftOnlyMistakeTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-erreur-deplacement-parallele",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur la couverture d'un portefeuille obligataire multi-maturités est correcte ?",
    en: "Which of these statements about hedging a multi-maturity bond portfolio is correct?",
  },
  choices: [
    { id: "global-dv01-hedge-insufficient", label: { fr: "Égaliser uniquement le DV01 global peut laisser un risque résiduel important si la courbe se déforme plutôt que de se déplacer en bloc", en: "Matching only the global DV01 can leave significant residual risk if the curve deforms rather than shifting as a block" } },
    { id: "global-dv01-hedge-always-sufficient", label: { fr: "Égaliser le DV01 global suffit toujours à garantir une couverture robuste, quel que soit le type de mouvement de courbe", en: "Matching the global DV01 is always enough to guarantee a robust hedge, whatever the type of curve move" } },
    { id: "curve-only-moves-parallel", label: { fr: "La courbe des taux ne peut se déplacer que de façon parallèle, les déformations de courbe n'existant pas en pratique", en: "The yield curve can only shift in a parallel way, curve deformations not existing in practice" } },
    { id: "krd-only-theoretical", label: { fr: "La key rate duration est un concept purement théorique, jamais utilisé par les desks taux en pratique", en: "Key rate duration is a purely theoretical concept, never used by rates desks in practice" } },
  ],
  correctId: "global-dv01-hedge-insufficient",
  hint: { fr: "Le DV01 global ne protège que contre UN type de mouvement de courbe parmi plusieurs possibles.", en: "Global DV01 only protects against ONE type of curve move among several possible ones." },
  explanation: {
    fr: "Une couverture qui n'égalise que le DV01 global suppose implicitement que la courbe ne peut se déplacer que de façon parallèle : si elle se pentifie ou s'aplatit à la place, un risque résiduel important peut subsister malgré un DV01 global apparemment nul. Les déformations de courbe sont fréquentes en pratique, et la key rate duration est un outil standard des desks taux professionnels, pas une notion purement académique.",
    en: "A hedge that only matches the global DV01 implicitly assumes the curve can only shift in parallel: if it steepens or flattens instead, significant residual risk can remain despite an apparently zero global DV01. Curve deformations are frequent in practice, and key rate duration is a standard tool for professional rates desks, not a purely academic notion.",
  },
  commonMistake: {
    fr: "Supposer qu'une couverture à DV01 global nul est automatiquement robuste, en ignorant le risque de déformation de la courbe.",
    en: "Assuming a hedge with zero global DV01 is automatically robust, ignoring curve-deformation risk.",
  },
});

const barbellVsBulletMistakeTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-erreur-barbell-bullet",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Deux portefeuilles ont un DV01 global identique : le premier concentre sa duration sur une seule maturité intermédiaire (bullet), le second la répartit entre une maturité très courte et une maturité très longue (barbell). Un mouvement non parallèle de la courbe les affecte-t-il de la même façon ?",
    en: "Two portfolios have an identical global DV01: the first concentrates its duration on a single intermediate maturity (bullet), the second spreads it between a very short and a very long maturity (barbell). Does a non-parallel curve move affect them the same way?",
  },
  choices: [
    { id: "different-krd-profiles", label: { fr: "Non : leurs profils de key rate duration diffèrent, donc un mouvement non parallèle de la courbe peut les affecter très différemment malgré un DV01 global identique", en: "No: their key rate duration profiles differ, so a non-parallel curve move can affect them very differently despite an identical global DV01" } },
    { id: "identical-effect-always", label: { fr: "Oui, un DV01 global identique garantit une réponse strictement identique des deux portefeuilles à tout mouvement de courbe", en: "Yes, an identical global DV01 guarantees a strictly identical response from both portfolios to any curve move" } },
    { id: "bullet-always-safer", label: { fr: "Non, mais uniquement parce que la structure bullet élimine par nature tout risque de déformation de courbe", en: "No, but only because the bullet structure eliminates all curve-deformation risk by nature" } },
    { id: "barbell-always-safer", label: { fr: "Non, mais uniquement parce que la structure barbell élimine par nature tout risque de déformation de courbe", en: "No, but only because the barbell structure eliminates all curve-deformation risk by nature" } },
  ],
  correctId: "different-krd-profiles",
  hint: { fr: "Un DV01 global identique ne dit rien sur la RÉPARTITION de la sensibilité par maturité.", en: "An identical global DV01 says nothing about the DISTRIBUTION of sensitivity by maturity." },
  explanation: {
    fr: "Un DV01 global identique ne garantit en rien un profil de key rate duration identique : une structure bullet concentre sa sensibilité sur une maturité, une structure barbell la répartit sur deux maturités extrêmes — un mouvement non parallèle de la courbe (pentification, aplatissement, torsion) les affectera donc généralement de façon différente, sans qu'aucune des deux structures ne soit par nature à l'abri de tout risque de déformation.",
    en: "An identical global DV01 in no way guarantees an identical key rate duration profile: a bullet structure concentrates its sensitivity on one maturity, a barbell structure spreads it across two extreme maturities — a non-parallel curve move (steepening, flattening, twisting) will therefore generally affect them differently, with neither structure being inherently immune to deformation risk.",
  },
  commonMistake: {
    fr: "Croire qu'un DV01 global identique entre deux portefeuilles garantit une réponse identique à tout mouvement de courbe, en ignorant leur répartition différente par maturité.",
    en: "Believing an identical global DV01 between two portfolios guarantees an identical response to any curve move, ignoring their different distribution by maturity.",
  },
});

const rateDeskHedgeScenarioTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-scenario-desk-taux",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk taux détient une position combinant des obligations de maturités 2, 5 et 10 ans, et veut se couvrir contre TOUT type de mouvement de la courbe (parallèle, pentification, aplatissement). Quelle démarche est la plus cohérente ?",
    en: "A rates desk holds a position combining 2-, 5- and 10-year bonds, and wants to hedge against ANY type of curve move (parallel, steepening, flattening). What approach is most consistent?",
  },
  choices: [
    { id: "hedge-each-key-rate-separately", label: { fr: "Couvrir séparément chaque key rate duration (2, 5 et 10 ans), pas seulement le DV01 global agrégé", en: "Hedge each key rate duration separately (2, 5 and 10 years), not just the aggregated global DV01" } },
    { id: "hedge-global-dv01-only", label: { fr: "Couvrir uniquement le DV01 global agrégé, ce qui protège automatiquement contre tout type de mouvement de courbe", en: "Hedge only the aggregated global DV01, which automatically protects against any type of curve move" } },
    { id: "impossible-to-hedge-all-moves", label: { fr: "Il est par nature impossible de se couvrir contre plus d'un type de mouvement de courbe à la fois", en: "It is by nature impossible to hedge against more than one type of curve move at a time" } },
    { id: "hedge-only-longest-maturity", label: { fr: "Couvrir uniquement la maturité la plus longue, les maturités courtes n'ayant jamais d'impact significatif", en: "Hedge only the longest maturity, short maturities never having a significant impact" } },
  ],
  correctId: "hedge-each-key-rate-separately",
  hint: { fr: "Se couvrir contre TOUT type de mouvement (pas seulement parallèle) exige de raisonner maturité par maturité.", en: "Hedging against ANY type of move (not just parallel) requires reasoning maturity by maturity." },
  explanation: {
    fr: "Pour se couvrir contre tout type de mouvement de courbe, y compris une déformation (pentification, aplatissement), il faut neutraliser séparément chaque key rate duration, pas seulement leur somme agrégée en DV01 global : c'est la seule démarche qui protège aussi bien contre un déplacement parallèle que contre une déformation de la courbe, contrairement à une couverture en DV01 global seul.",
    en: "To hedge against any type of curve move, including a deformation (steepening, flattening), each key rate duration must be neutralized separately, not just their aggregated sum in the global DV01: this is the only approach that protects against both a parallel shift and a curve deformation, unlike a global-DV01-only hedge.",
  },
  commonMistake: {
    fr: "Penser qu'une couverture en DV01 global agrégé protège automatiquement contre tout type de mouvement de courbe, y compris une déformation.",
    en: "Thinking an aggregated global DV01 hedge automatically protects against any type of curve move, including a deformation.",
  },
});

const macroDataCurveScenarioTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-scenario-donnee-macro",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une publication d'inflation plus forte que prévu fait bondir les taux courts (anticipation de hausse rapide des taux directeurs), tandis que les taux longs bougent à peine (les anticipations d'inflation à long terme restent ancrées). Comment qualifier ce mouvement de courbe ?",
    en: "A stronger-than-expected inflation release makes short rates jump (anticipation of a quick policy rate hike), while long rates barely move (long-term inflation expectations stay anchored). How is this curve move described?",
  },
  choices: [
    { id: "flattening-from-short-end", label: { fr: "Un aplatissement de la courbe, provoqué par la hausse du taux court, le taux long restant globalement stable", en: "A flattening of the curve, driven by the rise in the short rate, the long rate staying broadly stable" } },
    { id: "steepening-from-short-end", label: { fr: "Une pentification de la courbe, provoquée par la hausse du taux court, le taux long restant globalement stable", en: "A steepening of the curve, driven by the rise in the short rate, the long rate staying broadly stable" } },
    { id: "parallel-shift", label: { fr: "Un déplacement parallèle de la courbe, les taux courts et longs bougeant nécessairement du même montant", en: "A parallel shift of the curve, short and long rates necessarily moving by the same amount" } },
    { id: "no-curve-effect", label: { fr: "Aucun effet sur la forme de la courbe, seul le niveau moyen des taux étant affecté par cette publication", en: "No effect on the curve's shape, only the average rate level being affected by this release" } },
  ],
  correctId: "flattening-from-short-end",
  hint: { fr: "Le taux court monte, le taux long reste stable : l'écart entre les deux se RESSERRE — quel est le nom de ce mouvement ?", en: "The short rate rises, the long rate stays flat: the gap between the two NARROWS — what is this move called?" },
  explanation: {
    fr: "Le taux court montant tandis que le taux long reste globalement stable, l'écart entre taux longs et taux courts se resserre : c'est la définition même d'un aplatissement de la courbe. Ce n'est ni une pentification (qui suppose un élargissement de cet écart), ni un déplacement parallèle (qui suppose un mouvement identique sur toute la courbe).",
    en: "With the short rate rising while the long rate stays broadly stable, the gap between long and short rates narrows: this is the very definition of a curve flattening. It is neither a steepening (which would require this gap to widen), nor a parallel shift (which would require an identical move across the whole curve).",
  },
  commonMistake: {
    fr: "Confondre pentification et aplatissement, ou supposer par défaut qu'une publication macro déplace systématiquement la courbe de façon parallèle.",
    en: "Confusing steepening and flattening, or assuming by default that a macro release systematically shifts the curve in parallel.",
  },
});

const steepenerTradePnlCalcTemplate: QuestionTemplate = {
  id: "m03-sensibilite-courbe-calcul-pnl-steepener",
  conceptId: "m03-sensibilite-courbe",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const krd = randomInt(rng, 1, 5) * 1000;
    const rateChangeBp = pick(rng, [5, 10, 15, 20] as const);
    const correctGain = krd * rateChangeBp;
    const wrongSign = -correctGain;
    const wrongDoubled = correctGain * 2;
    const wrongHalved = Math.round(correctGain / 2);

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader met en place un steepener : long ${fmt(krd, "fr")} de key rate duration en maturité courte, court ${fmt(krd, "fr")} en maturité longue (DV01 global nul). La courbe pentifie : le taux long monte de ${rateChangeBp} points de base, le taux court reste stable. Quel est le P&L approximatif de la position ?`,
        en: `A trader sets up a steepener: long ${fmt(krd, "en")} of key rate duration in the short maturity, short ${fmt(krd, "en")} in the long maturity (zero global DV01). The curve steepens: the long rate rises by ${rateChangeBp} basis points, the short rate stays flat. What is the position's approximate P&L?`,
      },
      choices: [
        { id: "correct", label: { fr: `+${fmt(correctGain, "fr")}, la position courte en maturité longue gagnant de la valeur quand le taux long monte`, en: `+${fmt(correctGain, "en")}, the short position in the long maturity gaining value as the long rate rises` } },
        { id: "wrong-sign", label: { fr: `−${fmt(correctGain, "fr")}, en supposant à tort qu'une hausse de taux profite toujours à une position longue en taux`, en: `−${fmt(correctGain, "en")}, wrongly assuming a rate rise always benefits a long rate position` } },
        { id: "wrong-doubled", label: { fr: `+${fmt(wrongDoubled, "fr")}, en comptant à tort la contribution de la maturité courte alors qu'elle n'a pas bougé`, en: `+${fmt(wrongDoubled, "en")}, wrongly also counting the short maturity's contribution although it didn't move` } },
        { id: "wrong-halved", label: { fr: `+${fmt(wrongHalved, "fr")}, en divisant le résultat correct par deux par erreur`, en: `+${fmt(wrongHalved, "en")}, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Seule la maturité longue bouge : un taux qui monte fait BAISSER le prix, donc une position COURTE sur cette maturité GAGNE.", en: "Only the long maturity moves: a rising rate LOWERS the price, so a SHORT position on that maturity GAINS." },
      explanation: {
        fr: `Seul le taux long bouge (+${rateChangeBp}pb). La position est courte sur la maturité longue : une hausse de taux fait baisser le prix de l'obligation longue, ce qui profite à la position courte, pour un gain d'environ ${fmt(krd, "fr")} × ${rateChangeBp} = ${fmt(correctGain, "fr")}. La maturité courte ne contribue rien puisqu'elle ne bouge pas dans ce scénario.`,
        en: `Only the long rate moves (+${rateChangeBp}bp). The position is short the long maturity: a rate rise lowers the long bond's price, which benefits the short position, for a gain of about ${fmt(krd, "en")} × ${rateChangeBp} = ${fmt(correctGain, "en")}. The short maturity contributes nothing since it doesn't move in this scenario.`,
      },
      commonMistake: {
        fr: "Inverser le sens du P&L d'une position courte, ou compter à tort la contribution d'une maturité qui n'a pas bougé dans le scénario.",
        en: "Flipping the sign of a short position's P&L, or wrongly counting the contribution of a maturity that didn't move in the scenario.",
      },
    };
  },
};

const butterflyTwistScenarioTemplate = mcqTemplate({
  id: "m03-sensibilite-courbe-scenario-papillon",
  conceptId: "m03-sensibilite-courbe",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le taux à 5 ans baisse fortement, tandis que les taux à 2 ans et à 10 ans restent globalement stables : la courbe se \"tord\" localement autour de la maturité intermédiaire. Une couverture qui n'égaliserait que les key rate durations 2 ans et 10 ans protégerait-elle contre ce mouvement ?",
    en: "The 5-year rate falls sharply, while the 2-year and 10-year rates stay broadly stable: the curve locally \"twists\" around the intermediate maturity. Would a hedge matching only the 2-year and 10-year key rate durations protect against this move?",
  },
  choices: [
    { id: "no-5y-exposure-remains", label: { fr: "Non : l'exposition à la key rate duration 5 ans resterait non couverte, laissant un risque résiduel malgré la couverture des deux autres points", en: "No: the 5-year key rate duration exposure would remain unhedged, leaving residual risk despite hedging the other two points" } },
    { id: "yes-2y-10y-cover-everything", label: { fr: "Oui, couvrir les points 2 ans et 10 ans suffit toujours à neutraliser tout mouvement sur l'ensemble de la courbe", en: "Yes, hedging the 2-year and 10-year points is always enough to neutralize any move across the entire curve" } },
    { id: "5y-move-impossible", label: { fr: "Ce scénario est impossible : un point intermédiaire de la courbe ne peut jamais bouger indépendamment des points voisins", en: "This scenario is impossible: an intermediate curve point can never move independently of neighboring points" } },
    { id: "global-dv01-sufficient", label: { fr: "Oui, mais uniquement si le DV01 global de la position couverte est nul, ce qui garantit alors une protection totale", en: "Yes, but only if the hedged position's global DV01 is zero, which then guarantees total protection" } },
  ],
  correctId: "no-5y-exposure-remains",
  hint: { fr: "Une couverture ne neutralise que les maturités qu'elle cible explicitement : que se passe-t-il pour une maturité non couverte ?", en: "A hedge only neutralizes the maturities it explicitly targets: what happens to an unhedged maturity?" },
  explanation: {
    fr: "Une couverture qui ne cible que les maturités 2 ans et 10 ans laisse la key rate duration 5 ans totalement exposée : si le taux 5 ans bouge de façon isolée (mouvement dit \"en papillon\" ou torsion locale de la courbe), la position subit une variation de valeur non couverte, même si les points 2 et 10 ans sont parfaitement neutralisés et même si le DV01 global de la position d'origine était nul.",
    en: "A hedge targeting only the 2-year and 10-year maturities leaves the 5-year key rate duration fully exposed: if the 5-year rate moves in isolation (a so-called \"butterfly\" move, or local curve twist), the position suffers an unhedged value change, even if the 2- and 10-year points are perfectly neutralized and even if the original position's global DV01 was zero.",
  },
  commonMistake: {
    fr: "Croire que couvrir quelques points de la courbe suffit à neutraliser tout mouvement, en oubliant les maturités intermédiaires non explicitement couvertes.",
    en: "Believing hedging a few curve points is enough to neutralize any move, forgetting intermediate maturities not explicitly hedged.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  globalVsKeyRateComparisonTemplate,
  steepenerWhatIfTemplate,
  flattenerWhatIfTemplate,
  dv01SumCalcTemplate,
  curveTwistImpactCalcTemplate,
  parallelShiftOnlyMistakeTemplate,
  barbellVsBulletMistakeTemplate,
  rateDeskHedgeScenarioTemplate,
  macroDataCurveScenarioTemplate,
  steepenerTradePnlCalcTemplate,
  butterflyTwistScenarioTemplate,
];
