// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_PANTRY_TRACKER_API_KEY,
  authDomain: "pantry-tracker-6b1d1.firebaseapp.com",
  projectId: "pantry-tracker-6b1d1",
  storageBucket: "pantry-tracker-6b1d1.appspot.com",
  messagingSenderId: "1007412074775",
  appId: "1:1007412074775:web:dac4cbf8c0b95de8debf52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);