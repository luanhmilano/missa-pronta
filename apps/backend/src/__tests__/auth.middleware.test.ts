import { jest } from '@jest/globals';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

describe('auth.middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn() as any;
  });

  describe('authenticateToken', () => {
    it('deve retornar 401 se nenhum token for fornecido', () => {
      authenticateToken(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso não autorizado. Token não fornecido.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 403 se o token for inválido', () => {
      req.headers = { authorization: 'Bearer token_invalido' };

      authenticateToken(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve decodificar o token válido e chamar next()', () => {
      const secret = 'musicas-missa-dev-jwt-secret';
      const payload = { userId: '123', email: 'admin@test.com', role: 'admin', nome: 'Admin' };
      const token = jwt.sign(payload, secret);

      req.headers = { authorization: `Bearer ${token}` };

      authenticateToken(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe('123');
      expect(req.user?.role).toBe('admin');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('deve retornar 403 se o usuário não tiver papel admin', () => {
      req.user = { userId: '123', email: 'user@test.com', role: 'user' as any, nome: 'User' };

      requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ação restrita a usuários administradores.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se o usuário tiver papel admin', () => {
      req.user = { userId: '123', email: 'admin@test.com', role: 'admin', nome: 'Admin' };

      requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
