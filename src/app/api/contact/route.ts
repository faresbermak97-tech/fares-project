import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactFormSchema, sanitizeEmailSubject, sanitizeText } from '@/lib/validation';
import { serverEnv } from '@/lib/env';
import { handleApiError, withErrorHandler } from '@/lib/api-error-handler';
import { RateLimitError } from '@/lib/errors';
import { logger } from '@/lib/logger';

// In-memory rate limiting as fallback if Redis is not available
const inMemoryRateLimit: Record<string, { count: number; resetTime: number }> = {};

async function rateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  resetTime: number;
}> {
  // Check if Redis is available (environment variables set)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      // Dynamic import to avoid errors if Redis package is not installed
      const { Redis } = await import('@upstash/redis');
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      const key = `rate_limit:contact:${identifier}`;
      const limit = 5; // 5 requests
      const window = 3600; // 1 hour in seconds

      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, window);
      }

      return {
        success: requests <= limit,
        remaining: Math.max(0, limit - requests),
        resetTime: Date.now() + (window * 1000)
      };
    } catch (error) {
      logger.error('Redis rate limiting failed, falling back to in-memory:', error);
      // Fall back to in-memory rate limiting
    }
  }

  // In-memory rate limiting (fallback)
  const limit = 5; // 5 requests
  const window = 3600; // 1 hour in seconds
  const now = Date.now();
  const windowMs = window * 1000;

  // Initialize or get existing record
  if (!inMemoryRateLimit[identifier]) {
    inMemoryRateLimit[identifier] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  // Reset if window has passed
  if (now > inMemoryRateLimit[identifier].resetTime) {
    inMemoryRateLimit[identifier] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  // Increment counter
  inMemoryRateLimit[identifier].count += 1;

  return {
    success: inMemoryRateLimit[identifier].count <= limit,
    remaining: Math.max(0, limit - inMemoryRateLimit[identifier].count),
    resetTime: inMemoryRateLimit[identifier].resetTime
  };
}

async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
  remaining: number;
}): Promise<void> {
  const { name, email, message, remaining } = data;

  // Additional sanitization
  const safeName = sanitizeText(name);
  const safeMessage = sanitizeText(message);

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: serverEnv.emailUser,
      pass: serverEnv.emailPass,
    },
  });

  // Email options with sanitized data
  const mailOptions = {
    from: serverEnv.emailUser,
    to: serverEnv.emailTo,
    subject: sanitizeEmailSubject(`Contact from ${safeName}`),
    text: `Name: ${safeName}\nEmail: ${email}\n\nMessage:\n${safeMessage}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0 0 10px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 10px;"><strong>Message:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      </div>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);

  // Send a confirmation email to the sender (optional)
  await transporter.sendMail({
    from: serverEnv.emailUser,
    to: email, // Sender's email
    subject: sanitizeEmailSubject('Thank you for contacting Fares Bermak'),
    text: `Hi ${safeName},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

Best regards,
Fares Bermak`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Contacting Me</h2>
        <p>Hi ${safeName},</p>
        <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Fares Bermak</p>
      </div>
    `,
  });
}

async function handlePost(request: NextRequest): Promise<NextResponse> {
  // Get IP address for rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'anonymous';

  logger.info('Contact form submission attempt', { ip });

  // Apply rate limiting
  const { success, remaining, resetTime } = await rateLimit(ip);

  if (!success) {
    const retryAfterSeconds = Math.ceil((resetTime - Date.now()) / 1000);
    throw new RateLimitError('Too many requests. Please try again later.', {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': retryAfterSeconds.toString()
      }
    });
  }

  // Parse request body
  const body = await request.json();

  // Validate with Zod schema
  const validation = contactFormSchema.safeParse(body);

  if (!validation.success) {
    throw validation.error;
  }

  const { name, email, message } = validation.data;

  // Send email
  await sendContactEmail({ name, email, message, remaining });

  logger.info('Contact form submitted successfully', { name, email, ip });

  return NextResponse.json(
    {
      success: true,
      message: 'Your message has been sent successfully!',
      remaining: remaining
    },
    {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': remaining.toString()
      }
    }
  );
}

// Export with error handling wrapper
export const POST = withErrorHandler(handlePost, 'ContactFormSubmission');
