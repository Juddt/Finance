import type { LessonContent } from "@/lib/lesson-types";

export const m04MonoMultiCourbe: LessonContent = {
  conceptId: "m04-mono-multi-courbe",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir pricer un swap avec des facteurs d'actualisation et connaître la distinction taux sans risque / taux interbancaire.",
      en: "You need to know how to price a swap with discount factors and the distinction between a risk-free rate and an interbank rate.",
    },
    conceptIds: ["m04-pricing-swap", "m03-taux-sans-risque"],
  },
  glossary: [
    { term: { fr: "Courbe de projection", en: "Projection curve" }, definition: { fr: "La courbe utilisée pour estimer les taux forward futurs de la jambe variable (ex. courbe EURIBOR 3M).", en: "The curve used to estimate the floating leg's future forward rates (e.g. the 3M EURIBOR curve)." } },
    { term: { fr: "Courbe d'actualisation", en: "Discounting curve" }, definition: { fr: "La courbe utilisée pour ramener chaque flux futur à sa valeur d'aujourd'hui (ex. courbe OIS, jugée plus proche du taux sans risque).", en: "The curve used to bring each future flow back to today's value (e.g. the OIS curve, seen as closer to the risk-free rate)." } },
  ],
  intuition: {
    fr: "Avant 2008, on utilisait une seule courbe de taux pour tout faire : estimer les taux variables futurs ET actualiser les flux. La crise financière a révélé que le taux interbancaire (EURIBOR) n'était plus vraiment sans risque, et qu'il fallait séparer les deux usages avec deux courbes différentes.",
    en: "Before 2008, a single rate curve was used for everything: estimating future floating rates AND discounting flows. The financial crisis revealed that the interbank rate (EURIBOR) was no longer really risk-free, and that the two uses needed to be separated with two different curves.",
  },
  definition: {
    fr: "Le cadre mono-courbe (pédagogique, utilisé dans ce cours pour M04-2/M04-3) suppose qu'une seule courbe sert à la fois à projeter les taux forward variables et à actualiser tous les flux. Le cadre multi-courbe, utilisé en pratique, sépare une courbe de projection par indice de taux (ex. une par tenor EURIBOR : 1M, 3M, 6M) d'une courbe d'actualisation unique fondée sur un taux jugé plus proche du sans-risque (OIS, SOFR).",
    en: "The single-curve framework (a teaching simplification, used in this course for M04-2/M04-3) assumes one curve serves both to project floating forward rates and to discount all flows. The multi-curve framework, used in practice, separates a projection curve per rate index (e.g. one per EURIBOR tenor: 1M, 3M, 6M) from a single discounting curve based on a rate seen as closer to risk-free (OIS, SOFR).",
  },
  utility: {
    fr: "Comprendre cette distinction est indispensable pour tout desk de taux moderne : ignorer le cadre multi-courbe conduit à des prix de swaps et de dérivés de taux systématiquement faux depuis la crise de 2008, l'écart entre courbes (le \"basis\") étant loin d'être négligeable en période de tension.",
    en: "Understanding this distinction is essential for any modern rates desk: ignoring the multi-curve framework leads to systematically wrong prices for swaps and rate derivatives since the 2008 crisis, since the gap between curves (the \"basis\") is far from negligible in stressed periods.",
  },
  example: {
    fr: "Un swap notionnel 10 000 000 € verse dans 1 an un flux net de (EURIBOR 1 an projeté 3,2% − taux fixe 3%) × notionnel = 20 000 €. En cadre MONO-courbe (on actualise aussi avec 3,2%) : DF=1/1,032≈0,96899, valeur≈20 000×0,96899≈19 380 €. En cadre MULTI-courbe (on actualise avec le taux OIS 1 an, plus bas, 2,8%, jugé plus proche du sans-risque) : DF=1/1,028≈0,97276, valeur≈20 000×0,97276≈19 455 €. L'écart (≈75 € ici, sur UN SEUL flux à 1 an) semble faible, mais il se cumule sur chaque flux d'un swap à 10 ou 30 ans, et explose en période de stress : en 2008, le spread EURIBOR-OIS est monté à plus de 200 points de base (contre 40pb dans notre exemple), ce qui aurait rendu l'écart de valorisation totalement significatif.",
    en: "A €10,000,000 notional swap pays in 1 year a net flow of (projected 1-year EURIBOR 3.2% − 3% fixed rate) × notional = €20,000. Under the SINGLE-curve framework (also discounting at 3.2%): DF=1/1.032≈0.96899, value≈20,000×0.96899≈€19,380. Under the MULTI-curve framework (discounting at the lower 1-year OIS rate, 2.8%, seen as closer to risk-free): DF=1/1.028≈0.97276, value≈20,000×0.97276≈€19,455. The gap (≈€75 here, on a SINGLE 1-year flow) looks small, but it compounds across every flow of a 10- or 30-year swap, and explodes in stress periods: in 2008, the EURIBOR-OIS spread rose above 200 basis points (versus 40bp in our example), which would have made the valuation gap fully material.",
  },
  alternativeExplanation: {
    fr: "Pensez à deux thermomètres différents pour deux usages différents : l'un mesure \"à quel taux les banques se prêtent entre elles pour de vrai\" (EURIBOR, utile pour projeter les futurs coupons variables d'un swap indexé dessus), l'autre mesure \"le taux le plus proche du sans-risque disponible\" (OIS, utile pour actualiser n'importe quel flux, quel que soit l'indice sur lequel il est calculé). Utiliser le mauvais thermomètre pour le mauvais usage donne une mesure biaisée.",
    en: "Think of two different thermometers for two different jobs: one measures \"at what rate banks actually lend to each other\" (EURIBOR, useful for projecting a swap's future floating coupons indexed on it), the other measures \"the closest available rate to risk-free\" (OIS, useful for discounting any flow, whatever index it is computed on). Using the wrong thermometer for the wrong job gives a biased reading.",
  },
  formula: {
    latex: "V_{\\text{multi-courbe}} = \\sum_t DF^{\\text{OIS}}_t \\times \\text{Notionnel} \\times (f^{\\text{EURIBOR}}_t - R_{\\text{fixe}}) \\times \\delta_t",
    variables: [
      { symbol: "DF^{\\text{OIS}}_t", description: { fr: "Facteur d'actualisation issu de la courbe OIS (collatéral)", en: "Discount factor from the OIS (collateral) curve" } },
      { symbol: "f^{\\text{EURIBOR}}_t", description: { fr: "Taux forward projeté depuis la courbe EURIBOR pour la période t", en: "Forward rate projected from the EURIBOR curve for period t" } },
    ],
    assumptions: { fr: "Suppose un swap collatéralisé en cash rémunéré au taux OIS (cas standard depuis les accords de collatéralisation post-crise).", en: "Assumes a swap collateralized in cash remunerated at the OIS rate (the standard case since post-crisis collateral agreements)." },
    units: { fr: "V en unités monétaires ; taux en proportion annuelle.", en: "V in currency units; rates as annual proportions." },
    example: { fr: "f=3,2% (EURIBOR 1 an projeté), R_fixe=3%, notionnel=10 000 000€ → flux net=20 000€. DF^OIS=1/1,028≈0,97276 → V_multi≈19 455€, contre V_mono≈19 380€ avec DF^EURIBOR=1/1,032≈0,96899 — un écart de ≈75€ sur ce seul flux.", en: "f=3.2% (projected 1-year EURIBOR), R_fixed=3%, notional=€10,000,000 → net flow=€20,000. DF^OIS=1/1.028≈0.97276 → V_multi≈€19,455, versus V_mono≈€19,380 with DF^EURIBOR=1/1.032≈0.96899 — a ≈€75 gap on this single flow." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Maturité (années)", en: "Maturity (years)" },
    yLabel: { fr: "Taux (%)", en: "Rate (%)" },
    series: [
      {
        label: { fr: "Courbe OIS (actualisation)", en: "OIS curve (discounting)" },
        points: [
          { x: 0.25, y: 2.5 },
          { x: 0.5, y: 2.6 },
          { x: 1, y: 2.8 },
          { x: 2, y: 3.0 },
          { x: 5, y: 3.3 },
        ],
      },
      {
        label: { fr: "Courbe EURIBOR (projection)", en: "EURIBOR curve (projection)" },
        points: [
          { x: 0.25, y: 2.7 },
          { x: 0.5, y: 2.85 },
          { x: 1, y: 3.2 },
          { x: 2, y: 3.4 },
          { x: 5, y: 3.7 },
        ],
      },
    ],
  },
  calculation: {
    fr: "1) Calibrer séparément la courbe de projection (à partir d'instruments EURIBOR : dépôts, FRA, swaps EURIBOR) et la courbe d'actualisation (à partir d'instruments OIS). 2) Projeter chaque taux forward f_t depuis la courbe de projection appropriée au tenor de l'indice : ici f_1an=3,2%. 3) Actualiser chaque flux avec les DF de la courbe OIS, pas ceux de la courbe de projection : DF^OIS_1an=1/1,028≈0,97276. 4) Sommer pour obtenir la valeur du swap : 20 000€×0,97276≈19 455€, à comparer aux ≈19 380€ obtenus (à tort) en actualisant avec la courbe EURIBOR elle-même.",
    en: "1) Calibrate separately the projection curve (from EURIBOR instruments: deposits, FRAs, EURIBOR swaps) and the discounting curve (from OIS instruments). 2) Project each forward rate f_t from the projection curve matching the index's tenor: here f_1yr=3.2%. 3) Discount each flow with the OIS curve's DFs, not the projection curve's: DF^OIS_1yr=1/1.028≈0.97276. 4) Sum to get the swap's value: €20,000×0.97276≈€19,455, versus the ≈€19,380 obtained (wrongly) by discounting with the EURIBOR curve itself.",
  },
  interpretation: {
    fr: "L'écart entre courbe de projection et courbe d'actualisation (le \"basis\") capture un risque de crédit et de liquidité implicite du marché interbancaire, distinct du risque de taux pur. Ignorer cet écart revient à prétendre que prêter à une banque non collatéralisée est aussi sûr que prêter au jour le jour avec collatéral — une hypothèse que le marché a rejetée depuis 2008.",
    en: "The gap between the projection curve and the discounting curve (the \"basis\") captures an implicit credit and liquidity risk of the interbank market, distinct from pure rate risk. Ignoring this gap amounts to assuming that lending to an uncollateralized bank is as safe as lending overnight with collateral — an assumption the market has rejected since 2008.",
  },
  pitfalls: {
    fr: "Utiliser la courbe de projection pour actualiser (ou l'inverse) : c'est l'erreur classique qui définissait encore le cadre mono-courbe avant 2008. Autre piège : oublier qu'il existe UNE courbe de projection PAR TENOR (1M, 3M, 6M ne sont pas interchangeables), car le basis entre tenors reflète lui aussi un risque de liquidité différent.",
    en: "Using the projection curve to discount (or vice versa): the classic mistake that still defined the single-curve framework before 2008. Another trap: forgetting there is ONE projection curve PER TENOR (1M, 3M, 6M are not interchangeable), since the basis between tenors also reflects a different liquidity risk.",
  },
  keyPoints: {
    fr: [
      "Mono-courbe (simplification pédagogique) : une seule courbe pour projeter et actualiser.",
      "Multi-courbe (pratique de marché) : une courbe de projection par tenor d'indice, une courbe OIS pour actualiser.",
      "L'écart entre les courbes (le basis) reflète un risque de crédit/liquidité interbancaire, révélé par la crise de 2008.",
    ],
    en: [
      "Single-curve (teaching simplification): one curve for both projecting and discounting.",
      "Multi-curve (market practice): one projection curve per index tenor, one OIS curve for discounting.",
      "The gap between curves (the basis) reflects interbank credit/liquidity risk, revealed by the 2008 crisis.",
    ],
  },
  advancedDemonstration: {
    fr: "La transition post-LIBOR (voir M03-7) complexifie encore ce cadre : les nouveaux taux de référence (SOFR, €STR) étant eux-mêmes des taux garantis au jour le jour, ils tendent à devenir à la fois la référence de projection ET d'actualisation pour les nouveaux swaps, réduisant partiellement (sans l'éliminer) le besoin de double courbe pour les produits les plus récents — tout en le conservant pleinement pour les produits encore indexés sur d'anciens taux IBOR résiduels ou sur des tenors multiples.",
    en: "The post-LIBOR transition (see M03-7) further complicates this framework: since the new reference rates (SOFR, €STR) are themselves secured overnight rates, they tend to become both the projection AND discounting reference for new swaps, partially reducing (without eliminating) the need for dual curves on the newest products — while fully preserving it for products still indexed on residual legacy IBOR rates or multiple tenors.",
  },
  businessApplication: {
    fr: "Tout système de valorisation d'un desk taux (front-office comme risk management) doit être construit dès l'origine avec un cadre multi-courbe : un système hérité qui n'actualiserait qu'avec une seule courbe produirait un biais de prix systématique sur chaque swap, visible a posteriori dans un écart de P&L quotidien inexpliqué (voir M13, attribution du P&L) ou dans une divergence avec les appels de marge réellement exigés par la contrepartie ou la CCP.",
    en: "Any rates desk valuation system (front-office or risk management) must be built from the ground up with a multi-curve framework: a legacy system discounting with only one curve would produce a systematic price bias on every swap, visible after the fact as an unexplained daily P&L gap (see M13, P&L attribution) or as a mismatch with the margin actually demanded by the counterparty or the CCP.",
  },
  interviewQuestion: {
    question: "Why do banks discount a EURIBOR-indexed swap's cash flows using the OIS curve rather than the EURIBOR curve itself?",
    answer: "Because discounting and projection answer two different questions. Projection asks 'what floating rate will actually be paid', which is exactly what the EURIBOR curve is built to forecast. Discounting asks 'what is the fair value today of a future flow', which requires a rate close to risk-free — and EURIBOR embeds unsecured interbank credit and liquidity risk that isn't truly risk-free, especially visible when the EURIBOR-OIS spread widened past 200 basis points in 2008. Since most swaps today are collateralized in cash remunerated at the OIS rate, OIS is also the rate that actually reflects the cost of funding that collateral, making it the economically correct discount rate. Using EURIBOR for both would systematically misprice the swap, with the error growing with maturity and with how wide the EURIBOR-OIS basis is at the time.",
  },
};
