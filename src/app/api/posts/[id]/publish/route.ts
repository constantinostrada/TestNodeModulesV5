import { NextRequest } from 'next/server';
import { PostController } from '@interfaces/http/controllers/PostController';

const controller = new PostController();

/**
 * PATCH /api/posts/:id/publish — transition a draft post to published
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return controller.publishPost(request, params.id);
}
