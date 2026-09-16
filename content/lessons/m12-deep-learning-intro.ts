import type { LessonContent } from "@/lib/lesson-types";

export const m12DeepLearningIntro: LessonContent = {
  conceptId: "m12-deep-learning-intro",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les séries temporelles et KNN/SVM, pour situer le deep learning parmi les autres approches.",
      en: "You need to know time series and KNN/SVM, to place deep learning among the other approaches.",
    },
    conceptIds: ["m12-series-temporelles", "m12-knn-svm"],
  },
  glossary: [
    { term: { fr: "Rétropropagation (backpropagation)", en: "Backpropagation" }, definition: { fr: "L'algorithme qui calcule le gradient de la fonction de perte par rapport à chaque poids du réseau, couche par couche en partant de la sortie, pour permettre l'entraînement par descente de gradient.", en: "The algorithm computing the loss function's gradient with respect to each weight in the network, layer by layer starting from the output, enabling training via gradient descent." } },
    { term: { fr: "Modèle séquentiel (RNN/LSTM)", en: "Sequential model (RNN/LSTM)" }, definition: { fr: "Une architecture de réseau conçue pour traiter des séquences ordonnées (comme une série temporelle), en conservant une mémoire interne des observations précédentes.", en: "A network architecture designed to process ordered sequences (like a time series), keeping an internal memory of previous observations." } },
  ],
  intuition: {
    fr: "Un réseau de neurones empile plusieurs couches de combinaisons linéaires suivies de fonctions non-linéaires (activations), ce qui lui permet en théorie d'approximer des fonctions arbitrairement complexes — au prix d'avoir besoin de beaucoup plus de données et de perdre l'interprétabilité directe des modèles vus jusqu'ici.",
    en: "A neural network stacks several layers of linear combinations followed by non-linear functions (activations), which in theory lets it approximate arbitrarily complex functions — at the cost of needing much more data and losing the direct interpretability of the models seen so far.",
  },
  definition: {
    fr: "Quel problème ? Approximer des fonctions très complexes et non-linéaires, en particulier pour des données non structurées (texte, image, séquences longues) où les modèles précédents (M12-1 à M12-5) atteignent leurs limites. Quand l'utiliser ? Quand on dispose de beaucoup de données et que les relations sont trop complexes pour une régression, un arbre ou un SVM. Quand l'éviter ? En finance de marché, très souvent : les données sont relativement rares (des décennies d'historique restent \"peu\" de données comparé à la vision par ordinateur), le signal est bruité, et l'interprétabilité est souvent exigée par la régulation ou la gestion des risques — un modèle plus simple, correctement validé, est souvent préférable. Un réseau feedforward calcule une sortie par composition de couches a = f(Wx+b) ; l'entraînement ajuste les poids W par descente de gradient, le gradient de chaque couche étant calculé par rétropropagation. Pour des séquences temporelles, des architectures récurrentes (RNN, LSTM) conservent un état interne d'une observation à l'autre.",
    en: "What problem? Approximating very complex, non-linear functions, particularly for unstructured data (text, images, long sequences) where the previous models (M12-1 to M12-5) reach their limits. When to use it? When plenty of data is available and relationships are too complex for a regression, a tree or an SVM. When to avoid it? Very often in market finance: data is relatively scarce (decades of history remain \"little\" data compared to computer vision), the signal is noisy, and interpretability is often required by regulation or risk management — a simpler, properly validated model is often preferable. A feedforward network computes an output by composing layers a = f(Wx+b); training adjusts weights W via gradient descent, with each layer's gradient computed by backpropagation. For temporal sequences, recurrent architectures (RNN, LSTM) keep an internal state from one observation to the next.",
  },
  utility: {
    fr: "Quelles données/sortie ? Idéalement de grands volumes de données (des dizaines de milliers d'observations au minimum), en entrée comme en sortie potentiellement des structures complexes (séquences, texte). Comment l'entraîner/évaluer ? Optimiser les poids par descente de gradient stochastique sur de nombreuses époques, avec des techniques de régularisation spécifiques (dropout, arrêt anticipé) pour limiter le surapprentissage ; évaluer avec les mêmes principes de séparation train/test que les autres modèles, mais avec une vigilance accrue car un réseau profond peut mémoriser des jeux de données de taille modeste. Pourquoi (ou pourquoi pas) ce modèle ? Sa flexibilité est à la fois sa force et son principal risque en finance : elle permet de capturer des motifs complexes, mais aussi de \"halluciner\" des motifs qui ne sont que du bruit historique.",
    en: "What data/output? Ideally large data volumes (tens of thousands of observations at minimum), potentially complex structures (sequences, text) as input or output. How to train/evaluate it? Optimize weights via stochastic gradient descent over many epochs, with specific regularization techniques (dropout, early stopping) to limit overfitting; evaluate with the same train/test separation principles as other models, but with heightened vigilance since a deep network can memorize modestly sized datasets. Why (or why not) this model? Its flexibility is both its strength and its main risk in finance: it can capture complex patterns, but also \"hallucinate\" patterns that are just historical noise.",
  },
  example: {
    fr: "Utiliser un LSTM pour tenter de modéliser une séquence de rendements en tenant compte de dépendances de plus long terme qu'un simple AR(1) (M12-4) : le modèle peut en théorie capturer des motifs plus riches, mais sur des rendements financiers (proches d'une marche aléatoire, à faible ratio signal/bruit), le risque est élevé que le réseau \"apprenne\" surtout du bruit historique sans aucun pouvoir prédictif réel hors échantillon — d'où l'importance capitale de la méthodologie de validation (M12-cross) pour un modèle aussi flexible.",
    en: "Using an LSTM to try modeling a sequence of returns while accounting for longer-term dependencies than a simple AR(1) (M12-4): the model can in theory capture richer patterns, but on financial returns (close to a random walk, low signal-to-noise ratio), there's a high risk the network mostly \"learns\" historical noise with no real out-of-sample predictive power — hence the critical importance of validation methodology (M12-cross) for such a flexible model.",
  },
  alternativeExplanation: {
    fr: "Un réseau de neurones profond est comme un très grand nombre de curseurs interconnectés en cascade (contrairement au seul niveau de curseurs de la régression linéaire) : cette flexibilité supplémentaire lui permet en théorie d'approcher n'importe quelle forme de relation, mais elle rend aussi beaucoup plus facile de \"régler\" les curseurs pour coller parfaitement au bruit des données d'entraînement plutôt qu'au vrai signal sous-jacent — un peu comme un tailleur avec trop de degrés de liberté qui finit par coudre un vêtement qui ne va qu'à un seul mannequin très particulier.",
    en: "A deep neural network is like a very large number of interconnected sliders cascaded together (unlike linear regression's single layer of sliders): this extra flexibility lets it in theory approximate any shape of relationship, but it also makes it much easier to \"tune\" the sliders to fit the training data's noise perfectly rather than the true underlying signal — a bit like a tailor with too many degrees of freedom who ends up sewing a garment that only fits one very particular mannequin.",
  },
  formula: {
    latex: "a^{(l)} = f\\left(W^{(l)} a^{(l-1)} + b^{(l)}\\right), \\quad W \\leftarrow W - \\eta \\nabla_W \\mathcal{L}",
    variables: [
      { symbol: "f", description: { fr: "Fonction d'activation non-linéaire (ReLU, sigmoïde, tanh...), sans laquelle empiler des couches resterait équivalent à une seule couche linéaire", en: "Non-linear activation function (ReLU, sigmoid, tanh...), without which stacking layers would remain equivalent to a single linear layer" } },
      { symbol: "\\eta", description: { fr: "Taux d'apprentissage (learning rate), qui contrôle la taille des pas de la descente de gradient", en: "Learning rate, controlling the gradient descent's step size" } },
    ],
    assumptions: { fr: "Réseau feedforward simple ; les architectures récurrentes (RNN/LSTM) ajoutent une dépendance à l'état de la couche à la date précédente.", en: "Simple feedforward network; recurrent architectures (RNN/LSTM) add a dependency on the layer's state at the previous date." },
    units: { fr: "Sans dimension pour les poids ; dépend des données en entrée/sortie.", en: "Dimensionless for the weights; depends on the input/output data." },
    example: { fr: "Sans fonction d'activation non-linéaire f, la composition de plusieurs couches linéaires resterait mathématiquement équivalente à une seule couche linéaire — c'est la non-linéarité qui donne au réseau sa puissance d'approximation.", en: "Without a non-linear activation function f, composing several linear layers would remain mathematically equivalent to a single linear layer — it's the non-linearity that gives the network its approximation power." },
  },
  calculation: {
    fr: "1) Normaliser les données en entrée (indispensable pour la stabilité de l'entraînement). 2) Choisir une architecture (nombre de couches, de neurones par couche, fonction d'activation). 3) Entraîner par descente de gradient stochastique sur plusieurs époques, en surveillant la perte sur un jeu de validation séparé pour détecter le surapprentissage (arrêt anticipé si la perte de validation cesse de baisser). 4) Comparer systématiquement à un modèle plus simple (régression, forêt aléatoire) : si le gain de performance ne justifie pas la perte d'interprétabilité et le risque de surapprentissage, préférer le modèle simple.",
    en: "1) Normalize the input data (essential for training stability). 2) Choose an architecture (number of layers, neurons per layer, activation function). 3) Train via stochastic gradient descent over several epochs, monitoring loss on a separate validation set to detect overfitting (early stopping if validation loss stops decreasing). 4) Systematically compare to a simpler model (regression, random forest): if the performance gain doesn't justify the loss of interpretability and overfitting risk, prefer the simple model.",
  },
  pythonExample: {
    fr: `from tensorflow import keras

# Un petit réseau feedforward : 2 couches cachées, sortie = probabilité binaire
modele = keras.Sequential([
    keras.layers.Dense(16, activation="relu", input_shape=(X_train.shape[1],)),
    keras.layers.Dropout(0.3),  # régularisation contre le surapprentissage
    keras.layers.Dense(8, activation="relu"),
    keras.layers.Dense(1, activation="sigmoid"),
])
modele.compile(optimizer="adam", loss="binary_crossentropy", metrics=["AUC"])

arret_anticipe = keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)
modele.fit(X_train, y_train, validation_split=0.2, epochs=100, callbacks=[arret_anticipe])`,
    en: `from tensorflow import keras

# A small feedforward network: 2 hidden layers, output = binary probability
model = keras.Sequential([
    keras.layers.Dense(16, activation="relu", input_shape=(X_train.shape[1],)),
    keras.layers.Dropout(0.3),  # regularization against overfitting
    keras.layers.Dense(8, activation="relu"),
    keras.layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["AUC"])

early_stopping = keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)
model.fit(X_train, y_train, validation_split=0.2, epochs=100, callbacks=[early_stopping])`,
  },
  interpretation: {
    fr: "Un écart croissant entre la perte d'entraînement (qui continue de baisser) et la perte de validation (qui remonte) est le signal classique de surapprentissage, et doit déclencher un arrêt anticipé ou un renforcement de la régularisation. Un réseau qui ne bat pas significativement un modèle plus simple (régression, forêt aléatoire) sur le jeu de test n'apporte aucune valeur ajoutée réelle, malgré sa complexité supérieure.",
    en: "A growing gap between training loss (which keeps decreasing) and validation loss (which rises again) is the classic overfitting signal, and should trigger early stopping or stronger regularization. A network that doesn't significantly beat a simpler model (regression, random forest) on the test set brings no real added value, despite its greater complexity.",
  },
  pitfalls: {
    fr: "Utiliser un réseau profond par défaut, \"parce que c'est plus moderne\", sans avoir d'abord établi qu'un modèle plus simple est insuffisant — en finance de marché, la simplicité est souvent préférable, faute de données suffisantes pour justifier la flexibilité additionnelle. Autre piège : sous-estimer le besoin en données d'un réseau profond, qui peut mémoriser un petit jeu de données (quelques milliers d'observations) sans jamais généraliser correctement, contrairement à une régression régularisée qui reste raisonnable même avec peu de données.",
    en: "Using a deep network by default, \"because it's more modern\", without first establishing that a simpler model is insufficient — in market finance, simplicity is often preferable, for lack of enough data to justify the added flexibility. Another trap: underestimating a deep network's data requirements, which can memorize a small dataset (a few thousand observations) without ever generalizing correctly, unlike a regularized regression which stays reasonable even with little data.",
  },
  keyPoints: {
    fr: [
      "Un réseau de neurones empile des couches linéaires et des activations non-linéaires, entraînées par rétropropagation et descente de gradient.",
      "Sa flexibilité nécessite beaucoup de données ; en finance de marché, elle est souvent un handicap plutôt qu'un avantage face à des modèles plus simples.",
      "Toujours comparer à un modèle simple : la complexité doit se justifier par un gain de performance réel, pas supposé.",
    ],
    en: [
      "A neural network stacks linear layers and non-linear activations, trained via backpropagation and gradient descent.",
      "Its flexibility requires lots of data; in market finance, it's often a handicap rather than an advantage over simpler models.",
      "Always compare to a simple model: complexity must be justified by a real, not assumed, performance gain.",
    ],
  },
  advancedDemonstration: {
    fr: "Le théorème d'approximation universelle garantit qu'un réseau avec une seule couche cachée suffisamment large peut approximer arbitrairement bien n'importe quelle fonction continue sur un domaine borné — mais ce résultat théorique ne dit rien sur le nombre de données nécessaires pour effectivement apprendre cette approximation, ni sur la difficulté pratique de l'optimisation (minima locaux, gradients qui s'annulent dans les réseaux récurrents profonds, motivant l'architecture LSTM avec ses portes qui régulent explicitement le flux d'information dans le temps). En pratique, la théorie de l'apprentissage statistique enseigne que la complexité d'un modèle doit être mise en balance avec la quantité de données disponibles (dimension de Vapnik-Chervonenkis), ce qui explique pourquoi les modèles plus simples des notions précédentes restent souvent préférables sur des données financières relativement rares et bruitées.",
    en: "The universal approximation theorem guarantees that a network with a single, sufficiently wide hidden layer can approximate any continuous function on a bounded domain arbitrarily well — but this theoretical result says nothing about how much data is needed to actually learn that approximation, nor about the practical difficulty of optimization (local minima, vanishing gradients in deep recurrent networks, motivating the LSTM architecture with its gates explicitly regulating information flow over time). In practice, statistical learning theory teaches that a model's complexity must be balanced against the amount of available data (Vapnik-Chervonenkis dimension), which explains why the simpler models from the previous lessons often remain preferable on relatively scarce, noisy financial data.",
  },
};
