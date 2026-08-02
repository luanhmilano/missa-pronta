# 🎵 MissaPronta - Backend API

Servidor Express.js com TypeScript, MongoDB / Mongoose, Autenticação JWT, Zod, Jest, Stryker Mutator e Documentação Swagger/OpenAPI.

---

## 🚀 Como Rodar o Backend

### 1. Instalar Dependências
No diretório raiz do monorepo:
```bash
npm install
```

### 2. Rodar em Modo de Desenvolvimento
```bash
npm run dev --workspace=apps/backend
```

O servidor iniciará em `http://localhost:3333`.

---

## 📚 Documentação da API (Swagger / OpenAPI)

A documentação interativa Swagger UI é gerada automaticamente via `swagger-jsdoc` e fica acessível em:

👉 **[http://localhost:3333/api-docs](http://localhost:3333/api-docs)**

Ela inclui:
- Especificação completa das rotas `/auth`, `/songs` e `/missas`.
- Suporte ao botão **Authorize (Bearer JWT)** para testar chamadas protegidas de administrador.
- Esquemas de request body e respostas JSON formatadas.

---

## 🛡️ Autenticação & Permissões (RBAC)

- **Visitantes (Anônimos)**: Podem consultar acervos (`GET /songs`, `GET /missas`), visualizar HTML (`GET /missas/:id/html`) e baixar PDFs (`GET /missas/:id/pdf`).
- **Administradores**: Requer cabeçalho `Authorization: Bearer <token>` para criar, editar ou excluir registros (`POST`, `PUT`, `DELETE`).

### Bootstrap Automático de Admin Inicial
Se o banco de dados estiver sem usuários com papel `admin`, o servidor criará automaticamente no startup um usuário admin baseado nas seguintes variáveis de ambiente:

- `INITIAL_ADMIN_EMAIL`: `admin@musicasmissa.com` (padrão)
- `INITIAL_ADMIN_PASSWORD`: `Admin@123456` (padrão)

---

## 🧪 Testes Automatizados & Testes de Mutação

### Rodar Testes Unitários com Jest
```bash
npm run test --workspace=apps/backend
```

### Gerar Relatório de Cobertura de Código
```bash
npm run test:coverage --workspace=apps/backend
```

### Executar Testes de Mutação com Stryker Mutator
O Stryker insere mutações no código-fonte (ex: altera `>` para `<`, `&&` para `||`) para validar a eficácia da suíte de testes.
```bash
npm run test:stryker --workspace=apps/backend
```

---

## 📄 Variáveis de Ambiente (.env)

- `PORT`: Porta do servidor HTTP (`3333`).
- `MONGO_URI`: URI de conexão do MongoDB (ex: `mongodb://localhost:27017/musicas-missa` ou MongoDB Atlas).
- `JWT_SECRET`: Chave secreta para assinatura dos tokens JWT.
- `INITIAL_ADMIN_EMAIL`: Email do administrador inicial.
- `INITIAL_ADMIN_PASSWORD`: Senha do administrador inicial.
- `LOG_LEVEL`: Nível de log do Pino (`info`, `debug`, `error`).
