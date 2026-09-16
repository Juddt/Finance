import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const overfittingGapTemplate: QuestionTemplate = {
  id: "m12-deep-learning-ecart-surapprentissage",
  conceptId: "m12-deep-learning-intro",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pendant l'entraînement, la perte d'entraînement continue de baisser mais la perte de validation recommence à augmenter. Que faut-il faire ?",
      en: "During training, the training loss keeps decreasing but the validation loss starts increasing again. What should be done?",
    },
    choices: buildChoices([
      { id: "early-stop", label: { fr: "Arrêter l'entraînement (arrêt anticipé) ou renforcer la régularisation", en: "Stop training (early stopping) or strengthen regularization" } },
      { id: "more-epochs", label: { fr: "Continuer l'entraînement plus longtemps pour laisser le modèle converger", en: "Keep training longer to let the model converge" } },
    ]),
    hint: { fr: "Un écart croissant entre perte d'entraînement et perte de validation est le signal classique du surapprentissage.", en: "A growing gap between training loss and validation loss is the classic overfitting signal." },
    correctChoiceIds: ["early-stop"],
    explanation: {
      fr: "Cet écart croissant est le signal classique de surapprentissage : le réseau continue d'améliorer sa performance sur les données d'entraînement (y compris leur bruit) au détriment de sa généralisation. Il faut arrêter l'entraînement (arrêt anticipé) ou renforcer la régularisation (dropout, etc.).",
      en: "This growing gap is the classic overfitting signal: the network keeps improving its performance on the training data (including its noise) at the expense of generalization. Training should be stopped (early stopping) or regularization strengthened (dropout, etc.).",
    },
    commonMistake: {
      fr: "Continuer l'entraînement en pensant que la performance va nécessairement s'améliorer avec plus d'époques.",
      en: "Continuing training assuming performance will necessarily improve with more epochs.",
    },
  }),
};

const whenToAvoidTemplate: QuestionTemplate = {
  id: "m12-deep-learning-quand-eviter",
  conceptId: "m12-deep-learning-intro",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "En finance de marché, un réseau de neurones profond est presque toujours préférable à un modèle plus simple (régression, forêt aléatoire), grâce à sa flexibilité supérieure.",
      en: "In market finance, a deep neural network is almost always preferable to a simpler model (regression, random forest), thanks to its superior flexibility.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : en finance de marché, les données sont relativement rares et bruitées, ce qui favorise souvent des modèles plus simples. La flexibilité supérieure d'un réseau profond nécessite beaucoup de données pour être exploitée sans surapprentissage.",
      en: "False: in market finance, data is relatively scarce and noisy, which often favors simpler models. A deep network's superior flexibility requires lots of data to be exploited without overfitting.",
    },
    commonMistake: {
      fr: "Supposer qu'un modèle plus \"moderne\" ou plus complexe est automatiquement plus performant.",
      en: "Assuming a more \"modern\" or more complex model is automatically better performing.",
    },
  }),
};

const activationNumericTemplate: QuestionTemplate = {
  id: "m12-deep-learning-activation-neurone",
  conceptId: "m12-deep-learning-intro",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const w1 = randomInt(rng, -5, 5);
    const w2 = randomInt(rng, -5, 5);
    const x1 = randomInt(rng, 1, 5);
    const x2 = randomInt(rng, 1, 5);
    const b = randomInt(rng, -3, 3);
    const z = w1 * x1 + w2 * x2 + b;
    const relu = Math.max(0, z);

    return {
      isScenario: true,
      prompt: {
        fr: `Un neurone calcule z = ${w1}×${x1} + ${w2}×${x2} + (${b}), puis applique une activation ReLU. Quelle est sa sortie ?`,
        en: `A neuron computes z = ${w1}×${x1} + ${w2}×${x2} + (${b}), then applies a ReLU activation. What is its output?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.5",
      hint: { fr: "ReLU(z) = max(0, z).", en: "ReLU(z) = max(0, z)." },
      numeric: { value: relu, tolerance: 0.5 },
      calculation: {
        fr: `z = ${w1}×${x1} + ${w2}×${x2} + (${b}) = ${z}. ReLU(${z}) = max(0, ${z}) = ${relu}.`,
        en: `z = ${w1}×${x1} + ${w2}×${x2} + (${b}) = ${z}. ReLU(${z}) = max(0, ${z}) = ${relu}.`,
      },
      explanation: {
        fr: "ReLU (Rectified Linear Unit) annule toute valeur négative et laisse passer les valeurs positives inchangées — l'une des fonctions d'activation les plus utilisées en pratique.",
        en: "ReLU (Rectified Linear Unit) zeroes out any negative value and passes positive values through unchanged — one of the most widely used activation functions in practice.",
      },
      commonMistake: {
        fr: "Oublier d'appliquer l'activation après le calcul de z, ou appliquer ReLU alors que z est déjà positif (le résultat reste alors inchangé, mais il faut le vérifier).",
        en: "Forgetting to apply the activation after computing z, or misapplying ReLU when z is already positive (the result stays unchanged, but it must be checked).",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m12-deep-learning-vocab",
  conceptId: "m12-deep-learning-intro",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'algorithme qui calcule le gradient de la perte par rapport à chaque poids, couche par couche en partant de la sortie, s'appelle la ______.",
      en: "The algorithm computing the loss's gradient with respect to each weight, layer by layer starting from the output, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un terme", en: "one term" },
    acceptedAnswers: ["retropropagation", "rétropropagation", "backpropagation"],
    hint: { fr: "Le gradient se propage \"en arrière\", de la sortie vers l'entrée.", en: "The gradient propagates \"backward\", from output to input." },
    explanation: {
      fr: "La rétropropagation (backpropagation) calcule efficacement le gradient de la fonction de perte par rapport à chaque poids du réseau, permettant l'entraînement par descente de gradient.",
      en: "Backpropagation efficiently computes the loss function's gradient with respect to each weight in the network, enabling training via gradient descent.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec la descente de gradient elle-même, qui est l'algorithme d'optimisation utilisant le gradient calculé par rétropropagation.",
      en: "Confusing this term with gradient descent itself, the optimization algorithm using the gradient computed by backpropagation.",
    },
  }),
};

export const templates: QuestionTemplate[] = [overfittingGapTemplate, whenToAvoidTemplate, activationNumericTemplate, vocabTemplate];
