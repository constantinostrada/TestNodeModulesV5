import { IPostRepository } from '@domain/repositories/IPostRepository';
import { Post } from '@domain/entities/Post';
import { PostId } from '@domain/value-objects/PostId';
import { PostTitle } from '@domain/value-objects/PostTitle';
import { PostContent } from '@domain/value-objects/PostContent';
import { CreatePostInputDTO, PostDTO } from '@application/dtos/PostDTO';
import { PostMapper } from '@application/mappers/PostMapper';

export interface IIdGenerator {
  generate(): string;
}

/**
 * CreatePostUseCase — orchestrates the creation of a new Post.
 *
 * Receives dependencies via constructor injection (no concrete implementations).
 * Returns a PostDTO — never a raw domain entity.
 */
export class CreatePostUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreatePostInputDTO): Promise<PostDTO> {
    const id = PostId.create(this.idGenerator.generate());
    const title = PostTitle.create(dto.title);
    const content = PostContent.create(dto.content);

    const post = Post.create({
      id,
      title,
      content,
      authorId: dto.authorId,
      status: 'draft',
    });

    await this.postRepository.save(post);

    return PostMapper.toDTO(post);
  }
}
