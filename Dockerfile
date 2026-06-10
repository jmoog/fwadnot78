# syntax=docker/dockerfile:1.7
# ────────────────────────────────────────────────────────────────────────
# Astro 6 + adapter Node (standalone) — Dockerfile multi-stage
# Réutilisable tel quel pour tout site Astro qui utilise @astrojs/node
# ────────────────────────────────────────────────────────────────────────

# ── Stage 1 : build ─────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Installer toutes les dépendances (y compris devDependencies si elles existent)
# Cache layer optimisé : on copie d'abord package*.json pour profiter du cache Docker
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copier le reste du code et builder
COPY . .
RUN npm run build

# ── Stage 2 : runtime ───────────────────────────────────────────────────
# Image minimale, uniquement les artefacts compilés et les deps de production
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Réinstaller uniquement les dépendances de production (image plus légère)
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev && \
    npm cache clean --force

# Récupérer les artefacts du stage build
COPY --from=builder /app/dist ./dist

# Utilisateur non-root pour la sécurité
RUN addgroup -S astro && adduser -S astro -G astro && \
    chown -R astro:astro /app
USER astro

EXPOSE 4321

# Démarrer le serveur Astro Node (mode standalone)
CMD ["node", "./dist/server/entry.mjs"]
