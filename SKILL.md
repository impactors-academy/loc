---
name: loc-platform-builder
description: Use this skill when building, extending, or making decisions about the LOC tourism platform. Triggers on any task related to LOC features, pages, components, revenue streams, backend logic, or content strategy. Also triggers when the user mentions tourists, listings, experiences, commissions, Morocco, or digital products in the context of this project.
---

## Project Overview

LOC is a **digital tourism connector and media brand** operating under Impactor's Academy, focused on Morocco (and France). It is transitioning from a direct short-term rental operator into a scalable tourism-tech platform.

The platform connects tourists with:
- **Experience providers** (quad biking, desert tours, skydiving, hot air balloons, boat trips, wellness)
- **Property owners** (apartments, villas, vacation homes, local stays)
- **Digital products** (travel guides, experience maps, relocation guides, content packs)

LOC earns revenue through referral commissions, featured placements, sponsored promotions, affiliate partnerships, and digital product sales — not by owning or operating properties directly.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** To be determined — default to Node.js/Express or Next.js API routes for lightweight endpoints
- **Repo structure:**
  - `frontend/` — Next.js app
  - `backend/` — API server
- **Branch:** `develope` is the active development branch; `main` is production-stable

## Core Platform Features (Priority Order)

### 1. Tourism Experience Discovery
Pages and components that let tourists browse and filter experiences by category (adventure, wellness, cultural, etc.). Each listing shows provider info, pricing range, and a referral/inquiry CTA. LOC earns a commission on referrals — do not build a full booking engine, just lead generation.

### 2. Property Listings
A directory of stays (apartments, villas, vacation homes) where landlords pay for visibility. Build as a listing card grid with filters (location, type, price range). Each card links to a contact/inquiry form — not a direct booking system.

### 3. Digital Product Store
A simple storefront for downloadable products:
- Morocco & France travel guides (PDF/eBook)
- Local experience maps (Notion templates or PDF)
- Relocation & remote worker guides
- Tourism photography/content packs

### 4. Tourism Media / Content Hub
A blog or video feed showcasing travel content, hidden destinations, and experience reviews. This builds audience trust and SEO. Connect to social media (Instagram Reels, TikTok embeds where possible).

### 5. Business Promotion Packages
A landing page for tourism businesses to inquire about sponsored placements, social media promotions, and content packages.

## Brand & Design Direction

LOC positions itself around these themes: **Discovery, Adventure, Lifestyle, Luxury experiences, Authentic Moroccan tourism, Convenience, Community.**

Design guidelines:
- Clean, modern, tourism-forward aesthetic
- Mobile-first (tourists browse on phones)
- Use warm earthy tones + vibrant accent colors that evoke Morocco (terracotta, sand, deep blue)
- High-quality imagery is central — always reserve prominent space for hero images and experience photos
- Avoid cluttered layouts; prioritize whitespace and clear CTAs

## Revenue Model — Keep in Mind

When building any feature, consider how it connects to a revenue stream:

| Feature | Revenue model |
|---|---|
| Experience listings | Referral commission per booking |
| Property listings | Monthly subscription or per-lead fee |
| Sponsored placements | One-time or recurring ad fee |
| Digital products | Direct sale (PDF/eBook) |
| Affiliate links | Commission on external purchases |
| Content/media | Sponsored posts, brand partnerships |

Never build a complex booking engine — LOC's model is lead generation and referral, not transaction processing.

## Development Principles

- Build pages and components that work on mobile first, then scale up
- Keep the codebase simple — this is a lean team; avoid over-engineering
- Use shadcn/ui components as the base UI layer; extend with Tailwind
- Every page should have a clear CTA that connects to a revenue stream (inquiry form, product purchase, referral link)
- For any new feature, ask: "Does this help a tourist discover something, or help a business get clients?" If neither, deprioritize it

## File Structure Conventions

```
frontend/
  app/
    (marketing)/       # Public-facing pages (home, experiences, stays, blog)
    (store)/           # Digital product store
    (dashboard)/       # Future: partner/business dashboard
  components/
    ui/                # shadcn/ui primitives
    shared/            # Reusable layout components (Navbar, Footer, Cards)
    features/          # Feature-specific components (ExperienceCard, ListingGrid)
  lib/                 # Utilities, API helpers, types
```

## What to Avoid

- Do not build a full payment/checkout system yet — use Gumroad or a simple link for digital products initially
- Do not build user authentication in the first phase — focus on the public-facing platform
- Do not replicate Airbnb — LOC does not manage bookings; it generates leads and earns commissions
- Do not over-invest in admin dashboards before the public platform is live