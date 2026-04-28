import { v4 as uuidv4 } from 'uuid';
import { IIdGenerator } from '@application/use-cases/CreatePostUseCase';

/**
 * UuidGenerator — infrastructure implementation of IIdGenerator.
 *
 * Wraps the `uuid` library behind the application-layer interface
 * so that use cases remain decoupled from the concrete UUID library.
 */
export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}
