import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const identifyRiskTemplate: QuestionTemplate = {
  id: "m13-typologie-identifier-risque",
  conceptId: "m13-typologie-risques",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenario = pick(rng, ["counterparty", "operational"] as const);
    return {
      prompt: scenario === "counterparty"
        ? { fr: "Une banque a acheté une protection via un CDS auprès d'un vendeur qui fait faillite au moment où la protection devait se déclencher. Quel risque s'est matérialisé ?", en: "A bank bought CDS protection from a seller who goes bankrupt exactly when the protection should trigger. What risk materialized?" }
        : { fr: "Une perte survient à cause d'une erreur de saisie manuelle d'un trader, sans aucun lien avec un mouvement de marché. Quel risque s'est matérialisé ?", en: "A loss occurs due to a trader's manual entry error, with no link to any market movement. What risk materialized?" },
      choices: buildChoices([
        { id: "correct", label: scenario === "counterparty" ? { fr: "Risque de contrepartie", en: "Counterparty risk" } : { fr: "Risque opérationnel", en: "Operational risk" } },
        { id: "market", label: { fr: "Risque de marché", en: "Market risk" } },
      ]),
      hint: { fr: "Ce risque n'est ni lié aux mouvements de prix, ni au défaut d'un émetteur de dette classique.", en: "This risk is tied neither to price movements nor a classic debt issuer's default." },
      correctChoiceIds: ["correct"],
      explanation: scenario === "counterparty"
        ? { fr: "Le risque de contrepartie est spécifique aux contrats bilatéraux comme les CDS : le vendeur de protection lui-même peut faire défaut, rendant la couverture inopérante.", en: "Counterparty risk is specific to bilateral contracts like CDS: the protection seller itself can default, making the hedge ineffective." }
        : { fr: "Le risque opérationnel couvre les pertes dues à des défaillances internes (erreurs humaines, systèmes), indépendamment de tout mouvement de marché.", en: "Operational risk covers losses due to internal failures (human error, systems), independent of any market movement." },
      commonMistake: {
        fr: "Confondre ce risque avec le risque de marché, alors qu'aucun mouvement de prix n'en est la cause directe.",
        en: "Confusing this risk with market risk, when no price movement is the direct cause.",
      },
    };
  },
};

const hedgeIncompleteTemplate: QuestionTemplate = {
  id: "m13-typologie-couverture-incomplete",
  conceptId: "m13-typologie-risques",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une position parfaitement delta-neutre (couverte contre le risque de marché) est automatiquement protégée contre tous les autres types de risque financier.",
      en: "A perfectly delta-neutral position (hedged against market risk) is automatically protected against all other types of financial risk.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : une position delta-neutre est couverte uniquement contre le risque de marché. Elle peut rester pleinement exposée au risque de crédit, de contrepartie, de liquidité ou opérationnel, qui sont des dimensions totalement distinctes.",
      en: "False: a delta-neutral position is hedged only against market risk. It can remain fully exposed to credit, counterparty, liquidity or operational risk, which are entirely distinct dimensions.",
    },
    commonMistake: {
      fr: "Croire qu'une couverture contre un type de risque protège automatiquement contre tous les autres.",
      en: "Believing a hedge against one risk type automatically protects against all others.",
    },
  }),
};

const creditVsCounterpartyTemplate: QuestionTemplate = {
  id: "m13-typologie-credit-vs-contrepartie",
  conceptId: "m13-typologie-risques",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Quelle est la différence entre le risque de crédit sur une obligation et le risque de contrepartie sur un swap ?",
      en: "What is the difference between credit risk on a bond and counterparty risk on a swap?",
    },
    choices: buildChoices([
      { id: "correct", label: { fr: "Le risque de crédit est un montant fixe connu ; le risque de contrepartie varie dans le temps avec la valeur de marché du contrat", en: "Credit risk is a known fixed amount; counterparty risk varies over time with the contract's market value" } },
      { id: "same", label: { fr: "Ce sont deux noms différents pour exactement le même concept", en: "These are two different names for exactly the same concept" } },
    ]),
    hint: { fr: "Pensez à comment l'exposition évolue dans le temps pour chaque type de risque.", en: "Think about how exposure evolves over time for each risk type." },
    correctChoiceIds: ["correct"],
    explanation: {
      fr: "Le risque de crédit sur une obligation porte sur un montant fixe connu (le nominal), tandis que le risque de contrepartie sur un swap varie dans le temps avec la valeur de marché du contrat lui-même, nécessitant un calcul dynamique de l'exposition (CVA).",
      en: "Bond credit risk concerns a known fixed amount (the face value), while swap counterparty risk varies over time with the contract's own market value, requiring a dynamic exposure calculation (CVA).",
    },
    commonMistake: {
      fr: "Traiter risque de crédit et risque de contrepartie comme des synonymes interchangeables.",
      en: "Treating credit risk and counterparty risk as interchangeable synonyms.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-typologie-vocab",
  conceptId: "m13-typologie-risques",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le risque de ne pas pouvoir acheter ou vendre un actif rapidement sans impact significatif sur son prix est le risque de ______.",
      en: "The risk of being unable to quickly buy or sell an asset without significantly impacting its price is ______ risk.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["liquidite", "liquidité", "liquidity"],
    hint: { fr: "Un des cinq grandes familles de risque financier vues dans la leçon.", en: "One of the five major financial risk families seen in the lesson." },
    explanation: {
      fr: "Le risque de liquidité, déjà rencontré pour les produits structurés (M11-1), désigne la difficulté et le coût de revendre un actif rapidement sans faire bouger son prix.",
      en: "Liquidity risk, already encountered for structured products (M11-1), denotes the difficulty and cost of quickly reselling an asset without moving its price.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le risque de marché, qui concerne les mouvements de prix eux-mêmes, pas la facilité de transaction.",
      en: "Confusing this term with market risk, which concerns price movements themselves, not transaction ease.",
    },
  }),
};

export const templates: QuestionTemplate[] = [identifyRiskTemplate, hedgeIncompleteTemplate, creditVsCounterpartyTemplate, vocabTemplate];
