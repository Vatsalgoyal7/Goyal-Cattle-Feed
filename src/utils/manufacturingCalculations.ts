/**
 * Manufacturing, Inventory & Operations Calculations Engine
 * Goyal Cattle Feed Pvt. Ltd. - Goyal Business OS
 */

import { RecipeIngredient } from '../types';

/**
 * Standard cattle feed unit conversions
 * Base internal unit is KG.
 * 1 Ton = 1000 KG
 * 1 Quintal = 100 KG
 * 1 Bag = standard 50 KG (or 25 KG)
 */
export function convertUnitQuantity(
  qty: number,
  fromUnit: string,
  toUnit: string,
  bagWeightKg = 50
): number {
  if (qty <= 0 || fromUnit === toUnit) return Number(qty.toFixed(2));

  // Convert fromUnit to KG
  let qtyInKg = qty;
  switch (fromUnit) {
    case 'Ton':
    case 'MT':
      qtyInKg = qty * 1000;
      break;
    case 'Quintal':
    case 'QTL':
      qtyInKg = qty * 100;
      break;
    case 'Bags (50kg)':
      qtyInKg = qty * 50;
      break;
    case 'Bags (25kg)':
      qtyInKg = qty * 25;
      break;
    case 'Bag':
      qtyInKg = qty * bagWeightKg;
      break;
    case 'KG':
    default:
      qtyInKg = qty;
      break;
  }

  // Convert KG to toUnit
  let result = qtyInKg;
  switch (toUnit) {
    case 'Ton':
    case 'MT':
      result = qtyInKg / 1000;
      break;
    case 'Quintal':
    case 'QTL':
      result = qtyInKg / 100;
      break;
    case 'Bags (50kg)':
      result = qtyInKg / 50;
      break;
    case 'Bags (25kg)':
      result = qtyInKg / 25;
      break;
    case 'Bag':
      result = qtyInKg / bagWeightKg;
      break;
    case 'KG':
    default:
      result = qtyInKg;
      break;
  }

  return Number(result.toFixed(2));
}

/**
 * Scales recipe formulation proportionally for a target output in KG
 */
export function scaleRecipeIngredients(
  ingredients: RecipeIngredient[],
  baseBatchKg: number,
  targetOutputKg: number
) {
  if (baseBatchKg <= 0 || targetOutputKg <= 0) return ingredients;
  const ratio = targetOutputKg / baseBatchKg;

  return ingredients.map((ing) => {
    const scaledQty = Number((ing.quantity * ratio).toFixed(2));
    const scaledCost = Number((scaledQty * ing.estimatedRatePerKg).toFixed(2));
    return {
      ...ing,
      quantity: scaledQty,
      cost: scaledCost,
    };
  });
}

/**
 * Calculates production output, wastage, and yield percentages
 */
export function calculateProductionOutput(
  totalInputKg: number,
  finishedOutputKg: number,
  bagWeightKg = 50
) {
  const safeInput = Math.max(0, totalInputKg);
  const safeOutput = Math.max(0, finishedOutputKg);
  const wastageWeight = Number(Math.max(0, safeInput - safeOutput).toFixed(2));
  const wastagePercentage = safeInput > 0 ? Number(((wastageWeight / safeInput) * 100).toFixed(2)) : 0;
  const yieldPercentage = safeInput > 0 ? Number(((safeOutput / safeInput) * 100).toFixed(2)) : 0;
  const numberOfBags = bagWeightKg > 0 ? Math.floor(safeOutput / bagWeightKg) : 0;

  return {
    totalInputKg: safeInput,
    finishedOutputKg: safeOutput,
    wastageWeight,
    wastagePercentage,
    yieldPercentage,
    numberOfBags,
  };
}

/**
 * Calculates comprehensive production batch costing
 */
export function calculateProductionCost(
  materialsCost: number,
  labourCost: number,
  electricityCost: number,
  machineCost: number,
  packagingCost: number,
  allocatedExpenses: number,
  finishedOutputKg: number,
  bagWeightKg = 50
) {
  const totalCost = Number(
    (
      materialsCost +
      labourCost +
      electricityCost +
      machineCost +
      packagingCost +
      allocatedExpenses
    ).toFixed(2)
  );

  const costPerKg = finishedOutputKg > 0 ? Number((totalCost / finishedOutputKg).toFixed(2)) : 0;
  const costPerBag = Number((costPerKg * bagWeightKg).toFixed(2));

  return {
    rawMaterialCost: materialsCost,
    materialsCost,
    labourCost,
    electricityCost,
    machineCost,
    packagingCost,
    allocatedExpenses,
    totalCost,
    costPerKg,
    costPerBag,
  };
}

/**
 * Calculates net weight from gross and tare weights for weighbridge
 */
export function calculateWeighbridgeNet(grossKg: number, tareKg: number) {
  if (grossKg < 0 || tareKg < 0) {
    return { netKg: 0, valid: false, error: 'Weight cannot be negative' };
  }
  if (grossKg < tareKg) {
    return {
      netKg: 0,
      valid: false,
      error: 'Gross weight cannot be less than Tare weight (empty vehicle weight)',
    };
  }
  const netKg = Number((grossKg - tareKg).toFixed(2));
  return { netKg, valid: true };
}

/**
 * Calculates monthly or weekly salary with piece-rate and overtime
 */
export function calculateSalary(params: {
  basicSalary: number;
  dailyWage: number;
  pieceRatePerBag: number;
  daysPresent: number;
  daysAbsent: number;
  overtimeHours: number;
  overtimeHourlyRate?: number;
  bagsHandled: number;
  advances: number;
  pfEsi: number;
  bonuses?: number;
}) {
  const {
    basicSalary,
    dailyWage,
    pieceRatePerBag,
    daysPresent,
    overtimeHours,
    overtimeHourlyRate = 80,
    bagsHandled,
    advances,
    pfEsi,
    bonuses = 0,
  } = params;

  // If daily wage worker
  const wageBase = dailyWage > 0 ? dailyWage * daysPresent : basicSalary;

  // Piece-rate loading pay (bags handled)
  const pieceRatePay = bagsHandled > 0 ? bagsHandled * pieceRatePerBag : 0;

  // Overtime pay
  const overtimePay = overtimeHours > 0 ? overtimeHours * overtimeHourlyRate : 0;

  const grossEarnings = Number((wageBase + pieceRatePay + overtimePay + bonuses).toFixed(2));
  const totalDeductions = Number((advances + pfEsi).toFixed(2));
  const netPayable = Number(Math.max(0, grossEarnings - totalDeductions).toFixed(2));

  return {
    wageBase,
    pieceRatePay,
    overtimePay,
    bonuses,
    grossEarnings,
    totalDeductions,
    netPayable,
  };
}
