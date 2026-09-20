import { randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const vocabTemplate: QuestionTemplate = {
  id: "m03-convertible-vocab",
  conceptId: "m03-obligations-convertibles",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La valeur de marché des actions que l'on obtiendrait en convertissant immédiatement une obligation convertible s'appelle la ______.",
      en: "The market value of the shares one would obtain by immediately converting a convertible bond is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["parite", "parity"],
    hint: { fr: "Ratio de conversion × cours de l'action.", en: "Conversion ratio × share price." },
    explanation: {
      fr: "La parité (ou valeur de conversion) est la valeur des actions obtenues en convertissant immédiatement l'obligation : Parité = ratio de conversion × cours de l'action.",
      en: "Parity (or conversion value) is the value of the shares obtained by immediately converting the bond: Parity = conversion ratio × share price.",
    },
    commonMistake: {
      fr: "Confondre la parité avec le prix de marché de l'obligation convertible elle-même, qui inclut en plus la valeur temps de l'option.",
      en: "Confusing parity with the convertible bond's own market price, which additionally includes the option's time value.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-convertible-comprehension",
  conceptId: "m03-obligations-convertibles",
  difficulty: "easy",
  prompt: {
    fr: "Qu'est-ce qu'une obligation convertible, dans son principe ?",
    en: "What is a convertible bond, in principle?",
  },
  choices: [
    { id: "bond-plus-call", label: { fr: "Une obligation classique à laquelle est attachée une option d'achat sur les actions de l'émetteur", en: "A plain bond with a call option on the issuer's shares attached to it" } },
    { id: "stock-only", label: { fr: "Une action ordinaire qui verse un coupon fixe au lieu d'un dividende", en: "An ordinary share that pays a fixed coupon instead of a dividend" } },
    { id: "currency-swap", label: { fr: "Un swap permettant de convertir une dette d'une devise à une autre", en: "A swap allowing debt to be converted from one currency to another" } },
  ],
  correctId: "bond-plus-call",
  hint: { fr: "Le détenteur reçoit un coupon ET garde le droit d'échanger contre des actions.", en: "The holder receives a coupon AND keeps the right to exchange for shares." },
  explanation: {
    fr: "Une obligation convertible combine les caractéristiques d'une obligation classique (coupon, remboursement du nominal) avec une option d'achat intégrée permettant d'échanger l'obligation contre un nombre fixe d'actions de l'émetteur, à la discrétion du détenteur.",
    en: "A convertible bond combines a plain bond's features (coupon, principal repayment) with an embedded call option allowing the bond to be exchanged for a fixed number of the issuer's shares, at the holder's discretion.",
  },
  commonMistake: {
    fr: "Confondre l'obligation convertible avec une simple action, en oubliant qu'elle reste avant tout une créance jusqu'à ce que la conversion soit exercée.",
    en: "Confusing a convertible bond with a plain share, forgetting it remains first and foremost a debt claim until conversion is exercised.",
  },
});

const vsStraightBondComparisonTemplate = mcqTemplate({
  id: "m03-convertible-comparaison-obligation-classique",
  conceptId: "m03-obligations-convertibles",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs, le coupon d'une obligation convertible est-il typiquement plus élevé ou plus bas que celui d'une obligation classique de même émetteur et même maturité ?",
    en: "All else equal, is a convertible bond's coupon typically higher or lower than a plain bond's from the same issuer and maturity?",
  },
  choices: [
    { id: "lower-coupon", label: { fr: "Plus bas : l'investisseur accepte un coupon réduit en échange de la valeur de l'option de conversion qu'il reçoit", en: "Lower: the investor accepts a reduced coupon in exchange for the value of the conversion option they receive" } },
    { id: "higher-coupon", label: { fr: "Plus élevé, pour compenser le risque supplémentaire pris par l'investisseur", en: "Higher, to compensate the investor for the extra risk taken" } },
    { id: "identical", label: { fr: "Strictement identique, l'option de conversion n'ayant pas d'impact sur le coupon", en: "Strictly identical, since the conversion option has no impact on the coupon" } },
  ],
  correctId: "lower-coupon",
  hint: { fr: "L'investisseur reçoit quelque chose en plus (l'option) : qu'accepte-t-il en échange sur le coupon ?", en: "The investor receives something extra (the option): what do they accept in exchange on the coupon?" },
  explanation: {
    fr: "L'option de conversion a de la valeur pour l'investisseur (participation potentielle à la hausse de l'action) : en échange de cette valeur, il accepte un coupon plus bas que sur une obligation classique équivalente — c'est précisément ce qui rend la convertible attractive pour l'émetteur, qui abaisse ainsi son coût de financement immédiat.",
    en: "The conversion option has value for the investor (potential upside participation in the stock): in exchange for this value, they accept a lower coupon than on an equivalent plain bond — this is precisely what makes the convertible attractive for the issuer, who thereby lowers their immediate funding cost.",
  },
  commonMistake: {
    fr: "Croire qu'un instrument plus complexe (avec une option intégrée) doit forcément offrir un coupon plus élevé, sans tenir compte de la valeur de l'option elle-même.",
    en: "Believing a more complex instrument (with an embedded option) must necessarily offer a higher coupon, without accounting for the option's own value.",
  },
});

const bustedVsEquityLikeComparisonTemplate = mcqTemplate({
  id: "m03-convertible-comparaison-busted-equity-like",
  conceptId: "m03-obligations-convertibles",
  difficulty: "hard",
  prompt: {
    fr: "Quelle différence de comportement sépare une convertible \"busted\" (profondément hors de la monnaie) d'une convertible \"equity-like\" (profondément dans la monnaie) ?",
    en: "What behavioral difference separates a \"busted\" convertible (deep out of the money) from an \"equity-like\" convertible (deep in the money)?",
  },
  choices: [
    { id: "bond-like-vs-stock-like", label: { fr: "La busted se comporte comme une obligation classique, presque insensible au cours de l'action ; l'equity-like suit de près les mouvements du cours de l'action", en: "The busted one behaves like a plain bond, nearly insensitive to the share price; the equity-like one closely tracks share price moves" } },
    { id: "always-identical", label: { fr: "Les deux ont toujours un comportement strictement identique", en: "Both always behave in a strictly identical way" } },
    { id: "reversed", label: { fr: "C'est l'inverse : la busted suit le cours de l'action, l'equity-like se comporte comme une obligation classique", en: "It's the opposite: the busted one tracks the share price, the equity-like one behaves like a plain bond" } },
  ],
  correctId: "bond-like-vs-stock-like",
  hint: { fr: "Pensez à l'option de conversion comme une option \"in-the-money\" ou \"out-of-the-money\" au sens usuel.", en: "Think of the conversion option as \"in-the-money\" or \"out-of-the-money\" in the usual sense." },
  explanation: {
    fr: "Quand la parité est très inférieure au plancher obligataire (convertible \"busted\"), l'option de conversion a très peu de valeur et le prix de la convertible se comporte comme celui d'une obligation classique, peu sensible au cours de l'action. Quand la parité est très supérieure au plancher obligataire (convertible \"equity-like\"), le prix de la convertible suit de près les mouvements du cours de l'action, l'optionalité étant alors presque toujours exercée.",
    en: "When parity is well below the bond floor (a \"busted\" convertible), the conversion option has very little value and the convertible's price behaves like a plain bond, largely insensitive to the share price. When parity is well above the bond floor (an \"equity-like\" convertible), the convertible's price closely tracks share price moves, with the option being almost always exercised.",
  },
  commonMistake: {
    fr: "Traiter toutes les obligations convertibles comme ayant un comportement uniforme, sans tenir compte de leur position relative par rapport au prix de conversion.",
    en: "Treating all convertible bonds as behaving uniformly, without accounting for their relative position versus the conversion price.",
  },
});

const whatIfStockSurgesTemplate = mcqTemplate({
  id: "m03-convertible-what-if-action-monte",
  conceptId: "m03-obligations-convertibles",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le cours de l'action d'un émetteur double en quelques mois, bien au-dessus du prix de conversion de son obligation convertible. Que devrait-il se passer sur le prix de cette convertible ?",
    en: "An issuer's share price doubles over a few months, well above their convertible bond's conversion price. What should happen to this convertible's price?",
  },
  choices: [
    { id: "tracks-parity", label: { fr: "Le prix de la convertible progresse fortement, en suivant de près la hausse de la parité (proche du ratio de conversion × cours de l'action)", en: "The convertible's price rises strongly, closely tracking parity's rise (close to conversion ratio × share price)" } },
    { id: "unaffected", label: { fr: "Le prix de la convertible n'est pas affecté, seule l'obligation classique compte", en: "The convertible's price is unaffected, only the plain bond matters" } },
    { id: "falls", label: { fr: "Le prix de la convertible baisse mécaniquement quand l'action monte", en: "The convertible's price mechanically falls when the stock rises" } },
  ],
  correctId: "tracks-parity",
  hint: { fr: "Une convertible profondément dans la monnaie se comporte comme l'action elle-même.", en: "A convertible deep in the money behaves like the stock itself." },
  explanation: {
    fr: "Une fois le cours de l'action largement au-dessus du prix de conversion, l'obligation convertible devient profondément dans la monnaie (\"equity-like\") : son prix suit de très près l'évolution de la parité (ratio de conversion × cours de l'action), la conversion étant alors la stratégie optimale pour le détenteur.",
    en: "Once the share price is well above the conversion price, the convertible bond becomes deep in the money (\"equity-like\"): its price closely tracks parity's evolution (conversion ratio × share price), conversion then being the holder's optimal strategy.",
  },
  commonMistake: {
    fr: "Croire que le prix d'une obligation convertible reste toujours ancré à son plancher obligataire, quel que soit le niveau du cours de l'action.",
    en: "Believing a convertible bond's price always stays anchored to its bond floor, regardless of the share price level.",
  },
});

const whatIfCreditDeteriorationTemplate = mcqTemplate({
  id: "m03-convertible-what-if-degradation-credit",
  conceptId: "m03-obligations-convertibles",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le cours de l'action d'un émetteur reste stable, mais sa notation de crédit est dégradée suite à des difficultés opérationnelles. Quel est l'effet le plus probable sur le plancher obligataire de sa convertible ?",
    en: "An issuer's share price stays stable, but their credit rating is downgraded following operational difficulties. What is the most likely effect on their convertible's bond floor?",
  },
  choices: [
    { id: "floor-drops", label: { fr: "Le plancher obligataire baisse, car il dépend directement du risque de crédit de l'émetteur, indépendamment du cours de l'action", en: "The bond floor drops, since it directly depends on the issuer's credit risk, independent of the share price" } },
    { id: "floor-unaffected", label: { fr: "Le plancher obligataire reste inchangé, car il ne dépend que du cours de l'action", en: "The bond floor stays unchanged, since it only depends on the share price" } },
    { id: "floor-rises", label: { fr: "Le plancher obligataire augmente en cas de dégradation de la notation", en: "The bond floor rises when the rating is downgraded" } },
  ],
  correctId: "floor-drops",
  hint: { fr: "Le plancher obligataire est la valeur de la convertible SI elle n'était qu'une obligation classique — que fait le risque de crédit à cette valeur ?", en: "The bond floor is the convertible's value IF it were just a plain bond — what does credit risk do to that value?" },
  explanation: {
    fr: "Le plancher obligataire correspond à la valeur de la convertible si l'on ignorait l'option de conversion, c'est-à-dire au prix d'une obligation classique de même émetteur : une dégradation du risque de crédit fait mécaniquement baisser ce prix (le taux d'actualisation approprié augmente), même si le cours de l'action et donc la parité restent inchangés.",
    en: "The bond floor corresponds to the convertible's value if the conversion option were ignored, i.e. the price of a plain bond from the same issuer: a credit risk deterioration mechanically lowers this price (the appropriate discount rate rises), even if the share price — and hence parity — stays unchanged.",
  },
  commonMistake: {
    fr: "Croire que le plancher obligataire d'une convertible est une valeur fixe et garantie, indépendante de la situation financière de l'émetteur.",
    en: "Believing a convertible's bond floor is a fixed, guaranteed value, independent of the issuer's financial situation.",
  },
});

const parityNumericTemplate: QuestionTemplate = {
  id: "m03-convertible-calcul-parite",
  conceptId: "m03-obligations-convertibles",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratio = randomInt(rng, 10, 30);
    const stockPrice = randomInt(rng, 20, 80);
    const parity = ratio * stockPrice;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation convertible a un ratio de conversion de ${ratio} actions. Le cours actuel de l'action est de ${fmt(stockPrice, "fr", 0)}. Quelle est la parité de cette convertible ?`,
        en: `A convertible bond has a conversion ratio of ${ratio} shares. The current share price is ${fmt(stockPrice, "en", 0)}. What is this convertible's parity?`,
      },
      numericUnit: { fr: "même devise que le cours de l'action", en: "same currency as the share price" },
      numericTolerance: "± 1",
      hint: { fr: "Parité = ratio de conversion × cours de l'action.", en: "Parity = conversion ratio × share price." },
      numeric: { value: parity, tolerance: 1 },
      calculation: {
        fr: `Parité = ${ratio} × ${fmt(stockPrice, "fr", 0)} = ${fmt(parity, "fr", 0)}.`,
        en: `Parity = ${ratio} × ${fmt(stockPrice, "en", 0)} = ${fmt(parity, "en", 0)}.`,
      },
      explanation: {
        fr: "La parité mesure simplement la valeur de marché des actions que l'on recevrait en convertissant immédiatement l'obligation : un calcul direct, mais essentiel pour situer le prix de la convertible par rapport à son plancher obligataire.",
        en: "Parity simply measures the market value of the shares one would receive by immediately converting the bond: a direct calculation, but essential to locate the convertible's price relative to its bond floor.",
      },
      commonMistake: {
        fr: "Diviser le cours de l'action par le ratio de conversion au lieu de les multiplier.",
        en: "Dividing the share price by the conversion ratio instead of multiplying them.",
      },
    };
  },
};

const conversionPriceNumericTemplate: QuestionTemplate = {
  id: "m03-convertible-calcul-prix-conversion",
  conceptId: "m03-obligations-convertibles",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratio = randomInt(rng, 15, 40);
    const face = randomInt(rng, 8, 20) * 100;
    const conversionPrice = Math.round((face / ratio) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation convertible a un nominal de ${fmt(face, "fr", 0)} et un ratio de conversion de ${ratio} actions. Quel est le prix de conversion, arrondi au centime ?`,
        en: `A convertible bond has a face value of ${fmt(face, "en", 0)} and a conversion ratio of ${ratio} shares. What is the conversion price, rounded to the cent?`,
      },
      numericUnit: { fr: "même devise que le nominal", en: "same currency as the face value" },
      numericTolerance: "± 0.1",
      hint: { fr: "Prix de conversion = Nominal / Ratio de conversion.", en: "Conversion price = Face value / Conversion ratio." },
      numeric: { value: conversionPrice, tolerance: 0.1 },
      calculation: {
        fr: `Prix de conversion = ${fmt(face, "fr", 0)} / ${ratio} ≈ ${fmt(conversionPrice, "fr")}.`,
        en: `Conversion price = ${fmt(face, "en", 0)} / ${ratio} ≈ ${fmt(conversionPrice, "en")}.`,
      },
      explanation: {
        fr: "Le prix de conversion est le cours de l'action au-delà duquel convertir devient plus avantageux que d'être simplement remboursé au nominal : c'est un seuil calculé une fois pour toutes à l'émission, pas une donnée de marché qui varie au jour le jour.",
        en: "The conversion price is the share price above which converting becomes more advantageous than being simply repaid at face value: it is a threshold computed once at issuance, not a market data point that varies day to day.",
      },
      commonMistake: {
        fr: "Confondre le prix de conversion (un seuil fixe calculé à l'émission) avec le cours de marché actuel de l'action, qui fluctue en permanence.",
        en: "Confusing the conversion price (a fixed threshold computed at issuance) with the stock's current market price, which fluctuates continuously.",
      },
    };
  },
};

const conversionPriceVsStockPriceMistakeTemplate = trueFalseTemplate({
  id: "m03-convertible-erreur-prix-conversion-vs-cours",
  conceptId: "m03-obligations-convertibles",
  difficulty: "medium",
  statement: {
    fr: "Le prix de conversion d'une obligation convertible varie au jour le jour, comme le cours de l'action de l'émetteur.",
    en: "A convertible bond's conversion price varies day to day, like the issuer's share price.",
  },
  correct: false,
  hint: { fr: "Le prix de conversion se déduit de Nominal / Ratio, deux quantités fixées à l'émission.", en: "The conversion price is derived from Face value / Ratio, two quantities fixed at issuance." },
  explanation: {
    fr: "Faux : le prix de conversion (Nominal / Ratio de conversion) est un seuil fixe, calculé une fois pour toutes à l'émission de l'obligation — c'est le cours DE MARCHÉ de l'action qui varie en permanence et qu'il faut comparer à ce seuil fixe pour juger si la conversion est avantageuse.",
    en: "False: the conversion price (Face value / Conversion ratio) is a fixed threshold, computed once and for all at the bond's issuance — it is the stock's MARKET price that continuously varies, and must be compared against this fixed threshold to judge whether conversion is advantageous.",
  },
  commonMistake: {
    fr: "Confondre un seuil calculé et fixe (le prix de conversion) avec une donnée de marché qui fluctue (le cours de l'action).",
    en: "Confusing a fixed, computed threshold (the conversion price) with a fluctuating market data point (the share price).",
  },
});

const convertibleArbScenarioTemplate = mcqTemplate({
  id: "m03-convertible-scenario-arbitrage",
  conceptId: "m03-obligations-convertibles",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un fonds d'arbitrage convertible achète une obligation convertible et vend à découvert un nombre d'actions égal à son delta, rendant la position neutre à un petit mouvement du cours. Sur quoi repose principalement le profit visé par cette stratégie ?",
    en: "A convertible arbitrage fund buys a convertible bond and short-sells a number of shares equal to its delta, making the position neutral to a small price move. What does this strategy's targeted profit mainly rely on?",
  },
  choices: [
    { id: "gamma-from-realized-vol", label: { fr: "Le gamma de la position (comme pour une option), qui génère un profit de rehedging si la volatilité réalisée de l'action dépasse celle implicitement payée dans la convertible", en: "The position's gamma (as with an option), which generates a rehedging profit if the stock's realized volatility exceeds what is implicitly paid in the convertible" } },
    { id: "directional-bet", label: { fr: "Un simple pari directionnel sur la hausse du cours de l'action", en: "A simple directional bet on the stock rising" } },
    { id: "coupon-only", label: { fr: "Uniquement le coupon versé par l'obligation, sans aucun lien avec la volatilité de l'action", en: "Only the coupon paid by the bond, with no link to the stock's volatility" } },
  ],
  correctId: "gamma-from-realized-vol",
  hint: { fr: "Une position delta-neutre avec une option intégrée reste sensible au CARRÉ des mouvements du sous-jacent : c'est le gamma.", en: "A delta-neutral position with an embedded option stays sensitive to the SQUARE of underlying moves: that's gamma." },
  explanation: {
    fr: "Une fois la position rendue neutre au premier ordre (delta-neutre), son profit dépend du gamma apporté par l'option de conversion intégrée, exactement comme pour un straddle : plus l'action bouge fortement (dans un sens ou dans l'autre), plus le rehedging périodique de la position en actions génère de profit — une stratégie qui profite d'une volatilité réalisée supérieure à celle implicitement payée à l'achat de la convertible, tout en touchant le coupon de l'obligation.",
    en: "Once the position is made first-order neutral (delta-neutral), its profit depends on the gamma provided by the embedded conversion option, exactly as with a straddle: the more sharply the stock moves (in either direction), the more the position's periodic rehedging in shares generates profit — a strategy that profits from realized volatility exceeding what is implicitly paid when buying the convertible, while also collecting the bond's coupon.",
  },
  commonMistake: {
    fr: "Réduire l'arbitrage convertible à un simple pari directionnel, en ignorant que la couverture delta neutralise précisément ce pari directionnel.",
    en: "Reducing convertible arbitrage to a simple directional bet, ignoring that the delta hedge precisely neutralizes that directional bet.",
  },
});

const cfoFundingScenarioTemplate = mcqTemplate({
  id: "m03-convertible-scenario-cfo-financement",
  conceptId: "m03-obligations-convertibles",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le directeur financier d'une entreprise en forte croissance, dont l'action est jugée volatile, cherche à minimiser le coût immédiat de sa prochaine levée de dette, tout en acceptant une dilution potentielle future du capital. Quel instrument correspond le mieux à cet objectif ?",
    en: "The CFO of a fast-growing company, whose stock is seen as volatile, wants to minimize the immediate cost of their next debt raise, while accepting potential future capital dilution. Which instrument best fits this objective?",
  },
  choices: [
    { id: "convertible-bond", label: { fr: "Une obligation convertible, dont le coupon réduit reflète la valeur de l'option de conversion cédée aux investisseurs", en: "A convertible bond, whose reduced coupon reflects the value of the conversion option granted to investors" } },
    { id: "straight-bond", label: { fr: "Une obligation classique, qui n'implique aucune dilution possible", en: "A plain bond, which implies no possible dilution" } },
    { id: "bank-loan-only", label: { fr: "Un simple prêt bancaire à taux variable, sans lien avec le cours de l'action", en: "A simple floating-rate bank loan, unrelated to the share price" } },
  ],
  correctId: "convertible-bond",
  hint: { fr: "Le CFO accepte explicitement une dilution potentielle : quel instrument échange justement cela contre un coût plus bas ?", en: "The CFO explicitly accepts potential dilution: which instrument trades exactly that for a lower cost?" },
  explanation: {
    fr: "L'obligation convertible est précisément l'instrument qui permet d'abaisser le coût immédiat de la dette (coupon réduit) en échange d'une dilution potentielle future du capital si les investisseurs convertissent — un compromis particulièrement adapté à une entreprise en forte croissance dont l'action, volatile, rend l'option de conversion précieuse pour les investisseurs.",
    en: "A convertible bond is precisely the instrument that lowers the immediate cost of debt (reduced coupon) in exchange for potential future capital dilution if investors convert — a tradeoff particularly suited to a fast-growing company whose volatile stock makes the conversion option valuable to investors.",
  },
  commonMistake: {
    fr: "Choisir une obligation classique en pensant minimiser tout risque, sans réaliser qu'elle implique un coupon plus élevé que la convertible pour le même profil d'émetteur.",
    en: "Choosing a plain bond thinking it minimizes all risk, without realizing it implies a higher coupon than the convertible for the same issuer profile.",
  },
});

const dilutionRiskScenarioTemplate = mcqTemplate({
  id: "m03-convertible-scenario-dilution-actionnaires",
  conceptId: "m03-obligations-convertibles",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le cours d'une action dépasse largement le prix de conversion de l'obligation convertible de l'entreprise, et une large majorité des détenteurs exercent leur option de conversion. Quel est l'effet le plus direct pour les actionnaires existants de l'entreprise ?",
    en: "A stock's price far exceeds the company's convertible bond's conversion price, and a large majority of holders exercise their conversion option. What is the most direct effect on the company's existing shareholders?",
  },
  choices: [
    { id: "dilution", label: { fr: "Une dilution : de nouvelles actions sont émises pour les détenteurs convertis, réduisant la part détenue par chaque actionnaire existant", en: "Dilution: new shares are issued for converted holders, reducing the stake held by each existing shareholder" } },
    { id: "no-effect-on-shareholders", label: { fr: "Aucun effet, la conversion ne concernant que les détenteurs de l'obligation", en: "No effect, since conversion only concerns the bond's holders" } },
    { id: "shareholders-receive-cash", label: { fr: "Les actionnaires existants reçoivent un paiement en cash compensatoire automatique", en: "Existing shareholders automatically receive a compensating cash payment" } },
  ],
  correctId: "dilution",
  hint: { fr: "La conversion crée de NOUVELLES actions : que se passe-t-il pour le nombre total d'actions en circulation ?", en: "Conversion creates NEW shares: what happens to the total number of shares outstanding?" },
  explanation: {
    fr: "Convertir une obligation revient à émettre de nouvelles actions pour le détenteur qui convertit : le nombre total d'actions en circulation augmente, ce qui dilue mécaniquement la part de capital (et de bénéfice par action) détenue par chaque actionnaire existant — c'est le prix que paie l'entreprise, en plus du coupon réduit, pour ce mode de financement.",
    en: "Converting a bond amounts to issuing new shares to the converting holder: the total number of shares outstanding rises, which mechanically dilutes the capital stake (and earnings per share) held by each existing shareholder — this is the price the company pays, on top of the reduced coupon, for this funding method.",
  },
  commonMistake: {
    fr: "Se concentrer uniquement sur le bénéfice pour le détenteur de la convertible, en oubliant le coût de dilution supporté par les actionnaires existants de l'entreprise.",
    en: "Focusing only on the benefit to the convertible's holder, forgetting the dilution cost borne by the company's existing shareholders.",
  },
});

export const templates: QuestionTemplate[] = [
  vocabTemplate,
  comprehensionTemplate,
  vsStraightBondComparisonTemplate,
  bustedVsEquityLikeComparisonTemplate,
  whatIfStockSurgesTemplate,
  whatIfCreditDeteriorationTemplate,
  parityNumericTemplate,
  conversionPriceNumericTemplate,
  conversionPriceVsStockPriceMistakeTemplate,
  convertibleArbScenarioTemplate,
  cfoFundingScenarioTemplate,
  dilutionRiskScenarioTemplate,
];
