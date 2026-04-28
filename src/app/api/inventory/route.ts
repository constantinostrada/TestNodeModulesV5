import { NextRequest } from 'next/server';
import { InventoryController } from '@interfaces/http/controllers/InventoryController';

const controller = new InventoryController();

/**
 * GET /api/inventory
 *
 * Query params (all optional, combinable):
 *   ?name=<partial>       — case-insensitive substring match on product name
 *   ?sku=<exact>          — case-insensitive exact match on SKU
 *   ?category=<partial>   — case-insensitive substring match on category
 *
 * Response shape:
 *   {
 *     items:             ProductDTO[]
 *     total:             number   // count after filters
 *     criticalStockCount: number  // items where stock < 5
 *   }
 */
export function GET(request: NextRequest) {
  return controller.listInventory(request);
}
