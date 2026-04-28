import { Product } from '@domain/entities/Product';
import { ProductId } from '@domain/value-objects/ProductId';

export interface ProductFilterOptions {
  name?: string;
  sku?: string;
  category?: string;
}

/**
 * IProductRepository — Repository interface (abstraction only, no implementation).
 *
 * Defines the contract that any persistence layer must fulfil.
 * Implementations live in src/infrastructure/.
 */
export interface IProductRepository {
  /** Find a single product by its identity. Returns null if not found. */
  findById(id: ProductId): Promise<Product | null>;

  /** Return all products, optionally filtered by name, sku, and/or category. */
  findAll(filters?: ProductFilterOptions): Promise<Product[]>;

  /** Check whether a product with the given id already exists. */
  exists(id: ProductId): Promise<boolean>;
}
