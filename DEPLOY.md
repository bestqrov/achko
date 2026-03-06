# ArwaPark SaaS — Coolify Deployment Guide (Hostinger VPS)

## Prerequisites

- Hostinger VPS (Ubuntu 22.04 recommended, min 2GB RAM)
- Domain name with DNS access
- GitHub repository: `https://github.com/bestqrov/achko`
- MongoDB Atlas account (or self-hosted MongoDB)

---

## Step 1 — Install Coolify on your VPS

SSH into your Hostinger VPS and run:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Once installed, open Coolify at:
```
http://<your-vps-ip>:8000
```

Complete the initial setup (create admin account).

---

## Step 2 — Connect your GitHub Repository

1. In Coolify dashboard → **Sources** → **Add** → **GitHub**
2. Connect your GitHub account
3. Select repository: `bestqrov/achko`

---

## Step 3 — Deploy (Single Container)

1. Go to **Projects** → **New Project** → name it `ArwaPark`
2. Click **Add New Resource** → **Application**
3. Select your GitHub source → repo `bestqrov/achko`
4. Configure:
   - **Branch**: `main`
   - **Build Pack**: `Dockerfile`
   - **Dockerfile Location**: `Dockerfile` *(root)*
   - **Ports**: `5000, 3000`
5. Set **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | `your_very_long_secret_key` |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `https://arwapark.digima.cloud` |
| `NEXT_PUBLIC_API_URL` | `https://arwapark.digima.cloud/api/v1` |
| `NEXT_PUBLIC_DOMAIN` | `arwapark.digima.cloud` |

6. Under **Network**:
   - Port `5000` → domain `arwapark.digima.cloud` (API — routed via `/api` path)
   - Port `3000` → domain `arwapark.digima.cloud` (Frontend)
7. Enable **HTTPS** on both domains (Let's Encrypt automatic)
8. Click **Deploy**

---

## Step 5 — DNS Configuration

In your domain registrar (or Hostinger hPanel), add:

| Type | Name | Value |
|------|------|-------|
| `A` | `api` | `<your-vps-ip>` |
| `A` | `app` | `<your-vps-ip>` |

Wait 5–30 minutes for DNS propagation.

---

## Alternative — Deploy with Docker Compose

If you prefer to deploy the full stack as a single service:

1. In Coolify → **Add New Resource** → **Docker Compose**
2. Select your GitHub repo
3. Set **Docker Compose File**: `docker-compose.yml`
4. Add all environment variables from `.env.example`
5. Deploy

---

## First Login After Deployment

Register your admin account via API (run once):

```bash
curl -X POST https://arwapark.digima.cloud/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "agencyName": "ArwaPark Agency",
    "agencyEmail": "contact@arwapark.com",
    "firstName": "Admin",
    "lastName": "ArwaPark",
    "email": "admin@arwapark.com",
    "password": "admin123"
  }'
```

Then log in at: `https://arwapark.digima.cloud/login`

---

## Health Checks

| Service | URL |
|---------|-----|
| Backend health | `https://arwapark.digima.cloud/health` |
| Frontend | `https://arwapark.digima.cloud` |

---

## Useful Coolify Tips

- **Auto-deploy**: Enable in repository settings to auto-deploy on every `git push`
- **Logs**: View real-time container logs in the Coolify dashboard
- **SSL**: Coolify uses Traefik + Let's Encrypt — SSL is automatic
- **Backups**: Configure MongoDB Atlas automated backups
