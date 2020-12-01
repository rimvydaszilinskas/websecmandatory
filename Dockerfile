FROM node:13.12.0-alpine

RUN mkdir /app

# ENV NODE_ENV=production
WORKDIR /app

COPY ./package.json /app/package.json
RUN npm i

COPY . .

CMD sleep 10 && node index.js