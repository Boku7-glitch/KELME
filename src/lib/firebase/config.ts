import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  return Boolean(
    key &&
      project &&
      !key.includes('your-') &&
      !project.includes('your-')
  );
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth =
  typeof window !== 'undefined' || isFirebaseConfigured() ? getAuth(app) : null;
export const db =
  typeof window !== 'undefined' || isFirebaseConfigured()
    ? getFirestore(app)
    : null;

export default app;
