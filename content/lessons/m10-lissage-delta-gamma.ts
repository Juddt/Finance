import type { LessonContent } from "@/lib/lesson-types";

export const m10LissageDeltaGamma: LessonContent = {
  conceptId: "m10-lissage-delta-gamma",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le comportement extrême des Greeks près d'une barrière et la réplication d'une digitale par spread.",
      en: "You need to know the Greeks' extreme behavior near a barrier and digital replication via a spread.",
    },
    conceptIds: ["m10-greeks-barrieres", "m10-replication-digitale"],
  },
  glossary: [
    { term: { fr: "Basis risk (risque de base)", en: "Basis risk" }, definition: { fr: "Ici, l'écart entre le payoff \"lissé\" réellement couvert et le payoff exact du contrat, qui reste à la charge de l'émetteur.", en: "Here, the gap between the actually hedged \"smoothed\" payoff and the contract's exact payoff, which remains the issuer's responsibility." } },
  ],
  intuition: {
    fr: "Puisqu'un Delta et un Gamma théoriquement infinis sont impossibles à couvrir en pratique, les desks remplacent volontairement le payoff exact et discontinu (barrière ou digitale) par une version légèrement \"adoucie\", pour rendre la couverture possible — au prix d'accepter un petit écart de prix par rapport au contrat théorique pur.",
    en: "Since a theoretically infinite Delta and Gamma are impossible to hedge in practice, desks deliberately replace the exact, discontinuous payoff (barrier or digital) with a slightly \"softened\" version, to make hedging possible — at the cost of accepting a small price gap versus the pure theoretical contract.",
  },
  definition: {
    fr: "Le lissage consiste à remplacer un payoff discontinu par une approximation continue et différentiable sur un petit intervalle autour du seuil (par exemple, un call spread serré à la place d'une digitale, voir M10-8, ou une transition progressive à la place d'un saut brutal de barrière). La largeur de cet intervalle de lissage est un paramètre choisi explicitement, arbitrant entre fidélité au contrat et faisabilité de la couverture.",
    en: "Smoothing means replacing a discontinuous payoff with a continuous, differentiable approximation over a small interval around the threshold (for example, a tight call spread instead of a digital, see M10-8, or a gradual transition instead of an abrupt barrier jump). This smoothing interval's width is an explicitly chosen parameter, trading off contract fidelity against hedging feasibility.",
  },
  utility: {
    fr: "Le lissage est ce qui rend gérable, en pratique, tout livre d'options barrières ou digitales : sans lui, un trader serait théoriquement obligé de trader des quantités infinies de sous-jacent au moment précis du franchissement du seuil, ce qui est physiquement et économiquement impossible.",
    en: "Smoothing is what makes any barrier or digital options book manageable in practice: without it, a trader would theoretically be forced to trade infinite quantities of underlying at the exact moment the threshold is crossed, which is physically and economically impossible.",
  },
  example: {
    fr: "Plutôt que de modéliser une digitale exacte (saut instantané de 0 à 1000 EUR au strike K=100), un desk la price et la couvre comme si le paiement se \"répartissait\" linéairement entre K=99 et K=101 — un lissage de largeur 2. Le prix obtenu diffère très légèrement du prix théorique exact de la digitale pure, mais le Delta et le Gamma de couverture restent dans des bornes gérables.",
    en: "Rather than modeling an exact digital (an instantaneous jump from 0 to EUR 1,000 at strike K=100), a desk prices and hedges it as if the payment \"spread out\" linearly between K=99 and K=101 — a smoothing width of 2. The resulting price differs very slightly from the pure digital's exact theoretical price, but the hedging Delta and Gamma stay within manageable bounds.",
  },
  alternativeExplanation: {
    fr: "C'est comme remplacer une marche d'escalier verticale par une rampe légèrement inclinée sur un petit segment : on ne peut pas monter une marche parfaitement verticale sans effort infini au point de transition, mais une rampe, même très raide, reste physiquement franchissable. Le lissage transforme une discontinuité \"impossible à gravir\" en une pente raide mais gérable.",
    en: "It's like replacing a perfectly vertical staircase step with a slightly inclined ramp over a small segment: you can't climb a perfectly vertical step without infinite effort at the transition point, but a ramp, even a very steep one, remains physically climbable. Smoothing turns an \"impossible to climb\" discontinuity into a steep but manageable slope.",
  },
  formula: {
    latex: "\\text{Gamma}_{\\text{max, lissé}} \\approx \\frac{\\Delta V}{\\delta^{2}}",
    variables: [
      { symbol: "\\Delta V", description: { fr: "Amplitude du saut de valeur du payoff original (discontinu)", en: "The original (discontinuous) payoff's value-jump amplitude" } },
      { symbol: "\\delta", description: { fr: "Largeur de l'intervalle de lissage choisi", en: "The chosen smoothing interval's width" } },
    ],
    assumptions: { fr: "Approximation d'ordre de grandeur ; le Gamma exact dépend de la forme précise de la fonction de lissage choisie (linéaire, spread d'options, autre).", en: "Order-of-magnitude approximation; the exact Gamma depends on the precise shape of the chosen smoothing function (linear, option spread, other)." },
    units: { fr: "Gamma dans l'unité appropriée au payoff (par unité de sous-jacent au carré).", en: "Gamma in the payoff's appropriate unit (per squared unit of underlying)." },
    example: { fr: "ΔV=1000, δ=2 : Gamma_max ≈ 1000/4 = 250 — élevé, mais fini et gérable, contrairement au cas non lissé (δ→0).", en: "ΔV=1000, δ=2: Gamma_max ≈ 1000/4 = 250 — high, but finite and manageable, unlike the unsmoothed case (δ→0)." },
  },
  calculation: {
    fr: "1) Identifier l'amplitude ΔV du saut de payoff (par exemple, le montant cash d'une digitale, ou la valeur de l'option juste avant une barrière). 2) Choisir une largeur de lissage δ, en fonction du risque de couverture jugé acceptable. 3) Estimer le Gamma maximal résultant ≈ ΔV/δ². 4) Ajuster δ si ce Gamma reste trop élevé pour être couvert de façon réaliste.",
    en: "1) Identify the payoff jump's amplitude ΔV (e.g. a digital's cash amount, or the option's value just before a barrier). 2) Choose a smoothing width δ, based on the hedging risk deemed acceptable. 3) Estimate the resulting maximum Gamma ≈ ΔV/δ². 4) Adjust δ if this Gamma remains too high to be realistically hedged.",
  },
  interpretation: {
    fr: "Le choix de δ est un compromis fondamental : un δ trop petit laisse un Gamma trop élevé (risque de couverture important) ; un δ trop grand fait diverger le prix effectivement chargé au client de la valeur théorique exacte du contrat (risque de base, ou \"basis risk\", entre le prix vendu et le coût de couverture réel). Les desks calibrent généralement δ en fonction de la liquidité réelle du sous-jacent et de la fréquence de rééquilibrage possible.",
    en: "Choosing δ is a fundamental trade-off: too small a δ leaves Gamma too high (significant hedging risk); too large a δ makes the price actually charged to the client diverge from the contract's exact theoretical value (basis risk, between the price sold and the real hedging cost). Desks generally calibrate δ based on the underlying's real liquidity and the achievable rebalancing frequency.",
  },
  pitfalls: {
    fr: "Croire que le lissage élimine complètement le risque de Gamma extrême : il le réduit et le rend gérable, mais ne l'annule jamais totalement — un Gamma élevé (même fini) reste un Gamma élevé, coûteux à couvrir. Autre piège : oublier que le lissage crée un écart de prix (basis risk) entre le contrat vendu au client (souvent au payoff \"pur\") et la couverture réellement mise en place (le payoff lissé) — cet écart doit être budgété comme un coût, pas ignoré.",
    en: "Believing smoothing completely eliminates extreme Gamma risk: it reduces and makes it manageable, but never fully cancels it — a high (even finite) Gamma remains a high, costly-to-hedge Gamma. Another trap: forgetting smoothing creates a price gap (basis risk) between the contract sold to the client (often at the \"pure\" payoff) and the hedge actually put in place (the smoothed payoff) — this gap must be budgeted as a cost, not ignored.",
  },
  keyPoints: {
    fr: [
      "Le lissage remplace un payoff discontinu par une approximation continue sur un petit intervalle δ.",
      "Gamma_max ≈ ΔV/δ² : réduire le risque de Gamma nécessite d'élargir δ, au prix d'un écart de prix (basis risk).",
      "Aucun choix de δ n'élimine totalement le risque ; c'est toujours un compromis à calibrer.",
    ],
    en: [
      "Smoothing replaces a discontinuous payoff with a continuous approximation over a small interval δ.",
      "Gamma_max ≈ ΔV/δ²: reducing Gamma risk requires widening δ, at the cost of a price gap (basis risk).",
      "No choice of δ fully eliminates the risk; it's always a trade-off to calibrate.",
    ],
  },
  advancedDemonstration: {
    fr: "Des techniques plus sophistiquées que le simple lissage linéaire existent : le \"overhedging\" consiste à systématiquement acheter un peu plus de protection que ce que le prix théorique du contrat pur justifierait (par exemple, coter et couvrir un knock-out avec une barrière légèrement déplacée en interne, combinant les idées de M10-5 et de ce lissage), garantissant que l'émetteur ne soit jamais en position de sous-couverture, au prix d'une marge structurellement intégrée au prix de vente. Ces méthodes de gestion du risque résiduel de barrière/digitale représentent une part significative du savoir-faire différenciant entre desks exotiques, au-delà du simple modèle de pricing théorique.",
    en: "Techniques more sophisticated than simple linear smoothing exist: \"overhedging\" means systematically buying a bit more protection than the pure contract's theoretical price would justify (for example, quoting and hedging a knock-out with an internally shifted barrier, combining the ideas from M10-5 and this smoothing), guaranteeing the issuer is never under-hedged, at the cost of a margin structurally built into the sale price. These residual barrier/digital risk-management methods represent a significant part of the differentiating know-how between exotics desks, beyond the pure theoretical pricing model.",
  },
};
