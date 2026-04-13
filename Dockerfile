# Build stage
FROM oven/bun:1.2 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# CACHEBUST forces Docker to skip cached layers below this line.
# Use: docker build --build-arg CACHEBUST=$(date +%s) ...
ARG CACHEBUST=0
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]