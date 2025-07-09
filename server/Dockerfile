# --------- Build stage ---------
FROM node:22.13.0-alpine AS builder

RUN apk add --no-cache python3 make g++ bind-tools
    
WORKDIR /app
    
COPY package.json yarn.lock ./
    
RUN corepack enable && \
        yarn config set network-timeout 300000 && \
        yarn config set registry https://registry.npmjs.org/ && \
        yarn install --frozen-lockfile --network-concurrency 1 && \
        yarn global add dotenv-cli
    
COPY . .
    
RUN yarn build
    
FROM node:22.13.0-alpine AS development
    
WORKDIR /app
RUN apk add --no-cache bind-tools && corepack enable
    
COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmjs.org/ && \
        yarn install --frozen-lockfile && \
        yarn global add dotenv-cli 
    
COPY . .
COPY --from=builder /app/dist ./dist
    
EXPOSE 5000
ENV NODE_ENV=development
    
RUN mkdir -p seeders
    
CMD ["yarn", "start:dev"]
    
    # --------- Staging stage ---------
FROM node:22.13.0-alpine AS staging
    
WORKDIR /app
RUN apk add --no-cache bind-tools && corepack enable
    
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
    
EXPOSE 5000
ENV NODE_ENV=staging
    
CMD ["yarn", "start:staging"]
    
    # --------- Production stage ---------
FROM node:22.13.0-alpine AS production
    
WORKDIR /app
RUN apk add --no-cache bind-tools wget
    
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
    
EXPOSE 5000
ENV NODE_ENV=production
    
    # Add healthcheck to ensure container is alive
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1
    
CMD ["yarn", "start:prod"]
    