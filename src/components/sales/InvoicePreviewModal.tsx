import React, { useState } from 'react';
import { SalesInvoice } from '../../types';
import { generateInvoicePdf, printDocument, shareViaWhatsApp, copyToClipboard } from '../../utils/exportUtils';
import { numberToIndianWords } from '../../utils/billingCalculations';
import {
  Printer,
  Download,
  Share2,
  Copy,
  Check,
  X,
  FileText,
  Building,
  Calendar,
  CreditCard,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface InvoicePreviewModalProps {
  invoice: SalesInvoice | null;
  onClose: () => void;
  onDuplicate?: (invoiceId: string) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  onClose,
  onDuplicate,
}) => {
  const [printFormat, setPrintFormat] = useState<'a4_portrait' | 'a4_landscape' | 'thermal'>('a4_portrait');
  const [copied, setCopied] = useState(false);

  if (!invoice) return null;

  const handleCopySummary = async () => {
    const summary = `*INVOICE SUMMARY*\nCompany: Goyal Cattle Feed Pvt. Ltd.\nDoc: ${invoice.documentType} #${invoice.invoiceNumber}\nDate: ${invoice.invoiceDate}\nCustomer: ${invoice.customerFirm || invoice.customerName}\nTotal Amount: ₹${invoice.grandTotal.toLocaleString('en-IN')}\nAmount Paid: ₹${invoice.amountPaid.toLocaleString('en-IN')}\nBalance Due: ₹${invoice.balanceDue.toLocaleString('en-IN')}\nStatus: ${invoice.paymentStatus}`;
    const success = await copyToClipboard(summary);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const message = `Namaste ${invoice.customerName},\n\nHere are details for your *${invoice.documentType}* #${invoice.invoiceNumber} from *Goyal Cattle Feed Pvt. Ltd.*:\n\nDate: ${invoice.invoiceDate}\nTotal Amount: ₹${invoice.grandTotal.toLocaleString('en-IN')}\nPaid: ₹${invoice.amountPaid.toLocaleString('en-IN')}\nBalance Due: ₹${invoice.balanceDue.toLocaleString('en-IN')}\nPayment Status: ${invoice.paymentStatus}\n\nThank you for choosing Goyal Cattle Feed!`;
    shareViaWhatsApp(invoice.customerPhone, message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {invoice.documentType} – {invoice.invoiceNumber}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    invoice.paymentStatus === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : invoice.paymentStatus === 'Partially Paid'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : invoice.paymentStatus === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}
                >
                  {invoice.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created {invoice.invoiceDate} by {invoice.createdBy}
              </p>
            </div>
          </div>

          {/* Format Selector & Actions */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Format toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900 text-xs">
              <button
                type="button"
                onClick={() => setPrintFormat('a4_portrait')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  printFormat === 'a4_portrait'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                A4 Portrait
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('a4_landscape')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  printFormat === 'a4_landscape'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                A4 Landscape
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('thermal')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  printFormat === 'thermal'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Thermal POS (80mm)
              </button>
            </div>

            {/* Quick action buttons */}
            <button
              onClick={() => generateInvoicePdf(invoice)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>

            <button
              onClick={() => printDocument()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition shadow-xs"
              title="Print Voucher"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-xs"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Copy Summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            {onDuplicate && (
              <button
                onClick={() => onDuplicate(invoice.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Duplicate into new draft"
              >
                <Layers className="w-3.5 h-3.5" />
                Duplicate
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 dark:bg-slate-950 flex justify-center">
          
          {/* THERMAL 80mm RECEIPT VIEW */}
          {printFormat === 'thermal' ? (
            <div className="w-[80mm] max-w-full bg-white text-black p-4 text-[11px] font-mono shadow-md border border-slate-300 leading-tight">
              <div className="text-center pb-2 border-b border-dashed border-black">
                <h2 className="font-bold text-sm tracking-wider">GOYAL CATTLE FEED</h2>
                <p className="text-[10px]">Pvt. Ltd. - Khanna (Pb)</p>
                <p className="text-[9px]">Ph: +91 1628 238900</p>
                <p className="text-[9px]">GSTIN: 03AAACG1234F1Z8</p>
              </div>

              <div className="py-2 border-b border-dashed border-black">
                <div className="flex justify-between">
                  <span>Doc:</span>
                  <span className="font-semibold">{invoice.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inv#:</span>
                  <span className="font-semibold">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{invoice.invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold truncate max-w-[130px]">{invoice.customerFirm || invoice.customerName}</span>
                </div>
                {invoice.customerGstin && (
                  <div className="flex justify-between">
                    <span>GST:</span>
                    <span>{invoice.customerGstin}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="py-2 border-b border-dashed border-black">
                <div className="flex justify-between font-bold border-b border-black pb-1 mb-1 text-[10px]">
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Rate</span>
                  <span>Amt</span>
                </div>
                {invoice.items.map((it, idx) => (
                  <div key={idx} className="mb-1">
                    <div className="font-bold truncate">{it.productName}</div>
                    <div className="flex justify-between text-[10px] text-slate-700">
                      <span>HSN:{it.hsn}</span>
                      <span>{it.quantity} {it.unit}</span>
                      <span>₹{it.rate}</span>
                      <span className="font-bold text-black">₹{it.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="py-2 space-y-0.5 border-b border-dashed border-black">
                <div className="flex justify-between">
                  <span>Taxable:</span>
                  <span>₹{invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                {invoice.isInterState ? (
                  <div className="flex justify-between">
                    <span>IGST:</span>
                    <span>₹{invoice.igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>CGST:</span>
                      <span>₹{invoice.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST:</span>
                      <span>₹{invoice.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                )}
                {invoice.additionalChargesTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Addl Charges:</span>
                    <span>₹{invoice.additionalChargesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-black">
                  <span>NET TOTAL:</span>
                  <span>₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span>₹{invoice.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-red-700">
                  <span>BALANCE DUE:</span>
                  <span>₹{invoice.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[9px] text-slate-600">
                <p>Thank You For Your Business!</p>
                <p>Computer Generated Receipt</p>
              </div>
            </div>
          ) : (
            /* STANDARD A4 INVOICE (PORTRAIT & LANDSCAPE) */
            <div
              className={`bg-white text-slate-900 border border-slate-300 shadow-md p-8 print:p-0 print:border-none print:shadow-none ${
                printFormat === 'a4_landscape'
                  ? 'w-[1050px] min-h-[700px]'
                  : 'w-[780px] min-h-[1050px]'
              }`}
            >
              {/* Authentic Indian GST Tax Invoice Header */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-emerald-800 flex items-center justify-center text-white font-black text-sm">
                      G
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">
                      Goyal Cattle Feed Pvt. Ltd.
                    </h1>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Manufacturer of Premium Balanced Cattle Feed, Pellets & Mineral Mixtures
                  </p>
                  <p className="text-xs text-slate-600">
                    GT Road Industrial Area, Khanna, Punjab - 141401 | Ph: +91 1628 238900, 238901
                  </p>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 pt-1">
                    <span>GSTIN: 03AAACG1234F1Z8</span>
                    <span>•</span>
                    <span>State: Punjab (03)</span>
                    <span>•</span>
                    <span>PAN: AAACG1234F</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-wider mb-2">
                    {invoice.documentType}
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-sm text-slate-900">
                      Invoice No: <span className="font-mono text-emerald-800">{invoice.invoiceNumber}</span>
                    </p>
                    <p className="text-slate-600">
                      Date: <span className="font-semibold text-slate-900">{invoice.invoiceDate}</span>
                    </p>
                    <p className="text-slate-600">
                      Due Date: <span className="font-semibold text-slate-900">{invoice.dueDate}</span>
                    </p>
                    <p className="text-slate-600">
                      Place of Supply: <span className="font-semibold text-slate-900">{invoice.placeOfSupply}</span>
                    </p>
                    {invoice.referenceNumber && (
                      <p className="text-slate-600">
                        Ref / PO: <span className="font-semibold text-slate-900">{invoice.referenceNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To Boxes */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                    Details of Receiver (Billed To)
                  </span>
                  <p className="font-bold text-sm text-slate-900">{invoice.customerFirm || invoice.customerName}</p>
                  <p className="text-slate-700 font-medium">{invoice.customerName}</p>
                  <p className="text-slate-600">{invoice.billingAddress}</p>
                  <p className="text-slate-600">
                    State: {invoice.state} ({invoice.stateCode}) | Phone: {invoice.customerPhone}
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    GSTIN: {invoice.customerGstin || 'URP (Unregistered Dealer)'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                    Details of Consignee (Shipped To)
                  </span>
                  <p className="font-bold text-sm text-slate-900">{invoice.customerFirm || invoice.customerName}</p>
                  <p className="text-slate-600">{invoice.shippingAddress || invoice.billingAddress}</p>
                  <p className="text-slate-600">Destination: {invoice.state} ({invoice.stateCode})</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                    <span>Payment Terms: <strong className="text-slate-900">{invoice.paymentTerms}</strong></span>
                    <span>Mode: <strong className="text-slate-900">{invoice.paymentMode}</strong></span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-4">
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-2 border-r border-slate-300 text-center w-8">#</th>
                      <th className="p-2 border-r border-slate-300 text-left">Description of Goods</th>
                      <th className="p-2 border-r border-slate-300 text-center w-20">HSN/SAC</th>
                      <th className="p-2 border-r border-slate-300 text-center w-16">Qty</th>
                      <th className="p-2 border-r border-slate-300 text-center w-14">Unit</th>
                      <th className="p-2 border-r border-slate-300 text-right w-20">Rate (₹)</th>
                      <th className="p-2 border-r border-slate-300 text-right w-16">Disc %</th>
                      <th className="p-2 border-r border-slate-300 text-right w-24">Taxable Val</th>
                      <th className="p-2 border-r border-slate-300 text-center w-14">GST %</th>
                      <th className="p-2 text-right w-24">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-200 hover:bg-slate-50/50">
                        <td className="p-2 border-r border-slate-200 text-center text-slate-500">{index + 1}</td>
                        <td className="p-2 border-r border-slate-200">
                          <p className="font-semibold text-slate-900">{item.productName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{item.sku}</p>
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-700">{item.hsn}</td>
                        <td className="p-2 border-r border-slate-200 text-center font-semibold">{item.quantity}</td>
                        <td className="p-2 border-r border-slate-200 text-center text-slate-600">{item.unit}</td>
                        <td className="p-2 border-r border-slate-200 text-right">{item.rate.toFixed(2)}</td>
                        <td className="p-2 border-r border-slate-200 text-right text-slate-600">
                          {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-medium">
                          {item.taxableValue.toFixed(2)}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center text-slate-700">{item.gstRate}%</td>
                        <td className="p-2 text-right font-bold text-slate-950">{item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations and Breakdown Section */}
              <div className="grid grid-cols-12 gap-6 py-2 border-t border-slate-200 text-xs">
                {/* Left side: In Words, Bank details & terms */}
                <div className="col-span-7 space-y-3">
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Total Amount in Words:</span>
                    <p className="font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 p-2 rounded text-[11px] leading-relaxed italic">
                      {numberToIndianWords(invoice.grandTotal)}
                    </p>
                  </div>

                  {/* Bank Accounts */}
                  <div className="border border-slate-200 rounded p-2.5 bg-slate-50 text-[11px] space-y-0.5">
                    <span className="font-bold text-slate-800 block text-xs mb-1">Company Bank Details for RTGS / NEFT:</span>
                    <p><span className="text-slate-500">Bank:</span> <strong className="text-slate-800">HDFC Bank Ltd., GT Road Branch, Khanna</strong></p>
                    <p><span className="text-slate-500">A/C No:</span> <strong className="text-slate-800 font-mono">50200084920193</strong> (Current A/C)</p>
                    <p><span className="text-slate-500">IFSC Code:</span> <strong className="text-slate-800 font-mono">HDFC0000492</strong> | <span className="text-slate-500">UPI:</span> <strong className="text-slate-800">goyalfeed@hdfcbank</strong></p>
                  </div>

                  {/* Terms */}
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <strong className="text-slate-700">Terms & Conditions:</strong>
                    <ol className="list-decimal pl-3 space-y-0.5">
                      <li>Goods once sold will not be taken back or exchanged.</li>
                      <li>Interest @ 18% p.a. will be charged if payment is not cleared within agreed terms.</li>
                      <li>Subject to Khanna (Punjab) jurisdiction only.</li>
                    </ol>
                  </div>
                </div>

                {/* Right side: Summary Totals */}
                <div className="col-span-5 bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-medium">₹{invoice.taxableAmount.toFixed(2)}</span>
                  </div>

                  {invoice.isInterState ? (
                    <div className="flex justify-between text-slate-600">
                      <span>IGST (Integrated Tax):</span>
                      <span className="font-medium">₹{invoice.igstTotal.toFixed(2)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST (Central Tax):</span>
                        <span className="font-medium">₹{invoice.cgstTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST (State Tax):</span>
                        <span className="font-medium">₹{invoice.sgstTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {invoice.additionalCharges.transport > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Transport Freight:</span>
                      <span>₹{invoice.additionalCharges.transport.toFixed(2)}</span>
                    </div>
                  )}

                  {invoice.additionalCharges.loading > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Loading & Labour:</span>
                      <span>₹{invoice.additionalCharges.loading.toFixed(2)}</span>
                    </div>
                  )}

                  {invoice.additionalCharges.packaging > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Packaging:</span>
                      <span>₹{invoice.additionalCharges.packaging.toFixed(2)}</span>
                    </div>
                  )}

                  {invoice.roundOff !== 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Round Off:</span>
                      <span>₹{invoice.roundOff.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-t-2 border-b-2 border-slate-300 font-bold text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-emerald-800 text-base">₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-slate-700 pt-1">
                    <span>Amount Received:</span>
                    <span className="font-semibold text-emerald-700">₹{invoice.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Balance Due:</span>
                    <span className="text-red-600">₹{invoice.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 text-xs">
                <div className="text-center pt-8">
                  <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
                  <p className="text-slate-600 font-medium">Customer's Signature / Seal</p>
                </div>

                <div className="text-center pt-2">
                  <p className="font-bold text-slate-900">For Goyal Cattle Feed Pvt. Ltd.</p>
                  <div className="h-10 flex items-center justify-center italic text-emerald-800 font-serif text-sm">
                    Rajesh Goyal
                  </div>
                  <div className="border-t border-slate-400 w-48 mx-auto mb-1"></div>
                  <p className="text-slate-600 font-medium">Authorized Signatory</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
