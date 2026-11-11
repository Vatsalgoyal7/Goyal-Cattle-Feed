import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calculator as CalcIcon,
  Percent,
  Receipt,
  Scale,
  TrendingUp,
  RotateCcw,
  Equal,
  Delete,
  Layers,
} from 'lucide-react';
import { formatIndianCurrency } from '../../data/sampleData';

type CalcTab = 'standard' | 'gst' | 'discount' | 'qty_rate' | 'weight' | 'margin';

export const FloatingCalculator: React.FC = () => {
  const { isCalculatorOpen, setIsCalculatorOpen } = useApp();
  const [activeTab, setActiveTab] = useState<CalcTab>('standard');

  // Standard Calc state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // GST Calc state
  const [gstAmount, setGstAmount] = useState('10000');
  const [gstRate, setGstRate] = useState<number>(5);
  const [isReverseGst, setIsReverseGst] = useState(false);

  // Discount Calc state
  const [discBasePrice, setDiscBasePrice] = useState('1800');
  const [discPercent, setDiscPercent] = useState('7.5');

  // Qty x Rate state
  const [qtyBags, setQtyBags] = useState('250');
  const [bagRate, setBagRate] = useState('1680');

  // Weight & Grain Conversion state
  const [weightInput, setWeightInput] = useState('100'); // bags
  const [weightConversionType, setWeightConversionType] = useState<'bags_to_mt' | 'quintal_to_kg' | 'mt_to_bags'>('bags_to_mt');

  // Margin Calc state
  const [costPrice, setCostPrice] = useState('1420');
  const [sellingPrice, setSellingPrice] = useState('1680');

  if (!isCalculatorOpen) return null;

  // Standard Calc Handlers
  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setCalcDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setCalcDisplay('0.');
      setWaitingForOperand(false);
    } else if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setPrevVal(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (calcDisplay.length > 1) {
      setCalcDisplay(calcDisplay.slice(0, -1));
    } else {
      setCalcDisplay('0');
    }
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(calcDisplay);
    if (prevVal === null) {
      setPrevVal(inputValue);
    } else if (operator) {
      const currentVal = prevVal || 0;
      let result = currentVal;
      switch (operator) {
        case '+':
          result = currentVal + inputValue;
          break;
        case '-':
          result = currentVal - inputValue;
          break;
        case '×':
          result = currentVal * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentVal / inputValue : 0;
          break;
        case '%':
          result = (currentVal * inputValue) / 100;
          break;
      }
      setCalcDisplay(String(Number(result.toFixed(4))));
      setPrevVal(result);
    }
    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const handleEqual = () => {
    if (!operator || prevVal === null) return;
    performOperation('=');
    setOperator(null);
    setPrevVal(null);
  };

  // GST Calculation
  const numGstBase = parseFloat(gstAmount) || 0;
  let gstCalculatedAmount = 0;
  let gstTotal = 0;
  let gstBaseNet = 0;

  if (isReverseGst) {
    // Amount already includes GST
    gstBaseNet = (numGstBase * 100) / (100 + gstRate);
    gstCalculatedAmount = numGstBase - gstBaseNet;
    gstTotal = numGstBase;
  } else {
    // Add GST to base amount
    gstBaseNet = numGstBase;
    gstCalculatedAmount = (numGstBase * gstRate) / 100;
    gstTotal = numGstBase + gstCalculatedAmount;
  }

  // Discount Calculation
  const numDiscBase = parseFloat(discBasePrice) || 0;
  const numDiscPct = parseFloat(discPercent) || 0;
  const discountVal = (numDiscBase * numDiscPct) / 100;
  const netDiscountedPrice = numDiscBase - discountVal;

  // Qty x Rate
  const numQty = parseFloat(qtyBags) || 0;
  const numRate = parseFloat(bagRate) || 0;
  const totalAmount = numQty * numRate;

  // Weight Conversion
  const numWeight = parseFloat(weightInput) || 0;
  let convertedWeight = '';
  let conversionDetails = '';

  if (weightConversionType === 'bags_to_mt') {
    // 1 bag = 50kg = 0.05 MT
    const mt = numWeight * 0.05;
    convertedWeight = `${mt.toFixed(3)} Metric Tonnes`;
    conversionDetails = `${(numWeight * 50).toLocaleString()} kg · ${(numWeight * 0.5).toFixed(1)} Quintals`;
  } else if (weightConversionType === 'quintal_to_kg') {
    // 1 Quintal = 100kg = 2 Bags
    const kg = numWeight * 100;
    convertedWeight = `${kg.toLocaleString()} Kilograms`;
    conversionDetails = `${(numWeight / 10).toFixed(2)} MT · ${(kg / 50).toFixed(0)} Feed Bags (50kg)`;
  } else {
    // MT to Bags (1 MT = 1000kg = 20 Bags)
    const bags = numWeight * 20;
    convertedWeight = `${bags.toLocaleString()} Bags (50kg)`;
    conversionDetails = `${(numWeight * 1000).toLocaleString()} kg · ${(numWeight * 10).toFixed(1)} Quintals`;
  }

  // Margin Calculation
  const numCost = parseFloat(costPrice) || 0;
  const numSale = parseFloat(sellingPrice) || 0;
  const profitPerUnit = numSale - numCost;
  const marginPercent = numSale > 0 ? (profitPerUnit / numSale) * 100 : 0;
  const markupPercent = numCost > 0 ? (profitPerUnit / numCost) * 100 : 0;

  return (
    <div
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 120px)' }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-800 text-white shrink-0">
        <div className="flex items-center gap-2">
          <CalcIcon className="w-4 h-4 text-emerald-300" />
          <span className="text-sm font-semibold tracking-tight">Vyapar Business Calculator</span>
        </div>
        <button
          onClick={() => setIsCalculatorOpen(false)}
          className="p-1 rounded hover:bg-emerald-700 text-emerald-100 hover:text-white transition-colors"
          title="Close calculator"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 py-1.5 gap-1 overflow-x-auto text-xs font-medium text-slate-600 dark:text-slate-400">
        <button
          onClick={() => setActiveTab('standard')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'standard'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => setActiveTab('gst')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeTab === 'gst'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Receipt className="w-3 h-3" /> GST
        </button>
        <button
          onClick={() => setActiveTab('qty_rate')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeTab === 'qty_rate'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-3 h-3" /> Qty × Rate
        </button>
        <button
          onClick={() => setActiveTab('weight')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeTab === 'weight'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Scale className="w-3 h-3" /> Weight
        </button>
        <button
          onClick={() => setActiveTab('margin')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeTab === 'margin'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3 h-3" /> Margin
        </button>
        <button
          onClick={() => setActiveTab('discount')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeTab === 'discount'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
              : 'hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Percent className="w-3 h-3" /> Discount
        </button>
      </div>

      {/* Body content */}
      <div className="p-4 overflow-y-auto">
        {/* STANDARD ARITHMETIC */}
        {activeTab === 'standard' && (
          <div className="space-y-3">
            {/* Display */}
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right">
              <div className="text-xs text-slate-400 h-4 font-mono">
                {prevVal !== null && `${prevVal} ${operator || ''}`}
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums overflow-x-auto">
                {calcDisplay}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleClear}
                className="py-2.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 transition-colors"
              >
                AC
              </button>
              <button
                onClick={handleBackspace}
                className="py-2.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors flex items-center justify-center"
              >
                <Delete className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => performOperation('%')}
                className="py-2.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                %
              </button>
              <button
                onClick={() => performOperation('÷')}
                className="py-2.5 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 transition-colors"
              >
                ÷
              </button>

              {['7', '8', '9'].map(d => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => performOperation('×')}
                className="py-2.5 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 transition-colors"
              >
                ×
              </button>

              {['4', '5', '6'].map(d => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => performOperation('-')}
                className="py-2.5 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 transition-colors"
              >
                -
              </button>

              {['1', '2', '3'].map(d => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className="py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => performOperation('+')}
                className="py-2.5 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 transition-colors"
              >
                +
              </button>

              <button
                onClick={() => handleDigit('0')}
                className="col-span-2 py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
              >
                0
              </button>
              <button
                onClick={handleDecimal}
                className="py-2.5 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
              >
                .
              </button>
              <button
                onClick={handleEqual}
                className="py-2.5 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center justify-center shadow-xs"
              >
                <Equal className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* GST CALCULATOR */}
        {activeTab === 'gst' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{isReverseGst ? 'Gross Amount (GST Included)' : 'Net Base Amount (₹)'}</span>
                <button
                  onClick={() => setIsReverseGst(!isReverseGst)}
                  className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 hover:underline"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> {isReverseGst ? 'Reverse Mode (Active)' : 'Forward Mode'}
                </button>
              </div>
              <input
                type="number"
                value={gstAmount}
                onChange={e => setGstAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                placeholder="Enter amount in ₹"
              />
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Select GST Slab</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[5, 12, 18, 28].map(slab => (
                  <button
                    key={slab}
                    onClick={() => setGstRate(slab)}
                    className={`py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                      gstRate === slab
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-600'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Net Taxable Value:</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                  {formatIndianCurrency(gstBaseNet)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>CGST ({gstRate / 2}%):</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                  {formatIndianCurrency(gstCalculatedAmount / 2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SGST ({gstRate / 2}%):</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                  {formatIndianCurrency(gstCalculatedAmount / 2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatIndianCurrency(gstTotal)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* QTY X RATE */}
        {activeTab === 'qty_rate' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Quantity (Bags / Quintals)</label>
              <input
                type="number"
                value={qtyBags}
                onChange={e => setQtyBags(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                placeholder="Number of bags"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Rate per Unit (₹)</label>
              <input
                type="number"
                value={bagRate}
                onChange={e => setBagRate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                placeholder="Rate per bag"
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 block mb-0.5 font-medium">Total Bill Amount</span>
              <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 tabular-nums">
                {formatIndianCurrency(totalAmount)}
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 block">
                {numQty} bags × ₹{numRate}
              </span>
            </div>
          </div>
        )}

        {/* WEIGHT CONVERSION */}
        {activeTab === 'weight' && (
          <div className="space-y-3">
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setWeightConversionType('bags_to_mt')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  weightConversionType === 'bags_to_mt'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Bags → MT
              </button>
              <button
                onClick={() => setWeightConversionType('quintal_to_kg')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  weightConversionType === 'quintal_to_kg'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Quintal → KG
              </button>
              <button
                onClick={() => setWeightConversionType('mt_to_bags')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  weightConversionType === 'mt_to_bags'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                MT → Bags
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Enter {weightConversionType === 'bags_to_mt' ? 'Bags (50kg each)' : weightConversionType === 'quintal_to_kg' ? 'Quintals' : 'Metric Tonnes (MT)'}
              </label>
              <input
                type="number"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block mb-0.5">Equivalent Weight</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {convertedWeight}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {conversionDetails}
              </span>
            </div>
          </div>
        )}

        {/* MARGIN CALCULATOR */}
        {activeTab === 'margin' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={e => setCostPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={e => setSellingPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Profit / Unit:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatIndianCurrency(profitPerUnit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Profit Margin (% of Sale):</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  {marginPercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Markup (% over Cost):</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  {markupPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DISCOUNT CALCULATOR */}
        {activeTab === 'discount' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 block mb-1">List Price (₹)</label>
                <input
                  type="number"
                  value={discBasePrice}
                  onChange={e => setDiscBasePrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Discount %</label>
                <input
                  type="number"
                  value={discPercent}
                  onChange={e => setDiscPercent(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Discount Amount:</span>
                <span className="font-mono font-semibold text-rose-600 tabular-nums">
                  - {formatIndianCurrency(discountVal)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-sm font-bold">
                <span className="text-slate-900 dark:text-white">Net Payable Rate:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatIndianCurrency(netDiscountedPrice)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
