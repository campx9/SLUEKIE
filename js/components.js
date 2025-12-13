/* ========================================
   SLUEKIE - Component Loader
   Loads shared header and footer into pages
   ======================================== */

const ComponentLoader = {
    async loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            const html = await response.text();
            element.innerHTML = html;

            // Execute any inline scripts in the loaded component
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
                script.remove();
            });
        } catch (error) {
            console.error('Component loading error:', error);
        }
    },

    async init() {
        // Load launch banner first
        await this.loadComponent('launch-banner-placeholder', 'components/launch-banner.html');

        // Load header and footer in parallel
        await Promise.all([
            this.loadComponent('header-placeholder', 'components/header.html'),
            this.loadComponent('footer-placeholder', 'components/footer.html')
        ]);

        // Reinitialize navigation after loading
        if (window.Navigation) {
            window.Navigation.init();
        }

        // Update cart count after loading
        if (window.Sluekie?.Cart) {
            window.Sluekie.Cart.updateCartCount();
        }

        // Dispatch event when components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.init();
});
