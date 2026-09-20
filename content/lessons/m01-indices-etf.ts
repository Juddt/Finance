import type { LessonContent } from "@/lib/lesson-types";

export const m01IndicesEtf: LessonContent = {
  conceptId: "m01-indices-etf",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est une action et son bénéfice par action, présenté dans la notion précédente.",
      en: "You need to know what a share is and its earnings per share, covered in the previous concept.",
    },
    conceptIds: ["m01-actions-dividendes-ratios"],
  },
  glossary: [
    { term: { fr: "Pondération par capitalisation boursière", en: "Market-cap weighting" }, definition: { fr: "Une méthode de construction d'indice où chaque entreprise pèse dans l'indice à hauteur de sa capitalisation boursière rapportée à celle de l'ensemble des constituants.", en: "An index construction method where each company weighs in the index in proportion to its market capitalization relative to all constituents combined." } },
    { term: { fr: "Réplication synthétique", en: "Synthetic replication" }, definition: { fr: "Une méthode par laquelle un ETF reproduit la performance d'un indice via un contrat d'échange (swap) avec une contrepartie, plutôt qu'en détenant directement les titres de l'indice.", en: "A method by which an ETF reproduces an index's performance via a swap contract with a counterparty, rather than by directly holding the index's securities." } },
  ],
  intuition: {
    fr: "Un indice boursier résume, en un seul chiffre, la performance d'un panier d'actions (\"le marché monte de 1% aujourd'hui\"). Un ETF (fonds coté) est un produit qui réplique cet indice et s'achète et se vend en bourse comme une action ordinaire : au lieu d'acheter individuellement des dizaines d'actions pour reproduire un indice, un investisseur achète une seule part d'ETF.",
    en: "A stock index summarizes, in a single number, the performance of a basket of stocks (\"the market is up 1% today\"). An ETF (exchange-traded fund) is a product that tracks this index and is bought and sold on the exchange like an ordinary share: instead of individually buying dozens of stocks to replicate an index, an investor buys a single ETF share.",
  },
  definition: {
    fr: "La méthode de construction la plus courante pour un indice actions (S&P 500, CAC 40) est la pondération par capitalisation boursière : chaque entreprise pèse dans l'indice proportionnellement à sa valeur boursière totale, si bien que les plus grandes entreprises dominent les mouvements de l'indice. Un ETF réplique un indice de deux façons : la réplication physique (le fonds détient réellement les titres de l'indice) ou la réplication synthétique (le fonds échange sa performance contre celle de l'indice via un swap conclu avec une contrepartie bancaire, introduisant un risque de contrepartie).",
    en: "The most common construction method for an equity index (S&P 500, CAC 40) is market-cap weighting: each company weighs in the index in proportion to its total market value, so the largest companies dominate the index's moves. An ETF tracks an index in two ways: physical replication (the fund actually holds the index's securities) or synthetic replication (the fund exchanges its performance for the index's via a swap with a bank counterparty, introducing counterparty risk).",
  },
  utility: {
    fr: "Les indices servent de référence (benchmark) pour juger la performance d'un gérant actif (voir M13, attribution de performance), et les ETF permettent d'obtenir une exposition diversifiée et peu coûteuse à un marché entier en une seule transaction, sans devoir sélectionner ni gérer individuellement des dizaines de titres. Comprendre leur construction est indispensable pour interpréter correctement tout titre de presse financière évoquant \"le marché\".",
    en: "Indices serve as a benchmark to judge an active manager's performance (see M13, performance attribution), and ETFs provide diversified, low-cost exposure to an entire market in a single transaction, with no need to individually select and manage dozens of securities. Understanding their construction is essential to correctly interpret any financial headline referring to \"the market\".",
  },
  example: {
    fr: "Un indice pondéré par capitalisation boursière regroupe des entreprises dont la capitalisation totale s'élève à 1 000 milliards EUR. Une entreprise de cet indice a une capitalisation de 50 milliards EUR : son poids dans l'indice est de 50/1 000 = 5%. Si cette entreprise double de valeur (sans que les autres ne bougent), son poids grimpe mécaniquement à environ 9,5%, renforçant son influence sur les mouvements futurs de l'indice.",
    en: "A market-cap-weighted index groups companies with a combined market cap of EUR 1,000 billion. One company in this index has a EUR 50 billion market cap: its weight in the index is 50/1,000 = 5%. If this company doubles in value (with others unchanged), its weight mechanically climbs to about 9.5%, reinforcing its influence on the index's future moves.",
  },
  alternativeExplanation: {
    fr: "Voyez un indice comme une note moyenne agrégée d'un ensemble de restaurants, où chaque établissement pèserait dans la moyenne selon sa taille (nombre de couverts) plutôt qu'à égalité : les plus grands restaurants influencent davantage la note globale. Un ETF, c'est un \"pass\" unique qui vous donne accès à l'expérience moyenne de tous ces restaurants sans avoir à réserver individuellement dans chacun.",
    en: "Think of an index as an aggregate average rating of a set of restaurants, where each establishment weighs in the average by its size (number of covers) rather than equally: the largest restaurants influence the overall rating more. An ETF is a single \"pass\" giving you access to the average experience of all these restaurants without individually booking each one.",
  },
  formula: {
    latex: "\\begin{aligned} w_i &= \\frac{\\text{CapBoursière}_i}{\\sum_j \\text{CapBoursière}_j} \\\\ TE &= \\sigma(R_{ETF} - R_{indice}) \\end{aligned}",
    variables: [
      { symbol: "w_i", description: { fr: "Poids de l'entreprise i dans l'indice pondéré par capitalisation", en: "Company i's weight in the cap-weighted index" } },
      { symbol: "\\text{CapBoursière}_i", description: { fr: "Capitalisation boursière de l'entreprise i", en: "Company i's market capitalization" } },
      { symbol: "TE", description: { fr: "Écart de réplication (tracking error) de l'ETF", en: "The ETF's tracking error" } },
      { symbol: "R_{ETF}, R_{indice}", description: { fr: "Rendement de l'ETF et rendement de l'indice répliqué, sur la même période", en: "The ETF's return and the tracked index's return, over the same period" } },
    ],
    assumptions: { fr: "En pratique, la capitalisation utilisée est souvent ajustée du flottant (actions réellement disponibles à l'échange, hors participations bloquées). Ignore la question distincte de l'indice \"prix\" (hors dividendes) vs \"rendement total\" (dividendes réinvestis).", en: "In practice, the market cap used is often free-float adjusted (shares actually available for trading, excluding locked-up stakes). Ignores the separate question of a \"price\" index (excluding dividends) vs a \"total return\" index (dividends reinvested)." },
    units: { fr: "Poids en % ; tracking error en % annualisé.", en: "Weight in %; tracking error in annualized %." },
    example: { fr: "Cap_i=50 mds, Cap totale=1000 mds → w_i=5%.", en: "Cap_i=50bn, Total cap=1000bn → w_i=5%." },
  },
  calculation: {
    fr: "1) Relever la capitalisation boursière de l'entreprise étudiée. 2) Relever la capitalisation boursière totale de l'ensemble des constituants de l'indice. 3) Diviser la première par la seconde pour obtenir le poids de l'entreprise dans l'indice.",
    en: "1) Read off the studied company's market capitalization. 2) Read off the total market capitalization of all the index's constituents combined. 3) Divide the first by the second to get the company's weight in the index.",
  },
  interpretation: {
    fr: "Dans un indice pondéré par capitalisation, les plus grandes entreprises dominent structurellement les mouvements de l'indice : un investisseur qui croit \"diversifier\" en achetant un ETF sur un tel indice peut en réalité rester très concentré sur une poignée de méga-capitalisations. Un faible écart de réplication (tracking error) signale une bonne qualité de réplication de l'ETF, indépendamment de la performance de l'indice lui-même.",
    en: "In a cap-weighted index, the largest companies structurally dominate the index's moves: an investor who believes they are \"diversifying\" by buying an ETF on such an index may in fact remain heavily concentrated in a handful of mega-caps. A low tracking error signals good replication quality by the ETF, independent of the index's own performance.",
  },
  pitfalls: {
    fr: "Confondre un indice \"prix\" (qui ignore les dividendes versés par les constituants) avec un indice \"rendement total\" (qui les réinvestit fictivement) : sur longue période, l'écart cumulé entre les deux peut être considérable. Autre piège fréquent : croire qu'un ETF est par nature sans risque de contrepartie, en oubliant que la réplication synthétique introduit une exposition réelle à la banque contrepartie du swap, même si elle est généralement collatéralisée (voir M04, clearing et collatéral).",
    en: "Confusing a \"price\" index (which ignores dividends paid by constituents) with a \"total return\" index (which fictitiously reinvests them): over a long period, the cumulative gap between the two can be considerable. Another frequent trap: believing an ETF is inherently free of counterparty risk, forgetting synthetic replication introduces real exposure to the swap's bank counterparty, even though it is generally collateralized (see M04, clearing and collateral).",
  },
  keyPoints: {
    fr: [
      "Un indice pondéré par capitalisation boursière est dominé par ses plus grandes entreprises constituantes.",
      "Un ETF réplique un indice physiquement (détention réelle des titres) ou synthétiquement (swap avec une contrepartie, risque de contrepartie).",
      "Indice \"prix\" (hors dividendes) et indice \"rendement total\" (dividendes réinvestis) divergent significativement sur longue période.",
    ],
    en: [
      "A market-cap-weighted index is dominated by its largest constituent companies.",
      "An ETF tracks an index physically (actual holding of securities) or synthetically (swap with a counterparty, counterparty risk).",
      "A \"price\" index (excluding dividends) and a \"total return\" index (dividends reinvested) diverge significantly over a long period.",
    ],
  },
  advancedDemonstration: {
    fr: "Le mécanisme de création/rachat des ETF (via des \"participants autorisés\", de grandes institutions financières) est ce qui maintient le prix de l'ETF proche de sa valeur liquidative : si l'ETF cote au-dessus de la valeur des titres qu'il détient, un participant autorisé peut créer de nouvelles parts en apportant les titres sous-jacents et les revendre en bourse pour capter l'écart (et inversement en cas de décote) — un mécanisme d'arbitrage (voir M01, arbitrage) qui empêche tout écart persistant important. La composition d'un indice change périodiquement (un comité d'indice retire et ajoute des entreprises selon des critères de taille, de liquidité ou sectoriels) : ces changements provoquent des flux d'achat/vente massifs et mécaniques de la part de tous les fonds indiciels qui répliquent l'indice (l'\"effet indice\"), un phénomène bien documenté et parfois exploité par des stratégies de trading dédiées.",
    en: "The ETF creation/redemption mechanism (via \"authorized participants\", large financial institutions) is what keeps the ETF's price close to its net asset value: if the ETF trades above the value of the securities it holds, an authorized participant can create new shares by contributing the underlying securities and sell them on the exchange to capture the gap (and vice versa in case of a discount) — an arbitrage mechanism (see M01, arbitrage) that prevents any large, persistent gap. An index's composition changes periodically (an index committee removes and adds companies based on size, liquidity or sector criteria): these changes trigger massive, mechanical buy/sell flows from all index funds tracking the index (the \"index effect\"), a well-documented phenomenon sometimes exploited by dedicated trading strategies.",
  },
};
