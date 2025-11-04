export interface Product {
  id: string;
  brand_id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  category: string | null;
  tags: string[];
  meta: Record<string, any>;
  inventory_quantity: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
  sku: string;
  price: number;
  inventory_quantity: number;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  variant_id?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  session_id: string | null;
  user_id: string | null;
  items: CartItem[];
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  brand_id: string;
  order_number: string;
  customer_id: string | null;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_intent: string | null;
  items: CartItem[];
  shipping_address: Address;
  billing_address: Address;
  totals: OrderTotals;
  metadata: Record<string, any>;
  tnaado_sync_status: 'pending' | 'synced' | 'failed';
  tnaado_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Return {
  id: string;
  order_id: string;
  customer_id: string | null;
  rma_number: string;
  status: 'requested' | 'approved' | 'received' | 'refunded' | 'rejected';
  reason: string | null;
  items: CartItem[];
  photos: string[];
  refund_amount: number | null;
  refund_stripe_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  brand_id: string;
  affiliate_code: string;
  session_id: string;
  converted: boolean;
  order_id: string | null;
  created_at: string;
}
