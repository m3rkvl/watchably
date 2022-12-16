import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const REACT_APP_API_KEY = "AIzaSyCXo4o3Jpf2FhSnxlXSKTDgPpLlXTlTX08";
const REACT_APP_AUTH_DOMAIN = "watchably.firebaseapp.com";
const REACT_APP_PROJECT_ID = "watchably";
const REACT_APP_STORAGE_BUCKET = "watchably.appspot.com";
const REACT_APP_MESSAGING_SENDER_ID = "964038844481";
const REACT_APP_ID = "1:964038844481:web:f6eb4b972cdfd460fee6c0";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
