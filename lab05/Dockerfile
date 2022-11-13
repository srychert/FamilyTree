FROM node

WORKDIR /opt/app

COPY ./package.json ./

RUN apt-get update || : && apt-get install python -y

RUN yarn install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

CMD ["npm", "run", "start"]