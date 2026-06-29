import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App universally (needed for Storage on both client and server)
let app;
let auth;
let storage;

try {
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing. Check your environment variables.");
  } else {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

// Auth is browser-only
if (typeof window !== 'undefined' && app) {
  try {
    if (!firebaseConfig.apiKey) {
      console.error("Firebase API Key is missing. Check your environment variables.");
    } else {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      storage = getStorage(app);
    }
    auth = getAuth(app);
  } catch (error) {
    console.error("Failed to initialize Firebase Auth:", error);
  }
}

export { app, auth, storage };