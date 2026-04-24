// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoKYCLruI--bP78Okl6eMWrRKZuaIycKw",
  authDomain: "foodreel-93c94.firebaseapp.com",
  projectId: "foodreel-93c94",
  storageBucket: "foodreel-93c94.firebasestorage.app",
  messagingSenderId: "60366252460",
  appId: "1:60366252460:web:55b810e278a17198d43209",
  measurementId: "G-VDFS8X4FEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;