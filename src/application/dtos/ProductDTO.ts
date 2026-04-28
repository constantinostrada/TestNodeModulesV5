import { ProductCategory } from '@domain/entities/Product';

/**
 * ProductDTO — plain data object crossing the application boundary.
 *
 * Controllers and external consumers receive this shape, never raw domain entities.
 */
export interface ProductDTO {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: ProductCategory;
  stockStatus: 'ok' | 'critical' | 'out_of_stock';
}

// ── Input DTOs ────────────────────────────────────────────────────────────────

export interface ListInventoryInputDTO {
  category?: ProductCategory;
}
