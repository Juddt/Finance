import type { LessonContent } from "./lesson-types";
import type { QuestionTemplate } from "./question-templates";
import { m02CouvertureForward } from "@/content/lessons/m02-couverture-forward";
import { m02ForwardContractValue } from "@/content/lessons/m02-forward-contract-value";
import { m03Duration } from "@/content/lessons/m03-duration";
import { m03RisqueCredit } from "@/content/lessons/m03-risque-credit";
import { m05CallPut } from "@/content/lessons/m05-call-put";
import { templates as m02CouvertureForwardTemplates } from "@/content/question-templates/m02-couverture-forward";
import { templates as m02ForwardContractValueTemplates } from "@/content/question-templates/m02-forward-contract-value";
import { templates as m03DurationTemplates } from "@/content/question-templates/m03-duration";
import { templates as m03RisqueCreditTemplates } from "@/content/question-templates/m03-risque-credit";
import { templates as m05CallPutTemplates } from "@/content/question-templates/m05-call-put";

/**
 * Registre des contenus publiés. Ajouter une entrée ici (leçon + templates de
 * questions) pour chaque nouveau concept rédigé et validé (voir doc section 8,
 * "publication progressive").
 */
export const lessonsByConceptId: Record<string, LessonContent> = {
  "m02-forward-contract-value": m02ForwardContractValue,
  "m02-couverture-forward": m02CouvertureForward,
  "m03-duration": m03Duration,
  "m03-risque-credit": m03RisqueCredit,
  "m05-call-put": m05CallPut,
};

export const templatesByConceptId: Record<string, QuestionTemplate[]> = {
  "m02-forward-contract-value": m02ForwardContractValueTemplates,
  "m02-couverture-forward": m02CouvertureForwardTemplates,
  "m03-duration": m03DurationTemplates,
  "m03-risque-credit": m03RisqueCreditTemplates,
  "m05-call-put": m05CallPutTemplates,
};

const allTemplates: QuestionTemplate[] = Object.values(templatesByConceptId).flat();

export const templateById: Record<string, QuestionTemplate> = Object.fromEntries(allTemplates.map((t) => [t.id, t]));

export function getPublishedConceptIds(): string[] {
  return Object.keys(lessonsByConceptId);
}

export function getTemplatesForConcepts(conceptIds: string[]): QuestionTemplate[] {
  return conceptIds.flatMap((id) => templatesByConceptId[id] ?? []);
}
