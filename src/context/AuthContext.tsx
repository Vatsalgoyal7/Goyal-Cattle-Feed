import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  db,
  onAuthChange,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignInWithGoogle,
  firebaseSignOut,
  firebaseResetPassword,
  firebaseUpdateProfile,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  COLLECTIONS,
  FirebaseUser,
} from '../lib/firebase';

export type UserRole =
  | 'super_admin'
  | 'owner'
  | 'manager'
  | 'accountant'
  | 'stock_manager'
  | 'sales_executive'
  | 'hr_manager';

export type ApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  photoURL?: string;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  lastLogin: string;
  branchAccess: string[];
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  gstNo: string;
  panNo: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  logoURL: string;
  primaryColor: string;
  currency: string;
  financialYear: string;
  branches: { id: string; name: string; address: string; phone: string }[];
  bankDetails: { bankName: string; accountNo: string; ifsc: string; branch: string };
}

export interface AuthContextType {
  // Auth state
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string, extra?: Record<string, any>) => Promise<void>;
  registerWithGoogle: (role: UserRole, phone?: string, extra?: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;

  // Company profile
  companyProfile: CompanyProfile | null;
  updateCompanyProfile: (data: Partial<CompanyProfile>) => Promise<void>;

  // User management (super admin)
  allUsers: AppUser[];
  pendingUsers: AppUser[];
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  approveUser: (uid: string, assignedRole?: UserRole) => Promise<void>;
  rejectUser: (uid: string, reason?: string) => Promise<void>;
  deactivateUser: (uid: string) => Promise<void>;
  reactivateUser: (uid: string) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
}

export const DEFAULT_COMPANY: CompanyProfile = {
  name: 'Goyal Cattle Feed Store',
  tagline: 'खल, चूरी, दाना एवं पशु आहार के थोक व फुटकर विक्रेता',
  gstNo: '09AAACC1206D1Z6',
  panNo: 'AAACC1206D',
  phone: '+91 98370 49021',
  email: 'goyalcattlefeed@gmail.com',
  address: 'Kavi Nagar, near Indra Chowk, Shuklapuri ke samne',
  city: 'Gajraula',
  state: 'Uttar Pradesh',
  pincode: '244235',
  website: 'https://goyalbusiness.in',
  logoURL: '',
  primaryColor: '#065f46',
  currency: 'INR',
  financialYear: '2024-25',
  branches: [
    { id: 'main', name: 'Main Shop & Attached Godown', address: 'Kavi Nagar, Gajraula', phone: '+91 98370 49021' },
  ],
  bankDetails: { bankName: 'State Bank of India', accountNo: '30495839201', ifsc: 'SBIN0001234', branch: 'Gajraula' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(DEFAULT_COMPANY);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);

  // ── Helper to load or create AppUser ─────────────────────
  const loadOrCreateAppUser = async (fbUser: FirebaseUser): Promise<AppUser> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, fbUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as AppUser;
        setAppUser(data);
        // Async update last login
        updateDoc(userRef, { lastLogin: new Date().toISOString() }).catch(() => {});
        return data;
      } else {
        const isOwner = (fbUser.email || '').toLowerCase() === 'vatsalgoyal71@gmail.com';
        const newUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Vatsal Goyal',
          role: isOwner ? 'owner' : 'manager',
          photoURL: fbUser.photoURL || undefined,
          isActive: isOwner,
          approvalStatus: isOwner ? 'approved' : 'pending',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          branchAccess: ['all'],
        };
        await setDoc(userRef, newUser).catch((e) => {
          console.warn('Firestore setDoc notice:', e);
        });
        setAppUser(newUser);
        return newUser;
      }
    } catch (err) {
      console.warn('Firestore fallback user profile used:', err);
      const isOwner = (fbUser.email || '').toLowerCase() === 'vatsalgoyal71@gmail.com';
      const fallbackUser: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Vatsal Goyal',
        role: isOwner ? 'owner' : 'manager',
        photoURL: fbUser.photoURL || undefined,
        isActive: isOwner,
        approvalStatus: isOwner ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        branchAccess: ['all'],
      };
      setAppUser(fallbackUser);
      return fallbackUser;
    }
  };

  // ── Load company profile ──────────────────────────────────
  const loadCompanyProfile = async () => {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.COMPANY, 'profile'));
      if (snap.exists()) {
        setCompanyProfile(snap.data() as CompanyProfile);
      } else {
        await setDoc(doc(db, COLLECTIONS.COMPANY, 'profile'), DEFAULT_COMPANY).catch(() => {});
        setCompanyProfile(DEFAULT_COMPANY);
      }
    } catch (err) {
      console.warn('Company profile using default:', err);
      setCompanyProfile(DEFAULT_COMPANY);
    }
  };

  // ── Listen to auth state with instant UI response ──────────
  useEffect(() => {
    // Safety fallback: Never keep user waiting on spinner longer than 1000ms
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const unsubscribe = onAuthChange(auth, async (fbUser) => {
      clearTimeout(safetyTimer);
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fast local fallback immediately so user never waits
        const isOwner = (fbUser.email || '').toLowerCase() === 'vatsalgoyal71@gmail.com';
        const cachedUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email || 'vatsalgoyal71@gmail.com',
          displayName: fbUser.displayName || 'Vatsal Goyal',
          role: isOwner ? 'owner' : 'manager',
          photoURL: fbUser.photoURL || undefined,
          isActive: isOwner,
          approvalStatus: isOwner ? 'approved' : 'pending',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          branchAccess: ['all'],
        };
        setAppUser(prev => prev || cachedUser);
        setIsLoading(false);

        // Background load/sync without blocking UI
        loadOrCreateAppUser(fbUser).catch((e) => console.warn('Background user sync notice:', e));
        loadCompanyProfile().catch((e) => console.warn('Background company sync notice:', e));
      } else {
        setAppUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // ── Load all users (super admin only) ────────────────────
  useEffect(() => {
    if (appUser?.role !== 'super_admin' && appUser?.role !== 'owner') return;
    try {
      const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(d => d.data() as AppUser);
        setAllUsers(users);
      }, (err) => {
        console.warn('Users snapshot notice:', err);
      });
      return unsub;
    } catch (e) {
      console.warn('Users query notice:', e);
    }
  }, [appUser?.role]);

  // ── Email Login ───────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const { user } = await firebaseSignIn(email, password);
      await loadOrCreateAppUser(user);
      await loadCompanyProfile();
    } catch (err: any) {
      console.error('Firebase Login error:', err);
      const msg = getFirebaseErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // ── Google Login ──────────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const { user } = await firebaseSignInWithGoogle();
      await loadOrCreateAppUser(user);
      await loadCompanyProfile();
    } catch (err: any) {
      console.error('Firebase Google Login error:', err);
      const msg = getFirebaseErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // ── Register ──────────────────────────────────────────────
  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string,
    extra?: Record<string, any>
  ) => {
    setAuthError(null);
    try {
      const { user } = await firebaseSignUp(email, password);
      await firebaseUpdateProfile(user, { displayName: name }).catch(() => {});

      const isSuperAdminEmail = email.toLowerCase() === 'vatsalgoyal71@gmail.com';
      const isOwnerRole = role === 'owner' || role === 'super_admin';
      const isAutoApproved = isSuperAdminEmail || isOwnerRole;

      const newAppUser: AppUser = {
        uid: user.uid,
        email,
        displayName: name,
        role: isSuperAdminEmail ? 'owner' : role,
        phone: phone || '',
        isActive: isAutoApproved,
        approvalStatus: isAutoApproved ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        branchAccess: ['all'],
        ...extra,
      };

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), newAppUser, { merge: true }).catch(() => {});
      setAppUser(newAppUser);
    } catch (err: any) {
      console.error('Firebase Register error:', err);
      const msg = getFirebaseErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // ── Register With Google (3-Step Completion) ───────────────
  const registerWithGoogle = async (role: UserRole, phone?: string, extra?: Record<string, any>) => {
    setAuthError(null);
    try {
      const { user } = await firebaseSignInWithGoogle();
      const isSuperAdminEmail = user.email?.toLowerCase() === 'vatsalgoyal71@gmail.com';
      const isOwnerRole = role === 'owner' || role === 'super_admin';
      const isAutoApproved = isSuperAdminEmail || isOwnerRole;

      const newAppUser: AppUser = {
        uid: user.uid,
        email: user.email || '',
        displayName: extra?.displayName || user.displayName || 'Goyal Associate',
        role: isSuperAdminEmail ? 'owner' : role,
        phone: phone || '',
        photoURL: user.photoURL || undefined,
        isActive: isAutoApproved,
        approvalStatus: isAutoApproved ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        branchAccess: ['all'],
        ...extra,
      };

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), newAppUser, { merge: true }).catch(() => {});
      setAppUser(newAppUser);
      await loadCompanyProfile();
    } catch (err: any) {
      console.error('Firebase Google Register error:', err);
      const msg = getFirebaseErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = async () => {
    await firebaseSignOut();
    setAppUser(null);
    setCompanyProfile(DEFAULT_COMPANY);
  };

  // ── Reset Password ────────────────────────────────────────
  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await firebaseResetPassword(email);
    } catch (err: any) {
      console.error('Firebase Reset Password error:', err);
      const msg = getFirebaseErrorMessage(err.code, err.message);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  // ── Update Company Profile ────────────────────────────────
  const updateCompanyProfile = async (data: Partial<CompanyProfile>) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.COMPANY, 'profile'), data);
      setCompanyProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('updateCompanyProfile error:', err);
      // update state optimistically
      setCompanyProfile(prev => prev ? { ...prev, ...data } : null);
    }
  };

  // ── User Management & Approvals (Super Admin) ──────────────
  const updateUserRole = async (uid: string, role: UserRole) => {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), { role });
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
  };

  const approveUser = async (uid: string, assignedRole?: UserRole) => {
    const updateData: any = { approvalStatus: 'approved', isActive: true };
    if (assignedRole) updateData.role = assignedRole;
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), updateData).catch(() => {});
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...updateData } : u));
  };

  const rejectUser = async (uid: string, reason = 'Application declined by SuperAdmin') => {
    const updateData = { approvalStatus: 'rejected', isActive: false, rejectionReason: reason };
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), updateData).catch(() => {});
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...updateData } : u));
  };

  const deactivateUser = async (uid: string) => {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), { isActive: false }).catch(() => {});
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, isActive: false } : u));
  };

  const reactivateUser = async (uid: string) => {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), { isActive: true }).catch(() => {});
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, isActive: true } : u));
  };

  const deleteUser = async (uid: string) => {
    await deleteDoc(doc(db, COLLECTIONS.USERS, uid)).catch(() => {});
    setAllUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const clearError = () => setAuthError(null);

  const pendingUsers = allUsers.filter(u => u.approvalStatus === 'pending');

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      appUser,
      isLoading,
      isAuthenticated: !!firebaseUser && !!appUser,
      authError,
      login,
      loginWithGoogle,
      register,
      registerWithGoogle,
      logout,
      resetPassword,
      clearError,
      companyProfile,
      updateCompanyProfile,
      allUsers,
      pendingUsers,
      updateUserRole,
      approveUser,
      rejectUser,
      deactivateUser,
      reactivateUser,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// ── Multilingual Firebase Error Messages (English / Hindi / Hinglish) ──
function getFirebaseErrorMessage(code: string, rawMessage?: string): string {
  const lang = (localStorage.getItem('goyal_lang') as 'en' | 'hi' | 'hinglish') || 'en';

  const errors: Record<'en' | 'hi' | 'hinglish', Record<string, string>> = {
    en: {
      'auth/unauthorized-domain':
        'Domain not authorized in Firebase. Please open http://localhost:3001/app instead of 192.168.x.x, or add 192.168.1.18 in Firebase Console > Authentication > Settings > Authorized Domains.',
      'auth/user-not-found': 'No registered account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/email-already-in-use': 'This email is already registered. Please sign in.',
      'auth/weak-password': 'Password must be at least 6 characters long.',
      'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
      'auth/network-request-failed': 'Network connection failed. Please check your internet connection.',
      'auth/invalid-credential': 'Invalid credentials. Please verify your email and password.',
      'auth/popup-closed-by-user': 'Google sign-in popup was closed before completing.',
      'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
      'auth/missing-password': 'Please enter a password before submitting.',
      'auth/user-disabled': 'This account has been disabled by administrator.',
    },
    hi: {
      'auth/unauthorized-domain':
        'यह डोमेन Firebase में अधिकृत नहीं है। कृपया 192.168.x.x के स्थान पर http://localhost:3001/app खोलें, अथवा Firebase Console में आईपी जोड़ें।',
      'auth/user-not-found': 'इस ईमेल से कोई खाता पंजीकृत नहीं है।',
      'auth/wrong-password': 'पासवर्ड गलत है। कृपया पुनः प्रयास करें।',
      'auth/invalid-email': 'अमान्य ईमेल पता।',
      'auth/email-already-in-use': 'यह ईमेल पहले से पंजीकृत है। कृपया लॉग इन करें।',
      'auth/weak-password': 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      'auth/too-many-requests': 'अत्यधिक प्रयास। कृपया कुछ समय पश्चात पुनः प्रयास करें।',
      'auth/network-request-failed': 'नेटवर्क त्रुटि। अपना इंटरनेट कनेक्शन जांचें।',
      'auth/invalid-credential': 'अमान्य ईमेल अथवा पासवर्ड।',
      'auth/popup-closed-by-user': 'गूगल लॉगिन विंडो समय से पूर्व बंद कर दी गई।',
      'auth/popup-blocked': 'ब्राउज़र ने पॉपअप ब्लॉक कर दिया। कृपया पॉपअप की अनुमति दें।',
      'auth/missing-password': 'कृपया पासवर्ड दर्ज करें।',
      'auth/user-disabled': 'यह खाता व्यवस्थापक द्वारा निष्क्रिय कर दिया गया है।',
    },
    hinglish: {
      'auth/unauthorized-domain':
        'Yeh domain Firebase mein authorized nahi hai. Kripya 192.168.x.x ke badle http://localhost:3001/app kholein, ya Firebase Console > Settings mein IP add karein.',
      'auth/user-not-found': 'Yeh email registered nahi hai.',
      'auth/wrong-password': 'Password galat hai. Dobara try karein.',
      'auth/invalid-email': 'Email address valid nahi hai.',
      'auth/email-already-in-use': 'Yeh email pehle se registered hai. Login karein.',
      'auth/weak-password': 'Password kam se kam 6 characters ka hona chahiye.',
      'auth/too-many-requests': 'Bahut zyada attempts. Thodi der baad try karein.',
      'auth/network-request-failed': 'Network error. Internet connection check karein.',
      'auth/invalid-credential': 'Email ya password galat hai.',
      'auth/popup-closed-by-user': 'Google login window close ho gayi.',
      'auth/popup-blocked': 'Browser ne popup block kar diya. Kripya popups allow karein.',
      'auth/missing-password': 'Kripya password daalein.',
      'auth/user-disabled': 'Account deactivate kar diya gaya hai. Admin se sampark karein.',
    },
  };

  const currentDict = errors[lang] || errors.en;
  if (code && currentDict[code]) {
    return currentDict[code];
  }

  if (rawMessage && !rawMessage.includes('auth/')) {
    return rawMessage;
  }

  if (lang === 'en') {
    return 'Authentication error occurred. Please try again.';
  } else if (lang === 'hi') {
    return 'प्रमाणीकरण में त्रुटि आई। कृपया पुनः प्रयास करें।';
  } else {
    return 'Kuch gadbad ho gayi. Dobara try karein.';
  }
}
