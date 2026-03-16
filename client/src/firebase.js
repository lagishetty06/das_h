// Firebase configuration for DASH app
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvvo6X41M8M1wMEkahCDn3VpWHc0tw0xw",
  authDomain: "dash-e8ccf.firebaseapp.com",
  projectId: "dash-e8ccf",
  storageBucket: "dash-e8ccf.firebasestorage.app",
  messagingSenderId: "991145273138",
  appId: "1:991145273138:web:0ac518007df195ce72992b",
  measurementId: "G-XYFR4VCBYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
