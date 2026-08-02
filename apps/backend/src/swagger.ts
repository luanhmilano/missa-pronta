import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Músicas Missa API',
      version: '1.0.0',
      description: 'API RESTful para gestão de acervos musicais católicos, montagem de repertórios e exportação de missas em PDF/HTML.',
      contact: {
        name: 'Suporte Músicas Missa',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT retornado pelo endpoint /auth/login para autorização de administrador.',
        },
      },
      schemas: {
        Song: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '679c67b9389efb367104b2b1' },
            titulo: { type: 'string', example: 'Noite Feliz' },
            tom: { type: 'string', example: 'C' },
            momentoLiturgico: {
              type: 'string',
              enum: ['ENTRADA', 'ATO_PENITENCIAL', 'SALMO', 'ACLAMACAO', 'OFERTORIO', 'SANTO', 'CORDEIRO', 'COMUNHAO', 'FINAL'],
              example: 'ENTRADA',
            },
            letra: {
              type: 'array',
              items: {
                type: 'array',
                items: { type: 'string' },
              },
              example: [['Noite feliz, noite feliz!', 'O Senhor, Deus de amor']],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Missa: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '679c67b9389efb367104b2c5' },
            nome: { type: 'string', example: 'Missa de Natal' },
            data: { type: 'string', format: 'date-time', example: '2026-12-25T00:00:00.000Z' },
            repertorio: {
              type: 'object',
              properties: {
                entrada: { type: 'string' },
                atoPenitencial: { type: 'string' },
                salmo: { type: 'string' },
                aclamacao: { type: 'string' },
                ofertorio: { type: 'string' },
                santo: { type: 'string' },
                cordeiro: { type: 'string' },
                comunhao: { type: 'string' },
                final: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@musicasmissa.com' },
            password: { type: 'string', example: 'Admin@123456' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('[backend][swagger] Documentação OpenAPI/Swagger disponível em /api-docs');
}
