FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/

RUN npm ci --workspace=apps/backend

COPY apps/backend ./apps/backend

RUN npm run build --workspace=apps/backend

EXPOSE 3333

ENV PORT=3333
ENV NODE_ENV=production

CMD ["npm", "start", "--workspace=apps/backend"]
