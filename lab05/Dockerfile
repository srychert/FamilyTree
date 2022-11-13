FROM node:alpine

WORKDIR /opt/app

COPY ./package.json ./

RUN yarn install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

CMD ["npm", "run", "start"]