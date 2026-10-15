import Missa from '../models/missa.model.js';
import { REPERTOIRE_FIELDS } from '../utils/missa.util.js';
import type { CreateMissaInput, UpdateMissaInput } from '../validators/missa.validator.js';

class MissaService {
  async create(payload: CreateMissaInput) {
    const missa = new Missa({
      nome: payload.nome,
      data: payload.data,
      ...(payload.repertorio ? { repertorio: payload.repertorio } : {})
    });
    await missa.save();
    return missa.populate(REPERTOIRE_FIELDS);
  }

  async findAll() {
    return Missa.find()
      .sort({ data: -1 })
      .populate(REPERTOIRE_FIELDS);
  }

  async findById(id: string) {
    return Missa.findById(id).populate(REPERTOIRE_FIELDS);
  }

  async update(id: string, payload: UpdateMissaInput) {
    return Missa.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    }).populate(REPERTOIRE_FIELDS);
  }

  async delete(id: string) {
    return Missa.findByIdAndDelete(id);
  }
}

export default new MissaService();
