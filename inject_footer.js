const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    const footerHTML = `
        <!-- FAQ Section -->
        <section style="padding: 80px 20px; max-width: 800px; margin: 0 auto; color: var(--text-main);">
            <h2 style="text-align: center; margin-bottom: 40px; font-size: 2.5rem; font-weight: 700;">Frequently Asked Questions</h2>
            
            <details style="margin-bottom: 15px; background: var(--panel-bg); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer;">
                <summary style="font-weight: 600; font-size: 1.1rem; outline: none; padding-left: 10px;">Is this real money?</summary>
                <p style="margin-top: 15px; color: var(--text-muted); line-height: 1.6; padding-left: 10px;">No, ApexTrade Pro is a 100% risk-free paper trading simulator. You trade with virtual $10,000, but the market data is real-time from Binance.</p>
            </details>

            <details style="margin-bottom: 15px; background: var(--panel-bg); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer;">
                <summary style="font-weight: 600; font-size: 1.1rem; outline: none; padding-left: 10px;">Are the charts live?</summary>
                <p style="margin-top: 15px; color: var(--text-muted); line-height: 1.6; padding-left: 10px;">Yes! We use advanced TradingView widget integration with real-time WebSocket connections to display the exact live market prices.</p>
            </details>
        </section>

        <!-- Polished Footer -->
        <footer style="background: var(--bg-color); border-top: 1px solid var(--border-color); padding: 60px 20px 30px; text-align: center; color: var(--text-muted);">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 30px; text-align: left; margin-bottom: 40px;">
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: var(--text-main); font-size: 1.5rem; font-weight: 700; margin-bottom: 15px;">ApexTrade Pro</h3>
                    <p style="line-height: 1.6; max-width: 300px;">The ultimate cryptocurrency paper trading simulator. Built for learning, analyzing, and mastering the markets risk-free.</p>
                </div>
                <div style="flex: 1; min-width: 150px;">
                    <h4 style="color: var(--text-main); font-weight: 600; margin-bottom: 15px;">Links</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px;"><a href="#" style="color: inherit; text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">Terminal</a></li>
                        <li style="margin-bottom: 10px;"><a href="#" style="color: inherit; text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">Academy</a></li>
                        <li style="margin-bottom: 10px;"><a href="#" style="color: inherit; text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">Login</a></li>
                    </ul>
                </div>
            </div>
            <p style="font-size: 0.9rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">&copy; 2026 ApexTrade Pro. All rights reserved.</p>
        </footer>
    </div>
    <!-- Login Screen Overlay -->
`;

    if (!content.includes('<!-- Polished Footer -->')) {
        content = content.replace('    </div>\r\n\r\n    <!-- Login Screen Overlay -->', footerHTML);
        content = content.replace('    </div>\n\n    <!-- Login Screen Overlay -->', footerHTML);
    }

    fs.writeFileSync('index.html', content);
    console.log("Footer Injected Successfully");

} catch (e) {
    console.error(e);
}
