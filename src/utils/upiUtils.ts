/**
 * Goyal Cattle Feed Store – NPCI Dynamic UPI QR Utility
 * Store VPA: 9837049021@upi (State Bank of India - Goyal Cattle Feed Store)
 */

export interface UpiPaymentDetails {
  vpa?: string;
  payeeName?: string;
  amount: number;
  transactionNote?: string;
  invoiceNumber?: string;
}

export function generateUpiPayUri({
  vpa = '9837049021@upi',
  payeeName = 'Goyal Cattle Feed Store',
  amount,
  transactionNote = 'Cattle Feed Bill Payment',
  invoiceNumber = '',
}: UpiPaymentDetails): string {
  const note = invoiceNumber ? `${transactionNote} - ${invoiceNumber}` : transactionNote;
  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export function getUpiQrCodeUrl(details: UpiPaymentDetails, size = 250): string {
  const uri = generateUpiPayUri(details);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(uri)}`;
}
