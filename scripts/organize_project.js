const fs = require('fs');
const path = require('path');

try {
    // 1. Create Directories
    const dirs = ['assets', 'js', 'scripts'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    });

    // 2. Move Scripts
    const scriptFiles = [
        'add_premium_libs.js',
        'build_dashboard.js',
        'deploy.js',
        'inject_footer.js',
        'integrate_otp.js',
        'rebuild_auth.js',
        'update.js'
    ];
    
    scriptFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.renameSync(file, path.join('scripts', file));
        }
    });

    // 3. Move firebase-config.js
    if (fs.existsSync('firebase-config.js')) {
        fs.renameSync('firebase-config.js', path.join('js', 'firebase-config.js'));
    }

    // 4. Move logo.png
    if (fs.existsSync('logo.png')) {
        fs.renameSync('logo.png', path.join('assets', 'logo.png'));
    }

    // 5. Update index.html
    if (fs.existsSync('index.html')) {
        let html = fs.readFileSync('index.html', 'utf8');
        // Replace logo.png with assets/logo.png
        html = html.replace(/src="logo\.png"/g, 'src="assets/logo.png"');
        html = html.replace(/href="logo\.png"/g, 'href="assets/logo.png"');
        // Replace firebase-config.js with js/firebase-config.js
        html = html.replace(/src="firebase-config\.js"/g, 'src="js/firebase-config.js"');
        fs.writeFileSync('index.html', html);
    }

    // 6. Update manifest.json
    if (fs.existsSync('manifest.json')) {
        let manifest = fs.readFileSync('manifest.json', 'utf8');
        manifest = manifest.replace(/"src": "logo\.png"/g, '"src": "assets/logo.png"');
        manifest = manifest.replace(/"src": "\/logo\.png"/g, '"src": "/assets/logo.png"');
        fs.writeFileSync('manifest.json', manifest);
    }

    // 7. Update sw.js
    if (fs.existsSync('sw.js')) {
        let sw = fs.readFileSync('sw.js', 'utf8');
        sw = sw.replace(/'\.\/logo\.png'/g, "'./assets/logo.png'");
        sw = sw.replace(/'\.\/firebase-config\.js'/g, "'./js/firebase-config.js'");
        // Bump version
        sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v12';");
        fs.writeFileSync('sw.js', sw);
    }

    console.log("Project folder organized successfully!");

} catch (e) {
    console.error("Error organizing project:", e);
}
