export interface BrandConfig {
  name: string;
  domain: string;
  brand_id: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  api_endpoints: {
    tnaado_inventory: string;
    tnaado_orders: string;
    tnaado_tracking: string;
    tnaado_affiliates: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  name: 'SLUEKIE',
  domain: import.meta.env.VITE_SITE_URL || 'sluekie.com',
  brand_id: import.meta.env.VITE_BRAND_ID || 'sluekie_001',
  colors: {
    primary: '#1E2D4D',
    secondary: '#CBDAD5',
    accent: '#D4CFE7',
    background: '#0F1B2E',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Lato', sans-serif",
  },
  api_endpoints: {
    tnaado_inventory: `${import.meta.env.VITE_TNAADO_API_URL}/inventory`,
    tnaado_orders: `${import.meta.env.VITE_TNAADO_API_URL}/orders`,
    tnaado_tracking: `${import.meta.env.VITE_TNAADO_API_URL}/tracking`,
    tnaado_affiliates: `${import.meta.env.VITE_TNAADO_API_URL}/affiliates`,
  },
};
