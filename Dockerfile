FROM node:14.21.2-alpine3.16

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

CMD ["node", "index.js"]
