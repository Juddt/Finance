import type { LessonContent } from "@/lib/lesson-types";

export const m13OrdresLevierMarge: LessonContent = {
  conceptId: "m13-ordres-levier-marge",
  glossary: [
    { term: { fr: "Appel de marge", en: "Margin call" }, definition: { fr: "Une demande du courtier d'ajouter des fonds sur le compte quand la valeur de la position garantie chute trop, sous peine de liquidation forcée.", en: "A broker's request to add funds to the account when the guaranteed position's value falls too much, or face forced liquidation." } },
  ],
  intuition: {
    fr: "Passer un ordre n'est jamais une opération unique et neutre : le TYPE d'ordre choisi (marché, limite, stop) détermine un compromis explicite entre certitude d'exécution et contrôle du prix, tandis que le LEVIER utilisé détermine un compromis entre amplification des gains et amplification des pertes, jusqu'au risque de liquidation forcée.",
    en: "Placing an order is never a single, neutral operation: the order TYPE chosen (market, limit, stop) determines an explicit trade-off between execution certainty and price control, while the LEVERAGE used determines a trade-off between amplified gains and amplified losses, up to forced liquidation risk.",
  },
  definition: {
    fr: "Un ordre au marché s'exécute immédiatement au meilleur prix disponible (certitude d'exécution, prix incertain). Un ordre à cours limité ne s'exécute qu'à un prix choisi ou meilleur (prix garanti, exécution incertaine). Un ordre stop se déclenche automatiquement quand un seuil de prix est franchi, souvent utilisé pour limiter une perte (stop-loss). Le levier permet de prendre une position plus grande que le capital réellement détenu, en empruntant implicitement via un dépôt de marge (une fraction de la valeur totale de la position) ; le P&L (profit and loss) se calcule alors sur la valeur totale de la position, pas seulement sur la marge déposée, ce qui amplifie proportionnellement gains et pertes.",
    en: "A market order executes immediately at the best available price (execution certainty, uncertain price). A limit order only executes at a chosen price or better (guaranteed price, uncertain execution). A stop order triggers automatically once a price threshold is crossed, often used to limit a loss (stop-loss). Leverage lets you take a larger position than the capital actually held, implicitly borrowing via a margin deposit (a fraction of the position's total value); P&L (profit and loss) is then computed on the position's total value, not just the deposited margin, proportionally amplifying gains and losses.",
  },
  utility: {
    fr: "Comprendre ces mécanismes de base est indispensable avant toute discussion de stratégies de trading plus avancées (M13-trading-b) : le choix du type d'ordre a un impact direct sur le coût réel d'exécution (slippage) et le levier détermine directement le risque de liquidation forcée en cas de mouvement de marché défavorable, un risque souvent sous-estimé par les investisseurs novices.",
    en: "Understanding these basic mechanisms is essential before any discussion of more advanced trading strategies (M13-trading-b): the order type choice directly impacts real execution cost (slippage) and leverage directly determines forced liquidation risk in case of an adverse market move, a risk often underestimated by novice investors.",
  },
  example: {
    fr: "Un trader dépose 1000 € de marge pour ouvrir une position à levier 10 (position totale de 10 000 €) sur une action. Si l'action monte de 5%, le gain est de 500 € (5% de 10 000 €), soit 50% de rendement sur la marge déposée. Mais si l'action baisse de 10%, la perte est de 1000 € — la totalité de la marge déposée — déclenchant potentiellement un appel de marge ou une liquidation forcée avant même que la perte n'aille plus loin.",
    en: "A trader deposits €1,000 in margin to open a 10x leveraged position (€10,000 total position) on a stock. If the stock rises 5%, the gain is €500 (5% of €10,000), a 50% return on the deposited margin. But if the stock falls 10%, the loss is €1,000 — the entire deposited margin — potentially triggering a margin call or forced liquidation before the loss even goes further.",
  },
  alternativeExplanation: {
    fr: "Le levier, c'est comme acheter une maison avec un petit acompte et un gros emprunt : si la valeur de la maison monte de 10%, votre gain (en pourcentage de l'acompte) est bien supérieur à 10% ; mais si elle baisse de 10%, votre perte réelle sur l'acompte peut être catastrophique, voire dépasser l'acompte initial. Un ordre stop, dans cette analogie, est comme une clause contractuelle qui force la vente automatique dès que la valeur descend sous un certain seuil, pour éviter une perte encore plus grande.",
    en: "Leverage is like buying a house with a small down payment and a large loan: if the house's value rises 10%, your gain (as a percentage of the down payment) is far above 10%; but if it falls 10%, your real loss on the down payment can be catastrophic, even exceeding the initial down payment. A stop order, in this analogy, is like a contractual clause forcing an automatic sale once the value drops below a certain threshold, to avoid an even larger loss.",
  },
  formula: {
    latex: "\\text{P\\&L} = \\text{Levier} \\times (\\text{Prix}_{\\text{sortie}} - \\text{Prix}_{\\text{entrée}}) \\times \\text{Quantité de base}",
    variables: [
      { symbol: "\\text{Levier}", description: { fr: "Ratio entre la valeur totale de la position et la marge réellement déposée", en: "The ratio between the position's total value and the actually deposited margin" } },
      { symbol: "\\text{Quantité de base}", description: { fr: "Quantité de l'actif que la marge déposée permettrait d'acheter sans effet de levier", en: "The quantity of the asset the deposited margin would buy without leverage" } },
    ],
    assumptions: { fr: "Position simple sans frais de financement du levier, qui existent en pratique et réduisent le P&L net sur la durée de détention.", en: "Simple position with no leverage financing costs, which exist in practice and reduce net P&L over the holding period." },
    units: { fr: "P&L dans la devise de la position.", en: "P&L in the position's currency." },
    example: { fr: "Levier=10, mouvement de prix de +5% : P&L = +50% de la marge déposée, au lieu de +5% sans levier.", en: "Leverage=10, price move of +5%: P&L = +50% of the deposited margin, instead of +5% without leverage." },
  },
  calculation: {
    fr: "1) Déterminer la taille de position totale souhaitée et le levier disponible pour calculer la marge requise (Position/Levier). 2) Choisir le type d'ordre adapté à l'objectif (marché pour une exécution rapide, limite pour un contrôle de prix, stop pour une protection automatique). 3) Calculer le P&L sur la valeur totale de la position, pas sur la marge seule. 4) Surveiller le niveau de marge disponible par rapport au seuil d'appel de marge du courtier, pour anticiper un risque de liquidation forcée.",
    en: "1) Determine the desired total position size and available leverage to compute required margin (Position/Leverage). 2) Choose the order type suited to the objective (market for fast execution, limit for price control, stop for automatic protection). 3) Compute P&L on the position's total value, not the margin alone. 4) Monitor available margin level relative to the broker's margin call threshold, to anticipate forced liquidation risk.",
  },
  interpretation: {
    fr: "Plus le levier est élevé, plus la marge de sécurité avant un appel de marge est faible : un levier de 10 signifie qu'une baisse de 10% de la position efface intégralement la marge déposée. Un ordre stop mal placé (trop proche du prix d'entrée) peut se déclencher sur une fluctuation normale et non représentative d'un vrai retournement de tendance, entraînant une sortie prématurée.",
    en: "The higher the leverage, the smaller the safety margin before a margin call: a leverage of 10 means a 10% position decline entirely wipes out the deposited margin. A poorly placed stop order (too close to the entry price) can trigger on a normal fluctuation not representative of a real trend reversal, leading to a premature exit.",
  },
  pitfalls: {
    fr: "Sous-estimer à quel point le levier amplifie symétriquement gains ET pertes, en se concentrant mentalement uniquement sur le scénario favorable. Autre piège fréquent : utiliser systématiquement des ordres au marché sur des actifs peu liquides, ce qui peut entraîner une exécution à un prix très éloigné du prix affiché (slippage important), alors qu'un ordre à cours limité aurait garanti le prix au prix d'un risque de non-exécution.",
    en: "Underestimating how symmetrically leverage amplifies BOTH gains and losses, mentally focusing only on the favorable scenario. Another frequent trap: systematically using market orders on illiquid assets, which can lead to execution at a price far from the displayed one (significant slippage), when a limit order would have guaranteed the price at the cost of possible non-execution.",
  },
  keyPoints: {
    fr: [
      "Ordre marché : exécution certaine, prix incertain. Ordre limite : prix garanti, exécution incertaine. Ordre stop : déclenchement automatique à un seuil.",
      "Le levier amplifie proportionnellement gains ET pertes par rapport à la marge déposée, jusqu'au risque de liquidation forcée.",
      "Le P&L d'une position à effet de levier se calcule sur la valeur totale de la position, pas uniquement sur la marge.",
    ],
    en: [
      "Market order: certain execution, uncertain price. Limit order: guaranteed price, uncertain execution. Stop order: automatic trigger at a threshold.",
      "Leverage proportionally amplifies BOTH gains and losses relative to the deposited margin, up to forced liquidation risk.",
      "A leveraged position's P&L is computed on the position's total value, not just the margin.",
    ],
  },
  advancedDemonstration: {
    fr: "Le risque de liquidation forcée sous fort effet de levier a une conséquence mathématique souvent sous-estimée : contrairement à une position non levier, où seule la direction du mouvement compte à terme, une position fortement levier peut être liquidée par une baisse TEMPORAIRE même si le prix se redresse ensuite largement au-delà du niveau initial — la trajectoire du prix compte autant que sa destination finale, un phénomène parfois appelé \"risque de ruine\" en gestion quantitative, qui explique pourquoi un dimensionnement de position prudent (Kelly criterion ou fractions conservatrices de celui-ci) est une composante essentielle de toute stratégie utilisant l'effet de levier.",
    en: "Forced liquidation risk under heavy leverage has an often-underestimated mathematical consequence: unlike an unleveraged position, where only the movement's direction ultimately matters, a heavily leveraged position can be liquidated by a TEMPORARY decline even if the price later recovers well beyond its initial level — the price's path matters as much as its final destination, a phenomenon sometimes called \"risk of ruin\" in quantitative management, explaining why prudent position sizing (the Kelly criterion or conservative fractions of it) is an essential component of any strategy using leverage.",
  },
};
