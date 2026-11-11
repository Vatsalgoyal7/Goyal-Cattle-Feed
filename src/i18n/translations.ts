import { AppLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  companyName: string;

  // Nav categories
  navMain: string;
  navBusiness: string;
  navInventory: string;
  navManagement: string;
  navIntelligence: string;
  navSystem: string;

  // Nav items
  dashboard: string;
  salesBilling: string;
  purchaseManagement: string;
  customers: string;
  suppliers: string;
  accountsKhata: string;
  expenses: string;
  stockInventory: string;
  warehouses: string;
  manufacturing: string;
  employeesLabour: string;
  transportVehicles: string;
  gstTax: string;
  reportsAnalytics: string;
  aiBusinessAssistant: string;
  aiDocumentScanner: string;
  creativeStudio: string;
  goyalConnect: string;
  hardwareDevices: string;
  settings: string;

  // Header & Controls
  searchPlaceholder: string;
  online: string;
  offline: string;
  syncPending: string;
  syncing: string;
  calculator: string;
  simpleMode: string;
  advancedMode: string;
  userProfile: string;
  companyProfile: string;
  logout: string;

  // Dashboard top
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  allBranches: string;
  today: string;
  yesterday: string;
  thisWeek: string;
  thisMonth: string;
  lastMonth: string;
  customDate: string;

  // Metric Cards
  todaysSales: string;
  todaysPurchases: string;
  totalStockValue: string;
  totalReceivables: string;
  totalPayables: string;
  todaysCollections: string;
  todaysExpenses: string;
  estimatedProfit: string;
  vsYesterday: string;
  pendingDue: string;
  finishedRawStock: string;
  netMargin: string;

  // Quick Actions
  createSalesBill: string;
  addPurchase: string;
  addStock: string;
  addCustomer: string;
  receivePayment: string;
  addExpense: string;
  markAttendance: string;
  productionEntry: string;

  // Analytics & tables
  salesPurchaseOverview: string;
  revenueOverview: string;
  expenseBreakdown: string;
  topSellingProducts: string;
  topCustomers: string;
  warehouseSummary: string;
  recentTransactions: string;
  pendingPayments: string;
  recentBusinessActivity: string;
  lowStockAlerts: string;

  // Common buttons
  viewAll: string;
  createBill: string;
  sendReminder: string;
  receiveNow: string;
  reorder: string;
  saveChanges: string;
  cancel: string;
  close: string;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: 'Goyal Business OS',
    tagline: 'One Platform. Complete Business Control.',
    companyName: 'Goyal Cattle Feed Pvt. Ltd.',

    navMain: 'MAIN',
    navBusiness: 'BUSINESS',
    navInventory: 'INVENTORY & OPERATIONS',
    navManagement: 'MANAGEMENT',
    navIntelligence: 'INTELLIGENCE',
    navSystem: 'SYSTEM',

    dashboard: 'Dashboard',
    salesBilling: 'Sales & Billing',
    purchaseManagement: 'Purchase Management',
    customers: 'Customers',
    suppliers: 'Suppliers',
    accountsKhata: 'Accounts & Khata',
    expenses: 'Expenses',
    stockInventory: 'Stock & Inventory',
    warehouses: 'Warehouses',
    manufacturing: 'Manufacturing & Production',
    employeesLabour: 'Employees & Labour',
    transportVehicles: 'Transport & Vehicles',
    gstTax: 'GST & Tax',
    reportsAnalytics: 'Reports & Analytics',
    aiBusinessAssistant: 'AI Business Assistant',
    aiDocumentScanner: 'AI Document Scanner',
    creativeStudio: 'Creative Studio',
    goyalConnect: 'Goyal Connect',
    hardwareDevices: 'Hardware & Devices',
    settings: 'Settings',

    searchPlaceholder: 'Search products, customers, bills, khata (Ctrl+K)...',
    online: 'Online',
    offline: 'Offline Mode',
    syncPending: 'Sync Pending',
    syncing: 'Syncing...',
    calculator: 'Business Calculator',
    simpleMode: 'Simple Mode',
    advancedMode: 'Advanced Mode',
    userProfile: 'My Profile',
    companyProfile: 'Company Profile',
    logout: 'Logout',

    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    allBranches: 'All Locations & Plants',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    customDate: 'Custom Range',

    todaysSales: "Today's Sales",
    todaysPurchases: "Today's Purchases",
    totalStockValue: 'Total Stock Value',
    totalReceivables: 'Total Receivables',
    totalPayables: 'Total Payables',
    todaysCollections: "Today's Collections",
    todaysExpenses: "Today's Expenses",
    estimatedProfit: 'Estimated Profit',
    vsYesterday: 'vs yesterday',
    pendingDue: 'pending dues',
    finishedRawStock: 'finished & raw feed',
    netMargin: 'net operating margin',

    createSalesBill: 'Create Sales Bill',
    addPurchase: 'Add Purchase',
    addStock: 'Add Stock',
    addCustomer: 'Add Customer',
    receivePayment: 'Receive Payment',
    addExpense: 'Add Expense',
    markAttendance: 'Mark Attendance',
    productionEntry: 'Production Entry',

    salesPurchaseOverview: 'Sales & Purchase Overview',
    revenueOverview: 'Monthly Revenue Overview',
    expenseBreakdown: 'Expense Breakdown',
    topSellingProducts: 'Top Selling Feed Products',
    topCustomers: 'Top Performing Dealers & Farms',
    warehouseSummary: 'Godown & Warehouse Summary',
    recentTransactions: 'Recent Transactions',
    pendingPayments: 'Pending Payment Dues',
    recentBusinessActivity: 'Audit & Activity Log',
    lowStockAlerts: 'Low Stock & Raw Material Alerts',

    viewAll: 'View All',
    createBill: 'Create Bill',
    sendReminder: 'Send Reminder',
    receiveNow: 'Receive Now',
    reorder: 'Create Purchase PO',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
  },

  hi: {
    appName: 'गोयल बिज़नेस ओएस',
    tagline: 'एक मंच। संपूर्ण व्यापार नियंत्रण।',
    companyName: 'गोयल कैटल फीड प्रा. लि.',

    navMain: 'मुख्य',
    navBusiness: 'व्यापार एवं बिक्री',
    navInventory: 'स्टॉक एवं संचालन',
    navManagement: 'प्रबंधन एवं कर',
    navIntelligence: 'आर्टिफिशियल इंटेलिजेंस',
    navSystem: 'सिस्टम सेटिंग्स',

    dashboard: 'डैशबोर्ड',
    salesBilling: 'बिक्री एवं बिलिंग',
    purchaseManagement: 'खरीद प्रबंधन',
    customers: 'ग्राहक एवं डीलर',
    suppliers: 'आपूर्तिकर्ता (सप्लायर)',
    accountsKhata: 'खाता एवं लेजर',
    expenses: 'खर्चे (व्यय)',
    stockInventory: 'स्टॉक एवं इन्वेंटरी',
    warehouses: 'गोदाम (वेयरहाउस)',
    manufacturing: 'उत्पादन एवं निर्माण',
    employeesLabour: 'कर्मचारी एवं मजदूरी',
    transportVehicles: 'गाड़ियां एवं ट्रांसपोर्ट',
    gstTax: 'जीएसटी एवं टैक्स',
    reportsAnalytics: 'रिपोर्ट्स एवं विश्लेषण',
    aiBusinessAssistant: 'एआई बिजनेस सहायक',
    aiDocumentScanner: 'एआई दस्तावेज स्कैनर',
    creativeStudio: 'क्रिएटिव स्टूडियो',
    goyalConnect: 'गोयल कनेक्ट',
    hardwareDevices: 'हार्डवेयर एवं कांटे (कांटा)',
    settings: 'सेटिंग्स',

    searchPlaceholder: 'उत्पाद, ग्राहक, बिल या खाता खोजें (Ctrl+K)...',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन मोड',
    syncPending: 'सिंक बाकी है',
    syncing: 'सिंक हो रहा है...',
    calculator: 'व्यापार कैलकुलेटर',
    simpleMode: 'सरल मोड (सिंपल)',
    advancedMode: 'विस्तृत मोड (एडवांस्ड)',
    userProfile: 'मेरी प्रोफाइल',
    companyProfile: 'कंपनी प्रोफाइल',
    logout: 'लॉग आउट',

    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    allBranches: 'सभी प्लांट एवं गोदाम',
    today: 'आज',
    yesterday: 'कल (बीता)',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    lastMonth: 'पिछले महीने',
    customDate: 'तारीख चुनें',

    todaysSales: 'आज की बिक्री (सेल्स)',
    todaysPurchases: 'आज की खरीद (परचेज)',
    totalStockValue: 'कुल स्टॉक का मूल्य',
    totalReceivables: 'ग्राहकों से बाकी (उधारी)',
    totalPayables: 'सप्लायर को देनदारी',
    todaysCollections: 'आज की वसूली (पेमेंट)',
    todaysExpenses: 'आज के कुल खर्चे',
    estimatedProfit: 'अनुमानित मुनाफा',
    vsYesterday: 'कल की तुलना में',
    pendingDue: 'बाकी बकाया',
    finishedRawStock: 'तैयार व कच्चा माल',
    netMargin: 'शुद्ध मुनाफा दर',

    createSalesBill: 'बिक्री बिल बनाएं',
    addPurchase: 'खरीद दर्ज करें',
    addStock: 'स्टॉक जोड़ें',
    addCustomer: 'नया ग्राहक जोड़ें',
    receivePayment: 'पेमेंट जमा करें',
    addExpense: 'खर्चा दर्ज करें',
    markAttendance: 'हाजिरी लगाएं',
    productionEntry: 'उत्पादन दर्ज करें',

    salesPurchaseOverview: 'बिक्री व खरीद समीक्षा',
    revenueOverview: 'मासिक आमदनी समीक्षा',
    expenseBreakdown: 'खर्चों का विवरण',
    topSellingProducts: 'सर्वाधिक बिकने वाला पशु आहार',
    topCustomers: 'प्रमुख ग्राहक एवं डेयरी फार्म',
    warehouseSummary: 'गोदामों की वर्तमान स्थिति',
    recentTransactions: 'हालिया लेन-देन',
    pendingPayments: 'लंबित भुगतान (उधारी सूची)',
    recentBusinessActivity: 'हालिया गतिविधियां (लॉग)',
    lowStockAlerts: 'कम स्टॉक एवं कच्चे माल की चेतावनी',

    viewAll: 'सभी देखें',
    createBill: 'बिल बनाएं',
    sendReminder: 'तकादा भेजें',
    receiveNow: 'रुपये प्राप्त करें',
    reorder: 'खरीद आर्डर बनाएं',
    saveChanges: 'बदलाव सुरक्षित करें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
  },

  hinglish: {
    appName: 'Goyal Business OS',
    tagline: 'Ek Platform. Poora Business Control.',
    companyName: 'Goyal Cattle Feed Pvt. Ltd.',

    navMain: 'MAIN',
    navBusiness: 'BUSINESS & SALES',
    navInventory: 'STOCK & OPERATIONS',
    navManagement: 'MANAGEMENT & TAX',
    navIntelligence: 'SMART AI TOOLS',
    navSystem: 'SYSTEM SETTINGS',

    dashboard: 'Dashboard',
    salesBilling: 'Bikri & Billing',
    purchaseManagement: 'Kharidari (Purchase)',
    customers: 'Grahak (Customers)',
    suppliers: 'Suppliers & Millers',
    accountsKhata: 'Hisab-Kitab & Khata',
    expenses: 'Factory Kharcha (Expenses)',
    stockInventory: 'Stock & Godown',
    warehouses: 'Godowns & Plants',
    manufacturing: 'Production & Mill',
    employeesLabour: 'Staff & Mazdoor',
    transportVehicles: 'Gadiyaan & Gaadi Bhada',
    gstTax: 'GST & Tax Returns',
    reportsAnalytics: 'Reports & Hisab',
    aiBusinessAssistant: 'AI Business Assistant',
    aiDocumentScanner: 'AI Bill Scanner',
    creativeStudio: 'Marketing & Poster Studio',
    goyalConnect: 'Goyal Connect',
    hardwareDevices: 'Kanta & Weighbridge',
    settings: 'Settings',

    searchPlaceholder: 'Product, customer, bill ya khata search karein (Ctrl+K)...',
    online: 'Online',
    offline: 'Offline Mode',
    syncPending: 'Sync Pending',
    syncing: 'Sync Ho Raha Hai...',
    calculator: 'Vyapar Calculator',
    simpleMode: 'Aasan Mode (Simple)',
    advancedMode: 'Full ERP Mode',
    userProfile: 'Meri Profile',
    companyProfile: 'Company Details',
    logout: 'Logout',

    greetingMorning: 'Shubh Prabhat',
    greetingAfternoon: 'Namaste',
    greetingEvening: 'Shubh Sandhya',
    allBranches: 'Saare Plants & Godown',
    today: 'Aaj',
    yesterday: 'Kal (Beeta)',
    thisWeek: 'Is Hafte',
    thisMonth: 'Is Mahine',
    lastMonth: 'Pichle Mahine',
    customDate: 'Custom Dates',

    todaysSales: 'Aaj Ki Bikri',
    todaysPurchases: 'Aaj Ki Kharidari',
    totalStockValue: 'Kul Stock Value',
    totalReceivables: 'Market Se Lena (Udhar)',
    totalPayables: 'Suppliers Ko Dena',
    todaysCollections: 'Aaj Ki Vasooli (Cash+UPI)',
    todaysExpenses: 'Aaj Ka Kharcha',
    estimatedProfit: 'Andazatan Munafa',
    vsYesterday: 'kal ke mukable',
    pendingDue: 'baaki udhari',
    finishedRawStock: 'feed aur raw maal',
    netMargin: 'net munafa margin',

    createSalesBill: 'Sales Bill Banayein',
    addPurchase: 'Kharid Entry Dalein',
    addStock: 'Stock Entry Karein',
    addCustomer: 'Naya Grahak Jodein',
    receivePayment: 'Payment Jama Karein',
    addExpense: 'Kharcha Dalein',
    markAttendance: 'Hazri Lagayein',
    productionEntry: 'Production Batch Dalein',

    salesPurchaseOverview: 'Sales Aur Purchase Overview',
    revenueOverview: 'Mahine Ki Kamai Chart',
    expenseBreakdown: 'Factory Kharchon Ka Hisab',
    topSellingProducts: 'Sabse Zyada Bikne Wala Pashu Aahar',
    topCustomers: 'Top Dealers Aur Dairy Farms',
    warehouseSummary: 'Godown Aur Silo Stock Summary',
    recentTransactions: 'Taza Len-Den (Transactions)',
    pendingPayments: 'Baqaya Udhari (Pending Payments)',
    recentBusinessActivity: 'Factory Aur Office Activity',
    lowStockAlerts: 'Kam Stock & Raw Material Alert',

    viewAll: 'Sab Dekhein',
    createBill: 'Bill Banayein',
    sendReminder: 'Payment Reminder Bhejein',
    receiveNow: 'Payment Lein',
    reorder: 'Raw Material Order Karein',
    saveChanges: 'Save Karein',
    cancel: 'Cancel',
    close: 'Band Karein',
  },
};
