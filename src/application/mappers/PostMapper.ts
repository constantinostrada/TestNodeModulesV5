import { Post } from '@domain/entities/Post';
import { PostSlugService } from '@domain/services/PostSlugService';
import { PostDTO } from '@application/dtos/PostDTO';

const slugService = new PostSlugService();

/**
 * PostMapper — translates between domain entities and DTOs.
 * Lives in application because it bridges domain ↔ interface concerns.
 */
export class PostMapper {
  static toDTO(post: Post): PostDTO {
    return {
      id: post.id.value,
      title: post.title.value,
      content: post.content.value,
      excerpt: post.content.excerpt(160),
      authorId: post.authorId,
      status: post.status,
      slug: slugService.generateSlug(post.title),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  static toDTOList(posts: Post[]): PostDTO[] {
    return posts.map(PostMapper.toDTO);
  }
}
