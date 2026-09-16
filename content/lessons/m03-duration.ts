import type { LessonContent } from "@/lib/lesson-types";

export const m03Duration: LessonContent = {
  conceptId: "m03-duration",
  prerequisiteReminder: {
    text: {
      fr: "Il faut déjà savoir comment on calcule le prix d'une obligation par actualisation des flux (coupons + remboursement), et ce qu'est un rendement actuariel.",
      en: "You should already know how a bond is priced by discounting its cash flows (coupons + redemption), and what a yield to maturity is.",
    },
    conceptIds: ["m03-pricing-obligation", "m03-definition-obligations"],
  },
  glossary: [
    {
      term: { fr: "Rendement actuariel (yield)", en: "Yield to maturity" },
      definition: {
        fr: "Le taux d'actualisation unique qui, appliqué à tous les flux futurs d'une obligation, redonne exactement son prix de marché actuel.",
        en: "The single discount rate that, applied to all of a bond's future cash flows, reproduces exactly its current market price.",
      },
    },
    {
      term: { fr: "Valeur actuelle (VA) d'un flux", en: "Present value (PV) of a cash flow" },
      definition: {
        fr: "Ce que vaut aujourd'hui un paiement futur, une fois actualisé au taux du marché — plus le paiement est lointain, plus sa valeur actuelle est faible.",
        en: "What a future payment is worth today, once discounted at the market rate — the further away the payment, the lower its present value.",
      },
    },
  ],
  intuition: {
    fr: "Une obligation verse des flux fixes, déjà écrits dans le contrat. Si les taux du marché montent, ces flux fixes valent moins aujourd'hui (on les actualise plus fort) — donc le prix de l'obligation baisse. La duration mesure précisément à quel point ce prix réagit aux taux.",
    en: "A bond pays fixed cash flows, already written into the contract. If market rates rise, those fixed flows are worth less today (they get discounted more heavily) — so the bond's price falls. Duration measures precisely how sensitive that price is to rates.",
  },
  definition: {
    fr: "La duration de Macaulay est la moyenne des dates de paiement des flux d'une obligation, pondérée par la valeur actuelle de chaque flux (exprimée en années). La duration modifiée, dérivée de la précédente, donne directement la sensibilité relative du prix aux taux : une variation de taux Δy fait varier le prix d'environ −D_mod × Δy en pourcentage.",
    en: "Macaulay duration is the average payment date of a bond's cash flows, weighted by each flow's present value (expressed in years). Modified duration, derived from it, directly gives the price's relative sensitivity to rates: a rate change Δy moves the price by about −D_mod × Δy in percentage terms.",
  },
  utility: {
    fr: "Sert à répondre vite à la question « si les taux montent de tant, mon obligation perd combien de valeur ? » sans refaire tout le calcul d'actualisation à chaque fois — utile pour comparer des obligations ou piloter un risque de taux.",
    en: "Used to quickly answer \"if rates rise by this much, how much value does my bond lose?\" without redoing the full discounting calculation each time — useful to compare bonds or manage rate risk.",
  },
  example: {
    fr: "Une obligation à 5 ans, coupon 4%, se traite à un rendement de 3%. Sa duration modifiée est d'environ 4,5. Si le rendement de marché passe de 3% à 4% (Δy = +1%), le prix baisse d'environ 4,5 × 1% = 4,5%.",
    en: "A 5-year bond, 4% coupon, trades at a 3% yield. Its modified duration is about 4.5. If the market yield rises from 3% to 4% (Δy = +1%), the price falls by about 4.5 × 1% = 4.5%.",
  },
  alternativeExplanation: {
    fr: "Imaginez la duration comme un « délai moyen pondéré » pour récupérer votre mise : un coupon élevé ou une échéance courte rapproche ce délai (duration plus faible, obligation moins sensible aux taux) ; un coupon faible (voire zéro) ou une échéance longue l'éloigne (duration plus élevée, obligation plus sensible). Plus l'argent met de temps à revenir, plus une hausse de taux fait mal.",
    en: "Think of duration as a \"weighted average wait time\" to get your money back: a high coupon or a short maturity shortens that wait (lower duration, less rate-sensitive bond); a low (or zero) coupon or a long maturity lengthens it (higher duration, more rate-sensitive). The longer the money takes to come back, the more a rate rise hurts.",
  },
  formula: {
    latex: "\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}} \\times \\Delta y",
    variables: [
      { symbol: "\\Delta P / P", description: { fr: "Variation relative (en %) du prix de l'obligation", en: "Relative change (in %) of the bond's price" } },
      { symbol: "D_{\\text{mod}}", description: { fr: "Duration modifiée = D_Macaulay / (1 + y/m)", en: "Modified duration = Macaulay duration / (1 + y/m)" } },
      { symbol: "\\Delta y", description: { fr: "Variation du rendement de marché (en décimal, ex. 0,01 pour +1%)", en: "Change in market yield (as a decimal, e.g. 0.01 for +1%)" } },
      { symbol: "y, m", description: { fr: "Rendement actuariel et fréquence de coupon par an", en: "Yield to maturity and number of coupons per year" } },
    ],
    assumptions: {
      fr: "Approximation linéaire valable pour de petites variations de taux ; taux plat (même y pour tous les flux) ; ne capture pas la convexité (voir M03-4) pour de grandes variations.",
      en: "Linear approximation valid for small rate changes; flat rate assumption (same y for all cash flows); does not capture convexity (see M03-4) for large changes.",
    },
    units: {
      fr: "D_mod s'exprime en années ; Δy est en décimal (pas en %) dans la formule.",
      en: "D_mod is expressed in years; Δy is in decimal form (not %) in the formula.",
    },
    example: {
      fr: "D_mod = 4,5 et Δy = +0,01 (soit +1%) : ΔP/P ≈ −4,5 × 0,01 = −4,5%.",
      en: "D_mod = 4.5 and Δy = +0.01 (i.e. +1%): ΔP/P ≈ −4.5 × 0.01 = −4.5%.",
    },
  },
  calculation: {
    fr: "1) Lister tous les flux de l'obligation (coupons + remboursement) et leurs dates t. 2) Calculer la valeur actuelle (VA) de chaque flux au rendement actuel y. 3) Pondérer chaque date t par VA_t / Prix, et sommer : c'est la duration de Macaulay D_mac. 4) Diviser par (1 + y/m) pour obtenir la duration modifiée D_mod. 5) Appliquer ΔP/P ≈ −D_mod × Δy pour estimer l'effet d'une variation de taux.",
    en: "1) List all the bond's cash flows (coupons + redemption) and their dates t. 2) Compute the present value (PV) of each flow at the current yield y. 3) Weight each date t by PV_t / Price, and sum: this is Macaulay duration D_mac. 4) Divide by (1 + y/m) to get modified duration D_mod. 5) Apply ΔP/P ≈ −D_mod × Δy to estimate the effect of a rate change.",
  },
  interpretation: {
    fr: "Le signe moins est essentiel : prix et taux évoluent toujours en sens inverse pour une obligation à taux fixe. Plus la duration est grande, plus l'obligation est sensible : une obligation longue et à faible coupon (voire zéro-coupon) a une duration proche de sa maturité et réagit fortement ; une obligation courte à coupon élevé a une duration plus faible et réagit peu.",
    en: "The minus sign is essential: for a fixed-rate bond, price and yield always move in opposite directions. The larger the duration, the more sensitive the bond: a long bond with a low (or zero) coupon has a duration close to its maturity and reacts strongly; a short bond with a high coupon has a lower duration and reacts less.",
  },
  pitfalls: {
    fr: "Oublier le signe moins (une hausse de taux fait BAISSER le prix, jamais monter). Autre piège : utiliser Δy en pourcentage (« 1 ») au lieu de décimal (« 0,01 ») dans la formule, ce qui multiplie l'erreur par 100. Enfin, l'approximation devient imprécise pour de grandes variations de taux — c'est là que la convexité (M03-4) corrige l'estimation.",
    en: "Forgetting the minus sign (a rate rise ALWAYS makes the price fall, never rise). Another trap: using Δy as a percentage (\"1\") instead of a decimal (\"0.01\") in the formula, which multiplies the error by 100. Finally, the approximation becomes imprecise for large rate changes — that's where convexity (M03-4) corrects the estimate.",
  },
  keyPoints: {
    fr: [
      "Quand les taux montent, le prix d'une obligation à taux fixe baisse — toujours, à cause de l'actualisation des flux fixes.",
      "La duration modifiée quantifie cette sensibilité : ΔP/P ≈ −D_mod × Δy.",
      "Plus la duration est grande (longue maturité, faible coupon), plus l'obligation est sensible aux taux.",
    ],
    en: [
      "When rates rise, a fixed-rate bond's price falls — always, because of discounting the fixed cash flows.",
      "Modified duration quantifies this sensitivity: ΔP/P ≈ −D_mod × Δy.",
      "The larger the duration (long maturity, low coupon), the more rate-sensitive the bond.",
    ],
  },
  advancedDemonstration: {
    fr: "Démonstration : le prix P = Σ CF_t / (1+y/m)^(mt). En dérivant P par rapport à y : dP/dy = −(1/(1+y/m)) × Σ [t × CF_t / (1+y/m)^(mt)] = −(1/(1+y/m)) × D_mac × P (puisque D_mac = Σ[t × VA_t]/P). D'où dP/P/dy = −D_mac/(1+y/m) = −D_mod. C'est une élasticité au premier ordre (comme une dérivée), donc une approximation linéaire : localement précise, mais qui s'écarte de la vraie relation prix-taux (convexe, pas linéaire) quand Δy devient grand — d'où l'intérêt de la convexité en complément (M03-4).",
    en: "Proof: price P = Σ CF_t / (1+y/m)^(mt). Differentiating P with respect to y: dP/dy = −(1/(1+y/m)) × Σ [t × CF_t / (1+y/m)^(mt)] = −(1/(1+y/m)) × D_mac × P (since D_mac = Σ[t × PV_t]/P). Hence dP/P/dy = −D_mac/(1+y/m) = −D_mod. This is a first-order elasticity (like a derivative), hence a linear approximation: locally accurate, but it drifts from the true (convex, non-linear) price-yield relationship as Δy grows — which is why convexity is used as a complement (M03-4).",
  },
};
