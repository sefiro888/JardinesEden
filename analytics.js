/* ============================================================
   Google Analytics 4 — Jardines Edén (G-5XZT10KN91)
   Carga condicionada al consentimiento de cookies (RGPD):
   solo se activa si el usuario pulsa "Aceptar todo" en el banner.
   Eventos personalizados: whatsapp_click, phone_click, instagram_click
   ============================================================ */
(function () {
    var GA_ID = 'G-5XZT10KN91';
    var CONSENT_KEY = 'jardineseden_cookies_v1';

    function loadGA() {
        if (window.__gaLoaded) return;
        window.__gaLoaded = true;

        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { anonymize_ip: true });

        // Conversiones: clics en WhatsApp, teléfono e Instagram
        document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (!a) return;
            var h = a.getAttribute('href') || '';
            if (h.indexOf('wa.me') > -1) {
                window.gtag('event', 'whatsapp_click', {
                    link_url: h,
                    page_location: location.pathname,
                    page_title: document.title
                });
            } else if (h.indexOf('tel:') === 0) {
                window.gtag('event', 'phone_click', {
                    page_location: location.pathname,
                    page_title: document.title
                });
            } else if (h.indexOf('instagram.com') > -1) {
                window.gtag('event', 'instagram_click', {
                    page_location: location.pathname,
                    page_title: document.title
                });
            }
        }, true);
    }

    try {
        var consent = localStorage.getItem(CONSENT_KEY);
        if (consent === 'all') {
            // Ya aceptó en una visita anterior
            loadGA();
        } else if (!consent) {
            // Aún no ha decidido: esperar al botón "Aceptar todo" del banner
            document.addEventListener('click', function onBanner(e) {
                if (e.target && e.target.id === 'cookie-btn-accept') {
                    loadGA();
                    document.removeEventListener('click', onBanner, true);
                }
            }, true);
        }
        // Si eligió 'essential', no se carga nada.
    } catch (_) { /* localStorage no disponible: no cargar analytics */ }
})();
