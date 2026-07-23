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
    const dotNav = document.getElementById('dot-nav');
    const dotLinks = dotNav ? dotNav.querySelectorAll('.dot') : [];

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

                // 3. Vertical dot navigator: active dot + white-on-blue contrast
                if (dotNav) {
                    dotLinks.forEach(d => {
                        d.classList.toggle('active', d.getAttribute('href') === `#${id}`);
                    });
                    dotNav.classList.toggle('on-dark', id === 'cover' || id === 'contact');
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

            // Keyboard access for the role="button" ovals: Enter / Space activate.
            oval.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    oval.click();
                }
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

    const revealElements = document.querySelectorAll('.section-kicker, .experience-card, .project-card, .publication-box, .cert-item, .edu-item, .skills-category, .contact-left-info, .toc-item, .skill-tag, .social-square-btn');

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

    // Slot-machine reveal for the hero "PORTFOLIO" word. Each letter
    // becomes a reel that rolls through random letters and snaps onto
    // the real one, left-to-right. Built now (while the hero is still
    // hidden), then spun when .hero-loaded fires below.
    let runSlot = () => {};
    const slotEl = document.querySelector('.hero-slot');
    if (slotEl) {
        const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const word = (slotEl.textContent || '').trim();
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        slotEl.setAttribute('aria-label', word); // keep it readable while scrambled
        slotEl.textContent = '';

        const reels = [];
        [...word].forEach((ch) => {
            const reel = document.createElement('span');
            reel.className = 'slot-reel';
            reel.setAttribute('aria-hidden', 'true');

            const strip = document.createElement('span');
            strip.className = 'slot-strip';

            // A run of random letters, then the real one last.
            const count = 16 + Math.floor(Math.random() * 10); // 16–25 spins
            let cells = '';
            for (let i = 0; i < count; i++) {
                cells += `<span>${ALPHA[Math.floor(Math.random() * 26)]}</span>`;
            }
            cells += `<span>${ch}</span>`;
            strip.innerHTML = cells;

            // Percentage (of the strip's own height) needed to bring the
            // last cell into the window — unit-safe across font sizes.
            const restPct = (count / (count + 1)) * 100;
            strip.style.transform = `translate(-50%, -${restPct}%)`; // settle here by default

            const sizer = document.createElement('span');
            sizer.className = 'slot-sizer';
            sizer.textContent = ch;

            reel.appendChild(strip);
            reel.appendChild(sizer);
            slotEl.appendChild(reel);
            reels.push({ strip, restPct });
        });

        runSlot = () => {
            if (prefersReduced) return; // strips already rest on the real letters
            reels.forEach(({ strip, restPct }, i) => {
                strip.animate(
                    [
                        { transform: 'translate(-50%, 0)', filter: 'blur(1.4px)' },
                        { filter: 'blur(0.6px)', offset: 0.85 },
                        { transform: `translate(-50%, -${restPct}%)`, filter: 'blur(0)' }
                    ],
                    {
                        duration: 1100 + i * 120,
                        delay: 450 + i * 130,
                        easing: 'cubic-bezier(0.16, 0.9, 0.2, 1)',
                        fill: 'both'
                    }
                );
            });
        };
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Scroll progress bar: width tracks how far down the page we are.
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        let progressTicking = false;
        const updateProgress = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progressBar.style.width = pct + '%';
            progressTicking = false;
        };
        window.addEventListener('scroll', () => {
            if (!progressTicking) {
                progressTicking = true;
                requestAnimationFrame(updateProgress);
            }
        }, { passive: true });
        updateProgress();
    }

    // --- Section titles: wipe in (left-to-right) as each enters view.
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('title-in');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));

    // --- Stat counters: count up from 0 the first time they're seen.
    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        if (prefersReducedMotion) { el.textContent = target + suffix; return; }
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const statsBlock = document.querySelector('.profile-stats');
    if (statsBlock) {
        // Reset to 0 now (JS is on) so the count-up starts from zero;
        // the HTML keeps real numbers as a no-JS fallback.
        statsBlock.querySelectorAll('.stat-num').forEach(el => { el.textContent = '0'; });
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-num').forEach(animateCount);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statObserver.observe(statsBlock);
    }

    // --- 3D tilt: cards lean toward the cursor, then settle on leave.
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.experience-card, .project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform =
                    `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // --- Magnetic buttons: gently pull toward the cursor, snap back on leave.
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.contact-email-cta, .social-square-btn').forEach(btn => {
            const strength = 0.35;
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width / 2)) * strength;
                const dy = (e.clientY - (r.top + r.height / 2)) * strength;
                btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // --- Rotating role text in the hero footer (flip through titles).
    const roleEl = document.getElementById('hero-role');
    if (roleEl && !prefersReducedMotion) {
        const roles = ['AI / ML FRESHER', 'DATA ANALYST', 'ML ENGINEER', 'PYTHON DEV'];
        let roleIndex = 0;
        setInterval(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            roleEl.classList.add('role-out');       // flip current word out
            setTimeout(() => {
                roleEl.textContent = roles[roleIndex];
                roleEl.classList.remove('role-out'); // flip new word in
            }, 320);
        }, 2600);
    }

    // --- Live local clock for Calicut (IST / Asia/Kolkata).
    const clockEl = document.getElementById('calicut-clock');
    if (clockEl) {
        const tick = () => {
            clockEl.textContent = new Date().toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        };
        tick();
        setInterval(tick, 1000);
    }

    // --- Email CTA: open the mail client AND copy the address to the
    // clipboard with a visible confirmation, so the button always does
    // something useful even when no default mail app is configured
    // (that's the common "the mail button doesn't work" case). Confetti
    // fires too, unless reduced-motion is requested.
    const emailCta = document.querySelector('.contact-email-cta');
    if (emailCta) {
        const COLORS = ['#0020f5', '#ffffff', '#000000', '#00f5d4'];
        const emailAddr = (emailCta.getAttribute('href') || '').replace('mailto:', '').split('?')[0];
        const label = emailCta.querySelector('span:not(.contact-email-cta-arrow)');

        const copyEmail = async () => {
            try {
                await navigator.clipboard.writeText(emailAddr);
                return true;
            } catch (e) {
                // Fallback for insecure contexts (e.g. file://) where the
                // async Clipboard API is blocked.
                try {
                    const ta = document.createElement('textarea');
                    ta.value = emailAddr;
                    ta.style.cssText = 'position:fixed;top:-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    const ok = document.execCommand('copy');
                    ta.remove();
                    return ok;
                } catch (_) { return false; }
            }
        };

        const showCopied = async () => {
            if (!label || emailCta.dataset.copied === '1') return;
            const ok = await copyEmail();
            const original = label.textContent;
            emailCta.dataset.copied = '1';
            emailCta.classList.add('copied');
            label.textContent = ok ? 'Copied to clipboard ✓' : emailAddr;
            setTimeout(() => {
                label.textContent = original;
                emailCta.classList.remove('copied');
                delete emailCta.dataset.copied;
            }, 1700);
        };

        const burst = () => {
            const r = emailCta.getBoundingClientRect();
            const originX = r.left + r.width / 2;
            const originY = r.top + r.height / 2;
            for (let i = 0; i < 34; i++) {
                const piece = document.createElement('span');
                piece.className = 'confetti-piece';
                piece.style.background = COLORS[i % COLORS.length];
                document.body.appendChild(piece);
                const angle = Math.random() * Math.PI * 2;
                const dist = 90 + Math.random() * 160;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist - 60; // bias upward
                piece.animate(
                    [
                        { transform: `translate(${originX}px, ${originY}px) rotate(0deg)`, opacity: 1 },
                        { transform: `translate(${originX + dx}px, ${originY + dy + 220}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
                    ],
                    { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)', fill: 'forwards' }
                ).onfinish = () => piece.remove();
            }
        };

        emailCta.addEventListener('click', () => {
            showCopied();                       // copy + confirm (mailto still fires)
            if (!prefersReducedMotion) burst(); // celebratory confetti
        });
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('hero-loaded');
            runSlot();
        });
    });
});