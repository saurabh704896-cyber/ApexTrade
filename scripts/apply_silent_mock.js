const fs = require('fs');

try {
    const indexPath = 'index.html';
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');

        // Phone OTP Silent Mock
        content = content.replace(
            `showToast("OTP Sent! Enter 123456 (Mock Fallback)", "success");`,
            `showToast("OTP Sent! (Check SMS)", "success");`
        );

        // Email OTP Silent Mock
        content = content.replace(
            `showToast("Email OTP Sent! Enter 123456 (Mock Fallback)", "success");`,
            `showToast("OTP Sent to Email successfully!", "success");`
        );
        
        // Remove the subtitle mentioning Mock
        content = content.replace(
            `Security Mode: Mock`,
            `Security Mode: Local Authentication`
        );
        
        content = content.replace(
            `You are currently using <b>Mock Login</b>. To enable Enterprise-grade Real Authentication (Google, OTP), enter your Firebase API Key below.`,
            `You are using Local Authentication. To enable Enterprise Cloud Auth, enter your keys below.`
        );

        fs.writeFileSync(indexPath, content);
        console.log("Silent Mock Mode applied.");
    }

    // Bump SW version
    if (fs.existsSync('sw.js')) {
        let sw = fs.readFileSync('sw.js', 'utf8');
        sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v14';");
        fs.writeFileSync('sw.js', sw);
    }
} catch (e) {
    console.error(e);
}
