import { InMemoryPostRepository } from '@infrastructure/repositories/InMemoryPostRepository';
import { Post } from '@domain/entities/Post';
import { PostId } from '@domain/value-objects/PostId';
import { PostTitle } from '@domain/value-objects/PostTitle';
import { PostContent } from '@domain/value-objects/PostContent';

function makePost(
  id = '123e4567-e89b-12d3-a456-426614174010',
  authorId = 'author-1',
): Post {
  return Post.create({
    id: PostId.create(id),
    title: PostTitle.create('A Test Post Title'),
    content: PostContent.create('This is a sufficiently long content for testing purposes.'),
    authorId,
  });
}

describe('InMemoryPostRepository', () => {
  let repo: InMemoryPostRepository;

  beforeEach(() => {
    repo = new InMemoryPostRepository();
  });

  it('saves and retrieves a post by id', async () => {
    const post = makePost();
    await repo.save(post);
    const found = await repo.findById(PostId.create(post.id.value));
    expect(found).not.toBeNull();
    expect(found?.id.value).toBe(post.id.value);
  });

  it('returns null when post is not found', async () => {
    const result = await repo.findById(PostId.create('00000000-0000-1000-8000-000000000000'));
    expect(result).toBeNull();
  });

  it('lists all posts', async () => {
    await repo.save(makePost('123e4567-e89b-12d3-a456-426614174011'));
    await repo.save(makePost('123e4567-e89b-12d3-a456-426614174012'));
    const posts = await repo.findAll();
    expect(posts).toHaveLength(2);
  });

  it('filters posts by authorId', async () => {
    await repo.save(makePost('123e4567-e89b-12d3-a456-426614174013', 'author-A'));
    await repo.save(makePost('123e4567-e89b-12d3-a456-426614174014', 'author-B'));
    const posts = await repo.findAll({ authorId: 'author-A' });
    expect(posts).toHaveLength(1);
    expect(posts[0].authorId).toBe('author-A');
  });

  it('deletes a post', async () => {
    const post = makePost();
    await repo.save(post);
    await repo.delete(PostId.create(post.id.value));
    const found = await repo.findById(PostId.create(post.id.value));
    expect(found).toBeNull();
    expect(repo.count()).toBe(0);
  });

  it('returns true for exists when post is present', async () => {
    const post = makePost();
    await repo.save(post);
    const exists = await repo.exists(PostId.create(post.id.value));
    expect(exists).toBe(true);
  });

  it('returns false for exists when post is absent', async () => {
    const exists = await repo.exists(PostId.create('00000000-0000-1000-8000-000000000000'));
    expect(exists).toBe(false);
  });

  it('respects limit and offset', async () => {
    for (let i = 0; i < 5; i++) {
      const uuid = `123e4567-e89b-12d3-a456-42661417401${i}`;
      await repo.save(makePost(uuid));
    }
    const page = await repo.findAll({ limit: 2, offset: 1 });
    expect(page).toHaveLength(2);
  });
});
