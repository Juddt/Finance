import type { LessonContent } from "@/lib/lesson-types";

export const m05ItmAtmOtm: LessonContent = {
  conceptId: "m05-itm-atm-otm",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le payoff d'un call et d'un put, et la notion de prime.",
      en: "You need to know a call and put's payoff, and what a premium is.",
    },
    conceptIds: ["m05-call-put"],
  },
  glossary: [
    { term: { fr: "Valeur intrinsèque", en: "Intrinsic value" }, definition: { fr: "Le gain immédiat qu'on obtiendrait en exerçant l'option tout de suite, jamais négatif.", en: "The immediate gain from exercising the option right now, never negative." } },
    { term: { fr: "Valeur temps", en: "Time value" }, definition: { fr: "La part de la prime qui dépasse la valeur intrinsèque, reflétant l'incertitude et le temps restant avant l'échéance.", en: "The part of the premium beyond intrinsic value, reflecting uncertainty and the time left before expiry." } },
  ],
  intuition: {
    fr: "ITM, ATM, OTM décrivent juste où se situe le prix actuel du sous-jacent par rapport au prix d'exercice : si vous exerciez l'option maintenant, gagneriez-vous quelque chose, rien, ou seriez-vous pile à l'équilibre ?",
    en: "ITM, ATM, OTM simply describe where the underlying's current price sits relative to the strike: if you exercised the option right now, would you gain something, nothing, or be exactly at breakeven?",
  },
  definition: {
    fr: "Une option européenne ne peut être exercée qu'à l'échéance ; une option américaine peut l'être à tout moment jusqu'à l'échéance. Un call est \"in the money\" (ITM) si S > K, \"at the money\" (ATM) si S ≈ K, \"out of the money\" (OTM) si S < K (inversement pour un put). La prime se décompose toujours en valeur intrinsèque + valeur temps.",
    en: "A European option can only be exercised at expiry; an American option can be exercised at any time up to expiry. A call is \"in the money\" (ITM) if S > K, \"at the money\" (ATM) if S ≈ K, \"out of the money\" (OTM) if S < K (the reverse for a put). The premium always decomposes into intrinsic value + time value.",
  },
  utility: {
    fr: "Ce vocabulaire est utilisé en permanence sur un desk d'options pour décrire rapidement une position, choisir un strike de stratégie, ou comprendre pourquoi une prime vaut ce qu'elle vaut.",
    en: "This vocabulary is used constantly on an options desk to quickly describe a position, choose a strike for a strategy, or understand why a premium is worth what it is.",
  },
  example: {
    fr: "Un call de strike K = 100 sur une action cotant S = 108, prime = 10. Il est ITM (S > K). Valeur intrinsèque = max(108−100, 0) = 8. Valeur temps = 10 − 8 = 2 : le marché estime que le potentiel de mouvement d'ici l'échéance vaut encore 2.",
    en: "A call with strike K = 100 on a stock trading at S = 108, premium = 10. It is ITM (S > K). Intrinsic value = max(108−100, 0) = 8. Time value = 10 − 8 = 2: the market estimates the remaining potential for movement before expiry is still worth 2.",
  },
  alternativeExplanation: {
    fr: "Pensez à la valeur intrinsèque comme au montant que vous encaisseriez si vous deviez décider \"tout de suite, sans attendre\" ; la valeur temps est le prix que le marché met sur le fait que vous n'avez pas encore à décider — plus il reste de temps ou plus le sous-jacent est volatil, plus cette \"option d'attendre\" vaut cher.",
    en: "Think of intrinsic value as the amount you would pocket if you had to decide \"right now, no waiting\"; time value is the price the market puts on the fact that you don't have to decide yet — the more time remains or the more volatile the underlying, the more this \"option to wait\" is worth.",
  },
  formula: {
    latex: "\\text{Valeur intrinsèque}_{\\text{call}} = \\max(S - K, 0) \\quad ; \\quad \\text{Valeur temps} = \\text{Prime} - \\text{Valeur intrinsèque}",
    variables: [
      { symbol: "S", description: { fr: "Prix actuel du sous-jacent", en: "Current underlying price" } },
      { symbol: "K", description: { fr: "Prix d'exercice (strike)", en: "Strike price" } },
    ],
    assumptions: { fr: "Formule symétrique pour un put : max(K − S, 0). La valeur temps est toujours ≥ 0 avant l'échéance.", en: "Symmetric formula for a put: max(K − S, 0). Time value is always ≥ 0 before expiry." },
    units: { fr: "Même devise que le sous-jacent, par unité.", en: "Same currency as the underlying, per unit." },
    example: { fr: "S=108, K=100, Prime=10 : Valeur intrinsèque=8, Valeur temps=2.", en: "S=108, K=100, Premium=10: Intrinsic value=8, Time value=2." },
  },
  calculation: {
    fr: "1) Comparer S et K pour classer l'option ITM/ATM/OTM. 2) Calculer la valeur intrinsèque : max(S−K,0) pour un call, max(K−S,0) pour un put. 3) Soustraire cette valeur intrinsèque de la prime de marché pour obtenir la valeur temps.",
    en: "1) Compare S and K to classify the option ITM/ATM/OTM. 2) Compute intrinsic value: max(S−K,0) for a call, max(K−S,0) for a put. 3) Subtract that intrinsic value from the market premium to get the time value.",
  },
  interpretation: {
    fr: "Une option OTM n'a que de la valeur temps (sa valeur intrinsèque est nulle) : elle ne vaut quelque chose que parce qu'il reste une chance qu'elle devienne ITM avant l'échéance. À l'échéance, la valeur temps disparaît totalement : la prime finale égale exactement la valeur intrinsèque.",
    en: "An OTM option has only time value (its intrinsic value is zero): it is worth something only because there is still a chance it becomes ITM before expiry. At expiry, time value vanishes entirely: the final premium equals exactly the intrinsic value.",
  },
  pitfalls: {
    fr: "Croire qu'une option OTM ne vaut rien : elle a une prime positive tant qu'il reste du temps, uniquement composée de valeur temps. Autre piège : pour une option américaine profondément ITM sur un actif versant un gros dividende, un exercice anticipé peut être optimal — ce n'est jamais le cas pour une option européenne, qui ne peut simplement pas être exercée avant l'échéance.",
    en: "Believing an OTM option is worth nothing: it has a positive premium as long as time remains, made entirely of time value. Another trap: for a deep ITM American option on an asset paying a large dividend, early exercise can be optimal — this never applies to a European option, which simply cannot be exercised before expiry.",
  },
  keyPoints: {
    fr: [
      "Européenne = exercice à l'échéance seulement ; américaine = exercice à tout moment jusqu'à l'échéance.",
      "Call ITM si S>K, OTM si S<K ; put ITM si S<K, OTM si S>K (inverse du call).",
      "Prime = Valeur intrinsèque + Valeur temps ; à l'échéance, la valeur temps est nulle.",
    ],
    en: [
      "European = exercise only at expiry; American = exercise at any time up to expiry.",
      "Call is ITM if S>K, OTM if S<K; put is ITM if S<K, OTM if S>K (the call's reverse).",
      "Premium = Intrinsic value + Time value; at expiry, time value is zero.",
    ],
  },
  advancedDemonstration: {
    fr: "La valeur temps n'est pas symétrique autour de S=K : elle est maximale pour une option ATM (le maximum d'incertitude sur l'issue) et diminue progressivement à mesure que l'option devient profondément ITM ou OTM. Sa décroissance dans le temps (le \"theta\", voir M07) n'est pas linéaire non plus : elle s'accélère fortement dans les derniers jours avant l'échéance, un phénomène que les traders d'options surveillent de près (\"theta decay\"). L'exercice anticipé optimal d'une option américaine dépend d'un arbitrage entre la valeur temps perdue (en exerçant, on renonce à l'optionalité restante) et un bénéfice immédiat (ex. capter un dividende avant qu'il ne fasse baisser le cours de l'action) — un sujet traité en détail dans les modèles d'arbres binomiaux.",
    en: "Time value is not symmetric around S=K: it peaks for an ATM option (maximum uncertainty about the outcome) and gradually shrinks as the option becomes deep ITM or OTM. Its decay over time (\"theta\", see M07) is not linear either: it accelerates sharply in the final days before expiry, a phenomenon options traders watch closely (\"theta decay\"). An American option's optimal early exercise depends on a trade-off between the time value given up (exercising forfeits the remaining optionality) and an immediate benefit (e.g. capturing a dividend before it lowers the stock price) — a topic covered in detail in binomial tree models.",
  },
};
