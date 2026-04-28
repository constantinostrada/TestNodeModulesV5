import { IPostRepository } from '@domain/repositories/IPostRepository';
import { PostId } from '@domain/value-objects/PostId';
import { GetPostInputDTO, PostDTO } from '@application/dtos/PostDTO';
import { PostMapper } from '@application/mappers/PostMapper';
import { NotFoundError } from '@application/errors/ApplicationError';

/**
 * GetPostUseCase — fetches a single post by its identifier.
 */
export class GetPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: GetPostInputDTO): Promise<PostDTO> {
    const postId = PostId.create(dto.id);
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundError('Post', dto.id);
    }

    return PostMapper.toDTO(post);
  }
}
