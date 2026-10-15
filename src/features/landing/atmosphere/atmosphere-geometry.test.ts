import { describe, expect, it } from "vitest";

import { branch, LEAF_PATH, strandBundle } from "@/src/features/landing/atmosphere/atmosphere-geometry";

describe("strandBundle", () => {
  const spec = { from: [0, 100], c1: [300, 0], c2: [900, 200], to: [1440, 100], count: 5, spread: 6 } as const;

  it("draws one cubic path per strand", () => {
    const paths = strandBundle(spec);
    expect(paths).toHaveLength(5);
    paths.forEach((path) => expect(path).toMatch(/^M[-\d. ]+C[-\d. ]+$/));
  });

  it("keeps the middle strand on the base curve", () => {
    expect(strandBundle(spec)[2]).toBe("M0 100C300 0 900 200 1440 100");
  });

  it("splays the strands apart toward the tip", () => {
    const [first, , , , last] = strandBundle(spec);
    const tipY = (path: string) => Number(path.trim().split(" ").at(-1));
    expect(tipY(last) - tipY(first)).toBeGreaterThan(40);
  });
});

describe("branch", () => {
  const spec = { origin: [400, 0], angle: 180, length: 300, leaves: 4, size: 1, bend: 0 } as const;

  it("runs the stem from the origin to the length along the angle", () => {
    expect(branch(spec).stem).toBe("M400 0Q250 0 100 0");
  });

  it("alternates leaves on both sides and shrinks them toward the tip", () => {
    const { leaves } = branch(spec);
    expect(leaves).toHaveLength(4);
    leaves.forEach((leaf) => expect(leaf.d).toBe(LEAF_PATH));
    expect(leaves[0].transform).toContain("rotate(218)");
    expect(leaves[1].transform).toContain("rotate(142)");
    const scale = (transform: string) => Number(/scale\(([\d.]+)\)/.exec(transform)?.[1]);
    expect(scale(leaves[3].transform)).toBeLessThan(scale(leaves[0].transform));
  });
});
