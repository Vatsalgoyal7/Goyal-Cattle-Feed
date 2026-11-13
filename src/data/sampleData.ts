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
  { id: 'all', name: 'Main Shop & All Godowns', city: 'Gajraula, UP', type: 'Single Compound' },
  { id: 'plant1', name: 'Main Shop Counter (दुकान)', city: 'Kavi Nagar, Gajraula', type: 'Retail & Counter' },
  { id: 'silos', name: 'Attached Godown 1 (मुख्य गोदाम)', city: 'Gajraula', type: 'Cattle Feed Storage' },
  { id: 'plant2', name: 'Warehouse 2 (गोदाम 2)', city: 'Gajraula', type: 'Raw Material & Khal' },
];

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  companyName: 'Goyal Cattle Feed Store',
  tradeName: 'Goyal Feed Store (गोयल कैटल फीड स्टोर)',
  tagline: 'पशु आहार, खल, चूरी एवं दाना के थोक व फुटकर विक्रेता',
  gstin: '09AAACC1206D1Z6',
  cin: '',
  pan: 'AAACC1206D',
  registeredAddress: 'Kavi Nagar, near Indra Chowk, Shuklapuri ke samne, Gajraula, Uttar Pradesh - 244235',
  factoryAddress: 'Kavi Nagar, near Indra Chowk, Gajraula, Uttar Pradesh - 244235',
  phone: '+91 98370 49021',
  email: 'vatsalgoyal71@gmail.com',
  website: 'https://maps.app.goo.gl/D8MwEcaxc7GNyc8r7',
  bankName: 'State Bank of India',
  accountNumber: '30495839201',
  ifscCode: 'SBIN0001234',
  branchName: 'SBI Branch Basti Gajraula',
  upiId: '9837049021@upi',
  authorizedSignatory: 'Vatsal Goyal',
  signatoryDesignation: 'Proprietor',
  establishedYear: 2015,
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-001',
  fullName: 'Vatsal Goyal',
  username: 'vatsal.goyal',
  email: 'vatsalgoyal71@gmail.com',
  phone: '+91 7310698091',
  avatarUrl: '/images/goyal_shop_real.png',
  designation: 'Proprietor & Business Owner',
  role: 'Owner / Super Admin',
  accountStatus: 'Active',
  twoFactorEnabled: true,
  department: 'Operations & Management',
  lastLogin: 'Just now (Firebase Authenticated)',
};

export const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'prd-01',
    sku: 'GCF-SP-50',
    name: 'SP Pashu Aahar (एस. पी. संतुलित पशु आहार)',
    category: 'Finished Feed',
    unit: 'Bags (50kg)',
    currentStock: 420,
    minStockLevel: 100,
    ratePerUnit: 1580,
    hsnCode: '23099010',
    warehouse: 'Main Shop Counter (दुकान)',
    bagsSoldToday: 35,
    salesValueToday: 55300,
  },
  {
    id: 'prd-02',
    sku: 'GCF-GAV-50',
    name: 'Gavaksha Pashu Aahar (गवाक्ष संतुलित पशु आहार)',
    category: 'Finished Feed',
    unit: 'Bags (50kg)',
    currentStock: 280,
    minStockLevel: 80,
    ratePerUnit: 1650,
    hsnCode: '23099010',
    warehouse: 'Attached Godown 1 (मुख्य गोदाम)',
    bagsSoldToday: 24,
    salesValueToday: 39600,
  },
  {
    id: 'prd-03',
    sku: 'GCF-SAT-50',
    name: 'Satkar Pashu Aahar (सत्कार पशु आहार)',
    category: 'Finished Feed',
    unit: 'Bags (50kg)',
    currentStock: 190,
    minStockLevel: 50,
    ratePerUnit: 1520,
    hsnCode: '23099010',
    warehouse: 'Attached Godown 1 (मुख्य गोदाम)',
    bagsSoldToday: 18,
    salesValueToday: 27360,
  },
  {
    id: 'prd-04',
    sku: 'KHAL-SARSON-50',
    name: 'Sarson Khal (कच्ची घानी सरसों खल)',
    category: 'Raw Material',
    unit: 'Bags (50kg)',
    currentStock: 310,
    minStockLevel: 100,
    ratePerUnit: 2850,
    hsnCode: '23069012',
    warehouse: 'Warehouse 2 (गोदाम 2)',
    bagsSoldToday: 16,
    salesValueToday: 45600,
  },
  {
    id: 'prd-05',
    sku: 'KHAL-BINOLA-50',
    name: 'Binola Khal (कपासिया / बिनौला खल)',
    category: 'Raw Material',
    unit: 'Bags (50kg)',
    currentStock: 220,
    minStockLevel: 80,
    ratePerUnit: 2600,
    hsnCode: '23061000',
    warehouse: 'Warehouse 2 (गोदाम 2)',
    bagsSoldToday: 12,
    salesValueToday: 31200,
  },
  {
    id: 'prd-06',
    sku: 'CHURI-CHANA-50',
    name: 'Chana Churi (चना चूरी - स्पेशल)',
    category: 'Raw Material',
    unit: 'Bags (50kg)',
    currentStock: 260,
    minStockLevel: 70,
    ratePerUnit: 1950,
    hsnCode: '23024000',
    warehouse: 'Attached Godown 1 (मुख्य गोदाम)',
    bagsSoldToday: 15,
    salesValueToday: 29250,
  },
  {
    id: 'prd-07',
    sku: 'CHURI-MOONG-50',
    name: 'Moong Churi (मूंग चूरी)',
    category: 'Raw Material',
    unit: 'Bags (50kg)',
    currentStock: 140,
    minStockLevel: 50,
    ratePerUnit: 1780,
    hsnCode: '23024000',
    warehouse: 'Attached Godown 1 (मुख्य गोदाम)',
    bagsSoldToday: 8,
    salesValueToday: 14240,
  },
  {
    id: 'prd-08',
    sku: 'BRAN-WHEAT-45',
    name: 'Gehun Choker (गेहूं चोकर / Wheat Bran)',
    category: 'Raw Material',
    unit: 'Bags (45kg)',
    currentStock: 380,
    minStockLevel: 100,
    ratePerUnit: 1150,
    hsnCode: '23023000',
    warehouse: 'Warehouse 2 (गोदाम 2)',
    bagsSoldToday: 22,
    salesValueToday: 25300,
  },
  {
    id: 'prd-09',
    sku: 'GRAIN-MAIZE-QTL',
    name: 'Yellow Maize / Peeli Makka (दाना मक्का)',
    category: 'Raw Material',
    unit: 'Quintal',
    currentStock: 120,
    minStockLevel: 50,
    ratePerUnit: 2250,
    hsnCode: '10059000',
    warehouse: 'Warehouse 2 (गोदाम 2)',
    bagsSoldToday: 5,
    salesValueToday: 11250,
  },
  {
    id: 'prd-10',
    sku: 'SUPP-MINERAL-5',
    name: 'Super Doodh Vardhak Mineral Mixture (5kg)',
    category: 'Finished Feed',
    unit: 'Pack (5kg)',
    currentStock: 95,
    minStockLevel: 30,
    ratePerUnit: 650,
    hsnCode: '23099090',
    warehouse: 'Main Shop Counter (दुकान)',
    bagsSoldToday: 10,
    salesValueToday: 6500,
  },
];

export const SAMPLE_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cst-01',
    name: 'Chaudhary Mahendra Singh',
    firmName: 'Kisan Dairy Farm (60 Buffalos)',
    city: 'Gajraula',
    state: 'Uttar Pradesh',
    phone: '+91 98371 45678',
    creditLimit: 500000,
    totalPurchases: 1845000,
    outstandingAmount: 185000,
    paymentStatus: 'Good',
    lastPurchaseDate: '12/11/2026',
  },
  {
    id: 'cst-02',
    name: 'Radhe Shyam Sharma',
    firmName: 'Shri Krishna Pashu Aahar Kendra',
    city: 'Dhanaura',
    state: 'Uttar Pradesh',
    phone: '+91 97580 54321',
    creditLimit: 400000,
    totalPurchases: 1260000,
    outstandingAmount: 92000,
    paymentStatus: 'Good',
    lastPurchaseDate: '11/11/2026',
  },
  {
    id: 'cst-03',
    name: 'Surendra Pal Singh',
    firmName: 'Ganga Dairy & Cattle Feeds',
    city: 'Garhmukteshwar',
    state: 'Uttar Pradesh',
    phone: '+91 98972 33445',
    creditLimit: 600000,
    totalPurchases: 2120000,
    outstandingAmount: 140000,
    paymentStatus: 'Attention',
    lastPurchaseDate: '09/11/2026',
  },
  {
    id: 'cst-04',
    name: 'Mohd. Aslam',
    firmName: 'Barkati Feed & Khal Bhandar',
    city: 'Hasanpur',
    state: 'Uttar Pradesh',
    phone: '+91 94120 11223',
    creditLimit: 450000,
    totalPurchases: 980000,
    outstandingAmount: 64000,
    paymentStatus: 'Good',
    lastPurchaseDate: '10/11/2026',
  },
  {
    id: 'cst-05',
    name: 'Yogendra Kumar',
    firmName: 'Amroha Cattle Feed Agencies',
    city: 'Amroha',
    state: 'Uttar Pradesh',
    phone: '+91 98374 77889',
    creditLimit: 550000,
    totalPurchases: 1450000,
    outstandingAmount: 120000,
    paymentStatus: 'Good',
    lastPurchaseDate: '12/11/2026',
  },
  {
    id: 'cst-06',
    name: 'Rajendra Pradhan',
    firmName: 'Adarsh Dairy Farm & Livestock',
    city: 'Joya',
    state: 'Uttar Pradesh',
    phone: '+91 97594 99001',
    creditLimit: 300000,
    totalPurchases: 720000,
    outstandingAmount: 45000,
    paymentStatus: 'Good',
    lastPurchaseDate: '11/11/2026',
  },
];

export const SAMPLE_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'txn-01',
    invoiceNumber: 'INV/2026/0418',
    partyName: 'Kisan Dairy Farm (Chaudhary Mahendra)',
    date: '12/11/2026',
    type: 'Sales',
    amount: 55300,
    status: 'Paid',
    branch: 'Main Shop Counter',
  },
  {
    id: 'txn-02',
    invoiceNumber: 'INV/2026/0419',
    partyName: 'Shri Krishna Pashu Aahar Kendra (Dhanaura)',
    date: '12/11/2026',
    type: 'Sales',
    amount: 39600,
    status: 'Credit',
    branch: 'Attached Godown 1',
  },
  {
    id: 'txn-03',
    invoiceNumber: 'PUR/2026/0192',
    partyName: 'Hapur Oil Millers (Mustard Cake)',
    date: '11/11/2026',
    type: 'Purchase',
    amount: 142500,
    status: 'Paid',
    branch: 'Warehouse 2',
  },
  {
    id: 'txn-04',
    invoiceNumber: 'REC/2026/0881',
    partyName: 'Amroha Cattle Feed Agencies',
    date: '11/11/2026',
    type: 'Receipt',
    amount: 85000,
    status: 'Paid',
    branch: 'Main Shop Counter',
  },
  {
    id: 'txn-05',
    invoiceNumber: 'INV/2026/0417',
    partyName: 'Barkati Feed & Khal Bhandar (Hasanpur)',
    date: '10/11/2026',
    type: 'Sales',
    amount: 64000,
    status: 'Partial',
    branch: 'Warehouse 2',
  },
  {
    id: 'txn-06',
    invoiceNumber: 'PAY/2026/0312',
    partyName: 'SP Pashu Aahar Depot (Procurement)',
    date: '10/11/2026',
    type: 'Payment',
    amount: 125000,
    status: 'Paid',
    branch: 'Attached Godown 1',
  },
];

export const SAMPLE_PENDING_PAYMENTS: PendingPaymentItem[] = [
  {
    id: 'pay-01',
    customerName: 'Ganga Dairy & Cattle Feeds (Garhmukteshwar)',
    invoiceNumber: 'INV/2026/0388',
    dueAmount: 140000,
    dueDate: '28/10/2026',
    daysOverdue: 14,
    phone: '+91 98972 33445',
    status: 'Critical Overdue',
  },
  {
    id: 'pay-02',
    customerName: 'Kisan Dairy Farm (Chaudhary Mahendra)',
    invoiceNumber: 'INV/2026/0394',
    dueAmount: 185000,
    dueDate: '04/11/2026',
    daysOverdue: 7,
    phone: '+91 98371 45678',
    status: 'Overdue',
  },
  {
    id: 'pay-03',
    customerName: 'Amroha Cattle Feed Agencies',
    invoiceNumber: 'INV/2026/0402',
    dueAmount: 120000,
    dueDate: '12/11/2026',
    daysOverdue: 0,
    phone: '+91 98374 77889',
    status: 'Due Soon',
  },
  {
    id: 'pay-04',
    customerName: 'Shri Krishna Pashu Aahar Kendra (Dhanaura)',
    invoiceNumber: 'INV/2026/0410',
    dueAmount: 92000,
    dueDate: '14/11/2026',
    daysOverdue: 0,
    phone: '+91 97580 54321',
    status: 'Due Soon',
  },
];

export const SAMPLE_WAREHOUSES: WarehouseSummaryItem[] = [
  {
    id: 'wh-01',
    name: 'Main Shop Counter (दुकान व रीटेल)',
    location: 'Kavi Nagar, near Indra Chowk, Gajraula',
    totalStockBags: 515,
    totalStockValue: 818700,
    capacityUtilization: 85,
    lowStockItemsCount: 0,
  },
  {
    id: 'wh-02',
    name: 'Attached Godown 1 (मुख्य गोदाम - कैटल फीड)',
    location: 'Indra Chowk Compound, Gajraula',
    totalStockBags: 870,
    totalStockValue: 1398800,
    capacityUtilization: 72,
    lowStockItemsCount: 1,
  },
  {
    id: 'wh-03',
    name: 'Warehouse 2 (गोदाम 2 - खल, चूरी व दाना)',
    location: 'Indra Chowk Compound, Gajraula',
    totalStockBags: 1030,
    totalStockValue: 2154500,
    capacityUtilization: 64,
    lowStockItemsCount: 0,
  },
];

export const SAMPLE_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act-01',
    user: 'Vatsal Goyal (Counter)',
    action: 'Generated Retail Sales Bill',
    details: 'INV/2026/0418 for Kisan Dairy Farm (35 Bags SP Pashu Aahar)',
    timestamp: '10 mins ago',
    category: 'Sales',
  },
  {
    id: 'act-02',
    user: 'Godown Incharge (Gajraula)',
    action: 'Stock Inward Completed',
    details: 'Received 200 Bags Gavaksha Pashu Aahar in Attached Godown 1',
    timestamp: '1 hour ago',
    category: 'Inventory',
  },
  {
    id: 'act-03',
    user: 'Vatsal Goyal',
    action: 'Payment Realized via UPI',
    details: 'Received ₹85,000 from Amroha Cattle Feed Agencies',
    timestamp: '2 hours ago',
    category: 'Accounts',
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
export function formatIndianCurrency(amount?: number | null | undefined): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : (Number(amount) || 0);
  const parts = val.toFixed(2).split('.');
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

export function formatCompactNumber(amount?: number | null | undefined): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : (Number(amount) || 0);
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return `₹${val.toFixed(0)}`;
}
