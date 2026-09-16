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
    fr: "Avant 2008, la courbe EURIBOR servait à tout : actualiser et projeter, l'écart avec un taux \"vraiment\" sans risque étant jugé négligeable (quelques points de base). Pendant la crise, le spread EURIBOR-OIS (Euribor-OIS spread) est monté à plus de 200 points de base : utiliser encore l'EURIBOR pour actualiser aurait sous-estimé le risque de contrepartie implicite dans ce taux, et donc mal pricé les swaps collatéralisés.",
    en: "Before 2008, the EURIBOR curve was used for everything: discounting and projecting, with the gap to a \"truly\" risk-free rate seen as negligible (a few basis points). During the crisis, the EURIBOR-OIS spread rose above 200 basis points: still using EURIBOR to discount would have understated the counterparty risk implicit in that rate, and so mispriced collateralized swaps.",
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
    example: { fr: "Même structure que M04-3, mais DF issus de la courbe OIS et f issus de la courbe EURIBOR 3M — deux courbes distinctes calibrées séparément sur leurs instruments de marché respectifs.", en: "Same structure as M04-3, but DF from the OIS curve and f from the 3M EURIBOR curve — two distinct curves calibrated separately on their respective market instruments." },
  },
  calculation: {
    fr: "1) Calibrer séparément la courbe de projection (à partir d'instruments EURIBOR : dépôts, FRA, swaps EURIBOR) et la courbe d'actualisation (à partir d'instruments OIS). 2) Projeter chaque taux forward f_t depuis la courbe de projection appropriée au tenor de l'indice. 3) Actualiser chaque flux avec les DF de la courbe OIS, pas ceux de la courbe de projection. 4) Sommer pour obtenir la valeur du swap.",
    en: "1) Calibrate separately the projection curve (from EURIBOR instruments: deposits, FRAs, EURIBOR swaps) and the discounting curve (from OIS instruments). 2) Project each forward rate f_t from the projection curve matching the index's tenor. 3) Discount each flow with the OIS curve's DFs, not the projection curve's. 4) Sum to get the swap's value.",
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
};
