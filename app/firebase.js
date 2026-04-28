import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARzuBC5m0dvbRwrZUAjXlgrGV5yJmeelE",
  authDomain: "senior-dashboard-1b794.firebaseapp.com",
  projectId: "senior-dashboard-1b794",
  storageBucket: "senior-dashboard-1b794.firebasestorage.app",
  messagingSenderId: "980563182679",
  appId: "1:980563182679:web:6f19e3c55b304bf73acf12"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
