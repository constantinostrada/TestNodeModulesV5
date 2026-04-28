import { NextRequest } from 'next/server';
import { PostController } from '@interfaces/http/controllers/PostController';

const controller = new PostController();

/**
 * GET /api/posts/:id — fetch a single post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return controller.getPost(request, params.id);
}

/**
 * DELETE /api/posts/:id — remove a post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return controller.deletePost(request, params.id);
}
