import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

const definitionTemplate: QuestionTemplate = {
  id: "m07-second-ordre-definition",
  conceptId: "m07-greeks-second-ordre",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const greek = pick(rng, ["vanna", "volga"] as const);
    return {
      prompt: {
        fr: `Que mesure le ${greek === "vanna" ? "Vanna" : "Volga (Vomma)"} ?`,
        en: `What does ${greek === "vanna" ? "Vanna" : "Volga (Vomma)"} measure?`,
      },
      choices: buildChoices([
        { id: "vanna", label: { fr: "La sensibilité croisée entre le Delta et la volatilité", en: "The cross-sensitivity between Delta and volatility" } },
        { id: "volga", label: { fr: "La convexité du prix par rapport à la volatilité elle-même", en: "The price's convexity with respect to volatility itself" } },
      ]),
      hint: { fr: "L'un est une sensibilité croisée (spot-vol), l'autre une convexité pure (vol-vol).", en: "One is a cross-sensitivity (spot-vol), the other a pure convexity (vol-vol)." },
      correctChoiceIds: [greek],
      explanation:
        greek === "vanna"
          ? { fr: "Le Vanna = ∂²V/∂S∂σ mesure comment le Delta change avec la volatilité (ou le Vega avec le spot).", en: "Vanna = ∂²V/∂S∂σ measures how Delta changes with volatility (or Vega with spot)." }
          : { fr: "Le Volga = ∂²V/∂σ² mesure la convexité du prix par rapport à la volatilité, comme le Gamma le fait pour le spot.", en: "Volga = ∂²V/∂σ² measures the price's convexity with respect to volatility, as Gamma does for spot." },
      commonMistake: {
        fr: "Confondre les deux sensibilités de second ordre, qui répondent à des questions différentes.",
        en: "Confusing the two second-order sensitivities, which answer different questions.",
      },
    };
  },
};

const identicalCallPutTemplate: QuestionTemplate = {
  id: "m07-second-ordre-call-put",
  conceptId: "m07-greeks-second-ordre",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Comme Gamma et Vega, le Vanna et le Volga sont identiques pour un call et un put de mêmes caractéristiques.",
      en: "Like Gamma and Vega, Vanna and Volga are identical for a call and a put with the same characteristics.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : comme Gamma et Vega, Vanna et Volga se déduisent de dérivées qui ne dépendent pas du signe du payoff terminal, donc ils sont identiques pour un call et un put.",
      en: "True: like Gamma and Vega, Vanna and Volga follow from derivatives that don't depend on the terminal payoff's sign, so they are identical for a call and a put.",
    },
    commonMistake: {
      fr: "Supposer par défaut que tous les Greeks de second ordre diffèrent entre call et put, comme Delta et Rho.",
      en: "Assuming by default that all second-order Greeks differ between call and put, like Delta and Rho.",
    },
  }),
};

const usageTemplate: QuestionTemplate = {
  id: "m07-second-ordre-usage",
  conceptId: "m07-greeks-second-ordre",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Un desk exotique gère un livre d'options avec des strikes et échéances très variés. Pourquoi le Vanna et le Volga sont-ils particulièrement importants pour ce desk, au-delà de Delta/Gamma/Vega ?",
      en: "An exotics desk manages an options book with widely varying strikes and maturities. Why are Vanna and Volga particularly important for this desk, beyond Delta/Gamma/Vega?",
    },
    choices: buildChoices([
      { id: "smile", label: { fr: "Ils capturent l'exposition à la FORME du smile de volatilité, pas seulement à son niveau moyen", en: "They capture exposure to the SHAPE of the volatility smile, not just its average level" } },
      { id: "cost", label: { fr: "Ils réduisent les coûts de transaction du rééquilibrage", en: "They reduce rebalancing transaction costs" } },
    ]),
    hint: { fr: "Pensez à ce que Delta/Gamma/Vega seuls ne peuvent pas capturer sur un livre à strikes variés.", en: "Think about what Delta/Gamma/Vega alone can't capture on a book with varied strikes." },
    correctChoiceIds: ["smile"],
    explanation: {
      fr: "Un livre avec des strikes variés est exposé à des mouvements combinés de spot et de volatilité, et à des changements de forme du smile — un risque que seuls Vanna et Volga permettent d'isoler et de couvrir séparément.",
      en: "A book with varied strikes is exposed to combined spot-and-volatility moves, and to changes in the smile's shape — a risk only Vanna and Volga let you isolate and hedge separately.",
    },
    commonMistake: {
      fr: "Croire que ces Greeks de second ordre n'ont qu'un intérêt académique, sans usage pratique sur un desk.",
      en: "Believing these second-order Greeks are only of academic interest, with no practical desk use.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-second-ordre-vocab",
  conceptId: "m07-greeks-second-ordre",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Volga est aussi appelé ______, un terme forgé par analogie avec Gamma pour désigner la convexité par rapport à la volatilité.",
      en: "Volga is also called ______, a term coined by analogy with Gamma to denote convexity with respect to volatility.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vomma"],
    hint: { fr: "Un mot-valise autour de \"vol\" et \"Gamma\".", en: "A portmanteau around \"vol\" and \"Gamma\"." },
    explanation: {
      fr: "Volga et Vomma sont deux noms pour la même sensibilité : ∂²V/∂σ², la convexité du prix par rapport à la volatilité.",
      en: "Volga and Vomma are two names for the same sensitivity: ∂²V/∂σ², the price's convexity with respect to volatility.",
    },
    commonMistake: {
      fr: "Croire que Volga et Vomma désignent deux Greeks différents, alors que ce sont des synonymes.",
      en: "Believing Volga and Vomma denote two different Greeks, when they are synonyms.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m07-second-ordre-comprehension-utilite",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi Delta, Gamma et Vega seuls ne suffisent-ils pas à décrire complètement le risque d'un livre d'options exposé à des mouvements combinés de spot et de volatilité ?",
    en: "Why aren't Delta, Gamma and Vega alone enough to fully describe the risk of an options book exposed to combined spot and volatility moves?",
  },
  choices: [
    { id: "cross-sensitivity", label: { fr: "Parce qu'ils mesurent chacun une sensibilité à UN seul facteur pris isolément, sans capturer l'effet d'un mouvement SIMULTANÉ du spot et de la volatilité", en: "Because each measures sensitivity to ONE single factor in isolation, without capturing the effect of a SIMULTANEOUS spot and volatility move" } },
    { id: "already-sufficient", label: { fr: "Ils suffisent toujours amplement, les Greeks de second ordre n'ajoutent aucune information utile", en: "They are always plenty sufficient, second-order Greeks add no useful information" } },
    { id: "only-for-large-books", label: { fr: "Cela ne concerne que les très gros livres, jamais une position individuelle", en: "This only concerns very large books, never an individual position" } },
  ],
  correctId: "cross-sensitivity",
  hint: { fr: "Delta et Vega sont des sensibilités à UN facteur ; que se passe-t-il si spot ET volatilité bougent EN MÊME TEMPS ?", en: "Delta and Vega are sensitivities to ONE factor; what happens if spot AND volatility move AT THE SAME TIME?" },
  explanation: {
    fr: "Delta mesure la sensibilité au spot seul, Vega à la volatilité seule : ni l'un ni l'autre ne capture comment le Delta lui-même change quand la volatilité bouge (le Vanna), ou comment le Vega change quand la volatilité elle-même bouge (le Volga). Or spot et volatilité bougent rarement de façon totalement indépendante (le skew, M08), rendant ces sensibilités croisées essentielles pour un livre riche en options à strikes variés.",
    en: "Delta measures sensitivity to spot alone, Vega to volatility alone: neither captures how Delta itself changes when volatility moves (Vanna), or how Vega changes when volatility itself moves (Volga). Spot and volatility rarely move totally independently (the skew, M08), making these cross-sensitivities essential for a book rich in options across varied strikes.",
  },
  commonMistake: {
    fr: "Croire que couvrir Delta, Gamma et Vega séparément élimine tout risque résiduel, en ignorant les sensibilités croisées qui apparaissent dès que plusieurs facteurs bougent ensemble.",
    en: "Believing hedging Delta, Gamma and Vega separately eliminates all residual risk, ignoring the cross-sensitivities that appear as soon as several factors move together.",
  },
});

const vannaVsVolgaSignComparisonTemplate = mcqTemplate({
  id: "m07-second-ordre-comparaison-signe",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "hard",
  prompt: {
    fr: "Comparez le signe du Vanna et celui du Volga pour une option vanille standard. Lequel des deux peut changer de signe selon le niveau du strike, et lequel reste toujours positif ?",
    en: "Compare the sign of Vanna and of Volga for a standard vanilla option. Which of the two can change sign depending on the strike level, and which always stays positive?",
  },
  choices: [
    { id: "vanna-changes-volga-positive", label: { fr: "Le Vanna peut être positif ou négatif selon le strike (ITM vs OTM) ; le Volga reste toujours positif, comme une convexité pure", en: "Vanna can be positive or negative depending on the strike (ITM vs OTM); Volga always stays positive, like a pure convexity" } },
    { id: "both-always-positive", label: { fr: "Les deux sont toujours strictement positifs, sans exception", en: "Both are always strictly positive, with no exception" } },
    { id: "both-change-sign", label: { fr: "Les deux peuvent changer de signe selon le strike", en: "Both can change sign depending on the strike" } },
  ],
  correctId: "vanna-changes-volga-positive",
  hint: { fr: "Le Volga mesure une convexité (comme le Gamma) ; une convexité pure est structurellement de signe constant.", en: "Volga measures a convexity (like Gamma); a pure convexity is structurally of constant sign." },
  explanation: {
    fr: "Le Volga (∂²V/∂σ²) mesure une convexité pure par rapport à la volatilité, exactement comme le Gamma le fait pour le spot : il reste toujours positif pour une option vanille (une hausse de la vol de la vol favorise toujours le détenteur). Le Vanna (∂²V/∂S∂σ), une sensibilité CROISÉE, change en revanche de signe selon que l'option est ITM ou OTM, reflétant des dynamiques différentes de la relation Delta-volatilité selon le régime.",
    en: "Volga (∂²V/∂σ²) measures a pure convexity with respect to volatility, exactly as Gamma does for spot: it always stays positive for a vanilla option (a rise in the vol of vol always benefits the holder). Vanna (∂²V/∂S∂σ), a CROSS sensitivity, instead changes sign depending on whether the option is ITM or OTM, reflecting different dynamics of the Delta-volatility relationship by regime.",
  },
  commonMistake: {
    fr: "Croire que le Vanna, comme le Volga, garde toujours le même signe, en oubliant que c'est une sensibilité croisée, structurellement différente d'une convexité pure.",
    en: "Believing Vanna, like Volga, always keeps the same sign, forgetting it's a cross sensitivity, structurally different from a pure convexity.",
  },
});

const whatIfSpotVolCorrelatedTemplate = mcqTemplate({
  id: "m07-second-ordre-whatif-correlation-spot-vol",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sur les actions, le spot et la volatilité implicite sont typiquement NÉGATIVEMENT corrélés (le skew : la vol monte quand le prix baisse). Pour un livre exposé au Vanna, pourquoi cette corrélation empirique rend-elle le Vanna particulièrement important à surveiller, au-delà des scénarios théoriques \"toutes choses égales par ailleurs\" ?",
    en: "In equities, spot and implied volatility are typically NEGATIVELY correlated (the skew: vol rises when price falls). For a book exposed to Vanna, why does this empirical correlation make Vanna particularly important to monitor, beyond theoretical \"all else equal\" scenarios?",
  },
  choices: [
    { id: "joint-move-realized", label: { fr: "Parce que spot et vol bougent RÉELLEMENT ensemble en pratique : le P&L de Vanna se matérialise donc systématiquement lors d'un choc de marché typique, pas seulement dans un scénario académique isolé", en: "Because spot and vol REALLY move together in practice: Vanna's P&L therefore systematically materializes during a typical market shock, not just in an isolated academic scenario" } },
    { id: "theoretical-only", label: { fr: "Cette corrélation empirique n'a aucune incidence sur le P&L réellement réalisé par le Vanna", en: "This empirical correlation has no bearing on the P&L actually realized by Vanna" } },
    { id: "cancels-vanna", label: { fr: "Cette corrélation annule systématiquement tout effet du Vanna", en: "This correlation systematically cancels out any Vanna effect" } },
  ],
  correctId: "joint-move-realized",
  hint: { fr: "Le Vanna mesure une sensibilité à un mouvement CONJOINT de spot et de vol — que se passe-t-il si ce mouvement conjoint arrive systématiquement dans la réalité ?", en: "Vanna measures a sensitivity to a JOINT spot-and-vol move — what happens if that joint move systematically occurs in reality?" },
  explanation: {
    fr: "Puisque spot et volatilité bougent empiriquement ensemble (le skew equity typique : baisse du spot + hausse de la vol), le P&L issu du Vanna n'est pas un simple cas théorique isolé, mais se matérialise systématiquement à chaque choc de marché baissier typique : un livre avec un Vanna significatif subit donc un risque réel et récurrent, pas seulement un risque abstrait de manuel.",
    en: "Since spot and volatility empirically move together (the typical equity skew: spot falling + vol rising), Vanna's resulting P&L isn't a simple isolated theoretical case, but systematically materializes during every typical bearish market shock: a book with significant Vanna therefore carries a real, recurring risk, not just an abstract textbook risk.",
  },
  commonMistake: {
    fr: "Traiter le Vanna comme un risque purement théorique sans conséquence pratique, en ignorant la corrélation empirique bien documentée entre spot et volatilité implicite.",
    en: "Treating Vanna as a purely theoretical risk with no practical consequence, ignoring the well-documented empirical correlation between spot and implied volatility.",
  },
});

const whatIfSmileFlattensTemplate = mcqTemplate({
  id: "m07-second-ordre-whatif-smile-aplati",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "hard",
  prompt: {
    fr: "Si le smile de volatilité s'aplatit (moins de courbure entre strikes), quel Greek de second ordre voit son importance relative diminuer le plus directement ?",
    en: "If the volatility smile flattens (less curvature across strikes), which second-order Greek sees its relative importance decrease most directly?",
  },
  choices: [
    { id: "volga", label: { fr: "Le Volga : moins de convexité de volatilité à capturer si le smile devient quasiment plat", en: "Volga: less volatility convexity to capture if the smile becomes nearly flat" } },
    { id: "delta", label: { fr: "Le Delta, un Greek de premier ordre non concerné par cette question", en: "Delta, a first-order Greek unrelated to this question" } },
    { id: "none", label: { fr: "Aucun Greek n'est affecté par la forme du smile", en: "No Greek is affected by the smile's shape" } },
  ],
  correctId: "volga",
  hint: { fr: "Le Volga capture la convexité de la vol — qu'est-ce qu'un smile plat implique pour cette convexité ?", en: "Volga captures volatility's convexity — what does a flat smile imply for that convexity?" },
  explanation: {
    fr: "Un smile plat signifie que la volatilité implicite varie peu selon le strike : la « convexité » globale de la surface de volatilité (ce que le Volga cherche à capturer à l'échelle d'un portefeuille multi-strikes) devient moins pertinente, réduisant l'exposition effective au risque de Volga — même si, pour une option individuelle, le Volga mathématique reste positif et non nul.",
    en: "A flat smile means implied volatility varies little by strike: the volatility surface's overall \"convexity\" (what Volga seeks to capture at a multi-strike portfolio scale) becomes less relevant, reducing effective exposure to Volga risk — even though, for an individual option, the mathematical Volga stays positive and non-zero.",
  },
  commonMistake: {
    fr: "Croire que la forme de la surface de volatilité n'a aucun rapport avec l'importance pratique des Greeks de second ordre sur un livre réel.",
    en: "Believing the volatility surface's shape has no bearing on second-order Greeks' practical importance on a real book.",
  },
});

const skewShiftScenarioTemplate = mcqTemplate({
  id: "m07-second-ordre-scenario-changement-skew",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une banque centrale annonce une politique surprise qui modifie durablement la forme du skew equity (les puts OTM deviennent relativement bien plus chers qu'avant, sans aucun mouvement du spot ni du niveau moyen de volatilité). Quel Greek de second ordre est le plus directement concerné par ce type de choc \"pur\" sur la forme du smile ?",
    en: "A central bank announces a surprise policy that durably reshapes the equity skew (OTM puts become relatively much pricier than before, with no move in spot or the average volatility level). Which second-order Greek is most directly concerned by this kind of \"pure\" smile-shape shock?",
  },
  choices: [
    { id: "vanna-relevant", label: { fr: "Le Vanna, car un changement de forme du skew modifie la relation entre spot et volatilité perçue par strike, même sans mouvement du niveau moyen", en: "Vanna, since a skew-shape change alters the relationship between spot and perceived volatility by strike, even with no move in the average level" } },
    { id: "vega-only", label: { fr: "Uniquement le Vega, un changement de forme du smile n'a aucun rapport avec les Greeks de second ordre", en: "Only Vega, a smile-shape change has nothing to do with second-order Greeks" } },
    { id: "none-affected", label: { fr: "Aucun Greek n'est affecté puisque ni le spot ni le niveau moyen de volatilité n'ont bougé", en: "No Greek is affected since neither spot nor the average volatility level moved" } },
  ],
  correctId: "vanna-relevant",
  hint: { fr: "Le Vanna capture justement comment la sensibilité au spot (le Delta) varie selon le niveau de volatilité par strike — la définition même d'un changement de forme du skew.", en: "Vanna precisely captures how sensitivity to spot (Delta) varies with the volatility level by strike — the very definition of a skew-shape change." },
  explanation: {
    fr: "Un changement de forme du skew (et non simplement de son niveau moyen, ce que Vega capture) modifie directement la relation entre le prix du spot et la volatilité perçue selon le strike : c'est exactement ce que le Vanna est censé capturer et couvrir. Un livre avec une exposition Vanna significative peut donc subir un P&L notable lors d'un tel choc, même sans aucun mouvement de spot ni de niveau moyen de volatilité.",
    en: "A skew-shape change (not simply its average level, which Vega captures) directly alters the relationship between the spot price and perceived volatility by strike: this is exactly what Vanna is meant to capture and hedge. A book with significant Vanna exposure can therefore suffer notable P&L from such a shock, even with no move in spot or the average volatility level at all.",
  },
  commonMistake: {
    fr: "Croire qu'un choc n'affectant ni le spot ni le niveau moyen de volatilité est nécessairement sans impact sur un livre d'options, en oubliant les risques de forme du smile capturés par les Greeks de second ordre.",
    en: "Believing a shock affecting neither spot nor the average volatility level necessarily has no impact on an options book, forgetting the smile-shape risks captured by second-order Greeks.",
  },
});

const vannaPnlNumericTemplate: QuestionTemplate = {
  id: "m07-second-ordre-pnl-vanna-calcul",
  conceptId: "m07-greeks-second-ordre",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const vanna = randomInt(rng, 100, 2000);
    const deltaSpotPct = randomInt(rng, -5, 5) || 1;
    const deltaVolPct = randomInt(rng, -5, 5) || 1;
    const pnl = Math.round(vanna * (deltaSpotPct / 100) * (deltaVolPct / 100) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a un Vanna de ${vanna}. Le spot varie de ${deltaSpotPct}% et la volatilité implicite varie simultanément de ${deltaVolPct} points de pourcentage. Quel est le P&L approximatif issu du seul terme de Vanna ?`,
        en: `A position has a Vanna of ${vanna}. Spot moves by ${deltaSpotPct}% and implied volatility simultaneously moves by ${deltaVolPct} percentage points. What is the approximate P&L from the Vanna term alone?`,
      },
      numericUnit: { fr: "même devise que la position", en: "same currency as the position" },
      numericTolerance: "± 1",
      hint: { fr: "P&L_Vanna ≈ Vanna × ΔS(en %) × Δσ(en proportion).", en: "Vanna P&L ≈ Vanna × ΔS(in %) × Δσ(as a proportion)." },
      numeric: { value: pnl, tolerance: 1 },
      calculation: {
        fr: `P&L ≈ ${vanna} × ${deltaSpotPct}% × ${deltaVolPct}% ≈ ${fmt(pnl, "fr")}.`,
        en: `P&L ≈ ${vanna} × ${deltaSpotPct}% × ${deltaVolPct}% ≈ ${fmt(pnl, "en")}.`,
      },
      explanation: {
        fr: "Ce terme croisé n'existe que lorsque spot ET volatilité bougent tous les deux : un mouvement de l'un seul sans l'autre ne génère aucun P&L de Vanna, contrairement au Delta ou au Vega qui réagissent chacun à un seul facteur.",
        en: "This cross term only exists when spot AND volatility both move: a move in just one without the other generates no Vanna P&L, unlike Delta or Vega which each react to a single factor.",
      },
      commonMistake: {
        fr: "Appliquer la formule même si un seul des deux facteurs (spot ou vol) a bougé, en oubliant que le Vanna est un effet spécifiquement CROISÉ.",
        en: "Applying the formula even if only one of the two factors (spot or vol) moved, forgetting Vanna is a specifically CROSS effect.",
      },
    };
  },
};

const firstOrderSufficesErrorTemplate = trueFalseTemplate({
  id: "m07-second-ordre-erreur-premier-ordre-suffit",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "medium",
  statement: {
    fr: "Couvrir Delta, Gamma et Vega élimine tout risque résiduel d'un livre d'options exposé à des mouvements combinés de spot et de volatilité.",
    en: "Hedging Delta, Gamma and Vega eliminates all residual risk of an options book exposed to combined spot and volatility moves.",
  },
  correct: false,
  explanation: {
    fr: "Faux : Delta, Gamma et Vega ne couvrent que des sensibilités à un facteur pris isolément (ou sa convexité propre pour Gamma). Un risque résiduel subsiste dès que spot et volatilité bougent ensemble (capturé par le Vanna) ou que la volatilité elle-même devient plus incertaine (capturé par le Volga) — d'où l'intérêt des Greeks de second ordre pour un livre exposé à ces risques croisés.",
    en: "False: Delta, Gamma and Vega only cover sensitivities to a single factor taken in isolation (or its own convexity for Gamma). A residual risk remains as soon as spot and volatility move together (captured by Vanna) or volatility itself becomes more uncertain (captured by Volga) — hence the value of second-order Greeks for a book exposed to these cross risks.",
  },
  commonMistake: {
    fr: "Croire qu'une couverture Delta-Gamma-Vega complète élimine tout risque, en ignorant les risques croisés capturés par Vanna et Volga.",
    en: "Believing a complete Delta-Gamma-Vega hedge eliminates all risk, ignoring the cross risks captured by Vanna and Volga.",
  },
});

const exoticDeskScenarioTemplate = mcqTemplate({
  id: "m07-second-ordre-scenario-desk-exotique",
  conceptId: "m07-greeks-second-ordre",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk qui vend des autocalls (M11) couvre son Delta, Gamma et Vega quotidiennement, mais constate un P&L résiduel systématique les jours où le marché baisse ET où la volatilité implicite monte fortement. Quel Greek non couvert explique le plus probablement ce résidu ?",
    en: "A desk selling autocalls (M11) hedges its Delta, Gamma and Vega daily, but observes a systematic residual P&L on days when the market falls AND implied volatility rises sharply. Which unhedged Greek most likely explains this residual?",
  },
  choices: [
    { id: "vanna", label: { fr: "Le Vanna, dont l'effet ne se manifeste précisément que lors d'un mouvement CONJOINT de spot et de volatilité", en: "Vanna, whose effect precisely only shows up during a JOINT spot-and-volatility move" } },
    { id: "theta", label: { fr: "Le Theta, sans lien avec le mouvement conjoint spot-volatilité décrit", en: "Theta, unrelated to the joint spot-volatility move described" } },
    { id: "rho", label: { fr: "Le Rho, sans lien avec ce scénario", en: "Rho, unrelated to this scenario" } },
  ],
  correctId: "vanna",
  hint: { fr: "Le résidu apparaît précisément les jours où DEUX facteurs bougent ensemble — quel Greek est spécifiquement une sensibilité croisée entre ces deux facteurs ?", en: "The residual appears precisely on days when TWO factors move together — which Greek is specifically a cross-sensitivity between these two factors?" },
  explanation: {
    fr: "Un P&L résiduel systématique précisément lors de mouvements conjoints de spot et de volatilité est la signature caractéristique d'un Vanna non couvert : la couverture Delta-Gamma-Vega, qui ne traite chaque facteur qu'isolément, laisse ce risque croisé sans protection. Le desk devrait envisager d'ajouter une couverture de Vanna (généralement via une combinaison d'options de strikes différents) pour éliminer ce résidu récurrent.",
    en: "A systematic residual P&L precisely on days of joint spot-and-volatility moves is the characteristic signature of unhedged Vanna: the Delta-Gamma-Vega hedge, which only treats each factor in isolation, leaves this cross risk unprotected. The desk should consider adding a Vanna hedge (usually via a combination of options at different strikes) to eliminate this recurring residual.",
  },
  commonMistake: {
    fr: "Chercher l'explication d'un résidu de P&L uniquement parmi les Greeks de premier ordre déjà couverts, sans envisager un risque croisé de second ordre non couvert.",
    en: "Looking for a P&L residual's explanation only among already-hedged first-order Greeks, without considering an unhedged second-order cross risk.",
  },
});

export const templates: QuestionTemplate[] = [
  definitionTemplate,
  identicalCallPutTemplate,
  usageTemplate,
  vocabTemplate,
  comprehensionTemplate,
  vannaVsVolgaSignComparisonTemplate,
  whatIfSpotVolCorrelatedTemplate,
  whatIfSmileFlattensTemplate,
  skewShiftScenarioTemplate,
  vannaPnlNumericTemplate,
  firstOrderSufficesErrorTemplate,
  exoticDeskScenarioTemplate,
];

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
