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

## Step 3 — Deploy (Nixpacks — Single App, Single Port)

Both backend and frontend run in one container. Next.js proxies `/api/v1/*` to the
backend on `localhost:5000`, so only **port 3000** needs to be exposed.

1. Go to **Projects** → **New Project** → name it `ArwaPark`
2. Click **Add New Resource** → **Application**
3. Select your GitHub source → repo `bestqrov/achko`
4. Configure:
   - **Branch**: `main`
   - **Build Pack**: `Nixpacks`
   - **Base Directory**: *(leave empty — repo root)*
   - **Port**: `3000`
5. Set **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://advicermano_db_tinljdid:qdK6aAF1rzY0Cn5e@cluster0.t3zjffy.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `qwertyhgtfrdesawefbbbbbbbb2345565drdfdcbc` |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `https://arwapark.digima.cloud` |
| `NEXT_PUBLIC_API_URL` | `/api/v1` |
| `NEXT_PUBLIC_DOMAIN` | `arwapark.digima.cloud` |

6. Under **Network** → assign domain: `arwapark.digima.cloud`, port `3000`
7. Enable HTTPS (Let's Encrypt automatic)
8. Click **Deploy**

---

## Step 5 — DNS Configuration

In your domain registrar (or Hostinger hPanel), add:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `<your-vps-ip>` |

Wait 5–30 minutes for DNS propagation.

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
