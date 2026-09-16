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
import { m03Dv01 } from "@/content/lessons/m03-dv01";
import { m05CallPut } from "@/content/lessons/m05-call-put";
import { m05ItmAtmOtm } from "@/content/lessons/m05-itm-atm-otm";
import { m05PariteCallPut } from "@/content/lessons/m05-parite-call-put";
import { m05StrategiesClassiques } from "@/content/lessons/m05-strategies-classiques";
import { m04Fra } from "@/content/lessons/m04-fra";
import { m04SwapFixeVariable } from "@/content/lessons/m04-swap-fixe-variable";
import { m04PricingSwap } from "@/content/lessons/m04-pricing-swap";
import { m04MonoMultiCourbe } from "@/content/lessons/m04-mono-multi-courbe";
import { m04Dv01Swap } from "@/content/lessons/m04-dv01-swap";
import { m01OrganisationBanque } from "@/content/lessons/m01-organisation-banque";
import { m01BanquesCentrales } from "@/content/lessons/m01-banques-centrales";
import { m01ClassesActifs } from "@/content/lessons/m01-classes-actifs";
import { m01Arbitrage } from "@/content/lessons/m01-arbitrage";
import { m01VenteDecouvert } from "@/content/lessons/m01-vente-decouvert";
import { m01TauxChange } from "@/content/lessons/m01-taux-change";
import { m01PariteTaux } from "@/content/lessons/m01-parite-taux";
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
import { templates as m03Dv01Templates } from "@/content/question-templates/m03-dv01";
import { templates as m05CallPutTemplates } from "@/content/question-templates/m05-call-put";
import { templates as m05ItmAtmOtmTemplates } from "@/content/question-templates/m05-itm-atm-otm";
import { templates as m05PariteCallPutTemplates } from "@/content/question-templates/m05-parite-call-put";
import { templates as m05StrategiesClassiquesTemplates } from "@/content/question-templates/m05-strategies-classiques";
import { templates as m04FraTemplates } from "@/content/question-templates/m04-fra";
import { templates as m04SwapFixeVariableTemplates } from "@/content/question-templates/m04-swap-fixe-variable";
import { templates as m04PricingSwapTemplates } from "@/content/question-templates/m04-pricing-swap";
import { templates as m04MonoMultiCourbeTemplates } from "@/content/question-templates/m04-mono-multi-courbe";
import { templates as m04Dv01SwapTemplates } from "@/content/question-templates/m04-dv01-swap";
import { templates as m01OrganisationBanqueTemplates } from "@/content/question-templates/m01-organisation-banque";
import { templates as m01BanquesCentralesTemplates } from "@/content/question-templates/m01-banques-centrales";
import { templates as m01ClassesActifsTemplates } from "@/content/question-templates/m01-classes-actifs";
import { templates as m01ArbitrageTemplates } from "@/content/question-templates/m01-arbitrage";
import { templates as m01VenteDecouvertTemplates } from "@/content/question-templates/m01-vente-decouvert";
import { templates as m01TauxChangeTemplates } from "@/content/question-templates/m01-taux-change";
import { templates as m01PariteTauxTemplates } from "@/content/question-templates/m01-parite-taux";
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
  "m03-dv01": m03Dv01,
  "m05-call-put": m05CallPut,
  "m05-itm-atm-otm": m05ItmAtmOtm,
  "m05-parite-call-put": m05PariteCallPut,
  "m05-strategies-classiques": m05StrategiesClassiques,
  "m04-fra": m04Fra,
  "m04-swap-fixe-variable": m04SwapFixeVariable,
  "m04-pricing-swap": m04PricingSwap,
  "m04-mono-multi-courbe": m04MonoMultiCourbe,
  "m04-dv01-swap": m04Dv01Swap,
  "m01-organisation-banque": m01OrganisationBanque,
  "m01-banques-centrales": m01BanquesCentrales,
  "m01-classes-actifs": m01ClassesActifs,
  "m01-arbitrage": m01Arbitrage,
  "m01-vente-decouvert": m01VenteDecouvert,
  "m01-taux-change": m01TauxChange,
  "m01-parite-taux": m01PariteTaux,
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
  "m03-dv01": m03Dv01Templates,
  "m05-call-put": m05CallPutTemplates,
  "m05-itm-atm-otm": m05ItmAtmOtmTemplates,
  "m05-parite-call-put": m05PariteCallPutTemplates,
  "m05-strategies-classiques": m05StrategiesClassiquesTemplates,
  "m04-fra": m04FraTemplates,
  "m04-swap-fixe-variable": m04SwapFixeVariableTemplates,
  "m04-pricing-swap": m04PricingSwapTemplates,
  "m04-mono-multi-courbe": m04MonoMultiCourbeTemplates,
  "m04-dv01-swap": m04Dv01SwapTemplates,
  "m01-organisation-banque": m01OrganisationBanqueTemplates,
  "m01-banques-centrales": m01BanquesCentralesTemplates,
  "m01-classes-actifs": m01ClassesActifsTemplates,
  "m01-arbitrage": m01ArbitrageTemplates,
  "m01-vente-decouvert": m01VenteDecouvertTemplates,
  "m01-taux-change": m01TauxChangeTemplates,
  "m01-parite-taux": m01PariteTauxTemplates,
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
};

const allTemplates: QuestionTemplate[] = Object.values(templatesByConceptId).flat();

export const templateById: Record<string, QuestionTemplate> = Object.fromEntries(allTemplates.map((t) => [t.id, t]));

export function getPublishedConceptIds(): string[] {
  return Object.keys(lessonsByConceptId);
}

export function getTemplatesForConcepts(conceptIds: string[]): QuestionTemplate[] {
  return conceptIds.flatMap((id) => templatesByConceptId[id] ?? []);
}
