FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json server.js ./
COPY --chown=node:node src ./src
RUN mkdir -p /app/uploads && chown node:node /app/uploads
USER node
EXPOSE 5000
CMD ["node", "server.js"]
