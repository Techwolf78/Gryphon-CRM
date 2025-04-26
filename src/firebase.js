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
  equalTo,
  remove // 👈 ADD THIS LINE
} from "firebase/database";
import { getAuth } from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

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
  remove, // 👈 ADD THIS TOO
  auth
};
