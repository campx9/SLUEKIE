/**
 * Sluekie Analytics & Tracking Setup
 * Includes: Google Analytics 4, Facebook Pixel, Google Tag Manager
 * Updated: 2025-12-13
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const TRACKING_CONFIG = {
    // Replace these with actual IDs when ready to deploy
    googleAnalyticsId: 'G-XXXXXXXXXX',  // Google Analytics 4 ID
    facebookPixelId: 'XXXXXXXXXXXXXXXXX', // Facebook Pixel ID
    googleTagManagerId: 'GTM-XXXXXXX',   // Google Tag Manager ID
    enabled: true // Set to false to disable all tracking in development
};

// ============================================================================
// GOOGLE ANALYTICS 4 (GA4)
// ============================================================================
function initGoogleAnalytics() {
    if (!TRACKING_CONFIG.enabled || !TRACKING_CONFIG.googleAnalyticsId) return;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_CONFIG.googleAnalyticsId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', TRACKING_CONFIG.googleAnalyticsId, {
        'send_page_view': true,
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
    });

    console.log('Google Analytics initialized');
}

// ============================================================================
// FACEBOOK PIXEL
// ============================================================================
function initFacebookPixel() {
    if (!TRACKING_CONFIG.enabled || !TRACKING_CONFIG.facebookPixelId) return;

    // Facebook Pixel Code
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', TRACKING_CONFIG.facebookPixelId);
    fbq('track', 'PageView');

    console.log('Facebook Pixel initialized');
}

// ============================================================================
// GOOGLE TAG MANAGER
// ============================================================================
function initGoogleTagManager() {
    if (!TRACKING_CONFIG.enabled || !TRACKING_CONFIG.googleTagManagerId) return;

    // Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',TRACKING_CONFIG.googleTagManagerId);

    console.log('Google Tag Manager initialized');
}

// ============================================================================
// E-COMMERCE EVENT TRACKING
// ============================================================================
const TrackingEvents = {
    // Track product views
    viewProduct: function(productData) {
        if (!TRACKING_CONFIG.enabled) return;

        // GA4 Event
        if (window.gtag) {
            gtag('event', 'view_item', {
                currency: 'USD',
                value: productData.price,
                items: [{
                    item_id: productData.id,
                    item_name: productData.name,
                    item_category: productData.category,
                    price: productData.price
                }]
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'ViewContent', {
                content_ids: [productData.id],
                content_name: productData.name,
                content_category: productData.category,
                content_type: 'product',
                value: productData.price,
                currency: 'USD'
            });
        }

        console.log('Product view tracked:', productData.name);
    },

    // Track add to cart
    addToCart: function(productData, quantity = 1) {
        if (!TRACKING_CONFIG.enabled) return;

        const value = productData.price * quantity;

        // GA4 Event
        if (window.gtag) {
            gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: value,
                items: [{
                    item_id: productData.id,
                    item_name: productData.name,
                    item_category: productData.category,
                    price: productData.price,
                    quantity: quantity
                }]
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'AddToCart', {
                content_ids: [productData.id],
                content_name: productData.name,
                content_type: 'product',
                value: value,
                currency: 'USD'
            });
        }

        console.log('Add to cart tracked:', productData.name, 'x', quantity);
    },

    // Track purchase
    purchase: function(transactionData) {
        if (!TRACKING_CONFIG.enabled) return;

        // GA4 Event
        if (window.gtag) {
            gtag('event', 'purchase', {
                transaction_id: transactionData.transactionId,
                value: transactionData.total,
                currency: 'USD',
                tax: transactionData.tax || 0,
                shipping: transactionData.shipping || 0,
                items: transactionData.items
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Purchase', {
                value: transactionData.total,
                currency: 'USD',
                content_ids: transactionData.items.map(item => item.item_id),
                content_type: 'product'
            });
        }

        console.log('Purchase tracked:', transactionData.transactionId);
    },

    // Track search
    search: function(searchTerm) {
        if (!TRACKING_CONFIG.enabled) return;

        // GA4 Event
        if (window.gtag) {
            gtag('event', 'search', {
                search_term: searchTerm
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Search', {
                search_string: searchTerm
            });
        }

        console.log('Search tracked:', searchTerm);
    },

    // Track newsletter signup
    newsletterSignup: function(email) {
        if (!TRACKING_CONFIG.enabled) return;

        // GA4 Event
        if (window.gtag) {
            gtag('event', 'sign_up', {
                method: 'Newsletter'
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Lead');
        }

        console.log('Newsletter signup tracked');
    },

    // Track contact form submission
    contactFormSubmit: function() {
        if (!TRACKING_CONFIG.enabled) return;

        // GA4 Event
        if (window.gtag) {
            gtag('event', 'generate_lead', {
                method: 'Contact Form'
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Contact');
        }

        console.log('Contact form submission tracked');
    },

    // Track custom events
    custom: function(eventName, eventParams = {}) {
        if (!TRACKING_CONFIG.enabled) return;

        // GA4 Event
        if (window.gtag) {
            gtag('event', eventName, eventParams);
        }

        console.log('Custom event tracked:', eventName, eventParams);
    }
};

// ============================================================================
// ENHANCED E-COMMERCE - PRODUCT IMPRESSIONS
// ============================================================================
function trackProductImpressions() {
    if (!TRACKING_CONFIG.enabled) return;

    // Find all product cards on the page
    const productCards = document.querySelectorAll('[data-product-id]');

    if (productCards.length > 0 && window.gtag) {
        const items = Array.from(productCards).map((card, index) => ({
            item_id: card.dataset.productId,
            item_name: card.dataset.productName || 'Unknown Product',
            item_category: card.dataset.productCategory || 'Uncategorized',
            price: parseFloat(card.dataset.productPrice) || 0,
            index: index
        }));

        gtag('event', 'view_item_list', {
            items: items
        });

        console.log('Product impressions tracked:', items.length, 'products');
    }
}

// ============================================================================
// SCROLL DEPTH TRACKING
// ============================================================================
function initScrollTracking() {
    if (!TRACKING_CONFIG.enabled) return;

    const milestones = [25, 50, 75, 100];
    const reached = new Set();

    function checkScroll() {
        const scrollPercent = Math.round(
            (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
        );

        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !reached.has(milestone)) {
                reached.add(milestone);

                if (window.gtag) {
                    gtag('event', 'scroll_depth', {
                        percent: milestone,
                        page: window.location.pathname
                    });
                }

                console.log('Scroll depth tracked:', milestone + '%');
            }
        });
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================================================
// OUTBOUND LINK TRACKING
// ============================================================================
function initOutboundLinkTracking() {
    if (!TRACKING_CONFIG.enabled) return;

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Check if external link
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            if (window.gtag) {
                gtag('event', 'click', {
                    event_category: 'outbound',
                    event_label: href,
                    transport_type: 'beacon'
                });
            }

            console.log('Outbound link tracked:', href);
        }
    });
}

// ============================================================================
// INITIALIZE ALL TRACKING
// ============================================================================
function initTracking() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTrackingServices();
        });
    } else {
        initTrackingServices();
    }
}

function initTrackingServices() {
    initGoogleAnalytics();
    initFacebookPixel();
    initGoogleTagManager();

    // Additional tracking features
    setTimeout(() => {
        trackProductImpressions();
        initScrollTracking();
        initOutboundLinkTracking();
    }, 1000);

    console.log('All tracking services initialized');
}

// ============================================================================
// EXPORT TRACKING INTERFACE
// ============================================================================
window.SluekieTracking = {
    events: TrackingEvents,
    config: TRACKING_CONFIG
};

// Auto-initialize
initTracking();
