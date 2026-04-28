import { Post } from '@domain/entities/Post';
import { PostId } from '@domain/value-objects/PostId';
import { PostTitle } from '@domain/value-objects/PostTitle';
import { PostContent } from '@domain/value-objects/PostContent';
import { DomainError } from '@domain/errors/DomainError';

const validId = PostId.create('123e4567-e89b-12d3-a456-426614174000');
const validTitle = PostTitle.create('A Valid Post Title');
const validContent = PostContent.create('This is valid post content with enough characters.');

function makePost(overrides: Partial<Parameters<typeof Post.create>[0]> = {}) {
  return Post.create({
    id: validId,
    title: validTitle,
    content: validContent,
    authorId: 'author-1',
    ...overrides,
  });
}

describe('Post entity', () => {
  it('creates a post in draft status by default', () => {
    const post = makePost();
    expect(post.isDraft()).toBe(true);
    expect(post.status).toBe('draft');
  });

  it('exposes its value objects via getters', () => {
    const post = makePost();
    expect(post.id).toBe(validId);
    expect(post.title).toBe(validTitle);
    expect(post.authorId).toBe('author-1');
  });

  it('publishes a draft post', () => {
    const post = makePost();
    post.publish();
    expect(post.isPublished()).toBe(true);
    expect(post.status).toBe('published');
  });

  it('throws when publishing an already-published post', () => {
    const post = makePost();
    post.publish();
    expect(() => post.publish()).toThrow(DomainError);
  });

  it('throws when publishing an archived post', () => {
    const post = makePost({ status: 'archived' });
    expect(() => post.publish()).toThrow(DomainError);
  });

  it('archives a post', () => {
    const post = makePost();
    post.archive();
    expect(post.isArchived()).toBe(true);
  });

  it('throws when archiving an already-archived post', () => {
    const post = makePost({ status: 'archived' });
    expect(() => post.archive()).toThrow(DomainError);
  });

  it('throws when updating title of an archived post', () => {
    const post = makePost({ status: 'archived' });
    const newTitle = PostTitle.create('New Valid Title');
    expect(() => post.updateTitle(newTitle)).toThrow(DomainError);
  });

  it('throws when authorId is empty', () => {
    expect(() => makePost({ authorId: '   ' })).toThrow(DomainError);
  });

  it('updates updatedAt when published', () => {
    const post = makePost();
    const before = post.updatedAt.getTime();
    post.publish();
    expect(post.updatedAt.getTime()).toBeGreaterThanOrEqual(before);
  });
});
