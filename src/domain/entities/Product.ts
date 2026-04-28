import { DomainError } from '@domain/errors/DomainError';

export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'food'
  | 'books'
  | 'sports'
  | 'home'
  | 'beauty'
  | 'toys';

export interface ProductProps {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: ProductCategory;
}

/**
 * Product — core domain entity.
 * Enforces invariants; no DB, HTTP, or framework concerns.
 */
export class Product {
  private readonly _id: string;
  private readonly _sku: string;
  private _name: string;
  private _brand: string;
  private _price: number;
  private _stock: number;
  private _category: ProductCategory;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._sku = props.sku;
    this._name = props.name;
    this._brand = props.brand;
    this._price = props.price;
    this._stock = props.stock;
    this._category = props.category;
  }

  static create(props: ProductProps): Product {
    if (!props.id || props.id.trim().length === 0) {
      throw new DomainError('Product id cannot be empty.');
    }
    if (!props.sku || props.sku.trim().length === 0) {
      throw new DomainError('Product SKU cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainError('Product name cannot be empty.');
    }
    if (!props.brand || props.brand.trim().length === 0) {
      throw new DomainError('Product brand cannot be empty.');
    }
    if (props.price < 0) {
      throw new DomainError('Product price cannot be negative.');
    }
    if (props.stock < 0) {
      throw new DomainError('Product stock cannot be negative.');
    }
    return new Product(props);
  }

  // ── Getters ──────────────────────────────────────────────────────────────

  get id(): string {
    return this._id;
  }

  get sku(): string {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get brand(): string {
    return this._brand;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get category(): ProductCategory {
    return this._category;
  }

  // ── Domain helpers ────────────────────────────────────────────────────────

  isCriticalStock(): boolean {
    return this._stock > 0 && this._stock < 5;
  }

  isOutOfStock(): boolean {
    return this._stock === 0;
  }

  // ── Mutations ────────────────────────────────────────────────────────────

  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new DomainError('Stock quantity cannot be negative.');
    }
    this._stock = quantity;
  }

  updatePrice(price: number): void {
    if (price < 0) {
      throw new DomainError('Price cannot be negative.');
    }
    this._price = price;
  }

  updateCategory(category: ProductCategory): void {
    this._category = category;
  }
}
