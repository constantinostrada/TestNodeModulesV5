import { IPostRepository } from '@domain/repositories/IPostRepository';
import { ListPostsInputDTO, PostDTO } from '@application/dtos/PostDTO';
import { PostMapper } from '@application/mappers/PostMapper';

/**
 * ListPostsUseCase — returns a paginated list of posts, optionally filtered.
 */
export class ListPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: ListPostsInputDTO = {}): Promise<PostDTO[]> {
    const posts = await this.postRepository.findAll({
      authorId: dto.authorId,
      limit: dto.limit ?? 20,
      offset: dto.offset ?? 0,
    });

    return PostMapper.toDTOList(posts);
  }
}
