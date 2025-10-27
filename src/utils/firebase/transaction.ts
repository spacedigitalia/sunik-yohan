import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

import {
  Analytics,
  getAnalytics,
  isSupported,
  setConsent,
  ConsentSettings,
} from "firebase/analytics";

import { getFirestore, collection, addDoc } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_TRANSACTIONS_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_TRANSACTIONS_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_TRANSACTIONS_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_TRANSACTIONS_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_TRANSACTIONS_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_TRANSACTIONS_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_TRANSACTIONS_MEASUREMENT_ID,
};

// Initialize Firebase with a named app
let app: FirebaseApp;
try {
  app = getApp('transaction');
} catch (e) {
  app = initializeApp(firebaseConfig, 'transaction');
}

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
      const consentSettings: ConsentSettings = {
        analytics_storage: "denied",
        ad_storage: "denied",
      };
      setConsent(consentSettings);
    }
  });
}

const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Transaction service
export interface TransactionData {
  transactionId: string;
  userId: string;
  docId?: string;
  userInfo: {
    displayName: string;
    email: string;
    photoURL?: string;
  };
  items: any[];
  totalAmount: number;
  shippingInfo: {
    firstName: string;
    email: string;
    streetName: string;
    landmark: string;
    province: string;
    city: string;
    postalCode: string;
    phone: string;
    district?: string; // Format: "latitude,longitude" e.g. "-6.5741124,106.6320672"
    rt: string;
    rw: string;
    addressType: string;
  };
  paymentInfo: {
    method: string;
    proof: string;
    status: string;
  };
  message?: string;
  orderDate: string;
  expirationTime: string;
  status: string;
  deliveryStatus: {
    status: string;
    history: Array<{
      status: string;
      timestamp: string;
      description: string;
    }>;
    estimatedDelivery: string;
  };
  shippingCost: number;
}

const createTransaction = async (data: TransactionData) => {
  try {
    const transactionRef = collection(db, 'transaction');
    const docRef = await addDoc(transactionRef, data);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export { app, analytics, db, auth, database, createTransaction };
