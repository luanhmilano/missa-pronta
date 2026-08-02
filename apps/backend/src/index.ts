import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectToDatabase } from './database.js';
import songRoutes from './routes/song.routes.js';
import missaRoutes from './routes/missa.routes.js';
import authRoutes from './routes/auth.routes.js';
import authController from './controllers/auth.controller.js';
import { setupSwagger } from './swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { logger } from './utils/logger.util.js';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors()); 
app.use(express.json());

app.use((req, res, next) => {
  const startedAt = Date.now();

  logger.debug({
    type: 'request:incoming',
    method: req.method,
    path: req.originalUrl,
  });

  res.on('finish', () => {
    logger.info({
      type: 'request:completed',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

// Configuração do Swagger UI em /api-docs
setupSwagger(app);

app.use('/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/missas', missaRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'API Músicas Missa rodando com sucesso!',
    documentation: '/api-docs' 
  });
});

// Middleware Global de Erros (Deve ficar por último)
app.use(errorHandler);

async function startServer() {
  app.listen(PORT, () => {
    logger.info(`Backend Express/TS rodando na porta ${PORT}`);
  });

  try {
    await connectToDatabase();
    await authController.bootstrapInitialAdmin();
  } catch (error) {
    logger.error({ message: 'Falha ao conectar no MongoDB', error });
  }
}

startServer();