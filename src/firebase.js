import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXo4o3Jpf2FhSnxlXSKTDgPpLlXTlTX08",
  authDomain: "watchably.firebaseapp.com",
  projectId: "watchably",
  storageBucket: "watchably.appspot.com",
  messagingSenderId: "964038844481",
  appId: "1:964038844481:web:f6eb4b972cdfd460fee6c0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
