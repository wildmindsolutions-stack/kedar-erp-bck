# Backend deployment (Render)

## Root cause of `Cannot POST /api/store/auth/login` (404)

The live API at `https://kedar-erp-bck.onrender.com` is running an **older build** that does not include the **Store module** (`/api/store/*` routes). CORS works (`/api/health` responds), but store auth was never deployed.

## Fix: redeploy latest backend

### Render settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` (if repo is the monorepo) or `.` (if backend-only repo) |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |

`start:prod` runs `prisma migrate deploy` then starts the server.

### Required env vars

```
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://kedar-erp.vercel.app,https://kedar-foundation.vercel.app
COMPANY_GSTIN=...
COMPANY_NAME=Kedar Enterprise
COMPANY_STATE=Maharashtra
PORT=10000
```

### After deploy — verify routes

```bash
curl https://kedar-erp-bck.onrender.com/api/health
curl https://kedar-erp-bck.onrender.com/api/store/products
```

Both should return JSON (not 404).

### Foundation site (Vercel)

```
NEXT_PUBLIC_API_URL=https://kedar-erp-bck.onrender.com/api
```

Redeploy Vercel after changing env vars.

## Migrations

Migration `20260711100000_add_foundation_store` creates:

- `foundation_accounts` — website customer login
- `customer_notifications` — order update bell

Push this migration to GitHub before redeploying Render.
