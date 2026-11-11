import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { Clock, Send, DollarSign, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const PendingPaymentsTable: React.FC = () => {
  const { pendingPayments, setActiveQuickAction, addActivity, t } = useApp();
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  const handleSendReminder = (item: typeof pendingPayments[0]) => {
    setReminderSentId(item.id);
    addActivity(
      'Sent Payment Reminder',
      `WhatsApp & SMS alert sent to ${item.customerName} for ${formatIndianCurrency(item.dueAmount)}`,
      'Accounts'
    );
    setTimeout(() => {
      setReminderSentId(null);
    }, 2000);
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.pendingPayments}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overdue customer ledger balances and collection schedule
          </p>
        </div>

        <NavLink
          to="/accounts"
          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
        >
          {t.viewAll}
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Customer / Firm</th>
              <th className="py-2.5 px-3 font-mono">Invoice</th>
              <th className="py-2.5 px-3 text-right">Due Amount</th>
              <th className="py-2.5 px-3 text-center">Due Date</th>
              <th className="py-2.5 px-3 text-center">Aging Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingPayments.map(p => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {p.customerName}
                  </div>
                  <div className="text-[11px] text-slate-500">{p.phone}</div>
                </td>

                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                  {p.invoiceNumber}
                </td>

                <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  {formatIndianCurrency(p.dueAmount)}
                </td>

                <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                  {p.dueDate}
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'Critical Overdue'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        : p.status === 'Overdue'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {p.daysOverdue > 0 ? `${p.daysOverdue}d Overdue` : 'Due Soon'}
                  </span>
                </td>

                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleSendReminder(p)}
                      disabled={reminderSentId === p.id}
                      className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        reminderSentId === p.id
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      title="Send WhatsApp payment reminder"
                    >
                      {reminderSentId === p.id ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Sent
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" /> Remind
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveQuickAction('receive_payment')}
                      className="px-2 py-1 rounded text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 shadow-2xs"
                      title="Record Payment in Khata"
                    >
                      <DollarSign className="w-3 h-3" /> Receive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
