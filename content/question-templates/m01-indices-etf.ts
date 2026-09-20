import { randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 1): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const comprehensionTemplate = mcqTemplate({
  id: "m01-indices-etf-comprehension",
  conceptId: "m01-indices-etf",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert principalement un ETF qui réplique un indice actions ?",
    en: "What is an ETF tracking an equity index mainly used for?",
  },
  choices: [
    { id: "diversified-exposure-one-trade", label: { fr: "Obtenir une exposition diversifiée à un panier d'actions en une seule transaction, sans acheter chaque titre individuellement", en: "Getting diversified exposure to a basket of stocks in a single transaction, without buying each security individually" } },
    { id: "guarantee-outperformance", label: { fr: "Garantir une performance supérieure à celle de l'indice répliqué", en: "Guaranteeing performance above that of the tracked index" } },
    { id: "eliminate-all-market-risk", label: { fr: "Éliminer totalement tout risque de marché pour l'investisseur", en: "Completely eliminating any market risk for the investor" } },
    { id: "replace-central-bank", label: { fr: "Se substituer aux décisions de politique monétaire d'une banque centrale", en: "Substituting for a central bank's monetary policy decisions" } },
  ],
  correctId: "diversified-exposure-one-trade",
  hint: { fr: "Un ETF est conçu pour SUIVRE un indice, pas pour le battre ni éliminer son risque.", en: "An ETF is designed to TRACK an index, not to beat it or eliminate its risk." },
  explanation: {
    fr: "Un ETF est conçu pour répliquer la performance d'un indice, offrant une exposition diversifiée en une seule transaction plutôt que d'acheter individuellement chaque titre constituant : il ne vise pas à battre l'indice (contrairement à un fonds actif), ne supprime pas le risque de marché (l'ETF suit les mouvements de l'indice, à la hausse comme à la baisse), et n'a aucun lien avec la politique monétaire.",
    en: "An ETF is designed to replicate an index's performance, offering diversified exposure in a single transaction rather than buying each constituent security individually: it does not aim to beat the index (unlike an active fund), does not remove market risk (the ETF follows the index's moves, up and down), and has no link to monetary policy.",
  },
  commonMistake: {
    fr: "Croire qu'un ETF est conçu pour battre son indice de référence, alors qu'il est conçu pour le répliquer le plus fidèlement possible.",
    en: "Believing an ETF is designed to beat its reference index, when it is designed to replicate it as faithfully as possible.",
  },
});

const capWeightedVsEqualWeightedComparisonTemplate = mcqTemplate({
  id: "m01-indices-etf-comparaison-ponderation",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare un indice pondéré par capitalisation boursière d'un indice équipondéré ?",
    en: "What difference separates a market-cap-weighted index from an equal-weighted index?",
  },
  choices: [
    { id: "size-based-vs-equal", label: { fr: "Le premier fait peser chaque entreprise selon sa taille boursière ; le second attribue le même poids à chaque entreprise, quelle que soit sa taille", en: "The first weighs each company by its market size; the second gives every company the same weight, regardless of size" } },
    { id: "same-construction", label: { fr: "Ce sont deux noms différents pour exactement la même méthode de construction", en: "These are two different names for exactly the same construction method" } },
    { id: "equal-weighted-uses-cap-too", label: { fr: "L'indice équipondéré utilise en réalité aussi la capitalisation boursière comme critère de pondération", en: "The equal-weighted index in fact also uses market capitalization as a weighting criterion" } },
    { id: "cap-weighted-ignores-size", label: { fr: "L'indice pondéré par capitalisation ignore totalement la taille des entreprises qui le composent", en: "The cap-weighted index totally ignores the size of its constituent companies" } },
  ],
  correctId: "size-based-vs-equal",
  hint: { fr: "\"Équipondéré\" veut dire : même poids pour chaque constituant, peu importe sa taille.", en: "\"Equal-weighted\" means: same weight for each constituent, regardless of its size." },
  explanation: {
    fr: "Un indice pondéré par capitalisation boursière fait peser chaque entreprise proportionnellement à sa taille de marché, si bien que les plus grandes dominent ses mouvements ; un indice équipondéré, à l'inverse, attribue le même poids à chaque entreprise indépendamment de sa taille, ce qui donne relativement plus d'influence aux petites capitalisations que dans un indice pondéré par capitalisation.",
    en: "A market-cap-weighted index weighs each company in proportion to its market size, so the largest ones dominate its moves; an equal-weighted index, conversely, assigns the same weight to every company regardless of size, giving relatively more influence to small caps than in a cap-weighted index.",
  },
  commonMistake: {
    fr: "Croire que toute méthode de construction d'indice donne nécessairement le même résultat, en ignorant l'impact du choix de pondération.",
    en: "Believing any index construction method necessarily gives the same result, ignoring the impact of the weighting choice.",
  },
});

const physicalVsSyntheticComparisonTemplate = mcqTemplate({
  id: "m01-indices-etf-comparaison-replication",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare la réplication physique de la réplication synthétique d'un ETF ?",
    en: "What difference separates an ETF's physical replication from synthetic replication?",
  },
  choices: [
    { id: "actual-holding-vs-swap", label: { fr: "La physique détient réellement les titres de l'indice ; la synthétique échange la performance de l'indice contre celle d'un panier de titres via un swap avec une contrepartie", en: "Physical actually holds the index's securities; synthetic exchanges the index's performance for that of a basket of securities via a swap with a counterparty" } },
    { id: "no-difference-in-risk", label: { fr: "Aucune différence de risque entre les deux, seul le nom change", en: "No difference in risk between the two, only the name changes" } },
    { id: "synthetic-always-forbidden", label: { fr: "La réplication synthétique est en réalité interdite par la réglementation dans tous les cas", en: "Synthetic replication is in fact forbidden by regulation in all cases" } },
    { id: "physical-uses-swap-too", label: { fr: "La réplication physique utilise elle aussi systématiquement un contrat de swap", en: "Physical replication also systematically uses a swap contract" } },
  ],
  correctId: "actual-holding-vs-swap",
  hint: { fr: "L'un détient réellement les titres, l'autre passe par un contrat avec une banque.", en: "One actually holds the securities, the other goes through a contract with a bank." },
  explanation: {
    fr: "La réplication physique consiste à détenir réellement les titres composant l'indice ; la réplication synthétique consiste à échanger, via un contrat de swap conclu avec une contrepartie bancaire, la performance d'un panier de titres contre celle de l'indice visé — une différence structurelle qui introduit, dans le second cas, un risque de contrepartie sur la banque avec laquelle le swap est conclu.",
    en: "Physical replication means actually holding the securities making up the index; synthetic replication means exchanging, via a swap contract with a bank counterparty, the performance of a basket of securities for that of the target index — a structural difference that introduces, in the second case, counterparty risk on the bank the swap is concluded with.",
  },
  commonMistake: {
    fr: "Croire que la réplication physique et la réplication synthétique portent exactement le même profil de risque pour l'investisseur.",
    en: "Believing physical and synthetic replication carry exactly the same risk profile for the investor.",
  },
});

const whatIfMegaCapSurgesTemplate = mcqTemplate({
  id: "m01-indices-etf-what-if-mega-cap",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Dans un indice pondéré par capitalisation boursière, la plus grande entreprise constituante voit sa valeur bondir fortement, alors que les autres constituants restent stables. Que devient son poids dans l'indice ?",
    en: "In a market-cap-weighted index, the largest constituent company sees its value surge sharply, while other constituents stay stable. What happens to its weight in the index?",
  },
  choices: [
    { id: "weight-increases-further", label: { fr: "Son poids augmente encore, renforçant mécaniquement son influence sur les futurs mouvements de l'indice", en: "Its weight increases further, mechanically strengthening its influence on the index's future moves" } },
    { id: "weight-stays-fixed", label: { fr: "Son poids reste fixe, les pondérations d'un indice pondéré par capitalisation étant figées à la création", en: "Its weight stays fixed, since cap-weighted index weights are set once at creation" } },
    { id: "weight-decreases", label: { fr: "Son poids diminue, car une forte hausse déclenche automatiquement un rééquilibrage à la baisse", en: "Its weight decreases, since a sharp rise automatically triggers a downward rebalancing" } },
    { id: "other-constituents-removed", label: { fr: "Les autres constituants sont automatiquement retirés de l'indice dans ce scénario", en: "Other constituents are automatically removed from the index in this scenario" } },
  ],
  correctId: "weight-increases-further",
  hint: { fr: "Poids = Capitalisation de l'entreprise / Capitalisation totale : que devient ce ratio si le numérateur grimpe ?", en: "Weight = Company's market cap / Total market cap: what happens to this ratio if the numerator climbs?" },
  explanation: {
    fr: "Le poids d'une entreprise dans un indice pondéré par capitalisation se recalcule en continu (capitalisation de l'entreprise / capitalisation totale de l'indice) : une forte hausse de sa valeur, toutes choses égales par ailleurs, augmente mécaniquement ce poids, renforçant encore sa domination sur les mouvements futurs de l'indice — un effet d'auto-renforcement caractéristique de ce type de construction.",
    en: "A company's weight in a cap-weighted index is continuously recomputed (the company's market cap / the index's total market cap): a sharp rise in its value, all else equal, mechanically increases this weight, further reinforcing its dominance over the index's future moves — a self-reinforcing effect characteristic of this construction type.",
  },
  commonMistake: {
    fr: "Croire que les poids d'un indice pondéré par capitalisation sont figés une fois pour toutes, plutôt que recalculés en continu selon les mouvements de marché.",
    en: "Believing a cap-weighted index's weights are fixed once and for all, rather than continuously recomputed based on market moves.",
  },
});

const whatIfRebalancingTemplate = mcqTemplate({
  id: "m01-indices-etf-what-if-rebalancement",
  conceptId: "m01-indices-etf",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un comité d'indice annonce qu'une entreprise sera retirée de l'indice de référence et remplacée par une autre lors du prochain rééquilibrage trimestriel. Quel est l'effet le plus probable sur les flux d'ordres des fonds indiciels qui répliquent cet indice ?",
    en: "An index committee announces a company will be removed from the reference index and replaced by another at the next quarterly rebalancing. What is the most likely effect on order flows from index funds tracking this index?",
  },
  choices: [
    { id: "forced-buy-sell-flows", label: { fr: "Des flux de vente massifs et mécaniques sur le titre retiré, et d'achat sur le titre ajouté, de la part de tous les fonds indiciels concernés", en: "Massive, mechanical sell flows on the removed stock, and buy flows on the added stock, from all index funds concerned" } },
    { id: "no-forced-flows", label: { fr: "Aucun flux forcé, chaque fonds indiciel décidant librement s'il suit ou non ce changement", en: "No forced flows, each index fund freely deciding whether to follow this change or not" } },
    { id: "only-active-funds-react", label: { fr: "Seuls les fonds gérés activement réagissent à ce type d'annonce, jamais les fonds indiciels", en: "Only actively managed funds react to this kind of announcement, never index funds" } },
    { id: "reaction-limited-to-added-stock", label: { fr: "La réaction ne concerne que le titre ajouté, le titre retiré n'étant affecté par aucun flux", en: "The reaction only concerns the added stock, the removed stock being affected by no flows at all" } },
  ],
  correctId: "forced-buy-sell-flows",
  hint: { fr: "Un fonds indiciel s'engage à répliquer l'indice EXACTEMENT tel qu'il est défini, y compris après un changement de composition.", en: "An index fund commits to replicating the index EXACTLY as defined, including after a composition change." },
  explanation: {
    fr: "Un fonds indiciel s'engage contractuellement à répliquer la composition exacte de son indice de référence : un changement de composition décidé par le comité d'indice déclenche donc des flux de vente mécaniques et quasi-simultanés sur le titre retiré, et d'achat sur le titre ajouté, de la part de tous les fonds répliquant cet indice — un phénomène connu sous le nom d'\"effet indice\", qui peut avoir un impact notable sur les cours des titres concernés au moment du rééquilibrage.",
    en: "An index fund is contractually committed to replicating its reference index's exact composition: a composition change decided by the index committee therefore triggers mechanical, near-simultaneous sell flows on the removed stock, and buy flows on the added stock, from all funds tracking that index — a phenomenon known as the \"index effect\", which can have a notable impact on the concerned stocks' prices at the time of rebalancing.",
  },
  commonMistake: {
    fr: "Croire que les fonds indiciels ont une marge de liberté pour suivre ou non un changement de composition décidé par le comité d'indice.",
    en: "Believing index funds have discretion over whether to follow a composition change decided by the index committee.",
  },
});

const weightCalcTemplate: QuestionTemplate = {
  id: "m01-indices-etf-calcul-poids",
  conceptId: "m01-indices-etf",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const totalCap = randomInt(rng, 600, 1400) * 10;
    const companyCap = Math.round(totalCap * (randomInt(rng, 3, 12) / 100));
    const correctWeight = Math.round((companyCap / totalCap) * 1000) / 10;
    const invertedWeight = Math.round((totalCap / companyCap) * 10) / 10;
    const doubledWeight = Math.round(correctWeight * 2 * 10) / 10;
    const halvedWeight = Math.round((correctWeight / 2) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Un indice pondéré par capitalisation boursière regroupe des entreprises dont la capitalisation totale s'élève à ${fmt(totalCap, "fr", 0)} milliards EUR. Une entreprise de cet indice a une capitalisation de ${fmt(companyCap, "fr", 0)} milliards EUR. Quel est son poids dans l'indice ?`,
        en: `A market-cap-weighted index groups companies with a combined market cap of ${fmt(totalCap, "en", 0)} billion EUR. One company in this index has a market cap of ${fmt(companyCap, "en", 0)} billion EUR. What is its weight in the index?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctWeight, "fr")}%, en divisant la capitalisation de l'entreprise par la capitalisation totale de l'indice`, en: `${fmt(correctWeight, "en")}%, by dividing the company's market cap by the index's total market cap` } },
        { id: "inverted", label: { fr: `${fmt(invertedWeight, "fr")}, en divisant la capitalisation totale par celle de l'entreprise`, en: `${fmt(invertedWeight, "en")}, by dividing the total market cap by the company's` } },
        { id: "doubled", label: { fr: `${fmt(doubledWeight, "fr")}%, en oubliant de diviser par deux une étape intermédiaire du calcul`, en: `${fmt(doubledWeight, "en")}%, forgetting to halve an intermediate calculation step` } },
        { id: "halved", label: { fr: `${fmt(halvedWeight, "fr")}%, en divisant le résultat correct par deux par erreur`, en: `${fmt(halvedWeight, "en")}%, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Poids = Capitalisation de l'entreprise / Capitalisation totale de l'indice.", en: "Weight = Company's market cap / Index's total market cap." },
      explanation: {
        fr: `Le poids d'une entreprise dans un indice pondéré par capitalisation s'obtient en divisant sa capitalisation boursière par la capitalisation totale de l'ensemble des constituants : ${fmt(companyCap, "fr", 0)} / ${fmt(totalCap, "fr", 0)} ≈ ${fmt(correctWeight, "fr")}%. Inverser cette division donne un multiple sans rapport avec un poids en pourcentage.`,
        en: `A company's weight in a cap-weighted index is obtained by dividing its market cap by the total market cap of all constituents combined: ${fmt(companyCap, "en", 0)} / ${fmt(totalCap, "en", 0)} ≈ ${fmt(correctWeight, "en")}%. Inverting this division gives a multiple unrelated to a percentage weight.`,
      },
      commonMistake: {
        fr: "Diviser la capitalisation totale de l'indice par celle de l'entreprise au lieu de l'inverse.",
        en: "Dividing the index's total market cap by the company's instead of the other way around.",
      },
    };
  },
};

const priceVsTotalReturnMistakeTemplate = mcqTemplate({
  id: "m01-indices-etf-erreur-prix-vs-rendement-total",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur un indice \"prix\" et un indice \"rendement total\" du même panier d'actions est correcte ?",
    en: "Which of these statements about a \"price\" index and a \"total return\" index of the same stock basket is correct?",
  },
  choices: [
    { id: "diverge-over-time", label: { fr: "Ils divergent sur longue période, l'indice rendement total réinvestissant fictivement les dividendes que l'indice prix ignore", en: "They diverge over a long period, the total return index fictitiously reinvesting dividends the price index ignores" } },
    { id: "always-identical", label: { fr: "Ils sont toujours strictement identiques, quelle que soit la période considérée", en: "They are always strictly identical, whatever the period considered" } },
    { id: "price-index-higher-always", label: { fr: "L'indice prix affiche toujours une performance supérieure à l'indice rendement total", en: "The price index always shows higher performance than the total return index" } },
    { id: "only-differ-in-name", label: { fr: "Seul le nom diffère entre les deux, le calcul sous-jacent étant rigoureusement identique", en: "Only the name differs between the two, the underlying calculation being strictly identical" } },
  ],
  correctId: "diverge-over-time",
  hint: { fr: "Les dividendes versés par les constituants ne sont pas traités de la même façon dans les deux versions.", en: "Dividends paid by constituents aren't treated the same way in both versions." },
  explanation: {
    fr: "Un indice \"prix\" ignore les dividendes versés par ses constituants, tandis qu'un indice \"rendement total\" les réinvestit fictivement dans le calcul : sur longue période, l'écart cumulé entre les deux versions du même panier d'actions peut devenir considérable, ce qui impose de toujours vérifier laquelle des deux versions est utilisée avant de comparer des performances dans le temps.",
    en: "A \"price\" index ignores dividends paid by its constituents, while a \"total return\" index fictitiously reinvests them in the calculation: over a long period, the cumulative gap between the two versions of the same stock basket can become considerable, which requires always checking which of the two versions is used before comparing performance over time.",
  },
  commonMistake: {
    fr: "Comparer la performance d'un indice prix à celle d'un indice rendement total sur longue période, en ignorant l'écart créé par les dividendes.",
    en: "Comparing a price index's performance to a total return index's over a long period, ignoring the gap created by dividends.",
  },
});

const syntheticEtfCounterpartyRiskMistakeTemplate = mcqTemplate({
  id: "m01-indices-etf-erreur-risque-contrepartie",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur le risque d'un ETF à réplication synthétique est correcte ?",
    en: "Which of these statements about a synthetic-replication ETF's risk is correct?",
  },
  choices: [
    { id: "has-counterparty-exposure", label: { fr: "Il porte une exposition réelle à la contrepartie bancaire du swap, généralement atténuée mais pas éliminée par le collatéral échangé", en: "It carries a real exposure to the swap's bank counterparty, generally reduced but not eliminated by exchanged collateral" } },
    { id: "zero-risk-by-nature", label: { fr: "Il est par nature totalement dépourvu de tout risque de contrepartie", en: "It is by nature totally free of any counterparty risk" } },
    { id: "risk-only-if-index-falls", label: { fr: "Le risque de contrepartie n'existe que si l'indice répliqué baisse", en: "Counterparty risk only exists if the tracked index falls" } },
    { id: "same-as-physical-in-every-way", label: { fr: "Il présente exactement le même profil de risque qu'un ETF à réplication physique, sans aucune différence", en: "It has exactly the same risk profile as a physical-replication ETF, with no difference at all" } },
  ],
  correctId: "has-counterparty-exposure",
  hint: { fr: "Le swap est conclu avec une contrepartie bien réelle, dont la solvabilité importe malgré le collatéral.", en: "The swap is concluded with a very real counterparty, whose solvency matters despite the collateral." },
  explanation: {
    fr: "Un ETF à réplication synthétique reste exposé à la solvabilité de la banque contrepartie du swap : cette exposition est généralement atténuée par un collatéral échangé (voir M04, clearing et collatéral), mais rarement éliminée à 100%, et ce risque existe indépendamment du sens de variation de l'indice répliqué — une différence structurelle réelle avec un ETF à réplication physique, qui ne porte pas ce type d'exposition.",
    en: "A synthetic-replication ETF remains exposed to the swap's bank counterparty's solvency: this exposure is generally reduced by exchanged collateral (see M04, clearing and collateral), but rarely eliminated 100%, and this risk exists regardless of the tracked index's direction — a real structural difference from a physical-replication ETF, which doesn't carry this type of exposure.",
  },
  commonMistake: {
    fr: "Considérer tout ETF comme intrinsèquement dépourvu de risque de contrepartie, sans distinguer réplication physique et synthétique.",
    en: "Treating any ETF as inherently free of counterparty risk, without distinguishing physical from synthetic replication.",
  },
});

const creationRedemptionScenarioTemplate = mcqTemplate({
  id: "m01-indices-etf-scenario-creation-rachat",
  conceptId: "m01-indices-etf",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le prix d'un ETF en bourse s'écarte temporairement à la hausse de la valeur des titres qu'il détient réellement. Quel mécanisme ramène typiquement ce prix vers sa valeur liquidative ?",
    en: "An ETF's exchange price temporarily rises above the value of the securities it actually holds. What mechanism typically brings this price back toward its net asset value?",
  },
  choices: [
    { id: "authorized-participant-arbitrage", label: { fr: "Un participant autorisé crée de nouvelles parts en apportant les titres sous-jacents et les revend en bourse, captant l'écart et le refermant", en: "An authorized participant creates new shares by contributing the underlying securities and resells them on the exchange, capturing the gap and closing it" } },
    { id: "regulator-intervention", label: { fr: "Le régulateur boursier suspend automatiquement la cotation jusqu'à correction de l'écart", en: "The exchange regulator automatically suspends trading until the gap is corrected" } },
    { id: "gap-persists-indefinitely", label: { fr: "Aucun mécanisme ne permet de refermer cet écart, qui persiste indéfiniment", en: "No mechanism can close this gap, which persists indefinitely" } },
    { id: "index-committee-adjusts", label: { fr: "Le comité d'indice ajuste directement la composition de l'indice pour refermer l'écart", en: "The index committee directly adjusts the index's composition to close the gap" } },
  ],
  correctId: "authorized-participant-arbitrage",
  hint: { fr: "C'est un mécanisme d'arbitrage, comme vu au tout début du module.", en: "This is an arbitrage mechanism, as seen at the very start of the module." },
  explanation: {
    fr: "Le mécanisme de création/rachat, opéré par des participants autorisés, permet d'exploiter tout écart entre le prix de l'ETF et sa valeur liquidative : si l'ETF cote au-dessus de la valeur de ses titres, un participant autorisé crée de nouvelles parts en apportant les titres sous-jacents puis les revend en bourse, réalisant un profit d'arbitrage qui referme mécaniquement l'écart — exactement la logique d'arbitrage vue au début de ce module, appliquée ici aux ETF.",
    en: "The creation/redemption mechanism, operated by authorized participants, allows any gap between the ETF's price and its net asset value to be exploited: if the ETF trades above the value of its securities, an authorized participant creates new shares by contributing the underlying securities and then resells them on the exchange, earning an arbitrage profit that mechanically closes the gap — exactly the arbitrage logic seen at the start of this module, applied here to ETFs.",
  },
  commonMistake: {
    fr: "Croire qu'un écart entre le prix d'un ETF et sa valeur liquidative ne peut se refermer que par une intervention du régulateur ou du comité d'indice.",
    en: "Believing a gap between an ETF's price and its net asset value can only close through regulator or index committee intervention.",
  },
});

const replicationChoiceScenarioTemplate = mcqTemplate({
  id: "m01-indices-etf-scenario-choix-replication",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur institutionnel, très averse à tout risque de contrepartie supplémentaire dans son portefeuille, doit choisir entre deux ETF répliquant le même indice : l'un à réplication physique, l'autre à réplication synthétique offrant un coût légèrement inférieur. Quel choix est le plus cohérent avec sa contrainte ?",
    en: "An institutional investor, very averse to any additional counterparty risk in their portfolio, must choose between two ETFs tracking the same index: one physically replicated, the other synthetically replicated at a slightly lower cost. What choice is most consistent with their constraint?",
  },
  choices: [
    { id: "physical-etf", label: { fr: "L'ETF à réplication physique, qui évite l'exposition supplémentaire à une contrepartie bancaire via un swap", en: "The physically replicated ETF, which avoids the additional exposure to a bank counterparty via a swap" } },
    { id: "synthetic-etf-cheaper", label: { fr: "L'ETF à réplication synthétique, le coût inférieur devant toujours l'emporter sur toute autre considération", en: "The synthetically replicated ETF, the lower cost always outweighing any other consideration" } },
    { id: "either-equally-fine", label: { fr: "Les deux options sont rigoureusement équivalentes du point de vue du risque de contrepartie", en: "Both options are strictly equivalent from a counterparty risk standpoint" } },
    { id: "neither-suitable", label: { fr: "Aucun des deux ETF ne peut convenir, quelle que soit la méthode de réplication choisie", en: "Neither ETF can be suitable, whatever the chosen replication method" } },
  ],
  correctId: "physical-etf",
  hint: { fr: "La contrainte explicite porte sur l'aversion au risque de CONTREPARTIE, pas uniquement sur le coût.", en: "The explicit constraint is about aversion to COUNTERPARTY risk, not just cost." },
  explanation: {
    fr: "Compte tenu de sa contrainte explicite d'aversion au risque de contrepartie, l'ETF à réplication physique est le choix le plus cohérent : il évite l'exposition supplémentaire à la banque contrepartie du swap qu'implique la réplication synthétique, même si celle-ci offre un coût légèrement inférieur — un arbitrage coût/risque que chaque investisseur doit trancher selon ses propres contraintes.",
    en: "Given their explicit aversion-to-counterparty-risk constraint, the physically replicated ETF is the most consistent choice: it avoids the additional exposure to the swap's bank counterparty that synthetic replication implies, even though the latter offers a slightly lower cost — a cost/risk tradeoff each investor must settle according to their own constraints.",
  },
  commonMistake: {
    fr: "Choisir systématiquement l'option la moins coûteuse, sans tenir compte d'une contrainte explicite de risque exprimée par ailleurs.",
    en: "Systematically choosing the cheapest option, without accounting for an explicit risk constraint expressed elsewhere.",
  },
});

const trackingErrorComprehensionTemplate = mcqTemplate({
  id: "m01-indices-etf-comprehension-tracking-error",
  conceptId: "m01-indices-etf",
  difficulty: "medium",
  prompt: {
    fr: "Que signale un écart de réplication (tracking error) faible pour un ETF ?",
    en: "What does a low tracking error signal for an ETF?",
  },
  choices: [
    { id: "good-replication-quality", label: { fr: "Une bonne qualité de réplication : le rendement de l'ETF suit fidèlement celui de l'indice, à la hausse comme à la baisse", en: "Good replication quality: the ETF's return closely follows the index's, both up and down" } },
    { id: "index-performs-well", label: { fr: "Que l'indice répliqué affiche nécessairement une bonne performance absolue", en: "That the tracked index necessarily shows good absolute performance" } },
    { id: "low-cost-guaranteed", label: { fr: "Que les frais de gestion de l'ETF sont automatiquement les plus bas du marché", en: "That the ETF's management fees are automatically the lowest on the market" } },
    { id: "no-counterparty-risk", label: { fr: "Que l'ETF ne porte, par construction, aucun risque de contrepartie", en: "That the ETF carries, by construction, no counterparty risk at all" } },
  ],
  correctId: "good-replication-quality",
  hint: { fr: "La tracking error mesure l'écart ENTRE le rendement de l'ETF et celui de l'indice, pas la performance absolue de l'un ou l'autre.", en: "Tracking error measures the gap BETWEEN the ETF's return and the index's, not either one's absolute performance." },
  explanation: {
    fr: "L'écart de réplication mesure la dispersion de la différence entre le rendement de l'ETF et celui de l'indice qu'il réplique : un tracking error faible signale que l'ETF suit fidèlement son indice, quelle que soit la performance absolue de ce dernier (bonne ou mauvaise) — cette mesure est indépendante du niveau des frais affichés et ne dit rien du risque de contrepartie associé à la méthode de réplication.",
    en: "Tracking error measures the dispersion of the difference between the ETF's return and the return of the index it tracks: a low tracking error signals the ETF faithfully follows its index, whatever the index's absolute performance (good or bad) — this measure is independent of the displayed fee level and says nothing about the counterparty risk tied to the replication method.",
  },
  commonMistake: {
    fr: "Confondre la qualité de réplication d'un ETF (tracking error) avec la performance absolue de l'indice qu'il réplique.",
    en: "Confusing an ETF's replication quality (tracking error) with the absolute performance of the index it tracks.",
  },
});

const diversificationIllusionScenarioTemplate = mcqTemplate({
  id: "m01-indices-etf-scenario-illusion-diversification",
  conceptId: "m01-indices-etf",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un investisseur achète un ETF répliquant un grand indice pondéré par capitalisation boursière (des centaines de constituants), pensant obtenir une diversification maximale. Il découvre que les dix plus grandes entreprises représentent à elles seules plus du tiers du poids total de l'indice. Quelle conclusion est la plus juste ?",
    en: "An investor buys an ETF tracking a large market-cap-weighted index (hundreds of constituents), believing they get maximum diversification. They discover the ten largest companies alone represent more than a third of the index's total weight. What conclusion is most accurate?",
  },
  choices: [
    { id: "concentration-despite-many-names", label: { fr: "Malgré un grand nombre de constituants, l'exposition réelle reste concentrée sur une poignée de méga-capitalisations", en: "Despite a large number of constituents, the real exposure remains concentrated in a handful of mega-caps" } },
    { id: "impossible-scenario", label: { fr: "Ce scénario est impossible par construction dans un indice pondéré par capitalisation boursière", en: "This scenario is impossible by construction in a market-cap-weighted index" } },
    { id: "number-of-names-all-that-matters", label: { fr: "Le nombre de constituants suffit à lui seul à garantir une diversification effective", en: "The number of constituents alone is enough to guarantee effective diversification" } },
    { id: "etf-is-flawed-product", label: { fr: "Cela signifie que l'ETF est un produit mal construit, à éviter systématiquement", en: "This means the ETF is a poorly built product, to be systematically avoided" } },
  ],
  correctId: "concentration-despite-many-names",
  hint: { fr: "Un grand NOMBRE de constituants ne dit rien sur la répartition du POIDS entre eux.", en: "A large NUMBER of constituents says nothing about how WEIGHT is distributed among them." },
  explanation: {
    fr: "Ce scénario est parfaitement cohérent avec la construction d'un indice pondéré par capitalisation boursière : le nombre de constituants ne garantit pas à lui seul une diversification effective, car les plus grandes entreprises peuvent concentrer une part très significative du poids total — un investisseur cherchant une diversification plus homogène pourrait envisager un indice équipondéré, sans que cela ne rende l'ETF pondéré par capitalisation \"mal construit\" pour autant, il répond simplement à un objectif différent.",
    en: "This scenario is perfectly consistent with how a market-cap-weighted index is built: the number of constituents alone doesn't guarantee effective diversification, since the largest companies can concentrate a very significant share of the total weight — an investor seeking more even diversification might consider an equal-weighted index, without this making the cap-weighted ETF \"poorly built\", it simply serves a different objective.",
  },
  commonMistake: {
    fr: "Assimiler un grand nombre de constituants à une diversification automatiquement homogène, sans vérifier la répartition réelle des poids.",
    en: "Equating a large number of constituents with automatically even diversification, without checking the actual weight distribution.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  capWeightedVsEqualWeightedComparisonTemplate,
  physicalVsSyntheticComparisonTemplate,
  whatIfMegaCapSurgesTemplate,
  whatIfRebalancingTemplate,
  weightCalcTemplate,
  priceVsTotalReturnMistakeTemplate,
  syntheticEtfCounterpartyRiskMistakeTemplate,
  trackingErrorComprehensionTemplate,
  creationRedemptionScenarioTemplate,
  replicationChoiceScenarioTemplate,
  diversificationIllusionScenarioTemplate,
];
