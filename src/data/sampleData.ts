import {
  ProductItem,
  CustomerItem,
  TransactionItem,
  PendingPaymentItem,
  WarehouseSummaryItem,
  ActivityLogItem,
  NotificationItem,
  CompanyProfile,
  UserProfile,
  BranchInfo,
} from '../types';

export const BRANCHES: BranchInfo[] = [
  { id: 'all', name: 'All Locations & Plants', city: 'Consolidated View', type: 'Enterprise' },
  { id: 'plant1', name: 'Plant 1 - Main Feed Mill', city: 'Khanna, Punjab', type: 'Manufacturing' },
  { id: 'plant2', name: 'Plant 2 - Pellet Plant', city: 'Karnal Road, Punjab', type: 'Manufacturing' },
  { id: 'silos', name: 'Central Grain Silos & Hub', city: 'GT Road, Khanna', type: 'Storage & Raw Materials' },
  { id: 'rohtak', name: 'Rohtak Regional Depot', city: 'Rohtak, Haryana', type: 'Distribution' },
];

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  companyName: 'Goyal Cattle Feed Pvt. Ltd.',
  tradeName: 'Goyal Feeds',
  tagline: 'One Platform. Complete Business Control.',
  gstin: '03AAACG1234F1Z8',
  cin: 'U01409PB2018PTC048123',
  pan: 'AAACG1234F',
  registeredAddress: 'Grand Trunk Road, Industrial Estate, Khanna, District Ludhiana, Punjab - 141401',
  factoryAddress: 'Plot No. 42-45, Agro Mega Food Park, Karnal Highway, Punjab - 141402',
  phone: '+91 1628 238900 / +91 98765 43210',
  email: 'info@goyalfeed.com',
  website: 'https://goyalfeed.com',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200084920193',
  ifscCode: 'HDFC0000492',
  branchName: 'GT Road Branch, Khanna',
  upiId: 'goyalfeed@hdfcbank',
  authorizedSignatory: 'Rajesh Goyal',
  signatoryDesignation: 'Managing Director',
  establishedYear: 2012,
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-001',
  fullName: 'Rajesh Goyal',
  username: 'rajesh.goyal',
  email: 'rajesh@goyalfeed.com',
  phone: '+91 98765 43210',
  avatarUrl: '/src/assets/images/avatar_rajesh_goyal_1794381935725.jpg',
  designation: 'Managing Director & Founder',
  role: 'Owner / Super Admin',
  accountStatus: 'Active',
  twoFactorEnabled: true,
  department: 'Executive Board',
  lastLogin: '11/11/2026, 08:42 AM IST',
};

export const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'prd-01',
    sku: 'GCF-PREM-50',
    name: 'Goyal Premium Cattle Feed (50kg)',
    category: 'Finished Feed',
    unit: 'Bags (50kg)',
    currentStock: 1420,
    minStockLevel: 500,
    ratePerUnit: 1680,
    hsnCode: '23099010',
    warehouse: 'Plant 1 - Finished Goods Godown',
    bagsSoldToday: 140,
    salesValueToday: 235200,
  },
  {
    id: 'prd-02',
    sku: 'GCF-GOLD-50',
    name: 'Goyal Gold Cattle Feed (50kg)',
    category: 'Finished Feed',
    unit: 'Bags (50kg)',
    currentStock: 980,
    minStockLevel: 400,
    ratePerUnit: 1540,
    hsnCode: '23099010',
    warehouse: 'Plant 1 - Finished Goods Godown',
    bagsSoldToday: 95,
    salesValueToday: 146300,
  },
  {
    id: 'prd-03',
    sku: 'GCF-DAIRY-50',
    name: 'Goyal Dairy Special High-Yield (50kg)',
    category: 'Finished Feed',
    unit: 'Bags (50kg)',
    currentStock: 640,
    minStockLevel: 300,
    ratePerUnit: 1820,
    hsnCode: '23099010',
    warehouse: 'Plant 2 - Pellet Plant',
    bagsSoldToday: 42,
    salesValueToday: 76440,
  },
  {
    id: 'prd-04',
    sku: 'RAW-MAIZE-GRAIN',
    name: 'Yellow Maize (Dry Grain Corn)',
    category: 'Raw Material',
    unit: 'Quintal',
    currentStock: 340,
    minStockLevel: 500, // Trigger low stock alert!
    ratePerUnit: 2280,
    hsnCode: '10059000',
    warehouse: 'Central Grain Silos Hub',
    bagsSoldToday: 0,
    salesValueToday: 0,
  },
  {
    id: 'prd-05',
    sku: 'RAW-SOYA-DOC',
    name: 'Soybean Meal (DOC 48% Protein)',
    category: 'Raw Material',
    unit: 'Quintal',
    currentStock: 180,
    minStockLevel: 250, // Trigger low stock alert!
    ratePerUnit: 4150,
    hsnCode: '23040010',
    warehouse: 'Central Grain Silos Hub',
    bagsSoldToday: 0,
    salesValueToday: 0,
  },
  {
    id: 'prd-06',
    sku: 'RAW-MUSTARD-CAKE',
    name: 'Mustard Cake (Kachi Ghani Khali)',
    category: 'Raw Material',
    unit: 'Quintal',
    currentStock: 410,
    minStockLevel: 200,
    ratePerUnit: 2900,
    hsnCode: '23069012',
    warehouse: 'Plant 1 - Raw Section',
    bagsSoldToday: 0,
    salesValueToday: 0,
  },
  {
    id: 'prd-07',
    sku: 'RAW-RICE-BRAN',
    name: 'De-Oiled Rice Bran (DORB)',
    category: 'Raw Material',
    unit: 'Quintal',
    currentStock: 520,
    minStockLevel: 300,
    ratePerUnit: 1450,
    hsnCode: '23024000',
    warehouse: 'Plant 2 - Raw Yard',
    bagsSoldToday: 0,
    salesValueToday: 0,
  },
  {
    id: 'prd-08',
    sku: 'RAW-WHEAT-BRAN',
    name: 'Wheat Bran (Premium Choker)',
    category: 'Raw Material',
    unit: 'Quintal',
    currentStock: 290,
    minStockLevel: 150,
    ratePerUnit: 2150,
    hsnCode: '23023000',
    warehouse: 'Central Grain Silos Hub',
    bagsSoldToday: 12,
    salesValueToday: 25800,
  },
];

export const SAMPLE_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cst-01',
    name: 'Gurpreet Singh',
    firmName: 'Kisan Agro Traders & Feed Center',
    city: 'Ludhiana',
    state: 'Punjab',
    phone: '+91 98141 87654',
    creditLimit: 1000000,
    totalPurchases: 3845000,
    outstandingAmount: 485000,
    paymentStatus: 'Good',
    lastPurchaseDate: '11/11/2026',
  },
  {
    id: 'cst-02',
    name: 'Rameshwar Sharma',
    firmName: 'Sharma Modern Dairy Farm (400 Heads)',
    city: 'Karnal',
    state: 'Haryana',
    phone: '+91 94160 54321',
    creditLimit: 800000,
    totalPurchases: 2960000,
    outstandingAmount: 620000,
    paymentStatus: 'Attention',
    lastPurchaseDate: '10/11/2026',
  },
  {
    id: 'cst-03',
    name: 'Suresh Malik',
    firmName: 'Malik Cattle Feed Wholesale Depot',
    city: 'Rohtak',
    state: 'Haryana',
    phone: '+91 98122 33445',
    creditLimit: 1200000,
    totalPurchases: 4520000,
    outstandingAmount: 780000,
    paymentStatus: 'Overdue',
    lastPurchaseDate: '08/11/2026',
  },
  {
    id: 'cst-04',
    name: 'Harbhajan Gill',
    firmName: 'Punjab Dairy Federation Co-op',
    city: 'Amritsar',
    state: 'Punjab',
    phone: '+91 98720 11223',
    creditLimit: 1500000,
    totalPurchases: 6180000,
    outstandingAmount: 340000,
    paymentStatus: 'Good',
    lastPurchaseDate: '11/11/2026',
  },
  {
    id: 'cst-05',
    name: 'Naresh Kumar',
    firmName: 'Haryana Pashu Aahar Kendra',
    city: 'Panipat',
    state: 'Haryana',
    phone: '+91 98960 77889',
    creditLimit: 750000,
    totalPurchases: 2150000,
    outstandingAmount: 490000,
    paymentStatus: 'Attention',
    lastPurchaseDate: '07/11/2026',
  },
  {
    id: 'cst-06',
    name: 'Sunil Gupta',
    firmName: 'Gupta Agro Agencies',
    city: 'Jalandhar',
    state: 'Punjab',
    phone: '+91 98144 99001',
    creditLimit: 900000,
    totalPurchases: 3120000,
    outstandingAmount: 530800,
    paymentStatus: 'Good',
    lastPurchaseDate: '09/11/2026',
  },
];

export const SAMPLE_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'txn-01',
    invoiceNumber: 'INV/2026/0418',
    partyName: 'Kisan Agro Traders',
    date: '11/11/2026',
    type: 'Sales',
    amount: 145000,
    status: 'Paid',
    branch: 'Plant 1',
  },
  {
    id: 'txn-02',
    invoiceNumber: 'INV/2026/0419',
    partyName: 'Punjab Dairy Federation Co-op',
    date: '11/11/2026',
    type: 'Sales',
    amount: 218400,
    status: 'Credit',
    branch: 'Plant 1',
  },
  {
    id: 'txn-03',
    invoiceNumber: 'PUR/2026/0192',
    partyName: 'Aggarwal Grain Millers',
    date: '11/11/2026',
    type: 'Purchase',
    amount: 194500,
    status: 'Paid',
    branch: 'Central Silos',
  },
  {
    id: 'txn-04',
    invoiceNumber: 'REC/2026/0881',
    partyName: 'Sharma Modern Dairy Farm',
    date: '11/11/2026',
    type: 'Receipt',
    amount: 150000,
    status: 'Paid',
    branch: 'Plant 2',
  },
  {
    id: 'txn-05',
    invoiceNumber: 'INV/2026/0417',
    partyName: 'Malik Cattle Feed Depot',
    date: '10/11/2026',
    type: 'Sales',
    amount: 98000,
    status: 'Partial',
    branch: 'Rohtak Depot',
  },
  {
    id: 'txn-06',
    invoiceNumber: 'PAY/2026/0312',
    partyName: 'Singla Oil & Agro Industries',
    date: '10/11/2026',
    type: 'Payment',
    amount: 123950,
    status: 'Paid',
    branch: 'Plant 1',
  },
  {
    id: 'txn-07',
    invoiceNumber: 'INV/2026/0416',
    partyName: 'Gupta Agro Agencies',
    date: '09/11/2026',
    type: 'Sales',
    amount: 112500,
    status: 'Paid',
    branch: 'Plant 1',
  },
];

export const SAMPLE_PENDING_PAYMENTS: PendingPaymentItem[] = [
  {
    id: 'pay-01',
    customerName: 'Malik Cattle Feed Wholesale Depot',
    invoiceNumber: 'INV/2026/0388',
    dueAmount: 480000,
    dueDate: '28/10/2026',
    daysOverdue: 14,
    phone: '+91 98122 33445',
    status: 'Critical Overdue',
  },
  {
    id: 'pay-02',
    customerName: 'Sharma Modern Dairy Farm',
    invoiceNumber: 'INV/2026/0394',
    dueAmount: 320000,
    dueDate: '04/11/2026',
    daysOverdue: 7,
    phone: '+91 94160 54321',
    status: 'Overdue',
  },
  {
    id: 'pay-03',
    customerName: 'Haryana Pashu Aahar Kendra',
    invoiceNumber: 'INV/2026/0402',
    dueAmount: 290000,
    dueDate: '12/11/2026',
    daysOverdue: 0,
    phone: '+91 98960 77889',
    status: 'Due Soon',
  },
  {
    id: 'pay-04',
    customerName: 'Kisan Agro Traders & Feed Center',
    invoiceNumber: 'INV/2026/0410',
    dueAmount: 185000,
    dueDate: '14/11/2026',
    daysOverdue: 0,
    phone: '+91 98141 87654',
    status: 'Due Soon',
  },
];

export const SAMPLE_WAREHOUSES: WarehouseSummaryItem[] = [
  {
    id: 'wh-01',
    name: 'Plant 1 - Main Feed Godown',
    location: 'Khanna, GT Road',
    totalStockBags: 2400,
    totalStockValue: 3816000,
    capacityUtilization: 82,
    lowStockItemsCount: 1,
  },
  {
    id: 'wh-02',
    name: 'Plant 2 - Pellet Storage Yard',
    location: 'Karnal Highway',
    totalStockBags: 1680,
    totalStockValue: 2688000,
    capacityUtilization: 68,
    lowStockItemsCount: 0,
  },
  {
    id: 'wh-03',
    name: 'Central Grain Silos & Bulk Hub',
    location: 'GT Road Complex',
    totalStockBags: 1240, // Quintals equivalent
    totalStockValue: 1424000,
    capacityUtilization: 45,
    lowStockItemsCount: 2,
  },
  {
    id: 'wh-04',
    name: 'Rohtak Regional Depot',
    location: 'Industrial Area, Rohtak',
    totalStockBags: 520,
    totalStockValue: 532000,
    capacityUtilization: 58,
    lowStockItemsCount: 0,
  },
];

export const SAMPLE_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act-01',
    user: 'Amit Verma (Billing)',
    action: 'Generated Tax Invoice',
    details: 'INV/2026/0419 for Punjab Dairy Federation (₹2,18,400)',
    timestamp: '15 mins ago',
    category: 'Sales',
  },
  {
    id: 'act-02',
    user: 'Gurpreet Singh (Plant 1)',
    action: 'Logged Production Batch',
    details: 'Batch #GCF-26-889: 350 Bags Goyal Premium Pellet',
    timestamp: '42 mins ago',
    category: 'Production',
  },
  {
    id: 'act-03',
    user: 'Deepak Sharma (Purchase)',
    action: 'Raw Material GRN Created',
    details: 'GRN-192: 24 MT Yellow Maize unloaded at Central Silo',
    timestamp: '1 hour ago',
    category: 'Purchase',
  },
  {
    id: 'act-04',
    user: 'Sunita Rani (Accounts)',
    action: 'Payment Voucher Recorded',
    details: 'NEFT ₹1,50,000 received from Sharma Dairy Farm',
    timestamp: '2 hours ago',
    category: 'Accounts',
  },
  {
    id: 'act-05',
    user: 'Manish Kumar (Inventory)',
    action: 'Stock Transfer Dispatched',
    details: 'Truck PB-10-CZ-4412 dispatched to Rohtak Depot (200 Bags)',
    timestamp: '3 hours ago',
    category: 'Inventory',
  },
];

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Low Stock Alert: Yellow Maize',
    message: 'Current stock is 340 Quintals, below minimum buffer of 500 Quintals at Central Silos Hub.',
    category: 'Low Stock',
    priority: 'high',
    timestamp: '20 mins ago',
    isRead: false,
  },
  {
    id: 'notif-02',
    title: 'Overdue Payment Reminder',
    message: 'Malik Cattle Feed Depot invoice #INV/2026/0388 (₹4,80,000) is 14 days overdue.',
    category: 'Pending Payments',
    priority: 'high',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 'notif-03',
    title: 'Daily Production Target Met',
    message: 'Line 1 has produced 480 bags of Goyal Premium Feed, exceeding today\'s plan by 8%.',
    category: 'Production Alerts',
    priority: 'medium',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: 'notif-04',
    title: 'New High Value Purchase Order',
    message: 'Haryana Pashu Aahar Kendra requested quotation for 500 Bags Goyal Dairy Special.',
    category: 'Business Alerts',
    priority: 'medium',
    timestamp: '4 hours ago',
    isRead: true,
  },
  {
    id: 'notif-05',
    title: 'GST GSTR-3B Filing Due in 4 Days',
    message: 'Monthly tax return GSTR-3B reconciliation pending verification by chartered accountant.',
    category: 'System Notifications',
    priority: 'medium',
    timestamp: 'Yesterday',
    isRead: true,
  },
  {
    id: 'notif-06',
    title: 'Boiler Maintenance Due Tomorrow',
    message: 'Scheduled 100-hour steam boiler inspection scheduled for Plant 2 pellet conditioning unit.',
    category: 'Employee Alerts',
    priority: 'low',
    timestamp: 'Yesterday',
    isRead: true,
  },
];

export const SALES_PURCHASE_DATA_DAILY = [
  { day: 'Mon', sales: 420000, purchase: 310000, collections: 390000 },
  { day: 'Tue', sales: 380000, purchase: 260000, collections: 340000 },
  { day: 'Wed', sales: 510000, purchase: 420000, collections: 460000 },
  { day: 'Thu', sales: 460000, purchase: 290000, collections: 410000 },
  { day: 'Fri', sales: 530000, purchase: 380000, collections: 490000 },
  { day: 'Sat', sales: 490000, purchase: 340000, collections: 450000 },
  { day: 'Sun (Today)', sales: 485200, purchase: 318450, collections: 375000 },
];

export const SALES_PURCHASE_DATA_WEEKLY = [
  { day: 'Week 1', sales: 2450000, purchase: 1890000, collections: 2280000 },
  { day: 'Week 2', sales: 2780000, purchase: 2150000, collections: 2610000 },
  { day: 'Week 3', sales: 2620000, purchase: 1940000, collections: 2490000 },
  { day: 'Week 4', sales: 2950000, purchase: 2310000, collections: 2840000 },
];

export const SALES_PURCHASE_DATA_MONTHLY = [
  { day: 'Jun', sales: 9400000, purchase: 7100000, collections: 8900000 },
  { day: 'Jul', sales: 10200000, purchase: 7800000, collections: 9600000 },
  { day: 'Aug', sales: 11100000, purchase: 8400000, collections: 10500000 },
  { day: 'Sep', sales: 11800000, purchase: 8900000, collections: 11200000 },
  { day: 'Oct', sales: 12600000, purchase: 9400000, collections: 12100000 },
  { day: 'Nov (Est)', sales: 13200000, purchase: 9800000, collections: 12500000 },
];

export const EXPENSE_CATEGORIES = [
  { name: 'Electricity & Power', amount: 14200, percentage: 33.3, color: '#047857' },
  { name: 'Factory Labour & Wages', amount: 11500, percentage: 27.0, color: '#059669' },
  { name: 'Transport & Freight', amount: 8400, percentage: 19.7, color: '#10b981' },
  { name: 'Boiler Fuel & Biomass', amount: 4800, percentage: 11.3, color: '#f59e0b' },
  { name: 'Machine Maintenance', amount: 2500, percentage: 5.9, color: '#6366f1' },
  { name: 'Other Factory Overheads', amount: 1200, percentage: 2.8, color: '#64748b' },
];

// Helper functions for formatting
export function formatIndianCurrency(amount: number): string {
  const parts = amount.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  const isNegative = integerPart.startsWith('-');
  if (isNegative) integerPart = integerPart.substring(1);

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formattedInteger}.${decimalPart}`;
}

export function formatCompactNumber(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
