export type UserRole =
  | 'Owner / Super Admin'
  | 'Manager'
  | 'Accountant'
  | 'Stock Manager'
  | 'Sales Executive'
  | 'Purchase Manager'
  | 'HR Manager'
  | 'Transport Manager'
  | 'Production Manager'
  | 'Viewer';

export type AppTheme = 'light' | 'dark' | 'comfort';
export type AccentColor = 'emerald' | 'blue' | 'amber' | 'slate';
export type FontSize = 'small' | 'normal' | 'large';
export type AppLanguage = 'en' | 'hi' | 'hinglish';
export type DisplayMode = 'advanced' | 'simple';
export type ConnectionStatus = 'online' | 'offline' | 'sync_pending' | 'syncing';
export type DateRange = 'today' | 'yesterday' | 'week' | 'month' | 'last_month' | 'custom';

export type BranchLocation =
  | 'all'
  | 'plant1'
  | 'plant2'
  | 'silos'
  | 'rohtak';

export interface BranchInfo {
  id: BranchLocation;
  name: string;
  city: string;
  type: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  designation: string;
  role: UserRole;
  accountStatus: 'Active' | 'Suspended' | 'Pending Verification';
  twoFactorEnabled: boolean;
  department: string;
  lastLogin: string;
}

export interface CompanyProfile {
  companyName: string;
  tradeName: string;
  tagline: string;
  gstin: string;
  cin: string;
  pan: string;
  registeredAddress: string;
  factoryAddress: string;
  phone: string;
  email: string;
  website: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
  authorizedSignatory: string;
  signatoryDesignation: string;
  establishedYear: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Business Alerts' | 'Low Stock' | 'Pending Payments' | 'Pending Bills' | 'Production Alerts' | 'Employee Alerts' | 'System Notifications';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: 'Finished Feed' | 'Raw Material' | 'Supplement';
  unit: 'Bags (50kg)' | 'MT' | 'Quintal';
  currentStock: number;
  minStockLevel: number;
  ratePerUnit: number;
  hsnCode: string;
  warehouse: string;
  bagsSoldToday: number;
  salesValueToday: number;
}

export interface CustomerItem {
  id: string;
  name: string;
  firmName: string;
  city: string;
  state: string;
  phone: string;
  creditLimit: number;
  totalPurchases: number;
  outstandingAmount: number;
  paymentStatus: 'Good' | 'Attention' | 'Overdue';
  lastPurchaseDate: string;
}

export interface TransactionItem {
  id: string;
  invoiceNumber: string;
  partyName: string;
  date: string;
  type: 'Sales' | 'Purchase' | 'Receipt' | 'Payment';
  amount: number;
  status: 'Paid' | 'Partial' | 'Credit' | 'Pending';
  branch: string;
}

export interface PendingPaymentItem {
  id: string;
  customerName: string;
  invoiceNumber: string;
  dueAmount: number;
  dueDate: string;
  daysOverdue: number;
  phone: string;
  status: 'Critical Overdue' | 'Due Soon' | 'Overdue';
}

export interface WarehouseSummaryItem {
  id: string;
  name: string;
  location: string;
  totalStockBags: number;
  totalStockValue: number;
  capacityUtilization: number;
  lowStockItemsCount: number;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  userAvatar?: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'Sales' | 'Purchase' | 'Inventory' | 'Production' | 'Accounts' | 'Warehouse' | 'Transport' | 'HR' | 'Quality' | 'Operations';
}

export type QuickActionType =
  | 'create_sales_bill'
  | 'add_purchase'
  | 'add_stock'
  | 'add_customer'
  | 'receive_payment'
  | 'add_expense'
  | 'mark_attendance'
  | 'production_entry';

// ==========================================
// PART 2 – ENTERPRISE DATA ARCHITECTURE TYPES
// ==========================================

export type DocumentType =
  | 'GST Tax Invoice'
  | 'Non-GST Invoice'
  | 'Retail Cash Memo'
  | 'Sales Order'
  | 'Estimate'
  | 'Proforma Invoice'
  | 'Delivery Challan'
  | 'Payment Receipt'
  | 'Credit Note'
  | 'Debit Note';

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Other';

export type InvoicePaymentStatus = 'Completed' | 'Pending Payment' | 'Partially Paid' | 'Draft' | 'Cancelled';

export type ProductUnit = 'Bag' | 'KG' | 'Quintal' | 'Ton' | 'Piece';

export interface SalesInvoiceItem {
  id: string;
  productId?: string;
  productName: string;
  sku: string;
  hsn: string;
  quantity: number;
  unit: ProductUnit | string;
  rate: number;
  discountPercent: number;
  discountAmount: number;
  taxableValue: number;
  gstRate: number; // e.g. 0, 5, 12, 18, 28
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  description?: string;
}

export interface AdditionalCharges {
  transport: number;
  loading: number;
  unloading: number;
  packaging: number;
  other: number;
  discount: number;
  roundOff: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  documentType: DocumentType;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerFirm: string;
  customerPhone: string;
  customerGstin?: string;
  billingAddress: string;
  shippingAddress: string;
  state: string;
  stateCode: string;
  placeOfSupply: string;
  paymentTerms: string;
  referenceNumber?: string;
  isInterState: boolean;
  items: SalesInvoiceItem[];
  additionalCharges: AdditionalCharges;
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  additionalChargesTotal: number;
  roundOff: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentMode: PaymentMode;
  paymentStatus: InvoicePaymentStatus;
  transactionRef?: string;
  notes?: string;
  terms?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  productName: string;
  hsn: string;
  quantity: number;
  unit: ProductUnit | string;
  purchaseRate: number;
  discountPercent: number;
  taxableValue: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

export interface PurchaseInvoice {
  id: string;
  purchaseNumber: string;
  supplierInvoiceNumber: string;
  documentType: 'Purchase Bill' | 'Purchase Order' | 'Purchase Return' | 'Debit Note';
  purchaseDate: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  supplierFirm: string;
  supplierPhone: string;
  supplierGstin?: string;
  supplierAddress: string;
  supplierState: string;
  referenceNumber?: string;
  items: PurchaseInvoiceItem[];
  freightCharges: number;
  loadingCharges: number;
  otherCharges: number;
  subtotal: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentMode: PaymentMode;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Cancelled';
  transactionRef?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type CustomerCategory = 'Retail' | 'Wholesale' | 'Dealer' | 'Distributor' | 'Dairy Farm';

export interface FullCustomer {
  id: string;
  customerId: string;
  name: string;
  firmName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  gstin?: string;
  pan?: string;
  billingAddress: string;
  shippingAddress: string;
  city: string;
  state: string;
  stateCode: string;
  category: CustomerCategory;
  creditLimit: number;
  openingBalance: number;
  currentOutstanding: number;
  totalSales: number;
  totalPayments: number;
  lastPurchaseDate: string;
  notes?: string;
  status: 'Active' | 'Inactive';
}

export interface FullSupplier {
  id: string;
  supplierId: string;
  name: string;
  firmName: string;
  phone: string;
  email: string;
  gstin?: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  suppliedProducts: string[];
  creditDays: number;
  openingBalance: number;
  currentPayable: number;
  totalPurchases: number;
  totalPayments: number;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  notes?: string;
  status: 'Active' | 'Inactive';
}

export interface LedgerEntry {
  id: string;
  date: string;
  transactionId: string;
  partyType: 'Customer' | 'Supplier' | 'Bank' | 'Cash';
  partyId: string;
  partyName: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid' | 'Settled';
  type: 'Invoice' | 'Payment' | 'Return' | 'Adjustment' | 'Opening Balance';
}

export interface ExpenseItem {
  id: string;
  expenseNumber: string;
  expenseDate: string;
  category: string;
  description: string;
  vendor: string;
  amount: number;
  gstAmount: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
  notes?: string;
  attachmentName?: string;
  createdBy: string;
}

export interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  allocatedAmount: number;
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  date: string;
  partyType: 'Customer' | 'Supplier';
  partyId: string;
  partyName: string;
  partyFirm: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  notes?: string;
  linkedInvoices: PaymentAllocation[];
  receiptType: 'Customer Received' | 'Supplier Paid' | 'Advance Received' | 'Advance Paid' | 'Refund';
  createdBy: string;
  createdAt: string;
}

// ==========================================
// PART 3: INVENTORY, MANUFACTURING & OPERATIONS TYPES
// ==========================================

export type ProductCategoryType = 'Raw Material' | 'Finished Goods' | 'Packaging Material' | 'Supplements / Minerals';
export type InventoryUnit = 'KG' | 'Quintal' | 'Ton' | 'Bags (50kg)' | 'Bags (25kg)' | 'Piece' | 'Roll';

export interface ProductInventoryItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode: string;
  qrCode: string;
  category: ProductCategoryType;
  productType: 'Raw' | 'Finished' | 'Packaging' | 'Consumable';
  hsnCode: string;
  gstRate: number;
  unit: InventoryUnit;
  purchaseRate: number;
  sellingRate: number;
  wholesaleRate: number;
  retailRate: number;
  minimumStock: number;
  maximumStock: number;
  currentStock: number;
  warehouseStock: Record<string, number>;
  packageSize?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued';
  description: string;
  updatedAt: string;
}

export type StockMovementType =
  | 'Opening Stock'
  | 'Purchase'
  | 'Purchase Return'
  | 'Sales'
  | 'Sales Return'
  | 'Production Consumption'
  | 'Production Output'
  | 'Warehouse Transfer'
  | 'Stock Adjustment'
  | 'Damaged Stock'
  | 'Physical Verification';

export interface StockMovement {
  id: string;
  transactionId: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  type: StockMovementType;
  referenceNumber: string;
  sourceLocation: string;
  destinationLocation: string;
  quantityIn: number;
  quantityOut: number;
  balance: number;
  unit: string;
  createdBy: string;
  notes?: string;
}

export interface WarehouseSection {
  id: string;
  name: string;
  type: 'Floor' | 'Rack' | 'Silo' | 'Bin' | 'Bay';
  capacity: number;
  currentStock: number;
  commodity?: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: 'Main Factory' | 'Raw Material Silos' | 'Finished Goods Godown' | 'Regional Depot' | 'Transit' | 'Quarantine';
  address: string;
  manager: string;
  phone: string;
  capacity: number;
  currentUtilization: number;
  availableSpace: number;
  totalStockValue: number;
  status: 'Active' | 'Maintenance' | 'Full';
  sections: WarehouseSection[];
}

export type StockTransferStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Dispatched'
  | 'In Transit'
  | 'Partially Received'
  | 'Received'
  | 'Rejected'
  | 'Cancelled';

export interface StockTransfer {
  id: string;
  transferNumber: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  transferDate: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: StockTransferStatus;
  dispatchedQty: number;
  receivedQty: number;
  damagedQty?: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  receivedBy?: string;
  receivedDate?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // in KG per 1000kg batch
  percentage: number;
  estimatedRatePerKg: number;
  cost: number;
}

export interface Recipe {
  id: string;
  recipeCode: string;
  name: string;
  finishedProductId: string;
  finishedProductName: string;
  version: string;
  effectiveDate: string;
  isActive: boolean;
  batchSize: number; // in KG, default 1000
  ingredients: RecipeIngredient[];
  totalInputWeight: number;
  estimatedRawCost: number;
  nutritionalProfile?: {
    crudeProtein: number;
    crudeFat: number;
    fiber: number;
    calcium: number;
    moisture: number;
  };
  notes?: string;
}

export type ProductionBatchStatus =
  | 'Planned'
  | 'In Production'
  | 'Quality Pending'
  | 'Approved'
  | 'Rejected'
  | 'Completed';

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  batchNumber: string;
  productionDate: string;
  finishedProductId: string;
  finishedProductName: string;
  recipeId: string;
  recipeName: string;
  plannedQuantity: number;
  productionQuantity: number;
  inputMaterials: Array<{
    ingredientId: string;
    ingredientName: string;
    plannedQty: number;
    actualQty: number;
    unit: string;
    rate: number;
    cost: number;
  }>;
  totalInputWeight: number;
  finishedOutputWeight: number;
  wastageWeight: number;
  wastagePercentage: number;
  yieldPercentage: number;
  bagWeight: number;
  numberOfBags: number;
  packagingSize: string;
  machineLine: string;
  supervisor: string;
  labourDetails: string;
  startTime: string;
  endTime: string;
  costs: {
    rawMaterialCost: number;
    labourCost: number;
    electricityCost: number;
    machineCost: number;
    packagingCost: number;
    allocatedExpenses: number;
    totalCost: number;
    costPerKg: number;
    costPerBag: number;
  };
  status: ProductionBatchStatus;
  qualityInspectionId?: string;
  warehouseId: string;
  notes?: string;
  createdBy: string;
}

export interface QualityInspection {
  id: string;
  inspectionNumber: string;
  type: 'Raw Material' | 'In-Process Pellet' | 'Finished Feed Bag';
  referenceId: string;
  productName: string;
  date: string;
  inspector: string;
  parameters: Array<{
    parameter: string;
    standard: string;
    actual: string;
    status: 'Passed' | 'Failed' | 'Warning';
  }>;
  overallStatus: 'Passed' | 'Failed' | 'Needs Reinspection' | 'Pending';
  sampleSize: string;
  remarks: string;
  approvedBy?: string;
}

export type EmployeeDepartment =
  | 'Production'
  | 'Warehouse'
  | 'Transport'
  | 'Accounts'
  | 'Sales'
  | 'Administration'
  | 'Maintenance';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  photoUrl?: string;
  phone: string;
  address: string;
  designation: string;
  department: EmployeeDepartment;
  joiningDate: string;
  employmentType: 'Full-Time' | 'Contract' | 'Daily Wage' | 'Piece Rate';
  salaryType: 'Monthly' | 'Daily' | 'Piece Rate';
  monthlySalary: number;
  dailyWage: number;
  pieceRatePerBag?: number;
  emergencyContact: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
}

export type AttendanceType =
  | 'Present'
  | 'Absent'
  | 'Half Day'
  | 'Paid Leave'
  | 'Unpaid Leave'
  | 'Overtime'
  | 'Weekly Off';

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  status: AttendanceType;
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
  bagsLoaded?: number;
  notes?: string;
}

export interface SalarySlip {
  id: string;
  slipNumber: string;
  month: string;
  year: number;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  daysPresent: number;
  daysAbsent: number;
  overtimeHours: number;
  bagsHandled: number;
  basicSalary: number;
  overtimePay: number;
  pieceRatePay: number;
  bonuses: number;
  grossEarnings: number;
  advanceDeductions: number;
  pfEsiDeductions: number;
  totalDeductions: number;
  netPayable: number;
  paymentStatus: 'Paid' | 'Pending' | 'Approved';
  paymentDate?: string;
  paymentRef?: string;
}

export type VehicleType =
  | 'Truck (10-Tyre)'
  | 'Truck (6-Tyre)'
  | 'Tractor Trolley'
  | 'Pickup'
  | 'Mini Truck'
  | 'Tempo';

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: VehicleType;
  ownership: 'Company Owned' | 'Hired Carrier' | 'Contractor';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  capacityMT: number;
  capacityBags: number;
  fuelType: 'Diesel' | 'CNG';
  rcNumber: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  permitExpiry: string;
  status: 'Available' | 'On Trip' | 'Under Maintenance' | 'Idle';
  mileageKmPerLitre?: number;
}

export interface Driver {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  licenceNumber: string;
  licenceExpiry: string;
  assignedVehicleNumber?: string;
  address: string;
  status: 'Active' | 'On Leave' | 'Off Duty';
}

export type DispatchStatus =
  | 'Pending'
  | 'Approved'
  | 'Dispatched'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Returned'
  | 'Cancelled';

export interface DispatchOrder {
  id: string;
  dispatchNumber: string;
  salesInvoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerFirm: string;
  destinationCity: string;
  deliveryAddress: string;
  productSummary: string;
  totalBags: number;
  totalWeightMT: number;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  expectedDeliveryDate: string;
  freightAmount: number;
  status: DispatchStatus;
  deliveryNotes?: string;
  receivedBy?: string;
  deliveryDate?: string;
}

export interface WeighbridgeEntry {
  id: string;
  slipNumber: string;
  dateTime: string;
  vehicleNumber: string;
  driverName: string;
  partyType: 'Supplier' | 'Customer' | 'Internal Transfer';
  partyName: string;
  commodity: string;
  grossWeight: number; // in KG
  tareWeight: number; // in KG
  netWeight: number; // in KG
  unit: 'KG' | 'Quintal' | 'MT';
  referenceNumber: string;
  operatorName: string;
  charges: number;
  remarks?: string;
}

export interface BarcodeRecord {
  id: string;
  code: string;
  type: 'EAN-13' | 'QR Code' | 'Code-128';
  entityType: 'Product' | 'Warehouse' | 'Batch' | 'Dispatch';
  entityId: string;
  title: string;
  subtitle: string;
  metadata: Record<string, any>;
}

// ==========================================
// PART 4: AI INTELLIGENCE, GOYAL AI PARTNER & SYSTEM TYPES
// ==========================================

export type AIWorkspaceType =
  | 'Business Planning'
  | 'Daily Operations'
  | 'Finance & Accounts'
  | 'Inventory & Manufacturing'
  | 'Personal Reminders'
  | 'General Discussion';

export interface AIMessageAction {
  id: string;
  type: 'REMEMBER' | 'REMIND' | 'EXECUTE';
  label: string;
  details: string;
  payload: any;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Executed';
  transactionRef?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  workspace: AIWorkspaceType;
  actions?: AIMessageAction[];
  audioUrl?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  workspace: AIWorkspaceType;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIMemoryItem {
  id: string;
  title: string;
  content: string;
  category: 'Preference' | 'Credit Terms' | 'Supplier Notes' | 'Operational Rule' | 'Customer Context';
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface AITaskReminder {
  id: string;
  title: string;
  description: string;
  dueDateTime: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed' | 'Dismissed';
  linkedRecordId?: string;
  linkedRecordType?: string;
  createdAt: string;
}

export interface AIActionAuditLog {
  id: string;
  actionType: string;
  performedBy: string;
  details: string;
  recordId?: string;
  status: 'Success' | 'Cancelled' | 'Failed';
  timestamp: string;
}

export interface AIDocumentScan {
  id: string;
  fileName: string;
  fileType: 'Invoice' | 'Receipt' | 'Weighbridge' | 'Cheque' | 'Certificate';
  uploadDate: string;
  extractedData: Record<string, any>;
  status: 'Draft Review' | 'Confirmed' | 'Rejected';
  category: string;
}

export interface HardwareDevice {
  id: string;
  name: string;
  type: 'Barcode Scanner' | 'Thermal Printer' | 'Weighing Scale' | 'Weighbridge RS232' | 'Label Printer';
  connectionType: 'USB / HID' | 'Bluetooth' | 'Network IP / TCP' | 'RS-232 Serial COM';
  status: 'Connected' | 'Not Configured' | 'Demo Mode' | 'Connection Failed' | 'Unsupported';
  config: Record<string, any>;
  lastActive?: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  entityType: 'Invoice' | 'Payment' | 'StockMovement' | 'Attendance' | 'Expense';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  syncStatus: 'Pending' | 'Syncing' | 'Failed' | 'Synced';
  errorMessage?: string;
}

export interface BackupRecord {
  id: string;
  timestamp: string;
  fileName: string;
  fileSize: string;
  recordCount: number;
  status: 'Success' | 'In Progress' | 'Failed';
  triggeredBy: string;
}

export interface CloudStorageFile {
  id: string;
  name: string;
  size: string;
  category: 'Invoices' | 'Quality Reports' | 'Transport' | 'Employee KYC' | 'Product Images' | 'Certificates';
  uploadDate: string;
  uploadedBy: string;
  isPrivate: boolean;
  url: string;
  mimeType: string;
}

