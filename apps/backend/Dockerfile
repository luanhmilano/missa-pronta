FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependências do backend
COPY package.json package-lock.json* ./

# Instala todas as dependências (incluindo typescript para o build)
RUN npm install

# Copia o código fonte do backend
COPY . .

# Compila o TypeScript para JavaScript (dist/)
RUN npm run build

EXPOSE 3333

ENV PORT=3333
ENV NODE_ENV=production

CMD ["npm", "start"]

