import vcfCsv from "@/assets/vcf_table.csv?raw";
import pcfCsv from "@/assets/pressure_correction_factors.csv?raw";
import scfCsv from "@/assets/shell_correction_factors.csv?raw";
import heightCsv from "@/assets/height_capacity.csv?raw";
import {
  VCFGrid,
  bilinearInterpolateVCF,
  linearInterpolate,
  parseVCFCsv,
  parsePCFCsv,
  PCFRow,
  parseHeightCapacityCsv,
  HeightCapacityRow,
  parseSCFCsv,
  SCFRow,
} from "./interpolation";

export type Dataset = {
  vcf: VCFGrid;
  pcf: PCFRow[];
  scf: SCFRow[];
  heightCapacity: HeightCapacityRow[];
};

export const DATASET: Dataset = {
  vcf: parseVCFCsv(vcfCsv),
  pcf: parsePCFCsv(pcfCsv),
  scf: parseSCFCsv(scfCsv),
  heightCapacity: parseHeightCapacityCsv(heightCsv),
};

export type CalcInputs = {
  density: number; // kg/L (product density)
  productTemperature: number; // °C (used for VCF)
  shellTemperature: number; // °C (used for SCF exact match)
  heightMm: number; // mm (used to derive reference volume)
  pressure?: number; // bar
};

export type CalcResult = {
  usedDensity: number;
  usedProductTemperature: number;
  usedShellTemperature: number;
  vcf: number; // product temperature factor
  scf: number; // shell correction factor
  referenceVolume: number;
  correctedVolume: number;
  pcf?: number;
  correctedVolumeWithPressure: number;
  mass: number;
  clamped: { density: boolean; temperature: boolean; pressure: boolean; height: boolean };
};

export const RANGES = {
  density: { min: 0.5, max: 0.59 },
  productTemperature: { min: 0.0, max: 30.0 },
  pressure: { min: 10, max: 24 },
  heightMm: { min: 0, max: 1114 },
};

export function lookupVCF(T: number, rho: number, dataset: Dataset = DATASET) {
  return bilinearInterpolateVCF(T, rho, dataset.vcf);
}

export function lookupPCF(pressure: number, dataset: Dataset = DATASET) {
  const rows = dataset.pcf;
  for (const r of rows) if (r.pressure === pressure) return r.factor;
  let lower = rows[0];
  let upper = rows[rows.length - 1];
  for (let i = 0; i < rows.length - 1; i++) {
    if (pressure >= rows[i].pressure && pressure <= rows[i + 1].pressure) {
      lower = rows[i];
      upper = rows[i + 1];
      break;
    }
  }
  return linearInterpolate(
    pressure,
    lower.pressure,
    upper.pressure,
    lower.factor,
    upper.factor
  );
}

export function lookupSCF(shellTemp: number, dataset: Dataset = DATASET) {
  const rows = dataset.scf;
  for (const r of rows) if (r.temperature === shellTemp) return r.factor;
  throw new Error("Shell temperature not found in SCF table. Use a listed temperature from the SCF table.");
}

export function lookupReferenceVolumeFromHeight(heightMm: number, dataset: Dataset = DATASET) {
  const hmm = heightMm; // already in mm
  const rows = dataset.heightCapacity;
  if (rows.length === 0) throw new Error("Height-capacity table is empty.");
  if (hmm <= rows[0].height_mm) return rows[0].capacity_L;
  if (hmm >= rows[rows.length - 1].height_mm) return rows[rows.length - 1].capacity_L;
  // find bounds
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (hmm >= a.height_mm && hmm <= b.height_mm) {
      if (a.height_mm === b.height_mm) return a.capacity_L;
      return linearInterpolate(hmm, a.height_mm, b.height_mm, a.capacity_L, b.capacity_L);
    }
  }
  return rows[rows.length - 1].capacity_L;
}

export function calculate(inputs: CalcInputs, dataset: Dataset = DATASET): CalcResult {
  const usedDensity = inputs.density;
  const usedProductTemperature = inputs.productTemperature;
  const usedShellTemperature = inputs.shellTemperature;
  const usedPressure = inputs.pressure ?? 17;

  const clamped = { density: false, temperature: false, pressure: false, height: false };

  const dMin = RANGES.density.min, dMax = RANGES.density.max;
  const tMin = RANGES.productTemperature.min, tMax = RANGES.productTemperature.max;
  const pMin = RANGES.pressure.min, pMax = RANGES.pressure.max;
  const hMin = RANGES.heightMm.min, hMax = RANGES.heightMm.max;

  // basic validation
  if (usedDensity < dMin || usedDensity > dMax) {
    throw new Error("Product density out of supported range.");
  }
  if (usedProductTemperature < tMin || usedProductTemperature > tMax) {
    throw new Error("Product temperature out of supported range.");
  }
  if (inputs.heightMm < hMin || inputs.heightMm > hMax) {
    // allow slightly above by relying on table bounds
  }
  if (usedPressure < pMin || usedPressure > pMax) {
    throw new Error("Pressure out of supported range.");
  }

  const vcf = lookupVCF(usedProductTemperature, usedDensity, dataset);
  const scf = lookupSCF(usedShellTemperature, dataset);
  const referenceVolume = lookupReferenceVolumeFromHeight(inputs.heightMm, dataset);

  const pcf = lookupPCF(usedPressure, dataset);

  // Corrected Volume = Reference Volume × VCF × SCF × PCF
  const correctedVolume = referenceVolume * vcf * scf * pcf;
  const correctedVolumeWithPressure = correctedVolume;

  const mass = correctedVolume * usedDensity;

  return {
    usedDensity,
    usedProductTemperature,
    usedShellTemperature,
    vcf,
    scf,
    referenceVolume,
    correctedVolume,
    pcf,
    correctedVolumeWithPressure,
    mass,
    clamped,
  };
}

