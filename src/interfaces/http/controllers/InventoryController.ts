import { NextRequest } from 'next/server';
import { makeListInventoryUseCase } from '@infrastructure/container';
import { ok, handleError } from '@interfaces/http/helpers/apiResponse';

/**
 * InventoryController — thin adapter between Next.js route handlers and use cases.
 *
 * Responsibilities:
 *  - Extract and coerce query-string parameters
 *  - Delegate all logic to the use case
 *  - Serialize the output DTO into an HTTP response
 */
export class InventoryController {
  // GET /api/inventory — list all products with optional filters
  async listInventory(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);

      const name = searchParams.get('name') ?? undefined;
      const sku = searchParams.get('sku') ?? undefined;
      const category = searchParams.get('category') ?? undefined;

      const useCase = makeListInventoryUseCase();
      const result = await useCase.execute({ name, sku, category });

      return ok(result);
    } catch (error) {
      return handleError(error);
    }
  }
}
