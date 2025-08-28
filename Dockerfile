# Use Node.js LTS version
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies first (caching)
COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public

# Build the app
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_N8N_WEBHOOK_URL=http://host.docker.internal:5678
ENV NEXT_PUBLIC_TEST_MODE=true

# Copy built assets from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
