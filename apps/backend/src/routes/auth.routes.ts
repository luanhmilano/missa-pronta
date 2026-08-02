import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Retorna o token JWT.
 *       400:
 *         description: Dados de entrada inválidos.
 *       401:
 *         description: Credenciais inválidas.
 *       403:
 *         description: Perfil pendente ou recusado.
 */
router.post('/login', validateBody(loginSchema), (req, res, next) => {
  authController.login(req, res).catch(next);
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Solicitar cadastro de novo administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Cadastro solicitado com sucesso. Aguardando aprovação.
 *       400:
 *         description: E-mail já cadastrado ou dados inválidos.
 */
router.post('/register', validateBody(registerSchema), (req, res, next) => {
  authController.register(req, res).catch(next);
});

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Obter dados do usuário logado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil do usuário autenticado.
 *       401:
 *         description: Não autenticado.
 */
router.get('/me', authenticateToken, (req, res, next) => {
  authController.me(req, res).catch(next);
});

/**
 * @openapi
 * /auth/pending-users:
 *   get:
 *     summary: Listar novos usuários com cadastro pendente de aprovação
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários pendentes.
 *       403:
 *         description: Restrito a administradores.
 */
router.get('/pending-users', authenticateToken, requireAdmin, (req, res, next) => {
  authController.getPendingUsers(req, res).catch(next);
});

/**
 * @openapi
 * /auth/users/{id}/approve:
 *   patch:
 *     summary: Aprovar o cadastro de um usuário pendente
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário aprovado com sucesso.
 */
router.patch('/users/:id/approve', authenticateToken, requireAdmin, (req, res, next) => {
  authController.approveUser(req, res).catch(next);
});

/**
 * @openapi
 * /auth/users/{id}/reject:
 *   patch:
 *     summary: Recusar o cadastro de um usuário pendente
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário recusado com sucesso.
 */
router.patch('/users/:id/reject', authenticateToken, requireAdmin, (req, res, next) => {
  authController.rejectUser(req, res).catch(next);
});

export default router;

