import { IPostRepository } from '@domain/repositories/IPostRepository';
import { PostId } from '@domain/value-objects/PostId';
import { PublishPostInputDTO, PostDTO } from '@application/dtos/PostDTO';
import { PostMapper } from '@application/mappers/PostMapper';
import { NotFoundError } from '@application/errors/ApplicationError';

/**
 * PublishPostUseCase — transitions a draft post to the published state.
 */
export class PublishPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: PublishPostInputDTO): Promise<PostDTO> {
    const postId = PostId.create(dto.id);
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundError('Post', dto.id);
    }

    post.publish(); // domain entity enforces the state-transition rule

    await this.postRepository.save(post);

    return PostMapper.toDTO(post);
  }
}
