import { describe, expect, it } from "vitest";
import { calculate } from "@/utils/calculations";

// Acceptance tests

describe("Acceptance tests", () => {
  it("Test 1 — rho=0.550, T=20.0, RV=100, PCF OFF", () => {
    const res = calculate({ density: 0.55, temperature: 20, referenceVolume: 100, applyPressure: false, allowClamp: false });
    expect(res.vcf).toBeCloseTo(1.0, 6);
    expect(res.correctedVolume).toBeCloseTo(100.0, 3);
    expect(res.mass).toBeCloseTo(55.0, 3);
  });

  it("Test 2 — rho=0.540, T=0.0, RV=100, PCF OFF", () => {
    const res = calculate({ density: 0.54, temperature: 0.0, referenceVolume: 100, applyPressure: false, allowClamp: false });
    expect(res.vcf).toBeCloseTo(1.056, 6);
    expect(res.correctedVolume).toBeCloseTo(105.6, 3);
    expect(res.mass).toBeCloseTo(57.024, 3);
  });

  it("Test 3 — rho=0.580, T=30.0, RV=100, PCF OFF", () => {
    const res = calculate({ density: 0.58, temperature: 30.0, referenceVolume: 100, applyPressure: false, allowClamp: false });
    expect(res.vcf).toBeCloseTo(0.978, 6);
    expect(res.correctedVolume).toBeCloseTo(97.8, 3);
    expect(res.mass).toBeCloseTo(56.724, 3);
  });
});

// PCF linear interpolation
import { lookupPCF } from "@/utils/calculations";

describe("PCF interpolation", () => {
  it("interpolates between 17 and 18 bar", () => {
    const p17 = lookupPCF(17);
    const p18 = lookupPCF(18);
    const p175 = lookupPCF(17.5);
    expect(p175).toBeCloseTo((p17 + p18) / 2, 6);
  });
});
