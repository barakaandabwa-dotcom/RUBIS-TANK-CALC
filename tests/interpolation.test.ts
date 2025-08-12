import { describe, expect, it } from "vitest";
import vcfCsv from "@/assets/vcf_table.csv?raw";
import { bilinearInterpolateVCF, parseVCFCsv } from "@/utils/interpolation";

const grid = parseVCFCsv(vcfCsv);

describe("VCF bilinear interpolation", () => {
  it("returns exact grid value", () => {
    const v = bilinearInterpolateVCF(20.0, 0.55, grid);
    expect(v).toBeCloseTo(1.0, 6);
  });

  it("interpolates between temps at fixed density", () => {
    const v1 = bilinearInterpolateVCF(20.0, 0.55, grid);
    const v2 = bilinearInterpolateVCF(21.0, 0.55, grid);
    const mid = bilinearInterpolateVCF(20.5, 0.55, grid);
    expect(mid).toBeCloseTo((v1 + v2) / 2, 6);
  });

  it("interpolates between densities at fixed temp", () => {
    const v1 = bilinearInterpolateVCF(20.0, 0.54, grid);
    const v2 = bilinearInterpolateVCF(20.0, 0.55, grid);
    const mid = bilinearInterpolateVCF(20.0, 0.545, grid);
    expect(mid).toBeCloseTo((v1 + v2) / 2, 6);
  });
});
