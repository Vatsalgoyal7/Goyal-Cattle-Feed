import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { ProductionOrder, Recipe, RecipeIngredient, QualityInspection } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import {
  scaleRecipeIngredients,
  calculateProductionOutput,
  calculateProductionCost,
} from '../../utils/manufacturingCalculations';
import { exportToExcel, printDocument } from '../../utils/exportUtils';
import {
  Factory,
  Layers,
  FlaskConical,
  Calculator,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
  FileSpreadsheet,
  Printer,
  Search,
  X,
  Gauge,
  Flame,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ManufacturingDashboard: React.FC = () => {
  const {
    productionOrders,
    recipes,
    qualityInspections,
    products,
    createProductionOrder,
    confirmProductionOrder,
    createRecipe,
    createQualityInspection,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'orders' | 'recipes' | 'costing' | 'qc' | 'traceability'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewRecipeOpen, setIsNewRecipeOpen] = useState(false);
  const [isNewQCOpen, setIsNewQCOpen] = useState(false);
  const [viewOrderDetail, setViewOrderDetail] = useState<ProductionOrder | null>(null);

  // New Order Form state
  const [orderForm, setOrderForm] = useState({
    finishedProductId: products.find(p => p.category === 'Finished Goods')?.id || '',
    recipeId: recipes[0]?.id || '',
    plannedQuantityKg: 10000, // 10 MT
    machineLine: 'Pellet Mill Line 1 (CPM 3000)',
    supervisor: 'Gurpreet Singh (Production Head)',
    labourDetails: 'Contract Labour Team A (12 workers)',
    startTime: '07:00 AM',
    endTime: '12:00 PM',
    notes: '',
  });

  // Selected Recipe for Order
  const selectedRecipe = useMemo(() => {
    return recipes.find(r => r.id === orderForm.recipeId) || recipes[0];
  }, [recipes, orderForm.recipeId]);

  // Scaled Ingredients for Order Form
  const scaledIngredients = useMemo(() => {
    if (!selectedRecipe) return [];
    return scaleRecipeIngredients(
      selectedRecipe.ingredients,
      selectedRecipe.batchSize,
      orderForm.plannedQuantityKg
    );
  }, [selectedRecipe, orderForm.plannedQuantityKg]);

  // Costing Calculator Interactive State
  const [costingParams, setCostingParams] = useState({
    outputKg: 10000,
    rawMaterialCost: 275000,
    labourCost: 8000,
    electricityCost: 11000,
    machineCost: 2500,
    packagingCost: 3700, // 200 bags * 18.5
    allocatedExpenses: 3000,
    sellingPricePerBag: 1680,
  });

  const calculatedCosting = useMemo(() => {
    const res = calculateProductionCost(
      costingParams.rawMaterialCost,
      costingParams.labourCost,
      costingParams.electricityCost,
      costingParams.machineCost,
      costingParams.packagingCost,
      costingParams.allocatedExpenses,
      costingParams.outputKg,
      50
    );

    const marginPerBag = costingParams.sellingPricePerBag - res.costPerBag;
    const marginPercent = costingParams.sellingPricePerBag > 0
      ? Number(((marginPerBag / costingParams.sellingPricePerBag) * 100).toFixed(1))
      : 0;

    return {
      ...res,
      marginPerBag,
      marginPercent,
    };
  }, [costingParams]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const todayOrders = productionOrders.filter(o => o.productionDate.includes('11/11/2026'));
    const totalOutputTodayKg = todayOrders.reduce((sum, o) => sum + o.productionQuantity, 0);
    const totalBagsToday = todayOrders.reduce((sum, o) => sum + o.numberOfBags, 0);
    const completedOrders = productionOrders.filter(o => o.status === 'Completed').length;
    const avgYield = productionOrders.length > 0
      ? (productionOrders.reduce((sum, o) => sum + (o.yieldPercentage || 98.2), 0) / productionOrders.length).toFixed(1)
      : '98.2';

    return {
      totalOutputTodayKg,
      totalBagsToday,
      activeBatches: productionOrders.filter(o => o.status === 'In Production' || o.status === 'Planned').length,
      completedOrders,
      avgYield,
    };
  }, [productionOrders]);

  // Create Production Order Submit
  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === orderForm.finishedProductId);
    if (!prod || !selectedRecipe) return;

    const plannedKg = Number(orderForm.plannedQuantityKg);
    const rawCost = scaledIngredients.reduce((sum, ing) => sum + ing.cost, 0);

    // Approximate 1.8% moisture/dust loss in pelleting
    const estimatedOutputKg = Math.round(plannedKg * 0.982);
    const outputCalc = calculateProductionOutput(plannedKg, estimatedOutputKg, 50);

    const costCalc = calculateProductionCost(
      rawCost,
      8000,
      11000,
      2500,
      outputCalc.numberOfBags * 18.5,
      3000,
      estimatedOutputKg,
      50
    );

    const newOrder = createProductionOrder({
      productionDate: new Date().toLocaleDateString('en-GB'),
      finishedProductId: prod.id,
      finishedProductName: prod.name,
      recipeId: selectedRecipe.id,
      recipeName: selectedRecipe.name,
      plannedQuantity: plannedKg,
      productionQuantity: estimatedOutputKg,
      inputMaterials: scaledIngredients.map(ing => ({
        ingredientId: ing.ingredientId,
        ingredientName: ing.ingredientName,
        plannedQty: ing.quantity,
        actualQty: ing.quantity,
        unit: 'KG',
        rate: ing.estimatedRatePerKg,
        cost: ing.cost,
      })),
      totalInputWeight: plannedKg,
      finishedOutputWeight: estimatedOutputKg,
      wastageWeight: outputCalc.wastageWeight,
      wastagePercentage: outputCalc.wastagePercentage,
      yieldPercentage: outputCalc.yieldPercentage,
      bagWeight: 50,
      numberOfBags: outputCalc.numberOfBags,
      packagingSize: '50 KG Bag',
      machineLine: orderForm.machineLine,
      supervisor: orderForm.supervisor,
      labourDetails: orderForm.labourDetails,
      startTime: orderForm.startTime,
      endTime: orderForm.endTime,
      costs: costCalc,
      status: 'In Production',
      warehouseId: 'wh-001',
      notes: orderForm.notes,
      createdBy: 'Rajesh Goyal (MD)',
    });

    setIsNewOrderOpen(false);
    setViewOrderDetail(newOrder);
  };

  const handleExportOrdersExcel = () => {
    const cols = [
      { header: 'Order No.', key: 'orderNumber' },
      { header: 'Batch No.', key: 'batchNumber' },
      { header: 'Date', key: 'productionDate' },
      { header: 'Product', key: 'finishedProductName' },
      { header: 'Machine Line', key: 'machineLine' },
      { header: 'Input Weight (KG)', key: 'totalInputWeight' },
      { header: 'Output Weight (KG)', key: 'finishedOutputWeight' },
      { header: 'Yield %', key: 'yieldPercentage' },
      { header: 'Bags (50kg)', key: 'numberOfBags' },
      { header: 'Cost per Bag (₹)', key: 'costs.costPerBag' },
      { header: 'Status', key: 'status' },
    ];
    exportToExcel(cols, productionOrders, `Production_Batches_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Factory className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manufacturing & Production Control
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Pellet Mill Lines, Recipe Formulations, Batch Yields & Quality Control
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportOrdersExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Batches
          </button>

          <button
            onClick={() => printDocument()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>

          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Production Run
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Today's Production</span>
            <Factory className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 font-mono">
            {metrics.totalBagsToday.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">Bags</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{(metrics.totalOutputTodayKg / 1000).toFixed(1)} MT Net Pellets</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Average Plant Yield</span>
            <Gauge className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {metrics.avgYield}%
          </div>
          <span className="text-[10px] text-slate-400">Process loss &lt; 1.8%</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Mill Batches</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 font-mono">
            {metrics.activeBatches} <span className="text-xs font-normal text-slate-400">Runs</span>
          </div>
          <span className="text-[10px] text-amber-500 font-medium">Pellet Line 1 & Line 2</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed Batches</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.completedOrders} <span className="text-xs font-normal text-slate-400">Batches</span>
          </div>
          <span className="text-[10px] text-slate-400">Audit-ready production</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'orders', label: 'Production Batches & Runs', icon: Factory },
          { id: 'recipes', label: 'BOM / Feed Recipes', icon: Layers },
          { id: 'costing', label: 'Production Costing Calculator', icon: Calculator },
          { id: 'qc', label: 'Quality Control (QC Inspections)', icon: FlaskConical },
          { id: 'traceability', label: 'Batch Traceability Matrix', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Production Orders & Batches */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Batch & Order</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Finished Feed Product</th>
                  <th className="p-3">Machine Line</th>
                  <th className="p-3 text-right">Input Weight</th>
                  <th className="p-3 text-right">Output Yield</th>
                  <th className="p-3 text-center">Bags Packed</th>
                  <th className="p-3 text-right">Cost / Bag</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {productionOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-white block">{order.batchNumber}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Ref: {order.orderNumber}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{order.productionDate}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{order.finishedProductName}</div>
                      <div className="text-[11px] text-slate-400">Recipe: {order.recipeName}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                      {order.machineLine}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      {(order.totalInputWeight / 1000).toFixed(1)} MT
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">
                      {order.yieldPercentage > 0 ? `${order.yieldPercentage}%` : '-'}
                      {order.wastageWeight > 0 && (
                        <span className="text-[10px] text-slate-400 block font-normal">Loss: {order.wastageWeight}kg</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {order.numberOfBags > 0 ? `${order.numberOfBags} Bags` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹{order.costs.costPerBag.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : order.status === 'In Production'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewOrderDetail(order)}
                          className="px-2 py-1 text-[11px] font-semibold border rounded hover:bg-slate-100"
                        >
                          View Details
                        </button>
                        {order.status === 'In Production' && (
                          <button
                            onClick={() => confirmProductionOrder(order.id)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Confirm Output
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOM / Feed Recipes */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Authentic linear program formulations for cattle feeds (scaled to 1,000 KG standard input batch).
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map(rec => (
              <div key={rec.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {rec.recipeCode} · {rec.version}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{rec.name}</h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{rec.finishedProductName}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                {/* Nutritional Chips */}
                {rec.nutritionalProfile && (
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono py-1.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <div>
                      <span className="text-slate-400 block">CP %</span>
                      <strong className="text-slate-800 dark:text-slate-200">{rec.nutritionalProfile.crudeProtein}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fat %</span>
                      <strong className="text-slate-800 dark:text-slate-200">{rec.nutritionalProfile.crudeFat}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fiber %</span>
                      <strong className="text-slate-800 dark:text-slate-200">{rec.nutritionalProfile.fiber}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Moisture</span>
                      <strong className="text-slate-800 dark:text-slate-200">{rec.nutritionalProfile.moisture}%</strong>
                    </div>
                  </div>
                )}

                {/* Ingredients table */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Ingredient Breakdown (1,000 KG Batch):
                  </span>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {rec.ingredients.map((ing, idx) => (
                      <div key={idx} className="py-1 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 dark:text-slate-300">{ing.ingredientName}</span>
                        <div className="font-mono text-right">
                          <strong className="text-slate-900 dark:text-white">{ing.quantity} kg</strong>
                          <span className="text-[10px] text-slate-400 ml-1">({ing.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Est. Raw Cost / KG:</span>
                  <strong className="text-emerald-600 font-mono text-sm">
                    ₹{(rec.estimatedRawCost / 1000).toFixed(2)} / KG
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Production Costing Calculator */}
      {activeTab === 'costing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Comprehensive Cattle Feed Batch Costing Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate total production cost, power tariff, packaging bags, and net profit margin per 50kg bag.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Finished Batch Output (KG)
                </label>
                <input
                  type="number"
                  value={costingParams.outputKg}
                  onChange={e => setCostingParams({ ...costingParams, outputKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Equivalent to {Math.floor(costingParams.outputKg / 50)} Bags (50kg)</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Raw Material Grinding & Mixing Cost (₹)
                </label>
                <input
                  type="number"
                  value={costingParams.rawMaterialCost}
                  onChange={e => setCostingParams({ ...costingParams, rawMaterialCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Pellet Mill Electricity & Boiler Fuel Cost (₹)
                </label>
                <input
                  type="number"
                  value={costingParams.electricityCost}
                  onChange={e => setCostingParams({ ...costingParams, electricityCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Shift Labour & Stacking Wages (₹)
                </label>
                <input
                  type="number"
                  value={costingParams.labourCost}
                  onChange={e => setCostingParams({ ...costingParams, labourCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  HDPE Bag Packaging & Stitching Thread Cost (₹)
                </label>
                <input
                  type="number"
                  value={costingParams.packagingCost}
                  onChange={e => setCostingParams({ ...costingParams, packagingCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Wholesale Dealer Selling Price per Bag (₹)
                </label>
                <input
                  type="number"
                  value={costingParams.sellingPricePerBag}
                  onChange={e => setCostingParams({ ...costingParams, sellingPricePerBag: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700 text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Cost & Profit Summary
            </span>

            <div className="space-y-2 border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Batch Production Cost:</span>
                <span className="font-mono text-white font-bold">{formatIndianCurrency(calculatedCosting.totalCost)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Production Cost per KG:</span>
                <span className="font-mono text-white font-bold">₹{calculatedCosting.costPerKg.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="text-xs text-slate-400 block">Cost Per 50 KG Bag:</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ₹{calculatedCosting.costPerBag.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400">Selling Price: ₹{costingParams.sellingPricePerBag.toFixed(2)}</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 space-y-1">
              <span className="text-xs text-emerald-300 block font-semibold">Net Operating Margin:</span>
              <div className="text-xl font-black font-mono text-emerald-400">
                +₹{calculatedCosting.marginPerBag.toFixed(2)} / Bag ({calculatedCosting.marginPercent}%)
              </div>
              <span className="text-[10px] text-slate-400 block">Total Batch Profit: {formatIndianCurrency(calculatedCosting.marginPerBag * Math.floor(costingParams.outputKg / 50))}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Quality Control & Inspections */}
      {activeTab === 'qc' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">QC Report No.</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Inspection Stage</th>
                  <th className="p-3">Product Sample</th>
                  <th className="p-3">Key Parameter Results</th>
                  <th className="p-3">Sample Size</th>
                  <th className="p-3">Inspector</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {qualityInspections.map(qc => (
                  <tr key={qc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{qc.inspectionNumber}</td>
                    <td className="p-3 text-slate-500 font-mono whitespace-nowrap">{qc.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {qc.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {qc.productName}
                      <span className="text-[10px] text-slate-400 block font-normal">Ref: {qc.referenceId}</span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {qc.parameters.slice(0, 3).map((p, pIdx) => (
                          <div key={pIdx} className="text-[11px] flex items-center gap-1.5">
                            <span className="text-slate-500">{p.parameter}:</span>
                            <strong className="text-slate-800 dark:text-slate-200">{p.actual}</strong>
                            <span className="text-[10px] text-emerald-600 font-bold">({p.status})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{qc.sampleSize}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{qc.inspector}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {qc.overallStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Batch Traceability Matrix */}
      {activeTab === 'traceability' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              End-to-End Cattle Feed Batch Traceability
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Audit trail tracing raw grain procurement → Silo storage → Production run → Bagging → Warehouse → Sales invoice → Dairy customer.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Traced Batch: #BATCH-26-889 · Goyal Premium Cattle Feed (50kg)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">Full Chain Verified</span>
              </div>

              {/* Traceability Flow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Raw Materials</span>
                  <div className="font-bold">24 MT Yellow Maize</div>
                  <span className="text-[11px] text-slate-500 block">Supplier: Aggarwal Grain Millers</span>
                  <span className="text-[10px] text-emerald-600 font-mono">PO: PUR/2026/0192 · GRN-192</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">2. Manufacturing Run</span>
                  <div className="font-bold">Pellet Mill Line 1 (CPM 3000)</div>
                  <span className="text-[11px] text-slate-500 block">Recipe: RCP-PREM-20 (20% CP)</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Output: 353 Bags (17.68 MT)</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">3. Quality Audit</span>
                  <div className="font-bold">Passed (PDI 97.4%, CP 20.6%)</div>
                  <span className="text-[11px] text-slate-500 block">Moisture: 10.2% · Aflatoxin safe</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Report: QC-2026-0418</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">4. Sales Dispatches</span>
                  <div className="font-bold">80 Bags to Kisan Agro Traders</div>
                  <span className="text-[11px] text-slate-500 block">Truck: PB-10-CZ-4412 (Harjit Singh)</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Inv: INV/2026/0418 · Challan-49</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Production Run Order */}
      {isNewOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-600 fill-current" />
                Schedule Cattle Feed Production Run
              </h3>
              <button onClick={() => setIsNewOrderOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Finished Feed Product Line *
                  </label>
                  <select
                    value={orderForm.finishedProductId}
                    onChange={e => setOrderForm({ ...orderForm, finishedProductId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    {products.filter(p => p.category === 'Finished Goods').map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipe / BOM Formulation *
                  </label>
                  <select
                    value={orderForm.recipeId}
                    onChange={e => setOrderForm({ ...orderForm, recipeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.version})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Planned Batch Input Weight (KG) *
                  </label>
                  <input
                    type="number"
                    required
                    step={100}
                    value={orderForm.plannedQuantityKg}
                    onChange={e => setOrderForm({ ...orderForm, plannedQuantityKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Estimated Output: ~{Math.floor((orderForm.plannedQuantityKg * 0.982) / 50)} Bags (50kg)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pellet Mill Production Line *
                  </label>
                  <select
                    value={orderForm.machineLine}
                    onChange={e => setOrderForm({ ...orderForm, machineLine: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Pellet Mill Line 1 (CPM 3000)">Pellet Mill Line 1 (CPM 3000 - 10 TPH)</option>
                    <option value="Pellet Mill Line 2 (Andritz Sprout)">Pellet Mill Line 2 (Andritz Sprout - 6 TPH)</option>
                    <option value="Mash Mixing Plant Line 3">Mash Mixing Plant Line 3 (Non-pelleted)</option>
                  </select>
                </div>
              </div>

              {/* Scaled Material Requisition Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Automated Raw Material Requisition (Scaled to {orderForm.plannedQuantityKg} KG):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {scaledIngredients.map((ing, idx) => (
                    <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-lg border text-xs">
                      <span className="text-slate-500 text-[10px] block truncate">{ing.ingredientName}</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{ing.quantity} kg</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">₹{ing.cost.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Shift Supervisor Incharge
                  </label>
                  <input
                    type="text"
                    value={orderForm.supervisor}
                    onChange={e => setOrderForm({ ...orderForm, supervisor: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Operating Shift Times
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orderForm.startTime}
                      onChange={e => setOrderForm({ ...orderForm, startTime: e.target.value })}
                      className="w-1/2 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                    <input
                      type="text"
                      value={orderForm.endTime}
                      onChange={e => setOrderForm({ ...orderForm, endTime: e.target.value })}
                      className="w-1/2 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Launch Production Run
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: View Batch Detail */}
      {viewOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Batch Sheet</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{viewOrderDetail.batchNumber}</h3>
              </div>
              <button onClick={() => setViewOrderDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Product</span>
                  <strong>{viewOrderDetail.finishedProductName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Machine Line</span>
                  <strong>{viewOrderDetail.machineLine}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Input Material Weight</span>
                  <strong>{viewOrderDetail.totalInputWeight.toLocaleString('en-IN')} KG</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Output Finished Bags</span>
                  <strong className="text-emerald-600">{viewOrderDetail.numberOfBags} Bags ({viewOrderDetail.finishedOutputWeight.toLocaleString('en-IN')} KG)</strong>
                </div>
              </div>

              <div className="border rounded-xl p-3 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block uppercase text-[11px]">Batch Cost Allocation:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Raw Materials: <strong>{formatIndianCurrency(viewOrderDetail.costs.rawMaterialCost)}</strong></div>
                  <div>Labour Wages: <strong>{formatIndianCurrency(viewOrderDetail.costs.labourCost)}</strong></div>
                  <div>Power / Electricity: <strong>{formatIndianCurrency(viewOrderDetail.costs.electricityCost)}</strong></div>
                  <div>Packaging Sacks: <strong>{formatIndianCurrency(viewOrderDetail.costs.packagingCost)}</strong></div>
                </div>
                <div className="border-t pt-2 flex items-center justify-between font-bold text-sm text-emerald-600">
                  <span>Net Cost per 50kg Bag:</span>
                  <span>₹{viewOrderDetail.costs.costPerBag.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => printDocument()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Batch Card
              </button>
              <button
                onClick={() => setViewOrderDetail(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
