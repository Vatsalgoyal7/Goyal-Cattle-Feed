import React, { useState } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { FullSupplier } from '../../types';
import { X, Building2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

interface AddSupplierModalProps {
  onClose: () => void;
  existingSupplier?: FullSupplier;
}

export const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ onClose, existingSupplier }) => {
  const { addSupplier, updateSupplier } = useEnterprise();

  const [firmName, setFirmName] = useState(existingSupplier?.firmName || '');
  const [name, setName] = useState(existingSupplier?.name || '');
  const [phone, setPhone] = useState(existingSupplier?.phone || '');
  const [email, setEmail] = useState(existingSupplier?.email || '');
  const [gstin, setGstin] = useState(existingSupplier?.gstin || '');
  const [city, setCity] = useState(existingSupplier?.city || '');
  const [state, setState] = useState(existingSupplier?.state || 'Punjab');
  const [address, setAddress] = useState(existingSupplier?.address || '');
  const [suppliedProductsStr, setSuppliedProductsStr] = useState(
    existingSupplier?.suppliedProducts.join(', ') || 'Yellow Maize, Soybean DOC'
  );
  const [creditDays, setCreditDays] = useState<number>(existingSupplier?.creditDays || 15);
  const [bankName, setBankName] = useState(existingSupplier?.bankDetails?.bankName || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(existingSupplier?.bankDetails?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(existingSupplier?.bankDetails?.ifscCode || '');
  const [openingBalance, setOpeningBalance] = useState<number>(existingSupplier?.openingBalance || 0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName || !name || !phone) {
      setError('Supplier Firm Name, Contact Person, and Phone are required');
      return;
    }

    const products = suppliedProductsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (existingSupplier) {
      updateSupplier(existingSupplier.id, {
        firmName,
        name,
        phone,
        email,
        gstin,
        city,
        state,
        address,
        suppliedProducts: products,
        creditDays: Number(creditDays) || 15,
        bankDetails: {
          bankName,
          accountNumber,
          ifscCode,
          branch: city,
        },
      });
    } else {
      addSupplier({
        firmName,
        name,
        phone,
        email: email || `${phone.replace(/\D/g, '')}@supplier.goyal`,
        gstin,
        city: city || 'Khanna',
        state,
        stateCode: '03',
        address: address || `${city}, ${state}`,
        suppliedProducts: products,
        creditDays: Number(creditDays) || 15,
        openingBalance: Number(openingBalance) || 0,
        currentPayable: Number(openingBalance) || 0,
        totalPurchases: 0,
        totalPayments: 0,
        bankDetails: {
          bankName,
          accountNumber,
          ifscCode,
          branch: city,
        },
        status: 'Active',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {existingSupplier ? 'Edit Supplier' : 'Register Raw Material Supplier'}
              </h2>
              <p className="text-xs text-slate-500">
                Goyal Cattle Feed Pvt. Ltd. | Grain Millers, Oil Mills & Bag Manufacturers
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Supplier Firm Name *</label>
              <input
                type="text"
                value={firmName}
                onChange={e => setFirmName(e.target.value)}
                placeholder="e.g. Punjab Agro Industries Ltd."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Person *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Harnek Singh"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mobile Phone *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98142 11223"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Supplier GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value.toUpperCase())}
                placeholder="03AAACG8899F1Z2"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Supplied Products (comma separated)</label>
              <input
                type="text"
                value={suppliedProductsStr}
                onChange={e => setSuppliedProductsStr(e.target.value)}
                placeholder="Yellow Maize, Soybean DOC, Mustard Cake"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Agreed Credit Term (Days)</label>
              <input
                type="number"
                value={creditDays || ''}
                onChange={e => setCreditDays(Number(e.target.value))}
                placeholder="15"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Khanna"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="Punjab"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Bank Details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-700 block">Bank Settlement Details</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-500">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              {existingSupplier ? 'Update Supplier' : 'Register Supplier'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
