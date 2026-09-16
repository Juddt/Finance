import type { LessonContent } from "@/lib/lesson-types";

export const m12MethodologieMl: LessonContent = {
  conceptId: "m12-methodologie-ml",
  prerequisiteReminder: {
    text: {
      fr: "Il est plus facile de comprendre ces pièges méthodologiques en ayant déjà vu au moins un modèle (régression) et les séries temporelles.",
      en: "These methodological traps are easier to understand having already seen at least one model (regression) and time series.",
    },
    conceptIds: ["m12-regression-lineaire", "m12-series-temporelles"],
  },
  glossary: [
    { term: { fr: "Validation walk-forward", en: "Walk-forward validation" }, definition: { fr: "Une méthode de validation qui entraîne toujours sur le passé et teste sur une période future non vue, en faisant glisser la fenêtre d'entraînement/test dans le temps.", en: "A validation method that always trains on the past and tests on an unseen future period, sliding the train/test window forward in time." } },
    { term: { fr: "Biais de survivance", en: "Survivorship bias" }, definition: { fr: "Un biais qui survient quand seuls les actifs ou entreprises ayant \"survécu\" jusqu'à aujourd'hui sont inclus dans l'analyse, surestimant systématiquement la performance historique.", en: "A bias occurring when only assets or companies that \"survived\" until today are included in the analysis, systematically overstating historical performance." } },
  ],
  intuition: {
    fr: "Un modèle techniquement irréprochable évalué avec une méthodologie défaillante donne des résultats totalement trompeurs : en finance, la méthodologie de validation compte souvent plus que le choix du modèle lui-même, car les pièges les plus fréquents (fuite de données, biais de survivance) produisent des performances de backtest artificiellement excellentes qui s'effondrent en conditions réelles.",
    en: "A technically flawless model evaluated with a broken methodology gives completely misleading results: in finance, validation methodology often matters more than the model choice itself, since the most frequent traps (data leakage, survivorship bias) produce artificially excellent backtest performance that collapses under real conditions.",
  },
  definition: {
    fr: "Cette notion transversale s'applique à tous les modèles vus dans ce module (M12-1 à M12-6). Un découpage train/validation/test doit toujours respecter l'ordre chronologique en finance (jamais un k-fold aléatoire qui mélangerait passé et futur). La validation walk-forward (fenêtre glissante : entraîner sur [t0,t1], tester sur [t1,t2], puis avancer) simule fidèlement les conditions réelles de déploiement. La fuite de données (data leakage) survient quand une information du futur (même indirectement, via une variable calculée avec des données non disponibles à la date de la prédiction) s'infiltre dans les variables d'entraînement. Le biais de survivance gonfle artificiellement la performance d'un backtest en excluant les actifs ayant fait faillite ou disparu.",
    en: "This cross-cutting lesson applies to every model seen in this module (M12-1 to M12-6). A train/validation/test split must always respect chronological order in finance (never a random k-fold mixing past and future). Walk-forward validation (a sliding window: train on [t0,t1], test on [t1,t2], then advance) faithfully simulates real deployment conditions. Data leakage occurs when future information (even indirectly, via a variable computed with data unavailable at the prediction date) seeps into the training variables. Survivorship bias artificially inflates a backtest's performance by excluding assets that went bankrupt or disappeared.",
  },
  utility: {
    fr: "Quel problème résout cette méthodologie ? Éviter de se convaincre à tort qu'un modèle a un pouvoir prédictif réel, alors que sa performance apparente vient uniquement d'artefacts méthodologiques. Quand l'appliquer ? Systématiquement, pour tout modèle entraîné sur des données financières historiques, sans exception. Comment évaluer correctement ? Toujours comparer la performance du modèle à un benchmark naïf (par exemple, prédire la valeur d'hier, ou une stratégie buy-and-hold) : un modèle qui ne bat pas significativement ce benchmark n'apporte aucune valeur, même avec un R² ou une AUC qui semblent \"bons\" en absolu. Il faut aussi intégrer les coûts de transaction réels dans l'évaluation d'une stratégie, faute de quoi une stratégie apparemment rentable peut devenir perdante une fois les frais déduits.",
    en: "What problem does this methodology solve? Avoiding wrongly convincing oneself a model has real predictive power, when its apparent performance comes solely from methodological artifacts. When to apply it? Systematically, for every model trained on historical financial data, without exception. How to evaluate correctly? Always compare the model's performance to a naive benchmark (e.g., predicting yesterday's value, or a buy-and-hold strategy): a model that doesn't significantly beat this benchmark brings no value, even with an R² or AUC that look \"good\" in absolute terms. Real transaction costs must also be factored into a strategy's evaluation, or an apparently profitable strategy can turn into a loser once fees are deducted.",
  },
  example: {
    fr: "Un modèle de prédiction de rendement obtient un R² de 0,15 en validation croisée aléatoire standard (k-fold), un résultat qui semble excellent pour des données financières notoirement bruitées. Mais en réévaluant avec une validation walk-forward strictement chronologique, le R² s'effondre à -0,02 (pire qu'une prédiction constante) : le k-fold aléatoire avait laissé une variable du modèle (construite avec un indicateur technique calculé sur une fenêtre englobant des dates futures par erreur d'implémentation) \"voir\" indirectement le futur pendant l'entraînement — une fuite de données classique, invisible sans validation chronologique rigoureuse.",
    en: "A return-prediction model achieves an R² of 0.15 under standard random k-fold cross-validation, a result that looks excellent for notoriously noisy financial data. But re-evaluating with strictly chronological walk-forward validation, the R² collapses to -0.02 (worse than a constant prediction): the random k-fold had let one of the model's variables (built from a technical indicator computed over a window mistakenly spanning future dates due to an implementation bug) indirectly \"see\" the future during training — a classic data leak, invisible without rigorous chronological validation.",
  },
  alternativeExplanation: {
    fr: "Évaluer un modèle financier avec un k-fold aléatoire standard, c'est comme réviser un examen en ayant accès au corrigé pendant l'entraînement, puis se faire évaluer sur les mêmes questions : la note obtenue ne dit rien sur la vraie compréhension. La validation walk-forward, c'est réviser uniquement sur les cours déjà donnés, puis être interrogé sur un cours qui n'a pas encore eu lieu — la seule façon honnête de savoir si l'apprentissage a un sens.",
    en: "Evaluating a financial model with standard random k-fold is like revising for an exam with access to the answer key during study, then being tested on the same questions: the resulting grade says nothing about true understanding. Walk-forward validation means revising only on lessons already given, then being tested on a lesson that hasn't happened yet — the only honest way to know if the learning means anything.",
  },
  formula: {
    latex: "\\text{Skill} = \\frac{\\text{Performance}_{\\text{modèle}} - \\text{Performance}_{\\text{benchmark naïf}}}{\\sigma_{\\text{benchmark naïf}}}",
    variables: [
      { symbol: "\\text{Performance}_{\\text{benchmark naïf}}", description: { fr: "Performance d'une règle triviale (valeur d'hier, moyenne historique, buy-and-hold), le seuil minimal que le modèle doit dépasser", en: "A trivial rule's performance (yesterday's value, historical average, buy-and-hold), the minimum bar the model must clear" } },
      { symbol: "\\sigma_{\\text{benchmark naïf}}", description: { fr: "Variabilité de la performance du benchmark, pour juger si l'écart est significatif ou dans le bruit normal", en: "The benchmark's performance variability, to judge whether the gap is significant or within normal noise" } },
    ],
    assumptions: { fr: "Un \"skill score\" positif et significatif est nécessaire (pas suffisant) pour conclure qu'un modèle a un réel pouvoir prédictif au-delà du hasard.", en: "A positive, significant \"skill score\" is necessary (not sufficient) to conclude a model has real predictive power beyond chance." },
    units: { fr: "Sans dimension (ratio normalisé).", en: "Dimensionless (a normalized ratio)." },
    example: { fr: "Un modèle avec un skill score proche de 0 n'apporte rien par rapport au benchmark naïf, quelle que soit la sophistication apparente de son R² ou de son AUC pris isolément.", en: "A model with a skill score near 0 adds nothing over the naive benchmark, whatever its R² or AUC looks like in isolation." },
  },
  calculation: {
    fr: "1) Définir une fenêtre d'entraînement initiale et une fenêtre de test qui la suit immédiatement dans le temps. 2) Entraîner le modèle uniquement sur la fenêtre d'entraînement, évaluer sur la fenêtre de test. 3) Faire glisser les deux fenêtres vers l'avant dans le temps et répéter, en accumulant les performances sur plusieurs périodes de test successives. 4) Comparer la performance moyenne du modèle à celle d'un benchmark naïf calculé selon la même procédure walk-forward, et vérifier la robustesse après déduction des coûts de transaction réalistes.",
    en: "1) Define an initial training window and a test window immediately following it in time. 2) Train the model only on the training window, evaluate on the test window. 3) Slide both windows forward in time and repeat, accumulating performance across several successive test periods. 4) Compare the model's average performance to a naive benchmark computed via the same walk-forward procedure, and check robustness after deducting realistic transaction costs.",
  },
  pythonExample: {
    fr: `from sklearn.model_selection import TimeSeriesSplit

# TimeSeriesSplit respecte l'ordre chronologique : chaque test set
# suit strictement son train set correspondant dans le temps.
decoupage = TimeSeriesSplit(n_splits=5)

scores_modele, scores_benchmark = [], []
for idx_train, idx_test in decoupage.split(X):
    X_tr, X_te = X.iloc[idx_train], X.iloc[idx_test]
    y_tr, y_te = y.iloc[idx_train], y.iloc[idx_test]

    modele.fit(X_tr, y_tr)
    scores_modele.append(modele.score(X_te, y_te))

    prediction_naive = y_tr.mean()  # benchmark naïf : moyenne historique
    scores_benchmark.append(((y_te - prediction_naive) ** 2).mean())

print("Performance moyenne du modèle vs. benchmark naïf :", scores_modele, scores_benchmark)`,
    en: `from sklearn.model_selection import TimeSeriesSplit

# TimeSeriesSplit respects chronological order: each test set
# strictly follows its corresponding train set in time.
splitter = TimeSeriesSplit(n_splits=5)

model_scores, benchmark_scores = [], []
for train_idx, test_idx in splitter.split(X):
    X_tr, X_te = X.iloc[train_idx], X.iloc[test_idx]
    y_tr, y_te = y.iloc[train_idx], y.iloc[test_idx]

    model.fit(X_tr, y_tr)
    model_scores.append(model.score(X_te, y_te))

    naive_prediction = y_tr.mean()  # naive benchmark: historical average
    benchmark_scores.append(((y_te - naive_prediction) ** 2).mean())

print("Average model performance vs. naive benchmark:", model_scores, benchmark_scores)`,
  },
  interpretation: {
    fr: "Un modèle qui performe bien en k-fold aléatoire mais s'effondre en walk-forward chronologique signale presque toujours une fuite de données. Un modèle qui bat le benchmark naïf en walk-forward mais dont l'avantage disparaît après coûts de transaction n'a de valeur que théorique, pas opérationnelle. Un backtest sur un univers d'actifs \"survivants\" (par exemple, seulement les entreprises encore cotées aujourd'hui) surestime systématiquement la performance historique réelle qu'un investisseur aurait obtenue.",
    en: "A model that performs well under random k-fold but collapses under chronological walk-forward almost always signals data leakage. A model that beats the naive benchmark under walk-forward but whose edge disappears after transaction costs has only theoretical, not operational, value. A backtest on a \"surviving\" asset universe (e.g., only companies still listed today) systematically overstates the real historical performance an investor would have achieved.",
  },
  pitfalls: {
    fr: "Utiliser un k-fold aléatoire standard (la pratique par défaut en machine learning généraliste) sur des données financières chronologiques, ce qui laisse presque toujours filtrer une forme de fuite de données. Autre piège majeur : tester de très nombreuses variantes d'un modèle ou d'une stratégie sur le même historique et ne retenir que la meilleure (data snooping / p-hacking) — avec suffisamment d'essais, une performance excellente apparaît par pur hasard, sans aucun pouvoir prédictif réel. Enfin, ignorer les coûts de transaction et la liquidité réelle du marché peut transformer une stratégie \"gagnante\" sur le papier en stratégie perdante en pratique.",
    en: "Using standard random k-fold (the default practice in general-purpose machine learning) on chronological financial data, which almost always lets some form of data leakage through. Another major trap: testing very many variants of a model or strategy on the same history and keeping only the best one (data snooping / p-hacking) — with enough attempts, an excellent performance appears by pure chance, with no real predictive power. Finally, ignoring transaction costs and real market liquidity can turn a \"winning\" strategy on paper into a losing one in practice.",
  },
  keyPoints: {
    fr: [
      "La validation doit toujours être chronologique (walk-forward) en finance, jamais un k-fold aléatoire standard.",
      "Toute performance de modèle doit être comparée à un benchmark naïf et évaluée après coûts de transaction réalistes.",
      "Le biais de survivance et la fuite de données sont les deux pièges méthodologiques les plus fréquents et les plus trompeurs.",
    ],
    en: [
      "Validation must always be chronological (walk-forward) in finance, never standard random k-fold.",
      "Any model performance must be compared to a naive benchmark and evaluated after realistic transaction costs.",
      "Survivorship bias and data leakage are the two most frequent and most misleading methodological traps.",
    ],
  },
  advancedDemonstration: {
    fr: "Le risque de data snooping peut être quantifié : le ratio de Sharpe déflaté (deflated Sharpe ratio) ajuste un ratio de Sharpe observé en tenant compte explicitement du nombre d'essais effectués pendant la recherche de stratégie, de la variance des rendements et de leur asymétrie/kurtosis, afin d'estimer la probabilité que la performance observée soit un pur artefact statistique plutôt qu'un vrai signal — un outil essentiel pour toute équipe quantitative qui teste systématiquement de nombreuses variantes de modèles ou de stratégies avant d'en sélectionner une. Ce résultat illustre un principe plus général : en présence de multiples tests, le seuil de significativité statistique standard (p<0,05) devient trompeur et doit être ajusté (correction de Bonferroni ou équivalent) pour refléter le nombre réel de comparaisons effectuées.",
    en: "Data snooping risk can be quantified: the deflated Sharpe ratio adjusts an observed Sharpe ratio by explicitly accounting for the number of trials performed during strategy search, the returns' variance, and their skewness/kurtosis, to estimate the probability that the observed performance is a pure statistical artifact rather than a real signal — an essential tool for any quant team systematically testing many model or strategy variants before selecting one. This result illustrates a more general principle: under multiple testing, the standard statistical significance threshold (p<0.05) becomes misleading and must be adjusted (Bonferroni correction or equivalent) to reflect the real number of comparisons performed.",
  },
};
