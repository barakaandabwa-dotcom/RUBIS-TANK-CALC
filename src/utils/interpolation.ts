export function linearInterpolate(x: number, x0: number, x1: number, y0: number, y1: number) {
  if (x1 === x0) return y0; // avoid div by zero
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

export function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export type VCFGrid = {
  temps: number[]; // sorted ascending
  densities: number[]; // sorted ascending
  values: number[][]; // rows match temps, cols match densities
};

export function bilinearInterpolateVCF(T: number, rho: number, grid: VCFGrid) {
  const { temps, densities, values } = grid;

  // Find bracketing indices for T and rho
  const findBracket = (arr: number[], val: number) => {
    let i1 = 0;
    let i2 = arr.length - 1;
    // exact match fast path
    const idx = arr.indexOf(val);
    if (idx !== -1) return { i1: idx, i2: idx };

    for (let i = 0; i < arr.length - 1; i++) {
      if (val >= arr[i] && val <= arr[i + 1]) {
        i1 = i;
        i2 = i + 1;
        break;
      }
    }
    return { i1, i2 };
  };

  const { i1: tIdx1, i2: tIdx2 } = findBracket(temps, T);
  const { i1: dIdx1, i2: dIdx2 } = findBracket(densities, rho);

  const T1 = temps[tIdx1];
  const T2 = temps[tIdx2];
  const D1 = densities[dIdx1];
  const D2 = densities[dIdx2];

  // If exact grid point
  if (T1 === T2 && D1 === D2) return values[tIdx1][dIdx1];
  if (T1 === T2) {
    // linear along density
    const V1 = values[tIdx1][dIdx1];
    const V2 = values[tIdx1][dIdx2];
    return linearInterpolate(rho, D1, D2, V1, V2);
  }
  if (D1 === D2) {
    // linear along temperature
    const V1 = values[tIdx1][dIdx1];
    const V2 = values[tIdx2][dIdx1];
    return linearInterpolate(T, T1, T2, V1, V2);
  }

  const V11 = values[tIdx1][dIdx1];
  const V21 = values[tIdx2][dIdx1];
  const V12 = values[tIdx1][dIdx2];
  const V22 = values[tIdx2][dIdx2];

  const denom = (T2 - T1) * (D2 - D1);
  const term11 = V11 * (T2 - T) * (D2 - rho) / denom;
  const term21 = V21 * (T - T1) * (D2 - rho) / denom;
  const term12 = V12 * (T2 - T) * (rho - D1) / denom;
  const term22 = V22 * (T - T1) * (rho - D1) / denom;
  return term11 + term21 + term12 + term22;
}

export function parseVCFCsv(raw: string): VCFGrid {
  const lines = raw.trim().split(/\r?\n/);
  const header = lines[0].split(",").slice(1).map(Number);
  const temps: number[] = [];
  const values: number[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const t = Number(parts[0]);
    temps.push(t);
    const row = parts.slice(1).map(Number);
    values.push(row);
  }
  return { temps, densities: header, values };
}

export type PCFRow = { pressure: number; factor: number };
export function parsePCFCsv(raw: string): PCFRow[] {
  const lines = raw.trim().split(/\r?\n/).slice(1);
  return lines.map((l) => {
    const [p, f] = l.split(",");
    return { pressure: Number(p), factor: Number(f) };
  });
}

export type ThermalRow = { density: number; factor: number };
export function parseThermalCsv(raw: string): ThermalRow[] {
  const lines = raw.trim().split(/\r?\n/).slice(1);
  return lines.map((l) => {
    const [d, f] = l.split(",");
    return { density: Number(d), factor: Number(f) };
  });
}

// Height ↔ Capacity parsing
export type HeightCapacityRow = { height_mm: number; capacity_L: number };
export function parseHeightCapacityCsv(raw: string): HeightCapacityRow[] {
  const lines = raw.trim().split(/\r?\n/);
  const rows = lines.slice(1).map((l) => {
    const [h, c] = l.split(",");
    return { height_mm: Number(h), capacity_L: Number(c) };
  });
  // ensure sorted by height
  return rows.sort((a, b) => a.height_mm - b.height_mm);
}

// Shell Correction Factor table parsing
export type SCFRow = { temperature: number; factor: number };
export function parseSCFCsv(raw: string): SCFRow[] {
  const lines = raw.trim().split(/\r?\n/);
  return lines.slice(1).map((l) => {
    const [t, f] = l.split(",");
    return { temperature: Number(t), factor: Number(f) };
  });
}

// Percent Height table parsing - UPDATED FOR YOUR CSV FORMAT
export type PercentHeightRow = { percent: number; height_mm: number; capacity_L: number };
export function parsePercentHeightCsv(raw: string): PercentHeightRow[] {
  const lines = raw.trim().split(/\r?\n/).slice(1);
  const TOTAL_CAPACITY = 39557; // Liters from tank specs
  
  return lines.filter(Boolean).map((l) => {
    const parts = l.split(",");
    const percent = Number(parts[0]);
    const height_mm = Number(parts[1]);
    // Calculate capacity based on percentage of total capacity
    const capacity_L = (percent / 100) * TOTAL_CAPACITY;
    
    return { percent, height_mm, capacity_L };
  });
}

// Add this helper function for interpolating capacity based on percentage
export function interpolateCapacityFromPercent(percent: number, table: PercentHeightRow[]): number {
  if (table.length === 0) return 0;
  
  // Find exact match first
  const exactMatch = table.find(row => row.percent === percent);
  if (exactMatch) return exactMatch.capacity_L;
  
  // Find the two closest points for interpolation
  let lower = table[0];
  let upper = table[table.length - 1];
  
  for (let i = 0; i < table.length - 1; i++) {
    if (table[i].percent <= percent && table[i + 1].percent >= percent) {
      lower = table[i];
      upper = table[i + 1];
      break;
    }
  }
  
  // Handle edge cases
  if (percent <= lower.percent) return lower.capacity_L;
  if (percent >= upper.percent) return upper.capacity_L;
  
  // Linear interpolation
  return linearInterpolate(percent, lower.percent, upper.percent, lower.capacity_L, upper.capacity_L);
}
