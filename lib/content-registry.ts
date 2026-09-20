import type { LessonContent } from "./lesson-types";
import type { QuestionTemplate } from "./question-templates";
import { m02CouvertureForward } from "@/content/lessons/m02-couverture-forward";
import { m02ForwardContractValue } from "@/content/lessons/m02-forward-contract-value";
import { m02ForwardFutureDefinitions } from "@/content/lessons/m02-forward-future-definitions";
import { m02PrixForwardNonArbitrage } from "@/content/lessons/m02-prix-forward-non-arbitrage";
import { m02ForwardVsFuture } from "@/content/lessons/m02-forward-vs-future";
import { m02MatieresPremieres } from "@/content/lessons/m02-matieres-premieres";
import { m02ContangoBackwardation } from "@/content/lessons/m02-contango-backwardation";
import { m03Duration } from "@/content/lessons/m03-duration";
import { m03RisqueCredit } from "@/content/lessons/m03-risque-credit";
import { m03DefinitionObligations } from "@/content/lessons/m03-definition-obligations";
import { m03PricingObligation } from "@/content/lessons/m03-pricing-obligation";
import { m03Convexite } from "@/content/lessons/m03-convexite";
import { m03Cds } from "@/content/lessons/m03-cds";
import { m03TauxSansRisque } from "@/content/lessons/m03-taux-sans-risque";
import { m03RepoCollateral } from "@/content/lessons/m03-repo-collateral";
import { m03Dv01 } from "@/content/lessons/m03-dv01";
import { m03Cs01 } from "@/content/lessons/m03-cs01";
import { m03SensibiliteCourbe } from "@/content/lessons/m03-sensibilite-courbe";
import { m03CarryRollDown } from "@/content/lessons/m03-carry-roll-down";
import { m03ObligationsConvertibles } from "@/content/lessons/m03-obligations-convertibles";
import { m05CallPut } from "@/content/lessons/m05-call-put";
import { m05ItmAtmOtm } from "@/content/lessons/m05-itm-atm-otm";
import { m05PariteCallPut } from "@/content/lessons/m05-parite-call-put";
import { m05StrategiesClassiques } from "@/content/lessons/m05-strategies-classiques";
import { m04Fra } from "@/content/lessons/m04-fra";
import { m04SwapFixeVariable } from "@/content/lessons/m04-swap-fixe-variable";
import { m04PricingSwap } from "@/content/lessons/m04-pricing-swap";
import { m04ClearingCsa } from "@/content/lessons/m04-clearing-csa";
import { m04MonoMultiCourbe } from "@/content/lessons/m04-mono-multi-courbe";
import { m04Dv01Swap } from "@/content/lessons/m04-dv01-swap";
import { m04SwapInflation } from "@/content/lessons/m04-swap-inflation";
import { m01OrganisationBanque } from "@/content/lessons/m01-organisation-banque";
import { m01IndicateursMacro } from "@/content/lessons/m01-indicateurs-macro";
import { m01BanquesCentrales } from "@/content/lessons/m01-banques-centrales";
import { m01AnticipationsTauxDirecteurs } from "@/content/lessons/m01-anticipations-taux-directeurs";
import { m01ClassesActifs } from "@/content/lessons/m01-classes-actifs";
import { m01ActionsDividendesRatios } from "@/content/lessons/m01-actions-dividendes-ratios";
import { m01IndicesEtf } from "@/content/lessons/m01-indices-etf";
import { m01Arbitrage } from "@/content/lessons/m01-arbitrage";
import { m01VenteDecouvert } from "@/content/lessons/m01-vente-decouvert";
import { m01TauxChange } from "@/content/lessons/m01-taux-change";
import { m01PariteTaux } from "@/content/lessons/m01-parite-taux";
import { m01FxPointsForwardSwap } from "@/content/lessons/m01-fx-points-forward-swap";
import { m01MicrostructureRappels } from "@/content/lessons/m01-microstructure-rappels";
import { m06MouvementBrownien } from "@/content/lessons/m06-mouvement-brownien";
import { m06BrownienArithmetiqueGeometrique } from "@/content/lessons/m06-brownien-arithmetique-geometrique";
import { m06PrerequisIto } from "@/content/lessons/m06-prerequis-ito";
import { m06BlackScholes } from "@/content/lessons/m06-black-scholes";
import { m06FormulesCallPut } from "@/content/lessons/m06-formules-call-put";
import { m06ApproximationAtmf } from "@/content/lessons/m06-approximation-atmf";
import { m06MonteCarlo } from "@/content/lessons/m06-monte-carlo";
import { m07GreeksPremierOrdre } from "@/content/lessons/m07-greeks-premier-ordre";
import { m07GreeksSecondOrdre } from "@/content/lessons/m07-greeks-second-ordre";
import { m07GreeksStrategies } from "@/content/lessons/m07-greeks-strategies";
import { m07DeltaHedging } from "@/content/lessons/m07-delta-hedging";
import { m07PnlDeltaHedging } from "@/content/lessons/m07-pnl-delta-hedging";
import { m07VolTargetCppi } from "@/content/lessons/m07-vol-target-cppi";
import { m08VolatiliteRealisee } from "@/content/lessons/m08-volatilite-realisee";
import { m08VolatiliteImplicite } from "@/content/lessons/m08-volatilite-implicite";
import { m08SkewSmileSurface } from "@/content/lessons/m08-skew-smile-surface";
import { m08FormesSkewSmile } from "@/content/lessons/m08-formes-skew-smile";
import { m08VarianceSwap } from "@/content/lessons/m08-variance-swap";
import { m08VolLocaleStochastique } from "@/content/lessons/m08-vol-locale-stochastique";
import { m09CorrelationRealisee } from "@/content/lessons/m09-correlation-realisee";
import { m09CorrelationImplicite } from "@/content/lessons/m09-correlation-implicite";
import { m09Dispersion } from "@/content/lessons/m09-dispersion";
import { m09PanierWorstBestOf } from "@/content/lessons/m09-panier-worst-best-of";
import { m09SensibilitesPayoff } from "@/content/lessons/m09-sensibilites-payoff";
import { m10MecanismesBarrieres } from "@/content/lessons/m10-mecanismes-barrieres";
import { m10GreeksBarrieres } from "@/content/lessons/m10-greeks-barrieres";
import { m10BarrierParity } from "@/content/lessons/m10-barrier-parity";
import { m10Pdi } from "@/content/lessons/m10-pdi";
import { m10ImpactVolKnockout } from "@/content/lessons/m10-impact-vol-knockout";
import { m10DoublesBarrieres } from "@/content/lessons/m10-doubles-barrieres";
import { m10OptionsDigitales } from "@/content/lessons/m10-options-digitales";
import { m10ReplicationDigitale } from "@/content/lessons/m10-replication-digitale";
import { m10LissageDeltaGamma } from "@/content/lessons/m10-lissage-delta-gamma";
import { m11ProduitStructure } from "@/content/lessons/m11-produit-structure";
import { m11Autocall } from "@/content/lessons/m11-autocall";
import { m11AugmenterCoupon } from "@/content/lessons/m11-augmenter-coupon";
import { m11GreeksAutocall } from "@/content/lessons/m11-greeks-autocall";
import { m11ModelesPricingAutocall } from "@/content/lessons/m11-modeles-pricing-autocall";
import { m12RegressionLineaire } from "@/content/lessons/m12-regression-lineaire";
import { m12RegressionLogistique } from "@/content/lessons/m12-regression-logistique";
import { m12ArbresForets } from "@/content/lessons/m12-arbres-forets";
import { m12SeriesTemporelles } from "@/content/lessons/m12-series-temporelles";
import { m12KnnSvm } from "@/content/lessons/m12-knn-svm";
import { m12DeepLearningIntro } from "@/content/lessons/m12-deep-learning-intro";
import { m12MethodologieMl } from "@/content/lessons/m12-methodologie-ml";
import { m13InteretsComposes } from "@/content/lessons/m13-interets-composes";
import { m13ActualisationAnnuites } from "@/content/lessons/m13-actualisation-annuites";
import { m13DcfComparables } from "@/content/lessons/m13-dcf-comparables";
import { m13CovarianceDiversification } from "@/content/lessons/m13-covariance-diversification";
import { m13MarkowitzFrontiere } from "@/content/lessons/m13-markowitz-frontiere";
import { m13CapmSml } from "@/content/lessons/m13-capm-sml";
import { m13AllocationAttribution } from "@/content/lessons/m13-allocation-attribution";
import { m13VarEsStress } from "@/content/lessons/m13-var-es-stress";
import { m13DrawdownUlcer } from "@/content/lessons/m13-drawdown-ulcer";
import { m13RatiosRisqueAjuste } from "@/content/lessons/m13-ratios-risque-ajuste";
import { m13TypologieRisques } from "@/content/lessons/m13-typologie-risques";
import { m13OrdresLevierMarge } from "@/content/lessons/m13-ordres-levier-marge";
import { m13MarketMakingMomentum } from "@/content/lessons/m13-market-making-momentum";
import { m13BacktestingBiais } from "@/content/lessons/m13-backtesting-biais";
import { m13Bale } from "@/content/lessons/m13-bale";
import { m13MifidEmirKyc } from "@/content/lessons/m13-mifid-emir-kyc";
import { m13ProgrammationFinance } from "@/content/lessons/m13-programmation-finance";
import { m13EntretiensTechniques } from "@/content/lessons/m13-entretiens-techniques";
import { m13EntretiensCasBrainteasers } from "@/content/lessons/m13-entretiens-cas-brainteasers";
import { templates as m02CouvertureForwardTemplates } from "@/content/question-templates/m02-couverture-forward";
import { templates as m02ForwardContractValueTemplates } from "@/content/question-templates/m02-forward-contract-value";
import { templates as m02ForwardFutureDefinitionsTemplates } from "@/content/question-templates/m02-forward-future-definitions";
import { templates as m02PrixForwardNonArbitrageTemplates } from "@/content/question-templates/m02-prix-forward-non-arbitrage";
import { templates as m02ForwardVsFutureTemplates } from "@/content/question-templates/m02-forward-vs-future";
import { templates as m02MatieresPremieresTemplates } from "@/content/question-templates/m02-matieres-premieres";
import { templates as m02ContangoBackwardationTemplates } from "@/content/question-templates/m02-contango-backwardation";
import { templates as m03DurationTemplates } from "@/content/question-templates/m03-duration";
import { templates as m03RisqueCreditTemplates } from "@/content/question-templates/m03-risque-credit";
import { templates as m03DefinitionObligationsTemplates } from "@/content/question-templates/m03-definition-obligations";
import { templates as m03PricingObligationTemplates } from "@/content/question-templates/m03-pricing-obligation";
import { templates as m03ConvexiteTemplates } from "@/content/question-templates/m03-convexite";
import { templates as m03CdsTemplates } from "@/content/question-templates/m03-cds";
import { templates as m03TauxSansRisqueTemplates } from "@/content/question-templates/m03-taux-sans-risque";
import { templates as m03RepoCollateralTemplates } from "@/content/question-templates/m03-repo-collateral";
import { templates as m03Dv01Templates } from "@/content/question-templates/m03-dv01";
import { templates as m03Cs01Templates } from "@/content/question-templates/m03-cs01";
import { templates as m03SensibiliteCourbeTemplates } from "@/content/question-templates/m03-sensibilite-courbe";
import { templates as m03CarryRollDownTemplates } from "@/content/question-templates/m03-carry-roll-down";
import { templates as m03ObligationsConvertiblesTemplates } from "@/content/question-templates/m03-obligations-convertibles";
import { templates as m05CallPutTemplates } from "@/content/question-templates/m05-call-put";
import { templates as m05ItmAtmOtmTemplates } from "@/content/question-templates/m05-itm-atm-otm";
import { templates as m05PariteCallPutTemplates } from "@/content/question-templates/m05-parite-call-put";
import { templates as m05StrategiesClassiquesTemplates } from "@/content/question-templates/m05-strategies-classiques";
import { templates as m04FraTemplates } from "@/content/question-templates/m04-fra";
import { templates as m04SwapFixeVariableTemplates } from "@/content/question-templates/m04-swap-fixe-variable";
import { templates as m04PricingSwapTemplates } from "@/content/question-templates/m04-pricing-swap";
import { templates as m04ClearingCsaTemplates } from "@/content/question-templates/m04-clearing-csa";
import { templates as m04MonoMultiCourbeTemplates } from "@/content/question-templates/m04-mono-multi-courbe";
import { templates as m04Dv01SwapTemplates } from "@/content/question-templates/m04-dv01-swap";
import { templates as m04SwapInflationTemplates } from "@/content/question-templates/m04-swap-inflation";
import { templates as m01OrganisationBanqueTemplates } from "@/content/question-templates/m01-organisation-banque";
import { templates as m01IndicateursMacroTemplates } from "@/content/question-templates/m01-indicateurs-macro";
import { templates as m01BanquesCentralesTemplates } from "@/content/question-templates/m01-banques-centrales";
import { templates as m01AnticipationsTauxDirecteursTemplates } from "@/content/question-templates/m01-anticipations-taux-directeurs";
import { templates as m01ClassesActifsTemplates } from "@/content/question-templates/m01-classes-actifs";
import { templates as m01ActionsDividendesRatiosTemplates } from "@/content/question-templates/m01-actions-dividendes-ratios";
import { templates as m01IndicesEtfTemplates } from "@/content/question-templates/m01-indices-etf";
import { templates as m01ArbitrageTemplates } from "@/content/question-templates/m01-arbitrage";
import { templates as m01VenteDecouvertTemplates } from "@/content/question-templates/m01-vente-decouvert";
import { templates as m01TauxChangeTemplates } from "@/content/question-templates/m01-taux-change";
import { templates as m01PariteTauxTemplates } from "@/content/question-templates/m01-parite-taux";
import { templates as m01FxPointsForwardSwapTemplates } from "@/content/question-templates/m01-fx-points-forward-swap";
import { templates as m01MicrostructureRappelsTemplates } from "@/content/question-templates/m01-microstructure-rappels";
import { templates as m06MouvementBrownienTemplates } from "@/content/question-templates/m06-mouvement-brownien";
import { templates as m06BrownienArithmetiqueGeometriqueTemplates } from "@/content/question-templates/m06-brownien-arithmetique-geometrique";
import { templates as m06PrerequisItoTemplates } from "@/content/question-templates/m06-prerequis-ito";
import { templates as m06BlackScholesTemplates } from "@/content/question-templates/m06-black-scholes";
import { templates as m06FormulesCallPutTemplates } from "@/content/question-templates/m06-formules-call-put";
import { templates as m06ApproximationAtmfTemplates } from "@/content/question-templates/m06-approximation-atmf";
import { templates as m06MonteCarloTemplates } from "@/content/question-templates/m06-monte-carlo";
import { templates as m07GreeksPremierOrdreTemplates } from "@/content/question-templates/m07-greeks-premier-ordre";
import { templates as m07GreeksSecondOrdreTemplates } from "@/content/question-templates/m07-greeks-second-ordre";
import { templates as m07GreeksStrategiesTemplates } from "@/content/question-templates/m07-greeks-strategies";
import { templates as m07DeltaHedgingTemplates } from "@/content/question-templates/m07-delta-hedging";
import { templates as m07PnlDeltaHedgingTemplates } from "@/content/question-templates/m07-pnl-delta-hedging";
import { templates as m07VolTargetCppiTemplates } from "@/content/question-templates/m07-vol-target-cppi";
import { templates as m08VolatiliteRealiseeTemplates } from "@/content/question-templates/m08-volatilite-realisee";
import { templates as m08VolatiliteImpliciteTemplates } from "@/content/question-templates/m08-volatilite-implicite";
import { templates as m08SkewSmileSurfaceTemplates } from "@/content/question-templates/m08-skew-smile-surface";
import { templates as m08FormesSkewSmileTemplates } from "@/content/question-templates/m08-formes-skew-smile";
import { templates as m08VarianceSwapTemplates } from "@/content/question-templates/m08-variance-swap";
import { templates as m08VolLocaleStochastiqueTemplates } from "@/content/question-templates/m08-vol-locale-stochastique";
import { templates as m09CorrelationRealiseeTemplates } from "@/content/question-templates/m09-correlation-realisee";
import { templates as m09CorrelationImpliciteTemplates } from "@/content/question-templates/m09-correlation-implicite";
import { templates as m09DispersionTemplates } from "@/content/question-templates/m09-dispersion";
import { templates as m09PanierWorstBestOfTemplates } from "@/content/question-templates/m09-panier-worst-best-of";
import { templates as m09SensibilitesPayoffTemplates } from "@/content/question-templates/m09-sensibilites-payoff";
import { templates as m10MecanismesBarrieresTemplates } from "@/content/question-templates/m10-mecanismes-barrieres";
import { templates as m10GreeksBarrieresTemplates } from "@/content/question-templates/m10-greeks-barrieres";
import { templates as m10BarrierParityTemplates } from "@/content/question-templates/m10-barrier-parity";
import { templates as m10PdiTemplates } from "@/content/question-templates/m10-pdi";
import { templates as m10ImpactVolKnockoutTemplates } from "@/content/question-templates/m10-impact-vol-knockout";
import { templates as m10DoublesBarrieresTemplates } from "@/content/question-templates/m10-doubles-barrieres";
import { templates as m10OptionsDigitalesTemplates } from "@/content/question-templates/m10-options-digitales";
import { templates as m10ReplicationDigitaleTemplates } from "@/content/question-templates/m10-replication-digitale";
import { templates as m10LissageDeltaGammaTemplates } from "@/content/question-templates/m10-lissage-delta-gamma";
import { templates as m11ProduitStructureTemplates } from "@/content/question-templates/m11-produit-structure";
import { templates as m11AutocallTemplates } from "@/content/question-templates/m11-autocall";
import { templates as m11AugmenterCouponTemplates } from "@/content/question-templates/m11-augmenter-coupon";
import { templates as m11GreeksAutocallTemplates } from "@/content/question-templates/m11-greeks-autocall";
import { templates as m11ModelesPricingAutocallTemplates } from "@/content/question-templates/m11-modeles-pricing-autocall";
import { templates as m12RegressionLineaireTemplates } from "@/content/question-templates/m12-regression-lineaire";
import { templates as m12RegressionLogistiqueTemplates } from "@/content/question-templates/m12-regression-logistique";
import { templates as m12ArbresForetsTemplates } from "@/content/question-templates/m12-arbres-forets";
import { templates as m12SeriesTemporellesTemplates } from "@/content/question-templates/m12-series-temporelles";
import { templates as m12KnnSvmTemplates } from "@/content/question-templates/m12-knn-svm";
import { templates as m12DeepLearningIntroTemplates } from "@/content/question-templates/m12-deep-learning-intro";
import { templates as m12MethodologieMlTemplates } from "@/content/question-templates/m12-methodologie-ml";
import { templates as m13InteretsComposesTemplates } from "@/content/question-templates/m13-interets-composes";
import { templates as m13ActualisationAnnuitesTemplates } from "@/content/question-templates/m13-actualisation-annuites";
import { templates as m13DcfComparablesTemplates } from "@/content/question-templates/m13-dcf-comparables";
import { templates as m13CovarianceDiversificationTemplates } from "@/content/question-templates/m13-covariance-diversification";
import { templates as m13MarkowitzFrontiereTemplates } from "@/content/question-templates/m13-markowitz-frontiere";
import { templates as m13CapmSmlTemplates } from "@/content/question-templates/m13-capm-sml";
import { templates as m13AllocationAttributionTemplates } from "@/content/question-templates/m13-allocation-attribution";
import { templates as m13VarEsStressTemplates } from "@/content/question-templates/m13-var-es-stress";
import { templates as m13DrawdownUlcerTemplates } from "@/content/question-templates/m13-drawdown-ulcer";
import { templates as m13RatiosRisqueAjusteTemplates } from "@/content/question-templates/m13-ratios-risque-ajuste";
import { templates as m13TypologieRisquesTemplates } from "@/content/question-templates/m13-typologie-risques";
import { templates as m13OrdresLevierMargeTemplates } from "@/content/question-templates/m13-ordres-levier-marge";
import { templates as m13MarketMakingMomentumTemplates } from "@/content/question-templates/m13-market-making-momentum";
import { templates as m13BacktestingBiaisTemplates } from "@/content/question-templates/m13-backtesting-biais";
import { templates as m13BaleTemplates } from "@/content/question-templates/m13-bale";
import { templates as m13MifidEmirKycTemplates } from "@/content/question-templates/m13-mifid-emir-kyc";
import { templates as m13ProgrammationFinanceTemplates } from "@/content/question-templates/m13-programmation-finance";
import { templates as m13EntretiensTechniquesTemplates } from "@/content/question-templates/m13-entretiens-techniques";
import { templates as m13EntretiensCasBrainteasersTemplates } from "@/content/question-templates/m13-entretiens-cas-brainteasers";

/**
 * Registre des contenus publiés. Ajouter une entrée ici (leçon + templates de
 * questions) pour chaque nouveau concept rédigé et validé (voir doc section 8,
 * "publication progressive").
 */
export const lessonsByConceptId: Record<string, LessonContent> = {
  "m02-forward-future-definitions": m02ForwardFutureDefinitions,
  "m02-prix-forward-non-arbitrage": m02PrixForwardNonArbitrage,
  "m02-forward-vs-future": m02ForwardVsFuture,
  "m02-forward-contract-value": m02ForwardContractValue,
  "m02-couverture-forward": m02CouvertureForward,
  "m02-matieres-premieres": m02MatieresPremieres,
  "m02-contango-backwardation": m02ContangoBackwardation,
  "m03-duration": m03Duration,
  "m03-risque-credit": m03RisqueCredit,
  "m03-definition-obligations": m03DefinitionObligations,
  "m03-pricing-obligation": m03PricingObligation,
  "m03-convexite": m03Convexite,
  "m03-cds": m03Cds,
  "m03-taux-sans-risque": m03TauxSansRisque,
  "m03-repo-collateral": m03RepoCollateral,
  "m03-dv01": m03Dv01,
  "m03-cs01": m03Cs01,
  "m03-sensibilite-courbe": m03SensibiliteCourbe,
  "m03-carry-roll-down": m03CarryRollDown,
  "m03-obligations-convertibles": m03ObligationsConvertibles,
  "m05-call-put": m05CallPut,
  "m05-itm-atm-otm": m05ItmAtmOtm,
  "m05-parite-call-put": m05PariteCallPut,
  "m05-strategies-classiques": m05StrategiesClassiques,
  "m04-fra": m04Fra,
  "m04-swap-fixe-variable": m04SwapFixeVariable,
  "m04-pricing-swap": m04PricingSwap,
  "m04-clearing-csa": m04ClearingCsa,
  "m04-mono-multi-courbe": m04MonoMultiCourbe,
  "m04-dv01-swap": m04Dv01Swap,
  "m04-swap-inflation": m04SwapInflation,
  "m01-organisation-banque": m01OrganisationBanque,
  "m01-indicateurs-macro": m01IndicateursMacro,
  "m01-banques-centrales": m01BanquesCentrales,
  "m01-anticipations-taux-directeurs": m01AnticipationsTauxDirecteurs,
  "m01-classes-actifs": m01ClassesActifs,
  "m01-actions-dividendes-ratios": m01ActionsDividendesRatios,
  "m01-indices-etf": m01IndicesEtf,
  "m01-arbitrage": m01Arbitrage,
  "m01-vente-decouvert": m01VenteDecouvert,
  "m01-taux-change": m01TauxChange,
  "m01-parite-taux": m01PariteTaux,
  "m01-fx-points-forward-swap": m01FxPointsForwardSwap,
  "m01-microstructure-rappels": m01MicrostructureRappels,
  "m06-mouvement-brownien": m06MouvementBrownien,
  "m06-brownien-arithmetique-geometrique": m06BrownienArithmetiqueGeometrique,
  "m06-prerequis-ito": m06PrerequisIto,
  "m06-black-scholes": m06BlackScholes,
  "m06-formules-call-put": m06FormulesCallPut,
  "m06-approximation-atmf": m06ApproximationAtmf,
  "m06-monte-carlo": m06MonteCarlo,
  "m07-greeks-premier-ordre": m07GreeksPremierOrdre,
  "m07-greeks-second-ordre": m07GreeksSecondOrdre,
  "m07-greeks-strategies": m07GreeksStrategies,
  "m07-delta-hedging": m07DeltaHedging,
  "m07-pnl-delta-hedging": m07PnlDeltaHedging,
  "m07-vol-target-cppi": m07VolTargetCppi,
  "m08-volatilite-realisee": m08VolatiliteRealisee,
  "m08-volatilite-implicite": m08VolatiliteImplicite,
  "m08-skew-smile-surface": m08SkewSmileSurface,
  "m08-formes-skew-smile": m08FormesSkewSmile,
  "m08-variance-swap": m08VarianceSwap,
  "m08-vol-locale-stochastique": m08VolLocaleStochastique,
  "m09-correlation-realisee": m09CorrelationRealisee,
  "m09-correlation-implicite": m09CorrelationImplicite,
  "m09-dispersion": m09Dispersion,
  "m09-panier-worst-best-of": m09PanierWorstBestOf,
  "m09-sensibilites-payoff": m09SensibilitesPayoff,
  "m10-mecanismes-barrieres": m10MecanismesBarrieres,
  "m10-greeks-barrieres": m10GreeksBarrieres,
  "m10-barrier-parity": m10BarrierParity,
  "m10-pdi": m10Pdi,
  "m10-impact-vol-knockout": m10ImpactVolKnockout,
  "m10-doubles-barrieres": m10DoublesBarrieres,
  "m10-options-digitales": m10OptionsDigitales,
  "m10-replication-digitale": m10ReplicationDigitale,
  "m10-lissage-delta-gamma": m10LissageDeltaGamma,
  "m11-produit-structure": m11ProduitStructure,
  "m11-autocall": m11Autocall,
  "m11-augmenter-coupon": m11AugmenterCoupon,
  "m11-greeks-autocall": m11GreeksAutocall,
  "m11-modeles-pricing-autocall": m11ModelesPricingAutocall,
  "m12-regression-lineaire": m12RegressionLineaire,
  "m12-regression-logistique": m12RegressionLogistique,
  "m12-arbres-forets": m12ArbresForets,
  "m12-series-temporelles": m12SeriesTemporelles,
  "m12-knn-svm": m12KnnSvm,
  "m12-deep-learning-intro": m12DeepLearningIntro,
  "m12-methodologie-ml": m12MethodologieMl,
  "m13-interets-composes": m13InteretsComposes,
  "m13-actualisation-annuites": m13ActualisationAnnuites,
  "m13-dcf-comparables": m13DcfComparables,
  "m13-covariance-diversification": m13CovarianceDiversification,
  "m13-markowitz-frontiere": m13MarkowitzFrontiere,
  "m13-capm-sml": m13CapmSml,
  "m13-allocation-attribution": m13AllocationAttribution,
  "m13-var-es-stress": m13VarEsStress,
  "m13-drawdown-ulcer": m13DrawdownUlcer,
  "m13-ratios-risque-ajuste": m13RatiosRisqueAjuste,
  "m13-typologie-risques": m13TypologieRisques,
  "m13-ordres-levier-marge": m13OrdresLevierMarge,
  "m13-market-making-momentum": m13MarketMakingMomentum,
  "m13-backtesting-biais": m13BacktestingBiais,
  "m13-bale": m13Bale,
  "m13-mifid-emir-kyc": m13MifidEmirKyc,
  "m13-programmation-finance": m13ProgrammationFinance,
  "m13-entretiens-techniques": m13EntretiensTechniques,
  "m13-entretiens-cas-brainteasers": m13EntretiensCasBrainteasers,
};

export const templatesByConceptId: Record<string, QuestionTemplate[]> = {
  "m02-forward-future-definitions": m02ForwardFutureDefinitionsTemplates,
  "m02-prix-forward-non-arbitrage": m02PrixForwardNonArbitrageTemplates,
  "m02-forward-vs-future": m02ForwardVsFutureTemplates,
  "m02-forward-contract-value": m02ForwardContractValueTemplates,
  "m02-couverture-forward": m02CouvertureForwardTemplates,
  "m02-matieres-premieres": m02MatieresPremieresTemplates,
  "m02-contango-backwardation": m02ContangoBackwardationTemplates,
  "m03-duration": m03DurationTemplates,
  "m03-risque-credit": m03RisqueCreditTemplates,
  "m03-definition-obligations": m03DefinitionObligationsTemplates,
  "m03-pricing-obligation": m03PricingObligationTemplates,
  "m03-convexite": m03ConvexiteTemplates,
  "m03-cds": m03CdsTemplates,
  "m03-taux-sans-risque": m03TauxSansRisqueTemplates,
  "m03-repo-collateral": m03RepoCollateralTemplates,
  "m03-dv01": m03Dv01Templates,
  "m03-cs01": m03Cs01Templates,
  "m03-sensibilite-courbe": m03SensibiliteCourbeTemplates,
  "m03-carry-roll-down": m03CarryRollDownTemplates,
  "m03-obligations-convertibles": m03ObligationsConvertiblesTemplates,
  "m05-call-put": m05CallPutTemplates,
  "m05-itm-atm-otm": m05ItmAtmOtmTemplates,
  "m05-parite-call-put": m05PariteCallPutTemplates,
  "m05-strategies-classiques": m05StrategiesClassiquesTemplates,
  "m04-fra": m04FraTemplates,
  "m04-swap-fixe-variable": m04SwapFixeVariableTemplates,
  "m04-pricing-swap": m04PricingSwapTemplates,
  "m04-clearing-csa": m04ClearingCsaTemplates,
  "m04-mono-multi-courbe": m04MonoMultiCourbeTemplates,
  "m04-dv01-swap": m04Dv01SwapTemplates,
  "m04-swap-inflation": m04SwapInflationTemplates,
  "m01-organisation-banque": m01OrganisationBanqueTemplates,
  "m01-indicateurs-macro": m01IndicateursMacroTemplates,
  "m01-banques-centrales": m01BanquesCentralesTemplates,
  "m01-anticipations-taux-directeurs": m01AnticipationsTauxDirecteursTemplates,
  "m01-classes-actifs": m01ClassesActifsTemplates,
  "m01-actions-dividendes-ratios": m01ActionsDividendesRatiosTemplates,
  "m01-indices-etf": m01IndicesEtfTemplates,
  "m01-arbitrage": m01ArbitrageTemplates,
  "m01-vente-decouvert": m01VenteDecouvertTemplates,
  "m01-taux-change": m01TauxChangeTemplates,
  "m01-parite-taux": m01PariteTauxTemplates,
  "m01-fx-points-forward-swap": m01FxPointsForwardSwapTemplates,
  "m01-microstructure-rappels": m01MicrostructureRappelsTemplates,
  "m06-mouvement-brownien": m06MouvementBrownienTemplates,
  "m06-brownien-arithmetique-geometrique": m06BrownienArithmetiqueGeometriqueTemplates,
  "m06-prerequis-ito": m06PrerequisItoTemplates,
  "m06-black-scholes": m06BlackScholesTemplates,
  "m06-formules-call-put": m06FormulesCallPutTemplates,
  "m06-approximation-atmf": m06ApproximationAtmfTemplates,
  "m06-monte-carlo": m06MonteCarloTemplates,
  "m07-greeks-premier-ordre": m07GreeksPremierOrdreTemplates,
  "m07-greeks-second-ordre": m07GreeksSecondOrdreTemplates,
  "m07-greeks-strategies": m07GreeksStrategiesTemplates,
  "m07-delta-hedging": m07DeltaHedgingTemplates,
  "m07-pnl-delta-hedging": m07PnlDeltaHedgingTemplates,
  "m07-vol-target-cppi": m07VolTargetCppiTemplates,
  "m08-volatilite-realisee": m08VolatiliteRealiseeTemplates,
  "m08-volatilite-implicite": m08VolatiliteImpliciteTemplates,
  "m08-skew-smile-surface": m08SkewSmileSurfaceTemplates,
  "m08-formes-skew-smile": m08FormesSkewSmileTemplates,
  "m08-variance-swap": m08VarianceSwapTemplates,
  "m08-vol-locale-stochastique": m08VolLocaleStochastiqueTemplates,
  "m09-correlation-realisee": m09CorrelationRealiseeTemplates,
  "m09-correlation-implicite": m09CorrelationImpliciteTemplates,
  "m09-dispersion": m09DispersionTemplates,
  "m09-panier-worst-best-of": m09PanierWorstBestOfTemplates,
  "m09-sensibilites-payoff": m09SensibilitesPayoffTemplates,
  "m10-mecanismes-barrieres": m10MecanismesBarrieresTemplates,
  "m10-greeks-barrieres": m10GreeksBarrieresTemplates,
  "m10-barrier-parity": m10BarrierParityTemplates,
  "m10-pdi": m10PdiTemplates,
  "m10-impact-vol-knockout": m10ImpactVolKnockoutTemplates,
  "m10-doubles-barrieres": m10DoublesBarrieresTemplates,
  "m10-options-digitales": m10OptionsDigitalesTemplates,
  "m10-replication-digitale": m10ReplicationDigitaleTemplates,
  "m10-lissage-delta-gamma": m10LissageDeltaGammaTemplates,
  "m11-produit-structure": m11ProduitStructureTemplates,
  "m11-autocall": m11AutocallTemplates,
  "m11-augmenter-coupon": m11AugmenterCouponTemplates,
  "m11-greeks-autocall": m11GreeksAutocallTemplates,
  "m11-modeles-pricing-autocall": m11ModelesPricingAutocallTemplates,
  "m12-regression-lineaire": m12RegressionLineaireTemplates,
  "m12-regression-logistique": m12RegressionLogistiqueTemplates,
  "m12-arbres-forets": m12ArbresForetsTemplates,
  "m12-series-temporelles": m12SeriesTemporellesTemplates,
  "m12-knn-svm": m12KnnSvmTemplates,
  "m12-deep-learning-intro": m12DeepLearningIntroTemplates,
  "m12-methodologie-ml": m12MethodologieMlTemplates,
  "m13-interets-composes": m13InteretsComposesTemplates,
  "m13-actualisation-annuites": m13ActualisationAnnuitesTemplates,
  "m13-dcf-comparables": m13DcfComparablesTemplates,
  "m13-covariance-diversification": m13CovarianceDiversificationTemplates,
  "m13-markowitz-frontiere": m13MarkowitzFrontiereTemplates,
  "m13-capm-sml": m13CapmSmlTemplates,
  "m13-allocation-attribution": m13AllocationAttributionTemplates,
  "m13-var-es-stress": m13VarEsStressTemplates,
  "m13-drawdown-ulcer": m13DrawdownUlcerTemplates,
  "m13-ratios-risque-ajuste": m13RatiosRisqueAjusteTemplates,
  "m13-typologie-risques": m13TypologieRisquesTemplates,
  "m13-ordres-levier-marge": m13OrdresLevierMargeTemplates,
  "m13-market-making-momentum": m13MarketMakingMomentumTemplates,
  "m13-backtesting-biais": m13BacktestingBiaisTemplates,
  "m13-bale": m13BaleTemplates,
  "m13-mifid-emir-kyc": m13MifidEmirKycTemplates,
  "m13-programmation-finance": m13ProgrammationFinanceTemplates,
  "m13-entretiens-techniques": m13EntretiensTechniquesTemplates,
  "m13-entretiens-cas-brainteasers": m13EntretiensCasBrainteasersTemplates,
};

const allTemplates: QuestionTemplate[] = Object.values(templatesByConceptId).flat();

export const templateById: Record<string, QuestionTemplate> = Object.fromEntries(allTemplates.map((t) => [t.id, t]));

export function getPublishedConceptIds(): string[] {
  return Object.keys(lessonsByConceptId);
}

export function getTemplatesForConcepts(conceptIds: string[]): QuestionTemplate[] {
  return conceptIds.flatMap((id) => templatesByConceptId[id] ?? []);
}
