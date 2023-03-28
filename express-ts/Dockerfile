FROM node:10

RUN npm install -g pm2

COPY src /app

WORKDIR /app

RUN npm install

# ENTRYPOINT ["pm2", "--no-daemon", "start", "app.js"]
ENTRYPOINT ["node", "app.js"]