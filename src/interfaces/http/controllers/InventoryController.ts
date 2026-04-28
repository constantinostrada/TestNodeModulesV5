import { NextRequest, NextResponse } from 'next/server';
import { ListInventoryUseCase } from '@application/use-cases/ListInventoryUseCase';
import { ProductCategory } from '@domain/entities/Product';
import { ok, handleError } from '@interfaces/http/helpers/apiResponse';

/**
 * InventoryController — thin HTTP adapter for inventory endpoints.
 *
 * No business logic here: validate HTTP input → call use case → serialize response.
 */
export class InventoryController {
  constructor(private readonly listInventoryUseCase: ListInventoryUseCase) {}

  async list(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category') as ProductCategory | null;

      const products = await this.listInventoryUseCase.execute({
        ...(category ? { category } : {}),
      });

      return ok(products);
    } catch (error) {
      return handleError(error);
    }
  }
}
