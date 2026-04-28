import { PostId } from '@domain/value-objects/PostId';
import { PostTitle } from '@domain/value-objects/PostTitle';
import { PostContent } from '@domain/value-objects/PostContent';
import { DomainError } from '@domain/errors/DomainError';

export type PostStatus = 'draft' | 'published' | 'archived';

export interface PostProps {
  id: PostId;
  title: PostTitle;
  content: PostContent;
  authorId: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post — a core domain entity.
 * Protects its own invariants; no DB, HTTP, or framework concerns here.
 */
export class Post {
  private readonly _id: PostId;
  private _title: PostTitle;
  private _content: PostContent;
  private readonly _authorId: string;
  private _status: PostStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PostProps) {
    this._id = props.id;
    this._title = props.title;
    this._content = props.content;
    this._authorId = props.authorId;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  static create(props: {
    id: PostId;
    title: PostTitle;
    content: PostContent;
    authorId: string;
    status?: PostStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): Post {
    if (!props.authorId || props.authorId.trim().length === 0) {
      throw new DomainError('Post must have a valid authorId.');
    }

    const now = new Date();
    return new Post({
      id: props.id,
      title: props.title,
      content: props.content,
      authorId: props.authorId.trim(),
      status: props.status ?? 'draft',
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  // ── Accessors ──────────────────────────────────────────────────────────────

  get id(): PostId {
    return this._id;
  }

  get title(): PostTitle {
    return this._title;
  }

  get content(): PostContent {
    return this._content;
  }

  get authorId(): string {
    return this._authorId;
  }

  get status(): PostStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ── Domain Behaviours ──────────────────────────────────────────────────────

  publish(): void {
    if (this._status === 'archived') {
      throw new DomainError('Cannot publish an archived post.');
    }
    if (this._status === 'published') {
      throw new DomainError('Post is already published.');
    }
    this._status = 'published';
    this._updatedAt = new Date();
  }

  archive(): void {
    if (this._status === 'archived') {
      throw new DomainError('Post is already archived.');
    }
    this._status = 'archived';
    this._updatedAt = new Date();
  }

  updateTitle(title: PostTitle): void {
    if (this._status === 'archived') {
      throw new DomainError('Cannot update the title of an archived post.');
    }
    this._title = title;
    this._updatedAt = new Date();
  }

  updateContent(content: PostContent): void {
    if (this._status === 'archived') {
      throw new DomainError('Cannot update the content of an archived post.');
    }
    this._content = content;
    this._updatedAt = new Date();
  }

  isPublished(): boolean {
    return this._status === 'published';
  }

  isDraft(): boolean {
    return this._status === 'draft';
  }

  isArchived(): boolean {
    return this._status === 'archived';
  }
}
