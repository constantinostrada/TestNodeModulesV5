import { DomainError } from '@domain/errors/DomainError';

const MIN_LENGTH = 3;
const MAX_LENGTH = 150;

/**
 * PostTitle — Value Object.
 * Enforces title length constraints as a domain rule.
 */
export class PostTitle {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PostTitle {
    if (!value || value.trim().length === 0) {
      throw new DomainError('Post title cannot be empty.');
    }
    const trimmed = value.trim();
    if (trimmed.length < MIN_LENGTH) {
      throw new DomainError(
        `Post title must be at least ${MIN_LENGTH} characters. Got ${trimmed.length}.`,
      );
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new DomainError(
        `Post title must be at most ${MAX_LENGTH} characters. Got ${trimmed.length}.`,
      );
    }
    return new PostTitle(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PostTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
