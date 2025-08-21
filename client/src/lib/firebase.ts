import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMHkqJRdNT_89eBDolhTBdFr6re0KDixM",
  authDomain: "pokecalc-121d3.firebaseapp.com",
  projectId: "pokecalc-121d3",
  storageBucket: "pokecalc-121d3.firebasestorage.app",
  messagingSenderId: "496978253660",
  appId: "1:496978253660:web:b42aef722fbb338a6b9399",
  measurementId: "G-ESX4VF0LH0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
