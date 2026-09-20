import type { LessonContent } from "@/lib/lesson-types";

export const m11AugmenterCoupon: LessonContent = {
  conceptId: "m11-augmenter-coupon",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le mécanisme de l'autocall et la barrier parity.",
      en: "You need to know the autocall mechanism and barrier parity.",
    },
    conceptIds: ["m11-autocall", "m10-pdi"],
  },
  glossary: [
    { term: { fr: "Worst-of", en: "Worst-of" }, definition: { fr: "Une structure basée sur la performance du plus mauvais actif d'un panier, ce qui augmente le risque (et donc le coupon disponible) par rapport à un seul sous-jacent.", en: "A structure based on the worst-performing asset in a basket, which increases risk (and so the available coupon) versus a single underlying." } },
  ],
  intuition: {
    fr: "Augmenter le coupon d'un autocall n'est jamais un simple réglage gratuit : chaque levier qui augmente le coupon affiché déplace en réalité davantage de risque vers l'investisseur, que ce soit sous forme de barrière plus proche, de sous-jacent plus volatil, ou de structure plus complexe (panier worst-of).",
    en: "Increasing an autocall's coupon is never a simple free adjustment: every lever that raises the displayed coupon actually shifts more risk onto the investor, whether via a closer barrier, a more volatile underlying, or a more complex structure (worst-of basket).",
  },
  definition: {
    fr: "Le coupon d'un autocall est financé par la vente implicite d'options par l'investisseur (M11-2). Il peut être augmenté par plusieurs leviers : (1) rapprocher la barrière de capital du spot (P_DI plus cher, M10-4), (2) rapprocher la barrière de rappel du spot (plus de chances de rappel rapide, mais paradoxalement cela peut aussi réduire le coupon total perçu), (3) allonger la maturité (plus de temps pour que le put down-and-in s'active), (4) utiliser un panier worst-of au lieu d'un seul sous-jacent (la performance du pire actif est structurellement plus défavorable, donc l'option vendue est plus chère), (5) choisir des sous-jacents plus volatils.",
    en: "An autocall's coupon is funded by the investor implicitly selling options (M11-2). It can be increased through several levers: (1) moving the capital barrier closer to spot (a more expensive PDI, M10-4), (2) moving the call barrier closer to spot (more chances of a quick call, though paradoxically this can also reduce the total coupon received), (3) lengthening maturity (more time for the down-and-in put to activate), (4) using a worst-of basket instead of a single underlying (the worst asset's performance is structurally more unfavorable, so the sold option is more expensive), (5) choosing more volatile underlyings.",
  },
  utility: {
    fr: "Décomposer les leviers d'augmentation du coupon permet à un investisseur ou un conseiller de repérer précisément quel risque supplémentaire finance un coupon \"attractif\" proposé sur le marché, plutôt que d'accepter la comparaison superficielle \"plus de coupon = meilleur produit\".",
    en: "Breaking down the coupon-increasing levers lets an investor or advisor precisely identify which additional risk funds an \"attractive\" coupon offered on the market, rather than accepting the superficial \"more coupon = better product\" comparison.",
  },
  example: {
    fr: "Deux autocalls à 3 ans sur la même action (spot=100, volatilité≈30%), coupon annuel de 6% et 10% respectivement. Le premier a une barrière de capital profonde à 50% (protection tant que l'action reste au-dessus de 50% de sa valeur initiale) ; le second, pour offrir 10%, a une barrière de capital plus proche du spot à 70% (protection perdue dès que l'action passe sous 70%, donc un scénario de perte beaucoup plus probable) ET utilise un panier worst-of de deux actions faiblement corrélées au lieu d'une seule (M09-1 : plus de dispersion = plus de risque que le pire actif chute fortement). Le coupon plus élevé du second n'est pas un \"meilleur prix\", mais la compensation exacte d'un risque de perte en capital significativement plus élevé : une barrière plus proche du spot est franchie beaucoup plus facilement, donc la protection que l'investisseur accepte de sacrifier vaut beaucoup plus cher.",
    en: "Two 3-year autocalls on the same stock (spot=100, volatility≈30%), annual coupons of 6% and 10% respectively. The first has a deep 50% capital barrier (protection holds as long as the stock stays above 50% of its initial value); the second, to offer 10%, has a capital barrier closer to spot at 70% (protection lost as soon as the stock falls below 70%, hence a much more likely loss scenario) AND uses a worst-of basket of two weakly correlated stocks instead of one (M09-1: more dispersion = higher risk the worst asset falls sharply). The second's higher coupon isn't a \"better deal\", but the exact compensation for significantly higher capital loss risk: a barrier closer to spot is breached far more easily, so the protection the investor agrees to give up is worth much more.",
  },
  alternativeExplanation: {
    fr: "C'est comme comparer deux offres d'assurance : celle qui coûte moins cher (ici, \"coûte moins cher\" pour l'émetteur = coupon plus élevé pour l'investisseur) couvre généralement moins de sinistres, ou exige une franchise plus élevée avant de se déclencher. Un tarif plus attractif n'est presque jamais un hasard : il reflète une différence réelle dans ce qui est couvert.",
    en: "It's like comparing two insurance offers: the cheaper one (here, \"cheaper\" for the issuer = higher coupon for the investor) generally covers fewer incidents, or requires a higher deductible before triggering. A more attractive rate is almost never a coincidence: it reflects a real difference in what's covered.",
  },
  formula: {
    latex: "\\text{Coupon} \\approx f(\\text{Prime}_{\\text{PDI vendu}} + \\text{Prime}_{\\text{digitale vendue}})",
    variables: [
      { symbol: "\\text{Prime}_{\\text{PDI vendu}}", description: { fr: "Prime du put down-and-in implicitement vendu par l'investisseur, croissante quand la barrière de capital se rapproche du spot", en: "The implicitly sold down-and-in put's premium, increasing as the capital barrier moves closer to spot" } },
      { symbol: "\\text{Prime}_{\\text{digitale vendue}}", description: { fr: "Prime de la composante digitale du coupon conditionnel", en: "The conditional coupon's digital component premium" } },
    ],
    assumptions: { fr: "Relation qualitative, pas une formule fermée ; le coupon exact dépend du modèle complet de pricing de l'autocall (M11-5).", en: "Qualitative relationship, not a closed formula; the exact coupon depends on the autocall's full pricing model (M11-5)." },
    units: { fr: "Coupon en pourcentage annualisé.", en: "Coupon as an annualized percentage." },
    example: { fr: "Comme approximation illustrative (pas le modèle complet de pricing autocall), on peut estimer la valeur d'une protection \"jusqu'au niveau K\" par une option de vente vanille classique de strike K : avec spot=100, vol=30%, taux=3%, maturité=3 ans, une formule de Black-Scholes donne un put à K=50 valant ≈1,00 (en % du notionnel) contre ≈4,41 pour un put à K=70 — un rapport de plus de 4x, illustrant pourquoi sacrifier la protection jusqu'à 70% (au lieu de 50%) coûte beaucoup plus cher à l'investisseur, donc rapporte un coupon plus élevé.", en: "As an illustrative approximation (not the full autocall pricing model), the value of protection \"down to level K\" can be proxied by a classic vanilla put of strike K: with spot=100, vol=30%, rate=3%, maturity=3 years, Black-Scholes gives a put at K=50 worth ≈1.00 (in % of notional) versus ≈4.41 for a put at K=70 — a ratio of over 4x, illustrating why giving up protection down to 70% (instead of 50%) costs the investor far more, hence pays a higher coupon." },
  },
  chart: {
    kind: "bar",
    yLabel: { fr: "Valeur de la protection sacrifiée (% du notionnel)", en: "Value of the sacrificed protection (% of notional)" },
    bars: [
      { label: { fr: "Barrière 50% (profonde)", en: "50% barrier (deep)" }, value: 1.0 },
      { label: { fr: "Barrière 70% (proche du spot)", en: "70% barrier (near spot)" }, value: 4.41 },
    ],
  },
  calculation: {
    fr: "1) Identifier tous les paramètres du produit qui diffèrent d'un autocall \"standard\" de référence (barrières, maturité, nombre de sous-jacents). 2) Pour chaque écart, identifier le levier de risque correspondant (P_DI plus cher, dispersion accrue, etc.) — par exemple, avec la formule de Black-Scholes (spot=100, vol=30%, taux=3%, T=3 ans), un put de strike K=70 vaut d1=1,119, d2=0,600, P≈4,41, contre d1=1,767, d2=1,247, P≈1,00 pour K=50 : la protection jusqu'à 70% vaut environ 4,4 fois plus que celle jusqu'à 50%. 3) Vérifier que le coupon plus élevé proposé est cohérent avec l'ampleur de ces écarts, et non disproportionné (ce qui indiquerait des frais de structuration plus élevés plutôt qu'un vrai transfert de risque).",
    en: "1) Identify every parameter of the product that differs from a \"standard\" reference autocall (barriers, maturity, number of underlyings). 2) For each difference, identify the corresponding risk lever (a more expensive PDI, increased dispersion, etc.) — for example, with Black-Scholes (spot=100, vol=30%, rate=3%, T=3 years), a K=70 put has d1=1.119, d2=0.600, P≈4.41, versus d1=1.767, d2=1.247, P≈1.00 for K=50: protection down to 70% is worth about 4.4 times more than down to 50%. 3) Check that the higher proposed coupon is consistent with the magnitude of these differences, and not disproportionate (which would indicate higher structuring fees rather than a genuine risk transfer).",
  },
  interpretation: {
    fr: "Un coupon d'autocall doit toujours être interprété en relation avec sa barrière de capital et la nature du sous-jacent (simple ou worst-of) : un coupon élevé isolé, sans regarder ces paramètres, ne dit rien sur la qualité du produit — il peut aussi bien signaler un risque bien compensé qu'une marge excessive de l'émetteur.",
    en: "An autocall's coupon must always be interpreted in relation to its capital barrier and the underlying's nature (single or worst-of): a high coupon viewed in isolation, without looking at these parameters, says nothing about the product's quality — it may equally signal well-compensated risk or excessive issuer margin.",
  },
  pitfalls: {
    fr: "Comparer deux autocalls uniquement sur leur coupon affiché sans vérifier que les barrières, la maturité et le nombre de sous-jacents sont comparables. Autre piège : croire qu'un panier worst-of est \"presque comme\" un seul sous-jacent parce que les actifs semblent similaires (même secteur) — la corrélation réelle entre les actifs est ce qui détermine l'ampleur du risque additionnel, pas leur ressemblance apparente (voir M09-1).",
    en: "Comparing two autocalls solely on their displayed coupon without checking that barriers, maturity and the number of underlyings are comparable. Another trap: believing a worst-of basket is \"almost like\" a single underlying because the assets seem similar (same sector) — the assets' real correlation is what determines the additional risk's magnitude, not their apparent similarity (see M09-1).",
  },
  keyPoints: {
    fr: [
      "Chaque levier augmentant le coupon (barrière plus proche, maturité plus longue, worst-of, volatilité plus élevée) transfère davantage de risque à l'investisseur.",
      "Un coupon élevé n'est jamais gratuit : il compense toujours un risque plus grand, jamais une simple générosité de l'émetteur.",
      "Comparer des autocalls nécessite de comparer TOUS leurs paramètres, pas seulement le coupon affiché.",
    ],
    en: [
      "Every coupon-increasing lever (closer barrier, longer maturity, worst-of, higher volatility) transfers more risk to the investor.",
      "A high coupon is never free: it always compensates greater risk, never simple issuer generosity.",
      "Comparing autocalls requires comparing ALL their parameters, not just the displayed coupon.",
    ],
  },
  advancedDemonstration: {
    fr: "L'effet du levier \"worst-of\" est particulièrement non-linéaire : ajouter un deuxième sous-jacent faiblement corrélé au panier augmente le risque de queue (la probabilité que LE pire actif franchisse la barrière) de façon disproportionnée par rapport à l'intuition, car la probabilité qu'au moins un actif sur N descende sous un seuil croît avec N même si chaque actif pris isolément a la même probabilité individuelle de le faire — un lien direct avec la dispersion (M09-1) et un rappel que l'ajout d'actifs dans un panier worst-of n'est presque jamais neutre en risque, même si chaque actif semble individuellement raisonnable.",
    en: "The \"worst-of\" lever's effect is particularly non-linear: adding a second weakly correlated underlying to the basket increases tail risk (the probability THE worst asset breaches the barrier) disproportionately to intuition, since the probability that at least one of N assets falls below a threshold grows with N even if each asset individually has the same probability of doing so — a direct link to dispersion (M09-1) and a reminder that adding assets to a worst-of basket is almost never risk-neutral, even if each asset individually seems reasonable.",
  },
  businessApplication: {
    fr: "Un vendeur de produits structurés utilise cette décomposition pour répondre à la question la plus fréquente d'un client ou d'un conseiller en gestion de patrimoine : \"pourquoi ce produit offre-t-il un coupon plus élevé que celui de la banque concurrente ?\" — la réponse professionnelle n'est jamais \"parce que c'est un meilleur produit\", mais l'identification précise du ou des leviers de risque (barrière, maturité, nombre de sous-jacents) qui financent cet écart de coupon.",
    en: "A structured products salesperson uses this breakdown to answer the most frequent question from a client or wealth advisor: \"why does this product offer a higher coupon than the competing bank's?\" — the professional answer is never \"because it's a better product\", but the precise identification of the risk lever(s) (barrier, maturity, number of underlyings) funding that coupon gap.",
  },
  interviewQuestion: {
    question: "A client shows you two autocall term sheets on similar stocks: one pays an 8% coupon, the other 13%. Before saying anything about which is 'better', what would you check first?",
    answer: "I'd never compare the headline coupon in isolation — a higher coupon always funds a specific extra risk, never free generosity from the issuer. I'd line up the term sheets parameter by parameter: the capital barrier level relative to spot (a barrier closer to spot is breached far more easily, so it's worth more to give up, which funds a higher coupon), the maturity (longer maturity gives the barrier more time to be touched), and whether it's a single underlying or a worst-of basket (a worst-of on weakly correlated names adds tail risk non-linearly). Only once I've matched which of those levers explains the 5-point coupon gap can I tell the client whether the higher-coupon product is fairly priced for its extra risk, or whether the gap looks disproportionate — which would instead point to higher structuring fees.",
  },
};
