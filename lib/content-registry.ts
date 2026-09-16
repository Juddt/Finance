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
};

const allTemplates: QuestionTemplate[] = Object.values(templatesByConceptId).flat();

export const templateById: Record<string, QuestionTemplate> = Object.fromEntries(allTemplates.map((t) => [t.id, t]));

export function getPublishedConceptIds(): string[] {
  return Object.keys(lessonsByConceptId);
}

export function getTemplatesForConcepts(conceptIds: string[]): QuestionTemplate[] {
  return conceptIds.flatMap((id) => templatesByConceptId[id] ?? []);
}
