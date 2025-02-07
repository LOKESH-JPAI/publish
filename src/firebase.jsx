import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXLoGL5xXgRPA4Op6PLataTvvHAR4xhSk",
  authDomain: "e-commerce-react-33573.firebaseapp.com",
  projectId: "e-commerce-react-33573",
  storageBucket: "e-commerce-react-33573.firebasestorage.app",
  messagingSenderId: "873152600856",
  appId: "1:873152600856:web:8bc599917b25c78bda9c6d",
  measurementId: "G-YE50FMV1XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);