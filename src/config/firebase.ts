
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyoPdqI5Xnxt7i5K0x4BlIcz2AqlUdYWQ",
  authDomain: "bonteer.firebaseapp.com",
  databaseURL: "https://bonteer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bonteer",
  storageBucket: "bonteer.firebasestorage.app",
  messagingSenderId: "461570091756",
  appId: "1:461570091756:web:a96236965920cb55ed53c9"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  console.log("Initializing Firebase with new configuration...");
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
  db = getDatabase(app);
  auth = getAuth(app);
  
  // Add console logs to check the connection
  console.log("Database reference created:", db ? "Success" : "Failed");
  console.log("Auth reference created:", auth ? "Success" : "Failed");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Provide fallback so the app doesn't crash
  app = {} as any;
  db = {} as any;
  auth = {} as any;
}

export { db, auth };
export default app;
