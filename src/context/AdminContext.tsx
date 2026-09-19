import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);
let globalSetShowAdminPanel: ((show: boolean) => void) | null = null;

export function openAdminPanel() {
  globalSetShowAdminPanel?.(true);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    globalSetShowAdminPanel = setShowAdminPanel;
    return () => { globalSetShowAdminPanel = null; };
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    void setPersistence(auth, browserSessionPersistence).then(() => {
      unsubscribe = onAuthStateChanged(auth, (user) => setIsAdmin(Boolean(user)));
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setShowAdminPanel(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, showAdminPanel, setShowAdminPanel }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
}
