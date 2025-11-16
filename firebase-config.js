// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUpNv12V2QbgbTwlgGkmLxP-nfLbeV08Q",
  authDomain: "autonomousagentic.firebaseapp.com",
  projectId: "autonomousagentic",
  storageBucket: "autonomousagentic.firebasestorage.app",
  messagingSenderId: "339473268860",
  appId: "1:339473268860:web:ecb7df241ae5c8a87949f9",
  measurementId: "G-E1F2WMMEDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
