import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const riskReversalNumericTemplate: QuestionTemplate = {
  id: "m08-formes-risk-reversal-calcul",
  conceptId: "m08-formes-skew-smile",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ivPut = randomInt(rng, 18, 30);
    const ivCall = randomInt(rng, 12, ivPut - 1);
    const rr = ivPut - ivCall;

    return {
      isScenario: true,
      prompt: {
        fr: `Le put 25-delta cote une IV de ${ivPut}%, le call 25-delta une IV de ${ivCall}%. Quel est le "25-delta risk reversal" (IV_put − IV_call), en points de % ?`,
        en: `The 25-delta put quotes an IV of ${ivPut}%, the 25-delta call an IV of ${ivCall}%. What is the "25-delta risk reversal" (IV_put − IV_call), in percentage points?`,
      },
      numericUnit: { fr: "points de %", en: "percentage points" },
      numericTolerance: "± 0.5",
      hint: { fr: "Risk reversal = IV_put − IV_call.", en: "Risk reversal = IV_put − IV_call." },
      numeric: { value: rr, tolerance: 0.5 },
      calculation: { fr: `RR = ${ivPut}% − ${ivCall}% = ${rr} points.`, en: `RR = ${ivPut}% − ${ivCall}% = ${rr} points.` },
      explanation: {
        fr: "Un risk reversal positif indique un skew equity typique (puts plus chers que calls) ; proche de zéro, il indique un smile plus symétrique type FX.",
        en: "A positive risk reversal indicates a typical equity skew (puts pricier than calls); near zero, it indicates a more symmetric FX-type smile.",
      },
      commonMistake: {
        fr: "Inverser l'ordre de la soustraction (IV_call − IV_put), ce qui inverse le signe du résultat.",
        en: "Reversing the subtraction order (IV_call − IV_put), which flips the result's sign.",
      },
    };
  },
};

const fxVsEquityTemplate: QuestionTemplate = {
  id: "m08-formes-fx-vs-equity",
  conceptId: "m08-formes-skew-smile",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const market = pick(rng, ["equity", "fx"] as const);
    return {
      prompt: {
        fr: `Sur le marché ${market === "equity" ? "actions" : "des changes"}, quelle forme de courbe de volatilité implicite est typiquement observée ?`,
        en: `In the ${market === "equity" ? "equity" : "FX"} market, what typical implied volatility curve shape is observed?`,
      },
      choices: buildChoices([
        { id: "skew", label: { fr: "Un skew négatif prononcé (puts OTM nettement plus chers)", en: "A pronounced negative skew (OTM puts noticeably pricier)" } },
        { id: "smile", label: { fr: "Un smile symétrique en U", en: "A symmetric U-shaped smile" } },
      ]),
      hint: { fr: "L'un des deux marchés a un risque structurellement bidirectionnel, l'autre non.", en: "One of the two markets has structurally bidirectional risk, the other doesn't." },
      correctChoiceIds: [market === "equity" ? "skew" : "smile"],
      explanation:
        market === "equity"
          ? { fr: "Le marché actions montre typiquement un skew négatif prononcé, lié à la demande de protection contre les baisses et à l'effet de levier.", en: "The equity market typically shows a pronounced negative skew, tied to downside protection demand and the leverage effect." }
          : { fr: "Le marché des changes montre typiquement un smile plus symétrique, reflétant un risque bidirectionnel entre deux devises.", en: "The FX market typically shows a more symmetric smile, reflecting bidirectional risk between two currencies." },
      commonMistake: {
        fr: "Appliquer la forme typique d'un marché à l'autre, en oubliant leurs différences structurelles.",
        en: "Applying one market's typical shape to the other, forgetting their structural differences.",
      },
    };
  },
};

const eventDrivenTemplate: QuestionTemplate = {
  id: "m08-formes-evenement",
  conceptId: "m08-formes-skew-smile",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La forme du smile ou du skew peut temporairement se déformer fortement autour d'un événement de marché majeur (élection, référendum), sans que cela reflète la forme structurelle habituelle du marché.",
      en: "The smile or skew's shape can temporarily strongly deform around a major market event (election, referendum), without reflecting the market's usual structural shape.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : l'exemple du Brexit (GBP/USD) illustre comment un événement identifié peut temporairement asymétriser fortement un smile FX normalement plus symétrique.",
      en: "True: the Brexit example (GBP/USD) illustrates how an identified event can temporarily strongly skew a normally more symmetric FX smile.",
    },
    commonMistake: {
      fr: "Croire que la forme observée à un instant donné est toujours représentative de la forme structurelle à long terme du marché.",
      en: "Believing the shape observed at a given moment is always representative of the market's long-term structural shape.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-formes-vocab",
  conceptId: "m08-formes-skew-smile",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le mécanisme par lequel une baisse du prix d'une action augmente son ratio dette/capitaux propres, donc son risque perçu, s'appelle l'effet de ______.",
      en: "The mechanism by which a stock price decline raises its debt-to-equity ratio, hence its perceived risk, is called the ______ effect.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["levier", "leverage"],
    hint: { fr: "Lié au ratio dette/capitaux propres.", en: "Tied to the debt-to-equity ratio." },
    explanation: {
      fr: "L'effet de levier est l'une des deux explications structurelles usuelles du skew equity négatif, avec la demande de protection.",
      en: "The leverage effect is one of the two usual structural explanations for negative equity skew, along with protection demand.",
    },
    commonMistake: {
      fr: "Confondre l'effet de levier financier avec le levier d'une position en produits dérivés.",
      en: "Confusing the financial leverage effect with a derivatives position's leverage.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m08-formes-comprehension",
  conceptId: "m08-formes-skew-smile",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi la forme précise du skew/smile importe-t-elle pour un desk d'options, au-delà de la seule IV ATM ?",
    en: "Why does the precise shape of the skew/smile matter to an options desk, beyond just the ATM IV?",
  },
  choices: [
    { id: "prices-and-hedges", label: { fr: "Elle détermine le prix correct de toute option non-ATM et affecte directement les sensibilités (Delta, Vega) utilisées pour la couverture", en: "It determines the correct price of any non-ATM option and directly affects the sensitivities (Delta, Vega) used for hedging" } },
    { id: "cosmetic-only", label: { fr: "Elle n'a qu'une valeur descriptive, sans impact sur le pricing ou la couverture", en: "It has only descriptive value, with no impact on pricing or hedging" } },
    { id: "atm-sufficient", label: { fr: "L'IV ATM seule suffit toujours à représenter fidèlement toutes les options du marché", en: "The ATM IV alone is always enough to faithfully represent every option in the market" } },
  ],
  correctId: "prices-and-hedges",
  hint: { fr: "Seule une petite fraction des options tradées sont exactement à la monnaie.", en: "Only a small fraction of traded options are exactly at the money." },
  explanation: {
    fr: "La grande majorité des options tradées ne sont pas exactement ATM : la forme du skew/smile détermine leur prix correct et modifie les sensibilités de couverture (le Delta \"total\" intègre un terme de skew), ce qui en fait une donnée structurante pour tout le trading d'options, pas un simple détail descriptif.",
    en: "Most traded options are not exactly ATM: the skew/smile's shape determines their correct price and alters hedging sensitivities (the \"total\" Delta includes a skew term), making it a structuring input for all options trading, not a mere descriptive detail.",
  },
  commonMistake: {
    fr: "Réduire l'analyse d'un marché d'options à sa seule IV ATM, en ignorant la forme du skew/smile.",
    en: "Reducing an options market's analysis to its ATM IV alone, ignoring the skew/smile's shape.",
  },
});

const leverageVsProtectionComparisonTemplate = mcqTemplate({
  id: "m08-formes-comparaison-levier-vs-protection",
  conceptId: "m08-formes-skew-smile",
  difficulty: "hard",
  prompt: {
    fr: "Sur le skew equity négatif, quelle différence sépare l'explication par \"effet de levier\" de l'explication par \"demande de protection\" ?",
    en: "For the negative equity skew, what difference separates the \"leverage effect\" explanation from the \"protection demand\" explanation?",
  },
  choices: [
    { id: "mechanical-vs-behavioral", label: { fr: "Le levier est un mécanisme quasi mécanique lié au bilan de l'entreprise ; la demande de protection reflète un comportement d'aversion au risque des investisseurs sur le marché des options", en: "Leverage is a near-mechanical mechanism tied to the firm's balance sheet; protection demand reflects investors' risk-aversion behavior in the options market" } },
    { id: "same-mechanism", label: { fr: "Ce sont deux formulations différentes d'un seul et même mécanisme, sans distinction réelle", en: "They are two different phrasings of one and the same mechanism, with no real distinction" } },
    { id: "protection-mechanical", label: { fr: "C'est la demande de protection qui est purement mécanique, liée au bilan de l'entreprise", en: "It is protection demand that is purely mechanical, tied to the firm's balance sheet" } },
  ],
  correctId: "mechanical-vs-behavioral",
  hint: { fr: "L'une agit via le ratio dette/capitaux propres, l'autre via l'offre et la demande d'options de protection.", en: "One acts via the debt-to-equity ratio, the other via supply and demand for protective options." },
  explanation: {
    fr: "L'effet de levier explique le skew par un mécanisme quasi mécanique : une baisse du prix de l'action augmente le ratio dette/capitaux propres, donc le risque (et la volatilité) perçu des actions ; la demande de protection explique le skew par un comportement de marché — les investisseurs achètent des puts OTM comme assurance, ce qui pousse leur prix (et leur IV) à la hausse indépendamment du bilan de l'entreprise. Les deux effets coexistent et se renforcent généralement.",
    en: "The leverage effect explains the skew via a near-mechanical mechanism: a stock price decline raises the debt-to-equity ratio, hence perceived equity risk (and volatility); protection demand explains the skew via market behavior — investors buy OTM puts as insurance, pushing their price (and IV) up independently of the firm's balance sheet. The two effects typically coexist and reinforce each other.",
  },
  commonMistake: {
    fr: "Traiter l'effet de levier et la demande de protection comme un seul mécanisme interchangeable, sans distinguer leur origine (bilan vs comportement de marché).",
    en: "Treating the leverage effect and protection demand as a single interchangeable mechanism, without distinguishing their origin (balance sheet vs market behavior).",
  },
});

const commodityPositiveSkewScenarioTemplate = mcqTemplate({
  id: "m08-formes-scenario-skew-positif-matieres-premieres",
  conceptId: "m08-formes-skew-smile",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sur certains marchés de matières premières agricoles (ex. blé), les calls OTM peuvent avoir une IV plus élevée que les puts OTM de même distance à la monnaie — l'inverse du skew equity typique. Quelle explication est la plus cohérente ?",
    en: "In some agricultural commodity markets (e.g. wheat), OTM calls can have higher IV than OTM puts at the same distance from the money — the opposite of the typical equity skew. Which explanation is most consistent?",
  },
  choices: [
    { id: "supply-shock-fear", label: { fr: "La crainte d'un choc d'offre (mauvaise récolte, sécheresse) fait redouter des hausses de prix brutales, ce qui pousse la demande de protection vers les calls OTM plutôt que les puts", en: "Fear of a supply shock (bad harvest, drought) makes sharp price spikes the feared scenario, pushing protection demand toward OTM calls rather than puts" } },
    { id: "universal-negative-skew", label: { fr: "Le skew négatif type equity s'applique universellement à tous les actifs, y compris les matières premières agricoles", en: "The typical equity-type negative skew applies universally to all assets, including agricultural commodities" } },
    { id: "pricing-error", label: { fr: "C'est nécessairement une erreur de cotation, aucun marché ne pouvant avoir un skew positif", en: "It is necessarily a quoting error, since no market can have a positive skew" } },
  ],
  correctId: "supply-shock-fear",
  hint: { fr: "Le skew reflète le scénario redouté par les acteurs du marché : est-ce une baisse ou une hausse brutale du prix qui fait le plus peur sur ce marché ?", en: "Skew reflects the scenario market participants fear most: is it a sharp price decline or a sharp price spike that scares this market most?" },
  explanation: {
    fr: "Le skew reflète le scénario extrême redouté par les couvreurs : sur les actions, c'est un krach (skew négatif, puts chers) ; sur certaines matières premières agricoles ou énergétiques, c'est au contraire une flambée des prix liée à un choc d'offre, ce qui pousse la demande de protection vers les calls OTM et inverse le signe du skew par rapport aux actions.",
    en: "Skew reflects the extreme scenario hedgers fear: for equities, it's a crash (negative skew, expensive puts); for some agricultural or energy commodities, it's instead a price spike tied to a supply shock, which pushes protection demand toward OTM calls and flips the skew's sign relative to equities.",
  },
  commonMistake: {
    fr: "Généraliser le skew négatif observé sur les actions à tous les marchés, sans tenir compte du scénario de risque réellement redouté sur chaque actif.",
    en: "Generalizing the negative skew observed on equities to all markets, without considering the risk scenario actually feared on each asset.",
  },
});

const leveragedBuyoutScenarioTemplate = mcqTemplate({
  id: "m08-formes-scenario-lbo-endettement",
  conceptId: "m08-formes-skew-smile",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise annonce une opération à effet de levier (LBO) qui va fortement augmenter son endettement. Toutes choses égales par ailleurs, quel effet cela devrait-il avoir sur le skew de ses options ?",
    en: "A company announces a leveraged buyout (LBO) that will sharply increase its debt. All else equal, what effect should this have on its options' skew?",
  },
  choices: [
    { id: "steepens", label: { fr: "Le skew négatif devrait s'accentuer, l'effet de levier renforçant le lien entre baisse du prix et hausse du risque perçu", en: "The negative skew should steepen, as the leverage effect strengthens the link between price declines and higher perceived risk" } },
    { id: "flattens", label: { fr: "Le skew devrait s'aplatir, l'endettement réduisant le risque perçu de l'action", en: "The skew should flatten, as debt reduces the stock's perceived risk" } },
    { id: "no-effect", label: { fr: "Aucun effet, le skew étant indépendant du niveau d'endettement de l'entreprise", en: "No effect, since skew is independent of the company's debt level" } },
  ],
  correctId: "steepens",
  hint: { fr: "Un ratio dette/capitaux propres plus élevé amplifie l'effet de levier pour tout mouvement de prix donné.", en: "A higher debt-to-equity ratio amplifies the leverage effect for any given price move." },
  explanation: {
    fr: "Un endettement accru élève structurellement le ratio dette/capitaux propres : pour un même mouvement de prix de l'action, l'effet de levier sur le risque perçu (et donc sur la volatilité implicite des puts OTM) est amplifié, ce qui tend à accentuer le skew négatif — c'est l'un des canaux par lesquels un LBO se répercute sur le marché des options de l'entreprise.",
    en: "Higher debt structurally raises the debt-to-equity ratio: for the same stock price move, the leverage effect on perceived risk (and hence on OTM puts' implied volatility) is amplified, which tends to steepen the negative skew — this is one channel through which an LBO feeds through to the company's options market.",
  },
  commonMistake: {
    fr: "Ignorer le lien entre structure du bilan (endettement) et forme du skew, en traitant le skew comme une donnée purement exogène au marché des options.",
    en: "Ignoring the link between balance sheet structure (debt) and the skew's shape, treating skew as purely exogenous to the options market.",
  },
});

const butterflyNumericTemplate: QuestionTemplate = {
  id: "m08-formes-calcul-butterfly",
  conceptId: "m08-formes-skew-smile",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const ivAtm = randomInt(rng, 15, 25);
    const wing = randomInt(rng, 2, 6) / 10;
    const ivPut = ivAtm + randomInt(rng, 3, 7) + wing;
    const ivCall = ivAtm + randomInt(rng, 1, 4) + wing;
    const butterfly = Math.round((((ivPut + ivCall) / 2 - ivAtm)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Le put 25-delta cote ${fmt(ivPut, "fr")}%, le call 25-delta cote ${fmt(ivCall, "fr")}%, et l'IV ATM est de ${ivAtm}%. Quel est le "25-delta butterfly" — (IV_put + IV_call)/2 − IV_ATM —, en points de % ?`,
        en: `The 25-delta put quotes ${fmt(ivPut, "en")}%, the 25-delta call quotes ${fmt(ivCall, "en")}%, and the ATM IV is ${ivAtm}%. What is the "25-delta butterfly" — (IV_put + IV_call)/2 − IV_ATM —, in percentage points?`,
      },
      numericUnit: { fr: "points de %", en: "percentage points" },
      numericTolerance: "± 0.2",
      hint: { fr: "Butterfly = moyenne des deux ailes (put et call OTM) moins l'IV ATM.", en: "Butterfly = average of the two wings (OTM put and call) minus the ATM IV." },
      numeric: { value: butterfly, tolerance: 0.2 },
      calculation: {
        fr: `Butterfly = (${fmt(ivPut, "fr")}% + ${fmt(ivCall, "fr")}%)/2 − ${ivAtm}% = ${fmt((ivPut + ivCall) / 2, "fr")}% − ${ivAtm}% ≈ ${fmt(butterfly, "fr")} points.`,
        en: `Butterfly = (${fmt(ivPut, "en")}% + ${fmt(ivCall, "en")}%)/2 − ${ivAtm}% = ${fmt((ivPut + ivCall) / 2, "en")}% − ${ivAtm}% ≈ ${fmt(butterfly, "en")} points.`,
      },
      explanation: {
        fr: "Contrairement au risk reversal (IV_put − IV_call), qui mesure l'asymétrie/inclinaison du skew, le butterfly moyenne les deux ailes et les compare à l'ATM : il mesure la courbure du smile (à quel point les deux extrémités sont plus chères que le centre), une information distincte de la seule direction du skew.",
        en: "Unlike the risk reversal (IV_put − IV_call), which measures the skew's asymmetry/tilt, the butterfly averages the two wings and compares them to ATM: it measures the smile's curvature (how much more expensive both ends are than the center), information distinct from the skew's direction alone.",
      },
      commonMistake: {
        fr: "Confondre le butterfly (courbure du smile) avec le risk reversal (asymétrie du skew), qui mesurent deux dimensions différentes de la forme de la courbe.",
        en: "Confusing the butterfly (smile curvature) with the risk reversal (skew asymmetry), which measure two different dimensions of the curve's shape.",
      },
    };
  },
};

const rrVsButterflyMistakeTemplate = trueFalseTemplate({
  id: "m08-formes-erreur-rr-vs-butterfly",
  conceptId: "m08-formes-skew-smile",
  difficulty: "medium",
  statement: {
    fr: "Le risk reversal et le butterfly mesurent tous deux la même chose : l'inclinaison (asymétrie) du skew.",
    en: "The risk reversal and the butterfly both measure the same thing: the skew's tilt (asymmetry).",
  },
  correct: false,
  hint: { fr: "L'un soustrait deux ailes entre elles, l'autre les moyenne et les compare au centre.", en: "One subtracts the two wings from each other, the other averages them and compares to the center." },
  explanation: {
    fr: "Faux : le risk reversal (IV_put − IV_call) mesure l'asymétrie/inclinaison du skew, tandis que le butterfly ((IV_put+IV_call)/2 − IV_ATM) mesure la courbure du smile, indépendamment de son inclinaison — deux marchés peuvent avoir le même risk reversal mais un butterfly très différent (smile plus ou moins prononcé).",
    en: "False: the risk reversal (IV_put − IV_call) measures the skew's asymmetry/tilt, while the butterfly ((IV_put+IV_call)/2 − IV_ATM) measures the smile's curvature, independent of its tilt — two markets can share the same risk reversal but have a very different butterfly (a more or less pronounced smile).",
  },
  commonMistake: {
    fr: "Utiliser risk reversal et butterfly de façon interchangeable, alors qu'ils capturent deux dimensions indépendantes de la forme de la courbe.",
    en: "Using risk reversal and butterfly interchangeably, when they capture two independent dimensions of the curve's shape.",
  },
});

const traderSentimentScenarioTemplate = mcqTemplate({
  id: "m08-formes-scenario-trader-sentiment-rr",
  conceptId: "m08-formes-skew-smile",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader observe que le 25-delta risk reversal d'un indice actions, historiquement très négatif, se rapproche progressivement de zéro sur plusieurs semaines. Comment interprète-t-il typiquement cette évolution ?",
    en: "A trader observes that an equity index's 25-delta risk reversal, historically very negative, gradually moves toward zero over several weeks. How do they typically interpret this shift?",
  },
  choices: [
    { id: "less-fear", label: { fr: "La demande relative de protection à la baisse (par rapport aux calls) diminue : le marché semble moins redouter un scénario de krach", en: "Relative demand for downside protection (versus calls) is falling: the market appears to fear a crash scenario less" } },
    { id: "no-info", label: { fr: "Cette évolution ne contient aucune information exploitable sur le sentiment de marché", en: "This shift carries no usable information about market sentiment" } },
    { id: "vol-rising", label: { fr: "Cela signifie nécessairement que la volatilité ATM globale est en train d'augmenter", en: "It necessarily means overall ATM volatility is rising" } },
  ],
  correctId: "less-fear",
  hint: { fr: "Le risk reversal mesure le prix relatif de la protection à la baisse par rapport à la hausse — que signifie son rapprochement de zéro ?", en: "The risk reversal measures the relative price of downside vs. upside protection — what does its move toward zero signal?" },
  explanation: {
    fr: "Le risk reversal est souvent suivi comme un indicateur de sentiment : un skew qui se rapproche de zéro suggère que la demande relative de protection à la baisse diminue par rapport à la demande de calls, ce qui est généralement interprété comme un signe d'apaisement du marché — indépendamment du niveau absolu de la volatilité ATM, qui est une information distincte.",
    en: "The risk reversal is often tracked as a sentiment indicator: a skew moving toward zero suggests relative demand for downside protection is falling relative to call demand, generally read as a sign of market calming — independent of the ATM volatility's absolute level, which is a separate piece of information.",
  },
  commonMistake: {
    fr: "Confondre un changement du risk reversal (asymétrie relative) avec un changement du niveau absolu de la volatilité ATM.",
    en: "Confusing a change in the risk reversal (relative asymmetry) with a change in the ATM volatility's absolute level.",
  },
});

const hedgeCostScenarioTemplate = mcqTemplate({
  id: "m08-formes-scenario-cout-couverture-skew",
  conceptId: "m08-formes-skew-smile",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un gérant de portefeuille veut acheter des puts OTM à 10% en dehors de la monnaie pour se couvrir contre un krach, sur un marché actions au skew négatif prononcé. Par rapport à un monde sans skew (IV plate), ce hedge est-il plus cher ou moins cher ?",
    en: "A portfolio manager wants to buy 10%-OTM puts to hedge against a crash, in an equity market with a pronounced negative skew. Compared to a world with no skew (flat IV), is this hedge more or less expensive?",
  },
  choices: [
    { id: "more-expensive", label: { fr: "Plus cher : le skew négatif signifie que l'IV des puts OTM est plus élevée que l'IV ATM, ce qui augmente leur prime", en: "More expensive: the negative skew means OTM puts' IV is higher than the ATM IV, which raises their premium" } },
    { id: "cheaper", label: { fr: "Moins cher, car les puts OTM profitent toujours d'une IV plus basse que l'ATM", en: "Cheaper, since OTM puts always benefit from a lower IV than ATM" } },
    { id: "same-price", label: { fr: "Exactement le même prix, le skew n'affectant que les calls", en: "Exactly the same price, since skew only affects calls" } },
  ],
  correctId: "more-expensive",
  hint: { fr: "Le skew négatif equity est précisément défini par des puts OTM plus chers (IV plus haute) que l'ATM.", en: "The negative equity skew is precisely defined by OTM puts being pricier (higher IV) than ATM." },
  explanation: {
    fr: "Le skew négatif signifie par définition que l'IV des puts OTM est plus élevée que l'IV ATM : la couverture par achat de puts OTM coûte donc structurellement plus cher que ne le suggérerait une IV plate, ce qui est un arbitrage coût/protection central pour tout gérant cherchant à se couvrir contre un scénario de baisse.",
    en: "Negative skew means by definition that OTM puts' IV is higher than the ATM IV: hedging by buying OTM puts therefore structurally costs more than a flat IV would suggest, which is a central cost/protection tradeoff for any manager seeking to hedge against a downside scenario.",
  },
  commonMistake: {
    fr: "Évaluer le coût d'une couverture par put OTM en utilisant l'IV ATM au lieu de l'IV réelle, plus élevée, de ce strike précis.",
    en: "Evaluating an OTM put hedge's cost using the ATM IV instead of that specific strike's actual, higher IV.",
  },
});

export const templates: QuestionTemplate[] = [
  riskReversalNumericTemplate,
  fxVsEquityTemplate,
  eventDrivenTemplate,
  vocabTemplate,
  comprehensionTemplate,
  leverageVsProtectionComparisonTemplate,
  commodityPositiveSkewScenarioTemplate,
  leveragedBuyoutScenarioTemplate,
  butterflyNumericTemplate,
  rrVsButterflyMistakeTemplate,
  traderSentimentScenarioTemplate,
  hedgeCostScenarioTemplate,
];
