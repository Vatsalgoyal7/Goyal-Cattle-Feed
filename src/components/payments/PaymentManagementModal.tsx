import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import { PaymentMode, PaymentAllocation, PaymentRecord } from '../../types';
import {
  X,
  CreditCard,
  DollarSign,
  Building,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface PaymentManagementModalProps {
  onClose: () => void;
  defaultPartyType?: 'Customer' | 'Supplier';
  defaultPartyId?: string;
}

export const PaymentManagementModal: React.FC<PaymentManagementModalProps> = ({
  onClose,
  defaultPartyType = 'Customer',
  defaultPartyId,
}) => {
  const { customers, suppliers, invoices, recordPayment } = useEnterprise();
  const { userProfile } = useApp();

  const [partyType, setPartyType] = useState<'Customer' | 'Supplier'>(defaultPartyType);
  const [selectedPartyId, setSelectedPartyId] = useState<string>(defaultPartyId || '');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('en-GB'));
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [allocations, setAllocations] = useState<{ [invId: string]: number }>({});
  const [error, setError] = useState<string>('');

  // Selected party details
  const selectedParty = useMemo(() => {
    if (partyType === 'Customer') {
      return customers.find(c => c.id === selectedPartyId);
    } else {
      return suppliers.find(s => s.id === selectedPartyId);
    }
  }, [partyType, selectedPartyId, customers, suppliers]);

  // Unpaid or partially paid invoices for this customer
  const pendingInvoices = useMemo(() => {
    if (partyType !== 'Customer' || !selectedPartyId) return [];
    return invoices.filter(
      inv =>
        (inv.customerId === selectedPartyId || inv.customerFirm === selectedParty?.firmName) &&
        inv.balanceDue > 0 &&
        inv.paymentStatus !== 'Cancelled'
    );
  }, [partyType, selectedPartyId, invoices, selectedParty]);

  const handleAutoAllocate = () => {
    let rem = Number(amount) || 0;
    const newAlloc: { [invId: string]: number } = {};

    pendingInvoices.forEach(inv => {
      if (rem <= 0) return;
      const take = Math.min(rem, inv.balanceDue);
      newAlloc[inv.id] = take;
      rem -= take;
    });

    setAllocations(newAlloc);
  };

  const handleCustomAlloc = (invId: string, val: number) => {
    setAllocations(prev => ({ ...prev, [invId]: val }));
  };

  const totalAllocated = Object.values(allocations).reduce((a, b) => a + (Number(b) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartyId || !selectedParty) {
      setError('Please select a party');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Payment amount must be greater than zero');
      return;
    }

    const linkedInvoices: PaymentAllocation[] = Object.entries(allocations)
      .filter(([_, allocAmt]) => allocAmt > 0)
      .map(([invId, allocAmt]) => {
        const inv = invoices.find(i => i.id === invId);
        return {
          invoiceId: invId,
          invoiceNumber: inv?.invoiceNumber || invId,
          allocatedAmount: allocAmt,
        };
      });

    recordPayment({
      date,
      partyType,
      partyId: selectedParty.id,
      partyName: selectedParty.name,
      partyFirm: selectedParty.firmName,
      amount: Number(amount),
      paymentMode,
      transactionRef,
      notes,
      linkedInvoices,
      receiptType: partyType === 'Customer' ? 'Customer Received' : 'Supplier Paid',
      createdBy: userProfile?.fullName || 'Cashier',
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Record Payment & Receipt Voucher
              </h2>
              <p className="text-xs text-slate-500">
                Goyal Cattle Feed Pvt. Ltd. | Customer Inward Receipt or Supplier Outward Disbursement
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-50 text-red-700 text-xs flex items-center gap-2 border-b border-red-200">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* Party Type toggle */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setPartyType('Customer');
                setSelectedPartyId('');
              }}
              className={`flex-1 py-1.5 rounded-md font-semibold transition ${
                partyType === 'Customer'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Customer Payment Receipt (Inward)
            </button>
            <button
              type="button"
              onClick={() => {
                setPartyType('Supplier');
                setSelectedPartyId('');
              }}
              className={`flex-1 py-1.5 rounded-md font-semibold transition ${
                partyType === 'Supplier'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Supplier Payment Disbursement (Outward)
            </button>
          </div>

          {/* Party Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">
                Select {partyType === 'Customer' ? 'Dealer / Customer' : 'Supplier'} *
              </label>
              <select
                value={selectedPartyId}
                onChange={e => setSelectedPartyId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="">-- Choose {partyType} --</option>
                {partyType === 'Customer'
                  ? customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.firmName} ({c.name} - Outstanding: ₹{c.currentOutstanding.toLocaleString('en-IN')})
                      </option>
                    ))
                  : suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.firmName} (Due: ₹{s.currentPayable.toLocaleString('en-IN')})
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Amount (₹) *</label>
              <input
                type="number"
                min="1"
                step="any"
                value={amount || ''}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Mode *</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Bank Transfer">Bank Transfer (RTGS / NEFT / IMPS)</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash Counter</option>
                <option value="Other">Other Adjustment</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Receipt Date</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Bank UTR / Cheque Number / Ref</label>
              <input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                placeholder="e.g. UTR-HDFC-992100"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Notes / Remarks</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Cleared payment for feed batch dispatched on Monday"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Multi-Invoice Allocation (For Customers) */}
          {partyType === 'Customer' && pendingInvoices.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Allocate Across Pending Invoices ({pendingInvoices.length} Due)
                </span>
                <button
                  type="button"
                  onClick={handleAutoAllocate}
                  className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium text-[11px]"
                >
                  Auto-Allocate FIFO
                </button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {pendingInvoices.map(inv => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
                  >
                    <div>
                      <strong className="font-mono">{inv.invoiceNumber}</strong> ({inv.invoiceDate})
                      <span className="text-slate-500 block">Due: ₹{inv.balanceDue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Allocate: ₹</span>
                      <input
                        type="number"
                        min="0"
                        max={inv.balanceDue}
                        value={allocations[inv.id] || ''}
                        onChange={e => handleCustomAlloc(inv.id, Number(e.target.value))}
                        placeholder="0"
                        className="w-24 px-2 py-1 text-right font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition"
            >
              Record Payment Receipt
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
