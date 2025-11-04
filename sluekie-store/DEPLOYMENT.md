# SLUEKIE E-Commerce Deployment Guide

## Prerequisites

- Vercel account
- Supabase project (already configured)
- Tnaado Stripe account details
- Tnaado API credentials (to be provided)

## Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Link Project

```bash
cd sluekie-store
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- What's your project's name? **sluekie-store**
- In which directory is your code located? **./  **
- Want to modify settings? **No**

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```
VITE_BRAND_ID=sluekie_001
VITE_SITE_URL=https://sluekie.com
VITE_SUPABASE_URL=https://gjjlksiwbbssrspysdvh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqamxrc2l3YmJzc3JzcHlzZHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDkzMTYsImV4cCI6MjA3Nzc4NTMxNn0._aqxZNKTfCxwhcm7K0orXPKp8Er2J_pLlcXZ81NNDfI
VITE_STRIPE_PUBLISHABLE_KEY=[Get from Tnaado]
VITE_TNAADO_API_URL=https://api.tnaado.ca
VITE_TNAADO_API_KEY=[Get from Tnaado]
```

Set these for: **Production, Preview, and Development**

### Step 4: Add Custom Domain

1. Go to Project → Settings → Domains
2. Add `sluekie.com` and `www.sluekie.com`
3. Configure DNS records as shown

### Step 5: Deploy

```bash
vercel --prod
```

## Creating Additional Brand Deployments

For each new Tnaado brand:

### 1. Clone Repository

```bash
git clone <original-repo> brand-name-store
cd brand-name-store
```

### 2. Update Brand Configuration

Edit `src/config/brand.ts`:

```typescript
export const BRAND_CONFIG: BrandConfig = {
  name: 'NEW_BRAND_NAME',
  domain: 'newbrand.com',
  brand_id: 'newbrand_001',
  colors: {
    primary: '#...',
    secondary: '#...',
    accent: '#...',
    background: '#...',
  },
  // ... other settings
};
```

### 3. Update Environment Variables

Create new `.env` with:

```
VITE_BRAND_ID=newbrand_001
VITE_SITE_URL=https://newbrand.com
# ... other variables (same Supabase, Stripe, Tnaado)
```

### 4. Deploy as New Vercel Project

```bash
vercel
# Create NEW project (don't link to existing)
```

### 5. Add Brand to Database

```sql
INSERT INTO brands (name, slug, domain, settings, active)
VALUES (
  'NEW_BRAND_NAME',
  'newbrand',
  'newbrand.com',
  '{
    "colors": {...},
    "logo": "/logo.png"
  }'::jsonb,
  true
);
```

## Database Initialization

### Add Sample Products for SLUEKIE

```sql
INSERT INTO products (brand_id, sku, name, description, price, compare_at_price, category, inventory_quantity, images, active)
VALUES
  (
    'sluekie_001',
    'SILK-PILLOW-001',
    'Cloud Memory Pillow',
    'Adaptive memory foam with cooling gel infusion for optimal spinal alignment and temperature regulation throughout the night.',
    149.00,
    199.00,
    'pillows',
    50,
    '[{"url": "", "alt": "Cloud Memory Pillow", "order": 1}]'::jsonb,
    true
  ),
  (
    'sluekie_001',
    'SILK-MASK-001',
    'Mulberry Silk Sleep Mask',
    'Pure Grade 6A mulberry silk for ultimate comfort and complete light blocking. Hypoallergenic and gentle on skin.',
    79.00,
    99.00,
    'accessories',
    100,
    '[{"url": "", "alt": "Silk Sleep Mask", "order": 1}]'::jsonb,
    true
  ),
  (
    'sluekie_001',
    'SHEET-SET-001',
    'Essential Sheet Set',
    'Percale weave organic cotton sheets with temperature control technology. Includes fitted sheet, flat sheet, and pillowcases.',
    179.00,
    229.00,
    'sheets',
    30,
    '[{"url": "", "alt": "Sheet Set", "order": 1}]'::jsonb,
    true
  ),
  (
    'sluekie_001',
    'SIGNATURE-SET-001',
    'Signature Comfort Collection',
    'Complete bedding set with premium organic cotton, thermoregulating technology, and luxurious comfort.',
    299.00,
    399.00,
    'collections',
    20,
    '[{"url": "", "alt": "Signature Collection", "order": 1}]'::jsonb,
    true
  );
```

## Wiring Tnaado Backend

### 1. Get API Credentials

Contact Tnaado team for:
- `VITE_TNAADO_API_KEY`
- Stripe publishable key
- Webhook endpoints

### 2. Test Integration Points

Test each scaffolded function in `src/lib/tnaado-sync.ts`:

```typescript
// Test order sync
const result = await tnaadoSync.syncOrder(testOrder);
console.log('Tnaado Order ID:', result?.tnaado_order_id);

// Test inventory check
const inventory = await tnaadoSync.getInventory('SILK-PILLOW-001');
console.log('Available:', inventory?.available);

// Test tracking
const tracking = await tnaadoSync.getTracking(orderId);
console.log('Status:', tracking?.status);
```

### 3. Configure Webhooks

Set up webhook endpoints for:
- Stripe payment events → `/api/webhooks/stripe`
- Tnaado order updates → `/api/webhooks/tnaado`

## Monitoring & Maintenance

### Check Order Sync Status

```sql
SELECT
  order_number,
  email,
  status,
  tnaado_sync_status,
  tnaado_order_id,
  created_at
FROM orders
WHERE brand_id = 'sluekie_001'
  AND tnaado_sync_status = 'pending'
ORDER BY created_at DESC;
```

### Monitor Affiliate Performance

```sql
SELECT
  affiliate_code,
  COUNT(*) as clicks,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) as rate
FROM affiliate_clicks
WHERE brand_id = 'sluekie_001'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY affiliate_code
ORDER BY conversions DESC;
```

### Check Inventory Levels

```sql
SELECT
  sku,
  name,
  inventory_quantity,
  category
FROM products
WHERE brand_id = 'sluekie_001'
  AND active = true
  AND inventory_quantity < 10
ORDER BY inventory_quantity ASC;
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vercel
npm install
npm run build
```

### Supabase Connection Issues

Check RLS policies are correctly set:

```sql
-- Verify public can read products
SELECT * FROM products WHERE brand_id = 'sluekie_001' AND active = true;

-- Test as authenticated user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-id-here"}';
SELECT * FROM orders WHERE customer_id = 'user-id-here';
```

### Environment Variables Not Working

Ensure all env vars are prefixed with `VITE_` for client-side access.

## Next Steps

1. **Add Real Product Images**
   - Upload to CDN or Supabase Storage
   - Update `images` field in products table

2. **Configure Stripe**
   - Test payment flow
   - Set up webhook handlers
   - Configure tax calculation

3. **Wire Tnaado APIs**
   - Test each integration point
   - Handle error cases
   - Set up monitoring

4. **Launch Checklist**
   - [ ] SSL certificate active
   - [ ] Custom domain configured
   - [ ] Products added with images
   - [ ] Stripe integration tested
   - [ ] Test orders placed
   - [ ] Email templates configured
   - [ ] Analytics set up
   - [ ] SEO metadata added

## Support Contacts

- **Deployment Issues**: Vercel support
- **Database/Auth**: Supabase support
- **Tnaado Integration**: [Contact Tnaado team]
- **Payment Processing**: Stripe support
