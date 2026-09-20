import type { LessonContent } from "@/lib/lesson-types";

export const m12SeriesTemporelles: LessonContent = {
  conceptId: "m12-series-temporelles",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la volatilité réalisée et la notion de clustering de volatilité.",
      en: "You need to know realized volatility and the concept of volatility clustering.",
    },
    conceptIds: ["m08-volatilite-realisee"],
  },
  glossary: [
    { term: { fr: "Stationnarité", en: "Stationarity" }, definition: { fr: "La propriété qu'une série temporelle ait des propriétés statistiques (moyenne, variance) stables dans le temps, une hypothèse nécessaire pour la plupart des modèles classiques de séries temporelles.", en: "The property that a time series has statistical characteristics (mean, variance) stable over time, an assumption needed by most classic time series models." } },
    { term: { fr: "Clustering de volatilité", en: "Volatility clustering" }, definition: { fr: "Le phénomène observé sur les marchés où les périodes de forte volatilité ont tendance à se regrouper dans le temps, plutôt que d'être distribuées uniformément.", en: "The observed market phenomenon where periods of high volatility tend to cluster together in time, rather than being uniformly distributed." } },
  ],
  intuition: {
    fr: "Contrairement aux modèles vus jusqu'ici qui supposent des observations indépendantes, une série temporelle financière (prix, rendements, volatilité) a une dépendance intrinsèque au temps : la valeur d'aujourd'hui dépend de celle d'hier, et la volatilité d'aujourd'hui dépend de la volatilité récente — ignorer cette structure temporelle, c'est jeter une information essentielle.",
    en: "Unlike the models seen so far, which assume independent observations, a financial time series (price, returns, volatility) has an intrinsic dependence on time: today's value depends on yesterday's, and today's volatility depends on recent volatility — ignoring this temporal structure means discarding essential information.",
  },
  definition: {
    fr: "Quel problème ? Modéliser une grandeur qui évolue dans le temps avec une dépendance entre observations successives (autocorrélation), et souvent une volatilité elle-même variable dans le temps. Quand l'utiliser ? Pour des données ordonnées chronologiquement où l'ordre temporel porte de l'information (rendements, taux, volumes). Quand l'éviter ? Si la série n'est manifestement pas stationnaire sans transformation adaptée (différenciation), ou si l'hypothèse de dépendance temporelle n'a pas de sens pour les données. Un modèle AR(p) exprime la valeur actuelle comme combinaison linéaire des p valeurs passées plus un bruit ; ARIMA ajoute une différenciation (pour rendre une série non-stationnaire stationnaire) et des termes de moyenne mobile ; GARCH modélise spécifiquement la variance conditionnelle, capturant le clustering de volatilité que Black-Scholes (volatilité constante, M06-4) ignore par construction.",
    en: "What problem? Modeling a quantity that evolves over time with dependence between successive observations (autocorrelation), and often a volatility that is itself time-varying. When to use it? For chronologically ordered data where temporal order carries information (returns, rates, volumes). When to avoid it? If the series is clearly non-stationary without proper transformation (differencing), or if the temporal dependence assumption doesn't make sense for the data. An AR(p) model expresses the current value as a linear combination of the p past values plus noise; ARIMA adds differencing (to make a non-stationary series stationary) and moving-average terms; GARCH specifically models the conditional variance, capturing the volatility clustering that Black-Scholes (constant volatility, M06-4) ignores by construction.",
  },
  utility: {
    fr: "Quelles données/sortie ? Une série ordonnée chronologiquement en entrée, une prévision du prochain point (ou de sa variance) en sortie. Comment l'entraîner/évaluer ? Ajuster les paramètres par maximum de vraisemblance, évaluer via une validation chronologique (jamais un simple k-fold aléatoire, voir M12-cross) qui respecte l'ordre temporel. Pourquoi ce modèle ? Contrairement à un modèle de machine learning générique qui traite chaque observation comme indépendante, ces modèles économétriques encodent explicitement la dépendance temporelle, ce qui est souvent indispensable pour des données financières.",
    en: "What data/output? A chronologically ordered series as input, a forecast of the next point (or its variance) as output. How to train/evaluate it? Fit parameters by maximum likelihood, evaluate via chronological validation (never a plain random k-fold, see M12-cross) that respects temporal order. Why this model? Unlike a generic machine learning model treating each observation as independent, these econometric models explicitly encode temporal dependence, often essential for financial data.",
  },
  example: {
    fr: "Un GARCH(1,1) calibré avec ω=0,00001, α=0,08, β=0,90 a une variance de long terme ω/(1−α−β)=0,00001/0,02=0,0005, soit σ_long-terme=√0,0005≈2,24%. La veille, la volatilité était à ce niveau de long terme (σ_{t-1}=2,24%, σ_{t-1}²=0,0005). Un choc de marché survient : le rendement du jour est de −6% (ε_{t-1}²=0,0036). La nouvelle variance prédite est σ_t²=0,00001+0,08×0,0036+0,90×0,0005=0,00001+0,000288+0,00045=0,000748, soit σ_t=√0,000748≈2,73% : la volatilité prédite pour le lendemain bondit de 2,24% à 2,73% après ce seul choc, puis décroîtra progressivement vers 2,24% si plus aucun choc ne survient — c'est le clustering de volatilité qu'un modèle à volatilité constante ne capture jamais.",
    en: "A GARCH(1,1) calibrated with ω=0.00001, α=0.08, β=0.90 has a long-run variance of ω/(1−α−β)=0.00001/0.02=0.0005, i.e. σ_long-run=√0.0005≈2.24%. The day before, volatility was at this long-run level (σ_{t-1}=2.24%, σ_{t-1}²=0.0005). A market shock hits: the day's return is −6% (ε_{t-1}²=0.0036). The newly predicted variance is σ_t²=0.00001+0.08×0.0036+0.90×0.0005=0.00001+0.000288+0.00045=0.000748, i.e. σ_t=√0.000748≈2.73%: the volatility predicted for the next day jumps from 2.24% to 2.73% after this single shock, then would gradually decay back toward 2.24% absent any further shock — this is the volatility clustering a constant-volatility model never captures.",
  },
  alternativeExplanation: {
    fr: "Un modèle AR ressemble à prédire la météo de demain principalement à partir de celle d'aujourd'hui (\"il a plu aujourd'hui, donc il pleuvra probablement encore un peu demain\") ; un GARCH, lui, prédit non pas la météo elle-même mais son \"agitation\" (la variabilité) : après une tempête, on s'attend à une météo encore agitée les jours suivants, même si on ne sait pas exactement s'il pleuvra ou non.",
    en: "An AR model resembles predicting tomorrow's weather mostly from today's (\"it rained today, so it will probably still rain a bit tomorrow\"); a GARCH model, however, predicts not the weather itself but its \"turbulence\" (variability): after a storm, one expects the weather to stay turbulent over the following days, even without knowing exactly whether it will rain or not.",
  },
  formula: {
    latex: "\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2",
    variables: [
      { symbol: "\\sigma_t^2", description: { fr: "Variance conditionnelle (prévue) à la date t", en: "Conditional (forecast) variance at date t" } },
      { symbol: "\\alpha, \\beta", description: { fr: "Poids du choc récent (α) et de la variance récente (β) ; α+β proche de 1 indique une forte persistance du clustering de volatilité", en: "Weights on the recent shock (α) and recent variance (β); α+β close to 1 indicates strong volatility-clustering persistence" } },
    ],
    assumptions: { fr: "GARCH(1,1), la spécification la plus courante ; suppose que la variance dépend uniquement du choc et de la variance de la période précédente.", en: "GARCH(1,1), the most common specification; assumes variance depends only on the previous period's shock and variance." },
    units: { fr: "Variance (carré du rendement).", en: "Variance (squared return)." },
    example: { fr: "ω=0,00001, α=0,08, β=0,90, variance long terme=0,0005 (σ≈2,24%). Choc ε_{t-1}=−6% (ε²=0,0036), σ_{t-1}=2,24% → σ_t²=0,00001+0,08×0,0036+0,90×0,0005=0,000748, σ_t≈2,73%.", en: "ω=0.00001, α=0.08, β=0.90, long-run variance=0.0005 (σ≈2.24%). Shock ε_{t-1}=−6% (ε²=0.0036), σ_{t-1}=2.24% → σ_t²=0.00001+0.08×0.0036+0.90×0.0005=0.000748, σ_t≈2.73%." },
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Jour de trading", en: "Trading day" },
    yLabel: { fr: "|Rendement quotidien| (%)", en: "|Daily return| (%)" },
    series: [
      {
        label: { fr: "Clustering de volatilité observé", en: "Observed volatility clustering" },
        points: [
          { x: 1, y: 0.8 },
          { x: 2, y: 0.6 },
          { x: 3, y: 0.9 },
          { x: 4, y: 0.7 },
          { x: 5, y: 3.5 },
          { x: 6, y: 4.2 },
          { x: 7, y: 3.8 },
          { x: 8, y: 2.9 },
          { x: 9, y: 1.5 },
          { x: 10, y: 0.9 },
          { x: 11, y: 0.7 },
          { x: 12, y: 0.8 },
          { x: 13, y: 0.6 },
          { x: 14, y: 0.9 },
        ],
      },
    ],
  },
  calculation: {
    fr: "1) Vérifier la stationnarité de la série (test de racine unitaire) ; différencier si nécessaire (ARIMA). 2) Ajuster les paramètres du modèle (AR/ARIMA sur la série elle-même, GARCH sur les résidus/rendements) par maximum de vraisemblance : ici ω=0,00001, α=0,08, β=0,90. 3) Valider chronologiquement : entraîner sur le passé, tester sur une période future jamais vue, jamais mélanger les dates. 4) Comparer à un modèle naïf (par exemple, volatilité constante égale à la moyenne historique) pour vérifier que la complexité additionnelle apporte un vrai gain prédictif : ici, après un choc de −6%, le GARCH prédit 2,73% contre 2,24% pour un modèle naïf à volatilité constante — une différence significative le jour suivant un choc.",
    en: "1) Check the series' stationarity (unit root test); difference if needed (ARIMA). 2) Fit the model's parameters (AR/ARIMA on the series itself, GARCH on residuals/returns) by maximum likelihood: here ω=0.00001, α=0.08, β=0.90. 3) Validate chronologically: train on the past, test on a future period never seen, never mix dates. 4) Compare to a naive model (e.g., constant volatility equal to the historical average) to check the added complexity brings a real predictive gain: here, after a −6% shock, the GARCH model predicts 2.73% versus 2.24% for a naive constant-volatility model — a significant difference the day after a shock.",
  },
  pythonExample: {
    fr: `from arch import arch_model

# rendements : série de rendements quotidiens en %
modele = arch_model(rendements, vol="Garch", p=1, q=1, dist="normal")
resultat = modele.fit(disp="off")
print(resultat.params)  # oméga, alpha, bêta estimés

# Prévision de la volatilité pour les 5 prochains jours
prevision = resultat.forecast(horizon=5)
print(prevision.variance.iloc[-1])`,
    en: `from arch import arch_model

# returns: series of daily returns in %
model = arch_model(returns, vol="Garch", p=1, q=1, dist="normal")
result = model.fit(disp="off")
print(result.params)  # estimated omega, alpha, beta

# Forecast volatility for the next 5 days
forecast = result.forecast(horizon=5)
print(forecast.variance.iloc[-1])`,
  },
  interpretation: {
    fr: "Une somme α+β proche de 1 indique que les chocs de volatilité ont un effet très persistant (la volatilité met longtemps à revenir à son niveau de long terme) ; une somme nettement inférieure à 1 indique un retour rapide à la normale. Un modèle AR/ARIMA avec des coefficients proches de zéro indique une faible prévisibilité à partir du seul passé de la série — un résultat courant et attendu pour les rendements financiers (proches d'une marche aléatoire), contrairement à la volatilité qui est nettement plus prévisible.",
    en: "A sum α+β close to 1 indicates volatility shocks have a very persistent effect (volatility takes a long time to return to its long-run level); a sum well below 1 indicates a fast return to normal. An AR/ARIMA model with coefficients close to zero indicates weak predictability from the series' own past alone — a common and expected result for financial returns (close to a random walk), unlike volatility, which is noticeably more predictable.",
  },
  pitfalls: {
    fr: "Appliquer une validation croisée k-fold aléatoire standard à une série temporelle : cela mélange passé et futur, laissant le modèle \"apprendre\" avec des informations qu'il n'aurait jamais eues en situation réelle (fuite de données temporelle), voir M12-cross. Autre piège : confondre prévisibilité du niveau (rendements, généralement proches d'une marche aléatoire, donc peu prévisibles) et prévisibilité de la volatilité (nettement plus persistante et donc plus prévisible) — ce sont deux questions différentes.",
    en: "Applying standard random k-fold cross-validation to a time series: this mixes past and future, letting the model \"learn\" with information it would never have had in real conditions (temporal data leakage), see M12-cross. Another trap: confusing level predictability (returns, generally close to a random walk, so weakly predictable) with volatility predictability (noticeably more persistent, and so more predictable) — these are two different questions.",
  },
  keyPoints: {
    fr: [
      "AR/ARIMA modélisent la dépendance temporelle du niveau d'une série ; GARCH modélise celle de sa variance (clustering de volatilité).",
      "La stationnarité est une hypothèse nécessaire, souvent obtenue par différenciation (le \"I\" d'ARIMA).",
      "La validation doit toujours être chronologique, jamais un k-fold aléatoire standard.",
    ],
    en: [
      "AR/ARIMA model a series' level's temporal dependence; GARCH models its variance's (volatility clustering).",
      "Stationarity is a necessary assumption, often achieved via differencing (ARIMA's \"I\").",
      "Validation must always be chronological, never a standard random k-fold.",
    ],
  },
  advancedDemonstration: {
    fr: "GARCH(1,1) peut se réécrire comme un processus ARMA(1,1) sur le carré des résidus, ce qui explique pourquoi α+β détermine la vitesse de retour à la variance de long terme ω/(1−α−β) exactement comme la persistance d'un processus AR standard détermine la vitesse de retour à la moyenne — un lien mathématique direct entre les deux familles de modèles vues dans cette notion. Sur le plan économétrique versus machine learning : ARIMA/GARCH sont des modèles paramétriques avec une interprétation statistique précise de chaque coefficient, tandis qu'une approche ML (par exemple un LSTM, M12-6) apprend une fonction plus flexible mais moins interprétable — un arbitrage classique entre interprétabilité et flexibilité.",
    en: "GARCH(1,1) can be rewritten as an ARMA(1,1) process on the squared residuals, which explains why α+β determines the speed of reversion to the long-run variance ω/(1−α−β) exactly as a standard AR process's persistence determines its speed of mean reversion — a direct mathematical link between the two model families seen in this lesson. On econometrics versus machine learning: ARIMA/GARCH are parametric models with a precise statistical interpretation for each coefficient, while an ML approach (e.g. an LSTM, M12-6) learns a more flexible but less interpretable function — a classic trade-off between interpretability and flexibility.",
  },
  businessApplication: {
    fr: "Un desk de gestion des risques recalibre quotidiennement un GARCH sur chaque facteur de risque pour produire une VaR conditionnelle (qui réagit immédiatement après un choc de marché), plutôt qu'une VaR basée sur une volatilité historique constante qui réagirait avec retard — une différence cruciale les jours suivant un choc, où le risque réel du portefeuille peut être significativement sous-estimé par un modèle qui ignore le clustering.",
    en: "A risk management desk recalibrates a GARCH model daily on each risk factor to produce a conditional VaR (which reacts immediately after a market shock), rather than a VaR based on a constant historical volatility that would react with a lag — a crucial difference in the days following a shock, when the portfolio's real risk can be significantly underestimated by a model ignoring clustering.",
  },
  interviewQuestion: {
    question: "You calibrate a GARCH(1,1) model and get α=0.08, β=0.90. What does that tell you, and how would you use it after a large market move?",
    answer: "α+β=0.98 is close to 1, which means volatility shocks are highly persistent — after a large move, elevated volatility will take a long time to decay back to its long-run level, rather than snapping back quickly. I'd use the model to update tomorrow's forecast immediately: sigma-squared-t equals omega plus alpha times yesterday's squared shock plus beta times yesterday's variance. Concretely, if the long-run volatility was around 2.24% and a 6% one-day move just happened, the model would push tomorrow's forecast up to roughly 2.73%, not leave it at 2.24% — which matters directly for sizing tomorrow's hedges or computing a next-day VaR, since a model using constant historical volatility would miss that jump entirely.",
  },
};
