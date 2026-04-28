import { NextResponse } from 'next/server';
import { DomainError } from '@domain/errors/DomainError';
import { ApplicationError, NotFoundError } from '@application/errors/ApplicationError';

/**
 * Serialises a successful payload as a Next.js JSON response.
 */
export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Serialises a created-resource response (201).
 */
export function created<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

/**
 * Maps a caught error to the appropriate HTTP response.
 *
 * Layer rule: HTTP status decisions live here, not in use cases or domain.
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof NotFoundError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
  if (error instanceof DomainError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 422 });
  }
  if (error instanceof ApplicationError) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  console.error('[Unhandled error]', error);
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
}
