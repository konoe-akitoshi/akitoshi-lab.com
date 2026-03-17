FROM ghcr.io/static-web-server/static-web-server:2-alpine
COPY dist/ /home/sws/public
ENV SERVER_PORT=80
ENV SERVER_LOG_LEVEL=info
EXPOSE 80
