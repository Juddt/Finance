import type { LessonContent } from "@/lib/lesson-types";

export const m13CycleVieTransaction: LessonContent = {
  conceptId: "m13-cycle-vie-transaction",
  glossary: [
    { term: { fr: "Date de règlement (settlement date)", en: "Settlement date" }, definition: { fr: "La date à laquelle les titres et les espèces d'une transaction changent effectivement de propriétaire, généralement quelques jours après la date de négociation.", en: "The date on which a transaction's securities and cash actually change ownership, generally a few days after the trade date." } },
    { term: { fr: "Confirmation", en: "Confirmation" }, definition: { fr: "Le document (ou message électronique) par lequel les deux contreparties d'une transaction attestent mutuellement des termes convenus, avant le règlement.", en: "The document (or electronic message) by which a transaction's two counterparties mutually attest to the agreed terms, before settlement." } },
  ],
  intuition: {
    fr: "Une transaction ne se termine pas au moment où l'on clique sur \"acheter\" : ce n'est que le premier maillon d'une chaîne d'étapes, chacune avec ses propres risques et ses propres besoins de trésorerie. Un trader qui ne suit une position que jusqu'à son exécution, sans comprendre ce qui se passe ensuite (confirmation, compensation, règlement, appels de marge), ne peut ni anticiper les mouvements de trésorerie qu'elle va générer, ni comprendre où un problème opérationnel peut survenir.",
    en: "A transaction doesn't end the moment you click \"buy\": that's only the first link in a chain of steps, each with its own risks and its own cash needs. A trader who only tracks a position through execution, without understanding what happens next (confirmation, clearing, settlement, margin calls), can neither anticipate the cash movements it will generate, nor understand where an operational problem can arise.",
  },
  definition: {
    fr: "La vie d'une transaction se décompose typiquement en plusieurs étapes séquentielles : la cotation (obtenir un prix), l'exécution (accord ferme sur le prix et la quantité), l'enregistrement interne, la confirmation (les deux contreparties attestent mutuellement des termes), la compensation (calcul des obligations nettes, éventuellement via une CCP), le règlement (échange effectif des titres contre les espèces), et enfin la gestion du collatéral et des appels de marge tout au long de la vie de la position si elle reste ouverte.",
    en: "A transaction's life typically breaks down into several sequential steps: quoting (getting a price), execution (firm agreement on price and quantity), internal booking, confirmation (both counterparties mutually attest to the terms), clearing (computing net obligations, possibly via a CCP), settlement (the actual exchange of securities for cash), and finally collateral and margin call management throughout the position's life if it stays open.",
  },
  utility: {
    fr: "Comprendre ce cycle complet est indispensable pour anticiper les besoins de trésorerie qu'une transaction va générer à chaque étape (pas seulement à l'exécution), pour identifier où un problème opérationnel (échec de règlement, erreur de confirmation) peut apparaître, et pour comprendre pourquoi certaines fonctions du back-office et du middle-office existent : elles ne sont pas de la simple bureaucratie, mais gèrent des risques réels à chaque étape de la chaîne.",
    en: "Understanding this full cycle is essential to anticipate the cash needs a transaction will generate at each step (not just at execution), to identify where an operational problem (settlement failure, confirmation error) can arise, and to understand why certain back-office and middle-office functions exist: they aren't mere bureaucracy, but manage real risks at each link of the chain.",
  },
  example: {
    fr: "Un trader achète pour 5 000 000 € d'obligations le lundi (date de négociation), avec un coupon couru de 12 000 € (voir M03-2) : le montant total à régler est donc 5 012 000 €. La confirmation avec la contrepartie intervient le jour même ou le lendemain (aucun mouvement de trésorerie à ce stade). Le règlement effectif (livraison des titres contre paiement) a lieu deux jours ouvrés plus tard, mercredi (convention \"J+2\") : c'est SEULEMENT à cette date que la trésorerie de la banque doit effectivement disposer des 5 012 000 €, pas avant. Si, à la place, il s'agissait d'un dérivé compensé par une CCP, un appel de marge initiale d'environ 5% du notionnel (≈250 000 €) serait exigé dès l'exécution, suivi d'appels de marge de variation quotidiens pouvant représenter plusieurs dizaines de milliers d'euros selon les mouvements de marché — un profil de trésorerie totalement différent de celui, ponctuel, d'un règlement au comptant.",
    en: "A trader buys €5,000,000 of bonds on Monday (trade date), with €12,000 of accrued coupon (see M03-2): the total amount to settle is therefore €5,012,000. Confirmation with the counterparty happens the same day or the next (no cash movement at this stage). Actual settlement (securities delivered against payment) occurs two business days later, on Wednesday (\"T+2\" convention): it is ONLY at that date that the bank's treasury must actually have the €5,012,000 available, not before. If this were instead a CCP-cleared derivative, an initial margin of about 5% of notional (≈€250,000) would be required right at execution, followed by daily variation margin calls that could represent several tens of thousands of euros depending on market moves — a cash profile entirely different from a cash settlement's one-off payment.",
  },
  alternativeExplanation: {
    fr: "Comparez une transaction financière à une commande en ligne : cliquer sur \"acheter\" (exécution) n'est que le début. Il faut ensuite une confirmation de commande (confirmation), une préparation et un tri du colis en entrepôt (compensation), puis une livraison effective (règlement) — et si le produit nécessite un suivi après achat (garantie, SAV), la relation continue bien après le clic initial, exactement comme le collatéral et les appels de marge continuent après l'exécution d'un dérivé.",
    en: "Compare a financial transaction to an online order: clicking \"buy\" (execution) is only the beginning. A confirmation follows (confirmation), then warehouse sorting and packaging (clearing), then actual delivery (settlement) — and if the product needs after-sale tracking (warranty, support), the relationship continues well past the initial click, exactly like collateral and margin calls continue after a derivative's execution.",
  },
  formula: {
    latex: "\\text{Cotation} \\to \\text{Exécution} \\to \\text{Confirmation} \\to \\text{Compensation} \\to \\text{Règlement} \\to \\text{Collatéral/Appels de marge}",
    variables: [
      { symbol: "\\text{Exécution}", description: { fr: "Le moment où l'accord ferme sur prix et quantité est conclu (date de négociation)", en: "The moment the firm agreement on price and quantity is concluded (trade date)" } },
      { symbol: "\\text{Règlement}", description: { fr: "Le moment où titres et espèces changent effectivement de propriétaire", en: "The moment securities and cash actually change ownership" } },
    ],
    assumptions: { fr: "Schéma simplifié à but pédagogique ; l'ordre et le nombre exact d'étapes varient selon le type d'instrument, la juridiction et le mode de compensation (bilatéral vs central).", en: "Simplified diagram for teaching purposes; the exact order and number of steps vary by instrument type, jurisdiction and clearing mode (bilateral vs central)." },
    units: { fr: "Sans unité (séquence d'étapes).", en: "Unitless (sequence of steps)." },
    example: { fr: "Achat d'obligations 5 000 000 € + coupon couru 12 000 € lundi (exécution, besoin de trésorerie=0) → confirmation le jour même (besoin=0) → règlement J+2 mercredi (besoin=5 012 000 €) → si dérivé compensé, marge initiale ≈250 000 € dès l'exécution puis appels de marge quotidiens variables.", en: "Bond purchase €5,000,000 + €12,000 accrued coupon Monday (execution, cash need=0) → same-day confirmation (need=0) → T+2 settlement Wednesday (need=€5,012,000) → if a cleared derivative instead, initial margin ≈€250,000 right at execution then variable daily margin calls." },
  },
  chart: {
    kind: "bar",
    yLabel: { fr: "Besoin de trésorerie à cette étape (€)", en: "Cash need at this stage (€)" },
    bars: [
      { label: { fr: "Cotation", en: "Quoting" }, value: 0 },
      { label: { fr: "Exécution", en: "Execution" }, value: 0 },
      { label: { fr: "Confirmation", en: "Confirmation" }, value: 0 },
      { label: { fr: "Compensation", en: "Clearing" }, value: 0 },
      { label: { fr: "Règlement (J+2)", en: "Settlement (T+2)" }, value: 5012000 },
    ],
  },
  calculation: {
    fr: "1) Identifier à quelle étape du cycle se trouve une transaction donnée. 2) Pour chaque étape, identifier le besoin de trésorerie ou de titres qu'elle génère : ici, cotation, exécution, confirmation et compensation ne génèrent AUCUN mouvement de trésorerie (0€), seul le règlement en génère un, ponctuel, de 5 012 000 € (prix + coupon couru). 3) Pour une position dérivée qui reste ouverte, ajouter le suivi continu du collatéral et des appels de marge (marge initiale ≈250 000€ dès l'exécution, puis appels quotidiens variables) jusqu'à la clôture de la position.",
    en: "1) Identify which stage of the cycle a given transaction is at. 2) For each stage, identify the cash or securities need it generates: here, quoting, execution, confirmation and clearing generate NO cash movement at all (€0), only settlement generates one, a one-off €5,012,000 (price + accrued coupon). 3) For an open derivative position, add ongoing collateral and margin call tracking (initial margin ≈€250,000 right at execution, then variable daily calls) until the position closes.",
  },
  interpretation: {
    fr: "Un même prix d'exécution peut générer des besoins de trésorerie très différents selon le type d'instrument et le mode de compensation : une action au comptant génère un besoin de trésorerie ponctuel au règlement (J+2 typiquement), tandis qu'un dérivé compensé par une CCP génère des besoins de trésorerie récurrents via les appels de marge quotidiens, bien après l'exécution initiale.",
    en: "The same execution price can generate very different cash needs depending on the instrument type and clearing mode: a cash equity generates a one-off cash need at settlement (typically T+2), while a CCP-cleared derivative generates recurring cash needs via daily margin calls, well after the initial execution.",
  },
  pitfalls: {
    fr: "Ne suivre une position que jusqu'à son exécution, en oubliant les besoins de trésorerie générés par les étapes ultérieures (règlement, appels de marge répétés). Autre piège : confondre la date de négociation (quand l'accord est conclu) avec la date de règlement (quand les titres et les espèces changent effectivement de main) — un échec de règlement à cette dernière date est un risque opérationnel réel, distinct du risque de marché ou de crédit.",
    en: "Only tracking a position through execution, forgetting the cash needs generated by later steps (settlement, repeated margin calls). Another trap: confusing the trade date (when the agreement is concluded) with the settlement date (when securities and cash actually change hands) — a settlement failure on the latter date is a real operational risk, distinct from market or credit risk.",
  },
  keyPoints: {
    fr: [
      "Une transaction traverse plusieurs étapes après l'exécution : confirmation, compensation, règlement, puis collatéral/appels de marge si la position reste ouverte.",
      "Chaque étape peut générer un besoin de trésorerie distinct, pas seulement l'exécution initiale.",
      "La date de négociation (accord) et la date de règlement (échange effectif) sont deux dates distinctes, généralement séparées de quelques jours ouvrés.",
    ],
    en: [
      "A transaction goes through several stages after execution: confirmation, clearing, settlement, then collateral/margin calls if the position stays open.",
      "Each stage can generate a distinct cash need, not just the initial execution.",
      "The trade date (agreement) and the settlement date (actual exchange) are two distinct dates, generally separated by a few business days.",
    ],
  },
  advancedDemonstration: {
    fr: "Le passage d'un règlement bilatéral (deux contreparties se livrent directement) à une compensation via une chambre centrale (CCP) transforme profondément le profil de risque et de trésorerie d'une transaction : la CCP devient la contrepartie légale de chacune des deux parties initiales, impose des appels de marge initiale et de variation systématiques, et compense les positions multiples entre les mêmes intervenants — un mécanisme qui réduit le risque de contrepartie bilatéral (étudié dans le module 4) mais génère des besoins de trésorerie récurrents et prévisibles, très différents d'un règlement ponctuel J+2 sur une action au comptant.",
    en: "Moving from bilateral settlement (two counterparties deliver directly to each other) to clearing via a central counterparty (CCP) profoundly transforms a transaction's risk and cash profile: the CCP becomes the legal counterparty to each of the two original parties, imposes systematic initial and variation margin calls, and nets multiple positions between the same participants — a mechanism that reduces bilateral counterparty risk (studied in module 4) but generates recurring, predictable cash needs, very different from a one-off T+2 settlement on a cash equity.",
  },
  businessApplication: {
    fr: "Un trésorier de banque ou de fonds construit chaque jour une prévision de trésorerie à J+1, J+2, J+3 en additionnant tous les règlements et appels de marge attendus à chaque échéance : sans suivre précisément à quelle étape du cycle se trouve chaque transaction, cette prévision serait incomplète et exposerait l'établissement à un risque de liquidité (ne pas disposer des fonds au bon moment).",
    en: "A bank or fund treasurer builds a daily cash forecast for T+1, T+2, T+3 by summing all expected settlements and margin calls due at each date: without precisely tracking which stage of the cycle each transaction is at, this forecast would be incomplete and expose the institution to liquidity risk (not having the funds available at the right moment).",
  },
  interviewQuestion: {
    question: "Your desk executes a bond trade on Monday. When does the actual cash movement happen, and why does that matter for treasury?",
    answer: "The cash movement doesn't happen at execution — it happens at settlement, typically two business days later under a T+2 convention, so Wednesday in this case. Between Monday and Wednesday, the trade goes through confirmation (both parties attest to the terms) and clearing (net obligations are computed), neither of which moves any cash. This matters for treasury because they need the full settlement amount — price plus accrued interest — available exactly on the settlement date, not on the trade date; getting that timing wrong, or failing to deliver on time, is a real operational risk distinct from market or credit risk. If it were a cleared derivative instead of a cash bond, the cash profile would look completely different: an initial margin payment right at execution, followed by recurring daily variation margin calls for as long as the position stays open.",
  },
};
