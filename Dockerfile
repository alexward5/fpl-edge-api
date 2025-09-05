# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install a tiny tool for the HEALTHCHECK
RUN apk add --no-cache wget

# (no need to create the 'node' user; it's already present)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=build /app/dist ./dist

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health || exit 1

USER node
CMD ["node", "dist/index.js"]
