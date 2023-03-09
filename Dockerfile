FROM node:16
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]