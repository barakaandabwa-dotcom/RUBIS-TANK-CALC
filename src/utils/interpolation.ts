// Replace the existing parsePercentHeightCsv function in your interpolation.ts with this:

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
