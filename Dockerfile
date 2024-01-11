FROM node:18-alpine as web

ENV NODE_ENV="production" \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /home/node/app
RUN yarn add --dev eslint

COPY package.json yarn.lock /home/node/app/
RUN  yarn

COPY . /home/node/app
RUN yarn build
CMD ["yarn", "start"]
