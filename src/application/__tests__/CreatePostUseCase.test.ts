import { CreatePostUseCase } from '@application/use-cases/CreatePostUseCase';
import { InMemoryPostRepository } from '@infrastructure/repositories/InMemoryPostRepository';
import { DomainError } from '@domain/errors/DomainError';

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174001';

class StubIdGenerator {
  generate(): string {
    return VALID_UUID;
  }
}

function makeUseCase() {
  const repo = new InMemoryPostRepository();
  const idGen = new StubIdGenerator();
  const useCase = new CreatePostUseCase(repo, idGen);
  return { useCase, repo };
}

describe('CreatePostUseCase', () => {
  it('creates a post and returns a DTO', async () => {
    const { useCase } = makeUseCase();

    const dto = await useCase.execute({
      title: 'My First Post',
      content: 'This is the body of my very first post, long enough.',
      authorId: 'user-42',
    });

    expect(dto.id).toBe(VALID_UUID);
    expect(dto.title).toBe('My First Post');
    expect(dto.authorId).toBe('user-42');
    expect(dto.status).toBe('draft');
    expect(typeof dto.slug).toBe('string');
    expect(dto.slug).toBe('my-first-post');
  });

  it('persists the post to the repository', async () => {
    const { useCase, repo } = makeUseCase();

    await useCase.execute({
      title: 'Persisted Post',
      content: 'Making sure this gets saved into the repository properly.',
      authorId: 'user-1',
    });

    expect(repo.count()).toBe(1);
  });

  it('throws DomainError when title is too short', async () => {
    const { useCase } = makeUseCase();

    await expect(
      useCase.execute({
        title: 'Hi',
        content: 'Valid content long enough for the domain rule.',
        authorId: 'user-1',
      }),
    ).rejects.toThrow(DomainError);
  });

  it('throws DomainError when content is too short', async () => {
    const { useCase } = makeUseCase();

    await expect(
      useCase.execute({
        title: 'Valid Title Here',
        content: 'Short',
        authorId: 'user-1',
      }),
    ).rejects.toThrow(DomainError);
  });
});
