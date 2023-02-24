FROM node:18-alpine AS builder

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /home/node/app

ADD . /home/node/app

# https://github.com/vercel/next.js/discussions/22149#discussioncomment-366180
RUN yarn install && npm prune --omit=dev

ENTRYPOINT ["sh", "-c", "npm run build && npm run start"]
CMD []