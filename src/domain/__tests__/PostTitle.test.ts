import { PostTitle } from '@domain/value-objects/PostTitle';
import { DomainError } from '@domain/errors/DomainError';

describe('PostTitle value object', () => {
  it('creates a valid title', () => {
    const title = PostTitle.create('Hello World');
    expect(title.value).toBe('Hello World');
  });

  it('trims surrounding whitespace', () => {
    const title = PostTitle.create('  Trimmed Title  ');
    expect(title.value).toBe('Trimmed Title');
  });

  it('throws when title is empty', () => {
    expect(() => PostTitle.create('')).toThrow(DomainError);
    expect(() => PostTitle.create('   ')).toThrow(DomainError);
  });

  it('throws when title is too short', () => {
    expect(() => PostTitle.create('Hi')).toThrow(DomainError);
  });

  it('throws when title exceeds max length', () => {
    expect(() => PostTitle.create('A'.repeat(151))).toThrow(DomainError);
  });

  it('compares equality by value', () => {
    const a = PostTitle.create('Same Title');
    const b = PostTitle.create('Same Title');
    expect(a.equals(b)).toBe(true);
  });

  it('identifies inequality correctly', () => {
    const a = PostTitle.create('Title One');
    const b = PostTitle.create('Title Two');
    expect(a.equals(b)).toBe(false);
  });
});
