import type { LessonContent } from "@/lib/lesson-types";

export const m03ObligationsConvertibles: LessonContent = {
  conceptId: "m03-obligations-convertibles",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir pricer une obligation classique et comprendre la notion de risque de crédit, présentées plus tôt dans ce module.",
      en: "You need to know how to price a plain bond and understand credit risk, covered earlier in this module.",
    },
    conceptIds: ["m03-pricing-obligation", "m03-risque-credit"],
  },
  glossary: [
    { term: { fr: "Ratio de conversion", en: "Conversion ratio" }, definition: { fr: "Le nombre d'actions que l'investisseur reçoit s'il choisit de convertir une obligation, fixé à l'émission.", en: "The number of shares the investor receives if they choose to convert a bond, fixed at issuance." } },
    { term: { fr: "Parité (valeur de conversion)", en: "Parity (conversion value)" }, definition: { fr: "La valeur des actions que l'on obtiendrait en convertissant immédiatement l'obligation, égale au ratio de conversion multiplié par le cours de l'action.", en: "The value of the shares one would obtain by immediately converting the bond, equal to the conversion ratio times the share price." } },
  ],
  intuition: {
    fr: "Une obligation convertible, c'est une obligation classique à laquelle est attaché un billet de loterie : l'investisseur reçoit un coupon et le remboursement du nominal comme sur toute obligation, mais garde en plus le droit de convertir son obligation en un nombre fixé d'actions si le cours de l'action monte suffisamment. Il combine ainsi la protection à la baisse d'une obligation avec la participation à la hausse d'une action.",
    en: "A convertible bond is a plain bond with a lottery ticket attached: the investor receives a coupon and principal repayment like any bond, but also keeps the right to convert their bond into a fixed number of shares if the stock price rises enough. It thus combines a bond's downside protection with a stock's upside participation.",
  },
  definition: {
    fr: "Une obligation convertible est une obligation classique assortie d'une option d'achat (call) intégrée sur les actions de l'émetteur : à tout moment (ou à des dates prédéfinies), le détenteur peut échanger l'obligation contre un nombre fixe d'actions, le ratio de conversion r. La parité (ou valeur de conversion) est la valeur de marché de ces actions si l'on convertissait immédiatement : Parité = r × Cours de l'action. Le prix de l'obligation convertible se situe généralement au-dessus du plus élevé entre son \"plancher obligataire\" (sa valeur si elle n'était qu'une obligation classique, sans l'option) et sa parité, l'écart reflétant la valeur temps de l'option de conversion.",
    en: "A convertible bond is a plain bond with an embedded call option on the issuer's shares: at any time (or on predefined dates), the holder can exchange the bond for a fixed number of shares, the conversion ratio r. Parity (or conversion value) is the market value of these shares if converted immediately: Parity = r × Share price. The convertible bond's price generally sits above the higher of its \"bond floor\" (its value if it were just a plain bond, without the option) and its parity, the gap reflecting the conversion option's time value.",
  },
  utility: {
    fr: "Pour l'émetteur, la convertible permet de se financer à un coupon plus bas qu'une obligation classique, en échange d'une dilution potentielle future du capital si les détenteurs convertissent. Pour l'investisseur, elle offre un profil de risque asymétrique très recherché : une protection à la baisse proche de celle d'une obligation classique (le plancher obligataire), combinée à une participation à la hausse si l'action performe bien — ce qui en fait aussi le support de stratégies d'arbitrage convertible sophistiquées (voir approfondissement).",
    en: "For the issuer, a convertible allows funding at a lower coupon than a plain bond, in exchange for potential future dilution of the capital if holders convert. For the investor, it offers a highly sought-after asymmetric risk profile: downside protection close to that of a plain bond (the bond floor), combined with upside participation if the stock performs well — which also makes it the vehicle for sophisticated convertible arbitrage strategies (see the advanced section).",
  },
  example: {
    fr: "Une obligation convertible de nominal 1 000 EUR a un ratio de conversion de 20 actions. Le cours actuel de l'action est de 45 EUR. La parité est donc de 20 × 45 = 900 EUR : convertir immédiatement ne serait pas optimal (on recevrait moins que le nominal). Le prix de conversion (le cours implicite auquel la conversion \"casse-égalité\" avec le nominal) est de 1 000 / 20 = 50 EUR : l'action doit dépasser ce niveau pour que la conversion devienne réellement avantageuse par rapport à un simple remboursement.",
    en: "A convertible bond with a face value of EUR 1,000 has a conversion ratio of 20 shares. The current share price is EUR 45. Parity is therefore 20 × 45 = EUR 900: converting immediately would not be optimal (one would receive less than the face value). The conversion price (the implicit share price at which conversion \"breaks even\" with the face value) is 1,000 / 20 = EUR 50: the share must exceed this level for conversion to become genuinely advantageous versus simple redemption.",
  },
  alternativeExplanation: {
    fr: "Pensez à un prêt que vous accordez à une entreprise, avec une clause spéciale : si l'entreprise devient un grand succès en bourse, vous avez le droit d'échanger votre créance contre une part de son capital plutôt que d'être simplement remboursé en cash. Vous prêtez donc à un taux plus bas qu'un prêteur classique, en échange de ce droit optionnel de participer au succès de l'entreprise.",
    en: "Think of it as a loan you make to a company, with a special clause: if the company becomes a great stock market success, you have the right to swap your claim for a share of its capital rather than simply being repaid in cash. You therefore lend at a lower rate than a plain lender, in exchange for this optional right to participate in the company's success.",
  },
  formula: {
    latex: "\\begin{aligned} \\text{Parité} &= r \\times S \\\\ P_{conversion} &= \\frac{F}{r} \\end{aligned}",
    variables: [
      { symbol: "r", description: { fr: "Ratio de conversion (nombre d'actions par obligation)", en: "Conversion ratio (number of shares per bond)" } },
      { symbol: "S", description: { fr: "Cours actuel de l'action", en: "Current share price" } },
      { symbol: "P_{conversion}", description: { fr: "Prix de conversion (cours \"casse-égalité\" avec le nominal)", en: "Conversion price (share price that \"breaks even\" with face value)" } },
      { symbol: "F", description: { fr: "Nominal (valeur faciale) de l'obligation", en: "Bond's face (nominal) value" } },
    ],
    assumptions: { fr: "Ratio de conversion fixe sur la durée de vie (ignore les clauses d'ajustement anti-dilution en cas d'opérations sur titres) ; ignore les provisions de rachat anticipé (call) parfois attachées à ces obligations.", en: "Fixed conversion ratio over the life (ignores anti-dilution adjustment clauses on corporate actions); ignores early-call provisions sometimes attached to these bonds." },
    units: { fr: "Parité et prix de conversion en devise du nominal.", en: "Parity and conversion price in the face value's currency." },
    example: { fr: "r=20, S=45 → Parité=900. F=1000, r=20 → P_conversion=50.", en: "r=20, S=45 → Parity=900. F=1000, r=20 → Conversion price=50." },
  },
  calculation: {
    fr: "1) Relever le ratio de conversion r et le nominal F fixés à l'émission. 2) Pour la parité : multiplier r par le cours actuel de l'action. 3) Pour le prix de conversion : diviser le nominal F par r. 4) Comparer la parité au nominal pour juger si la conversion est, à ce stade, avantageuse ou non.",
    en: "1) Read off the conversion ratio r and face value F fixed at issuance. 2) For parity: multiply r by the current share price. 3) For the conversion price: divide face value F by r. 4) Compare parity to the face value to judge whether conversion is, at this stage, advantageous or not.",
  },
  interpretation: {
    fr: "Une obligation convertible \"profondément dans la monnaie\" (parité très supérieure au plancher obligataire) se comporte presque comme l'action elle-même : son prix suit de près les mouvements du cours. À l'inverse, une convertible \"profondément en dehors de la monnaie\" (parité très inférieure au plancher obligataire) se comporte comme une obligation classique, presque insensible aux mouvements de l'action : l'option de conversion a alors très peu de valeur.",
    en: "A convertible bond \"deep in the money\" (parity well above the bond floor) behaves almost like the stock itself: its price closely tracks share price moves. Conversely, a convertible \"deep out of the money\" (parity well below the bond floor) behaves like a plain bond, nearly insensitive to stock moves: the conversion option then has very little value.",
  },
  pitfalls: {
    fr: "Confondre le prix de conversion (un seuil calculé, F/r) avec le cours actuel de l'action, qui est une donnée de marché distincte. Autre piège : oublier que le \"plancher obligataire\" n'est pas garanti dans l'absolu — il dépend lui-même du risque de crédit de l'émetteur, qui peut se dégrader même si le cours de l'action ne bouge pas. Enfin, sous-estimer le risque de dilution pour les actionnaires existants en cas de conversion massive.",
    en: "Confusing the conversion price (a computed threshold, F/r) with the current share price, which is a separate market data point. Another trap: forgetting the \"bond floor\" is not guaranteed in absolute terms — it itself depends on the issuer's credit risk, which can deteriorate even if the share price doesn't move. Finally, underestimating the dilution risk for existing shareholders in case of massive conversion.",
  },
  keyPoints: {
    fr: [
      "Obligation convertible = obligation classique + option d'achat intégrée sur l'action de l'émetteur.",
      "Parité = ratio de conversion × cours de l'action ; le prix de la convertible reste au-dessus du plus élevé entre parité et plancher obligataire.",
      "L'émetteur obtient un coupon plus bas en échange d'une dilution potentielle ; l'investisseur obtient un profil de risque asymétrique.",
    ],
    en: [
      "A convertible bond = a plain bond + an embedded call option on the issuer's stock.",
      "Parity = conversion ratio × share price; the convertible's price stays above the higher of parity and the bond floor.",
      "The issuer gets a lower coupon in exchange for potential dilution; the investor gets an asymmetric risk profile.",
    ],
  },
  advancedDemonstration: {
    fr: "L'arbitrage convertible est une stratégie de hedge fund classique qui exploite la convexité de l'obligation convertible : le fonds achète la convertible (recevant son coupon et son optionalité) et vend à découvert un nombre d'actions correspondant à son delta (sa sensibilité au cours de l'action), rendant la position globalement neutre à un petit mouvement du cours dans un sens ou dans l'autre. Si l'action bouge fortement (dans n'importe quel sens), le gamma de la position (comme pour une option) génère un profit de rehedging, financé en partie par le portage négatif du coupon reçu contre le coût de l'emprunt de titres. Cette stratégie profite donc d'une volatilité de l'action plus élevée que celle implicitement payée à l'achat de la convertible — une logique proche d'un trading de volatilité (voir M08). On distingue aussi les convertibles \"busted\" (profondément hors de la monnaie, se comportant comme une obligation classique, souvent après une forte chute du cours de l'action) des convertibles \"equity-like\" (profondément dans la monnaie), qui suivent de près le cours de l'action tout en gardant un léger coussin de protection.",
    en: "Convertible arbitrage is a classic hedge fund strategy exploiting the convertible bond's convexity: the fund buys the convertible (receiving its coupon and optionality) and short-sells a number of shares matching its delta (its sensitivity to the share price), making the position roughly neutral to a small move in the share price in either direction. If the share moves sharply (in either direction), the position's gamma (as with an option) generates a rehedging profit, partly funded against the negative carry of the coupon received versus the cost of borrowing the shares. This strategy therefore profits from realized share volatility being higher than what is implicitly paid when buying the convertible — a logic close to volatility trading (see M08). A distinction is also made between \"busted\" convertibles (deep out of the money, behaving like a plain bond, often after a sharp drop in the share price) and \"equity-like\" convertibles (deep in the money), which closely track the share price while retaining a slight protective cushion.",
  },
};
