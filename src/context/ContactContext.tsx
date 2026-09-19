import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
  businessName: string;
}

interface ContactContextType {
  contactInfo: ContactInfo;
  updateContactInfo: (info: Partial<ContactInfo>) => Promise<void>;
}

const defaultContactInfo: ContactInfo = {
  email: 'support@luxefinds.com',
  phone: '+1 (555) 123-4567',
  address: '123 Premium Street, Luxury District, NY 10001',
  instagram: 'https://instagram.com/luxefinds',
  twitter: 'https://twitter.com/luxefinds',
  facebook: 'https://facebook.com/luxefinds',
  youtube: 'https://youtube.com/luxefinds',
  businessName: 'LuxeFinds',
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);
const contactDocument = doc(db, 'siteSettings', 'contact');

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => onSnapshot(contactDocument, (snapshot) => {
    if (snapshot.exists()) {
      setContactInfo({ ...defaultContactInfo, ...snapshot.data() } as ContactInfo);
    }
  }, (error) => console.error('Unable to load contact details from Firebase.', error)), []);

  const updateContactInfo = async (info: Partial<ContactInfo>) => {
    await setDoc(contactDocument, info, { merge: true });
  };

  return <ContactContext.Provider value={{ contactInfo, updateContactInfo }}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) throw new Error('useContact must be used within a ContactProvider');
  return context;
}
