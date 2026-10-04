# Solowise India

Solowise India is a single-page, static e-commerce storefront for selling digital learning products and upsells. The project is built as a collection of responsive HTML pages with embedded CSS and JavaScript rather than a full framework or backend app. It combines marketing landing pages, a product detail flow, Razorpay checkout, thank-you confirmation pages, affiliate reporting, and third-party tracking for Meta Pixel and Google Analytics.

## Overview

This repository is focused on a premium digital product called the "2026 Freelancer Playbook" and related upsell offers. The site is designed to convert visitors through a marketing funnel that includes:

- Storefront / landing page
- Product detail page with pricing and urgency timers
- Checkout with order form and Razorpay payment integration
- Purchase confirmation and access page
- Upsell offers for additional products or bundles
- Affiliate dashboard for partner management and coupon tracking

The codebase is intentionally front-end-heavy, with a lot of presentation logic in HTML/CSS and product-state logic in JavaScript.

## Repository structure

```text
.
├── affiliate.html          # Affiliate login + partner dashboard
├── checkout.html           # Checkout page with order form + Razorpay integration
├── index.html              # Main landing page and funnel homepage
├── meta-tracking.js        # Shared tracking helper for Meta Pixel / attribution
├── product.html            # Product detail page with gallery, urgency timer, CTA
├── product-unavailable.html# Product unavailable / invalid product state
├── thankyou.html           # Order verified / purchase confirmation page
├── thankyouu.html          # Alternate thank-you page variant
├── upsell.html             # Upsell landing page for additional offers
├── upsellcheckout.html     # Upsell payment checkout flow
└── README.md               # Project documentation
```

## Core pages and responsibilities

### 1) `index.html`
This is the primary storefront and marketing landing page. It presents the product as a premium digital playbook and frames the offer around a freelancer growth strategy. The page includes:

- Large hero section with product positioning
- Feature and benefit blocks
- Trust / value narrative sections
- CTA buttons that route to product purchase flow
- Dark/light mode responsive styling
- Custom design system using CSS variables

The page is visually rich, relying heavily on gradients, glassmorphism-like panels, and a premium editorial design tailored for conversion marketing.

### 2) `product.html`
This is the product detail page where a user learns more about the item before buying. It includes:

- Product gallery with image carousel and thumbnail navigation
- Pricing block with original price, discount, and savings tag
- Urgency timer to create sales pressure
- Detailed product description and benefit badges
- Sticky buy bar for mobile / desktop purchase CTA
- Product state handling for unavailable or missing products

The page is script-driven, likely using query parameters or product configuration state to populate title, image, and pricing details. It also sends tracking data to Meta Pixel via the configured analytics scripts.

### 3) `checkout.html`
This page handles the order flow prior to payment. It includes:

- Multi-step checkout UI (customer details + review)
- Validation for required form fields
- Coupon code support and promotion logic
- Price summary and discount calculation
- Razorpay checkout script loaded from `https://checkout.razorpay.com/v1/checkout.js`
- Order confirmation / redirect flow

The user fills in details, optionally applies a discount, then proceeds to pay. The page is designed to look like a premium, secure purchase experience and uses strong visual treatment around safety and trust.

### 4) `thankyou.html`
This is the post-payment success page. It confirms the purchase and surfaces the order ID. It also shows:

- Payment verified state
- Product access card
- Download / access buttons
- Copy-to-clipboard order ID utility
- Support and follow-up information
- Embedded upsell or additional access sections

The page is designed to reassure the customer that the transaction was successful and to deliver next-step instructions.

### 5) `affiliate.html`
This file is the affiliate system dashboard. It appears to be a partner portal for affiliate login and revenue management, including:

- Login / auth screen
- Dashboard stats cards
- Commission calculations
- Coupon management area
- Orders table with customer, amount, and commission information
- Status chips and conversion tracking UI

This page is more complex than the storefront pages and appears to manage partnership operations, affiliate rates, and promotional code configuration.

### 6) `upsell.html` and `upsellcheckout.html`
These pages support an upsell flow, where the user is prompted to buy an additional product after the first purchase. They use the same premium, sales-heavy aesthetic as the rest of the funnel and are structured to push users toward a second offer without much friction.

### 7) `meta-tracking.js`
This file is a reusable tracking helper that centralizes analytics and attribution logic. It is responsible for:

- Generating a stable external ID in local storage
- Creating event IDs in session storage
- Reading tracking parameters such as `utm_*`, `fbclid`, `fbp`, and `fbc`
- Capturing landing page URLs and attribution metadata
- Tracking Facebook events via `window.fbq`
- Sending server-side analytics payloads through a Supabase function endpoint

The file is highly relevant to conversion tracking and is a major integration point for marketing analytics.

## Product and funnel logic

The project is built around a conversion funnel rather than a traditional app. The flow is roughly:

1. Visitor lands on `index.html`
2. Marketing content builds interest and trust
3. CTA takes the user to the product page (`product.html`)
4. Product page presents the offer and urgency messaging
5. User proceeds to checkout (`checkout.html`)
6. Payment is processed via Razorpay
7. Confirmation page (`thankyou.html`) indicates success and access
8. Optional upsell pages increase cart value and conversion
9. Affiliate pages support partner management and coupon-based marketing

## External services and integrations

### Razorpay
The checkout pages include the Razorpay CDN script:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

This indicates real payment processing is performed through Razorpay, with checkout pages likely creating and opening Razorpay payment modal flows.

### Meta Pixel
The product and thank-you pages include Meta Pixel scripts. These are used for ad tracking and conversion measurement:

```html
<script>
  !function(f,b,e,v,n,t,s){...}
</script>
```

The tracking helper wraps this behavior and sends more structured event and attribution data.

### Google Analytics 4
GA4 is also initialized on the sales pages:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-30149MQVVT"></script>
```

This enables campaign and page-view analytics for the storefront.

### Supabase
`meta-tracking.js` sends data to a Supabase Edge Function endpoint:

```js
fetch(`${SUPABASE_URL}/functions/v1/meta-track`, ...)
```

This indicates tracking data is being forwarded to a server-side function for analytics or attribution capture.

## Design approach

The repository has a strong conversion-marketing design system:

- Premium editorial layouts
- Responsive marketing pages
- Dark-mode support via `prefers-color-scheme`
- Attention-grabbing typography and large headlines
- Conversion-focused UI elements (timers, badges, sticky CTAs)
- Highly branded styling with a distinct earthy / neutral palette

The code uses CSS variables extensively to keep the pages consistent and easy to alter. This is a clear sign the project was designed as a visually polished static storefront rather than a CMS-driven app.

## Technical characteristics

### Front-end-only architecture
This is primarily a front-end repository. There are no modern app folders, no package.json, no build process, and no framework-specific source tree. Pages are served directly as static HTML files.

### Client-side state management
The code relies on browser storage such as:

- `localStorage`
- `sessionStorage`
- URL search params
- Cookies for tracking parameters like `_fbp` / `_fbc`

This is useful for attribution, event deduplication, and conversion analytics.

### Security note
The repository contains a hardcoded Supabase anonymous key in `meta-tracking.js`, which is fine for anonymous tracking but should be treated carefully. In production-grade systems, secrets or service-level credentials should not be embedded in front-end code unless intentionally designed for public access.

## Local development and usage

Because this repository is static HTML/CSS/JS, it can usually be run by opening the files directly in a browser or serving the folder with a local static web server.

Examples:

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/product.html`
- `http://localhost:8000/checkout.html`

If you want to test the purchase flow fully, you will also need the external services configured, including Razorpay, Supabase, and the analytics scripts.

## Deployment notes

This project appears meant for static hosting, for example:

- Netlify
- Vercel
- GitHub Pages
- Any simple CDN-backed static host

It depends on browser-executed JavaScript and third-party services at runtime, so deployment should account for those assets and external domains.

## Strengths of the codebase

- Polished conversion-focused design
- Strong responsive layout implementation
- Clear funnel structure from marketing to checkout to confirmation
- Integrated analytics and attribution tracking
- Reusable design language across several pages
- Good separation between marketing pages, product pages, and checkout pages

## Areas to consider for production hardening

- Move sensitive or environment-specific configuration out of front-end code when possible
- Separate tracking logic into a cleaner build pipeline or config-driven structure
- Add automated QA checks for the checkout and funnel flows
- Validate all forms consistently with a shared validation layer
- Audit script handling in `checkout.html` / `product.html` for edge-case failures and testing coverage
- Replace ad-hoc duplicate pages such as `thankyouu.html` with a more unified flow where appropriate

## Summary

This repository is a highly styled static storefront and sales funnel for a digital product business. It is not a traditional web application; it is a marketing and commerce website built with HTML, CSS, and JavaScript that integrates with Razorpay, analytics tools, and a Supabase tracking backend. It is well suited for a sales-driven digital product, especially for a premium information product or course-style funnel.

The code is clearly designed to maximize conversion, trust, and campaign tracking while keeping implementation simple and fast to deploy.

## Recommended next steps

- Review and document the exact product/offer data used by the funnel
- Add a central config file for pricing, product names, and URLs
- Consolidate duplicate thank-you / upsell pages into a cleaner funnel logic
- Audit analytics firing for production reliability
- Implement end-to-end testing for product selection, checkout, and confirmation

This README gives a practical overview of the repository structure and the marketing-commerce architecture implemented across the project.
