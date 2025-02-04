// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nestwise-demo.firebaseapp.com",
  projectId: "nestwise-demo",
  storageBucket: "nestwise-demo.firebasestorage.app",
  messagingSenderId: "980342177590",
  appId: "1:980342177590:web:1c6632a021ae75211afd97"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);