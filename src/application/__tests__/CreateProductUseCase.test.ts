import { CreateProductUseCase } from '@application/use-cases/CreateProductUseCase';
import { InMemoryProductRepository } from '@infrastructure/repositories/InMemoryProductRepository';
import { DomainError } from '@domain/errors/DomainError';
import { ConflictError } from '@application/errors/ConflictError';

const STUB_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

class StubIdGenerator {
  generate(): string {
    return STUB_ID;
  }
}

const VALID_INPUT = {
  sku: 'WIDGET-001',
  name: 'Blue Widget',
  brand: 'Acme',
  price: 19.99,
  stock: 10,
  category: 'Widgets',
};

function makeUseCase() {
  const repo = new InMemoryProductRepository();
  const idGen = new StubIdGenerator();
  const useCase = new CreateProductUseCase(repo, idGen);
  return { useCase, repo };
}

// ── Happy path ──────────────────────────────────────────────────────────────

describe('CreateProductUseCase — success', () => {
  it('returns a ProductDTO with the correct fields', async () => {
    const { useCase } = makeUseCase();

    const dto = await useCase.execute(VALID_INPUT);

    expect(dto.id).toBe(STUB_ID);
    expect(dto.sku).toBe('WIDGET-001');
    expect(dto.name).toBe('Blue Widget');
    expect(dto.brand).toBe('Acme');
    expect(dto.price).toBe(19.99);
    expect(dto.stock).toBe(10);
    expect(dto.category).toBe('Widgets');
    expect(typeof dto.createdAt).toBe('string');
    expect(typeof dto.updatedAt).toBe('string');
  });

  it('persists the product in the repository', async () => {
    const { useCase, repo } = makeUseCase();

    await useCase.execute(VALID_INPUT);

    expect(repo.count()).toBe(1);
  });

  it('accepts stock = 0', async () => {
    const { useCase } = makeUseCase();

    const dto = await useCase.execute({ ...VALID_INPUT, stock: 0 });

    expect(dto.stock).toBe(0);
  });
});

// ── SKU uniqueness (409) ────────────────────────────────────────────────────

describe('CreateProductUseCase — duplicate SKU', () => {
  it('throws ConflictError when the same SKU is submitted twice', async () => {
    const { useCase } = makeUseCase();

    await useCase.execute(VALID_INPUT);

    await expect(useCase.execute({ ...VALID_INPUT, name: 'Another Widget' })).rejects.toThrow(
      ConflictError,
    );
  });

  it('ConflictError message mentions the duplicate SKU', async () => {
    const { useCase } = makeUseCase();

    await useCase.execute(VALID_INPUT);

    await expect(useCase.execute(VALID_INPUT)).rejects.toThrow('WIDGET-001');
  });
});

// ── SKU format validation (422 via DomainError) ─────────────────────────────

describe('CreateProductUseCase — invalid SKU format', () => {
  const badSkus = [
    ['lowercase letters', 'widget-001'],
    ['spaces', 'WIDGET 001'],
    ['special chars', 'WIDGET@001'],
    ['empty string', ''],
  ];

  it.each(badSkus)('throws DomainError for SKU with %s', async (_label, sku) => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, sku })).rejects.toThrow(DomainError);
  });
});

// ── Price validation (422 via DomainError) ──────────────────────────────────

describe('CreateProductUseCase — invalid price', () => {
  it('throws DomainError when price is 0', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, price: 0 })).rejects.toThrow(DomainError);
  });

  it('throws DomainError when price is negative', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, price: -5 })).rejects.toThrow(DomainError);
  });
});

// ── Stock validation (422 via DomainError) ──────────────────────────────────

describe('CreateProductUseCase — invalid stock', () => {
  it('throws DomainError when stock is negative', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, stock: -1 })).rejects.toThrow(DomainError);
  });

  it('throws DomainError when stock is a float', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, stock: 1.5 })).rejects.toThrow(DomainError);
  });
});

// ── Name / brand / category validation (422 via DomainError) ────────────────

describe('CreateProductUseCase — invalid name / brand / category', () => {
  it('throws DomainError for empty name', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, name: '' })).rejects.toThrow(DomainError);
  });

  it('throws DomainError for whitespace-only name', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, name: '   ' })).rejects.toThrow(DomainError);
  });

  it('throws DomainError for empty brand', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, brand: '' })).rejects.toThrow(DomainError);
  });

  it('throws DomainError for empty category', async () => {
    const { useCase } = makeUseCase();

    await expect(useCase.execute({ ...VALID_INPUT, category: '' })).rejects.toThrow(DomainError);
  });
});
