# 🎵 MissaPronta

Gerador de documentos e repertórios de músicas para Missas.

## 🚀 Como Rodar o Projeto

Você pode rodar o projeto de diversas formas: utilizando o **Menu Interativo**, comandos **NPM**, ou comandos **Docker Compose** diretamente.

---

### 1. Menu Interativo (Recomendado)

Rode o script de menu interativo para escolher visualmente o que deseja iniciar:

```bash
npm run start:menu
# ou
./scripts/start.sh
```

---

### 2. Rodando via Scripts NPM

#### 📦 Subir Containers Juntos (Stack Completa)
```bash
# Subir MongoDB + Backend + Frontend em primeiro plano (exibe logs)
npm run docker:up

# Subir MongoDB + Backend + Frontend em segundo plano (background/detached)
npm run docker:up:d

# Parar todos os containers
npm run docker:down

# Acompanhar os logs
npm run docker:logs
```

#### 💻 Desenvolvimento Misto (MongoDB em Docker + Backend & Frontend Local)
```bash
npm run docker:mongo
npm run dev
```

---

### 📚 Documentação Swagger & Testes

- **Swagger / OpenAPI 3.0**: Disponível em [http://localhost:3333/api-docs](http://localhost:3333/api-docs)
- **Testes Unitários (Jest Backend)**: `npm run test --workspace=apps/backend`
- **Testes de Mutação (Stryker Backend)**: `npm run test:stryker --workspace=apps/backend`

---

### 3. Serviços e Portas

| Serviço | Tecnologia | Porta Host | URL / Connection String |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | `5173` | `http://localhost:5173` |
| **Backend** | Express + TS + Zod | `3333` | `http://localhost:3333` |
| **Swagger UI** | OpenAPI 3.0 | `3333` | `http://localhost:3333/api-docs` |
| **Database** | MongoDB 7.0 | `27017` | `mongodb://localhost:27017/musicas-missa` |

---

### 📄 Variáveis de Ambiente

Consulte e copie o arquivo `.env.example` para configurar suas variáveis:

- `MONGO_URI`: URI de conexão com o banco de dados.
- `PORT`: Porta do servidor Express (`3333`).
- `VITE_API_URL`: URL da API backend consumida pelo frontend.
- `JWT_SECRET`: Chave para validação de tokens JWT.
- `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD`: Credenciais do admin bootstrap inicial.
