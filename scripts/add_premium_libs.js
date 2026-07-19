const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Inject CDNs into <head>
    const cdnInjections = `
    <!-- GSAP for Animations -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <!-- Chart.js for Portfolio Graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>`;
    if (!content.includes('gsap.min.js')) {
        content = content.replace('</head>', cdnInjections);
    }

    // 2. Inject Canvas into Dashboard Overview Panel
    const dashOverviewEnd = `                            <button class="buy-btn" onclick="switchPage('page-trade')" style="flex:1; padding: 12px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,255,136,0.2);">Start Trading</button>
                            <button class="sell-btn" onclick="addFreeCash()" style="flex:1; padding: 12px; font-weight: 700; border-radius: 12px; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-color);">+ Add Cash</button>
                        </div>`;
    
    const dashOverviewEndWithChart = `                            <button class="buy-btn" onclick="switchPage('page-trade')" style="flex:1; padding: 12px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,255,136,0.2);">Start Trading</button>
                            <button class="sell-btn" onclick="addFreeCash()" style="flex:1; padding: 12px; font-weight: 700; border-radius: 12px; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-color);">+ Add Cash</button>
                        </div>
                        <div style="margin-top: 25px; height: 140px; width: 100%; position: relative;">
                            <canvas id="portfolio-chart"></canvas>
                        </div>`;
                        
    if (content.includes(dashOverviewEnd) && !content.includes('id="portfolio-chart"')) {
        content = content.replace(dashOverviewEnd, dashOverviewEndWithChart);
    }

    // 3. Inject JS Logic before </body>
    const jsLogic = `
    <!-- Premium Libraries Initialization -->
    <script>
        // Initialize Lucide Icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // GSAP Animations - Landing Page
        document.addEventListener("DOMContentLoaded", (event) => {
            if (typeof gsap !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                
                // Landing page animations
                if(document.querySelector('.hero-title')) {
                    gsap.from(".hero-title", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
                    gsap.from(".hero-subtitle", { duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
                    gsap.from(".lp-cta-btn", { duration: 1, y: 30, opacity: 0, ease: "power3.out", delay: 0.4 });
                    
                    // Feature cards stagger
                    if(document.querySelector('.features-grid')) {
                        gsap.from(".feature-card", {
                            scrollTrigger: { trigger: ".features-grid", start: "top 80%" },
                            duration: 0.8, y: 50, opacity: 0, stagger: 0.2, ease: "back.out(1.7)"
                        });
                    }
                }
            }
        });

        // Hook into enterTerminal to animate dashboard entry
        const _originalEnterTerminal = window.enterTerminal;
        window.enterTerminal = function() {
            if(_originalEnterTerminal) _originalEnterTerminal();
            
            // Wait for DOM to show dashboard
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.from("#page-dashboard .panel", {
                        duration: 0.8,
                        y: 40,
                        opacity: 0,
                        stagger: 0.15,
                        ease: "power4.out"
                    });
                }
                renderPortfolioChart();
            }, 100);
        };

        // Chart.js Setup
        let pfChart = null;
        function renderPortfolioChart() {
            const ctx = document.getElementById('portfolio-chart');
            if(!ctx || typeof Chart === 'undefined') return;
            
            // Create dummy upward trend data for visual appeal
            const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const dataPts = [8000, 8500, 8200, 9100, 9500, 9300, 10000];
            
            // Gradient fill
            const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 150);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

            if(pfChart) pfChart.destroy();
            
            pfChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Net Worth',
                        data: dataPts,
                        borderColor: '#00ff88',
                        borderWidth: 3,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4, // Smooth curve
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#00ff88',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(26, 31, 46, 0.9)',
                            titleColor: '#8892b0',
                            bodyColor: '#fff',
                            borderColor: '#2563eb',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false, min: 7000 }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        }
        
        // Re-render chart on window resize
        window.addEventListener('resize', () => {
            if(pfChart) pfChart.resize();
        });
    </script>
</body>`;
    
    if (!content.includes('// Initialize Lucide Icons')) {
        content = content.replace('</body>', jsLogic);
    }

    fs.writeFileSync('index.html', content);

    // Bump SW version to v10
    let sw = fs.readFileSync('sw.js', 'utf8');
    sw = sw.replace(/const CACHE_NAME = 'apextrade-pro-v\d+';/, "const CACHE_NAME = 'apextrade-pro-v10';");
    fs.writeFileSync('sw.js', sw);

    console.log("Premium Libraries and Charts Built Successfully!");
} catch (e) {
    console.error(e);
}
