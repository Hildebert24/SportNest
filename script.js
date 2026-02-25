/* ========================================
   SPORTNEST – Parallax Scroll Logic
   ======================================== */

(function () {
    'use strict';

    // === DOM References ===
    const section = document.getElementById('hero-parallax');
    const frau = document.getElementById('img-frau');
    const junge = document.getElementById('img-junge');
    const mann = document.getElementById('img-mann');
    const oma = document.getElementById('img-oma');
    const scrollInd = document.getElementById('scroll-indicator');
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelector('.nav-links');

    const textPhases = [
        document.getElementById('text-phase-0'),
        document.getElementById('text-phase-1'),
        document.getElementById('text-phase-2'),
    ];

    // === Scroll Progress (0.0 – 1.0) within the parallax section ===
    function getScrollProgress() {
        const rect = section.getBoundingClientRect();
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        if (scrollableHeight <= 0) return 0;
        return Math.max(0, Math.min(1, -rect.top / scrollableHeight));
    }

    // === Clamp helper ===
    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    // === Easing: smooth start/end ===
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // === Update Parallax ===
    function updateParallax() {
        const p = getScrollProgress();

        // --- Scroll Indicator: fade out after 5% scroll ---
        if (scrollInd) {
            scrollInd.classList.toggle('hidden', p > 0.05);
        }

        // --- Nav scrolled state ---
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }

        // --- PHASE 1: 0.0 – 0.5 → Junge raus (rechts), Mann rein (von rechts) ---
        if (p <= 0.5) {
            const t = easeInOutCubic(clamp(p / 0.5, 0, 1));

            // Junge: slide right + fade out
            junge.style.transform = `translateX(${t * 100}%)`;
            junge.style.opacity = 1 - t;

            // Mann: slide in from right + fade in
            mann.style.transform = `translateX(${(1 - t) * 100}%)`;
            mann.style.opacity = t;

            // Frau: stays centered
            frau.style.transform = 'translateX(0)';
            frau.style.opacity = 1;

            // Oma: stays hidden (left)
            oma.style.transform = 'translateX(-100%)';
            oma.style.opacity = 0;

        } else {
            // --- PHASE 2: 0.5 – 1.0 → Frau raus (links), Oma rein (von links) ---
            const t = easeInOutCubic(clamp((p - 0.5) / 0.5, 0, 1));

            // Junge: stays gone
            junge.style.transform = 'translateX(100%)';
            junge.style.opacity = 0;

            // Mann: stays visible
            mann.style.transform = 'translateX(0)';
            mann.style.opacity = 1;

            // Frau: slide left + fade out
            frau.style.transform = `translateX(${-t * 100}%)`;
            frau.style.opacity = 1 - t;

            // Oma: slide in from left + fade in
            oma.style.transform = `translateX(${-(1 - t) * 100}%)`;
            oma.style.opacity = t;
        }

        // --- Text phase switching ---
        let activePhase;
        if (p < 0.2) {
            activePhase = 0;
        } else if (p < 0.7) {
            activePhase = 1;
        } else {
            activePhase = 2;
        }

        textPhases.forEach((el, i) => {
            if (i === activePhase) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    // === Throttled Scroll & Resize Handler ===
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateParallax();
                updateFormt();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateParallax();
                updateFormt();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ==========================================================
    //  FORMT SCROLL ANIMATION
    //  Letters F-O-R-M-T spread apart on scroll, revealing
    //  full words: Fitness, Organisation, Rehabilitation,
    //  Motivation, Training
    // ==========================================================

    const formtSection = document.getElementById('vision');
    const formtWords = document.querySelectorAll('.formt-word');
    const formtRow = document.getElementById('formt-row');
    const silhouettes = document.querySelectorAll('.silhouette');
    const descField = document.getElementById('formt-description');
    const descText = document.getElementById('formt-desc-text');
    const formtTagline = document.getElementById('formt-tagline');
    const formtMission = document.getElementById('formt-mission');

    function getFormtProgress() {
        if (!formtSection) return 0;
        const rect = formtSection.getBoundingClientRect();
        const scrollableHeight = formtSection.offsetHeight - window.innerHeight;
        if (scrollableHeight <= 0) return 0;
        return clamp(-rect.top / scrollableHeight, 0, 1);
    }

    function updateFormt() {
        if (!formtSection || !formtRow) return;

        const p = getFormtProgress();

        // Phase breakdown:
        // 0.0 – 0.6  → Letters spread apart (gap grows)
        // 0.3 – 0.8  → Rest of words fade in (max-width grows)
        // 0.8 – 1.0  → Arrows appear, words become clickable

        // --- Tagline: visible once scrolled into the section (p >= 0.02) ---
        if (formtTagline) {
            if (p >= 0.02) {
                formtTagline.classList.add('visible');
            } else {
                formtTagline.classList.remove('visible');
            }
        }

        // --- Mission text: visible once FORMT is fully revealed (p > 0.85) ---
        if (formtMission) {
            if (p > 0.85) {
                formtMission.classList.add('visible');
            } else {
                formtMission.classList.remove('visible');
            }
        }

        // --- Letter gap (spacing between word containers) ---
        var gapProgress = easeInOutCubic(clamp(p / 0.6, 0, 1));
        var maxGap = 2; // vw
        formtRow.style.gap = (gapProgress * maxGap) + 'vw';

        // --- Word rest reveal ---
        var restProgress = clamp((p - 0.3) / 0.5, 0, 1);
        var easedRest = easeInOutCubic(restProgress);

        formtWords.forEach(function (word) {
            var rest = word.querySelector('.formt-rest');
            var inner = word.querySelector('.formt-rest-inner');
            var arrow = word.querySelector('.formt-arrow');

            if (rest && inner) {
                // Instantly mathematically measure the exact current width of the unconstrained inner span
                var measuredWidth = inner.offsetWidth;

                rest.style.maxWidth = (easedRest * measuredWidth) + 'px';
                rest.style.opacity = easedRest;

                if (easedRest > 0.95) {
                    rest.classList.add('revealed');
                } else {
                    rest.classList.remove('revealed');
                }
            }

            // --- Arrow visibility ---
            if (arrow) {
                if (p > 0.8) {
                    arrow.classList.add('visible');
                } else {
                    arrow.classList.remove('visible');
                }
            }
        });

        // --- Silhouette animation: stagger reveal based on scroll ---
        silhouettes.forEach(function (sil, i) {
            // Each silhouette fades in at a different scroll point
            var silStart = 0.1 + (i * 0.15); // stagger: 0.10, 0.25, 0.40
            if (p >= silStart) {
                sil.classList.add('active');
            } else {
                sil.classList.remove('active');
            }
        });

        // Hide description field if words aren't fully revealed
        if (p < 0.8 && descField) {
            descField.classList.remove('visible');
            formtWords.forEach(function (w) { w.classList.remove('active'); });
        }
    }

    // === FORMT Word Click/Touch Handling ===
    // When a word is clicked/tapped, show its description in the shared field below
    function handleWordClick(e) {
        e.preventDefault();
        e.stopPropagation();

        var clickedWord = e.currentTarget;
        var desc = clickedWord.getAttribute('data-desc');
        if (!desc || !descField || !descText) return;

        // If this word is already active, deactivate it
        if (clickedWord.classList.contains('active')) {
            clickedWord.classList.remove('active');
            descField.classList.remove('visible');
            return;
        }

        // Deactivate all words, then activate the clicked one
        formtWords.forEach(function (w) { w.classList.remove('active'); });
        clickedWord.classList.add('active');

        // Update and show description
        descText.textContent = desc;
        descField.classList.add('visible');
    }

    // Attach click AND touch event to each word
    formtWords.forEach(function (word) {
        word.addEventListener('click', handleWordClick);
        // For iPad/touch: use touchend instead of touchstart to avoid scroll conflicts
        word.addEventListener('touchend', function (e) {
            // Only handle if it wasn't a scroll gesture
            e.preventDefault();
            handleWordClick(e);
        });
    });

    // Close description when clicking outside the FORMT content area
    document.addEventListener('click', function (e) {
        if (descField && descField.classList.contains('visible')) {
            var formtContent = document.querySelector('.formt-content');
            if (formtContent && !formtContent.contains(e.target)) {
                descField.classList.remove('visible');
                formtWords.forEach(function (w) { w.classList.remove('active'); });
            }
        }
    });

    // === Mobile Hamburger Menu ===
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            // Animate hamburger lines
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
    }

    // === Praxis Render Scroll Reveal ===
    var praxisRender = document.getElementById('praxis-render');
    if (praxisRender) {
        var praxisObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    praxisObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        praxisObserver.observe(praxisRender);
    }

    // === Initialize on load ===
    updateParallax();
    updateFormt();

})();
