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
