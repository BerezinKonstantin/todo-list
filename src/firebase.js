// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDny6WCegcF4c4ZwYMX_6jLLVExTiuB7Lg",
  authDomain: "todo-list-c1818.firebaseapp.com",
  projectId: "todo-list-c1818",
  storageBucket: "todo-list-c1818.appspot.com",
  messagingSenderId: "626760406021",
  appId: "1:626760406021:web:bb8db9ad45557d8fb0f86c",
  measurementId: "G-9ZL4W2EV3J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
