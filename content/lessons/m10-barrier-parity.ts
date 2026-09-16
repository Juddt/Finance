import type { LessonContent } from "@/lib/lesson-types";

export const m10BarrierParity: LessonContent = {
  conceptId: "m10-barrier-parity",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les mécanismes knock-in/knock-out et la parité call-put.",
      en: "You need to know knock-in/knock-out mechanics and put-call parity.",
    },
    conceptIds: ["m10-mecanismes-barrieres", "m05-parite-call-put"],
  },
  glossary: [
    { term: { fr: "In-out parity", en: "In-out parity" }, definition: { fr: "Un autre nom pour la barrier parity, insistant sur la complémentarité entre la version \"in\" et la version \"out\" du même contrat.", en: "Another name for barrier parity, emphasizing the complementarity between the \"in\" and \"out\" versions of the same contract." } },
  ],
  intuition: {
    fr: "À tout instant, le sous-jacent est soit dans l'état \"a touché la barrière\", soit dans l'état \"ne l'a pas touchée\" — ces deux états sont exhaustifs et mutuellement exclusifs. Détenir simultanément la version knock-in ET la version knock-out d'une même option revient donc exactement à détenir l'option vanille correspondante, quel que soit le scénario.",
    en: "At any instant, the underlying is either in the state \"touched the barrier\" or \"didn't touch it\" — these two states are exhaustive and mutually exclusive. Simultaneously holding both the knock-in AND the knock-out version of the same option is therefore exactly equivalent to holding the corresponding vanilla option, whatever the scenario.",
  },
  definition: {
    fr: "La barrier parity (ou in-out parity) énonce que, pour une même barrière H, un même strike K et une même échéance T (et en l'absence de rebate) : Option knock-in + Option knock-out (même type call/put, même sens up/down) = Option vanille correspondante.",
    en: "Barrier parity (or in-out parity) states that, for the same barrier H, strike K and maturity T (and with no rebate): Knock-in option + Knock-out option (same call/put type, same up/down direction) = the corresponding vanilla option.",
  },
  utility: {
    fr: "Cette relation permet de pricer et de vérifier n'importe quelle option knock-in à partir de son knock-out correspondant (ou inversement), simplement en connaissant le prix de l'option vanille — un outil de vérification et de réplication indispensable pour tout desk exotique.",
    en: "This relationship lets you price and check any knock-in option from its corresponding knock-out (or vice versa), simply by knowing the vanilla option's price — an essential verification and replication tool for any exotics desk.",
  },
  example: {
    fr: "Un call vanille K=100 vaut 9,50. Un call down-and-out (DO), barrière H=80, vaut 8,20 (il vaut presque autant que le vanille, car la barrière est loin). Par la parité, le call down-and-in (DI) correspondant vaut 9,50−8,20 = 1,30 — une valeur faible, cohérente avec le fait qu'il ne s'active que dans un scénario de forte baisse suivie d'une remontée, un scénario peu probable ici.",
    en: "A vanilla call K=100 is worth 9.50. A down-and-out (DO) call, barrier H=80, is worth 8.20 (worth almost as much as the vanilla, since the barrier is far away). By parity, the corresponding down-and-in (DI) call is worth 9.50−8.20 = 1.30 — a low value, consistent with it only activating in a sharp-decline-then-rebound scenario, unlikely here.",
  },
  alternativeExplanation: {
    fr: "Imaginez diviser un jeu de cartes complet en deux tas selon un critère (par exemple, cartes rouges vs cartes noires) : posséder les deux tas revient exactement à posséder le jeu complet, quel que soit le critère de partage choisi. La barrier parity fait la même chose avec les scénarios de marché : \"a touché H\" et \"n'a pas touché H\" partitionnent complètement l'univers des possibles, donc knock-in + knock-out = le jeu complet (l'option vanille).",
    en: "Picture splitting a full deck of cards into two piles by some criterion (say, red cards vs black cards): owning both piles is exactly equivalent to owning the full deck, whatever the splitting criterion. Barrier parity does the same with market scenarios: \"touched H\" and \"didn't touch H\" completely partition the universe of possibilities, so knock-in + knock-out = the full deck (the vanilla option).",
  },
  formula: {
    latex: "C_{\\text{vanille}} = C_{\\text{DI}} + C_{\\text{DO}}",
    variables: [
      { symbol: "C_{\\text{vanille}}", description: { fr: "Prix du call vanille de même strike et échéance", en: "The price of the vanilla call with the same strike and maturity" } },
      { symbol: "C_{\\text{DI}}, C_{\\text{DO}}", description: { fr: "Prix du call down-and-in et du call down-and-out, même barrière H", en: "The down-and-in and down-and-out call's prices, same barrier H" } },
    ],
    assumptions: { fr: "Aucun rebate sur les deux contrats barrière ; même strike, échéance, barrière et sens (up/down) partagés par les trois contrats.", en: "No rebate on either barrier contract; same strike, maturity, barrier and direction (up/down) shared by all three contracts." },
    units: { fr: "Prix dans la devise du sous-jacent.", en: "Prices in the underlying's currency." },
    example: { fr: "C_vanille=9,50, C_DO=8,20 : C_DI = 9,50−8,20 = 1,30.", en: "C_vanilla=9.50, C_DO=8.20: C_DI = 9.50−8.20 = 1.30." },
  },
  calculation: {
    fr: "1) Identifier le prix de l'option vanille correspondante (même strike, échéance, type call/put). 2) Identifier le prix de l'un des deux contrats barrière (in ou out) déjà connu. 3) Soustraire ce prix connu du prix vanille pour obtenir le prix du contrat barrière manquant. 4) Vérifier la cohérence : les deux prix barrière doivent être positifs et leur somme égale exactement le vanille.",
    en: "1) Identify the corresponding vanilla option's price (same strike, maturity, call/put type). 2) Identify the price of one of the two barrier contracts (in or out) already known. 3) Subtract that known price from the vanilla price to get the missing barrier contract's price. 4) Sanity-check: both barrier prices must be positive and sum exactly to the vanilla price.",
  },
  interpretation: {
    fr: "Cette parité est une identité d'arbitrage exacte (comme la parité call-put, M05-3), valable indépendamment du modèle de pricing utilisé — elle doit être vérifiée par TOUT modèle cohérent, du plus simple au plus sophistiqué, ce qui en fait un test de cohérence précieux pour valider un système de pricing exotique.",
    en: "This parity is an exact arbitrage identity (like put-call parity, M05-3), valid independent of the pricing model used — it must hold under ANY consistent model, from the simplest to the most sophisticated, making it a valuable consistency check to validate an exotics pricing system.",
  },
  pitfalls: {
    fr: "Appliquer la parité entre des contrats de barrières ou de sens (up/down) différents : elle ne fonctionne QUE si les deux contrats barrière partagent exactement la même barrière, le même strike, la même échéance et le même sens. Autre piège : oublier l'ajustement nécessaire si l'un des deux contrats prévoit un rebate non nul, qui doit être retranché avant d'appliquer la parité \"pure\".",
    en: "Applying parity between contracts with different barriers or directions (up/down): it ONLY works if both barrier contracts share exactly the same barrier, strike, maturity and direction. Another trap: forgetting the adjustment needed if one contract has a non-zero rebate, which must be stripped out before applying the \"pure\" parity.",
  },
  keyPoints: {
    fr: [
      "Knock-in + Knock-out (mêmes caractéristiques, sans rebate) = Option vanille correspondante.",
      "C'est une identité d'arbitrage exacte, indépendante du modèle de pricing utilisé.",
      "Elle sert de test de cohérence et permet de déduire le prix d'un contrat à partir de l'autre et du vanille.",
    ],
    en: [
      "Knock-in + Knock-out (same characteristics, no rebate) = the corresponding vanilla option.",
      "It's an exact arbitrage identity, independent of the pricing model used.",
      "It serves as a consistency check and lets you derive one contract's price from the other and the vanilla.",
    ],
  },
  advancedDemonstration: {
    fr: "En présence d'un rebate R_in (versé au knock-in si la barrière est touchée, remboursé immédiatement ou à l'échéance selon convention) et R_out (versé au knock-out), la parité s'ajuste en tenant compte de la valeur actualisée de ces rebates : C_vanille = C_DI + C_DO − PV(R_in) − PV(R_out) si les deux rebates sont positifs et payés en cas de déclenchement (les signes exacts dépendent de la convention contractuelle précise). Cette généralisation est essentielle en pratique, car de nombreux contrats structurés incluent effectivement un rebate non nul pour adoucir le risque de knock-out pour l'investisseur final.",
    en: "In the presence of a rebate R_in (paid on the knock-in if the barrier is touched, refunded immediately or at maturity depending on convention) and R_out (paid on the knock-out), parity adjusts to account for the present value of these rebates: C_vanilla = C_DI + C_DO − PV(R_in) − PV(R_out) if both rebates are positive and paid upon triggering (the exact signs depend on the precise contractual convention). This generalization matters in practice, since many structured contracts do include a non-zero rebate to soften the knock-out risk for the end investor.",
  },
};
