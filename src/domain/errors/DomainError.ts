/**
 * DomainError — base class for all domain-layer exceptions.
 *
 * Keeps error semantics inside the domain boundary.
 * Application and interface layers catch this and convert it
 * into the appropriate response format.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    // Maintain correct prototype chain in transpiled code
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
