FROM node:18

RUN npm install -g pm2

COPY src /app

WORKDIR /app

RUN npm install

# ENTRYPOINT ["pm2", "--no-daemon", "start", "app.js"]
ENTRYPOINT ["node", "--require", "./tracer.js", "app.js"]