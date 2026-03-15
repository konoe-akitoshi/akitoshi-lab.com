# Build stage
FROM node:22 AS build
WORKDIR /app
COPY package.json ./
RUN npm install && ls node_modules/sharp/lib/ && ls node_modules/@img/ 2>/dev/null || true && node -e "try{require('sharp')}catch(e){console.error(e.message)}"
COPY . .
RUN npm run build

# Production stage
FROM ghcr.io/static-web-server/static-web-server:2-alpine
COPY --from=build /app/dist /public
ENV SERVER_PORT=80
ENV SERVER_LOG_LEVEL=info
EXPOSE 80
