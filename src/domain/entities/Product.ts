import { DomainError } from '@domain/errors/DomainError';
import { ProductSku } from '@domain/value-objects/ProductSku';

export interface ProductProps {
  id: string;
  sku: ProductSku;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product — core domain entity.
 *
 * Guards all invariants:
 *  - SKU format is enforced by the ProductSku value object
 *  - price must be strictly positive
 *  - stock must be non-negative
 *  - name, brand and category must be non-empty strings
 *
 * No framework, HTTP or DB concerns are allowed here.
 */
export class Product {
  private readonly _id: string;
  private readonly _sku: ProductSku;
  private readonly _name: string;
  private readonly _brand: string;
  private readonly _price: number;
  private readonly _stock: number;
  private readonly _category: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._sku = props.sku;
    this._name = props.name;
    this._brand = props.brand;
    this._price = props.price;
    this._stock = props.stock;
    this._category = props.category;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
    sku: ProductSku;
    name: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
  }): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainError('Product name cannot be empty.');
    }
    if (!props.brand || props.brand.trim().length === 0) {
      throw new DomainError('Product brand cannot be empty.');
    }
    if (!props.category || props.category.trim().length === 0) {
      throw new DomainError('Product category cannot be empty.');
    }
    if (typeof props.price !== 'number' || !isFinite(props.price) || props.price <= 0) {
      throw new DomainError('Product price must be a finite number greater than zero.');
    }
    if (typeof props.stock !== 'number' || !isFinite(props.stock) || props.stock < 0) {
      throw new DomainError('Product stock must be a non-negative integer.');
    }
    if (!Number.isInteger(props.stock)) {
      throw new DomainError('Product stock must be an integer.');
    }

    const now = new Date();
    return new Product({
      id: props.id,
      sku: props.sku,
      name: props.name.trim(),
      brand: props.brand.trim(),
      price: props.price,
      stock: props.stock,
      category: props.category.trim(),
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this._id;
  }

  get sku(): ProductSku {
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

  get category(): string {
    return this._category;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
