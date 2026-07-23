// premium-ux.js
// Adds micro-interactions like Magnetic Buttons and Ripples

document.addEventListener('DOMContentLoaded', () => {
    // 1. Magnetic Buttons (Desktop Only)
    if (window.innerWidth >= 1024) {
        const magneticElements = document.querySelectorAll('.nav-btn, .trade-btn, .mobile-nav-btn');
        
        magneticElements.forEach(btn => {
            btn.classList.add('magnetic-btn');
            
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Slight pull towards cursor
                btn.style.transform = \`translate(\${x * 0.2}px, \${y * 0.2}px)\`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // 2. Ripple Effect on Click
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button, .panel, .glass-panel, .nav-item');
        if (!target) return;

        // Create ripple element
        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        const rect = target.getBoundingClientRect();
        
        // Calculate click position relative to the element
        const x = e.clientX - rect.left - radius;
        const y = e.clientY - rect.top - radius;

        circle.style.width = circle.style.height = \`\${diameter}px\`;
        circle.style.left = \`\${x}px\`;
        circle.style.top = \`\${y}px\`;
        circle.classList.add('ripple');

        // Remove old ripples to prevent DOM buildup
        const ripple = target.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }

        // Must be position relative or absolute for ripple to be contained
        const currentPosition = window.getComputedStyle(target).position;
        if (currentPosition === 'static') {
            target.style.position = 'relative';
        }
        target.style.overflow = 'hidden';

        target.appendChild(circle);
        
        // Cleanup after animation
        setTimeout(() => {
            circle.remove();
        }, 600);
    });
});
