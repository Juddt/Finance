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
    fr: "Un trader achète des obligations le lundi (date de négociation). La confirmation avec la contrepartie intervient le jour même ou le lendemain. Le règlement effectif (livraison des titres contre paiement) a lieu deux jours ouvrés plus tard (convention \"J+2\"), moment où la trésorerie de la banque doit effectivement disposer des fonds. Si la position reste ouverte et que le marché évolue, des appels de marge peuvent survenir quotidiennement, générant des besoins de trésorerie supplémentaires bien après l'exécution initiale.",
    en: "A trader buys bonds on Monday (trade date). Confirmation with the counterparty happens the same day or the next. Actual settlement (securities delivered against payment) occurs two business days later (\"T+2\" convention), the moment the bank's treasury must actually have the funds available. If the position stays open and the market moves, margin calls can occur daily, generating additional cash needs well after the initial execution.",
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
    example: { fr: "Achat d'obligations lundi (exécution) → confirmation le jour même → règlement J+2 → appels de marge quotidiens si position dérivée ouverte.", en: "Bond purchase Monday (execution) → same-day confirmation → T+2 settlement → daily margin calls if an open derivative position." },
  },
  calculation: {
    fr: "1) Identifier à quelle étape du cycle se trouve une transaction donnée. 2) Pour chaque étape, identifier le besoin de trésorerie ou de titres qu'elle génère (aucun à la cotation, potentiellement des appels de marge à la confirmation/compensation selon l'instrument, un échange effectif au règlement). 3) Pour une position dérivée qui reste ouverte, ajouter le suivi continu du collatéral et des appels de marge jusqu'à la clôture de la position.",
    en: "1) Identify which stage of the cycle a given transaction is at. 2) For each stage, identify the cash or securities need it generates (none at quoting, potentially margin calls at confirmation/clearing depending on the instrument, an actual exchange at settlement). 3) For an open derivative position, add ongoing collateral and margin call tracking until the position closes.",
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
};
