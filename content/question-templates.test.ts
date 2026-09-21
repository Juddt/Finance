import { describe, expect, it } from "vitest";
import { templatesByConceptId } from "@/lib/content-registry";
import { instantiateTemplate } from "@/lib/question-templates";
import { mulberry32 } from "@/lib/prng";

const allTemplates = Object.values(templatesByConceptId).flat();

describe("question templates", () => {
  it("registers at least one template per published concept", () => {
    for (const [conceptId, templates] of Object.entries(templatesByConceptId)) {
      expect(templates.length, `no templates for ${conceptId}`).toBeGreaterThan(0);
    }
  });

  it("has unique template ids", () => {
    const ids = allTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const template of allTemplates) {
    describe(template.id, () => {
      it("is deterministic for a given seed", () => {
        const a = instantiateTemplate(template, mulberry32(123), "x");
        const b = instantiateTemplate(template, mulberry32(123), "x");
        expect(a).toEqual(b);
      });

      it("produces a structurally valid question across many seeds", () => {
        for (let seed = 0; seed < 30; seed++) {
          const q = instantiateTemplate(template, mulberry32(seed), `${template.id}:${seed}`);
          expect(q.kind).toBe(template.kind);
          expect(q.conceptId).toBe(template.conceptId);
          expect(q.prompt.fr.length).toBeGreaterThan(0);
          expect(q.prompt.en.length).toBeGreaterThan(0);
          expect(q.explanation.fr.length).toBeGreaterThan(0);
          expect(q.explanation.en.length).toBeGreaterThan(0);
          expect(q.commonMistake.fr.length).toBeGreaterThan(0);
          expect(q.commonMistake.en.length).toBeGreaterThan(0);

          if (q.kind === "mcq" || q.kind === "true_false") {
            expect(q.choices && q.choices.length).toBeGreaterThanOrEqual(2);
            expect(q.correctChoiceIds && q.correctChoiceIds.length).toBeGreaterThan(0);
            const choiceIds = new Set((q.choices ?? []).map((c) => c.id));
            for (const correctId of q.correctChoiceIds ?? []) {
              expect(choiceIds.has(correctId)).toBe(true);
            }
          }

          // Standard "uniformise tous les quiz" (voir demande) : tout QCM doit avoir
          // exactement 4 choix distincts, une seule bonne réponse, des longueurs homogènes,
          // aucune formule fourre-tout ("toutes les réponses"...), et une explication par
          // proposition fausse. Ne s'applique pas encore à numeric/true_false/fill_blank —
          // ces kinds sont en cours de conversion et disparaîtront du standard une fois la
          // migration terminée (voir lib/question-template-kit.ts, trueFalseTemplate/
          // fillBlankTemplate marqués @deprecated).
          if (q.kind === "mcq") {
            const choices = q.choices ?? [];
            expect(choices.length, "un QCM doit avoir exactement 4 choix").toBe(4);
            expect(q.correctChoiceIds?.length, "une seule bonne réponse").toBe(1);
            const correctId = q.correctChoiceIds![0];
            const wrongIds = choices.map((c) => c.id).filter((id) => id !== correctId);
            expect(wrongIds.length).toBe(3);

            const forbidden = /toutes les réponses|aucune de ces réponses|aucune des réponses|toutes ci-dessus|all of the above|none of the above|\ba et b\b|\bb et c\b|\ba, b et c\b|\ba and b\b/i;
            for (const locale of ["fr", "en"] as const) {
              const labels = choices.map((c) => c.label[locale].trim());
              for (const label of labels) {
                expect(label.length, `choix vide (${locale})`).toBeGreaterThan(0);
                expect(label, `formule fourre-tout interdite (${locale}): "${label}"`).not.toMatch(forbidden);
              }
              const normalized = labels.map((l) => l.toLowerCase());
              expect(new Set(normalized).size, `choix en double (${locale}): ${labels.join(" | ")}`).toBe(labels.length);
              const lengths = labels.map((l) => l.length);
              const minLen = Math.min(...lengths);
              const maxLen = Math.max(...lengths);
              if (minLen >= 3) {
                expect(maxLen / minLen, `longueurs trop hétérogènes (${locale}): ${labels.join(" | ")}`).toBeLessThanOrEqual(2.5);
              }
            }

            expect(q.distractorRationale, "distractorRationale requis pour un QCM").toBeDefined();
            const rationaleKeys = Object.keys(q.distractorRationale ?? {}).sort();
            expect(rationaleKeys, "distractorRationale doit couvrir exactement les 3 mauvaises réponses").toEqual([...wrongIds].sort());
            for (const wrongId of wrongIds) {
              const rationale = q.distractorRationale![wrongId];
              expect(rationale?.fr.length, `distractorRationale.${wrongId}.fr vide`).toBeGreaterThan(0);
              expect(rationale?.en.length, `distractorRationale.${wrongId}.en vide`).toBeGreaterThan(0);
            }
          }

          if (q.kind === "numeric") {
            expect(q.numeric).toBeDefined();
            expect(Number.isFinite(q.numeric!.value)).toBe(true);
            expect(q.numeric!.tolerance).toBeGreaterThan(0);
          }

          if (q.kind === "fill_blank") {
            expect(q.acceptedAnswers && q.acceptedAnswers.length).toBeGreaterThan(0);
          }
        }
      });
    });
  }
});
