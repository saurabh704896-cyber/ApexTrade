const fs = require('fs');
const path = require('path');

try {
    // 1. Fix firebase-config.js to read from localStorage
    const fbConfigPath = path.join('js', 'firebase-config.js');
    if (fs.existsSync(fbConfigPath)) {
        const newFbConfig = `// =========================================================================
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
}`;
        fs.writeFileSync(fbConfigPath, newFbConfig);
    }

    // 2. Fix Dashboard Configurator in index.html to accept JSON
    const indexPath = 'index.html';
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');

        // Update the input field
        const oldInput = `<input type="text" id="firebase-key-input" class="auth-input" placeholder="Enter Firebase API Key (For Phone OTP)..." style="margin-bottom: 15px; background: rgba(0,0,0,0.4);">`;
        const newInput = `<textarea id="firebase-key-input" class="auth-input" placeholder="Paste your entire Firebase Config JSON here (for Real SMS OTP)..." style="margin-bottom: 15px; background: rgba(0,0,0,0.4); height: 80px; font-family: monospace; font-size: 0.8rem;"></textarea>`;
        content = content.replace(oldInput, newInput);

        // Update saveFirebaseConfig JS function
        const oldSave = `const fbKey = document.getElementById('firebase-key-input').value.trim();`;
        const newSave = `const fbKey = document.getElementById('firebase-key-input').value.trim();
            if(fbKey) {
                try {
                    JSON.parse(fbKey); // Validate JSON
                    localStorage.setItem('firebase_full_config', fbKey);
                } catch(e) {
                    return showToast("Firebase Config must be valid JSON", "error");
                }
            }`;
        content = content.replace(oldSave, newSave);

        // Fix logic inside authSendOTP
        const oldAuthSend = `if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {`;
        const newAuthSend = `if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {`;
        // Actually, this line is fine. But I should make sure it doesn't crash if recaptcha is hidden.

        fs.writeFileSync(indexPath, content);
    }

    // Bump SW version to clear cache
    if (fs.existsSync('sw.js')) {
        let sw = fs.readFileSync('sw.js', 'utf8');
        sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v13';");
        fs.writeFileSync('sw.js', sw);
    }

    console.log("Bug fixed and config updated!");
} catch (e) {
    console.error(e);
}
