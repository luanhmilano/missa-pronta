import { Router } from 'express';
import MissaController from '../controllers/missa.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createMissaSchema, updateMissaSchema } from '../validators/missa.validator.js';

const router = Router();

/**
 * @openapi
 * /missas:
 *   get:
 *     summary: Listar todas as missas salvas
 *     tags: [Missas]
 *     responses:
 *       200:
 *         description: Lista de missas e repertórios populados.
 */
router.get('/', (req, res, next) => {
  MissaController.getAll(req, res).catch(next);
});

/**
 * @openapi
 * /missas/{id}:
 *   get:
 *     summary: Buscar missa por ID
 *     tags: [Missas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Missa encontrada.
 */
router.get('/:id', (req, res, next) => {
  MissaController.getById(req, res).catch(next);
});

/**
 * @openapi
 * /missas/{id}/html:
 *   get:
 *     summary: Obter visualização em HTML da missa
 *     tags: [Missas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documento HTML renderizado com a ordem da missa.
 */
router.get('/:id/html', (req, res, next) => {
  MissaController.getHtml(req, res).catch(next);
});

/**
 * @openapi
 * /missas/{id}/pdf:
 *   get:
 *     summary: Baixar arquivo PDF formatado da missa
 *     tags: [Missas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Buffer de arquivo PDF para download.
 */
router.get('/:id/pdf', (req, res, next) => {
  MissaController.getPdf(req, res).catch(next);
});

/**
 * @openapi
 * /missas:
 *   post:
 *     summary: Cadastrar nova missa (Apenas Admin)
 *     tags: [Missas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Missa'
 *     responses:
 *       201:
 *         description: Missa criada com sucesso.
 */
router.post('/', authenticateToken, requireAdmin, validateBody(createMissaSchema), (req, res, next) => {
  MissaController.create(req, res).catch(next);
});

/**
 * @openapi
 * /missas/{id}:
 *   put:
 *     summary: Atualizar missa existente (Apenas Admin)
 *     tags: [Missas]
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
 *         description: Missa atualizada com sucesso.
 */
router.put('/:id', authenticateToken, requireAdmin, validateBody(updateMissaSchema), (req, res, next) => {
  MissaController.update(req, res).catch(next);
});

/**
 * @openapi
 * /missas/{id}:
 *   delete:
 *     summary: Excluir missa (Apenas Admin)
 *     tags: [Missas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Missa excluída com sucesso.
 */
router.delete('/:id', authenticateToken, requireAdmin, (req, res, next) => {
  MissaController.delete(req, res).catch(next);
});

export default router;