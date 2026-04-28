import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';
import { ProductSku } from '@domain/value-objects/ProductSku';
import { CreateProductInputDTO, ProductDTO } from '@application/dtos/ProductDTO';
import { ProductMapper } from '@application/mappers/ProductMapper';
import { ConflictError } from '@application/errors/ConflictError';
import { IIdGenerator } from '@application/use-cases/CreatePostUseCase';

/**
 * CreateProductUseCase — orchestrates creation of a new Product.
 *
 * Responsibilities:
 *  - Build the ProductSku value object (format validated inside it)
 *  - Check SKU uniqueness; raise ConflictError (→ HTTP 409) if taken
 *  - Delegate remaining invariant checks to the Product entity
 *  - Persist and return a ProductDTO — never a raw domain entity
 *
 * This use case is intentionally unaware of HTTP, databases or frameworks.
 */
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreateProductInputDTO): Promise<ProductDTO> {
    // Build value object — throws DomainError if format is invalid
    const sku = ProductSku.create(dto.sku);

    // Uniqueness check — throws ConflictError (409) if SKU already exists
    const existing = await this.productRepository.findBySku(sku.value);
    if (existing !== null) {
      throw new ConflictError('Product', 'SKU', sku.value);
    }

    // Build entity — throws DomainError for any violated invariant
    const product = Product.create({
      id: this.idGenerator.generate(),
      sku,
      name: dto.name,
      brand: dto.brand,
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
    });

    await this.productRepository.save(product);

    return ProductMapper.toDTO(product);
  }
}
