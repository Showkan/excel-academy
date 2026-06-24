// ============================================
// Firebase Configuration
// ============================================

const firebaseConfig = {
    // IMPORTANT: Replace with your Firebase project config
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Super Admin Email
const SUPER_ADMIN_EMAIL = "Urinboyevsherzod1@gmail.com";

console.log("Firebase initialized");