import type { ChapterDef } from "./types";

export const chapters: ChapterDef[] = [
  { id: "m01", categoryId: "fondamentaux", position: 1, title: { fr: "Banques, marchés et fondamentaux", en: "Banks, markets & fundamentals" }, summary: { fr: "Organisation bancaire, banques centrales, classes d'actifs, arbitrage, change.", en: "Bank organization, central banks, asset classes, arbitrage, FX." } },
  { id: "fin-math", categoryId: "fondamentaux", position: 2, title: { fr: "Mathématiques financières", en: "Financial mathematics" }, summary: { fr: "Intérêts, actualisation, annuités, rendements et courbes.", en: "Interest, discounting, annuities, returns and curves." } },
  { id: "trading-microstructure", categoryId: "fondamentaux", position: 3, title: { fr: "Trading et microstructure", en: "Trading & microstructure" }, summary: { fr: "Ordres, levier, market making, backtesting, biais comportementaux.", en: "Orders, leverage, market making, backtesting, behavioral biases." } },

  { id: "m03", categoryId: "taux-credit", position: 1, title: { fr: "Obligations, taux et crédit", en: "Bonds, rates & credit" }, summary: { fr: "Pricing obligataire, duration, convexité, CDS, DV01.", en: "Bond pricing, duration, convexity, CDS, DV01." } },
  { id: "m04", categoryId: "taux-credit", position: 2, title: { fr: "FRA et swaps de taux", en: "FRAs & interest rate swaps" }, summary: { fr: "FRA, swap fixe/variable, pricing, multi-courbe, DV01 d'un swap.", en: "FRA, fixed/floating swap, pricing, multi-curve, swap DV01." } },

  { id: "m02", categoryId: "derives", position: 1, title: { fr: "Forwards, futures et matières premières", en: "Forwards, futures & commodities" }, summary: { fr: "Pricing par non-arbitrage, couvertures, contango/backwardation.", en: "No-arbitrage pricing, hedging, contango/backwardation." } },
  { id: "m05", categoryId: "derives", position: 2, title: { fr: "Options vanilles et stratégies", en: "Vanilla options & strategies" }, summary: { fr: "Call/put, parité call-put, stratégies classiques.", en: "Call/put, put-call parity, classic strategies." } },
  { id: "m09", categoryId: "derives", position: 3, title: { fr: "Corrélation, dispersion et paniers", en: "Correlation, dispersion & baskets" }, summary: { fr: "Corrélation implicite, dispersion, Worst-Of/Best-Of.", en: "Implied correlation, dispersion, Worst-Of/Best-Of." } },
  { id: "m10", categoryId: "derives", position: 4, title: { fr: "Options barrières et digitales", en: "Barrier & digital options" }, summary: { fr: "Knock-in/out, barrier parity, digitales, réplication.", en: "Knock-in/out, barrier parity, digitals, replication." } },
  { id: "m11", categoryId: "derives", position: 5, title: { fr: "Produits structurés et autocalls", en: "Structured products & autocalls" }, summary: { fr: "Mécanisme autocall, coupon, Greeks, choix de modèle.", en: "Autocall mechanics, coupon, Greeks, model choice." } },

  { id: "m06", categoryId: "modeles-quantitatifs", position: 1, title: { fr: "Mouvement brownien et Black-Scholes", en: "Brownian motion & Black-Scholes" }, summary: { fr: "Construction du mouvement brownien, hypothèses BS, Monte-Carlo.", en: "Brownian motion construction, BS assumptions, Monte-Carlo." } },
  { id: "m07", categoryId: "modeles-quantitatifs", position: 2, title: { fr: "Greeks et couverture dynamique", en: "Greeks & dynamic hedging" }, summary: { fr: "Delta/Gamma/Vega/Theta/Rho, delta-hedging, P&L, Vol Target/CPPI.", en: "Delta/Gamma/Vega/Theta/Rho, delta-hedging, P&L, Vol Target/CPPI." } },
  { id: "m08", categoryId: "modeles-quantitatifs", position: 3, title: { fr: "Volatilité et variance", en: "Volatility & variance" }, summary: { fr: "Vol réalisée/implicite, skew/smile, variance swap, vol locale/stochastique.", en: "Realized/implied vol, skew/smile, variance swap, local/stochastic vol." } },

  { id: "gestion-portefeuille", categoryId: "gestion-portefeuille", position: 1, title: { fr: "Théorie moderne du portefeuille", en: "Modern portfolio theory" }, summary: { fr: "Covariance, Markowitz, CAPM, allocation et attribution.", en: "Covariance, Markowitz, CAPM, allocation and attribution." } },

  { id: "risques", categoryId: "risques-reglementation", position: 1, title: { fr: "Mesures de risque", en: "Risk measures" }, summary: { fr: "VaR, Expected Shortfall, drawdown, ratios de risque ajusté.", en: "VaR, Expected Shortfall, drawdown, risk-adjusted ratios." } },
  { id: "reglementation", categoryId: "risques-reglementation", position: 2, title: { fr: "Réglementation bancaire et financière", en: "Banking & financial regulation" }, summary: { fr: "Bâle III/IV, MiFID II, EMIR, KYC/LCB-FT.", en: "Basel III/IV, MiFID II, EMIR, KYC/AML." } },

  { id: "m12", categoryId: "machine-learning", position: 1, title: { fr: "Machine learning appliqué à la finance", en: "Machine learning for finance" }, summary: { fr: "Régression, arbres, séries temporelles, KNN/SVM, deep learning.", en: "Regression, trees, time series, KNN/SVM, deep learning." } },

  { id: "programmation", categoryId: "outils-carriere", position: 1, title: { fr: "Programmation pour la finance", en: "Programming for finance" }, summary: { fr: "Python, Excel/VBA, SQL, R : données, VaR, Monte-Carlo, automatisation.", en: "Python, Excel/VBA, SQL, R: data, VaR, Monte-Carlo, automation." } },
  { id: "entretiens", categoryId: "outils-carriere", position: 2, title: { fr: "Préparation aux entretiens", en: "Interview preparation" }, summary: { fr: "Questions techniques, études de cas, brainteasers.", en: "Technical questions, case studies, brainteasers." } },
];
