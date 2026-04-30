// Disable native scroll restoration before DOM loads
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Remove URL hash on load to prevent browser from jumping to sections
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }

    // Force scroll container to top
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;

        // Also reset on beforeunload so the browser saves state as 0
        window.addEventListener('beforeunload', () => {
            scrollContainer.scrollTop = 0;
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: document.querySelector('.scroll-container'),
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated in
                // observer.unobserve(entry.target);
            } else {
                // Remove to allow re-animating when scrolling back up
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Changing Text Logic
    const changingText = document.querySelector('.changing-text');
    if (changingText) {
        const words = ["DATA SCIENCE", "MACHINE LEARNING"];
        let wordIndex = 0;
        setInterval(() => {
            changingText.style.opacity = 0;
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                changingText.textContent = words[wordIndex];
                changingText.style.opacity = 1;
            }, 500);
        }, 3000);
    }
});
