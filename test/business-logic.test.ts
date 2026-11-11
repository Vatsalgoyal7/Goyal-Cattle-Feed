import test from 'node:test';
import assert from 'node:assert/strict';
import { formatIndianCurrency, formatCompactNumber } from '../src/data/sampleData.ts';

test('formatIndianCurrency formats numbers according to Indian grouping', () => {
  assert.equal(formatIndianCurrency(125000), '₹1,25,000.00');
  assert.equal(formatIndianCurrency(485200), '₹4,85,200.00');
  assert.equal(formatIndianCurrency(8460000), '₹84,60,000.00');
  assert.equal(formatIndianCurrency(500), '₹500.00');
});

test('formatCompactNumber formats Lakh and Cr representations', () => {
  assert.equal(formatCompactNumber(3500000), '₹35.00 Lakh');
  assert.equal(formatCompactNumber(14000000), '₹1.40 Cr');
  assert.equal(formatCompactNumber(12500), '₹12.5k');
});

test('GST calculation forward and reverse math', () => {
  const baseAmount = 10000;
  const gstRate = 5;

  // Forward: Add 5% GST
  const gstAdd = (baseAmount * gstRate) / 100;
  const total = baseAmount + gstAdd;
  assert.equal(gstAdd, 500);
  assert.equal(total, 10500);

  // Reverse: From gross 10500 with 5% GST
  const reverseNet = (total * 100) / (100 + gstRate);
  assert.equal(Math.round(reverseNet), 10000);
});

test('Quantity x Rate calculation for feed bags', () => {
  const bags = 140;
  const ratePerBag = 1680;
  const total = bags * ratePerBag;
  assert.equal(total, 235200);
});

test('Weight conversion logic', () => {
  // 100 bags (50kg each) = 5 MT
  const bags = 100;
  const mt = bags * 0.05;
  assert.equal(mt, 5.0);

  // 1 MT = 20 Bags (50kg)
  const bagsFromMt = 5 * 20;
  assert.equal(bagsFromMt, 100);
});

test('Margin and Markup calculation', () => {
  const cost = 1420;
  const sale = 1680;
  const profit = sale - cost;
  assert.equal(profit, 260);

  const marginPct = (profit / sale) * 100;
  const markupPct = (profit / cost) * 100;

  assert.ok(marginPct > 15 && marginPct < 16); // ~15.48%
  assert.ok(markupPct > 18 && markupPct < 19); // ~18.31%
});
