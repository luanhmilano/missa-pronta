import { Router } from 'express';
import SongController from '../controllers/song.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createSongSchema, updateSongSchema } from '../validators/song.validator.js';

const router = Router();

/**
 * @openapi
 * /songs:
 *   get:
 *     summary: Listar todas as músicas
 *     tags: [Músicas]
 *     responses:
 *       200:
 *         description: Lista de músicas cadastradas.
 */
router.get('/', (req, res, next) => {
  SongController.getAll(req, res).catch(next);
});

/**
 * @openapi
 * /songs/{id}:
 *   get:
 *     summary: Buscar música por ID
 *     tags: [Músicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Música encontrada.
 *       404:
 *         description: Música não encontrada.
 */
router.get('/:id', (req, res, next) => {
  SongController.getById(req, res).catch(next);
});

/**
 * @openapi
 * /songs:
 *   post:
 *     summary: Cadastrar nova música (Apenas Admin)
 *     tags: [Músicas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       201:
 *         description: Música criada com sucesso.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso restrito a administradores.
 */
router.post('/', authenticateToken, requireAdmin, validateBody(createSongSchema), (req, res, next) => {
  SongController.create(req, res).catch(next);
});

/**
 * @openapi
 * /songs/{id}:
 *   put:
 *     summary: Atualizar música existente (Apenas Admin)
 *     tags: [Músicas]
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
 *         description: Música atualizada com sucesso.
 */
router.put('/:id', authenticateToken, requireAdmin, validateBody(updateSongSchema), (req, res, next) => {
  SongController.update(req, res).catch(next);
});

/**
 * @openapi
 * /songs/{id}:
 *   delete:
 *     summary: Excluir música (Apenas Admin)
 *     tags: [Músicas]
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
 *         description: Música excluída com sucesso.
 */
router.delete('/:id', authenticateToken, requireAdmin, (req, res, next) => {
  SongController.delete(req, res).catch(next);
});

export default router;