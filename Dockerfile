FROM node:16.19.1-alpine3.16

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

CMD ["node", "index.js"]
