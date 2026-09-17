import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const noDriftTemplate: QuestionTemplate = {
  id: "m06-bs-pas-de-drift",
  conceptId: "m06-black-scholes",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'équation aux dérivées partielles de Black-Scholes contient explicitement le rendement moyen attendu (drift μ) du sous-jacent.",
      en: "The Black-Scholes partial differential equation explicitly contains the underlying's expected average return (drift μ).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : remarquablement, l'équation ne contient que r (le taux sans risque), pas μ — une conséquence directe du delta-hedging qui rend le portefeuille de réplication insensible au drift réel.",
      en: "False: remarkably, the equation only contains r (the risk-free rate), not μ — a direct consequence of delta-hedging, which makes the replicating portfolio insensitive to the true drift.",
    },
    commonMistake: {
      fr: "Croire que le prix d'une option dépend d'une prévision du rendement futur du sous-jacent.",
      en: "Believing an option's price depends on a forecast of the underlying's future return.",
    },
  }),
};

const hedgeRatioTemplate: QuestionTemplate = {
  id: "m06-bs-ratio-couverture",
  conceptId: "m06-black-scholes",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Dans la démonstration de Black-Scholes, quelle quantité d'actions Δ faut-il détenir en face d'une position courte sur l'option pour annuler le risque instantané lié à dW_t ?",
      en: "In the Black-Scholes derivation, how many shares Δ must be held against a short option position to cancel the instantaneous risk from dW_t?",
    },
    choices: buildChoices([
      { id: "dvds", label: { fr: "Δ = ∂V/∂S", en: "Δ = ∂V/∂S" } },
      { id: "vs", label: { fr: "Δ = V/S", en: "Δ = V/S" } },
      { id: "one", label: { fr: "Δ = 1, toujours", en: "Δ = 1, always" } },
    ]),
    hint: { fr: "C'est la sensibilité du prix de l'option à une petite variation du sous-jacent.", en: "It's the option price's sensitivity to a small change in the underlying." },
    correctChoiceIds: ["dvds"],
    explanation: {
      fr: "Δ = ∂V/∂S, la dérivée du prix de l'option par rapport au sous-jacent, est exactement le ratio qui annule le terme en dW_t dans dΠ = dV − ΔdS.",
      en: "Δ = ∂V/∂S, the option price's derivative with respect to the underlying, is exactly the ratio that cancels the dW_t term in dΠ = dV − ΔdS.",
    },
    commonMistake: {
      fr: "Confondre le ratio de couverture Δ avec le prix de l'option divisé par le prix du sous-jacent.",
      en: "Confusing the hedge ratio Δ with the option's price divided by the underlying's price.",
    },
  }),
};

const assumptionTemplate: QuestionTemplate = {
  id: "m06-bs-hypothese",
  conceptId: "m06-black-scholes",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notAssumption = pick(
      rng,
      [
        { id: "jumps", fr: "Le prix du sous-jacent peut subir des sauts brusques (discontinuités)", en: "The underlying's price can jump abruptly (discontinuities)" },
        { id: "dividends", fr: "L'actif verse des dividendes variables et imprévisibles", en: "The asset pays variable, unpredictable dividends" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle de ces situations est EXCLUE par les hypothèses du modèle de Black-Scholes de base : « ${notAssumption.fr} » ?`,
        en: `Which of these situations is EXCLUDED by the basic Black-Scholes model's assumptions: "${notAssumption.en}"?`,
      },
      choices: buildChoices([
        { id: "excluded", label: { fr: "Exclue : ce n'est pas une hypothèse du modèle de base", en: "Excluded: not an assumption of the basic model" } },
        { id: "included", label: { fr: "Incluse : c'est compatible avec le modèle de base", en: "Included: compatible with the basic model" } },
      ]),
      hint: { fr: "Le modèle de base suppose un brownien géométrique continu, sans dividende.", en: "The basic model assumes a continuous geometric Brownian motion, with no dividend." },
      correctChoiceIds: ["excluded"],
      explanation: {
        fr: `Le modèle de Black-Scholes de base exclut ${notAssumption.id === "jumps" ? "les sauts de prix (le sous-jacent suit un brownien géométrique CONTINU)" : "tout dividende (hypothèse d'absence de dividende)"} — des extensions du modèle existent pour relâcher cette hypothèse, mais pas le modèle de base.`,
        en: `The basic Black-Scholes model excludes ${notAssumption.id === "jumps" ? "price jumps (the underlying follows a CONTINUOUS geometric Brownian motion)" : "any dividend (the no-dividend assumption)"} — extensions of the model exist to relax this assumption, but not the basic model.`,
      },
      commonMistake: {
        fr: "Croire que le modèle de base gère nativement les dividendes ou les sauts de prix, sans extension.",
        en: "Believing the basic model natively handles dividends or price jumps, without extension.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-bs-vocab",
  conceptId: "m06-black-scholes",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un portefeuille dont la valeur ne change qu'à cause des variations de prix des actifs qui le composent, sans apport ni retrait externe d'argent, est dit auto-______.",
      en: "A portfolio whose value only changes due to price moves of its component assets, with no external cash added or withdrawn, is said to be self-______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word (financing)" },
    acceptedAnswers: ["finance", "financé", "financing"],
    hint: { fr: "Il se \"finance\" tout seul.", en: "It \"finances\" itself." },
    explanation: {
      fr: "Un portefeuille auto-financé est une hypothèse clé de la démonstration de Black-Scholes : le rééquilibrage du delta-hedging se fait sans injection ni retrait de cash externe.",
      en: "A self-financing portfolio is a key assumption in the Black-Scholes derivation: delta-hedging rebalancing happens with no external cash injection or withdrawal.",
    },
    commonMistake: {
      fr: "Croire qu'un portefeuille auto-financé signifie qu'il ne nécessite aucun rééquilibrage.",
      en: "Believing a self-financing portfolio means it needs no rebalancing at all.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-bs-comprehension-utilite",
  conceptId: "m06-black-scholes",
  difficulty: "medium",
  prompt: {
    fr: "Quelle est la conséquence pratique la plus importante du fait que l'équation de Black-Scholes ne dépend pas du drift μ du sous-jacent ?",
    en: "What is the most important practical consequence of the fact that the Black-Scholes equation doesn't depend on the underlying's drift μ?",
  },
  choices: [
    { id: "no-forecast-needed", label: { fr: "On peut pricer une option sans avoir à prévoir le rendement futur du sous-jacent, un paramètre en pratique impossible à estimer avec fiabilité", en: "An option can be priced without forecasting the underlying's future return, a parameter that is in practice impossible to reliably estimate" } },
    { id: "price-independent-of-vol", label: { fr: "Le prix de l'option ne dépend pas non plus de la volatilité", en: "The option's price also doesn't depend on volatility" } },
    { id: "no-consequence", label: { fr: "Cela n'a aucune conséquence pratique, c'est un détail purement mathématique", en: "This has no practical consequence, it's a purely mathematical detail" } },
  ],
  correctId: "no-forecast-needed",
  hint: { fr: "Pensez à ce que deux traders aux vues opposées sur la direction du marché peuvent quand même se mettre d'accord.", en: "Think about what two traders with opposite views on the market's direction can still agree on." },
  explanation: {
    fr: "C'est une conséquence remarquable : deux investisseurs peuvent avoir des vues radicalement opposées sur le rendement futur attendu du sous-jacent (μ), et pourtant s'accorder exactement sur le prix d'une option, puisque ce prix ne dépend que de r (observable) et σ (estimable à partir de la volatilité, pas du rendement). Cela évite d'avoir à estimer un paramètre notoirement difficile à mesurer avec précision.",
    en: "This is a remarkable consequence: two investors can hold radically opposing views on the underlying's expected future return (μ), and yet agree exactly on an option's price, since that price depends only on r (observable) and σ (estimable from volatility, not return). This avoids having to estimate a parameter notoriously hard to measure precisely.",
  },
  commonMistake: {
    fr: "Croire qu'un prix d'option reflète une anticipation de marché sur la direction future du sous-jacent, alors que le pricing par réplication l'élimine justement de l'équation.",
    en: "Believing an option's price reflects a market forecast about the underlying's future direction, when replication-based pricing precisely eliminates it from the equation.",
  },
});

const pdeVsMonteCarloComparisonTemplate = mcqTemplate({
  id: "m06-bs-comparaison-edp-monte-carlo",
  conceptId: "m06-black-scholes",
  difficulty: "hard",
  prompt: {
    fr: "Comparez résoudre l'équation aux dérivées partielles de Black-Scholes analytiquement, et estimer le prix par Monte-Carlo (M06) sous la mesure risque-neutre. Pour une option vanille, ces deux approches donnent-elles le même prix ?",
    en: "Compare solving the Black-Scholes partial differential equation analytically, and estimating the price by Monte-Carlo (M06) under the risk-neutral measure. For a vanilla option, do these two approaches give the same price?",
  },
  choices: [
    { id: "same-price", label: { fr: "Oui, en théorie (à l'erreur statistique de Monte-Carlo près) : c'est une conséquence du théorème de Feynman-Kac reliant EDP et espérance actualisée sous la mesure risque-neutre", en: "Yes, in theory (up to Monte-Carlo's statistical error): a consequence of the Feynman-Kac theorem linking a PDE and a discounted expectation under the risk-neutral measure" } },
    { id: "different-prices", label: { fr: "Non, ce sont deux méthodes qui répondent à des questions différentes et donnent des prix différents", en: "No, these are two methods answering different questions and giving different prices" } },
    { id: "pde-only-exotic", label: { fr: "L'EDP ne peut être résolue que pour des produits exotiques, jamais pour une option vanille", en: "The PDE can only be solved for exotic products, never for a vanilla option" } },
  ],
  correctId: "same-price",
  hint: { fr: "Le théorème de Feynman-Kac établit un pont mathématique entre certaines EDP et des espérances sous une mesure de probabilité.", en: "The Feynman-Kac theorem establishes a mathematical bridge between certain PDEs and expectations under a probability measure." },
  explanation: {
    fr: "Le théorème de Feynman-Kac montre que la solution de l'EDP de Black-Scholes est exactement égale à l'espérance actualisée du payoff sous la mesure risque-neutre (le principe même du pricing par Monte-Carlo, M06) : ce sont deux façons mathématiquement équivalentes d'arriver au même prix, l'EDP étant résolue analytiquement pour les cas simples (vanilles), le Monte-Carlo étant préféré pour les cas où aucune solution fermée n'existe.",
    en: "The Feynman-Kac theorem shows the Black-Scholes PDE's solution exactly equals the discounted expectation of the payoff under the risk-neutral measure (the very principle of Monte-Carlo pricing, M06): these are two mathematically equivalent ways to arrive at the same price, the PDE solved analytically for simple cases (vanillas), Monte-Carlo preferred when no closed-form solution exists.",
  },
  commonMistake: {
    fr: "Voir l'approche EDP et l'approche Monte-Carlo comme deux théories de pricing concurrentes et incompatibles, plutôt que comme deux facettes mathématiquement équivalentes du même résultat.",
    en: "Seeing the PDE approach and the Monte-Carlo approach as two competing, incompatible pricing theories, rather than two mathematically equivalent facets of the same result.",
  },
});

const whatIfDiscreteRebalancingTemplate = mcqTemplate({
  id: "m06-bs-whatif-rebalancement-discret",
  conceptId: "m06-black-scholes",
  difficulty: "hard",
  prompt: {
    fr: "La démonstration de Black-Scholes suppose un rééquilibrage CONTINU du delta-hedge. En pratique, un trader ne rééquilibre que quelques fois par jour. Quelle est la conséquence de cet écart avec l'hypothèse théorique ?",
    en: "The Black-Scholes derivation assumes CONTINUOUS delta-hedge rebalancing. In practice, a trader only rebalances a few times a day. What is the consequence of this gap with the theoretical assumption?",
  },
  choices: [
    { id: "hedging-error", label: { fr: "La réplication devient imparfaite : un écart de couverture (hedging error) apparaît entre deux rééquilibrages, une source de P&L résiduel non nul", en: "The replication becomes imperfect: a hedging error appears between two rebalances, a source of non-zero residual P&L" } },
    { id: "no-impact", label: { fr: "Aucun impact, la formule reste exacte quelle que soit la fréquence de rééquilibrage", en: "No impact, the formula remains exact whatever the rebalancing frequency" } },
    { id: "price-changes", label: { fr: "Le prix théorique de l'option lui-même change selon la fréquence de rééquilibrage choisie", en: "The option's own theoretical price changes depending on the chosen rebalancing frequency" } },
  ],
  correctId: "hedging-error",
  hint: { fr: "L'argument de réplication parfaite repose précisément sur l'hypothèse de rééquilibrage infiniment fréquent.", en: "The perfect-replication argument rests precisely on the infinitely-frequent-rebalancing assumption." },
  explanation: {
    fr: "L'hypothèse de rééquilibrage continu est ce qui rend la réplication théoriquement parfaite (sans risque résiduel). En pratique, rééquilibrer seulement quelques fois par jour laisse un écart entre le portefeuille de couverture et l'option elle-même dans l'intervalle, générant un P&L de couverture résiduel, positif ou négatif selon le chemin réellement suivi par le sous-jacent — un sujet approfondi dans le P&L du delta-hedging (M07).",
    en: "The continuous-rebalancing assumption is what makes replication theoretically perfect (no residual risk). In practice, rebalancing only a few times a day leaves a gap between the hedging portfolio and the option itself in between, generating residual hedging P&L, positive or negative depending on the underlying's actually realized path — a topic explored further in delta-hedging P&L (M07).",
  },
  commonMistake: {
    fr: "Croire que le prix théorique de Black-Scholes change selon la fréquence de rééquilibrage réellement utilisée, en confondant le prix théorique (fixe) et le résultat de couverture réalisé (variable).",
    en: "Believing Black-Scholes's theoretical price changes with the actually used rebalancing frequency, confusing the theoretical price (fixed) with the realized hedging outcome (variable).",
  },
});

const whatIfDividendYieldTemplate = mcqTemplate({
  id: "m06-bs-whatif-rendement-dividende",
  conceptId: "m06-black-scholes",
  difficulty: "hard",
  prompt: {
    fr: "Si le sous-jacent verse un rendement de dividende continu q (une extension du modèle de base), comment le taux utilisé pour la dérive risque-neutre du sous-jacent est-il ajusté ?",
    en: "If the underlying pays a continuous dividend yield q (an extension of the basic model), how is the rate used for the underlying's risk-neutral drift adjusted?",
  },
  choices: [
    { id: "r-minus-q", label: { fr: "La dérive risque-neutre devient (r − q) au lieu de r seul, car le détenteur de l'action capte le dividende, ce que ne fait pas le détenteur de l'option", en: "The risk-neutral drift becomes (r − q) instead of r alone, since the stockholder captures the dividend, which the option holder doesn't" } },
    { id: "unaffected", label: { fr: "La dérive reste r, un dividende n'a jamais d'effet sur le pricing risque-neutre", en: "The drift stays r, a dividend never affects risk-neutral pricing" } },
    { id: "r-plus-q", label: { fr: "La dérive devient (r + q)", en: "The drift becomes (r + q)" } },
  ],
  correctId: "r-minus-q",
  hint: { fr: "Pensez au prix forward avec revenu (M02-6) : un dividende réduit le coût net de portage de l'actif.", en: "Think of the forward price with income (M02-6): a dividend reduces the asset's net carry cost." },
  explanation: {
    fr: "Un dividende continu versé au détenteur de l'action réduit le coût net de la porter (exactement comme pour le prix forward d'un actif avec revenu, M02-6) : sous la mesure risque-neutre, la dérive du sous-jacent devient (r − q) plutôt que r, reflétant que l'appréciation attendue du PRIX de l'action seul (hors dividende) est plus faible que le taux sans risque complet.",
    en: "A continuous dividend paid to the stockholder reduces the net cost of carrying it (exactly like an income-paying asset's forward price, M02-6): under the risk-neutral measure, the underlying's drift becomes (r − q) rather than r, reflecting that the stock PRICE's expected appreciation alone (excluding the dividend) is lower than the full risk-free rate.",
  },
  commonMistake: {
    fr: "Ignorer l'ajustement de la dérive risque-neutre en présence de dividendes, en appliquant la formule de base (sans dividende) telle quelle.",
    en: "Ignoring the risk-neutral drift adjustment in the presence of dividends, applying the basic (no-dividend) formula unchanged.",
  },
});

const historicalVsImpliedVolComparisonTemplate = mcqTemplate({
  id: "m06-bs-comparaison-vol-historique-implicite",
  conceptId: "m06-black-scholes",
  difficulty: "medium",
  prompt: {
    fr: "Pour estimer le σ à utiliser dans Black-Scholes, un analyste peut calculer la volatilité HISTORIQUE réalisée, ou lire la volatilité IMPLICITE cotée sur le marché des options. Laquelle des deux est directement cohérente avec les prix d'options déjà observés sur le marché ?",
    en: "To estimate the σ to use in Black-Scholes, an analyst can compute the HISTORICAL realized volatility, or read the IMPLIED volatility quoted in the options market. Which of the two is directly consistent with option prices already observed in the market?",
  },
  choices: [
    { id: "implied", label: { fr: "La volatilité implicite, par construction (c'est le σ qui, injecté dans Black-Scholes, redonne exactement le prix de marché coté)", en: "Implied volatility, by construction (it's the σ that, plugged into Black-Scholes, exactly reproduces the quoted market price)" } },
    { id: "historical", label: { fr: "La volatilité historique, toujours plus cohérente avec les prix de marché", en: "Historical volatility, always more consistent with market prices" } },
    { id: "both-identical", label: { fr: "Les deux mesures sont toujours strictement identiques", en: "Both measures are always strictly identical" } },
  ],
  correctId: "implied",
  hint: { fr: "L'une des deux volatilités est calculée en INVERSANT la formule de Black-Scholes à partir d'un prix de marché observé.", en: "One of the two volatilities is computed by INVERTING the Black-Scholes formula from an observed market price." },
  explanation: {
    fr: "La volatilité implicite est définie comme le σ qui, une fois injecté dans Black-Scholes, redonne exactement le prix coté sur le marché : elle est donc par construction directement cohérente avec les prix observés. La volatilité historique, calculée à partir des mouvements de prix PASSÉS du sous-jacent, peut diverger significativement de la volatilité implicite (qui intègre aussi les anticipations futures du marché), les deux mesures répondant à des questions différentes.",
    en: "Implied volatility is defined as the σ that, once plugged into Black-Scholes, exactly reproduces the market-quoted price: it is therefore by construction directly consistent with observed prices. Historical volatility, computed from the underlying's PAST price moves, can diverge significantly from implied volatility (which also embeds the market's future expectations), the two measures answering different questions.",
  },
  commonMistake: {
    fr: "Utiliser systématiquement la volatilité historique pour valoriser une option, en oubliant qu'elle peut diverger fortement de ce que le marché price réellement (la volatilité implicite).",
    en: "Systematically using historical volatility to value an option, forgetting it can diverge sharply from what the market actually prices (implied volatility).",
  },
});

const selfFinancingReturnNumericTemplate: QuestionTemplate = {
  id: "m06-bs-rendement-portefeuille-calcul",
  conceptId: "m06-black-scholes",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const portfolioValue = randomInt(rng, 50, 500) * 1000;
    const rPct = randomInt(rng, 1, 6);
    const dt = randomFloat(rng, 0.001, 0.02, 4);
    const r = rPct / 100;
    const gain = Math.round(portfolioValue * r * dt * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Selon l'argument de non-arbitrage de Black-Scholes, un portefeuille de réplication parfaitement couvert (delta-neutre), de valeur ${fmt(portfolioValue, "fr", 0)}, doit croître exactement au taux sans risque r = ${rPct}%. Sur un intervalle de temps infinitésimal dt = ${dt}, quel gain ce portefeuille doit-il réaliser ?`,
        en: `Per the Black-Scholes no-arbitrage argument, a perfectly hedged (delta-neutral) replicating portfolio, worth ${fmt(portfolioValue, "en", 0)}, must grow exactly at the risk-free rate r = ${rPct}%. Over an infinitesimal time interval dt = ${dt}, what gain must this portfolio realize?`,
      },
      numericUnit: { fr: "même devise que le portefeuille", en: "same currency as the portfolio" },
      numericTolerance: "± 1",
      hint: { fr: "dΠ = r × Π × dt, l'argument central de non-arbitrage de la démonstration de Black-Scholes.", en: "dΠ = r × Π × dt, the central no-arbitrage argument in the Black-Scholes derivation." },
      numeric: { value: gain, tolerance: 1 },
      calculation: {
        fr: `Gain = ${fmt(portfolioValue, "fr", 0)} × ${rPct}% × ${dt} ≈ ${fmt(gain, "fr")}.`,
        en: `Gain = ${fmt(portfolioValue, "en", 0)} × ${rPct}% × ${dt} ≈ ${fmt(gain, "en")}.`,
      },
      explanation: {
        fr: "C'est précisément l'argument de non-arbitrage central de la démonstration : un portefeuille parfaitement couvert (sans risque résiduel de dW_t) doit croître exactement au taux sans risque, sous peine d'arbitrage — c'est cette contrainte, imposée à chaque instant, qui aboutit à l'équation aux dérivées partielles de Black-Scholes.",
        en: "This is precisely the derivation's central no-arbitrage argument: a perfectly hedged portfolio (with no residual dW_t risk) must grow exactly at the risk-free rate, or an arbitrage would exist — it's this constraint, imposed at every instant, that leads to the Black-Scholes partial differential equation.",
      },
      commonMistake: {
        fr: "Utiliser le drift réel μ du sous-jacent au lieu du taux sans risque r pour ce calcul, en oubliant que c'est précisément le rôle de la couverture d'éliminer la dépendance à μ.",
        en: "Using the underlying's real drift μ instead of the risk-free rate r for this calculation, forgetting it's precisely the hedge's role to eliminate the dependence on μ.",
      },
    };
  },
};

const needsForecastErrorTemplate = trueFalseTemplate({
  id: "m06-bs-erreur-besoin-prevision",
  conceptId: "m06-black-scholes",
  difficulty: "medium",
  statement: {
    fr: "Pour utiliser correctement la formule de Black-Scholes, un trader doit d'abord estimer le rendement futur attendu (μ) du sous-jacent.",
    en: "To correctly use the Black-Scholes formula, a trader must first estimate the underlying's expected future return (μ).",
  },
  correct: false,
  explanation: {
    fr: "Faux : la formule de Black-Scholes ne nécessite que r (le taux sans risque, observable sur le marché) et σ (la volatilité, estimable à partir de données historiques ou implicite du marché) — jamais μ, dont l'estimation fiable est en pratique très difficile. C'est précisément ce qui rend le modèle utilisable en pratique.",
    en: "False: the Black-Scholes formula only requires r (the risk-free rate, observable in the market) and σ (volatility, estimable from historical data or market-implied) — never μ, whose reliable estimation is in practice very difficult. This is precisely what makes the model usable in practice.",
  },
  commonMistake: {
    fr: "Croire que le pricing d'options nécessite de prévoir la direction ou l'ampleur du rendement futur du sous-jacent, en oubliant que le drift disparaît de l'équation.",
    en: "Believing option pricing requires forecasting the underlying's future return's direction or magnitude, forgetting the drift disappears from the equation.",
  },
});

const bankRiskManagementScenarioTemplate = mcqTemplate({
  id: "m06-bs-scenario-gestion-risque-banque",
  conceptId: "m06-black-scholes",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le desk de recherche d'une banque estime qu'une action va probablement monter de 15% dans l'année (μ élevé), tandis que le desk de pricing d'options continue d'utiliser r=3% dans son modèle Black-Scholes pour la même action. Y a-t-il une contradiction ?",
    en: "A bank's research desk estimates a stock will likely rise 15% over the year (a high μ), while the options pricing desk keeps using r=3% in its Black-Scholes model for the same stock. Is there a contradiction?",
  },
  choices: [
    { id: "no-contradiction", label: { fr: "Non : le pricing d'options par réplication n'utilise jamais μ, quelle que soit l'anticipation de marché du desk de recherche", en: "No: replication-based option pricing never uses μ, whatever the research desk's market forecast" } },
    { id: "must-update", label: { fr: "Oui, le desk de pricing doit impérativement remplacer r par 15% pour rester cohérent", en: "Yes, the pricing desk must imperatively replace r with 15% to stay consistent" } },
    { id: "average-both", label: { fr: "Il faudrait faire une moyenne entre r et l'anticipation de 15% pour un prix cohérent", en: "An average between r and the 15% forecast would be needed for a consistent price" } },
  ],
  correctId: "no-contradiction",
  hint: { fr: "Rappelez-vous que la démonstration de Black-Scholes élimine précisément le drift μ de l'équation de pricing.", en: "Remember the Black-Scholes derivation precisely eliminates the drift μ from the pricing equation." },
  explanation: {
    fr: "Il n'y a aucune contradiction : le pricing d'options par réplication est structurellement indépendant de toute anticipation sur le rendement futur du sous-jacent. Le desk de recherche peut avoir une vue haussière forte pour ses propres décisions d'investissement directionnel, tandis que le desk de pricing utilise correctement r (pas μ) pour valoriser des options de façon cohérente avec l'absence d'arbitrage, indépendamment de cette vue.",
    en: "There is no contradiction: replication-based option pricing is structurally independent of any forecast about the underlying's future return. The research desk can hold a strong bullish view for its own directional investment decisions, while the pricing desk correctly uses r (not μ) to value options consistently with no-arbitrage, independent of that view.",
  },
  commonMistake: {
    fr: "Croire qu'une divergence entre l'anticipation de marché d'une équipe et le taux utilisé pour le pricing d'options révèle une incohérence, en oubliant que ces deux usages répondent à des questions différentes.",
    en: "Believing a divergence between a team's market forecast and the rate used for option pricing reveals an inconsistency, forgetting these two uses answer different questions.",
  },
});

export const templates: QuestionTemplate[] = [
  noDriftTemplate,
  hedgeRatioTemplate,
  assumptionTemplate,
  vocabTemplate,
  comprehensionTemplate,
  pdeVsMonteCarloComparisonTemplate,
  whatIfDiscreteRebalancingTemplate,
  whatIfDividendYieldTemplate,
  historicalVsImpliedVolComparisonTemplate,
  selfFinancingReturnNumericTemplate,
  needsForecastErrorTemplate,
  bankRiskManagementScenarioTemplate,
];
