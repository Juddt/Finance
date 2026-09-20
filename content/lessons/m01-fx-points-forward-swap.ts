import type { LessonContent } from "@/lib/lesson-types";

export const m01FxPointsForwardSwap: LessonContent = {
  conceptId: "m01-fx-points-forward-swap",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir lire une cotation de change et connaître la parité couverte des taux d'intérêt, présentées dans les deux notions précédentes.",
      en: "You need to know how to read an FX quote and know covered interest rate parity, covered in the two previous concepts.",
    },
    conceptIds: ["m01-taux-change", "m01-parite-taux"],
  },
  glossary: [
    { term: { fr: "Points de change à terme (forward points)", en: "FX forward points" }, definition: { fr: "L'écart, en pips, entre le taux de change à terme et le taux de change au comptant, reflétant le différentiel de taux d'intérêt entre les deux devises.", en: "The gap, in pips, between the forward exchange rate and the spot exchange rate, reflecting the interest rate differential between the two currencies." } },
    { term: { fr: "FX swap", en: "FX swap" }, definition: { fr: "Une transaction combinant l'achat (ou la vente) au comptant d'une devise et sa revente (ou son rachat) simultanée à terme, utilisée principalement pour du financement ou du roulement de position, pas pour spéculer sur le sens du change.", en: "A transaction combining the spot purchase (or sale) of a currency and its simultaneous forward resale (or repurchase), mainly used for funding or rolling a position, not for speculating on FX direction." } },
  ],
  intuition: {
    fr: "Sur le marché des changes, un prix à terme ne se cote presque jamais directement en niveau absolu : il se cote comme un écart (en points, ou \"pips\") par rapport au cours au comptant. Cet écart n'est pas une prévision du marché sur le sens futur de la devise, mais reflète mécaniquement le différentiel de taux d'intérêt entre les deux devises, par non-arbitrage (voir la notion de parité couverte des taux). Un FX swap combine ce mécanisme dans une seule transaction : échanger une devise contre une autre aujourd'hui, avec l'engagement de faire l'opération inverse à une date future.",
    en: "In the FX market, a forward price is almost never quoted directly as an absolute level: it is quoted as a gap (in points, or \"pips\") versus the spot rate. This gap is not a market forecast of the currency's future direction, but mechanically reflects the interest rate differential between the two currencies, via no-arbitrage (see covered interest rate parity). An FX swap combines this mechanism in a single transaction: exchanging one currency for another today, with a commitment to do the reverse operation at a future date.",
  },
  definition: {
    fr: "Les points de change à terme sont l'écart entre le taux de change à terme F et le taux de change au comptant S0, généralement coté en pips (le plus petit incrément de la cotation). Un FX swap combine une transaction au comptant et une transaction à terme de sens opposé sur la même paire de devises, entre les deux mêmes contreparties : par exemple, acheter des dollars au comptant contre des euros, et s'engager simultanément à revendre ces mêmes dollars à terme contre des euros. Contrairement à un simple forward (une seule transaction directionnelle), le FX swap n'exprime aucune vue directionnelle nette sur le change : c'est un outil de financement à court terme dans une devise.",
    en: "FX forward points are the gap between the forward exchange rate F and the spot exchange rate S0, usually quoted in pips (the quote's smallest increment). An FX swap combines a spot transaction and an opposite-direction forward transaction on the same currency pair, between the same two counterparties: for example, buying dollars spot against euros, and simultaneously committing to sell those same dollars forward against euros. Unlike a simple forward (a single directional transaction), the FX swap expresses no net directional view on FX: it is a short-term funding tool in a currency.",
  },
  utility: {
    fr: "Le FX swap est l'instrument dominant pour le financement à court terme en devise étrangère (une banque ayant besoin de dollars pour quelques jours peut les emprunter via un FX swap plutôt qu'un prêt classique) et pour \"rouler\" une position de change sans en changer l'exposition nette. C'est, en volume, l'un des plus gros marchés de produits dérivés de gré à gré au monde — bien plus utilisé pour la gestion de trésorerie que pour la spéculation directionnelle.",
    en: "The FX swap is the dominant instrument for short-term foreign currency funding (a bank needing dollars for a few days can borrow them via an FX swap rather than a plain loan) and for \"rolling\" an FX position without changing its net exposure. It is, by volume, one of the largest OTC derivatives markets in the world — far more used for treasury management than for directional speculation.",
  },
  example: {
    fr: "Le taux de change EUR/USD au comptant est de 1,1000. Le taux USD à 3 mois est de 5%, le taux EUR à 3 mois de 3%. Les points forward valent approximativement 1,1000 × (5% − 3%) × 90/360 = 0,0055, soit 55 points forward. Le taux à terme à 3 mois s'obtient en ajoutant ces points au comptant : 1,1000 + 0,0055 = 1,1055.",
    en: "The EUR/USD spot rate is 1.1000. The 3-month USD rate is 5%, the 3-month EUR rate is 3%. Forward points are approximately 1.1000 × (5% − 3%) × 90/360 = 0.0055, i.e. 55 forward points. The 3-month forward rate is obtained by adding these points to spot: 1.1000 + 0.0055 = 1.1055.",
  },
  alternativeExplanation: {
    fr: "Voyez un FX swap comme une \"location\" temporaire de devise plutôt qu'un véritable achat définitif : vous empruntez une devise et en prêtez une autre pour une durée donnée, puis vous inversez l'opération à l'échéance — exactement comme un dépôt de garantie que l'on récupère à la fin d'une location, sans jamais devenir propriétaire définitif du bien loué.",
    en: "Think of an FX swap as a temporary \"rental\" of currency rather than a genuine outright purchase: you borrow one currency and lend another for a given period, then reverse the operation at maturity — exactly like a security deposit you recover at the end of a rental, never becoming the permanent owner of the rented item.",
  },
  formula: {
    latex: "\\begin{aligned} \\text{Points forward} &\\approx S_0 \\times (r_{cote} - r_{base}) \\times \\frac{j}{360} \\\\ F &= S_0 + \\text{Points forward} \\end{aligned}",
    variables: [
      { symbol: "S_0", description: { fr: "Taux de change au comptant", en: "Spot exchange rate" } },
      { symbol: "r_{cote}, r_{base}", description: { fr: "Taux d'intérêt de la devise de cotation et de la devise de base", en: "Interest rate of the quote currency and the base currency" } },
      { symbol: "j", description: { fr: "Nombre de jours jusqu'à l'échéance du terme", en: "Number of days until the forward's maturity" } },
      { symbol: "F", description: { fr: "Taux de change à terme (outright)", en: "The forward (outright) exchange rate" } },
    ],
    assumptions: { fr: "Approximation linéaire simplifiée de la parité couverte des taux (voir la notion précédente pour la formule exacte composée) ; ignore l'écart bid-offer, qui existe aussi bien au comptant qu'à terme.", en: "Simplified linear approximation of covered interest rate parity (see the previous concept for the exact compounded formula); ignores the bid-offer spread, which exists both spot and forward." },
    units: { fr: "Points forward dans l'unité de cotation du change ; taux en proportion annuelle.", en: "Forward points in the FX quote's unit; rates as an annual proportion." },
    example: { fr: "S0=1,1000, r_usd=5%, r_eur=3%, j=90 → Points≈0,0055 → F≈1,1055.", en: "S0=1.1000, r_usd=5%, r_eur=3%, j=90 → Points≈0.0055 → F≈1.1055." },
  },
  calculation: {
    fr: "1) Relever le taux de change au comptant S0 et les taux d'intérêt des deux devises. 2) Calculer l'écart de taux (r_cote − r_base). 3) Multiplier par S0 et par la fraction d'année écoulée jusqu'au terme. 4) Ajouter ce résultat (les points forward) au comptant pour obtenir le taux à terme.",
    en: "1) Read off the spot rate S0 and both currencies' interest rates. 2) Compute the rate gap (r_quote − r_base). 3) Multiply by S0 and by the fraction of a year until the forward's maturity. 4) Add this result (the forward points) to spot to get the forward rate.",
  },
  interpretation: {
    fr: "Le signe des points forward est directement déterminé par le différentiel de taux d'intérêt : la devise au taux d'intérêt le plus élevé se traite structurellement à terme avec une décote (elle \"vaut moins\" à terme qu'au comptant dans la cotation), et inversement pour la devise au taux le plus bas. Ce n'est absolument pas une prévision du marché sur le sens futur du change — exactement le même principe que pour les taux forward de taux d'intérêt (voir M03) ou les prix forward de matières premières (voir M02).",
    en: "The sign of forward points is directly determined by the interest rate differential: the currency with the higher interest rate structurally trades forward at a discount (it is \"worth less\" forward than spot in the quote), and vice versa for the currency with the lower rate. This is absolutely not a market forecast of FX direction — exactly the same principle as for interest rate forwards (see M03) or commodity forward prices (see M02).",
  },
  pitfalls: {
    fr: "Lire les points forward comme une prévision du marché sur le niveau futur du change, alors qu'ils ne sont qu'un résultat mécanique de non-arbitrage sur le différentiel de taux d'intérêt. Autre piège fréquent : confondre le FX swap (transaction temporaire, systématiquement dénouée à l'échéance, principalement utilisée pour du financement) avec un simple forward (une seule transaction directionnelle, sans dénouement automatique) ou avec un swap de devises de long terme (qui échange aussi des paiements d'intérêts périodiques, pas seulement le principal en début et fin de vie).",
    en: "Reading forward points as a market forecast of FX's future level, when they are just a mechanical no-arbitrage result of the interest rate differential. Another frequent trap: confusing the FX swap (a temporary transaction, systematically unwound at maturity, mainly used for funding) with a simple forward (a single directional transaction, with no automatic unwind) or with a long-term cross-currency swap (which also exchanges periodic interest payments, not just principal at the start and end of its life).",
  },
  keyPoints: {
    fr: [
      "Les points forward = écart entre taux à terme et taux au comptant, déterminé par le différentiel de taux d'intérêt entre les deux devises.",
      "Le FX swap combine une transaction au comptant et son inverse à terme : un outil de financement/roulement, pas un pari directionnel.",
      "Le signe des points forward n'est jamais une prévision de marché sur le sens futur du change.",
    ],
    en: [
      "Forward points = the gap between the forward rate and the spot rate, determined by the interest rate differential between the two currencies.",
      "The FX swap combines a spot transaction and its forward reverse: a funding/rolling tool, not a directional bet.",
      "The sign of forward points is never a market forecast of FX's future direction.",
    ],
  },
  advancedDemonstration: {
    fr: "Le FX swap est, en volume de transactions, l'un des plus gros marchés de produits dérivés de gré à gré au monde selon l'enquête triennale de la BRI, principalement utilisé pour la gestion de trésorerie plutôt que la spéculation. Lors des épisodes de tension sur le financement en dollars (2008, mars 2020), les banques centrales hors États-Unis ont massivement utilisé des lignes de swap de devises avec la Fed pour se procurer des dollars et les redistribuer à leurs banques domestiques manquant de financement en devise étrangère — illustrant le rôle systémique de ce marché bien au-delà des salles de marché. En pratique, l'écart observé entre le prix forward réel et celui prédit par la parité couverte des taux (la \"base de change croisée\", cross-currency basis) n'est jamais rigoureusement nul, en particulier en période de tension : cet écart reflète des frictions réelles (coûts de bilan réglementaires, demande et offre inégales de financement dans chaque devise) qui limitent en pratique l'arbitrage théorique parfait.",
    en: "The FX swap is, by transaction volume, one of the largest OTC derivatives markets in the world according to the BIS Triennial Survey, mainly used for treasury management rather than speculation. During episodes of dollar funding stress (2008, March 2020), central banks outside the US made heavy use of currency swap lines with the Fed to obtain dollars and redistribute them to their domestic banks lacking foreign-currency funding — illustrating this market's systemic role well beyond trading floors. In practice, the gap observed between the actual forward price and the one predicted by covered interest rate parity (the \"cross-currency basis\") is never strictly zero, particularly in stressed periods: this gap reflects real frictions (regulatory balance-sheet costs, uneven funding supply and demand in each currency) that in practice limit perfect theoretical arbitrage.",
  },
};
