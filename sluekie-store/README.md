# SLUEKIE E-Commerce Platform

A fully-featured, multi-tenant e-commerce platform built for SLUEKIE luxury bedding brand, designed to be replicated for multiple Tnaado brands.

## Project Overview

This is a white-label e-commerce solution that:
- Connects to the main Tnaado Supabase backend
- Integrates with Tnaado's Stripe account
- Provides scaffolding for Tnaado warehouse management, influencer panel, and order tracking
- Can be deployed separately for each brand on Vercel

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand with localStorage persistence
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe (scaffolded for Tnaado integration)
- **Routing**: React Router v6
- **Deployment**: Vercel

## Features Implemented

### Core Shopping Experience
✅ Product catalog with category filtering
✅ Product detail pages with variant support
✅ Shopping cart with local storage persistence
✅ Cart sync to Supabase for authenticated users
✅ Guest checkout support
✅ Checkout flow (Stripe integration scaffolded)

### Customer Features
✅ User authentication (email/password via Supabase)
✅ Customer account management
✅ Order history and tracking (scaffolded)
✅ Returns request system (scaffolded)
✅ Wishlist functionality

### Business Features
✅ Affiliate/influencer tracking with 30-day cookie attribution
✅ Multi-tenant brand configuration system
✅ Inventory tracking (scaffolded for Tnaado warehouse sync)
✅ Order sync with Tnaado backend (scaffolded)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure the Stripe and Tnaado API keys.

## Tnaado Integration Points

The following are **scaffolded** in `src/lib/tnaado-sync.ts`:
- Order sync to Tnaado backend
- Inventory management from Tnaado warehouse
- Order tracking integration
- Affiliate conversion tracking to influencer panel

## Multi-Tenant Deployment

Each brand deployment:
1. Has its own Vercel project
2. Shares Supabase database (isolated by `brand_id`)
3. Uses same Tnaado Stripe account (tagged by `brand_id`)
4. Connects to same Tnaado backend APIs

Configure brand-specific settings in `src/config/brand.ts`

## Database Schema

All tables created with RLS enabled:
- `brands` - Multi-brand configuration
- `products` - Product catalog
- `carts` - Shopping cart persistence
- `orders` - Order management
- `affiliate_clicks` - Affiliate tracking
- `returns` - Return/refund management
- `wishlists` - Customer wishlists
- `inventory_movements` - Stock audit trail
