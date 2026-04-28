import { IPostRepository } from '@domain/repositories/IPostRepository';
import { Post } from '@domain/entities/Post';
import { PostId } from '@domain/value-objects/PostId';

/**
 * InMemoryPostRepository — infrastructure implementation of IPostRepository.
 *
 * Uses a plain Map as the backing store.
 * Suitable for development, testing, and as a reference implementation.
 * In production, replace with a database-backed implementation.
 */
export class InMemoryPostRepository implements IPostRepository {
  private readonly store = new Map<string, Post>();

  async save(post: Post): Promise<void> {
    this.store.set(post.id.value, post);
  }

  async findById(id: PostId): Promise<Post | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(options?: {
    authorId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Post[]> {
    let posts = Array.from(this.store.values());

    if (options?.authorId) {
      posts = posts.filter((p) => p.authorId === options.authorId);
    }

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? posts.length;

    return posts.slice(offset, offset + limit);
  }

  async delete(id: PostId): Promise<void> {
    this.store.delete(id.value);
  }

  async exists(id: PostId): Promise<boolean> {
    return this.store.has(id.value);
  }

  /** Utility for tests — clears all records. */
  clear(): void {
    this.store.clear();
  }

  /** Utility for tests — returns the current record count. */
  count(): number {
    return this.store.size;
  }
}
