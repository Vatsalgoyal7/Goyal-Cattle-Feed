import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Package,
  Users,
  FileText,
  Warehouse,
  History,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatIndianCurrency } from '../../data/sampleData';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Products' | 'Customers' | 'Invoices' | 'Warehouses' | 'Actions';
  icon: any;
  actionUrl: string;
  badge?: string;
}

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, customers, transactions, warehouses, setActiveQuickAction } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Goyal Premium Feed',
    'Sharma Dairy Farm',
    'INV/2026/0419',
    'Plant 1 Godown',
  ]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Aggregate searchable items
  const allResults: SearchResultItem[] = [];

  // Products
  products.forEach(p => {
    allResults.push({
      id: `p-${p.id}`,
      title: p.name,
      subtitle: `${p.currentStock} ${p.unit} in stock · Rate: ₹${p.ratePerUnit}/${p.unit}`,
      category: 'Products',
      icon: Package,
      actionUrl: '/stock',
      badge: p.category,
    });
  });

  // Customers
  customers.forEach(c => {
    allResults.push({
      id: `c-${c.id}`,
      title: `${c.firmName} (${c.name})`,
      subtitle: `${c.city}, ${c.state} · Outstanding: ${formatIndianCurrency(c.outstandingAmount)}`,
      category: 'Customers',
      icon: Users,
      actionUrl: '/customers',
      badge: c.paymentStatus,
    });
  });

  // Invoices / Transactions
  transactions.forEach(t => {
    allResults.push({
      id: `t-${t.id}`,
      title: `${t.invoiceNumber} - ${t.partyName}`,
      subtitle: `${t.date} · ${formatIndianCurrency(t.amount)} · ${t.type}`,
      category: 'Invoices',
      icon: FileText,
      actionUrl: '/sales',
      badge: t.status,
    });
  });

  // Warehouses
  warehouses.forEach(w => {
    allResults.push({
      id: `w-${w.id}`,
      title: w.name,
      subtitle: `${w.location} · ${w.capacityUtilization}% Capacity · ${w.totalStockBags} Bags`,
      category: 'Warehouses',
      icon: Warehouse,
      actionUrl: '/warehouses',
    });
  });

  // Quick Action triggers
  allResults.push(
    {
      id: 'act-bill',
      title: 'Action: Create New Sales Invoice',
      subtitle: 'Open billing screen to dispatch goods',
      category: 'Actions',
      icon: TrendingUp,
      actionUrl: '#action-bill',
    },
    {
      id: 'act-cust',
      title: 'Action: Register New Customer / Dealer',
      subtitle: 'Create customer khata ledger',
      category: 'Actions',
      icon: Users,
      actionUrl: '#action-cust',
    }
  );

  // Filter results
  const filteredResults = allResults.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      query.trim() === '' ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSelect = (item: SearchResultItem) => {
    if (!recentSearches.includes(item.title) && query.trim()) {
      setRecentSearches(prev => [item.title, ...prev.slice(0, 4)]);
    }
    setIsSearchOpen(false);

    if (item.actionUrl === '#action-bill') {
      setActiveQuickAction('create_sales_bill');
    } else if (item.actionUrl === '#action-cust') {
      setActiveQuickAction('add_customer');
    } else {
      navigate(item.actionUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search products, customers, suppliers, invoices, warehouses..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs px-2 py-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 gap-1.5 overflow-x-auto text-xs font-medium">
          {['All', 'Products', 'Customers', 'Invoices', 'Warehouses', 'Actions'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {query.trim() === '' && recentSearches.length > 0 && selectedCategory === 'All' && (
            <div className="p-2 mb-2">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-2 px-2">
                <History className="w-3.5 h-3.5" /> Recent Searches
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                {recentSearches.map((rec, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(rec)}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching records found for "{query}". Try searching by customer name, product SKU, or invoice number.
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-xs px-1.5 py-0.2 text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                ↵
              </kbd>{' '}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>
          <span className="hidden sm:inline">Goyal Business OS Search</span>
        </div>
      </div>
    </div>
  );
};
