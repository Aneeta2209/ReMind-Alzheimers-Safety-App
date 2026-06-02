import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "remind2026-e27ee.firebaseapp.com",
  projectId: "remind2026-e27ee",
  storageBucket: "remind2026-e27ee.firebasestorage.app",
  messagingSenderId: "426537480477",
  appId: "1:426537480477:web:1ab7ac00979156f1f431f4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);