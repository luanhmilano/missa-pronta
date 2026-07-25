FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de manifest do monorepo e do backend
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/

# Instala as dependências do backend
RUN npm ci --workspace=apps/backend

# Copia o código fonte do backend
COPY apps/backend ./apps/backend

# Compila o TypeScript
RUN npm run build --workspace=apps/backend

EXPOSE 3333

ENV PORT=3333
ENV NODE_ENV=production

CMD ["npm", "start", "--workspace=apps/backend"]
