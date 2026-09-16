import type { LessonContent } from "@/lib/lesson-types";

export const m05PariteCallPut: LessonContent = {
  conceptId: "m05-parite-call-put",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le payoff d'un call et d'un put, et l'idée d'actualisation à taux sans risque.",
      en: "You need to know a call and put's payoff, and the idea of discounting at the risk-free rate.",
    },
    conceptIds: ["m05-call-put", "m02-prix-forward-non-arbitrage"],
  },
  glossary: [
    { term: { fr: "Portefeuille de réplication", en: "Replicating portfolio" }, definition: { fr: "Une combinaison d'instruments qui reproduit exactement le payoff d'un autre instrument, ce qui force les deux à avoir le même prix.", en: "A combination of instruments that exactly reproduces another instrument's payoff, which forces both to have the same price." } },
  ],
  intuition: {
    fr: "Un call et un put sur le même sous-jacent et le même strike ne sont pas indépendants : leurs prix sont liés par une relation d'arbitrage stricte, parce que deux façons différentes de combiner call, put et sous-jacent peuvent reproduire exactement le même résultat final.",
    en: "A call and a put on the same underlying and strike are not independent: their prices are tied by a strict arbitrage relationship, because two different ways of combining a call, a put and the underlying can reproduce exactly the same final outcome.",
  },
  definition: {
    fr: "La parité call-put énonce que, pour des options européennes de même strike K et même échéance T sur un actif sans dividende : C − P = S0 − K × (1+r)^(−T), où C et P sont les primes du call et du put, S0 le prix spot, et r le taux sans risque.",
    en: "Put-call parity states that, for European options with the same strike K and maturity T on a non-dividend-paying asset: C − P = S0 − K × (1+r)^(−T), where C and P are the call and put premiums, S0 the spot price, and r the risk-free rate.",
  },
  utility: {
    fr: "Cette relation permet de déduire le prix d'un put à partir de celui d'un call coté (ou inversement), de construire des positions synthétiques (ex. un call synthétique = put + sous-jacent), et de détecter immédiatement une opportunité d'arbitrage si les prix cotés s'en écartent.",
    en: "This relationship lets you infer a put's price from a quoted call (or vice versa), build synthetic positions (e.g. a synthetic call = put + underlying), and immediately spot an arbitrage opportunity if quoted prices deviate from it.",
  },
  example: {
    fr: "S0 = 100, K = 100, r = 3%, T = 1 an, C = 8. Par la parité : P = C − S0 + K×(1+r)^(−T) = 8 − 100 + 100/1,03 ≈ 8 − 100 + 97,09 = 5,09. Si le put coté valait 7 au lieu de 5,09, il serait surévalué et une stratégie d'arbitrage serait possible.",
    en: "S0 = 100, K = 100, r = 3%, T = 1 year, C = 8. By parity: P = C − S0 + K×(1+r)^(−T) = 8 − 100 + 100/1.03 ≈ 8 − 100 + 97.09 = 5.09. If the quoted put were worth 7 instead of 5.09, it would be overpriced and an arbitrage strategy would be possible.",
  },
  alternativeExplanation: {
    fr: "Comparez deux façons d'être exposé à \"détenir l'action à l'échéance, peu importe son prix\" : (1) acheter un call ET placer K actualisé en obligation sans risque (on finira avec l'action si elle vaut plus que K, sinon avec du cash), ou (2) acheter l'action ET un put (on garde l'action si elle monte, on est protégé par le put si elle chute). Ces deux combinaisons produisent exactement le même résultat final quel que soit le prix futur de l'action — elles doivent donc coûter pareil aujourd'hui.",
    en: "Compare two ways of being exposed to \"holding the stock at maturity, whatever its price\": (1) buy a call AND invest the discounted K in a risk-free bond (you end up with the stock if it's worth more than K, otherwise with cash), or (2) buy the stock AND a put (you keep the stock if it rises, you're protected by the put if it falls). These two combinations produce exactly the same final outcome whatever the stock's future price — so they must cost the same today.",
  },
  formula: {
    latex: "C - P = S_0 - K \\times (1+r)^{-T}",
    variables: [
      { symbol: "C, P", description: { fr: "Primes du call et du put européens, même strike K, même échéance T", en: "European call and put premiums, same strike K, same maturity T" } },
      { symbol: "S_0", description: { fr: "Prix spot actuel du sous-jacent", en: "Current spot price of the underlying" } },
      { symbol: "K \\times (1+r)^{-T}", description: { fr: "Valeur actualisée du strike au taux sans risque", en: "Present value of the strike at the risk-free rate" } },
    ],
    assumptions: { fr: "Options européennes uniquement ; actif ne versant aucun dividende pendant la vie des options ; pas de coûts de transaction.", en: "European options only; asset pays no dividend during the options' life; no transaction costs." },
    units: { fr: "Toutes les valeurs dans la même devise.", en: "All values in the same currency." },
    example: { fr: "S0=100, K=100, r=3%, T=1 : C−P = 100 − 100/1,03 ≈ 2,91.", en: "S0=100, K=100, r=3%, T=1: C−P = 100 − 100/1.03 ≈ 2.91." },
  },
  calculation: {
    fr: "1) Identifier C ou P (celui coté sur le marché), S0, K, r et T. 2) Calculer la valeur actualisée du strike : K × (1+r)^(−T). 3) Réarranger la formule pour isoler l'inconnue : P = C − S0 + K(1+r)^(−T), ou C = P + S0 − K(1+r)^(−T). 4) Comparer au prix réellement coté pour détecter un éventuel écart d'arbitrage.",
    en: "1) Identify C or P (whichever is quoted in the market), S0, K, r and T. 2) Compute the strike's present value: K × (1+r)^(−T). 3) Rearrange the formula to isolate the unknown: P = C − S0 + K(1+r)^(−T), or C = P + S0 − K(1+r)^(−T). 4) Compare to the actually quoted price to spot a possible arbitrage gap.",
  },
  interpretation: {
    fr: "Cette relation ne dit rien sur la direction future du marché : c'est une contrainte d'arbitrage pure entre deux instruments cotés au même instant. Un call vaut structurellement plus qu'un put de même strike dès que S0 dépasse la valeur actualisée de K, et inversement.",
    en: "This relationship says nothing about the market's future direction: it is a pure arbitrage constraint between two instruments quoted at the same instant. A call is structurally worth more than a put of the same strike as soon as S0 exceeds the discounted value of K, and vice versa.",
  },
  pitfalls: {
    fr: "Appliquer la formule telle quelle à une option américaine : la parité stricte ne vaut que pour les options européennes, car la possibilité d'exercice anticipé casse l'argument de réplication. Autre piège : oublier d'ajuster la formule en présence de dividendes (voir démonstration avancée).",
    en: "Applying the formula as-is to an American option: strict parity only holds for European options, because the possibility of early exercise breaks the replication argument. Another trap: forgetting to adjust the formula when dividends are present (see the advanced demonstration).",
  },
  keyPoints: {
    fr: [
      "C − P = S0 − K(1+r)^(−T) pour des options européennes de même strike et échéance.",
      "Cette relation vient d'un argument de réplication (portefeuille équivalent), pas d'une vue de marché.",
      "Elle ne s'applique pas telle quelle aux options américaines ni sans ajustement en présence de dividendes.",
    ],
    en: [
      "C − P = S0 − K(1+r)^(−T) for European options with the same strike and maturity.",
      "This relationship comes from a replication argument (an equivalent portfolio), not a market view.",
      "It does not apply as-is to American options, nor without adjustment when dividends are present.",
    ],
  },
  advancedDemonstration: {
    fr: "En présence d'un dividende connu de valeur actuelle PV(div) versé pendant la vie de l'option, la parité devient C − P = S0 − PV(div) − K(1+r)^(−T) : le dividende réduit la valeur du call (il n'en bénéficie pas) et augmente relativement celle du put. Preuve par arbitrage : si C − P > S0 − K(1+r)^(−T), on vend le call, on achète le put et on achète l'action (financée par emprunt) ; le portefeuille combiné dégage un profit sans risque quelle que soit l'évolution de S. Cette démonstration ne suppose absolument rien sur la loi de probabilité suivie par S — c'est ce qui rend la parité valable même sous des hypothèses de modèle très différentes (Black-Scholes, volatilité stochastique, etc.), contrairement aux formules de pricing elles-mêmes qui, elles, dépendent fortement du modèle choisi.",
    en: "With a known dividend of present value PV(div) paid during the option's life, parity becomes C − P = S0 − PV(div) − K(1+r)^(−T): the dividend reduces the call's value (it does not benefit from it) and relatively increases the put's. Arbitrage proof: if C − P > S0 − K(1+r)^(−T), sell the call, buy the put and buy the stock (financed by borrowing); the combined portfolio locks in a risk-free profit whatever S does. This proof assumes absolutely nothing about the probability law followed by S — which is what makes parity hold even under very different model assumptions (Black-Scholes, stochastic volatility, etc.), unlike the pricing formulas themselves, which depend heavily on the chosen model.",
  },
};
