# Build stage
FROM node:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm install sharp
COPY . .
RUN npm run build

# Production stage
FROM ghcr.io/static-web-server/static-web-server:2-alpine
COPY --from=build /app/dist /public
ENV SERVER_PORT=80
ENV SERVER_LOG_LEVEL=info
EXPOSE 80
