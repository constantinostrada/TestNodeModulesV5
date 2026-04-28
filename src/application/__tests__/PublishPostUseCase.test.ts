import { PublishPostUseCase } from '@application/use-cases/PublishPostUseCase';
import { CreatePostUseCase } from '@application/use-cases/CreatePostUseCase';
import { InMemoryPostRepository } from '@infrastructure/repositories/InMemoryPostRepository';
import { NotFoundError } from '@application/errors/ApplicationError';
import { DomainError } from '@domain/errors/DomainError';

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174002';

class StubIdGenerator {
  generate(): string {
    return VALID_UUID;
  }
}

async function setup() {
  const repo = new InMemoryPostRepository();
  const idGen = new StubIdGenerator();
  const createUseCase = new CreatePostUseCase(repo, idGen);
  const publishUseCase = new PublishPostUseCase(repo);

  const createdPost = await createUseCase.execute({
    title: 'A Draft Post Title',
    content: 'Enough content to satisfy the domain value object constraint.',
    authorId: 'user-99',
  });

  return { repo, publishUseCase, createdPost };
}

describe('PublishPostUseCase', () => {
  it('publishes a draft post and returns a DTO with status=published', async () => {
    const { publishUseCase, createdPost } = await setup();

    const dto = await publishUseCase.execute({ id: createdPost.id });

    expect(dto.status).toBe('published');
    expect(dto.id).toBe(VALID_UUID);
  });

  it('throws NotFoundError for a non-existent post', async () => {
    const { publishUseCase } = await setup();

    await expect(
      publishUseCase.execute({ id: '00000000-0000-1000-8000-000000000000' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws DomainError when publishing an already-published post', async () => {
    const { publishUseCase, createdPost } = await setup();

    await publishUseCase.execute({ id: createdPost.id });

    await expect(publishUseCase.execute({ id: createdPost.id })).rejects.toThrow(DomainError);
  });
});
