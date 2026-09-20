import { randomInt, pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const comprehensionTemplate = mcqTemplate({
  id: "m04-exposition-cva-comprehension",
  conceptId: "m04-exposition-cva",
  difficulty: "medium",
  prompt: {
    fr: "Que représente l'exposition future attendue (EFA) d'un dérivé bilatéral ?",
    en: "What does a bilateral derivative's expected future exposure (EFE) represent?",
  },
  choices: [
    { id: "expected-positive-value", label: { fr: "La valeur de marché positive attendue du contrat à une date future, c'est-à-dire ce qu'on perdrait en cas de défaut de la contrepartie à cette date", en: "The contract's expected positive market value at a future date, i.e. what one would lose if the counterparty defaulted at that date" } },
    { id: "total-notional", label: { fr: "Le montant notionnel total du contrat, quelle que soit sa valeur de marché", en: "The contract's total notional amount, whatever its market value" } },
    { id: "issuer-default-probability", label: { fr: "La probabilité de défaut de l'émetteur du sous-jacent du contrat", en: "The default probability of the contract's underlying issuer" } },
    { id: "current-collateral-posted", label: { fr: "Le montant de collatéral actuellement déposé sous l'accord CSA", en: "The amount of collateral currently posted under the CSA agreement" } },
  ],
  correctId: "expected-positive-value",
  hint: { fr: "L'exposition ne concerne que la valeur POSITIVE du contrat pour soi, jamais la valeur négative.", en: "Exposure only concerns the contract's POSITIVE value to oneself, never the negative value." },
  explanation: {
    fr: "L'exposition future attendue isole spécifiquement la valeur POSITIVE attendue du contrat à une date future : c'est le montant qu'on perdrait en cas de défaut de la contrepartie à ce moment précis, puisqu'une valeur négative pour soi ne constitue pas une perte en cas de défaut. Elle ne mesure ni le notionnel, ni le risque de crédit d'un émetteur sous-jacent, ni le collatéral déjà déposé.",
    en: "Expected future exposure specifically isolates the contract's expected POSITIVE value at a future date: it's the amount one would lose if the counterparty defaulted at that exact moment, since a negative value to oneself doesn't constitute a loss upon default. It measures neither the notional, nor an underlying issuer's credit risk, nor collateral already posted.",
  },
  commonMistake: {
    fr: "Confondre l'exposition future attendue avec le notionnel du contrat ou avec sa valeur de marché actuelle sans distinction de signe.",
    en: "Confusing expected future exposure with the contract's notional or with its current market value without distinguishing sign.",
  },
});

const counterpartyVsIssuerRiskComparisonTemplate = mcqTemplate({
  id: "m04-exposition-cva-comparaison-contrepartie-emetteur",
  conceptId: "m04-exposition-cva",
  difficulty: "medium",
  prompt: {
    fr: "En quoi le risque de contrepartie sur un swap diffère-t-il du risque de crédit d'un émetteur obligataire ?",
    en: "How does a swap's counterparty risk differ from a bond issuer's credit risk?",
  },
  choices: [
    { id: "different-party-and-mitigation", label: { fr: "Le premier concerne le partenaire du contrat dérivé lui-même, le second l'émetteur d'un titre détenu ; leurs mécanismes de mitigation diffèrent (collatéral/CSA vs diversification/notation)", en: "The former concerns the derivative contract's partner itself, the latter a held security's issuer; their mitigation mechanisms differ (collateral/CSA vs diversification/rating)" } },
    { id: "identical-risks-different-names", label: { fr: "Ce sont deux noms différents pour exactement le même risque de crédit", en: "These are two different names for exactly the same credit risk" } },
    { id: "counterparty-risk-only-for-bonds", label: { fr: "Le risque de contrepartie ne s'applique qu'aux obligations, jamais aux dérivés", en: "Counterparty risk only applies to bonds, never to derivatives" } },
    { id: "issuer-risk-mitigated-by-csa", label: { fr: "Le risque de crédit d'un émetteur obligataire se couvre également par un accord CSA et des appels de marge", en: "A bond issuer's credit risk is also hedged via a CSA agreement and margin calls" } },
  ],
  correctId: "different-party-and-mitigation",
  hint: { fr: "Qui fait défaut dans chaque cas : le PARTENAIRE du contrat dérivé, ou l'ÉMETTEUR d'un titre détenu ?", en: "Who defaults in each case: the derivative contract's PARTNER, or a held security's ISSUER?" },
  explanation: {
    fr: "Le risque de contrepartie concerne le partenaire du contrat dérivé lui-même (par exemple l'autre banque d'un swap), tandis que le risque de crédit d'un émetteur concerne l'entité ayant émis un titre détenu (une obligation d'entreprise, par exemple) : ce sont deux risques de crédit distincts, avec des outils de mitigation différents — collatéral et accord CSA pour le premier, diversification et suivi de notation pour le second, ce dernier n'étant pas couvert par un CSA.",
    en: "Counterparty risk concerns the derivative contract's partner itself (e.g. the other bank in a swap), while issuer credit risk concerns the entity that issued a held security (a corporate bond, for instance): these are two distinct credit risks, with different mitigation tools — collateral and a CSA agreement for the former, diversification and rating monitoring for the latter, which a CSA does not cover.",
  },
  commonMistake: {
    fr: "Traiter risque de contrepartie et risque de crédit d'un émetteur obligataire comme un seul et même risque, en appliquant les mêmes outils de mitigation aux deux.",
    en: "Treating counterparty risk and a bond issuer's credit risk as a single risk, applying the same mitigation tools to both.",
  },
});

const swapValueFlipsWhatIfTemplate = mcqTemplate({
  id: "m04-exposition-cva-what-if-inversion-valeur",
  conceptId: "m04-exposition-cva",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un swap bilatéral non collatéralisé vaut +5 000 000 EUR pour la banque A aujourd'hui, mais les taux évoluent et sa valeur devient −5 000 000 EUR (toujours pour la banque A) dans six mois. Quel est l'effet sur l'exposition de la banque A à sa contrepartie ?",
    en: "An uncollateralized bilateral swap is worth +EUR 5,000,000 to bank A today, but rates move and its value becomes −EUR 5,000,000 (still to bank A) in six months. What is the effect on bank A's exposure to its counterparty?",
  },
  choices: [
    { id: "exposure-drops-to-zero", label: { fr: "L'exposition de la banque A à sa contrepartie tombe à zéro : une valeur négative pour elle ne peut pas générer de perte en cas de défaut de la contrepartie", en: "Bank A's exposure to its counterparty drops to zero: a negative value to it cannot generate a loss upon counterparty default" } },
    { id: "exposure-stays-five-million", label: { fr: "L'exposition de la banque A reste de 5 000 000 EUR, la valeur absolue du contrat étant seule pertinente", en: "Bank A's exposure stays at EUR 5,000,000, only the contract's absolute value being relevant" } },
    { id: "exposure-becomes-negative", label: { fr: "L'exposition de la banque A devient elle-même négative, ce qui représente un gain potentiel en cas de défaut", en: "Bank A's exposure itself turns negative, which represents a potential gain upon default" } },
    { id: "exposure-unaffected-by-value-sign", label: { fr: "L'exposition ne dépend jamais du signe de la valeur du contrat, uniquement de son notionnel", en: "Exposure never depends on the contract's value sign, only on its notional" } },
  ],
  correctId: "exposure-drops-to-zero",
  hint: { fr: "L'exposition ne retient que la partie POSITIVE de la valeur du contrat : que devient-elle si la valeur passe en négatif ?", en: "Exposure only keeps the POSITIVE part of the contract's value: what happens to it if the value turns negative?" },
  explanation: {
    fr: "L'exposition d'une partie à sa contrepartie ne retient que la valeur positive du contrat pour elle (max(V, 0)) : si la valeur du swap pour la banque A devient négative, son exposition à la contrepartie tombe à zéro, car un défaut de la contrepartie à ce moment-là ne lui ferait perdre aucune valeur positive (elle devrait de toute façon cette somme). L'exposition ne peut jamais devenir elle-même négative.",
    en: "A party's exposure to its counterparty only keeps the contract's positive value to it (max(V, 0)): if the swap's value to bank A turns negative, its exposure to the counterparty drops to zero, since a counterparty default at that point wouldn't cost it any positive value (it would owe that amount regardless). Exposure can never itself turn negative.",
  },
  commonMistake: {
    fr: "Confondre l'exposition avec la valeur absolue du contrat, en ignorant qu'une valeur négative pour soi ramène l'exposition à zéro plutôt qu'à un nombre négatif.",
    en: "Confusing exposure with the contract's absolute value, ignoring that a negative value to oneself brings exposure to zero rather than to a negative number.",
  },
});

const higherDefaultProbWhatIfTemplate = mcqTemplate({
  id: "m04-exposition-cva-what-if-probabilite-defaut",
  conceptId: "m04-exposition-cva",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La probabilité de défaut perçue d'une contrepartie augmente fortement (par exemple suite à une dégradation de notation), l'exposition future attendue du swap restant par ailleurs inchangée. Quel est l'effet sur la CVA ?",
    en: "A counterparty's perceived default probability rises sharply (e.g. following a rating downgrade), the swap's expected future exposure staying otherwise unchanged. What is the effect on CVA?",
  },
  choices: [
    { id: "cva-increases", label: { fr: "La CVA augmente, puisqu'elle est directement proportionnelle à la probabilité de défaut de la contrepartie", en: "CVA increases, since it is directly proportional to the counterparty's default probability" } },
    { id: "cva-unaffected", label: { fr: "La CVA reste inchangée, ne dépendant que de l'exposition future attendue, jamais de la probabilité de défaut", en: "CVA stays unchanged, depending only on expected future exposure, never on default probability" } },
    { id: "cva-decreases", label: { fr: "La CVA diminue, une contrepartie plus risquée réduisant paradoxalement le coût du risque de contrepartie", en: "CVA decreases, a riskier counterparty paradoxically reducing the counterparty risk cost" } },
    { id: "cva-becomes-undefined", label: { fr: "La CVA devient impossible à calculer dès que la probabilité de défaut dépasse son niveau initial", en: "CVA becomes impossible to compute as soon as the default probability exceeds its initial level" } },
  ],
  correctId: "cva-increases",
  hint: { fr: "CVA ≈ (1−R) × Σ EFA × PD : que devient la CVA si PD augmente, toutes choses égales par ailleurs ?", en: "CVA ≈ (1−R) × Σ EFE × PD: what happens to CVA if PD rises, all else equal?" },
  explanation: {
    fr: "La CVA est directement proportionnelle à la probabilité de défaut de la contrepartie (toutes choses égales par ailleurs sur l'exposition et le recouvrement) : une dégradation de notation qui augmente cette probabilité perçue augmente mécaniquement la CVA, reflétant un coût de risque de contrepartie plus élevé — c'est précisément pourquoi la CVA d'un même contrat peut varier dans le temps même si les termes du contrat et les conditions de marché du sous-jacent restent identiques.",
    en: "CVA is directly proportional to the counterparty's default probability (all else equal on exposure and recovery): a rating downgrade that raises this perceived probability mechanically increases CVA, reflecting a higher counterparty risk cost — this is precisely why the CVA of the same contract can vary over time even if the contract's terms and the underlying's market conditions stay identical.",
  },
  commonMistake: {
    fr: "Croire que la CVA ne dépend que de l'exposition future attendue, en ignorant sa dépendance directe à la probabilité de défaut de la contrepartie.",
    en: "Believing CVA depends only on expected future exposure, ignoring its direct dependence on the counterparty's default probability.",
  },
});

const cvaCalcTemplate: QuestionTemplate = {
  id: "m04-exposition-cva-calcul-cva",
  conceptId: "m04-exposition-cva",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const efe = randomInt(rng, 5, 20) * 100_000;
    const pdPercent = randomInt(rng, 1, 5);
    const recoveryPercent = pick(rng, [30, 40, 50] as const);
    const lossGivenDefault = (100 - recoveryPercent) / 100;
    const correctCva = Math.round(efe * (pdPercent / 100) * lossGivenDefault);
    const wrongIgnoresRecovery = Math.round(efe * (pdPercent / 100));
    const wrongIgnoresPd = Math.round(efe * lossGivenDefault);
    const wrongUsesRecoveryNotLgd = Math.round(efe * (pdPercent / 100) * (recoveryPercent / 100));

    return {
      isScenario: true,
      prompt: {
        fr: `Un contrat a une exposition future attendue de ${fmt(efe, "fr")}, une probabilité de défaut de la contrepartie de ${pdPercent}%, et un taux de recouvrement anticipé de ${recoveryPercent}%. Quelle est la CVA approximative ?`,
        en: `A contract has an expected future exposure of ${fmt(efe, "en")}, a counterparty default probability of ${pdPercent}%, and an anticipated recovery rate of ${recoveryPercent}%. What is the approximate CVA?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctCva, "fr")}, en multipliant l'exposition par la probabilité de défaut et par (1 − taux de recouvrement)`, en: `${fmt(correctCva, "en")}, by multiplying exposure by default probability and by (1 − recovery rate)` } },
        { id: "wrong-ignores-recovery", label: { fr: `${fmt(wrongIgnoresRecovery, "fr")}, en oubliant d'ajuster pour le taux de recouvrement anticipé`, en: `${fmt(wrongIgnoresRecovery, "en")}, forgetting to adjust for the anticipated recovery rate` } },
        { id: "wrong-ignores-pd", label: { fr: `${fmt(wrongIgnoresPd, "fr")}, en oubliant de pondérer par la probabilité de défaut`, en: `${fmt(wrongIgnoresPd, "en")}, forgetting to weight by the default probability` } },
        { id: "wrong-uses-recovery-not-lgd", label: { fr: `${fmt(wrongUsesRecoveryNotLgd, "fr")}, en multipliant par le taux de recouvrement au lieu de (1 − taux de recouvrement)`, en: `${fmt(wrongUsesRecoveryNotLgd, "en")}, by multiplying by the recovery rate instead of (1 − recovery rate)` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "CVA ≈ Exposition future attendue × Probabilité de défaut × (1 − Taux de recouvrement).", en: "CVA ≈ Expected future exposure × Default probability × (1 − Recovery rate)." },
      explanation: {
        fr: `CVA ≈ ${fmt(efe, "fr")} × ${pdPercent}% × (1 − ${recoveryPercent}%) = ${fmt(efe, "fr")} × ${pdPercent / 100} × ${lossGivenDefault} ≈ ${fmt(correctCva, "fr")}. Multiplier par le taux de recouvrement au lieu de (1 − taux de recouvrement) est une erreur fréquente : c'est la PERTE en cas de défaut qui compte, pas le montant récupéré.`,
        en: `CVA ≈ ${fmt(efe, "en")} × ${pdPercent}% × (1 − ${recoveryPercent}%) = ${fmt(efe, "en")} × ${pdPercent / 100} × ${lossGivenDefault} ≈ ${fmt(correctCva, "en")}. Multiplying by the recovery rate instead of (1 − recovery rate) is a frequent error: it's the LOSS upon default that matters, not the amount recovered.`,
      },
      commonMistake: {
        fr: "Multiplier par le taux de recouvrement au lieu de (1 − taux de recouvrement), en confondant la perte en cas de défaut avec le montant récupéré.",
        en: "Multiplying by the recovery rate instead of (1 − recovery rate), confusing the loss upon default with the amount recovered.",
      },
    };
  },
};

const positiveOnlyExposureCalcTemplate: QuestionTemplate = {
  id: "m04-exposition-cva-calcul-exposition-positive",
  conceptId: "m04-exposition-cva",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenarioValue = pick(rng, [-3_000_000, -1_000_000, 1_500_000, 2_500_000, 4_000_000] as const);
    const correctExposure = Math.max(scenarioValue, 0);
    const wrongAbsolute = Math.abs(scenarioValue);
    const wrongAlwaysValue = scenarioValue;

    return {
      isScenario: true,
      prompt: {
        fr: `Dans un scénario donné, la valeur de marché du contrat pour la banque est de ${fmt(scenarioValue, "fr")}. Quelle est l'exposition de la banque à sa contrepartie dans ce scénario ?`,
        en: `In a given scenario, the contract's market value to the bank is ${fmt(scenarioValue, "en")}. What is the bank's exposure to its counterparty in this scenario?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctExposure, "fr")}, en ne retenant que la partie positive de la valeur (max avec zéro)`, en: `${fmt(correctExposure, "en")}, by keeping only the positive part of the value (max with zero)` } },
        { id: "wrong-absolute", label: { fr: `${fmt(wrongAbsolute, "fr")}, en prenant la valeur absolue au lieu du maximum avec zéro`, en: `${fmt(wrongAbsolute, "en")}, by taking the absolute value instead of the maximum with zero` } },
        { id: "wrong-always-value", label: { fr: `${fmt(wrongAlwaysValue, "fr")}, en utilisant directement la valeur du contrat sans ajustement`, en: `${fmt(wrongAlwaysValue, "en")}, by directly using the contract's value with no adjustment` } },
        { id: "wrong-zero-always", label: { fr: `0, l'exposition étant par nature toujours nulle sur un contrat bilatéral`, en: `0, exposure being by nature always zero on a bilateral contract` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Exposition = max(Valeur du contrat, 0) : ne retient jamais une valeur négative.", en: "Exposure = max(Contract value, 0): never keeps a negative value." },
      explanation: {
        fr: `Exposition = max(${fmt(scenarioValue, "fr")}, 0) = ${fmt(correctExposure, "fr")}. Une valeur négative pour la banque donne une exposition nulle (elle devrait cette somme, un défaut de la contrepartie ne change rien) ; utiliser la valeur absolue ou la valeur brute sans ajustement sont des erreurs fréquentes qui surestiment l'exposition réelle sur les scénarios de valeur négative.`,
        en: `Exposure = max(${fmt(scenarioValue, "en")}, 0) = ${fmt(correctExposure, "en")}. A negative value to the bank gives zero exposure (it would owe that amount, a counterparty default changes nothing) ; using the absolute value or the raw value with no adjustment are frequent errors that overstate actual exposure on negative-value scenarios.`,
      },
      commonMistake: {
        fr: "Utiliser la valeur absolue du contrat au lieu de sa partie positive uniquement, ce qui surestime l'exposition sur les scénarios de valeur négative.",
        en: "Using the contract's absolute value instead of only its positive part, which overstates exposure on negative-value scenarios.",
      },
    };
  },
};

const cvaAppliesOnlyUncollateralizedMistakeTemplate = mcqTemplate({
  id: "m04-exposition-cva-erreur-collateralise",
  conceptId: "m04-exposition-cva",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un swap est parfaitement collatéralisé sous un accord CSA strict, avec réévaluation et échange de collatéral quotidiens sans seuil ni montant minimum de transfert. Quelle affirmation sur sa CVA résiduelle est la plus juste ?",
    en: "A swap is perfectly collateralized under a strict CSA agreement, with daily revaluation and collateral exchange, no threshold or minimum transfer amount. What statement about its residual CVA is most accurate?",
  },
  choices: [
    { id: "cva-much-lower-not-necessarily-zero", label: { fr: "La CVA résiduelle est fortement réduite par rapport à un contrat non collatéralisé, mais pas nécessairement rigoureusement nulle (délai de réévaluation, risque de collatéral)", en: "Residual CVA is greatly reduced compared to an uncollateralized contract, but not necessarily strictly zero (revaluation lag, collateral risk)" } },
    { id: "cva-identical-to-uncollateralized", label: { fr: "La CVA reste rigoureusement identique à celle d'un contrat non collatéralisé, le collatéral n'ayant aucun effet sur ce risque", en: "CVA stays strictly identical to that of an uncollateralized contract, collateral having no effect on this risk" } },
    { id: "cva-exactly-zero-always", label: { fr: "La CVA devient rigoureusement nulle dans tous les cas dès qu'un accord CSA existe, quels que soient ses termes", en: "CVA becomes strictly zero in all cases as soon as a CSA agreement exists, whatever its terms" } },
    { id: "collateral-increases-cva", label: { fr: "Le collatéral augmente en réalité la CVA, en introduisant un risque opérationnel supplémentaire", en: "Collateral actually increases CVA, by introducing additional operational risk" } },
  ],
  correctId: "cva-much-lower-not-necessarily-zero",
  hint: { fr: "Le collatéral réduit l'exposition RÉSIDUELLE, mais un délai entre réévaluations ou un risque sur le collatéral lui-même peut laisser une exposition non nulle.", en: "Collateral reduces RESIDUAL exposure, but a lag between revaluations or risk on the collateral itself can leave nonzero exposure." },
  explanation: {
    fr: "Un accord CSA strict avec réévaluation fréquente réduit fortement l'exposition résiduelle et donc la CVA, mais ne la ramène pas nécessairement à zéro de façon rigoureuse : un délai entre deux réévaluations, un risque sur la qualité ou la liquidité du collatéral lui-même, ou des frictions opérationnelles peuvent laisser une exposition résiduelle non nulle — le collatéral atténue le risque de contrepartie, il ne l'élimine pas par construction dans tous les cas.",
    en: "A strict CSA agreement with frequent revaluation greatly reduces residual exposure and hence CVA, but doesn't necessarily bring it to strictly zero: a lag between two revaluations, a risk on the collateral's own quality or liquidity, or operational frictions can leave nonzero residual exposure — collateral mitigates counterparty risk, it doesn't eliminate it by construction in all cases.",
  },
  commonMistake: {
    fr: "Croire qu'un accord CSA, même strict, élimine toujours rigoureusement toute CVA résiduelle, en ignorant les délais et risques opérationnels persistants.",
    en: "Believing a CSA agreement, even a strict one, always strictly eliminates all residual CVA, ignoring persisting lags and operational risks.",
  },
});

const bankPricingScenarioTemplate = mcqTemplate({
  id: "m04-exposition-cva-scenario-tarification-banque",
  conceptId: "m04-exposition-cva",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une banque propose un swap identique (mêmes termes, même sous-jacent) à deux contreparties de qualité de crédit très différente, l'une notée AAA, l'autre notée B. Comment la CVA devrait-elle influencer sa tarification ?",
    en: "A bank offers an identical swap (same terms, same underlying) to two counterparties of very different credit quality, one rated AAA, the other rated B. How should CVA influence its pricing?",
  },
  choices: [
    { id: "higher-cva-charge-for-riskier", label: { fr: "La banque devrait intégrer une CVA plus élevée dans le prix proposé à la contrepartie notée B, reflétant sa probabilité de défaut plus élevée", en: "The bank should factor in a higher CVA into the price offered to the B-rated counterparty, reflecting its higher default probability" } },
    { id: "same-price-regardless-of-rating", label: { fr: "La banque devrait proposer rigoureusement le même prix aux deux contreparties, la notation de crédit étant sans rapport avec le pricing d'un swap", en: "The bank should offer strictly the same price to both counterparties, credit rating being unrelated to a swap's pricing" } },
    { id: "lower-cva-for-riskier", label: { fr: "La banque devrait intégrer une CVA plus faible pour la contrepartie notée B, pour compenser son risque de crédit par un prix plus attractif", en: "The bank should factor in a lower CVA for the B-rated counterparty, to offset its credit risk with a more attractive price" } },
    { id: "cva-irrelevant-if-notional-identical", label: { fr: "La CVA ne dépend que du notionnel du swap, identique pour les deux contreparties, donc elle n'a aucun effet différenciant ici", en: "CVA only depends on the swap's notional, identical for both counterparties, so it has no differentiating effect here" } },
  ],
  correctId: "higher-cva-charge-for-riskier",
  hint: { fr: "La CVA dépend directement de la probabilité de défaut DE LA CONTREPARTIE : deux contreparties de notation différente ont des probabilités de défaut différentes.", en: "CVA directly depends on the COUNTERPARTY's default probability: two differently-rated counterparties have different default probabilities." },
  explanation: {
    fr: "Bien que les termes du swap et son sous-jacent soient identiques, la probabilité de défaut de la contrepartie diffère fortement entre une notation AAA et une notation B : la CVA, directement proportionnelle à cette probabilité, doit donc être plus élevée pour la contrepartie notée B, ce qui se traduit par un prix moins avantageux pour elle — un même produit dérivé n'a donc pas la même valeur économique nette selon la contrepartie avec laquelle il est conclu.",
    en: "Although the swap's terms and underlying are identical, the counterparty's default probability differs sharply between an AAA rating and a B rating: CVA, directly proportional to this probability, must therefore be higher for the B-rated counterparty, translating into a less favorable price for it — the same derivative product thus doesn't carry the same net economic value depending on which counterparty it is concluded with.",
  },
  commonMistake: {
    fr: "Croire qu'un même produit dérivé doit toujours être tarifé de façon identique, indépendamment de la qualité de crédit de la contrepartie.",
    en: "Believing the same derivative product must always be priced identically, regardless of the counterparty's credit quality.",
  },
});

const wrongWayRiskMistakeTemplate = mcqTemplate({
  id: "m04-exposition-cva-erreur-wrong-way-risk",
  conceptId: "m04-exposition-cva",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste calcule la CVA d'un contrat en supposant l'exposition future attendue et la probabilité de défaut de la contrepartie totalement indépendantes l'une de l'autre. Or, dans ce cas précis, les deux tendent à augmenter en même temps (par exemple un producteur pétrolier vendant une protection sur son propre secteur). Quel est le risque de cette hypothèse simplificatrice ?",
    en: "An analyst computes a contract's CVA assuming expected future exposure and the counterparty's default probability are fully independent. In this specific case though, the two tend to rise together (e.g. an oil producer selling protection on its own sector). What is the risk of this simplifying assumption?",
  },
  choices: [
    { id: "underestimates-wrong-way-risk", label: { fr: "La CVA calculée sous-estime le risque réel, en ignorant le \"wrong-way risk\" : la corrélation positive entre exposition et probabilité de défaut aggrave la perte attendue", en: "The computed CVA underestimates the real risk, ignoring \"wrong-way risk\": the positive correlation between exposure and default probability worsens the expected loss" } },
    { id: "overestimates-always", label: { fr: "La CVA calculée surestime systématiquement le risque réel dans un tel cas de corrélation positive", en: "The computed CVA systematically overstates the real risk in such a case of positive correlation" } },
    { id: "independence-always-valid", label: { fr: "L'hypothèse d'indépendance reste toujours valide, la corrélation entre exposition et défaut n'ayant aucun effet sur la CVA", en: "The independence assumption always remains valid, correlation between exposure and default having no effect on CVA" } },
    { id: "correlation-only-matters-for-issuer-risk", label: { fr: "Cette corrélation ne concerne que le risque de crédit d'un émetteur obligataire, jamais le risque de contrepartie sur un dérivé", en: "This correlation only concerns a bond issuer's credit risk, never a derivative's counterparty risk" } },
  ],
  correctId: "underestimates-wrong-way-risk",
  hint: { fr: "Si l'exposition tend à être ÉLEVÉE précisément quand la probabilité de défaut est ÉLEVÉE, ignorer ce lien sous-estime ou surestime la perte attendue ?", en: "If exposure tends to be HIGH precisely when default probability is HIGH, does ignoring this link under- or overstate the expected loss?" },
  explanation: {
    fr: "Le \"wrong-way risk\" désigne précisément une corrélation positive défavorable entre l'exposition future attendue et la probabilité de défaut de la contrepartie : quand les deux augmentent ensemble (comme dans l'exemple du producteur pétrolier vendant une protection sur son propre secteur), la formule simplifiée supposant l'indépendance sous-estime la perte attendue réelle, car elle ignore que la perte est plus probable précisément quand l'exposition est la plus forte.",
    en: "\"Wrong-way risk\" precisely refers to an unfavorable positive correlation between expected future exposure and the counterparty's default probability: when both rise together (as in the oil producer example selling protection on its own sector), the simplified formula assuming independence understates the real expected loss, since it ignores that the loss is more likely precisely when exposure is highest.",
  },
  commonMistake: {
    fr: "Appliquer systématiquement l'hypothèse d'indépendance entre exposition et probabilité de défaut, en ignorant le wrong-way risk dans les cas où cette corrélation existe réellement.",
    en: "Systematically applying the independence assumption between exposure and default probability, ignoring wrong-way risk in cases where this correlation genuinely exists.",
  },
});

const nettingAgreementScenarioTemplate = mcqTemplate({
  id: "m04-exposition-cva-scenario-netting",
  conceptId: "m04-exposition-cva",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Deux banques ont conclu plusieurs swaps entre elles : certains ont une valeur positive pour la banque A, d'autres une valeur négative, sous un même accord-cadre ISDA avec clause de compensation globale (netting). Comment cette clause affecte-t-elle l'exposition de la banque A ?",
    en: "Two banks have entered several swaps with each other: some have a positive value to bank A, others a negative value, under the same ISDA master agreement with a netting clause. How does this clause affect bank A's exposure?",
  },
  choices: [
    { id: "netting-reduces-exposure", label: { fr: "L'exposition se calcule sur la somme nette de tous les contrats sous l'accord-cadre, ce qui la réduit généralement par rapport à la somme des expositions positives calculées contrat par contrat", en: "Exposure is computed on the net sum of all contracts under the master agreement, which generally reduces it compared to the sum of exposures computed contract by contract" } },
    { id: "netting-has-no-effect", label: { fr: "La clause de compensation globale n'a aucun effet sur l'exposition, chaque contrat restant évalué indépendamment en cas de défaut", en: "The netting clause has no effect on exposure, each contract remaining independently assessed upon default" } },
    { id: "netting-increases-exposure", label: { fr: "La clause de compensation globale augmente l'exposition, en additionnant les valeurs positives et négatives séparément", en: "The netting clause increases exposure, by adding positive and negative values separately" } },
    { id: "netting-only-affects-collateral-not-exposure", label: { fr: "La clause de compensation globale n'affecte que le calcul du collatéral requis, jamais l'exposition sous-jacente elle-même", en: "The netting clause only affects the required collateral calculation, never the underlying exposure itself" } },
  ],
  correctId: "netting-reduces-exposure",
  hint: { fr: "Sous netting, c'est la somme NETTE de tous les contrats (positifs ET négatifs) qui compte, pas la somme des seules valeurs positives.", en: "Under netting, it's the NET sum of all contracts (positive AND negative) that matters, not the sum of positive values alone." },
  explanation: {
    fr: "Sous une clause de compensation globale (netting) dans un accord-cadre ISDA, l'exposition en cas de défaut se calcule sur la valeur NETTE de l'ensemble des contrats couverts, positifs et négatifs compensés entre eux, plutôt que sur la seule somme des contrats à valeur positive : cela réduit généralement significativement l'exposition totale par rapport à un calcul contrat par contrat, et affecte directement l'exposition elle-même, pas seulement le collatéral requis.",
    en: "Under a netting clause in an ISDA master agreement, exposure upon default is computed on the NET value of all covered contracts, positive and negative offsetting each other, rather than on the sum of positive-value contracts alone: this generally significantly reduces total exposure compared to a contract-by-contract calculation, and directly affects exposure itself, not just the required collateral.",
  },
  commonMistake: {
    fr: "Calculer l'exposition sous un accord-cadre avec netting en additionnant séparément les contrats à valeur positive, sans compenser avec les contrats à valeur négative.",
    en: "Computing exposure under a netting master agreement by separately adding positive-value contracts, without offsetting against negative-value contracts.",
  },
});

const recoveryRateSensitivityCalcTemplate: QuestionTemplate = {
  id: "m04-exposition-cva-calcul-sensibilite-recouvrement",
  conceptId: "m04-exposition-cva",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const efe = randomInt(rng, 5, 15) * 1_000_000;
    const pdPercent = randomInt(rng, 1, 4);
    const recoveryLowPercent = 20;
    const recoveryHighPercent = 60;
    const cvaLow = Math.round(efe * (pdPercent / 100) * (1 - recoveryLowPercent / 100));
    const cvaHigh = Math.round(efe * (pdPercent / 100) * (1 - recoveryHighPercent / 100));
    const correctDirection = "higher";
    const wrongDirection = "lower";
    const wrongUnaffected = "unaffected";

    return {
      isScenario: true,
      prompt: {
        fr: `Deux contreparties de même exposition future attendue et même probabilité de défaut diffèrent uniquement par leur taux de recouvrement anticipé : ${recoveryLowPercent}% pour la première, ${recoveryHighPercent}% pour la seconde. Laquelle des deux affiche la CVA la plus élevée ?`,
        en: `Two counterparties with the same expected future exposure and the same default probability differ only in their anticipated recovery rate: ${recoveryLowPercent}% for the first, ${recoveryHighPercent}% for the second. Which of the two shows the higher CVA?`,
      },
      choices: [
        { id: "correct", label: { fr: `La première (recouvrement ${recoveryLowPercent}%), car une perte en cas de défaut plus élevée (1 − recouvrement) se traduit par une CVA plus élevée`, en: `The first (${recoveryLowPercent}% recovery), because a higher loss given default (1 − recovery) translates into a higher CVA` } },
        { id: "wrong-second-higher", label: { fr: `La seconde (recouvrement ${recoveryHighPercent}%), un recouvrement plus élevé impliquant à tort une CVA plus élevée`, en: `The second (${recoveryHighPercent}% recovery), a higher recovery wrongly implying a higher CVA` } },
        { id: "wrong-equal", label: { fr: `Les deux ont rigoureusement la même CVA, le taux de recouvrement n'ayant par nature aucun effet sur ce calcul`, en: `Both have strictly the same CVA, the recovery rate having by nature no effect on this calculation` } },
        { id: "wrong-cannot-compare", label: { fr: `Il est impossible de comparer les deux CVA sans connaître le notionnel exact de chaque contrat`, en: `It is impossible to compare the two CVAs without knowing each contract's exact notional` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "CVA ≈ EFA × PD × (1 − recouvrement) : un recouvrement plus FAIBLE donne un facteur (1 − recouvrement) plus ÉLEVÉ.", en: "CVA ≈ EFE × PD × (1 − recovery): a LOWER recovery gives a HIGHER (1 − recovery) factor." },
      explanation: {
        fr: `Avec EFA et PD identiques, seul (1 − recouvrement) diffère : (1 − ${recoveryLowPercent}%) = ${(1 - recoveryLowPercent / 100).toFixed(2)} contre (1 − ${recoveryHighPercent}%) = ${(1 - recoveryHighPercent / 100).toFixed(2)}. La première contrepartie, avec le recouvrement le plus faible, affiche donc la CVA la plus élevée (perte en cas de défaut plus importante) : confondre le sens de cette relation est l'erreur la plus fréquente sur ce raisonnement.`,
        en: `With identical EFE and PD, only (1 − recovery) differs: (1 − ${recoveryLowPercent}%) = ${(1 - recoveryLowPercent / 100).toFixed(2)} vs (1 − ${recoveryHighPercent}%) = ${(1 - recoveryHighPercent / 100).toFixed(2)}. The first counterparty, with the lower recovery, thus shows the higher CVA (larger loss given default): confusing this relationship's direction is the most frequent error in this reasoning.`,
      },
      commonMistake: {
        fr: "Croire qu'un taux de recouvrement plus élevé implique une CVA plus élevée, en inversant le sens de la relation entre recouvrement et perte en cas de défaut.",
        en: "Believing a higher recovery rate implies a higher CVA, inverting the direction of the relationship between recovery and loss given default.",
      },
    };
  },
};

const exposureProfileOverTimeComparisonTemplate = mcqTemplate({
  id: "m04-exposition-cva-comparaison-profil-exposition",
  conceptId: "m04-exposition-cva",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi l'exposition future attendue d'un swap de taux n'est-elle généralement pas constante sur toute la durée du contrat, mais suit plutôt un profil qui monte puis redescend ?",
    en: "Why is a rate swap's expected future exposure generally not constant over the contract's life, but instead follows a profile that rises then falls?",
  },
  choices: [
    { id: "two-opposing-effects", label: { fr: "Deux effets opposés se combinent : l'incertitude sur la valeur future du taux augmente avec l'horizon, tandis que le nombre de flux restants (donc la valeur potentielle en jeu) diminue à mesure que l'échéance approche", en: "Two opposing effects combine: uncertainty about the future rate level grows with the horizon, while the number of remaining flows (hence the potential value at stake) shrinks as maturity approaches" } },
    { id: "always-flat-in-practice", label: { fr: "En pratique, ce profil est toujours rigoureusement plat, l'exposition ne dépendant que du notionnel fixe du swap", en: "In practice, this profile is always strictly flat, exposure depending only on the swap's fixed notional" } },
    { id: "only-driven-by-collateral", label: { fr: "Ce profil ne dépend que des règles de collatéral de l'accord CSA, jamais de la structure du swap lui-même", en: "This profile depends only on the CSA agreement's collateral rules, never on the swap's own structure" } },
    { id: "monotonically-increasing-always", label: { fr: "Ce profil est toujours strictement croissant jusqu'à l'échéance, sans jamais redescendre", en: "This profile is always strictly increasing until maturity, never decreasing" } },
  ],
  correctId: "two-opposing-effects",
  hint: { fr: "Un effet pousse l'exposition à la hausse avec le temps (incertitude), l'autre à la baisse (moins de flux restants) : leur combinaison donne une forme en cloche typique.", en: "One effect pushes exposure up over time (uncertainty), the other down (fewer remaining flows): their combination gives a typical hump shape." },
  explanation: {
    fr: "L'exposition future attendue résulte de la combinaison de deux effets opposés : l'incertitude sur le niveau futur des taux (donc sur la valeur potentielle du swap) augmente avec l'horizon de temps considéré, tandis que le nombre de flux de paiement restants, donc la valeur maximale en jeu, diminue à mesure que l'échéance approche — cette combinaison produit typiquement un profil d'exposition en forme de cloche, montant puis redescendant, plutôt qu'un profil plat ou monotone.",
    en: "Expected future exposure results from the combination of two opposing effects: uncertainty about the future rate level (hence the swap's potential value) grows with the time horizon considered, while the number of remaining payment flows, hence the maximum value at stake, shrinks as maturity approaches — this combination typically produces a hump-shaped exposure profile, rising then falling, rather than a flat or monotone one.",
  },
  commonMistake: {
    fr: "Supposer que l'exposition future attendue d'un swap est constante ou strictement croissante sur toute sa durée, en ignorant l'effet de la diminution des flux restants à l'approche de l'échéance.",
    en: "Assuming a swap's expected future exposure is constant or strictly increasing over its entire life, ignoring the effect of shrinking remaining flows as maturity approaches.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  counterpartyVsIssuerRiskComparisonTemplate,
  swapValueFlipsWhatIfTemplate,
  higherDefaultProbWhatIfTemplate,
  cvaCalcTemplate,
  positiveOnlyExposureCalcTemplate,
  cvaAppliesOnlyUncollateralizedMistakeTemplate,
  bankPricingScenarioTemplate,
  wrongWayRiskMistakeTemplate,
  nettingAgreementScenarioTemplate,
  recoveryRateSensitivityCalcTemplate,
  exposureProfileOverTimeComparisonTemplate,
];
