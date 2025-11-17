import { NextResponse } from 'next/server';
import { AppError, ValidationError, RateLimitError } from './errors';
import { logger } from './logger';
import { ZodError } from 'zod';
/**
* Handles API errors and returns appropriate NextResponse
*/
export function handleApiError(
error: unknown,
context: string
): NextResponse {
// Log the error
logger.error(`API Error in ${context}`, error);
// Handle Zod validation errors
if (error instanceof ZodError) {
return NextResponse.json(
{
error: 'Validation failed',
details: error.issues ? error.issues.map(e => ({
field: e.path.join('.'),
message: e.message,
})) : [],
},
{ status: 400 }
);
}
// Handle custom application errors
if (error instanceof AppError) {
return NextResponse.json(
{
error: error.message,
...(error.context && { context: error.context }),
},
{ status: error.statusCode }
);
}
// Handle rate limit errors
if (error instanceof RateLimitError) {
const headers: Record<string, string> = {};

// Use context headers if available
if (error.context && error.context.headers) {
Object.assign(headers, error.context.headers);
}

// Default retry-after if not provided
if (!headers['Retry-After']) {
headers['Retry-After'] = '3600';
}

return NextResponse.json(
{ error: error.message },
{
status: 429,
headers,
}
);
}
// Unknown errors - don't expose details
return NextResponse.json(
{ error: 'Failed to send your message. Please try again later.' },
{ status: 500 }
);
}
/**
* Wraps an API handler with error handling
*/
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
handler: T,
context: string
): T {
return (async (...args: Parameters<T>) => {
try {
return await handler(...args);
} catch (error) {
return handleApiError(error, context);
}
}) as T;
}