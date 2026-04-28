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
  category: string;
  criticalStock: boolean;
}

// ── Input DTOs ─────────────────────────────────────────────────────────────

export interface ListInventoryInputDTO {
  name?: string;
  sku?: string;
  category?: string;
}

// ── Output DTOs ────────────────────────────────────────────────────────────

export interface ListInventoryOutputDTO {
  items: ProductDTO[];
  total: number;
  criticalStockCount: number;
}
