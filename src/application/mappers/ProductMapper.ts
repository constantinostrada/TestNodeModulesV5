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
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      category: product.category,
      stockStatus: product.isOutOfStock()
        ? 'out_of_stock'
        : product.isCriticalStock()
          ? 'critical'
          : 'ok',
    };
  }

  static toDTOList(products: Product[]): ProductDTO[] {
    return products.map(ProductMapper.toDTO);
  }
}
