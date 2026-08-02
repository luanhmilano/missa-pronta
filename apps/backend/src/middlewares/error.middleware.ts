import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.util.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({
    message: err.message || 'Erro interno no servidor',
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Dados de entrada inválidos',
      issues: err.errors.map(e => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      error: 'Identificador (ID) inválido ou malformado.',
    });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token inválido ou expirado.',
    });
    return;
  }

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Erro interno no servidor',
    ...(process.env.NODE_ENV !== 'production' && { details: err.details || err.stack }),
  });
}
