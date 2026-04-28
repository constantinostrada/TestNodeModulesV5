import { IPostRepository } from '@domain/repositories/IPostRepository';
import { PostId } from '@domain/value-objects/PostId';
import { NotFoundError } from '@application/errors/ApplicationError';

export interface DeletePostInputDTO {
  id: string;
}

/**
 * DeletePostUseCase — removes a post from the system after confirming it exists.
 */
export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(dto: DeletePostInputDTO): Promise<void> {
    const postId = PostId.create(dto.id);
    const exists = await this.postRepository.exists(postId);

    if (!exists) {
      throw new NotFoundError('Post', dto.id);
    }

    await this.postRepository.delete(postId);
  }
}
