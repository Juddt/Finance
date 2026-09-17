import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const modelChoiceListedTemplate: QuestionTemplate = {
  id: "m03-credit-choix-modele-cotee",
  conceptId: "m03-risque-credit",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const sector = pick(rng, [
      { fr: "industrielle", en: "industrial" },
      { fr: "technologique", en: "technology" },
      { fr: "énergétique", en: "energy" },
    ] as const);

    return {
      isScenario: true,
      prompt: {
        fr: `Vous voulez estimer la probabilité de défaut d'une entreprise ${sector.fr} cotée en bourse, avec une estimation réactive aux mouvements de marché récents. Quel modèle choisir en priorité ?`,
        en: `You want to estimate the default probability of a listed ${sector.en} company, with an estimate reactive to recent market moves. Which model should you pick first?`,
      },
      choices: buildChoices([
        { id: "structural", label: { fr: "Un modèle structurel (type Merton), basé sur le cours de l'action", en: "A structural model (Merton-type), based on the stock price" } },
        { id: "historical", label: { fr: "Le taux de défaut historique moyen de sa catégorie de notation", en: "The average historical default rate of its rating category" } },
        { id: "none", label: { fr: "Aucun modèle : se fier uniquement à la notation, sans jamais la remettre à jour", en: "No model: rely only on the rating, without ever updating it" } },
      ]),
      hint: {
        fr: "Quelle approche utilise des données de marché fraîches plutôt qu'une moyenne historique par catégorie ?",
        en: "Which approach uses fresh market data rather than a historical category average?",
      },
      correctChoiceIds: ["structural"],
      explanation: {
        fr: "Pour une entreprise cotée, un modèle structurel (Merton) exploite le cours de l'action et sa volatilité pour estimer en continu la distance entre la valeur des actifs et celle de la dette — plus réactif qu'un taux de défaut historique par catégorie de notation.",
        en: "For a listed company, a structural model (Merton) uses the stock price and its volatility to continuously estimate the gap between asset value and debt value — more reactive than a historical default rate by rating category.",
      },
      commonMistake: {
        fr: "Se limiter au taux de défaut historique de la catégorie de notation alors que des données de marché propres à l'entreprise sont disponibles et donneraient une estimation plus fraîche.",
        en: "Sticking to the rating category's historical default rate when company-specific market data is available and would give a fresher estimate.",
      },
    };
  },
};

const modelChoiceUnlistedTemplate: QuestionTemplate = {
  id: "m03-credit-choix-modele-non-cotee",
  conceptId: "m03-risque-credit",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    isScenario: true,
    prompt: {
      fr: "Une PME non cotée en bourse n'a aucune donnée de marché disponible, mais dispose d'une notation d'agence. Quelle est l'approche la plus réaliste pour une première estimation de sa probabilité de défaut ?",
      en: "An unlisted SME has no market data available, but does have an agency rating. What is the most realistic approach for a first estimate of its default probability?",
    },
    choices: buildChoices([
      { id: "historical", label: { fr: "Le taux de défaut historique de sa catégorie de notation", en: "The historical default rate of its rating category" } },
      { id: "structural", label: { fr: "Un modèle structurel basé sur le cours de son action", en: "A structural model based on its stock price" } },
      { id: "guess", label: { fr: "Une estimation arbitraire, sans méthode", en: "An arbitrary estimate, with no method" } },
    ]),
    hint: {
      fr: "Un modèle structurel a besoin d'un cours d'action et d'une volatilité observables — est-ce le cas ici ?",
      en: "A structural model needs an observable stock price and volatility — is that the case here?",
    },
    correctChoiceIds: ["historical"],
    explanation: {
      fr: "Sans données de marché, le modèle structurel n'est pas applicable. Le taux de défaut historique de la catégorie de notation reste l'approche la plus réaliste, en attendant d'éventuelles données financières propres pour un modèle de scoring.",
      en: "Without market data, the structural model isn't applicable. The rating category's historical default rate remains the most realistic approach, pending any proprietary financial data for a scoring model.",
    },
    commonMistake: {
      fr: "Vouloir appliquer un modèle structurel sans données de marché disponibles, ou inversement se contenter d'une estimation arbitraire alors qu'une notation existe déjà.",
      en: "Trying to apply a structural model without available market data, or conversely settling for an arbitrary guess when a rating already exists.",
    },
  }),
};

const empiricalPdTemplate: QuestionTemplate = {
  id: "m03-credit-pd-empirique",
  conceptId: "m03-risque-credit",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const totalIssuers = randomInt(rng, 15, 40) * 100;
    const defaults = randomInt(rng, 2, 8) * 5;
    const pdPct = Math.round((defaults / totalIssuers) * 10000) / 100;

    return {
      prompt: {
        fr: `Sur les 5 dernières années, ${fmt(defaults, "fr")} émetteurs notés BBB ont fait défaut, sur un total de ${fmt(totalIssuers, "fr")} émetteurs notés BBB observés. Quel est le taux de défaut empirique à 5 ans de cette catégorie, en % ?`,
        en: `Over the last 5 years, ${fmt(defaults, "en")} BBB-rated issuers defaulted, out of a total of ${fmt(totalIssuers, "en")} BBB-rated issuers observed. What is the 5-year empirical default rate of this category, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0,05",
      hint: {
        fr: "PD ≈ nombre de défauts / nombre total d'émetteurs de la catégorie.",
        en: "PD ≈ number of defaults / total number of issuers in the category.",
      },
      numeric: { value: pdPct, tolerance: 0.05 },
      calculation: {
        fr: `PD ≈ ${fmt(defaults, "fr")} / ${fmt(totalIssuers, "fr")} = ${fmt(pdPct, "fr")}%.`,
        en: `PD ≈ ${fmt(defaults, "en")} / ${fmt(totalIssuers, "en")} = ${fmt(pdPct, "en")}%.`,
      },
      explanation: {
        fr: "C'est une estimation historique simple, qui suppose que le passé est représentatif du futur pour cette catégorie de notation.",
        en: "This is a simple historical estimate, assuming the past is representative of the future for this rating category.",
      },
      commonMistake: {
        fr: "Oublier de convertir le ratio en pourcentage, ou inverser numérateur et dénominateur.",
        en: "Forgetting to convert the ratio to a percentage, or swapping numerator and denominator.",
      },
    };
  },
};

const ratingNotGuaranteeTemplate: QuestionTemplate = {
  id: "m03-credit-notation-pas-garantie",
  conceptId: "m03-risque-credit",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const grade = pick(rng, ["AAA", "AA", "A"] as const);
    return {
      prompt: {
        fr: `Une entreprise notée ${grade} ne peut, par définition, jamais faire défaut.`,
        en: `A company rated ${grade} can, by definition, never default.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "Une notation résume une probabilité — est-ce la même chose qu'une certitude ?",
        en: "A rating summarizes a probability — is that the same as a certainty?",
      },
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : ${grade} signifie un risque de défaut très faible, pas nul. Des défauts d'émetteurs très bien notés se sont déjà produits historiquement.`,
        en: `False: ${grade} means a very low, not zero, default risk. Defaults by highly-rated issuers have happened historically.`,
      },
      commonMistake: {
        fr: "Confondre une notation élevée avec une garantie absolue — c'est une estimation de risque, pas une promesse.",
        en: "Confusing a high rating with an absolute guarantee — it's a risk estimate, not a promise.",
      },
    };
  },
};

const mertonVocabTemplate: QuestionTemplate = {
  id: "m03-credit-vocab-merton",
  conceptId: "m03-risque-credit",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le modèle qui considère qu'une entreprise fait défaut lorsque la valeur de ses actifs passe sous la valeur de sa dette s'appelle le modèle de ______.",
      en: "The model that treats default as the moment a firm's asset value falls below its debt value is called the ______ model.",
    },
    fillBlankPlaceholder: { fr: "un nom", en: "a name" },
    acceptedAnswers: ["merton"],
    hint: {
      fr: "C'est un modèle structurel qui porte le nom de son auteur.",
      en: "It's a structural model named after its author.",
    },
    explanation: {
      fr: "Il s'agit du modèle de Merton, un modèle structurel qui utilise les données de marché (cours de l'action) pour estimer la probabilité de défaut d'une entreprise cotée.",
      en: "This is the Merton model, a structural model that uses market data (the stock price) to estimate a listed company's default probability.",
    },
    commonMistake: {
      fr: "Ne pas confondre avec un modèle de scoring statistique (régression logistique), qui est une approche différente.",
      en: "Do not confuse with a statistical scoring model (logistic regression), which is a different approach.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-credit-comprehension-utilite",
  conceptId: "m03-risque-credit",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi un investisseur obligataire doit-il évaluer le risque de crédit d'un émetteur, plutôt que de se fier uniquement au coupon offert ?",
    en: "Why must a bond investor assess an issuer's credit risk, rather than relying solely on the offered coupon?",
  },
  choices: [
    { id: "default-risk", label: { fr: "Parce qu'un coupon élevé peut simplement compenser un risque de défaut plus élevé, pas être un « bon plan » gratuit", en: "Because a high coupon may simply compensate for higher default risk, not be a free \"good deal\"" } },
    { id: "coupon-guarantees", label: { fr: "Le coupon garantit toujours le remboursement intégral, le risque de crédit est donc sans importance", en: "The coupon always guarantees full repayment, so credit risk doesn't matter" } },
    { id: "only-rating-agencies", label: { fr: "Seules les agences de notation ont besoin d'évaluer ce risque, jamais l'investisseur final", en: "Only rating agencies need to assess this risk, never the end investor" } },
  ],
  correctId: "default-risk",
  hint: { fr: "Un coupon élevé n'est jamais un cadeau gratuit de l'émetteur — pensez au principe risque/rendement.", en: "A high coupon is never a free gift from the issuer — think of the risk/return principle." },
  explanation: {
    fr: "Un coupon plus élevé rémunère généralement un risque de crédit plus élevé (spread de crédit) : ignorer ce risque revient à comparer des obligations sur le seul rendement affiché, sans comprendre ce qui le justifie, un piège classique pour un investisseur qui cherche du rendement sans en mesurer la contrepartie.",
    en: "A higher coupon generally compensates for higher credit risk (the credit spread): ignoring this risk means comparing bonds solely on their displayed yield, without understanding what justifies it — a classic trap for an investor chasing yield without gauging its counterpart.",
  },
  commonMistake: {
    fr: "Comparer des obligations uniquement sur leur coupon ou leur rendement affiché, sans tenir compte du risque de crédit qui explique une bonne partie de cet écart.",
    en: "Comparing bonds solely on their displayed coupon or yield, without accounting for the credit risk that explains much of that gap.",
  },
});

const historicalVsMarketComparisonTemplate = mcqTemplate({
  id: "m03-credit-comparaison-historique-marche",
  conceptId: "m03-risque-credit",
  difficulty: "medium",
  prompt: {
    fr: "Comparez une PD estimée par taux de défaut historique de la catégorie de notation, et une PD estimée par un modèle structurel basé sur le cours de l'action en temps réel. Laquelle réagit le plus vite à une détérioration soudaine de la situation de l'entreprise ?",
    en: "Compare a PD estimated from the rating category's historical default rate, and a PD estimated by a structural model based on the real-time stock price. Which one reacts fastest to a sudden deterioration in the company's situation?",
  },
  choices: [
    { id: "structural", label: { fr: "La PD du modèle structurel, car le cours de l'action réagit immédiatement à l'information nouvelle", en: "The structural model's PD, since the stock price reacts immediately to new information" } },
    { id: "historical", label: { fr: "La PD historique par catégorie de notation, mise à jour en continu", en: "The historical PD by rating category, continuously updated" } },
    { id: "same-speed", label: { fr: "Les deux réagissent exactement à la même vitesse", en: "Both react at exactly the same speed" } },
  ],
  correctId: "structural",
  hint: { fr: "Le taux de défaut historique d'une catégorie de notation ne change pas au jour le jour ; le cours d'une action, si.", en: "A rating category's historical default rate doesn't change day to day; a stock price does." },
  explanation: {
    fr: "Le taux de défaut historique d'une catégorie de notation (ex. BBB) est une moyenne calculée sur des années, qui ne bouge pas en réaction à l'actualité d'une entreprise précise. À l'inverse, un modèle structurel basé sur le cours de l'action intègre immédiatement toute nouvelle information affectant la valeur perçue des actifs de l'entreprise, offrant une estimation beaucoup plus réactive, au prix d'une plus grande volatilité de l'estimation elle-même.",
    en: "A rating category's historical default rate (e.g. BBB) is an average computed over years, which doesn't move in reaction to a specific company's news. A structural model based on the stock price, by contrast, immediately incorporates any new information affecting the perceived value of the firm's assets, offering a much more reactive estimate, at the cost of the estimate itself being more volatile.",
  },
  commonMistake: {
    fr: "Croire qu'une notation ou un taux de défaut historique se met à jour aussi vite que le marché face à une actualité spécifique à l'entreprise.",
    en: "Believing a rating or a historical default rate updates as fast as the market does in response to company-specific news.",
  },
});

const whatIfEquityDropTemplate = mcqTemplate({
  id: "m03-credit-whatif-chute-action",
  conceptId: "m03-risque-credit",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le cours de l'action d'une entreprise cotée chute brutalement de 40% et sa volatilité implicite double, sans qu'aucune agence n'ait encore révisé sa notation. Selon un modèle structurel (Merton), que devient la probabilité de défaut estimée ?",
    en: "A listed company's stock price abruptly falls 40% and its implied volatility doubles, with no rating agency having revised its rating yet. According to a structural (Merton) model, what happens to the estimated default probability?",
  },
  choices: [
    { id: "increases", label: { fr: "Elle augmente immédiatement, car la valeur des actifs perçue se rapproche de la valeur de la dette et la volatilité accrue augmente le risque de la franchir", en: "It increases immediately, since perceived asset value moves closer to debt value and higher volatility increases the risk of crossing it" } },
    { id: "unchanged", label: { fr: "Elle reste inchangée tant que la notation officielle n'a pas été révisée", en: "It stays unchanged until the official rating has been revised" } },
    { id: "decreases", label: { fr: "Elle diminue, car une baisse du cours réduit le montant de la dette à rembourser", en: "It decreases, since a price drop reduces the amount of debt to repay" } },
  ],
  correctId: "increases",
  hint: { fr: "Le modèle de Merton lie directement la valeur des actifs (via le cours de l'action) et la volatilité au risque de franchir la barrière de la dette.", en: "The Merton model directly links asset value (via the stock price) and volatility to the risk of crossing the debt barrier." },
  explanation: {
    fr: "Dans le modèle de Merton, le défaut survient quand la valeur des actifs de l'entreprise passe sous celle de sa dette : une chute du cours de l'action (qui reflète la valeur des actifs nets de dette) rapproche ce seuil, et une volatilité plus élevée augmente la probabilité de le franchir. Le modèle structurel réagit donc immédiatement, contrairement à une notation d'agence qui peut mettre des semaines ou des mois à être révisée.",
    en: "In the Merton model, default occurs when the firm's asset value falls below its debt value: a stock price drop (which reflects the value of assets net of debt) brings that threshold closer, and higher volatility increases the probability of crossing it. The structural model therefore reacts immediately, unlike an agency rating which can take weeks or months to be revised.",
  },
  commonMistake: {
    fr: "Attendre la révision officielle d'une notation pour considérer que le risque de crédit a changé, en ignorant les signaux de marché déjà disponibles et exploitables via un modèle structurel.",
    en: "Waiting for an official rating revision to consider credit risk has changed, ignoring market signals already available and usable via a structural model.",
  },
});

const seniorVsSubordinatedComparisonTemplate = mcqTemplate({
  id: "m03-credit-comparaison-senior-subordonnee",
  conceptId: "m03-risque-credit",
  difficulty: "medium",
  prompt: {
    fr: "En cas de défaut du même émetteur, laquelle a généralement le taux de recouvrement le plus élevé : une dette senior, ou une dette subordonnée ?",
    en: "In the event of the same issuer's default, which generally has the higher recovery rate: senior debt, or subordinated debt?",
  },
  choices: [
    { id: "senior", label: { fr: "La dette senior, remboursée en priorité sur les actifs restants", en: "Senior debt, repaid first from the remaining assets" } },
    { id: "subordinated", label: { fr: "La dette subordonnée", en: "Subordinated debt" } },
    { id: "same", label: { fr: "Les deux ont toujours le même taux de recouvrement", en: "Both always have the same recovery rate" } },
  ],
  correctId: "senior",
  hint: { fr: "Le rang de la dette détermine l'ordre dans lequel les créanciers sont remboursés sur les actifs restants.", en: "Debt seniority determines the order in which creditors are repaid from the remaining assets." },
  explanation: {
    fr: "En cas de défaut, les actifs restants de l'entreprise sont distribués selon un ordre de priorité : la dette senior est remboursée avant la dette subordonnée, ce qui lui donne généralement un taux de recouvrement plus élevé, à défaut égal sur le même émetteur. C'est pourquoi une dette subordonnée offre typiquement un spread de crédit plus large, pour compenser ce recouvrement attendu plus faible.",
    en: "Upon default, the firm's remaining assets are distributed by priority order: senior debt is repaid before subordinated debt, generally giving it a higher recovery rate, for the same issuer's default. This is why subordinated debt typically offers a wider credit spread, to compensate for this lower expected recovery.",
  },
  commonMistake: {
    fr: "Croire que le taux de recouvrement ne dépend que de l'émetteur, en oubliant que le rang de la créance au sein de sa structure de capital compte tout autant.",
    en: "Believing the recovery rate only depends on the issuer, forgetting the claim's rank within the capital structure matters just as much.",
  },
});

const expectedLossNumericTemplate: QuestionTemplate = {
  id: "m03-credit-perte-attendue-calcul",
  conceptId: "m03-risque-credit",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const exposure = randomInt(rng, 2, 40) * 250_000;
    const pdPct = randomInt(rng, 1, 15);
    const recoveryPct = randomInt(rng, 20, 50);
    const expectedLoss = Math.round(exposure * (pdPct / 100) * (1 - recoveryPct / 100));

    return {
      isScenario: true,
      prompt: {
        fr: `Une exposition de crédit de ${fmt(exposure, "fr")} a une probabilité de défaut annuelle de ${pdPct}% et un taux de recouvrement attendu de ${recoveryPct}%. Quelle est la perte attendue (expected loss) sur cette exposition ?`,
        en: `A credit exposure of ${fmt(exposure, "en")} has an annual default probability of ${pdPct}% and an expected recovery rate of ${recoveryPct}%. What is the expected loss on this exposure?`,
      },
      numericUnit: { fr: "même devise que l'exposition", en: "same currency as the exposure" },
      numericTolerance: "± 100",
      hint: { fr: "Perte attendue = Exposition × PD × (1 − Taux de recouvrement).", en: "Expected loss = Exposure × PD × (1 − Recovery rate)." },
      numeric: { value: expectedLoss, tolerance: 100 },
      calculation: {
        fr: `Perte attendue = ${fmt(exposure, "fr")} × ${pdPct}% × (1 − ${recoveryPct}%) ≈ ${fmt(expectedLoss, "fr")}.`,
        en: `Expected loss = ${fmt(exposure, "en")} × ${pdPct}% × (1 − ${recoveryPct}%) ≈ ${fmt(expectedLoss, "en")}.`,
      },
      explanation: {
        fr: "La perte attendue combine les trois dimensions du risque de crédit : la probabilité que l'événement survienne (PD), l'ampleur de l'exposition, et la part effectivement perdue en cas de défaut (1 − taux de recouvrement) — c'est la mesure de base utilisée pour provisionner un risque de crédit.",
        en: "Expected loss combines the three dimensions of credit risk: the probability the event occurs (PD), the exposure's size, and the share actually lost upon default (1 − recovery rate) — this is the basic measure used to provision for credit risk.",
      },
      commonMistake: {
        fr: "Oublier de multiplier par (1 − taux de recouvrement), ce qui revient à supposer (à tort) une perte totale en cas de défaut.",
        en: "Forgetting to multiply by (1 − recovery rate), which wrongly assumes a total loss upon default.",
      },
    };
  },
};

const riskNeutralVsRealPdErrorTemplate = trueFalseTemplate({
  id: "m03-credit-erreur-pd-neutre-vs-reelle",
  conceptId: "m03-risque-credit",
  difficulty: "hard",
  statement: {
    fr: "La probabilité de défaut extraite des spreads de marché (CDS ou obligataires) est directement égale à la probabilité de défaut réelle/historique de l'entité.",
    en: "The default probability extracted from market spreads (CDS or bond) is directly equal to the entity's real-world/historical default probability.",
  },
  correct: false,
  explanation: {
    fr: "Faux : la PD extraite des spreads de marché est une PD « risque-neutre », qui inclut une prime de risque exigée par les investisseurs pour supporter l'incertitude, en plus de la vraie probabilité de défaut. Elle est généralement plus élevée que la PD réelle/historique, ce qui explique en partie pourquoi les spreads de crédit paraissent souvent « trop élevés » par rapport aux taux de défaut effectivement observés.",
    en: "False: the PD extracted from market spreads is a \"risk-neutral\" PD, which includes a risk premium investors demand for bearing the uncertainty, on top of the true default probability. It is generally higher than the real-world/historical PD, which partly explains why credit spreads often look \"too high\" relative to actually observed default rates.",
  },
  commonMistake: {
    fr: "Utiliser directement une PD de marché (risque-neutre) pour du provisionnement comptable, qui exige normalement une PD réelle/historique — les deux répondent à des questions différentes.",
    en: "Directly using a market (risk-neutral) PD for accounting provisioning, which normally requires a real-world/historical PD — the two answer different questions.",
  },
});

const fallenAngelScenarioTemplate = mcqTemplate({
  id: "m03-credit-scenario-fallen-angel",
  conceptId: "m03-risque-credit",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une entreprise notée BBB− (le dernier échelon « investment grade ») est dégradée en BB+ (« high yield »/spéculatif) par une agence. Un fonds obligataire dont le mandat interdit de détenir des titres spéculatifs détient encore cette obligation. Que doit-il probablement faire, et quel effet cela a-t-il souvent sur le prix ?",
    en: "A BBB− company (the last \"investment grade\" notch) is downgraded to BB+ (\"high yield\"/speculative) by an agency. A bond fund whose mandate forbids holding speculative securities still holds this bond. What must it likely do, and what effect does this often have on price?",
  },
  choices: [
    { id: "forced-sell", label: { fr: "Le vendre rapidement pour respecter son mandat, ce qui peut créer une pression vendeuse additionnelle et faire baisser le prix au-delà de ce que justifierait le seul risque de crédit", en: "Sell it quickly to comply with its mandate, which can create additional selling pressure and push the price down beyond what credit risk alone would justify" } },
    { id: "no-action", label: { fr: "Rien de particulier, une dégradation d'un cran n'a jamais de conséquence pratique", en: "Nothing in particular, a one-notch downgrade never has a practical consequence" } },
    { id: "must-buy-more", label: { fr: "Il doit au contraire en acheter davantage pour profiter du rendement plus élevé", en: "It must instead buy more to benefit from the higher yield" } },
  ],
  correctId: "forced-sell",
  hint: { fr: "Beaucoup de mandats institutionnels imposent de ne détenir QUE des titres investment grade — que se passe-t-il quand un titre en sort ?", en: "Many institutional mandates require holding ONLY investment-grade securities — what happens when a security exits that category?" },
  explanation: {
    fr: "Ce phénomène, connu sous le nom de « fallen angel », force de nombreux investisseurs institutionnels contraints par leur mandat à vendre rapidement l'obligation dégradée, souvent en même temps que d'autres investisseurs dans la même situation : cette vente forcée et concentrée dans le temps peut amplifier temporairement la baisse du prix, au-delà de ce que justifierait objectivement la seule détérioration du risque de crédit — un effet mécanique de structure de marché, pas seulement de fondamentaux.",
    en: "This phenomenon, known as a \"fallen angel\", forces many mandate-constrained institutional investors to quickly sell the downgraded bond, often at the same time as other investors in the same situation: this forced, time-concentrated selling can temporarily amplify the price decline, beyond what the credit deterioration alone would objectively justify — a mechanical market-structure effect, not just fundamentals.",
  },
  commonMistake: {
    fr: "Attribuer toute la baisse de prix suivant une dégradation \"fallen angel\" uniquement à la détérioration du risque de crédit, en ignorant l'effet amplificateur des ventes forcées par les mandats institutionnels.",
    en: "Attributing all the price decline following a \"fallen angel\" downgrade solely to the credit deterioration, ignoring the amplifying effect of institutional mandate-forced selling.",
  },
});

export const templates: QuestionTemplate[] = [
  modelChoiceListedTemplate,
  modelChoiceUnlistedTemplate,
  empiricalPdTemplate,
  ratingNotGuaranteeTemplate,
  mertonVocabTemplate,
  comprehensionTemplate,
  historicalVsMarketComparisonTemplate,
  seniorVsSubordinatedComparisonTemplate,
  whatIfEquityDropTemplate,
  expectedLossNumericTemplate,
  riskNeutralVsRealPdErrorTemplate,
  fallenAngelScenarioTemplate,
];
