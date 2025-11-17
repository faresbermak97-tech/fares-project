/**
* Custom error class for application errors
*/
export class AppError extends Error {
constructor(
message: string,
public statusCode: number = 500,
public isOperational: boolean = true,
public context?: Record<string, unknown>
) {
super(message);
this.name = this.constructor.name;
Error.captureStackTrace(this, this.constructor);
}
}

/**
* Error for validation failures
*/
export class ValidationError extends AppError {
constructor(message: string, context?: Record<string, unknown>) {
super(message, 400, true, context);
}
}

/**
* Error for authentication failures
*/
export class AuthenticationError extends AppError {
constructor(message: string = 'Authentication required') {
super(message, 401, true);
}
}

/**
* Error for authorization failures
*/
export class AuthorizationError extends AppError {
constructor(message: string = 'Access denied') {
super(message, 403, true);
}
}

/**
* Error for resource not found
*/
export class NotFoundError extends AppError {
constructor(resource: string = 'Resource') {
super(`${resource} not found`, 404, true);
}
}

/**
* Error for rate limiting
*/
export class RateLimitError extends AppError {
constructor(message: string = 'Too many requests', context?: Record<string, unknown>) {
super(message, 429, true, context);
}
}
