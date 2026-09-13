# Metal My Mini - Project Context

Last Updated: September 2026

## Overview

Metal My Mini is a custom manufacturing service for tabletop gamers, primarily Dungeons & Dragons players.

Customers upload a 3D model file and receive a professionally manufactured copper-plated miniature.

The business is not primarily a 3D printing service. The primary value proposition is the production of premium copper-plated miniatures from customer-supplied models.

Development site:

https://metal.margies.app

Development server:

Ubuntu server hosted by John.

Application port:

3009

---

## Business Owner

Shay

Business stage:

Pre-launch

Business model:

Manufacturing service

Target outcome:

Profitable side hustle that may grow into a part-time business.

---

## Unique Selling Proposition

Many companies offer custom 3D printed miniatures.

Metal My Mini offers custom copper-plated miniatures produced from customer supplied files.

Primary marketing message:

"Turn your custom tabletop miniature into copper-plated metal."

---

## Target Market

Primary:

- Dungeons & Dragons players

Secondary:

- Tabletop gamers
- Miniature collectors

Service area:

Worldwide

---

## Manufacturing Process

1. Customer uploads STL / OBJ / 3MF
2. Customer selects finish
3. Customer pays
4. Human review performed
5. Miniature printed in resin
6. Miniature copper plated
7. Miniature polished and finished
8. Product packaged
9. Product shipped

---

## Manufacturing Equipment

Primary printer:

Saturn 4 Ultra 16K

Build volume:

211 × 118 × 220 mm

Material:

UV resin

Plating process:

Acid copper electroplating

Plating tanks:

2

Typical production time:

Approximately 3 days

Estimated capacity:

Approximately 20 jobs per week

---

## Product Range

Launch focus:

Miniatures only

Maximum size:

100 mm in any dimension

Minimum practical size:

Approximately the size of an Australian 5 cent coin

Accepted file formats:

- STL
- OBJ
- 3MF

---

## Product Options

Finish products are managed in admin (name, price, thumbnail, active).

Each finish can have option groups (for example Patina, Sealing). Customers pick one choice per group. Admin can mark specific choices that cannot be combined (for example some oxidisation patinas cannot be sealed). Choices may include a price delta or be included.

---

## Pricing Rules

Pricing is fixed.

Pricing assumes a production-ready model.

Metal My Mini reserves the right to:

- reject unsuitable models
- request additional payment
- issue refunds

Minimum order value:

AUD $55

Discounts available for:

- multiple copies
- multiple models in one order

---

## Customer Accounts

Guest checkout supported.

Customer accounts optional.

Account holders receive:

- order history
- reordering
- internal production status

Guests receive:

- order confirmation
- shipping updates
- freight tracking

---

## STL Handling

Uploaded models should be retained permanently.

Initial review process:

Human review only.

Automatic STL analysis may be added later.

---

## Shipping

Worldwide.

Customer pays shipping.

Freight tracking available.

Shipping provider to be determined.

---

## Order page controls

Admin can show a plain-text banner on `/order` (for backlog or other alerts) and can pause new orders. While paused, the order form is replaced with an email waitlist (`order_waitlist` in Subscribers). New order creation is blocked server-side so Stripe payments are not taken.

---

## Gallery Policy

All completed miniatures may be photographed.

Completed work may be displayed in:

- gallery
- website
- marketing material
- social media

Customers agree to this during checkout.

---

## Social Media

Primary platform:

Instagram

Future possibilities:

- TikTok
- Facebook
- YouTube
- Discord

---

## Version 1 Priorities

1. STL upload
2. Order creation
3. Payment collection
4. Human review workflow
5. Admin dashboard
6. Customer accounts
7. Order tracking
8. Gallery
9. Order-page banner and pause
10. Finish sub-options
11. Journal

---

## Order Status Workflow

submitted

paid

human_review

approved

printing

plating

polishing

packaging

shipped

completed

Alternative states:

awaiting_customer_action

additional_payment_required

rejected

refunded

cancelled

---

## Technical Requirements

Hosting:

Ubuntu

Public URL:

https://metal.margies.app

Application Port:

3009

Recommended stack:

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Stripe-ready payment architecture