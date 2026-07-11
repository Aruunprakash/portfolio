// Force page scroll to top on reload/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    const coverSection = document.getElementById('cover');
    if (coverSection) {
        coverSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Force immediate scroll position reset on load
    window.scrollTo(0, 0);

    // Progressive Reveal Enhancement: Add active class to body
    // This activates CSS hidden states for scroll reveals, guaranteeing content visibility even if JS fails
    document.body.classList.add('js-active');

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover expansions for links, buttons, and ovals
        const hoverables = document.querySelectorAll('a, button, .toc-oval-wrapper, .experience-card, .project-card, .skill-tag, .social-square-btn');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Sticky Navigation Dark Mode & Active Links Observer
    const nav = document.getElementById('main-nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Intersection Observer for detecting visible sections
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // 1. Manage Navigation Active State Highlight
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                // 2. Manage Sticky Nav Color Theme (Dark Mode on Blue Backgrounds)
                if (id === 'cover' || id === 'contact') {
                    nav.classList.add('dark-mode');
                } else {
                    nav.classList.remove('dark-mode');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Smooth Scroll for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to Top Circular Button
    const scrollTopBtn = document.getElementById('scroll-to-top-button');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            const coverSection = document.getElementById('cover');
            if (coverSection) {
                coverSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Note: Contact now uses a direct mailto: link (see index.html #contact),
    // so no JS is needed to "send" anything — the visitor's own email client
    // handles it. The old fake form-submission handler has been removed.

    // Table of Contents SVG Interaction
    const ovals = document.querySelectorAll('.toc-oval-wrapper');
    const path = document.querySelector('.toc-path');

    if (ovals && path) {
        ovals.forEach(oval => {
            oval.addEventListener('mouseenter', () => {
                // Speed up dash animation and make path solid blue
                path.style.animationDuration = '8s';
                path.style.strokeWidth = '3.5px';
            });

            oval.addEventListener('mouseleave', () => {
                // Revert to original slow dash
                path.style.animationDuration = '30s';
                path.style.strokeWidth = '2.5px';
            });
        });
    }

    // Scroll animation for reveals — items cascade in ("flow") rather
    // than all popping in at once. Elements sharing a parent (e.g. the
    // 3 experience cards, or a row of skill tags) get an incrementing
    // delay so they animate in sequence as their section enters view.
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.experience-card, .project-card, .publication-box, .cert-item, .edu-item, .skills-category, .contact-left-info, .toc-item, .skill-tag, .social-square-btn');

    const staggerCounters = new Map();
    revealElements.forEach(el => {
        el.classList.add('reveal-item');

        // Count position among reveal-items sharing the same parent,
        // capping the delay so long lists (like skill tags) don't take
        // forever to finish cascading in.
        const parent = el.parentElement;
        const position = staggerCounters.get(parent) || 0;
        staggerCounters.set(parent, position + 1);
        const delayMs = Math.min(position * 70, 420);
        el.style.setProperty('--reveal-delay', `${delayMs}ms`);

        revealObserver.observe(el);
    });

    // Hero load-in: elements start hidden (see CSS) and are sequenced
    // one-by-one via staggered --hero-delay values, triggered once the
    // browser has painted the hidden state (double rAF avoids a flash
    // of fully-visible content before the animation can run).
    const heroLoadItems = document.querySelectorAll('.hero-load-item');
    const heroDelays = [0, 150, 350, 550, 900, 1050, 1300, 1400, 1500];
    heroLoadItems.forEach((el, i) => {
        el.style.setProperty('--hero-delay', `${heroDelays[i] ?? i * 150}ms`);
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('hero-loaded');
        });
    });
});