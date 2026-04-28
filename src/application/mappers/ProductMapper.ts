import { Product } from '@domain/entities/Product';
import { ProductDTO } from '@application/dtos/ProductDTO';

/**
 * ProductMapper — translates between domain entities and DTOs.
 * Lives in application because it bridges domain ↔ interface concerns.
 */
export class ProductMapper {
  static toDTO(product: Product): ProductDTO {
    return {
      id: product.id.value,
      sku: product.sku.value,
      name: product.name,
      brand: product.brand,
      price: product.price.value,
      stock: product.stock,
      category: product.category,
      criticalStock: product.isCriticalStock(),
    };
  }

  static toDTOList(products: Product[]): ProductDTO[] {
    return products.map(ProductMapper.toDTO);
  }
}
