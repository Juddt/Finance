import type { LessonContent } from "@/lib/lesson-types";

export const m05CallPut: LessonContent = {
  conceptId: "m05-call-put",
  prerequisiteReminder: {
    text: {
      fr: "Il faut être à l'aise avec la notion de position longue/courte sur un actif, et savoir qu'un contrat forward est un engagement ferme (à comparer, plus loin, avec une option qui est un droit).",
      en: "You should be comfortable with long/short positions on an asset, and know that a forward contract is a firm commitment (to compare, later, with an option which is a right).",
    },
    conceptIds: ["m02-forward-future-definitions"],
  },
  glossary: [
    {
      term: { fr: "Prime", en: "Premium" },
      definition: {
        fr: "Le prix payé par l'acheteur d'une option à sa conclusion, non remboursable, en échange du droit qu'elle confère.",
        en: "The price paid by an option's buyer at inception, non-refundable, in exchange for the right it grants.",
      },
    },
    {
      term: { fr: "Strike (prix d'exercice)", en: "Strike price" },
      definition: {
        fr: "Le prix fixé à l'avance auquel l'acheteur d'une option peut acheter (call) ou vendre (put) le sous-jacent.",
        en: "The price fixed in advance at which an option's buyer can buy (call) or sell (put) the underlying.",
      },
    },
    {
      term: { fr: "Exercer une option", en: "Exercise an option" },
      definition: {
        fr: "Utiliser le droit conféré par l'option (acheter pour un call, vendre pour un put) au prix strike.",
        en: "Using the right the option grants (buy for a call, sell for a put) at the strike price.",
      },
    },
  ],
  intuition: {
    fr: "Un call donne le DROIT — pas l'obligation — d'acheter un actif à un prix fixé à l'avance. On l'achète quand on pense que le prix va monter, en ne risquant que ce qu'on a payé pour ce droit.",
    en: "A call gives the RIGHT — not the obligation — to buy an asset at a price fixed in advance. You buy one when you think the price will rise, risking only what you paid for that right.",
  },
  definition: {
    fr: "Un call est le droit d'acheter le sous-jacent à un prix K (le strike) ; un put est le droit de le vendre à K. L'acheteur paie une prime pour ce droit et décide librement de l'exercer ou non. Le vendeur encaisse la prime mais a l'obligation de s'exécuter si l'acheteur exerce.",
    en: "A call is the right to buy the underlying at a price K (the strike); a put is the right to sell it at K. The buyer pays a premium for that right and freely decides whether to exercise it. The seller collects the premium but is obligated to perform if the buyer exercises.",
  },
  utility: {
    fr: "Un call permet de profiter d'une hausse (et un put d'une baisse) avec une perte maximale connue et limitée à la prime payée — contrairement à une position directe sur l'actif, où la perte peut être bien plus importante.",
    en: "A call lets you benefit from a rise (and a put from a fall) with a known, limited maximum loss equal to the premium paid — unlike a direct position in the asset, where the loss can be much larger.",
  },
  example: {
    fr: "Vous achetez un call sur une action, strike K = 100 €, prime payée = 5 €. Si l'action vaut 120 € à l'échéance, vous exercez : payoff = 120 − 100 = 20 €, moins la prime de 5 € = profit net de 15 €. Si l'action vaut 95 €, vous n'exercez pas (acheter à 100 € coûterait plus cher que le marché) : vous perdez seulement la prime, soit 5 €.",
    en: "You buy a call on a stock, strike K = 100, premium paid = 5. If the stock is worth 120 at maturity, you exercise: payoff = 120 − 100 = 20, minus the 5 premium = 15 net profit. If the stock is worth 95, you don't exercise (buying at 100 would cost more than the market): you only lose the premium, i.e. 5.",
  },
  alternativeExplanation: {
    fr: "Voyez le call comme une option sur l'achat d'une maison : vous versez un acompte non remboursable (la prime) qui vous réserve le droit de l'acheter à un prix fixé plus tard. Si le marché immobilier monte, vous avez sécurisé un bon prix. S'il baisse, vous laissez tomber votre acompte et achetez ailleurs moins cher — vous ne perdez jamais que l'acompte.",
    en: "Think of a call like an option to buy a house: you pay a non-refundable deposit (the premium) that reserves your right to buy it at a fixed price later. If the property market rises, you've locked in a good price. If it falls, you walk away from your deposit and buy elsewhere for less — you never lose more than the deposit.",
  },
  formula: {
    latex: "\\text{Profit net}_{\\text{call}} = \\max(S_T - K,\\ 0) - p",
    variables: [
      { symbol: "S_T", description: { fr: "Prix du sous-jacent à l'échéance", en: "Underlying price at maturity" } },
      { symbol: "K", description: { fr: "Prix d'exercice (strike)", en: "Strike price" } },
      { symbol: "p", description: { fr: "Prime payée à l'achat de l'option", en: "Premium paid to buy the option" } },
    ],
    assumptions: {
      fr: "Option européenne (exercice seulement à l'échéance T) ; on ignore les frais de transaction ; le payoff max(S_T−K, 0) suppose un exercice rationnel (seulement si S_T > K).",
      en: "European option (exercise only at maturity T); transaction costs ignored; the payoff max(S_T−K, 0) assumes rational exercise (only if S_T > K).",
    },
    units: {
      fr: "S_T, K et p sont dans la même unité monétaire (ex. euros par action).",
      en: "S_T, K and p are in the same currency unit (e.g. euros per share).",
    },
    example: {
      fr: "S_T = 120, K = 100, p = 5 : Profit net = max(120−100, 0) − 5 = 20 − 5 = 15.",
      en: "S_T = 120, K = 100, p = 5: Net profit = max(120−100, 0) − 5 = 20 − 5 = 15.",
    },
  },
  calculation: {
    fr: "1) Comparer S_T à K pour savoir si le call est exercé : s'il ne l'est pas (S_T ≤ K), le payoff brut est nul. 2) Si exercé (S_T > K), calculer le payoff brut = S_T − K. 3) Soustraire la prime déjà payée : Profit net = payoff brut − p. 4) Le seuil de rentabilité (break-even), là où le profit net est nul, est S_T = K + p.",
    en: "1) Compare S_T to K to know if the call is exercised: if not (S_T ≤ K), the gross payoff is zero. 2) If exercised (S_T > K), compute the gross payoff = S_T − K. 3) Subtract the premium already paid: Net profit = gross payoff − p. 4) The break-even point, where net profit is zero, is S_T = K + p.",
  },
  interpretation: {
    fr: "L'acheteur d'un call a un risque limité (perte maximale = la prime, atteinte dès que S_T ≤ K) et un gain potentiellement illimité si le sous-jacent monte beaucoup. Le vendeur du call, lui, a un gain limité à la prime encaissée mais une perte potentiellement illimitée.",
    en: "The call buyer has limited risk (maximum loss = the premium, reached as soon as S_T ≤ K) and potentially unlimited gain if the underlying rises a lot. The call seller, conversely, has a gain limited to the premium collected but potentially unlimited loss.",
  },
  pitfalls: {
    fr: "L'erreur la plus fréquente : confondre payoff brut et profit net. Entre K et K + p, le call est exercé (payoff brut > 0) mais l'acheteur perd quand même de l'argent au net, car le payoff ne couvre pas encore la prime payée. On peut donc perdre de l'argent en achetant un call même quand le prix du sous-jacent a monté au-dessus du strike.",
    en: "The most common mistake: confusing gross payoff with net profit. Between K and K + p, the call is exercised (gross payoff > 0) but the buyer still loses money net, because the payoff doesn't yet cover the premium paid. So you can lose money buying a call even when the underlying's price has risen above the strike.",
  },
  keyPoints: {
    fr: [
      "La perte maximale pour l'acheteur d'un call est toujours limitée à la prime payée (atteinte si S_T ≤ K).",
      "L'acheteur perd de l'argent au net tant que S_T < K + p, même si le call est exercé.",
      "Le gain net est illimité si S_T monte suffisamment au-delà du seuil de rentabilité K + p.",
    ],
    en: [
      "The call buyer's maximum loss is always limited to the premium paid (reached if S_T ≤ K).",
      "The buyer loses money net as long as S_T < K + p, even if the call is exercised.",
      "The net gain is unlimited if S_T rises far enough above the break-even K + p.",
    ],
  },
  advancedDemonstration: {
    fr: "Par symétrie, le put donne le droit de vendre à K : payoff brut = max(K − S_T, 0), profit net = max(K − S_T, 0) − p, avec un seuil de rentabilité à S_T = K − p. Le put a lui aussi une perte maximale limitée à la prime (atteinte si S_T ≥ K), mais son gain maximal est plafonné (le sous-jacent ne peut pas descendre sous zéro), contrairement au call dont le gain est en théorie illimité. Cette asymétrie call/put se retrouve dans la relation de parité call-put (voir M05-3), qui relie rigoureusement le prix d'un call et d'un put de mêmes caractéristiques.",
    en: "By symmetry, a put gives the right to sell at K: gross payoff = max(K − S_T, 0), net profit = max(K − S_T, 0) − p, with a break-even at S_T = K − p. The put also has a maximum loss limited to the premium (reached if S_T ≥ K), but its maximum gain is capped (the underlying cannot go below zero), unlike the call whose gain is theoretically unlimited. This call/put asymmetry is captured by the put-call parity relation (see M05-3), which rigorously links the price of a call and a put with matching characteristics.",
  },
};
