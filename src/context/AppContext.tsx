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

  // Mutations (demo)
  addTransaction: (item: Omit<TransactionItem, 'id'>) => void;
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

  // Entities state
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(INITIAL_COMPANY_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [products] = useState<ProductItem[]>(SAMPLE_PRODUCTS);
  const [customers] = useState<CustomerItem[]>(SAMPLE_CUSTOMERS);
  const [transactions, setTransactions] = useState<TransactionItem[]>(SAMPLE_TRANSACTIONS);
  const [pendingPayments] = useState<PendingPaymentItem[]>(SAMPLE_PENDING_PAYMENTS);
  const [warehouses] = useState<WarehouseSummaryItem[]>(SAMPLE_WAREHOUSES);
  const [activities, setActivities] = useState<ActivityLogItem[]>(SAMPLE_ACTIVITIES);

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
    setTransactions(prev => [newTxn, ...prev]);
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
