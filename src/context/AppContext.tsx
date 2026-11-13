import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  AppTheme,
  AccentColor,
  FontSize,
  AppLanguage,
  DisplayMode,
  ConnectionStatus,
  DateRange,
  BranchLocation,
  UserProfile,
  CompanyProfile,
  NotificationItem,
  ProductItem,
  CustomerItem,
  TransactionItem,
  PendingPaymentItem,
  WarehouseSummaryItem,
  ActivityLogItem,
  QuickActionType,
} from '../types';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_USER_PROFILE,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_PRODUCTS,
  SAMPLE_CUSTOMERS,
  SAMPLE_TRANSACTIONS,
  SAMPLE_PENDING_PAYMENTS,
  SAMPLE_WAREHOUSES,
  SAMPLE_ACTIVITIES,
} from '../data/sampleData';
import { translations, TranslationDictionary } from '../i18n/translations';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Roles & User
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  companyProfile: CompanyProfile;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;

  // Preferences & Appearance
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;

  // Top Bar Filters
  selectedBranch: BranchLocation;
  setSelectedBranch: (branch: BranchLocation) => void;
  selectedDateRange: DateRange;
  setSelectedDateRange: (range: DateRange) => void;

  // Offline & Connectivity
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  triggerManualSync: () => void;

  // Modals & Drawers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  activeQuickAction: QuickActionType | null;
  setActiveQuickAction: (action: QuickActionType | null) => void;

  // Data Collections
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;

  products: ProductItem[];
  customers: CustomerItem[];
  transactions: TransactionItem[];
  pendingPayments: PendingPaymentItem[];
  warehouses: WarehouseSummaryItem[];
  activities: ActivityLogItem[];

  // Mutations
  addTransaction: (item: Omit<TransactionItem, 'id'>) => void;
  addProduct: (item: Omit<ProductItem, 'id'>) => void;
  addCustomer: (item: Omit<CustomerItem, 'id'>) => void;
  resetToStoreDefaults: () => void;
  addActivity: (action: string, details: string, category: ActivityLogItem['category']) => void;

  // I18n helper
  t: TranslationDictionary;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted settings or fallback
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('goyal_role') as UserRole) || 'Owner / Super Admin';
  });

  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('goyal_theme') as AppTheme) || 'light';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('goyal_accent') as AccentColor) || 'emerald';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('goyal_font_size') as FontSize) || 'normal';
  });

  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('goyal_lang') as AppLanguage) || 'en';
  });

  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    return (localStorage.getItem('goyal_display_mode') as DisplayMode) || 'advanced';
  });

  const [selectedBranch, setSelectedBranch] = useState<BranchLocation>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>('today');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<QuickActionType | null>(null);

  // Auth integration
  const { appUser } = useAuth();

  // Entities state with persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('goyal_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('goyal_company_profile');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('goyal_products');
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });

  const [customers, setCustomers] = useState<CustomerItem[]>(() => {
    try {
      const saved = localStorage.getItem('goyal_app_customers') || localStorage.getItem('goyal_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => ({
            id: c.id || `cst-${Math.random()}`,
            name: c.name || 'Local Customer',
            firmName: c.firmName || c.name || 'Retail Dairy Customer',
            city: c.city || 'Gajraula',
            state: c.state || 'Uttar Pradesh',
            phone: c.phone || '+91 98370 49021',
            creditLimit: Number(c.creditLimit) || 100000,
            totalPurchases: Number(c.totalPurchases ?? c.totalSales ?? 0),
            outstandingAmount: Number(c.outstandingAmount ?? c.currentOutstanding ?? 0),
            paymentStatus: c.paymentStatus || 'Good',
            lastPurchaseDate: c.lastPurchaseDate || '12/11/2026',
          }));
        }
      }
    } catch (e) {
      console.warn('Customer parse notice:', e);
    }
    return SAMPLE_CUSTOMERS;
  });

  const [transactions, setTransactions] = useState<TransactionItem[]>(() => {
    const saved = localStorage.getItem('goyal_transactions');
    return saved ? JSON.parse(saved) : SAMPLE_TRANSACTIONS;
  });

  const [pendingPayments, setPendingPayments] = useState<PendingPaymentItem[]>(() => {
    const saved = localStorage.getItem('goyal_pending_payments');
    return saved ? JSON.parse(saved) : SAMPLE_PENDING_PAYMENTS;
  });

  const [warehouses, setWarehouses] = useState<WarehouseSummaryItem[]>(SAMPLE_WAREHOUSES);
  const [activities, setActivities] = useState<ActivityLogItem[]>(SAMPLE_ACTIVITIES);

  // Sync with Firebase Auth user whenever login changes
  useEffect(() => {
    if (appUser) {
      setUserProfile(prev => {
        const updated: UserProfile = {
          ...prev,
          fullName: appUser.displayName || prev.fullName || 'Vatsal Goyal',
          email: appUser.email || prev.email || 'vatsalgoyal71@gmail.com',
          phone: appUser.phone || prev.phone || '+91 7310698091',
          role: (appUser.role as UserRole) || prev.role || 'Owner / Super Admin',
          avatarUrl: appUser.photoURL || prev.avatarUrl || '/images/goyal_shop_real.png',
        };
        localStorage.setItem('goyal_user_profile', JSON.stringify(updated));
        return updated;
      });
      if (appUser.role) {
        setActiveRole(appUser.role as UserRole);
        localStorage.setItem('goyal_role', appUser.role);
      }
    }
  }, [appUser]);

  // Theme application to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-comfort');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'comfort') {
      root.classList.add('theme-comfort');
    }
    localStorage.setItem('goyal_theme', theme);
  }, [theme]);

  // Font size application
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '16px';
    }
    localStorage.setItem('goyal_font_size', fontSize);
  }, [fontSize]);

  // Browser online/offline event listener
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setConnectionStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global keyboard shortcuts (Ctrl+K for search, Alt+C for calculator)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsCalculatorOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
  };

  const setLanguage = (l: AppLanguage) => {
    setLanguageState(l);
    localStorage.setItem('goyal_lang', l);
  };

  const setDisplayMode = (m: DisplayMode) => {
    setDisplayModeState(m);
    localStorage.setItem('goyal_display_mode', m);
  };

  const triggerManualSync = () => {
    setConnectionStatus('syncing');
    setTimeout(() => {
      setConnectionStatus('online');
    }, 1500);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompanyProfile(prev => ({ ...prev, ...profile }));
  };

  const addTransaction = (item: Omit<TransactionItem, 'id'>) => {
    const newTxn: TransactionItem = {
      ...item,
      id: `txn-${Date.now()}`,
    };
    setTransactions(prev => {
      const updated = [newTxn, ...prev];
      localStorage.setItem('goyal_transactions', JSON.stringify(updated));
      return updated;
    });
  };

  const addProduct = (item: Omit<ProductItem, 'id'>) => {
    const newProd: ProductItem = {
      ...item,
      id: `prd-${Date.now()}`,
    };
    setProducts(prev => {
      const updated = [newProd, ...prev];
      localStorage.setItem('goyal_products', JSON.stringify(updated));
      return updated;
    });
  };

  const addCustomer = (item: Omit<CustomerItem, 'id'>) => {
    const newCust: CustomerItem = {
      ...item,
      id: `cst-${Date.now()}`,
    };
    setCustomers(prev => {
      const updated = [newCust, ...prev];
      localStorage.setItem('goyal_app_customers', JSON.stringify(updated));
      return updated;
    });
  };

  const resetToStoreDefaults = () => {
    localStorage.removeItem('goyal_products');
    localStorage.removeItem('goyal_app_customers');
    localStorage.removeItem('goyal_customers');
    localStorage.removeItem('goyal_transactions');
    localStorage.removeItem('goyal_pending_payments');
    setProducts(SAMPLE_PRODUCTS);
    setCustomers(SAMPLE_CUSTOMERS);
    setTransactions(SAMPLE_TRANSACTIONS);
    setPendingPayments(SAMPLE_PENDING_PAYMENTS);
  };

  const addActivity = (action: string, details: string, category: ActivityLogItem['category']) => {
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      user: `${userProfile.fullName} (${activeRole.split('/')[0].trim()})`,
      action,
      details,
      timestamp: 'Just now',
      category,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole: (role) => {
          setActiveRole(role);
          localStorage.setItem('goyal_role', role);
        },
        userProfile,
        updateUserProfile,
        companyProfile,
        updateCompanyProfile,
        theme,
        setTheme,
        accentColor,
        setAccentColor: (a) => {
          setAccentColor(a);
          localStorage.setItem('goyal_accent', a);
        },
        fontSize,
        setFontSize,
        language,
        setLanguage,
        displayMode,
        setDisplayMode,
        selectedBranch,
        setSelectedBranch,
        selectedDateRange,
        setSelectedDateRange,
        connectionStatus,
        setConnectionStatus,
        triggerManualSync,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        activeQuickAction,
        setActiveQuickAction,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        products,
        customers,
        transactions,
        pendingPayments,
        warehouses,
        activities,
        addTransaction,
        addProduct,
        addCustomer,
        resetToStoreDefaults,
        addActivity,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
