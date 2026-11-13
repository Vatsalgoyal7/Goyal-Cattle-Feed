/**
 * Goyal Cattle Feed Store - Dual Unit Conversion Utility
 * Converts between 50kg Bags, Quintals, and Metric Tonnes for raw grains & finished feed.
 */

export interface DualUnitResult {
  bags: number;
  quintals: number;
  tonnes: number;
  totalKg: number;
}

export function convertBagsToBulk(bags: number, bagWeightKg = 50): DualUnitResult {
  const totalKg = bags * bagWeightKg;
  const quintals = totalKg / 100;
  const tonnes = totalKg / 1000;
  return { bags, quintals, tonnes, totalKg };
}

export function convertQuintalsToBags(quintals: number, bagWeightKg = 50): DualUnitResult {
  const totalKg = quintals * 100;
  const bags = Math.floor(totalKg / bagWeightKg);
  const tonnes = totalKg / 1000;
  return { bags, quintals, tonnes, totalKg };
}

export function calculateGrainMillingYield(
  rawGrainQtl: number,
  millingRecoveryPct = 96,
  bagWeightKg = 50
) {
  const usableKg = rawGrainQtl * 100 * (millingRecoveryPct / 100);
  const finishedBags = Math.floor(usableKg / bagWeightKg);
  const byproductKg = (rawGrainQtl * 100) - usableKg;
  return {
    rawGrainQtl,
    usableKg,
    finishedBags,
    byproductKg,
    lossPct: 100 - millingRecoveryPct,
  };
}
