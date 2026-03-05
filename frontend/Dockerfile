# ─── Stage 1 : build React/Vite ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# L'URL de l'API est passée au moment du build via --build-arg
# En Docker Compose, on utilise /api (nginx proxy), sinon l'URL complète
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2 : serveur Nginx ──────────────────────────────────────────────────
FROM nginx:1.25-alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
