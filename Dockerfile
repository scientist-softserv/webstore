FROM node:18-bullseye

ADD . /home/node/app

RUN yarn install && yarn build

CMD ["yarn", "start"]