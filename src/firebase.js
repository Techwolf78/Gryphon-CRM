// firebase.js

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  child,
  onValue,
  query,
  orderByChild,
  equalTo
} from "firebase/database";
import { getAuth } from "firebase/auth"; // ✅ Import auth from the correct module

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAvLWXhUuzhZP6qazfqOnc4Egx8Hz8P4eo",
  authDomain: "crm-app-f1465.firebaseapp.com",
  databaseURL: "https://crm-app-f1465-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crm-app-f1465",
  storageBucket: "crm-app-f1465.appspot.com",
  messagingSenderId: "499189396099",
  appId: "1:499189396099:web:6ff1fed38331a40d58a1b6",
  measurementId: "G-PM5EDRQV3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Get services
const db = getDatabase(app);
const auth = getAuth(app); // Correct way to initialize auth

// ✅ Export what you need
export {
  db,
  ref,
  set,
  get,
  update,
  push,
  child,
  onValue,
  query,
  orderByChild,
  equalTo,
  auth // Now correctly exported
};
