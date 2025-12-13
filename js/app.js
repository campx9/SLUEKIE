/* ========================================
   SLUEKIE - Main JavaScript Application
   Luxury Sleep Collection E-commerce
   ======================================== */

// ========================================
// CART STATE MANAGEMENT
// ========================================
const Cart = {
    items: JSON.parse(localStorage.getItem('sluekie_cart')) || [],

    save() {
        localStorage.setItem('sluekie_cart', JSON.stringify(this.items));
        this.updateCartCount();
        document.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.items }));
    },

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        this.save();
        Toast.show(`${product.name} added to cart`, 'success');
    },

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        Toast.show('Item removed from cart', 'info');
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.save();
            }
        }
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    clear() {
        this.items = [];
        this.save();
    },

    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

// ========================================
// USER STATE MANAGEMENT
// ========================================
const User = {
    data: JSON.parse(localStorage.getItem('sluekie_user')) || null,

    isLoggedIn() {
        return this.data !== null;
    },

    login(userData) {
        this.data = userData;
        localStorage.setItem('sluekie_user', JSON.stringify(userData));
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
    },

    logout() {
        this.data = null;
        localStorage.removeItem('sluekie_user');
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
    },

    update(userData) {
        this.data = { ...this.data, ...userData };
        localStorage.setItem('sluekie_user', JSON.stringify(this.data));
    }
};

// ========================================
// WISHLIST MANAGEMENT
// ========================================
const Wishlist = {
    items: JSON.parse(localStorage.getItem('sluekie_wishlist')) || [],

    save() {
        localStorage.setItem('sluekie_wishlist', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: this.items }));
    },

    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index > -1) {
            this.items.splice(index, 1);
            Toast.show('Removed from wishlist', 'info');
        } else {
            this.items.push(product);
            Toast.show('Added to wishlist', 'success');
        }
        this.save();
    },

    isInWishlist(productId) {
        return this.items.some(item => item.id === productId);
    }
};

// ========================================
// TOAST NOTIFICATIONS
// ========================================
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutToast 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    getIcon(type) {
        const icons = {
            success: '&#10004;',
            error: '&#10006;',
            info: '&#8505;',
            warning: '&#9888;'
        };
        return icons[type] || icons.info;
    }
};

// ========================================
// MODAL SYSTEM
// ========================================
const Modal = {
    show(content, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                ${options.title ? `
                    <div class="modal-header">
                        <h3>${options.title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                ` : ''}
                <div class="modal-body">${content}</div>
                ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => overlay.classList.add('active'));

        const close = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.modal-close')?.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        return { close, overlay };
    }
};

// ========================================
// NAVIGATION
// ========================================
const Navigation = {
    init() {
        this.navbar = document.querySelector('.navbar');
        this.mobileBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');

        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }

        if (this.mobileBtn && this.navMenu) {
            this.mobileBtn.addEventListener('click', () => this.toggleMobile());
        }

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu) this.navMenu.classList.remove('active');
            });
        });
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    toggleMobile() {
        this.navMenu.classList.toggle('active');
    }
};

// ========================================
// DYNAMIC SKY BACKGROUND
// ========================================
const SkyBackground = {
    init() {
        this.container = document.getElementById('skyContainer');
        this.sun = document.getElementById('sun');
        this.moon = document.getElementById('moon');

        if (this.container) {
            window.addEventListener('scroll', () => this.update());
            this.update();
        }
    },

    update() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

        if (scrollPercent < 0.25) {
            const nightToDawn = Math.min(scrollPercent / 0.25, 1);

            if (nightToDawn < 0.5) {
                this.sun.style.opacity = '0';
                this.moon.style.opacity = '1';
            } else {
                const dawnProgress = (nightToDawn - 0.5) * 2;
                this.container.style.background = `linear-gradient(180deg,
                    ${this.interpolateColor('#0F1B2E', '#2D4A6B', dawnProgress)} 0%,
                    ${this.interpolateColor('#1a2332', '#FF8C69', dawnProgress * 0.8)} 30%,
                    ${this.interpolateColor('#1E2D4D', '#FFB6C1', dawnProgress * 0.6)} 60%,
                    ${this.interpolateColor('#1E2D4D', '#F4E4BC', dawnProgress)} 100%)`;

                this.sun.style.opacity = (dawnProgress * 0.3).toString();
                this.moon.style.opacity = (1 - dawnProgress * 0.3).toString();
                this.sun.style.transform = `translateY(${50 - dawnProgress * 20}px)`;
            }
        } else if (scrollPercent < 0.5) {
            const dawnToNoon = (scrollPercent - 0.25) / 0.25;

            this.container.style.background = `linear-gradient(180deg,
                ${this.interpolateColor('#2D4A6B', '#87CEEB', dawnToNoon)} 0%,
                ${this.interpolateColor('#FF8C69', '#B0E0E6', dawnToNoon)} 50%,
                ${this.interpolateColor('#F4E4BC', '#FFF8E7', dawnToNoon)} 100%)`;

            this.sun.style.opacity = (0.3 + dawnToNoon * 0.7).toString();
            this.moon.style.opacity = (0.7 - dawnToNoon * 0.7).toString();
            this.sun.style.transform = `translateY(${30 - dawnToNoon * 50}px)`;
        } else if (scrollPercent < 0.75) {
            const noonToDusk = (scrollPercent - 0.5) / 0.25;

            this.container.style.background = `linear-gradient(180deg,
                ${this.interpolateColor('#87CEEB', '#4B0082', noonToDusk)} 0%,
                ${this.interpolateColor('#B0E0E6', '#FF6B6B', noonToDusk)} 30%,
                ${this.interpolateColor('#FFF8E7', '#FF69B4', noonToDusk)} 60%,
                ${this.interpolateColor('#FFF8E7', '#FFB6C1', noonToDusk)} 100%)`;

            this.sun.style.opacity = (1 - noonToDusk * 0.4).toString();
            this.moon.style.opacity = (noonToDusk * 0.3).toString();
            this.sun.style.transform = `translateY(${-20 + noonToDusk * 50}px)`;
        } else {
            const duskToNight = (scrollPercent - 0.75) / 0.25;

            this.container.style.background = `linear-gradient(180deg,
                ${this.interpolateColor('#4B0082', '#0F1B2E', duskToNight)} 0%,
                ${this.interpolateColor('#FF6B6B', '#1a2332', duskToNight)} 30%,
                ${this.interpolateColor('#FF69B4', '#1E2D4D', duskToNight)} 60%,
                ${this.interpolateColor('#FFB6C1', '#1E2D4D', duskToNight)} 100%)`;

            this.sun.style.opacity = (0.6 - duskToNight * 0.6).toString();
            this.moon.style.opacity = (0.3 + duskToNight * 0.7).toString();
            this.sun.style.transform = `translateY(${30 + duskToNight * 20}px)`;
            this.moon.style.transform = `translateY(${duskToNight * -10}px)`;
        }
    },

    interpolateColor(color1, color2, factor) {
        if (factor <= 0) return color1;
        if (factor >= 1) return color2;

        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);

        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
};

// ========================================
// SCROLL ANIMATIONS
// ========================================
const ScrollAnimations = {
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            this.observer.observe(el);
        });
    }
};

// ========================================
// SMOOTH SCROLL
// ========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
};

// ========================================
// PRODUCT DATA (Demo - Coming Soon Products)
// ========================================
const Products = {
    data: [
        {
            id: 'signature-comfort',
            name: 'Signature Comfort Collection',
            category: 'Bedding Sets',
            price: 299,
            originalPrice: 399,
            description: 'Premium organic cotton with thermoregulating technology. Complete set includes duvet cover, fitted sheet, and two pillowcases.',
            badge: 'Coming Soon',
            image: 'images/products/bedding-set-1.jpg',
            features: ['GOTS Certified Organic', 'Thermoregulating', 'Hypoallergenic', '400 Thread Count'],
            comingSoon: true
        },
        {
            id: 'cloud-memory-pillow',
            name: 'Cloud Memory Pillow',
            category: 'Pillows',
            price: 149,
            originalPrice: 199,
            description: 'Adaptive memory foam with cooling gel infusion for optimal spinal alignment and pressure relief.',
            badge: 'Coming Soon',
            image: 'images/products/pillow-1.jpg',
            features: ['Cooling Gel Infusion', 'Ergonomic Design', 'Removable Cover', '5-Year Warranty'],
            comingSoon: true
        },
        {
            id: 'silk-pillowcase-set',
            name: 'Mulberry Silk Pillowcase Set',
            category: 'Pillowcases',
            price: 89,
            originalPrice: 119,
            description: 'Pure Grade 6A mulberry silk pillowcases. Gentle on hair and skin, naturally hypoallergenic.',
            badge: 'Coming Soon',
            image: 'images/products/pillow-1.jpg',
            features: ['100% Mulberry Silk', 'Set of 2', 'Hidden Zipper', 'Anti-Aging Benefits'],
            comingSoon: true
        },
        {
            id: 'essential-sheet-set',
            name: 'Essential Sheet Set',
            category: 'Sheets',
            price: 179,
            originalPrice: 229,
            description: 'Percale weave organic cotton sheets with temperature control technology. Includes flat sheet, fitted sheet, and pillowcases.',
            badge: 'Coming Soon',
            image: 'images/products/sheets-1.jpg',
            features: ['Percale Weave', 'Temperature Control', 'Deep Pockets', 'Oeko-Tex Certified'],
            comingSoon: true
        },
        {
            id: 'luxury-duvet',
            name: 'Luxury Down Duvet',
            category: 'Duvets',
            price: 399,
            originalPrice: 499,
            description: 'Ethically sourced Hungarian goose down with superior warmth-to-weight ratio. All-season comfort.',
            badge: 'Coming Soon',
            image: 'images/products/duvet-1.jpg',
            features: ['Hungarian Goose Down', 'All-Season Weight', 'Baffle Box Construction', 'RDS Certified'],
            comingSoon: true
        },
        {
            id: 'weighted-blanket',
            name: 'Serenity Weighted Blanket',
            category: 'Blankets',
            price: 199,
            originalPrice: 249,
            description: 'Glass bead weighted blanket with cooling bamboo cover for deeper, more restorative sleep.',
            badge: 'Coming Soon',
            image: 'images/products/blanket-1.webp',
            features: ['15 lbs Weight', 'Cooling Bamboo', 'Glass Beads', 'Machine Washable'],
            comingSoon: true
        },
        {
            id: 'dream-pillowcase-standard',
            name: 'Dream Pillowcase - Standard',
            category: 'Pillowcases',
            price: 49,
            originalPrice: 69,
            description: 'Buttery soft organic cotton pillowcase with envelope closure. Perfect for any pillow.',
            badge: 'Coming Soon',
            image: 'images/products/pillow-1.jpg',
            features: ['Organic Cotton', 'Envelope Closure', 'Breathable', 'Machine Washable'],
            comingSoon: true
        },
        {
            id: 'cooling-pillowcase-set',
            name: 'Cooling Tech Pillowcase Set',
            category: 'Pillowcases',
            price: 79,
            originalPrice: 99,
            description: 'Advanced cooling fabric pillowcases designed for hot sleepers. Set of 2 with hidden zipper.',
            badge: 'Coming Soon',
            image: 'images/products/pillow-1.jpg',
            features: ['Cooling Technology', 'Set of 2', 'Hidden Zipper', 'Temperature Regulating'],
            comingSoon: true
        }
    ],

    getAll() {
        return this.data;
    },

    getById(id) {
        return this.data.find(product => product.id === id);
    },

    getByCategory(category) {
        return this.data.filter(product => product.category === category);
    },

    search(query) {
        const searchTerm = query.toLowerCase();
        return this.data.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
};

// ========================================
// FORM VALIDATION
// ========================================
const FormValidation = {
    rules: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            pattern: /^[\d\s\-\+\(\)]{10,}$/,
            message: 'Please enter a valid phone number'
        },
        required: {
            validate: (value) => value.trim() !== '',
            message: 'This field is required'
        },
        minLength: {
            validate: (value, min) => value.length >= min,
            message: (min) => `Must be at least ${min} characters`
        }
    },

    validate(form) {
        let isValid = true;
        const errors = {};

        form.querySelectorAll('[data-validate]').forEach(input => {
            const rules = input.dataset.validate.split(',');
            const value = input.value;

            rules.forEach(rule => {
                const [ruleName, param] = rule.split(':');
                const validation = this.rules[ruleName];

                if (validation) {
                    let valid = false;
                    if (validation.pattern) {
                        valid = validation.pattern.test(value);
                    } else if (validation.validate) {
                        valid = validation.validate(value, param);
                    }

                    if (!valid) {
                        isValid = false;
                        const message = typeof validation.message === 'function'
                            ? validation.message(param)
                            : validation.message;
                        errors[input.name] = message;
                        this.showError(input, message);
                    }
                }
            });
        });

        return { isValid, errors };
    },

    showError(input, message) {
        const errorEl = input.parentElement.querySelector('.form-error') || document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        if (!input.parentElement.querySelector('.form-error')) {
            input.parentElement.appendChild(errorEl);
        }
        input.classList.add('error');
    },

    clearErrors(form) {
        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    SkyBackground.init();
    ScrollAnimations.init();
    SmoothScroll.init();
    Cart.updateCartCount();

    // Add CSS for toast slideOut animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutToast {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other scripts
window.Sluekie = {
    Cart,
    User,
    Wishlist,
    Products,
    Toast,
    Modal,
    Utils,
    FormValidation
};
