FROM node:18-alpine AS builder

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /home/node/app

ADD . /home/node/app

# https://github.com/vercel/next.js/discussions/22149#discussioncomment-366180
RUN yarn install && yarn build && npm prune --omit=dev

FROM node:18-alpine

ENV NODE_ENV="production" \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /home/node/app

# https://javascript.plainenglish.io/reduce-docker-image-size-for-your-next-js-app-bcb65d322222
# and
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /home/node/app/package.json       /home/node/app/
COPY --from=builder /home/node/app/yarn.lock          /home/node/app/
COPY --from=builder /home/node/app/next.config.js     /home/node/app/
COPY --from=builder /home/node/app/public             /home/node/app/public
COPY --from=builder /home/node/app/.next/standalone   /home/node/app/
COPY --from=builder /home/node/app/.next/static       /home/node/app/.next/static

CMD ["node", "server.js"]