import { IProductRepository, ProductFilterOptions } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';
import { ProductId } from '@domain/value-objects/ProductId';
import { Sku } from '@domain/value-objects/Sku';
import { Price } from '@domain/value-objects/Price';

/**
 * Seed data — representative inventory items across several categories.
 * Replace with a DB-backed implementation when a persistence layer is added.
 */
const SEED_PRODUCTS: Array<{
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
}> = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000001',
    sku: 'ELEC-TV-001',
    name: 'Smart TV 55"',
    brand: 'Samsung',
    price: 799.99,
    stock: 12,
    category: 'Electrónica',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000002',
    sku: 'ELEC-NB-002',
    name: 'Notebook ProBook 14',
    brand: 'HP',
    price: 1249.0,
    stock: 3,
    category: 'Electrónica',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000003',
    sku: 'ELEC-AUD-003',
    name: 'Auriculares Bluetooth WH-1000XM5',
    brand: 'Sony',
    price: 349.99,
    stock: 0,
    category: 'Electrónica',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000004',
    sku: 'HOGA-REF-001',
    name: 'Refrigerador No Frost 400L',
    brand: 'Whirlpool',
    price: 689.5,
    stock: 7,
    category: 'Hogar',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000005',
    sku: 'HOGA-MIC-002',
    name: 'Microondas Digital 30L',
    brand: 'Electrolux',
    price: 129.9,
    stock: 4,
    category: 'Hogar',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000006',
    sku: 'DEPO-ZAP-001',
    name: 'Zapatillas Running Air Max',
    brand: 'Nike',
    price: 119.95,
    stock: 25,
    category: 'Deportes',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000007',
    sku: 'DEPO-BIC-002',
    name: 'Bicicleta de Montaña 29"',
    brand: 'Trek',
    price: 950.0,
    stock: 2,
    category: 'Deportes',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000008',
    sku: 'ROPA-CAM-001',
    name: 'Camisa Oxford Slim Fit',
    brand: 'Zara',
    price: 39.99,
    stock: 18,
    category: 'Ropa',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000009',
    sku: 'ROPA-JAC-002',
    name: 'Campera Parka Impermeable',
    brand: 'The North Face',
    price: 220.0,
    stock: 1,
    category: 'Ropa',
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-000000000010',
    sku: 'LIBB-NOV-001',
    name: 'Cien Años de Soledad',
    brand: 'Sudamericana',
    price: 18.5,
    stock: 30,
    category: 'Libros',
  },
];

/**
 * InMemoryProductRepository — infrastructure implementation of IProductRepository.
 *
 * Bootstraps from SEED_PRODUCTS on construction.
 * Supports case-insensitive partial matching on name and category; exact
 * case-insensitive matching on SKU.
 */
export class InMemoryProductRepository implements IProductRepository {
  private readonly store = new Map<string, Product>();

  constructor() {
    this.seed();
  }

  private seed(): void {
    for (const raw of SEED_PRODUCTS) {
      const product = Product.create({
        id: ProductId.create(raw.id),
        sku: Sku.create(raw.sku),
        name: raw.name,
        brand: raw.brand,
        price: Price.create(raw.price),
        stock: raw.stock,
        category: raw.category,
      });
      this.store.set(product.id.value, product);
    }
  }

  async findById(id: ProductId): Promise<Product | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(filters?: ProductFilterOptions): Promise<Product[]> {
    let products = Array.from(this.store.values());

    if (filters?.sku) {
      const skuUpper = filters.sku.trim().toUpperCase();
      products = products.filter((p) => p.sku.value === skuUpper);
    }

    if (filters?.name) {
      const nameLower = filters.name.trim().toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(nameLower));
    }

    if (filters?.category) {
      const catLower = filters.category.trim().toLowerCase();
      products = products.filter((p) => p.category.toLowerCase().includes(catLower));
    }

    return products;
  }

  async exists(id: ProductId): Promise<boolean> {
    return this.store.has(id.value);
  }

  /** Utility for tests — clears all records including seed data. */
  clear(): void {
    this.store.clear();
  }

  /** Utility for tests — returns the current record count. */
  count(): number {
    return this.store.size;
  }
}
