FROM node:16.14-alpine

WORKDIR /usr/node_app

COPY ./package.json ./

RUN npm install

COPY ./ ./

EXPOSE 27017

CMD ["npm", "start"]

