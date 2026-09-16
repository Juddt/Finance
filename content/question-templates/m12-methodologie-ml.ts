import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const walkForwardTemplate: QuestionTemplate = {
  id: "m12-methodologie-walk-forward",
  conceptId: "m12-methodologie-ml",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pourquoi la validation walk-forward est-elle préférée à un k-fold aléatoire pour des données financières ?",
      en: "Why is walk-forward validation preferred over random k-fold for financial data?",
    },
    choices: buildChoices([
      { id: "chronological", label: { fr: "Elle respecte l'ordre chronologique, simulant fidèlement les conditions réelles de déploiement", en: "It respects chronological order, faithfully simulating real deployment conditions" } },
      { id: "faster", label: { fr: "Elle est simplement plus rapide à calculer", en: "It's simply faster to compute" } },
    ]),
    hint: { fr: "Le problème du k-fold aléatoire est qu'il mélange passé et futur.", en: "Random k-fold's problem is that it mixes past and future." },
    correctChoiceIds: ["chronological"],
    explanation: {
      fr: "La validation walk-forward entraîne toujours sur le passé et teste sur une période future non vue, exactement comme un modèle serait réellement déployé — contrairement au k-fold aléatoire qui mélange passé et futur et permet une fuite de données.",
      en: "Walk-forward validation always trains on the past and tests on an unseen future period, exactly as a model would really be deployed — unlike random k-fold, which mixes past and future and allows data leakage.",
    },
    commonMistake: {
      fr: "Croire que le choix de la méthode de validation est une question de commodité de calcul plutôt qu'une question de validité méthodologique.",
      en: "Believing the validation method choice is a matter of computational convenience rather than methodological validity.",
    },
  }),
};

const survivorshipBiasTemplate: QuestionTemplate = {
  id: "m12-methodologie-biais-survivance",
  conceptId: "m12-methodologie-ml",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un backtest réalisé uniquement sur les entreprises encore cotées aujourd'hui surestime généralement la performance historique réelle.",
      en: "A backtest run only on companies still listed today generally overstates the real historical performance.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : c'est le biais de survivance. Exclure les entreprises ayant fait faillite ou disparu (souvent les moins performantes) gonfle artificiellement la performance moyenne observée dans le backtest.",
      en: "True: this is survivorship bias. Excluding companies that went bankrupt or disappeared (often the worst performers) artificially inflates the backtest's observed average performance.",
    },
    commonMistake: {
      fr: "Ne pas vérifier si l'univers d'actifs utilisé pour un backtest inclut les entreprises disparues en cours de période.",
      en: "Not checking whether the asset universe used for a backtest includes companies that disappeared during the period.",
    },
  }),
};

const benchmarkNumericTemplate: QuestionTemplate = {
  id: "m12-methodologie-skill-score",
  conceptId: "m12-methodologie-ml",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const perfModel = randomInt(rng, -20, 80) / 100;
    const perfBenchmark = randomInt(rng, -10, 30) / 100;
    const sigmaBenchmark = randomInt(rng, 10, 40) / 100;
    const skill = Math.round(((perfModel - perfBenchmark) / sigmaBenchmark) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un modèle a une performance de ${(perfModel * 100).toFixed(0)}%, le benchmark naïf a une performance de ${(perfBenchmark * 100).toFixed(0)}% avec un écart-type de ${(sigmaBenchmark * 100).toFixed(0)}%. Quel est le skill score du modèle ?`,
        en: `A model has ${(perfModel * 100).toFixed(0)}% performance, the naive benchmark has ${(perfBenchmark * 100).toFixed(0)}% performance with a standard deviation of ${(sigmaBenchmark * 100).toFixed(0)}%. What is the model's skill score?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.15",
      hint: { fr: "Skill = (Performance_modèle − Performance_benchmark) / σ_benchmark.", en: "Skill = (Model_performance − Benchmark_performance) / σ_benchmark." },
      numeric: { value: skill, tolerance: 0.15 },
      calculation: {
        fr: `Skill = (${(perfModel * 100).toFixed(0)}% − ${(perfBenchmark * 100).toFixed(0)}%) / ${(sigmaBenchmark * 100).toFixed(0)}% ≈ ${skill.toFixed(2)}.`,
        en: `Skill = (${(perfModel * 100).toFixed(0)}% − ${(perfBenchmark * 100).toFixed(0)}%) / ${(sigmaBenchmark * 100).toFixed(0)}% ≈ ${skill.toFixed(2)}.`,
      },
      explanation: {
        fr: "Le skill score normalise l'écart de performance par la variabilité du benchmark, pour juger si l'avance du modèle est significative ou simplement dans le bruit normal.",
        en: "The skill score normalizes the performance gap by the benchmark's variability, to judge whether the model's edge is significant or just within normal noise.",
      },
      commonMistake: {
        fr: "Comparer directement les deux performances sans les normaliser par la variabilité du benchmark, ce qui ne dit rien sur la significativité de l'écart.",
        en: "Directly comparing the two performances without normalizing by the benchmark's variability, which says nothing about the gap's significance.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m12-methodologie-vocab",
  conceptId: "m12-methodologie-ml",
  kind: "fill_blank",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const variant = pick(rng, ["leakage", "snooping"] as const);
    return {
      prompt: variant === "leakage"
        ? { fr: "Quand une information du futur s'infiltre involontairement dans les variables d'entraînement, on parle de ______ de données.", en: "When future information unintentionally seeps into the training variables, it's called data ______." }
        : { fr: "Tester de très nombreuses variantes d'une stratégie sur le même historique et ne garder que la meilleure, produisant une performance excellente par pur hasard, s'appelle le data ______.", en: "Testing very many strategy variants on the same history and keeping only the best, producing an excellent performance by pure chance, is called data ______." },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: variant === "leakage" ? ["fuite", "leakage"] : ["snooping", "espionnage"],
      hint: { fr: "Le même terme que dans le glossaire de la leçon.", en: "The same term as in the lesson's glossary." },
      explanation: variant === "leakage"
        ? { fr: "La fuite de données (data leakage) survient quand une variable d'entraînement contient, même indirectement, une information non disponible à la date réelle de la prédiction.", en: "Data leakage occurs when a training variable contains, even indirectly, information unavailable at the prediction's real date." }
        : { fr: "Le data snooping (ou p-hacking) désigne le risque de \"trouver\" une stratégie gagnante par pur hasard statistique en en testant un très grand nombre, sans aucun pouvoir prédictif réel.", en: "Data snooping (or p-hacking) denotes the risk of \"finding\" a winning strategy by pure statistical chance by testing a very large number of them, with no real predictive power." },
      commonMistake: {
        fr: "Confondre ce terme avec le simple surapprentissage d'un modèle unique, alors qu'il s'agit ici d'un biais de sélection à travers de multiples essais.",
        en: "Confusing this term with a single model's simple overfitting, when it's actually a selection bias across multiple trials.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [walkForwardTemplate, survivorshipBiasTemplate, benchmarkNumericTemplate, vocabTemplate];
