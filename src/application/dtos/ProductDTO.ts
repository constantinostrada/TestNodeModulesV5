/**
 * ProductDTO — plain data object that crosses the application boundary.
 *
 * Controllers and external consumers receive this shape; never raw domain entities.
 */
export interface ProductDTO {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

// ── Input DTOs ─────────────────────────────────────────────────────────────

export interface CreateProductInputDTO {
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
}
