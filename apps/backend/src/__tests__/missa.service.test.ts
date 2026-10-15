import { jest } from '@jest/globals';

const populate = jest.fn<(fields: string) => Promise<unknown>>();
const save = jest.fn<() => Promise<unknown>>();
const find = jest.fn<() => { sort: (sort: Record<string, number>) => { populate: jest.Mock } }>();
const findById = jest.fn<(id: string) => { populate: jest.Mock }>();
const findByIdAndUpdate = jest.fn<(id: string, payload: unknown, options: unknown) => { populate: jest.Mock }>();
const findByIdAndDelete = jest.fn<(id: string) => Promise<unknown>>();

class MockMissa {
  static find = find;
  static findById = findById;
  static findByIdAndUpdate = findByIdAndUpdate;
  static findByIdAndDelete = findByIdAndDelete;

  populate = populate;
  save = save;

  constructor(public readonly payload: unknown) {}
}

jest.unstable_mockModule('../models/missa.model.js', () => ({
  default: MockMissa
}));

const { default: MissaService } = await import('../services/missa.service.js');

describe('MissaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cria a missa e popula o repertório', async () => {
    const createdMissa = { id: 'missa-1' };
    populate.mockResolvedValue(createdMissa);
    save.mockResolvedValue(createdMissa);

    const result = await MissaService.create({
      nome: 'Missa de teste',
      data: '2026-08-01',
      repertorio: { entrada: 'song-1' }
    });

    expect(save).toHaveBeenCalledTimes(1);
    expect(populate).toHaveBeenCalledWith(expect.stringContaining('repertorio.entrada'));
    expect(result).toBe(createdMissa);
  });

  it('centraliza a consulta de todas as missas com ordenação e população', async () => {
    const populatedMissas = [{ id: 'missa-1' }];
    const queryPopulate = jest.fn<() => Promise<unknown>>().mockResolvedValue(populatedMissas);
    const sort = jest.fn<(sort: Record<string, number>) => { populate: typeof queryPopulate }>()
      .mockReturnValue({ populate: queryPopulate });
    find.mockReturnValue({ sort });

    const result = await MissaService.findAll();

    expect(find).toHaveBeenCalledWith();
    expect(sort).toHaveBeenCalledWith({ data: -1 });
    expect(result).toBe(populatedMissas);
  });

  it('consulta, atualiza e remove uma missa pelo identificador', async () => {
    const populatedMissa = { id: 'missa-1' };
    const findByIdPopulate = jest.fn<() => Promise<unknown>>().mockResolvedValue(populatedMissa);
    const updatePopulate = jest.fn<() => Promise<unknown>>().mockResolvedValue(populatedMissa);
    findById.mockReturnValue({ populate: findByIdPopulate });
    findByIdAndUpdate.mockReturnValue({ populate: updatePopulate });
    findByIdAndDelete.mockResolvedValue(populatedMissa);

    expect(await MissaService.findById('missa-1')).toBe(populatedMissa);
    expect(await MissaService.update('missa-1', { nome: 'Missa atualizada' })).toBe(populatedMissa);
    expect(await MissaService.delete('missa-1')).toBe(populatedMissa);

    expect(findById).toHaveBeenCalledWith('missa-1');
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      'missa-1',
      { nome: 'Missa atualizada' },
      { new: true, runValidators: true }
    );
    expect(findByIdAndDelete).toHaveBeenCalledWith('missa-1');
  });
});
