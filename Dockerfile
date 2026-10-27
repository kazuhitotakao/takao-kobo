FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends git bash less ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

EXPOSE 3000