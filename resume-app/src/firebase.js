// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8TwQjNc8FQNw9UvAz1qNGTyG_VWUAlzE",
    authDomain: "ayush-resume.firebaseapp.com",
    projectId: "ayush-resume",
    storageBucket: "ayush-resume.firebasestorage.app",
    messagingSenderId: "951972391035",
    appId: "1:951972391035:web:b397a4e59b12a2fb5b1ade",
    measurementId: "G-MPKB0LMKNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
