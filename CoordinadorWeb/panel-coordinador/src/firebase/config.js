// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5qR18wnSJhVKAugcHVyIO64Om3VnBVnw",
  authDomain: "bdempleo-2c46c.firebaseapp.com",
  projectId: "bdempleo-2c46c",
  storageBucket: "bdempleo-2c46c.firebasestorage.app",
  messagingSenderId: "930180343463",
  appId: "1:930180343463:web:013d925ec3b6129b3add82",
  measurementId: "G-66WY728BB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app,"sgema");
const analytics = getAnalytics(app);
