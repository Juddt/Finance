import type { LessonContent } from "@/lib/lesson-types";

export const m13ProgrammationFinance: LessonContent = {
  conceptId: "m13-programmation-finance",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la VaR et la simulation Monte-Carlo pour comprendre les cas d'usage présentés ici.",
      en: "You need to know VaR and Monte Carlo simulation to understand the use cases presented here.",
    },
    conceptIds: ["m13-var-es-stress", "m06-monte-carlo"],
  },
  glossary: [
    { term: { fr: "Vectorisation", en: "Vectorization" }, definition: { fr: "Une technique de programmation qui applique une opération à un tableau entier de données d'un coup, plutôt que via une boucle élément par élément, bien plus rapide en pratique.", en: "A programming technique applying an operation to an entire data array at once, rather than via an element-by-element loop, much faster in practice." } },
  ],
  intuition: {
    fr: "Chaque outil de programmation a un terrain de prédilection en finance : Python domine l'analyse quantitative et le machine learning (M12) grâce à son écosystème de librairies, Excel/VBA reste omniprésent pour le reporting et les modèles ad hoc partagés avec des non-techniciens, SQL est indispensable pour interroger de grandes bases de données de marché, et R conserve une place en statistique et économétrie académique — connaître le bon outil pour la bonne tâche est aussi important que savoir programmer.",
    en: "Each programming tool has a favored terrain in finance: Python dominates quantitative analysis and machine learning (M12) thanks to its library ecosystem, Excel/VBA remains omnipresent for reporting and ad hoc models shared with non-technical people, SQL is essential for querying large market databases, and R retains a place in academic statistics and econometrics — knowing the right tool for the right task matters as much as knowing how to program.",
  },
  definition: {
    fr: "En finance quantitative, les tâches de programmation courantes incluent : manipuler des séries de rendements (calcul, nettoyage, agrégation par fréquence), calculer des mesures de risque (VaR, M13-risques-a) sur un historique de données, exécuter des simulations Monte-Carlo (M06-7) pour pricer des produits complexes ou estimer une distribution de P&L, produire des graphiques pour visualiser des résultats, et automatiser des tâches répétitives (rapports quotidiens, mises à jour de données). Python s'est imposé comme le langage de référence grâce à des librairies spécialisées (pandas pour les données tabulaires, numpy pour le calcul vectorisé, matplotlib pour les graphiques), tandis qu'Excel/VBA et SQL restent incontournables dans des contextes spécifiques (reporting partagé, requêtes sur bases de données).",
    en: "In quantitative finance, common programming tasks include: manipulating return series (computation, cleaning, aggregation by frequency), computing risk measures (VaR, M13-risques-a) over a data history, running Monte Carlo simulations (M06-7) to price complex products or estimate a P&L distribution, producing charts to visualize results, and automating repetitive tasks (daily reports, data updates). Python has established itself as the reference language thanks to specialized libraries (pandas for tabular data, numpy for vectorized computation, matplotlib for charts), while Excel/VBA and SQL remain essential in specific contexts (shared reporting, database queries).",
  },
  utility: {
    fr: "Maîtriser au moins un langage de programmation n'est plus optionnel dans la plupart des métiers quantitatifs de la finance : même un poste orienté trading ou structuration nécessite couramment d'automatiser des calculs répétitifs, de traiter de grands volumes de données de marché, ou de valider les résultats d'un modèle par une implémentation indépendante.",
    en: "Mastering at least one programming language is no longer optional in most quantitative finance roles: even a trading- or structuring-oriented position commonly requires automating repetitive calculations, processing large volumes of market data, or validating a model's results via an independent implementation.",
  },
  example: {
    fr: "Un analyste doit calculer la VaR historique à 95% d'un portefeuille sur les 2 dernières années de données quotidiennes, puis produire un graphique de l'évolution de cette VaR dans le temps, automatiquement mis à jour chaque matin avant l'ouverture des marchés : cette tâche combine manipulation de données (pandas), calcul statistique (numpy), visualisation (matplotlib) et automatisation (planification d'exécution quotidienne) — un exemple typique de workflow quantitatif en Python.",
    en: "An analyst must compute a portfolio's historical 95% VaR over the past 2 years of daily data, then produce a chart of this VaR's evolution over time, automatically updated each morning before markets open: this task combines data manipulation (pandas), statistical computation (numpy), visualization (matplotlib) and automation (daily execution scheduling) — a typical quantitative Python workflow.",
  },
  alternativeExplanation: {
    fr: "Choisir un outil de programmation en finance, c'est comme choisir un instrument de cuisine : un couteau de chef polyvalent (Python) convient à la plupart des tâches quotidiennes, une mandoline spécialisée (SQL) excelle pour une tâche précise (interroger de grandes bases de données), et certains ustensiles familiers mais moins puissants (Excel/VBA) restent utiles pour des préparations rapides partagées avec des collègues non-experts.",
    en: "Choosing a programming tool in finance is like choosing a kitchen instrument: a versatile chef's knife (Python) suits most daily tasks, a specialized mandoline (SQL) excels at a precise task (querying large databases), and certain familiar but less powerful utensils (Excel/VBA) remain useful for quick preparations shared with non-expert colleagues.",
  },
  formula: {
    latex: "\\text{VaR}_{95\\%} = -\\text{Quantile}_{5\\%}(\\{R_1, R_2, \\ldots, R_n\\})",
    variables: [
      { symbol: "\\{R_1, \\ldots, R_n\\}", description: { fr: "Série historique des rendements du portefeuille sur la période observée", en: "Historical series of the portfolio's returns over the observed period" } },
      { symbol: "\\text{Quantile}_{5\\%}", description: { fr: "Le 5e percentile de cette distribution empirique de rendements", en: "The 5th percentile of this empirical return distribution" } },
    ],
    assumptions: { fr: "VaR historique (méthode non-paramétrique, sans hypothèse de distribution) ; alternative aux méthodes paramétrique ou Monte-Carlo déjà vues (M13-risques-a).", en: "Historical VaR (non-parametric method, no distribution assumption); an alternative to the parametric or Monte Carlo methods already seen (M13-risques-a)." },
    units: { fr: "Perte en pourcentage ou dans la devise du portefeuille.", en: "Loss as a percentage or in the portfolio's currency." },
    example: { fr: "Sur 500 jours de rendements historiques, le 5e percentile correspond au 25e pire rendement observé (500×5%=25).", en: "Over 500 days of historical returns, the 5th percentile corresponds to the 25th worst observed return (500×5%=25)." },
  },
  calculation: {
    fr: "1) Charger et nettoyer les données de rendements (gérer les valeurs manquantes, vérifier la cohérence des dates). 2) Utiliser des opérations vectorisées plutôt que des boucles explicites pour calculer les mesures statistiques (bien plus rapide sur de grands volumes de données). 3) Produire les visualisations nécessaires pour communiquer les résultats. 4) Automatiser l'ensemble du processus si la tâche est récurrente (planification, gestion des erreurs), plutôt que de répéter manuellement les mêmes étapes chaque jour.",
    en: "1) Load and clean the return data (handle missing values, check date consistency). 2) Use vectorized operations rather than explicit loops to compute statistical measures (much faster on large data volumes). 3) Produce the visualizations needed to communicate results. 4) Automate the entire process if the task is recurring (scheduling, error handling), rather than manually repeating the same steps every day.",
  },
  pythonExample: {
    fr: `import pandas as pd
import numpy as np

# Charger les rendements quotidiens d'un portefeuille (colonne "rendement")
donnees = pd.read_csv("rendements_portefeuille.csv", parse_dates=["date"])

# VaR historique à 95% sur les 2 dernières années (opération vectorisée, pas de boucle)
rendements_recents = donnees["rendement"].tail(500)
var_95 = -np.percentile(rendements_recents, 5)

print(f"VaR historique à 95% : {var_95:.2%}")

# Exemple d'automatisation : recalculer chaque jour et sauvegarder l'historique
donnees.rolling(window=500)["rendement"].apply(
    lambda x: -np.percentile(x, 5)
).to_csv("historique_var.csv")`,
    en: `import pandas as pd
import numpy as np

# Load a portfolio's daily returns (column "return")
data = pd.read_csv("portfolio_returns.csv", parse_dates=["date"])

# 95% historical VaR over the last 2 years (vectorized operation, no loop)
recent_returns = data["return"].tail(500)
var_95 = -np.percentile(recent_returns, 5)

print(f"95% historical VaR: {var_95:.2%}")

# Automation example: recompute daily and save the history
data.rolling(window=500)["return"].apply(
    lambda x: -np.percentile(x, 5)
).to_csv("var_history.csv")`,
  },
  interpretation: {
    fr: "Un code qui utilise systématiquement des opérations vectorisées (numpy, pandas) plutôt que des boucles explicites en Python s'exécute généralement plusieurs ordres de grandeur plus vite sur de grands volumes de données — un facteur déterminant quand un calcul doit être répété des milliers de fois (simulation Monte-Carlo) ou appliqué à des historiques de marché volumineux. Automatiser une tâche récurrente élimine non seulement le temps passé, mais aussi le risque d'erreur humaine lors d'une exécution manuelle répétée.",
    en: "Code that systematically uses vectorized operations (numpy, pandas) rather than explicit loops in Python generally runs several orders of magnitude faster on large data volumes — a determining factor when a computation must be repeated thousands of times (Monte Carlo simulation) or applied to large market histories. Automating a recurring task eliminates not only time spent, but also the risk of human error during repeated manual execution.",
  },
  pitfalls: {
    fr: "Écrire du code avec des boucles explicites élément par élément en Python quand une opération vectorisée équivalente existe, entraînant des temps de calcul largement plus longs que nécessaire sur de grands jeux de données. Autre piège fréquent : ne pas valider un résultat de calcul quantitatif par une méthode indépendante (par exemple, comparer une VaR historique à une VaR paramétrique) avant de l'utiliser dans une décision réelle, un contrôle de cohérence pourtant simple à mettre en place.",
    en: "Writing element-by-element explicit loop code in Python when an equivalent vectorized operation exists, leading to far longer computation times than necessary on large datasets. Another frequent trap: not validating a quantitative computation's result via an independent method (e.g., comparing a historical VaR to a parametric VaR) before using it in a real decision, a consistency check that's nonetheless simple to set up.",
  },
  keyPoints: {
    fr: [
      "Python (pandas, numpy) domine l'analyse quantitative moderne ; Excel/VBA et SQL restent indispensables dans des contextes spécifiques.",
      "La vectorisation (opérations sur des tableaux entiers) est nettement plus rapide que des boucles explicites, un facteur crucial pour les simulations et grands historiques.",
      "Automatiser une tâche récurrente élimine à la fois le temps passé et le risque d'erreur humaine.",
    ],
    en: [
      "Python (pandas, numpy) dominates modern quantitative analysis; Excel/VBA and SQL remain essential in specific contexts.",
      "Vectorization (operations on entire arrays) is markedly faster than explicit loops, a crucial factor for simulations and large histories.",
      "Automating a recurring task eliminates both time spent and human error risk.",
    ],
  },
  advancedDemonstration: {
    fr: "La différence de performance entre une boucle Python explicite et une opération vectorisée numpy s'explique techniquement par le fait que numpy délègue les calculs à du code compilé en C, exécuté sur des tableaux de mémoire contiguë, évitant l'overhead de l'interpréteur Python à chaque itération — un facteur d'accélération qui peut atteindre 100x ou plus sur de grands tableaux, ce qui explique pourquoi une simulation Monte-Carlo (M06-7) de plusieurs millions de trajectoires reste praticable en quelques secondes en Python vectorisé, alors qu'elle prendrait des heures avec des boucles naïves.",
    en: "The performance difference between an explicit Python loop and a vectorized numpy operation is technically explained by numpy delegating computations to compiled C code, executed on contiguous memory arrays, avoiding the Python interpreter's overhead at each iteration — a speedup factor that can reach 100x or more on large arrays, which explains why a Monte Carlo simulation (M06-7) of several million paths remains practical in a few seconds in vectorized Python, when it would take hours with naive loops.",
  },
};
