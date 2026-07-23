// premium-ux.js
// Adds micro-interactions like Ripples

document.addEventListener('DOMContentLoaded', () => {
    // 2. Ripple Effect on Click
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button, .nav-item, .nav-btn, .mobile-nav-btn, .trade-btn, .auth-btn');
        if (!target) return;

        // Create ripple element
        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        const rect = target.getBoundingClientRect();
        
        // Calculate click position relative to the element
        const x = e.clientX - rect.left - radius;
        const y = e.clientY - rect.top - radius;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
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
            if (circle.parentNode === target) {
                circle.remove();
            }
        }, 600);
    });
});
