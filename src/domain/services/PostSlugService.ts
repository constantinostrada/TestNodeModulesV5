import { PostTitle } from '@domain/value-objects/PostTitle';

/**
 * PostSlugService — Domain Service.
 *
 * Generates a URL-safe slug from a PostTitle.
 * Lives in domain because slug generation is a pure business rule
 * that does not depend on any external system.
 */
export class PostSlugService {
  /**
   * Converts a post title to a URL-safe slug.
   * e.g. "Hello, World! 2024" → "hello-world-2024"
   */
  generateSlug(title: PostTitle): string {
    return title.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip diacritics
      .replace(/[^a-z0-9\s-]/g, '')    // remove non-alphanumeric (except spaces/hyphens)
      .trim()
      .replace(/\s+/g, '-')             // spaces → hyphens
      .replace(/-+/g, '-');             // collapse multiple hyphens
  }
}
