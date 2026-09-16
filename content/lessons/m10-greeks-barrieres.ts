import type { LessonContent } from "@/lib/lesson-types";

export const m10GreeksBarrieres: LessonContent = {
  conceptId: "m10-greeks-barrieres",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les mécanismes des options barrières et les Greeks de premier ordre.",
      en: "You need to know barrier option mechanics and first-order Greeks.",
    },
    conceptIds: ["m10-mecanismes-barrieres", "m07-greeks-premier-ordre"],
  },
  glossary: [
    { term: { fr: "Discontinuité", en: "Discontinuity" }, definition: { fr: "Un saut brutal de valeur, ici celui du prix de l'option qui tombe instantanément à la barrière plutôt que de varier progressivement.", en: "An abrupt value jump, here the option's price falling instantly at the barrier rather than varying gradually." } },
  ],
  intuition: {
    fr: "Une option vanille perd de la valeur progressivement quand le sous-jacent s'en éloigne. Une option barrière, elle, peut perdre TOUTE sa valeur en un instant si le sous-jacent franchit la barrière d'un centime — cette discontinuité rend son Delta et son Gamma extrêmement instables juste avant l'échéance et près de la barrière.",
    en: "A vanilla option gradually loses value as the underlying moves away. A barrier option, however, can lose ALL its value in an instant if the underlying crosses the barrier by a cent — this discontinuity makes its Delta and Gamma extremely unstable near the barrier and close to expiry.",
  },
  definition: {
    fr: "Près de la barrière, le Delta d'une option knock-out peut devenir très grand (en valeur absolue) et même changer de signe brutalement, car la valeur de l'option doit chuter de sa valeur \"normale\" à zéro (ou au rebate) sur un intervalle de prix infinitésimal. Le Gamma, la sensibilité du Delta, devient alors extrêmement élevé (\"pic de Gamma\"), en particulier lorsque l'échéance approche.",
    en: "Near the barrier, a knock-out option's Delta can become very large (in absolute value) and even abruptly flip sign, since the option's value must fall from its \"normal\" value to zero (or the rebate) over an infinitesimal price range. Gamma, Delta's sensitivity, then becomes extremely high (a \"Gamma spike\"), particularly as expiry approaches.",
  },
  utility: {
    fr: "Comprendre ce comportement est vital pour tout trader qui couvre un livre d'options barrières : un delta-hedging classique (M07-4) devient très coûteux et imprécis près de la barrière, ce qui explique pourquoi ces produits sont souvent marges plus largement que leur prix théorique ne le suggère.",
    en: "Understanding this behavior is vital for any trader hedging a barrier options book: classic delta-hedging (M07-4) becomes very costly and imprecise near the barrier, which explains why these products are often priced with a wider margin than their theoretical price alone would suggest.",
  },
  example: {
    fr: "Un call up-and-out vaut 2,00 juste en dessous de sa barrière à 130 (à S=129,99), mais 0 juste au-dessus (à S=130,01, une fois knock-out). Le \"Delta effectif\" sur ce minuscule intervalle est d'environ (0−2,00)/0,02 = −100 — une valeur extrême et absurde comparée à un Delta vanille typique entre −1 et 1, illustrant à quel point la couverture devient instable dans cette zone.",
    en: "An up-and-out call is worth 2.00 just below its barrier at 130 (at S=129.99), but 0 just above (at S=130.01, once knocked out). The \"effective Delta\" over this tiny interval is about (0−2.00)/0.02 = −100 — an extreme, absurd value compared to a typical vanilla Delta between −1 and 1, illustrating how unstable hedging becomes in this zone.",
  },
  alternativeExplanation: {
    fr: "Imaginez marcher sur un pont qui s'effondre instantanément dès que vous posez le pied sur une dalle précise, sans aucun avertissement progressif : contrairement à une pente qui se raidit doucement, ici il n'y a AUCUNE transition — tout ou rien, en un pas. C'est cette absence de transition qui rend la \"vitesse de chute\" (le Delta) théoriquement infinie au moment précis du franchissement.",
    en: "Picture walking on a bridge that collapses instantly the moment you step on one precise tile, with no gradual warning: unlike a slope that gradually steepens, here there is NO transition — all or nothing, in one step. This absence of transition is what makes the \"rate of fall\" (Delta) theoretically infinite at the exact moment of crossing.",
  },
  formula: {
    latex: "\\Delta_{\\text{effectif}} \\approx \\frac{V(H+\\varepsilon) - V(H-\\varepsilon)}{2\\varepsilon}",
    variables: [
      { symbol: "V(H-\\varepsilon)", description: { fr: "Valeur de l'option juste avant la barrière (encore vivante)", en: "The option's value just before the barrier (still alive)" } },
      { symbol: "V(H+\\varepsilon)", description: { fr: "Valeur de l'option juste après la barrière (knock-out, souvent 0 ou le rebate)", en: "The option's value just after the barrier (knocked out, often 0 or the rebate)" } },
      { symbol: "\\varepsilon", description: { fr: "Un très petit intervalle de prix autour de la barrière", en: "A very small price interval around the barrier" } },
    ],
    assumptions: { fr: "Illustration du comportement local ; en pratique, la couverture réelle utilise des techniques de lissage (M10-9) plutôt que ce Delta \"brut\" extrême.", en: "Illustration of local behavior; in practice, real hedging uses smoothing techniques (M10-9) rather than this extreme \"raw\" Delta." },
    units: { fr: "Delta sans dimension (variation de prix d'option par unité de sous-jacent).", en: "Dimensionless Delta (option price change per unit of underlying)." },
    example: { fr: "V(129,99)=2,00, V(130,01)=0, ε=0,01 : Delta_effectif ≈ (0−2,00)/0,02 = −100.", en: "V(129.99)=2.00, V(130.01)=0, ε=0.01: Delta_effective ≈ (0−2.00)/0.02 = −100." },
  },
  calculation: {
    fr: "1) Évaluer le prix de l'option juste en dessous de la barrière (option encore vivante). 2) Évaluer le prix juste au-dessus (option knock-out, généralement 0 ou le rebate). 3) Calculer la différence de prix. 4) Diviser par le très petit intervalle de sous-jacent séparant les deux points pour obtenir le Delta \"effectif\" local.",
    en: "1) Evaluate the option's price just below the barrier (option still alive). 2) Evaluate the price just above (knocked-out option, usually 0 or the rebate). 3) Compute the price difference. 4) Divide by the very small underlying interval separating the two points to get the local \"effective\" Delta.",
  },
  interpretation: {
    fr: "Ce Delta extrême signifie qu'un trader qui couvre cette position devrait théoriquement acheter ou vendre une quantité énorme de sous-jacent pour un mouvement infinitésimal de prix — impossible à exécuter parfaitement en pratique. Le risque résiduel non couvrable (\"pin risk\" ou risque de barrière) doit être budgété séparément, souvent via une marge de sécurité dans le prix ou un déplacement pratique de la barrière (voir M10-5).",
    en: "This extreme Delta means a trader hedging this position would theoretically need to buy or sell a huge quantity of underlying for an infinitesimal price move — impossible to execute perfectly in practice. This residual, unhedgeable risk (\"pin risk\" or barrier risk) must be budgeted separately, often via a safety margin in the price or a practical barrier shift (see M10-5).",
  },
  pitfalls: {
    fr: "Croire que le Delta d'une option barrière se comporte comme celui d'une option vanille loin de la barrière : c'est globalement vrai, mais complètement faux à proximité immédiate de la barrière, où le comportement devient extrême et qualitativement différent. Autre piège : sous-estimer ce risque en fin de vie du contrat, quand le pic de Gamma est le plus prononcé.",
    en: "Believing a barrier option's Delta behaves like a vanilla option's far from the barrier: broadly true, but completely wrong in the barrier's immediate vicinity, where behavior becomes extreme and qualitatively different. Another trap: underestimating this risk near the contract's end of life, when the Gamma spike is most pronounced.",
  },
  keyPoints: {
    fr: [
      "Le Delta et le Gamma d'une option barrière explosent près de la barrière, contrairement à une option vanille.",
      "Cette discontinuité vient du fait que la valeur doit chuter de sa valeur normale à zéro sur un intervalle infinitésimal.",
      "Le risque résiduel non couvrable près de la barrière (pin risk) doit être géré par des techniques dédiées (M10-9).",
    ],
    en: [
      "A barrier option's Delta and Gamma explode near the barrier, unlike a vanilla option's.",
      "This discontinuity comes from the value having to fall from normal to zero over an infinitesimal interval.",
      "The residual, unhedgeable risk near the barrier (pin risk) must be managed with dedicated techniques (M10-9).",
    ],
  },
  advancedDemonstration: {
    fr: "Ce phénomène est particulièrement prononcé quand l'échéance approche : plus T−t est petit, plus la transition entre \"vivant\" et \"knock-out\" se comprime sur un intervalle de sous-jacent étroit, amplifiant le pic de Gamma. C'est l'exact opposé du comportement d'une option vanille ATM, dont le Gamma est certes également maximal près de l'échéance, mais de façon beaucoup plus progressive et sans discontinuité de valeur. Les desks professionnels gèrent ce risque en combinant plusieurs techniques : marge de sécurité sur la barrière contractuelle, déplacement de barrière pour le pricing interne (M10-5), et lissage du payoff pour le calcul du Delta/Gamma de couverture (M10-9).",
    en: "This phenomenon is particularly pronounced as expiry approaches: the smaller T−t is, the more the transition between \"alive\" and \"knocked out\" compresses onto a narrow underlying interval, amplifying the Gamma spike. This is the exact opposite of an ATM vanilla option's behavior, whose Gamma is indeed also maximal near expiry, but much more gradually and with no value discontinuity. Professional desks manage this risk by combining several techniques: a safety margin on the contractual barrier, an internal-pricing barrier shift (M10-5), and payoff smoothing for hedging Delta/Gamma calculations (M10-9).",
  },
};
