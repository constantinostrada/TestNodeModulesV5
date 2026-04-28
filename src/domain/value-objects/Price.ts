import { DomainError } from '@domain/errors/DomainError';

/**
 * Price — Value Object representing a monetary amount in a product context.
 * Must be a finite, non-negative number rounded to at most 2 decimal places.
 */
export class Price {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): Price {
    if (!Number.isFinite(value)) {
      throw new DomainError('Price must be a finite number.');
    }
    if (value < 0) {
      throw new DomainError('Price cannot be negative.');
    }
    // Round to 2 decimal places to avoid floating-point drift
    return new Price(Math.round(value * 100) / 100);
  }

  get value(): number {
    return this._value;
  }

  equals(other: Price): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toFixed(2);
  }
}
