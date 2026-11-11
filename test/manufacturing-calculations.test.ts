import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertUnitQuantity,
  scaleRecipeIngredients,
  calculateProductionOutput,
  calculateProductionCost,
  calculateWeighbridgeNet,
  calculateSalary,
} from '../src/utils/manufacturingCalculations';

test('convertUnitQuantity converts Ton to KG correctly', () => {
  assert.equal(convertUnitQuantity(2.5, 'Ton', 'KG'), 2500);
});

test('convertUnitQuantity converts Quintal to KG and Bags', () => {
  assert.equal(convertUnitQuantity(10, 'Quintal', 'KG'), 1000);
  assert.equal(convertUnitQuantity(10, 'Quintal', 'Bags (50kg)'), 20);
});

test('scaleRecipeIngredients scales proportionally for batch target', () => {
  const baseIngredients = [
    {
      ingredientId: 'raw-1',
      ingredientName: 'Maize',
      quantity: 300,
      percentage: 30,
      estimatedRatePerKg: 22,
      cost: 6600,
    },
    {
      ingredientId: 'raw-2',
      ingredientName: 'Soybean Meal',
      quantity: 200,
      percentage: 20,
      estimatedRatePerKg: 38,
      cost: 7600,
    },
  ];

  // Scale from 1000kg to 5000kg (5x)
  const scaled = scaleRecipeIngredients(baseIngredients, 1000, 5000);
  assert.equal(scaled[0].quantity, 1500);
  assert.equal(scaled[0].cost, 33000);
  assert.equal(scaled[1].quantity, 1000);
  assert.equal(scaled[1].cost, 38000);
});

test('calculateProductionOutput calculates wastage, yield, and bags accurately', () => {
  const output = calculateProductionOutput(1000, 980, 50);
  assert.equal(output.totalInputKg, 1000);
  assert.equal(output.finishedOutputKg, 980);
  assert.equal(output.wastageWeight, 20);
  assert.equal(output.wastagePercentage, 2);
  assert.equal(output.yieldPercentage, 98);
  assert.equal(output.numberOfBags, 19); // 980 / 50 = 19.6 -> 19 whole bags
});

test('calculateProductionCost computes batch total, cost per kg, and cost per 50kg bag', () => {
  const costs = calculateProductionCost(
    25000, // materials
    1500,  // labour
    1200,  // electricity
    800,   // machine
    950,   // packaging
    550,   // allocated
    1000,  // output kg
    50     // bag weight
  );

  assert.equal(costs.totalCost, 30000);
  assert.equal(costs.costPerKg, 30);
  assert.equal(costs.costPerBag, 1500);
});

test('calculateWeighbridgeNet computes accurate net weight and catches errors', () => {
  const valid = calculateWeighbridgeNet(24500, 8500);
  assert.equal(valid.valid, true);
  assert.equal(valid.netKg, 16000);

  const invalid = calculateWeighbridgeNet(5000, 8500);
  assert.equal(invalid.valid, false);
  assert.match(invalid.error || '', /Gross weight cannot be less/);
});

test('calculateSalary handles daily wage, piece-rate loading, and deductions', () => {
  const result = calculateSalary({
    basicSalary: 0,
    dailyWage: 450,
    pieceRatePerBag: 4.5,
    daysPresent: 26,
    daysAbsent: 4,
    overtimeHours: 10,
    overtimeHourlyRate: 75,
    bagsHandled: 800,
    advances: 2000,
    pfEsi: 500,
    bonuses: 1000,
  });

  // wageBase = 450 * 26 = 11700
  // pieceRatePay = 800 * 4.5 = 3600
  // overtimePay = 10 * 75 = 750
  // bonuses = 1000
  // gross = 11700 + 3600 + 750 + 1000 = 17050
  // deductions = 2000 + 500 = 2500
  // netPayable = 17050 - 2500 = 14550
  assert.equal(result.wageBase, 11700);
  assert.equal(result.pieceRatePay, 3600);
  assert.equal(result.overtimePay, 750);
  assert.equal(result.grossEarnings, 17050);
  assert.equal(result.totalDeductions, 2500);
  assert.equal(result.netPayable, 14550);
});
