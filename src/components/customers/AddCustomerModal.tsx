import React, { useState } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { FullCustomer, CustomerCategory } from '../../types';
import { X, UserPlus, Building, Phone, Mail, MapPin, CreditCard, AlertCircle } from 'lucide-react';

interface AddCustomerModalProps {
  onClose: () => void;
  existingCustomer?: FullCustomer;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, existingCustomer }) => {
  const { addCustomer, updateCustomer } = useEnterprise();

  const [name, setName] = useState(existingCustomer?.name || '');
  const [firmName, setFirmName] = useState(existingCustomer?.firmName || '');
  const [phone, setPhone] = useState(existingCustomer?.phone || '');
  const [email, setEmail] = useState(existingCustomer?.email || '');
  const [gstin, setGstin] = useState(existingCustomer?.gstin || '');
  const [pan, setPan] = useState(existingCustomer?.pan || '');
  const [category, setCategory] = useState<CustomerCategory>(existingCustomer?.category || 'Dealer');
  const [city, setCity] = useState(existingCustomer?.city || '');
  const [state, setState] = useState(existingCustomer?.state || 'Punjab');
  const [stateCode, setStateCode] = useState(existingCustomer?.stateCode || '03');
  const [billingAddress, setBillingAddress] = useState(existingCustomer?.billingAddress || '');
  const [creditLimit, setCreditLimit] = useState<number>(existingCustomer?.creditLimit || 500000);
  const [openingBalance, setOpeningBalance] = useState<number>(existingCustomer?.openingBalance || 0);
  const [notes, setNotes] = useState(existingCustomer?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !firmName || !phone) {
      setError('Contact Person, Firm Name, and Mobile Phone are required');
      return;
    }

    if (existingCustomer) {
      updateCustomer(existingCustomer.id, {
        name,
        firmName,
        phone,
        email,
        gstin,
        pan,
        category,
        city,
        state,
        stateCode,
        billingAddress,
        creditLimit: Number(creditLimit) || 0,
        notes,
      });
    } else {
      addCustomer({
        name,
        firmName,
        phone,
        email: email || `${phone.replace(/\D/g, '')}@goyalfeed.partner`,
        gstin,
        pan,
        category,
        city: city || 'Khanna',
        state,
        stateCode,
        billingAddress: billingAddress || `${city}, ${state}`,
        shippingAddress: billingAddress || `${city}, ${state}`,
        creditLimit: Number(creditLimit) || 500000,
        openingBalance: Number(openingBalance) || 0,
        currentOutstanding: Number(openingBalance) || 0,
        totalSales: 0,
        totalPayments: 0,
        lastPurchaseDate: new Date().toLocaleDateString('en-GB'),
        notes,
        status: 'Active',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {existingCustomer ? 'Edit Customer / Dealer' : 'Register New Dealer / Customer'}
              </h2>
              <p className="text-xs text-slate-500">
                Goyal Cattle Feed Pvt. Ltd. | Commercial Partner Directory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
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
              <label className="block font-semibold mb-1">Firm / Agency Name *</label>
              <input
                type="text"
                value={firmName}
                onChange={e => setFirmName(e.target.value)}
                placeholder="e.g. Kisan Agro Traders"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Person Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Gurpreet Singh"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mobile Number *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98141 87654"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CustomerCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Dealer">Authorized Dealer</option>
                <option value="Wholesale">Wholesale Distributor</option>
                <option value="Dairy Farm">Commercial Dairy Farm</option>
                <option value="Retail">Retail Counter</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value.toUpperCase())}
                placeholder="03AAACG1234F1Z8"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">PAN Number</label>
              <input
                type="text"
                value={pan}
                onChange={e => setPan(e.target.value.toUpperCase())}
                placeholder="AAACG1234F"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">City / Town</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Ludhiana"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">State & State Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="Punjab"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <input
                  type="text"
                  value={stateCode}
                  onChange={e => setStateCode(e.target.value)}
                  placeholder="03"
                  className="w-16 text-center px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Approved Credit Limit (₹)</label>
              <input
                type="number"
                min="0"
                step="10000"
                value={creditLimit || ''}
                onChange={e => setCreditLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Opening Balance (₹)</label>
              <input
                type="number"
                min="0"
                value={openingBalance || ''}
                onChange={e => setOpeningBalance(Number(e.target.value))}
                disabled={!!existingCustomer}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono disabled:opacity-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Billing & Delivery Address</label>
              <input
                type="text"
                value={billingAddress}
                onChange={e => setBillingAddress(e.target.value)}
                placeholder="Shop No. 14, Main Grain Market, Ludhiana"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Special Notes / Credit Terms</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. 15-day credit cycle. Requires dispatch bilty on WhatsApp."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
            >
              {existingCustomer ? 'Save Changes' : 'Register Customer'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
