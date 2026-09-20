import { randomInt, pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

const comprehensionTemplate = mcqTemplate({
  id: "m13-backtesting-var-comprehension",
  conceptId: "m13-backtesting-var",
  difficulty: "medium",
  prompt: {
    fr: "Que signifie une \"exception\" (breach) dans le backtesting d'une VaR ?",
    en: "What does an \"exception\" (breach) mean in VaR backtesting?",
  },
  choices: [
    { id: "loss-exceeds-predicted-var", label: { fr: "Un jour où la perte réellement observée dépasse la VaR prédite pour ce jour-là", en: "A day when the actually observed loss exceeds the VaR predicted for that day" } },
    { id: "any-day-with-a-loss", label: { fr: "N'importe quel jour où le portefeuille enregistre une perte, quelle que soit son ampleur", en: "Any day the portfolio records a loss, whatever its size" } },
    { id: "a-day-model-is-recalibrated", label: { fr: "Un jour où le modèle de VaR est recalibré par l'équipe de risque", en: "A day the VaR model is recalibrated by the risk team" } },
    { id: "a-day-limit-is-breached", label: { fr: "Un jour où une limite de risque (comme le DV01) est dépassée, sans rapport avec la VaR elle-même", en: "A day a risk limit (like DV01) is breached, unrelated to VaR itself" } },
  ],
  correctId: "loss-exceeds-predicted-var",
  hint: { fr: "L'exception compare la perte RÉELLEMENT observée à la VaR PRÉDITE, pas n'importe quelle perte.", en: "An exception compares the ACTUALLY observed loss to the PREDICTED VaR, not just any loss." },
  explanation: {
    fr: "Une exception désigne spécifiquement un jour où la perte réelle dépasse la VaR prédite pour ce même jour : ce n'est ni n'importe quelle perte (même petite), ni un recalibrage de modèle, ni un dépassement d'une limite de risque distincte comme le DV01 — c'est précisément l'écart entre la prédiction statistique et la réalité observée qui constitue une exception.",
    en: "An exception specifically designates a day when the actual loss exceeds the VaR predicted for that same day: it is neither any loss (even a small one), nor a model recalibration, nor a breach of a distinct risk limit like DV01 — it is precisely the gap between the statistical prediction and the observed reality that constitutes an exception.",
  },
  commonMistake: {
    fr: "Confondre une exception de VaR avec n'importe quelle perte du portefeuille, en oubliant qu'elle nécessite spécifiquement un dépassement de la VaR prédite ce jour-là.",
    en: "Confusing a VaR exception with any portfolio loss, forgetting it specifically requires exceeding the VaR predicted that day.",
  },
});

const expectedVsObservedComparisonTemplate = mcqTemplate({
  id: "m13-backtesting-var-comparaison-attendu-observe",
  conceptId: "m13-backtesting-var",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi le backtesting compare-t-il le nombre d'exceptions observées à un nombre théorique \"attendu\", plutôt que de simplement viser zéro exception ?",
    en: "Why does backtesting compare the number of observed exceptions to a theoretical \"expected\" number, rather than simply aiming for zero exceptions?",
  },
  choices: [
    { id: "var-designed-to-be-exceeded-sometimes", label: { fr: "Une VaR à un niveau de confiance donné (par exemple 99%) est par construction censée être dépassée une fraction connue du temps (1% des jours) ; zéro exception signalerait une VaR trop conservatrice, pas un modèle parfait", en: "A VaR at a given confidence level (e.g. 99%) is by construction meant to be exceeded a known fraction of the time (1% of days); zero exceptions would signal an overly conservative VaR, not a perfect model" } },
    { id: "zero-exceptions-always-ideal", label: { fr: "Zéro exception serait toujours l'objectif idéal, et tout modèle qui en produit ne serait pas bien calibré", en: "Zero exceptions would always be the ideal goal, and any model producing some wouldn't be well calibrated" } },
    { id: "expected-number-purely-arbitrary", label: { fr: "Le nombre attendu est purement arbitraire, sans lien avec le niveau de confiance choisi pour la VaR", en: "The expected number is purely arbitrary, with no link to the VaR's chosen confidence level" } },
    { id: "exceptions-always-indicate-error", label: { fr: "Toute exception observée indique nécessairement une erreur dans le modèle, quel que soit leur nombre total", en: "Any observed exception necessarily indicates a model error, whatever their total number" } },
  ],
  correctId: "var-designed-to-be-exceeded-sometimes",
  hint: { fr: "Une VaR à 99% est censée être dépassée environ 1% du temps PAR DÉFINITION : viser zéro exception contredirait cette définition même.", en: "A 99% VaR is meant to be exceeded about 1% of the time BY DEFINITION: aiming for zero exceptions would contradict that very definition." },
  explanation: {
    fr: "Une VaR à un niveau de confiance de 99% est par construction censée être dépassée environ 1% du temps si le modèle est bien calibré : viser zéro exception contredirait la définition même de la VaR et signalerait un modèle excessivement conservateur (immobilisant inutilement du capital), pas un modèle parfait. Le nombre attendu découle directement du niveau de confiance choisi, et une seule exception isolée ne suffit généralement pas à conclure à une erreur du modèle.",
    en: "A 99%-confidence VaR is by construction meant to be exceeded about 1% of the time if the model is well calibrated: aiming for zero exceptions would contradict VaR's very definition and would signal an excessively conservative model (needlessly tying up capital), not a perfect one. The expected number directly follows from the chosen confidence level, and a single isolated exception generally isn't enough to conclude the model is flawed.",
  },
  commonMistake: {
    fr: "Croire qu'un modèle de VaR idéal ne devrait jamais produire d'exception, en ignorant que le niveau de confiance choisi implique par construction un nombre attendu d'exceptions non nul.",
    en: "Believing an ideal VaR model should never produce an exception, ignoring that the chosen confidence level by construction implies a nonzero expected number of exceptions.",
  },
});

const tooFewExceptionsWhatIfTemplate = mcqTemplate({
  id: "m13-backtesting-var-what-if-trop-peu-exceptions",
  conceptId: "m13-backtesting-var",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk backteste sa VaR à 99% sur 250 jours et ne compte aucune exception sur toute la période, alors qu'environ 2,5 étaient attendues. Comment interpréter ce résultat ?",
    en: "A desk backtests its 99% VaR over 250 days and counts zero exceptions over the entire period, when about 2.5 were expected. How should this result be interpreted?",
  },
  choices: [
    { id: "possibly-overconservative-var", label: { fr: "Cela peut signaler une VaR trop conservatrice (surestimant le risque), immobilisant potentiellement du capital réglementaire sans bénéfice de sécurité proportionné", en: "This can signal an overly conservative VaR (overestimating risk), potentially tying up regulatory capital with no proportionate safety benefit" } },
    { id: "unambiguously-ideal-result", label: { fr: "C'est un résultat sans ambiguïté idéal, prouvant que le modèle de VaR est parfaitement calibré", en: "This is an unambiguously ideal result, proving the VaR model is perfectly calibrated" } },
    { id: "impossible-outcome", label: { fr: "Ce résultat est statistiquement impossible et signale nécessairement une erreur de calcul dans le backtesting lui-même", en: "This result is statistically impossible and necessarily signals a calculation error in the backtesting itself" } },
    { id: "irrelevant-to-model-quality", label: { fr: "Ce résultat n'a aucun rapport avec la qualité du modèle de VaR, le nombre d'exceptions étant purement aléatoire", en: "This result has no bearing on the VaR model's quality, the number of exceptions being purely random" } },
  ],
  correctId: "possibly-overconservative-var",
  hint: { fr: "Le nombre ATTENDU sous calibration parfaite est 2,5 : un écart important en dessous de cette attente est-il forcément une bonne nouvelle ?", en: "The EXPECTED number under perfect calibration is 2.5: is a large shortfall below that expectation necessarily good news?" },
  explanation: {
    fr: "Un nombre d'exceptions nettement inférieur au nombre attendu (0 contre 2,5 attendues) peut signaler une VaR trop conservatrice, qui surestime systématiquement le risque réel : ce n'est pas nécessairement un résultat \"idéal\", car une VaR trop élevée immobilise du capital réglementaire de façon disproportionnée par rapport au risque réellement porté — ce résultat n'est ni statistiquement impossible, ni sans rapport avec la qualité du modèle.",
    en: "A number of exceptions markedly below the expected number (0 vs 2.5 expected) can signal an overly conservative VaR, systematically overestimating the real risk: this is not necessarily an \"ideal\" result, since too high a VaR ties up regulatory capital disproportionately to the risk actually carried — this result is neither statistically impossible, nor unrelated to the model's quality.",
  },
  commonMistake: {
    fr: "Considérer automatiquement zéro exception comme le meilleur résultat possible, en ignorant qu'un écart important sous le nombre attendu peut signaler une VaR trop conservatrice et coûteuse.",
    en: "Automatically considering zero exceptions as the best possible outcome, ignoring that a large shortfall below the expected number can signal an overly conservative, costly VaR.",
  },
});

const clusteredExceptionsWhatIfTemplate = mcqTemplate({
  id: "m13-backtesting-var-what-if-exceptions-groupees",
  conceptId: "m13-backtesting-var",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Deux modèles de VaR produisent chacun exactement 6 exceptions sur 250 jours. Le premier les répartit uniformément sur l'année ; le second les concentre toutes sur une seule semaine de forte volatilité. Ces deux résultats sont-ils équivalents ?",
    en: "Two VaR models each produce exactly 6 exceptions over 250 days. The first spreads them uniformly across the year; the second concentrates them all within a single high-volatility week. Are these two results equivalent?",
  },
  choices: [
    { id: "clustering-signals-different-problem", label: { fr: "Non : le regroupement des exceptions (clustering) sur le second modèle signale probablement une incapacité à s'adapter rapidement à un changement de régime de volatilité, un problème distinct d'un simple sous-comptage global", en: "No: the clustering of exceptions on the second model likely signals an inability to quickly adapt to a volatility regime change, a problem distinct from a simple overall undercount" } },
    { id: "identical-since-same-total-count", label: { fr: "Oui, ces deux résultats sont parfaitement équivalents, seul le total de 6 exceptions comptant pour le cadre de Bâle", en: "Yes, these two results are perfectly equivalent, only the total of 6 exceptions mattering for the Basel framework" } },
    { id: "clustered-always-better", label: { fr: "Le second modèle est en réalité préférable, car les exceptions concentrées sont plus faciles à expliquer que des exceptions dispersées", en: "The second model is actually preferable, since clustered exceptions are easier to explain than spread-out ones" } },
    { id: "clustering-only-matters-below-threshold", label: { fr: "Le regroupement des exceptions n'a d'importance que si leur nombre total dépasse la zone rouge de Bâle", en: "Exception clustering only matters if their total number exceeds the Basel red zone" } },
  ],
  correctId: "clustering-signals-different-problem",
  hint: { fr: "Le simple comptage du cadre de Bâle traite les deux cas de façon identique, mais une analyse plus fine du TIMING des exceptions révèle-t-elle la même chose dans les deux cas ?", en: "The Basel framework's simple count treats both cases identically, but does a finer analysis of exceptions' TIMING reveal the same thing in both cases?" },
  explanation: {
    fr: "Bien que le simple comptage de Bâle traite ces deux résultats de façon identique (6 exceptions chacun), le regroupement temporel des exceptions du second modèle (clustering) signale probablement un problème différent et potentiellement plus grave : une incapacité du modèle à s'adapter rapidement à un changement de régime de volatilité, ce qu'un décompte global uniforme ne révèle pas — ce n'est ni équivalent, ni préférable, et cette dimension temporelle reste pertinente quel que soit le total, pas seulement en zone rouge.",
    en: "Although Basel's simple count treats these two results identically (6 exceptions each), the second model's temporal clustering of exceptions likely signals a different, potentially more serious problem: an inability of the model to quickly adapt to a volatility regime change, which a uniform overall count doesn't reveal — this is neither equivalent nor preferable, and this temporal dimension remains relevant whatever the total, not only in the red zone.",
  },
  commonMistake: {
    fr: "Considérer deux résultats de backtesting avec un même total d'exceptions comme équivalents, en ignorant que leur répartition dans le temps peut révéler des problèmes de modèle très différents.",
    en: "Considering two backtesting results with the same exception total as equivalent, ignoring that their distribution over time can reveal very different model problems.",
  },
});

const expectedExceptionsCalcTemplate: QuestionTemplate = {
  id: "m13-backtesting-var-calcul-exceptions-attendues",
  conceptId: "m13-backtesting-var",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const confidenceLevel = pick(rng, [95, 97.5, 99] as const);
    const testDays = pick(rng, [250, 500] as const);
    const correctExpected = Math.round(((100 - confidenceLevel) / 100) * testDays * 10) / 10;
    const wrongUsesConfidenceDirectly = Math.round((confidenceLevel / 100) * testDays * 10) / 10;
    const wrongForgetsDays = (100 - confidenceLevel) / 100;
    const wrongDoubled = Math.round(correctExpected * 2 * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Une VaR est calculée à un niveau de confiance de ${confidenceLevel}%, backtestée sur ${testDays} jours. Combien d'exceptions sont attendues sous une calibration parfaite du modèle ?`,
        en: `A VaR is computed at a ${confidenceLevel}% confidence level, backtested over ${testDays} days. How many exceptions are expected under perfect model calibration?`,
      },
      choices: [
        { id: "correct", label: { fr: `${correctExpected}, en multipliant (100% − niveau de confiance) par le nombre de jours`, en: `${correctExpected}, by multiplying (100% − confidence level) by the number of days` } },
        { id: "wrong-uses-confidence-directly", label: { fr: `${wrongUsesConfidenceDirectly}, en multipliant à tort le niveau de confiance lui-même par le nombre de jours`, en: `${wrongUsesConfidenceDirectly}, by wrongly multiplying the confidence level itself by the number of days` } },
        { id: "wrong-forgets-days", label: { fr: `${wrongForgetsDays}, en oubliant de multiplier par le nombre de jours de la période de test`, en: `${wrongForgetsDays}, forgetting to multiply by the test period's number of days` } },
        { id: "wrong-doubled", label: { fr: `${wrongDoubled}, en doublant le résultat correct par erreur`, en: `${wrongDoubled}, mistakenly doubling the correct result` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Nombre attendu = (100% − niveau de confiance) × nombre de jours de test.", en: "Expected number = (100% − confidence level) × number of test days." },
      explanation: {
        fr: `Nombre attendu = (100% − ${confidenceLevel}%) × ${testDays} = ${(100 - confidenceLevel) / 100} × ${testDays} = ${correctExpected}. Utiliser directement le niveau de confiance au lieu de son complément (100% moins le niveau de confiance), ou oublier de multiplier par le nombre de jours, sont des erreurs fréquentes sur ce calcul.`,
        en: `Expected number = (100% − ${confidenceLevel}%) × ${testDays} = ${(100 - confidenceLevel) / 100} × ${testDays} = ${correctExpected}. Directly using the confidence level instead of its complement (100% minus the confidence level), or forgetting to multiply by the number of days, are frequent errors on this calculation.`,
      },
      commonMistake: {
        fr: "Utiliser directement le niveau de confiance de la VaR au lieu de son complément (100% moins le niveau de confiance) pour calculer le nombre d'exceptions attendues.",
        en: "Directly using the VaR's confidence level instead of its complement (100% minus the confidence level) to compute the expected number of exceptions.",
      },
    };
  },
};

const zoneClassificationCalcTemplate: QuestionTemplate = {
  id: "m13-backtesting-var-calcul-classification-zone",
  conceptId: "m13-backtesting-var",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenarios = [
      { exceptions: 3, zone: "verte", zoneEn: "green", reasoning: "proche du nombre attendu (environ 2,5) sur une VaR à 99% et 250 jours", reasoningEn: "close to the expected number (about 2.5) for a 99% VaR over 250 days" },
      { exceptions: 7, zone: "jaune", zoneEn: "yellow", reasoning: "nettement supérieur au nombre attendu (environ 2,5), sans atteindre le seuil le plus critique", reasoningEn: "markedly above the expected number (about 2.5), without reaching the most critical threshold" },
      { exceptions: 12, zone: "rouge", zoneEn: "red", reasoning: "très nettement supérieur au nombre attendu (environ 2,5), signalant un modèle probablement mal calibré", reasoningEn: "very markedly above the expected number (about 2.5), signaling a probably poorly calibrated model" },
    ] as const;
    const s = pick(rng, scenarios);
    const wrongZones = (["verte", "jaune", "rouge"] as const).filter((z) => z !== s.zone);
    const wrongZonesEn: Record<string, string> = { verte: "green", jaune: "yellow", rouge: "red" };

    return {
      isScenario: true,
      prompt: {
        fr: `Une banque compte ${s.exceptions} exceptions sur 250 jours pour sa VaR à 99% (nombre attendu ≈ 2,5). Selon le cadre de Bâle (zones indicatives : verte jusqu'à 4, jaune de 5 à 9, rouge à partir de 10), dans quelle zone se situe le modèle ?`,
        en: `A bank counts ${s.exceptions} exceptions over 250 days for its 99% VaR (expected number ≈ 2.5). Under the Basel framework (indicative zones: green up to 4, yellow 5 to 9, red from 10), which zone does the model fall in?`,
      },
      choices: [
        { id: "correct", label: { fr: `Zone ${s.zone}, car le nombre d'exceptions est ${s.reasoning}`, en: `${s.zoneEn.charAt(0).toUpperCase() + s.zoneEn.slice(1)} zone, since the exception count is ${s.reasoningEn}` } },
        { id: "wrong-1", label: { fr: `Zone ${wrongZones[0]}, en appliquant le mauvais seuil de classification`, en: `${wrongZonesEn[wrongZones[0]].charAt(0).toUpperCase() + wrongZonesEn[wrongZones[0]].slice(1)} zone, by applying the wrong classification threshold` } },
        { id: "wrong-2", label: { fr: `Zone ${wrongZones[1]}, en appliquant le mauvais seuil de classification`, en: `${wrongZonesEn[wrongZones[1]].charAt(0).toUpperCase() + wrongZonesEn[wrongZones[1]].slice(1)} zone, by applying the wrong classification threshold` } },
        { id: "wrong-no-zone", label: { fr: `Aucune zone ne peut être déterminée sans connaître également le niveau de VaR en devise`, en: `No zone can be determined without also knowing the VaR level in currency` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Compare le nombre d'exceptions aux seuils indicatifs donnés (verte ≤4, jaune 5-9, rouge ≥10).", en: "Compare the exception count to the given indicative thresholds (green ≤4, yellow 5-9, red ≥10)." },
      explanation: {
        fr: `Avec ${s.exceptions} exceptions sur 250 jours, le modèle se classe en zone ${s.zone} selon les seuils indicatifs donnés : la classification par zone dépend uniquement du NOMBRE d'exceptions comparé au nombre attendu et aux seuils réglementaires, pas du niveau de VaR en devise lui-même.`,
        en: `With ${s.exceptions} exceptions over 250 days, the model classifies into the ${s.zoneEn} zone under the given indicative thresholds: zone classification depends only on the NUMBER of exceptions compared to the expected number and the regulatory thresholds, not on the VaR level in currency itself.`,
      },
      commonMistake: {
        fr: "Appliquer le mauvais seuil de classification, ou croire que le niveau de VaR en devise est nécessaire pour déterminer la zone, alors que seul le nombre d'exceptions compte.",
        en: "Applying the wrong classification threshold, or believing the VaR level in currency is needed to determine the zone, when only the exception count matters.",
      },
    };
  },
};

const confidenceLevelMistakeTemplate = mcqTemplate({
  id: "m13-backtesting-var-erreur-niveau-confiance",
  conceptId: "m13-backtesting-var",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un analyste compare directement le nombre d'exceptions d'une VaR à 95% à celui d'une VaR à 99%, sur la même période de 250 jours, sans tenir compte de la différence de niveau de confiance. Quel est le risque de cette comparaison ?",
    en: "An analyst directly compares the exception count of a 95% VaR to that of a 99% VaR, over the same 250-day period, without accounting for the confidence level difference. What is the risk of this comparison?",
  },
  choices: [
    { id: "different-expected-baselines", label: { fr: "Une VaR à 95% a un nombre d'exceptions ATTENDU bien plus élevé (environ 12,5) qu'une VaR à 99% (environ 2,5) : les comparer directement sans ajuster pour cette différence fausse le jugement sur la qualité relative des deux modèles", en: "A 95% VaR has a far higher EXPECTED exception count (about 12.5) than a 99% VaR (about 2.5): comparing them directly without adjusting for this difference distorts the judgment on the two models' relative quality" } },
    { id: "no-risk-same-period", label: { fr: "Aucun risque : utiliser la même période de 250 jours pour les deux garantit une comparaison directement valide", en: "No risk: using the same 250-day period for both guarantees a directly valid comparison" } },
    { id: "confidence-level-irrelevant-to-count", label: { fr: "Le niveau de confiance n'a par nature aucune influence sur le nombre d'exceptions attendu d'un modèle", en: "The confidence level has by nature no influence on a model's expected exception count" } },
    { id: "only-99-percent-var-is-meaningful", label: { fr: "Seule une VaR à 99% est réellement significative ; une VaR à 95% ne devrait jamais être backtestée", en: "Only a 99% VaR is truly meaningful; a 95% VaR should never be backtested" } },
  ],
  correctId: "different-expected-baselines",
  hint: { fr: "Le nombre d'exceptions ATTENDU dépend directement du niveau de confiance : une VaR à 95% \"attend\" naturellement bien plus d'exceptions qu'une VaR à 99%.", en: "The EXPECTED exception count directly depends on the confidence level: a 95% VaR naturally \"expects\" far more exceptions than a 99% one." },
  explanation: {
    fr: "Une VaR à 95% attend environ 12,5 exceptions sur 250 jours (5% × 250), contre seulement 2,5 pour une VaR à 99% (1% × 250) : comparer directement le nombre brut d'exceptions des deux modèles sans tenir compte de cette différence de référence fausse totalement le jugement sur leur qualité relative — le niveau de confiance influence directement le nombre attendu, et les deux niveaux de VaR peuvent être légitimement backtestés, chacun avec son propre nombre attendu de référence.",
    en: "A 95% VaR expects about 12.5 exceptions over 250 days (5% × 250), versus only 2.5 for a 99% VaR (1% × 250): directly comparing the raw exception counts of both models without accounting for this baseline difference totally distorts the judgment on their relative quality — the confidence level directly influences the expected number, and both VaR levels can legitimately be backtested, each with its own reference expected number.",
  },
  commonMistake: {
    fr: "Comparer directement le nombre brut d'exceptions de modèles de VaR à des niveaux de confiance différents, sans ajuster pour leurs nombres attendus respectifs très différents.",
    en: "Directly comparing the raw exception count of VaR models at different confidence levels, without adjusting for their very different respective expected numbers.",
  },
});

const riskManagerActionScenarioTemplate = mcqTemplate({
  id: "m13-backtesting-var-scenario-action-risk-manager",
  conceptId: "m13-backtesting-var",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le backtesting d'un desk place son modèle de VaR en zone rouge du cadre de Bâle sur les 250 derniers jours. Quelle est la réaction attendue du risk management ?",
    en: "A desk's backtesting places its VaR model in the Basel framework's red zone over the last 250 days. What is the expected risk management reaction?",
  },
  choices: [
    { id: "investigate-and-recalibrate", label: { fr: "Investiguer les causes du nombre élevé d'exceptions et recalibrer ou remplacer le modèle, avec potentiellement une majoration réglementaire de capital en attendant", en: "Investigate the causes of the high exception count and recalibrate or replace the model, with a potential regulatory capital surcharge in the meantime" } },
    { id: "ignore-if-portfolio-profitable", label: { fr: "Ignorer ce classement si le portefeuille reste globalement profitable sur la période", en: "Ignore this classification if the portfolio remains overall profitable over the period" } },
    { id: "increase-confidence-level-to-fix", label: { fr: "Simplement augmenter le niveau de confiance affiché de la VaR (par exemple de 99% à 99,9%) pour réduire mécaniquement le nombre d'exceptions futures sans autre changement", en: "Simply raise the VaR's displayed confidence level (e.g. from 99% to 99.9%) to mechanically reduce future exceptions with no other change" } },
    { id: "red-zone-has-no-consequence", label: { fr: "La zone rouge du cadre de Bâle n'a aucune conséquence pratique, il s'agit d'une simple classification informative", en: "The Basel framework's red zone has no practical consequence, it's a purely informative classification" } },
  ],
  correctId: "investigate-and-recalibrate",
  hint: { fr: "La zone rouge signale un modèle probablement mal calibré : la réponse appropriée s'attaque-t-elle à la CAUSE du problème ou se contente-t-elle de masquer le symptôme ?", en: "The red zone signals a probably poorly calibrated model: does the appropriate response address the CAUSE of the problem or merely mask the symptom?" },
  explanation: {
    fr: "Un classement en zone rouge appelle une investigation sérieuse des causes du nombre élevé d'exceptions et une recalibration ou un remplacement du modèle de VaR, avec des conséquences réglementaires réelles (majoration de capital potentielle) : le profit global du portefeuille sur la période ne rend pas ce problème sans importance (le modèle peut sous-estimer un risque qui ne s'est pas encore matérialisé pleinement), et simplement relever artificiellement le niveau de confiance affiché sans corriger le modèle sous-jacent ne résout rien sur le fond.",
    en: "A red-zone classification calls for a serious investigation of the high exception count's causes and a recalibration or replacement of the VaR model, with real regulatory consequences (potential capital surcharge): the portfolio's overall profitability over the period doesn't make this problem unimportant (the model may underestimate a risk that hasn't fully materialized yet), and simply artificially raising the displayed confidence level without fixing the underlying model solves nothing substantively.",
  },
  commonMistake: {
    fr: "Traiter un classement en zone rouge comme sans conséquence pratique dès lors que le portefeuille reste profitable, en ignorant que le modèle sous-jacent sous-estime probablement le risque réel.",
    en: "Treating a red-zone classification as having no practical consequence as long as the portfolio stays profitable, ignoring that the underlying model probably underestimates the real risk.",
  },
});

const singleExceptionMistakeTemplate = mcqTemplate({
  id: "m13-backtesting-var-erreur-exception-isolee",
  conceptId: "m13-backtesting-var",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un modèle de VaR à 99% produit sa toute première exception après 80 jours sans aucune, sur une période de test encore en cours. Un analyste conclut immédiatement que le modèle est cassé et doit être abandonné. Ce jugement est-il fondé ?",
    en: "A 99% VaR model produces its very first exception after 80 exception-free days, over a still-ongoing test period. An analyst immediately concludes the model is broken and must be scrapped. Is this judgment sound?",
  },
  choices: [
    { id: "premature-single-exception-expected", label: { fr: "Non : une seule exception, même isolée, reste globalement cohérente avec le nombre attendu sur une VaR à 99% (environ 1 exception attendue sur 80-100 jours), et la période de test n'est pas encore terminée", en: "No: a single exception, even isolated, remains broadly consistent with the expected number for a 99% VaR (about 1 exception expected over 80-100 days), and the test period isn't over yet" } },
    { id: "correct-any-exception-proves-broken", label: { fr: "Oui, la moindre exception observée prouve définitivement qu'un modèle de VaR est cassé et doit être immédiatement remplacé", en: "Yes, the slightest observed exception definitively proves a VaR model is broken and must be immediately replaced" } },
    { id: "should-have-zero-exceptions-ever", label: { fr: "Oui, un bon modèle de VaR à 99% ne devrait jamais produire la moindre exception, quelle que soit la durée du test", en: "Yes, a good 99% VaR model should never produce a single exception, whatever the test's duration" } },
    { id: "exception-count-irrelevant-before-250-days", label: { fr: "Le jugement est prématuré, mais uniquement parce que le nombre d'exceptions n'a strictement aucune signification avant d'atteindre exactement 250 jours", en: "The judgment is premature, but only because the exception count has strictly no meaning before exactly reaching 250 days" } },
  ],
  correctId: "premature-single-exception-expected",
  hint: { fr: "Une VaR à 99% \"attend\" environ 1 exception tous les 100 jours : une exception après 80 jours est-elle anormale ou globalement conforme à l'attente ?", en: "A 99% VaR \"expects\" about 1 exception every 100 days: is one exception after 80 days abnormal or broadly consistent with expectation?" },
  explanation: {
    fr: "Une seule exception après 80 jours reste globalement cohérente avec le nombre attendu pour une VaR à 99% (environ 0,8 exception attendue sur 80 jours) : conclure immédiatement que le modèle est cassé sur la base d'une exception isolée, avant même la fin de la période de test standard (250 jours), est prématuré et statistiquement infondé — un bon modèle de VaR à 99% N'EST PAS censé produire zéro exception, l'absence totale d'exceptions étant elle-même un signal potentiellement préoccupant (VaR trop conservatrice).",
    en: "A single exception after 80 days remains broadly consistent with the expected number for a 99% VaR (about 0.8 exceptions expected over 80 days): immediately concluding the model is broken based on an isolated exception, before even the end of the standard test period (250 days), is premature and statistically unfounded — a good 99% VaR model is NOT meant to produce zero exceptions, total absence of exceptions being itself a potentially concerning signal (overly conservative VaR).",
  },
  commonMistake: {
    fr: "Conclure qu'un modèle de VaR est cassé dès la première exception observée, en ignorant qu'un certain nombre d'exceptions est statistiquement attendu et normal, et que la période de test standard n'est pas encore écoulée.",
    en: "Concluding a VaR model is broken upon the very first observed exception, ignoring that a certain number of exceptions is statistically expected and normal, and that the standard test period hasn't elapsed yet.",
  },
});

const varVsEsBacktestingComparisonTemplate = mcqTemplate({
  id: "m13-backtesting-var-comparaison-backtesting-var-es",
  conceptId: "m13-backtesting-var",
  difficulty: "hard",
  prompt: {
    fr: "Pourquoi le backtesting de l'Expected Shortfall (ES) est-il généralement considéré plus difficile à mettre en œuvre que celui de la VaR ?",
    en: "Why is Expected Shortfall (ES) backtesting generally considered harder to implement than VaR backtesting?",
  },
  choices: [
    { id: "es-requires-averaging-tail-not-just-threshold", label: { fr: "La VaR ne teste qu'un simple dépassement de seuil (perte > VaR, oui ou non), tandis que l'ES nécessite d'évaluer la MOYENNE des pertes au-delà de ce seuil, une quantité plus difficile à vérifier statistiquement avec peu d'observations extrêmes", en: "VaR only tests a simple threshold breach (loss > VaR, yes or no), while ES requires assessing the AVERAGE of losses beyond that threshold, a harder quantity to statistically verify with few extreme observations" } },
    { id: "es-backtesting-actually-easier", label: { fr: "En réalité, le backtesting de l'ES est plus simple que celui de la VaR, car il ne nécessite aucun comptage d'exceptions", en: "In reality, ES backtesting is simpler than VaR backtesting, since it requires no exception counting" } },
    { id: "es-cannot-be-backtested-at-all", label: { fr: "L'ES ne peut par nature jamais faire l'objet d'un backtesting, quelle que soit la méthode statistique employée", en: "ES can by nature never be backtested, whatever the statistical method used" } },
    { id: "difficulty-unrelated-to-tail-averaging", label: { fr: "La difficulté ne vient pas de la nature de l'ES lui-même, mais uniquement d'un manque historique d'outils informatiques adaptés", en: "The difficulty doesn't come from ES's own nature, but only from a historical lack of suitable computing tools" } },
  ],
  correctId: "es-requires-averaging-tail-not-just-threshold",
  hint: { fr: "La VaR teste un simple OUI/NON (seuil dépassé ou non) ; l'ES nécessite d'estimer une MOYENNE sur un petit nombre d'observations extrêmes — laquelle est statistiquement plus facile à vérifier ?", en: "VaR tests a simple YES/NO (threshold breached or not); ES requires estimating an AVERAGE over a small number of extreme observations — which is statistically easier to verify?" },
  explanation: {
    fr: "Le backtesting de la VaR se limite à une question binaire simple (la perte a-t-elle dépassé le seuil, oui ou non), facilement comptabilisable jour après jour ; l'ES, en revanche, est définie comme la MOYENNE des pertes au-delà de ce seuil, une quantité qui nécessite d'observer suffisamment de pertes extrêmes pour être estimée de façon fiable — un défi statistique réel puisque, par définition, les pertes extrêmes sont rares, rendant le backtesting de l'ES nettement plus complexe que celui, plus direct, de la VaR (mais pas impossible, contrairement à ce qu'affirme une des options).",
    en: "VaR backtesting boils down to a simple binary question (did the loss exceed the threshold, yes or no), easily tallied day after day; ES, in contrast, is defined as the AVERAGE of losses beyond that threshold, a quantity requiring enough extreme loss observations to be reliably estimated — a real statistical challenge since, by definition, extreme losses are rare, making ES backtesting markedly more complex than VaR's more direct one (but not impossible, contrary to what one option claims).",
  },
  commonMistake: {
    fr: "Croire que le backtesting de l'ES suit exactement la même logique de simple comptage d'exceptions que celui de la VaR, en ignorant la difficulté supplémentaire liée à l'estimation d'une moyenne de queue de distribution.",
    en: "Believing ES backtesting follows the exact same simple exception-counting logic as VaR's, ignoring the extra difficulty tied to estimating a tail-average.",
  },
});

const inSampleOutOfSampleScenarioTemplate = mcqTemplate({
  id: "m13-backtesting-var-scenario-in-sample-out-of-sample",
  conceptId: "m13-backtesting-var",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une équipe calibre son modèle de VaR sur les données des deux dernières années, puis le backteste en comptant les exceptions sur ces MÊMES deux années déjà utilisées pour la calibration. Quel est le problème de cette approche ?",
    en: "A team calibrates its VaR model on the last two years of data, then backtests it by counting exceptions over those SAME two years already used for calibration. What is the problem with this approach?",
  },
  choices: [
    { id: "in-sample-overstates-quality", label: { fr: "Le modèle est testé sur les données mêmes qui ont servi à le calibrer (\"in-sample\"), ce qui tend à surestimer sa qualité réelle par rapport à un test sur des données hors échantillon (\"out-of-sample\") jamais vues par la calibration", en: "The model is tested on the very data used to calibrate it (\"in-sample\"), which tends to overstate its real quality compared to a test on out-of-sample data never seen during calibration" } },
    { id: "no-problem-more-data-always-better", label: { fr: "Aucun problème, utiliser davantage de données pour le test, même identiques à celles de calibration, ne peut qu'améliorer la fiabilité du backtesting", en: "No problem, using more data for the test, even identical to the calibration data, can only improve backtesting reliability" } },
    { id: "problem-only-with-short-periods", label: { fr: "Ce problème ne se pose que pour des périodes de calibration très courtes, jamais pour des périodes de deux ans", en: "This problem only arises for very short calibration periods, never for two-year periods" } },
    { id: "calibration-and-testing-always-separate-by-law", label: { fr: "Ce scénario est en réalité impossible, la réglementation imposant toujours une séparation stricte entre données de calibration et de test", en: "This scenario is actually impossible, regulation always imposing a strict separation between calibration and test data" } },
  ],
  correctId: "in-sample-overstates-quality",
  hint: { fr: "Tester un modèle sur les données mêmes qui ont servi à le \"régler\" tend à le faire paraître meilleur qu'il ne l'est réellement sur des données nouvelles.", en: "Testing a model on the very data used to \"tune\" it tends to make it look better than it really is on new data." },
  explanation: {
    fr: "Backtester un modèle sur les mêmes données que celles utilisées pour sa calibration (test \"in-sample\") tend structurellement à surestimer sa qualité réelle, puisque le modèle a été ajusté précisément pour bien coller à ces données : un test rigoureux devrait idéalement utiliser des données \"out-of-sample\", non vues lors de la calibration, pour évaluer honnêtement la capacité du modèle à généraliser à des situations futures — ce problème n'est pas limité aux courtes périodes, et la réglementation ne garantit pas automatiquement cette séparation dans toutes les pratiques.",
    en: "Backtesting a model on the same data used for its calibration (an \"in-sample\" test) structurally tends to overstate its real quality, since the model was precisely tuned to fit that data well: a rigorous test should ideally use \"out-of-sample\" data, unseen during calibration, to honestly assess the model's ability to generalize to future situations — this problem isn't limited to short periods, and regulation doesn't automatically guarantee this separation in all practices.",
  },
  commonMistake: {
    fr: "Tester un modèle de VaR sur les mêmes données que celles utilisées pour le calibrer, en surestimant ainsi sa qualité réelle de prédiction sur des données futures.",
    en: "Testing a VaR model on the same data used to calibrate it, thus overstating its real predictive quality on future data.",
  },
});

const overUnderEstimateRatioCalcTemplate: QuestionTemplate = {
  id: "m13-backtesting-var-calcul-ratio-sur-sous-estimation",
  conceptId: "m13-backtesting-var",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const expected = 2.5;
    const observed = pick(rng, [1, 2, 5, 8, 10] as const);
    const correctRatio = Math.round((observed / expected) * 100) / 100;
    const wrongInverted = Math.round((expected / observed) * 100) / 100;
    const wrongDifference = observed - expected;
    const wrongPercent = Math.round(((observed - expected) / expected) * 100);

    return {
      isScenario: true,
      prompt: {
        fr: `Une VaR à 99% sur 250 jours attend théoriquement 2,5 exceptions, et le backtesting en observe réellement ${observed}. Quel est le ratio observé/attendu ?`,
        en: `A 99% VaR over 250 days theoretically expects 2.5 exceptions, and backtesting actually observes ${observed}. What is the observed/expected ratio?`,
      },
      choices: [
        { id: "correct", label: { fr: `${correctRatio}, en divisant le nombre observé par le nombre attendu`, en: `${correctRatio}, by dividing the observed number by the expected number` } },
        { id: "wrong-inverted", label: { fr: `${wrongInverted}, en divisant à tort le nombre attendu par le nombre observé`, en: `${wrongInverted}, by wrongly dividing the expected number by the observed number` } },
        { id: "wrong-difference-as-ratio", label: { fr: `${wrongDifference}, en confondant la différence (observé − attendu) avec un ratio`, en: `${wrongDifference}, confusing the difference (observed − expected) with a ratio` } },
        { id: "wrong-percent-as-ratio", label: { fr: `${wrongPercent}, en confondant un pourcentage d'écart avec le ratio lui-même`, en: `${wrongPercent}, confusing a percentage gap with the ratio itself` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Ratio observé/attendu = Nombre d'exceptions observées ÷ Nombre d'exceptions attendues.", en: "Observed/expected ratio = Number of observed exceptions ÷ Number of expected exceptions." },
      explanation: {
        fr: `Ratio = ${observed} / 2,5 = ${correctRatio}. Un ratio proche de 1 signale un modèle bien calibré ; un ratio nettement supérieur à 1 signale une VaR sous-estimée, un ratio nettement inférieur à 1 signale une VaR surestimée. Confondre ce ratio avec une simple différence ou l'inverser sont des erreurs fréquentes qui faussent l'interprétation du résultat.`,
        en: `Ratio = ${observed} / 2.5 = ${correctRatio}. A ratio close to 1 signals a well-calibrated model; a ratio markedly above 1 signals an underestimated VaR, a ratio markedly below 1 signals an overestimated VaR. Confusing this ratio with a simple difference or inverting it are frequent errors that distort the result's interpretation.`,
      },
      commonMistake: {
        fr: "Confondre le ratio observé/attendu avec une simple différence entre les deux nombres, ou inverser le numérateur et le dénominateur.",
        en: "Confusing the observed/expected ratio with a simple difference between the two numbers, or swapping numerator and denominator.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  expectedVsObservedComparisonTemplate,
  tooFewExceptionsWhatIfTemplate,
  clusteredExceptionsWhatIfTemplate,
  expectedExceptionsCalcTemplate,
  zoneClassificationCalcTemplate,
  confidenceLevelMistakeTemplate,
  riskManagerActionScenarioTemplate,
  singleExceptionMistakeTemplate,
  varVsEsBacktestingComparisonTemplate,
  inSampleOutOfSampleScenarioTemplate,
  overUnderEstimateRatioCalcTemplate,
];
