import type { LessonContent } from "@/lib/lesson-types";

export const m13BacktestingVar: LessonContent = {
  conceptId: "m13-backtesting-var",
  prerequisiteReminder: {
    text: {
      fr: "Il faut comprendre la définition de la VaR, de l'Expected Shortfall et des stress tests, présentés dans la notion précédente de ce chapitre.",
      en: "You need to understand the definition of VaR, Expected Shortfall and stress tests, covered in the previous concept of this chapter.",
    },
    conceptIds: ["m13-var-es-stress"],
  },
  glossary: [
    { term: { fr: "Exception (breach)", en: "Exception (breach)" }, definition: { fr: "Un jour où la perte réellement observée dépasse la VaR prédite pour ce jour-là.", en: "A day when the actually observed loss exceeds the VaR predicted for that day." } },
    { term: { fr: "Zones de Bâle (feu tricolore)", en: "Basel traffic-light zones" }, definition: { fr: "Le cadre réglementaire de Bâle qui classe un modèle de VaR en zone verte, jaune ou rouge selon le nombre d'exceptions observées sur 250 jours de test.", en: "The Basel regulatory framework that classifies a VaR model into a green, yellow or red zone based on the number of exceptions observed over 250 test days." } },
  ],
  intuition: {
    fr: "Un modèle de VaR n'est qu'une estimation statistique : rien ne garantit a priori qu'il prédit correctement la fréquence réelle des pertes importantes. Le backtesting consiste précisément à vérifier cette promesse statistique a posteriori, en comptant combien de fois la perte réelle a dépassé la VaR prédite, et en comparant ce nombre à ce que le modèle aurait dû produire s'il était parfaitement calibré.",
    en: "A VaR model is only a statistical estimate: nothing guarantees upfront it correctly predicts the real frequency of large losses. Backtesting is precisely about verifying this statistical promise after the fact, by counting how many times the actual loss exceeded the predicted VaR, and comparing this count to what the model should have produced if perfectly calibrated.",
  },
  definition: {
    fr: "Le backtesting de la VaR consiste à comparer, jour après jour sur une période de test (typiquement 250 jours ouvrés, soit environ un an), la perte réellement observée à la VaR prédite ce jour-là. Chaque jour où la perte dépasse la VaR constitue une exception (breach). Le cadre réglementaire de Bâle classe le modèle en zone verte, jaune ou rouge selon le nombre d'exceptions observées sur 250 jours : une VaR à 99% devrait théoriquement produire environ 2,5 exceptions sur 250 jours (1% × 250) si le modèle est parfaitement calibré.",
    en: "VaR backtesting consists of comparing, day by day over a test period (typically 250 business days, roughly a year), the actually observed loss to the VaR predicted that day. Each day the loss exceeds the VaR constitutes an exception (breach). The Basel regulatory framework classifies the model into a green, yellow or red zone based on the number of exceptions observed over 250 days: a 99% VaR should theoretically produce about 2.5 exceptions over 250 days (1% × 250) if the model is perfectly calibrated.",
  },
  utility: {
    fr: "Sans backtesting, un modèle de VaR n'est qu'une hypothèse non vérifiée : le backtesting permet de détecter un modèle mal calibré (trop d'exceptions signalant une VaR sous-estimée, dangereuse ; trop peu d'exceptions signalant une VaR surestimée, coûteuse en capital immobilisé inutilement) avant que cette erreur ne cause des dégâts réels. Les régulateurs bancaires exigent d'ailleurs ce backtesting régulier, avec des conséquences directes sur les exigences de capital du modèle interne d'une banque.",
    en: "Without backtesting, a VaR model is only an unverified hypothesis: backtesting allows detecting a poorly calibrated model (too many exceptions signaling an underestimated, dangerous VaR; too few exceptions signaling an overestimated VaR, needlessly costly in tied-up capital) before this error causes real damage. Banking regulators indeed require this regular backtesting, with direct consequences on a bank's internal model capital requirements.",
  },
  example: {
    fr: "Une banque backteste sa VaR à 99% sur les 250 derniers jours ouvrés et compte 6 exceptions (jours où la perte réelle a dépassé la VaR prédite). Le nombre attendu sous calibration parfaite est d'environ 2,5 exceptions (1% × 250) : avec 6 exceptions, le modèle se situe dans la zone jaune du cadre de Bâle, signalant une VaR probablement sous-estimée qui nécessite une révision, sans pour autant déclencher automatiquement les pénalités de capital les plus sévères réservées à la zone rouge.",
    en: "A bank backtests its 99% VaR over the last 250 business days and counts 6 exceptions (days when the actual loss exceeded the predicted VaR). The expected number under perfect calibration is about 2.5 exceptions (1% × 250): with 6 exceptions, the model falls in the Basel framework's yellow zone, signaling a probably underestimated VaR requiring review, without automatically triggering the most severe capital penalties reserved for the red zone.",
  },
  alternativeExplanation: {
    fr: "Imaginez une prévision météo qui annonce \"1% de risque de tempête violente chaque jour\" : sur un an (365 jours), on attendrait environ 3-4 tempêtes violentes si la prévision est bien calibrée. Si l'on en observe 15, la prévision sous-estime clairement le risque ; si l'on n'en observe aucune sur plusieurs années, elle le surestime probablement. Le backtesting de la VaR applique exactement cette logique de vérification statistique aux pertes financières.",
    en: "Picture a weather forecast announcing \"1% risk of severe storm each day\": over a year (365 days), one would expect about 3-4 severe storms if the forecast is well calibrated. If 15 are observed, the forecast clearly underestimates the risk; if none are observed over several years, it probably overestimates it. VaR backtesting applies exactly this statistical verification logic to financial losses.",
  },
  formula: {
    latex: "\\begin{aligned} N_{attendu} &= (1 - \\text{niveau de confiance}) \\times N_{jours} \\\\ \\text{Zone} &= f(N_{exceptions observées}, N_{attendu}) \\end{aligned}",
    variables: [
      { symbol: "N_{attendu}", description: { fr: "Nombre d'exceptions attendu sous une calibration parfaite du modèle", en: "The expected number of exceptions under a perfectly calibrated model" } },
      { symbol: "N_{jours}", description: { fr: "Nombre de jours de la période de backtesting (typiquement 250)", en: "The number of days in the backtesting period (typically 250)" } },
      { symbol: "N_{exceptions observées}", description: { fr: "Nombre d'exceptions réellement comptées sur la période", en: "The number of exceptions actually counted over the period" } },
    ],
    assumptions: { fr: "Suppose des observations indépendantes et un modèle statique sur la période de test ; en pratique, les exceptions ont tendance à se regrouper (clustering) lors de périodes de forte volatilité, ce qui complique l'interprétation d'un simple comptage.", en: "Assumes independent observations and a static model over the test period; in practice, exceptions tend to cluster during high-volatility periods, which complicates interpreting a simple count." },
    units: { fr: "Nombre d'exceptions sans unité (entier).", en: "Number of exceptions unitless (integer)." },
    example: { fr: "VaR 99%, 250 jours → N_attendu=2,5. 6 exceptions observées → zone jaune (Bâle).", en: "99% VaR, 250 days → N_expected=2.5. 6 observed exceptions → yellow zone (Basel)." },
  },
  calculation: {
    fr: "1) Sur la période de test (typiquement 250 jours ouvrés), comparer chaque jour la perte réellement réalisée à la VaR prédite pour ce jour. 2) Compter le nombre de jours où la perte dépasse la VaR : c'est le nombre d'exceptions observées. 3) Comparer ce nombre au nombre attendu sous calibration parfaite ((1 − niveau de confiance) × nombre de jours), et situer le résultat dans la zone verte, jaune ou rouge du cadre de Bâle.",
    en: "1) Over the test period (typically 250 business days), compare each day's actually realized loss to that day's predicted VaR. 2) Count the number of days the loss exceeds the VaR: this is the number of observed exceptions. 3) Compare this count to the expected number under perfect calibration ((1 − confidence level) × number of days), and place the result in the Basel framework's green, yellow or red zone.",
  },
  interpretation: {
    fr: "Un nombre d'exceptions proche du nombre attendu confirme une VaR bien calibrée (zone verte) ; un nombre nettement supérieur signale une VaR sous-estimée, dangereuse car elle sous-représente le risque réel (zone jaune ou rouge, avec des majorations de capital réglementaire potentielles) ; un nombre nettement inférieur signale à l'inverse une VaR trop conservatrice, qui immobilise inutilement du capital sans bénéfice de sécurité supplémentaire proportionné.",
    en: "A number of exceptions close to the expected number confirms a well-calibrated VaR (green zone); a markedly higher number signals an underestimated VaR, dangerous because it under-represents the real risk (yellow or red zone, with potential regulatory capital surcharges); a markedly lower number conversely signals an overly conservative VaR, which needlessly ties up capital with no proportionate additional safety benefit.",
  },
  pitfalls: {
    fr: "Se contenter d'un simple comptage d'exceptions sans regarder leur répartition dans le temps : des exceptions qui se regroupent (clustering) lors d'une seule période de crise, plutôt que d'être uniformément réparties, peuvent signaler un problème différent (modèle incapable de s'adapter rapidement à un changement de régime de volatilité) qu'un simple total sur 250 jours ne révèle pas. Autre piège : juger un modèle uniquement sur son nombre d'exceptions sans tenir compte du niveau de confiance utilisé (une VaR à 95% génère naturellement bien plus d'exceptions attendues qu'une VaR à 99%).",
    en: "Settling for a simple exception count without looking at their distribution over time: exceptions that cluster during a single crisis period, rather than being uniformly spread, can signal a different problem (a model unable to adapt quickly to a volatility regime change) that a simple 250-day total doesn't reveal. Another trap: judging a model solely on its exception count without accounting for the confidence level used (a 95% VaR naturally generates far more expected exceptions than a 99% one).",
  },
  keyPoints: {
    fr: [
      "Le backtesting compare, jour par jour, la perte réellement observée à la VaR prédite, comptant les exceptions (jours où la perte dépasse la VaR).",
      "Le cadre de Bâle classe le modèle en zone verte/jaune/rouge selon le nombre d'exceptions sur 250 jours, comparé au nombre attendu sous calibration parfaite.",
      "Trop d'exceptions signale une VaR sous-estimée (dangereuse) ; trop peu signale une VaR surestimée (coûteuse en capital).",
    ],
    en: [
      "Backtesting compares, day by day, the actually observed loss to the predicted VaR, counting exceptions (days the loss exceeds the VaR).",
      "The Basel framework classifies the model into a green/yellow/red zone based on the number of exceptions over 250 days, compared to the expected number under perfect calibration.",
      "Too many exceptions signals an underestimated (dangerous) VaR; too few signals an overestimated (capital-costly) VaR.",
    ],
  },
  advancedDemonstration: {
    fr: "Le clustering des exceptions (leur regroupement dans le temps, plutôt qu'une répartition uniforme) est un signal souvent plus riche que leur simple comptage total : un modèle de VaR statique, qui ne s'ajuste pas rapidement à un changement de régime de volatilité (comme lors d'une crise soudaine), produira typiquement plusieurs exceptions consécutives en quelques jours, suivies d'une longue période sans aucune exception — un pattern très différent de 6 exceptions uniformément réparties sur 250 jours, bien que le total final puisse être identique dans les deux cas. Les tests statistiques avancés de backtesting (au-delà du simple comptage du cadre de Bâle) intègrent explicitement cette dimension temporelle pour distinguer ces deux situations.",
    en: "Exception clustering (their grouping over time, rather than a uniform spread) is often a richer signal than their simple total count: a static VaR model, which doesn't quickly adjust to a volatility regime change (like a sudden crisis), will typically produce several consecutive exceptions within a few days, followed by a long exception-free period — a pattern very different from 6 exceptions uniformly spread over 250 days, even though the final total could be identical in both cases. Advanced backtesting statistical tests (beyond the Basel framework's simple count) explicitly incorporate this temporal dimension to distinguish these two situations.",
  },
};
