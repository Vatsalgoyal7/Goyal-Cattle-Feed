// ============================================================
// Firebase Configuration & Initialization
// Goyal Business OS – Real Authentication & Database
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ── Firebase Config ──────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'AIzaSyDLkxKQY4PbYfPcG0z0iSDqTWV4K0N8XPc',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'goyal-cattle-feed.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'goyal-cattle-feed',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'goyal-cattle-feed.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '201547522740',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:201547522740:web:4f80a8d1da4653aa836de1',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || 'G-S1DZRXP688',
};

// Prevent duplicate Firebase initialization during HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// ── Google Auth Provider ──────────────────────────────────────
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Type Exports ─────────────────────────────────────────────
export type { FirebaseUser };

// ── Auth Helpers ─────────────────────────────────────────────
export const firebaseSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseSignInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const firebaseSignOut = () => signOut(auth);

export const firebaseResetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const firebaseUpdateProfile = (user: FirebaseUser, data: { displayName?: string; photoURL?: string }) =>
  updateProfile(user, data);

export const onAuthChange = onAuthStateChanged;

// ── Firestore Helpers ─────────────────────────────────────────
export {
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, getDocs, deleteDoc,
  query, where, orderBy, onSnapshot,
  Timestamp, serverTimestamp,
};

// ── Storage Helpers ───────────────────────────────────────────
export { ref as storageRef, uploadBytes, getDownloadURL, deleteObject };

// ── Firestore Collection Paths ────────────────────────────────
export const COLLECTIONS = {
  USERS:          'users',
  COMPANY:        'company',
  PRODUCTS:       'products',
  CUSTOMERS:      'customers',
  SUPPLIERS:      'suppliers',
  TRANSACTIONS:   'transactions',
  PURCHASES:      'purchases',
  EXPENSES:       'expenses',
  EMPLOYEES:      'employees',
  WAREHOUSES:     'warehouses',
  STOCK:          'stock',
  TRANSPORT:      'transport',
  MANUFACTURING:  'manufacturing',
  NOTIFICATIONS:  'notifications',
  ACTIVITIES:     'activities',
  CHAT_MESSAGES:  'chat_messages',
  FILES:          'files',
  REMINDERS:      'reminders',
  SETTINGS:       'settings',
} as const;

export default app;
