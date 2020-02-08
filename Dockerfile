FROM keymetrics/pm2:10-slim

WORKDIR /usr/src/app

COPY . .
COPY config /usr/src/app/config

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_CONFIG_DIR /usr/src/app/config

RUN npm install --production
