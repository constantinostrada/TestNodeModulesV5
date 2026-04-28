import { NextRequest } from 'next/server';
import { makeCreateProductUseCase } from '@infrastructure/container';
import { created, handleError } from '@interfaces/http/helpers/apiResponse';
import { ConflictError } from '@application/errors/ConflictError';
import { NextResponse } from 'next/server';

/**
 * ProductController — thin adapter between Next.js route handlers and product use cases.
 *
 * Rules:
 *  - Parse and coerce raw JSON input; reject obviously malformed requests early
 *  - Never contain business logic — delegate everything to use cases
 *  - Map ConflictError → 409 (not handled by the shared handleError helper)
 */
export class ProductController {
  /**
   * POST /api/products
   *
   * Expected body:
   * {
   *   sku:      string   — [A-Z0-9-]+ format
   *   name:     string   — non-empty
   *   brand:    string   — non-empty
   *   price:    number   — > 0
   *   stock:    number   — ≥ 0, integer
   *   category: string   — non-empty
   * }
   */
  async createProduct(request: NextRequest) {
    try {
      // ── 1. Parse body ───────────────────────────────────────────────────
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { success: false, error: 'Request body must be valid JSON.' },
          { status: 400 },
        );
      }

      // ── 2. Structural presence checks ──────────────────────────────────
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return NextResponse.json(
          { success: false, error: 'Request body must be a JSON object.' },
          { status: 400 },
        );
      }

      const raw = body as Record<string, unknown>;

      const missingFields: string[] = [];
      for (const field of ['sku', 'name', 'brand', 'price', 'stock', 'category']) {
        if (raw[field] === undefined || raw[field] === null) {
          missingFields.push(field);
        }
      }
      if (missingFields.length > 0) {
        return NextResponse.json(
          { success: false, error: `Missing required fields: ${missingFields.join(', ')}.` },
          { status: 400 },
        );
      }

      // ── 3. Type coercion & early type-level rejection ──────────────────
      const { sku, name, brand, price, stock, category } = raw;

      if (typeof sku !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Field "sku" must be a string.' },
          { status: 400 },
        );
      }
      if (typeof name !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Field "name" must be a string.' },
          { status: 400 },
        );
      }
      if (typeof brand !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Field "brand" must be a string.' },
          { status: 400 },
        );
      }
      if (typeof price !== 'number' || !Number.isFinite(price)) {
        return NextResponse.json(
          { success: false, error: 'Field "price" must be a finite number.' },
          { status: 400 },
        );
      }
      if (typeof stock !== 'number' || !Number.isFinite(stock)) {
        return NextResponse.json(
          { success: false, error: 'Field "stock" must be a finite number.' },
          { status: 400 },
        );
      }
      if (typeof category !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Field "category" must be a string.' },
          { status: 400 },
        );
      }

      // ── 4. Delegate to use case (business rules validated inside) ───────
      const useCase = makeCreateProductUseCase();
      const product = await useCase.execute({
        sku: sku.trim(),
        name: name.trim(),
        brand: brand.trim(),
        price,
        stock,
        category: category.trim(),
      });

      return created(product);
    } catch (error) {
      // Map ConflictError → 409 before the generic handler runs
      if (error instanceof ConflictError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 409 });
      }
      return handleError(error);
    }
  }
}
