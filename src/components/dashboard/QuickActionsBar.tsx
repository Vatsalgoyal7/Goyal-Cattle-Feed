import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  ShoppingCart,
  PackagePlus,
  UserPlus,
  DollarSign,
  Receipt,
  UserCheck,
  Factory,
} from 'lucide-react';
import { QuickActionType } from '../../types';

export const QuickActionsBar: React.FC = () => {
  const { setActiveQuickAction, t } = useApp();

  const actions: { id: QuickActionType; label: string; icon: any; colorClass: string; borderHover: string }[] = [
    {
      id: 'create_sales_bill',
      label: t.createSalesBill,
      icon: FileText,
      colorClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
      borderHover: 'hover:border-emerald-500',
    },
    {
      id: 'add_purchase',
      label: t.addPurchase,
      icon: ShoppingCart,
      colorClass: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
      borderHover: 'hover:border-blue-500',
    },
    {
      id: 'add_stock',
      label: t.addStock,
      icon: PackagePlus,
      colorClass: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
      borderHover: 'hover:border-indigo-500',
    },
    {
      id: 'add_customer',
      label: t.addCustomer,
      icon: UserPlus,
      colorClass: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
      borderHover: 'hover:border-purple-500',
    },
    {
      id: 'receive_payment',
      label: t.receivePayment,
      icon: DollarSign,
      colorClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
      borderHover: 'hover:border-emerald-500',
    },
    {
      id: 'add_expense',
      label: t.addExpense,
      icon: Receipt,
      colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
      borderHover: 'hover:border-amber-500',
    },
    {
      id: 'mark_attendance',
      label: t.markAttendance,
      icon: UserCheck,
      colorClass: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60',
      borderHover: 'hover:border-cyan-500',
    },
    {
      id: 'production_entry',
      label: t.productionEntry,
      icon: Factory,
      colorClass: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60',
      borderHover: 'hover:border-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {actions.map(action => {
        const IconComp = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => setActiveQuickAction(action.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all cursor-pointer group shadow-2xs hover:shadow-xs active:scale-98 ${action.borderHover}`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${action.colorClass}`}
            >
              <IconComp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-snug line-clamp-2">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
