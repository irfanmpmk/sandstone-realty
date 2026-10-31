# Sandstone Realty — real-estate website demo

A Dubai property website with map search and an agent dashboard for incoming leads.
**All listings, agents and leads are fictional; photos are free stock images.**

## What it does

**For buyers and tenants**
- Search by buy/rent, area, type, bedrooms and price; every search is a shareable URL
- List and map views (OpenStreetMap, price pins)
- Property pages with photo gallery, key facts, location map and similar homes
- Enquiry / viewing-request form with validation and spam protection
- One-tap WhatsApp to the agent, with the listing pre-filled
- Mortgage calculator on every sale listing (UAE defaults: 20% down)

**For agents** (`/admin`, demo login shown on the login page)
- Leads arrive instantly from the website
- Pipeline: New → Contacted → Viewing booked → Negotiating → Won / Lost, with notes
- Stats: new leads, leads this week, viewings, conversion, most-enquired listings
- Call and WhatsApp buttons on every lead; "Reset demo data" restores the sample leads

## Stack

Next.js 16 (App Router, Server Components, Server Actions) · TypeScript · Tailwind CSS 4 · PostgreSQL (Neon in production, PGlite locally) · Leaflet + OpenStreetMap · Zod

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Without `DATABASE_URL` the app uses PGlite (Postgres in WebAssembly, stored in `.pglite/`), so no database install is needed. Tables and demo data are created on first start.

## Environment

| Variable | |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon). Omit to use local PGlite. |
| `SESSION_SECRET` | Long random string used to sign the admin session cookie. **Set this in production.** |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Real admin login. When unset, the demo login is used and shown on the login page. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Agency WhatsApp number (digits). When unset, WhatsApp opens the share sheet. |
