FROM node:20-alpine

WORKDIR /app

# Copia arquivos de configuração do monorepo e frontend
COPY package.json package-lock.json turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Instala dependências do frontend
RUN npm ci --workspace=apps/frontend

# Copia código fonte do frontend
COPY apps/frontend ./apps/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--workspace=apps/frontend", "--", "--host", "0.0.0.0"]
