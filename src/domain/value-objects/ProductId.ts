import { DomainError } from '@domain/errors/DomainError';

/**
 * ProductId — Value Object wrapping a UUID string.
 * Equality is determined by value, not reference.
 */
export class ProductId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ProductId {
    if (!value || value.trim().length === 0) {
      throw new DomainError('ProductId cannot be empty.');
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value.trim())) {
      throw new DomainError(`ProductId "${value}" is not a valid UUID.`);
    }
    return new ProductId(value.trim().toLowerCase());
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
