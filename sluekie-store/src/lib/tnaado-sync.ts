import { BRAND_CONFIG } from '../config/brand';
import type { Order } from '../types';

export class TnaadoSync {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_TNAADO_API_KEY || '';
  }

  async syncOrder(order: Order): Promise<{ tnaado_order_id: string } | null> {
    try {
      const response = await fetch(`${BRAND_CONFIG.api_endpoints.tnaado_orders}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Brand-ID': BRAND_CONFIG.brand_id,
        },
        body: JSON.stringify({
          order_id: order.id,
          order_number: order.order_number,
          brand_id: order.brand_id,
          customer_email: order.email,
          items: order.items,
          shipping_address: order.shipping_address,
          totals: order.totals,
          metadata: order.metadata,
        }),
      });

      if (!response.ok) {
        console.error('Failed to sync order with Tnaado:', await response.text());
        return null;
      }

      const data = await response.json();
      return { tnaado_order_id: data.tnaado_order_id || `TNO-${order.id}` };
    } catch (error) {
      console.error('Error syncing order to Tnaado:', error);
      return null;
    }
  }

  async getInventory(sku: string): Promise<{ available: number; warehouse: string } | null> {
    try {
      const response = await fetch(`${BRAND_CONFIG.api_endpoints.tnaado_inventory}/${sku}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Brand-ID': BRAND_CONFIG.brand_id,
        },
      });

      if (!response.ok) {
        return { available: 0, warehouse: 'main' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory from Tnaado:', error);
      return { available: 0, warehouse: 'main' };
    }
  }

  async createFulfillment(orderId: string): Promise<{ fulfillment_id: string } | null> {
    try {
      const response = await fetch(`${BRAND_CONFIG.api_endpoints.tnaado_orders}/${orderId}/fulfill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Brand-ID': BRAND_CONFIG.brand_id,
        },
      });

      if (!response.ok) {
        console.error('Failed to create fulfillment:', await response.text());
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating fulfillment:', error);
      return null;
    }
  }

  async getTracking(orderId: string): Promise<{ tracking_number: string; carrier: string; status: string } | null> {
    try {
      const response = await fetch(`${BRAND_CONFIG.api_endpoints.tnaado_tracking}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Brand-ID': BRAND_CONFIG.brand_id,
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tracking from Tnaado:', error);
      return null;
    }
  }

  async trackAffiliateConversion(affiliateCode: string, orderId: string, amount: number): Promise<boolean> {
    try {
      const response = await fetch(`${BRAND_CONFIG.api_endpoints.tnaado_affiliates}/conversions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Brand-ID': BRAND_CONFIG.brand_id,
        },
        body: JSON.stringify({
          affiliate_code: affiliateCode,
          order_id: orderId,
          amount,
          brand_id: BRAND_CONFIG.brand_id,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error tracking affiliate conversion:', error);
      return false;
    }
  }
}

export const tnaadoSync = new TnaadoSync();
