FROM node:22-slim

ENV NODE_ENV=production

WORKDIR /usr/app

COPY . /usr/app

# NODE_ENV=production would skip devDependencies, which the TypeScript build needs;
# install them for the build, then prune.
RUN npm install --include=dev && \
  npm run build && \
  npm prune --omit=dev

CMD ["node", "--enable-source-maps", "dist/index.js"]
