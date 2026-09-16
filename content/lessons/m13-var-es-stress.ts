import type { LessonContent } from "@/lib/lesson-types";

export const m13VarEsStress: LessonContent = {
  conceptId: "m13-var-es-stress",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la volatilité réalisée et la notion de distribution des rendements.",
      en: "You need to know realized volatility and the concept of a return distribution.",
    },
    conceptIds: ["m08-volatilite-realisee"],
  },
  glossary: [
    { term: { fr: "Downside risk", en: "Downside risk" }, definition: { fr: "Une mesure de risque qui ne considère que les mouvements défavorables (pertes), contrairement à la volatilité qui traite hausses et baisses symétriquement.", en: "A risk measure considering only unfavorable movements (losses), unlike volatility which treats gains and losses symmetrically." } },
    { term: { fr: "Stress test", en: "Stress test" }, definition: { fr: "Une simulation de l'impact d'un scénario de marché extrême (souvent historique) sur un portefeuille, complémentaire aux mesures statistiques comme la VaR.", en: "A simulation of an extreme (often historical) market scenario's impact on a portfolio, complementary to statistical measures like VaR." } },
  ],
  intuition: {
    fr: "La volatilité (M08-1) résume le risque en un seul chiffre symétrique, mais un investisseur se soucie surtout du risque de PERTE, pas de la variabilité en général. La VaR et l'Expected Shortfall répondent directement à la question \"combien puis-je perdre, et à quel point ce serait grave ?\", tandis qu'un stress test complète cette approche statistique par des scénarios concrets et extrêmes.",
    en: "Volatility (M08-1) summarizes risk in a single symmetric number, but an investor mainly cares about LOSS risk, not variability in general. VaR and Expected Shortfall directly answer \"how much could I lose, and how bad would that be?\", while a stress test complements this statistical approach with concrete, extreme scenarios.",
  },
  definition: {
    fr: "La Value at Risk (VaR) à un niveau de confiance donné (par exemple 95%) est la perte maximale attendue sur un horizon donné, avec cette probabilité — une VaR à 95% de 1M€ signifie qu'il y a 5% de chances de perdre plus de 1M€. L'Expected Shortfall (ES, ou CVaR) va plus loin : c'est la perte MOYENNE dans les scénarios où la VaR est dépassée, capturant l'ampleur des pertes extrêmes que la VaR seule ignore. Un stress test évalue l'impact d'un scénario historique spécifique (crise de 2008, krach de 1987) ou hypothétique sur le portefeuille actuel, sans faire d'hypothèse sur une distribution statistique.",
    en: "Value at Risk (VaR) at a given confidence level (e.g. 95%) is the maximum expected loss over a given horizon, with that probability — a 95% VaR of €1M means there's a 5% chance of losing more than €1M. Expected Shortfall (ES, or CVaR) goes further: it's the AVERAGE loss in scenarios where VaR is exceeded, capturing the magnitude of extreme losses that VaR alone ignores. A stress test evaluates a specific historical (2008 crisis, 1987 crash) or hypothetical scenario's impact on the current portfolio, without any statistical distribution assumption.",
  },
  utility: {
    fr: "La VaR est la mesure de risque réglementaire la plus répandue dans l'industrie bancaire (bases du dispositif de Bâle, M13-reg-a) pour déterminer les fonds propres nécessaires ; l'Expected Shortfall, moins sensible aux limites de la VaR, est de plus en plus privilégiée par les régulateurs (notamment dans le cadre FRTB). Les stress tests complètent ces mesures statistiques en couvrant des scénarios extrêmes que l'historique récent pourrait ne pas capturer.",
    en: "VaR is the most widespread risk measure in the banking industry (a Basel framework foundation, M13-reg-a) for determining required capital; Expected Shortfall, less sensitive to VaR's limitations, is increasingly favored by regulators (notably under the FRTB framework). Stress tests complement these statistical measures by covering extreme scenarios recent history might not capture.",
  },
  example: {
    fr: "Un portefeuille a une VaR à 99% sur 1 jour de 500 000 €, mais une Expected Shortfall de 900 000 € : cela signifie que dans le pire 1% des cas, la perte moyenne (900 000 €) est presque le double de la VaR elle-même — un signe que la distribution des pertes a une queue épaisse (fat tail), un risque que la VaR seule sous-estime largement. Un stress test répliquant la crise de 2008 sur ce même portefeuille pourrait révéler une perte de 2M€, bien au-delà de ce que suggèrent les mesures statistiques usuelles.",
    en: "A portfolio has a 1-day 99% VaR of €500,000, but an Expected Shortfall of €900,000: this means that in the worst 1% of cases, the average loss (€900,000) is almost double the VaR itself — a sign the loss distribution has a fat tail, a risk VaR alone largely understates. A stress test replicating the 2008 crisis on this same portfolio might reveal a €2M loss, far beyond what usual statistical measures suggest.",
  },
  alternativeExplanation: {
    fr: "La VaR, c'est comme dire \"il y a 5% de chances qu'il pleuve plus de 20mm demain\" — utile, mais ne dit rien sur combien il pleuvrait dans ce cas précis (5mm de plus ou une inondation ?). L'Expected Shortfall répond à cette question en calculant la pluviométrie MOYENNE dans tous les scénarios où il pleut plus de 20mm — une information bien plus riche sur l'ampleur du pire des cas.",
    en: "VaR is like saying \"there's a 5% chance of more than 20mm of rain tomorrow\" — useful, but says nothing about how much it would rain in that specific case (5mm more, or a flood?). Expected Shortfall answers this by computing the AVERAGE rainfall across all scenarios exceeding 20mm — much richer information about the worst case's magnitude.",
  },
  formula: {
    latex: "\\text{ES}_{\\alpha} = E[\\text{Perte} \\mid \\text{Perte} > \\text{VaR}_{\\alpha}]",
    variables: [
      { symbol: "\\text{VaR}_{\\alpha}", description: { fr: "Perte au niveau de confiance α (par exemple 95% ou 99%)", en: "Loss at confidence level α (e.g. 95% or 99%)" } },
      { symbol: "\\text{ES}_{\\alpha}", description: { fr: "Perte moyenne conditionnelle au fait de dépasser la VaR — toujours supérieure ou égale à la VaR", en: "Average loss conditional on exceeding VaR — always greater than or equal to VaR" } },
    ],
    assumptions: { fr: "Calcul historique (sur données passées), paramétrique (hypothèse de distribution, souvent normale) ou par simulation Monte-Carlo (M06-7) ; chaque méthode a ses propres limites.", en: "Historical (on past data), parametric (distribution assumption, often normal), or Monte Carlo simulation (M06-7) calculation; each method has its own limitations." },
    units: { fr: "Perte dans la devise du portefeuille.", en: "Loss in the portfolio's currency." },
    example: { fr: "VaR_95%=500K, ES_95%=900K : dans le pire 5% des cas, la perte moyenne est presque le double de la VaR elle-même.", en: "VaR_95%=500K, ES_95%=900K: in the worst 5% of cases, the average loss is almost double the VaR itself." },
  },
  calculation: {
    fr: "1) Choisir une méthode : historique (utiliser directement les rendements passés), paramétrique (supposer une distribution, ex. normale, et utiliser sa formule), ou Monte-Carlo (simuler de nombreux scénarios). 2) Choisir un niveau de confiance (95%, 99%) et un horizon (1 jour, 10 jours). 3) Calculer la VaR comme le quantile correspondant de la distribution des pertes. 4) Calculer l'Expected Shortfall comme la moyenne des pertes au-delà de ce quantile. 5) Compléter par des stress tests sur des scénarios historiques ou hypothétiques spécifiques.",
    en: "1) Choose a method: historical (directly use past returns), parametric (assume a distribution, e.g. normal, and use its formula), or Monte Carlo (simulate many scenarios). 2) Choose a confidence level (95%, 99%) and horizon (1 day, 10 days). 3) Compute VaR as the corresponding quantile of the loss distribution. 4) Compute Expected Shortfall as the average of losses beyond that quantile. 5) Complement with stress tests on specific historical or hypothetical scenarios.",
  },
  interpretation: {
    fr: "Un écart important entre VaR et Expected Shortfall signale une distribution à queue épaisse (fat tail), un risque de pertes extrêmes disproportionnées par rapport à ce que la VaR seule suggère. Un stress test qui révèle une perte bien supérieure à la VaR statistique indique que l'historique récent (sur lequel la VaR est souvent calculée) ne capture pas suffisamment les scénarios extrêmes possibles.",
    en: "A large gap between VaR and Expected Shortfall signals a fat-tailed distribution, a risk of disproportionately extreme losses relative to what VaR alone suggests. A stress test revealing a loss far exceeding the statistical VaR indicates recent history (on which VaR is often computed) doesn't sufficiently capture possible extreme scenarios.",
  },
  pitfalls: {
    fr: "Croire que la VaR est la perte MAXIMALE possible : elle ne dit rien sur l'ampleur des pertes au-delà du seuil, d'où l'importance de l'Expected Shortfall. Autre piège classique : calculer la VaR uniquement sur une période calme récente, ce qui sous-estime systématiquement le risque réel — les stress tests basés sur des crises historiques passées sont un complément indispensable pour compenser ce biais.",
    en: "Believing VaR is the MAXIMUM possible loss: it says nothing about losses' magnitude beyond the threshold, hence Expected Shortfall's importance. Another classic trap: computing VaR only on a recent calm period, which systematically understates real risk — stress tests based on past historical crises are an essential complement to offset this bias.",
  },
  keyPoints: {
    fr: [
      "La VaR est la perte maximale attendue à un niveau de confiance donné ; l'Expected Shortfall est la perte moyenne au-delà de ce seuil.",
      "L'Expected Shortfall capture mieux le risque de queue épaisse que la VaR seule.",
      "Les stress tests complètent les mesures statistiques par des scénarios historiques ou hypothétiques concrets.",
    ],
    en: [
      "VaR is the maximum expected loss at a given confidence level; Expected Shortfall is the average loss beyond that threshold.",
      "Expected Shortfall better captures fat-tail risk than VaR alone.",
      "Stress tests complement statistical measures with concrete historical or hypothetical scenarios.",
    ],
  },
  advancedDemonstration: {
    fr: "L'Expected Shortfall possède une propriété mathématique que la VaR n'a pas : la sous-additivité (ES d'un portefeuille combiné ≤ somme des ES individuels), une propriété essentielle de cohérence pour une mesure de risque, car elle garantit que la diversification (M13-gp-a) ne peut jamais augmenter le risque mesuré — la VaR, elle, peut dans certains cas exotiques violer cette propriété, un défaut théorique qui a motivé le passage progressif de la VaR vers l'Expected Shortfall dans la réglementation prudentielle (FRTB, M13-reg-a).",
    en: "Expected Shortfall has a mathematical property VaR lacks: subadditivity (ES of a combined portfolio ≤ the sum of individual ESs), an essential coherence property for a risk measure, since it guarantees diversification (M13-gp-a) can never increase measured risk — VaR, in some exotic cases, can violate this property, a theoretical flaw that motivated the gradual shift from VaR to Expected Shortfall in prudential regulation (FRTB, M13-reg-a).",
  },
};
