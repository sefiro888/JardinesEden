/**
 * JARDINES EDÉN - CORE INTERACTIVITY & ANIMATIONS (FAIL-SAFE & CRASH-PROOF)
 * Author: Antigravity Code Assistant
 * Technology: Vanilla JavaScript (ES6+)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    try {
        // Safe addition of js-active class to activate scroll reveal styling safely
        document.body.classList.add('js-active');

        /* ==========================================
           0. PROMO BAR (announcement)
           ========================================== */
        const promoBar = document.getElementById('promo-bar');
        const promoClose = document.getElementById('promo-bar-close');
        const PROMO_DISMISS_KEY = 'jardineseden_promo_dismissed_v1';

        const measurePromo = () => {
            if (!promoBar || promoBar.classList.contains('is-closed')) {
                document.documentElement.style.setProperty('--promo-bar-height', '0px');
                document.body.classList.remove('has-promo');
                return;
            }
            const h = promoBar.offsetHeight;
            document.documentElement.style.setProperty('--promo-bar-height', h + 'px');
            document.body.classList.add('has-promo');
        };

        if (promoBar) {
            // Honor previous dismissal
            if (sessionStorage.getItem(PROMO_DISMISS_KEY) === '1') {
                promoBar.classList.add('is-closed');
            }
            measurePromo();
            window.addEventListener('resize', measurePromo);

            if (promoClose) {
                promoClose.addEventListener('click', () => {
                    promoBar.classList.add('is-closed');
                    try { sessionStorage.setItem(PROMO_DISMISS_KEY, '1'); } catch (_) {}
                    measurePromo();
                });
            }
        }

        /* ==========================================
           1. MOBILE MENU TOGGLE
           ========================================== */
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is active
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            // Close menu when clicking a nav link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }


        /* ==========================================
           2. SCROLLED HEADER EFFECT
           ========================================== */
        const header = document.getElementById('header');
        
        const handleHeaderScroll = () => {
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        };

        window.addEventListener('scroll', handleHeaderScroll);
        handleHeaderScroll(); // Trigger initially on load


        /* ==========================================
           3. REVEAL-ON-SCROLL ANIMATION (INTERSECTION OBSERVER)
           ========================================== */
        const revealElements = document.querySelectorAll('.reveal');

        if ('IntersectionObserver' in window && revealElements.length > 0) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target); // Stop observing once animated
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback for older browsers: show all instantly
            revealElements.forEach(el => el.classList.add('active'));
        }


        /* ==========================================
           4. ACTIVE NAV-LINK ON SCROLL
           ========================================== */
        const sections = document.querySelectorAll('section[id]');
        
        const handleActiveNavLink = () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href') === `index.html#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', handleActiveNavLink);


        /* ==========================================
           5. GALLERY LIGHTBOX / PHOTO VIEWER
           ========================================== */
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

        if (lightbox && lightboxImg && galleryItems.length > 0) {
            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    const title = item.querySelector('.gallery-item-title');
                    const category = item.querySelector('.gallery-item-category');
                    const description = item.querySelector('.gallery-description');

                    if (img) {
                        lightboxImg.src = img.src;
                        lightboxImg.alt = img.alt;
                        
                        // Set caption
                        const titleText = title ? title.textContent : '';
                        const catText = category ? ` (${category.textContent})` : '';
                        const descText = description ? ` - ${description.textContent}` : '';
                        lightboxCaption.textContent = titleText + catText + descText;

                        // Open Lightbox
                        lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden'; // Lock scroll
                    }
                });
            });

            const closeLightbox = () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Unlock scroll
                setTimeout(() => {
                    lightboxImg.src = transparentPixel;
                    lightboxCaption.textContent = '';
                }, 300);
            };

            // Close events
            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // ESC key close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }


        /* ==========================================
           6. WHATSAPP TOOLTIP FLOATING INVITATION
           ========================================== */
        const waTooltip = document.getElementById('wa-tooltip');
        const waTooltipClose = document.getElementById('wa-tooltip-close');

        if (waTooltip) {
            // Close tooltip event
            if (waTooltipClose) {
                waTooltipClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Avoid triggering parent actions
                    waTooltip.classList.remove('active');
                });
            }
        }

        /* ==========================================
           7. REAL TRANSFORMATION PROCESS SLIDER
           ========================================== */
        const processSlider = document.querySelector('[data-process-slider]');

        if (processSlider) {
            const processSlides = Array.from(processSlider.querySelectorAll('.process-slide'));
            const processDots = Array.from(processSlider.querySelectorAll('[data-process-dot]'));
            const processPrev = processSlider.querySelector('[data-process-prev]');
            const processNext = processSlider.querySelector('[data-process-next]');
            let processIndex = 0;

            const showProcessSlide = (nextIndex) => {
                if (!processSlides.length) return;

                processIndex = (nextIndex + processSlides.length) % processSlides.length;

                processSlides.forEach((slide, index) => {
                    slide.classList.toggle('active', index === processIndex);
                });

                processDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === processIndex);
                });
            };

            if (processPrev) {
                processPrev.addEventListener('click', () => showProcessSlide(processIndex - 1));
            }

            if (processNext) {
                processNext.addEventListener('click', () => showProcessSlide(processIndex + 1));
            }

            processDots.forEach((dot, index) => {
                dot.addEventListener('click', () => showProcessSlide(index));
            });

            showProcessSlide(0);
        }

        /* ==========================================
           8. BEFORE & AFTER SLIDER
           ========================================== */

        const beforeAfterSliders = document.querySelectorAll('.slider-container, .mini-slider');

        beforeAfterSliders.forEach(slider => {
            const sliderRange = slider.querySelector('input[type="range"]');

            if (sliderRange) {
                slider.style.setProperty('--slider-pos', `${sliderRange.value}%`);
                sliderRange.addEventListener('input', (e) => {
                    slider.style.setProperty('--slider-pos', `${e.target.value}%`);
                });
            }
        });

        /* ==========================================
           9. ANIMACIÓN DE NÚMEROS (STATS COUNTER)
           ========================================== */
        const statNumbers = document.querySelectorAll('[data-count]');

        if ('IntersectionObserver' in window && statNumbers.length > 0) {
            const countObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.dataset.count, 10);
                        const suffix = el.dataset.suffix || '';
                        const duration = 1600;
                        const startTime = performance.now();

                        const tick = (now) => {
                            const elapsed = now - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Ease out cubic
                            const eased = 1 - Math.pow(1 - progress, 3);
                            el.textContent = Math.round(eased * target) + suffix;
                            if (progress < 1) requestAnimationFrame(tick);
                        };

                        requestAnimationFrame(tick);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.6 });

            statNumbers.forEach(el => countObserver.observe(el));
        }

        /* ==========================================
           10. BANNER DE COOKIES (RGPD)
           ========================================== */
        const COOKIE_CONSENT_KEY = 'jardineseden_cookies_v1';

        if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
            const cookieBanner = document.createElement('div');
            cookieBanner.id = 'cookie-banner';
            cookieBanner.className = 'cookie-banner';
            cookieBanner.setAttribute('role', 'dialog');
            cookieBanner.setAttribute('aria-label', 'Aviso de cookies');
            cookieBanner.innerHTML = `
                <div class="cookie-banner-inner">
                    <div class="cookie-banner-text">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                        <p>Usamos cookies propias para mejorar tu experiencia. Consulta nuestra <a href="politica-privacidad.html" class="cookie-link">política de privacidad</a>.</p>
                    </div>
                    <div class="cookie-banner-actions">
                        <button id="cookie-btn-reject" class="cookie-btn cookie-btn-secondary">Solo esenciales</button>
                        <button id="cookie-btn-accept" class="cookie-btn cookie-btn-primary">Aceptar todo</button>
                    </div>
                </div>`;
            document.body.appendChild(cookieBanner);

            // Animate in after a short delay
            setTimeout(() => cookieBanner.classList.add('cookie-banner--visible'), 800);

            const dismissCookieBanner = (choice) => {
                try { localStorage.setItem(COOKIE_CONSENT_KEY, choice); } catch (_) {}
                cookieBanner.classList.remove('cookie-banner--visible');
                setTimeout(() => { try { cookieBanner.remove(); } catch (_) {} }, 400);
            };

            const btnAccept = document.getElementById('cookie-btn-accept');
            const btnReject = document.getElementById('cookie-btn-reject');
            if (btnAccept) btnAccept.addEventListener('click', () => dismissCookieBanner('all'));
            if (btnReject) btnReject.addEventListener('click', () => dismissCookieBanner('essential'));
        }

    } catch (globalError) {
        console.error("Jardines Edén global JS runtime caught:", globalError);
        // Fallback: Remove js-active class so all content is fully visible immediately
        try {
            document.body.classList.remove('js-active');
        } catch (e) {}
    }

});
