import { DomainError } from '@domain/errors/DomainError';

/**
 * ProductSku — Value Object.
 *
 * Enforces the canonical SKU format: one or more characters composed
 * exclusively of uppercase ASCII letters (A-Z), digits (0-9) and
 * hyphens (-).  Spaces and lowercase letters are rejected at the
 * domain boundary so that the invariant is maintained regardless of
 * where a SKU originates (API body, CSV import, etc.).
 */
const SKU_REGEX = /^[A-Z0-9-]+$/;

export class ProductSku {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(raw: unknown): ProductSku {
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      throw new DomainError('SKU must be a non-empty string.');
    }

    const trimmed = raw.trim();

    if (!SKU_REGEX.test(trimmed)) {
      throw new DomainError(
        `SKU "${trimmed}" is invalid. Only uppercase letters (A-Z), digits (0-9) and hyphens (-) are allowed.`,
      );
    }

    return new ProductSku(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductSku): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
