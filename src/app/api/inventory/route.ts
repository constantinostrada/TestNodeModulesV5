import { NextRequest } from 'next/server';
import { makeListInventoryUseCase } from '@infrastructure/container';
import { InventoryController } from '@interfaces/http/controllers/InventoryController';

/**
 * GET /api/inventory
 * Query params:
 *   ?category=electronics|clothing|food|books|sports|home|beauty|toys
 */
export async function GET(request: NextRequest) {
  const controller = new InventoryController(makeListInventoryUseCase());
  return controller.list(request);
}
