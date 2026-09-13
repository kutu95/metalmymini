# Metal My Mini - Product Requirements

## Version 1 Goal

Allow customers anywhere in the world to:

- Upload a miniature file
- Select a finish
- Pay
- Track progress
- Receive a completed copper-plated miniature

---

## Customer Features

### Public Website

- Home page
- How It Works page
- Gallery page
- Journal (blog)
- Upload / order page
- Login page
- Register page

### Upload Workflow

Accepted file formats:

- STL
- OBJ
- 3MF

Customer enters:

- Name
- Email
- Shipping address
- Country

Customer selects a finish product and any sub-options (for example patina and sealing). Incompatible combinations are blocked.

If ordering is paused, the form is replaced with a waitlist signup. If a banner is enabled, an alert is shown above the form.

Customer selects quantity.

Customer accepts terms.

Customer pays.

Order created.

---

## Customer Account Features

- Register
- Login
- View order history
- View order status
- Reorder previous models

---

## Guest Customer Features

- Place order
- Receive email updates
- Track shipment

---

## Gallery Features

Public gallery.

Each item contains:

- Title
- Description
- Finish type
- Image
- Date

---

## Journal

Public blog at `/blog`.

Each published entry has:

- Title
- Slug
- Excerpt
- Rich text body
- Optional cover and inline media
- Draft or published state

Drafts are not public. Published posts are in the sitemap, RSS feed, and `llms.txt`.

---

## Admin Features

### Dashboard

- View orders
- Search orders
- Filter orders
- View uploaded files

### Order Management

- Approve
- Reject
- Refund
- Request additional payment
- Add notes
- Upload photos
- Add tracking number
- Change status

### Gallery Management

- Add image
- Edit image
- Delete image
- Publish image

### Order page

- Banner text with on/off toggle
- Pause ordering (hides the form, collects waitlist emails, blocks new order POSTs)

### Products and finish options

- Add, edit, activate, and deactivate finish products
- Nested option groups with single-choice sub-options and optional price deltas
- Mark pairs of sub-options that cannot be combined

### Journal

- Add, edit, and delete posts
- Draft and publish
- Rich text editing and media uploads

---

## Future Features

Not required for Version 1:

- Automatic STL analysis
- Instant quoting
- Marketplace
- STL repair workflow
- Creator accounts
- Automated shipping calculations