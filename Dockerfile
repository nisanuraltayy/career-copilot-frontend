# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# API adresi build zamanında bundle'a gömülür. Compose'ta nginx /api'yi
# backend'e proxy'ler; bu yüzden aynı-origin göreli "/api" kullanılır (CORS yok).
ARG VITE_API_URL=/api
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production && npm run build

# ---- Stage 2: nginx ile statik servis + /api proxy ----
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
