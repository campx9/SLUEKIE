# Tnaado Backend Integration Guide

This document outlines how to wire the SLUEKIE e-commerce platform to Tnaado's backend systems.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  SLUEKIE Store  │────────▶│  Tnaado Backend  │────────▶│   Warehouse     │
│  (Vercel)       │         │  API             │         │   Management    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│   Supabase DB   │         │  Influencer      │
│   (Shared)      │         │  Panel           │
└─────────────────┘         └──────────────────┘
```

## API Endpoints

Base URL: `https://api.tnaado.ca`

### Authentication

All requests must include:

```typescript
headers: {
  'Authorization': `Bearer ${VITE_TNAADO_API_KEY}`,
  'X-Brand-ID': brand_id,
  'Content-Type': 'application/json'
}
```

## 1. Order Management

### Sync Order to Tnaado

**Endpoint**: `POST /orders`

**When to call**: Immediately after order is created in Supabase

**Request Body**:
```json
{
  "order_id": "uuid-from-supabase",
  "order_number": "SLK-...",
  "brand_id": "sluekie_001",
  "customer_email": "customer@example.com",
  "items": [
    {
      "product_id": "uuid",
      "sku": "SILK-PILLOW-001",
      "name": "Cloud Memory Pillow",
      "quantity": 2,
      "price": 149.00
    }
  ],
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "totals": {
    "subtotal": 298.00,
    "shipping": 0.00,
    "tax": 26.82,
    "total": 324.82
  },
  "metadata": {
    "affiliate_code": "INFLUENCER123",
    "notes": "Gift wrap requested"
  }
}
```

**Response**:
```json
{
  "success": true,
  "tnaado_order_id": "TNO-12345",
  "warehouse_assigned": "main",
  "estimated_ship_date": "2025-11-06"
}
```

**Implementation**:

```typescript
// In checkout completion handler
import { tnaadoSync } from '../lib/tnaado-sync';
import { supabase } from '../lib/supabase';

async function completeOrder(order: Order) {
  // 1. Create order in Supabase
  const { data: newOrder, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;

  // 2. Sync to Tnaado
  const result = await tnaadoSync.syncOrder(newOrder);

  // 3. Update order with Tnaado ID
  if (result) {
    await supabase
      .from('orders')
      .update({
        tnaado_order_id: result.tnaado_order_id,
        tnaado_sync_status: 'synced'
      })
      .eq('id', newOrder.id);
  } else {
    // Mark for retry
    await supabase
      .from('orders')
      .update({ tnaado_sync_status: 'failed' })
      .eq('id', newOrder.id);
  }
}
```

### Get Order Fulfillment Status

**Endpoint**: `GET /orders/{tnaado_order_id}/fulfillment`

**Response**:
```json
{
  "order_id": "TNO-12345",
  "status": "processing",
  "items": [
    {
      "sku": "SILK-PILLOW-001",
      "quantity": 2,
      "picked": 2,
      "packed": 0,
      "shipped": 0
    }
  ],
  "warehouse": "main",
  "estimated_ship_date": "2025-11-06"
}
```

## 2. Inventory Management

### Get Real-Time Inventory

**Endpoint**: `GET /inventory/{sku}`

**When to call**: Before adding to cart, on product page load

**Response**:
```json
{
  "sku": "SILK-PILLOW-001",
  "available": 47,
  "warehouse": "main",
  "reserved": 3,
  "incoming": 50,
  "incoming_date": "2025-11-10"
}
```

**Implementation**:

```typescript
// Add to useProduct hook
import { tnaadoSync } from '../lib/tnaado-sync';

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<{ available: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Fetch product from Supabase
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      setProduct(data);

      // Get real-time inventory from Tnaado
      if (data) {
        const inv = await tnaadoSync.getInventory(data.sku);
        setInventory(inv);
      }
    }

    fetchData();
  }, [id]);

  return { product, inventory };
}
```

### Bulk Inventory Sync

**Endpoint**: `POST /inventory/sync`

**When to call**: Scheduled job (every 15 minutes)

**Request Body**:
```json
{
  "brand_id": "sluekie_001",
  "skus": ["SILK-PILLOW-001", "SILK-MASK-001", "SHEET-SET-001"]
}
```

**Response**:
```json
{
  "updated": [
    {
      "sku": "SILK-PILLOW-001",
      "available": 47,
      "warehouse": "main"
    },
    {
      "sku": "SILK-MASK-001",
      "available": 98,
      "warehouse": "main"
    }
  ]
}
```

## 3. Shipping & Tracking

### Get Tracking Information

**Endpoint**: `GET /tracking/{order_id}`

**Response**:
```json
{
  "order_id": "TNO-12345",
  "tracking_number": "1Z999AA10123456784",
  "carrier": "UPS",
  "carrier_code": "ups",
  "status": "in_transit",
  "shipped_date": "2025-11-06T14:30:00Z",
  "estimated_delivery": "2025-11-08",
  "tracking_url": "https://wwwapps.ups.com/tracking...",
  "events": [
    {
      "timestamp": "2025-11-06T14:30:00Z",
      "status": "picked_up",
      "location": "New York, NY"
    },
    {
      "timestamp": "2025-11-06T20:15:00Z",
      "status": "in_transit",
      "location": "Philadelphia, PA"
    }
  ]
}
```

**Implementation**:

```typescript
// In OrderDetailPage
import { useState, useEffect } from 'react';
import { tnaadoSync } from '../lib/tnaado-sync';

function OrderTracking({ tnaadoOrderId }: { tnaadoOrderId: string }) {
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    async function fetchTracking() {
      const data = await tnaadoSync.getTracking(tnaadoOrderId);
      setTracking(data);
    }

    fetchTracking();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTracking, 30000);
    return () => clearInterval(interval);
  }, [tnaadoOrderId]);

  if (!tracking) return <div>Loading tracking...</div>;

  return (
    <div>
      <h3>Tracking: {tracking.tracking_number}</h3>
      <p>Status: {tracking.status}</p>
      <p>Carrier: {tracking.carrier}</p>
      <a href={tracking.tracking_url} target="_blank">Track Package</a>

      <div>
        <h4>Tracking Events</h4>
        {tracking.events.map((event, i) => (
          <div key={i}>
            <span>{new Date(event.timestamp).toLocaleString()}</span>
            <span> - {event.status}</span>
            <span> - {event.location}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 4. Affiliate & Influencer Integration

### Track Conversion

**Endpoint**: `POST /affiliates/conversions`

**When to call**: After order payment confirmation

**Request Body**:
```json
{
  "affiliate_code": "INFLUENCER123",
  "order_id": "uuid-from-supabase",
  "tnaado_order_id": "TNO-12345",
  "brand_id": "sluekie_001",
  "amount": 324.82,
  "commission_rate": 0.10,
  "commission_amount": 32.48,
  "customer_email": "customer@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "conversion_id": "CONV-12345",
  "commission_approved": true,
  "payout_scheduled": "2025-12-01"
}
```

**Implementation**:

```typescript
import { getAffiliateCode, markAffiliateConversion } from '../lib/affiliate';
import { tnaadoSync } from '../lib/tnaado-sync';

async function processOrderPayment(order: Order) {
  // ... payment processing ...

  // Check for affiliate attribution
  const affiliateCode = getAffiliateCode();

  if (affiliateCode) {
    // Mark conversion in Supabase
    await markAffiliateConversion(order.id);

    // Notify Tnaado influencer panel
    await tnaadoSync.trackAffiliateConversion(
      affiliateCode,
      order.id,
      order.totals.total
    );
  }
}
```

### Get Influencer Dashboard Data

**Endpoint**: `GET /affiliates/{code}/performance`

**Query Params**: `?start_date=2025-10-01&end_date=2025-10-31&brand_id=sluekie_001`

**Response**:
```json
{
  "affiliate_code": "INFLUENCER123",
  "period": {
    "start": "2025-10-01",
    "end": "2025-10-31"
  },
  "metrics": {
    "clicks": 1247,
    "conversions": 43,
    "conversion_rate": 3.45,
    "total_sales": 14392.58,
    "commission_earned": 1439.26,
    "commission_pending": 479.75,
    "commission_paid": 959.51
  },
  "top_products": [
    {
      "sku": "SILK-PILLOW-001",
      "name": "Cloud Memory Pillow",
      "sales": 28,
      "revenue": 4172.00
    }
  ]
}
```

## 5. Returns Management

### Create Return

**Endpoint**: `POST /returns`

**Request Body**:
```json
{
  "order_id": "uuid-from-supabase",
  "tnaado_order_id": "TNO-12345",
  "rma_number": "RMA-...",
  "brand_id": "sluekie_001",
  "customer_email": "customer@example.com",
  "items": [
    {
      "sku": "SILK-PILLOW-001",
      "quantity": 1,
      "reason": "wrong_size"
    }
  ],
  "return_shipping": {
    "carrier": "ups",
    "label_url": "https://..."
  }
}
```

**Response**:
```json
{
  "success": true,
  "return_id": "RET-12345",
  "shipping_label": "https://labels.tnaado.ca/RET-12345.pdf",
  "return_address": {
    "name": "Tnaado Returns",
    "address1": "123 Warehouse St",
    "city": "City",
    "state": "ST",
    "postal_code": "12345"
  }
}
```

## Webhook Configuration

Tnaado will send webhooks to your application for events:

### Order Status Updates

**Webhook URL**: `https://sluekie.com/api/webhooks/tnaado/orders`

**Payload**:
```json
{
  "event": "order.status_changed",
  "tnaado_order_id": "TNO-12345",
  "order_id": "uuid-from-supabase",
  "brand_id": "sluekie_001",
  "old_status": "processing",
  "new_status": "shipped",
  "tracking_number": "1Z999AA10123456784",
  "carrier": "ups",
  "timestamp": "2025-11-06T14:30:00Z"
}
```

**Handler Implementation**:

```typescript
// Create: src/api/webhooks/tnaado.ts (if using API routes)
// Or handle in server function

export async function handleTnaadoWebhook(req: Request) {
  const payload = await req.json();

  // Verify webhook signature
  const signature = req.headers.get('X-Tnaado-Signature');
  if (!verifySignature(payload, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Handle event
  switch (payload.event) {
    case 'order.status_changed':
      await supabase
        .from('orders')
        .update({ status: payload.new_status })
        .eq('id', payload.order_id);

      // Send customer notification email
      break;

    case 'order.shipped':
      // Update order with tracking
      // Send shipping notification
      break;

    case 'inventory.updated':
      // Sync inventory changes
      break;
  }

  return new Response('OK', { status: 200 });
}
```

## Error Handling

All API calls should implement retry logic:

```typescript
async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        console.error('Max retries reached:', error);
        return null;
      }

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
  return null;
}
```

## Testing Checklist

- [ ] Order sync creates Tnaado order
- [ ] Inventory updates reflect in product pages
- [ ] Tracking information displays correctly
- [ ] Affiliate conversions tracked to influencer panel
- [ ] Webhooks update order status in real-time
- [ ] Returns create warehouse return tickets
- [ ] Failed API calls queue for retry
- [ ] All requests include proper authentication headers
- [ ] Brand ID correctly identifies each deployment

## Monitoring

Log all API interactions for debugging:

```typescript
console.log('[Tnaado API]', {
  endpoint: '/orders',
  method: 'POST',
  brand_id: BRAND_CONFIG.brand_id,
  order_number: order.order_number,
  response: result,
  timestamp: new Date().toISOString()
});
```
