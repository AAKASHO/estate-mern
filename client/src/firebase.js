// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-522c3.firebaseapp.com",
  projectId: "mern-estate-522c3",
  storageBucket: "mern-estate-522c3.appspot.com",
  messagingSenderId: "987081452296",
  appId: "1:987081452296:web:5bc7eb329bb3af6ad89abd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);