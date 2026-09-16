import type { LessonContent } from "@/lib/lesson-types";

export const m02ForwardVsFuture: LessonContent = {
  conceptId: "m02-forward-vs-future",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion compare deux contrats déjà présentés : assurez-vous de connaître la définition et le payoff d'un forward.",
      en: "This concept compares two contracts already introduced: make sure you know a forward's definition and payoff.",
    },
    conceptIds: ["m02-forward-future-definitions"],
  },
  glossary: [
    {
      term: { fr: "Chambre de compensation (CCP)", en: "Central counterparty (CCP)" },
      definition: {
        fr: "Une institution qui s'interpose entre acheteur et vendeur sur un marché organisé, devenant la contrepartie de chacun — elle absorbe le risque de défaut de l'autre partie.",
        en: "An institution that stands between buyer and seller on an exchange, becoming each side's counterparty — it absorbs the risk that the other party defaults.",
      },
    },
    {
      term: { fr: "Appel de marge", en: "Margin call" },
      definition: {
        fr: "Demande de verser du collatéral supplémentaire quand les pertes non réalisées font tomber le compte de marge sous un seuil minimal.",
        en: "A request to post extra collateral when unrealized losses push the margin account below a minimum threshold.",
      },
    },
  ],
  intuition: {
    fr: "Forward et future ont le même payoff économique — mais l'un est un accord privé entre deux parties qui se font confiance, l'autre est un produit standardisé où une chambre de compensation garantit que tout le monde sera payé, quitte à demander de l'argent tous les jours.",
    en: "A forward and a future have the same economic payoff — but one is a private agreement between two trusting parties, the other is a standardized product where a clearinghouse guarantees everyone gets paid, even if that means asking for cash every single day.",
  },
  definition: {
    fr: "Le forward et le future diffèrent sur cinq points structurels : la standardisation (sur mesure vs contrat type), la contrepartie (l'autre partie directement vs une chambre de compensation), le collatéral (négocié ou absent vs marge initiale obligatoire), le règlement (un seul flux à l'échéance vs règlement quotidien des gains/pertes — mark-to-market) et la liquidité (difficile à revendre vs coté en continu sur un marché organisé).",
    en: "Forwards and futures differ on five structural points: standardization (custom vs standard contract), counterparty (the other party directly vs a clearinghouse), collateral (negotiated or absent vs mandatory initial margin), settlement (one flow at maturity vs daily mark-to-market) and liquidity (hard to exit vs continuously quoted on an exchange).",
  },
  utility: {
    fr: "Choisir entre forward et future dépend du besoin : un forward convient à une exposition sur-mesure qu'on garde jusqu'à l'échéance ; un future convient si on veut pouvoir sortir de la position avant l'échéance, ou si le risque de contrepartie de l'autre partie inquiète.",
    en: "Choosing between a forward and a future depends on the need: a forward suits a custom exposure held to maturity; a future suits situations where exiting the position before maturity matters, or where the other party's counterparty risk is a concern.",
  },
  example: {
    fr: "Une PME qui doit payer exactement 437 250 USD dans 83 jours prendra un forward sur mesure auprès de sa banque, pour ce montant et cette date précis. Un trader qui veut parier sur le pétrole pendant quelques semaines, avec la possibilité de revendre à tout moment, utilisera un future coté sur le NYMEX plutôt qu'un forward.",
    en: "An SME that must pay exactly USD 437,250 in 83 days will take a custom forward from its bank, for that exact amount and date. A trader who wants to bet on oil for a few weeks, with the ability to exit at any time, will use a future listed on NYMEX rather than a forward.",
  },
  alternativeExplanation: {
    fr: "Voyez le forward comme un contrat sur-mesure signé chez un notaire entre deux personnes qui se connaissent, et le future comme un billet standardisé acheté en bourse où l'organisateur (la chambre de compensation) garantit à tout acheteur qu'il sera payé, en collectant chaque jour de l'argent auprès de celui qui est en train de perdre — pour ne jamais laisser les pertes s'accumuler trop longtemps.",
    en: "Think of the forward as a custom contract signed at a notary's office between two people who know each other, and the future as a standardized ticket bought on an exchange where the organizer (the clearinghouse) guarantees every buyer will be paid, by collecting cash every day from whoever is currently losing — so losses never pile up for long.",
  },
  formula: {
    latex: "\\text{Marge de variation}_t = (F_t - F_{t-1}) \\times \\text{Quantité}",
    variables: [
      { symbol: "F_t", description: { fr: "Prix de règlement du future en fin de journée t", en: "Future's settlement price at the end of day t" } },
      { symbol: "F_{t-1}", description: { fr: "Prix de règlement de la veille", en: "Previous day's settlement price" } },
    ],
    assumptions: {
      fr: "Le compte de marge du détenteur est crédité (position longue et prix en hausse) ou débité chaque jour selon cette variation ; un appel de marge survient si le compte tombe sous le seuil de maintenance.",
      en: "The holder's margin account is credited (long position, rising price) or debited every day according to this change; a margin call is triggered if the account falls below the maintenance threshold.",
    },
    units: {
      fr: "Dans la devise du contrat, par unité de sous-jacent, multiplié par le nombre de contrats détenus.",
      en: "In the contract's currency, per unit of underlying, multiplied by the number of contracts held.",
    },
    example: {
      fr: "Position longue de 10 contrats, F_t − F_{t-1} = +0,50 : marge de variation = 10 × 0,50 = +5 crédités sur le compte, ce jour-là.",
      en: "Long position of 10 contracts, F_t − F_{t-1} = +0.50: variation margin = 10 × 0.50 = +5 credited to the account, that day.",
    },
  },
  calculation: {
    fr: "1) Comparer le prix de règlement du jour à celui de la veille. 2) Calculer la variation ΔF = F_t − F_{t-1}. 3) Multiplier par la quantité détenue et par +1 (position longue) ou −1 (position courte). 4) Créditer ou débiter ce montant sur le compte de marge. 5) Répéter chaque jour jusqu'à l'échéance ou la clôture de la position — la somme de tous ces flux quotidiens reconstitue le payoff final du forward équivalent.",
    en: "1) Compare today's settlement price to yesterday's. 2) Compute the change ΔF = F_t − F_{t-1}. 3) Multiply by the quantity held and by +1 (long) or −1 (short). 4) Credit or debit that amount to the margin account. 5) Repeat every day until maturity or the position is closed — the sum of all these daily flows reconstructs the equivalent forward's final payoff.",
  },
  interpretation: {
    fr: "Le règlement quotidien signifie qu'un future ne laisse jamais une perte s'accumuler en silence : elle est réclamée chaque jour. C'est ce qui protège la chambre de compensation, mais cela crée aussi un besoin de trésorerie immédiat que le forward, réglé une seule fois à l'échéance, n'impose pas.",
    en: "Daily settlement means a future never lets a loss silently build up: it is demanded every day. This protects the clearinghouse, but it also creates an immediate cash need that the forward, settled only once at maturity, does not impose.",
  },
  pitfalls: {
    fr: "Croire que le prix forward et le prix future d'un même sous-jacent et échéance sont toujours strictement identiques : en théorie ils diffèrent légèrement à cause du règlement quotidien (corrélation entre taux d'intérêt et prix du sous-jacent), même si l'écart est souvent négligeable en pratique. Autre piège : penser que le collatéral supprime tout risque — il réduit le risque de contrepartie, il ne l'élimine pas (le collatéral lui-même peut perdre de la valeur).",
    en: "Believing the forward price and the future price on the same underlying and maturity are always exactly identical: in theory they differ slightly because of daily settlement (correlation between interest rates and the underlying's price), even though the gap is often negligible in practice. Another trap: thinking collateral removes all risk — it reduces counterparty risk, it does not eliminate it (the collateral itself can lose value).",
  },
  keyPoints: {
    fr: [
      "Forward = sur mesure, bilatéral, réglé une fois à l'échéance ; future = standardisé, chambre de compensation, réglé chaque jour.",
      "Le future exige une marge initiale et des appels de marge ; le forward ne l'exige pas nécessairement.",
      "Le future est liquide (on peut sortir avant l'échéance) ; le forward est en général conservé jusqu'au bout.",
    ],
    en: [
      "Forward = custom, bilateral, settled once at maturity; future = standardized, clearinghouse, settled daily.",
      "The future requires initial margin and margin calls; the forward does not necessarily require any.",
      "The future is liquid (can exit before maturity); the forward is generally held to the end.",
    ],
  },
  advancedDemonstration: {
    fr: "Sous des taux d'intérêt déterministes (non aléatoires), on peut démontrer que prix forward et prix future coïncident exactement, car le règlement quotidien n'introduit alors aucun avantage ou désavantage systématique. Dès que les taux sont stochastiques et corrélés au sous-jacent, une légère différence apparaît : si le sous-jacent et les taux sont positivement corrélés, une position longue en future profite en moyenne de recevoir ses gains plus tôt (et de pouvoir les replacer à un taux alors plus élevé), ce qui pousse le prix future légèrement au-dessus du prix forward théorique — et inversement en cas de corrélation négative. Cet écart, appelé \"biais de convexité\", est en général de quelques points de base et surtout pertinent sur les contrats de taux longue échéance.",
    en: "Under deterministic (non-random) interest rates, one can show that forward and future prices coincide exactly, because daily settlement then introduces no systematic advantage or disadvantage. Once rates are stochastic and correlated with the underlying, a small difference appears: if the underlying and rates are positively correlated, a long future position benefits on average from receiving gains earlier (and reinvesting them at a then-higher rate), pushing the future price slightly above the theoretical forward price — and the reverse under negative correlation. This gap, called \"convexity bias\", is usually a few basis points and mostly relevant on long-dated rate contracts.",
  },
};
