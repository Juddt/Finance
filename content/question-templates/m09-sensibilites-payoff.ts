import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const basketCorrelationTemplate: QuestionTemplate = {
  id: "m09-sensib-panier-correlation",
  conceptId: "m09-sensibilites-payoff",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un panier call est-il typiquement long ou court corrélation ?",
      en: "Is a basket call typically long or short correlation?",
    },
    choices: buildChoices([
      { id: "long", label: { fr: "Long corrélation (une hausse de corrélation augmente sa valeur)", en: "Long correlation (a correlation rise increases its value)" } },
      { id: "short", label: { fr: "Court corrélation (une hausse de corrélation diminue sa valeur)", en: "Short correlation (a correlation rise decreases its value)" } },
    ]),
    hint: { fr: "Pensez à la formule de variance du panier : Var = Σwi²σi² + Σ termes croisés en ρ.", en: "Think of the basket variance formula: Var = Σwi²σi² + Σ cross terms in ρ." },
    correctChoiceIds: ["long"],
    explanation: {
      fr: "Un panier call est typiquement long corrélation : une corrélation plus élevée augmente la variance du panier (le terme croisé de la formule de variance croît avec ρ), donc la valeur de l'option.",
      en: "A basket call is typically long correlation: a higher correlation increases the basket's variance (the variance formula's cross term grows with ρ), hence the option's value.",
    },
    commonMistake: {
      fr: "Appliquer au panier la sensibilité typique d'un Worst-Of, qui va dans le sens opposé.",
      en: "Applying to the basket the typical Worst-Of sensitivity, which goes the opposite way.",
    },
  }),
};

const worstOfCorrelationTemplate: QuestionTemplate = {
  id: "m09-sensib-worstof-correlation",
  conceptId: "m09-sensibilites-payoff",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un Worst-Of call est-il typiquement long ou court corrélation ?",
      en: "Is a Worst-Of call typically long or short correlation?",
    },
    choices: buildChoices([
      { id: "long", label: { fr: "Long corrélation", en: "Long correlation" } },
      { id: "short", label: { fr: "Court corrélation", en: "Short correlation" } },
    ]),
    hint: { fr: "Une corrélation basse disperse davantage les résultats individuels — que fait cela au \"pire\" résultat retenu ?", en: "Low correlation spreads individual outcomes more — what does this do to the \"worst\" outcome retained?" },
    correctChoiceIds: ["short"],
    explanation: {
      fr: "Un Worst-Of call est typiquement court corrélation : une corrélation plus basse disperse davantage les résultats, augmentant la probabilité qu'un actif traîne loin derrière, ce qui pénalise le pire résultat retenu — l'inverse exact du panier.",
      en: "A Worst-Of call is typically short correlation: lower correlation spreads outcomes more, increasing the chance one asset lags far behind, which hurts the retained worst outcome — the exact opposite of the basket.",
    },
    commonMistake: {
      fr: "Appliquer au Worst-Of la sensibilité typique d'un panier (long corrélation), l'erreur la plus fréquente sur ce sujet.",
      en: "Applying to the Worst-Of the typical basket sensitivity (long correlation), the most frequent mistake on this topic.",
    },
  }),
};

const noUniversalSignTemplate: QuestionTemplate = {
  id: "m09-sensib-pas-signe-universel",
  conceptId: "m09-sensibilites-payoff",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const claim = pick(
      rng,
      [
        { id: "correlation", fr: "la corrélation", en: "correlation" },
        { id: "dispersion", fr: "la dispersion", en: "dispersion" },
      ] as const
    );
    return {
      prompt: {
        fr: `Tous les produits multi-actifs (paniers, Worst-Of, Best-Of, calls et puts confondus) ont le même signe de sensibilité à ${claim.fr}, sans exception.`,
        en: `All multi-asset products (baskets, Worst-Of, Best-Of, calls and puts alike) have the same sign of sensitivity to ${claim.en}, with no exception.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : le signe de la sensibilité dépend précisément du type de payoff (panier vs Worst-Of vs Best-Of) et du sens (call vs put) — il n'existe aucune règle universelle applicable à tous les produits multi-actifs sans distinction.",
        en: "False: the sensitivity's sign depends precisely on the payoff type (basket vs Worst-Of vs Best-Of) and direction (call vs put) — there is no universal rule applicable to all multi-asset products without distinction.",
      },
      commonMistake: {
        fr: "Généraliser un signe unique de sensibilité à tous les produits multi-actifs sans distinction, l'erreur centrale de cette notion.",
        en: "Generalizing a single sensitivity sign to all multi-asset products without distinction, this concept's central mistake.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m09-sensib-vocab",
  conceptId: "m09-sensibilites-payoff",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La variation de la valeur d'un produit multi-actifs pour une petite variation de la corrélation entre ses composants s'appelle parfois la « corrélation ______ », par analogie avec le Vega.",
      en: "The change in a multi-asset product's value for a small change in the correlation between its components is sometimes called \"correlation ______\", by analogy with Vega.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vega"],
    hint: { fr: "Le même mot que la sensibilité à la volatilité, réutilisé par analogie.", en: "The same word as volatility sensitivity, reused by analogy." },
    explanation: {
      fr: "Par analogie avec le Vega (sensibilité à la volatilité, M07-1), on parle parfois de \"corrélation vega\" pour désigner la sensibilité d'un produit multi-actifs à la corrélation.",
      en: "By analogy with Vega (volatility sensitivity, M07-1), one sometimes speaks of \"correlation vega\" to denote a multi-asset product's sensitivity to correlation.",
    },
    commonMistake: {
      fr: "Croire que ce terme désigne une sensibilité à la volatilité plutôt qu'à la corrélation.",
      en: "Believing this term denotes a sensitivity to volatility rather than to correlation.",
    },
  }),
};

export const templates: QuestionTemplate[] = [basketCorrelationTemplate, worstOfCorrelationTemplate, noUniversalSignTemplate, vocabTemplate];
