import { ApplicationError } from '@application/errors/ApplicationError';

/**
 * ConflictError — raised when a uniqueness constraint is violated.
 *
 * Maps to HTTP 409 at the interface boundary.
 */
export class ConflictError extends ApplicationError {
  constructor(resource: string, field: string, value: string) {
    super(`${resource} with ${field} "${value}" already exists.`);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
