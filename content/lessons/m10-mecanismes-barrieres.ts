import type { LessonContent } from "@/lib/lesson-types";

export const m10MecanismesBarrieres: LessonContent = {
  conceptId: "m10-mecanismes-barrieres",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le payoff d'un call/put classique et les stratégies optionnelles.",
      en: "You need to know a classic call/put's payoff and option strategies.",
    },
    conceptIds: ["m05-call-put", "m05-strategies-classiques"],
  },
  glossary: [
    { term: { fr: "Rebate", en: "Rebate" }, definition: { fr: "Un montant fixe versé au détenteur en compensation, quand une barrière est (ou n'est pas) touchée.", en: "A fixed amount paid to the holder as compensation, when a barrier is (or isn't) touched." } },
    { term: { fr: "Observation continue / discrète", en: "Continuous / discrete observation" }, definition: { fr: "La barrière est surveillée en permanence (continue) ou seulement à des instants précis (discrète, ex. chaque clôture journalière).", en: "The barrier is watched permanently (continuous) or only at specific instants (discrete, e.g. each daily close)." } },
  ],
  intuition: {
    fr: "Une option barrière est une option vanille à laquelle on ajoute une condition supplémentaire : elle n'existe (ou cesse d'exister) que si le sous-jacent touche un certain niveau de prix avant l'échéance. Cette condition la rend moins chère qu'une option classique, en échange d'un risque supplémentaire pour l'acheteur.",
    en: "A barrier option is a vanilla option with an added condition: it exists (or stops existing) only if the underlying touches a certain price level before expiry. This condition makes it cheaper than a classic option, in exchange for extra risk for the buyer.",
  },
  definition: {
    fr: "Un knock-out (KO) disparaît (devient sans valeur, sauf rebate éventuel) si la barrière est touchée ; un knock-in (KI) n'existe (ne s'active) que si la barrière est touchée. Chacun peut être \"up\" (barrière au-dessus du spot initial) ou \"down\" (en dessous). La barrière peut être surveillée en continu ou seulement à des dates discrètes, ce qui change la probabilité de la toucher.",
    en: "A knock-out (KO) vanishes (becomes worthless, except for a possible rebate) if the barrier is touched; a knock-in (KI) only exists (activates) if the barrier is touched. Each can be \"up\" (barrier above the initial spot) or \"down\" (below). The barrier can be monitored continuously or only on discrete dates, which changes the probability of touching it.",
  },
  utility: {
    fr: "Les options barrières permettent de payer moins cher une protection ou un pari qu'on juge \"moins nécessaire\" dans certains scénarios (par exemple, une protection qui disparaît si le marché monte suffisamment) — elles sont la brique de base de nombreux produits structurés, notamment les autocalls (M11).",
    en: "Barrier options let you pay less for protection or a bet you judge \"less necessary\" in certain scenarios (for example, protection that vanishes if the market rises enough) — they are the building block of many structured products, notably autocalls (M11).",
  },
  example: {
    fr: "Un call up-and-out sur une action à 100, barrière à 130, strike 100 : si l'action reste sous 130 jusqu'à l'échéance et termine à 120, le détenteur reçoit 120−100=20. Mais si l'action touche 130 à un moment quelconque avant l'échéance, même si elle redescend ensuite à 120, l'option est \"tuée\" (knock-out) et ne vaut plus rien (sauf rebate prévu au contrat).",
    en: "An up-and-out call on a stock at 100, barrier at 130, strike 100: if the stock stays below 130 until expiry and ends at 120, the holder receives 120−100=20. But if the stock touches 130 at any point before expiry, even if it later falls back to 120, the option is \"killed\" (knocked out) and is worth nothing (except for any rebate specified in the contract).",
  },
  alternativeExplanation: {
    fr: "Pensez à un pari sportif avec une clause d'annulation : vous pariez sur le résultat final du match, mais le pari est automatiquement annulé si un événement précis se produit en cours de match (par exemple un carton rouge) — peu importe ce qui se passe ensuite. Le knock-in est l'inverse : le pari n'est activé QUE si cet événement se produit.",
    en: "Think of a sports bet with a cancellation clause: you bet on the match's final result, but the bet is automatically canceled if a specific event occurs during the match (say, a red card) — whatever happens afterward. A knock-in is the reverse: the bet is ONLY activated IF that event occurs.",
  },
  formula: {
    latex: "\\text{Payoff}_{\\text{DO call}} = \\mathbb{1}_{\\{\\min_{0 \\le t \\le T} S_t > H\\}} \\times \\max(S_T - K, 0) + R \\times \\mathbb{1}_{\\{\\min_{0 \\le t \\le T} S_t \\le H\\}}",
    variables: [
      { symbol: "H", description: { fr: "Niveau de la barrière", en: "The barrier level" } },
      { symbol: "\\min_{0 \\le t \\le T} S_t", description: { fr: "Le plus bas niveau atteint par le sous-jacent sur toute la période, jusqu'à T", en: "The lowest level reached by the underlying over the whole period, up to T" } },
      { symbol: "R", description: { fr: "Rebate versé si la barrière est touchée (souvent nul)", en: "Rebate paid if the barrier is touched (often zero)" } },
    ],
    assumptions: { fr: "Exemple d'un call down-and-out (DO) : la barrière H est ici inférieure au spot initial.", en: "Example of a down-and-out (DO) call: here the barrier H is below the initial spot." },
    units: { fr: "Payoff dans la devise du sous-jacent.", en: "Payoff in the underlying's currency." },
    example: { fr: "S0=100, K=100, H=80, R=0. Si min(S_t)=85>80 sur toute la période et S_T=110 : Payoff = 110−100 = 10. Si min(S_t)=78≤80 à un moment : Payoff = 0, quel que soit S_T ensuite.", en: "S0=100, K=100, H=80, R=0. If min(S_t)=85>80 over the whole period and S_T=110: Payoff = 110−100 = 10. If min(S_t)=78≤80 at any point: Payoff = 0, whatever S_T does afterward." },
  },
  calculation: {
    fr: "1) Identifier le type de barrière (up/down, in/out) et son niveau H. 2) Observer si le sous-jacent a touché H à un moment quelconque avant l'échéance (selon la fréquence d'observation prévue). 3) Si la condition de knock-out est déclenchée, le payoff est le rebate (souvent 0). 4) Sinon, calculer le payoff comme une option vanille classique.",
    en: "1) Identify the barrier type (up/down, in/out) and its level H. 2) Observe whether the underlying touched H at any point before expiry (per the specified observation frequency). 3) If the knock-out condition is triggered, the payoff is the rebate (often 0). 4) Otherwise, compute the payoff as a classic vanilla option.",
  },
  interpretation: {
    fr: "Une observation discrète (par exemple, seulement à la clôture chaque jour) réduit légèrement la probabilité de toucher la barrière par rapport à une observation continue, car le sous-jacent peut techniquement dépasser la barrière en intraday sans que cela soit \"vu\" par le contrat — un détail contractuel qui a un impact réel et mesurable sur le prix (voir M10-5).",
    en: "Discrete observation (for example, only at each day's close) slightly reduces the probability of touching the barrier compared to continuous observation, since the underlying can technically breach the barrier intraday without the contract \"seeing\" it — a contractual detail with a real, measurable price impact (see M10-5).",
  },
  pitfalls: {
    fr: "Croire qu'un knock-out \"revit\" si le sous-jacent revient dans la zone autorisée après avoir touché la barrière : une fois déclenché, le knock-out est définitif et irréversible pour toute la durée de vie restante du contrat. Autre piège : confondre knock-in et knock-out, une inversion fréquente qui change complètement le profil de risque.",
    en: "Believing a knock-out \"comes back to life\" if the underlying returns to the allowed zone after touching the barrier: once triggered, the knock-out is final and irreversible for the contract's entire remaining life. Another trap: confusing knock-in and knock-out, a frequent mix-up that completely changes the risk profile.",
  },
  keyPoints: {
    fr: [
      "Knock-out : disparaît si la barrière est touchée. Knock-in : n'existe que si elle est touchée.",
      "Up (barrière au-dessus du spot) ou down (en dessous) ; observation continue ou discrète.",
      "Le rebate compense (partiellement) le détenteur quand la condition de barrière se déclenche défavorablement.",
    ],
    en: [
      "Knock-out: vanishes if the barrier is touched. Knock-in: only exists if it's touched.",
      "Up (barrier above spot) or down (below); continuous or discrete observation.",
      "The rebate (partially) compensates the holder when the barrier condition triggers unfavorably.",
    ],
  },
  advancedDemonstration: {
    fr: "Il existe huit combinaisons de base (up/down × in/out × call/put), chacune avec un profil de risque distinct. La probabilité de toucher une barrière (et donc le prix de l'option) dépend fortement de la volatilité et de la distance entre le spot et la barrière — cette sensibilité, parfois contre-intuitive (une volatilité plus élevée peut FAIRE BAISSER la valeur d'un knock-out, voir M10-5), est l'une des raisons pour lesquelles les options barrières sont considérées comme des produits \"exotiques\" nécessitant une gestion des risques spécifique, au-delà des Greeks vanilles standards (voir M10-2).",
    en: "There are eight basic combinations (up/down × in/out × call/put), each with a distinct risk profile. The probability of touching a barrier (and hence the option's price) depends heavily on volatility and the distance between spot and barrier — this sometimes counter-intuitive sensitivity (higher volatility can LOWER a knock-out's value, see M10-5) is one reason barrier options are considered \"exotic\" products requiring specific risk management, beyond standard vanilla Greeks (see M10-2).",
  },
};
