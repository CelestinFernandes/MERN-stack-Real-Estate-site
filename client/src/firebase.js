// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "celestial-estates.firebaseapp.com",
  projectId: "celestial-estates",
  storageBucket: "celestial-estates.appspot.com",
  messagingSenderId: "804332010851",
  appId: "1:804332010851:web:1b51a09f169a80f4742756"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
