FROM node:18-alpine

RUN apk add dumb-init

RUN mkdir -p /home/node/app/node_modules
RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node package*.json .
RUN npm ci

COPY --chown=node:node nest-cli.json .
COPY --chown=node:node tsconfig*.json .
COPY --chown=node:node src/ .
COPY --chown=node:node views/ .

RUN npm run build

RUN npm prune --omit=dev

ENV PORT=3000
ENV NODE_ENV=production
ENV NO_COLOR=1

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start:prod"]
