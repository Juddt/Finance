import type { LessonContent } from "@/lib/lesson-types";

export const m03SensibiliteCourbe: LessonContent = {
  conceptId: "m03-sensibilite-courbe",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est le DV01 d'une position et connaître les notions de taux spot par maturité, présentées dans les notions précédentes de ce module.",
      en: "You need to know what a position's DV01 is and the notion of spot rates by maturity, covered in the previous concepts of this module.",
    },
    conceptIds: ["m03-dv01", "m03-taux-sans-risque"],
  },
  glossary: [
    { term: { fr: "Key rate duration", en: "Key rate duration" }, definition: { fr: "La sensibilité du prix d'une position à la variation d'un seul point de la courbe des taux (une seule maturité), les autres points restant fixes.", en: "The sensitivity of a position's price to a change in a single point of the yield curve (one maturity), with all other points held fixed." } },
    { term: { fr: "Pentification (steepening)", en: "Steepening" }, definition: { fr: "Un élargissement de l'écart entre taux longs et taux courts sur la courbe des taux.", en: "A widening of the gap between long and short rates on the yield curve." } },
    { term: { fr: "Aplatissement (flattening)", en: "Flattening" }, definition: { fr: "Un resserrement de l'écart entre taux longs et taux courts sur la courbe des taux.", en: "A narrowing of the gap between long and short rates on the yield curve." } },
  ],
  intuition: {
    fr: "Le DV01 global d'un portefeuille obligataire résume sa sensibilité à \"la\" courbe des taux en un seul chiffre, comme si toute la courbe se déplaçait en bloc, de manière parfaitement parallèle. Or en réalité, les taux courts et les taux longs ne bougent presque jamais exactement de la même façon : la courbe peut pentifier, s'aplatir, ou même se tordre. Un DV01 global proche de zéro peut donc masquer un risque important si la couverture n'est pas répartie sur les bonnes maturités.",
    en: "A bond portfolio's overall DV01 summarizes its sensitivity to \"the\" yield curve in a single number, as if the whole curve shifted as one block, in a perfectly parallel way. In reality, short and long rates almost never move exactly the same way: the curve can steepen, flatten, or even twist. A DV01 close to zero can therefore hide significant risk if the hedge isn't spread across the right maturities.",
  },
  definition: {
    fr: "Décomposer le DV01 par tranche de maturité (key rate duration, ou DV01 \"par point\" de la courbe) consiste à mesurer séparément la sensibilité du prix à un déplacement de chaque maturité clé de la courbe des taux (par exemple 2 ans, 5 ans, 10 ans, 30 ans), plutôt que de résumer toute la sensibilité en un unique DV01 global supposant un déplacement parallèle. Une pentification est un élargissement de l'écart entre taux longs et taux courts ; un aplatissement en est le resserrement.",
    en: "Breaking down DV01 by maturity bucket (key rate duration, or the curve's \"point-by-point\" DV01) means separately measuring the price's sensitivity to a shift in each key maturity of the yield curve (e.g. 2y, 5y, 10y, 30y), rather than summarizing all sensitivity in a single global DV01 assuming a parallel shift. A steepening is a widening of the gap between long and short rates; a flattening is its narrowing.",
  },
  utility: {
    fr: "Cette décomposition est indispensable pour construire une couverture réellement robuste : une couverture qui n'égalise que le DV01 global peut sembler parfaite au moment de sa mise en place, tout en laissant un risque résiduel important si la courbe se déforme (pentification ou aplatissement) plutôt que de se déplacer en bloc. Un desk taux professionnel raisonne presque toujours en key rate duration, jamais en DV01 global seul, dès que la position comporte plusieurs maturités.",
    en: "This breakdown is essential to building a genuinely robust hedge: a hedge that only matches the global DV01 can look perfect when put on, while still leaving significant residual risk if the curve deforms (steepening or flattening) rather than shifting as a block. A professional rates desk almost always reasons in key rate duration, never in global DV01 alone, as soon as a position spans several maturities.",
  },
  example: {
    fr: "Un portefeuille est long une obligation 2 ans (DV01 = +2 000) et court une obligation 10 ans (DV01 = −2 000) : le DV01 global net est nul, la position semble couverte contre le risque de taux. Mais si la courbe pentifie (le taux 10 ans monte alors que le taux 2 ans reste stable), la position court en 10 ans gagne de la valeur, tandis que la position longue en 2 ans ne compense rien — le portefeuille subit une perte nette, alors que son DV01 global affichait zéro.",
    en: "A portfolio is long a 2-year bond (DV01 = +2,000) and short a 10-year bond (DV01 = −2,000): the net global DV01 is zero, the position seems hedged against rate risk. But if the curve steepens (the 10-year rate rises while the 2-year rate stays flat), the short 10-year position gains value, while the long 2-year position offsets nothing — the portfolio suffers a net loss, even though its global DV01 showed zero.",
  },
  alternativeExplanation: {
    fr: "Imaginez la courbe des taux comme une corde tendue entre plusieurs points fixes (les maturités clés). Le DV01 global ne dit que si la corde monte ou descend \"en moyenne\". La key rate duration dit précisément quel point de la corde bouge, et de combien : c'est ce qui permet de savoir si la corde se déplace en bloc, ou si elle se tord en un point précis, information invisible avec la seule moyenne.",
    en: "Picture the yield curve as a rope stretched between several fixed points (the key maturities). Global DV01 only tells you whether the rope rises or falls \"on average\". Key rate duration tells you precisely which point on the rope moves, and by how much: this is what reveals whether the rope shifts as a block, or twists at one specific point, information invisible with the average alone.",
  },
  formula: {
    latex: "\\begin{aligned} DV01_{global} &= \\sum_i DV01_i \\\\ \\Delta P &\\approx -\\sum_i DV01_i \\times \\Delta r_i \\end{aligned}",
    variables: [
      { symbol: "DV01_i", description: { fr: "Key rate duration : sensibilité au taux de la maturité clé i, les autres maturités étant fixes", en: "Key rate duration: sensitivity to the key maturity i's rate, other maturities held fixed" } },
      { symbol: "\\Delta r_i", description: { fr: "Variation du taux à la maturité clé i, en points de base", en: "The rate change at key maturity i, in basis points" } },
      { symbol: "\\Delta P", description: { fr: "Variation de valeur estimée de la position", en: "The position's estimated value change" } },
    ],
    assumptions: { fr: "Suppose une décomposition linéaire additive des effets par maturité (ignore les interactions croisées de second ordre). Le DV01 global (somme des DV01_i) ne redonne l'information complète que si tous les Δr_i sont identiques (déplacement parallèle) ; sinon, seule la somme pondérée par les Δr_i effectifs compte.", en: "Assumes a linear additive decomposition of per-maturity effects (ignores second-order cross interactions). The global DV01 (sum of DV01_i) only recovers the full information if all Δr_i are identical (parallel shift); otherwise, only the sum weighted by the actual Δr_i matters." },
    units: { fr: "DV01_i en devise par point de base ; Δr_i en points de base.", en: "DV01_i in currency per basis point; Δr_i in basis points." },
    example: { fr: "DV01_2y=+2000, DV01_10y=−2000 (DV01 global=0). Pentification : Δr_2y=0, Δr_10y=+10pb → ΔP≈−(−2000)×10=+20000... mais le signe et l'ampleur dépendent du sens exact de la position.", en: "DV01_2y=+2000, DV01_10y=−2000 (global DV01=0). Steepening: Δr_2y=0, Δr_10y=+10bp → ΔP depends on the exact position direction and sign convention." },
  },
  calculation: {
    fr: "1) Décomposer le portefeuille en positions par maturité clé et calculer le DV01 de chacune séparément (key rate duration). 2) Pour un scénario donné, spécifier la variation de taux anticipée à CHAQUE maturité clé (pas une seule variation globale). 3) Sommer les contributions DV01_i × Δr_i de chaque maturité pour obtenir la variation de valeur totale.",
    en: "1) Break the portfolio down into positions by key maturity and compute each one's DV01 separately (key rate duration). 2) For a given scenario, specify the anticipated rate change at EACH key maturity (not a single global change). 3) Sum the DV01_i × Δr_i contributions of each maturity to get the total value change.",
  },
  interpretation: {
    fr: "Un DV01 global proche de zéro ne garantit une couverture robuste que si l'on croit que la courbe ne peut se déplacer que de façon parallèle. Dès que l'on admet la possibilité d'une pentification ou d'un aplatissement, seule une couverture qui égalise le DV01 maturité par maturité (et pas seulement en somme) protège réellement contre une déformation de la courbe.",
    en: "A global DV01 close to zero only guarantees a robust hedge if one believes the curve can only shift in parallel. As soon as one admits the possibility of a steepening or flattening, only a hedge that matches DV01 maturity by maturity (not just in sum) genuinely protects against a curve deformation.",
  },
  pitfalls: {
    fr: "Croire qu'un DV01 global nul signifie automatiquement une position sans risque de taux, en ignorant que la courbe peut se déformer (pentifier ou s'aplatir) sans se déplacer en bloc. Ce piège est particulièrement dangereux pour des positions combinant des maturités très éloignées (par exemple 2 ans contre 30 ans), où le risque de déformation de courbe dépasse souvent le risque de déplacement parallèle.",
    en: "Believing a zero global DV01 automatically means a position with no rate risk, ignoring that the curve can deform (steepen or flatten) without shifting as a block. This trap is especially dangerous for positions combining very distant maturities (e.g. 2 years vs 30 years), where curve deformation risk often exceeds parallel shift risk.",
  },
  keyPoints: {
    fr: [
      "Le DV01 global suppose un déplacement parallèle de la courbe ; la réalité inclut aussi pentification et aplatissement.",
      "La key rate duration décompose le DV01 par maturité clé, révélant un risque de courbe invisible en DV01 global seul.",
      "Une couverture à DV01 global nul peut rester exposée à une déformation de la courbe si elle n'est pas répartie par maturité.",
    ],
    en: [
      "Global DV01 assumes a parallel curve shift; reality also includes steepening and flattening.",
      "Key rate duration breaks DV01 down by key maturity, revealing curve risk invisible in the global DV01 alone.",
      "A hedge with zero global DV01 can remain exposed to a curve deformation if it isn't spread by maturity.",
    ],
  },
  advancedDemonstration: {
    fr: "Un trader qui parie sur une pentification de la courbe (steepener trade) construit typiquement une position longue en maturité courte et courte en maturité longue, dimensionnée pour un DV01 global proche de zéro : le pari n'est pas sur le niveau des taux, mais spécifiquement sur la FORME de la courbe. Si la courbe pentifie effectivement (taux longs montent plus que les taux courts, ou baissent moins), la position gagne, indépendamment du sens du mouvement parallèle global des taux — une stratégie qui n'aurait aucun sens sans décomposer le risque en key rate duration.",
    en: "A trader betting on a curve steepening (a steepener trade) typically builds a position long the short maturity and short the long maturity, sized for a global DV01 near zero: the bet isn't on the level of rates, but specifically on the SHAPE of the curve. If the curve does steepen (long rates rise more than short rates, or fall less), the position gains, regardless of the direction of the overall parallel rate move — a strategy that would make no sense without decomposing risk into key rate duration.",
  },
};
