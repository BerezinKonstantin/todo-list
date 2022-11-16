import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDny6WCegcF4c4ZwYMX_6jLLVExTiuB7Lg",
  authDomain: "todo-list-c1818.firebaseapp.com",
  projectId: "todo-list-c1818",
  storageBucket: "todo-list-c1818.appspot.com",
  messagingSenderId: "626760406021",
  appId: "1:626760406021:web:bb8db9ad45557d8fb0f86c",
  measurementId: "G-9ZL4W2EV3J",
};

const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
