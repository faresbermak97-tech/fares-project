// Rate limiting utility for API routes
// This is a simplified in-memory implementation
// For production, consider using Redis or a database-based solution

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit({
  windowMs = 60 * 60 * 1000, // 1 hour
  max = 5, // limit each IP to 5 requests per windowMs
}: {
  windowMs?: number;
  max?: number;
} = {}) {
  return async (request: Request): Promise<{ success: boolean; resetTime?: number }> => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const now = Date.now();
    const key = `rate_limit_${ip}`;

    // Get existing entry or create a new one
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // Create a new entry if it doesn't exist or has expired
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, entry);
      return { success: true, resetTime: entry.resetTime };
    }

    // Increment the count
    entry.count++;

    // Check if the limit has been exceeded
    if (entry.count > max) {
      return { success: false, resetTime: entry.resetTime };
    }

    // Update the store
    rateLimitStore.set(key, entry);
    return { success: true, resetTime: entry.resetTime };
  };
}

// Cleanup function to remove expired entries
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Schedule cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
