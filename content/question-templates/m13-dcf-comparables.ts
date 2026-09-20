import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const vocabTemplate: QuestionTemplate = {
  id: "m13-dcf-vocab",
  conceptId: "m13-dcf-comparables",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Le taux de rendement moyen exigé par l'ensemble des apporteurs de capitaux d'une entreprise, utilisé pour actualiser ses flux futurs dans un DCF, s'appelle le ______.",
      en: "The average return rate required by all of a company's capital providers, used to discount its future cash flows in a DCF, is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un sigle (4 lettres)", en: "an acronym (4 letters)" },
    acceptedAnswers: ["wacc", "cmpc"],
    hint: { fr: "Weighted Average Cost of Capital.", en: "Weighted Average Cost of Capital." },
    explanation: {
      fr: "Le WACC pondère le coût exigé par les actionnaires et par les créanciers selon leur part respective dans le financement de l'entreprise, et sert de taux d'actualisation dans un DCF.",
      en: "The WACC weights the return required by shareholders and creditors by their respective share of the company's funding, and serves as the discount rate in a DCF.",
    },
    commonMistake: {
      fr: "Confondre le WACC avec le seul coût de la dette, en oubliant qu'il pondère aussi le coût des capitaux propres.",
      en: "Confusing the WACC with the cost of debt alone, forgetting it also weights the cost of equity.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m13-dcf-comprehension",
  conceptId: "m13-dcf-comparables",
  difficulty: "easy",
  prompt: {
    fr: "À quoi servent principalement le DCF et la méthode des comparables ?",
    en: "What are DCF and the comparables method mainly used for?",
  },
  choices: [
    { id: "estimate-share-value", label: { fr: "Estimer combien vaut une action ou une entreprise, selon deux logiques différentes (flux futurs propres, ou comparaison de marché)", en: "Estimating what a share or company is worth, using two different logics (own future cash flows, or market comparison)" } },
    { id: "predict-short-term-price", label: { fr: "Prédire avec certitude le cours de l'action dans les prochains jours", en: "Predicting the share price with certainty over the next few days" } },
    { id: "compute-tax-only", label: { fr: "Calculer uniquement l'impôt dû par l'entreprise", en: "Only computing the tax owed by the company" } },
  ],
  correctId: "estimate-share-value",
  hint: { fr: "Ce sont deux méthodes de VALORISATION, pas des outils de prévision de cours à court terme.", en: "These are two VALUATION methods, not short-term price forecasting tools." },
  explanation: {
    fr: "Le DCF et la méthode des comparables sont deux méthodes complémentaires d'estimation de la valeur d'une entreprise ou d'une action : la première à partir de ses flux de trésorerie futurs actualisés, la seconde à partir des multiples de valorisation observés sur des entreprises comparables cotées.",
    en: "DCF and the comparables method are two complementary methods for estimating a company's or share's value: the first from its discounted future cash flows, the second from valuation multiples observed on comparable listed companies.",
  },
  commonMistake: {
    fr: "Croire que ces méthodes de valorisation fondamentale permettent de prédire les mouvements de cours à court terme, qui dépendent de bien d'autres facteurs.",
    en: "Believing these fundamental valuation methods can predict short-term price moves, which depend on many other factors.",
  },
});

const intrinsicVsRelativeComparisonTemplate = mcqTemplate({
  id: "m13-dcf-comparaison-intrinseque-relative",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence fondamentale sépare la valeur \"intrinsèque\" obtenue par DCF de la valeur \"relative\" obtenue par comparables ?",
    en: "What fundamental difference separates the \"intrinsic\" value from a DCF and the \"relative\" value from comparables?",
  },
  choices: [
    { id: "own-fundamentals-vs-market-anchor", label: { fr: "Le DCF se fonde sur les flux futurs propres de l'entreprise, indépendamment du marché ; les comparables s'ancrent directement sur ce que le marché paie pour des entreprises similaires", en: "DCF is grounded in the company's own future cash flows, independent of the market; comparables are directly anchored to what the market pays for similar companies" } },
    { id: "no-real-difference", label: { fr: "Aucune différence réelle, les deux méthodes donnent toujours exactement le même résultat", en: "No real difference, both methods always give exactly the same result" } },
    { id: "reversed", label: { fr: "C'est l'inverse : le DCF s'ancre sur le marché, les comparables sur les flux propres de l'entreprise", en: "It's the opposite: DCF is anchored to the market, comparables to the company's own cash flows" } },
  ],
  correctId: "own-fundamentals-vs-market-anchor",
  hint: { fr: "L'une part des projections de l'analyste, l'autre part directement des prix de marché observés.", en: "One starts from the analyst's own projections, the other directly from observed market prices." },
  explanation: {
    fr: "Le DCF construit une valeur \"intrinsèque\" en projetant les flux de trésorerie futurs propres à l'entreprise, sans référence directe aux prix de marché actuels ; la méthode des comparables construit une valeur \"relative\", directement ancrée sur les multiples de valorisation que le marché applique aujourd'hui à des entreprises jugées similaires.",
    en: "DCF builds an \"intrinsic\" value by projecting the company's own future cash flows, with no direct reference to current market prices; the comparables method builds a \"relative\" value, directly anchored to the valuation multiples the market currently applies to companies deemed similar.",
  },
  commonMistake: {
    fr: "Croire que les deux méthodes reposent sur le même type de données d'entrée, en ignorant que l'une est indépendante du marché et l'autre en dépend directement.",
    en: "Believing both methods rely on the same type of input data, ignoring that one is independent of the market and the other directly depends on it.",
  },
});

const evVsEquityValueComparisonTemplate = trueFalseTemplate({
  id: "m13-dcf-comparaison-ve-vs-capitaux-propres",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  statement: {
    fr: "La valeur d'entreprise (VE) obtenue par un DCF est directement égale à la valeur des capitaux propres (ce que valent les actions).",
    en: "The enterprise value (EV) obtained from a DCF directly equals the equity value (what the shares are worth).",
  },
  correct: false,
  hint: { fr: "Il faut encore tenir compte de la dette nette de l'entreprise.", en: "The company's net debt still needs to be accounted for." },
  explanation: {
    fr: "Faux : la valeur d'entreprise (VE) représente la valeur de l'ensemble de l'activité, financée à la fois par la dette et les capitaux propres. Pour obtenir la valeur des capitaux propres (ce que valent réellement les actions), il faut soustraire la dette nette de la VE — une étape souvent oubliée, qui peut fausser fortement le résultat pour une entreprise très endettée.",
    en: "False: enterprise value (EV) represents the value of the whole business, funded by both debt and equity. To get equity value (what the shares are actually worth), net debt must be subtracted from EV — a step often forgotten, which can badly distort the result for a heavily indebted company.",
  },
  commonMistake: {
    fr: "Confondre valeur d'entreprise et valeur des capitaux propres, en oubliant l'étape de soustraction de la dette nette.",
    en: "Confusing enterprise value and equity value, forgetting the step of subtracting net debt.",
  },
});

const whatIfWaccIncreaseTemplate = mcqTemplate({
  id: "m13-dcf-what-if-hausse-wacc",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un analyste révise légèrement à la hausse le WACC utilisé dans son DCF, de 7% à 8%, toutes choses égales par ailleurs. Quel est l'effet typique sur la valeur d'entreprise obtenue ?",
    en: "An analyst slightly revises the WACC used in their DCF upward, from 7% to 8%, all else equal. What is the typical effect on the resulting enterprise value?",
  },
  choices: [
    { id: "value-decreases-significantly", label: { fr: "La valeur d'entreprise baisse, potentiellement de façon significative, en particulier via l'effet sur la valeur terminale", en: "Enterprise value decreases, potentially significantly, particularly via the effect on terminal value" } },
    { id: "no-effect", label: { fr: "Aucun effet notable, le DCF étant peu sensible au taux d'actualisation utilisé", en: "No notable effect, since a DCF is not very sensitive to the discount rate used" } },
    { id: "value-increases", label: { fr: "La valeur d'entreprise augmente lorsque le WACC augmente", en: "Enterprise value increases when the WACC rises" } },
  ],
  correctId: "value-decreases-significantly",
  hint: { fr: "Un taux d'actualisation plus élevé réduit la valeur actuelle de TOUT flux futur, y compris (et surtout) la valeur terminale.", en: "A higher discount rate reduces the present value of EVERY future cash flow, including (and especially) the terminal value." },
  explanation: {
    fr: "Une hausse du WACC réduit la valeur actualisée de tous les flux futurs, y compris (et surtout) la valeur terminale, qui représente souvent la majorité de la valeur totale d'un DCF : même une variation en apparence modeste du WACC (1 point de %) peut donc faire varier significativement la valeur d'entreprise obtenue — d'où l'importance cruciale de cette hypothèse.",
    en: "A higher WACC reduces the present value of all future cash flows, including (and especially) the terminal value, which often represents the majority of a DCF's total value: even a seemingly modest WACC change (1 percentage point) can therefore significantly move the resulting enterprise value — hence this assumption's crucial importance.",
  },
  commonMistake: {
    fr: "Sous-estimer la sensibilité d'un DCF à son taux d'actualisation, en particulier via son effet démultiplié sur la valeur terminale.",
    en: "Underestimating a DCF's sensitivity to its discount rate, particularly via its amplified effect on terminal value.",
  },
});

const whatIfGApproachesWaccTemplate = mcqTemplate({
  id: "m13-dcf-what-if-g-proche-wacc",
  conceptId: "m13-dcf-comparables",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste choisit un taux de croissance perpétuelle g très proche du WACC dans sa formule de valeur terminale. Quel est le problème que cela pose ?",
    en: "An analyst chooses a perpetual growth rate g very close to the WACC in their terminal value formula. What problem does this create?",
  },
  choices: [
    { id: "value-explodes", label: { fr: "La valeur terminale devient extrêmement grande (voire diverge si g atteint le WACC), un résultat peu réaliste et très instable", en: "The terminal value becomes extremely large (or even diverges if g reaches the WACC), an unrealistic and highly unstable result" } },
    { id: "no-issue", label: { fr: "Aucun problème, la formule reste parfaitement stable quelle que soit la proximité entre g et le WACC", en: "No issue at all, the formula remains perfectly stable regardless of how close g is to the WACC" } },
    { id: "value-becomes-negative", label: { fr: "La valeur terminale devient systématiquement négative dans ce cas", en: "The terminal value systematically becomes negative in this case" } },
  ],
  correctId: "value-explodes",
  hint: { fr: "Le dénominateur de la formule de valeur terminale est (WACC − g) : que devient une fraction quand son dénominateur approche zéro ?", en: "The terminal value formula's denominator is (WACC − g): what happens to a fraction as its denominator approaches zero?" },
  explanation: {
    fr: "La formule de croissance perpétuelle divise par (WACC − g) : quand g se rapproche du WACC, ce dénominateur tend vers zéro et la valeur terminale explose de façon irréaliste, jusqu'à diverger complètement si g atteint ou dépasse le WACC — un signal que l'hypothèse de croissance perpétuelle choisie n'est pas soutenable à long terme.",
    en: "The perpetual growth formula divides by (WACC − g): as g approaches the WACC, this denominator tends toward zero and the terminal value explodes unrealistically, diverging entirely if g reaches or exceeds the WACC — a signal that the chosen perpetual growth assumption is not sustainable long term.",
  },
  commonMistake: {
    fr: "Choisir un taux de croissance perpétuelle optimiste sans vérifier qu'il reste suffisamment inférieur au WACC pour que la formule reste économiquement sensée.",
    en: "Choosing an optimistic perpetual growth rate without checking it stays sufficiently below the WACC for the formula to remain economically sensible.",
  },
});

const terminalValueNumericTemplate: QuestionTemplate = {
  id: "m13-dcf-calcul-valeur-terminale",
  conceptId: "m13-dcf-comparables",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const fcf = randomInt(rng, 50, 150);
    const wacc = randomFloat(rng, 7, 11, 1) / 100;
    const g = randomFloat(rng, 1.5, 3.5, 1) / 100;
    const terminalValue = Math.round((fcf * (1 + g)) / (wacc - g));

    return {
      isScenario: true,
      prompt: {
        fr: `Le dernier flux de trésorerie disponible projeté (année n) est de ${fmt(fcf, "fr", 0)}. Le WACC est de ${fmt(wacc * 100, "fr", 1)}% et le taux de croissance perpétuelle g est de ${fmt(g * 100, "fr", 1)}%. Quelle est la valeur terminale (non actualisée, à l'année n) ?`,
        en: `The last projected free cash flow (year n) is ${fmt(fcf, "en", 0)}. The WACC is ${fmt(wacc * 100, "en", 1)}% and the perpetual growth rate g is ${fmt(g * 100, "en", 1)}%. What is the terminal value (undiscounted, at year n)?`,
      },
      numericUnit: { fr: "même devise que le FCF", en: "same currency as the FCF" },
      numericTolerance: "± 30",
      hint: { fr: "Valeur terminale = FCF_n × (1+g) / (WACC − g).", en: "Terminal value = FCF_n × (1+g) / (WACC − g)." },
      numeric: { value: terminalValue, tolerance: 30 },
      calculation: {
        fr: `VT = ${fmt(fcf, "fr", 0)} × (1+${fmt(g * 100, "fr", 1)}%) / (${fmt(wacc * 100, "fr", 1)}% − ${fmt(g * 100, "fr", 1)}%) ≈ ${fmt(terminalValue, "fr", 0)}.`,
        en: `TV = ${fmt(fcf, "en", 0)} × (1+${fmt(g * 100, "en", 1)}%) / (${fmt(wacc * 100, "en", 1)}% − ${fmt(g * 100, "en", 1)}%) ≈ ${fmt(terminalValue, "en", 0)}.`,
      },
      explanation: {
        fr: "La valeur terminale résume, en une seule formule de rente perpétuelle croissante, tous les flux de trésorerie au-delà de l'horizon de projection explicite : c'est ce montant (non encore actualisé à aujourd'hui) qu'il faudra ensuite ramener à sa valeur actuelle en l'actualisant sur n années au WACC, comme n'importe quel flux futur.",
        en: "The terminal value summarizes, in a single growing-perpetuity formula, all cash flows beyond the explicit projection horizon: this amount (not yet discounted to today) must then be brought to its present value by discounting it over n years at the WACC, like any other future cash flow.",
      },
      commonMistake: {
        fr: "Utiliser le FCF de l'année n directement au numérateur, au lieu du FCF de l'année n+1 (soit FCF_n × (1+g)), la première année \"dans\" la période de croissance perpétuelle.",
        en: "Using year n's FCF directly in the numerator, instead of year n+1's FCF (i.e. FCF_n × (1+g)), the first year \"inside\" the perpetual growth period.",
      },
    };
  },
};

const comparableValuationNumericTemplate: QuestionTemplate = {
  id: "m13-dcf-calcul-valorisation-comparables",
  conceptId: "m13-dcf-comparables",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const multiple = randomFloat(rng, 8, 18, 1);
    const ebitda = randomInt(rng, 40, 200);
    const ev = Math.round(multiple * ebitda);

    return {
      isScenario: true,
      prompt: {
        fr: `Un groupe de pairs comparables se négocie en moyenne à ${fmt(multiple, "fr", 1)}x l'EBITDA. L'entreprise étudiée a un EBITDA de ${fmt(ebitda, "fr", 0)}. Quelle valeur d'entreprise en déduit la méthode des comparables ?`,
        en: `A comparable peer group trades on average at ${fmt(multiple, "en", 1)}x EBITDA. The company being studied has an EBITDA of ${fmt(ebitda, "en", 0)}. What enterprise value does the comparables method imply?`,
      },
      numericUnit: { fr: "même devise que l'EBITDA", en: "same currency as the EBITDA" },
      numericTolerance: "± 5",
      hint: { fr: "VE = Multiple × EBITDA.", en: "EV = Multiple × EBITDA." },
      numeric: { value: ev, tolerance: 5 },
      calculation: {
        fr: `VE = ${fmt(multiple, "fr", 1)} × ${fmt(ebitda, "fr", 0)} ≈ ${fmt(ev, "fr", 0)}.`,
        en: `EV = ${fmt(multiple, "en", 1)} × ${fmt(ebitda, "en", 0)} ≈ ${fmt(ev, "en", 0)}.`,
      },
      explanation: {
        fr: "La méthode des comparables applique directement le multiple moyen observé sur le marché à l'indicateur correspondant de l'entreprise étudiée : un calcul rapide qui évite de construire une projection de flux détaillée, mais qui reporte toute la difficulté sur le choix d'un groupe de pairs réellement comparable.",
        en: "The comparables method directly applies the average multiple observed in the market to the studied company's corresponding metric: a quick calculation that avoids building a detailed cash-flow projection, but shifts the whole difficulty onto choosing a genuinely comparable peer group.",
      },
      commonMistake: {
        fr: "Appliquer un multiple VE/EBITDA à un indicateur qui n'est pas l'EBITDA (comme le résultat net), en mélangeant deux bases de calcul incompatibles.",
        en: "Applying an EV/EBITDA multiple to a metric that isn't EBITDA (like net income), mixing two incompatible calculation bases.",
      },
    };
  },
};

const footballFieldScenarioTemplate = mcqTemplate({
  id: "m13-dcf-scenario-football-field",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un analyste présente sa valorisation d'une entreprise sous forme de \"football field\", combinant DCF (plusieurs jeux d'hypothèses), comparables boursiers et transactions précédentes. Pourquoi ne se contente-t-il pas d'un seul chiffre issu d'une seule méthode ?",
    en: "An analyst presents their company valuation as a \"football field\", combining DCF (multiple assumption sets), trading comparables and precedent transactions. Why don't they settle for a single figure from a single method?",
  },
  choices: [
    { id: "range-more-honest", label: { fr: "Une fourchette croisant plusieurs méthodes est plus honnête qu'un chiffre unique, qui donnerait une fausse impression de précision face à l'incertitude réelle des hypothèses", en: "A range crossing several methods is more honest than a single figure, which would give a false impression of precision given the real uncertainty of the assumptions" } },
    { id: "regulatory-requirement-only", label: { fr: "Uniquement parce que la réglementation l'impose, sans intérêt analytique réel", en: "Only because regulation requires it, with no real analytical value" } },
    { id: "one-method-always-wrong", label: { fr: "Parce qu'une seule des méthodes est toujours fausse, et il s'agit de deviner laquelle", en: "Because one of the methods is always wrong, and the goal is to guess which one" } },
  ],
  correctId: "range-more-honest",
  hint: { fr: "Chaque méthode repose sur des hypothèses différentes et imparfaites : que gagne-t-on à les croiser plutôt qu'à n'en choisir qu'une ?", en: "Each method rests on different, imperfect assumptions: what is gained by crossing them rather than picking just one?" },
  explanation: {
    fr: "Chaque méthode de valorisation repose sur des hypothèses imparfaites et des angles différents (flux futurs propres pour le DCF, prix de marché pour les comparables, primes de contrôle pour les transactions précédentes) : croiser plusieurs méthodes dans un \"football field\" donne une fourchette de valorisation plus robuste et plus honnête qu'un chiffre unique, qui masquerait l'incertitude réelle inhérente à tout exercice de valorisation.",
    en: "Each valuation method rests on imperfect assumptions and different angles (own future cash flows for DCF, market prices for comparables, control premiums for precedent transactions): crossing several methods in a \"football field\" gives a more robust and honest valuation range than a single figure, which would mask the real uncertainty inherent in any valuation exercise.",
  },
  commonMistake: {
    fr: "Croire qu'une seule méthode de valorisation, bien exécutée, suffit à elle seule à donner une réponse fiable et définitive.",
    en: "Believing a single, well-executed valuation method alone is enough to give a reliable, definitive answer.",
  },
});

const badPeerSelectionScenarioTemplate = mcqTemplate({
  id: "m13-dcf-scenario-mauvais-choix-pairs",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un banquier choisit, comme groupe de pairs comparables pour valoriser une entreprise peu endettée et à forte croissance, des entreprises matures et très endettées du même secteur. Quel est le risque principal de ce choix ?",
    en: "A banker chooses, as the comparable peer group to value a low-debt, high-growth company, mature and heavily indebted companies from the same sector. What is the main risk of this choice?",
  },
  choices: [
    { id: "distorted-valuation", label: { fr: "Une valorisation faussée, car les multiples observés reflètent un profil de risque et de croissance très différent de l'entreprise étudiée", en: "A distorted valuation, since the observed multiples reflect a risk and growth profile very different from the company being studied" } },
    { id: "no-risk-same-sector", label: { fr: "Aucun risque, appartenir au même secteur suffit à garantir la comparabilité", en: "No risk, being in the same sector is enough to guarantee comparability" } },
    { id: "always-undervalues", label: { fr: "Ce choix sous-évalue systématiquement l'entreprise, dans tous les cas de figure", en: "This choice systematically undervalues the company, in every case" } },
  ],
  correctId: "distorted-valuation",
  hint: { fr: "La comparabilité ne se limite pas au secteur : la croissance et la structure de capital comptent aussi.", en: "Comparability isn't limited to sector: growth and capital structure matter too." },
  explanation: {
    fr: "Le même secteur ne suffit pas à garantir une comparabilité valide : des entreprises matures et endettées ont typiquement des multiples de valorisation très différents d'une entreprise à forte croissance et peu endettée (profil de risque, perspectives de croissance et structure de capital tous différents) — appliquer leurs multiples à l'entreprise étudiée produit une valorisation faussée, dans un sens qui dépend du sens de ces différences.",
    en: "Belonging to the same sector is not enough to guarantee valid comparability: mature, indebted companies typically have very different valuation multiples from a high-growth, low-debt company (risk profile, growth prospects and capital structure all differ) — applying their multiples to the studied company produces a distorted valuation, in a direction that depends on these differences.",
  },
  commonMistake: {
    fr: "Choisir un groupe de pairs uniquement sur la base du secteur d'activité, sans vérifier la comparabilité de la croissance, de la structure de capital et du profil de risque.",
    en: "Choosing a peer group based on industry sector alone, without checking comparability of growth, capital structure and risk profile.",
  },
});

const peerBubbleMistakeTemplate = trueFalseTemplate({
  id: "m13-dcf-erreur-bulle-secteur",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  statement: {
    fr: "Une valorisation obtenue par la méthode des comparables est nécessairement correcte, puisqu'elle se fonde sur des prix de marché réellement observés.",
    en: "A valuation obtained via the comparables method is necessarily correct, since it is based on actually observed market prices.",
  },
  correct: false,
  hint: { fr: "Si tout le groupe de pairs est mal valorisé par le marché, que devient une valorisation calquée sur lui ?", en: "If the entire peer group is mispriced by the market, what happens to a valuation modeled on it?" },
  explanation: {
    fr: "Faux : la méthode des comparables suppose implicitement que le groupe de pairs est correctement valorisé par le marché — si l'ensemble du secteur de référence traverse une bulle spéculative (ou au contraire une sous-valorisation généralisée), la méthode des comparables reproduit fidèlement cette même erreur de marché plutôt que de la corriger.",
    en: "False: the comparables method implicitly assumes the peer group is correctly priced by the market — if the entire reference sector is going through a speculative bubble (or conversely a broad-based undervaluation), the comparables method faithfully reproduces that same market error rather than correcting it.",
  },
  commonMistake: {
    fr: "Traiter un prix de marché observé comme automatiquement \"vrai\", sans envisager que l'ensemble d'un secteur puisse être collectivement mal valorisé.",
    en: "Treating an observed market price as automatically \"true\", without considering that an entire sector could be collectively mispriced.",
  },
});

const ipoGrowthCompanyScenarioTemplate = mcqTemplate({
  id: "m13-dcf-scenario-ipo-croissance",
  conceptId: "m13-dcf-comparables",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise technologique en forte croissance, sans historique de flux de trésorerie positifs, prépare son introduction en bourse. Pourquoi les banquiers s'appuient-ils typiquement davantage sur les comparables que sur un DCF classique dans ce cas ?",
    en: "A fast-growing tech company with no history of positive cash flows is preparing its IPO. Why do bankers typically rely more on comparables than on a classic DCF in this case?",
  },
  choices: [
    { id: "dcf-too-speculative", label: { fr: "Un DCF exigerait des hypothèses de très long terme extrêmement spéculatives sur des flux encore négatifs ou inexistants, alors que les comparables s'ancrent sur des données de marché déjà observables", en: "A DCF would require extremely speculative very-long-term assumptions on still-negative or non-existent cash flows, while comparables anchor on already observable market data" } },
    { id: "dcf-forbidden-for-ipo", label: { fr: "La réglementation interdit purement et simplement d'utiliser un DCF lors d'une introduction en bourse", en: "Regulation purely and simply forbids using a DCF during an IPO" } },
    { id: "no-particular-reason", label: { fr: "Il n'y a aucune raison particulière, le choix est purement arbitraire", en: "There is no particular reason, the choice is purely arbitrary" } },
  ],
  correctId: "dcf-too-speculative",
  hint: { fr: "Un DCF a besoin de projeter des flux sur le long terme : que se passe-t-il si ces flux sont encore négatifs et très incertains aujourd'hui ?", en: "A DCF needs to project cash flows long term: what happens if those flows are still negative and highly uncertain today?" },
  explanation: {
    fr: "Pour une entreprise sans historique de flux de trésorerie positifs, un DCF reposerait sur des hypothèses de très long terme hautement spéculatives (quand et à quel niveau la rentabilité sera-t-elle atteinte ?) : la méthode des comparables, ancrée sur des multiples de marché déjà observés pour des entreprises similaires (parfois sur des indicateurs non financiers comme le nombre d'utilisateurs), offre une base jugée plus robuste dans ce contexte précis.",
    en: "For a company with no history of positive cash flows, a DCF would rest on highly speculative very-long-term assumptions (when and at what level will profitability be reached?): the comparables method, anchored to already-observed market multiples for similar companies (sometimes on non-financial metrics like user count), offers a basis judged more robust in this specific context.",
  },
  commonMistake: {
    fr: "Appliquer mécaniquement un DCF classique à toute entreprise, sans tenir compte du fait que ses hypothèses de long terme peuvent être bien trop spéculatives pour certains profils d'entreprise.",
    en: "Mechanically applying a classic DCF to any company, without accounting for the fact that its long-term assumptions can be far too speculative for certain company profiles.",
  },
});

export const templates: QuestionTemplate[] = [
  vocabTemplate,
  comprehensionTemplate,
  intrinsicVsRelativeComparisonTemplate,
  evVsEquityValueComparisonTemplate,
  whatIfWaccIncreaseTemplate,
  whatIfGApproachesWaccTemplate,
  terminalValueNumericTemplate,
  comparableValuationNumericTemplate,
  peerBubbleMistakeTemplate,
  footballFieldScenarioTemplate,
  badPeerSelectionScenarioTemplate,
  ipoGrowthCompanyScenarioTemplate,
];
