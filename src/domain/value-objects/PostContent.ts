import { DomainError } from '@domain/errors/DomainError';

const MIN_LENGTH = 10;
const MAX_LENGTH = 50_000;

/**
 * PostContent — Value Object.
 * Enforces content length constraints as a domain rule.
 */
export class PostContent {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PostContent {
    if (!value || value.trim().length === 0) {
      throw new DomainError('Post content cannot be empty.');
    }
    const trimmed = value.trim();
    if (trimmed.length < MIN_LENGTH) {
      throw new DomainError(
        `Post content must be at least ${MIN_LENGTH} characters. Got ${trimmed.length}.`,
      );
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(
        `Post content must be at most ${MAX_LENGTH} characters. Got ${trimmed.length}.`,
      );
    }
    return new PostContent(trimmed);
  }

  get value(): string {
    return this._value;
  }

  /** Returns a plain-text excerpt truncated to `length` characters. */
  excerpt(length = 160): string {
    if (this._value.length <= length) return this._value;
    return this._value.slice(0, length).trimEnd() + '…';
  }

  equals(other: PostContent): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
