const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Replace HTML
    const startHTML = '    <!-- Login Screen Overlay -->';
    const endHTML = '    <!-- Toast Container -->';
    
    const htmlStartIndex = content.indexOf(startHTML);
    const htmlEndIndex = content.indexOf(endHTML);
    
    if (htmlStartIndex !== -1 && htmlEndIndex !== -1) {
        const authHTML = `    <!-- Login Screen Overlay -->
    <div id="login-screen">
        <style>
            .auth-box { background: var(--sidebar-bg); padding: 40px; border-radius: 20px; border: 1px solid var(--border-color); width: 90%; max-width: 450px; text-align: center; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px); transition: all 0.3s; margin: auto; }
            .auth-title { font-size: 1.8rem; margin-bottom: 10px; font-weight: 700; color: var(--text-main); }
            .auth-subtitle { color: var(--text-muted); margin-bottom: 25px; font-size: 0.95rem; }
            .auth-input { width: 100%; padding: 15px; margin-bottom: 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: var(--text-main); font-size: 1rem; transition: 0.3s; }
            .auth-input:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
            .auth-btn { width: 100%; padding: 15px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; }
            .auth-btn:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37,99,235,0.3); }
            .google-btn { background: #fff; color: #333; }
            .google-btn:hover { background: #f8f9fa; box-shadow: 0 10px 20px rgba(255,255,255,0.1); }
            .google-btn img { width: 20px; height: 20px; }
            .auth-links { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--accent); margin-top: 15px; }
            .auth-link { cursor: pointer; transition: 0.2s; }
            .auth-link:hover { text-decoration: underline; color: #fff; }
            .divider { display: flex; align-items: center; text-align: center; margin: 20px 0; color: var(--text-muted); font-size: 0.9rem; }
            .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .divider::before { margin-right: .25em; }
            .divider::after { margin-left: .25em; }
            .otp-container { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; }
            .otp-input { width: 45px; height: 50px; text-align: center; font-size: 1.5rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.3); color: var(--text-main); }
            .otp-input:focus { border-color: var(--accent); outline: none; }
        </style>
        
        <div class="auth-box" id="auth-box-login">
            <button class="close-video" style="top: 15px; right: 15px;" onclick="closeLoginModal()"><i class="fas fa-times"></i></button>
            <img src="logo.png" class="spinning-logo" style="width: 60px; height: 60px; margin-bottom: 15px;" alt="Logo">
            
            <div id="auth-view-login">
                <h1 class="auth-title">Welcome Back</h1>
                <p class="auth-subtitle">Login to your ApexTrade Pro account.</p>
                <button class="auth-btn google-btn" onclick="authGoogle()"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G"> Continue with Google</button>
                <div class="divider">OR</div>
                <input type="email" id="login-email" class="auth-input" placeholder="Email Address" required>
                <input type="password" id="login-pwd" class="auth-input" placeholder="Password" required>
                <button class="auth-btn" onclick="authEmailLogin()">Login</button>
                <div class="auth-links">
                    <span class="auth-link" onclick="switchAuthView('forgot')">Forgot Password?</span>
                    <span class="auth-link" onclick="switchAuthView('signup')">Create Account</span>
                </div>
                <div style="margin-top:15px;"><span class="auth-link" onclick="switchAuthView('phone')" style="color:var(--text-muted);"><i class="fas fa-phone"></i> Login with Phone (OTP)</span></div>
            </div>

            <div id="auth-view-signup" style="display: none;">
                <h1 class="auth-title">Create Account</h1>
                <p class="auth-subtitle">Join the ultimate trading simulator.</p>
                <button class="auth-btn google-btn" onclick="authGoogle()"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G"> Signup with Google</button>
                <div class="divider">OR</div>
                <input type="text" id="signup-name" class="auth-input" placeholder="Full Name" required>
                <input type="email" id="signup-email" class="auth-input" placeholder="Email Address" required>
                <input type="password" id="signup-pwd" class="auth-input" placeholder="Password" required>
                <button class="auth-btn" onclick="authEmailSignup()">Sign Up</button>
                <div class="auth-links" style="justify-content: center;">
                    <span style="color:var(--text-muted)">Already have an account? </span>&nbsp;<span class="auth-link" onclick="switchAuthView('login')">Login</span>
                </div>
            </div>

            <div id="auth-view-forgot" style="display: none;">
                <h1 class="auth-title">Reset Password</h1>
                <p class="auth-subtitle">Enter your email to receive a reset link.</p>
                <input type="email" id="forgot-email" class="auth-input" placeholder="Email Address" required>
                <button class="auth-btn" onclick="authForgotPassword()">Send Reset Link</button>
                <div class="auth-links" style="justify-content: center;">
                    <span class="auth-link" onclick="switchAuthView('login')"><i class="fas fa-arrow-left"></i> Back to Login</span>
                </div>
            </div>

            <div id="auth-view-phone" style="display: none;">
                <h1 class="auth-title">Phone Login</h1>
                <p class="auth-subtitle">We will send you an OTP.</p>
                <input type="tel" id="phone-number" class="auth-input" placeholder="+1 234 567 8900" required>
                <div id="recaptcha-container" style="margin-bottom:15px;"></div>
                <button class="auth-btn" onclick="authSendOTP()">Send OTP</button>
                <div class="auth-links" style="justify-content: center;">
                    <span class="auth-link" onclick="switchAuthView('login')"><i class="fas fa-arrow-left"></i> Back to Email</span>
                </div>
            </div>

            <div id="auth-view-otp" style="display: none;">
                <h1 class="auth-title">Enter OTP</h1>
                <p class="auth-subtitle">Enter the 6-digit code sent to you.</p>
                <div class="otp-container">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                    <input type="text" class="otp-input" maxlength="1" onkeyup="moveToNext(this, event)">
                </div>
                <button class="auth-btn" onclick="authVerifyOTP()">Verify & Login</button>
                <div class="auth-links" style="justify-content: center;">
                    <span class="auth-link" onclick="switchAuthView('phone')">Change Number</span>
                </div>
            </div>

        </div>
    </div>
\n`;
        
        content = content.substring(0, htmlStartIndex) + authHTML + content.substring(htmlEndIndex);
    } else {
        console.error("Could not find HTML anchors");
    }

    // 2. Replace JS
    const startJS = 'window.doLogin = async function () {';
    const endJS = '        function initUserProfile(name) {';
    
    const jsStartIndex = content.indexOf(startJS);
    const jsEndIndex = content.indexOf(endJS);

    if (jsStartIndex !== -1 && jsEndIndex !== -1) {
        const newJS = `
        window.switchAuthView = function(view) {
            document.getElementById('auth-view-login').style.display = 'none';
            document.getElementById('auth-view-signup').style.display = 'none';
            document.getElementById('auth-view-forgot').style.display = 'none';
            document.getElementById('auth-view-phone').style.display = 'none';
            document.getElementById('auth-view-otp').style.display = 'none';
            document.getElementById('auth-view-' + view).style.display = 'block';
        };

        window.moveToNext = function(ele, event) {
            if (event.key === "Backspace") {
                if (ele.previousElementSibling) ele.previousElementSibling.focus();
            } else if (ele.value !== '') {
                if (ele.nextElementSibling) ele.nextElementSibling.focus();
            }
        };

        const finalizeAuth = (email, name) => {
            userName = name || email.split('@')[0];
            userAuth = email;
            localStorage.setItem('tp_user_name', userName);
            localStorage.setItem('tp_user_auth', userAuth);
            
            const savedState = localStorage.getItem('apex_state_' + userAuth);
            if (savedState) {
                try {
                    state = JSON.parse(savedState);
                    showToast('Welcome back, ' + userName + '!', 'success');
                } catch(e) { console.error("Could not load state"); }
            } else {
                showToast('Account setup for ' + userName + '!', 'success');
                if (typeof saveState === 'function') saveState();
            }
            enterTerminal();
            closeLoginModal();
        };

        window.authGoogle = async function() {
            if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {
                const provider = new firebase.auth.GoogleAuthProvider();
                try {
                    const result = await auth.signInWithPopup(provider);
                    finalizeAuth(result.user.email, result.user.displayName);
                } catch(e) {
                    showToast(e.message, "error");
                }
            } else {
                showToast("Google Login Success (Mock Fallback)!", "success");
                finalizeAuth("guest_google@apextrade.mock", "Google Guest");
            }
        };

        window.authEmailSignup = async function() {
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const pwd = document.getElementById('signup-pwd').value.trim();
            if(!name || !email || !pwd) return showToast("Fill all fields", "error");

            if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {
                try {
                    const res = await auth.createUserWithEmailAndPassword(email, pwd);
                    finalizeAuth(res.user.email, name);
                } catch(e) { showToast(e.message, "error"); }
            } else {
                showToast("Signup Success (Mock Fallback)", "success");
                finalizeAuth(email, name);
            }
        };

        window.authEmailLogin = async function() {
            const email = document.getElementById('login-email').value.trim();
            const pwd = document.getElementById('login-pwd').value.trim();
            if(!email || !pwd) return showToast("Fill all fields", "error");

            if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {
                try {
                    const res = await auth.signInWithEmailAndPassword(email, pwd);
                    finalizeAuth(res.user.email, res.user.email.split('@')[0]);
                } catch(e) { showToast(e.message, "error"); }
            } else {
                showToast("Login Success (Mock Fallback)", "success");
                finalizeAuth(email, email.split('@')[0]);
            }
        };

        window.authForgotPassword = async function() {
            const email = document.getElementById('forgot-email').value.trim();
            if(!email) return showToast("Enter email address", "error");

            if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {
                try {
                    await auth.sendPasswordResetEmail(email);
                    showToast("Password reset email sent!", "success");
                    switchAuthView('login');
                } catch(e) { showToast(e.message, "error"); }
            } else {
                showToast("Reset link sent! (Mock Fallback)", "success");
                switchAuthView('login');
            }
        };

        let confirmationResultObj = null;
        window.authSendOTP = async function() {
            const phone = document.getElementById('phone-number').value.trim();
            if(!phone) return showToast("Enter phone number", "error");

            if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {
                try {
                    if(!window.recaptchaVerifier) {
                        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
                    }
                    confirmationResultObj = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
                    showToast("OTP Sent to " + phone, "success");
                    switchAuthView('otp');
                } catch(e) { showToast(e.message, "error"); }
            } else {
                showToast("OTP Sent! Enter 123456 (Mock Fallback)", "success");
                switchAuthView('otp');
            }
        };

        window.authVerifyOTP = async function() {
            const inputs = document.querySelectorAll('.otp-input');
            let otp = '';
            inputs.forEach(inp => otp += inp.value);
            if(otp.length !== 6) return showToast("Enter 6-digit OTP", "error");

            if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof auth !== 'undefined') {
                try {
                    if(confirmationResultObj) {
                        const res = await confirmationResultObj.confirm(otp);
                        finalizeAuth(res.user.phoneNumber + "@apextrade.mock", "Phone User");
                    }
                } catch(e) { showToast(e.message, "error"); }
            } else {
                if(otp === '123456') {
                    showToast("OTP Verified! (Mock Fallback)", "success");
                    finalizeAuth(document.getElementById('phone-number').value + "@apextrade.mock", "Phone User");
                } else {
                    showToast("Invalid OTP", "error");
                }
            }
        };
\n`;
        
        content = content.substring(0, jsStartIndex) + newJS + content.substring(jsEndIndex);
    } else {
        console.error("Could not find JS anchors");
    }

    fs.writeFileSync('index.html', content);

    // Bump SW version
    let sw = fs.readFileSync('sw.js', 'utf8');
    sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v7';");
    fs.writeFileSync('sw.js', sw);

    console.log("Rebuild Auth Complete!");
} catch (e) {
    console.error(e);
}
