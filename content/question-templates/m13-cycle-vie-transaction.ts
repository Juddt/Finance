import { pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

const comprehensionTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-comprehension",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  prompt: {
    fr: "Que se passe-t-il typiquement immédiatement après l'exécution d'une transaction ?",
    en: "What typically happens immediately after a transaction's execution?",
  },
  choices: [
    { id: "confirmation-then-clearing-settlement", label: { fr: "Une confirmation entre les deux contreparties, suivie de la compensation puis du règlement effectif", en: "A confirmation between the two counterparties, followed by clearing then actual settlement" } },
    { id: "transaction-fully-complete", label: { fr: "La transaction est intégralement terminée, aucune étape supplémentaire n'étant nécessaire", en: "The transaction is fully complete, no further step being necessary" } },
    { id: "only-cash-movement", label: { fr: "Uniquement un mouvement de trésorerie immédiat, sans confirmation ni compensation", en: "Only an immediate cash movement, with no confirmation or clearing" } },
    { id: "quoting-restarts", label: { fr: "Le processus de cotation recommence depuis le début pour valider le prix obtenu", en: "The quoting process starts over from scratch to validate the obtained price" } },
  ],
  correctId: "confirmation-then-clearing-settlement",
  hint: { fr: "L'exécution n'est que le début d'une chaîne d'étapes ultérieures, pas la fin du processus.", en: "Execution is only the start of a chain of later steps, not the end of the process." },
  explanation: {
    fr: "Après l'exécution, la transaction traverse encore plusieurs étapes : confirmation mutuelle des termes entre les deux contreparties, puis compensation (calcul des obligations nettes), puis règlement effectif (échange des titres contre les espèces) — l'exécution n'est ni la fin du processus, ni un simple mouvement de trésorerie immédiat, ni un recommencement de la cotation.",
    en: "After execution, the transaction still goes through several steps: mutual confirmation of terms between the two counterparties, then clearing (computing net obligations), then actual settlement (exchanging securities for cash) — execution is neither the end of the process, nor a simple immediate cash movement, nor a restart of quoting.",
  },
  commonMistake: {
    fr: "Croire qu'une transaction est intégralement terminée dès son exécution, en ignorant les étapes de confirmation, compensation et règlement qui suivent.",
    en: "Believing a transaction is fully complete upon execution, ignoring the confirmation, clearing and settlement steps that follow.",
  },
});

const tradeDateVsSettlementDateComparisonTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-comparaison-date-negociation-reglement",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  prompt: {
    fr: "En quoi la date de négociation d'une transaction diffère-t-elle de sa date de règlement ?",
    en: "How does a transaction's trade date differ from its settlement date?",
  },
  choices: [
    { id: "agreement-vs-actual-exchange", label: { fr: "La date de négociation marque l'accord ferme sur prix et quantité, la date de règlement marque l'échange effectif des titres contre les espèces, généralement quelques jours plus tard", en: "The trade date marks the firm agreement on price and quantity, the settlement date marks the actual exchange of securities for cash, generally a few days later" } },
    { id: "always-identical-dates", label: { fr: "Ces deux dates sont toujours rigoureusement identiques, quel que soit le type d'instrument", en: "These two dates are always strictly identical, whatever the instrument type" } },
    { id: "settlement-always-before-trade", label: { fr: "La date de règlement précède toujours la date de négociation, l'échange ayant lieu avant l'accord", en: "The settlement date always precedes the trade date, the exchange happening before the agreement" } },
    { id: "settlement-date-irrelevant-for-cash", label: { fr: "La date de règlement n'a aucun rapport avec les besoins de trésorerie d'une transaction", en: "The settlement date has no bearing on a transaction's cash needs" } },
  ],
  correctId: "agreement-vs-actual-exchange",
  hint: { fr: "L'accord sur le prix et l'échange effectif des titres et des espèces ne se produisent généralement pas le même jour.", en: "The agreement on price and the actual exchange of securities and cash generally don't happen on the same day." },
  explanation: {
    fr: "La date de négociation est le moment où l'accord ferme sur le prix et la quantité est conclu, tandis que la date de règlement est le moment où les titres et les espèces changent effectivement de propriétaire, généralement quelques jours ouvrés plus tard (convention \"J+2\" par exemple) : c'est précisément à la date de règlement que la trésorerie doit disposer effectivement des fonds, ce qui en fait une date cruciale pour la gestion de trésorerie.",
    en: "The trade date is when the firm agreement on price and quantity is concluded, while the settlement date is when securities and cash actually change ownership, generally a few business days later (e.g. a \"T+2\" convention): it's precisely on the settlement date that treasury must actually have the funds available, making it a crucial date for cash management.",
  },
  commonMistake: {
    fr: "Confondre la date de négociation et la date de règlement, en supposant à tort qu'elles coïncident toujours ou que l'ordre entre les deux peut être inversé.",
    en: "Confusing the trade date and the settlement date, wrongly assuming they always coincide or that their order can be reversed.",
  },
});

const openDerivativePositionWhatIfTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-what-if-position-derivee-ouverte",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un trader a exécuté et réglé un swap compensé par une CCP. Trois mois plus tard, le marché a fortement évolué. Quel est l'effet probable sur les besoins de trésorerie de cette position ?",
    en: "A trader executed and settled a CCP-cleared swap. Three months later, the market has moved sharply. What is the likely effect on this position's cash needs?",
  },
  choices: [
    { id: "ongoing-margin-calls", label: { fr: "Des appels de marge de variation continuent probablement à générer des besoins de trésorerie récurrents, bien après le règlement initial", en: "Variation margin calls likely keep generating recurring cash needs, well after the initial settlement" } },
    { id: "no-further-cash-needs", label: { fr: "Aucun besoin de trésorerie supplémentaire n'est possible, le règlement initial ayant définitivement clos tous les flux de la position", en: "No further cash need is possible, the initial settlement having definitively closed all the position's flows" } },
    { id: "cash-needs-only-at-maturity", label: { fr: "Les besoins de trésorerie n'apparaîtront qu'à l'échéance finale du swap, jamais entre-temps", en: "Cash needs will only appear at the swap's final maturity, never in between" } },
    { id: "market-move-irrelevant-to-cash", label: { fr: "L'évolution du marché n'a aucun rapport avec les besoins de trésorerie d'un swap compensé", en: "The market's move has no bearing on a cleared swap's cash needs" } },
  ],
  correctId: "ongoing-margin-calls",
  hint: { fr: "Un dérivé compensé par une CCP reste \"vivant\" après le règlement initial : que génère un mouvement de marché sur une position ouverte sous appels de marge ?", en: "A CCP-cleared derivative stays \"alive\" after initial settlement: what does a market move generate on an open position under margin calls?" },
  explanation: {
    fr: "Une position dérivée compensée par une CCP reste ouverte et soumise à des appels de marge de variation réguliers (souvent quotidiens) tant qu'elle n'est pas clôturée : un mouvement de marché important trois mois après le règlement initial génère très probablement des besoins de trésorerie supplémentaires liés à ces appels de marge, un phénomène totalement absent d'une transaction au comptant réglée une fois pour toutes.",
    en: "A CCP-cleared derivative position stays open and subject to regular (often daily) variation margin calls until it's closed: a significant market move three months after initial settlement very likely generates additional cash needs tied to these margin calls, a phenomenon entirely absent from a cash transaction settled once and for all.",
  },
  commonMistake: {
    fr: "Croire que le règlement initial d'un dérivé compensé clôture définitivement tous ses besoins de trésorerie, en ignorant les appels de marge récurrents tant que la position reste ouverte.",
    en: "Believing a cleared derivative's initial settlement definitively closes all its cash needs, ignoring recurring margin calls as long as the position stays open.",
  },
});

const settlementFailWhatIfTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-what-if-echec-reglement",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "À la date de règlement prévue, l'une des deux contreparties ne parvient pas à livrer les titres convenus, en raison d'un problème opérationnel interne. De quel type de risque s'agit-il principalement ?",
    en: "On the scheduled settlement date, one of the two counterparties fails to deliver the agreed securities, due to an internal operational issue. What type of risk is this mainly?",
  },
  choices: [
    { id: "operational-settlement-risk", label: { fr: "Un risque opérationnel de règlement, distinct du risque de marché ou du risque de crédit de la contrepartie", en: "An operational settlement risk, distinct from market risk or the counterparty's credit risk" } },
    { id: "pure-market-risk", label: { fr: "Un pur risque de marché, identique à une perte liée à un mouvement défavorable du prix du sous-jacent", en: "A pure market risk, identical to a loss tied to an unfavorable move in the underlying's price" } },
    { id: "credit-risk-of-issuer", label: { fr: "Un risque de crédit de l'émetteur du titre échangé, sans rapport avec le processus de règlement lui-même", en: "A credit risk of the traded security's issuer, unrelated to the settlement process itself" } },
    { id: "not-a-real-risk-category", label: { fr: "Ce n'est pas une catégorie de risque à proprement parler, simplement un désagrément administratif sans conséquence", en: "This isn't really a risk category, just an administrative inconvenience with no consequence" } },
  ],
  correctId: "operational-settlement-risk",
  hint: { fr: "Le problème vient d'une défaillance dans le PROCESSUS (livrer les titres à temps), pas d'un mouvement de prix ni d'un défaut de l'émetteur.", en: "The problem comes from a failure in the PROCESS (delivering securities on time), not a price move or an issuer default." },
  explanation: {
    fr: "Un échec de livraison à la date de règlement pour une raison opérationnelle interne relève spécifiquement du risque opérationnel de règlement : ce n'est ni un risque de marché (aucun mouvement de prix n'est en cause), ni un risque de crédit de l'émetteur du titre (le problème vient du processus, pas de la solvabilité de l'émetteur) — et c'est un risque réel, pouvant générer des pénalités, des coûts de financement imprévus ou des complications en cascade sur d'autres transactions liées.",
    en: "A delivery failure on the settlement date due to an internal operational issue specifically falls under operational settlement risk: it is neither a market risk (no price move is at play), nor a credit risk of the traded security's issuer (the problem comes from the process, not the issuer's solvency) — and it is a real risk, able to generate penalties, unforeseen funding costs, or cascading complications on other related transactions.",
  },
  commonMistake: {
    fr: "Traiter un échec de règlement comme un simple désagrément administratif sans conséquence, en ignorant qu'il constitue une catégorie de risque réelle et distincte.",
    en: "Treating a settlement failure as a mere administrative inconvenience with no consequence, ignoring that it constitutes a real, distinct risk category.",
  },
});

const cashEquityVsClearedDerivativeComparisonTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-comparaison-action-comptant-derive-compense",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  prompt: {
    fr: "En quoi le profil de trésorerie d'un achat d'action au comptant diffère-t-il de celui d'un dérivé compensé par une CCP, après leur exécution respective ?",
    en: "How does a cash equity purchase's cash profile differ from a CCP-cleared derivative's, after their respective execution?",
  },
  choices: [
    { id: "one-off-vs-recurring", label: { fr: "L'action génère un besoin de trésorerie ponctuel au règlement, tandis que le dérivé compensé génère des besoins récurrents via les appels de marge tant que la position reste ouverte", en: "The equity generates a one-off cash need at settlement, while the cleared derivative generates recurring needs via margin calls as long as the position stays open" } },
    { id: "identical-cash-profiles", label: { fr: "Les deux ont rigoureusement le même profil de trésorerie, le mode de compensation n'ayant aucune influence", en: "Both have strictly the same cash profile, the clearing mode having no influence" } },
    { id: "equity-recurring-derivative-one-off", label: { fr: "C'est l'inverse : l'action génère des besoins récurrents, tandis que le dérivé compensé n'en génère qu'un seul, ponctuel", en: "It's the reverse: the equity generates recurring needs, while the cleared derivative only generates a single, one-off need" } },
    { id: "neither-generates-cash-needs", label: { fr: "Ni l'un ni l'autre ne génère de besoin de trésorerie après l'exécution initiale", en: "Neither generates any cash need after the initial execution" } },
  ],
  correctId: "one-off-vs-recurring",
  hint: { fr: "Une action au comptant se règle une fois ; un dérivé compensé reste \"vivant\" et sous surveillance de marge tant qu'il n'est pas clôturé.", en: "A cash equity settles once; a cleared derivative stays \"alive\" and under margin monitoring until it's closed." },
  explanation: {
    fr: "Une action au comptant génère un besoin de trésorerie ponctuel à sa date de règlement (typiquement J+2), après quoi la transaction est intégralement dénouée ; un dérivé compensé par une CCP, en revanche, reste une position ouverte soumise à des appels de marge de variation réguliers tant qu'elle n'est pas clôturée, générant des besoins de trésorerie récurrents et potentiellement imprévisibles bien après l'exécution initiale — une différence structurelle essentielle entre les deux types d'instruments.",
    en: "A cash equity generates a one-off cash need at its settlement date (typically T+2), after which the transaction is fully unwound; a CCP-cleared derivative, in contrast, remains an open position subject to regular variation margin calls until it's closed, generating recurring and potentially unpredictable cash needs well after the initial execution — an essential structural difference between the two instrument types.",
  },
  commonMistake: {
    fr: "Traiter tous les instruments financiers comme ayant le même profil de trésorerie après exécution, en ignorant la différence structurelle entre un règlement ponctuel et des appels de marge récurrents.",
    en: "Treating all financial instruments as having the same post-execution cash profile, ignoring the structural difference between a one-off settlement and recurring margin calls.",
  },
});

const confirmationMismatchScenarioTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-scenario-desaccord-confirmation",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Lors de l'étape de confirmation, les deux contreparties d'une transaction découvrent un désaccord sur le prix convenu. À quel moment ce désaccord est-il détecté, et quelle en est l'utilité ?",
    en: "During the confirmation step, a transaction's two counterparties discover a disagreement on the agreed price. When is this disagreement detected, and what is its purpose?",
  },
  choices: [
    { id: "detected-before-settlement-prevents-error", label: { fr: "Il est détecté AVANT le règlement, précisément parce que la confirmation sert à vérifier l'accord des deux parties avant que titres et espèces ne changent réellement de mains", en: "It is detected BEFORE settlement, precisely because confirmation serves to verify both parties agree before securities and cash actually change hands" } },
    { id: "detected-after-settlement-too-late", label: { fr: "Il est détecté APRÈS le règlement, la confirmation n'intervenant qu'une fois l'échange déjà finalisé", en: "It is detected AFTER settlement, confirmation only occurring once the exchange is already finalized" } },
    { id: "confirmation-has-no-real-purpose", label: { fr: "La confirmation n'a aucune utilité réelle dans ce cas, un désaccord de prix ne pouvant de toute façon jamais être corrigé à ce stade", en: "Confirmation has no real purpose in this case, a price disagreement being impossible to correct at this stage anyway" } },
    { id: "detected-at-quoting-stage", label: { fr: "Il aurait dû être détecté dès l'étape de cotation, la confirmation ne servant qu'à une simple formalité administrative sans rapport avec le prix", en: "It should have been detected at the quoting stage already, confirmation only serving as a simple administrative formality unrelated to price" } },
  ],
  correctId: "detected-before-settlement-prevents-error",
  hint: { fr: "La confirmation intervient AVANT le règlement dans la séquence du cycle de vie : quel est justement son rôle à ce stade ?", en: "Confirmation happens BEFORE settlement in the lifecycle sequence: what is precisely its role at this stage?" },
  explanation: {
    fr: "La confirmation a précisément pour rôle de détecter tout désaccord entre les deux contreparties AVANT que le règlement n'ait lieu : intervenant après l'exécution mais avant le règlement dans la séquence du cycle de vie, elle permet de corriger une erreur (de prix, de quantité, de date) avant que titres et espèces ne changent réellement de mains, évitant ainsi un règlement erroné coûteux à corriger a posteriori.",
    en: "Confirmation's precise role is to detect any disagreement between the two counterparties BEFORE settlement takes place: occurring after execution but before settlement in the lifecycle sequence, it allows correcting an error (price, quantity, date) before securities and cash actually change hands, thus avoiding a costly-to-correct erroneous settlement after the fact.",
  },
  commonMistake: {
    fr: "Croire que la confirmation intervient après le règlement ou qu'elle n'a qu'une valeur administrative, en ignorant son rôle de détection d'erreur avant l'échange effectif des titres et des espèces.",
    en: "Believing confirmation happens after settlement or that it's merely administrative, ignoring its role in catching errors before the actual exchange of securities and cash.",
  },
});

const settlementDayCountCalcTemplate: QuestionTemplate = {
  id: "m13-cycle-vie-transaction-calcul-date-reglement",
  conceptId: "m13-cycle-vie-transaction",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenarios = [
      { tradeDay: "lundi", tradeDayEn: "Monday", settlementDay: "mercredi", settlementDayEn: "Wednesday", wrongFri: "vendredi", wrongFriEn: "Friday", wrongTue: "mardi", wrongTueEn: "Tuesday" },
      { tradeDay: "mardi", tradeDayEn: "Tuesday", settlementDay: "jeudi", settlementDayEn: "Thursday", wrongFri: "vendredi", wrongFriEn: "Friday", wrongTue: "mercredi", wrongTueEn: "Wednesday" },
      { tradeDay: "mercredi", tradeDayEn: "Wednesday", settlementDay: "vendredi", settlementDayEn: "Friday", wrongFri: "lundi", wrongFriEn: "Monday", wrongTue: "jeudi", wrongTueEn: "Thursday" },
      { tradeDay: "jeudi", tradeDayEn: "Thursday", settlementDay: "lundi", settlementDayEn: "Monday", wrongFri: "samedi", wrongFriEn: "Saturday", wrongTue: "vendredi", wrongTueEn: "Friday" },
    ] as const;
    const s = pick(rng, scenarios);

    return {
      isScenario: true,
      prompt: {
        fr: `Une transaction au comptant est négociée un ${s.tradeDay}, avec un règlement en convention "J+2" en jours ouvrés (weekend exclu). Quel jour de la semaine intervient le règlement ?`,
        en: `A cash transaction is traded on a ${s.tradeDayEn}, with settlement on a "T+2" business-day convention (weekend excluded). On what day of the week does settlement occur?`,
      },
      choices: [
        { id: "correct", label: { fr: s.settlementDay.charAt(0).toUpperCase() + s.settlementDay.slice(1), en: s.settlementDayEn }, },
        { id: "wrong-skips-weekend-wrong", label: { fr: s.wrongFri.charAt(0).toUpperCase() + s.wrongFri.slice(1) + ", en comptant deux jours calendaires au lieu de deux jours ouvrés", en: s.wrongFriEn + ", by counting two calendar days instead of two business days" } },
        { id: "wrong-one-day", label: { fr: s.wrongTue.charAt(0).toUpperCase() + s.wrongTue.slice(1) + ", en ne comptant qu'un seul jour ouvré au lieu de deux", en: s.wrongTueEn + ", by counting only one business day instead of two" } },
        { id: "wrong-same-day", label: { fr: s.tradeDay.charAt(0).toUpperCase() + s.tradeDay.slice(1) + ", en supposant à tort un règlement le jour même de la négociation", en: s.tradeDayEn + ", wrongly assuming same-day settlement as the trade" } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "\"J+2\" compte deux JOURS OUVRÉS après la date de négociation, en excluant samedi et dimanche.", en: "\"T+2\" counts two BUSINESS DAYS after the trade date, excluding Saturday and Sunday." },
      explanation: {
        fr: `Négociée un ${s.tradeDay}, la transaction se règle deux jours OUVRÉS plus tard, soit un ${s.settlementDay} — compter des jours calendaires au lieu de jours ouvrés, ou oublier d'exclure le weekend, sont des erreurs fréquentes sur ce type de calcul de convention de règlement.`,
        en: `Traded on a ${s.tradeDayEn}, the transaction settles two BUSINESS days later, i.e. a ${s.settlementDayEn} — counting calendar days instead of business days, or forgetting to exclude the weekend, are frequent errors on this type of settlement convention calculation.`,
      },
      commonMistake: {
        fr: "Compter des jours calendaires plutôt que des jours ouvrés pour une convention de règlement \"J+2\", en oubliant d'exclure le weekend.",
        en: "Counting calendar days rather than business days for a \"T+2\" settlement convention, forgetting to exclude the weekend.",
      },
    };
  },
};

const clearingVsSettlementMistakeTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-erreur-compensation-reglement",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations distingue correctement la compensation (clearing) du règlement (settlement) ?",
    en: "Which of these statements correctly distinguishes clearing from settlement?",
  },
  choices: [
    { id: "clearing-computes-net-settlement-exchanges", label: { fr: "La compensation calcule les obligations nettes à honorer, tandis que le règlement est l'échange effectif des titres contre les espèces qui honore ces obligations", en: "Clearing computes the net obligations to honor, while settlement is the actual exchange of securities for cash that honors those obligations" } },
    { id: "identical-steps-different-names", label: { fr: "Ce sont deux noms différents pour désigner exactement la même étape du cycle de vie d'une transaction", en: "These are two different names for exactly the same step in a transaction's lifecycle" } },
    { id: "settlement-always-precedes-clearing", label: { fr: "Le règlement intervient toujours avant la compensation dans le cycle de vie d'une transaction", en: "Settlement always occurs before clearing in a transaction's lifecycle" } },
    { id: "clearing-only-for-equities", label: { fr: "La compensation ne s'applique qu'aux actions au comptant, jamais aux dérivés ni aux obligations", en: "Clearing only applies to cash equities, never to derivatives or bonds" } },
  ],
  correctId: "clearing-computes-net-settlement-exchanges",
  hint: { fr: "L'une calcule CE QUI est dû (net), l'autre effectue l'échange EFFECTIF qui honore ce montant.", en: "One computes WHAT is owed (net), the other performs the ACTUAL exchange that honors that amount." },
  explanation: {
    fr: "La compensation calcule les obligations nettes entre les parties (éventuellement via une CCP), tandis que le règlement est l'étape ultérieure où l'échange effectif des titres contre les espèces a lieu, honorant ces obligations nettes : ce ne sont ni deux noms pour la même étape, ni deux étapes dans un ordre inversé, et la compensation s'applique à une large gamme d'instruments, pas seulement aux actions au comptant.",
    en: "Clearing computes the net obligations between parties (possibly via a CCP), while settlement is the later step where the actual exchange of securities for cash takes place, honoring those net obligations: these are neither two names for the same step, nor two steps in reverse order, and clearing applies to a wide range of instruments, not just cash equities.",
  },
  commonMistake: {
    fr: "Confondre compensation et règlement comme une seule et même étape, en ignorant que la première calcule des obligations nettes tandis que la seconde les honore effectivement.",
    en: "Confusing clearing and settlement as a single step, ignoring that the former computes net obligations while the latter actually honors them.",
  },
});

const legalCounterpartyComparisonTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-comparaison-contrepartie-legale",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "hard",
  prompt: {
    fr: "Au moment du règlement, en quoi la contrepartie légale d'une transaction compensée par une CCP diffère-t-elle de celle d'une transaction bilatérale non compensée ?",
    en: "At settlement, how does the legal counterparty of a CCP-cleared transaction differ from that of an uncleared bilateral transaction?",
  },
  choices: [
    { id: "ccp-interposed-as-counterparty", label: { fr: "Sous compensation centrale, la CCP s'interpose comme contrepartie légale de chacune des deux parties initiales, alors qu'une transaction bilatérale conserve les deux parties d'origine face à face", en: "Under central clearing, the CCP interposes itself as the legal counterparty to each of the two original parties, while a bilateral transaction keeps the two original parties facing each other" } },
    { id: "always-identical-counterparty", label: { fr: "La contrepartie légale reste toujours rigoureusement identique, que la transaction soit compensée centralement ou bilatérale", en: "The legal counterparty always stays strictly identical, whether the transaction is centrally cleared or bilateral" } },
    { id: "ccp-only-observes-no-legal-role", label: { fr: "La CCP se contente d'observer la transaction, sans jamais en devenir la contrepartie légale", en: "The CCP merely observes the transaction, never becoming its legal counterparty" } },
    { id: "bilateral-always-uses-ccp-too", label: { fr: "Une transaction bilatérale utilise en réalité toujours une CCP en arrière-plan, la distinction n'étant que théorique", en: "A bilateral transaction actually always uses a CCP in the background, the distinction being only theoretical" } },
  ],
  correctId: "ccp-interposed-as-counterparty",
  hint: { fr: "Le clearing central via une CCP a été présenté au module 4 : la CCP \"s'interpose\" entre les deux parties initiales.", en: "Central clearing via a CCP was introduced in module 4: the CCP \"interposes\" itself between the two original parties." },
  explanation: {
    fr: "Sous compensation centrale, la CCP devient légalement la contrepartie de chacune des deux parties initiales (elle \"s'interpose\"), ce qui transforme le risque de contrepartie bilatéral en risque de contrepartie vis-à-vis de la CCP uniquement ; une transaction bilatérale non compensée conserve au contraire les deux parties d'origine directement face à face, sans intermédiaire légal — une distinction réelle et non purement théorique.",
    en: "Under central clearing, the CCP legally becomes the counterparty to each of the two original parties (it \"interposes\" itself), which transforms bilateral counterparty risk into counterparty risk vis-à-vis the CCP alone; an uncleared bilateral transaction, in contrast, keeps the two original parties directly facing each other, with no legal intermediary — a real, not purely theoretical, distinction.",
  },
  commonMistake: {
    fr: "Croire que la contrepartie légale d'une transaction reste toujours identique, indépendamment du mode de compensation choisi.",
    en: "Believing a transaction's legal counterparty always stays identical, regardless of the chosen clearing mode.",
  },
});

const nettingMultipleTradesScenarioTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-scenario-netting-multiples-transactions",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une banque a exécuté dix transactions distinctes avec la même contrepartie le même jour, certaines à l'achat, d'autres à la vente du même titre. Sous un mécanisme de compensation avec netting, quel est l'effet sur le règlement final ?",
    en: "A bank executed ten distinct transactions with the same counterparty on the same day, some buys, some sells of the same security. Under a netting clearing mechanism, what is the effect on final settlement?",
  },
  choices: [
    { id: "single-net-settlement", label: { fr: "Le règlement se limite généralement à un seul montant net (achats moins ventes), plutôt qu'à dix règlements séparés", en: "Settlement is generally limited to a single net amount (buys minus sells), rather than ten separate settlements" } },
    { id: "ten-separate-settlements-always", label: { fr: "Les dix transactions doivent toujours être réglées séparément, le netting ne s'appliquant jamais au règlement final", en: "The ten transactions must always be settled separately, netting never applying to final settlement" } },
    { id: "netting-doubles-settlement-amount", label: { fr: "Le netting double le montant à régler, en additionnant systématiquement achats et ventes", en: "Netting doubles the amount to settle, by systematically adding buys and sells together" } },
    { id: "netting-only-applies-to-derivatives", label: { fr: "Le netting ne s'applique qu'aux produits dérivés, jamais aux transactions sur titres au comptant", en: "Netting only applies to derivative products, never to cash securities transactions" } },
  ],
  correctId: "single-net-settlement",
  hint: { fr: "Le netting compense les positions ACHETEUSES et VENDEUSES entre les mêmes parties : que reste-t-il à régler après compensation ?", en: "Netting offsets BUY and SELL positions between the same parties: what remains to settle after netting?" },
  explanation: {
    fr: "Sous un mécanisme de compensation avec netting, les dix transactions entre les mêmes deux parties sont compensées entre elles (achats contre ventes du même titre), réduisant généralement le règlement final à un seul montant net plutôt qu'à dix règlements séparés : cela réduit à la fois le nombre de mouvements de trésorerie et de titres nécessaires, et le risque opérationnel associé à chaque règlement individuel — le netting s'applique à une large gamme d'instruments, pas seulement aux dérivés.",
    en: "Under a netting clearing mechanism, the ten transactions between the same two parties are offset against each other (buys against sells of the same security), generally reducing final settlement to a single net amount rather than ten separate settlements: this reduces both the number of cash and securities movements needed, and the operational risk associated with each individual settlement — netting applies to a wide range of instruments, not just derivatives.",
  },
  commonMistake: {
    fr: "Croire que chaque transaction individuelle doit toujours être réglée séparément, en ignorant l'effet du netting qui réduit le règlement final à un montant net.",
    en: "Believing each individual transaction must always be settled separately, ignoring netting's effect that reduces final settlement to a net amount.",
  },
});

const collateralNotStaticMistakeTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-erreur-collateral-statique",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un opérateur suppose que le collatéral déposé lors de l'exécution d'un dérivé compensé reste fixe pendant toute la durée de la position, sans jamais être ajusté. Cette hypothèse est-elle correcte ?",
    en: "An operator assumes the collateral posted at a cleared derivative's execution stays fixed for the position's entire life, never being adjusted. Is this assumption correct?",
  },
  choices: [
    { id: "incorrect-collateral-adjusted-via-margin-calls", label: { fr: "Non : le collatéral est généralement ajusté régulièrement via des appels de marge de variation, reflétant l'évolution de la valeur de la position", en: "No: collateral is generally adjusted regularly via variation margin calls, reflecting the position's changing value" } },
    { id: "correct-collateral-fixed-forever", label: { fr: "Oui, le collatéral initial déposé à l'exécution reste rigoureusement fixe jusqu'à la clôture de la position, quelle que soit l'évolution du marché", en: "Yes, the collateral initially posted at execution stays strictly fixed until the position closes, whatever the market's evolution" } },
    { id: "collateral-only-adjusted-at-maturity", label: { fr: "Le collatéral n'est ajusté qu'une seule fois, à l'échéance finale de la position, jamais entre-temps", en: "Collateral is only adjusted once, at the position's final maturity, never in between" } },
    { id: "collateral-decreases-automatically-over-time", label: { fr: "Le collatéral diminue automatiquement au fil du temps, indépendamment de l'évolution de la valeur de la position", en: "Collateral automatically decreases over time, independently of the position's changing value" } },
  ],
  correctId: "incorrect-collateral-adjusted-via-margin-calls",
  hint: { fr: "Le collatéral sous un accord de marge suit la VALEUR de la position, qui évolue avec le marché : reste-t-il donc figé ?", en: "Collateral under a margin agreement tracks the position's VALUE, which changes with the market: does it stay frozen?" },
  explanation: {
    fr: "Cette hypothèse est incorrecte : le collatéral d'une position dérivée compensée est généralement ajusté régulièrement (souvent quotidiennement) via des appels de marge de variation, qui reflètent l'évolution de la valeur de marché de la position tout au long de sa vie — le considérer comme fixe dès l'exécution ignore un mécanisme central de la gestion du risque de contrepartie sur une position ouverte.",
    en: "This assumption is incorrect: a cleared derivative position's collateral is generally adjusted regularly (often daily) via variation margin calls, which reflect the position's changing market value throughout its life — treating it as fixed from execution ignores a central mechanism of counterparty risk management on an open position.",
  },
  commonMistake: {
    fr: "Supposer que le collatéral déposé à l'exécution d'une position reste fixe pendant toute sa durée, en ignorant les appels de marge de variation réguliers.",
    en: "Assuming collateral posted at a position's execution stays fixed for its entire life, ignoring regular variation margin calls.",
  },
});

const repoDualLegScenarioTemplate = mcqTemplate({
  id: "m13-cycle-vie-transaction-scenario-double-jambe-repo",
  conceptId: "m13-cycle-vie-transaction",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une opération de repo (mise en pension) comporte deux jambes : la cession initiale des titres contre espèces, puis leur rachat à une date ultérieure convenue. Combien d'événements de règlement distincts cela implique-t-il typiquement au cours du cycle de vie de l'opération ?",
    en: "A repo transaction has two legs: the initial transfer of securities against cash, then their repurchase at a later agreed date. How many distinct settlement events does this typically involve over the transaction's lifecycle?",
  },
  choices: [
    { id: "two-settlement-events", label: { fr: "Typiquement deux événements de règlement distincts : un à l'ouverture (cession initiale) et un à la clôture (rachat), chacun avec son propre échange de titres et d'espèces", en: "Typically two distinct settlement events: one at opening (initial transfer) and one at closing (repurchase), each with its own exchange of securities and cash" } },
    { id: "single-settlement-event", label: { fr: "Un seul événement de règlement suffit, la seconde jambe ne nécessitant aucun échange effectif de titres ou d'espèces", en: "A single settlement event is enough, the second leg requiring no actual exchange of securities or cash" } },
    { id: "settlement-only-at-trade-execution", label: { fr: "Le règlement n'a lieu qu'au moment de l'exécution de l'accord, avant même la cession initiale", en: "Settlement only occurs at the moment the agreement is executed, even before the initial transfer" } },
    { id: "no-settlement-needed-repo-is-purely-contractual", label: { fr: "Aucun règlement n'est nécessaire, un repo étant un engagement purement contractuel sans échange physique de titres ou d'espèces", en: "No settlement is needed, a repo being a purely contractual commitment with no physical exchange of securities or cash" } },
  ],
  correctId: "two-settlement-events",
  hint: { fr: "Un repo a DEUX jambes (cession initiale, puis rachat) : chacune implique-t-elle un échange effectif de titres et d'espèces ?", en: "A repo has TWO legs (initial transfer, then repurchase): does each involve an actual exchange of securities and cash?" },
  explanation: {
    fr: "Un repo comporte structurellement deux jambes, chacune nécessitant son propre règlement effectif : la cession initiale des titres contre espèces (à l'ouverture) et leur rachat à la date convenue (à la clôture), moment où les titres et les espèces (plus l'intérêt repo) changent à nouveau de mains en sens inverse — ce n'est ni un seul règlement, ni un engagement purement contractuel sans échange physique, ni un règlement unique à l'exécution.",
    en: "A repo structurally has two legs, each requiring its own actual settlement: the initial transfer of securities against cash (at opening) and their repurchase at the agreed date (at closing), when securities and cash (plus repo interest) change hands again in reverse — it is neither a single settlement, nor a purely contractual commitment with no physical exchange, nor a single settlement at execution.",
  },
  commonMistake: {
    fr: "Croire qu'une opération de repo ne nécessite qu'un seul règlement effectif, en oubliant que sa seconde jambe (le rachat) constitue elle-même un événement de règlement distinct.",
    en: "Believing a repo transaction only requires a single actual settlement, forgetting its second leg (the repurchase) itself constitutes a distinct settlement event.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  tradeDateVsSettlementDateComparisonTemplate,
  openDerivativePositionWhatIfTemplate,
  settlementFailWhatIfTemplate,
  cashEquityVsClearedDerivativeComparisonTemplate,
  confirmationMismatchScenarioTemplate,
  settlementDayCountCalcTemplate,
  clearingVsSettlementMistakeTemplate,
  legalCounterpartyComparisonTemplate,
  nettingMultipleTradesScenarioTemplate,
  collateralNotStaticMistakeTemplate,
  repoDualLegScenarioTemplate,
];
