FROM node:18-bullseye

WORKDIR /home/node/app

ADD . /home/node/app

RUN yarn install && yarn build

CMD ["yarn", "start"]