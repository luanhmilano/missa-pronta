import type { Request, Response } from 'express';
import MissaService from '../services/missa.service.js';
import type { PopulatedMissa } from '../utils/missa.util.js';
import { renderMassHtml } from '../utils/html.util.js';
import { renderMassPdfBuffer, getPdfFileName } from '../utils/pdf.util.js';

class MassController {
  private getId(req: Request, res: Response): string | undefined {
    const { id } = req.params;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Identificador da missa inválido' });
      return undefined;
    }

    return id;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const missaPopulada = await MissaService.create(req.body);
      res.status(201).json(missaPopulada);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao criar missa', details: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const missas = await MissaService.findAll();
      res.status(200).json(missas);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar missas', details: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getId(req, res);
      if (!id) return;
      const mass = await MissaService.findById(id);
      
      if (!mass) {
        res.status(404).json({ error: 'Missa não encontrada' });
        return;
      }

      res.status(200).json(mass);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar missa', details: error.message });
    }
  }

  async getHtml(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getId(req, res);
      if (!id) return;

      const mass = await MissaService.findById(id);

      if (!mass) {
        res.status(404).json({ error: 'Missa não encontrada' });
        return;
      }

      const html = renderMassHtml(mass.toObject() as unknown as PopulatedMissa);
      res.status(200).type('html').send(html);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao gerar HTML da missa', details: error.message });
    }
  }

  async getPdf(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getId(req, res);
      if (!id) return;

      console.debug('[backend][missas] getPdf', { id });

      const mass = await MissaService.findById(id);

      if (!mass) {
        res.status(404).json({ error: 'Missa não encontrada' });
        return;
      }

      const populatedMass = mass.toObject() as unknown as PopulatedMissa;
      const pdfBuffer = await renderMassPdfBuffer(populatedMass);
      const fileName = getPdfFileName(populatedMass);

      res
        .status(200)
        .setHeader('Content-Type', 'application/pdf')
        .setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        .send(pdfBuffer);
    } catch (error: any) {
      console.error('[backend][missas] getPdf error', error);
      res.status(500).json({ error: 'Erro ao gerar PDF da missa', details: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getId(req, res);
      if (!id) return;

      const updatedMass = await MissaService.update(id, req.body);

      if (!updatedMass) {
        res.status(404).json({ error: 'Missa não encontrada' });
        return;
      }

      res.status(200).json(updatedMass);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao atualizar missa', details: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getId(req, res);
      if (!id) return;

      const deletedMass = await MissaService.delete(id);

      if (!deletedMass) {
        res.status(404).json({ error: 'Missa não encontrada' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      console.error('[backend][missas] delete error', error);
      res.status(500).json({ error: 'Erro ao excluir missa', details: error.message });
    }
  }
}

export default new MassController();
