import { describe, expect, it } from "vitest";
import { detectDifficultyShift, pickNextTemplate, resolveTargetDifficulty, type SessionAnswerRecord } from "./adaptive-quiz";
import { mulberry32 } from "./prng";
import type { QuestionTemplate } from "./question-templates";

function makeTemplate(id: string, difficulty: "easy" | "medium" | "hard"): QuestionTemplate {
  return {
    id,
    conceptId: "c1",
    kind: "true_false",
    difficulty,
    generate: () => ({
      prompt: { fr: id, en: id },
      correctChoiceIds: ["true"],
      explanation: { fr: "", en: "" },
      commonMistake: { fr: "", en: "" },
    }),
  };
}

describe("resolveTargetDifficulty", () => {
  it("starts at medium with no history", () => {
    expect(resolveTargetDifficulty([])).toBe("medium");
  });

  it("drops to easy after two consecutive wrong answers", () => {
    const answered: SessionAnswerRecord[] = [
      { templateId: "a", isCorrect: false, difficulty: "medium" },
      { templateId: "b", isCorrect: false, difficulty: "medium" },
    ];
    expect(resolveTargetDifficulty(answered)).toBe("easy");
  });

  it("rises to hard after three consecutive correct answers", () => {
    const answered: SessionAnswerRecord[] = [
      { templateId: "a", isCorrect: true, difficulty: "medium" },
      { templateId: "b", isCorrect: true, difficulty: "medium" },
      { templateId: "c", isCorrect: true, difficulty: "medium" },
    ];
    expect(resolveTargetDifficulty(answered)).toBe("hard");
  });

  it("stays at the last difficulty otherwise", () => {
    const answered: SessionAnswerRecord[] = [
      { templateId: "a", isCorrect: true, difficulty: "hard" },
      { templateId: "b", isCorrect: false, difficulty: "hard" },
    ];
    expect(resolveTargetDifficulty(answered)).toBe("hard");
  });

  it("does not drop to easy on a single wrong answer", () => {
    const answered: SessionAnswerRecord[] = [
      { templateId: "a", isCorrect: true, difficulty: "medium" },
      { templateId: "b", isCorrect: false, difficulty: "medium" },
    ];
    expect(resolveTargetDifficulty(answered)).toBe("medium");
  });
});

describe("detectDifficultyShift", () => {
  it("detects an upward shift", () => {
    expect(detectDifficultyShift("medium", "hard")).toBe("up");
  });
  it("detects a downward shift", () => {
    expect(detectDifficultyShift("medium", "easy")).toBe("down");
  });
  it("detects no shift", () => {
    expect(detectDifficultyShift("medium", "medium")).toBeNull();
  });
});

describe("pickNextTemplate", () => {
  const pool = [makeTemplate("e1", "easy"), makeTemplate("m1", "medium"), makeTemplate("h1", "hard")];

  it("picks a template at the target difficulty", () => {
    const answered: SessionAnswerRecord[] = [
      { templateId: "m1", isCorrect: false, difficulty: "medium" },
      { templateId: "e1", isCorrect: false, difficulty: "medium" },
    ];
    const rng = mulberry32(1);
    const picked = pickNextTemplate(pool, answered, rng);
    expect(picked.difficulty).toBe("easy");
  });

  it("falls back to the whole pool if no template matches the target difficulty", () => {
    const smallPool = [makeTemplate("m1", "medium"), makeTemplate("m2", "medium")];
    const answered: SessionAnswerRecord[] = [
      { templateId: "m1", isCorrect: true, difficulty: "medium" },
      { templateId: "m2", isCorrect: true, difficulty: "medium" },
      { templateId: "m1", isCorrect: true, difficulty: "medium" },
    ];
    const rng = mulberry32(2);
    const picked = pickNextTemplate(smallPool, answered, rng);
    expect(["m1", "m2"]).toContain(picked.id);
  });

  it("avoids immediately repeating the most recent template when alternatives exist", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 20; i++) {
      const picked = pickNextTemplate(pool, [], rng, ["m1"]);
      expect(picked.id).not.toBe("m1");
    }
  });

  it("allows repeating when the pool has only the excluded template left", () => {
    const singlePool = [makeTemplate("only", "medium")];
    const rng = mulberry32(4);
    const picked = pickNextTemplate(singlePool, [], rng, ["only"]);
    expect(picked.id).toBe("only");
  });
});
