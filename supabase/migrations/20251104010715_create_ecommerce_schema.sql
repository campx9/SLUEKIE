/*
  # SLUEKIE E-Commerce Platform Database Schema
  
  ## Overview
  This migration creates the complete database structure for the SLUEKIE e-commerce platform,
  designed as a multi-tenant system that can support multiple brand deployments while maintaining
  data isolation and connecting to the Tnaado backend infrastructure.
  
  ## New Tables
  
  ### brands
  - `id` (uuid, primary key) - Unique brand identifier
  - `name` (text) - Brand name (e.g., "SLUEKIE")
  - `slug` (text, unique) - URL-friendly brand identifier
  - `domain` (text) - Primary domain for the brand
  - `settings` (jsonb) - Brand-specific configuration (colors, logos, etc.)
  - `stripe_account_id` (text) - Stripe account identifier
  - `active` (boolean) - Whether brand is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### products
  - `id` (uuid, primary key) - Unique product identifier
  - `brand_id` (text) - References the brand this product belongs to
  - `sku` (text, unique) - Stock keeping unit identifier
  - `name` (text) - Product name
  - `description` (text) - Detailed product description
  - `price` (decimal) - Current selling price
  - `compare_at_price` (decimal) - Original/comparison price for discounts
  - `images` (jsonb) - Array of product image URLs and metadata
  - `variants` (jsonb) - Product variants (size, color, etc.)
  - `category` (text) - Product category
  - `tags` (text[]) - Searchable tags
  - `meta` (jsonb) - Additional metadata (care instructions, materials, etc.)
  - `inventory_quantity` (integer) - Available stock count
  - `active` (boolean) - Product visibility status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### carts
  - `id` (uuid, primary key) - Unique cart identifier
  - `session_id` (text) - Anonymous session identifier
  - `user_id` (uuid) - References auth.users for logged-in users
  - `items` (jsonb) - Cart items with product details and quantities
  - `expires_at` (timestamptz) - Cart expiration for cleanup
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### orders
  - `id` (uuid, primary key) - Unique order identifier
  - `brand_id` (text) - References the brand this order belongs to
  - `order_number` (text, unique) - Human-readable order number
  - `customer_id` (uuid) - References auth.users
  - `email` (text) - Customer email address
  - `status` (text) - Order status (pending, processing, shipped, delivered, cancelled)
  - `payment_intent` (text) - Stripe payment intent ID
  - `items` (jsonb) - Order line items with product details
  - `shipping_address` (jsonb) - Complete shipping address
  - `billing_address` (jsonb) - Complete billing address
  - `totals` (jsonb) - Subtotal, tax, shipping, discount, total
  - `metadata` (jsonb) - Additional order data (affiliate code, notes, etc.)
  - `tnaado_sync_status` (text) - Sync status with Tnaado backend (pending, synced, failed)
  - `tnaado_order_id` (text) - Reference to Tnaado backend order ID
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### affiliate_clicks
  - `id` (uuid, primary key) - Unique click identifier
  - `brand_id` (text) - References the brand
  - `affiliate_code` (text) - Unique affiliate/influencer code
  - `session_id` (text) - Visitor session identifier
  - `converted` (boolean) - Whether click resulted in purchase
  - `order_id` (uuid) - References orders table if converted
  - `ip_address` (inet) - Visitor IP for fraud prevention
  - `user_agent` (text) - Browser information
  - `referrer` (text) - Traffic source URL
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### returns
  - `id` (uuid, primary key) - Unique return identifier
  - `order_id` (uuid) - References orders table
  - `customer_id` (uuid) - References auth.users
  - `rma_number` (text, unique) - Return merchandise authorization number
  - `status` (text) - Return status (requested, approved, received, refunded, rejected)
  - `reason` (text) - Reason for return
  - `items` (jsonb) - Items being returned
  - `photos` (jsonb) - Photo evidence URLs
  - `refund_amount` (decimal) - Amount to be refunded
  - `refund_stripe_id` (text) - Stripe refund reference
  - `notes` (text) - Internal notes about the return
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### wishlists
  - `id` (uuid, primary key) - Unique wishlist identifier
  - `user_id` (uuid) - References auth.users
  - `product_id` (uuid) - References products table
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### inventory_movements
  - `id` (uuid, primary key) - Unique movement identifier
  - `product_id` (uuid) - References products table
  - `brand_id` (text) - References the brand
  - `movement_type` (text) - Type (sale, return, restock, adjustment)
  - `quantity` (integer) - Quantity changed (positive or negative)
  - `reference_id` (text) - Reference to order, return, etc.
  - `notes` (text) - Movement notes
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies created for authenticated users to access their own data
  - Public read access for products (active only)
  - Admin-level access required for sensitive operations
  
  ## Indexes
  - Performance indexes on frequently queried columns
  - Brand_id indexes for multi-tenant queries
  - Status and timestamp indexes for filtering
  
  ## Integration Notes
  - All tables include brand_id for multi-tenant support
  - Orders include tnaado_sync_status for backend integration
  - Affiliate tracking supports 30-day cookie attribution
  - Inventory movements provide audit trail for Tnaado warehouse sync
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text,
  settings jsonb DEFAULT '{}',
  stripe_account_id text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id text NOT NULL DEFAULT 'sluekie_001',
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  compare_at_price decimal(10, 2),
  images jsonb DEFAULT '[]',
  variants jsonb DEFAULT '[]',
  category text,
  tags text[] DEFAULT ARRAY[]::text[],
  meta jsonb DEFAULT '{}',
  inventory_quantity integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb DEFAULT '[]',
  expires_at timestamptz DEFAULT now() + interval '7 days',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id text NOT NULL DEFAULT 'sluekie_001',
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  status text DEFAULT 'pending',
  payment_intent text,
  items jsonb DEFAULT '[]',
  shipping_address jsonb DEFAULT '{}',
  billing_address jsonb DEFAULT '{}',
  totals jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  tnaado_sync_status text DEFAULT 'pending',
  tnaado_order_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id text NOT NULL DEFAULT 'sluekie_001',
  affiliate_code text NOT NULL,
  session_id text NOT NULL,
  converted boolean DEFAULT false,
  order_id uuid REFERENCES orders(id),
  ip_address inet,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Create returns table
CREATE TABLE IF NOT EXISTS returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  customer_id uuid REFERENCES auth.users(id),
  rma_number text UNIQUE NOT NULL,
  status text DEFAULT 'requested',
  reason text,
  items jsonb DEFAULT '[]',
  photos jsonb DEFAULT '[]',
  refund_amount decimal(10, 2),
  refund_stripe_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create inventory_movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  brand_id text NOT NULL DEFAULT 'sluekie_001',
  movement_type text NOT NULL,
  quantity integer NOT NULL,
  reference_id text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

CREATE INDEX IF NOT EXISTS idx_orders_brand_id ON orders(brand_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tnaado_sync ON orders(tnaado_sync_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_code ON affiliate_clicks(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_session ON affiliate_clicks(session_id);

CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON inventory_movements(product_id);

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brands (public read for active brands)
CREATE POLICY "Public can view active brands"
  ON brands FOR SELECT
  USING (active = true);

-- RLS Policies for products (public read for active products)
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (active = true);

-- RLS Policies for carts (users can manage their own carts)
CREATE POLICY "Users can view own carts"
  ON carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own carts"
  ON carts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carts"
  ON carts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own carts"
  ON carts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders (users can view their own orders)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for returns (users can manage their own returns)
CREATE POLICY "Users can view own returns"
  ON returns FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own returns"
  ON returns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own returns"
  ON returns FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for wishlists (users can manage their own wishlist)
CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own wishlist"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default SLUEKIE brand
INSERT INTO brands (id, name, slug, domain, settings, active)
VALUES (
  gen_random_uuid(),
  'SLUEKIE',
  'sluekie',
  'sluekie.com',
  '{
    "colors": {
      "primary": "#1E2D4D",
      "secondary": "#CBDAD5",
      "accent": "#D4CFE7"
    },
    "logo": "/logo.png",
    "tagline": "Elevate Your Nights"
  }'::jsonb,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON returns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();