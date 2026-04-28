import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';

/**
 * InMemoryProductRepository — infrastructure implementation of IProductRepository.
 *
 * Uses a plain Map keyed by SKU string as the backing store.
 * Suitable for development, testing, and as a reference implementation.
 * In production, replace with a database-backed implementation.
 */
export class InMemoryProductRepository implements IProductRepository {
  private readonly store = new Map<string, Product>();

  async save(product: Product): Promise<void> {
    this.store.set(product.sku.value, product);
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.store.get(sku) ?? null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.store.values());
  }

  /** Utility for tests — clears all records. */
  clear(): void {
    this.store.clear();
  }

  /** Utility for tests — returns the current record count. */
  count(): number {
    return this.store.size;
  }
}
