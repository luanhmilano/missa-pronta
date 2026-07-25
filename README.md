# 🎵 Músicas Missa

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

#### 🧩 Subir Containers Individualmente
```bash
# Apenas o MongoDB (Docker)
npm run docker:mongo

# Apenas o Backend (+ MongoDB como dependência)
npm run docker:backend

# Apenas o Backend (sem subir dependências no Docker)
npm run docker:backend:only

# Apenas o Frontend
npm run docker:frontend

# Apenas o Frontend (sem subir dependências no Docker)
npm run docker:frontend:only
```

#### 💻 Desenvolvimento Misto (MongoDB em Docker + Backend & Frontend Local)
Ideal para desenvolvimento rápido com hot-reload local aproveitando o MongoDB em container:

```bash
# Sobe o MongoDB no Docker e inicia o turborepo localmente
npm run start:menu  # Escolha a opção 5
# ou manualmente:
npm run docker:mongo
npm run dev
```

---

### 3. Serviços e Portas

| Serviço | Tecnologia | Porta Host | URL / Connection String |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite | `5173` | `http://localhost:5173` |
| **Backend** | Express + TS (`pdfmake`) | `3333` | `http://localhost:3333` |
| **Database** | MongoDB 7.0 | `27017` | `mongodb://localhost:27017/musicas-missa` |

---

### 📄 Variáveis de Ambiente

Consulte e copie o arquivo `.env.example` para configurar suas variáveis se necessário:

- `MONGO_URI`: URI de conexão com o banco de dados.
- `PORT`: Porta do servidor Express (`3333`).
- `VITE_API_URL`: URL da API backend consumida pelo frontend (`http://localhost:3333`).
