import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBaZvaNAgnJDZyLqBLleHq-_y6J4NkQRQY",
  authDomain: "cospac-d0fe7.firebaseapp.com",
  databaseURL: "https://cospac-d0fe7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cospac-d0fe7",
  storageBucket: "cospac-d0fe7.firebasestorage.app",
  messagingSenderId: "297991380011",
  appId: "1:297991380011:web:262ce4af955b41c190de6e",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);
