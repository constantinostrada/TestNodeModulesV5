import { Product } from '@domain/entities/Product';

/**
 * IProductRepository — repository contract for the Product aggregate.
 *
 * Implementations live in src/infrastructure/.
 * The domain and application layers depend only on this interface.
 */
export interface IProductRepository {
  /** Persist a new product. */
  save(product: Product): Promise<void>;

  /** Find a product by its SKU string. Returns null if not found. */
  findBySku(sku: string): Promise<Product | null>;

  /** Return all persisted products. */
  findAll(): Promise<Product[]>;
}
