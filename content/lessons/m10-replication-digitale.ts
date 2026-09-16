import type { LessonContent } from "@/lib/lesson-types";

export const m10ReplicationDigitale: LessonContent = {
  conceptId: "m10-replication-digitale",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le payoff d'une digitale et celui d'un call spread.",
      en: "You need to know a digital's payoff and a call spread's payoff.",
    },
    conceptIds: ["m10-options-digitales", "m05-strategies-classiques"],
  },
  glossary: [
    { term: { fr: "Call spread serré", en: "Tight call spread" }, definition: { fr: "Un call spread dont les deux strikes sont très proches l'un de l'autre, utilisé pour approximer un payoff \"tout ou rien\".", en: "A call spread whose two strikes are very close to each other, used to approximate an \"all or nothing\" payoff." } },
  ],
  intuition: {
    fr: "Un call spread très serré (deux strikes proches) ressemble, une fois normalisé, à un payoff \"tout ou rien\" : quasiment 0 en dessous des strikes, quasiment plein en dessus, avec une transition très abrupte entre les deux — exactement le comportement d'une digitale.",
    en: "A very tight call spread (two close strikes) resembles, once normalized, an \"all or nothing\" payoff: nearly 0 below the strikes, nearly full above, with a very sharp transition between the two — exactly a digital's behavior.",
  },
  definition: {
    fr: "Une digitale cash-or-nothing de montant C et de strike K peut être approximée par un call spread : acheter C/ε calls de strike K−ε, vendre C/ε calls de strike K+ε, pour un petit ε. Quand ε→0, ce portefeuille converge vers le payoff exact de la digitale.",
    en: "A cash-or-nothing digital of amount C and strike K can be approximated by a call spread: buy C/ε calls with strike K−ε, sell C/ε calls with strike K+ε, for a small ε. As ε→0, this portfolio converges to the digital's exact payoff.",
  },
  utility: {
    fr: "Cette réplication permet de coter et de couvrir une digitale avec des instruments vanilles standards, sans avoir besoin d'un modèle ou d'un système de pricing dédié aux digitales — une technique répandue sur les desks qui ne disposent pas d'infrastructure spécifique pour ces produits.",
    en: "This replication lets you quote and hedge a digital with standard vanilla instruments, without needing a dedicated model or pricing system for digitals — a technique widespread on desks lacking specific infrastructure for these products.",
  },
  example: {
    fr: "Une digitale cash-or-nothing, C=1000, K=100. Avec ε=2 : acheter 1000/(2×2)=250 calls K=98 (car le spread couvre 2ε=4 de largeur), vendre 250 calls K=102. Si le call K=98 vaut 12 et le call K=102 vaut 8 : coût = 250×(12−8) = 1000. Ce portefeuille paie environ 1000 si S_T dépasse 102, 0 si S_T est sous 98, et une valeur intermédiaire linéaire entre les deux — une approximation grossière avec ε=2, plus fine avec ε plus petit.",
    en: "A cash-or-nothing digital, C=1000, K=100. With ε=2: buy 1000/(2×2)=250 K=98 calls (since the spread covers a width of 2ε=4), sell 250 K=102 calls. If the K=98 call is worth 12 and the K=102 call is worth 8: cost = 250×(12−8) = 1000. This portfolio pays about 1000 if S_T exceeds 102, 0 if S_T is below 98, and a linear intermediate value in between — a rough approximation with ε=2, finer with a smaller ε.",
  },
  alternativeExplanation: {
    fr: "Imaginez vouloir dessiner une marche d'escalier parfaitement verticale, mais que votre crayon ne puisse tracer que des pentes : en rapprochant de plus en plus les deux extrémités de la pente, elle finit par ressembler visuellement à une vraie marche verticale, même si elle reste techniquement une pente très raide. C'est exactement ce que fait le call spread : approcher une discontinuité parfaite par une pente de plus en plus raide.",
    en: "Imagine wanting to draw a perfectly vertical staircase step, but your pencil can only draw slopes: by bringing the slope's two ends closer and closer together, it eventually looks visually like a true vertical step, even though it technically remains a very steep slope. This is exactly what the call spread does: approach a perfect discontinuity with an increasingly steep slope.",
  },
  formula: {
    latex: "\\text{Digitale} \\approx \\frac{C}{2\\varepsilon} \\times \\left[C_{\\text{BS}}(K-\\varepsilon) - C_{\\text{BS}}(K+\\varepsilon)\\right]",
    variables: [
      { symbol: "C_{\\text{BS}}(K \\pm \\varepsilon)", description: { fr: "Prix Black-Scholes d'un call vanille de strike K−ε (acheté) ou K+ε (vendu)", en: "The Black-Scholes price of a vanilla call with strike K−ε (bought) or K+ε (sold)" } },
      { symbol: "\\varepsilon", description: { fr: "Demi-largeur du spread, petite par rapport à K", en: "Half-width of the spread, small relative to K" } },
    ],
    assumptions: { fr: "Approximation qui converge vers le prix exact de la digitale quand ε→0 ; l'erreur d'approximation est d'ordre ε² pour ε petit.", en: "Approximation converging to the digital's exact price as ε→0; the approximation error is of order ε² for small ε." },
    units: { fr: "Prix dans la devise de C.", en: "Price in C's currency." },
    example: { fr: "C=1000, ε=2, C_BS(98)=12, C_BS(102)=8 : Digitale ≈ (1000/4)×(12−8) = 1000.", en: "C=1000, ε=2, C_BS(98)=12, C_BS(102)=8: Digital ≈ (1000/4)×(12−8) = 1000." },
  },
  calculation: {
    fr: "1) Choisir un ε petit par rapport aux niveaux de prix en jeu. 2) Calculer le prix des deux calls vanilles de strikes K−ε et K+ε. 3) Calculer leur différence de prix. 4) Multiplier par C/(2ε) pour obtenir le prix approché de la digitale.",
    en: "1) Choose an ε small relative to the price levels involved. 2) Compute the two vanilla calls' prices at strikes K−ε and K+ε. 3) Compute their price difference. 4) Multiply by C/(2ε) to get the digital's approximate price.",
  },
  interpretation: {
    fr: "Réduire ε améliore la précision de l'approximation du PAYOFF (la transition devient plus abrupte, plus proche du \"tout ou rien\" exact), mais amplifie exactement le même problème de Delta/Gamma extrême rencontré pour les barrières (M10-2) : le portefeuille de réplication devient de plus en plus difficile à couvrir dynamiquement à mesure qu'il devient plus précis.",
    en: "Reducing ε improves the PAYOFF approximation's precision (the transition becomes sharper, closer to the exact \"all or nothing\"), but exactly amplifies the same extreme Delta/Gamma problem encountered for barriers (M10-2): the replicating portfolio becomes increasingly hard to dynamically hedge as it becomes more precise.",
  },
  pitfalls: {
    fr: "Choisir un ε trop petit sans tenir compte du risque de couverture réel, ou un ε trop grand qui approxime mal le payoff exact de la digitale — le choix de ε est un compromis explicite entre précision de réplication et risque de couverture (voir M10-9). Autre piège : oublier de multiplier par le facteur d'échelle C/(2ε), qui n'est pas juste \"1 call acheté, 1 call vendu\".",
    en: "Choosing an ε too small without accounting for real hedging risk, or too large, poorly approximating the digital's exact payoff — the choice of ε is an explicit trade-off between replication precision and hedging risk (see M10-9). Another trap: forgetting to multiply by the scaling factor C/(2ε), which isn't just \"1 call bought, 1 call sold\".",
  },
  keyPoints: {
    fr: [
      "Une digitale s'approxime par un call spread serré : acheter C/(2ε) calls K−ε, vendre C/(2ε) calls K+ε.",
      "Quand ε→0, l'approximation converge vers le payoff exact de la digitale.",
      "Réduire ε améliore la précision du payoff mais aggrave le risque de couverture (Delta/Gamma extrêmes).",
    ],
    en: [
      "A digital is approximated by a tight call spread: buy C/(2ε) K−ε calls, sell C/(2ε) K+ε calls.",
      "As ε→0, the approximation converges to the digital's exact payoff.",
      "Reducing ε improves payoff precision but worsens hedging risk (extreme Delta/Gamma).",
    ],
  },
  advancedDemonstration: {
    fr: "Cette réplication statique par call spread est en réalité un cas particulier de la formule générale de réplication de tout payoff par un portefeuille d'options vanilles (le \"log contract\" du variance swap, M08-5, en est un autre exemple) : n'importe quelle fonction de payoff f(S_T) suffisamment régulière peut se décomposer comme une combinaison de calls et puts de tous les strikes, pondérée par f''(K) — la digitale, avec sa discontinuité, correspond au cas limite où f'' devient une masse de Dirac concentrée exactement au strike K, ce qui explique intuitivement pourquoi seul un spread infiniment étroit (et non une combinaison lisse d'options) peut la répliquer exactement.",
    en: "This static call-spread replication is actually a special case of the general formula for replicating any payoff via a portfolio of vanilla options (the variance swap's \"log contract\", M08-5, is another example): any sufficiently smooth payoff function f(S_T) can be decomposed as a combination of calls and puts across all strikes, weighted by f''(K) — the digital, with its discontinuity, corresponds to the limiting case where f'' becomes a Dirac mass concentrated exactly at strike K, which intuitively explains why only an infinitely narrow spread (not a smooth combination of options) can replicate it exactly.",
  },
};
