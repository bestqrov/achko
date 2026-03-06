# =============================================================
# ArwaPark SaaS — Single Dockerfile (Backend + Frontend)
# Backend  → Node.js/Express on port 5000
# Frontend → Next.js standalone on port 3000
# Process manager: supervisord
# =============================================================

# ── Stage 1: Build Frontend ───────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Pass build-time API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ── Stage 2: Install Backend deps ────────────────────────────
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

# ── Stage 3: Final Runtime Image ──────────────────────────────
FROM node:20-alpine AS runner

# Install supervisord (process manager)
RUN apk add --no-cache supervisor

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ── Copy Backend ──────────────────────────────────────────────
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/src          ./backend/src
COPY --from=backend-builder /app/backend/server.js    ./backend/server.js
COPY --from=backend-builder /app/backend/package.json ./backend/package.json

# ── Copy Frontend ─────────────────────────────────────────────
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static     ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public           ./frontend/public

# ── Supervisord config ────────────────────────────────────────
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create non-root user
RUN addgroup -g 1001 -S arwapark && \
    adduser  -S arwapark -u 1001 -G arwapark && \
    mkdir -p /app/backend/logs && \
    chown -R arwapark:arwapark /app /var/log/supervisor && \
    chmod 1777 /tmp

USER arwapark

# Backend :5000  |  Frontend :3000
EXPOSE 5000 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health && wget -qO- http://localhost:3000 || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
