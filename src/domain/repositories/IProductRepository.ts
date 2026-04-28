import { Product, ProductCategory } from '@domain/entities/Product';

/**
 * IProductRepository — Repository interface (abstraction only, no implementation).
 *
 * Defines the contract that any persistence layer must fulfil.
 * Implementations live in src/infrastructure/.
 */
export interface IProductRepository {
  /** Return all products, optionally filtered by category. */
  findAll(options?: { category?: ProductCategory }): Promise<Product[]>;

  /** Find a single product by its identity. Returns null if not found. */
  findById(id: string): Promise<Product | null>;

  /** Find a single product by SKU. Returns null if not found. */
  findBySku(sku: string): Promise<Product | null>;

  /** Persist a new product or update an existing one. */
  save(product: Product): Promise<void>;
}
