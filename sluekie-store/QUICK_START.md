# SLUEKIE Quick Start Guide

## For Developers - Get Running in 5 Minutes

### 1. Install & Run

```bash
cd sluekie-store
npm install
npm run dev
```

Open `http://localhost:5173`

### 2. Add Sample Products

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO products (brand_id, sku, name, description, price, category, inventory_quantity, active)
VALUES
  ('sluekie_001', 'PILLOW-001', 'Cloud Memory Pillow', 'Premium memory foam pillow', 149.00, 'pillows', 50, true),
  ('sluekie_001', 'MASK-001', 'Silk Sleep Mask', 'Mulberry silk mask', 79.00, 'accessories', 100, true),
  ('sluekie_001', 'SHEET-001', 'Essential Sheet Set', 'Organic cotton sheets', 179.00, 'sheets', 30, true);
```

### 3. Test the App

1. Visit homepage → See hero section
2. Click "Experience the Difference" → Browse products
3. Click product → View details
4. Click "Add to Cart" → Cart updates
5. Go to cart → See items
6. Click "Register" → Create account
7. Login → Access account features

## Project Structure Quick Reference

```
src/
├── config/brand.ts         ← Brand settings (colors, API endpoints)
├── lib/
│   ├── supabase.ts         ← Database client
│   ├── affiliate.ts        ← Affiliate tracking
│   └── tnaado-sync.ts      ← Tnaado API (scaffolded)
├── store/
│   ├── cartStore.ts        ← Shopping cart state
│   └── authStore.ts        ← User authentication
├── hooks/
│   └── useProducts.ts      ← Product data fetching
├── pages/                  ← All routes
└── types/index.ts          ← TypeScript interfaces
```

## Key Features Status

✅ **Working Now:**
- Product catalog
- Shopping cart (persisted)
- User authentication
- Affiliate tracking (cookie-based)
- Multi-brand configuration

🔧 **Needs Wiring:**
- Stripe checkout (add VITE_STRIPE_PUBLISHABLE_KEY)
- Tnaado order sync (add VITE_TNAADO_API_KEY)
- Warehouse inventory (Tnaado API)
- Email notifications
- Order tracking (Tnaado API)

## Common Tasks

### Change Brand Colors

Edit `src/config/brand.ts`:

```typescript
colors: {
  primary: '#1E2D4D',     // Deep navy
  secondary: '#CBDAD5',   // Sage green
  accent: '#D4CFE7',      // Lavender
  background: '#0F1B2E',  // Midnight blue
}
```

### Add New Product

```sql
INSERT INTO products (brand_id, sku, name, description, price, category, inventory_quantity, active)
VALUES ('sluekie_001', 'NEW-SKU', 'Product Name', 'Description', 99.00, 'category', 50, true);
```

### Check Orders

```sql
SELECT order_number, email, status, totals->>'total' as total
FROM orders
WHERE brand_id = 'sluekie_001'
ORDER BY created_at DESC
LIMIT 10;
```

### View Cart Data

```sql
SELECT user_id, items, created_at
FROM carts
WHERE expires_at > NOW()
ORDER BY created_at DESC;
```

### Monitor Affiliates

```sql
SELECT affiliate_code, COUNT(*) as clicks, SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions
FROM affiliate_clicks
WHERE brand_id = 'sluekie_001'
GROUP BY affiliate_code;
```

## Environment Variables Checklist

Create `.env` with:

```bash
VITE_BRAND_ID=sluekie_001
VITE_SITE_URL=http://localhost:5173

# Already configured:
VITE_SUPABASE_URL=https://gjjlksiwbbssrspysdvh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Need to add:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_TNAADO_API_KEY=...
```

## Deploy to Vercel

```bash
vercel login
vercel
# Follow prompts
```

Add environment variables in Vercel dashboard.

## Troubleshooting

**Products not showing?**
- Check database: `SELECT * FROM products WHERE brand_id = 'sluekie_001' AND active = true`
- Verify RLS policies allow public read

**Cart not persisting?**
- Check browser localStorage
- Look for `cart-storage` key

**Auth not working?**
- Verify Supabase URL and anon key
- Check Supabase Auth settings (email enabled)

**Build errors?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Next Steps

1. **Add product images** → Update `images` field in products table
2. **Configure Stripe** → Get publishable key from Tnaado
3. **Wire Tnaado APIs** → See `TNAADO_INTEGRATION.md`
4. **Deploy** → See `DEPLOYMENT.md`
5. **Launch** → Add custom domain, SSL, go live!

## Documentation

- `README.md` - Full project documentation
- `DEPLOYMENT.md` - Deployment guide with multi-brand setup
- `TNAADO_INTEGRATION.md` - Complete API integration reference
- `QUICK_START.md` - This file

## Support

- Supabase issues → Check RLS policies
- Build errors → Clear cache, reinstall
- Tnaado integration → See integration guide
- General questions → Check README

---

**You're all set!** The platform is ready to be wired to Tnaado backend and deployed.
