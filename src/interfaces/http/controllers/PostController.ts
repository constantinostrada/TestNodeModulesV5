import { NextRequest } from 'next/server';
import {
  makeCreatePostUseCase,
  makeGetPostUseCase,
  makeListPostsUseCase,
  makePublishPostUseCase,
  makeDeletePostUseCase,
} from '@infrastructure/container';
import { ok, created, handleError } from '@interfaces/http/helpers/apiResponse';

/**
 * PostController — thin adapter between Next.js route handlers and use cases.
 *
 * Rules enforced here:
 *  - Validate shape/presence of inputs (not business rules)
 *  - Delegate all logic to use cases
 *  - Serialize output using DTOs returned by use cases
 *  - Decide HTTP status codes
 */
export class PostController {
  // GET /api/posts
  async listPosts(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const authorId = searchParams.get('authorId') ?? undefined;
      const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
      const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined;

      const useCase = makeListPostsUseCase();
      const posts = await useCase.execute({ authorId, limit, offset });

      return ok(posts);
    } catch (error) {
      return handleError(error);
    }
  }

  // POST /api/posts
  async createPost(request: NextRequest) {
    try {
      const body = await request.json();

      if (!body.title || !body.content || !body.authorId) {
        return handleError(new Error('Missing required fields: title, content, authorId'));
      }

      const useCase = makeCreatePostUseCase();
      const post = await useCase.execute({
        title: body.title,
        content: body.content,
        authorId: body.authorId,
      });

      return created(post);
    } catch (error) {
      return handleError(error);
    }
  }

  // GET /api/posts/[id]
  async getPost(_request: NextRequest, id: string) {
    try {
      const useCase = makeGetPostUseCase();
      const post = await useCase.execute({ id });
      return ok(post);
    } catch (error) {
      return handleError(error);
    }
  }

  // PATCH /api/posts/[id]/publish
  async publishPost(_request: NextRequest, id: string) {
    try {
      const useCase = makePublishPostUseCase();
      const post = await useCase.execute({ id });
      return ok(post);
    } catch (error) {
      return handleError(error);
    }
  }

  // DELETE /api/posts/[id]
  async deletePost(_request: NextRequest, id: string) {
    try {
      const useCase = makeDeletePostUseCase();
      await useCase.execute({ id });
      return ok({ message: `Post ${id} deleted successfully.` });
    } catch (error) {
      return handleError(error);
    }
  }
}
