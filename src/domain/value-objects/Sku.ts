import { DomainError } from '@domain/errors/DomainError';

/**
 * Sku — Value Object representing a Stock Keeping Unit code.
 * Must be non-empty and contain only alphanumeric characters and hyphens.
 */
export class Sku {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Sku {
    if (!value || value.trim().length === 0) {
      throw new DomainError('SKU cannot be empty.');
    }
    const normalized = value.trim().toUpperCase();
    const skuRegex = /^[A-Z0-9][A-Z0-9\-]{1,49}$/;
    if (!skuRegex.test(normalized)) {
      throw new DomainError(
        `SKU "${value}" is invalid. Must be 2–50 alphanumeric characters or hyphens.`,
      );
    }
    return new Sku(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Sku): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
