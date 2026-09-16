import type { LessonContent } from "@/lib/lesson-types";

export const m01MicrostructureRappels: LessonContent = {
  conceptId: "m01-microstructure-rappels",
  glossary: [
    { term: { fr: "Carnet d'ordres", en: "Order book" }, definition: { fr: "La liste, à un instant donné, de tous les ordres d'achat et de vente en attente sur un titre, classés par prix.", en: "The list, at a given moment, of all pending buy and sell orders on a security, ranked by price." } },
    { term: { fr: "Teneur de marché (market maker)", en: "Market maker" }, definition: { fr: "Un intervenant qui affiche en permanence des prix d'achat et de vente pour fournir de la liquidité, rémunéré par le spread.", en: "A participant who continuously posts buy and sell prices to provide liquidity, compensated by the spread." } },
  ],
  intuition: {
    fr: "Acheter ou vendre un titre a toujours un coût caché : le prix auquel on peut acheter immédiatement (ask) est toujours un peu plus élevé que le prix auquel on peut vendre immédiatement (bid). Cet écart, le spread, rémunère celui qui accepte d'être immédiatement disponible en face de vous.",
    en: "Buying or selling a security always has a hidden cost: the price at which you can buy immediately (ask) is always a bit higher than the price at which you can sell immediately (bid). This gap, the spread, compensates whoever agrees to be immediately available on the other side of your trade.",
  },
  definition: {
    fr: "Le bid est le meilleur prix auquel un acheteur est prêt à acheter ; l'ask (ou offer) le meilleur prix auquel un vendeur est prêt à vendre. Le spread bid-ask est la différence entre les deux. Le carnet d'ordres liste tous les ordres en attente à différents niveaux de prix. La liquidité d'un marché mesure la facilité à acheter ou vendre rapidement sans faire bouger le prix.",
    en: "The bid is the best price a buyer is willing to buy at; the ask (or offer) the best price a seller is willing to sell at. The bid-ask spread is the difference between the two. The order book lists all pending orders at different price levels. A market's liquidity measures how easily one can buy or sell quickly without moving the price.",
  },
  utility: {
    fr: "Ce vocabulaire est la base de toute intervention sur un marché, quel que soit l'instrument : comprendre le spread permet d'évaluer le coût réel d'une transaction, et la profondeur du carnet d'ordres permet d'anticiper l'impact de marché d'un ordre de taille importante.",
    en: "This vocabulary is the basis of any market interaction, whatever the instrument: understanding the spread lets you assess a transaction's real cost, and the order book's depth lets you anticipate the market impact of a large order.",
  },
  example: {
    fr: "Une action affiche bid = 99,98 EUR, ask = 100,02 EUR. Un acheteur pressé paie 100,02 EUR (l'ask), un vendeur pressé reçoit 99,98 EUR (le bid). Le spread de 0,04 EUR est le coût implicite de l'immédiateté, réparti entre les deux parties selon qui a le plus \"besoin\" d'exécuter tout de suite.",
    en: "A stock shows bid = EUR 99.98, ask = EUR 100.02. An urgent buyer pays EUR 100.02 (the ask), an urgent seller receives EUR 99.98 (the bid). The EUR 0.04 spread is the implicit cost of immediacy, split between the two sides depending on who most \"needs\" to execute right away.",
  },
  alternativeExplanation: {
    fr: "Pensez à un bureau de change à l'aéroport : il affiche toujours un prix d'achat de devises et un prix de vente différent, l'écart étant sa marge pour le service rendu (être disponible tout de suite, sans que vous ayez à chercher un particulier voulant échanger dans l'autre sens au même moment). Le market maker sur un marché financier joue exactement ce rôle.",
    en: "Think of an airport currency exchange booth: it always posts a buy price and a different sell price for currencies, the gap being its margin for the service rendered (being available right now, so you don't have to find an individual wanting to trade the other way at the same moment). A financial market's market maker plays exactly this role.",
  },
  formula: {
    latex: "\\text{Spread} = P_{\\text{ask}} - P_{\\text{bid}} \\quad ; \\quad P_{\\text{mid}} = \\frac{P_{\\text{ask}} + P_{\\text{bid}}}{2}",
    variables: [
      { symbol: "P_{\\text{ask}}", description: { fr: "Meilleur prix de vente affiché", en: "Best posted sell price" } },
      { symbol: "P_{\\text{bid}}", description: { fr: "Meilleur prix d'achat affiché", en: "Best posted buy price" } },
      { symbol: "P_{\\text{mid}}", description: { fr: "Prix milieu, souvent utilisé comme référence \"juste\"", en: "Mid price, often used as a \"fair\" reference" } },
    ],
    assumptions: { fr: "Spread mesuré au meilleur niveau du carnet (\"top of book\"), sans tenir compte de la profondeur disponible à ce prix.", en: "Spread measured at the book's best level (\"top of book\"), ignoring the depth available at that price." },
    units: { fr: "Même unité que le prix du titre.", en: "Same unit as the security's price." },
    example: { fr: "Bid=99,98, Ask=100,02 : Spread=0,04, Mid=100,00.", en: "Bid=99.98, Ask=100.02: Spread=0.04, Mid=100.00." },
  },
  calculation: {
    fr: "1) Relever le meilleur bid et le meilleur ask affichés dans le carnet. 2) Soustraire pour obtenir le spread. 3) Faire la moyenne des deux pour obtenir le prix milieu, souvent utilisé comme référence de valorisation. 4) Comparer le spread au prix milieu pour obtenir un spread relatif (en %), plus comparable entre titres de prix différents.",
    en: "1) Read off the best bid and best ask posted in the book. 2) Subtract to get the spread. 3) Average the two to get the mid price, often used as a valuation reference. 4) Compare the spread to the mid price to get a relative spread (in %), more comparable across securities with different prices.",
  },
  interpretation: {
    fr: "Un spread étroit signale un marché liquide et concurrentiel (beaucoup de teneurs de marché) ; un spread large signale un marché illiquide, risqué à trader, ou dominé par peu d'intervenants. Le spread s'élargit typiquement en période de forte incertitude, car les teneurs de marché exigent une compensation plus élevée pour le risque de détenir une position.",
    en: "A tight spread signals a liquid, competitive market (many market makers); a wide spread signals an illiquid market, risky to trade, or dominated by few participants. The spread typically widens during high uncertainty, since market makers demand higher compensation for the risk of holding a position.",
  },
  pitfalls: {
    fr: "Croire que le prix mid est le prix auquel on peut réellement trader : en pratique, on achète toujours à l'ask et on vend toujours au bid, jamais au mid (sauf ordre limite qui attend d'être exécuté). Autre piège : ignorer la profondeur du carnet au-delà du meilleur niveau — un gros ordre peut \"manger\" plusieurs niveaux de prix et obtenir un prix moyen bien pire que le seul meilleur bid/ask affiché.",
    en: "Believing the mid price is the price you can actually trade at: in practice, you always buy at the ask and always sell at the bid, never at the mid (unless a limit order waits to be filled). Another trap: ignoring the book's depth beyond the best level — a large order can \"eat through\" several price levels and get an average price much worse than just the best posted bid/ask.",
  },
  keyPoints: {
    fr: [
      "Bid = meilleur prix d'achat affiché ; Ask = meilleur prix de vente affiché ; Spread = Ask − Bid.",
      "Le market maker fournit de la liquidité en continu, rémunéré par le spread.",
      "Un spread étroit signale un marché liquide ; il s'élargit en période d'incertitude.",
    ],
    en: [
      "Bid = best posted buy price; Ask = best posted sell price; Spread = Ask − Bid.",
      "The market maker continuously provides liquidity, compensated by the spread.",
      "A tight spread signals a liquid market; it widens during periods of uncertainty.",
    ],
  },
  advancedDemonstration: {
    fr: "Le trading haute fréquence (HFT) a considérablement réduit les spreads sur les marchés les plus liquides depuis les années 2000, en automatisant le rôle de teneur de marché à des échelles de temps de l'ordre de la microseconde — mais a aussi introduit de nouveaux risques (flash crashes, où le carnet se vide brutalement quand tous les teneurs de marché retirent leurs ordres simultanément face à un choc). Au-delà du spread coté, le coût réel d'exécution d'un gros ordre se mesure par le \"slippage\" ou \"impact de marché\" : la différence entre le prix mid observé avant l'ordre et le prix moyen réellement obtenu, qui croît avec la taille de l'ordre relativement à la profondeur du carnet.",
    en: "High-frequency trading (HFT) has considerably narrowed spreads on the most liquid markets since the 2000s, by automating the market-maker role at microsecond timescales — but has also introduced new risks (flash crashes, where the book empties abruptly as all market makers simultaneously pull their orders facing a shock). Beyond the quoted spread, the real execution cost of a large order is measured by \"slippage\" or \"market impact\": the difference between the mid price observed before the order and the average price actually obtained, which grows with the order's size relative to the book's depth.",
  },
};
