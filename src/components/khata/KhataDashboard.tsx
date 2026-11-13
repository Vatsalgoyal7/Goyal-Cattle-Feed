import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { useApp } from '../../context/AppContext';
import { formatIndianCurrency } from '../../data/sampleData';
import { FullCustomer } from '../../types';
import {
  Search,
  Mic,
  Share2,
  Phone,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  CheckCircle,
  FileText,
  User,
  Building,
  Calendar,
  X,
  Camera,
  MessageCircle,
  Wallet,
  AlertCircle
} from 'lucide-react';

interface KhataEntry {
  id: string;
  customerId: string;
  date: string;
  description: string;
  type: 'gave' | 'got'; // gave = aapne diye (red), got = aapko mile (green)
  amount: number;
  billPhoto?: string;
}

export const KhataDashboard: React.FC = () => {
  const { customers, setCustomers } = useEnterprise();
  const { companyProfile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'due' | 'advance' | 'settled'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<FullCustomer | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isCashbookOpen, setIsCashbookOpen] = useState(false);

  // New Customer Form
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustFirm, setNewCustFirm] = useState('');
  const [newCustOpeningBal, setNewCustOpeningBal] = useState('');
  const [newCustBalType, setNewCustBalType] = useState<'due' | 'advance'>('due');

  // Ledger Entries state stored in memory / localStorage
  const [ledgerEntries, setLedgerEntries] = useState<Record<string, KhataEntry[]>>(() => {
    try {
      const saved = localStorage.getItem('goyal_khata_ledger_entries');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Entry Modal State (Aapne Diye vs Aapko Mile)
  const [entryModalType, setEntryModalType] = useState<'gave' | 'got' | null>(null);
  const [entryAmount, setEntryAmount] = useState('');
  const [entryNote, setEntryNote] = useState('');
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [entryPhoto, setEntryPhoto] = useState<string | null>(null);

  // Cashbook State
  const [cashInHand, setCashInHand] = useState(() => {
    return Number(localStorage.getItem('goyal_cash_in_hand')) || 25000;
  });

  // Net Calculations
  const { totalLenaHai, totalDenaHai } = useMemo(() => {
    let lena = 0;
    let dena = 0;
    customers.forEach((c) => {
      const bal = c.currentOutstanding || 0;
      if (bal > 0) lena += bal;
      else if (bal < 0) dena += Math.abs(bal);
    });
    return { totalLenaHai: lena, totalDenaHai: dena };
  }, [customers]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (c.firmName && c.firmName.toLowerCase().includes(term)) ||
        c.phone.includes(term);

      if (!matchesSearch) return false;

      const bal = c.currentOutstanding || 0;
      if (filterType === 'due') return bal > 0;
      if (filterType === 'advance') return bal < 0;
      if (filterType === 'settled') return bal === 0;
      return true;
    });
  }, [customers, searchTerm, filterType]);

  // Save new customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const opBal = Number(newCustOpeningBal) || 0;
    const finalBal = newCustBalType === 'due' ? opBal : -opBal;

    const newCust: FullCustomer = {
      id: `cst-${Date.now()}`,
      customerId: `GCF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCustName.trim(),
      firmName: newCustFirm.trim() || newCustName.trim(),
      phone: newCustPhone.trim() || '+91 98000 00000',
      email: '',
      address: 'Gajraula Area',
      city: 'Gajraula',
      state: 'Uttar Pradesh',
      category: 'Farmer / Milk Producer',
      creditLimit: 200000,
      creditDays: 30,
      currentOutstanding: finalBal,
      totalSales: opBal,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const updated = [newCust, ...customers];
    setCustomers(updated);
    localStorage.setItem('goyal_customers', JSON.stringify(updated));

    // Reset Form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustFirm('');
    setNewCustOpeningBal('');
    setIsAddCustomerOpen(false);
  };

  // Add entry (Aapne Diye ya Aapko Mile)
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !entryModalType || !entryAmount) return;

    const amt = Number(entryAmount) || 0;
    if (amt <= 0) return;

    const newEntry: KhataEntry = {
      id: `entry-${Date.now()}`,
      customerId: selectedCustomer.id,
      date: entryDate,
      description: entryNote.trim() || (entryModalType === 'gave' ? 'माल / पशु आहार दिया' : 'पेमेंट प्राप्त हुआ'),
      type: entryModalType,
      amount: amt,
      billPhoto: entryPhoto || undefined,
    };

    // Update Ledger
    const currentCustEntries = ledgerEntries[selectedCustomer.id] || [];
    const updatedLedger = {
      ...ledgerEntries,
      [selectedCustomer.id]: [newEntry, ...currentCustEntries],
    };
    setLedgerEntries(updatedLedger);
    localStorage.setItem('goyal_khata_ledger_entries', JSON.stringify(updatedLedger));

    // Update Customer Outstanding:
    // gave (aapne diye) -> increases customer debt (+)
    // got (aapko mile) -> decreases customer debt (-)
    const delta = entryModalType === 'gave' ? amt : -amt;
    const updatedCustomers = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        const newBal = (c.currentOutstanding || 0) + delta;
        return {
          ...c,
          currentOutstanding: newBal,
          totalSales: entryModalType === 'gave' ? (c.totalSales || 0) + amt : c.totalSales,
        };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    localStorage.setItem('goyal_customers', JSON.stringify(updatedCustomers));
    setSelectedCustomer(updatedCustomers.find((c) => c.id === selectedCustomer.id) || null);

    // Reset Entry Form
    setEntryAmount('');
    setEntryNote('');
    setEntryPhoto(null);
    setEntryModalType(null);
  };

  // 1-Click WhatsApp Reminder (Tagada)
  const handleSendWhatsAppTagada = (customer: FullCustomer) => {
    const due = customer.currentOutstanding || 0;
    if (due <= 0) {
      alert(`इनका कोई बकाया नहीं है (हिसाब चुकता है)`);
      return;
    }
    const store = companyProfile.companyName || 'Goyal Cattle Feed Store';
    const text = encodeURIComponent(
      `नमस्ते ${customer.name} जी,\n\n${store} (गजरौला) से आपका कुल बकाया हिसाब *${formatIndianCurrency(due)}* है।\n\nकृपया सुविधा अनुसार भुगतान करें।\n\nऑनलाइन भुगतान UPI: 9837049021@upi\nधन्यवाद!\n- वत्सल गोयल (+91 98370 49021)`
    );
    const cleanPhone = customer.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div
      className="space-y-4 max-w-5xl mx-auto pb-12 select-none"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
    >
      {/* ── TOP KHATABOOK NET SUMMARY BAR ── */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <span>{companyProfile.companyName}</span>
              <span>·</span>
              <span className="text-amber-300">ESTD 2002</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              ग्राहक खाता (Khatabook)
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCashbookOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>दुकान का गल्ला / Cashbook</span>
            </button>
          </div>
        </div>

        {/* The Two Big Numbers: Lena Hai vs Dena Hai */}
        <div className="grid grid-cols-2 gap-4 pt-5">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="text-xs sm:text-sm font-bold text-emerald-200 flex items-center gap-1.5">
              <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
              <span>आपको लेना है (You'll Get)</span>
            </div>
            <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-300 mt-1.5 tabular-nums">
              {formatIndianCurrency(totalLenaHai)}
            </div>
            <p className="text-[11px] text-emerald-100/70 mt-1">
              {customers.filter((c) => (c.currentOutstanding || 0) > 0).length} ग्राहकों से वसूली बाकी
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="text-xs sm:text-sm font-bold text-rose-200 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-rose-300" />
              <span>आपको देना है (You'll Give)</span>
            </div>
            <div className="text-2xl sm:text-4xl font-black font-mono text-rose-300 mt-1.5 tabular-nums">
              {formatIndianCurrency(totalDenaHai)}
            </div>
            <p className="text-[11px] text-rose-100/70 mt-1">
              एडवांस जमा या सप्लायर बाकी
            </p>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER TABS ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs space-y-3">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ग्राहक का नाम, दुकान या मोबाइल नंबर से खोजें..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400 placeholder:font-normal"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4 Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            सभी ग्राहक ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('due')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'due'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            पैसा लेना है ({customers.filter((c) => (c.currentOutstanding || 0) > 0).length})
          </button>
          <button
            onClick={() => setFilterType('advance')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'advance'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            एडवांस जमा ({customers.filter((c) => (c.currentOutstanding || 0) < 0).length})
          </button>
          <button
            onClick={() => setFilterType('settled')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterType === 'settled'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            हिसाब चुकता ({customers.filter((c) => (c.currentOutstanding || 0) === 0).length})
          </button>
        </div>
      </div>

      {/* ── CUSTOMER LIST (THE KHATABOOK CARDS) ── */}
      <div className="space-y-2.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <User className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              कोई ग्राहक नहीं मिला
            </h3>
            <p className="text-xs text-slate-500">
              नीचे दिए गए हरे बटन पर क्लिक करके नया ग्राहक खाता जोड़ें।
            </p>
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const bal = c.currentOutstanding || 0;
            const isDue = bal > 0;
            const isAdvance = bal < 0;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 transition-all shadow-xs cursor-pointer flex items-center justify-between gap-3 group"
              >
                {/* Left: Avatar & Name */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-xs">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                      {c.name}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate mt-0.5">
                      {c.firmName && <span className="font-medium">{c.firmName}</span>}
                      <span>·</span>
                      <span>📞 {c.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Net Amount & WhatsApp Trigger */}
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div
                      className={`text-lg sm:text-2xl font-black font-mono tabular-nums ${
                        isDue
                          ? 'text-rose-600 dark:text-rose-400'
                          : isAdvance
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {formatIndianCurrency(Math.abs(bal))}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      {isDue ? (
                        <span className="text-rose-600">लेना बाकी</span>
                      ) : isAdvance ? (
                        <span className="text-emerald-600">एडवांस</span>
                      ) : (
                        <span className="text-slate-400">हिसाब चुकता</span>
                      )}
                    </div>
                  </div>

                  {/* 1-Click WhatsApp reminder icon */}
                  {isDue && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendWhatsAppTagada(c);
                      }}
                      title="व्हाट्सएप पर तगादा भेजें"
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── FLOATING ACTION BUTTON: ADD CUSTOMER ── */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/30 text-sm sm:text-base transition-all hover:scale-105 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>+ नया ग्राहक जोड़ें (Add Customer)</span>
        </button>
      </div>

      {/* ── CUSTOMER PASSBOOK MODAL (KHATABOOK DETAIL SCREEN) ── */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[92vh] sm:h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-extrabold text-amber-300 text-lg">
                  {selectedCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white leading-tight">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {selectedCustomer.firmName} · {selectedCustomer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendWhatsAppTagada(selectedCustomer)}
                  className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="WhatsApp Statement"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">तगादा</span>
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Current Net Balance Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">कुल बकाया हिसाब</span>
                <div
                  className={`text-2xl sm:text-3xl font-black font-mono tabular-nums ${
                    (selectedCustomer.currentOutstanding || 0) > 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : (selectedCustomer.currentOutstanding || 0) < 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {formatIndianCurrency(Math.abs(selectedCustomer.currentOutstanding || 0))}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    (selectedCustomer.currentOutstanding || 0) > 0
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {(selectedCustomer.currentOutstanding || 0) > 0 ? 'लेना बाकी है' : 'हिसाब चुकता'}
                </span>
              </div>
            </div>

            {/* Passbook Running Ledger List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {(!ledgerEntries[selectedCustomer.id] || ledgerEntries[selectedCustomer.id].length === 0) ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <FileText className="w-12 h-12 mx-auto opacity-30" />
                  <p className="text-sm font-semibold">अभी कोई लेन-देन दर्ज नहीं है</p>
                  <p className="text-xs text-slate-400">
                    नीचे दिए गए <strong>"आपने दिए"</strong> या <strong>"आपको मिले"</strong> बटन से एंट्री करें।
                  </p>
                </div>
              ) : (
                ledgerEntries[selectedCustomer.id].map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.description}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(item.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-black font-mono tabular-nums ${
                          item.type === 'gave'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {item.type === 'gave' ? '-' : '+'} {formatIndianCurrency(item.amount)}
                      </div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {item.type === 'gave' ? 'आपने दिए' : 'आपको मिले'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* THE TWO ICONIC GIANT KHATABOOK BOTTOM BUTTONS */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 shrink-0">
              <button
                onClick={() => setEntryModalType('gave')}
                className="py-4 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-5 h-5" />
                <span>(-) आपने दिए (YOU GAVE)</span>
              </button>

              <button
                onClick={() => setEntryModalType('got')}
                className="py-4 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <ArrowDownLeft className="w-5 h-5" />
                <span>(+) आपको मिले (YOU GOT)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FAST ENTRY POPUP MODAL (2-STEP INPUT) ── */}
      {entryModalType && selectedCustomer && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                    entryModalType === 'gave' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {entryModalType === 'gave' ? 'आपने दिए (You Gave)' : 'आपको मिले (You Got)'}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setEntryModalType(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              {/* Big Amount Box */}
              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  रुपये (Amount) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-2xl font-black text-slate-400">₹</span>
                  <input
                    type="number"
                    autoFocus
                    required
                    value={entryAmount}
                    onChange={(e) => setEntryAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 text-3xl font-black font-mono rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Note / Vivaran */}
              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  विवरण (Item / Note)
                </label>
                <input
                  type="text"
                  value={entryNote}
                  onChange={(e) => setEntryNote(e.target.value)}
                  placeholder={
                    entryModalType === 'gave'
                      ? 'उदा. 10 बोरी SP पशु आहार, 2 बोरी सरसों खल'
                      : 'उदा. नकद मिला / GPay पेमेंट'
                  }
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-600"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  तारीख (Date)
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 text-white font-black text-base rounded-2xl shadow-lg transition-all cursor-pointer ${
                    entryModalType === 'gave' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  ✓ खाता में सेव करें (Save Entry)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD NEW CUSTOMER MODAL ── */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                नया ग्राहक खाता जोड़ें
              </h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  ग्राहक का नाम *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="उदा. रमेश सिंह / बलवंत जी"
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  मोबाइल नंबर (व्हाट्सएप हेतु) *
                </label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  दुकान / डेयरी का नाम
                </label>
                <input
                  type="text"
                  value={newCustFirm}
                  onChange={(e) => setNewCustFirm(e.target.value)}
                  placeholder="उदा. किसान डेयरी फार्म"
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  पुराना बकाया (यदि कोई हो)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newCustOpeningBal}
                    onChange={(e) => setNewCustOpeningBal(e.target.value)}
                    placeholder="₹ 0"
                    className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                  <select
                    value={newCustBalType}
                    onChange={(e) => setNewCustBalType(e.target.value as any)}
                    className="px-3 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="due">लेना है (Due)</option>
                    <option value="advance">एडवांस (Advance)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  ✓ ग्राहक खाता बनाएं
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DAILY CASHBOOK (GALLE KA HISAAB) MODAL ── */}
      {isCashbookOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-500" />
                  <span>दुकान का गल्ला / Cashbook</span>
                </h3>
                <p className="text-xs text-slate-500">रोज़नामचा दैनिक कैश नियंत्रण</p>
              </div>
              <button onClick={() => setIsCashbookOpen(false)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-xs text-amber-900 dark:text-amber-200 font-bold uppercase tracking-wide">
                गल्ले में वर्तमान कैश
              </span>
              <div className="text-3xl font-black font-mono text-amber-700 dark:text-amber-300 mt-1">
                {formatIndianCurrency(cashInHand)}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">आज की कुल कैश बिक्री:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  {formatIndianCurrency(0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">आज का विविध खर्च (चाय, पल्लेदारी):</span>
                <span className="font-mono font-bold text-rose-600 text-sm">
                  {formatIndianCurrency(0)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCashbookOpen(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
