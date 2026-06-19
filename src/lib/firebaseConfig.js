import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCI2FoR-4fV3lXi-6VDRvIxwkX3ZcDox10",
  authDomain: "mei-hostel-app.firebaseapp.com",
  projectId: "mei-hostel-app",
  storageBucket: "mei-hostel-app.firebasestorage.app",
  messagingSenderId: "671284350691",
  appId: "1:671284350691:web:e8bbd17e40adc7ce23bfd6",
  measurementId: "G-1KYNT7FV6K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
