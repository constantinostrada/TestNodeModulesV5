/**
 * ApplicationError — base class for application-layer exceptions.
 *
 * Distinct from DomainError so that layers can be handled differently
 * at the interface boundary (e.g. 422 vs 500 HTTP status codes).
 */
export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" was not found.`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
