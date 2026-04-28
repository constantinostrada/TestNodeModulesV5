import { Product } from '@domain/entities/Product';
import { ProductDTO } from '@application/dtos/ProductDTO';

/**
 * ProductMapper — translates between domain entities and DTOs.
 * Lives in application because it bridges domain ↔ interface concerns.
 */
export class ProductMapper {
  static toDTO(product: Product): ProductDTO {
    return {
      id: product.id,
      sku: product.sku.value,
      name: product.name,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      category: product.category,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  static toDTOList(products: Product[]): ProductDTO[] {
    return products.map(ProductMapper.toDTO);
  }
}
