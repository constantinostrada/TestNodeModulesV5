/**
 * PostDTO — plain data object crossing the application boundary.
 *
 * Controllers and external consumers receive this shape, never raw domain entities.
 */
export interface PostDTO {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

// ── Input DTOs ─────────────────────────────────────────────────────────────

export interface CreatePostInputDTO {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdatePostInputDTO {
  id: string;
  title?: string;
  content?: string;
}

export interface PublishPostInputDTO {
  id: string;
}

export interface GetPostInputDTO {
  id: string;
}

export interface ListPostsInputDTO {
  authorId?: string;
  limit?: number;
  offset?: number;
}
