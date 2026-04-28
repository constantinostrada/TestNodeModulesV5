import { Post } from '@domain/entities/Post';
import { PostId } from '@domain/value-objects/PostId';

/**
 * IPostRepository — Repository interface (abstraction only, no implementation).
 *
 * Defines the contract that any persistence layer must fulfil.
 * Implementations live in src/infrastructure/.
 */
export interface IPostRepository {
  /** Persist a new post or update an existing one. */
  save(post: Post): Promise<void>;

  /** Find a single post by its identity. Returns null if not found. */
  findById(id: PostId): Promise<Post | null>;

  /** Return all posts, optionally filtered by authorId. */
  findAll(options?: { authorId?: string; limit?: number; offset?: number }): Promise<Post[]>;

  /** Remove a post by identity. Resolves silently if not found. */
  delete(id: PostId): Promise<void>;

  /** Check whether a post with the given id already exists. */
  exists(id: PostId): Promise<boolean>;
}
