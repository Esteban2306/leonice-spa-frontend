import { describe, expect, it } from "vitest";

import { MAX_VIDEO_BYTES, validateVideoFile } from "./treatment-video";

function fakeFile(type: string, size: number): File {
  return { type, size } as File;
}

describe("validateVideoFile", () => {
  it("acepta MP4, WebM y MOV dentro del límite", () => {
    expect(validateVideoFile(fakeFile("video/mp4", 1024))).toBeNull();
    expect(validateVideoFile(fakeFile("video/quicktime", MAX_VIDEO_BYTES))).toBeNull();
  });

  it("rechaza otros formatos y archivos muy pesados", () => {
    expect(validateVideoFile(fakeFile("image/png", 1024))).toBe("Usa un video MP4, WebM o MOV.");
    expect(validateVideoFile(fakeFile("video/mp4", MAX_VIDEO_BYTES + 1))).toBe("El video pesa más de 100 MB.");
  });
});
