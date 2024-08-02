// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLcnDFmTibZiLSf-3sXW23ugjV9dcP-QM",
  authDomain: "pantrytracker-54e48.firebaseapp.com",
  projectId: "pantrytracker-54e48",
  storageBucket: "pantrytracker-54e48.appspot.com",
  messagingSenderId: "561133818805",
  appId: "1:561133818805:web:225863e9e862fd56f3fffc",
  measurementId: "G-D3WBM0LX1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}