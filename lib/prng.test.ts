import { describe, expect, it } from "vitest";
import { mulberry32, pick, randomFloat, randomInt, shuffle } from "./prng";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBeCloseTo(b(), 10);
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("randomInt / randomFloat / pick / shuffle", () => {
  it("randomInt stays within bounds inclusive", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 500; i++) {
      const v = randomInt(rng, 5, 8);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(8);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("randomFloat respects decimals", () => {
    const rng = mulberry32(9);
    const v = randomFloat(rng, 0, 1, 4);
    expect(v.toString().replace(/^-?\d*\./, "").length).toBeLessThanOrEqual(4);
  });

  it("pick returns an element from the array", () => {
    const rng = mulberry32(11);
    const items = ["a", "b", "c"];
    for (let i = 0; i < 20; i++) {
      expect(items).toContain(pick(rng, items));
    }
  });

  it("shuffle is a permutation and does not mutate the input", () => {
    const rng = mulberry32(5);
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(rng, input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual(input);
  });
});
