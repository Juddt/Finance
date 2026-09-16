import { describe, expect, it } from "vitest";
import { deriveConceptStatus, INTERVAL_DAYS, scheduleReview, type ReviewState } from "./srs";

describe("scheduleReview", () => {
  const t0 = new Date("2026-09-16T08:00:00Z");

  it("schedules the first success at step 1", () => {
    const first = scheduleReview(null, true, t0);
    expect(first.progress.step).toBe(1);
    expect(first.progress.dueAt).toBe("2026-09-17T08:00:00.000Z");
    expect(first.requeueAtSessionEnd).toBe(false);
  });

  it("advances through intervals on successive on-time successes", () => {
    const first = scheduleReview(null, true, t0);
    const second = scheduleReview(first.progress, true, new Date("2026-09-17T08:00:00Z"));
    expect(second.progress.step).toBe(2);
    expect(second.progress.dueAt).toBe("2026-09-20T08:00:00.000Z");
  });

  it("does not inflate mastery on an early review before the due date", () => {
    const first = scheduleReview(null, true, t0);
    const second = scheduleReview(first.progress, true, new Date("2026-09-17T08:00:00Z"));
    const early = scheduleReview(second.progress, true, new Date("2026-09-18T08:00:00Z"));
    expect(early.progress).toEqual(second.progress);
  });

  it("resets to step 0 and requeues at session end on failure", () => {
    const first = scheduleReview(null, true, t0);
    const second = scheduleReview(first.progress, true, new Date("2026-09-17T08:00:00Z"));
    const failed = scheduleReview(second.progress, false, new Date("2026-09-20T08:00:00Z"));
    expect(failed.progress.step).toBe(0);
    expect(failed.progress.lapses).toBe(1);
    expect(failed.progress.dueAt).toBe("2026-09-21T08:00:00.000Z");
    expect(failed.requeueAtSessionEnd).toBe(true);
  });

  it("does not count an immediate retry the same day as a second success", () => {
    const first = scheduleReview(null, true, t0);
    const second = scheduleReview(first.progress, true, new Date("2026-09-17T08:00:00Z"));
    const failed = scheduleReview(second.progress, false, new Date("2026-09-20T08:00:00Z"));
    const immediateRetry = scheduleReview(failed.progress, true, new Date("2026-09-20T08:02:00Z"));
    expect(immediateRetry.progress).toEqual(failed.progress);
  });

  it("caps the step at the last interval for a mature card", () => {
    const mature = scheduleReview({ step: 6, dueAt: null, lastStudyDay: null, lapses: 0 }, true, t0);
    expect(mature.progress.step).toBe(6);
    expect(mature.progress.dueAt).toBe("2026-11-15T08:00:00.000Z");
  });

  it("uses the last interval for any step beyond the table length", () => {
    expect(INTERVAL_DAYS[INTERVAL_DAYS.length - 1]).toBe(60);
  });

  it("rejects invalid input types and ranges", () => {
    expect(() => scheduleReview(null, "true" as unknown as boolean, t0)).toThrow(TypeError);
    expect(() => scheduleReview(null, true, new Date("invalid"))).toThrow(TypeError);
    expect(() => scheduleReview({ step: 7, dueAt: null, lastStudyDay: null, lapses: 0 }, true, t0)).toThrow(RangeError);
    expect(() => scheduleReview({ step: 0, dueAt: null, lastStudyDay: null, lapses: -1 }, true, t0)).toThrow(RangeError);
    expect(() =>
      scheduleReview({ step: 0, dueAt: "invalid", lastStudyDay: null, lapses: 0 }, true, t0)
    ).toThrow(TypeError);
  });
});

describe("deriveConceptStatus", () => {
  const now = new Date("2026-09-16T08:00:00Z");

  it("is to-discover with no cards", () => {
    expect(deriveConceptStatus([], now)).toBe("to-discover");
  });

  it("is fragile right after a lapse", () => {
    const cards: ReviewState[] = [{ step: 0, dueAt: "2026-09-17T08:00:00.000Z", lastStudyDay: "2026-09-16", lapses: 1 }];
    expect(deriveConceptStatus(cards, now)).toBe("fragile");
  });

  it("is mastered once multiple cards reached the mature step", () => {
    const cards: ReviewState[] = [
      { step: 4, dueAt: "2026-10-16T08:00:00.000Z", lastStudyDay: "2026-09-16", lapses: 0 },
      { step: 5, dueAt: "2026-10-16T08:00:00.000Z", lastStudyDay: "2026-09-16", lapses: 0 },
    ];
    expect(deriveConceptStatus(cards, now)).toBe("mastered");
  });

  it("is to-reactivate when overdue by more than a week", () => {
    const cards: ReviewState[] = [{ step: 2, dueAt: "2026-09-01T08:00:00.000Z", lastStudyDay: "2026-08-20", lapses: 0 }];
    expect(deriveConceptStatus(cards, now)).toBe("to-reactivate");
  });
});
