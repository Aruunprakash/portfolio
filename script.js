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
        threshold: 0.1 // More sensitive threshold
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
    const fadeElements = document.querySelectorAll('.reveal-on-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });


    // Scroll Effects (Progress Bar & Parallax Background)
    const progressBar = document.querySelector('.scroll-progress');
    const scrollContainerForEffects = document.querySelector('.scroll-container');

    scrollContainerForEffects.addEventListener('scroll', () => {
        const scrollTop = scrollContainerForEffects.scrollTop;
        const scrollHeight = scrollContainerForEffects.scrollHeight - scrollContainerForEffects.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        // Update Progress Bar
        if (progressBar) progressBar.style.width = scrollPercent + '%';

        // Parallax Background Shift
        const move = scrollTop * 0.05;
        document.body.style.backgroundPosition = `0px ${move}px`;
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

    // Back to Top Logic
    const backToTopBtn = document.getElementById("back-to-top");
    const scrollContainerForBtn = document.querySelector('.scroll-container');
    
    if (backToTopBtn && scrollContainerForBtn) {
        scrollContainerForBtn.addEventListener('scroll', () => {
            if (scrollContainerForBtn.scrollTop > 500) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        });

        backToTopBtn.addEventListener('click', () => {
            scrollContainerForBtn.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
