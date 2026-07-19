// =========================================================================
// FIREBASE CLOUD BACKEND CONFIGURATION
// =========================================================================

// Read config from localStorage if injected via Dashboard Configurator
let fbConfigRaw = localStorage.getItem('firebase_full_config');
let firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let USE_FIREBASE = false;

if (fbConfigRaw) {
    try {
        firebaseConfig = JSON.parse(fbConfigRaw);
        USE_FIREBASE = true; // Auto-enable if config exists
    } catch(e) {
        console.error("Failed to parse Firebase Config", e);
    }
}

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