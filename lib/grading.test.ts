import { describe, expect, it } from "vitest";
import { gradeAnswer, parseLocaleNumber } from "./grading";
import type { QuestionSolution } from "./question-types";

describe("parseLocaleNumber", () => {
  it("parses French decimal comma", () => {
    expect(parseLocaleNumber("5,2")).toBeCloseTo(5.2);
  });

  it("parses English decimal point", () => {
    expect(parseLocaleNumber("5.2")).toBeCloseTo(5.2);
  });

  it("distinguishes 5% from 5 as a decimal value", () => {
    expect(parseLocaleNumber("5%")).toBeCloseTo(0.05);
    expect(parseLocaleNumber("5")).toBeCloseTo(5);
  });

  it("rejects non-numeric input", () => {
    expect(() => parseLocaleNumber("abc")).toThrow(RangeError);
  });
});

describe("gradeAnswer", () => {
  const mcqSolution: QuestionSolution = {
    questionId: "q1",
    kind: "mcq",
    correctChoiceIds: ["zero"],
    explanation: { fr: "", en: "" },
    commonMistake: { fr: "", en: "" },
  };

  it("grades an mcq answer server-side regardless of option order", () => {
    expect(gradeAnswer(mcqSolution, { kind: "mcq", choiceId: "zero" }).isCorrect).toBe(true);
    expect(gradeAnswer(mcqSolution, { kind: "mcq", choiceId: "spot" }).isCorrect).toBe(false);
  });

  const numericSolution: QuestionSolution = {
    questionId: "q2",
    kind: "numeric",
    numeric: { value: 0.0199, tolerance: 0.0005 },
    explanation: { fr: "", en: "" },
    commonMistake: { fr: "", en: "" },
  };

  it("grades a numeric answer within tolerance", () => {
    expect(gradeAnswer(numericSolution, { kind: "numeric", value: 0.0199 }).isCorrect).toBe(true);
    expect(gradeAnswer(numericSolution, { kind: "numeric", value: 0.0201 }).isCorrect).toBe(true);
    expect(gradeAnswer(numericSolution, { kind: "numeric", value: 0.03 }).isCorrect).toBe(false);
  });

  it("rejects mismatched answer/question kinds", () => {
    expect(() => gradeAnswer(mcqSolution, { kind: "numeric", value: 1 })).toThrow(RangeError);
  });
});
