# Metal My Mini

Custom copper-plated tabletop miniature ordering website.

Production URL: https://metal.margies.app  
Server path: `/var/www/metalmymini`  
App port: **3009** (via Cloudflare tunnel → nginx or direct Node process)

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma (isolated `metal` schema on shared Supabase database)
- iron-session auth
- Local file storage for uploads and gallery images
- Stripe-ready payment structure (dev simulation included)

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase settings and Postgres connection strings.

### Supabase variables (you provided)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API base URL (`http://192.168.0.146:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key for client-side Supabase API use |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin key (keep secret) |
| `NEXT_PUBLIC_SUPABASE_SCHEMA` | Postgres schema name (`metal`) |

### Prisma variables (still required)

Prisma talks directly to Postgres, not the Supabase REST API. You also need:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection for the running app |
| `DIRECT_URL` | Postgres connection for migrations/seed |

On self-hosted Supabase, Postgres is usually port **54322**. Use the `POSTGRES_PASSWORD` from your Supabase install `.env` on the server.

```env
DATABASE_URL="postgresql://postgres:POSTGRES_PASSWORD@192.168.0.146:54322/postgres"
DIRECT_URL="postgresql://postgres:POSTGRES_PASSWORD@192.168.0.146:54322/postgres"
```

All tables and enums live in the PostgreSQL schema **`metal`**, matching `NEXT_PUBLIC_SUPABASE_SCHEMA`.

### 3. Create and migrate database

```bash
npm run db:generate
npx prisma migrate deploy   # production / shared Supabase
# or: npm run db:migrate    # local development
```

### 4. Seed admin user

```bash
npm run db:seed
```

Uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

### 5. Run on port 3009

```bash
npm run dev
```

Open http://localhost:3009

Production:

```bash
npm run build
npm run start
```

## Ubuntu server deployment

Cloudflare is already configured: `metal.margies.app` → Cloudflare tunnel → `localhost:3009`.

On the server:

```bash
cd /var/www/metalmymini
git pull
npm install
npm run db:generate
npm run db:migrate
npm run build
```

Run with PM2 or systemd on port 3009:

```bash
PORT=3009 npm run start
```

Ensure `DATABASE_URL` and `DIRECT_URL` are set in `/var/www/metalmymini/.env`.
Migrations create/use the `metal` schema only — safe on a shared Supabase instance.

**Important:** The server currently uses nginx on port 3009 for the old static placeholder. Replace that with the Node app:

1. Stop/disable the nginx `metalmymini` site on port 3009
2. Run the Next.js app on port 3009 (PM2 example below)
3. Cloudflare tunnel already points `metal.margies.app` → `localhost:3009`

```bash
pm2 start npm --name metalmymini -- start
pm2 save
```

Uploaded model files are stored in `storage/uploads/` (outside the public web root). Gallery images are stored in `storage/gallery/`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/how-it-works` | Process and review policy |
| `/gallery` | Public gallery |
| `/order` | Upload and order flow |
| `/order/confirm` | Payment / dev simulation |
| `/order/status` | Guest order lookup |
| `/login`, `/signup` | Customer accounts (optional) |
| `/account/orders` | Customer order history + reorder |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/orders/[id]` | Order detail |
| `/admin/gallery` | Gallery manager |

## Future integrations

- **Stripe**: add checkout session in `/api/orders` and webhook handler
- **Shipping**: replace placeholder shipping with rate calculation API
- **STL analysis**: validate 100 mm bounding box on upload

## Product pricing

- Cosmetic Copper Finish — AUD $55
- Heavy-Duty Copper Finish — AUD $80
