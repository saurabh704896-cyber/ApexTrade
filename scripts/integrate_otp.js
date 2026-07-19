const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Inject EmailJS CDN
    if (!content.includes('email.min.js')) {
        content = content.replace('</head>', '    <!-- EmailJS for Real Email OTP -->\n    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>\n</head>');
    }

    // 2. Update Auth Configurator in Dashboard
    const oldConfigurator = `<input type="text" id="firebase-key-input" class="auth-input" placeholder="Enter Firebase API Key..." style="margin-bottom: 15px; background: rgba(0,0,0,0.4);">
                        <button class="nav-btn" onclick="saveFirebaseConfig()" style="width: 100%; justify-content: center; background: var(--accent); color: #fff; padding: 12px; border-radius: 12px; font-weight: 600;">Activate Real Mode <i class="fas fa-bolt" style="margin-left: 5px;"></i></button>`;
    
    const newConfigurator = `<input type="text" id="firebase-key-input" class="auth-input" placeholder="Enter Firebase API Key (For Phone OTP)..." style="margin-bottom: 15px; background: rgba(0,0,0,0.4);">
                        
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px; text-align: left;">EmailJS Config (For Real Email OTP):</p>
                        <input type="text" id="emailjs-pubkey" class="auth-input" placeholder="EmailJS Public Key" style="margin-bottom: 10px; background: rgba(0,0,0,0.4);">
                        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                            <input type="text" id="emailjs-service" class="auth-input" placeholder="Service ID" style="margin-bottom: 0; background: rgba(0,0,0,0.4);">
                            <input type="text" id="emailjs-template" class="auth-input" placeholder="Template ID" style="margin-bottom: 0; background: rgba(0,0,0,0.4);">
                        </div>

                        <button class="nav-btn" onclick="saveFirebaseConfig()" style="width: 100%; justify-content: center; background: var(--accent); color: #fff; padding: 12px; border-radius: 12px; font-weight: 600;">Save Keys & Activate Real Mode <i class="fas fa-bolt" style="margin-left: 5px;"></i></button>`;

    if(content.includes(oldConfigurator)) {
        content = content.replace(oldConfigurator, newConfigurator);
    }

    // 3. Update Auth Hub HTML with Email OTP views
    const emailOtpLink = `<div style="margin-top:15px;"><span class="auth-link" onclick="switchAuthView('phone')" style="color:var(--text-muted);"><i class="fas fa-phone"></i> Login with Phone (OTP)</span></div>`;
    const newEmailOtpLink = `<div style="margin-top:15px; display:flex; justify-content: space-between;"><span class="auth-link" onclick="switchAuthView('phone')" style="color:var(--text-muted);"><i class="fas fa-phone"></i> Phone OTP</span><span class="auth-link" onclick="switchAuthView('emailotp')" style="color:var(--text-muted);"><i class="fas fa-envelope"></i> Email OTP</span></div>`;
    
    content = content.replace(emailOtpLink, newEmailOtpLink);

    const authViewPhoneHtml = `<div id="auth-view-phone" style="display: none;">`;
    const emailOtpViews = `
            <div id="auth-view-emailotp" style="display: none;">
                <h1 class="auth-title">Email OTP</h1>
                <p class="auth-subtitle">We will send a 6-digit code to your email.</p>
                <input type="email" id="email-otp-id" class="auth-input" placeholder="Enter Email Address" required>
                <button class="auth-btn" id="btn-send-email-otp" onclick="authSendEmailOTP()">Send OTP</button>
                <div class="auth-links" style="justify-content: center;">
                    <span class="auth-link" onclick="switchAuthView('login')"><i class="fas fa-arrow-left"></i> Back</span>
                </div>
            </div>

            <div id="auth-view-verify-emailotp" style="display: none;">
                <h1 class="auth-title">Enter Email OTP</h1>
                <p class="auth-subtitle">Enter the 6-digit code sent to your email.</p>
                <div class="otp-container" id="email-otp-inputs">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                </div>
                <button class="auth-btn" onclick="authVerifyEmailOTP()">Verify & Login</button>
                <div class="auth-links" style="justify-content: center;">
                    <span class="auth-link" onclick="switchAuthView('emailotp')">Change Email</span>
                </div>
            </div>

            <div id="auth-view-phone" style="display: none;">`;
    
    if(content.includes(authViewPhoneHtml)) {
        content = content.replace(authViewPhoneHtml, emailOtpViews);
    }

    // 4. Update JS Logic
    // Replace switchAuthView
    const oldSwitchAuthView = `        window.switchAuthView = function(view) {
            document.getElementById('auth-view-login').style.display = 'none';
            document.getElementById('auth-view-signup').style.display = 'none';
            document.getElementById('auth-view-forgot').style.display = 'none';
            document.getElementById('auth-view-phone').style.display = 'none';
            document.getElementById('auth-view-otp').style.display = 'none';
            document.getElementById('auth-view-' + view).style.display = 'block';
        };`;
        
    const newSwitchAuthView = `        window.switchAuthView = function(view) {
            document.querySelectorAll('[id^="auth-view-"]').forEach(el => el.style.display = 'none');
            const target = document.getElementById('auth-view-' + view);
            if(target) {
                target.style.display = 'block';
                if(typeof gsap !== 'undefined') {
                    gsap.from(target, { duration: 0.3, opacity: 0, y: 10, ease: "power2.out" });
                }
            }
        };`;
        
    content = content.replace(oldSwitchAuthView, newSwitchAuthView);

    // Inject Email OTP logic and update saveFirebaseConfig
    const oldSaveConfig = `        window.saveFirebaseConfig = function() {
            const key = document.getElementById('firebase-key-input').value.trim();
            if(key.length < 20) return showToast("Invalid API Key. Must be a valid Firebase Key.", "error");
            localStorage.setItem('firebase_real_key', key);
            showToast("Real Authentication Activated! Rebooting system...", "success");
            setTimeout(() => location.reload(), 1500);
        }`;
        
    const newSaveConfig = `        window.saveFirebaseConfig = function() {
            const fbKey = document.getElementById('firebase-key-input').value.trim();
            const emailPub = document.getElementById('emailjs-pubkey').value.trim();
            const emailSrv = document.getElementById('emailjs-service').value.trim();
            const emailTpl = document.getElementById('emailjs-template').value.trim();
            
            if(fbKey) localStorage.setItem('firebase_real_key', fbKey);
            if(emailPub) localStorage.setItem('emailjs_pubkey', emailPub);
            if(emailSrv) localStorage.setItem('emailjs_service', emailSrv);
            if(emailTpl) localStorage.setItem('emailjs_template', emailTpl);
            
            showToast("API Keys Saved! Real Mode Activated.", "success");
        };

        // --- REAL EMAIL OTP LOGIC (EMAILJS) ---
        let generatedEmailOTP = '';
        let targetEmailForOTP = '';

        window.authSendEmailOTP = async function() {
            const email = document.getElementById('email-otp-id').value.trim();
            if(!email) return showToast("Enter email address", "error");

            const pubKey = localStorage.getItem('emailjs_pubkey');
            const serviceId = localStorage.getItem('emailjs_service');
            const templateId = localStorage.getItem('emailjs_template');
            
            generatedEmailOTP = Math.floor(100000 + Math.random() * 900000).toString();
            targetEmailForOTP = email;

            if (pubKey && serviceId && templateId) {
                try {
                    document.getElementById('btn-send-email-otp').innerText = "Sending Real OTP...";
                    emailjs.init(pubKey);
                    await emailjs.send(serviceId, templateId, {
                        to_email: email,
                        otp_code: generatedEmailOTP
                    });
                    showToast("Real OTP Sent via EmailJS!", "success");
                    switchAuthView('verify-emailotp');
                } catch(e) {
                    console.error(e);
                    showToast("Failed to send real OTP. Check EmailJS Config.", "error");
                } finally {
                    document.getElementById('btn-send-email-otp').innerText = "Send OTP";
                }
            } else {
                showToast("Email OTP Sent! Enter 123456 (Mock Fallback)", "success");
                generatedEmailOTP = '123456';
                switchAuthView('verify-emailotp');
            }
        };

        window.authVerifyEmailOTP = async function() {
            const inputs = document.querySelectorAll('#email-otp-inputs .otp-input');
            let otp = '';
            inputs.forEach(inp => otp += inp.value);
            if(otp.length !== 6) return showToast("Enter 6-digit OTP", "error");

            if (otp === generatedEmailOTP) {
                showToast("Email Verified Successfully!", "success");
                finalizeAuth(targetEmailForOTP, targetEmailForOTP.split('@')[0]);
            } else {
                showToast("Invalid OTP Code", "error");
            }
        };
        // -------------------------------------`;
        
    content = content.replace(oldSaveConfig, newSaveConfig);

    // Also populate inputs on load if they exist
    const docReadyInit = `        // Fetch API when logged in
        document.addEventListener('DOMContentLoaded', () => {`;
    const newDocReadyInit = `        // Fetch API when logged in
        document.addEventListener('DOMContentLoaded', () => {
            if(document.getElementById('firebase-key-input')) {
                document.getElementById('firebase-key-input').value = localStorage.getItem('firebase_real_key') || '';
                document.getElementById('emailjs-pubkey').value = localStorage.getItem('emailjs_pubkey') || '';
                document.getElementById('emailjs-service').value = localStorage.getItem('emailjs_service') || '';
                document.getElementById('emailjs-template').value = localStorage.getItem('emailjs_template') || '';
            }`;
            
    content = content.replace(docReadyInit, newDocReadyInit);

    fs.writeFileSync('index.html', content);

    // Bump SW version to v11
    let sw = fs.readFileSync('sw.js', 'utf8');
    sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v11';");
    fs.writeFileSync('sw.js', sw);

    console.log("Real OTP Integration Complete!");
} catch (e) {
    console.error(e);
}
