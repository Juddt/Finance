import type { LessonContent } from "@/lib/lesson-types";

export const m13PnlAttributionLimites: LessonContent = {
  conceptId: "m13-pnl-attribution-limites",
  prerequisiteReminder: {
    text: {
      fr: "Il faut comprendre les ordres, le levier et le calcul du P&L d'une position, présentés dans la notion précédente de ce chapitre.",
      en: "You need to understand orders, leverage and a position's P&L computation, covered in the previous concept of this chapter.",
    },
    conceptIds: ["m13-ordres-levier-marge"],
  },
  glossary: [
    { term: { fr: "Résultat inexpliqué (unexplained P&L)", en: "Unexplained P&L" }, definition: { fr: "La part du P&L total d'un portefeuille qui ne peut être attribuée à aucun des facteurs de risque identifiés dans le modèle d'attribution, souvent le signe d'une erreur de modèle ou de données.", en: "The portion of a portfolio's total P&L that cannot be attributed to any risk factor identified in the attribution model, often a sign of a model or data error." } },
    { term: { fr: "Limite de risque", en: "Risk limit" }, definition: { fr: "Un plafond fixé sur une mesure de risque donnée (DV01, VaR, notionnel...) qu'un desk ou un trader ne doit pas dépasser sans autorisation.", en: "A cap set on a given risk measure (DV01, VaR, notional...) that a desk or trader must not exceed without authorization." } },
  ],
  intuition: {
    fr: "Un trader qui constate un gain ou une perte sur son portefeuille en fin de journée ne peut pas se contenter de ce seul chiffre : il doit comprendre D'OÙ vient ce résultat, pour savoir si ses positions se comportent comme prévu, si un risque non désiré s'est matérialisé, ou si une erreur de valorisation s'est glissée quelque part. Attribuer le P&L, c'est décomposer ce chiffre unique en contributions identifiables, chacune reliée à un facteur de risque précis.",
    en: "A trader who sees a gain or loss on their portfolio at day's end can't settle for that single number: they must understand WHERE this result comes from, to know whether their positions are behaving as expected, whether an undesired risk materialized, or whether a valuation error crept in somewhere. Attributing P&L means breaking down this single figure into identifiable contributions, each tied to a precise risk factor.",
  },
  definition: {
    fr: "L'attribution du P&L consiste à décomposer le résultat total d'un portefeuille en contributions liées à chaque facteur de risque identifié (mouvements de taux, de spread de crédit, de niveau d'actions, de change, de volatilité...), plus une contribution liée au financement (coût ou revenu de portage) et aux coûts de transaction. Ce qui reste après avoir expliqué toutes ces contributions est le résultat inexpliqué, qui doit rester faible : un résultat inexpliqué important signale généralement un problème de modèle, de données, ou un risque non identifié. Les limites de risque plafonnent séparément chacune de ces expositions, pour contenir la perte potentielle liée à chaque facteur.",
    en: "P&L attribution consists of breaking down a portfolio's total result into contributions tied to each identified risk factor (rate moves, credit spread moves, equity level moves, FX moves, volatility moves...), plus a contribution tied to funding (carry cost or income) and transaction costs. What remains after explaining all these contributions is the unexplained P&L, which should stay small: a large unexplained P&L generally signals a model or data problem, or an unidentified risk. Risk limits separately cap each of these exposures, to contain the potential loss tied to each factor.",
  },
  utility: {
    fr: "Sans attribution du P&L, un desk ne peut ni vérifier que son résultat provient bien des risques qu'il pense avoir pris (et non d'un risque non désiré ou d'une erreur), ni communiquer clairement à sa hiérarchie ou au risk management pourquoi il gagne ou perd de l'argent. Les limites de risque, définies sur les mêmes facteurs que l'attribution, permettent de contenir a priori l'ampleur de chaque risque avant qu'il ne se matérialise en perte, complétant ainsi l'attribution a posteriori par un contrôle a priori.",
    en: "Without P&L attribution, a desk can neither verify its result genuinely stems from the risks it believes it took (rather than an undesired risk or an error), nor clearly communicate to management or risk why it's making or losing money. Risk limits, defined on the same factors as attribution, allow containing each risk's magnitude upfront before it materializes as a loss, thus complementing after-the-fact attribution with an upfront control.",
  },
  example: {
    fr: "Un portefeuille obligataire enregistre une perte de 150 000 EUR sur une journée. L'attribution décompose ce résultat : −180 000 EUR liés à la hausse des taux (facteur DV01), +40 000 EUR liés au resserrement des spreads de crédit (facteur CS01), −5 000 EUR de coût de financement (carry négatif), et −5 000 EUR de résultat inexpliqué. La somme des contributions explicables (−180 000 + 40 000 − 5 000 = −145 000) est proche du P&L total observé (−150 000), avec un résultat inexpliqué faible de −5 000 EUR — un niveau jugé normal, contrairement à un résultat inexpliqué qui représenterait une part importante du P&L total.",
    en: "A bond portfolio records a EUR 150,000 loss over one day. Attribution breaks this result down: −EUR 180,000 from rising rates (DV01 factor), +EUR 40,000 from tightening credit spreads (CS01 factor), −EUR 5,000 in funding cost (negative carry), and −EUR 5,000 in unexplained P&L. The sum of explainable contributions (−180,000 + 40,000 − 5,000 = −145,000) is close to the observed total P&L (−150,000), with a small −EUR 5,000 unexplained P&L — a level considered normal, unlike an unexplained P&L representing a significant share of the total P&L.",
  },
  alternativeExplanation: {
    fr: "Imaginez un relevé bancaire mensuel où le solde a baissé de 500 EUR : cela ne dit rien en soi. Un bon budget décompose cette baisse en \"loyer −800\", \"salaire +1200\", \"courses −300\", \"imprévu −600\", et il reste éventuellement un petit écart non expliqué (frais bancaires oubliés, erreur d'arrondi). L'attribution du P&L fait exactement la même chose pour un portefeuille financier : le chiffre global seul ne raconte rien, sa décomposition raconte tout.",
    en: "Picture a monthly bank statement where the balance dropped by EUR 500: that alone says nothing. A good budget breaks this drop down into \"rent −800\", \"salary +1,200\", \"groceries −300\", \"unexpected −600\", possibly leaving a small unexplained gap (forgotten bank fees, rounding error). P&L attribution does exactly the same for a financial portfolio: the single overall figure tells nothing, its breakdown tells everything.",
  },
  formula: {
    latex: "\\begin{aligned} P\\&L_{total} &= \\sum_k \\text{Sensibilité}_k \\times \\Delta \\text{Facteur}_k + \\text{Carry} - \\text{Coûts} + \\text{Inexpliqué} \\end{aligned}",
    variables: [
      { symbol: "\\text{Sensibilité}_k", description: { fr: "Sensibilité de la position au facteur de risque k (par exemple DV01, CS01, delta actions)", en: "The position's sensitivity to risk factor k (e.g. DV01, CS01, equity delta)" } },
      { symbol: "\\Delta \\text{Facteur}_k", description: { fr: "Variation observée du facteur de risque k sur la période", en: "The observed change in risk factor k over the period" } },
      { symbol: "\\text{Carry}", description: { fr: "Le gain (ou coût) de portage de la position sur la période, indépendant d'un mouvement de marché", en: "The position's carry gain (or cost) over the period, independent of any market move" } },
      { symbol: "\\text{Inexpliqué}", description: { fr: "La part résiduelle du P&L non attribuable aux facteurs identifiés", en: "The residual P&L portion not attributable to the identified factors" } },
    ],
    assumptions: { fr: "Suppose une décomposition linéaire (sensibilité × variation), qui devient une approximation moins précise pour de grandes variations de marché (effets de convexité non captés). Le résultat inexpliqué doit rester faible par rapport au P&L total pour valider la qualité du modèle d'attribution.", en: "Assumes a linear decomposition (sensitivity × change), which becomes a less precise approximation for large market moves (convexity effects not captured). The unexplained P&L should stay small relative to total P&L to validate the attribution model's quality." },
    units: { fr: "Toutes les contributions en devise, sommées pour retrouver le P&L total.", en: "All contributions in currency, summed to recover the total P&L." },
    example: { fr: "P&L total=−150 000 = Taux(−180 000) + Crédit(+40 000) + Carry(−5 000) + Inexpliqué(−5 000).", en: "Total P&L=−150,000 = Rates(−180,000) + Credit(+40,000) + Carry(−5,000) + Unexplained(−5,000)." },
  },
  calculation: {
    fr: "1) Identifier les facteurs de risque pertinents pour le portefeuille (taux, crédit, actions, change, volatilité...) et la sensibilité de chaque position à chacun. 2) Pour la période considérée, mesurer la variation observée de chaque facteur et multiplier par la sensibilité correspondante pour obtenir chaque contribution. 3) Ajouter le carry et soustraire les coûts de transaction, puis comparer la somme obtenue au P&L total réellement observé : l'écart constitue le résultat inexpliqué.",
    en: "1) Identify the risk factors relevant to the portfolio (rates, credit, equities, FX, volatility...) and each position's sensitivity to each. 2) For the period considered, measure each factor's observed change and multiply by the corresponding sensitivity to get each contribution. 3) Add carry and subtract transaction costs, then compare the resulting sum to the actually observed total P&L: the gap constitutes the unexplained P&L.",
  },
  interpretation: {
    fr: "Un résultat inexpliqué faible et stable dans le temps valide la qualité du modèle d'attribution et des sensibilités utilisées ; un résultat inexpliqué important ou qui augmente doit alerter, car il peut signaler une erreur de valorisation, un facteur de risque non identifié dans le modèle, ou une non-linéarité (convexité) non capturée par une décomposition purement linéaire.",
    en: "A small, time-stable unexplained P&L validates the attribution model's and sensitivities' quality; a large or growing unexplained P&L should raise alarm, as it can signal a valuation error, an unidentified risk factor in the model, or a nonlinearity (convexity) not captured by a purely linear decomposition.",
  },
  pitfalls: {
    fr: "Se satisfaire d'un P&L total positif sans jamais vérifier son attribution, ce qui peut masquer un risque non désiré compensé ponctuellement par un autre facteur favorable. Autre piège : ignorer un résultat inexpliqué croissant au fil du temps, en le considérant comme un simple \"bruit\" statistique alors qu'il peut révéler une erreur systématique de modèle ou de données qui s'aggrave.",
    en: "Being satisfied with a positive total P&L without ever checking its attribution, which can mask an undesired risk momentarily offset by another favorable factor. Another trap: ignoring a growing unexplained P&L over time, treating it as mere statistical \"noise\" when it can reveal a worsening systematic model or data error.",
  },
  keyPoints: {
    fr: [
      "L'attribution décompose le P&L total en contributions par facteur de risque, plus carry, coûts, et un résultat inexpliqué résiduel.",
      "Un résultat inexpliqué faible valide le modèle d'attribution ; un résultat inexpliqué important ou croissant doit alerter.",
      "Les limites de risque plafonnent a priori chaque exposition, en complément de l'attribution a posteriori du P&L.",
    ],
    en: [
      "Attribution breaks total P&L down into contributions by risk factor, plus carry, costs, and a residual unexplained P&L.",
      "A small unexplained P&L validates the attribution model; a large or growing one should raise alarm.",
      "Risk limits cap each exposure upfront, complementing after-the-fact P&L attribution.",
    ],
  },
  advancedDemonstration: {
    fr: "Quand une limite de risque (par exemple une limite de DV01) est approchée ou dépassée, l'action attendue d'un trader n'est pas de l'ignorer, mais de réduire la position concernée (hedge partiel ou total), de demander une dérogation temporaire motivée au risk management, ou de compenser l'exposition par une position inverse sur un instrument corrélé — la limite n'est pas qu'un chiffre administratif, elle déclenche une action concrète. De même, un résultat inexpliqué qui grandit de façon persistante déclenche typiquement un audit du modèle de valorisation et des sensibilités utilisées, avant que l'écart ne devienne trop important pour être diagnostiqué a posteriori.",
    en: "When a risk limit (e.g. a DV01 limit) is approached or breached, the expected trader action isn't to ignore it, but to reduce the concerned position (partial or full hedge), request a justified temporary waiver from risk management, or offset the exposure with an inverse position on a correlated instrument — the limit isn't just an administrative figure, it triggers a concrete action. Likewise, a persistently growing unexplained P&L typically triggers an audit of the valuation model and the sensitivities used, before the gap becomes too large to diagnose after the fact.",
  },
};
