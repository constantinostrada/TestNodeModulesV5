import { NextRequest } from 'next/server';
import { ProductController } from '@interfaces/http/controllers/ProductController';

const controller = new ProductController();

/**
 * POST /api/products
 *
 * Creates a new product. Accepts JSON body with:
 *   sku, name, brand, price, stock, category
 *
 * Responses:
 *   201 — product created successfully
 *   400 — missing/malformed fields
 *   409 — SKU already exists
 *   422 — domain rule violation (invalid format, price ≤ 0, stock < 0, …)
 *   500 — unexpected server error
 */
export async function POST(request: NextRequest) {
  return controller.createProduct(request);
}
