# ─── Stage 1 : dépendances ────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Installer les dépendances systèmes nécessaires à Prisma (OpenSSL)
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --omit=dev

# ─── Stage 2 : génération du client Prisma ────────────────────────────────────
FROM node:20-alpine AS prisma-gen

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

# ─── Stage 3 : image de production ───────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

# Copier les dépendances de production depuis le stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copier le client Prisma généré (binaires Alpine)
COPY --from=prisma-gen /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma-gen /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copier le code source
COPY . .

# Supprimer les fichiers inutiles en production
RUN rm -f .env .env.*

EXPOSE 5000

# Lancer les migrations puis démarrer le serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
