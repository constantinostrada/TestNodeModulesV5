/**
 * container.ts — Dependency Injection composition root.
 *
 * Wires together infrastructure implementations with application use cases.
 * This is the ONLY place in the codebase where concrete infrastructure
 * classes are instantiated and injected into use cases.
 *
 * In production you would swap InMemoryPostRepository for a real DB adapter.
 */
import { InMemoryPostRepository } from '@infrastructure/repositories/InMemoryPostRepository';
import { UuidGenerator } from '@infrastructure/id/UuidGenerator';

import { CreatePostUseCase } from '@application/use-cases/CreatePostUseCase';
import { GetPostUseCase } from '@application/use-cases/GetPostUseCase';
import { ListPostsUseCase } from '@application/use-cases/ListPostsUseCase';
import { PublishPostUseCase } from '@application/use-cases/PublishPostUseCase';
import { DeletePostUseCase } from '@application/use-cases/DeletePostUseCase';

// ── Shared infrastructure singletons ───────────────────────────────────────

const postRepository = new InMemoryPostRepository();
const idGenerator = new UuidGenerator();

// ── Use-case factory functions ─────────────────────────────────────────────
// Exported as factory functions so that each call site can receive a fresh
// instance while still sharing the same repository singleton.

export function makeCreatePostUseCase(): CreatePostUseCase {
  return new CreatePostUseCase(postRepository, idGenerator);
}

export function makeGetPostUseCase(): GetPostUseCase {
  return new GetPostUseCase(postRepository);
}

export function makeListPostsUseCase(): ListPostsUseCase {
  return new ListPostsUseCase(postRepository);
}

export function makePublishPostUseCase(): PublishPostUseCase {
  return new PublishPostUseCase(postRepository);
}

export function makeDeletePostUseCase(): DeletePostUseCase {
  return new DeletePostUseCase(postRepository);
}
