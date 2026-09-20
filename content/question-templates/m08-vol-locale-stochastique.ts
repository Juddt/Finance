import { pick, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const modelChoiceTemplate: QuestionTemplate = {
  id: "m08-vlvs-choix-modele",
  conceptId: "m08-vol-locale-stochastique",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "local", fr: "coller exactement aux prix vanilles cotés aujourd'hui pour pricer un produit peu sensible à la dynamique future du smile", en: "exactly fit today's quoted vanilla prices to price a product not very sensitive to the smile's future dynamics" },
        { id: "stochastic", fr: "pricer une option exotique dont la valeur dépend fortement de la façon dont le smile va évoluer dans le temps", en: "price an exotic option whose value strongly depends on how the smile will evolve over time" },
      ] as const
    );

    return {
      isScenario: true,
      prompt: {
        fr: `Un desk doit ${scenario.fr}. Quel type de modèle est le plus adapté ?`,
        en: `A desk needs to ${scenario.en}. Which model type is best suited?`,
      },
      choices: buildChoices([
        { id: "local", label: { fr: "Volatilité locale (Dupire)", en: "Local volatility (Dupire)" } },
        { id: "stochastic", label: { fr: "Volatilité stochastique (Heston...)", en: "Stochastic volatility (Heston...)" } },
      ]),
      hint: { fr: "L'un colle parfaitement aux prix d'aujourd'hui, l'autre a une meilleure dynamique dans le temps.", en: "One perfectly fits today's prices, the other has better dynamics over time." },
      correctChoiceIds: [scenario.id],
      explanation:
        scenario.id === "local"
          ? { fr: "La vol locale colle exactement aux prix vanilles actuels, adaptée quand la dynamique future du smile importe peu.", en: "Local vol exactly fits current vanilla prices, suited when the smile's future dynamics matter little." }
          : { fr: "La vol stochastique offre une dynamique de smile plus réaliste dans le temps, essentielle pour des produits sensibles à cette évolution.", en: "Stochastic vol offers more realistic smile dynamics over time, essential for products sensitive to that evolution." },
      commonMistake: {
        fr: "Utiliser systématiquement le même type de modèle quel que soit le produit à pricer, sans tenir compte de sa sensibilité à la dynamique du smile.",
        en: "Systematically using the same model type regardless of the product being priced, ignoring its sensitivity to smile dynamics.",
      },
    };
  },
};

const dupireDeterministicTemplate: QuestionTemplate = {
  id: "m08-vlvs-dupire-deterministe",
  conceptId: "m08-vol-locale-stochastique",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans le modèle de volatilité locale de Dupire, la volatilité σ_loc(S,t) est une fonction ALÉATOIRE avec sa propre source d'incertitude, distincte de celle du sous-jacent.",
      en: "In Dupire's local volatility model, volatility σ_loc(S,t) is a RANDOM function with its own source of uncertainty, distinct from the underlying's.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : dans le modèle de vol locale, σ_loc(S,t) est une fonction DÉTERMINISTE de S et t (pas de nouvel aléa propre) — c'est le modèle de volatilité STOCHASTIQUE qui introduit une source d'incertitude distincte pour la volatilité.",
      en: "False: in the local vol model, σ_loc(S,t) is a DETERMINISTIC function of S and t (no new dedicated randomness) — it's the STOCHASTIC volatility model that introduces a distinct source of uncertainty for volatility.",
    },
    commonMistake: {
      fr: "Confondre les deux modèles sur ce point précis, qui est justement leur différence fondamentale.",
      en: "Confusing the two models on this exact point, which is precisely their fundamental difference.",
    },
  }),
};

const tradeoffTemplate: QuestionTemplate = {
  id: "m08-vlvs-compromis",
  conceptId: "m08-vol-locale-stochastique",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quel est le compromis fondamental entre volatilité locale et volatilité stochastique ?",
      en: "What is the fundamental trade-off between local and stochastic volatility?",
    },
    choices: buildChoices([
      { id: "tradeoff", label: { fr: "Fidélité parfaite aux prix actuels (locale) contre dynamique plus réaliste du smile futur (stochastique)", en: "Perfect fit to current prices (local) versus more realistic future smile dynamics (stochastic)" } },
      { id: "speed", label: { fr: "Rapidité de calcul (locale) contre précision numérique (stochastique)", en: "Computation speed (local) versus numerical precision (stochastic)" } },
    ]),
    hint: { fr: "Pensez à ce que chaque modèle sacrifie pour gagner l'autre chose.", en: "Think about what each model sacrifices to gain the other thing." },
    correctChoiceIds: ["tradeoff"],
    explanation: {
      fr: "Le compromis central est bien fidélité statique (vol locale, parfaite aujourd'hui) contre réalisme dynamique (vol stochastique, meilleure évolution future) — pas une question de vitesse de calcul.",
      en: "The central trade-off is indeed static fidelity (local vol, perfect today) versus dynamic realism (stochastic vol, better future evolution) — not a matter of computation speed.",
    },
    commonMistake: {
      fr: "Réduire la différence entre les deux modèles à une simple question de performance de calcul.",
      en: "Reducing the difference between the two models to a mere computational performance question.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-vlvs-vocab",
  conceptId: "m08-vol-locale-stochastique",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le processus qui consiste à choisir les paramètres d'un modèle pour qu'il reproduise au mieux les prix observés sur le marché s'appelle la ______.",
      en: "The process of choosing a model's parameters so it best reproduces market-observed prices is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["calibration"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "The English finance term itself." },
    explanation: {
      fr: "La calibration est l'étape qui ajuste les paramètres d'un modèle (local ou stochastique) sur les prix de marché observés.",
      en: "Calibration is the step that fits a model's parameters (local or stochastic) to observed market prices.",
    },
    commonMistake: {
      fr: "Confondre la calibration (ajustement aux prix actuels) avec la validation historique (test sur des données passées).",
      en: "Confusing calibration (fitting to current prices) with historical validation (testing on past data).",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m08-vlvs-comprehension",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi les modèles de volatilité locale et de volatilité stochastique existent-ils, alors que Black-Scholes utilise déjà une volatilité (implicite) ?",
    en: "Why do local and stochastic volatility models exist, when Black-Scholes already uses an (implied) volatility?",
  },
  choices: [
    { id: "extend-to-smile", label: { fr: "Pour pricer et couvrir de façon cohérente des options qui dépendent de tout le smile, alors que Black-Scholes suppose à tort une seule volatilité constante pour tous les strikes", en: "To consistently price and hedge options depending on the whole smile, while Black-Scholes wrongly assumes a single constant volatility for every strike" } },
    { id: "just-faster", label: { fr: "Uniquement pour accélérer les calculs par rapport à Black-Scholes", en: "Only to speed up calculations compared to Black-Scholes" } },
    { id: "no-real-purpose", label: { fr: "Ils n'apportent aucune amélioration réelle par rapport à Black-Scholes", en: "They bring no real improvement over Black-Scholes" } },
  ],
  correctId: "extend-to-smile",
  hint: { fr: "Black-Scholes suppose une volatilité unique, alors que le marché cote un smile/skew entier.", en: "Black-Scholes assumes a single volatility, while the market quotes an entire smile/skew." },
  explanation: {
    fr: "Black-Scholes suppose une volatilité constante identique pour tous les strikes, ce qui est incompatible avec le smile/skew réellement observé sur le marché : les modèles de volatilité locale et stochastique étendent le cadre pour pricer et couvrir de façon cohérente des produits (notamment exotiques) sensibles à toute la forme de la surface, pas seulement à un point ATM.",
    en: "Black-Scholes assumes a single constant volatility identical for every strike, which is inconsistent with the smile/skew actually observed in the market: local and stochastic volatility models extend the framework to consistently price and hedge products (exotics in particular) sensitive to the surface's whole shape, not just a single ATM point.",
  },
  commonMistake: {
    fr: "Croire que ces modèles ne sont qu'une variante technique de Black-Scholes, sans lien avec le besoin de reproduire le smile.",
    en: "Believing these models are just a technical variant of Black-Scholes, unrelated to the need to reproduce the smile.",
  },
});

const comparisonSkewDynamicsTemplate = mcqTemplate({
  id: "m08-vlvs-comparaison-dynamique-skew",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "hard",
  prompt: {
    fr: "Quand le spot bouge, le modèle de volatilité locale prédit généralement que le skew (en fonction du strike absolu) va s'aplatir ou se décaler fortement, alors que le marché observé garde souvent un skew plus stable en forme relative. Quel modèle corrige typiquement mieux ce défaut ?",
    en: "As spot moves, the local volatility model generally predicts the skew (as a function of absolute strike) will flatten or shift sharply, while the observed market often keeps a more stable skew in relative shape. Which model typically better corrects this flaw?",
  },
  choices: [
    { id: "stochastic-better", label: { fr: "La volatilité stochastique, dont la dynamique de skew implicite est généralement plus proche du comportement réellement observé sur le marché", en: "Stochastic volatility, whose implied skew dynamics are generally closer to what is actually observed in the market" } },
    { id: "local-better", label: { fr: "La volatilité locale, dont la dynamique de skew est toujours la plus réaliste", en: "Local volatility, whose skew dynamics are always the most realistic" } },
    { id: "no-difference", label: { fr: "Les deux modèles produisent exactement la même dynamique de skew futur", en: "Both models produce exactly the same future skew dynamics" } },
  ],
  correctId: "stochastic-better",
  hint: { fr: "C'est une critique classique du modèle de vol locale, qui motive l'usage de modèles stochastiques ou hybrides pour la couverture.", en: "This is a classic criticism of the local vol model, motivating the use of stochastic or hybrid models for hedging." },
  explanation: {
    fr: "Une critique classique du modèle de vol locale est que, bien qu'il reproduise parfaitement les prix vanilles d'aujourd'hui, sa dynamique implicite du skew futur (skew qui s'aplatit ou se décale fortement quand le spot bouge) est souvent moins réaliste que celle des modèles à volatilité stochastique — d'où l'intérêt des Greeks de couverture calculés sous ces derniers, voire des modèles hybrides local-stochastique combinant les deux avantages.",
    en: "A classic criticism of the local vol model is that, although it perfectly reproduces today's vanilla prices, its implied future skew dynamics (a skew that flattens or shifts sharply as spot moves) are often less realistic than those of stochastic volatility models — hence the value of hedging Greeks computed under the latter, or even hybrid local-stochastic models combining both advantages.",
  },
  commonMistake: {
    fr: "Croire qu'un modèle parfaitement calibré aux prix d'aujourd'hui a nécessairement une dynamique future réaliste.",
    en: "Believing a model perfectly calibrated to today's prices necessarily has realistic future dynamics.",
  },
});

const whatIfBarrierMispricingTemplate = mcqTemplate({
  id: "m08-vlvs-what-if-mauvais-pricing-barriere",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk price une option barrière très sensible à la dynamique future du skew avec un modèle de volatilité locale, dont on sait qu'il prédit une dynamique de skew irréaliste. Quel est le risque principal ?",
    en: "A desk prices a barrier option very sensitive to the skew's future dynamics using a local volatility model, known to predict unrealistic skew dynamics. What is the main risk?",
  },
  choices: [
    { id: "mispriced-and-hedge-error", label: { fr: "Un prix potentiellement erroné et des Greeks de couverture mal calibrés, malgré un ajustement parfait aux prix vanilles actuels", en: "A potentially wrong price and poorly calibrated hedging Greeks, despite a perfect fit to current vanilla prices" } },
    { id: "no-risk-perfect-fit", label: { fr: "Aucun risque, puisque le modèle reproduit parfaitement les prix vanilles observés aujourd'hui", en: "No risk, since the model perfectly reproduces today's observed vanilla prices" } },
    { id: "only-affects-vanillas", label: { fr: "Le risque ne concerne que le pricing des options vanilles, jamais des exotiques", en: "The risk only concerns vanilla option pricing, never exotics" } },
  ],
  correctId: "mispriced-and-hedge-error",
  hint: { fr: "Coller aux prix d'aujourd'hui (calibration) ne garantit pas une dynamique future réaliste, précisément ce dont dépend une barrière.", en: "Fitting today's prices (calibration) doesn't guarantee realistic future dynamics, exactly what a barrier depends on." },
  explanation: {
    fr: "Une option barrière dépend fortement de la façon dont le smile va évoluer jusqu'à l'échéance (ou jusqu'au déclenchement de la barrière), pas seulement des prix vanilles actuels : un modèle de vol locale, malgré un ajustement parfait aux prix d'aujourd'hui, peut donc mal pricer et mal couvrir ce type de produit à cause d'une dynamique de skew irréaliste — d'où la préférence fréquente pour des modèles stochastiques ou hybrides sur ces produits.",
    en: "A barrier option strongly depends on how the smile will evolve until expiry (or until the barrier triggers), not just on today's vanilla prices: a local vol model, despite a perfect fit to today's prices, can therefore mis-price and mis-hedge this type of product because of unrealistic skew dynamics — hence the frequent preference for stochastic or hybrid models on these products.",
  },
  commonMistake: {
    fr: "Croire qu'un bon ajustement aux prix vanilles actuels (calibration) suffit à garantir un bon pricing des produits exotiques sensibles à la dynamique future.",
    en: "Believing a good fit to today's vanilla prices (calibration) is enough to guarantee good pricing of exotic products sensitive to future dynamics.",
  },
});

const whatIfStableMarketSkewTemplate = mcqTemplate({
  id: "m08-vlvs-what-if-skew-stable",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un quant observe que le skew d'un indice actions, exprimé en fonction du delta/moneyness, reste très stable dans le temps même quand le spot bouge fortement. Quel type de modèle cette observation favorise-t-elle ?",
    en: "A quant observes that an equity index's skew, expressed as a function of delta/moneyness, stays very stable over time even as spot moves sharply. Which model type does this observation favor?",
  },
  choices: [
    { id: "stochastic-or-sticky-delta", label: { fr: "Un modèle proche d'une dynamique \"sticky delta\", plus cohérent avec la volatilité stochastique qu'avec la vol locale pure", en: "A model close to \"sticky delta\" dynamics, more consistent with stochastic volatility than with pure local vol" } },
    { id: "local-vol-always", label: { fr: "Le modèle de vol locale, qui prédit justement cette stabilité du skew en delta", en: "The local vol model, which precisely predicts this stability of the delta skew" } },
    { id: "irrelevant-observation", label: { fr: "Cette observation est sans rapport avec le choix entre les deux familles de modèles", en: "This observation is unrelated to the choice between the two model families" } },
  ],
  correctId: "stochastic-or-sticky-delta",
  hint: { fr: "Le modèle de vol locale tend plutôt vers une dynamique \"sticky strike\", pas \"sticky delta\".", en: "The local vol model tends instead toward \"sticky strike\" dynamics, not \"sticky delta\"." },
  explanation: {
    fr: "Le modèle de vol locale pur tend à produire une dynamique proche de \"sticky strike\" (skew stable en strike absolu), alors qu'un skew stable en delta/moneyness quand le spot bouge est plus caractéristique d'une dynamique \"sticky delta\", mieux capturée par les modèles à volatilité stochastique — c'est un signal empirique important pour orienter le choix ou la calibration du modèle utilisé pour la couverture.",
    en: "The pure local vol model tends to produce dynamics close to \"sticky strike\" (skew stable in absolute strike), while a skew stable in delta/moneyness as spot moves is more characteristic of \"sticky delta\" dynamics, better captured by stochastic volatility models — an important empirical signal for guiding the choice or calibration of the model used for hedging.",
  },
  commonMistake: {
    fr: "Ignorer le comportement empirique observé du skew (sticky strike vs sticky delta) au moment de choisir un modèle de pricing/couverture.",
    en: "Ignoring the skew's observed empirical behavior (sticky strike vs sticky delta) when choosing a pricing/hedging model.",
  },
});

const forwardVarianceNumericTemplate: QuestionTemplate = {
  id: "m08-vlvs-calcul-variance-forward",
  conceptId: "m08-vol-locale-stochastique",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const t1 = 1;
    const t2 = 2;
    const iv1 = randomFloat(rng, 15, 22, 1);
    const iv2 = randomFloat(rng, iv1 + 1, iv1 + 6, 1);
    const var1 = (iv1 / 100) ** 2 * t1;
    const var2 = (iv2 / 100) ** 2 * t2;
    const forwardVar = (var2 - var1) / (t2 - t1);
    const forwardVolPct = Math.round(Math.sqrt(forwardVar) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `La surface ATM cote IV(1 an)=${fmt(iv1, "fr", 1)}% et IV(2 ans)=${fmt(iv2, "fr", 1)}%. Quelle est la volatilité locale (forward) ATM implicite entre l'année 1 et l'année 2, en % ?`,
        en: `The ATM surface quotes IV(1 year)=${fmt(iv1, "en", 1)}% and IV(2 years)=${fmt(iv2, "en", 1)}%. What is the implied (forward) ATM local volatility between year 1 and year 2, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "Var_forward = (Var(T2) − Var(T1)) / (T2 − T1), avec Var(T)=IV(T)²×T, puis on reprend la racine carrée.", en: "Forward variance = (Var(T2) − Var(T1)) / (T2 − T1), with Var(T)=IV(T)²×T, then take the square root again." },
      numeric: { value: forwardVolPct, tolerance: 0.5 },
      calculation: {
        fr: `Var(1)=${fmt(iv1, "fr", 1)}%²×1≈${fmt(var1, "fr", 5)}. Var(2)=${fmt(iv2, "fr", 1)}%²×2≈${fmt(var2, "fr", 5)}. Var_forward=(${fmt(var2, "fr", 5)}−${fmt(var1, "fr", 5)})/(2−1)≈${fmt(forwardVar, "fr", 5)}. Vol_forward=√${fmt(forwardVar, "fr", 5)}≈${fmt(forwardVolPct, "fr")}%.`,
        en: `Var(1)=${fmt(iv1, "en", 1)}%²×1≈${fmt(var1, "en", 5)}. Var(2)=${fmt(iv2, "en", 1)}%²×2≈${fmt(var2, "en", 5)}. Var_forward=(${fmt(var2, "en", 5)}−${fmt(var1, "en", 5)})/(2−1)≈${fmt(forwardVar, "en", 5)}. Vol_forward=√${fmt(forwardVar, "en", 5)}≈${fmt(forwardVolPct, "en")}%.`,
      },
      explanation: {
        fr: "Ce calcul de variance forward (segment de variance implicite entre deux maturités successives) est le principe de base qui sous-tend la construction d'une surface de volatilité locale à partir de la structure par terme : la volatilité locale entre deux dates n'est pas la moyenne simple des IV, mais se déduit de la différence des variances totales cumulées, ramenée à la durée du segment.",
        en: "This forward variance calculation (the segment of implied variance between two successive maturities) is the basic principle underlying the construction of a local volatility surface from the term structure: local volatility between two dates is not the simple average of the IVs, but is derived from the difference of cumulative total variances, scaled by the segment's duration.",
      },
      commonMistake: {
        fr: "Faire la moyenne simple des deux IV au lieu de passer par la différence des variances totales cumulées.",
        en: "Simply averaging the two IVs instead of going through the difference of cumulative total variances.",
      },
    };
  },
};

const calibrationNotDynamicsMistakeTemplate = trueFalseTemplate({
  id: "m08-vlvs-erreur-calibration-dynamique",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "medium",
  statement: {
    fr: "Un modèle parfaitement calibré aux prix d'options vanilles observés aujourd'hui produit nécessairement une dynamique future du smile réaliste.",
    en: "A model perfectly calibrated to today's observed vanilla option prices necessarily produces realistic future smile dynamics.",
  },
  correct: false,
  hint: { fr: "La calibration ne contraint que les prix d'AUJOURD'HUI, pas la façon dont le modèle fait évoluer le smile ensuite.", en: "Calibration only constrains TODAY's prices, not how the model evolves the smile afterward." },
  explanation: {
    fr: "Faux : la calibration garantit seulement que le modèle reproduit les prix observés aujourd'hui, pas que sa dynamique future du smile soit réaliste — c'est exactement la limite reprochée au modèle de vol locale, qui colle parfaitement aux prix actuels mais dont la dynamique de skew futur est souvent jugée peu réaliste.",
    en: "False: calibration only guarantees the model reproduces today's observed prices, not that its future smile dynamics are realistic — this is exactly the limitation criticized in the local vol model, which fits today's prices perfectly but whose future skew dynamics are often judged unrealistic.",
  },
  commonMistake: {
    fr: "Confondre qualité de calibration (ajustement statique) et qualité de dynamique (comportement réaliste dans le temps), qui sont deux propriétés indépendantes d'un modèle.",
    en: "Confusing calibration quality (static fit) with dynamics quality (realistic behavior over time), which are two independent properties of a model.",
  },
});

const quantHedgePerformanceScenarioTemplate = mcqTemplate({
  id: "m08-vlvs-scenario-quant-performance-couverture",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un quant constate que son modèle de vol locale, parfaitement calibré, produit des Greeks de couverture qui performent mal en réalité sur un book d'options exotiques. Quelle est l'explication la plus probable ?",
    en: "A quant finds that their perfectly calibrated local vol model produces hedging Greeks that perform poorly in reality on a book of exotic options. What is the most likely explanation?",
  },
  choices: [
    { id: "dynamics-mismatch", label: { fr: "La dynamique de skew implicite du modèle de vol locale ne correspond pas au comportement réel du marché, faussant les Greeks bien que le pricing initial soit correct", en: "The local vol model's implied skew dynamics don't match the market's actual behavior, distorting the Greeks even though the initial pricing is correct" } },
    { id: "calibration-error", label: { fr: "Le modèle est forcément mal calibré, la calibration parfaite garantissant toujours une bonne performance de couverture", en: "The model must be miscalibrated, since perfect calibration always guarantees good hedging performance" } },
    { id: "no-explanation", label: { fr: "Il n'existe aucune explication rationnelle à ce phénomène, purement aléatoire", en: "There is no rational explanation for this phenomenon, which is purely random" } },
  ],
  correctId: "dynamics-mismatch",
  hint: { fr: "Calibration parfaite ⇔ prix d'aujourd'hui corrects, pas ⇔ dynamique future correcte, dont dépendent les Greeks de couverture.", en: "Perfect calibration ⇔ correct prices today, not ⇔ correct future dynamics, on which hedging Greeks depend." },
  explanation: {
    fr: "Les Greeks de couverture dépendent de la façon dont le modèle fait évoluer le smile quand le spot bouge (sa dynamique), pas seulement de son ajustement aux prix d'aujourd'hui : un modèle de vol locale parfaitement calibré peut donc encore produire des Greeks peu performants si sa dynamique de skew implicite diverge du comportement réel du marché — un cas d'usage classique pour préférer un modèle stochastique ou hybride sur ce type de book.",
    en: "Hedging Greeks depend on how the model evolves the smile as spot moves (its dynamics), not just on its fit to today's prices: a perfectly calibrated local vol model can therefore still produce poorly performing Greeks if its implied skew dynamics diverge from the market's actual behavior — a classic case for preferring a stochastic or hybrid model on this type of book.",
  },
  commonMistake: {
    fr: "Diagnostiquer systématiquement une erreur de calibration face à une mauvaise performance de couverture, sans envisager un problème de dynamique du modèle.",
    en: "Systematically diagnosing a calibration error when hedging performance is poor, without considering a model dynamics issue.",
  },
});

const cliquetHestonScenarioTemplate = mcqTemplate({
  id: "m08-vlvs-scenario-cliquet-heston",
  conceptId: "m08-vol-locale-stochastique",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk doit pricer un produit \"cliquet\" (à rendements forward-start successifs), dont la valeur dépend fortement des smiles forward futurs, pas seulement du smile actuel. Quelle famille de modèle est la plus adaptée ?",
    en: "A desk must price a \"cliquet\" product (with successive forward-start returns), whose value strongly depends on future forward smiles, not just today's smile. Which model family is best suited?",
  },
  choices: [
    { id: "stochastic-vol", label: { fr: "Volatilité stochastique (type Heston), dont la dynamique de smile forward est jugée plus réaliste", en: "Stochastic volatility (Heston-type), whose forward smile dynamics are judged more realistic" } },
    { id: "local-vol-sufficient", label: { fr: "Volatilité locale seule, suffisante dès lors qu'elle est bien calibrée aux prix vanilles d'aujourd'hui", en: "Local volatility alone, sufficient as long as it is well calibrated to today's vanilla prices" } },
    { id: "black-scholes-flat", label: { fr: "Black-Scholes à volatilité constante, le smile n'ayant pas d'impact sur ce type de produit", en: "Black-Scholes with constant volatility, since the smile has no impact on this type of product" } },
  ],
  correctId: "stochastic-vol",
  hint: { fr: "Un produit forward-start dépend de smiles qui n'existent pas encore aujourd'hui : seule la DYNAMIQUE du modèle peut les déterminer.", en: "A forward-start product depends on smiles that don't yet exist today: only the model's DYNAMICS can determine them." },
  explanation: {
    fr: "Un produit cliquet dépend directement des smiles forward, c'est-à-dire de smiles qui n'existent pas encore au moment du pricing : cette sensibilité pure à la dynamique future favorise typiquement les modèles à volatilité stochastique (ou hybrides), dont le comportement de smile forward est généralement jugé plus réaliste que celui d'un modèle de vol locale pure, qui reste avant tout un outil d'ajustement statique.",
    en: "A cliquet product directly depends on forward smiles, i.e. smiles that don't yet exist at pricing time: this pure sensitivity to future dynamics typically favors stochastic volatility (or hybrid) models, whose forward smile behavior is generally judged more realistic than that of a pure local vol model, which remains primarily a static fitting tool.",
  },
  commonMistake: {
    fr: "Se contenter d'un modèle bien calibré aux prix vanilles actuels pour pricer un produit qui dépend fondamentalement d'une dynamique de smile future.",
    en: "Settling for a model well calibrated to today's vanilla prices to price a product that fundamentally depends on future smile dynamics.",
  },
});

export const templates: QuestionTemplate[] = [
  modelChoiceTemplate,
  dupireDeterministicTemplate,
  tradeoffTemplate,
  vocabTemplate,
  comprehensionTemplate,
  comparisonSkewDynamicsTemplate,
  whatIfBarrierMispricingTemplate,
  whatIfStableMarketSkewTemplate,
  forwardVarianceNumericTemplate,
  calibrationNotDynamicsMistakeTemplate,
  quantHedgePerformanceScenarioTemplate,
  cliquetHestonScenarioTemplate,
];
