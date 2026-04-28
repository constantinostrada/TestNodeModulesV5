import { PostSlugService } from '@domain/services/PostSlugService';
import { PostTitle } from '@domain/value-objects/PostTitle';

describe('PostSlugService', () => {
  const service = new PostSlugService();

  it('generates a lowercase hyphenated slug', () => {
    const title = PostTitle.create('Hello World Post');
    expect(service.generateSlug(title)).toBe('hello-world-post');
  });

  it('strips special characters', () => {
    const title = PostTitle.create('Clean Code: The Book!');
    expect(service.generateSlug(title)).toBe('clean-code-the-book');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    const title = PostTitle.create('Too   Many   Spaces');
    expect(service.generateSlug(title)).toBe('too-many-spaces');
  });

  it('strips diacritics', () => {
    const title = PostTitle.create('Café Résumé');
    expect(service.generateSlug(title)).toBe('cafe-resume');
  });
});
