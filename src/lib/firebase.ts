// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3vAdwFEky8MjF5A7VcG4V8mHtDgbxzuU",
    authDomain: "lu-game-1cf47.firebaseapp.com",
    projectId: "lu-game-1cf47",
    storageBucket: "lu-game-1cf47.firebasestorage.app",
    messagingSenderId: "893495862736",
    appId: "1:893495862736:web:bf3879cfba1f01466645d5",
    measurementId: "G-C5L61KZVSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
