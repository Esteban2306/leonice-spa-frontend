import { describe, expect, it } from "vitest";

import {
  fitWithin,
  needsShrinking,
  UPLOAD_MAX_SIDE,
  UPLOAD_SKIP_BYTES,
} from "./prepare-image";

describe("fitWithin", () => {
  it("keeps images that already fit", () => {
    expect(fitWithin(1200, 800)).toEqual({ width: 1200, height: 800 });
  });

  it("scales the longest side down to the limit keeping the ratio", () => {
    expect(fitWithin(4000, 3000)).toEqual({
      width: UPLOAD_MAX_SIDE,
      height: 1200,
    });
    expect(fitWithin(3024, 4032)).toEqual({
      width: 1200,
      height: UPLOAD_MAX_SIDE,
    });
  });
});

describe("needsShrinking", () => {
  it("leaves small, light photos untouched", () => {
    expect(needsShrinking(UPLOAD_SKIP_BYTES, 1600, 1200)).toBe(false);
  });

  it("shrinks heavy or oversized photos", () => {
    expect(needsShrinking(UPLOAD_SKIP_BYTES + 1, 800, 600)).toBe(true);
    expect(needsShrinking(1000, 1601, 900)).toBe(true);
  });
});
