import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SalesInvoice,
  PurchaseInvoice,
  FullCustomer,
  FullSupplier,
  LedgerEntry,
  ExpenseItem,
  PaymentRecord,
  InvoicePaymentStatus,
  ProductInventoryItem,
  Warehouse,
  StockMovement,
  StockTransfer,
  Recipe,
  ProductionOrder,
  QualityInspection,
  Employee,
  AttendanceRecord,
  SalarySlip,
  Vehicle,
  Driver,
  DispatchOrder,
  WeighbridgeEntry,
  AIConversation,
  AIMemoryItem,
  AITaskReminder,
  AIActionAuditLog,
  HardwareDevice,
  CloudStorageFile,
  AIDocumentScan,
  OfflineSyncQueueItem,
  AIWorkspaceType,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_INVOICES,
  INITIAL_PURCHASES,
  INITIAL_LEDGERS,
  INITIAL_EXPENSES,
  INITIAL_PAYMENTS,
} from '../data/mockEnterpriseData';
import {
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_TRANSFERS,
  INITIAL_RECIPES,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_QUALITY_INSPECTIONS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_SALARY_SLIPS,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_DISPATCHES,
  INITIAL_WEIGHBRIDGE_ENTRIES,
} from '../data/mockOperationsData';
import {
  INITIAL_AI_CONVERSATIONS,
  INITIAL_AI_MEMORIES,
  INITIAL_AI_TASKS,
  INITIAL_AI_AUDIT_LOGS,
  INITIAL_HARDWARE_DEVICES,
  INITIAL_CLOUD_FILES,
  INITIAL_SCANNED_DOCS,
} from '../data/mockIntelligenceData';
import { parseAIBusinessIntent } from '../utils/aiAndOperationsLogic';
import { useApp } from './AppContext';

interface EnterpriseContextType {
  // Collections (Part 2)
  invoices: SalesInvoice[];
  purchases: PurchaseInvoice[];
  customers: FullCustomer[];
  suppliers: FullSupplier[];
  ledgers: LedgerEntry[];
  expenses: ExpenseItem[];
  payments: PaymentRecord[];

  // Collections (Part 3 Operations)
  products: ProductInventoryItem[];
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  transfers: StockTransfer[];
  recipes: Recipe[];
  productionOrders: ProductionOrder[];
  qualityInspections: QualityInspection[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  salarySlips: SalarySlip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  dispatches: DispatchOrder[];
  weighbridgeEntries: WeighbridgeEntry[];

  // Sales Mutations
  createSalesInvoice: (data: Omit<SalesInvoice, 'id'>) => SalesInvoice;
  updateInvoiceStatus: (id: string, status: InvoicePaymentStatus, amountPaid?: number) => void;
  deleteSalesInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => SalesInvoice | null;

  // Purchase Mutations
  createPurchase: (data: Omit<PurchaseInvoice, 'id'>) => PurchaseInvoice;
  updatePurchaseStatus: (id: string, status: PurchaseInvoice['paymentStatus'], amountPaid?: number) => void;
  deletePurchase: (id: string) => void;

  // Party Mutations
  addCustomer: (data: Omit<FullCustomer, 'id' | 'customerId'>) => FullCustomer;
  updateCustomer: (id: string, data: Partial<FullCustomer>) => void;
  addSupplier: (data: Omit<FullSupplier, 'id' | 'supplierId'>) => FullSupplier;
  updateSupplier: (id: string, data: Partial<FullSupplier>) => void;

  // Expense Mutations
  addExpense: (data: Omit<ExpenseItem, 'id' | 'expenseNumber'>) => ExpenseItem;
  deleteExpense: (id: string) => void;

  // Payment Mutations
  recordPayment: (data: Omit<PaymentRecord, 'id' | 'paymentNumber'>) => PaymentRecord;

  // Inventory & Stock Mutations (Part 3)
  addProduct: (data: Omit<ProductInventoryItem, 'id' | 'productId' | 'updatedAt'>) => ProductInventoryItem;
  updateProduct: (id: string, data: Partial<ProductInventoryItem>) => void;
  adjustStock: (productId: string, newStock: number, reason: string, location?: string) => void;

  // Warehouse & Transfer Mutations
  addWarehouse: (data: Omit<Warehouse, 'id'>) => Warehouse;
  createStockTransfer: (data: Omit<StockTransfer, 'id' | 'transferNumber'>) => StockTransfer;
  updateStockTransferStatus: (id: string, status: StockTransfer['status'], receivedQty?: number) => void;

  // Manufacturing & Recipe Mutations
  createRecipe: (data: Omit<Recipe, 'id' | 'recipeCode'>) => Recipe;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  createProductionOrder: (data: Omit<ProductionOrder, 'id' | 'orderNumber' | 'batchNumber'>) => ProductionOrder;
  confirmProductionOrder: (orderId: string) => void;

  // Quality Control Mutations
  createQualityInspection: (data: Omit<QualityInspection, 'id' | 'inspectionNumber'>) => QualityInspection;

  // Employee & HR Mutations
  addEmployee: (data: Omit<Employee, 'id' | 'employeeId'>) => Employee;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  bulkMarkAttendance: (date: string, status: AttendanceRecord['status']) => void;
  generateSalarySlip: (data: Omit<SalarySlip, 'id' | 'slipNumber'>) => SalarySlip;
  markSalaryPaid: (slipId: string, paymentRef: string) => void;

  // Fleet & Logistics Mutations
  addVehicle: (data: Omit<Vehicle, 'id'>) => Vehicle;
  addDriver: (data: Omit<Driver, 'id' | 'driverId'>) => Driver;
  createDispatch: (data: Omit<DispatchOrder, 'id' | 'dispatchNumber'>) => DispatchOrder;
  updateDispatchStatus: (id: string, status: DispatchOrder['status']) => void;
  createWeighbridgeEntry: (data: Omit<WeighbridgeEntry, 'id' | 'slipNumber'>) => WeighbridgeEntry;

  // Interactive Modals / Drawers State
  previewInvoice: SalesInvoice | null;
  setPreviewInvoice: (invoice: SalesInvoice | null) => void;
  previewPurchase: PurchaseInvoice | null;
  setPreviewPurchase: (purchase: PurchaseInvoice | null) => void;
  selectedCustomerProfile: FullCustomer | null;
  setSelectedCustomerProfile: (customer: FullCustomer | null) => void;
  selectedSupplierProfile: FullSupplier | null;
  setSelectedSupplierProfile: (supplier: FullSupplier | null) => void;

  isCreateInvoiceOpen: boolean;
  setIsCreateInvoiceOpen: (open: boolean) => void;
  isCreatePurchaseOpen: boolean;
  setIsCreatePurchaseOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  isAddCustomerOpen: boolean;
  setIsAddCustomerOpen: (open: boolean) => void;
  isAddSupplierOpen: boolean;
  setIsAddSupplierOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;

  // Collections (Part 4 Intelligence, Hardware & System)
  conversations: AIConversation[];
  memories: AIMemoryItem[];
  tasks: AITaskReminder[];
  aiAuditLogs: AIActionAuditLog[];
  hardwareDevices: HardwareDevice[];
  cloudFiles: CloudStorageFile[];
  scannedDocs: AIDocumentScan[];
  offlineQueue: OfflineSyncQueueItem[];
  activeAIWorkspace: AIWorkspaceType;
  isAIAssistantOpen: boolean;

  // Part 4 Actions & Mutations
  setIsAIAssistantOpen: (open: boolean) => void;
  setActiveAIWorkspace: (workspace: AIWorkspaceType) => void;
  sendAIMessage: (prompt: string, workspace?: AIWorkspaceType, conversationId?: string) => Promise<string>;
  confirmAIAction: (conversationId: string, messageId: string, actionId: string) => void;
  cancelAIAction: (conversationId: string, messageId: string, actionId: string) => void;
  createAIConversation: (title: string, workspace: AIWorkspaceType) => AIConversation;
  deleteAIConversation: (id: string) => void;
  addAIMemory: (memory: Omit<AIMemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => AIMemoryItem;
  deleteAIMemory: (id: string) => void;
  addAITask: (task: Omit<AITaskReminder, 'id' | 'createdAt'>) => AITaskReminder;
  toggleAITask: (id: string) => void;
  deleteAITask: (id: string) => void;
  addScannedDoc: (doc: Omit<AIDocumentScan, 'id' | 'uploadDate'>) => AIDocumentScan;
  confirmScannedDoc: (id: string, asPurchaseOrExpense: 'Purchase' | 'Expense') => void;
  updateHardwareDeviceStatus: (id: string, status: HardwareDevice['status']) => void;
  exportFullDatabaseBackup: () => void;
  restoreDatabaseFromBackup: (jsonContent: string) => boolean;
  enqueueOfflineItem: (item: Omit<OfflineSyncQueueItem, 'id' | 'timestamp' | 'syncStatus'>) => void;
  syncOfflineQueue: () => void;
}

const EnterpriseContext = createContext<EnterpriseContextType | undefined>(undefined);

export const EnterpriseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addActivity } = useApp();

  // Load from localStorage or defaults
  const [invoices, setInvoices] = useState<SalesInvoice[]>(() => {
    const saved = localStorage.getItem('goyal_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(() => {
    const saved = localStorage.getItem('goyal_purchases');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [customers, setCustomers] = useState<FullCustomer[]>(() => {
    const saved = localStorage.getItem('goyal_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<FullSupplier[]>(() => {
    const saved = localStorage.getItem('goyal_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [ledgers, setLedgers] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('goyal_ledgers');
    return saved ? JSON.parse(saved) : INITIAL_LEDGERS;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('goyal_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('goyal_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // Part 3 Operations State
  const [products, setProducts] = useState<ProductInventoryItem[]>(() => {
    const saved = localStorage.getItem('goyal_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem('goyal_warehouses');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('goyal_stock_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [transfers, setTransfers] = useState<StockTransfer[]>(() => {
    const saved = localStorage.getItem('goyal_transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('goyal_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => {
    const saved = localStorage.getItem('goyal_production_orders');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_ORDERS;
  });

  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>(() => {
    const saved = localStorage.getItem('goyal_quality_inspections');
    return saved ? JSON.parse(saved) : INITIAL_QUALITY_INSPECTIONS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('goyal_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('goyal_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(() => {
    const saved = localStorage.getItem('goyal_salary_slips');
    return saved ? JSON.parse(saved) : INITIAL_SALARY_SLIPS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('goyal_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('goyal_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [dispatches, setDispatches] = useState<DispatchOrder[]>(() => {
    const saved = localStorage.getItem('goyal_dispatches');
    return saved ? JSON.parse(saved) : INITIAL_DISPATCHES;
  });

  const [weighbridgeEntries, setWeighbridgeEntries] = useState<WeighbridgeEntry[]>(() => {
    const saved = localStorage.getItem('goyal_weighbridge_entries');
    return saved ? JSON.parse(saved) : INITIAL_WEIGHBRIDGE_ENTRIES;
  });

  // Modal / Preview state
  const [previewInvoice, setPreviewInvoice] = useState<SalesInvoice | null>(null);
  const [previewPurchase, setPreviewPurchase] = useState<PurchaseInvoice | null>(null);
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState<FullCustomer | null>(null);
  const [selectedSupplierProfile, setSelectedSupplierProfile] = useState<FullSupplier | null>(null);

  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isCreatePurchaseOpen, setIsCreatePurchaseOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Part 4 Intelligence & System State
  const [conversations, setConversations] = useState<AIConversation[]>(() => {
    const saved = localStorage.getItem('goyal_ai_conversations');
    return saved ? JSON.parse(saved) : INITIAL_AI_CONVERSATIONS;
  });

  const [memories, setMemories] = useState<AIMemoryItem[]>(() => {
    const saved = localStorage.getItem('goyal_ai_memories');
    return saved ? JSON.parse(saved) : INITIAL_AI_MEMORIES;
  });

  const [tasks, setTasks] = useState<AITaskReminder[]>(() => {
    const saved = localStorage.getItem('goyal_ai_tasks');
    return saved ? JSON.parse(saved) : INITIAL_AI_TASKS;
  });

  const [aiAuditLogs, setAiAuditLogs] = useState<AIActionAuditLog[]>(() => {
    const saved = localStorage.getItem('goyal_ai_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AI_AUDIT_LOGS;
  });

  const [hardwareDevices, setHardwareDevices] = useState<HardwareDevice[]>(() => {
    const saved = localStorage.getItem('goyal_hardware_devices');
    return saved ? JSON.parse(saved) : INITIAL_HARDWARE_DEVICES;
  });

  const [cloudFiles, setCloudFiles] = useState<CloudStorageFile[]>(() => {
    const saved = localStorage.getItem('goyal_cloud_files');
    return saved ? JSON.parse(saved) : INITIAL_CLOUD_FILES;
  });

  const [scannedDocs, setScannedDocs] = useState<AIDocumentScan[]>(() => {
    const saved = localStorage.getItem('goyal_scanned_docs');
    return saved ? JSON.parse(saved) : INITIAL_SCANNED_DOCS;
  });

  const [offlineQueue, setOfflineQueue] = useState<OfflineSyncQueueItem[]>(() => {
    const saved = localStorage.getItem('goyal_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeAIWorkspace, setActiveAIWorkspace] = useState<AIWorkspaceType>('Daily Operations');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Sync Part 4 to localStorage
  useEffect(() => {
    localStorage.setItem('goyal_ai_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('goyal_ai_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('goyal_ai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('goyal_ai_audit_logs', JSON.stringify(aiAuditLogs));
  }, [aiAuditLogs]);

  useEffect(() => {
    localStorage.setItem('goyal_hardware_devices', JSON.stringify(hardwareDevices));
  }, [hardwareDevices]);

  useEffect(() => {
    localStorage.setItem('goyal_cloud_files', JSON.stringify(cloudFiles));
  }, [cloudFiles]);

  useEffect(() => {
    localStorage.setItem('goyal_scanned_docs', JSON.stringify(scannedDocs));
  }, [scannedDocs]);

  useEffect(() => {
    localStorage.setItem('goyal_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('goyal_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('goyal_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('goyal_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('goyal_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('goyal_ledgers', JSON.stringify(ledgers));
  }, [ledgers]);

  useEffect(() => {
    localStorage.setItem('goyal_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('goyal_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('goyal_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('goyal_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem('goyal_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('goyal_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('goyal_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('goyal_production_orders', JSON.stringify(productionOrders));
  }, [productionOrders]);

  useEffect(() => {
    localStorage.setItem('goyal_quality_inspections', JSON.stringify(qualityInspections));
  }, [qualityInspections]);

  useEffect(() => {
    localStorage.setItem('goyal_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('goyal_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('goyal_salary_slips', JSON.stringify(salarySlips));
  }, [salarySlips]);

  useEffect(() => {
    localStorage.setItem('goyal_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('goyal_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('goyal_dispatches', JSON.stringify(dispatches));
  }, [dispatches]);

  useEffect(() => {
    localStorage.setItem('goyal_weighbridge_entries', JSON.stringify(weighbridgeEntries));
  }, [weighbridgeEntries]);

  // Mutations
  const createSalesInvoice = (data: Omit<SalesInvoice, 'id'>): SalesInvoice => {
    const newId = `inv-${Date.now()}`;
    const newInvoice: SalesInvoice = {
      ...data,
      id: newId,
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Update customer balances if linked
    if (data.customerId) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === data.customerId) {
            return {
              ...c,
              totalSales: c.totalSales + data.grandTotal,
              currentOutstanding: c.currentOutstanding + data.balanceDue,
              lastPurchaseDate: data.invoiceDate,
            };
          }
          return c;
        })
      );

      // Create Ledger entry
      const newLedger: LedgerEntry = {
        id: `led-${Date.now()}`,
        date: data.invoiceDate,
        transactionId: data.invoiceNumber,
        partyType: 'Customer',
        partyId: data.customerId,
        partyName: data.customerFirm || data.customerName,
        particulars: `Sales: ${data.documentType} #${data.invoiceNumber}`,
        debit: data.grandTotal,
        credit: data.amountPaid,
        balance: 0, // recalculated below
        reference: data.invoiceNumber,
        paymentStatus: data.paymentStatus === 'Completed' ? 'Paid' : data.paymentStatus === 'Partially Paid' ? 'Partially Paid' : 'Pending',
        type: 'Invoice',
      };

      setLedgers(prev => [newLedger, ...prev]);
    }

    addActivity(
      `Generated ${data.documentType}`,
      `Invoice #${data.invoiceNumber} for ${data.customerFirm || data.customerName} - ₹${data.grandTotal.toLocaleString('en-IN')}`,
      'Sales'
    );

    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: InvoicePaymentStatus, amountPaid?: number) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const updatedPaid = amountPaid !== undefined ? amountPaid : inv.amountPaid;
          const updatedBal = Math.max(0, inv.grandTotal - updatedPaid);
          return {
            ...inv,
            paymentStatus: status,
            amountPaid: updatedPaid,
            balanceDue: updatedBal,
            updatedAt: new Date().toISOString(),
          };
        }
        return inv;
      })
    );
  };

  const deleteSalesInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const duplicateInvoice = (id: string): SalesInvoice | null => {
    const existing = invoices.find(inv => inv.id === id);
    if (!existing) return null;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newNumber = `INV/2026/${randomSuffix}`;
    const duplicated: SalesInvoice = {
      ...existing,
      id: `inv-${Date.now()}`,
      invoiceNumber: newNumber,
      invoiceDate: new Date().toLocaleDateString('en-GB'),
      dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-GB'),
      amountPaid: 0,
      balanceDue: existing.grandTotal,
      paymentStatus: 'Draft',
      createdAt: new Date().toISOString(),
    };

    setInvoices(prev => [duplicated, ...prev]);
    return duplicated;
  };

  const createPurchase = (data: Omit<PurchaseInvoice, 'id'>): PurchaseInvoice => {
    const newId = `pur-${Date.now()}`;
    const newPurchase: PurchaseInvoice = {
      ...data,
      id: newId,
    };

    setPurchases(prev => [newPurchase, ...prev]);

    // Update supplier balance
    if (data.supplierId) {
      setSuppliers(prev =>
        prev.map(s => {
          if (s.id === data.supplierId) {
            return {
              ...s,
              totalPurchases: s.totalPurchases + data.grandTotal,
              currentPayable: s.currentPayable + data.balanceDue,
            };
          }
          return s;
        })
      );

      // Create Ledger entry
      const newLedger: LedgerEntry = {
        id: `led-pur-${Date.now()}`,
        date: data.purchaseDate,
        transactionId: data.purchaseNumber,
        partyType: 'Supplier',
        partyId: data.supplierId,
        partyName: data.supplierFirm || data.supplierName,
        particulars: `Purchase: Bill #${data.supplierInvoiceNumber}`,
        debit: data.amountPaid,
        credit: data.grandTotal,
        balance: 0,
        reference: data.supplierInvoiceNumber,
        paymentStatus: data.paymentStatus === 'Paid' ? 'Paid' : data.paymentStatus === 'Partially Paid' ? 'Partially Paid' : 'Pending',
        type: 'Invoice',
      };

      setLedgers(prev => [newLedger, ...prev]);
    }

    addActivity(
      `Recorded Purchase Bill`,
      `Purchase #${data.purchaseNumber} from ${data.supplierFirm} - ₹${data.grandTotal.toLocaleString('en-IN')}`,
      'Purchase'
    );

    return newPurchase;
  };

  const updatePurchaseStatus = (id: string, status: PurchaseInvoice['paymentStatus'], amountPaid?: number) => {
    setPurchases(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updatedPaid = amountPaid !== undefined ? amountPaid : p.amountPaid;
          const updatedBal = Math.max(0, p.grandTotal - updatedPaid);
          return {
            ...p,
            paymentStatus: status,
            amountPaid: updatedPaid,
            balanceDue: updatedBal,
          };
        }
        return p;
      })
    );
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const addCustomer = (data: Omit<FullCustomer, 'id' | 'customerId'>): FullCustomer => {
    const count = customers.length + 1;
    const custId = `CUST-2026-${String(count).padStart(3, '0')}`;
    const newCustomer: FullCustomer = {
      ...data,
      id: `cst-${Date.now()}`,
      customerId: custId,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addActivity('Registered Customer', `${data.firmName} (${data.name})`, 'Sales');
    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<FullCustomer>) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const addSupplier = (data: Omit<FullSupplier, 'id' | 'supplierId'>): FullSupplier => {
    const count = suppliers.length + 1;
    const suppId = `SUPP-2026-${String(count).padStart(3, '0')}`;
    const newSupplier: FullSupplier = {
      ...data,
      id: `sup-${Date.now()}`,
      supplierId: suppId,
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    addActivity('Registered Supplier', `${data.firmName} (${data.name})`, 'Purchase');
    return newSupplier;
  };

  const updateSupplier = (id: string, data: Partial<FullSupplier>) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const addExpense = (data: Omit<ExpenseItem, 'id' | 'expenseNumber'>): ExpenseItem => {
    const expCount = expenses.length + 1;
    const expNumber = `EXP-2026-${String(expCount).padStart(4, '0')}`;
    const newExpense: ExpenseItem = {
      ...data,
      id: `exp-${Date.now()}`,
      expenseNumber: expNumber,
    };
    setExpenses(prev => [newExpense, ...prev]);
    addActivity('Recorded Expense', `${data.category}: ₹${data.amount.toLocaleString('en-IN')} (${data.vendor})`, 'Accounts');
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const recordPayment = (data: Omit<PaymentRecord, 'id' | 'paymentNumber'>): PaymentRecord => {
    const payCount = payments.length + 1;
    const payNumber = `PAY-2026-${String(payCount).padStart(4, '0')}`;
    const newPayment: PaymentRecord = {
      ...data,
      id: `pay-${Date.now()}`,
      paymentNumber: payNumber,
    };

    setPayments(prev => [newPayment, ...prev]);

    // If customer receipt, reduce customer outstanding and update linked invoices
    if (data.partyType === 'Customer') {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === data.partyId) {
            return {
              ...c,
              totalPayments: c.totalPayments + data.amount,
              currentOutstanding: Math.max(0, c.currentOutstanding - data.amount),
            };
          }
          return c;
        })
      );

      // Reconcile invoices if provided
      if (data.linkedInvoices && data.linkedInvoices.length > 0) {
        setInvoices(prev =>
          prev.map(inv => {
            const alloc = data.linkedInvoices.find(l => l.invoiceId === inv.id);
            if (alloc) {
              const newPaid = inv.amountPaid + alloc.allocatedAmount;
              const newBal = Math.max(0, inv.grandTotal - newPaid);
              const newStatus: InvoicePaymentStatus = newBal === 0 ? 'Completed' : 'Partially Paid';
              return {
                ...inv,
                amountPaid: newPaid,
                balanceDue: newBal,
                paymentStatus: newStatus,
              };
            }
            return inv;
          })
        );
      }

      // Add to Ledger
      const newLedger: LedgerEntry = {
        id: `led-pay-${Date.now()}`,
        date: data.date,
        transactionId: payNumber,
        partyType: 'Customer',
        partyId: data.partyId,
        partyName: data.partyFirm || data.partyName,
        particulars: `Payment Received (${data.paymentMode}): ${payNumber}`,
        debit: 0,
        credit: data.amount,
        balance: 0,
        reference: data.transactionRef || payNumber,
        paymentStatus: 'Paid',
        type: 'Payment',
      };
      setLedgers(prev => [newLedger, ...prev]);
    } else {
      // Supplier payment
      setSuppliers(prev =>
        prev.map(s => {
          if (s.id === data.partyId) {
            return {
              ...s,
              totalPayments: s.totalPayments + data.amount,
              currentPayable: Math.max(0, s.currentPayable - data.amount),
            };
          }
          return s;
        })
      );

      // Add to Ledger
      const newLedger: LedgerEntry = {
        id: `led-supp-pay-${Date.now()}`,
        date: data.date,
        transactionId: payNumber,
        partyType: 'Supplier',
        partyId: data.partyId,
        partyName: data.partyFirm || data.partyName,
        particulars: `Payment Disbursed (${data.paymentMode}): ${payNumber}`,
        debit: data.amount,
        credit: 0,
        balance: 0,
        reference: data.transactionRef || payNumber,
        paymentStatus: 'Paid',
        type: 'Payment',
      };
      setLedgers(prev => [newLedger, ...prev]);
    }

    addActivity(
      `Processed Payment ${payNumber}`,
      `${data.receiptType} of ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMode} for ${data.partyFirm}`,
      'Accounts'
    );

    return newPayment;
  };

  // ==========================================
  // PART 3: OPERATIONS MUTATIONS
  // ==========================================

  const addProduct = (data: Omit<ProductInventoryItem, 'id' | 'productId' | 'updatedAt'>): ProductInventoryItem => {
    const newId = `prod-${Date.now()}`;
    const code = `PRD-${Date.now().toString().slice(-4)}`;
    const newProduct: ProductInventoryItem = {
      ...data,
      id: newId,
      productId: code,
      updatedAt: new Date().toLocaleDateString('en-GB'),
    };

    setProducts(prev => [newProduct, ...prev]);

    if (data.currentStock > 0) {
      const movement: StockMovement = {
        id: `sm-${Date.now()}`,
        transactionId: `TXN-INIT-${Date.now().toString().slice(-4)}`,
        productId: newId,
        productName: data.name,
        sku: data.sku,
        date: new Date().toLocaleDateString('en-GB'),
        type: 'Opening Stock',
        referenceNumber: 'INITIAL-STOCK',
        sourceLocation: 'Opening Balance',
        destinationLocation: 'Default Warehouse',
        quantityIn: data.currentStock,
        quantityOut: 0,
        balance: data.currentStock,
        unit: data.unit,
        createdBy: 'Admin / Inventory',
        notes: 'Initial opening stock registered with product entry',
      };
      setStockMovements(prev => [movement, ...prev]);
    }

    addActivity(`Added Product: ${data.name}`, `Category: ${data.category} | SKU: ${data.sku}`, 'Inventory');
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<ProductInventoryItem>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data, updatedAt: new Date().toLocaleDateString('en-GB') } : p))
    );
  };

  const adjustStock = (productId: string, newStock: number, reason: string, location = 'Default Warehouse') => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const diff = newStock - p.currentStock;
          const movement: StockMovement = {
            id: `sm-adj-${Date.now()}`,
            transactionId: `TXN-ADJ-${Date.now().toString().slice(-4)}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            date: new Date().toLocaleDateString('en-GB'),
            type: 'Stock Adjustment',
            referenceNumber: `ADJ-${Date.now().toString().slice(-4)}`,
            sourceLocation: diff < 0 ? location : 'Adjustment Entry',
            destinationLocation: diff > 0 ? location : 'Adjustment Loss',
            quantityIn: diff > 0 ? diff : 0,
            quantityOut: diff < 0 ? Math.abs(diff) : 0,
            balance: newStock,
            unit: p.unit,
            createdBy: 'Rajesh Goyal (Authorized)',
            notes: reason,
          };
          setStockMovements(mPrev => [movement, ...mPrev]);

          return {
            ...p,
            currentStock: newStock,
            status: newStock <= 0 ? 'Out of Stock' : newStock <= p.minimumStock ? 'Low Stock' : 'In Stock',
            updatedAt: new Date().toLocaleDateString('en-GB'),
          };
        }
        return p;
      })
    );
    addActivity('Stock Adjusted', `Audited adjustment for product ID ${productId}. Reason: ${reason}`, 'Inventory');
  };

  const addWarehouse = (data: Omit<Warehouse, 'id'>): Warehouse => {
    const newId = `wh-${Date.now()}`;
    const newWarehouse: Warehouse = { ...data, id: newId };
    setWarehouses(prev => [...prev, newWarehouse]);
    addActivity(`Registered Warehouse: ${data.name}`, `Capacity: ${data.capacity} MT | Code: ${data.code}`, 'Warehouse');
    return newWarehouse;
  };

  const createStockTransfer = (data: Omit<StockTransfer, 'id' | 'transferNumber'>): StockTransfer => {
    const num = `TRF-2026-${String(transfers.length + 1).padStart(4, '0')}`;
    const newTransfer: StockTransfer = { ...data, id: `trf-${Date.now()}`, transferNumber: num };
    setTransfers(prev => [newTransfer, ...prev]);

    // If dispatched, log stock movement out
    if (data.status === 'Dispatched' || data.status === 'In Transit') {
      const movement: StockMovement = {
        id: `sm-trf-${Date.now()}`,
        transactionId: num,
        productId: data.productId,
        productName: data.productName,
        sku: 'TRANSFER',
        date: data.transferDate,
        type: 'Warehouse Transfer',
        referenceNumber: num,
        sourceLocation: data.sourceWarehouseName,
        destinationLocation: data.destinationWarehouseName,
        quantityIn: 0,
        quantityOut: data.quantity,
        balance: 0,
        unit: data.unit,
        createdBy: data.createdBy,
        notes: `Transfer dispatched via vehicle ${data.vehicleNumber}`,
      };
      setStockMovements(prev => [movement, ...prev]);
    }

    addActivity(`Created Transfer #${num}`, `${data.quantity} ${data.unit} of ${data.productName} from ${data.sourceWarehouseName} to ${data.destinationWarehouseName}`, 'Warehouse');
    return newTransfer;
  };

  const updateStockTransferStatus = (id: string, status: StockTransfer['status'], receivedQty?: number) => {
    setTransfers(prev =>
      prev.map(t => {
        if (t.id === id) {
          const rec = receivedQty !== undefined ? receivedQty : t.quantity;
          if (status === 'Received') {
            const movement: StockMovement = {
              id: `sm-trf-rec-${Date.now()}`,
              transactionId: t.transferNumber,
              productId: t.productId,
              productName: t.productName,
              sku: 'TRANSFER-IN',
              date: new Date().toLocaleDateString('en-GB'),
              type: 'Warehouse Transfer',
              referenceNumber: t.transferNumber,
              sourceLocation: t.sourceWarehouseName,
              destinationLocation: t.destinationWarehouseName,
              quantityIn: rec,
              quantityOut: 0,
              balance: 0,
              unit: t.unit,
              createdBy: 'Receiver Incharge',
              notes: `Stock confirmed received at ${t.destinationWarehouseName}`,
            };
            setStockMovements(mPrev => [movement, ...mPrev]);
          }
          return {
            ...t,
            status,
            receivedQty: status === 'Received' ? rec : t.receivedQty,
            receivedDate: status === 'Received' ? new Date().toLocaleDateString('en-GB') : t.receivedDate,
          };
        }
        return t;
      })
    );
  };

  const createRecipe = (data: Omit<Recipe, 'id' | 'recipeCode'>): Recipe => {
    const code = `RCP-${Date.now().toString().slice(-4)}`;
    const newRecipe: Recipe = { ...data, id: `rec-${Date.now()}`, recipeCode: code };
    setRecipes(prev => [newRecipe, ...prev]);
    addActivity(`Created Recipe Formulation: ${data.name}`, `Version: ${data.version} | Base: ${data.batchSize} KG`, 'Production');
    return newRecipe;
  };

  const updateRecipe = (id: string, data: Partial<Recipe>) => {
    setRecipes(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)));
  };

  const createProductionOrder = (data: Omit<ProductionOrder, 'id' | 'orderNumber' | 'batchNumber'>): ProductionOrder => {
    const ordNum = `PRD-ORD-2026-${String(productionOrders.length + 1).padStart(4, '0')}`;
    const batchNum = `BATCH-26-${900 + productionOrders.length}`;
    const newOrder: ProductionOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber: ordNum,
      batchNumber: batchNum,
    };
    setProductionOrders(prev => [newOrder, ...prev]);
    addActivity(`Scheduled Production Order #${ordNum}`, `${data.plannedQuantity} KG of ${data.finishedProductName} on ${data.machineLine}`, 'Production');
    return newOrder;
  };

  const confirmProductionOrder = (orderId: string) => {
    const order = productionOrders.find(o => o.id === orderId);
    if (!order) return;

    // 1. Deduct raw material consumption
    order.inputMaterials.forEach(ing => {
      setProducts(prev =>
        prev.map(p => {
          if (p.id === ing.ingredientId || p.productId === ing.ingredientId || p.name === ing.ingredientName) {
            // Note: If unit is Quintal, convert KG to Quintal
            const consumedInProdUnit = p.unit === 'Quintal' ? ing.actualQty / 100 : ing.actualQty;
            const newStock = Math.max(0, p.currentStock - consumedInProdUnit);
            return {
              ...p,
              currentStock: Number(newStock.toFixed(2)),
              status: newStock <= 0 ? 'Out of Stock' : newStock <= p.minimumStock ? 'Low Stock' : 'In Stock',
            };
          }
          return p;
        })
      );

      const moveOut: StockMovement = {
        id: `sm-cons-${Date.now()}-${ing.ingredientId}`,
        transactionId: `TXN-CONS-${order.batchNumber}`,
        productId: ing.ingredientId,
        productName: ing.ingredientName,
        sku: 'RAW-CONSUMPTION',
        date: order.productionDate,
        type: 'Production Consumption',
        referenceNumber: order.batchNumber,
        sourceLocation: 'Central Grain Silos / Storage',
        destinationLocation: order.machineLine,
        quantityIn: 0,
        quantityOut: ing.actualQty,
        balance: 0,
        unit: 'KG',
        createdBy: order.supervisor,
        notes: `Consumed for batch #${order.batchNumber}`,
      };
      setStockMovements(mPrev => [moveOut, ...mPrev]);
    });

    // 2. Add finished feed bags to warehouse stock
    setProducts(prev =>
      prev.map(p => {
        if (p.id === order.finishedProductId || p.name === order.finishedProductName) {
          const newStock = p.currentStock + order.numberOfBags;
          return {
            ...p,
            currentStock: newStock,
            status: 'In Stock',
          };
        }
        return p;
      })
    );

    const moveIn: StockMovement = {
      id: `sm-out-${Date.now()}`,
      transactionId: `TXN-OUT-${order.batchNumber}`,
      productId: order.finishedProductId,
      productName: order.finishedProductName,
      sku: 'FINISHED-GOODS',
      date: order.productionDate,
      type: 'Production Output',
      referenceNumber: order.batchNumber,
      sourceLocation: order.machineLine,
      destinationLocation: 'Plant 1 - Main Feed Godown',
      quantityIn: order.numberOfBags,
      quantityOut: 0,
      balance: 0,
      unit: 'Bags (50kg)',
      createdBy: order.supervisor,
      notes: `Batch output confirmed. ${order.numberOfBags} bags packed with yield ${order.yieldPercentage}%.`,
    };
    setStockMovements(mPrev => [moveIn, ...mPrev]);

    // 3. Update order status to Completed
    setProductionOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'Completed' as const } : o))
    );

    addActivity(`Completed Production Batch #${order.batchNumber}`, `${order.numberOfBags} bags of ${order.finishedProductName} produced. Yield: ${order.yieldPercentage}%`, 'Production');
  };

  const createQualityInspection = (data: Omit<QualityInspection, 'id' | 'inspectionNumber'>): QualityInspection => {
    const num = `QC-2026-${String(qualityInspections.length + 1).padStart(4, '0')}`;
    const newQC: QualityInspection = { ...data, id: `qc-${Date.now()}`, inspectionNumber: num };
    setQualityInspections(prev => [newQC, ...prev]);
    addActivity(`Logged QC Inspection #${num}`, `Status: ${data.overallStatus} for ${data.productName}`, 'Quality');
    return newQC;
  };

  const addEmployee = (data: Omit<Employee, 'id' | 'employeeId'>): Employee => {
    const num = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = { ...data, id: `emp-${Date.now()}`, employeeId: num };
    setEmployees(prev => [...prev, newEmp]);
    addActivity(`Onboarded Employee: ${data.name}`, `Department: ${data.department} | ID: ${num}`, 'HR');
    return newEmp;
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    setAttendance(prev => {
      const existingIdx = prev.findIndex(a => a.employeeId === record.employeeId && a.date === record.date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...record, id: prev[existingIdx].id };
        return updated;
      }
      return [{ ...record, id: `att-${Date.now()}` }, ...prev];
    });
  };

  const bulkMarkAttendance = (date: string, status: AttendanceRecord['status']) => {
    employees.forEach(emp => {
      markAttendance({
        date,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        status,
        checkIn: status === 'Present' ? '08:00 AM' : undefined,
        checkOut: status === 'Present' ? '05:30 PM' : undefined,
      });
    });
    addActivity('Bulk Attendance Recorded', `Marked ${status} for all ${employees.length} employees on ${date}`, 'HR');
  };

  const generateSalarySlip = (data: Omit<SalarySlip, 'id' | 'slipNumber'>): SalarySlip => {
    const num = `PAY-SLIP-2026-${String(salarySlips.length + 1).padStart(3, '0')}`;
    const newSlip: SalarySlip = { ...data, id: `slp-${Date.now()}`, slipNumber: num };
    setSalarySlips(prev => [newSlip, ...prev]);
    addActivity(`Generated Salary Slip #${num}`, `Employee: ${data.employeeName} | Net: ₹${data.netPayable.toLocaleString('en-IN')}`, 'HR');
    return newSlip;
  };

  const markSalaryPaid = (slipId: string, paymentRef: string) => {
    setSalarySlips(prev =>
      prev.map(s =>
        s.id === slipId
          ? {
              ...s,
              paymentStatus: 'Paid' as const,
              paymentRef,
              paymentDate: new Date().toLocaleDateString('en-GB'),
            }
          : s
      )
    );
  };

  const addVehicle = (data: Omit<Vehicle, 'id'>): Vehicle => {
    const newVehicle: Vehicle = { ...data, id: `veh-${Date.now()}` };
    setVehicles(prev => [...prev, newVehicle]);
    addActivity(`Registered Fleet Vehicle: ${data.vehicleNumber}`, `Type: ${data.type} | Capacity: ${data.capacityMT} MT`, 'Transport');
    return newVehicle;
  };

  const addDriver = (data: Omit<Driver, 'id' | 'driverId'>): Driver => {
    const num = `DRV-${String(drivers.length + 1).padStart(3, '0')}`;
    const newDriver: Driver = { ...data, id: `drv-${Date.now()}`, driverId: num };
    setDrivers(prev => [...prev, newDriver]);
    addActivity(`Added Driver: ${data.name}`, `DL: ${data.licenceNumber} | Vehicle: ${data.assignedVehicleNumber || 'Unassigned'}`, 'Transport');
    return newDriver;
  };

  const createDispatch = (data: Omit<DispatchOrder, 'id' | 'dispatchNumber'>): DispatchOrder => {
    const num = `DSP-2026-${String(dispatches.length + 1).padStart(4, '0')}`;
    const newDispatch: DispatchOrder = { ...data, id: `dsp-${Date.now()}`, dispatchNumber: num };
    setDispatches(prev => [newDispatch, ...prev]);
    addActivity(`Dispatched Order #${num}`, `${data.totalBags} Bags to ${data.customerFirm} via ${data.vehicleNumber}`, 'Transport');
    return newDispatch;
  };

  const updateDispatchStatus = (id: string, status: DispatchOrder['status']) => {
    setDispatches(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              status,
              deliveryDate: status === 'Delivered' ? new Date().toLocaleString('en-GB') : d.deliveryDate,
            }
          : d
      )
    );
  };

  const createWeighbridgeEntry = (data: Omit<WeighbridgeEntry, 'id' | 'slipNumber'>): WeighbridgeEntry => {
    const num = `WB-2026-${String(weighbridgeEntries.length + 1).padStart(4, '0')}`;
    const newWB: WeighbridgeEntry = { ...data, id: `wb-${Date.now()}`, slipNumber: num };
    setWeighbridgeEntries(prev => [newWB, ...prev]);
    addActivity(`Logged Weighment Slip #${num}`, `Vehicle: ${data.vehicleNumber} | Net Weight: ${data.netWeight.toLocaleString('en-IN')} KG`, 'Operations');
    return newWB;
  };

  // ==========================================
  // PART 4: GOYAL AI PARTNER & SYSTEM HANDLERS
  // ==========================================

  const createAIConversation = (title: string, workspace: AIWorkspaceType): AIConversation => {
    const newConv: AIConversation = {
      id: `conv-${Date.now()}`,
      title,
      workspace,
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          role: 'assistant',
          content: `Namaste Rajesh ji! Main Goyal AI Partner hoon, aapka cattle feed business companion. Hum "${workspace}" workspace mein hain. Aaj hum kya discuss ya manage karein?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          workspace,
        },
      ],
      createdAt: new Date().toLocaleString('en-GB'),
      updatedAt: new Date().toLocaleString('en-GB'),
    };
    setConversations(prev => [newConv, ...prev]);
    return newConv;
  };

  const deleteAIConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const addAIMemory = (memory: Omit<AIMemoryItem, 'id' | 'createdAt' | 'updatedAt'>): AIMemoryItem => {
    const newMem: AIMemoryItem = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB'),
      updatedAt: new Date().toLocaleDateString('en-GB'),
    };
    setMemories(prev => [newMem, ...prev]);
    addActivity(`Saved AI Business Memory`, `Category: ${memory.category} · ${memory.title}`, 'Operations');
    return newMem;
  };

  const deleteAIMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const addAITask = (task: Omit<AITaskReminder, 'id' | 'createdAt'>): AITaskReminder => {
    const newTask: AITaskReminder = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    setTasks(prev => [newTask, ...prev]);
    addActivity(`Added AI Task Reminder`, `${task.title} (Due: ${task.dueDateTime})`, 'Operations');
    return newTask;
  };

  const toggleAITask = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      )
    );
  };

  const deleteAITask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addScannedDoc = (doc: Omit<AIDocumentScan, 'id' | 'uploadDate'>): AIDocumentScan => {
    const newDoc: AIDocumentScan = {
      ...doc,
      id: `scan-${Date.now()}`,
      uploadDate: new Date().toLocaleString('en-GB'),
    };
    setScannedDocs(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const confirmScannedDoc = (id: string, asPurchaseOrExpense: 'Purchase' | 'Expense') => {
    const target = scannedDocs.find(d => d.id === id);
    if (!target) return;

    if (asPurchaseOrExpense === 'Purchase') {
      const data = target.extractedData;
      const subtotal = data.subtotal || data.grandTotal || 10000;
      const tax = data.grandTotal ? data.grandTotal - subtotal : 0;

      createPurchase({
        supplierId: 'supp-01',
        supplierFirm: data.supplierName || 'Aggarwal Grain Millers & Traders',
        supplierInvoiceNumber: data.invoiceNumber || `BILL-${Date.now()}`,
        purchaseDate: data.invoiceDate || new Date().toLocaleDateString('en-GB'),
        items: [
          {
            productId: 'prod-06',
            productName: data.commodity || 'Yellow Maize (Dry Grain Corn)',
            hsnCode: '10059000',
            quantity: data.quantity || 100,
            unit: 'Quintal',
            purchaseRate: data.rate || 2340,
            gstRate: data.gstRate || 0,
            taxableAmount: subtotal,
            gstAmount: tax,
            totalAmount: data.grandTotal || subtotal,
          },
        ],
        subtotal,
        totalTax: tax,
        freightCharges: 0,
        otherCharges: 0,
        roundOff: 0,
        grandTotal: data.grandTotal || subtotal,
        paymentStatus: 'Pending Payment',
        paidAmount: 0,
        warehouseId: 'wh-001',
        warehouseName: 'Central Grain Silos Hub',
        notes: `Auto-created from AI Document Scanner (File: ${target.fileName})`,
        createdBy: 'AI Document Scanner',
      });
    } else {
      const data = target.extractedData;
      addExpense({
        expenseDate: data.receiptDate || new Date().toLocaleDateString('en-GB'),
        category: data.category || 'Transport & Freight',
        vendor: data.vendorName || 'Vendor Payee',
        description: `Scanned receipt: ${target.fileName}`,
        amount: data.amount || 2000,
        gstAmount: 0,
        paymentMode: 'Cash',
        createdBy: 'AI Expense Scanner',
      });
    }

    setScannedDocs(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'Confirmed' } : d))
    );
  };

  const updateHardwareDeviceStatus = (id: string, status: HardwareDevice['status']) => {
    setHardwareDevices(prev =>
      prev.map(h => (h.id === id ? { ...h, status, lastActive: new Date().toLocaleString('en-GB') } : h))
    );
  };

  const exportFullDatabaseBackup = () => {
    const backupData = {
      version: '4.0.0',
      exportedAt: new Date().toISOString(),
      company: 'Goyal Cattle Feed Pvt. Ltd.',
      records: {
        invoices,
        purchases,
        customers,
        suppliers,
        ledgers,
        expenses,
        payments,
        products,
        warehouses,
        stockMovements,
        transfers,
        recipes,
        productionOrders,
        qualityInspections,
        employees,
        attendance,
        salarySlips,
        vehicles,
        drivers,
        dispatches,
        weighbridgeEntries,
        memories,
        tasks,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Goyal_Business_OS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addActivity('Generated Full System Backup', `Database exported with ${Object.values(backupData.records).flat().length} records`, 'Operations');
  };

  const restoreDatabaseFromBackup = (jsonContent: string): boolean => {
    try {
      const data = JSON.parse(jsonContent);
      if (!data.records) throw new Error('Invalid backup schema');

      if (data.records.products) setProducts(data.records.products);
      if (data.records.warehouses) setWarehouses(data.records.warehouses);
      if (data.records.invoices) setInvoices(data.records.invoices);
      if (data.records.purchases) setPurchases(data.records.purchases);
      if (data.records.customers) setCustomers(data.records.customers);
      if (data.records.suppliers) setSuppliers(data.records.suppliers);
      if (data.records.expenses) setExpenses(data.records.expenses);
      if (data.records.memories) setMemories(data.records.memories);
      if (data.records.tasks) setTasks(data.records.tasks);

      addActivity('Restored Database from Backup', `Imported backup from ${data.exportedAt || 'archive'}`, 'Operations');
      return true;
    } catch (e) {
      console.error('Backup restore failed:', e);
      return false;
    }
  };

  const enqueueOfflineItem = (item: Omit<OfflineSyncQueueItem, 'id' | 'timestamp' | 'syncStatus'>) => {
    const newItem: OfflineSyncQueueItem = {
      ...item,
      id: `sync-${Date.now()}`,
      timestamp: new Date().toISOString(),
      syncStatus: 'Pending',
    };
    setOfflineQueue(prev => [...prev, newItem]);
  };

  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    setOfflineQueue(prev =>
      prev.map(item => ({ ...item, syncStatus: 'Synced' }))
    );
    setTimeout(() => {
      setOfflineQueue([]);
    }, 2000);
    addActivity('Offline Queue Synchronized', `Successfully synced queued offline transactions`, 'Operations');
  };

  const sendAIMessage = async (prompt: string, workspace: AIWorkspaceType = activeAIWorkspace, conversationId?: string): Promise<string> => {
    const convId = conversationId || (conversations[0]?.id ?? createAIConversation('New Business Chat', workspace).id);
    const userMsgId = `msg-u-${Date.now()}`;
    const userMsg: AIMessage = {
      id: userMsgId,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      workspace,
    };

    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, messages: [...c.messages, userMsg], updatedAt: new Date().toLocaleString('en-GB') } : c))
    );

    // Call real server-side Gemini API or intelligent domain logic parser
    let aiResponseText = '';
    let parsedAction: any = null;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          workspace,
          context: {
            productsCount: products.length,
            lowStockCount: products.filter(p => p.currentStock < p.minimumStock).length,
            receivablesTotal: customers.reduce((sum, c) => sum + c.currentOutstanding, 0),
            payablesTotal: suppliers.reduce((sum, s) => sum + s.currentPayable, 0),
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.reply) aiResponseText = json.reply;
      }
    } catch {
      // server route not responding yet; proceed to rich domain parser
    }

    // Always run natural language domain parser to check for EXECUTE / REMEMBER / REMIND intents
    const intentResult = parseAIBusinessIntent(prompt, { products, warehouses, customers });

    if (intentResult.actionType === 'EXECUTE' && intentResult.subType === 'Stock In') {
      aiResponseText = intentResult.explanation;
      parsedAction = {
        id: `act-${Date.now()}`,
        type: 'EXECUTE' as const,
        label: `Stock In: ${intentResult.numberOfBags || 0} Bags ${intentResult.productName}`,
        details: `Facility: ${intentResult.warehouseName} · Total: ${intentResult.totalWeightKg?.toLocaleString('en-IN') || 0} KG`,
        payload: {
          productId: intentResult.productId,
          productName: intentResult.productName,
          warehouseId: intentResult.warehouseId,
          warehouseName: intentResult.warehouseName,
          quantity: intentResult.totalWeightKg || (intentResult.numberOfBags || 0) * (intentResult.bagWeightKg || 50),
          numberOfBags: intentResult.numberOfBags,
          bagWeightKg: intentResult.bagWeightKg,
          type: 'Purchase',
        },
        status: 'Pending' as const,
      };
    } else if (intentResult.actionType === 'REMEMBER') {
      aiResponseText = intentResult.explanation;
      parsedAction = {
        id: `act-${Date.now()}`,
        type: 'REMEMBER' as const,
        label: `Save Memory: ${intentResult.memoryCategory}`,
        details: intentResult.content,
        payload: {
          title: `Memory: ${intentResult.memoryCategory}`,
          category: intentResult.memoryCategory || 'Operational Rule',
          content: intentResult.content,
          tags: ['AI Partner', intentResult.memoryCategory || 'Rule'],
        },
        status: 'Pending' as const,
      };
    } else if (intentResult.actionType === 'REMIND') {
      aiResponseText = intentResult.explanation;
      parsedAction = {
        id: `act-${Date.now()}`,
        type: 'REMIND' as const,
        label: `Schedule Reminder: ${intentResult.taskTitle?.slice(0, 30)}...`,
        details: intentResult.content,
        payload: {
          title: intentResult.taskTitle || 'Business Follow Up',
          description: intentResult.content,
          dueDateTime: intentResult.dueDateTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('en-GB'),
          priority: 'Medium',
        },
        status: 'Pending' as const,
      };
    } else if (!aiResponseText) {
      // Natural language business analysis response
      const lower = prompt.toLowerCase();
      if (lower.includes('top customer') || lower.includes('highest outstanding') || lower.includes('receivable')) {
        const sorted = [...customers].sort((a, b) => b.currentOutstanding - a.currentOutstanding).slice(0, 3);
        aiResponseText = `Aapke top outstanding receivables wale customers:\n` +
          sorted.map((c, i) => `${i + 1}. ${c.firmName} — Outstanding: ₹${c.currentOutstanding.toLocaleString('en-IN')}`).join('\n') +
          `\n\nTotal Receivables: ₹${customers.reduce((sum, c) => sum + c.currentOutstanding, 0).toLocaleString('en-IN')}. Inke liye payment reminder generate karein?`;
      } else if (lower.includes('low stock') || lower.includes('kam stock') || lower.includes('shortage')) {
        const lows = products.filter(p => p.currentStock < p.minimumStock);
        aiResponseText = `Factory mein ${lows.length} items safety buffer se neeche hain:\n` +
          lows.map(p => `• ${p.name}: Available ${p.currentStock} ${p.unit} (Buffer: ${p.minimumStock})`).join('\n') +
          `\n\nPurchase Requisition PO create karein?`;
      } else {
        aiResponseText = `Samajh gaya! Maine "${prompt}" analyze kiya hai. Goyal Cattle Feed operations standard status normal hai. Kya aap is par koi decision, task reminder, ya operational entry proceed karna chahte hain?`;
      }
    }

    const aiMsg: AIMessage = {
      id: `msg-a-${Date.now()}`,
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      workspace,
      actions: parsedAction ? [parsedAction] : undefined,
    };

    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date().toLocaleString('en-GB') } : c))
    );

    return aiResponseText;
  };

  const confirmAIAction = (conversationId: string, messageId: string, actionId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;
    const msg = conv.messages.find(m => m.id === messageId);
    if (!msg || !msg.actions) return;
    const action = msg.actions.find(a => a.id === actionId);
    if (!action || action.status !== 'Pending') return;

    let transactionRef = '';

    if (action.type === 'EXECUTE') {
      const payload = action.payload;
      const refNum = `STK-IN-2026-${String(Date.now()).slice(-4)}`;
      transactionRef = refNum;

      // Update product inventory exactly once
      if (payload.productId) {
        setProducts(prev =>
          prev.map(p => {
            if (p.id === payload.productId || p.name.includes(payload.productName)) {
              return {
                ...p,
                currentStock: p.currentStock + (payload.numberOfBags || payload.quantity),
                status: 'In Stock',
                updatedAt: new Date().toLocaleString('en-GB'),
              };
            }
            return p;
          })
        );
      }

      // Record in Stock Movement Ledger
      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        transactionId: refNum,
        productId: payload.productId || 'prod-custom',
        productName: payload.productName || 'Vinole ki Khal',
        sku: 'STK-IN',
        date: new Date().toLocaleString('en-GB'),
        type: 'Purchase',
        referenceNumber: refNum,
        sourceLocation: 'Supplier Truck Unloading',
        destinationLocation: payload.warehouseName || 'Plant 1 Main Godown',
        quantityIn: payload.quantity,
        quantityOut: 0,
        balance: payload.quantity,
        unit: 'KG',
        createdBy: 'Goyal AI Partner (Owner Confirmed)',
        notes: `Executed via AI Partner: ${action.details}`,
      };
      setStockMovements(prev => [newMovement, ...prev]);

      // Record immutable audit log
      const auditItem: AIActionAuditLog = {
        id: `aud-${Date.now()}`,
        actionType: 'Stock In',
        performedBy: 'Rajesh Goyal (via Goyal AI Partner)',
        details: `Added ${payload.numberOfBags || payload.quantity} units of ${payload.productName} into ${payload.warehouseName}`,
        recordId: refNum,
        status: 'Success',
        timestamp: new Date().toLocaleString('en-GB'),
      };
      setAiAuditLogs(prev => [auditItem, ...prev]);
      addActivity(`AI Partner Executed: Stock In`, `Added stock #${refNum} for ${payload.productName}`, 'Inventory');
    } else if (action.type === 'REMEMBER') {
      const mem = addAIMemory(action.payload);
      transactionRef = mem.id;
      const auditItem: AIActionAuditLog = {
        id: `aud-${Date.now()}`,
        actionType: 'Remember Memory',
        performedBy: 'Rajesh Goyal (via Goyal AI Partner)',
        details: `Saved memory: ${action.payload.title}`,
        recordId: mem.id,
        status: 'Success',
        timestamp: new Date().toLocaleString('en-GB'),
      };
      setAiAuditLogs(prev => [auditItem, ...prev]);
    } else if (action.type === 'REMIND') {
      const task = addAITask(action.payload);
      transactionRef = task.id;
      const auditItem: AIActionAuditLog = {
        id: `aud-${Date.now()}`,
        actionType: 'Schedule Reminder',
        performedBy: 'Rajesh Goyal (via Goyal AI Partner)',
        details: `Created task reminder: ${action.payload.title}`,
        recordId: task.id,
        status: 'Success',
        timestamp: new Date().toLocaleString('en-GB'),
      };
      setAiAuditLogs(prev => [auditItem, ...prev]);
    }

    // Mark action as Executed
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id !== messageId || !m.actions) return m;
            return {
              ...m,
              actions: m.actions.map(a =>
                a.id === actionId
                  ? { ...a, status: 'Executed', transactionRef }
                  : a
              ),
            };
          }),
        };
      })
    );
  };

  const cancelAIAction = (conversationId: string, messageId: string, actionId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id !== messageId || !m.actions) return m;
            return {
              ...m,
              actions: m.actions.map(a =>
                a.id === actionId ? { ...a, status: 'Cancelled' } : a
              ),
            };
          }),
        };
      })
    );
  };

  return (
    <EnterpriseContext.Provider
      value={{
        invoices,
        purchases,
        customers,
        suppliers,
        ledgers,
        expenses,
        payments,
        products,
        warehouses,
        stockMovements,
        transfers,
        recipes,
        productionOrders,
        qualityInspections,
        employees,
        attendance,
        salarySlips,
        vehicles,
        drivers,
        dispatches,
        weighbridgeEntries,
        conversations,
        memories,
        tasks,
        aiAuditLogs,
        hardwareDevices,
        cloudFiles,
        scannedDocs,
        offlineQueue,
        activeAIWorkspace,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        setActiveAIWorkspace,
        sendAIMessage,
        confirmAIAction,
        cancelAIAction,
        createAIConversation,
        deleteAIConversation,
        addAIMemory,
        deleteAIMemory,
        addAITask,
        toggleAITask,
        deleteAITask,
        addScannedDoc,
        confirmScannedDoc,
        updateHardwareDeviceStatus,
        exportFullDatabaseBackup,
        restoreDatabaseFromBackup,
        enqueueOfflineItem,
        syncOfflineQueue,
        createSalesInvoice,
        updateInvoiceStatus,
        deleteSalesInvoice,
        duplicateInvoice,
        createPurchase,
        updatePurchaseStatus,
        deletePurchase,
        addCustomer,
        updateCustomer,
        addSupplier,
        updateSupplier,
        addExpense,
        deleteExpense,
        recordPayment,
        addProduct,
        updateProduct,
        adjustStock,
        addWarehouse,
        createStockTransfer,
        updateStockTransferStatus,
        createRecipe,
        updateRecipe,
        createProductionOrder,
        confirmProductionOrder,
        createQualityInspection,
        addEmployee,
        updateEmployee,
        markAttendance,
        bulkMarkAttendance,
        generateSalarySlip,
        markSalaryPaid,
        addVehicle,
        addDriver,
        createDispatch,
        updateDispatchStatus,
        createWeighbridgeEntry,
        previewInvoice,
        setPreviewInvoice,
        previewPurchase,
        setPreviewPurchase,
        selectedCustomerProfile,
        setSelectedCustomerProfile,
        selectedSupplierProfile,
        setSelectedSupplierProfile,
        isCreateInvoiceOpen,
        setIsCreateInvoiceOpen,
        isCreatePurchaseOpen,
        setIsCreatePurchaseOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        isAddCustomerOpen,
        setIsAddCustomerOpen,
        isAddSupplierOpen,
        setIsAddSupplierOpen,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
      }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
};

export const useEnterprise = () => {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error('useEnterprise must be used within an EnterpriseProvider');
  }
  return context;
};
