import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search, Package, Users, Building2, Receipt, ShoppingCart,
  IndianRupee, FileText, Warehouse, Factory, Truck, UserCheck,
  Sparkles, ChevronRight, ExternalLink, Filter, X, Loader2,
} from 'lucide-react';
import { useEnterprise } from '../../context/EnterpriseContext';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  path: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

const SECTION_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; path: string }> = {
  Products:      { icon: Package,     color: 'amber',   path: '/stock' },
  Customers:     { icon: Users,       color: 'emerald', path: '/customers' },
  Suppliers:     { icon: Building2,   color: 'blue',    path: '/suppliers' },
  Invoices:      { icon: Receipt,     color: 'indigo',  path: '/sales' },
  Purchases:     { icon: ShoppingCart,color: 'violet',  path: '/purchases' },
  Employees:     { icon: UserCheck,   color: 'rose',    path: '/employees' },
  Warehouses:    { icon: Warehouse,   color: 'cyan',    path: '/warehouses' },
  Conversations: { icon: Sparkles,    color: 'purple',  path: '/ai-assistant' },
};

const FILTER_TYPES = ['All', 'Products', 'Customers', 'Suppliers', 'Invoices', 'Purchases', 'Employees', 'Warehouses', 'Conversations'];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const ResultCard: React.FC<{ result: SearchResult }> = ({ result }) => {
  const Icon = result.icon;
  const cfg = SECTION_CONFIG[result.type];
  return (
    <NavLink
      to={cfg?.path ?? '/'}
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xs transition-all group"
    >
      <div className={`w-9 h-9 rounded-xl bg-${result.iconColor}-100 dark:bg-${result.iconColor}-950/50 flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 text-${result.iconColor}-700 dark:text-${result.iconColor}-400`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{result.title}</p>
          {result.badge && (
            <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-${result.badgeColor}-100 dark:bg-${result.badgeColor}-950/50 text-${result.badgeColor}-700 dark:text-${result.badgeColor}-400`}>
              {result.badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{result.subtitle}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
    </NavLink>
  );
};

export const GlobalSearchPage: React.FC = () => {
  const {
    products, customers, suppliers, invoices, purchases,
    employees, warehouses, conversations,
  } = useEnterprise();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      const t = setTimeout(() => setIsSearching(false), 200);
      return () => clearTimeout(t);
    }
    setIsSearching(false);
  }, [debouncedQuery]);

  const buildResults = useCallback((): Record<string, SearchResult[]> => {
    if (!debouncedQuery.trim()) return {};
    const q = debouncedQuery.toLowerCase();

    const results: Record<string, SearchResult[]> = {};

    // Products
    const matchedProducts = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    );
    if (matchedProducts.length) {
      results['Products'] = matchedProducts.slice(0, 8).map(p => ({
        id: p.id, type: 'Products',
        title: p.name,
        subtitle: `SKU: ${p.sku ?? '—'} · Stock: ${p.currentStock.toLocaleString('en-IN')} ${p.unit}`,
        badge: p.status,
        badgeColor: p.status === 'In Stock' ? 'emerald' : p.status === 'Low Stock' ? 'amber' : 'red',
        path: '/stock', icon: Package, iconColor: 'amber',
      }));
    }

    // Customers
    const matchedCustomers = customers.filter(c =>
      c.firmName?.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.mobile?.includes(q)
    );
    if (matchedCustomers.length) {
      results['Customers'] = matchedCustomers.slice(0, 8).map(c => ({
        id: c.id, type: 'Customers',
        title: c.firmName || c.name,
        subtitle: `${c.name} · ${c.city ?? '—'} · Outstanding: ₹${c.currentOutstanding.toLocaleString('en-IN')}`,
        badge: c.paymentStatus,
        badgeColor: c.paymentStatus === 'Good' ? 'emerald' : c.paymentStatus === 'Overdue' ? 'red' : 'amber',
        path: '/customers', icon: Users, iconColor: 'emerald',
      }));
    }

    // Suppliers
    const matchedSuppliers = suppliers.filter(s =>
      s.firmName?.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q)
    );
    if (matchedSuppliers.length) {
      results['Suppliers'] = matchedSuppliers.slice(0, 6).map(s => ({
        id: s.id, type: 'Suppliers',
        title: s.firmName || s.name,
        subtitle: `${s.name} · ${s.city ?? '—'} · Payable: ₹${s.currentPayable.toLocaleString('en-IN')}`,
        path: '/suppliers', icon: Building2, iconColor: 'blue',
      }));
    }

    // Invoices
    const matchedInvoices = invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(q) || (inv.customerFirm ?? '').toLowerCase().includes(q) || (inv.customerName ?? '').toLowerCase().includes(q)
    );
    if (matchedInvoices.length) {
      results['Invoices'] = matchedInvoices.slice(0, 8).map(inv => ({
        id: inv.id, type: 'Invoices',
        title: inv.invoiceNumber,
        subtitle: `${inv.customerFirm || inv.customerName} · ₹${inv.grandTotal.toLocaleString('en-IN')} · ${inv.invoiceDate}`,
        badge: inv.paymentStatus,
        badgeColor: inv.paymentStatus === 'Completed' ? 'emerald' : inv.paymentStatus === 'Overdue' ? 'red' : 'amber',
        path: '/sales', icon: Receipt, iconColor: 'indigo',
      }));
    }

    // Purchases
    const matchedPurchases = purchases.filter(p =>
      p.purchaseNumber.toLowerCase().includes(q) || (p.supplierFirm ?? '').toLowerCase().includes(q) || (p.supplierInvoiceNumber ?? '').toLowerCase().includes(q)
    );
    if (matchedPurchases.length) {
      results['Purchases'] = matchedPurchases.slice(0, 8).map(p => ({
        id: p.id, type: 'Purchases',
        title: p.purchaseNumber,
        subtitle: `${p.supplierFirm} · ₹${p.grandTotal.toLocaleString('en-IN')} · Bill: ${p.supplierInvoiceNumber}`,
        badge: p.paymentStatus,
        badgeColor: p.paymentStatus === 'Paid' ? 'emerald' : 'amber',
        path: '/purchases', icon: ShoppingCart, iconColor: 'violet',
      }));
    }

    // Employees
    const matchedEmployees = employees.filter(e =>
      e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q)
    );
    if (matchedEmployees.length) {
      results['Employees'] = matchedEmployees.slice(0, 6).map(e => ({
        id: e.id, type: 'Employees',
        title: e.name,
        subtitle: `${e.designation} · ${e.department} · ${e.employeeId}`,
        badge: e.status,
        badgeColor: e.status === 'Active' ? 'emerald' : 'slate',
        path: '/employees', icon: UserCheck, iconColor: 'rose',
      }));
    }

    // Warehouses
    const matchedWarehouses = warehouses.filter(w =>
      w.name.toLowerCase().includes(q) || w.location.toLowerCase().includes(q) || w.code.toLowerCase().includes(q)
    );
    if (matchedWarehouses.length) {
      results['Warehouses'] = matchedWarehouses.slice(0, 4).map(w => ({
        id: w.id, type: 'Warehouses',
        title: w.name,
        subtitle: `${w.location} · Capacity: ${w.capacityMT} MT · Utilization: ${w.currentUtilizationPercent}%`,
        badge: w.type,
        badgeColor: 'cyan',
        path: '/warehouses', icon: Warehouse, iconColor: 'cyan',
      }));
    }

    // AI Conversations
    const matchedConvs = conversations.filter(c =>
      c.title.toLowerCase().includes(q) || c.workspace.toLowerCase().includes(q)
    );
    if (matchedConvs.length) {
      results['Conversations'] = matchedConvs.slice(0, 5).map(c => ({
        id: c.id, type: 'Conversations',
        title: c.title,
        subtitle: `${c.workspace} · Updated: ${c.updatedAt}`,
        badge: c.workspace,
        badgeColor: 'purple',
        path: '/ai-assistant', icon: Sparkles, iconColor: 'purple',
      }));
    }

    return results;
  }, [debouncedQuery, products, customers, suppliers, invoices, purchases, employees, warehouses, conversations]);

  const allResults = buildResults();
  const filteredResults = activeFilter === 'All'
    ? allResults
    : allResults[activeFilter] ? { [activeFilter]: allResults[activeFilter] } : {};

  const totalCount = Object.values(allResults).reduce((s, r) => s + r.length, 0);

  const QUICK_SEARCHES = ['Sharma Traders', 'Vinole', 'Maize', 'Premium Pellet', 'INV/2026', 'Rajesh', 'Plant 1'];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600" />Global Search
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Search across products, customers, invoices, employees, and all business records.</p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products, customers, invoices, employees..."
          className="w-full pl-12 pr-12 py-4 text-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 shadow-xs transition-all"
        />
        {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />}
        {query && !isSearching && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick searches */}
      {!query && (
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Quick Searches</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SEARCHES.map(qs => (
              <button key={qs} onClick={() => setQuery(qs)} className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                {qs}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result filters */}
      {debouncedQuery && totalCount > 0 && (
        <div className="flex gap-1 flex-wrap items-center">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {FILTER_TYPES.filter(f => f === 'All' || allResults[f]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${activeFilter === f ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              {f} {f !== 'All' && allResults[f] ? `(${allResults[f].length})` : f === 'All' && totalCount ? `(${totalCount})` : ''}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {debouncedQuery && !isSearching && (
        <div className="space-y-5">
          {totalCount === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No results for "{debouncedQuery}"</p>
              <p className="text-xs text-slate-400">Try different keywords or check spelling.</p>
            </div>
          ) : (
            Object.entries(filteredResults).map(([section, results]) => {
              const cfg = SECTION_CONFIG[section];
              const SectionIcon = cfg?.icon ?? FileText;
              return (
                <div key={section}>
                  <div className="flex items-center gap-2 mb-2">
                    <SectionIcon className={`w-4 h-4 text-${cfg?.color ?? 'slate'}-600`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{section}</span>
                    <span className="text-[11px] font-semibold text-slate-400">({results.length})</span>
                    <NavLink to={cfg?.path ?? '/'} className="ml-auto flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                      View all <ExternalLink className="w-3 h-3" />
                    </NavLink>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {results.map(r => <ResultCard key={r.id} result={r} />)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Empty state when no query */}
      {!debouncedQuery && (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Search your entire business</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Find customers, invoices, products, employees, and AI conversations instantly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-lg mx-auto mt-4">
            {Object.entries(SECTION_CONFIG).map(([name, cfg]) => {
              const Icon = cfg.icon;
              return (
                <NavLink key={name} to={cfg.path} className={`flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:border-${cfg.color}-300 hover:text-${cfg.color}-700 transition-colors`}>
                  <Icon className={`w-4 h-4 text-${cfg.color}-500`} />
                  {name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
