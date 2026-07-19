const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Update Sidebar Nav
    const sidebarTradeBtn = '<button class="nav-btn active" data-page="page-trade"><i class="fas fa-chart-line"></i>\r\n                    <span>Trade</span></button>';
    const sidebarTradeBtnAlt = '<button class="nav-btn active" data-page="page-trade"><i class="fas fa-chart-line"></i>\n                    <span>Trade</span></button>';
    
    const newSidebarDashboard = `
                <button class="nav-btn active" data-page="page-dashboard"><i class="fas fa-chart-pie"></i>\n                    <span>Dashboard</span></button>
                <button class="nav-btn" data-page="page-trade"><i class="fas fa-chart-line"></i>\n                    <span>Trade</span></button>`;
    
    if (content.includes(sidebarTradeBtn)) {
        content = content.replace(sidebarTradeBtn, newSidebarDashboard);
    } else if (content.includes(sidebarTradeBtnAlt)) {
        content = content.replace(sidebarTradeBtnAlt, newSidebarDashboard);
    }

    // 2. Update Mobile Nav
    const mobileTradeBtn = '<button class="mobile-nav-btn active" onclick="switchPage(\'page-trade\'); updateMobileNav(this)">';
    const newMobileDashboard = `
            <button class="mobile-nav-btn active" onclick="switchPage('page-dashboard'); updateMobileNav(this)">
                <i class="fas fa-chart-pie"></i><span>Dash</span>
            </button>
            <button class="mobile-nav-btn" onclick="switchPage('page-trade'); updateMobileNav(this)">`;
    content = content.replace(mobileTradeBtn, newMobileDashboard);

    // 3. Inject Dashboard Page HTML
    const pageTradeStart = '<div class="page active" id="page-trade">';
    const dashboardHTML = `
            <div class="page active" id="page-dashboard">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    <!-- Overview Card -->
                    <div class="panel" style="padding: 25px; background: linear-gradient(145deg, var(--panel-bg), rgba(37,99,235,0.05)); border: 1px solid rgba(37,99,235,0.2);">
                        <h3 style="color: var(--text-muted); font-size: 1rem; margin-bottom: 10px; font-weight: 600;"><i class="fas fa-wallet" style="margin-right: 8px;"></i> Account Summary</h3>
                        <div style="font-size: 2.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 5px; font-family: 'Space Grotesk', sans-serif;" id="dash-networth">$0.00</div>
                        <div style="color: var(--color-up); font-weight: 600; font-size: 1.1rem;"><i class="fas fa-arrow-up"></i> Live Performance Active</div>
                        <div style="margin-top: 25px; display: flex; gap: 15px;">
                            <button class="buy-btn" onclick="switchPage('page-trade')" style="flex:1; padding: 12px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,255,136,0.2);">Start Trading</button>
                            <button class="sell-btn" onclick="addFreeCash()" style="flex:1; padding: 12px; font-weight: 700; border-radius: 12px; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-color);">+ Add Cash</button>
                        </div>
                    </div>

                    <!-- Auth Configurator -->
                    <div class="panel" style="padding: 25px; border: 1px solid var(--accent); background: rgba(37, 99, 235, 0.05);">
                        <h3 style="color: var(--text-main); font-size: 1.3rem; margin-bottom: 12px;"><i class="fas fa-shield-alt" style="color: var(--accent); margin-right: 8px;"></i> Security Mode: Mock</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5;">You are currently using <b>Mock Login</b>. To enable Enterprise-grade Real Authentication (Google, OTP), enter your Firebase API Key below.</p>
                        <input type="text" id="firebase-key-input" class="auth-input" placeholder="Enter Firebase API Key..." style="margin-bottom: 15px; background: rgba(0,0,0,0.4);">
                        <button class="nav-btn" onclick="saveFirebaseConfig()" style="width: 100%; justify-content: center; background: var(--accent); color: #fff; padding: 12px; border-radius: 12px; font-weight: 600;">Activate Real Mode <i class="fas fa-bolt" style="margin-left: 5px;"></i></button>
                    </div>
                </div>

                <!-- Live Crypto APIs -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; margin-top: 35px;">
                    <h2 style="font-size: 1.6rem; font-weight: 700;"><i class="fas fa-chart-line" style="color: var(--accent); margin-right: 10px;"></i> Live Market Movers</h2>
                    <span style="font-size: 0.85rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 20px;"><i class="fas fa-circle" style="color: var(--color-up); font-size: 0.6rem; margin-right: 5px;"></i> CoinGecko API Connected</span>
                </div>
                
                <div id="coingecko-widgets" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                    <!-- Populated by JS -->
                    <div class="panel" style="padding: 30px; text-align: center; color: var(--text-muted); font-weight: 600;"><i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--accent); margin-bottom: 15px; display: block;"></i> Fetching Global Markets...</div>
                </div>
            </div>

            <div class="page" id="page-trade">`;
    content = content.replace(pageTradeStart, dashboardHTML);

    // 4. Inject JS logic before closing body
    const jsLogic = `
    <!-- Dashboard APIs & Real Auth Enforcer -->
    <script>
        window.saveFirebaseConfig = function() {
            const key = document.getElementById('firebase-key-input').value.trim();
            if(key.length < 20) return showToast("Invalid API Key. Must be a valid Firebase Key.", "error");
            localStorage.setItem('firebase_real_key', key);
            showToast("Real Authentication Activated! Rebooting system...", "success");
            setTimeout(() => location.reload(), 1500);
        }

        async function fetchCoinGeckoData() {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin&vs_currencies=usd&include_24hr_change=true');
                const data = await res.json();
                
                let html = '';
                const icons = {
                    bitcoin: 'fab fa-bitcoin',
                    ethereum: 'fab fa-ethereum',
                    solana: 'fas fa-sun',
                    ripple: 'fas fa-water',
                    cardano: 'fas fa-cube',
                    dogecoin: 'fas fa-dog'
                };
                
                for(let coin in data) {
                    const price = data[coin].usd;
                    const change = data[coin].usd_24h_change;
                    const color = change >= 0 ? 'var(--color-up)' : 'var(--color-down)';
                    const arrow = change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                    const iconClass = icons[coin] || 'fas fa-coins';
                    
                    html += \`
                        <div class="panel" onclick="switchPage('page-trade')" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.3s; border-left: 4px solid \${color};" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--text-main);">
                                    <i class="\${iconClass}"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 700; font-size: 1.1rem; text-transform: capitalize;">\${coin}</div>
                                    <div style="color: var(--text-muted); font-size: 0.85rem;">24h Market</div>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 700; font-size: 1.15rem; font-family: 'Space Grotesk', sans-serif;">$\${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</div>
                                <div style="color: \${color}; font-weight: 600; font-size: 0.9rem; margin-top: 3px;"><i class="fas \${arrow}"></i> \${Math.abs(change).toFixed(2)}%</div>
                            </div>
                        </div>
                    \`;
                }
                if(document.getElementById('coingecko-widgets')) {
                    document.getElementById('coingecko-widgets').innerHTML = html;
                }
            } catch(e) {
                console.error("CoinGecko API Error", e);
            }
        }

        // Initialize Dashboard Loop
        setInterval(() => {
            const nwEl = document.getElementById('dash-networth');
            if(nwEl && typeof state !== 'undefined') {
                nwEl.innerText = '$' + (state.cash + getPortfolioValue()).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            }
        }, 1000);

        // Fetch API when logged in
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(fetchCoinGeckoData, 2000);
            // Refresh API every 30 seconds
            setInterval(fetchCoinGeckoData, 30000);
        });
    </script>
</body>`;
    content = content.replace('</body>', jsLogic);

    fs.writeFileSync('index.html', content);

    // Bump SW version to v9
    let sw = fs.readFileSync('sw.js', 'utf8');
    sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v9';");
    fs.writeFileSync('sw.js', sw);

    console.log("Dashboard and Real APIs Built Successfully!");
} catch (e) {
    console.error(e);
}
