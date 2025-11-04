import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain: string | null;
          settings: Record<string, any>;
          stripe_account_id: string | null;
          active: boolean;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          brand_id: string;
          sku: string;
          name: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          images: any[];
          variants: any[];
          category: string | null;
          tags: string[];
          meta: Record<string, any>;
          inventory_quantity: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      carts: {
        Row: {
          id: string;
          session_id: string | null;
          user_id: string | null;
          items: any[];
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          brand_id: string;
          order_number: string;
          customer_id: string | null;
          email: string;
          status: string;
          payment_intent: string | null;
          items: any[];
          shipping_address: Record<string, any>;
          billing_address: Record<string, any>;
          totals: Record<string, any>;
          metadata: Record<string, any>;
          tnaado_sync_status: string;
          tnaado_order_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      affiliate_clicks: {
        Row: {
          id: string;
          brand_id: string;
          affiliate_code: string;
          session_id: string;
          converted: boolean;
          order_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          referrer: string | null;
          created_at: string;
        };
      };
      returns: {
        Row: {
          id: string;
          order_id: string;
          customer_id: string | null;
          rma_number: string;
          status: string;
          reason: string | null;
          items: any[];
          photos: any[];
          refund_amount: number | null;
          refund_stripe_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
      };
    };
  };
}
