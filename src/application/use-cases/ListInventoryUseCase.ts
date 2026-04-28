import { IProductRepository } from '@domain/repositories/IProductRepository';
import { ProductDTO, ListInventoryInputDTO } from '@application/dtos/ProductDTO';
import { ProductMapper } from '@application/mappers/ProductMapper';

/**
 * ListInventoryUseCase — returns the full product catalogue as DTOs.
 *
 * Orchestrates domain + repository; holds no framework or persistence knowledge.
 */
export class ListInventoryUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: ListInventoryInputDTO = {}): Promise<ProductDTO[]> {
    const products = await this.productRepository.findAll({
      category: input.category,
    });

    return ProductMapper.toDTOList(products);
  }
}
