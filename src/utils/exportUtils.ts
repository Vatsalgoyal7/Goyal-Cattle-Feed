import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { SalesInvoice } from '../types';
import { formatIndianCurrency } from '../data/sampleData';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Exports data to an Excel (.xlsx) file using the xlsx library
 */
export function exportToExcel(
  columns: ExportColumn[],
  data: Record<string, any>[],
  filename: string,
  sheetName: string = 'Sheet1'
): void {
  // Map row objects using column keys
  const rows = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(col => {
      row[col.header] = item[col.key] !== undefined ? item[col.key] : '';
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Exports data to a CSV file
 */
export function exportToCsv(
  columns: ExportColumn[],
  data: Record<string, any>[],
  filename: string
): void {
  const headers = columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(',');
  const rows = data.map(item => {
    return columns
      .map(col => {
        const val = item[col.key];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a tabular report to a formatted PDF using jsPDF
 */
export function exportTableToPdf(
  title: string,
  subtitle: string,
  columns: ExportColumn[],
  data: Record<string, any>[],
  filename: string
): void {
  const doc = new jsPDF({
    orientation: columns.length > 5 ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GOYAL CATTLE FEED PVT. LTD.', 40, 45);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 40, 65);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`${subtitle} | Generated: ${new Date().toLocaleDateString('en-GB')}`, 40, 80);

  // Table header
  let y = 105;
  const colWidth = (doc.internal.pageSize.getWidth() - 80) / columns.length;

  doc.setFillColor(4, 120, 87); // Forest emerald
  doc.rect(40, y - 14, doc.internal.pageSize.getWidth() - 80, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  columns.forEach((col, idx) => {
    doc.text(col.header, 45 + idx * colWidth, y);
  });

  // Table rows
  y += 18;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');

  data.forEach(item => {
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 40;
    }
    columns.forEach((col, idx) => {
      const val = item[col.key];
      const text = val !== undefined && val !== null ? String(val) : '';
      doc.text(text.substring(0, 24), 45 + idx * colWidth, y);
    });
    y += 16;
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Generates and downloads a dedicated PDF for a Sales Invoice
 */
export function generateInvoicePdf(invoice: SalesInvoice): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // Header Brand
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text('GOYAL CATTLE FEED PVT. LTD.', 40, 45);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text('GT Road Industrial Area, Khanna, Punjab - 141401', 40, 60);
  doc.text('GSTIN: 03AAACG1234F1Z8 | PAN: AAACG1234F | Ph: +91 1628 238900', 40, 72);

  // Invoice Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.documentType.toUpperCase(), 400, 45, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 400, 60, { align: 'right' });
  doc.text(`Date: ${invoice.invoiceDate}`, 400, 72, { align: 'right' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.line(40, 85, 555, 85);

  // Bill To / Customer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To Customer:', 40, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.customerFirm || invoice.customerName, 40, 120);
  doc.text(`Contact: ${invoice.customerName} (${invoice.customerPhone})`, 40, 134);
  doc.text(`Address: ${invoice.billingAddress}`, 40, 148);
  if (invoice.customerGstin) {
    doc.text(`GSTIN: ${invoice.customerGstin}`, 40, 162);
  }

  // Items table header
  let y = 185;
  doc.setFillColor(241, 245, 249);
  doc.rect(40, y - 12, 515, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  doc.text('Item Description', 45, y + 2);
  doc.text('HSN', 240, y + 2);
  doc.text('Qty', 310, y + 2);
  doc.text('Rate (Rs)', 370, y + 2);
  doc.text('GST %', 430, y + 2);
  doc.text('Total (Rs)', 550, y + 2, { align: 'right' });

  // Items rows
  y += 18;
  doc.setFont('helvetica', 'normal');
  invoice.items.forEach(item => {
    doc.text(item.productName.substring(0, 32), 45, y);
    doc.text(item.hsn, 240, y);
    doc.text(`${item.quantity} ${item.unit}`, 310, y);
    doc.text(item.rate.toFixed(2), 370, y);
    doc.text(`${item.gstRate}%`, 430, y);
    doc.text(item.totalAmount.toFixed(2), 550, y, { align: 'right' });
    y += 18;
  });

  // Summary box
  y = Math.max(y + 20, 380);
  doc.line(40, y, 555, y);
  y += 20;

  doc.setFont('helvetica', 'bold');
  doc.text(`Taxable Subtotal: Rs ${invoice.taxableAmount.toFixed(2)}`, 550, y, { align: 'right' });
  y += 16;
  if (invoice.isInterState) {
    doc.text(`IGST Total: Rs ${invoice.igstTotal.toFixed(2)}`, 550, y, { align: 'right' });
    y += 16;
  } else {
    doc.text(`CGST + SGST: Rs ${(invoice.cgstTotal + invoice.sgstTotal).toFixed(2)}`, 550, y, { align: 'right' });
    y += 16;
  }

  doc.setFontSize(12);
  doc.setTextColor(4, 120, 87);
  doc.text(`Grand Total: Rs ${invoice.grandTotal.toFixed(2)}`, 550, y, { align: 'right' });
  y += 18;

  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Amount Paid: Rs ${invoice.amountPaid.toFixed(2)}`, 550, y, { align: 'right' });
  y += 16;
  doc.text(`Balance Due: Rs ${invoice.balanceDue.toFixed(2)}`, 550, y, { align: 'right' });

  // Bank Details
  y = 520;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Bank & Settlement Information:', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Bank: State Bank of India, Basti Gajraula Branch', 40, y + 14);
  doc.text('Account Number: 30495839201 | IFSC: SBIN0001234', 40, y + 26);
  doc.text('UPI ID: 9837049021@upi', 40, y + 38);

  // Authorized Signatory
  doc.text('For Goyal Cattle Feed Store', 440, y + 14);
  doc.setFont('helvetica', 'italic');
  doc.text('Vatsal Goyal', 440, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.text('Proprietor / Authorized Signatory', 440, y + 50);

  doc.save(`${invoice.invoiceNumber.replace(/\//g, '_')}.pdf`);
}

/**
 * Native Print Trigger
 */
export function printDocument(): void {
  window.print();
}

/**
 * Copies formatted text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Manual WhatsApp share helper
 */
export function shareViaWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank');
}

/**
 * Native Web Share API helper with fallback
 */
export async function triggerWebShare(
  title: string,
  text: string,
  url?: string
): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: url || window.location.href });
      return true;
    } catch {
      return false;
    }
  } else {
    shareViaWhatsApp('', `${title}\n\n${text}`);
    return true;
  }
}
