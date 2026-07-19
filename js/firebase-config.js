// =========================================================================
// FIREBASE CLOUD BACKEND CONFIGURATION
// =========================================================================
// Instructions:
// 1. Go to https://firebase.google.com/
// 2. Create a Project and add a Web App
// 3. Enable Firestore Database and Email/Password Authentication
// 4. Copy the config object provided by Firebase and paste it below.
// 5. Change USE_FIREBASE to true to activate Cloud Sync across devices!
// =========================================================================

const USE_FIREBASE = false; // Set to true ONLY AFTER filling the config below

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (Only if enabled)
let app, auth, db;
if (USE_FIREBASE && typeof firebase !== 'undefined') {
    try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase Cloud Backend Initialized successfully!");
    } catch (e) {
        console.error("Firebase Initialization Error. Check your config:", e);
    }
}
