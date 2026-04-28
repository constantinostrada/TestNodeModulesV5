import { IProductRepository } from '@domain/repositories/IProductRepository';
import {
  ListInventoryInputDTO,
  ListInventoryOutputDTO,
} from '@application/dtos/ProductDTO';
import { ProductMapper } from '@application/mappers/ProductMapper';

/**
 * ListInventoryUseCase — returns all inventory products with optional filters.
 *
 * Also computes aggregate metadata: total item count and critical-stock count.
 */
export class ListInventoryUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: ListInventoryInputDTO = {}): Promise<ListInventoryOutputDTO> {
    const products = await this.productRepository.findAll({
      name: dto.name,
      sku: dto.sku,
      category: dto.category,
    });

    const items = ProductMapper.toDTOList(products);

    return {
      items,
      total: items.length,
      criticalStockCount: items.filter((p) => p.criticalStock).length,
    };
  }
}
