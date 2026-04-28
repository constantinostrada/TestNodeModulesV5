import { NextRequest } from 'next/server';
import { PostController } from '@interfaces/http/controllers/PostController';

const controller = new PostController();

/**
 * GET /api/posts — list all posts (supports ?authorId=&limit=&offset=)
 */
export async function GET(request: NextRequest) {
  return controller.listPosts(request);
}

/**
 * POST /api/posts — create a new post
 * Body: { title: string; content: string; authorId: string }
 */
export async function POST(request: NextRequest) {
  return controller.createPost(request);
}
