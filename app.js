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

        if (lightbox && lightboxImg && galleryItems.length > 0) {
            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    const title = item.querySelector('.gallery-item-title');
                    const category = item.querySelector('.gallery-item-category');

                    if (img) {
                        lightboxImg.src = img.src;
                        lightboxImg.alt = img.alt;
                        
                        // Set caption
                        const titleText = title ? title.textContent : '';
                        const catText = category ? ` (${category.textContent})` : '';
                        lightboxCaption.textContent = titleText + catText;

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
                    lightboxImg.src = '';
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
           6. TIMED WHATSAPP TOOLTIP FLOATING INVITATION
           ========================================== */
        const waTooltip = document.getElementById('wa-tooltip');
        const waTooltipClose = document.getElementById('wa-tooltip-close');

        if (waTooltip) {
            // Safe SessionStorage wrap to prevent security crashes in static file: URI
            let isTooltipClosed = false;
            try {
                isTooltipClosed = sessionStorage.getItem('wa_tooltip_closed') === 'true';
            } catch (e) {
                console.warn("sessionStorage is blocked or inaccessible.", e);
            }

            if (!isTooltipClosed) {
                setTimeout(() => {
                    waTooltip.classList.add('active');
                }, 3000);
            }

            // Close tooltip event
            if (waTooltipClose) {
                waTooltipClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Avoid triggering parent actions
                    waTooltip.classList.remove('active');
                    
                    try {
                        sessionStorage.setItem('wa_tooltip_closed', 'true');
                    } catch (err) {
                        console.warn("Unable to save closed state in sessionStorage.", err);
                    }
                });
            }
        }

        /* ==========================================
           7. BEFORE & AFTER SLIDER
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

    } catch (globalError) {
        console.error("Jardines Edén global JS runtime caught:", globalError);
        // Fallback: Remove js-active class so all content is fully visible immediately
        try {
            document.body.classList.remove('js-active');
        } catch (e) {}
    }

});
