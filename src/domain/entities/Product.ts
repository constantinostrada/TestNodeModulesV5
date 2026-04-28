import { ProductId } from '@domain/value-objects/ProductId';
import { Sku } from '@domain/value-objects/Sku';
import { Price } from '@domain/value-objects/Price';
import { DomainError } from '@domain/errors/DomainError';

export interface ProductProps {
  id: ProductId;
  sku: Sku;
  name: string;
  brand: string;
  price: Price;
  stock: number;
  category: string;
}

/** Threshold below which a product is considered critically low on stock. */
export const CRITICAL_STOCK_THRESHOLD = 5;

/**
 * Product — core domain entity representing an inventory item.
 * Enforces its own invariants; no DB, HTTP, or framework concerns here.
 */
export class Product {
  private readonly _id: ProductId;
  private readonly _sku: Sku;
  private _name: string;
  private _brand: string;
  private _price: Price;
  private _stock: number;
  private _category: string;

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
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainError('Product name cannot be empty.');
    }
    if (!props.brand || props.brand.trim().length === 0) {
      throw new DomainError('Product brand cannot be empty.');
    }
    if (!props.category || props.category.trim().length === 0) {
      throw new DomainError('Product category cannot be empty.');
    }
    if (!Number.isInteger(props.stock) || props.stock < 0) {
      throw new DomainError('Product stock must be a non-negative integer.');
    }
    return new Product({
      ...props,
      name: props.name.trim(),
      brand: props.brand.trim(),
      category: props.category.trim(),
    });
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  get id(): ProductId {
    return this._id;
  }

  get sku(): Sku {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get brand(): string {
    return this._brand;
  }

  get price(): Price {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get category(): string {
    return this._category;
  }

  // ── Domain queries ─────────────────────────────────────────────────────────

  isCriticalStock(): boolean {
    return this._stock < CRITICAL_STOCK_THRESHOLD;
  }

  isInStock(): boolean {
    return this._stock > 0;
  }
}
