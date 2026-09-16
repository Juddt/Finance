import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const lossAversionTemplate: QuestionTemplate = {
  id: "m13-backtesting-aversion-perte",
  conceptId: "m13-backtesting-biais",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un trader conserve une position perdante bien au-delà de son stop-loss prévu, espérant un retournement. Quel biais comportemental illustre ce comportement ?",
      en: "A trader holds a losing position well beyond their planned stop-loss, hoping for a reversal. What behavioral bias does this illustrate?",
    },
    choices: buildChoices([
      { id: "loss-aversion", label: { fr: "L'aversion à la perte", en: "Loss aversion" } },
      { id: "confirmation", label: { fr: "Le biais de confirmation", en: "Confirmation bias" } },
    ]),
    hint: { fr: "La douleur de matérialiser une perte est ressentie plus intensément qu'un gain équivalent.", en: "The pain of materializing a loss is felt more intensely than an equivalent gain." },
    correctChoiceIds: ["loss-aversion"],
    explanation: {
      fr: "L'aversion à la perte pousse à conserver des positions perdantes trop longtemps, la douleur de matérialiser la perte étant ressentie plus intensément que le plaisir d'un gain équivalent.",
      en: "Loss aversion drives holding losing positions too long, since the pain of materializing a loss is felt more intensely than an equivalent gain's pleasure.",
    },
    commonMistake: {
      fr: "Confondre ce biais avec le biais de confirmation, qui concerne la recherche sélective d'informations, pas la gestion d'une position perdante.",
      en: "Confusing this bias with confirmation bias, which concerns selective information-seeking, not managing a losing position.",
    },
  }),
};

const backtestGapTemplate: QuestionTemplate = {
  id: "m13-backtesting-ecart-reel",
  conceptId: "m13-backtesting-biais",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un écart persistant entre performance backtestée et performance réelle, une fois les coûts de transaction correctement modélisés, pointe presque toujours vers un problème d'exécution comportementale.",
      en: "A persistent gap between backtested and real performance, once transaction costs are correctly modeled, almost always points to a behavioral execution problem.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : une fois les coûts réalistes intégrés au backtest, un écart persistant suggère presque toujours que l'exécution réelle dévie des règles prédéfinies de la stratégie, souvent à cause de biais comportementaux.",
      en: "True: once realistic costs are incorporated into the backtest, a persistent gap almost always suggests real execution deviates from the strategy's predefined rules, often due to behavioral biases.",
    },
    commonMistake: {
      fr: "Attribuer systématiquement cet écart à des \"conditions de marché différentes\" sans examiner sa propre discipline d'exécution.",
      en: "Systematically attributing this gap to \"different market conditions\" without examining one's own execution discipline.",
    },
  }),
};

const curveFittingTemplate: QuestionTemplate = {
  id: "m13-backtesting-curve-fitting",
  conceptId: "m13-backtesting-biais",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Sur-optimiser une stratégie sur des données historiques jusqu'à obtenir un backtest magnifique mais non robuste est un cas particulier de :",
      en: "Over-optimizing a strategy on historical data until achieving a beautiful but non-robust backtest is a special case of:",
    },
    choices: buildChoices([
      { id: "snooping", label: { fr: "Data snooping (déjà rencontré en M12-cross)", en: "Data snooping (already encountered in M12-cross)" } },
      { id: "leakage", label: { fr: "Un simple manque de données historiques", en: "A simple lack of historical data" } },
    ]),
    hint: { fr: "Tester de très nombreuses variantes et ne garder que la meilleure crée une performance illusoire.", en: "Testing very many variants and keeping only the best creates an illusory performance." },
    correctChoiceIds: ["snooping"],
    explanation: {
      fr: "Le curve fitting (sur-optimisation) est un cas particulier de data snooping : tester de très nombreuses variantes d'une stratégie sur le même historique et ne retenir que la meilleure produit une performance de backtest illusoire, sans pouvoir prédictif réel.",
      en: "Curve fitting (over-optimization) is a special case of data snooping: testing very many strategy variants on the same history and keeping only the best produces an illusory backtest performance, with no real predictive power.",
    },
    commonMistake: {
      fr: "Croire qu'un backtest magnifique est toujours le signe d'une bonne stratégie plutôt que d'un possible sur-ajustement.",
      en: "Believing a beautiful backtest is always a sign of a good strategy rather than possible overfitting.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-backtesting-vocab",
  conceptId: "m13-backtesting-biais",
  kind: "fill_blank",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const variant = pick(rng, ["confirmation", "recency"] as const);
    return {
      prompt: variant === "confirmation"
        ? { fr: "La tendance à chercher uniquement des informations confirmant une position déjà prise s'appelle le biais de ______.", en: "The tendency to seek only information confirming an already-taken position is called ______ bias." }
        : { fr: "La tendance à surpondérer les événements récents dans les décisions futures s'appelle le biais de ______.", en: "The tendency to overweight recent events in future decisions is called ______ bias." },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: variant === "confirmation" ? ["confirmation"] : ["recence", "récence", "recency"],
      hint: { fr: "Un biais comportemental classique mentionné dans la leçon.", en: "A classic behavioral bias mentioned in the lesson." },
      explanation: variant === "confirmation"
        ? { fr: "Le biais de confirmation pousse à rechercher sélectivement des informations qui confirment une décision déjà prise, ignorant les signaux contraires.", en: "Confirmation bias drives selectively seeking information that confirms an already-taken decision, ignoring contrary signals." }
        : { fr: "Le biais de récence pousse à surpondérer les événements récents par rapport à l'historique complet, faussant l'évaluation d'une stratégie ou d'un marché.", en: "Recency bias drives overweighting recent events relative to the full history, distorting the evaluation of a strategy or market." },
      commonMistake: {
        fr: "Confondre ce biais avec l'aversion à la perte, qui concerne spécifiquement la gestion des positions perdantes.",
        en: "Confusing this bias with loss aversion, which specifically concerns managing losing positions.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [lossAversionTemplate, backtestGapTemplate, curveFittingTemplate, vocabTemplate];
